import React from 'react';

export default function StatusBar({ connect, nick, ping, isNickUnique, nickWarning }: any) {
   return (
      <div id="statusbar">
         <span className="statusbar-item">Nick: {nick}</span>
         <span className="statusbar-item" style={{ float: "right" }}>
            {connect}&nbsp;&nbsp;&nbsp;
            <span id="connect">
               <i id="ex-circle">
                  {connect === 'Connected'
                     ? <i style={{ backgroundColor: '#1F813E' }} id="circle"></i>
                     : <i style={{ backgroundColor: 'darkred' }} id="circle"></i>
                  }
               </i>
            </span>
         </span>
         <span
            className="statusbar-item"
            style={{ float: "right" }}
         >Ping : {ping}ms</span>

         {isNickUnique ? '' : <>{nickWarning}</>}
      </div>
   );
}
