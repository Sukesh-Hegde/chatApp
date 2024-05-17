
import express from 'express';
import {Server} from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connect } from './Config.js';
import { chatModel } from './chat.schema.js';
=======
const http=require("http");
const express=require("express");
const { URLSearchParams } = require("url");
>>>>>>> parent of e7846ec (updated)

const app = express();

<<<<<<< HEAD
// 1. Creating server using http.
const server = http.createServer(app);
=======
//1. creating server
const server=http.createServer(app);
const port=process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/index.html");
})

/* Sicket.io Setup */
>>>>>>> parent of e7846ec (updated)

// 2. Create socket server.
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:["GET", "POST"]
    }
});

// 3. Use socket events.

io.on('connection', (socket)=>{
    console.log("Connection is established");

    socket.on("join",(data)=>{
        // console.log(data);
        socket.username = data;
        // send old messages to the clients.
        chatModel.find().sort({ timestamp: 1 }).limit(50)
            .then(messages => {
                socket.emit('load_messages', messages);// sending messages back to client
            }).catch(err => {
                console.log(err);
            })
    })
    socket.on('new_message', (message)=>{
        //collecting username and message before broadcasting it
        let userMessage={
            username: socket.username,
            message:message
        }
        //saving the chats in DB
        const newChat = new chatModel({
            username: socket.username,
            message: message,
            timestamp: new Date()
        });
        newChat.save()

        //broadcast this message to all the clients.
        socket.broadcast.emit('broadcast_message',userMessage);//broadcasting the message that client send
    })

    socket.on('disconnect', ()=>{
        console.log("Connection is disconnected");
    })
});

server.listen(3000, ()=>{
    console.log("App is listening on 3000");
    connect();
})
