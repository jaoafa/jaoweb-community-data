export interface PeriodMatchPlayer {
  mcid: string
  uuid: string
}

export default interface PeriodMatchResult {
  id: number
  rank: number
  player: PeriodMatchPlayer
  success: number
  failure: number
  category: number // match_time
  calc: number
  start_time: string
  end_time: string
}
