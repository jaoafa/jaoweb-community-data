export interface DefaultParam {
  userId: number
  emotion: string
  speaker: string
  emotionLevel: string
  pitch: number
  speed: number
}

export interface JdaVcSpeakerDefaultParamsResult {
  status: boolean
  code: number
  data: DefaultParam[]
}
