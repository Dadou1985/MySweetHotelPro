import React, { useState, useEffect, useContext } from 'react'
import PostIt from './postIt'
import CreateSticker from './createSticker'
import { db } from '../../Firebase'
import { FirebaseContext } from '../../Firebase'

const StickList = () => {

    const [postIt, setPostIt] = useState([])
    const {userDB} = useContext(FirebaseContext)

    useEffect(() => {
        const stickerOnAir = () => {
            return db.collection('hotels')
                .doc(userDB.hotelId)
                .collection('stickers')
        }

        let unsubscribe = stickerOnAir().onSnapshot(function(snapshot) {
                    const snapStick = []
                  snapshot.forEach(function(doc) {          
                    snapStick.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    })
                    console.log(snapStick)
                    setPostIt(snapStick)
                });
                return unsubscribe
           
     },[])
     
    return (
        <div style={{
            display: "flex",
            flexFlow: "row wrap",
            alignItems: "flex-start",
            width: "95%",
            maxHeight: "85%",
            paddingLeft: "3vw",
        }}>
            {postIt.map(stick =>(
                <PostIt
                key={stick.markup}
                author={stick.author}
                text={stick.text}
                title={stick.title}
                markup={stick.id}
                userDB={userDB}
                />
            ))}
            {postIt.length < 23 && <div style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                justifyContent: "center",
                height: "3vh",
                width: "1vw",
                marginTop: "3vh",
            }}>
            {userDB && <CreateSticker userDB={userDB} />}
            </div>}
        </div>
    )
}

export default StickList