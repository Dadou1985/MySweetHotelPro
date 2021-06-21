import React, {useState, useEffect, useContext } from 'react'
import { Snackbar } from '@material-ui/core'
import { FirebaseContext, db, auth } from '../../Firebase'


export default function NotificationsBar({message, markup}) {

    const [visible, setVisible] = useState(true)

    const { userDB, setUserDB, user } = useContext(FirebaseContext)
    
    const showNotification = () => {
        setVisible(true)
      }

    const removeNotifications = () => {
        setVisible(false)
        return db.collection('notifications')
            .doc(markup)
            .delete()
    }


    return (
        <Snackbar
        style={{textAlign: "center"}}
        open={visible}
        onClose={removeNotifications}
        message={message}
        />
    )
}
