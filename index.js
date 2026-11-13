const express = require("express");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware obligatorio para parsear JSON en las peticiones
app.use(express.json());

// Ruta base
app.get("/", (req, res) => {
  res.send("Servidor en línea y conectado a MySQL");
});

// 1. GET /api/productos - Obtener todos los productos desde MySQL
app.get("/api/productos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM productos");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
});

// 2. GET /api/productos/:id - Obtener un producto por ID desde MySQL
app.get("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
});

// 3. POST /api/productos - Insertar un nuevo producto en MySQL
app.post("/api/productos", async (req, res) => {
  try {
    const body = req.body || {};
    const nombre = body.nombre;
    const precio = body.precio;

    if (!nombre || precio === undefined) {
      return res.status(400).json({ mensaje: "Faltan datos obligatorios: nombre y precio" });
    }

    const [resultado] = await db.query(
      "INSERT INTO productos (nombre, precio) VALUES (?, ?)",
      [nombre, precio]
    );

    const nuevoProducto = {
      id: resultado.insertId,
      nombre,
      precio
    };

    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
});

// 4. PUT /api/productos/:id - Actualizar un producto existente en MySQL
app.put("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    const body = req.body || {};
    const nombre = body.nombre || rows[0].nombre;
    const precio = body.precio !== undefined ? body.precio : rows[0].precio;

    await db.query(
      "UPDATE productos SET nombre = ?, precio = ? WHERE id = ?",
      [nombre, precio, id]
    );

    res.status(200).json({ id, nombre, precio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
});

// 5. DELETE /api/productos/:id - Eliminar un producto en MySQL
app.delete("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [resultado] = await db.query("DELETE FROM productos WHERE id = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error interno del servidor", error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});