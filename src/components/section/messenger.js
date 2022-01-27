import React, { useContext, useState } from 'react'
import { Input } from 'reactstrap'
import NoteBox from './noteBox'
import NoteBoxHousekeeping from './noteBoxHousekeeping'
import NoteBoxMaintenance from './noteBoxMaintenance'
import DatePicker from "react-datepicker"
import "../css/messenger_datepicker.css"
import PerfectScrollbar from 'react-perfect-scrollbar'
import Send from '../../svg/paper-plane.svg'
import Close from '../../svg/close.svg'
import Calendar from '../../svg/calendar.svg'
import Plus from '../../svg/plus3.svg'
import { Modal, Button } from 'react-bootstrap'
import Upload from '../../svg/plus2.svg'
import Drawer from '@material-ui/core/Drawer'
import { FirebaseContext, db, storage } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { useTranslation } from "react-i18next"

const Messenger = ({filterDate}) =>{

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
    const { t, i18n } = useTranslation()
    const { userDB, setUserDB, user } = useContext(FirebaseContext)

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

    const handleClose = () => setShowModal(false)
    const handleShow = () => {
        if(window.innerWidth > 768) {
            setShowModal(true)
        }else{
            setActivate(true)
            hideCalendar()
        }
    }

    const addNote = (marker, url) => {
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('note')
            .add({
            title: title,
            author: userDB.username,
            text: note,
            status: status,
            isChecked: false,
            date: moment(startDate).format('LL'),
            hour: moment(startDate).format('LT'),
            img: url === undefined ? "" : url,
            markup: marker,
            userId: user.uid
            }).then(function(docRef){
            console.log(docRef.id)
            }).catch(function(error) {
            console.error(error)
            })
    }

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }

    const handleSubmit = (event) =>{
        event.preventDefault()
        if(img !== null) {
            const uploadTask = storage.ref(`msh-photo-note/${img.name}`).put(img)
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {console.log(error)},
          () => {
            storage
              .ref("msh-photo-note")
              .child(img.name)
              .getDownloadURL()
              .then(url => {
                const uploadTask = () => {
                    setNote("")
                    setTitle("")
                    let marker = startDate.getTime()
                        
                    if(moment(startDate).format('L') !== moment(new Date()).format('L')) {
                        const notif = t("msh_messenger.m_notif") + moment(startDate).format('L') 
                        addNote(marker, url)
                        addNotification(notif)
                        setStartDate(new Date)
                        handleHideDrawer()
                       return setShowModal(false)
                    }else{
                        addNote(marker, url)
                        handleHideDrawer()
                        setShowModal(false)
                    }
                    
                }
                  return setImg(null, uploadTask())})
          }
        )
        }else{
            setNote("")
            setTitle("")
            let marker = startDate.getTime()
                
            if(moment(startDate).format('L') !== moment(new Date()).format('L')) {
                const notif = t("msh_messenger.m_notif") + moment(startDate).format('L') 
                addNote(marker, null)
                addNotification(notif)
                setStartDate(new Date)
                handleHideDrawer()
                return setShowModal(false)
            }else{
                addNote(marker, null)
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

    console.log('*****', img)
    
    return(
        <div className="messenger_container">
            <PerfectScrollbar className="perfect-scrollbar">
                <div className="messenger_notebox">
                    
                    {!!userDB && !!setUserDB && !!filterDate &&
                    <NoteBox filterDate={filterDate} />}
                    {typeof window !== `undefined` && window.innerWidth > 768 ?
                <div className="icon-add-note-container" onClick={() => {
                    setStatus("darkgoldenrod")
                    handleShow()}}>
                    <img src={Plus} alt="Plus" className="icon-add-note" /> {t("msh_messenger.m_add_note")}
                </div> 
            :
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={() => {
                setStatus("darkgoldenrod")
                handleShow()}}>{t("msh_messenger.m_add_note")}</Button>}
                </div>
                <div className="messenger_notebox">
                    {!!userDB && !!setUserDB && !!filterDate &&
                    <NoteBoxHousekeeping filterDate={filterDate} />}
                    {typeof window !== `undefined` && window.innerWidth > 768 ?
                <div className="icon-add-note-container" onClick={() => {
                    setStatus("cornflowerblue")
                    handleShow()}}>
                    <img src={Plus} alt="Plus" className="icon-add-note" /> {t("msh_messenger.m_add_note")}
                </div> 
            :
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={() => {
                setStatus("cornflowerblue")
                handleShow()}}>{t("msh_messenger.m_add_note")}</Button>}
                </div>
                <div className="messenger_notebox">
                    {!!userDB && !!setUserDB && !!filterDate &&
                    <NoteBoxMaintenance filterDate={filterDate} />}
                    {typeof window !== `undefined` && window.innerWidth > 768 ?
                <div className="icon-add-note-container" onClick={() => {
                    setStatus("red")
                    handleShow()}}>
                    <img src={Plus} alt="Plus" className="icon-add-note" /> {t("msh_messenger.m_add_note")}
                </div> 
            :
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={() => {
                setStatus("red")
                handleShow()}}>{t("msh_messenger.m_add_note")}</Button>}
                </div>
            </PerfectScrollbar>
            <Modal show={showModal} 
            size="lg"
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton style={{backgroundColor: status}}>
                <Modal.Title id="example-modal-sizes-title-sm" style={{width: "100%"}}>
                    {t("msh_messenger.m_note_title")}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Input type="text" name="title" placeholder={t("msh_messenger.m_note_title_placeholder")} className="modal-note-title" maxLength="60" onChange={handleChangeTitle} required />
                    <Input type="textarea" placeholder={t("msh_messenger.m_note_body_placeholder")} value={note} className="modal-note-input" onChange={handleChangeNote} required />
                </Modal.Body>
                <Modal.Footer style={{borderTop: "none"}}>
                    <div className="modal-note-button-container">
                        <input type="file" className="modal-note-file-input" onChange={handleImgChange} />
                      <img src={Upload} className="modal-note-file-icon" alt="uploadIcon" />
                         <DatePicker
                            id="calendar"
                            className="react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input"
                            selected={startDate}
                            value={startDate}
                            onChange={changedDate => setStartDate(changedDate)}
                            placeholderText={t("msh_messenger.m_calendar_title")}
                            locale="fr-FR"
                            dateFormat="d MMMM yyyy"
                        />
                        <img src={Calendar} alt="sendIcon" className="modal-note-calendar-icon" />
                        <img src={Send} alt="sendIcon" className="modal-note-send-icon" onClick={handleSubmit} />
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
                        <div style={{width: "100%",}}>
                            <img src={Close} style={{width: "5%", float: "right"}} onClick={handleHideDrawer} />
                        </div>
                    <h4 style={{textAlign: "center", marginBottom: "3vh"}}>{t("msh_messenger.m_drawer_title")}</h4>
                    <div><Input type="text" name="title" placeholder={t("msh_messenger.m_drawer_note_title")} className="modal-note-title" maxLength="35" onChange={handleChangeTitle} required /></div>
                    <div><Input type="text" placeholder={t("msh_messenger.m_note_body_placeholder")} value={note} className="modal-note-input" onChange={handleChangeNote} required /></div>
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
                        placeholderText={t("msh_messenger.m_calendar_title")}
                        locale="fr-FR"
                        dateFormat="d MMMM yyyy"
                    />
                    <div className="modal-note-button-container">
                        <span className="white-band"></span>
                        <input type="file" className="modal-note-file-input"
                          onChange={handleImgChange} />
                      <img src={Upload} className="modal-note-file-icon" alt="uploadIcon" />
                        <img src={Calendar} alt="sendIcon" className="modal-note-calendar-icon" onClick={changeDrawerHeight} />
                        <img src={Send} alt="sendIcon" className="modal-note-send-icon" onClick={handleSubmit} />
                    </div>
                </div>
            </Drawer>
            
        </div>
    )
}

export default Messenger