import { Express, Request, Response, NextFunction } from 'express'
import { isVaildreCAPTCHA } from './recaptcha'

type Method =
  | 'all'
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'

export default abstract class EndPoint {
  app: Express
  method: Method
  path: string

  constructor(app: Express, method: Method, path: string) {
    this.app = app
    this.method = method
    this.path = path
  }

  abstract handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>

  register() {
    this.app[this.method](this.path, (req, res, next) => {
      if (
        !req.headers['x-recaptcha-token'] ||
        typeof req.headers['x-recaptcha-token'] !== 'string'
      ) {
        res.status(400).send('reCAPTCHA token is required.')
        return
      }
      if (!isVaildreCAPTCHA(req.headers['x-recaptcha-token'])) {
        res.status(400).send('reCAPTCHA failed.')
        return
      }
      this.handle(req, res, next).catch((err) => {
        next(err)
      })
    })
    // eslint-disable-next-line no-console
    console.log('Registered:', this.method, this.path)
  }
}
