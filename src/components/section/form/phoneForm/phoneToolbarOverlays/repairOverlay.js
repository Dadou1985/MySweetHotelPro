import React, { useState, useEffect, useContext } from 'react'
import Repair from '../../../../../svg/repair.svg'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function RepairOverlay({userDB, user}) {
    const [issueQty, setIssueQty] = useState([])

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
                    setIssueQty(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div>
            <img src={Repair} alt="Lost and found" className="drawer_icons" onClick={()=>{navigate("/repair")}} />
            {issueQty.length > 0 && <span style={{
              borderRadius: "50%", 
              backgroundColor: "red", 
              position: "absolute", 
              width: "17%", 
              height: "6%", 
              color: "white", 
              textAlign: "center", 
              fontSize: "12px"}}>{issueQty.length}</span>}        
        </div>
    )
}

export default RepairOverlay
