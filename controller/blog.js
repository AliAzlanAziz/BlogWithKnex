import { connection } from '../config/configdb.js'
import { generateId } from '../function/generateid.js'

export default {
    //user dashboard
    getDashboard: async (req, res, next)=>{
        const blogs = await connection('blog')
        .select('blogId', 'title', 'image', 'blogtime', 'descript', 'fname', 'lname')
        .join('users', 'blog.userId', 'users.userId')
        .where('blog.userId', '<>', req.user.userId)
        .andWhere('privacy', 'public')
        .orderBy('blogtime', 'desc')

        return res.render('../views/blog/dashboard', { blogs: blogs })
    },

    //get user's all blogs
    getMyBlogs: async (req, res, next)=>{
        const myblogs = await connection('blog')
        .select('blogId', 'title', 'image', 'blogtime', 'privacy', 'descript', 'fname', 'lname')
        .join('users', 'blog.userId', 'users.userId')
        .where('blog.userId', req.user.userId)
        .orderBy('blogtime')

        return res.render('../views/blog/myblogs', { blogs: myblogs })
    },

    //get user's particular blog by id
    getMyBlog: async (req, res, next)=>{
        const id = req.params.id
        const blog = await connection('blog')
        .select('blog.blogId', 'title', 'image', 'blogtime', 'privacy', 'descript')
        .where('blog.blogId', id)

        const comments = await connection('comments')
        .select('cmntId', 'comments.userId', 'cmnt', 'cmnttime', 'fname', 'lname')
        .join('users', 'comments.userId', 'users.userId')
        .where('comments.blogId', id)

        const count = await connection('react')
        .count({ count: 'blogId' })
        .where('blogId', id)
        .whereNotNull('reaction')

        const react = await connection('react')
        .select('reaction')
        .where('blogId', id)
        .andWhere('userId', req.user.userId)
        .whereNotNull('reaction')

        if(blog.length){
            return res.render('../views/blog/myblog', { blog: blog[0], comments: comments, count: count[0], react: react[0] })
        }else{
            req.flash('error', 'Error 404! Page not found')
            return res.redirect('/bwk/blog/myblogs')
        }
    },

    //logged in user can create blog
    getCreateBlog: (req, res, next)=>{
        return res.render('../views/blog/createblog')
    },

    //post method of create blog
    postCreateBlog: async (req, res, next)=>{
        const blog = {
            blogId:     await generateId(),
            userId:     req.user.userId,
            title:      req.body.title,
            image:      null,
            blogtime:   new Date(),
            privacy:    req.body.privacy,
            descript:   req.body.descript
        }

        await connection('blog')
        .insert(blog)
        .then(console.log("Blog Inserted"))
        .catch((err)=>console.log(err))
        
        return res.redirect('/bwk/blog/dashboard')
    },

    //logged in user can delete his/her blog 
    getDeleteBlog: async (req, res, next)=>{
        const id = req.params.id
        await connection('blog')
        .delete()
        .where('blogId', id)
        
        return res.redirect('/bwk/blog/myblogs')
    },
    
    //logged in user can update his/her blog
    getUpdateBlog: async (req, res, next)=>{
        const id = req.params.id
        const blog = await connection('blog')
        .select('blogId', 'title', 'image', 'blogtime', 'privacy', 'descript')
        .where('blogId', id)

        return res.render('../views/blog/updateblog', { blog: blog[0] })
    },

    //put method of update blog
    putUpdateBlog: async (req, res, next)=>{
        const id = req.params.id
        const blog = {
            title:      req.body.title,
            image:      null,
            blogtime:   new Date(),
            privacy:    req.body.privacy,
            descript:   req.body.descript
        }

        await connection('blog')
        .update(blog)
        .where('blogId', id)
        .then(console.log("Blog Updated"))
        .catch((err)=>console.log(err))
        
        return res.redirect('/bwk/blog/dashboard')
    },

    //user can see other blogs from his newsfeed
    getOthersBlog: async (req, res, next)=>{
        const id = req.params.id
        const blog = await connection('blog')
        .select('blog.blogId', 'title', 'image', 'blogtime', 'descript', 'fname', 'lname')
        .join('users', 'blog.userId', 'users.userId')
        .where('blog.blogId', id)

        let comments = await connection('comments')
        .select('cmntId', 'comments.userId', 'cmnt', 'cmnttime', 'fname', 'lname')
        .join('users', 'comments.userId', 'users.userId')
        .where('comments.blogId', id)

        if(blog.length){
            return res.render('../views/blog/othersblog', { blog: blog[0], comments: comments })
        }else{
            req.flash('error', 'Error 404! Page not found')
            return res.redirect('/bwk/blog/dashboard')
        }
    },

    //put method of React
    putReact: async (req, res, next)=>{
        const id = req.params.id
        if(req.body.react != "love" && req.body.react != "angry") req.body.react = null
        const react = {
            blogId:     id,
            userId:     req.user.userId,
            reaction:   req.body.react,
        }

        await connection('react')
        .insert(react)
        .onConflict('bnu')
        .merge('skill')

        return res.redirect('/bwk/blog/myblogs/'+id)
    },

    //post comment of logged in user 
    //add logic so that people can only post comments on public posts and private posts if it is theirs
    postComment: async (req, res, next)=>{
        const id = req.params.id
        const comment = {
            cmntId:     await generateId(),
            blogId:     id,
            userId:     req.user.userId,
            cmnt:       req.body.cmnt,
            cmnttime:   new Date()
        }

        await connection('comments')
        .insert(comment)
        .then(console.log("Comment Inserted"))
        .catch((err)=>console.log(err))

        return res.redirect('/bwk/blog/feed/'+id)
    },

    getUpdateComment: async (req, res, next)=>{
        const id = req.params.id
        const cmntId = req.params.cmntid
        const comment =  await connection('comments')
        .select('blogId', 'cmntId', 'cmnt')
        .where('cmntId', cmntId)

        return res.render('../views/blog/updatecomment', { comment: comment[0] })
    },

    //update comment of logged in user
    putComment: async (req, res, next)=>{
        const id = req.params.id
        const cmntId = req.params.cmntid
        const comment = {
            cmnt:       req.body.cmnt,
            cmnttime:   new Date()
        }

        await connection('comments')
        .update(comment)
        .where('cmntId', cmntId)
        .then(console.log("Comment Updated"))
        .catch((err)=>console.log(err))

        return res.redirect('/bwk/blog/feed/'+id)
    },

    //post comment of logged in user
    getDeleteComment: async (req, res, next)=>{
        const cmntId = req.params.cmntid

        await connection('comments')
        .delete()
        .where('cmntId', cmntId)
        .then(console.log("Comment Inserted"))
        .catch((err)=>console.log(err))

        return res.redirect('/bwk/blog/feed/'+id)
    },
}