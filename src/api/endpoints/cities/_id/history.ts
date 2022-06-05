import { Express, Request, Response } from 'express'
import EndPoint from '~/api/lib/EndPoint'
import {
  getChangeCornersRequest,
  getChangeInformationRequest,
  getNewCityRequests,
} from '~/api/lib/get-city-requests'
import getDB from '~/api/lib/getDB'
import { CityChange } from '~/api/models/city-change'

/**
 * GET /api/cities/:id/history
 *
 * 自治体変更履歴 (2020/05/09以前のデータはない)
 */
export default class GetCitiesHistoryEndPoint extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/cities/:id/history')
  }

  async handle(_req: Request, res: Response): Promise<void> {
    if (!_req.params.id) {
      res.status(400).send('Invalid request.')
      return
    }
    const cityId = Number(_req.params.id)
    if (!Number.isInteger(cityId)) {
      res.status(400).send('Invalid request.')
      return
    }

    const conn = await getDB()
    if (!conn) {
      res.status(500).send('DB connection failed.')
      return
    }

    const newCities = await getNewCityRequests(conn, cityId)
    const changeInformation = await getChangeInformationRequest(conn, cityId)
    const changeCorners = await getChangeCornersRequest(conn, cityId)

    conn.destroy()

    const results: CityChange[] = []
    newCities
      .filter((city) => city.cityId === cityId)
      .forEach((newCity) => {
        results.push({
          type: 'new',
          data: newCity,
          pending: newCity.pending,
          createdAt: newCity.createdAt,
        })
      })
    changeInformation
      .filter((change) => change.cityId === cityId)
      .forEach((change) => {
        results.push({
          type: 'change-info',
          data: change,
          pending: change.pending,
          createdAt: change.createdAt,
        })
      })
    changeCorners
      .filter((change) => change.cityId === cityId)
      .forEach((change) => {
        results.push({
          type: 'change-corners',
          data: change,
          pending: change.pending,
          createdAt: change.createdAt,
        })
      })
    res.json(results)
  }
}
