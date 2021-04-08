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
import Drawer from '@material-ui/core/Drawer'
import { FirebaseContext, db, auth } from '../../Firebase'


export default function CommunIzi() {
    
    const [info, setInfo] = useState([])
    const [note, setNote] = useState('')
    const [room, setRoom] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [expanded, setExpanded] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const handleChange = event =>{
        setNote(event.currentTarget.value)
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

    const handleRoomnameSubmit = (event) => {
      event.preventDefault()
      setRoom('')
      return this.db.collection('mySweetHotel')
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
        .doc(room)
        .set({
          user: user.uid,
          markup: Date.now()
      })      
    .then(handleClose())
    }

    const handleShowMoodList = () => {
      let moodList = document.getElementById('moodList')
      moodList.classList.toggle('moodList')
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

      let unsubscribe = chatOnAir({hotelId: userDB.hotelId, region: userDB.hotelRegion, departement: userDB.hotelDept, signal : signal}).onSnapshot(function(snapshot) {
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

     console.log(expanded)


    return (
        <div className="communizi-container">
          
            <PerfectScrollbar>
            <div className="communizi_notebox">
            <Accordion allowZeroExpanded>
                {info.map((flow) => (
                  <AccordionItem key={flow.id} onClick={() => handleChangeExpanded(flow.id)}>
                    <AccordionItemHeading style={{
                      backgroundColor: "rgb(33, 35, 39)", 
                      padding: "2%",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      marginTop: "1vh"
                      }}>
                        <AccordionItemButton style={{outline: "none"}}>
                          <Avatar 
                            round={true}
                            name={flow.user}
                            size="30"
                            color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
                            style={{marginRight: "1vw"}} />
                            {flow.id}
                            <i style={{color: "gray", float: "right", fontSize: "13px"}}>{moment(flow.markup).format('ll')}</i>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel style={{backgroundColor: 'lightgray', marginBottom: "1vh"}}>
                      <ChatRoom title={flow.id} />
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            </PerfectScrollbar>
            <div>
                <Form inline className="communizi_form">
                <FormGroup  className="communizi_form_input_container"> 
                    <Input type="text" placeholder="Participer à la conversation..."  
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
                        <img src={Plus} alt="plus" style={{width: "40%", cursor: "pointer"}} onClick={handleShow} />          
                     </OverlayTrigger>
                        <img src={Send} alt="sendIcon" style={{width: "40%", cursor: "pointer"}} onClick={handleSubmit} />          
                    </div>
                </Form>
            </div>
            <Modal show={showModal} 
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                    Créer une conversation
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input type="text" placeholder="Donnez un nom à la conversation" value={room} style={{borderTop: "none", borderLeft: "none", borderRight: "none"}} maxLength="60" onChange={handleChangeRoomName} />
                </Modal.Body>
                <Modal.Footer style={{borderTop: "none"}}>
                    <Button variant="success" onClick={handleRoomnameSubmit}>Créer</Button>
                </Modal.Footer>
            </Modal>

            <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
              <div id="drawer-container" style={{
                  display: "flex",
                  flexFlow: "column", 
                  justifyContent: "flex-end",
                  padding: "5%", 
                  maxHeight: "30vh"}}>
                  <div><Input type="text" placeholder="Donnez un nom à la conversation..." value={room} style={{borderTop: "none", borderLeft: "none", borderRight: "none", marginBottom: "3vh"}} maxLength="35" onChange={handleChangeRoomName} /></div>
                  <div><Button variant="success" style={{width: "100%"}} onClick={handleRoomnameSubmit}>Créer</Button></div>
              </div>
            </Drawer>
        </div>
    )
}
