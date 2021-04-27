import React, {useState, useContext } from 'react'
import { Snackbar } from '@material-ui/core'
import { FirebaseContext, db } from '../../Firebase'


export default function NotificationsBar({message, markup}) {

    const [visible, setVisible] = useState(true)

    const { userDB } = useContext(FirebaseContext)


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
            .collection('notifications')
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
