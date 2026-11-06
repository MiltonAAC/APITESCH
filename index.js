const express = require("express");
const app = express();
const PORT = 3000;

// Middleware obligatorio para parsear JSON en las peticiones
app.use(express.json());

// Arreglo en memoria para simular la colección de datos[cite: 1]
let productos = [
  { id: 1, nombre: "Laptop", precio: 1200 },
  { id: 2, nombre: "Mouse", precio: 25 },
  { id: 3, nombre: "Teclado", precio: 45 }
];

// Ruta base para confirmar que el servidor está en línea[cite: 1]
app.get("/", (req, res) => {
  res.send("Servidor en línea");
});

// 1. GET /api/productos - Obtener el arreglo completo de objetos[cite: 1, 2]
app.get("/api/productos", (req, res) => {
  res.json(productos);
});

// 2. GET /api/productos/:id - Obtener un objeto por su ID (404 si no existe)[cite: 1, 2]
app.get("/api/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  res.json(producto);
});

// 3. POST /api/productos - Crear un nuevo objeto con ID dinámico (201 Created)[cite: 1, 2]
app.post("/api/productos", (req, res) => {
  const body = req.body || {};
  const nombre = body.nombre;
  const precio = body.precio;

  if (!nombre || !precio) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios: nombre y precio" });
  }

  const nuevoProducto = {
    id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
    nombre,
    precio
  };

  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// 4. PUT /api/productos/:id - Actualizar un producto existente por ID[cite: 1, 2]
app.put("/api/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  const body = req.body || {};
  const nombre = body.nombre || productos[index].nombre;
  const precio = body.precio !== undefined ? body.precio : productos[index].precio;

  productos[index] = { id, nombre, precio };
  res.json(productos[index]);
});

// 5. DELETE /api/productos/:id - Eliminar un producto por ID[cite: 2]
app.delete("/api/productos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }

  productos.splice(index, 1);
  res.json({ mensaje: "Producto eliminado correctamente" });
});

// Iniciar servidor en el puerto 3000[cite: 1]
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});