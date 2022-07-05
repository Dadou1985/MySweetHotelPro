import React, { useState, memo } from 'react'
import { Snackbar } from '@material-ui/core'
import { db } from '../../Firebase'


const NotificationsBar = ({message, markup}) => {

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

export default memo(NotificationsBar)