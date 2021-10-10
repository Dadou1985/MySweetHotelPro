import React, {useState } from 'react'
import { Snackbar } from '@material-ui/core'
import { db } from '../../Firebase'


export default function NotificationsBar({message, markup}) {

    const [visible, setVisible] = useState(true)

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
