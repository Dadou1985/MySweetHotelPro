import React, {useState, useEffect, useContext } from 'react'
import PostIt from './postIt'
import CreateSticker from './createSticker'
import { FirebaseContext, db, auth } from '../../Firebase'


const StickList = () => {

    const [postIt, setPostIt] = useState([])
    const [user, setUser] = useState(auth.currentUser)

    const {userDB} = useContext(FirebaseContext)

    useEffect(() => {
        const stickerOnAir = () => {
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
                .collection('stickers')
                .where("author", "==", user.displayName)
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
            height: "45vh",
            marginBottom: "15%", 
            paddingLeft: "3vw"
        }}>
            {postIt.map(stick =>(
                <PostIt
                key={stick.markup}
                author={stick.author}
                text={stick.text}
                title={stick.title}
                assignee={stick.assignee}
                markup={stick.id}
                />
            ))}
            <div style={{
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                justifyContent: "center",
                height: "3vh",
                width: "1vw",
                marginTop: "5vh",
            }}>
            <CreateSticker />
            </div>
        </div>
    )
}

export default StickList