import { Connection, createConnection } from 'mysql2/promise'
import loadConfig from './loadConfig'

export default async function (): Promise<Connection | null> {
  try {
    const config = loadConfig()
    const connection = await createConnection({
      host: config.jaomain.db.host,
      port: config.jaomain.db.port,
      user: config.jaomain.db.user,
      password: config.jaomain.db.password,
      database: config.jaomain.db.database,
      timezone: '+09:00',
    })
    await connection.beginTransaction()

    return connection
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return null
  }
}
