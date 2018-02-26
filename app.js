const express = require("express"),
    passport = require('passport'),
    rootPath = __dirname,
    LocalStrategy = require('passport-local').Strategy,
    app = express(),
    flash = require('connect-flash'),
    path = require('path'),
    session = require("express-session"),
    RedisStore = require('connect-redis')(session),
    bodyParser = require("body-parser"),
    config = require('./config')

passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true 
    },
    function(req, username, password, done) {
        if(username == 'test') {
            done(null, {
                username: username,
                gender: 'm'
            }) 
        } else {
            return done(null, false, req.flash('info', 'incorrect!'))
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.username)
})
passport.deserializeUser(function (name, done) {
    if(name == 'test') {
        done(null, {
            username: 'test',
            gender: 'm'
        })
    }
})

app.use(express.static("public"))
app.use(session({ 
    secret: "cats",
    name: 'cookie_name',
    store: new RedisStore(config.redis),
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


app.get('/', function (req, res) {
 res.sendFile(path.resolve(rootPath, 'template/index.html'))
});

app.post('/login',
passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/login', function (req, res) {
    console.log(req.flash('info'))
    res.sendFile(path.resolve(rootPath, 'template/login.html'))
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
