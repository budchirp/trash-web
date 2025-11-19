import { Trash } from '@trash-kit/core'

export const trash = new Trash({
  apiUrl: process.env.API_URL || 'http://localhost:8080'
})
