import React, {useState, useEffect, useContext } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FirebaseContext, db, auth } from '../../Firebase'
import { zhCN } from 'date-fns/locale'


export default function ChatRoom({user, userDB, title}) {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const chatRoomOnAir = () => {
            return db.collection('chatClient')
            .doc(userDB.hotelId)
            .collection("client")
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

console.log("")

    return (
        <div>
            <PerfectScrollbar>
                {user&& userDB&& messages.map(flow => {
                    let language = userDB.language
                    const renderSwitch = () => {
                        switch(language) {
                            case 'en':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.en}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'ja':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.ja}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'ko':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.ko}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'pt':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.pt}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'ar':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.ar}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'it':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.it}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'es':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.es}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'zh-CN':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.zhCN}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            case 'zh-TW':
                                return <Message 
                                author={flow.author}
                                text={flow.translated.zhTW}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                            default:
                                return <Message 
                                author={flow.author}
                                text={flow.translated.fr}
                                date={flow.markup}
                               user={user}
                               userDB={userDB}
                               photo={flow.photo}
                                />
                        }
                    }

                    if(flow.translated){
                       return renderSwitch()
                    }
                })}
            </PerfectScrollbar>
        </div>
    )
}
