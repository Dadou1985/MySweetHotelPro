import React, {useState, useEffect } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Send from '../../svg/paper-plane.svg'
import Plus from '../../svg/plus3.svg'
import ChatRoom from './chatRoom'
import { OverlayTrigger, Tooltip, Modal, Button, DropdownButton, Alert } from 'react-bootstrap'
import Avatar from 'react-avatar'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import { db, functions } from '../../Firebase'
import Switch from '@material-ui/core/Switch';
import DropdownItem from 'react-bootstrap/esm/DropdownItem'

export default function CommunIzi({userDB, user}) {
    
    const [info, setInfo] = useState([])
    const [note, setNote] = useState('')
    const [expanded, setExpanded] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [initialFilter, setInitialFilter] = useState('Liste Clients Présents')
    const [guestList, setGuestList] = useState([])
    const [list, setList] = useState(false)
    const [payload, setPayload] = useState({token:{}, logo:"", language:"", hotelName: userDB.hotelName, hotelId: userDB.hotelId, isChatting:""})
    const [showAlert, setShowAlert] = useState(false)

    const handleChange = event =>{
        setNote(event.currentTarget.value)
        setShowAlert(false)
    }

    const handleClose = () => {
      setShowModal(false)
      setInitialFilter('Liste Clients Présents')
    }
    const handleShow = () => {
      if(window.innerWidth > 480) {
          setShowModal(true)
      }else{
          setActivate(true)
      }
    }

  const handleHideDrawer = () => {
    setActivate(false)
  }

  const updateAdminSpeakStatus = () => {
    return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('chat')
          .doc(`${expanded}`)
          .update({
              hotelResponding: true,
          })      
  }

    const handleSubmit = (event) =>{
        event.preventDefault()
        setNote("")
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .doc(`${expanded}`)
          .collection('chatRoom')
          .add({
            author: userDB.username,
            text: note,
            date: new Date(),
            userId: user.uid,
            markup: Date.now(),
            title: "host"
          })
    }

    const changeRoomStatus = (roomName) => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection("chat")
        .doc(roomName)
        .update({
          status: false,
          markup: Date.now()
      })      
    }

    const handleChangeExpanded = (title) => setExpanded(title)
  
    useEffect(() => {
      const chatOnAir = () => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .orderBy("markup", "asc")
        }

      let unsubscribe = chatOnAir().onSnapshot(function(snapshot) {
          const snapInfo = []
        snapshot.forEach(function(doc) {          
          snapInfo.push({
              id: doc.id,
              ...doc.data()
            })        
          });
          console.log(snapInfo)
          setInfo(snapInfo)
      });
      return unsubscribe
     },[])

     useEffect(() => {
      const guestOnAir = () => {
        return db.collection('guestUsers')
        .where('hotelId', "==", userDB.hotelId)
        }

      let unsubscribe = guestOnAir().onSnapshot(function(snapshot) {
          const snapInfo = []
        snapshot.forEach(function(doc) {          
          snapInfo.push({
              id: doc.id,
              ...doc.data()
            })        
          });
          console.log(snapInfo)
          setGuestList(snapInfo)
      });
      return unsubscribe
     },[])

     useEffect(() => {
      const pullData = () => {
          return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .where("title", "==", expanded)
      }
  
      if(expanded !== null) {
        let unsubscribe = pullData().onSnapshot(function(snapshot) {
          const snapInfo = []
        snapshot.forEach(function(doc) {          
          snapInfo.push({
              id: doc.id,
              ...doc.data()
            })        
          });
          console.log("info",snapInfo)
          snapInfo.map(doc => setPayload({
            token: doc.token,
            logo: userDB.logo,
            language: doc.guestLanguage,
            hotelName: userDB.hotelName,
            hotelId: userDB.hotelId,
            isChatting: doc.isChatting
          }))
          
        });
      return unsubscribe
      }
    }, [expanded])

    const addNotification = (notification) => {
      return db.collection('notifications')
          .add({
          content: notification,
          hotelId: userDB.hotelId,
          markup: Date.now()})
          .then(doc => console.log('nouvelle notitfication'))
  }

  const handleShowList = () => setList(true)

  const handleHideList = () => setList(false)

  const sendPushNotification = functions.httpsCallable('sendPushNotification')

  console.log('testUser', payload)

    return (
        <div className="communizi-container">
          
            <PerfectScrollbar>
            <div className="communizi_notebox">
            <Accordion allowZeroExpanded>
                {info.map((flow) => (
                  flow.status &&
                  <AccordionItem key={flow.id} onClick={() => {
                    handleChangeExpanded(flow.id)
                    if(showAlert) {
                      return setShowAlert(false)
                    }
                    }}>
                    <AccordionItemHeading style={{
                      backgroundColor: "rgb(33, 35, 39)", 
                      padding: "2%",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      marginTop: "1vh"
                      }}>
                        <AccordionItemButton style={{outline: "none", color: "gray", display: "flex", justifyContent: "space-between"}}>
                          <div style={{display: "flex", alignItems: "center"}}>
                            <Avatar 
                              round={true}
                              name={flow.id}
                              size="30"
                              color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
                              style={{marginRight: "1vw"}} />
                              {typeof window && window.innerWidth > 480 ? flow.id : null}
                          </div>
                          <div style={{display: "flex", alignItems: "center"}}>Chambre {flow.room}</div>
                            <div style={{display: "flex", alignItems: "center"}}>
                              <Switch
                                checked={flow.status}
                                onChange={() => changeRoomStatus(flow.id)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                              />
                              <i style={{color: "gray", float: "right", fontSize: "13px"}}>{moment(flow.markup).format('ll')}</i>
                            </div>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel style={{marginBottom: "1vh"}}>
                      {user&& userDB&& 
                      <ChatRoom user={user} userDB={userDB} title={flow.id} />}
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            </PerfectScrollbar>
            <div className={typeof window !== `undefined` && window.innerWidth < 480 ? "communizi_form_input_div" : "none"}>
                <Form inline className="communizi_form">
                <FormGroup  className="communizi_form_input_container"> 
                    <Input type="text" placeholder="Répondre au client..."  
                    value={note}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if(expanded) {
                        if(e.key === "Enter" && note) {
                          handleSubmit(e)
                          updateAdminSpeakStatus()
                          sendPushNotification({payload: payload})
                          setShowAlert(false)
                        }
                      }else{
                        if(e.key === "Enter") {
                          e.preventDefault()
                          return setShowAlert(true)
                        }
                      }
                    }}
                    id="dark_message_note" />
                </FormGroup>
                    <div className="communizi-button-container">
                     <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="title">
                            Créer une conversation
                          </Tooltip>
                        }>
                        <img src={Plus} alt="plus" className="communizi-file-button" onClick={handleShow} />          
                     </OverlayTrigger>
                        <img src={Send} alt="sendIcon" className="communizi-send-button" onClick={(event) => {
                          if(expanded) {
                            if(note) {
                              handleSubmit(event)
                              updateAdminSpeakStatus()
                              sendPushNotification({payload: payload})
                              if(showAlert) {
                                showAlert(false)
                              }
                            }
                          }else{
                            return setShowAlert(true)
                          }
                        }} />          
                    </div>
                </Form>
            </div>
            <Modal show={showModal} 
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                    Contacter un client
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                      <DropdownButton id="dropdown-basic-button" title={initialFilter !== "Liste Clients Présents" ? initialFilter : "Liste Clients Présents"}>
                      {guestList.map((guest, key) => (
                        <DropdownItem
                        key={key}
                        onClick={() => {
                          setExpanded(guest.username)
                          setInitialFilter(guest.username)}}>{guest.username} - Chambre {guest.room}</DropdownItem>
                      ))}
                      </DropdownButton>
                    <Input 
                      type="textarea" 
                      placeholder="Ecrire un message..." 
                      style={{resize: "none", marginTop: "2vh"}}
                      value={note}  
                      maxLength="60" 
                      onChange={handleChange} />
                </Modal.Body>
                <Modal.Footer style={{borderTop: "none"}}>
                    <Button variant="success" onClick={(event) => {
                      const notif = "Votre message a bien été envoyé !" 
                      addNotification(notif)
                      handleSubmit(event)
                      setShowModal(false)
                      setInitialFilter('Liste Clients Présents')
                      updateAdminSpeakStatus()
                      sendPushNotification({payload: payload})
                    }}>Envoyer</Button>
                </Modal.Footer>
            </Modal>

            <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
              <div id="drawer-container" style={{
                  display: "flex",
                  flexFlow: "column", 
                  justifyContent: "space-between",
                  padding: "5%", 
                  maxHeight: "90vh"}}>
                  <div style={{
                    marginBottom: list ? "2vh" : "6vh"
                  }}>
                    <h4>Contacter un client</h4>
                    <Button onClick={handleShowList}>{initialFilter !== "Liste Clients Présents" ? initialFilter : "Liste Clients Présents"}</Button>
                  </div>
                    {list && <div style={{
                      marginBottom: "5vh"
                    }}>
                      <PerfectScrollbar>
                      {guestList.map(guest => (
                        <DropdownItem
                        style={{borderBottom: "1px solid lightgrey"}}
                        onClick={() => {
                          setExpanded(guest.username)
                          setInitialFilter(guest.username)
                          handleHideList()}}>{guest.username} - Chambre {guest.room}</DropdownItem>
                      ))}
                      </PerfectScrollbar>
                    </div>}
                   <div style={{
                     backgroundColor: "white",
                     width: "90%",
                     bottom: "8vh"
                   }}>
                    <Input 
                        type="text" 
                        placeholder="Ecrire un message..." 
                        value={note}  
                        maxLength="60" 
                        onChange={handleChange}
                        id="dark_message_contact" />
                   </div>
              </div>
              <Button variant="success" size="lg" onClick={(event) => {
                      const notif = "Votre message a bien été envoyé !" 
                      addNotification(notif)
                      handleSubmit(event)
                      setActivate(false)
                      setInitialFilter("Liste Clients Présents")
                      updateAdminSpeakStatus()
                      sendPushNotification({payload: payload})
                    }}>Envoyer</Button>
            </Drawer>
            {showAlert && <Alert variant="danger" style={{width: "20vw"}}>
              Vous devez d'abord choisir une conversation !
            </Alert>}
        </div>
    )
}
