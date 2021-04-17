export default {
    getSignup: (req, res, next) => {
        res.render('../views/register/signup')
    },

    getSignin: (req, res, next) => {
        res.render('../views/register/signin')
    },
}