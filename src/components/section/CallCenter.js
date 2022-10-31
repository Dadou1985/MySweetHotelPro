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
import { 
  handleUpdateData1, 
  fetchCollectionByMapping1,
  fetchCollectionBySorting2, 
  handleSubmitData2, 
  handleCreateData1
} from '../../helper/globalCommonFunctions'
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

  useEffect(() => {
    let unsubscribe = fetchCollectionBySorting2("assistance", userDB.hotelName, "chatRoom", "markup", "desc", 50).onSnapshot(function(snapshot) {
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

  const getChatRoom = async () => {
      const doc = await db.collection('assistance')
      .doc(userDB.hotelName)
      .get()
    if (doc.exists) {
      setChatRoom(doc.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
    }
  }

  const updatedData = {
    status: true,
    markup: Date.now(),
    pricingModel: userDB.pricingModel === "Premium" ? "Premium" : ""
  }
  
  const createdData = {
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
  }

  const adminStatusData = {adminSpeak: false}

  const newData = {
    author: userDB.username,
    date: new Date(),
    email: user.email,
    photo: user.photoURL,
    text: note,
    title: "host",
    markup: Date.now(),
  }

  useEffect(() => {
    let unsubscribe = fetchCollectionByMapping1("assistance", "hotelId", "==", userDB.hotelId).onSnapshot(function(snapshot) {
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

  const handleSubmit = async(event) => {
    event.preventDefault()
    await getChatRoom()
    if(chatRoom !== null) {
      return handleUpdateData1(event, 'assistance', userDB.hotelName, updatedData)
      .then(() => {
          setNote("")
          handleSubmitData2(event, "assistance", userDB.hotelName, "chatRoom", newData)
      })
    }else{
      return handleCreateData1(event, 'assistance', userDB.hotelName, createdData)
      .then(() => {
          setNote("")
          handleSubmitData2(event, "assistance", userDB.hotelName, "chatRoom", newData)
      })
    }
  }

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
                handleUpdateData1("assistance", userDB.hotelName, adminStatusData )
                }} style={{width: "2vw", cursor: "pointer"}} />

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
                      onChange={(event) => setNote(event.target.value)}
                      onKeyDown={(e) => {
                        if(e.key === "Enter") {
                          return handleSubmit(e)
                        }
                      }} 
                      required />
                      <img src={Send} alt="sendIcon" style={{width: "5%", borderRadius: "50px"}} onClick={(e) => handleSubmit(e)} />          
                  </Form.Group>
              </Modal.Footer>
          </Modal>
      </div>
  )
}
