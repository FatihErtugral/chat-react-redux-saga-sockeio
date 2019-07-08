/**
 * LIST DATA STRUCTURE
 *
 * list = [client1.nick, client2.nick client3.nick]
*/
class SeverUserList {
   constructor() {
      this.list = [];
   }
   addNick(nick) {
      let cntrl = this.list.includes(nick);
      if (cntrl)
         return { nick, info: 'Bu nick başkasına ait' };
      this.list.push(nick);
      return { nick, info: '' };
   }
   removeNick(nick) {
      let cntrl = this.list.includes(nick);
      if (!cntrl)
         return console.error('nick silerken hata oluştu');
      let index = this.list.indexOf(nick);
      this.list.splice(index, 1);
      return;
   }
   updateNick(newNick, oldNick) {
      let oldCntrl = (this.list).includes(oldNick); // true
      let newCntrl = (this.list).includes(newNick); // false
      console.log(oldCntrl, newCntrl);
      if (oldCntrl && !newCntrl) {
         let index = this.list.indexOf(oldNick);
         this.list.splice(index, 1);
         this.list.push(newNick);
         return { nick: newNick, info: '' };
      }
      return { nick: oldNick, info: 'Bu nick başkasın ait.' };
   }
}
exports.SeverUserList = SeverUserList;
