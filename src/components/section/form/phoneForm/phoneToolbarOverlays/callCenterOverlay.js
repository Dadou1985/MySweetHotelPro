import React, { useState, useEffect } from 'react'
import Assistance from '../../../../../svg/support-technique.svg'
import { db } from '../../../../../Firebase'
import { navigate } from 'gatsby'
import Bubble from "../../../../../svg/bubble.svg"
import { StaticImage } from 'gatsby-plugin-image'
import { fetchCollectionByMapping1, handleUpdateData1 } from '../../../../../helper/globalCommonFunctions'

function CallCenterOverlay({userDB}) {
    const [chatRoomQty, setChatRoomQty] = useState([])

    useEffect(() => {
      let unsubscribe = fetchCollectionByMapping1("assistance", "hotelId", "==", "06nOvemBre198524SEptEMbrE201211noVEMbre20171633323179047").onSnapshot(function(snapshot) {
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
     
    const newData = {adminSpeak: false}

    return (
        <div>
          <img src={Assistance} alt="Support" className="drawer_icons" onClick={()=>{
            handleUpdateData1('assistance', userDB.hotelName, newData)
            navigate("/assistance")
            }} />
            {chatRoomQty.map(status => {
                  if(status.adminSpeak) {
                    return <StaticImage objectFit='contain' src="../../../../../svg/bubble.svg" style={{
                      borderRadius: "50%", 
                      backgroundColor: "magenta", 
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
