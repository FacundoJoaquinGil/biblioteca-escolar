
//Referencias de etiquetas de PRESTAMOS
const selectLibros = document.getElementById("selectLibros")
const selectAlumnos = document.getElementById("selectAlumnos")
const fechaEntrega = document.getElementById("fechaEntrega")
const fechaDevolucion = document.getElementById("fechaDevolucion")
const filaPrestamo = document.getElementById("filaPrestamo")
const filaPrestamoVencido = document.getElementById("filaPrestamoVencido")
const libroPrestado = document.getElementById("libroPrestado")



// Llamado a las funciones al cargar la pagina
mostrarSelectLibro()
mostrarSelectAlumno()
mostrarTodosPrestamos()


// Variables Axuliriares
let auxId
let auxTituloLibro
let auxNombreAlumno


// FUNCIONES SECCION PRESTAMO
async function mostrarSelectLibro() {
    resp2 = await axios.get("http://localhost:3000/prestamo")
    resp = await axios.get("http://localhost:3000/libro")


    selectLibros.innerHTML = `
    <option disabled selected>Selecciona una opción</option>
    `
    resp.data.forEach((libro) => {
        if(!resp2.data.find(prestamo=>prestamo.libroId==libro.id)){
            selectLibros.innerHTML += `
            <option value="${libro.id}">${libro.titulo}</option>
            `
          }
        })
     
  }
  async function mostrarSelectAlumno() {
    resp2 = await axios.get("http://localhost:3000/prestamo")
    resp = await axios.get("http://localhost:3000/alumno")
  

    selectAlumnos.innerHTML = `
    <option disabled selected>Selecciona una opción</option>
    `
    resp.data.forEach((alumno) => {
        if(!resp2.data.find(prestamo=>prestamo.alumnoId==alumno.id)){
            selectAlumnos.innerHTML += `
            <option value="${alumno.id}">${alumno.nombre}</option>
            `
          }
        })
     
  }
  async function guardarPrestamo() {
    resp = await axios.post("http://localhost:3000/prestamo", {
      fechaEntrega: fechaEntrega.value,
      fechaDevolucion: fechaDevolucion.value,
      libroId: selectLibros.value,
      alumnoId: selectAlumnos.value,
    })
  }
  async function mostrarTodosPrestamos() {
    resp1 = await axios.get("http://localhost:3000/prestamo")
    resp2 = await axios.get("http://localhost:3000/libro")
    resp3 = await axios.get("http://localhost:3000/alumno")
    filaPrestamo.innerHTML = `
  <tr>
     <th scope="col">Título del libro</th>
     <th scope="col">Nombre Alumno</th>
     <th scope="col">Fecha de prestamo</th>
     <th scope="col">Fecha de devolucion</th>
     <th scope="col">Estado</th>
  </tr>
  `
    filaPrestamoVencido.innerHTML = `
    <tr>
       <th scope="col">Título del libro</th>
       <th scope="col">Nombre Alumno</th>
       <th scope="col">Fecha de prestamo</th>
       <th scope="col">Fecha de devolucion</th>
       <th scope="col">Estado</th>
    </tr>
  `
    resp1.data.forEach((prestamo) => {
      // ME FIJO CUAL ES LA FECHA ACTUAL EN LA QUE ESTOY CORRIENDO EL PROGRAMA
      let fechaActual = new Date()
      // LA PASO A UN FORMATO MAS FACIL DE LEER
      let hoy = fechaActual.toLocaleDateString()
      let nuevaFechaDevolucion = prestamo.fechaDevolucion;
      //CAMBIO LOS "-" POR "/" PARA QUE SE VEA IGUAL QUE LA FECHA DE LA BASE DE DATOS
      nuevaFechaDevolucion = nuevaFechaDevolucion.replace("-", "/")
      nuevaFechaDevolucion = nuevaFechaDevolucion.replace("-", "/")
      // USO LA LIBRERIA MOMENT PARA ORDENAR LOS DIAS, MESES Y AÑOS. IGUAL QUE EN LA BASE DE DATOS
      nuevaFechaDevolucion = moment(nuevaFechaDevolucion).format("DD/MM/YYYY")
      //COMPARO LA TABLA DE LIBROS CON LA DE PRESTAMOS, A VER SI COINCIDEN LOS ID DE LIBRO
      resp2.data.forEach((libro) => {
        if (libro.id == prestamo.libroId) {
          auxTituloLibro = libro.titulo
        }
      })
      //COMPARO LA TABLA DE ALUMNOS CON LA DE PRESTAMOS, A VER SI COINCIDEN LOS ID DE ALUMNO
      resp3.data.forEach((alumno) => {
        if (alumno.id == prestamo.alumnoId) {
          auxNombreAlumno = alumno.nombre
        }
      })
      //COMPARO LA FECHA DE DEVOLUCION CON LA DEL DIA DE HOY, PARA SABER SI ESTA VENCIDO EL PRESTAMO
      if (nuevaFechaDevolucion < hoy) {
      // PRESTAMOS VENCIDOS
        filaPrestamoVencido.innerHTML += `
            <tr class="fondoRojo">
               <td>${auxTituloLibro}</td>
               <td>${auxNombreAlumno}</td>
               <td>${prestamo.fechaEntrega}</td>
               <td>${prestamo.fechaDevolucion}</td>
               <td>Vencido</td>
               <td>
                   <button onclick="borrarPrestamo(${prestamo.id})">Devolver</button>
               </td>
            </tr>
            `
      } else {
        // PRESTAMOS AL DIA
        filaPrestamo.innerHTML += `
             <tr class="fondoVerde">
                <td>${auxTituloLibro}</td>
                <td>${auxNombreAlumno}</td>
                <td>${prestamo.fechaEntrega}</td>
                <td>${prestamo.fechaDevolucion}</td>
                <td>Prestado</td>
                <td>
                    <button onclick="borrarPrestamo(${prestamo.id})">Devolver</button>
                </td>
            </tr>
          `
      }
    })
  }
  async function borrarPrestamo(id) {
    try {
      await axios.delete("http://localhost:3000/prestamo/" + id)
    } catch {
      alert("Error al borrar")
    }
  }
  