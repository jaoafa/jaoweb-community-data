import fs from 'fs'

interface ConfigStructure {
  jaomain: {
    db: {
      host: string
      port: number
      user: string
      password: string
      database: string
    }
  }
  apiUrl: {
    '659': string
    'jda-vcspeaker': string
  }
  recaptcha: {
    key: string
    secret: string
  }
  discord: {
    token: string
    guildId: string
  }
  voiceTextApiKey: string
}

export default function (): ConfigStructure {
  if (!fs.existsSync('config.json')) {
    throw new Error('config.json is not found.')
  }
  return JSON.parse(fs.readFileSync('config.json', 'utf-8'))
}
