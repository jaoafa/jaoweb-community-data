import express, { json as expressJson } from 'express'
import cors from 'cors'
import EndPoint from './lib/EndPoint'
import GetRootEndPoint from './endpoints/root'
import GetCitiesEndPoint from './endpoints/cities'
import GetRankingPeriodMatchEndPoint from './endpoints/ranking/periodmatch'
import GetCitiesHistoryEndPoint from './endpoints/cities/_id/history'

const app = express()
app.use(expressJson())
app.use(cors())

const endpoints: EndPoint[] = [
  new GetRootEndPoint(app),
  new GetCitiesEndPoint(app),
  new GetRankingPeriodMatchEndPoint(app),
  new GetCitiesHistoryEndPoint(app),
]

for (const endpoint of endpoints) {
  endpoint.register()
}

module.exports = {
  path: '/api',
  handler: app,
}
