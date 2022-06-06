import { Express, Request, Response } from 'express'
import EndPoint from '~/api/lib/EndPoint'
import getDB from '~/api/lib/getDB'
import { groups } from '~/api/models/PermissionGroup'

/**
 * GET /api/users/perm-groups
 *
 * 権限グループリスト
 */
export default class GetUsersPermGroups extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/users/perm-groups')
  }

  async handle(_req: Request, res: Response): Promise<void> {
    const conn = await getDB()
    if (!conn) {
      res.status(500).send('DB connection failed.')
      return
    }
    this.handleFetchGroups(res)
  }

  handleFetchGroups(res: Response): void {
    // Defaultは対象としない
    res.json(groups)
  }
}
