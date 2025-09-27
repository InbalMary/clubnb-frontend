const { DEV, VITE_LOCAL } = import.meta.env

import { msgService as local } from './msg.service.local'
import { msgService as remote } from './msg.service.remote.js'

export const msgService = (VITE_LOCAL === 'true') ? local : remote

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.msgService = msgService
