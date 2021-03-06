import React, {useState, useEffect, useContext } from 'react'
import NotificationsBar from './notificationsBar'
import { FirebaseContext, db } from '../../Firebase'

export default function Notifications() {

    const [info, setInfo] = useState([])

    const {userDB} = useContext(FirebaseContext)


    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('notifications')
            .where("hotelId", "==", userDB.hotelId)
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                    const snapStick = []
                  snapshot.forEach(function(doc) {          
                    snapStick.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    })
                    
                    setInfo(snapStick)
                });
                return unsubscribe
                
           
     },[])

    return (
        <>
            {info.map(stick => (
                <NotificationsBar
                message={stick.content}
                key={stick.markup}
                markup={stick.id}
              />
            ))}
        </>
    )
}
