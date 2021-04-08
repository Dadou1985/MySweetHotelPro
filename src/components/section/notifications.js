import React, {useState, useEffect, useContext } from 'react'
import NotificationsBar from './notificationsBar'
import { FirebaseContext, db, auth } from '../../Firebase'

export default function Notifications() {

    const [info, setInfo] = useState([])
    const [user, setUser] = useState(auth.currentUser)

    const {userDB} = useContext(FirebaseContext)


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
            .collection('notification')
            .orderBy("markup", "asc")
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                    const snapStick = []
                  snapshot.forEach(function(doc) {          
                    snapStick.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    })
                    console.log(snapStick)
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
