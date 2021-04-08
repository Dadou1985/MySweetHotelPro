import React, {useState, useEffect, useContext } from 'react'
import { Snackbar } from '@material-ui/core'
import { FirebaseContext, db, auth } from '../../Firebase'


export default function NotificationsBar({message, markup}) {

    const [visible, setVisible] = useState(true)
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)
    
    const showNotification = () => {
        setVisible(true)
      }

    const removeNotifications = () => {
        setVisible(false)
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
            .doc(markup)
            .delete()
    }


    return (
        <Snackbar
        open={visible}
        onClose={removeNotifications}
        message={message}
        />
    )
}
