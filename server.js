const express = require('express')
const app = express()
const hbs = require('hbs');
const path = require('path');
const rutasFront = require('./routes/front.js')
const session = require('express-session')
const rutasBack = require('./routes/back.js')
require('./views/helpers/helpers.js')
const port = 3000


// Sesiones mediante cookies
app.use(session({
    secret: "sarasa",
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 300000} // 5 minutos

}))

// middlewares para tomar los datos del formulario
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.set('view engine', 'hbs');
app.set('views', [
	path.join('./views/front'),
	path.join('./views/back'),
	path.join('./views'),
])
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static('public'));

app.use('/', rutasFront)
app.use('/', rutasBack)



app.use((req, res, next) => {
	res.status(404).render('404', {
		titulo: "404 - No encontrado"
	})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})