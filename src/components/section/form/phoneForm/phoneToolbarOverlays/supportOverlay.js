import React, { useState, useEffect, useContext } from 'react'
import Support from '../../../../../svg/support.svg'
import { db, auth } from '../../../../../Firebase'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import { navigate } from 'gatsby'

function SupportOverlay() {
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
                    setChatRoomQty(snapInfo)
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
            <StyledBadge badgeContent={chatRoomQty.length} color="secondary">
                <img src={Support} alt="Support" className="drawer_icons" onClick={()=>{navigate("/support")}} />
            </StyledBadge>
        </div>
    )
}

export default SupportOverlay
