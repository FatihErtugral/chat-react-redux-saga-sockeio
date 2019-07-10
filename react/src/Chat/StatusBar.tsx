import React from 'react';
import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




export default function StatusBar(props: any) {
   const { connect, nick, ping, isNickUnique, nickWarning, toggleList } = props;

   function handleMenu(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
      e.preventDefault();
      toggleList();
   }
   return (
      <div id="statusbar" >
         <div className="toggle-menu" onClick={handleMenu}>
            <FontAwesomeIcon icon={faListAlt} size="3x" />
         </div>

         <div className="statusbar-item">
            <small>
               <div>Nick: {nick}</div>
               <div>Ping: {ping}ms</div>
               <div>
                  <span>{connect}&nbsp;
                  <i id="connect">
                     <i id="ex-circle">
                        {connect === 'Connected'
                           ? <i style={{ background: '#1F813E' }} id="circle"></i>
                           : <i style={{ background: 'darkred' }} id="circle"></i>
                        }
                     </i>
                  </i>
                  </span>
               </div>
            </small>
         </div>
         <div className="statusbar-item"><h2>#İstanbul</h2></div>
         {/* <div className="statusbar-item">{isNickUnique ? '' : nickWarning}</div> */}

      </div>
   );
}
