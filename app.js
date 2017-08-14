var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(process.env.PORT || 2000);
console.log("Server started.");
 
var SOCKET_LIST = {};
var PLAYER_LIST = {};
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
class Player{
    
    constructor(id){
            this.x = 1920 / 2;
            this.y = 1080 / 2;
            this.id = id;
            this.number = "" + Math.floor(10 * Math.random());
            this.pressingRight=false;
            this.pressingLeft=false;
            this.pressingUp=false;
            this.pressingDown=false;
            this.maxSpd=5;
            this.direction = 0;
            this.frame = 0;
            this.updatePosition = function(){
                if(this.pressingRight || this.pressingLeft || this.pressingUp || this.pressingDown){
                    this.frame += 0.1;
                    if(this.frame > 4){
                        this.frame = 0;
                    }
                } else {
                    this.frame = 0;
                }
                if(this.pressingRight){
                    this. x += this.maxSpd;
                    this.direction = 3;
                }
                if(this.pressingLeft){
                    this.x -= this.maxSpd;
                    this.direction = 1;
                }
                if(this.pressingUp){
                    this.y -= this.maxSpd;
                    this.direction = 2;
                }
                if(this.pressingDown){
                    this.y += this.maxSpd;
                    this.direction = 0;
                }
            }
    }
    
}
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
 
    var player = new Player(socket.id);
    socket.emit('ownId', {id:socket.id});
    PLAYER_LIST[socket.id] = player;
   
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
   
    socket.on('keyPress',function(data){
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        else if(data.inputId === 'up')
            player.pressingUp = data.state;
        else if(data.inputId === 'down')
            player.pressingDown = data.state;
    });
   
   
});
 
setInterval(function(){
    var pack = [];
    for(var i in PLAYER_LIST){
        var player = PLAYER_LIST[i];
        player.updatePosition();
        pack.push({
            x:player.x,
            y:player.y,
            frame:player.frame,
            id:player.id,
            direction:Math.floor(player.direction),
            
        });    
    }
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions',pack);
    }
   
   
   
},1000/60);