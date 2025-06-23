const express =require('express');
const dotenv = require('dotenv');
const chats  = require('./data/data');
const cors = require("cors");
const connectDB = require('./config/db');
const colors = require('colors');
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const userRoutes = require('./routes/userRoutes');


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/',(req,res)=>{
    res.send('API is running great');
});

app.use('/api/user',userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes)

const PORT = process.env.PORT || 5000;

const server= app.listen(5000,console.log(`Server is running on port ${PORT}`.blue.bold));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.on('connection', (socket) => {
    console.log("New connection is established");
    socket.on( "setup", (userData) => {
        socket.join(userData._id);
        //console.log(userData._id);
        socket.emit("connected"); 

    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room", room);
    });

    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;
            
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userData._id);
    });
});