import { Router } from 'express'
import basic from '../controller/basic.js'
const route = Router()

route.get(['/', '/home'], basic.getHome)

export { route }