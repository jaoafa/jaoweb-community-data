import { Express, Request, Response } from 'express'
import axios from 'axios'
import EndPoint from '~/api/lib/EndPoint'
import loadConfig from '~/api/lib/loadConfig'
import {
  Api659RecordResponse,
  Api659Result,
  Api659UserResponse,
} from '~/api/models/659-api-result'

/**
 * GET /api/ranking/659/records
 *
 * 659記録一覧
 */
export default class GetRanking659RecordsEndPoint extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/ranking/659/records/:categoryId')
  }

  async handle(req: Request, res: Response): Promise<void> {
    const categoryId = Number(req.params.categoryId)
    if (Number.isNaN(categoryId)) {
      res.status(400).send('Invalid request.')
      return
    }

    const config = loadConfig()
    const response = await axios.get(config.apiUrl['659'])
    const data = response.data as Api659Result

    if (!data.status) {
      res.status(500).send('API error.')
      return
    }

    const users: { [key: string]: Api659UserResponse } = data.users.reduce(
      (acc, user) => {
        acc[user.user_id] = {
          userId: user.user_id,
          userName: user.username,
          discriminator: user.discriminator,
          avatarUrl: user.avatar_url,
        } as Api659UserResponse
        return acc
      },
      {} as { [key: string]: Api659UserResponse }
    )
    const results: Api659RecordResponse[] = []
    let rank = 0
    const oldDiff = Number.NaN
    for (const record of data.records
      .filter((record) => record.category_category_id === categoryId.toString())
      .sort((a, b) => Number(b.message_id) - Number(a.message_id))) {
      rank++
      if (!Number.isNaN(oldDiff) && Number(record.diff) === oldDiff) {
        rank--
      }

      results.push({
        rank,
        messageId: record.message_id,
        rawtext: record.rawtext,
        diff: Number(record.diff),
        user: users[record.user_id],
        postedAt: record.posted_at,
        createdAt: record.created_at,
      })
    }
    res.json(results)
  }
}
