import { Router } from 'express'
import auth from '../controller/register.js'
const route = Router()

route.get('/signup', auth.getSignup)

route.get('/signin', auth.getSignin)

export { route }