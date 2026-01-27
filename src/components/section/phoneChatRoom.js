import React, {useState, useEffect } from 'react'
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

    //  const renderSwitch = (flow, key) => {
    //     switch(userDB.language) {
    //         case 'en':
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.en}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //         case 'de':
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.de}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //         case 'pt':
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.pt}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //         case 'it':
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.it}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //         case 'es':
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.es}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //         case 'fr':
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.fr}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //         default:
    //             return <Message 
    //             key={key}
    //             author={flow.author}
    //             translation={flow.translated.fr}
    //             date={flow.markup}
    //            user={user}
    //            userDB={userDB}
    //            photo={flow.photo}
    //            title={flow.title}
    //             />
    //     }
    // }

    return (
        <div>
            <PerfectScrollbar style={{paddingTop: "3vh"}}>
                {user&& userDB&& messages.map((flow, key) => {
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
                         }
                    }

                    
                })}
            </PerfectScrollbar>
        </div>
    )
}