import React, {useState, useEffect, useContext } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { db, FirebaseContext } from '../../Firebase'

export default function ChatRoom({title}) {
    const { user, userDB } = useContext(FirebaseContext)

    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState([])

    useEffect(() => {
        const chatRoomOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("chat")
            .doc(title)
            .collection("chatRoom")
            .orderBy("markup", "desc")
            .limit(50)
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
     },[title])

     useEffect(() => {
        const getChatRoom = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("chat")
            .where("title", "==", title)
        }

        let unsubscribe = getChatRoom().onSnapshot(function(snapshot) {
                    const snapInfo = []
                  snapshot.forEach(function(doc) {          
                    snapInfo.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    setChatRoom(snapInfo)
                });
                return unsubscribe
     },[])

    return (
        <div>
            <PerfectScrollbar style={{paddingTop: "3vh"}}>
                {user&& userDB&& messages.map((flow, key) => {
                    let language = userDB.language

                    if(userDB.language === chatRoom.guestLanguage) {
                        return <Message
                                key={key}
                                author={flow.author}
                                photo={flow.photo}
                                text={flow.text}
                                markup={flow.markup}
                                title={flow.title}
                            />
                    }else{
                        if(flow.translated){
                            return renderSwitch()
                         }
                    }

                    
                })}
            </PerfectScrollbar>
        </div>
    )
}