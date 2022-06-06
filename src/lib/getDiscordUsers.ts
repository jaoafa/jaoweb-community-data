import { DiscordUser } from '../api/models/discord-users'

export default function getDiscordUsers(
  $recaptcha: any,
  $axios: any
): Promise<DiscordUser[]> {
  return new Promise<DiscordUser[]>((resolve, reject) => {
    $recaptcha.execute('login').then((token: string) => {
      $axios
        .get(`/other/discord-users`, {
          headers: {
            'X-RECAPTCHA-TOKEN': token,
          },
        })
        .then((res: any) => {
          resolve(res.data)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  })
}
