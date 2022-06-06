import fs from 'fs'
import { Express, Request, Response } from 'express'
import axios from 'axios'
import EndPoint from '~/api/lib/EndPoint'
import loadConfig from '~/api/lib/loadConfig'
import { DiscordUser } from '~/api/models/discord-users'

/**
 * GET /api/other/discord-users
 *
 * jMS Gamers Club のユーザーリストを取得
 */
export default class GetDiscordUsers extends EndPoint {
  constructor(app: Express) {
    super(app, 'get', '/other/discord-users')
  }

  async handle(_req: Request, res: Response): Promise<void> {
    if (fs.existsSync('discord-users.json')) {
      const usersJson = JSON.parse(
        fs.readFileSync('discord-users.json', 'utf8')
      )
      if (usersJson.time > Date.now() - 1000 * 60 * 60) {
        res.json(usersJson.users)
        return
      }
    }
    const config = loadConfig()
    const response = await axios.get(
      `https://discord.com/api/guilds/${config.discord.guildId}/members?limit=1000`,
      {
        headers: {
          Authorization: `Bot ${config.discord.token}`,
        },
      }
    )
    const data = response.data as DiscordUser[]
    fs.writeFileSync(
      'discord-users.json',
      JSON.stringify({ users: data, time: Date.now() })
    )

    res.json(data)
  }
}
