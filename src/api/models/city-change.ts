/*
  自治体の情報変更履歴項目

  自治体新規
    - cityId
    - cityName
    - cityKana
    - regionName
    - summary
    - nameOrigin
    - corners

  自治体範囲変更
    - corners
      - old
      - new

  自治体情報変更
    - cityId
    - cityName (undefinable)
      - old
      - new
    - cityKana (undefinable)
      - old
      - new
    - regionName (undefinable)
      - old
      - new
    - summary (undefinable)
      - old
      - new
    - nameOrigin (undefinable)
      - old
      - new

*/

import { Corner } from './city'

interface BaseCityChange {
  cityId: number
  pending: boolean
  createdAt: string
}

interface ChangeOldNew<T> {
  old: T
  new: T
}

export interface NewCityRequest extends BaseCityChange {
  cityName: string
  cityKana: string
  regionName: string
  summary: string
  nameOrigin: string
  corners: Corner[]
}

export interface ChangeInformationRequest extends BaseCityChange {
  cityName?: ChangeOldNew<string>
  cityKana?: ChangeOldNew<string>
  regionName?: ChangeOldNew<string>
  summary?: ChangeOldNew<string>
  nameOrigin?: ChangeOldNew<string>
}

export interface ChangeCornersRequest extends BaseCityChange {
  corners: ChangeOldNew<Corner[]>
}

export interface CityChange {
  type: 'new' | 'change-info' | 'change-corners'
  data: NewCityRequest | ChangeInformationRequest | ChangeCornersRequest
  pending: boolean
  createdAt: string
}
