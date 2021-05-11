import React, {useState, useEffect, useContext } from 'react'
import { FirebaseContext, db, auth } from '../../../Firebase'
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';


export default function BadgeMaker({item, children}) {
    const [data, setData] = useState([])

    const { userDB, setUserDB } = useContext(FirebaseContext)


    useEffect(() => {
        const listOnAir = () => {
          return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('housekeeping')
          .doc("item")
          .collection(item)
        }
    
        let unsubscribe = listOnAir().onSnapshot(function(snapshot) {
                    const snapInfo = []
                  snapshot.forEach(function(doc) {          
                    snapInfo.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    console.log(snapInfo)
                    sessionStorage.setItem(item, snapInfo.length)
                    setData(snapInfo)
                });
                return unsubscribe
           
     },[item])

     

     const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);


    return (
        <StyledBadge badgeContent={data.length} color="secondary">
            {children}
        </StyledBadge>
    )
}
