const express = require('express');
const router = express.Router();


const {indexGET,
    comoComprarGET,
    contactoGET,
    productoDetalleGET,
    sobreNosotrosGET
} = require('../controllers/front.js')

// FRONT
router.get('/', )

router.get('/como-comprar',)

router.get('/contacto', )

router.get('/producto-detalle',)

router.get('/sobre-nosotros', )

module.exports = router