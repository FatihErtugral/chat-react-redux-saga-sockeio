class ListOfUsersInRooms {
   constructor() {
      this.list = {}
   }

   importUser(room, nick) {
      if (!Object.keys(this.list).includes(room))
         this.list[room] = [nick];
      if (!this.list[room].includes(nick))
         this.list[room].push(nick);
   };

   updateUser(newNick, odlNick) {
      Object.keys(this.list).map(room => {
         let index = this.list[room].indexOf(odlNick)
         this.list[room][index] = newNick;
      });

   };

   exportUser(room, nick) {
      if (typeof this.list[room] !== undefined) {

         if (this.list[room].includes(nick))
            this.list[room] = this.list[room].filter(e => e !== nick);

         if (this.list[room].length === 0)
            delete this.list[room];
      }
   };

   removeUser(nick) {
      Object.keys(this.list).map(room => {
         this.list[room] = this.list[room].filter(e => e !== nick)
         if (this.list[room].length === 0)
            delete this.list[room];
      });
   };

   getUserRooms(nick) {
      let userRoomList = [];
      Object.keys(this.list).map(room =>
         this.list[room].filter(id => {
            if (id === nick)
               userRoomList.push(room);
         }));
      return userRoomList;
   };

   isRoom(roomName) {
      return this.list.hasOwnProperty(roomName);
   };
}

module.exports = ListOfUsersInRooms