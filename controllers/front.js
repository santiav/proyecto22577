// const productos = require('../data/productos.json')
require('dotenv').config()
const db = require('../models/connection.js')
const nodemailer = require('nodemailer');

const indexGET = (req, res) => {

	let sql = "SELECT * FROM productos WHERE destacado = 1"
	db.query(sql, (err, data) => {
		if (err) throw err
		// console.log(data)
		res.render('index', {
			titulo: "Mi página web",
			productos: data
		})
	})


}

const comoComprarGET = (req, res) => {
	res.render('como-comprar', {
		titulo: "Cómo comprar"
	})
}

const contactoGET = (req, res) => {
	res.render('contacto', {
		titulo: "Contacto"
	})
}

const contactoPOST = (req, res) => {

	const info = req.body

	 const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});

	const mailOptions = {
		from: info.email,
		to: 'santiago.acosta@bue.edu.ar',
		subject: info.asunto,
		html: `
			<h1>${info.nombre}</h1>
			<p>${info.mensaje}</p>
		`
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			res.status(500).render('contacto', {
				mensaje: `Ha ocurrido el siguiente error ${error.message}`,
                mostrar: true,
                clase: 'danger'
			})
		} else {
			res.status(200).render('contacto', {
				mensaje: "Mail enviado correctamente",
                mostrar: true,
                clase: 'success'
			})
		}
	});
	/* 
		SMTP_HOST=smtp.gmail.com
		SMTP_PORT=465
		SMTP_USERNAME=hello@example.com
		SMTP_PASSWORD=generatedPassword
	*/
}

const productoDetalleGET = (req, res) => {
	res.render('producto-detalle', {
		titulo: "Detalle del producto"
	})
}

const sobreNosotrosGET = (req, res) => {
	res.render('sobre-nosotros', {
		titulo: "Sobre nosotros"
	})
}

module.exports = {
	indexGET,
	comoComprarGET,
	contactoGET,
	contactoPOST,
	productoDetalleGET,
	sobreNosotrosGET
}