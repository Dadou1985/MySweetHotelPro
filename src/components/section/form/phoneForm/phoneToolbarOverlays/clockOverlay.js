import React, { useState, useEffect, useContext } from 'react'
import Timer from '../../../../../svg/timer.svg'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function ClockOverlay({userDB, user}) {
    const [demandQty, setDemandQty] = useState([])

    useEffect(() => {
        const toolOnAir = () => {
          return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('maintenance')
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
                <img src={Timer} alt="Timer" className="drawer_icons" onClick={()=>{navigate("/clock")}} />
            </StyledBadge>
        </div>
    )
}

export default ClockOverlay
