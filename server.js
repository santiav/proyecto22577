const express = require('express')
const app = express()
const hbs = require('hbs');
const path = require('path');


const port = 3000

app.set('view engine', 'hbs');
app.set('views', [
	path.join('./views/front'),
	path.join('./views/back'),
	path.join('./views'),
])
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static('public'));





app.use((req, res, next) => {
	res.status(404).render('404', {
		titulo: "404 - No encontrado"
	})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})