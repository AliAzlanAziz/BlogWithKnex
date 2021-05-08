import { Router } from 'express'
import blog from '../controller/blog.js'
import { isLoggedIn } from '../middleware/authenticate.js'
import { isBlogOwner, isCommentOwner } from '../middleware/authenticateowner.js'
const route = Router()

//dashboard
route.get('/dashboard', isLoggedIn, blog.getDashboard)

//blogs of logged in user only
route.get('/myblogs', isLoggedIn, blog.getMyBlogs)

//blog of logged in user that he may have created in past
route.get('/myblogs/:id', isLoggedIn, isBlogOwner, blog.getMyBlog)

//logged in user can create blogs
route.get('/create', isLoggedIn, blog.getCreateBlog)

//post method of create blogs
route.post('/create', isLoggedIn, blog.postCreateBlog)

//logged in user can delete his/her blogs only
route.get('/myblogs/delete/:id', isLoggedIn, isBlogOwner, blog.getDeleteBlog)

//logged in user can update his/her blogs only
route.get('/myblogs/update/:id', isLoggedIn, isBlogOwner, blog.getUpdateBlog)

//put method of update
route.put('/myblogs/update/:id', isLoggedIn, isBlogOwner, blog.putUpdateBlog)

//user can see other blogs from his newsfeed
route.get('/feed/:id', isLoggedIn, blog.getOthersBlog)

//user can react to blogs
route.put('/react/:id', isLoggedIn, blog.putReact)

//post method of commments
route.post('/comment/:id', isLoggedIn, blog.postComment)

//user can delete only his/her comments
route.get('/comment/:id/delete/:cmntid', isLoggedIn, isCommentOwner, blog.getDeleteComment)

//get page of update comment
route.get('/comment/:id/update/:cmntid', isLoggedIn, isCommentOwner, blog.getUpdateComment)

//user can update only his/her comments
route.put('/comment/:id/update/:cmntid', isLoggedIn, isCommentOwner, blog.putComment)

export { route }