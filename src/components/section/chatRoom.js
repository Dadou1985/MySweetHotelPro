import React, {useState, useEffect } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { 
    fetchCollectionByMapping2,
    fetchCollectionBySorting3
} from '../../helper/globalCommonFunctions'

export default function ChatRoom({user, userDB, title}) {
    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState([])

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting3("hotels", userDB.hotelId, "chat", title, "chatRoom", "markup", "desc", 50).onSnapshot(function(snapshot) {
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
        let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "chat", "title", "==", title).onSnapshot(function(snapshot) {
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
                            case 'de':
                                return <Message 
                                key={key}
                                author={flow.author}
                                translation={flow.translated.de}
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
                            case 'fr':
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
