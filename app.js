const express = require('express');
const app = express();
const sql = require('mssql');
const conection = require('./conection');
const port = 3000;

app.use(express.json());

//Asignar turnos
app.post('/api/turnos', async (req, res) => {
    try {
        const { documento, tipo_turno, tipo_documento } = req.body;

        // Conectar a la base de datos
        await sql.connect(conection.config);

        // Obtener el último número de turno para ese tipo de turno
        const result = await sql.query`
            SELECT MAX(numero_turno) AS maxTurno
            FROM turnos
            WHERE tipo_turmo = ${tipo_turno}
        `;

        const ultimoNumero = result.recordset[0].maxTurno || 0;
        const nuevoNumero = ultimoNumero + 1;

        // Insertar el nuevo turno
        await sql.query`
            INSERT INTO turnos (documento, tipo_turmo, numero_turno, tipo_documento)
            VALUES (${documento}, ${tipo_turno}, ${nuevoNumero}, ${tipo_documento})
        `;

        res.status(200).json({
            mensaje: 'Turno asignado',
            numero_turno: nuevoNumero
        });

    } catch (error) {
        console.error('Error en /api/turnos:', error);
        res.status(500).json({ error: 'Error al asignar el turno' });
    }
});

// Obtener todos los turnos asignados
app.get('/api/turnos/todos', async (req, res) => {
    try {
        // Conectar a la base de datos
        await sql.connect(conection.config);

        // Obtener todos los turnos
        const result = await sql.query`
            SELECT *
            FROM turnos
        `;

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los turnos asignados' });
    }
});

//borrar un turno por ID
app.delete('/api/turnos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Conectar a la base de datos
        await sql.connect(conection.config);

        // Eliminar el turno
        await sql.query`
            DELETE FROM turnos
            WHERE id = ${id}
        `;

        res.status(200).json({ mensaje: 'Turno eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el turno' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});

