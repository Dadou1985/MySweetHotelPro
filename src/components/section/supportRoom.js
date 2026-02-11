import React, {useState, useEffect, useContext } from 'react'
import Message from './messageSupport'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { db, FirebaseContext } from '../../Firebase'

export default function SupportRoom({title}) {
    const { user, userDB } = useContext(FirebaseContext)

    const [messages, setMessages] = useState([])

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
                   photo={flow.photo}
                    />
                ))}
            </PerfectScrollbar>
        </div>
    )
}
