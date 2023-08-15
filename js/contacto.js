
let btnConsulta = document.getElementById("guardarConsultabtn")

btnConsulta.addEventListener("click", () => {
    //OBTENER DATOS DEL FORM
    let idConsulta = luxon.DateTime.now().toISO()
    let inputNombre = document.getElementById("nombreInput").value
    let inputEmail = document.getElementById("emailInput").value
    let inputCel = document.getElementById("celularInput").value
    let inputConsulta = document.getElementById("consultaInput").value

    let datosConsulta = {
        id: idConsulta,
        nombre: inputNombre,
        email: inputEmail,
        celular: inputCel,
        consulta: inputConsulta
    }
    
    // GUARDAR DATOS AL LOCAL STORAGE
    let consultasGuardadas = JSON.parse(localStorage.getItem('consultas')) || [];
    consultasGuardadas.push(datosConsulta);
    localStorage.setItem('consultas', JSON.stringify(consultasGuardadas));


    Swal.fire('Consulta enviada, pronto nos comunicaremos')
    
    //RESETEAR EL FORM
    document.getElementById("formConsulta").reset();


    // ENVIAR DATOS AL SERVIDOR --- METODO POST
    /* fetch('../js/contacto.json', {
        method: 'POST',
        body: JSON.stringify(datosConsulta),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log('response: ' + JSON.stringify(json));
    }); */

});