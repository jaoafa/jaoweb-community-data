export interface Corner {
  id: number
  x: number
  z: number
}

export default interface City {
  id: number
  name: string
  nameRuby: string
  regionName: string
  owner: {
    mcid: string
    uuid: string
    discordId: string
  }
  summary: string
  nameOrigin: string
  corners: Corner[]
  createdAt: string
  updatedAt: string
}
