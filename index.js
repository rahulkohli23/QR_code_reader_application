const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const c = require('chalk');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const socketio = require('socket.io');

const app = express();
var upload = multer({ dest: 'uploads/' });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(multer().array());

const port = 3200;

var server = app.listen(port, () => {
    console.log(c.blue(`server started @@ port :: ${c.white(port)}`))
})

const io = socketio(server);
io.on('connection', socket => {
    console.log(c.blue('WS Connection ON !'))
})

io.on('disconnect', () => {
    console.log(c.cyan('WS Connection Disconnected'))
})


app.post('/getQRData', upload.single('qrCode'), async (req, res, next) => {
    if (!req.file) {
        console.error(c.red('-- User Attempt to read a black file --'))
        io.emit('error','Please Upload the file. and try again !')
        return;
    }
    console.log(c.yellow(`File Size : ${req.file.size / 1000} KB`))
    var buffer = fs.createReadStream(path.join(__dirname, req.file.path))
    let form = new FormData();
    form.append('file', buffer);

    fetch('http://api.qrserver.com/v1/read-qr-code/', { method: 'POST', body: form })
        .then(res => res.json())
        .then(json => {
            if (!json[0].symbol[0].error) {
                console.log('emiting event')
                io.emit('response',json[0].symbol[0].data)
            }
            else {
                console.log('emiting Error')
                io.emit('error', json[0].symbol[0].error)
            }
        })
        .catch(error => console.log(JSON.stringify(error)))

        return ;
})
