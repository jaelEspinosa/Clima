const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


window.addEventListener('load', ()=> {
    formulario.addEventListener('submit', buscarClima);

})

function buscarClima(e){
    e.preventDefault()
   

    //validar formulario
    const ciudad = document.querySelector('#ciudad').value
    const pais = document.querySelector('#pais').value
    if (ciudad === '' || pais === ''){
        mostrarError('Ambos campos son obligatorios');
        return; 
    }
    consultarAPI(ciudad,pais);
}
  

   function mostrarError(mensaje){
       const alarma=document.querySelector('.alarma')
       if(!alarma){
           // Crear Alerta
           
       const alerta = document.createElement('div');
       alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3',
       'rounded','max-w-md','mx-auto','mt-6','text-center','alarma');
       alerta.innerHTML=`
       <strong class = "font-bold">Error!</strong>
       <span clas = "block">${mensaje}</span>
       `;

       // eliminar alerta

         container.appendChild(alerta);
         setTimeout(() => {
            alerta.remove()
          }, 2000);
       }
      
      
   }
    // consultar la APi

    function consultarAPI(ciudad,pais){
        const idioma = 'sp, es'
        const appID = '6363134c59c25df7b5455dc83fa23a67'
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appID}&lang=${idioma}`
        
        Spinner(); // muestra un spinner de carga
        
        fetch(url)
            .then (respuesta => respuesta.json())
            .then (datos => {
                
                //limpiar HTML previo
                limpiarHTML();

                if (datos.cod === "404"){
                    mostrarError('Ciudad NO encontrada')
                    return;
                }
                console.log(datos)
                mostrarClima(datos)    
                
            })   
    }

    function mostrarClima(datos){
        const{ name, main: { temp, temp_max, temp_min},weather:{0:{main,description,icon}} } = datos;

         

       
        const meses= ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Noviembre','Diciembre'];
        const diasem = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']

        const centigrados = kelvinACentigrados(temp);
        const max = kelvinACentigrados(temp_max);
        const min = kelvinACentigrados(temp_min);
        
        const fecha = new Date();
        const diames = fecha.getDate();
        const dia = fecha.getDay()
        console.log(dia)
        const mes = fecha.getMonth();
        const year = fecha.getUTCFullYear();

        const ubicacion = document.createElement('p');
        const fechaDiv = document.createElement('p');

        ubicacion.innerHTML = `Temperaturas en ${name}`
        fechaDiv.innerHTML = ` ${diasem[dia]} ${diames} de ${meses[mes]} del ${year}`;

        ubicacion.classList.add('font-bold','text-xl', 'text-center');
        fechaDiv.classList.add('font-bold','text-xl', 'text-center');


        const actual = document.createElement('p');
        actual.innerHTML = `${centigrados} &#8451;`;
        actual.classList.add('font-bold','text-6xl');

        const tempMaxima = document.createElement('p');
        tempMaxima.innerHTML = `Máx. ${max} &#8451;`;
        tempMaxima.classList.add('text-xl')
        
        const tempMinima = document.createElement('p');
        tempMinima.innerHTML = `Min. ${min} &#8451;`;
        tempMinima.classList.add('text-xl')

        const resultadoDiv = document.createElement ('div');
        resultado.classList.add('text-center','text-white');
        
        resultadoDiv.appendChild(ubicacion);
        resultadoDiv.appendChild(fechaDiv);
        resultadoDiv.appendChild(actual);
        resultadoDiv.appendChild(tempMaxima);
        resultadoDiv.appendChild(tempMinima);

        resultado.appendChild(resultadoDiv);

        cambiarBackground(main,description)  // aplicamos background en funcion del clima
    }

   const kelvinACentigrados = grados => parseInt(grados -273.15);


    function limpiarHTML(){
        while (resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }

    }
    function Spinner(){

        limpiarHTML();

        const divSpiner=document.createElement('div');
        divSpiner.classList.add('sk-chase');

        divSpiner.innerHTML= `
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>            
        `;
        resultado.appendChild(divSpiner)         
    }

    function cambiarBackground(main, description){

        const htmlBackground = document.querySelector('html');
        htmlBackground.classList.remove('despejado','nublado','lluvia','nieve','alguna_nube','niebla');
        resultado.classList.remove('con_fondo_blanco')
        
        switch (description) {
            case "clear sky":
                 resultado.classList.remove('text-white')
                 htmlBackground.classList.add('despejado');
                 resultado.classList.add('con_fondo_blanco')
            break;
            case "overcast clouds":
                htmlBackground.classList.add('nublado');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
            break;
            case "broken clouds":
                htmlBackground.classList.add('nublado');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
            break;
            case "mist":
                htmlBackground.classList.add('niebla');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
            break;
            case "fog":
                htmlBackground.classList.add('niebla');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
            break;

            case "few clouds":
                htmlBackground.classList.add('alguna_nube');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
            break;
            case "scattered clouds":
            htmlBackground.classList.add('alguna_nube');
            resultado.classList.remove('text-white')
            resultado.classList.add('con_fondo_blanco')
            break;
            case "light snow":
                htmlBackground.classList.add('nieve');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
                
            break;

            default:
                break;
        }
        switch (main) {
            case "Rain":
                htmlBackground.classList.add('lluvia');
                resultado.classList.remove('text-white')
                resultado.classList.add('con_fondo_blanco')
                
                break;
        
            default:
                break;
        }
    }