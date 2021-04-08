import React, { useContext, useEffect, useState } from 'react'
import { Input } from 'reactstrap'
import NoteBox from './noteBox'
import DatePicker from "react-datepicker"
import "../css/messenger_datepicker.css"
import PerfectScrollbar from 'react-perfect-scrollbar'
import Send from '../../svg/paper-plane.svg'
import Calendar from '../../svg/calendar.svg'
import Plus from '../../svg/plus3.svg'
import { OverlayTrigger, Tooltip, Modal } from 'react-bootstrap'
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import YellowCircle from '../../svg/yellow-circle.svg'
import RedCircle from '../../svg/red-circle.svg'
import BlueCircle from '../../svg/blue-circle.svg'
import Circle from '../../svg/circle.svg'
import Upload from '../../svg/plus2.svg'
import Drawer from '@material-ui/core/Drawer'
import { FirebaseContext, db, auth, storage } from '../../Firebase'
import moment from 'moment'


const Messenger = () =>{

    const [note, setNote] = useState('')
    const [title, setTitle] = useState("")
    const [status, setStatus] = useState("")
    const [checked, setChecked] = useState(false)
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const handleChangeNote = event =>{
        setNote(event.currentTarget.value)
    }

    const handleChangeTitle = event =>{
        setTitle(event.currentTarget.value)
    }

    const handleImgChange = (event) => {
        if (event.target.files[0]){
            setImg(event.target.files[0])
        }
    }

    const handleHideDrawer = () => {
        setActivate(false)
    }


    const renderSwitch = (status) => {
        switch(status) {
          case 'darkgoldenrod':
            return <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="title">
                Changer de statut
              </Tooltip>
            }>
            <img src={YellowCircle} alt="important" className="modal-note-circle" onClick={() => setChecked(true)} />
        </OverlayTrigger>
          case 'red':
            return <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="title">
                Changer de statut
              </Tooltip>
            }>
            <img src={RedCircle} alt="urgent" className="modal-note-circle" onClick={() => setChecked(true)} />
        </OverlayTrigger>
          case 'lightskyblue':
            return <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="title">
                Changer de statut
              </Tooltip>
            }>
             <img src={BlueCircle} alt="info" className="modal-note-circle" onClick={() => setChecked(true)} />
        </OverlayTrigger>
        default:
            return <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="title">
                Changer de statut
              </Tooltip>
            }>
             <img src={Circle} alt="default" className="modal-note-circle" onClick={() => setChecked(true)} />
        </OverlayTrigger>
        }
      }

    const handleClose = () => setShowModal(false)
    const handleShow = () => {
        if(window.innerWidth > 480) {
            setShowModal(true)
        }else{
            setActivate(true)
            hideCalendar()
        }
    }

    const addNote = (marker) => {
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
            .collection('note')
            .doc(`${title}`)
            .set({
            author: user.displayName,
            text: note,
            status: status,
            date: startDate,
            img: url,
            markup: marker,
            userId: user.uid
            }).then(function(docRef){
            console.log(docRef.id)
            }).catch(function(error) {
            console.error(error)
            })
    }

    const addNotification = (notification) => {
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
            .collection('notifications')
            .add({
            content: notification,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

    const handleSubmit = (event) =>{
        event.preventDefault()
        if(img !== null) {
            const uploadTask = storage.ref(`img/${img.name}`).put(img)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("img")
              .child(img.name)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    setNote("")
                    setTitle("")
                    let marker = startDate.getTime()
                        
                    if(moment(startDate).format('L') !== moment(new Date()).format('L')) {
                        const notif = "Votre message a bien été enregistré pour le " + moment(startDate).format('L') 
                        addNote(marker)
                        addNotification(notif)
                        setStartDate(new Date)
                        handleHideDrawer()
                       return setShowModal(false)
                    }else{
                        addNote(marker)
                        handleHideDrawer()
                        setShowModal(false)
                    }
                    
                }
                  return setUrl(url, uploadTask())})
          }
        )
        }else{
            setNote("")
            setTitle("")
            let marker = startDate.getTime()
                
            if(moment(startDate).format('L') !== moment(new Date()).format('L')) {
                const notif = "Votre message a bien été enregistré pour le " + moment(startDate).format('L') 
                addNote(marker)
                addNotification(notif)
                setStartDate(new Date)
                handleHideDrawer()
                return setShowModal(false)
            }else{
                addNote(marker)
                handleHideDrawer()
                setShowModal(false)
            }
        }
        
    }

    const changeDrawerHeight = () => {
        setShowCalendar(true)
    }

    const hideCalendar = () => {
        setShowCalendar(false)
    }
    
    return(
        <div className="messenger_container">
            <h5 className="font-weight-bolder messenger_title">Note Book</h5>
            <PerfectScrollbar className="perfect-scrollbar">
                <div className="messenger_notebox">
                    {!!userDB && !!setUserDB &&
                    <NoteBox />}
                </div>
                <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id="title">
                    Ajouter une note
                    </Tooltip>
                }>
                <img src={Plus} alt="Plus" className="icon-add-note" onClick={handleShow} />
            </OverlayTrigger>
            </PerfectScrollbar>
            
            <Modal show={showModal} 
            size="lg"
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton className="bg-light">
                <Modal.Title id="example-modal-sizes-title-sm" style={{width: "100%"}}>
                    <Input type="text" name="title" placeholder="Donner un titre à la note..." className="modal-note-title" maxLength="60" onChange={handleChangeTitle} required />
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input type="textarea" placeholder="Rédiger une note..." value={note} className="modal-note-input" onChange={handleChangeNote} required />
                </Modal.Body>
                <Modal.Footer style={{borderTop: "none"}}>
                    <div className="modal-note-button-container">
                        <span className="white-band"></span>
                        <input type="file" className="modal-note-file-input"
                          onChange={handleImgChange} />
                      <img src={Upload} className="modal-note-file-icon" alt="uploadIcon" />
                         <DatePicker
                            id="calendar"
                            className="react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input"
                            selected={startDate}
                            value={startDate}
                            onChange={changedDate => setStartDate(changedDate)}
                            placeholderText="Date du jour"
                            locale="fr-FR"
                            dateFormat="d MMMM yyyy"
                        />
                        {renderSwitch(status)}
                        <img src={Calendar} alt="sendIcon" className="modal-note-calendar-icon" />
                        <img src={Send} alt="sendIcon" className="modal-note-send-icon" onClick={handleSubmit} />
                        <List component="nav" aria-label="main mailbox folders" className="modal-note-list" style={{
                            position: "absolute",
                            display: checked ? "flex" : "none",
                            flexFlow: "column",
                            justifyContent: "space-around",
                            alignItems: "center",
                            }}>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        defaut
                                    </Tooltip>
                                    }>
                                    <img src={Circle} alt="info" className="modal-note-list-circle" onClick={() => {
                                        setStatus("default")
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        Info
                                    </Tooltip>
                                    }>
                                    <img src={BlueCircle} alt="info" className="modal-note-list-circle" onClick={() => {
                                        setStatus("lightskyblue")
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        Important
                                    </Tooltip>
                                    }>
                                    <img src={YellowCircle} alt="important" className="modal-note-list-circle" onClick={() => {
                                        setStatus('darkgoldenrod')
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        Urgent
                                    </Tooltip>
                                    }>
                                    <img src={RedCircle} alt="urgent" className="modal-note-list-circle" onClick={() => {
                                        setStatus('red')
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                        </List>
                    </div>
                </Modal.Footer>
            </Modal>

            <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
                <div id="drawer-container" style={{
                    display: "flex",
                    flexFlow: "column", 
                    justifyContent: "flex-end",
                    padding: "5%", 
                    maxHeight: "90vh"}}>
                    
                    <div><Input type="text" name="title" placeholder="Titre de la note" className="modal-note-title" maxLength="35" onChange={handleChangeTitle} required /></div>
                    <div><Input type="text" placeholder="Rédiger une note..." value={note} className="modal-note-input" onChange={handleChangeNote} required /></div>
                    <DatePicker
                        id="calendar"
                        className="react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input"
                        inline={showCalendar}
                        selected={startDate}
                        value={startDate}
                        onChange={changedDate => {
                            setStartDate(changedDate)
                            hideCalendar()
                        }}
                        placeholderText="Date du jour"
                        locale="fr-FR"
                        dateFormat="d MMMM yyyy"
                    />
                    <div className="modal-note-button-container">
                        <span className="white-band"></span>
                        <input type="file" className="modal-note-file-input"
                          onChange={handleImgChange} />
                      <img src={Upload} className="modal-note-file-icon" alt="uploadIcon" />
                        {renderSwitch(status)}
                        <img src={Calendar} alt="sendIcon" className="modal-note-calendar-icon" onClick={changeDrawerHeight} />
                        <img src={Send} alt="sendIcon" className="modal-note-send-icon" onClick={handleSubmit} />
                    </div>
                    <List component="nav" aria-label="main mailbox folders" className="modal-note-list" style={{
                            display: checked ? "flex" : "none",
                            flexFlow: "row",
                            alignItems: "center",
                            marginTop: "2vh"
                        }}>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        defaut
                                    </Tooltip>
                                    }>
                                    <img src={Circle} alt="info" className="modal-note-list-circle" onClick={() => {
                                        setStatus("default")
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        Info
                                    </Tooltip>
                                    }>
                                    <img src={BlueCircle} alt="info" className="modal-note-list-circle" onClick={() => {
                                        setStatus("lightskyblue")
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        Important
                                    </Tooltip>
                                    }>
                                    <img src={YellowCircle} alt="important" className="modal-note-list-circle" onClick={() => {
                                        setStatus('darkgoldenrod')
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                            <ListItemIcon button>
                                <ListItemIcon>
                                <OverlayTrigger
                                    placement="right"
                                    overlay={
                                    <Tooltip id="title">
                                        Urgent
                                    </Tooltip>
                                    }>
                                    <img src={RedCircle} alt="urgent" className="modal-note-list-circle" onClick={() => {
                                        setStatus('red')
                                        setChecked(false)}} />
                                </OverlayTrigger>
                                </ListItemIcon>
                            </ListItemIcon>
                        </List>
                </div>
            </Drawer>
            
        </div>
    )
}

export default Messenger