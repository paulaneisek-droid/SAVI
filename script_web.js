// Esperamos a que la página se cargue por completo
document.addEventListener('DOMContentLoaded', () => {

    // Se obtienen los elementos del HTML por su ID
    const loginForm = document.getElementById('login-form');
    const calendarioSeccion = document.getElementById('calendario-seccion');
    //const DatosSeccion = document.getElementById('datos-seccion');
    const errorMessage = document.getElementById('error-message');
    const calendarioDiv = document.getElementById('calendario');
    const loginSection = document.getElementById('login-section'); // Contenedor del formulario
    
    // Elemento para preguntas frecuentes
    const toggleFaqBtn = document.getElementById('toggle-faq');
    const faqSection = document.getElementById('faq-section');

    // se define los usuarios y contraseñas
    const usuariosPermitidos = {
        "usuario1": "contraseña123"
    };

    // Función para mostrar el calendario y el próximo festivo
    function mostrarCalendario() {
        
        // los nombres de los meses (Enero es el índice 0)
        const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        // Definición de los festivos (meses de 0 a 11)
        const festivos = [
            { nombre: "Aniversario de la marca", dia: 13, mes: 6 }, 
            { nombre: "Inicio de la primavera", dia: 22, mes: 8 }, 
            { nombre: "Navidad", dia: 25, mes: 11}, 
            { nombre: "Año Nuevo", dia: 1, mes: 0}, 
            { nombre: "San Valentín", dia: 14, mes: 1 }, 
            { nombre: "Día de la madre", dia: 19, mes: 9}, 
            { nombre: "Día del trabajador", dia: 1, mes: 4}, 
            { nombre: "Día de la revolución", dia: 25, mes: 4}, 
            { nombre: "Día del empleado de comercio", dia: 29, mes: 8}, 
        ];

        // Obtener mes y año actual
        const hoy = new Date();
        const anioActual = hoy.getFullYear();

        // 1. Limpiar el contenido del calendario
        calendarioDiv.innerHTML = '';
        
        // LÓGICA PARA ENCONTRAR Y MOSTRAR EL PRÓXIMO FESTIVO EN EL ENCABEZADO
        
        // Función para calcular la fecha del festivo en el año actual
        const obtenerFechaCompleta = (f) => new Date(anioActual, f.mes, f.dia);

        // 1. Ordenar todos los festivos por fecha
        const festivosOrdenados = festivos
            .map(f => ({ ...f, fecha: obtenerFechaCompleta(f) }))
            .sort((a, b) => a.fecha - b.fecha);

        let proximoFestivo = null;

        // 2. Buscar el primer festivo cuya fecha sea igual o posterior a la de hoy
        for (const f of festivosOrdenados) {
            // Se usa .setHours(0,0,0,0) para comparar solo la fecha sin la hora, evitando problemas con festivos en el día de hoy.
            if (f.fecha.setHours(0,0,0,0) >= hoy.setHours(0,0,0,0)) {
                proximoFestivo = f;
                break;
            }
        }
        
        // Si no encuentra un festivo este año, se toma el primero (Enero) para el año siguiente
        if (!proximoFestivo && festivosOrdenados.length > 0) {
            // Se toma el primero, pero se ajusta el año para que diga el siguiente
            proximoFestivo = festivosOrdenados[0];
            const nombreMesProximo = nombresMeses[proximoFestivo.mes];

            const h3ProximoFestivo = document.createElement('h3');
            h3ProximoFestivo.textContent = `El próximo día festivo es: ${proximoFestivo.nombre} el ${proximoFestivo.dia} de ${nombreMesProximo} (Próximo Año)`;
            h3ProximoFestivo.style.textAlign = 'center';
            h3ProximoFestivo.style.color = '#d34a24';
            
            calendarioDiv.appendChild(h3ProximoFestivo);
        } else if (proximoFestivo) {
            // Mostrar el festivo encontrado este año
            const h3ProximoFestivo = document.createElement('h3');
            const nombreMesProximo = nombresMeses[proximoFestivo.mes];
            
            h3ProximoFestivo.textContent = `El próximo día festivo es: ${proximoFestivo.nombre} el ${proximoFestivo.dia} de ${nombreMesProximo}`;
            h3ProximoFestivo.style.textAlign = 'center';
            h3ProximoFestivo.style.color = '#e93706';
            
            calendarioDiv.appendChild(h3ProximoFestivo);
        }
        
        //LÓGICA PARA LA TABLA/GRILLA del Calendario
        
        const mesActual = hoy.getMonth();
        const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        const primerDia = new Date(anioActual, mesActual, 1);
        const ultimoDia = new Date(anioActual, mesActual + 1, 0);

        const tabla = document.createElement('table');
        tabla.style.margin = '20px auto'; 
        tabla.style.borderCollapse = 'collapse';
        tabla.style.width = '100%'; 

        // Cabecera de tab
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        diasSemana.forEach(dia => {
            const th = document.createElement('th');
            th.textContent = dia;
            th.style.padding = '5px';
            th.style.background = '#f0f0f0';
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        tabla.appendChild(thead);

        // Cuerpo del calendario 
        const tbody = document.createElement('tbody');
        let tr = document.createElement('tr');
        
        // Espacios vacíos
        for (let i = 0; i < primerDia.getDay(); i++) {
            const td = document.createElement('td');
            td.textContent = '';
            tr.appendChild(td);
        }
        
        // días del mes
        for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
            const fecha = new Date(anioActual, mesActual, dia);
            const td = document.createElement('td');
            td.textContent = dia;
            td.style.textAlign = 'center';
            td.style.padding = '5px';
            td.style.border = '1px solid #ccc';

            // Verificar si es festivo (SOLO para el mes actual)
            const festivo = festivos.find(f => f.dia === dia && f.mes === mesActual);
            if (festivo) {
                td.style.background = '#ffe0b2';
                td.title = festivo.nombre; // Muestra el nombre al pasar el mouse
                td.style.fontWeight = 'bold';
            }

            tr.appendChild(td);
            if (fecha.getDay() === 6) { // Si es sábado, cierra la fila
                tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
        }
        
        // Rellenar los últimos espacios vacíos
        if (tr.children.length > 0) {
            while (tr.children.length < 7) {
                const td = document.createElement('td');
                td.textContent = '';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }

        tabla.appendChild(tbody);
        
        // Agrega la tabla del calendario al div 
        calendarioDiv.appendChild(tabla);
    } 


    //:::::::::::::::::::::::::::::::ESTO DE ACA ABAJO ES NUEVO BUENO:::::::::::::::::::::::::::::: 
    // ... (Dentro de document.addEventListener('DOMContentLoaded', ...) ) ...

const descargarBtn = document.getElementById('descargar-datos-btn');

if (descargarBtn) {
    descargarBtn.addEventListener('click', () => {
        // Llama al endpoint de Node-RED
      const proxyURL = 'http://localhost:1880/api/descargar-datos';

        fetch(proxyURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en el servidor al descargar los datos.');
                }
                // Obtiene el contenido como un "blob" (archivo binario)
                return response.blob(); 
            })
            .then(blob => {
                // Crea un enlace temporal para forzar la descarga
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // El nombre del archivo lo define el backend de Node-RED, pero esto es un respaldo
                a.download = 'SAVI_Datos_Recoleccion.txt'; 
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            })
            .catch(error => {
                console.error('Fallo en la descarga:', error);
                alert('No se pudieron descargar los datos. Consultar en el numero de asistencia.');
            });
    });
}
 //:::::::::::::::::::::::::::::::ESTO DE ACA ABAJO ES VIEJO BUENO::::::::::::::::::::::::::::::   
    // Funcionalidad de LOGIN 
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (usuariosPermitidos[username] && usuariosPermitidos[username] === password) {
            loginSection.style.display = 'none'; 
            calendarioSeccion.style.display = 'block'; 
            
            // 💡 APLICAMOS LA CORRECCIÓN AQUÍ TAMBIÉN (si no usamos la función)
            //datosSeccionElement.style.display = 'block';
            
            mostrarCalendario(); 
            // 💡 LLAMADA A LA FUNCIÓN (Si la mantienes)
            // mostrarDatos(); 
        } else {
            errorMessage.style.display = 'block';
        }   
});

    //Funcionalidad de PREGUNTAS FRECUENTES
    if (toggleFaqBtn && faqSection) {
        toggleFaqBtn.addEventListener('click', () => {
            if (faqSection.style.display === 'none' || faqSection.style.display === '') {
                faqSection.style.display = 'block';
            } else {
                faqSection.style.display = 'none';
            }
        });
    }
});