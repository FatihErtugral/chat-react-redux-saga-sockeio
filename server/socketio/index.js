"use strict";

const socketio = require('socket.io');
const { reactTex } = require('./startText');
const { rooms, userList, TestMsj, TestNick } = require('./list');
const ListOfUsersInRooms = require('./ListOfUsersInRooms');


const userListInRooms = new ListOfUsersInRooms();

const initializeSocketIO = (server) => {
   const io = socketio(server);

   io.on('connection', function (client) {

      function allClientSendRoomUsers(roomName) {
         io.to(roomName).emit('room_user_list', {
            [roomName]: userListInRooms.list[roomName]
         });
      };

      function autoJoinRoom(client, roomList) {
         let i = 0
         const interval = setInterval(() => {
            if (i < roomList.length) {
               client.join(roomList[i]);
               userListInRooms.importUser(roomList[i], client.nick);
               allClientSendRoomUsers(roomList[i]);
            }
            else clearInterval(interval);
            i++
         }, 100);
      };

      autoJoinRoom(client, rooms);
      console.log('connected user: ', client.id);

      // TODO: sunucunun atadığı ilk nicklerin benzeris olması sağlanmalı.
      client.nick = `Chat${Math.floor(Math.random() * 9000) + 1}`;

      client.emit('message', { nick: 'Server', roomName: client.id, message: reactTex });

      client.on('new_nick', async function userSearch(nick) {
         // Yeni kullanıcının Nick'i benzersiz olması için kontrol işlemi.
         const control = await !Object.values(userList).includes(nick);
         await client.emit('new_nick', {
            nick: control ? nick : client.nick,
            isNickUnique: control,
            nickWarning: control ? null : 'Bu nick başka kullanıcıya ait'
         });
         // Eğer kullanıcı listede yoksa, ekleme işlemi yapılır.
         if (control) {
            userList[client.id] = nick;
            userListInRooms.updateUser(nick, client.nick);
            client.nick = nick;
            // Değişen nick bütün kanallara bildirilir.
            let tempRoomList = userListInRooms.getUserRooms(client.nick);

            for (let i = 0; i < tempRoomList.length; i++) {
               allClientSendRoomUsers(tempRoomList[i])
            };
         }
      });

      client.on('join_room', async function (roomName) {
         await client.join(roomName);
         await userListInRooms.importUser(roomName, client.nick);
         allClientSendRoomUsers(roomName);
      });

      client.on('leave_room', async function (roomName) {
         if (userListInRooms.isRoom(roomName)) {
            await client.leave(roomName);
            await client.emit('leave_room', roomName);
            await userListInRooms.exportUser(roomName, client.nick);
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
         const name = Object.keys(userList).find(key => userList[key] === client.nick);
         delete userList[name];

         // Kullanıcı kanaldan ayrılınca, çıktığı kanallar kayıt altına alınıyor
         // Kayıt altına alınan kanallara abone olan Client'lara kullanıcının çıktığı bildiriliyor.
         let tempRoomList = userListInRooms.getUserRooms(client.nick);

         // Kullanıcı listeden silindikten sonra bildirim yapılıyor.
         userListInRooms.removeUser(client.nick);

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