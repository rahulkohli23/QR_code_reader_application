const socket = io();
const loadingDiv = document.getElementById('loadingDiv');

socket.on('response', response => {
    console.log('response recieved')
    outputMessage(response,'response');
})

socket.on('error', error => {
    outputMessage(error,'error')
})


function outputMessage(message,type) {
    const titleDiv = document.getElementById('responseTitle');
    const responseDiv = document.getElementById('responseDiv');
    titleDiv.innerHTML = type
    responseDiv.innerHTML = message;
    loadingDiv.style.display = "none"
    stop();
}