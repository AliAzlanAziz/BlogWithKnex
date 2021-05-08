import { connection } from '../config/configdb.js'

async function isBlogOwner(req, res, next){
    const id = req.params.id
    const blog = await connection.select('userId').table('blog').where('blogId', id) 
    if(blog[0].userId===req.user.userId){
        return next()
    } else {
        req.flash('error', 'Error 403! Unauthorized Access denied')
        return res.redirect('/bwk/blog/myblogs')
    }
}

async function isCommentOwner(req, res, next){
    const id = req.params.id
    const cmntId = req.params.cmntid
    const comment = await connection.select('userId').table('comments').where('cmntId', cmntId) 
    if(comment[0].userId===req.user.userId){
        return next()
    } else {
        req.flash('error', 'Error 403! Unauthorized Access denied')
        return res.redirect('/bwk/blog/feed/'+id)
    }
}

export { isBlogOwner, isCommentOwner }