import React, {useState, useEffect } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Send from '../../images/paper-plane.png'
import ChatRoom from './chatRoom'
import { Tab, Tabs, Table } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import 'moment/locale/fr';
import { db, functions, storage } from '../../Firebase'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"
import Bubbles from '../../images/bubbles.png'
import Binocular from '../../images/binoculars.png'
import '../css/section/chat.css'

export default function CommunIzi({userDB, user}) {
    
    const [present, setPresent] = useState([]);
    const [arrival, setArrival] = useState([]);
    const [note, setNote] = useState('')
    const [expanded, setExpanded] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [initialFilter, setInitialFilter] = useState('Liste Clients Présents')
    const [guestList, setGuestList] = useState([])
    const [guest, setGuest] = useState(null);
    const [list, setList] = useState(false)
    const [payload, setPayload] = useState({token:{}, logo:"", language:"", hotelName: userDB.hotelName, hotelId: userDB.hotelId, isChatting:""})
    const [showAlert, setShowAlert] = useState(false)
    const [img, setImg] = useState(null)
    const { t } = useTranslation()

    const handleChange = event =>{
        setNote(event.currentTarget.value)
        setShowAlert(false)
    }

  const handleHideDrawer = () => {
    setActivate(false)
  }

  const updateAdminSpeakStatus = () => {
    return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('chat')
          .doc(`${guest}`)
          .update({
              hotelResponding: true,
          })      
  }

    const addMessage = (event, url) =>{
        event.preventDefault()
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .doc(`${guest}`)
          .collection('chatRoom')
          .add({
            author: userDB.username,
            text: note,
            date: new Date(),
            userId: user.uid,
            markup: Date.now(),
            title: "host",
            img: url
          })
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
                      addMessage(url)
                      handleHideDrawer()
                      setNote('')
                     return setShowModal(false)
              }
                return setImg("", uploadTask())})
        }
      )
      }else{
            addMessage(event, null)
            handleHideDrawer()
            setNote('')
            return setShowModal(false)
      }
      
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
  
    useEffect(() => {
      const chatOnAir = () => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .where("checkoutDate", "!=", "")
        }

      let unsubscribe = chatOnAir().onSnapshot(function(snapshot) {
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
          setGuestList(snapInfo)
      });
      return unsubscribe
     },[])

     useEffect(() => {
      const pullData = () => {
          return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .where("title", "==", guest)
      }
  
      if(guest !== null) {
        let unsubscribe = pullData().onSnapshot(function(snapshot) {
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
                      onChange={handleChange}
                      onKeyPress={(e) => {
                          if(e.key === "Enter" && note) {
                            handleSubmit(e)
                            updateAdminSpeakStatus()
                            sendPushNotification({payload: payload})
                            setShowAlert(false)
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
                          onChange={() => changeRoomStatus(flow.id)}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        /><i style={{color: "lightgrey", float: "right", fontSize: "13px", paddingTop: "4%"}}>{moment(flow.markup).format('ll')}</i></td>
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
                            <img src={Binocular} style={{width: "5vw", marginBottom: "1vh", filter: "invert() drop-shadow(1px 1px 1px)"}} />
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
                          onChange={() => changeRoomStatus(flow.id)}
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        /><i style={{color: "gray", float: "right", fontSize: "13px", paddingTop: "4%"}}>{moment(flow.markup).format('ll')}</i></td>
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
                    <img src={Binocular} style={{width: "5vw", marginBottom: "1vh", filter: "invert() drop-shadow(1px 1px 1px)"}} />
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
