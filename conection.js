const sql = require('mssql');

const config = {
    user: 'sa',
    password: '12345678',
    server: 'DESKTOP-NS8GI9E',
    database: 'db_turnos',
    options: {
    encrypt: true,             
    trustServerCertificate: true
  }
}

async function connect() {
    try{
        await sql.connect(config);
        console.log('Conectado a la Base de Datos');
    }catch(err){
        console.error('Error al conectar a la Base de Datos:', err);
    }
}

connect();