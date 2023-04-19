
const express = require('express')
const http = require('http')
const path = require('path')
const {SerialPort}  = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')


const app = express();
app.set('PORT', 9000)
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, '../client/')))

server.listen(app.get('PORT'), ()=>{
    console.log("Servidor funciona", app.get('PORT'))
})

//Comuniación Socket
const io = require('socket.io')(server)

//Comunicación Serial

const port = new SerialPort({path:'COM4', baudRate: 9600})
const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

parser.on('data', (datos)=>{
    console.log(datos)
    io.emit('datos-giro', datos)
})