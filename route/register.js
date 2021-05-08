import { Router } from 'express'
import auth from '../controller/register.js'
import { isLoggedIn, isLoggedOut } from '../middleware/authenticate.js'
const route = Router()

route.get('/signup', isLoggedOut, auth.getSignup)

route.post('/signup', isLoggedOut, auth.postSignup)

route.get('/signin', isLoggedOut, auth.getSignin)

route.post('/signin', isLoggedOut, auth.postSignin)

route.get('/logout', isLoggedIn, auth.getLogout)

export { route }