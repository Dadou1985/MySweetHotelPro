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
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
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

    const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

    return (
        <div>
            <StyledBadge badgeContent={issueQty.length} color="secondary">
                <img src={Repair} alt="Lost and found" className="drawer_icons" onClick={()=>{navigate("/repair")}} />
            </StyledBadge>
        </div>
    )
}

export default RepairOverlay
