import React, { useState, useEffect } from 'react'
import { Form, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Assistance from '../../svg/support-technique.svg'
import Send from '../../images/paper-plane.png'
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'
import 'moment/locale/fr';
import { db } from '../../Firebase'
import Avatar from '@material-ui/core/Avatar';
import DefaultProfile from "../../svg/profile.png"
import Bubble from "../../svg/bubble.svg"
import { useTranslation } from "react-i18next"
import '../css/section/chatTemplate.css'

export default function CallCenter({user, userDB}) {
    const [list, setList] = useState(false)
    const [note, setNote] = useState("")
    const [messages, setMessages] = useState([])
    const [chatRoom, setChatRoom] = useState(null)
    const [adminSpeakStatus, setAdminSpeakStatus] = useState([])
    const handleClose = () => setList(false)
    const handleShow = () => setList(true)
    const { t } = useTranslation()

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

      const updateAdminSpeakStatus = () => {
        return db.collection('assistance')
        .doc(userDB.hotelName)
        .update({
            adminSpeak: false
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
            title: "host",
            markup: Date.now(),
        }).then(function(docRef){
            console.log(docRef.id)
          }).catch(function(error) {
            console.error(error)
          })
    }

    useEffect(() => {
      const toolOnAir = () => {
          return db.collection("assistance")
          .where("hotelId", "==", userDB.hotelId)
      }

      let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                  const snapInfo = []
                snapshot.forEach(function(doc) {          
                  snapInfo.push({
                      id: doc.id,
                      ...doc.data()
                    })        
                  });
                  setAdminSpeakStatus(snapInfo)
              });
              return unsubscribe
   },[])


    return (
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center", 
            width: "25%"
        }}>
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="title">
                    {t("msh_support.s_title")}
                    </Tooltip>
                }>
                <img src={Assistance} className="icon" alt="contact" onClick={() => {
                  handleShow()
                  updateAdminSpeakStatus()
                  }} style={{width: "2vw"}} />

                </OverlayTrigger>
                {adminSpeakStatus.map(status => {
                  if(status.adminSpeak) {
                    return <img src={Bubble} style={{width: "20%"}} />
                  }
                })}

                <Modal show={list}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title id="contained-modal-title-vcenter">
                    {t("msh_support.s_title")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <PerfectScrollbar className="support-scrollbar">
                <div style={{
                        display: "flex",
                        flexFlow: "column",
                        padding: "5%",
                    }}>
                    {messages.map((message, key) => {
                        if(moment(message.markup).format('L') === moment(new Date()).format('L')){
                            if(message.title === "host"){
                              return (
                                <span key={key} className="darkTextUser">
                                  <span className="user_avatar_chat_label">{message.autor}</span>
                                  <div className="darkTextBodyUser" style={{backgroundColor:"lightblue"}}>
                                  <span style={{marginBottom: "2%", color: "black"}}>{message.text}</span>
                                    <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(message.markup).startOf('hour').fromNow()}</i></span>
                                  </div>
                                  <Avatar alt="user-profile-photo" 
                                    src={message.photo ? message.photo : DefaultProfile}
                                    className="avatar_chat" />
                                </span>
                              )
                            }else{
                              return (
                                <span key={key} className="darkTextOther">
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
                            if(message.title === "host"){
                              return (
                                <span key={key} className="oldDarkTextUser" style={{fontWeight: "bolder"}}>
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
                                <span key={key} className="oldDarkTextOther" style={{fontWeight: "bolder"}}>
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
                </Modal.Body>
                <Modal.Footer>
                    <Form.Group style={{display: "flex", flexFlow: 'row', justifyContent: "space-around", width: "100%"}}>
                        <Form.Control 
                        style={{width: "90%", borderRadius: "20px", backgroundColor: 'lightgrey', color: "black"}} 
                        value={note} 
                        name="note" 
                        type="text" 
                        placeholder={t("msh_support.s_input_placeholder")}
                        onChange={handleChange}
                        onKeyDown={async(e) => {
                          if(e.key === "Enter") {
                            await getChatRoom()
                        if(chatRoom !== null) {
                            return updateRoomnameSubmit()
                            .then(sendMessage())
                        }else{
                            return createRoomnameSubmit()
                            .then(sendMessage())
                        }
                          }
                        }} 
                        required />
                        <img src={Send} alt="sendIcon" style={{width: "5%", borderRadius: "50px"}} onClick={async() => {
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
                </Modal.Footer>
            </Modal>
        </div>
    )
}
