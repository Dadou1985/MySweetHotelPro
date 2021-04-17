import React, { useState, useEffect, useContext } from 'react'
import RoomChange from '../../../../../svg/logout.svg'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function RoomChangeOverlay({userDB, user}) {
    const [demandQty, setDemandQty] = useState([])

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
            .collection('roomChange')
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
            <StyledBadge badgeContent={demandQty.length} color="secondary">
                <img src={RoomChange} alt="Room change" className="drawer_icons" onClick={()=>{navigate("/maid")}} />
            </StyledBadge>
        </div>
    )
}

export default RoomChangeOverlay
