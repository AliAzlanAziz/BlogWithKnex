import { Router } from 'express'
import blog from '../controller/blog.js'
const route = Router()

route.get('/dashboard', blog.getDashboard)

export { route }