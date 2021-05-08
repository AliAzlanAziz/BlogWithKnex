function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('error', 'Log in to continue')
        return res.redirect('/signin')
    }
}

function isLoggedOut(req, res, next){
    if(!req.isAuthenticated()){
        return next()
    }else{
        req.flash('error', 'Log out to continue')
        return res.redirect('/bwk/blog/dashboard')
    }
}

export { isLoggedIn, isLoggedOut }