import React, {useState, useEffect } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Send from '../../svg/paper-plane.svg'
import Plus from '../../svg/plus3.svg'
import SupportRoom from './supportRoom'
import { OverlayTrigger, Tooltip, Button, DropdownButton, Dropdown } from 'react-bootstrap'
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
import { db } from '../../Firebase'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"

export default function Assistance({userDB, user}) {
    
    const [info, setInfo] = useState([])
    const [note, setNote] = useState('')
    const [expanded, setExpanded] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [initialFilter, setInitialFilter] = useState('')
    const { t, i18n } = useTranslation()

    const handleChange = event =>{
        setNote(event.currentTarget.value)
    }

    const handleShow = () => {
      if(window.innerWidth > 768) {
          setShowModal(true)
      }else{
          setActivate(true)
      }
  }

  const handleHideDrawer = () => {
    setActivate(false)
  }

  const addNotification = (notification) => {
    return db.collection('notifications')
        .add({
        content: notification,
        markup: Date.now(),
        hotelId: userDB.hotelId
      })
        .then(doc => console.log('nouvelle notitfication'))
}

const changeAdminSpeakStatus = (roomName) => {
  return db.collection('assistance')
    .doc(roomName)
    .update({
      adminSpeak: true,
  })      
}

    const handleSubmit = async(event) =>{
        event.preventDefault()
        await changeAdminSpeakStatus(expanded)
        return db.collection('assistance')
          .doc(`${expanded}`)
          .collection('chatRoom')
          .add({
            author: userDB.username,
            text: note,
            date: new Date(),
            userId: user.uid,
            markup: Date.now(),
            photo: user.photoURL
          })
          .then(() => {
            setNote("")
          })
    }

    const changeRoomStatus = (roomName) => {
      return db.collection('assistance')
        .doc(roomName)
        .update({
          status: false,
          markup: Date.now()
      })      
    }

    const handleChangeExpanded = (title) => setExpanded(title)
  

    useEffect(() => {
      const chatOnAir = () => {
        return db.collection('assistance')
            .orderBy("markup")
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


    return (
        <div className="communizi-container">
          
            <PerfectScrollbar>
            <div className="communizi_notebox">
            <Accordion allowZeroExpanded>
                {info.map((flow) => (
                  flow.status &&
                  <AccordionItem key={flow.id} onClick={() => handleChangeExpanded(flow.id)}>
                    <AccordionItemHeading style={{
                      backgroundColor: flow.pricingModel === "Premium" ? "darkgoldenrod" : "lightblue", 
                      padding: "2%",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      marginTop: "1vh"
                      }}>
                        <AccordionItemButton style={{outline: "none", color: "black", display: "flex", justifyContent: "space-between"}}>
                          <div style={{display: "flex", alignItems: "center", width: "50%"}}>{flow.id}</div>
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
                      <SupportRoom user={user} userDB={userDB} title={flow.id} />}
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            </PerfectScrollbar>
            <div className={typeof window !== `undefined` && window.innerWidth < 768 && "communizi_form_input_div"}>
                <Form inline className="communizi_form">
                <FormGroup  className="communizi_form_input_container"> 
                    <Input type="text" placeholder="Répondre au client..."  
                    value={note}
                    onChange={handleChange}
                    id="dark_message_note" />
                </FormGroup>
                    {/*<div className="communizi-button-container">
                     <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="title">
                            Créer une conversation
                          </Tooltip>
                        }>
                        <img src={Plus} alt="plus" className="communizi-file-button" onClick={handleShow} />          
                     </OverlayTrigger>
                        <img src={Send} alt="sendIcon" className="communizi-send-button" onClick={handleSubmit} />          
                      </div>*/}
                </Form>
            </div>

            <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
              <div id="drawer-container" style={{
                  display: "flex",
                  flexFlow: "column", 
                  justifyContent: "flex-end",
                  padding: "5%", 
                  maxHeight: "100vh"}}>
                  <h4 style={{textAlign: "center", marginBottom: "2vh"}}>Contacter un hôtel</h4>
                    <DropdownButton id="dropdown-basic-button" title={expanded} drop="bottom" variant="outline-dark">
                    {info.map(hotel => (
                        <Dropdown.Item 
                        onClick={() => {
                        setExpanded(hotel.id)
                        setInitialFilter(hotel.id)}}>{hotel.id}</Dropdown.Item>
                    ))}
                    </DropdownButton>
                    <Input 
                      type="text" 
                      placeholder="Ecrire un message..." 
                      value={note} 
                      style={{
                        borderTop: "none", 
                        borderLeft: "none", 
                        borderRight: "none", 
                        marginTop: "2vh"}} 
                      maxLength="60" 
                      onChange={handleChange} />
              </div>
              <Button variant="success" size="lg" onClick={(event) => {
                      const notif = `Votre message a bien été envoyé à l'hôtel ${expanded}` 
                      handleSubmit(event)
                      handleHideDrawer()
                      setInitialFilter('')
                      addNotification(notif)
                    }}>Envoyer</Button>
            </Drawer>
        </div>
    )
}
