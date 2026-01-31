import React, {useState, useEffect, useMemo } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { db } from '../../Firebase'

export default function ChatRoom({user, userDB, title}) {

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

     const renderSwitch = (flow) => {
        switch(userDB?.language) {
            case 'en':
                return flow?.translated?.en
            case 'pt':
                return flow?.translated?.pt
            case 'de':
                return flow?.translated?.de
            case 'it':
                return flow?.translated?.it
            case 'es':
                return flow?.translated?.es
            case 'fr':
                return flow?.translated?.fr
            default:
                return userDB?.language
        }
    }

    const lastMessage = useMemo(() => messages?.length > 0 && messages.filter((msg,idx) => msg.title !== messages[idx - 1]?.title), [messages])
    console.log("*****************", lastMessage && lastMessage)

    return (
        <div>
            <PerfectScrollbar style={{paddingTop: "3vh"}}>
                {user && userDB && messages.map((flow, key) => {
                    const checkLastMessage = lastMessage.includes(flow)
                    if(userDB.language === chatRoom.guestLanguage) {
                        return <Message                                 
                                key={key}
                                author={flow.author}
                                photo={flow.photo}
                                text={flow.text}
                                markup={flow.markup}
                                user={user}
                                title={flow.title}
                                lastMessage={checkLastMessage && true}
                            />
                    }else{
                        if(flow.translated){
                            return <Message 
                            key={key}
                            author={flow.author}
                            translation={renderSwitch(flow)}
                            date={flow.markup}
                           user={user}
                           userDB={userDB}
                           photo={flow.photo}
                           title={flow.title}
                           lastMessage={checkLastMessage && true} />
                         }
                    }

                    
                })}
            </PerfectScrollbar>
        </div>
    )
}