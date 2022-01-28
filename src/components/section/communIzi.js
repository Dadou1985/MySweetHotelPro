import React, {useState, useEffect } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import Send from '../../images/paper-plane.png'
import Plus from '../../svg/plus3.svg'
import ChatRoom from './chatRoom'
import { Modal, Button, DropdownButton, Alert, Tab, Tabs, Table } from 'react-bootstrap'
import Avatar from 'react-avatar'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import { db, functions, storage } from '../../Firebase'
import Switch from '@material-ui/core/Switch';
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import { useTranslation } from "react-i18next"

export default function CommunIzi({userDB, user}) {
    
    const [info, setInfo] = useState([])
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
    const [url, setUrl] = useState("")
    const { t, i18n } = useTranslation()

    const handleChange = event =>{
        setNote(event.currentTarget.value)
        setShowAlert(false)
    }

    const handleClose = () => {
      setShowModal(false)
      setInitialFilter('Liste Clients Présents')
    }
    const handleShow = () => {
      if(window.innerWidth > 768) {
          setShowModal(true)
      }else{
          setActivate(true)
      }
    }

    const handleImgChange = (event) => {
      if (event.target.files[0]){
          setImg(event.target.files[0])
      }
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

    const handleChangeExpanded = (title) => setExpanded(title)
  
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
          console.log(snapInfo)
          
          const presentGuest = snapInfo && snapInfo.filter(guest => guest.room !== "")
          const arrivalGuest = snapInfo && snapInfo.filter(guest => guest.room == "")

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
    }, [guest])

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
        <div style={{width: "65%", height: "83vh", border: "1px solid lightgrey", borderBottom: "transparent"}}>
              <div style={{height: "72vh", padding: "2vw", borderBottom: "1px solid lightgrey"}}>
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
            <Table hover striped size="lg" border variant="dark" style={{maxHeight: "80vh", border: "none"}}>
              <tbody>
                {present && present.map((flow) => (
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
            </Table>
            </PerfectScrollbar>
            </Tab>
            <Tab eventKey="En arrivée" title={t('msh_chat.c_guest_arrival')}>
            <PerfectScrollbar>
            <Table striped hover size="lg" border style={{maxHeight: "80vh", border: "none"}}>
              <tbody>
                {arrival && arrival.map((flow) => (
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
            </Table>
            </PerfectScrollbar>
            </Tab>
          </Tabs>
          </div>
        </div>
    )
}
