import React, {useState, useEffect, useContext } from 'react'
import Message from './messageCommunizi'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FirebaseContext, db, auth } from '../../Firebase'


export default function ChatRoom({user, userDB, title}) {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const chatRoomOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('chat')
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
                    />
                ))}
            </PerfectScrollbar>
        </div>
    )
}
