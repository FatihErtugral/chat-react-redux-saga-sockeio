const express = require('express');
const socketIO = require('socket.io');
const app = express();
const server = app.listen(3005, () => console.log('sunucu çalıştı.'));
const io = socketIO(server);
const { reactTex } = require('./startText');

const userList = {
  'id': 'nick',
};
let rooms = [
  'performans',
  'istanbul',
  'ankara',
  'antalya',
  'izmir',
  'terkidağ',
  'almanya',
  'türkiye',
  'muğla',
  'çanakkale',
  'nodejs',
  'react',
  'redux',
  'angular',
  'google',
  'devoloper',
  'karadeniz',
  'rize',
  'zonguldak',
  'adana',
  'balıkesir',
  'sakarya',
  'amerika',
  'avusturalya',
  'fransa',
  'paris',
  'mars',
  'mekan',
  'jüpiter',
  'nebula',
  'kuasar',
  'blazar',
]

function UserListInRooms() {
  this.list = {};
  this.importUser = (room, nick) => {
    if (!Object.keys(this.list).includes(room))
      this.list[room] = [nick];
    if (!this.list[room].includes(nick))
      this.list[room].push(nick);
  };

  this.updateUser = (newNick, odlNick) => {
    Object.keys(this.list).map(room => {
      let index = this.list[room].indexOf(odlNick)
      this.list[room][index] = newNick;
    });

  };

  this.exportUser = (room, nick) => {
    if (typeof this.list[room] !== undefined) {

      if (this.list[room].includes(nick))
        this.list[room] = this.list[room].filter(e => e !== nick);

      if (this.list[room].length === 0)
        delete this.list[room];
    }
  };

  this.removeUser = (nick) => {
    Object.keys(this.list).map(room => {
      this.list[room] = this.list[room].filter(e => e !== nick)
      if (this.list[room].length === 0)
        delete this.list[room];
    });
  };

  this.getUserRooms = (nick) => {
    let userRoomList = [];
    Object.keys(this.list).map(room =>
      this.list[room].filter(id => {
        if (id === nick)
          userRoomList.push(room);
      }));
    return userRoomList;
  };
  this.isRoom = (roomName) => {
    return this.list.hasOwnProperty(roomName);
  };

};

const userListInRooms = new UserListInRooms();

// bir client eventinin içinde tekrar clienti nesnesini kullanarak
// emit işlemi yaparsanız, sadece isteği yapan cliente yayın yapılmış olur.
// aynı şekilde io nesnesini kullanarak >>> 'io.to(`${client.id}`).emit'
// sadece istek yapan cliente geri dönüş yapılmış oluyor.

//*eventlerde asenkron fonksiyon kullanıldığına dikkat edin.

io.on('connection', function (client) {

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
        let roomName = tempRoomList[i];
        io.to(roomName).emit('room_user_list', {
          [roomName]: userListInRooms.list[roomName]
        });
      };
    }
    else {

    }
    console.log('client nick ', client.nick);

  });


  function autoJoinRoom(client, roomList) {
    let i = 0
    const interval = setInterval(()=> {
      if (i < roomList.length) {
        client.join(roomList[i]);
        userListInRooms.importUser(roomList[i], client.nick);
        allClientSendRoomUsers(roomList[i]);
      }
      else clearInterval(interval);
      i++
    }, 100)
  }

  function allClientSendRoomUsers(roomName) {
    io.to(roomName).emit('room_user_list', {
      [roomName]: userListInRooms.list[roomName]
    });
  };

  autoJoinRoom(client, rooms)

  client.on('join_room', async function (roomName) {
    await client.join(roomName);
    await userListInRooms.importUser(roomName, client.nick);
    allClientSendRoomUsers(roomName);
  });

  client.on('leave_room', async function (roomName) {
    if(userListInRooms.isRoom(roomName)){
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
const msj = [
  'Reprehenderit harum quam dicta debitis Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore, animi nulla laboriosam, qui sit dolores temporibus aspernatur ducimus voluptate iste, nostrum sequi. Earum optio ipsum, cupiditate omnis voluptates facilis exercitationem.',
  'Eius dolorum incidunt consequuntur labor ',
  'Lorem ipsum dolor sit amet consectetur a',
  'Lorem ipsum dolor sit amet consectetur'
]

const nick = [
  'bugs bunny',
  'daffy duck',
  'Tweety',
  '⸨ boom ⸩'
]
let i = 0;
setInterval(() => {
  io.in('performans').emit('message', { message: msj[i], nick: nick[i], roomName: 'performans' });
  i++;
  if (i == 4) i = 0;

}, 1060);
