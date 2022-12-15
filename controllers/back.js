// const productos = require('../data/productos.json')
require('dotenv').config()
const db = require('../models/connection.js')

const adminGET = (req, res) => {

	const logueado = req.session.logueado // true | null

	if (logueado) {
		let sql = "SELECT * FROM productos"
		db.query(sql, (err, data) => {
			if (err) throw err
			// console.log(data)
			res.render('admin', {
				titulo: "Panel de control",
				logueado: logueado, // true
				usuario: req.session.nombreUsuario,
				productos: data
			})
		})
	} else {
		res.redirect('/login')
	}


}

const agregarProductoGET = (req, res) => {
	console.log("estas en agregar")
	res.render('agregar-producto', {
		titulo: "Agregar producto"
	})
}

const agregarProductoPOST = (req, res) => {

	const info = req.body
	const sql = "INSERT INTO productos SET ?"
	db.query(sql, info, (err, data) => {
		if (err) throw err
		console.log("Producto agregado")
		res.render("agregar-producto", {
			mensaje: "Producto agregado",
			titulo: "Agregar producto"
		})
	})


}

const editarProductoGET = (req, res) => {

	// /editar/1
	const id = req.params.id

	const sql = "SELECT * FROM productos WHERE id = ?"

	db.query(sql, id, (err, data) => {
		if (err) throw err
		console.log(data[0])
		if (data.length > 0) {
			res.render('editar-producto', {
				titulo: "Editar producto",
				producto: data[0]
			})
		} else {
			res.send(`
				<h1>no existe producto con id ${id}</h1>
				<a href="/admin/">Ver listado de productos</a>
			`)
		}
	})


}

const editarProductoPOST = (req, res) => {

	// /editar/1
	const id = req.params.id
	const producto = req.body

	const sql = "UPDATE productos SET ? WHERE id = ?"

	db.query(sql, [producto, id], (err, data) => {
		if (err) throw err
		console.log("ACTUALIZAR DATA", data)
		console.log(`${data.affectedRows} registro actualizado`);
		res.redirect('/admin');
	})
}

const borrarProductoGET = (req, res) => {
	// /borrar/1
	const id = req.params.id

	const sql = "DELETE FROM productos WHERE id = ?"
	db.query(sql, id, (err, data) => {
		if (err) throw err
		console.log(data.affectedRows + " registro borrado");
		res.redirect('/admin');
	})

}

const loginGET = (req, res) => {
	console.log("estas en login")
	res.render('login', {

	})
}

const loginPOST = (req, res) => {

	const usuario = req.body.usuario
	const clave = req.body.clave

	if (usuario && clave) {
		const sql = "SELECT * FROM cuentas WHERE usuario = ? AND clave = ?"
		db.query(sql, [usuario, clave], (err, data) => {
			if (data.length > 0) {
				req.session.logueado = true // Creamos una propiedad llamada "logueado" para que el objeto session almacene el valor "TRUE" y es para usarlo en el parcial de "header"
				req.session.nombreUsuario = usuario
				res.redirect('/admin');
			} else {
				res.render('login', {
					titulo: "Login",
					error: "Nombre de usuario o clave incorrecto(s)"
				})
			}
		})
	} else {
		res.render("login", {
			titulo: "Login",
			error: "Por favor escribe un nombre de usuario y clave"
		})
	}
}

module.exports = {
	adminGET,
	agregarProductoGET,
	agregarProductoPOST,
	editarProductoGET,
	editarProductoPOST,
	borrarProductoGET,
	loginPOST,
	loginGET
}