const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

//uuid is the unique user id to create random rooms in our zoom
const { v4: uuidv4 } = require('uuid') //we import a unique version of uuid here v4


// function jeet(){
//     console.log('hello');
//     return "hello_brother";
// }

app.set('view engine', 'ejs');
app.use(express.static('public'))


app.use('/peerjs', peerServer)

//the below 8 line is the method to provide room id in the url

app.get('/', (req, res) => {

    // res.redirect(`/${jeet()}`); //this will write the function jeet in the url
    res.redirect(`/${uuidv4()}`); //redirect to the given id from the uuidv4
})


app.get('/:room', (req, res) => { //here room is just the parameter a variable (denoted by the : symbol) where we store the room id this room variable is given for the uuvid4 i.e after redirecting come to this get request and render it
    res.render('room', { roomId: req.params.room }); //roomId is just a variable given to call this id in the ejs file
})




io.on('connection', socket => { //this will just accept the request coming from the script.js
    socket.on('join-room', (roomId, userId) => { //when user join the room
        // console.log(roomId);
        socket.join(roomId)//when new user joins
        // socket.to(roomId).broadcast.emit('user-connected') //this will broadcast that the user is connected to all the other user in the room
        socket.broadcast.to(roomId).emit('user-connected', userId) //this will broadcast that the user is connected to all the other user in the room
        socket.on('message', message => {
            io.to(roomId).emit('createMsg', message)
        })
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

})

    const hostname = '127.0.0.1';
    const port = 8000;
    server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
