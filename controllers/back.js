// const productos = require('../data/productos.json')
require('dotenv').config()
const fs = require('fs') // fileSystem
const {
	multer,
	almacenamiento,
	maxSizeMB,
	upload
} = require('../views/helpers/multer')
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


	upload(req, res, err => {
		if (err instanceof multer.MulterError) {
			// Error de Multer al subir imagen
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).render('agregar-producto', {
					mensaje: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`,
					clase: "danger"
				});
			}
			return res.status(400).render('agregar-producto', { mensaje: err.code });
		} else if (err) {
			// Ocurrió un error desconocido al subir la imagen
			return res.status(400).render('agregar-producto',
				{ mensaje: `Ocurrió un error desconocido ${err}` }
			);
		}

		// Si no hubo error entonces...
		const productoDetalles = req.body;
		console.log("AGREGAR-PRODUCTO REQ.FILE", req.file)
		const nombreImagen = req.file.filename;
		productoDetalles.rutaImagen = nombreImagen

		// Consulta SQL - insertar data en la DB
		let sql = 'INSERT INTO productos SET ?';
		db.query(sql, productoDetalles, (err, result) => {
			if (err) throw err;
			res.render("agregar-producto", {
				mensaje: "Producto agregado correctamente",
				titulo: 'Agregar producto',
				clase: "success"
			})
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


	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// Error de Multer al subir imagen
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).render('agregar-producto', {
					mensaje: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`,
					clase: "danger"
				});
			}
			return res.status(400).render('agregar-producto', { mensaje: err.code });
		} else if (err) {
			// Ocurrió un error desconocido al subir la imagen
			return res.status(400).render('agregar-producto',
				{ mensaje: `Ocurrió un error desconocido ${err}` }
			);
		}

		// todo OK continuando
		const id = req.params.id;
		const productoDetalles = req.body;

		if (req.hasOwnProperty("file")) {

			const nombreImagen = req.file.filename;
			productoDetalles.rutaImagen = nombreImagen

			// Se procede a borrar la imagen del servidor
			const borrarImagen = 'SELECT rutaImagen FROM productos WHERE id = ?';
			/* ej: [ { rutaImagen: lenovo-43242342342.jpg } ]*/

			db.query(borrarImagen, [id], function (err, data) {
				if (err) throw err;

				fs.unlink(`public/uploads/${data[0].rutaImagen}`, (err) => {
					if (err) throw err;

					const sql = `UPDATE productos SET ? WHERE id= ?`;

					db.query(sql, [productoDetalles, id], function (err, data) {
						if (err) throw err;
						console.log(data.affectedRows + " registro(s) actualizado(s)");
					});
				});

				res.redirect('/admin');

			})


		} else {

			const sql = `UPDATE productos SET ? WHERE id= ?`;

			db.query(sql, [productoDetalles, id], function (err, data) {
				if (err) throw err;
				console.log(data.affectedRows + " registro(s) actualizado(s)");
				res.redirect('/admin');
			});

		}

	})

}

const borrarProductoGET = (req, res) => {
	// /borrar/1
	const id = req.params.id

	// Se procede a borrar la imagen del servidor
	const borrarImagen = 'SELECT rutaImagen FROM productos WHERE id = ?';

	db.query(borrarImagen, [id], function (err, data) {
		fs.unlink(`public/uploads/${data[0].rutaImagen}`, (err) => {
			if (err) throw err;

			const sql = "DELETE FROM productos WHERE id = ?"

			db.query(sql, [id], function (err, data) {
				if (err) throw err
				console.log(data.affectedRows + " registro borrado");
				res.redirect('/admin');
			});
		});
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