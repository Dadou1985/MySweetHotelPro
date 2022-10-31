import React, {useState, useEffect } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import ChatRoom from './chatRoom'
import { Tab, Tabs, Table } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import 'moment/locale/fr';
import { functions, storage } from '../../Firebase'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"
import Bubbles from '../../images/bubbles.png'
import { StaticImage } from 'gatsby-plugin-image'
import Send from '../../images/paper-plane.png'
import { 
    handleUpdateData2, 
    fetchCollectionByMapping1, 
    fetchCollectionByMapping2, 
    handleSubmitData3, 
} from '../../helper/globalCommonFunctions'
import '../css/section/chat.css'

/* 
  ! FIX => SUBMIT ONKEYDOWN
*/

export default function CommunIzi({userDB, user}) {
  const [present, setPresent] = useState([]);
  const [arrival, setArrival] = useState([]);
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [activate, setActivate] = useState(false)
  const [guestList, setGuestList] = useState([])
  const [guest, setGuest] = useState(null);
  const [payload, setPayload] = useState({
    token:{}, 
    logo:"", 
    language:"",
    hotelName: userDB.hotelName, 
    hotelId: userDB.hotelId, 
    isChatting:""
  })
  const [showAlert, setShowAlert] = useState(false)
  const [img, setImg] = useState(null)
  const { t } = useTranslation()

  const handleHideDrawer = () => {
    setActivate(false)
  }

  const newAdminStatus = {hotelResponding: true}
  const newRoomStatus = {
    status: false,
    markup: Date.now()
  }
  const newData = {
    author: userDB.username,
    text: note,
    date: new Date(),
    userId: user.uid,
    markup: Date.now(),
    title: "host"
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
                handleSubmitData3(event, "hotels", userDB.hotelId, "chat", guest, 'chatRoom', {
                  author: userDB.username,
                  text: note,
                  date: new Date(),
                  userId: user.uid,
                  markup: Date.now(),
                  title: "host",
                  img: url
                })
                handleHideDrawer()
                setNote('')
              return setShowModal(false)
            }
            return setImg("", uploadTask())
          })
        }
      )
    }else{
      handleSubmitData3(event, "hotels", userDB.hotelId, "chat", guest, 'chatRoom', newData)
      handleHideDrawer()
      setNote('')
      return setShowModal(false)
    }  
  }
  
  useEffect(() => {
    let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "chat", "checkoutDate", "!=", "").onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
          id: doc.id,
          ...doc.data()
        })        
      });
        
      const presentGuest = snapInfo && snapInfo.filter(guest => guest.room !== "" && guest.room !== "Pre-checkin")
      const arrivalGuest = snapInfo && snapInfo.filter(guest => guest.room == "Pre-checkin")

      setPresent(presentGuest)
      setArrival(arrivalGuest)
    });
    return unsubscribe
  },[])

  useEffect(() => {
    let unsubscribe = fetchCollectionByMapping1("guestUsers", 'hotelId', "==", userDB.hotelId).onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
          id: doc.id,
          ...doc.data()
        })        
      });
      setGuestList(snapInfo)
    });
    return unsubscribe
  },[])

  useEffect(() => {
    if(guest !== null) {
      let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "chat", "title", "==", guest).onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
          id: doc.id,
          ...doc.data()
        })        
      });

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
}, [guest])

  const sendPushNotification = functions.httpsCallable('sendPushNotification')

  return (
    <div className="communizi-container">  
      <div style={{width: "65%", height: "83vh", border: "1px solid lightgrey", borderBottom: "transparent"}}>
        <div style={{
          height: "72vh", 
          padding: "2vw", 
          borderBottom: "1px solid lightgrey",
          backgroundImage: `url(${Bubbles})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}>
          {!guest && <>
            <h3 style={{
              position:"absolute",
              left: "24vw",
              top: "36vh",
              filter: "drop-shadow(1px 1px 1px)"
            }}>Sélectionnez</h3>
            <h3 style={{
              position:"absolute",
              left: "37vw",
              top: "55vh",
              filter: "drop-shadow(1px 1px 1px)"
            }}>une conversation</h3>
            </>}
          <PerfectScrollbar>
            {user&& userDB&& guest !== null ?
              <ChatRoom user={user} userDB={userDB} title={guest} /> : null}
          </PerfectScrollbar>
        </div>
        <div className={typeof window !== `undefined` && window.innerWidth < 768 ? "communizi_form_input_div" : "none"}>
          <Form className="communizi_form">
          <FormGroup  className="communizi_form_input_container"> 
            <Input type="text" placeholder={t("msh_chat.c_input_placeholder")}  
            value={note}
            onChange={(event) => {
              setNote(event.target.value)
              if(showAlert) {setShowAlert(false)}
            }}
            onKeyPress={(e) => {
              if(guest !== "") {
                if(e.key === "Enter" && note) {
                  handleSubmit(e)
                  handleUpdateData2("hotels", userDB.hotelId, "chat", guest, newAdminStatus)
                  sendPushNotification({payload: payload})
                }
              }else{
                return setShowAlert(true)
              }
            }}
            id="dark_message_note" />
          </FormGroup>
            <div className="communizi-button-container">
            {/*<OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="title">
                    Ajouter une photo
                  </Tooltip>
                }>
                <img src={Plus} alt="plus" className="communizi-file-button" onClick={handleShow} />          
              </OverlayTrigger>*/}
              <img src={Send} alt="sendIcon" className="communizi-send-button" onClick={(event) => {
                if(guest) {
                  if(note) {
                    handleSubmit(event)
                    handleUpdateData2("hotels", userDB.hotelId, "chat", guest, newAdminStatus)
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
    </div>
    <div style={{width: "35%", borderTop: "1px solid lightgrey"}}>
      <Tabs defaultActiveKey="En séjour" id="uncontrolled-tab-example">
        <Tab eventKey="En séjour" title={t('msh_chat.c_guest_present')}>
          <PerfectScrollbar>
            {present.length > 0 ? <Table hover striped size="lg" border variant="dark" style={{maxHeight: "80vh", border: "none"}}>
              <tbody>
                {present.map((flow) => (
                  <tr style={{cursor: "pointer"}} onClick={() => setGuest(flow.id)}>
                    <td><Avatar 
                      round={true}
                      name={flow.id}
                      size="40"
                      color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])}
                      style={{margin: "10%"}} /></td>
                      <td style={{width: "50%", paddingLeft: "1vw", paddingTop: "3vh"}}><b>{typeof window && window.innerWidth > 768 ? flow.id : null}</b> - {t('msh_general.g_table.t_room')} {flow.room}</td>
                      <td style={{paddingTop: "2vh"}}><Switch
                        checked={flow.status}
                        onChange={() => handleUpdateData2("hotels", userDB.hotelId, "chat", flow.id, newRoomStatus)}
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                      <i style={{color: "lightgrey", float: "right", fontSize: "13px", paddingTop: "4%"}}>{moment(flow.markup).format('ll')}</i>
                    </td>
                  </tr>
                ))}
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
                  width: "12vw",
                  height: "20vh",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <StaticImage src='../../images/binoculars.png' placeholder="blurred" style={{width: "5vw", marginBottom: "1vh", filter: "invert() drop-shadow(1px 1px 1px)"}} />
                </div>
                <h6 style={{
                  width: "10vw",
                  textAlign: "center",
                  color: "gray",
                  filter: "drop-shadow(1px 1px 1px)"}}>Aucune conversation pour le moment</h6>
            </div>}
            </PerfectScrollbar>
            </Tab>
            <Tab eventKey="En arrivée" title={t('msh_chat.c_guest_arrival')}>
            <PerfectScrollbar>
            {arrival.length > 0 ? <Table striped hover size="lg" border style={{maxHeight: "80vh", border: "none"}}>
              <tbody>
                {arrival.map((flow) => (
                  <tr style={{cursor: "pointer"}} onClick={() => setGuest(flow.id)}>
                    <td><Avatar 
                      round={true}
                      name={flow.id}
                      size="40"
                      color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])}
                      style={{margin: "10%"}} /></td>
                      <td style={{width: "50%", paddingLeft: "1vw", paddingTop: "3vh"}}>{typeof window && window.innerWidth > 768 ? flow.id : null}</td>
                      <td style={{paddingTop: "2vh"}}><Switch
                        checked={flow.status}
                        onChange={() => handleUpdateData2("hotels", userDB.hotelId, "chat", flow.id, newRoomStatus)}
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                      />
                      <i style={{color: "gray", float: "right", fontSize: "13px", paddingTop: "4%"}}>{moment(flow.markup).format('ll')}</i>
                    </td>
                  </tr>
                ))}
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
                width: "12vw",
                height: "20vh",
                backgroundColor: "whitesmoke",
                filter: "drop-shadow(2px 4px 6px)", 
                marginBottom: "1vh"
              }}>
                <StaticImage src='../../images/binoculars.png' placeholder="blurred" style={{width: "5vw", marginBottom: "1vh", filter: "invert() drop-shadow(1px 1px 1px)"}} />
              </div>
              <h6 style={{
                width: "10vw",
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
