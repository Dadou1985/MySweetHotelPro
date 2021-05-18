import React, { useState, useEffect, useContext } from 'react'
import Chat from '../../../../../svg/chat.png'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function ChatOverlay({userDB, user}) {
    const [chatRoomQty, setChatRoomQty] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
          return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('chat')
            .where("status", "==", true)
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                    const snapInfo = []
                  snapshot.forEach(function(doc) {          
                    snapInfo.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    console.log(snapInfo)
                    setChatRoomQty(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div>
            <img src={Chat} alt="Chat" className="drawer_icons" onClick={()=>{navigate("/chat")}} />
            {chatRoomQty.length > 0 && <span style={{
              borderRadius: "50%", 
              backgroundColor: "red", 
              position: "absolute", 
              width: "17%", 
              height: "20%", 
              color: "white", 
              textAlign: "center", 
              fontSize: "12px",
              }}>{chatRoomQty.length}</span>}
        </div>
    )
}

export default ChatOverlay
