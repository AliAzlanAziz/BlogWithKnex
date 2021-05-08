import { Router } from 'express'
import basic from '../controller/basic.js'
import { isLoggedOut } from '../middleware/authenticate.js'
const route = Router()

route.get(['/', '/home'], isLoggedOut, basic.getHome)

export { route }