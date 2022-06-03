import { Express, Request, Response } from 'express'
import { RowDataPacket } from 'mysql2/promise'
import EndPoint from '~/api/lib/EndPoint'
import getDB from '~/api/lib/getDB'
import City, { Corner } from '~/api/models/city'

/**
 * GET /api/cities
 *
 * 登録済み自治体一覧
 */
export default class GetCitiesEndPoint extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/cities')
  }

  async handle(_req: Request, res: Response): Promise<void> {
    const conn = await getDB()
    if (!conn) {
      res.status(500).send('DB connection failed.')
      return
    }

    const [rows] = await conn.query<RowDataPacket[]>('SELECT * FROM cities')
    const results: City[] = rows.map((row) => {
      const corners = JSON.parse(row.corners) as Corner[]
      return {
        id: row.id,
        name: row.name,
        nameRuby: row.namekana,
        regionName: row.regionname,
        owner: {
          mcid: row.player,
          uuid: row.uuid,
          discordId: row.discord_userid,
        },
        summary: row.summary,
        nameOrigin: row.name_origin,
        corners,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }
    })

    res.json(results)
  }
}
