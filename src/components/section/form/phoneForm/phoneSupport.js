import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Send from '../../../../svg/paper-plane.svg'
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'
import 'moment/locale/fr';
import { db } from '../../../../Firebase'
import Avatar from '@material-ui/core/Avatar';
import DefaultProfile from "../../../../svg/profile.png"

export default function PhoneSupport({user, userDB}) {
    const [note, setNote] = useState("")
    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState(null)

    const handleChange = event =>{
        setNote(event.currentTarget.value)
    }

    useEffect(() => {
        const getMessages = () => {
            return db.collection('assistance')
            .doc(userDB.hotelName)
            .collection("chatRoom")
            .orderBy("markup", "desc")
            .limit(50)
        }

        let unsubscribe = getMessages().onSnapshot(function(snapshot) {
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
    }, [])

    const getChatRoom = () => {
        return db.collection('assistance')
            .doc(userDB.hotelName)
            .get()
            .then((doc) => {
                if (doc.exists) {
                setChatRoom(doc.data())
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
    }


    const createRoomnameSubmit = () => {
        return db.collection('assistance')
            .doc(userDB.hotelName)
            .set({
                adminSpeak: false,
                hotelId: userDB.hotelId,
                hotelName: userDB.hotelName,
                markup: Date.now(),
                status: true,
                classement: userDB.classement,
                code_postal: userDB.code_postal,
                room: userDB.room,
                city: userDB.city,
                hotelDept: userDB.hotelDept,
                hotelRegion: userDB.hotelRegion,
                country: userDB.country,
                pricingModel: userDB.pricingModel
            })      
      }

    const updateRoomnameSubmit = () => {
        return db.collection('assistance')
        .doc(userDB.hotelName)
        .update({
            status: true,
            markup: Date.now(),
            pricingModel: userDB.pricingModel === "Premium" ? "Premium" : ""
        })      
      }

    const sendMessage = () => {
        setNote("")
        return db.collection('assistance')
            .doc(userDB.hotelName)
            .collection("chatRoom")
            .add({
                author: userDB.username,
                date: new Date(),
                email: user.email,
                photo: user.photoURL,
                text: note,
                markup: Date.now(),
            }).then(function(docRef){
                console.log(docRef.id)
            }).catch(function(error) {
                console.error(error)
            })
    }


    return (
        <div className="communizi-container">
            <h4 style={{padding: "2vh", textAlign: "center", fontWeight: 'bold'}}>Assistance technique</h4>

            <PerfectScrollbar style={{paddingTop: "3vh"}}>
            <div style={{
                    display: "flex",
                    flexFlow: "column",
                    padding: "5%",
                }}>
                {messages.map(message => {
                    if(moment(message.markup).format('L') === moment(new Date()).format('L')){
                        if(message.author === userDB.username){
                            return (
                            <span className="darkTextUser">
                                <span className="user_avatar_chat_label">{message.autor}</span>
                                <div className="darkTextBodyUser" style={{backgroundColor:"lightblue"}}>
                                <span style={{marginBottom: "2%", color: "white"}}>{message.text}</span>
                                <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(message.markup).startOf('hour').fromNow()}</i></span>
                                </div>
                                <Avatar alt="user-profile-photo" 
                                src={message.photo ? message.photo : DefaultProfile}
                                className="avatar_chat" />
                            </span>
                            )
                        }else{
                            return (
                            <span className="darkTextOther">
                                <span className="customer_avatar_chat_label">{message.author}</span>
                                <div className="darkTextBodyOther">
                                <span style={{marginBottom: "2%", color: "white"}}>{message.text}</span>
                                <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(message.markup).startOf('hour').fromNow()}</i></span>
                                </div>
                                <Avatar alt="user-profile-photo" 
                                src={message.photo ? message.photo : DefaultProfile}
                                className="avatar_chat" />
                            </span>
                            )
                        }
                        }else{
                        if(message.author === userDB.username){
                            return (
                            <span className="oldDarkTextUser" style={{fontWeight: "bolder"}}>
                                <span className="old_user_avatar_chat_label">{message.author}</span>
                                <div className="oldDarkTextBodyUser">
                                <span style={{marginBottom: "2%", color: "lightskyblue"}}>{message.text}</span>
                                <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(message.markup).startOf('hour').fromNow()}</i></span>
                                </div>
                                <Avatar alt="user-profile-photo" 
                                src={message.photo ? message.photo : DefaultProfile}
                                className="old_avatar_chat" />
                            </span>
                            )
                        }else{
                            return (
                            <span className="oldDarkTextOther" style={{fontWeight: "bolder"}}>
                                <span className="customer_old_user_avatar_chat_label">{message.author}</span>
                                <div className="oldDarkTextBodyOther">
                                <span style={{marginBottom: "2%", color: "lightskyblue"}}>{message.text}</span>
                                <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(message.markup).startOf('hour').fromNow()}</i></span>
                                </div>
                                <Avatar alt="user-profile-photo" 
                                src={message.photo ? message.photo : DefaultProfile}
                                className="old_avatar_chat" />
                            </span>
                            )
                        }
                        }
                        })}
                </div>
                </PerfectScrollbar>
            <div className={typeof window !== `undefined` && window.innerWidth < 480 && "communizi_form_input_div"}>
                <Form.Group style={{display: "flex", flexFlow: 'row', justifyContent: "space-around", width: "100%", marginTop: "1vh"}}>
                    <Form.Control style={{width: "85%", borderRadius: "20px", backgroundColor: 'lightgrey', color: "black"}} value={note} name="note" type="text" placeholder="Ecrire un message..." onChange={handleChange} required />
                    <img src={Send} alt="sendIcon" style={{width: "10%", borderRadius: "50px"}} onClick={async() => {
                    await getChatRoom()
                    if(chatRoom !== null) {
                        return updateRoomnameSubmit()
                        .then(sendMessage())
                    }else{
                        return createRoomnameSubmit()
                        .then(sendMessage())
                    }
                    }} />          
                </Form.Group>
            </div>
        </div>
    )
}
