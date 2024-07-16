
//Referencias de etiquetas de LIBROS
const tituloLibro = document.getElementById("tituloLibro")
const autorLibro = document.getElementById("autorLibro")
const filaLibro = document.getElementById("filaLibro")
const btnGuardar = document.getElementById("btnGuardar")
const btnActualizar = document.getElementById("btnActualizar")
const btnCancelar = document.getElementById("btnCancelar")


// Llamado a las funciones al cargar la pagina

mostrarTodosLibros()

// Variables Axuliriares
let auxId
let auxEstadoLibro


// FUNCIONES PARA SECCION DE LIBROS
async function guardarLibro() {
    resp = await axios.post("http://localhost:3000/libro", {
      titulo: tituloLibro.value,
      autor: autorLibro.value,
    })
    alert("Grabacion OK")  
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

      if(auxEstadoLibro == "Prestado"){
        filaLibro.innerHTML += `

      
        <tr class="fondoRojo">
           <td>${libro.titulo} </td>
           <td>${libro.autor}</td>
           <td>Prestadp</td>
           <td>
               <button onclick="borrarLibro(${libro.id})">Dar de baja</button>
               <button onclick="mostrarLibro(${libro.id})">Editar</button>
           </td>
        </tr>
        `
      } else{
        filaLibro.innerHTML += `

      
        <tr class="fondoVerde">
           <td>${libro.titulo} </td>
           <td>${libro.autor}</td>
           <td>Disponible</td>
           <td>
               <button onclick="borrarLibro(${libro.id})">Dar de baja</button>
               <button onclick="mostrarLibro(${libro.id})">Editar</button>
           </td>
        </tr>
        `
      }

    
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
  function cancelarEdicion(){
    btnActualizar.hidden = true
    btnCancelar.hidden = true
    btnGuardar.hidden = false
  }