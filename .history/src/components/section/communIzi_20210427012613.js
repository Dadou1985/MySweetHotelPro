import React, {useState, useEffect, useContext } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Send from '../../svg/paper-plane.svg'
import Plus from '../../svg/plus.svg'
import ChatRoom from './chatRoom'
import { OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
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
import { db, auth } from '../../Firebase'
import Switch from '@material-ui/core/Switch';
import Select from 'react-select'

export default function CommunIzi({userDB, user}) {
    
    const [info, setInfo] = useState([])
    const [note, setNote] = useState('')
    const [room, setRoom] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [expanded, setExpanded] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [initialFilter, setInitialFilter] = useState('')
    const [filter, setFilter] = useState([])
    const [deleteList, setDeleteList] = useState([])

    const handleChange = event =>{
        setNote(event.currentTarget.value)
    }

    const handleChangeFilter = event =>{
      setInitialFilter(event.currentTarget.value)
  }


    const handleChangeRoomName = event =>{
      setRoom(event.currentTarget.value)
  }

    const handleClose = () => setShowModal(false)
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

    const handleSubmit = (event) =>{
        event.preventDefault()
        setNote("")
        let date = startDate.yyyymmdd()
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
          .doc(`${expanded}`)
          .collection('chatRoom')
          .add({
            author: user.displayName,
            text: note,
            date: new Date(),
            userId: user.uid,
            markup: Date.now()
          })
    }

    const changeRoomStatus = (roomName) => {
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
        .doc(roomName)
        .update({
          status: false,
          markup: Date.now()
      })      
    }

    const handleChangeExpanded = (title) => setExpanded(title)
  

    useEffect(() => {
      const chatOnAir = () => {
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
          .collection('guest')
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
          setFilter(snapInfo)
      });
      return unsubscribe
     },[])

     const deleteGuest = (guest) => {
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
      .collection('guest')
      .doc(guest)
      .delete()
     }

     useEffect(() => {
       const deleteListGuest = () => {
        let checkoutHour = new Date().getHours()

        if(checkoutHour >= 14) {
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
            .collection('guest')
            .where("checkoutDate", "==", moment(new Date()).format('LL'))
            .onSnapshot(function(snapshot) {
              const snapInfo = []
            snapshot.forEach(function(doc) {          
              snapInfo.push({
                  id: doc.id,
                  ...doc.data()
                }
                ).then(snapInfo.map(guest => {
                  return deleteGuest(guest.id)
                }))     
              })
              console.log(snapInfo)
          })
        }
       }

       let unsubscribe = deleteListGuest();
        return unsubscribe

     }, [])

     
     console.log(deleteList)

     let guestList = filter && filter.filter(guest => guest.room == initialFilter)

    return (
        <div className="communizi-container">
          
            <PerfectScrollbar>
            <div className="communizi_notebox">
            <Accordion allowZeroExpanded>
                {info.map((flow) => (
                  flow.status &&
                  <AccordionItem key={flow.id} onClick={() => handleChangeExpanded(flow.id)}>
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
            <div>
                <Form inline className="communizi_form">
                <FormGroup  className="communizi_form_input_container"> 
                    <Input type="text" placeholder="Répondre au client..."  
                    value={note}
                    onChange={handleChange}
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
                        <img src={Plus} alt="plus" className="communizi-button " onClick={handleShow} />          
                     </OverlayTrigger>
                        <img src={Send} alt="sendIcon" className="communizi-button " onClick={handleSubmit} />          
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
                    <Input 
                      type="text" 
                      placeholder="Entrer le numéro de chambre du client" 
                      value={initialFilter} 
                      style={{
                        borderTop: "none", 
                        borderLeft: "none", 
                        borderRight: "none",
                        marginBottom: "2vh",
                        width: "70%"}} 
                      maxLength="60" 
                      onChange={handleChangeFilter} />
                      <PerfectScrollbar>
                      {guestList.map(guest => (
                        <div style={{
                          display: "flex",
                          flexFlow: "column",
                          padding: "2%",
                          maxHeight: "30vh",
                          backgroundColor: "#ECECEC",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setExpanded(guest.id)
                          setInitialFilter(guest.id)}}>{guest.id} - Chambre {guest.room}</div>
                      ))}
                      </PerfectScrollbar>
                    <Input 
                      type="textarea" 
                      placeholder="Ecrire un message..." 
                      style={{resize: "none"}}
                      value={note}  
                      maxLength="60" 
                      onChange={handleChange} />
                </Modal.Body>
                <Modal.Footer style={{borderTop: "none"}}>
                    <Button variant="success" onClick={(event) => {
                      handleSubmit(event)
                      setShowModal(false)
                      setInitialFilter('')
                    }}>Envoyer</Button>
                </Modal.Footer>
            </Modal>

            <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
              <div id="drawer-container" style={{
                  display: "flex",
                  flexFlow: "column", 
                  justifyContent: "flex-end",
                  padding: "5%", 
                  maxHeight: "30vh"}}>
                  <h4 style={{textAlign: "center", marginBottom: "2vh"}}>Contacter un client</h4>
                  <Input 
                      type="text" 
                      placeholder="Entrer le numéro de chambre du client" 
                      value={initialFilter} 
                      style={{
                        borderTop: "none", 
                        borderLeft: "none", 
                        borderRight: "none", 
                      marginBottom: "2vh"}} 
                      maxLength="60" 
                      onChange={handleChangeFilter} />
                      <PerfectScrollbar>
                      {guestList.map(guest => (
                        <div style={{
                          display: "flex",
                          flexFlow: "column",
                          padding: "2%",
                          maxHeight: "30vh",
                          backgroundColor: "#ECECEC",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setExpanded(guest.id)
                          setInitialFilter(guest.id)}}>{guest.id} - Chambre {guest.room}</div>
                      ))}
                      </PerfectScrollbar>
                    <Input 
                      type="text" 
                      placeholder="Ecrire un message..." 
                      value={note} 
                      style={{
                        borderTop: "none", 
                        borderLeft: "none", 
                        borderRight: "none"}} 
                      maxLength="60" 
                      onChange={handleChange} />
              </div>
              <Button variant="success" size="lg" onClick={(event) => {
                      handleSubmit(event)
                      setShowModal(false)
                      setInitialFilter('')
                    }}>Envoyer</Button>
            </Drawer>
        </div>
    )
}
