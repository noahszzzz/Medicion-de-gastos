// Variables y Selectores
const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto)
    
}

// Classes
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos,gasto];
        this.calcularRestante();
    }
    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=> total + gasto.cantidad , 0 );
        this.restante = this.presupuesto - gastado;
        
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}
class UI{
    insertarPresupuesto(cantidad){
        //Extrayendo valores
        const {presupuesto ,restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    imprimirAlerta(mensaje,tipo){
        const divMensaje =document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if(tipo==='error'){
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        divMensaje.textContent = mensaje;
        //Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }
    mostrarGastos(gastos){
        this.LimpiarHTML();
        //Iterar sobre los gastos
        gastos.forEach(gasto =>{
            const {cantidad,nombre,id}=gasto;

            //Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;//Agregar Atributo de data-id
            //Agregar HTML del gasto
           
            nuevoGasto.innerHTML = `
                ${nombre}<span class="badge badge-primary badge-pill">$${cantidad}</span>
            `;
            //Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.textContent = 'Borrar';
            btnBorrar.onclick = ()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);
           
            //Agregar el HTML
            gastosListado.appendChild(nuevoGasto);

        })
        
    }
        LimpiarHTML(){
            while(gastosListado.firstChild){
                gastosListado.removeChild(gastosListado.firstChild);
            }
        }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');
        //Comprobar 25%
        if((presupuesto / 4) > restante){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if((presupuesto /2) >restante){
            restanteDiv.classList.remove('alert-danger');
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }
        if(restante <=0){
            ui.imprimirAlerta('El presupuesto se ha agotado','error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}
const ui = new UI();

let presupuesto;


//Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if( presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload();//Recarga la pagina
    }
    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    //console.log(presupuesto);
    ui.insertarPresupuesto(presupuesto);
}
function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    //Validacion
    if(nombre==='' || cantidad===''){
        ui.imprimirAlerta('Ambos Campos son Obligatorios','error');
        return;
    }else if(cantidad ===-0 || isNaN(cantidad)){
        ui.imprimirAlerta('Inserte una cantidad valida','error');
        return;
    }
    //Generar un objeto con el gasto
    const gasto = {nombre , cantidad , id:Date.now()}

    presupuesto.nuevoGasto(gasto); 

    ui.imprimirAlerta('Gasto Agregado Correctamente');
    
    //Imprimir los gastos
    const {gastos , restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
    //Elimina los gastos del objetos
    presupuesto.eliminarGasto(id);

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}

