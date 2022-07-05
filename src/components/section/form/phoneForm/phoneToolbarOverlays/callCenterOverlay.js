import React, { useState, useEffect, useContext } from 'react'
import Assistance from '../../../../../svg/support-technique.svg'
import { db } from '../../../../../Firebase'
import { navigate } from 'gatsby'
import Bubble from "../../../../../svg/bubble.svg"
import { FirebaseContext } from '../../../../../Firebase'

function CallCenterOverlay() {
    const [chatRoomQty, setChatRoomQty] = useState([])
    const {user, userDB} = useContext(FirebaseContext)

    useEffect(() => {
        const toolOnAir = () => {
          return db.collection("assistance")
          .where("hotelId", "==", "06nOvemBre198524SEptEMbrE201211noVEMbre20171633323179047")
        }

        let unsubscribe = userDB && toolOnAir().onSnapshot(function(snapshot) {
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
     },[])
     

     const updateAdminSpeakStatus = () => {
      return db.collection('assistance')
            .doc(userDB && userDB.hotelName)
            .update({
                adminSpeak: false,
            })      
    }

    return (
        <div>
          <img src={Assistance} alt="Support" className="drawer_icons" onClick={()=>{
            updateAdminSpeakStatus()
            navigate("/assistance")
            }} />
            {chatRoomQty.map(status => {
                  if(status.adminSpeak) {
                    return <img src={Bubble} style={{
                      borderRadius: "50%", 
                      backgroundColor: "red", 
                      position: "absolute", 
                      width: "17%", 
                      height: "6%", 
                      color: "white", 
                      textAlign: "center", 
                      fontSize: "12px"}} />
                  }else{}
                })}
        </div>
    )
}

export default CallCenterOverlay
