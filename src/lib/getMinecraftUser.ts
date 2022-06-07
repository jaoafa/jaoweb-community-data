import axios from 'axios'

export interface MinecraftUser {
  mcid: string
  uuid: string
  permission: string
  lastlogin: string
  discordid: string
  voteCount: number
}

export interface MinecraftUserResponse {
  status: boolean
  code: number
  version: string
  data: MinecraftUser
}

export default function getMinecraftUser(
  $recaptcha: any,
  uuid: string
): Promise<MinecraftUser> {
  return new Promise<MinecraftUser>((resolve, reject) => {
    $recaptcha.execute('login').then((token: string) => {
      axios
        .get(`https://api.jaoafa.com/users/${uuid}`, {
          params: {
            raterecatpcha: token,
          },
        })
        .then((res: { data: MinecraftUserResponse }) => {
          resolve(res.data.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  })
}
