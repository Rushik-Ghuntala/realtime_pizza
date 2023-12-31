const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcrypt')

function authController() {

    const _getRedirectUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customers/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login')
        },
        postLogin(req, res, next){

            const{email, password} = req.body;

            //validate request
            if( !email || !password){
                req.flash('error', 'All fields are required...')
                
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user, info) =>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }

                if(!user){
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if(err){
                        req.flash('error', info.message)
                        return next(err)
                    }

                    return res.redirect(_getRedirectUrl(req))
                })

            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register')
        },
        async postRegister(req, res){

            const {name, email, password } = req.body

            //validate request
            if(!name || !email || !password){
                req.flash('error', 'All fields are required...')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }

            //check if email exist pr not
            User.exists({ email: email }, (err, result) => {
                if(result){
                req.flash('error', 'This email is already exists....')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
                }
            })


            // make Hash Password
            const hashedPassword = await bcrypt.hash(password, 10)

            //Create a User
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })



            user.save().then((user) => {
                // Login

                return res.redirect('/login')
            }).catch(err => {
                req.flash('error', 'Somthing went wrong...')
                
                return res.redirect('/register')
            })

            // console.log(req.body)

        },
        logout(req, res, next){
            req.logout(function(err) {
                if (err) { return next(err); }
                res.redirect("/");
              });
        }
    }
}

module.exports = authController