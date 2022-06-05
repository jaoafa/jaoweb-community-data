import { Express, Request, Response } from 'express'
import { RowDataPacket } from 'mysql2/promise'
import EndPoint from '~/api/lib/EndPoint'
import getDB from '~/api/lib/getDB'
import PeriodMatchResult from '~/api/models/periodmatch'

/**
 * GET /api/ranking/periodmatch
 *
 * ピリオドマッチ結果一覧
 */
export default class GetRankingPeriodMatchEndPoint extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/ranking/periodmatch/:category')
  }

  async handle(req: Request, res: Response): Promise<void> {
    const rankingSecs = [-1, 0, 1, 10, 20, 30, 60, 100, 300]

    if (!rankingSecs.includes(Number(req.params.category))) {
      res.status(400).send('Invalid category.')
      return
    }

    const conn = await getDB()
    if (!conn) {
      res.status(500).send('DB connection failed.')
      return
    }

    const [rows] = await conn.query<RowDataPacket[]>(
      'SELECT *, (success*(success/(success+failure))-failure)/calc_match_time AS calc FROM periodmatch2 WHERE match_time = ? ORDER BY calc DESC;',
      [req.params.category]
    )
    const results: PeriodMatchResult[] = []
    let rank = 0
    let oldCalc = Number.NaN
    for (const row of rows) {
      if (!row.status) {
        continue
      }

      rank++
      if (!Number.isNaN(oldCalc) && row.calc === oldCalc) {
        rank--
      }

      results.push({
        id: row.id,
        rank,
        player: {
          mcid: row.player,
          uuid: row.uuid,
        },
        success: row.success,
        failure: row.failure,
        category: row.match_time,
        calc: row.calc,
        start_time: row.start_time,
        end_time: row.end_time,
      })
      oldCalc = row.calc
    }

    conn.destroy()

    res.json(results)
  }
}
