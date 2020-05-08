import axios from 'axios'
import config from '../config'

const client = axios.create({
  baseURL: 'https://scoreform.web.app',
})

config.env === 'production'

export function solve(qid: number, flag: string) {
  return client.post('/answer', { q: qid, flag })
}
