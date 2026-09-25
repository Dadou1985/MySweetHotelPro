import React, { useState, useContext } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Chat from './chat'
import { Tab, Tabs, Table } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import 'moment/locale/fr';
import { functions, storage, FirebaseContext } from '../../config/Firebase'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"
import Bubbles from '../../assets/images/bubbles.png'
import { StaticImage } from 'gatsby-plugin-image'
import Send from '../../assets/images/paper-plane.png'
import { useFirestoreSubscription, useAdd, useUpdate } from '../../utils/hooks/useFirestore'
import '../../css/section/chat.css'

/*
  ! FIX => SUBMIT ONKEYDOWN
*/

export default function ChatRoom() {
  const { user, userDB } = useContext(FirebaseContext)
  const [note, setNote] = useState('')
  const [img, setImg] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [guest, setGuest] = useState(null);
  const [showAlert, setShowAlert] = useState(false)
  const [accordionSelected, setAccordionSelected] = useState("")
  const { t } = useTranslation()

  const newAdminStatus = {hotelResponding: true}
  const sendPushNotification = functions.httpsCallable('sendPushNotification')

  const { data: chatRaw = [] } = useFirestoreSubscription(
    ['hotels', userDB.hotelId, 'chat'],
    { where: ['checkoutDate', '!=', ''] }
  )
  const present = chatRaw.filter(g => g.room !== "" && g.room !== "Pre-checkin")
  const arrival = chatRaw.filter(g => g.room === "Pre-checkin")

  const { data: guestList = [] } = useFirestoreSubscription(
    ['guestUsers'],
    { where: ['hotelId', '==', userDB.hotelId] }
  )

  const { data: guestChatRaw = [] } = useFirestoreSubscription(
    ['hotels', userDB.hotelId, 'chat'],
    { where: ['title', '==', guest], enabled: !!guest }
  )
  const payload = guestChatRaw.length > 0
    ? {
        token: guestChatRaw[0].token,
        logo: userDB.logo,
        language: guestChatRaw[0].guestLanguage,
        hotelName: userDB.hotelName,
        hotelId: userDB.hotelId,
        isChatting: guestChatRaw[0].isChatting
      }
    : { token: {}, logo: "", language: "", hotelName: userDB.hotelName, hotelId: userDB.hotelId, isChatting: "" }

  const { mutate: updateChat } = useUpdate()
  const { mutate: addNotif } = useAdd()
  const { mutate: addMessage } = useAdd()

  const newData = {
    author: userDB.username,
    text: note,
    date: new Date(),
    userId: user.uid,
    markup: Date.now(),
    title: "host"
  }

  const changeRoomStatus = (roomName) => {
    setGuest(null)
    setAccordionSelected("")
    updateChat({ path: ['hotels', userDB.hotelId, 'chat', roomName], data: { status: false, markup: Date.now() } })
  }

  const handleRowSelection = (flow) => {
    flow.status === true && guest !== flow.id ? setGuest(flow.id) : setGuest(null)
    return accordionSelected === flow.markup ? setAccordionSelected("") : setAccordionSelected(flow.markup)
  }

  const addNotification = (event, notification) => {
    event.preventDefault()
    addNotif({ path: ['notifications'], data: { content: notification, hotelId: userDB.hotelId, markup: Date.now() } })
  }

  const handleSubmit = (event) =>{
    event.preventDefault()
    if(img !== null) {
      const uploadTask = storage.ref(`msh-photo-chat/${img.name}`).put(img)
      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {console.log(error)},
        () => {
          storage
            .ref("msh-photo-chat")
            .child(img.name)
            .getDownloadURL()
            .then(url => {
              const uploadTask = () => { 
                addMessage({ path: ['hotels', userDB.hotelId, 'chat', guest, 'chatRoom'], data: {...newData, img: url} })
                setNote('')
              return setShowModal(false)
            }
            return setImg("", uploadTask())
          })
        }
      )
    }else{
      addMessage({ path: ['hotels', userDB.hotelId, 'chat', guest, 'chatRoom'], data: newData })
      setNote('')
      return setShowModal(false)
    }  
  }
  

  return (
    <div className="communizi-container">  
      <div style={{width: window?.innerWidth > 1023 ? "65%" : "100%", border: "1px solid lightgrey", borderBottom: "transparent"}}>
        <div style={{
          height: window?.innerWidth > 1023 ? "88%" : "95%", 
          padding: "2vw", 
          borderBottom: "1px solid lightgrey",
          backgroundImage: `url(${Bubbles})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center"
        }}>
          {!guest && <>
            <h3 style={{
              position:"absolute",
              left: "18vw",
              top: "36vh",
              filter: "drop-shadow(1px 1px 1px)"
            }}>Sélectionnez</h3>
            <h3 style={{
              position:"absolute",
              left: "35vw",
              top: "55vh",
              filter: "drop-shadow(1px 1px 1px)"
            }}>une conversation</h3>
            </>}
          <PerfectScrollbar>
            {user&& userDB&& guest !== null ?
              <Chat title={guest} /> : null}
          </PerfectScrollbar>
        </div>
        <div className={typeof window !== `undefined` && window.innerWidth < 768 ? "communizi_form_input_div" : "none"}>
          <Form className="communizi_form" onSubmit={(e) => e.preventDefault()}>
            <FormGroup  className="communizi_form_input_container"> 
              <Input type="text" placeholder={t("msh_chat.c_input_placeholder")}  
              value={note}
              onChange={(event) => {
                setNote(event.target.value)
                if(showAlert) {setShowAlert(false)}
              }}
              onKeyDown={(e) => {
                if(guest) {
                  if(e.key === "Enter" && note) {
                    handleSubmit(e)
                    updateChat({ path: ['hotels', userDB.hotelId, 'chat', guest], data: newAdminStatus })
                    sendPushNotification({payload: payload})
                  } else {
                    if(e.key === "Enter") {
                      return addNotification(e, t("msh_chat.c_alert_no_message"))
                    }
                  }
                } else {
                  if(e.key === "Enter") {
                    return addNotification(e, t("msh_chat.c_alert"))
                  }
                } 
              }}
              id="dark_message_note" />
            </FormGroup>
            <div className="communizi-button-container">
              <img src={Send} alt="sendIcon" className="communizi-send-button" onClick={(event) => {
                if(guest) {
                  if(note) {
                    handleSubmit(event)
                    updateChat({ path: ['hotels', userDB.hotelId, 'chat', guest], data: newAdminStatus })
                    sendPushNotification({payload: payload})
                  } else {
                    return addNotification(event, t("msh_chat.c_alert_no_message"))
                  }
                } else {
                  addNotification(event, t("msh_chat.c_alert"))
                }
              }} />          
            </div>
          </Form>
        </div>
    </div>
    <div style={{display: window?.innerWidth < 1024 && "none", width: "35%", borderTop: "1px solid lightgrey"}}>
      <Tabs defaultActiveKey="En séjour" id="uncontrolled-tab-example">
        <Tab eventKey="En séjour" title={t('msh_chat.c_guest_present')}>
          <PerfectScrollbar>
            {present.length > 0 ? <Table hover striped size="lg" border variant="dark" style={{maxHeight: "80vh", border: "none"}}>
              <tbody>
                {present.map((flow) => {
                  if (flow?.status) {
                    return <tr style={{cursor: "pointer"}}>
                      <td style={{textAlign: "center"}} onClick={() => handleRowSelection(flow)}><Avatar 
                        round={true}
                        name={flow.id}
                        size="40"
                        fgColor={accordionSelected === flow.markup ? "black" : "white"}
                        color={accordionSelected === flow.markup ? "#B8860B" : "#9A0A0A"}
                        style={{margin: "10%"}} /></td>
                        <td style={{width: "50%", paddingLeft: "1vw"}} onClick={() => handleRowSelection(flow)}><b style={{color: accordionSelected === flow.markup ? "#B8860B" : "white", fontSize: "1em"}}>{window?.innerWidth > 768 ? flow.id : null}</b> <br/> <i style={{color: "lightgrey"}}>{t('msh_general.g_table.t_room')} {flow.room}</i></td>
                        <td><Switch
                          checked={flow.status}
                          onChange={() => changeRoomStatus(flow.id)}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        {window?.innerWidth > 1440 && <i style={{color: "lightgrey", fontSize: "13px", paddingTop: "4%"}}>{moment(flow.markup).format('ll')}</i>}
                      </td>
                    </tr>
                  }
                })}
              </tbody>
            </Table> : <div style={{
              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "75vh",
              }}>
                <div style={{
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "5px solid lightgray",
                  borderRight: "5px solid lightgray",
                  border: '1px solid lightgrey',
                  borderRadius: "100%",
                  padding: "1vw",
                  width: "10rem",
                  height: "10rem",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <StaticImage objectFit='contain' src='../../assets/images/binoculars.png' placeholder="blurred" style={{width: "5vw", marginBottom: "1vh", filter: "invert() drop-shadow(1px 1px 1px)"}} />
                </div>
                <h6 style={{
                  width: "40%",
                  textAlign: "center",
                  color: "gray",
                  filter: "drop-shadow(1px 1px 1px)"}}>Aucune conversation pour le moment</h6>
            </div>}
            </PerfectScrollbar>
            </Tab>
            <Tab eventKey="En arrivée" title={t('msh_chat.c_guest_arrival')}>
            <PerfectScrollbar>
            {arrival.length > 0 ? <Table striped hover size="lg" border variant="dark" style={{maxHeight: "80vh", border: "none"}}>
              <tbody>
                {arrival.map((flow) => {
                  if (flow?.status) {
                    return <tr style={{cursor: "pointer"}}>
                      <td style={{textAlign: "center"}} onClick={() => handleRowSelection(flow)}><Avatar 
                        round={true}
                        name={flow.id}
                        size="40"
                        fgColor={accordionSelected === flow.markup ? "black" : "white"}
                        color={accordionSelected === flow.markup ? "#B8860B" : "rgb(30, 52, 107)"}
                        style={{margin: "10%"}} /></td>
                        <td style={{width: "50%", paddingLeft: "1vw"}} onClick={() => handleRowSelection(flow)}><b style={{color: accordionSelected === flow.markup ? "#B8860B" : "white", fontSize: "1em"}}>{window?.innerWidth > 768 ? flow.id : null}</b></td>
                        <td><Switch
                          checked={flow.status}
                          onChange={() => changeRoomStatus(flow.id)}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        <i style={{color: "gray", fontSize: "0.8em"}}>{moment(flow.markup).format('ll')}</i>
                      </td>
                    </tr>
                  }
                })}
              </tbody>
            </Table> : <div style={{
              display: "flex",
              flexFlow: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "75vh",
            }}>
              <div style={{
                display: "flex",
                flexFlow: "column",
                justifyContent: "center",
                alignItems: "center",
                borderBottom: "5px solid lightgray",
                borderRight: "5px solid lightgray",
                border: '1px solid lightgrey',
                borderRadius: "100%",
                padding: "1vw",
                width: "10rem",
                height: "10rem",
                backgroundColor: "whitesmoke",
                filter: "drop-shadow(2px 4px 6px)", 
                marginBottom: "1vh"
              }}>
                <StaticImage objectFit='contain' src='../../assets/images/binoculars.png' placeholder="blurred" style={{width: "5vw", marginBottom: "1vh", filter: "invert() drop-shadow(1px 1px 1px)"}} />
              </div>
              <h6 style={{
                width: "40%",
                textAlign: "center",
                color: "gray",
                filter: "drop-shadow(1px 1px 1px)"}}>Aucune conversation pour le moment</h6>
          </div>}
        </PerfectScrollbar>
        </Tab>
      </Tabs>
      </div>
    </div>
  )
}
