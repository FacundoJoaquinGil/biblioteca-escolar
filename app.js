//Referencias de etiquetas de ALUMNOS
const nombreAlumno = document.getElementById("nombreAlumno")
const dniAlumno = document.getElementById("dniAlumno")
const direccionAlumno = document.getElementById("direccionAlumno")
const filaAlumno = document.getElementById("filaAlumno")
const btnGuardar = document.getElementById("btnGuardar")
const btnActualizar = document.getElementById("btnActualizar")
const btnCancelar = document.getElementById("btnCancelar")

//Referencias de etiquetas de LIBROS
const tituloLibro = document.getElementById("tituloLibro")
const autorLibro = document.getElementById("autorLibro")
const filaLibro = document.getElementById("filaLibro")

//Referencias de etiquetas de PRESTAMOS
const selectLibros = document.getElementById("selectLibros")
const selectAlumnos = document.getElementById("selectAlumnos")
const fechaEntrega = document.getElementById("fechaEntrega")
const fechaDevolucion = document.getElementById("fechaDevolucion")
const filaPrestamo = document.getElementById("filaPrestamo")
const filaPrestamoVencido = document.getElementById("filaPrestamoVencido")
const libroPrestado = document.getElementById("libroPrestado")

// Variables Axuliriares
let auxId
let auxTituloLibro
let auxNombreAlumno
let auxEstadoLibro


// Llamado a las funciones al cargar la pagina
mostrarTodosAlumnos()
mostrarTodosLibros()
mostrarSelectLibro()
mostrarSelectAlumno()
mostrarTodosPrestamos()

// FUNCIONES PARA SECCION DE ALUMNOS
async function guardarAlumno() {
  resp = await axios.post("http://localhost:3000/alumno", {
    nombre: nombreAlumno.value,
    dni: dniAlumno.value,
    direccion: direccionAlumno.value,
  })
  alert("Grabacion OK")
}
async function mostrarTodosAlumnos() {
  resp = await axios.get("http://localhost:3000/alumno")
  filaAlumno.innerHTML = `
  <tr>
    <th scope="col">Nombre</th>
    <th scope="col">DNI</th>
    <th scope="col">Direccion</th>
  </tr>
`
  resp.data.forEach((element) => {
    filaAlumno.innerHTML += `
    <tr>
       <td>${element.nombre} </td>
       <td>${element.dni}</td>
       <td>${element.direccion}</td>
       <td>
           <button onclick="borrarAlumno(${element.id})">Dar de baja</button>
           <button onclick="mostrarAlumno(${element.id})">Editar</button>
       </td>
    </tr>
    `
  })
}
async function borrarAlumno(id) {
  resp = await axios.get("http://localhost:3000/alumno/" + id)
  resp2 = await axios.get("http://localhost:3000/prestamo")
  // ME FIJO SI DENTRO DE LA TABLA DE PRESTAMOS HAY ALGUN ALUMNOID CON EL MISMO ID QUE ALGUN ALUMNO
  if (resp2.data.find((prestamo) => prestamo.alumnoId == id)) {
    alert("No se puede dar de baja el alumno por que tiene un prestamo activo")
  } else {
    await axios.delete("http://localhost:3000/alumno/" + id)
  }
}
async function mostrarAlumno(id) {
  auxId = id
  resp = await axios.get("http://localhost:3000/alumno/" + id)
  resp2 = await axios.get("http://localhost:3000/prestamo")
  // ME FIJO SI DENTRO DE LA TABLA DE PRESTAMOS HAY ALGUN ALUMNOID CON EL MISMO ID QUE ALGUN ALUMNO
  if (resp2.data.find((prestamo) => prestamo.alumnoId == id)) {
    alert("No se puede editar el alumno por que tiene un prestamo activo")
  } else {
    btnActualizar.hidden = false
    btnCancelar.hidden = false
    btnGuardar.hidden = true
    nombreAlumno.value = resp.data.nombre
    dniAlumno.value = resp.data.dni
    direccionAlumno.value = resp.data.direccion
  }
}
async function actualizarAlumno() {
  btnActualizar.hidden = true
  btnCancelar.hidden = true
  btnGuardar.hidden = false
  resp = await axios.put("http://localhost:3000/alumno/" + auxId, {
    nombre: nombreAlumno.value,
    direccion: direccionAlumno.value,
    dni: dniAlumno.value,
  })
}
function cancelarEdicion(){
  btnActualizar.hidden = true
  btnCancelar.hidden = true
  btnGuardar.hidden = false
}
// FUNCIONES PARA SECCION DE LIBROS
async function guardarLibro() {
  resp = await axios.post("http://localhost:3000/libro", {
    titulo: tituloLibro.value,
    autor: autorLibro.value,
    
  })
  alert("Grabacion OK")
  mostrarTodosLibros()

}
async function mostrarTodosLibros() {
  resp = await axios.get("http://localhost:3000/libro")
  resp2 = await axios.get("http://localhost:3000/prestamo")
  filaLibro.innerHTML = `
   <tr>
    <th scope="col">Título del libro</th>
    <th scope="col">Autor</th>
    <th scope="col">Estado</th>
   </tr>
`
  resp.data.forEach((libro) => {
    let busquedaLibro = libro.id -1
    if (resp2.data[busquedaLibro]) {
      auxEstadoLibro = "Prestado"
    } else {
      auxEstadoLibro = "Disponible"
    }
    filaLibro.innerHTML += `
    <tr>
       <td>${libro.titulo} </td>
       <td>${libro.autor}</td>
       <td>${auxEstadoLibro}</td>
       <td>
           <button onclick="borrarLibro(${libro.id})">Dar de baja</button>
           <button onclick="mostrarLibro(${libro.id})">Editar</button>
       </td>
    </tr>
    `
  })
}
async function borrarLibro(id) {
  resp = await axios.get("http://localhost:3000/libro/" + id)
  resp2 = await axios.get("http://localhost:3000/prestamo")
    // ME FIJO SI DENTRO DE LA TABLA DE PRESTAMOS HAY ALGUN ALUMNOID CON EL MISMO ID QUE ALGUN LIBRO
  if (resp2.data.find((prestamo) => prestamo.libroId == id)) {
    alert("No se puede borrar el libro por que esta activo en un prestamo")
  } else {
    await axios.delete("http://localhost:3000/libro/" + id)
  }
}
async function mostrarLibro(id) {
  auxId = id
  resp = await axios.get("http://localhost:3000/libro/" + id)
  resp2 = await axios.get("http://localhost:3000/prestamo")
     // ME FIJO SI DENTRO DE LA TABLA DE PRESTAMOS HAY ALGUN ALUMNOID CON EL MISMO ID QUE ALGUN LIBRO
  if (resp2.data.find((prestamo) => prestamo.libroId == id)) {
    alert("No se puede editar el libro por que esta activo en un prestamo")
  } else {
    btnActualizar.hidden = false
    btnCancelar.hidden = false
    btnGuardar.hidden = true
    tituloLibro.value = resp.data.titulo
    autorLibro.value = resp.data.autor
  }
}
async function actualizarLibro() {
  btnActualizar.hidden = true
  btnCancelar.hidden = true
  btnGuardar.hidden = false
  resp = await axios.put("http://localhost:3000/libro/" + auxId, {
    titulo: tituloLibro.value,
    autor: autorLibro.value,
  })
}
// FUNCIONES SECCION PRESTAMO
async function mostrarSelectLibro() {
  resp = await axios.get("http://localhost:3000/libro")
  selectLibros.innerHTML = `
   <option disabled selected>Selecciona una opción</option>
   `
  resp.data.forEach((element) => {
    selectLibros.innerHTML += `
    <option value="${element.id}">${element.titulo}</option>
    `
  })
}
async function mostrarSelectAlumno() {
  resp = await axios.get("http://localhost:3000/alumno")
  selectAlumnos.innerHTML = `
  <option disabled selected>Selecciona una opción</option>
  `
  resp.data.forEach((element) => {
    selectAlumnos.innerHTML += `
    <option value="${element.id}">${element.nombre}</option>
    `
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
    console.log("fecha actual = " + hoy)
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
          <tr>
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
           <tr>
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
