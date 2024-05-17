

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
