import { Express, Request, Response } from 'express'
import axios from 'axios'
import EndPoint from '~/api/lib/EndPoint'
import loadConfig from '~/api/lib/loadConfig'
import {
  Api659CategoryResponse,
  Api659Result,
} from '~/api/models/659-api-result'

/**
 * GET /api/ranking/659/category
 *
 * 659カテゴリ一覧
 */
export default class GetRanking659CategoryEndPoint extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/ranking/659/category')
  }

  async handle(_req: Request, res: Response): Promise<void> {
    const config = loadConfig()
    const response = await axios.get(config.apiUrl['659'])
    const data = response.data as Api659Result

    if (!data.status) {
      res.status(500).send('API error.')
      return
    }

    const categories: Api659CategoryResponse[] = data.categories.map(
      (category) => {
        return {
          categoryId: Number(category.category_id),
          name: category.name,
          text: category.text,
          description: category.description,
          base: category.base,
        }
      }
    )
    res.json(categories)
  }
}
