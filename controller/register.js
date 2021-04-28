import passport from 'passport'

export default {
    getSignup: (req, res, next) => {
        res.render('../views/register/signup')
    },

    postSignup: passport.authenticate('local-signup', {
        successRedirect : '/bwk/dashboard',
        failureRedirect : 'home',
        failureFlash : true
    }),

    getSignin: (req, res, next) => {
        res.render('../views/register/signin')
    },

    postSignin: passport.authenticate('local-login', {
        successRedirect : '/bwk/dashboard',
        failureRedirect : 'home',
        failureFlash : true
    }),

    getLogout: function(req, res, next){ 
        req.logout()
        req.session.passport.user = null;
        res.redirect("/home")
    },
}