import React, {useState, useEffect } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { db } from '../../Firebase'
import { useTranslation } from "react-i18next"

export default function ChatRoom({user, userDB, title}) {

    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState([])
    const { t, i18n } = useTranslation()

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
                    console.log(snapInfo)
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
                    console.log(snapInfo)
                    setChatRoom(snapInfo)
                });
                return unsubscribe
     },[])

console.log(chatRoom)

    return (
        <div>
            <PerfectScrollbar style={{paddingTop: "3vh"}}>
                {user&& userDB&& messages.map((flow, key) => {
                    let language = userDB.language
                    const renderSwitch = () => {
                        switch(language) {
                            case 'en':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.en}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'ja':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.ja}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'ko':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.ko}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'pt':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.pt}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'ar':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.ar}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'it':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.it}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'es':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.es}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            case 'zh':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.zh}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                            default:
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.fr}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                               title={flow.title}
                                />
                        }
                    }

                    if(userDB.language === chatRoom.guestLanguage) {
                        return <Message                                 
                                key={key}
                                author={flow.author}
                                photo={flow.photo}
                                text={flow.text}
                                markup={flow.markup}
                                user={user}
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
