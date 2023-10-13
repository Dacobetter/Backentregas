const passport = require("passport")
const local = require("passport-local")
const { createHash, isValidPassword } = require("../controladores/utils.js")
const UserModel = require("../models/user.model.js")
const GitHubStrategy = require('passport-github2')
const localStrategy = local.Strategy
const initializePassport =() => {
    passport.use('register', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email'
}, async(req, username, password, done) =>{
    const {first_name, last_name, email, age} = req.body
    try{
        const user = await UserModel.findOne({email: username})
        if(user){
            return done (null, false)
        }
        const newUser = {
            first_name, last_name, email, age, password: createHash(password)
        }
        const result = await UserModel.create(newUser)
        return done(null, result)
    }catch(err){
        return done(err)
    }
}))
 
passport.use('login', new localStrategy({
    usernameField :'email',

}, async(username, password, done) => {
    try{
        const user = await UserModel.findOne({email: username})
        if(!user){
            return done(null, false)
        }
        if(!isValidPassword(user, password)) return done(null,false)

        return done(null, user)
        
    }catch(err){
        return done(err)
    }
}))
passport.use('github', new GitHubStrategy({
    clientID: 'Iv1.4f822ce5bbef0583',
    clientSecret: 'a2b5e89373b06df83d95e582541a149bb3221e7b',
    callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
}, async(accessToken, refreshToken, profile, done) =>{
    try{
        const user = await UserModel.findOne({email:profile._json.email})
        if(user) return done(null, user)
        const newUser = await UserModel.create({
            first_name: profile._json.name,
            last_name: '',
            email: profile._json.email,
            password: ''
        })
        return done(null, newUser)
    } catch(err){
        return done('Error con Git')
    }
}))
passport.serializeUser((user, done) =>{
    done(null, user._id)
})

passport.deserializeUser(async (id, done) =>{
    const user = await UserModel.findById(id)
    done(null, user)
})
}

module.exports = initializePassport;