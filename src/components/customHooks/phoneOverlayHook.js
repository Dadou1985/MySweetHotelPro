import React, { useState, useEffect } from 'react'
import Cab from '../../svg/taxi.svg'
import Clock from '../../svg/timer.svg'
import Maintenance from '../../svg/repair.svg'
import Chat from '../../svg/chat.png'
import RoomChange from '../../svg/logout.svg'

import { db } from '../../Firebase'
import { navigate } from 'gatsby'

function PhoneOverlayHook({userDB, category, index}) {
    const [quantity, setQuantity] = useState([])
    const imgSrc = [Cab, Clock, Maintenance, Chat, RoomChange]

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
              .doc(userDB.hotelId)
              .collection(category)
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
                    setQuantity(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div>
            <img src={imgSrc[index]} alt={category} className="drawer_icons" onClick={()=>{navigate(`/${category}`)}} />
            {quantity.length > 0 && <span style={{
              borderRadius: "100%", 
              backgroundColor: "red", 
              position: "absolute", 
              width: "17%",
              marginLeft: "1vw", 
              color: "white", 
              textAlign: "center", 
              fontSize: "12px"}}>{quantity.length}</span>}
        </div>
    )
}

export default PhoneOverlayHook
