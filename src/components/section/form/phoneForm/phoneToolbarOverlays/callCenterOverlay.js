import React, { useState, useEffect, useContext } from 'react'
import Assistance from '../../../../../svg/support-technique.svg'
import { db, auth } from '../../../../../Firebase'
import { navigate } from 'gatsby'
import Bubble from "../../../../../svg/bubble.svg"

function CallCenterOverlay({user, userDB}) {
    const [chatRoomQty, setChatRoomQty] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('business')
            .doc('collection')
            .collection("assistance")
            .where("hotelName", "==", userDB.hotelName)
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

     const updateAdminSpeakStatus = () => {
      return db.collection('mySweetHotel')
      .doc('country')
      .collection('France')
      .doc('collection')
      .collection('business')
      .doc('collection')
      .collection('assistance')
      .doc(userDB.hotelName)
      .update({
          adminSpeak: false,
      })      
    }

    return (
        <div style={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "center"
        }}>
          <img src={Assistance} alt="Support" className="drawer_icons" onClick={()=>{
            updateAdminSpeakStatus()
            navigate("/assistance")
            }} />
            {chatRoomQty.map(status => {
                  if(status.adminSpeak) {
                    return <img src={Bubble} style={{width: "20%"}} />
                  }
                })}
        </div>
    )
}

export default CallCenterOverlay
