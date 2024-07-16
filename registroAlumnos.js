//Referencias de etiquetas de ALUMNOS
const nombreAlumno = document.getElementById("nombreAlumno")
const dniAlumno = document.getElementById("dniAlumno")
const direccionAlumno = document.getElementById("direccionAlumno")
const filaAlumno = document.getElementById("filaAlumno")
const btnGuardar = document.getElementById("btnGuardar")
const btnActualizar = document.getElementById("btnActualizar")
const btnCancelar = document.getElementById("btnCancelar")


// Variables Axuliriares
let auxId

// Llamado a las funciones al cargar la pagina
mostrarTodosAlumnos()


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