import React, { useState, useEffect, useContext } from 'react'
import Taxi from '../../../../../svg/taxi.svg'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function CabOverlay({userDB, user}) {
    const [demandQty, setDemandQty] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotel')
              .doc(userDB.hotelId)
              .collection('cab')
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
            <img src={Taxi} alt="Lost and found" className="drawer_icons" onClick={()=>{navigate("/cab")}} />
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

export default CabOverlay
