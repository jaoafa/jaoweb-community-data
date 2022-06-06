import { Express, Request, Response } from 'express'
import axios from 'axios'
import EndPoint from '~/api/lib/EndPoint'
import loadConfig from '~/api/lib/loadConfig'
import {
  DefaultParam,
  JdaVcSpeakerDefaultParamsResult,
} from '~/api/models/jda-vcspeaker-result'

/**
 * GET /api/other/jda-vcspeaker/default-param
 *
 * JDA-VCSpeakerのユーザーデフォルトパラメータ一覧
 */
export default class GetJdaVcSpeakerDefaultParams extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/other/jda-vcspeaker/default-param')
  }

  async handle(_req: Request, res: Response): Promise<void> {
    const config = loadConfig()
    const response = await axios.get(
      `${config.apiUrl['jda-vcspeaker']}?action=get-default-params`
    )
    const data = response.data as JdaVcSpeakerDefaultParamsResult

    if (!data.status) {
      res.status(500).send('API error.')
      return
    }

    res.json(data.data as DefaultParam[])
  }
}
