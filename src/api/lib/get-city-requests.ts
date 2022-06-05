import { RowDataPacket } from 'mysql2'
import { Connection } from 'mysql2/promise'
import { Corner } from '../models/city'
import {
  ChangeCornersRequest,
  ChangeInformationRequest,
  NewCityRequest,
} from '../models/city-change'

export async function getNewCityRequests(
  conn: Connection,
  id: number
): Promise<NewCityRequest[]> {
  const [rows] = await conn.query<RowDataPacket[]>(
    'SELECT * FROM cities_new_waiting WHERE city_id = ?',
    [id]
  )
  return rows.map((row) => {
    const corners = JSON.parse(row.corners) as Corner[]
    return {
      cityId: row.city_id,
      pending: row.status === 0,
      cityName: row.name,
      cityKana: row.namekana,
      regionName: row.regionname,
      summary: row.summary,
      nameOrigin: row.name_origin,
      corners,
      createdAt: row.created_at,
    } as NewCityRequest
  })
}

export async function getChangeInformationRequest(
  conn: Connection,
  id: number
): Promise<ChangeInformationRequest[]> {
  const [rows] = await conn.query<RowDataPacket[]>(
    'SELECT * FROM cities_other_waiting WHERE cities_id = ?',
    [id]
  )
  return rows.map((row) => {
    return {
      cityId: row.cities_id,
      pending: row.status === 0,
      cityName:
        row.name_old && row.name_new
          ? {
              old: row.name_old,
              new: row.name_new,
            }
          : undefined,
      cityKana:
        row.namekana_old && row.namekana_new
          ? {
              old: row.namekana_old,
              new: row.namekana_new,
            }
          : undefined,
      regionName:
        row.regionname_old && row.regionname_new
          ? {
              old: row.regionname_old,
              new: row.regionname_new,
            }
          : undefined,
      summary:
        row.summary_old && row.summary_new
          ? {
              old: row.summary_old,
              new: row.summary_new,
            }
          : undefined,
      nameOrigin:
        row.name_origin_old && row.name_origin_new
          ? {
              old: row.name_origin_old,
              new: row.name_origin_new,
            }
          : undefined,
      createdAt: row.created_at,
    } as ChangeInformationRequest
  })
}

export async function getChangeCornersRequest(
  conn: Connection,
  id: number
): Promise<ChangeCornersRequest[]> {
  const [rows] = await conn.query<RowDataPacket[]>(
    'SELECT * FROM cities_corners_waiting WHERE cities_id = ?',
    [id]
  )
  return rows.map((row) => {
    return {
      cityId: row.cities_id,
      pending: row.status === 0,
      corners: {
        old: JSON.parse(row.corners_old) as Corner[],
        new: JSON.parse(row.corners_new) as Corner[],
      },
      createdAt: row.created_at,
    } as ChangeCornersRequest
  })
}
