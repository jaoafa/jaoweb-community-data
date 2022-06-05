import axios from 'axios'
import loadConfig from './loadConfig'

export function isVaildreCAPTCHA(token: string): Promise<boolean> {
  const config = loadConfig()
  return new Promise<boolean>((resolve, reject) => {
    axios
      .post(
        `https://recaptcha.google.com/recaptcha/api/siteverify?secret=${config.recaptcha.secret}&response=${token}`
      )
      .then((response) => {
        resolve(response.data.success)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
