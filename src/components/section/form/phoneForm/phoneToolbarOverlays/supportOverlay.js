import React, { useState, useEffect } from 'react'
import Support from '../../../../../svg/support.svg'
import { db } from '../../../../../Firebase'
import { navigate } from 'gatsby'
import { fetchCollectionByMapping1 } from '../../../../../helper/globalCommonFunctions'

function SupportOverlay() {
  const [chatRoomQty, setChatRoomQty] = useState([])

  useEffect(() => {
      let unsubscribe = fetchCollectionByMapping1("assistance", "status", "==", true).onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });
        setChatRoomQty(snapInfo)
    });
    return unsubscribe
  },[]);

  return (
      <div>
          <img src={Support} alt="Support" className="drawer_icons" onClick={()=>{navigate("/support")}} />
          {chatRoomQty.length > 0 && <span style={{
            borderRadius: "50%", 
            backgroundColor: "red", 
            position: "absolute", 
            width: "15%", 
            height: "7%", 
            color: "white", 
            textAlign: "center", 
            fontSize: "12px",
            }}>{chatRoomQty.length}</span>}        
      </div>
  )
}

export default SupportOverlay
