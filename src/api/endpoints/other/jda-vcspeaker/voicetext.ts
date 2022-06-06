import { Express, Request, Response } from 'express'
import axios from 'axios'
import EndPoint from '~/api/lib/EndPoint'
import loadConfig from '~/api/lib/loadConfig'

interface VoiceTextParam {
  text: string
  speaker: string
  emotion?: string
  emotionLevel?: number
  pitch?: number
  speed?: number
}

/**
 * GET /api/other/jda-vcspeaker/voicetext
 *
 * VoiceTextから音声ファイルを取得して返す
 */
export default class GetJdaVcSpeakerVoiceText extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/other/jda-vcspeaker/voicetext')
  }

  async handle(req: Request, res: Response): Promise<void> {
    if (!req.query.text || !req.query.speaker) {
      res.status(400).send('Bad Request')
      return
    }

    const text =
      'これはjao Minecraft Server Data での JDA-VCSpeaker デフォルトパラメーターのデモ音声です。' +
      req.query.text
    const speaker = req.query.speaker as string
    const speed = Number(req.query.speed)
    const pitch = Number(req.query.pitch)
    const emotion = req.query.emotion as string
    const emotionLevel = Number(req.query.emotionLevel)

    if (
      !this.validate({
        text,
        speaker,
        speed,
        pitch,
        emotion,
        emotionLevel,
      })
    ) {
      res.status(400).send('Validation Error')
      return
    }

    const config = loadConfig()
    let response
    try {
      const params = new URLSearchParams()
      params.append('text', text)
      params.append('speaker', speaker)
      if (speed) {
        params.append('speed', String(speed))
      }
      if (pitch) {
        params.append('pitch', String(pitch))
      }
      if (emotion) {
        params.append('emotion', emotion)
      }
      if (emotionLevel) {
        params.append('emotionLevel', String(emotionLevel))
      }
      params.append('volume', '50')

      response = await axios.post('https://api.voicetext.jp/v1/tts', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: config.voiceTextApiKey,
          password: '',
        },
        responseType: 'arraybuffer',
      })
    } catch (err) {
      res.status(500).send('Internal Server Error')
      return
    }

    res.send(response?.data)
  }

  protected validate(param: VoiceTextParam): boolean {
    // text: 必須。 Unicode で 200 文字以内。
    if (!param.text) {
      return false
    }
    if (typeof param.text !== 'string') {
      return false
    }
    if (param.text.length > 200) {
      return false
    }

    // speaker: 後述の「話者一覧」の中のいずれかを指定。必須。
    if (!param.speaker) {
      return false
    }
    if (typeof param.speaker !== 'string') {
      return false
    }
    const speakers = ['show', 'haruka', 'hikari', 'takeru', 'santa', 'bear']
    if (!speakers.includes(param.speaker)) {
      return false
    }

    // emotion: 話者 haruka、hikari、takeru、santa、bear にのみ使用できます。
    if (param.emotion && typeof param.emotion !== 'string') {
      return false
    }
    if (
      param.emotion &&
      param.speaker !== 'haruka' &&
      param.speaker !== 'hikari' &&
      param.speaker !== 'takeru' &&
      param.speaker !== 'santa' &&
      param.speaker !== 'bear'
    ) {
      return false
    }
    const validEmotions = ['happiness', 'anger', 'sadness']
    if (param.emotion && !validEmotions.includes(param.emotion)) {
      return false
    }

    // emotion_level: 1〜4を指定できます。
    if (param.emotionLevel && typeof param.emotionLevel !== 'number') {
      return false
    }
    if (
      param.emotionLevel &&
      (param.emotionLevel < 1 || param.emotionLevel > 4)
    ) {
      return false
    }

    // pitch: 50から200(%)まで。
    if (param.pitch && typeof param.pitch !== 'number') {
      return false
    }
    if (param.pitch && (param.pitch < 50 || param.pitch > 200)) {
      return false
    }

    // speed: 50から400(%)まで。
    if (param.speed && typeof param.speed !== 'number') {
      return false
    }
    if (param.speed && (param.speed < 50 || param.speed > 400)) {
      return false
    }

    return true
  }
}
