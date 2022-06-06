import express, { json as expressJson } from 'express'
import cors from 'cors'
import EndPoint from './lib/EndPoint'
import GetRootEndPoint from './endpoints/root'
import GetCitiesEndPoint from './endpoints/cities'
import GetRankingPeriodMatchEndPoint from './endpoints/ranking/periodmatch'
import GetCitiesHistoryEndPoint from './endpoints/cities/_id/history'
import GetRanking659CategoryEndPoint from './endpoints/ranking/659/category'
import GetRanking659RecordsEndPoint from './endpoints/ranking/659/records'
import GetUsersPermGroups from './endpoints/users/perm-groups/get-groups'
import GetUsersPermGroupPlayers from './endpoints/users/perm-groups/get-players'

const app = express()
app.use(expressJson())
app.use(cors())

const endpoints: EndPoint[] = [
  new GetRootEndPoint(app),
  new GetCitiesEndPoint(app),
  new GetRankingPeriodMatchEndPoint(app),
  new GetCitiesHistoryEndPoint(app),
  new GetRanking659CategoryEndPoint(app),
  new GetRanking659RecordsEndPoint(app),
  new GetUsersPermGroups(app),
  new GetUsersPermGroupPlayers(app),
]

for (const endpoint of endpoints) {
  endpoint.register()
}

module.exports = {
  path: '/api',
  handler: app,
}
