"use strict";

const socketio = require('socket.io');

const { reactTex } = require('./startText');
const { rooms, TestMsj, TestNick } = require('./list');
const { SeverUserList } = require("./SeverUserList");
const { ListOfUsersInRooms } = require('./ListOfUsersInRooms');

const listOfUsersInRooms = new ListOfUsersInRooms();
const serverUserList = new SeverUserList();

const initializeSocketIO = (server) => {
   const io = socketio(server);

   io.on('connection', function (client) {

      // Auxiliary functions.
      function allClientSendRoomUsers(roomName) {
         io.to(roomName).emit('room_user_list', {
            [roomName]: listOfUsersInRooms.list[roomName]
         });
      };

      function autoJoinRoom(client, roomList) {
         let i = 0
         const interval = setInterval(() => {
            if (i < roomList.length) {
               client.join(roomList[i]);
               listOfUsersInRooms.importUser(roomList[i], client.nick);
               allClientSendRoomUsers(roomList[i]);
            }
            else clearInterval(interval);
            i++
         }, 100);
      };
      /////////////////////////////////////////////


      // TODO: sunucunun atadığı ilk nicklerin benzeris olması sağlanmalı.
      client.nick = `Chat${Math.floor(Math.random() * 9000) + 1}`;

      console.log('connected user: ', client.nick);

      serverUserList.addNick(client.nick);
      autoJoinRoom(client, rooms);

      client.emit('new_nick', { nick: client.nick, nickWarning: '' });

      client.emit('message', { nick: 'Server', roomName: client.id, message: reactTex });

      client.on('new_nick', async function (newNick) {
         const { nick, info } = await serverUserList.updateNick(newNick, client.nick);
         await client.emit('new_nick', { nick, nickWarning: info });
         listOfUsersInRooms.updateUser(nick, client.nick);
         client.nick = nick;

         let tempRoomList = listOfUsersInRooms.getUserRooms(client.nick);
         for (let i = 0; i < tempRoomList.length; i++) {
            allClientSendRoomUsers(tempRoomList[i])
         };
      });

      client.on('join_room', async function (roomName) {
         await client.join(roomName);
         await listOfUsersInRooms.importUser(roomName, client.nick);
         allClientSendRoomUsers(roomName);
      });

      client.on('leave_room', async function (roomName) {
         if (listOfUsersInRooms.isRoom(roomName)) {
            await client.leave(roomName);
            await client.emit('leave_room', roomName);
            await listOfUsersInRooms.exportUser(roomName, client.nick);
            allClientSendRoomUsers(roomName);
         }
      });

      client.on('message', async function (data) {
         const { roomName } = await data;
         await io.in(roomName).emit('message', data);
      });

      client.on('disconnect', async function () {
         console.log('disconnected user: ', client.nick);
         // Sunucudan ayrılan kullanıcıyı, kullanıcı listesinden çıkarma işlemi
         serverUserList.removeNick(client.nick);
         // Kullanıcı kanaldan ayrılınca, çıktığı kanallar kayıt altına alınıyor
         // Kayıt altına alınan kanallara abone olan Client'lara kullanıcının çıktığı bildiriliyor.
         let tempRoomList = listOfUsersInRooms.getUserRooms(client.nick);
         // Kullanıcı listeden silindikten sonra bildirim yapılıyor.
         listOfUsersInRooms.removeUser(client.nick);

         for (let i = 0; i < tempRoomList.length; i++) {
            let roomName = tempRoomList[i];
            allClientSendRoomUsers(roomName);
         };
         client.disconnect(true);
      });

      client.on('error', function (err) {
         console.log('received error from client:', client.nick)
         console.log(err)
      });
   });

   // Performnas testi için yapay mesajlar
   let i = 0;
   setInterval(() => {
      io.in('performans').emit('message', { message: TestMsj[i], nick: TestNick[i], roomName: 'performans' });
      i++;
      if (i == 4) i = 0;

   }, 560);
}

module.exports = initializeSocketIO;