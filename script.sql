CREATE DATABASE IF NOT EXISTS api_practica;
USE api_practica;

CREATE TABLE IF NOT EXISTS productos (

    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL
);

INSERT INTO productos (nombre, precio) VALUES
("Laptop", 1200.00),
("Mouse", 25.00),
("Teclado", 45.00);