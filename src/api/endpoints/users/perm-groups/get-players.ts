import { Express, Request, Response } from 'express'
import { Connection, RowDataPacket } from 'mysql2/promise'
import EndPoint from '~/api/lib/EndPoint'
import getDB from '~/api/lib/getDB'
import {
  PermissionGroupKey,
  groups,
  PermissionPlayer,
} from '~/api/models/PermissionGroup'

/**
 * GET /api/users/perm-groups/:group
 *
 * 権限グループ別プレイヤーリスト
 */
export default class GetUsersPermGroupPlayers extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/users/perm-groups/:group')
  }

  async handle(req: Request, res: Response): Promise<void> {
    const conn = await getDB()
    if (!conn) {
      res.status(500).send('DB connection failed.')
      return
    }
    await this.handleFetchPlayers(req, res, conn)
  }

  async handleFetchPlayers(
    req: Request,
    res: Response,
    conn: Connection
  ): Promise<void> {
    const paramGroup: PermissionGroupKey = req.params
      .group as PermissionGroupKey
    if (!groups.some((g) => g.key === paramGroup)) {
      res.status(400).send('Invalid group.')
      return
    }
    const group: Exclude<PermissionGroupKey, 'limited-verified'> =
      paramGroup !== 'limited-verified' ? paramGroup : 'verified'

    const sql =
      paramGroup !== 'limited-verified'
        ? 'SELECT * FROM permissions WHERE permission = ? AND expire_at IS NULL'
        : 'SELECT * FROM permissions WHERE permission = ? AND expire_at IS NOT NULL'

    const [rows] = await conn.query<RowDataPacket[]>(sql, [group])
    res.json(rows as PermissionPlayer[])
  }
}
