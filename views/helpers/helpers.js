const { default: axios } = require('axios');
const hbs = require('hbs');


let dolar;
// Obtener el dólar
axios.get("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
    .then( resultado => {
        dolar = resultado.data[4].casa.venta;
        dolar = dolar.replace(/,/g,".")
        dolar = parseFloat(dolar)
        console.log(dolar)
    })
    .catch(err => {console.log(err)})


// Helpers
hbs.registerHelper('dolarApeso', precio => {
    const total = dolar * precio
    return new Intl.NumberFormat('es-AR',{style: 'currency', currency: 'ARS'}).format(total)
});

hbs.registerHelper('listado', datos => {
    // intel i5, 8gb ram, 
    let array = datos.split(',')
    // [ 'intel i5', '8gb ram' ]
    
    let html = "<ul>"
    /* 
        <ul>
            <li>intel i5</li>
            <li>8gb ram</li>
    */
    for (item of array) {
        html += `<li>${item}</li>`
    }

    return `${html}</ul>`

})

// Destacado = 1 o 0
// <input type="checkbox" name="destacado" value="{{destacado}}" disabled> 

hbs.registerHelper("check", valor => {
    if (valor == "1") {
        return `<input type="checkbox" name="destacado" value="1" disabled checked>`
    }
    return `<input type="checkbox" name="destacado" value="0" disabled>`
})
