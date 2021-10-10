import React, { useState, useEffect } from 'react'
import Timer from '../../../../../svg/timer.svg'
import { db } from '../../../../../Firebase'
import { navigate } from 'gatsby'

function ClockOverlay({userDB}) {
    const [demandQty, setDemandQty] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
          return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('clock')
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
                    setDemandQty(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div>
            <img src={Timer} alt="Timer" className="drawer_icons" onClick={()=>{navigate("/clock")}} />
            {demandQty.length > 0 && <span style={{
              borderRadius: "50%", 
              backgroundColor: "red", 
              position: "absolute", 
              width: "17%", 
              height: "6%", 
              color: "white", 
              textAlign: "center", 
              fontSize: "12px"}}>{demandQty.length}</span>}        
        </div>
    )
}

export default ClockOverlay
