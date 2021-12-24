import React, {useState, useEffect } from 'react'
import Message from './messageSupport'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { db } from '../../Firebase'
import { useTranslation } from "react-i18next"

export default function SupportRoom({user, userDB, title}) {

    const [messages, setMessages] = useState([])
    const { t, i18n } = useTranslation()

    useEffect(() => {
        const chatRoomOnAir = () => {
            return db.collection('assistance')
            .doc(title)
            .collection("chatRoom")
            .orderBy("markup", "desc")
        }

        let unsubscribe = chatRoomOnAir().onSnapshot(function(snapshot) {
                    const snapInfo = []
                  snapshot.forEach(function(doc) {          
                    snapInfo.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    console.log(snapInfo)
                    setMessages(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div>
            <PerfectScrollbar>
                {user&& userDB&& messages.map(flow => (
                    <Message 
                    author={flow.author}
                    text={flow.text}
                    date={flow.markup}
                   user={user}
                   userDB={userDB}
                   photo={flow.photo}
                    />
                ))}
            </PerfectScrollbar>
        </div>
    )
}
