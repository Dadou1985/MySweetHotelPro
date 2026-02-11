import React, { useContext, useState } from 'react'
import { Input } from 'reactstrap'
import NoteBox from './noteBox'
import PhoneNoteBox from './phoneNoteBox'
import DatePicker from "react-datepicker"
import "../css/messenger_datepicker.css"
import PerfectScrollbar from 'react-perfect-scrollbar'
import Send from '../../images/paper-plane.png'
import { StaticImage } from 'gatsby-plugin-image'
import { Modal, Button, Tooltip, OverlayTrigger, } from 'react-bootstrap'
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Drawer from '@material-ui/core/Drawer'
import { FirebaseContext, db, storage } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { useTranslation } from "react-i18next"
import '../css/section/messenger.css'

const Messenger = ({filterDate}) =>{

    const [note, setNote] = useState(null)
    const [title, setTitle] = useState(null)
    const [status, setStatus] = useState("darkgoldenrod")
    const [checked, setChecked] = useState(false)
    const [img, setImg] = useState(null)
    const [url, setUrl] = useState("")
    const [startDate, setStartDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false)
    const [activate, setActivate] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const { t, i18n } = useTranslation()
    const { userDB, setUserDB, user } = useContext(FirebaseContext)

    const noteBoxType = [
        {
            id: 1,
            category: "darkgoldenrod", 
            title: 'msh_messenger.m_reception_team'
        },
        {
            id: 2,
            category: "cornflowerblue", 
            title: 'msh_messenger.m_housekeeping_team'
        },
        {
            id: 3,
            category: "red", 
            title: 'msh_maintenance.m_title'
        }
    ]


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

    const renderSwitch = (status) => {
        switch(status) {
          case 'darkgoldenrod':
            return <div style={{width: "9%"}} onClick={() => setChecked(!checked)}>
                <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/yellow-circle.svg' alt="important" className="modal-note-circle"  />
            </div>
          case 'red':
            return <div style={{width: "9%"}} onClick={() => setChecked(!checked)}>
                <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/red-circle.svg' alt="important" className="modal-note-circle"  />
            </div>
          case 'lightskyblue':
            return <div style={{width: "9%"}} onClick={() => setChecked(!checked)}>
                <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/blue-circle.svg' alt="important" className="modal-note-circle"  />
            </div>
        default:
            return <div style={{width: "9%"}} onClick={() => setChecked(!checked)}>
                <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/yellow-circle.svg' alt="important" className="modal-note-circle"  />
            </div>
        }
      }

    const addNote = async (marker, url) => {
        try {
            const docRef = await db.collection('hotels')
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
                })
            console.log(docRef.id)
        } catch (error) {
            console.error(error)
        }
    }

    const addNotification = async (notification) => {
        const doc = await db.collection('notifications')
            .add({
                content: notification,
                hotelId: userDB.hotelId,
                markup: Date.now()
            })
        return console.log('nouvelle notitfication')
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
                        addNote(0, url)
                        addNotification(notif)
                        setStartDate(new Date())
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
        } else {
            setNote("")
            setTitle("")
            let marker = startDate.getTime()
                
            if(moment(startDate).format('L') !== moment(new Date()).format('L')) {
                const notif = t("msh_messenger.m_notif") + moment(startDate).format('L') 
                addNote(0, null)
                addNotification(notif)
                setStartDate(new Date())
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
        setShowCalendar(!showCalendar)
    }

    const hideCalendar = () => {
        setShowCalendar(false)
    }

    
    
    return(
        <div className="messenger_container">
            {typeof window !== `undefined` && window.innerWidth > 768 ?
            <PerfectScrollbar className="perfect-scrollbar">
                {noteBoxType.map((data) => 
                    <div className="messenger_notebox" key={data.id}> 
                    {!!filterDate &&
                    <NoteBox filterDate={filterDate} category={data.category} title={data.title} />}
                    <div className="icon-add-note-container" onClick={() => {
                        setStatus(data.category)
                        handleShow()}}>
                        <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/plus3.svg' alt="Plus" className="icon-add-note" /> {t("msh_messenger.m_add_note")}
                    </div>
                </div>
                )}

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
                            <Input type="text" name="title" placeholder={t("msh_messenger.m_note_title_placeholder")} value={title} className="modal-note-title" maxLength="60" onChange={handleChangeTitle} required />
                            <Input type="textarea" placeholder={t("msh_messenger.m_note_body_placeholder")} value={note} className="modal-note-input" onChange={handleChangeNote} required />
                        </Modal.Body>
                        <Modal.Footer style={{borderTop: "none"}}>
                            <div className="modal-note-button-container">
                                <div style={{width: "5%", position: "relative", marginRight: "2vw", cursor: "pointer"}}>
                                    <input type="file" className="modal-note-file-input" onChange={handleImgChange} />
                                    <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/plus2.svg' className="modal-note-file-icon" alt="uploadIcon" />
                                </div>
                                <div style={{width: "5%", position: "relative", marginRight: "2vw"}}>
                                    <DatePicker
                                        id="calendar"
                                        className="react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input"
                                        selected={startDate}
                                        value={startDate}
                                        onChange={changedDate => {
                                            const notifChangeDate = t("msh_messenger.m_notif_change_date") + moment(startDate).format('L') 
                                            setStartDate(changedDate)
                                            addNotification(notifChangeDate)
                                        }}
                                        placeholderText={t("msh_messenger.m_calendar_title")}
                                        locale="fr-FR"
                                        dateFormat="d MMMM yyyy"
                                        minDate={new Date()}
                                    />
                                    <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/calendar.svg' alt="sendIcon" className="modal-note-calendar-icon" />
                                </div>
                                <img src={Send} alt="sendIcon" className="modal-note-send-icon" onClick={() => {
                                    if(title && note) {
                                        handleSubmit()
                                    } else {
                                        addNotification(t("msh_messenger.m_notif_submit_error"))
                                    }
                                }} />
                            </div>
                        </Modal.Footer>
                    </Modal>
            </PerfectScrollbar> :
            <>
                <Button className="btn-msh phone_submitButton" style={{zIndex: 100}} size="md" onClick={handleShow}>{t("msh_messenger.m_add_note")}</Button>
                <PerfectScrollbar className="perfect-scrollbar">
                    <div className="messenger_notebox">
                        {!!userDB && !!setUserDB && !!filterDate &&
                        <PhoneNoteBox filterDate={filterDate} />}
                    </div>
                </PerfectScrollbar>

                <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
                <div id="drawer-container" style={{
                    display: "flex",
                    flexFlow: "column", 
                    justifyContent: "flex-end",
                    padding: "5%", 
                    maxHeight: "90vh"}}>
                    <div style={{width: "100%"}} onClick={() => {
                        handleHideDrawer()
                        setChecked(false)
                        }} >
                        <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/close.svg' alt="Close Button" style={{width: "5%", float: "right", zIndex: 100}}/>
                    </div>
                    <h4 className='phone_tab'>{t("msh_messenger.m_drawer_title")}</h4>
                    <div><Input type="text" name="title" placeholder={t("msh_messenger.m_drawer_note_title")} className="modal-note-title" maxLength="35" onChange={handleChangeTitle} required /></div>
                    <div><Input type="text" placeholder={t("msh_messenger.m_note_body_placeholder")} value={note} className="modal-note-input" onChange={handleChangeNote} required /></div>
                    <div className="modal-note-button-container">
                        <span className="white-band"></span>
                        <input type="file" className="modal-note-file-input"
                          onChange={handleImgChange} />
                        <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/plus2.svg' className="modal-note-file-icon" alt="uploadIcon" />
                        {renderSwitch(status)}
                        <div style={{width: "9%", position: "relative"}}>
                            <DatePicker
                                id="calendar"
                                className="react-datepicker__input-time-container .react-datepicker-time__input-container .react-datepicker-time__input input"
                                selected={startDate}
                                value={startDate}
                                onChange={changedDate => {
                                    const notifChangeDate = t("msh_messenger.m_notif_change_date") + moment(startDate).format('L') 
                                    setStartDate(changedDate)
                                    addNotification(notifChangeDate)
                                }}
                                placeholderText={t("msh_messenger.m_calendar_title")}
                                locale="fr-FR"
                                dateFormat="d MMMM yyyy"
                                withPortal
                                minDate={new Date()}
                            />
                            <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/calendar.svg' alt="sendIcon" className="modal-note-calendar-icon" />
                        </div>
                        <div style={{width: "9%"}} onClick={() => {
                                    if(title && note) {
                                        handleSubmit()
                                    } else {
                                        addNotification(t("msh_messenger.m_notif_submit_error"))
                                    }
                                }}>
                            <StaticImage objectFit='contain' placeholder='blurred' src='../../images/paper-plane.png' alt="sendIcon" className="modal-note-circle"  />
                        </div>
                    </div>
                    <List component="nav" aria-label="main mailbox folders" className="modal-note-list" style={{
                            display: checked ? "flex" : "none",
                            flexFlow: "row",
                            alignItems: "center",
                            marginTop: "2vh",
                            justifyContent: "space-between",
                        }}>
                        <ListItemIcon button={true}>
                            <ListItemIcon>
                            <div style={{width: "100%", textAlign: "center"}} onClick={() => {
                                    setStatus('darkgoldenrod')
                                    setChecked(false)}}>
                                    <StaticImage objectFit='contain' placeholder="blurred" src='../../svg/yellow-circle.svg' alt="important" className="modal-note-list-circle" />
                                    <div style={{width: "100%", textAlign: "center"}}>{t("msh_messenger.m_reception_team")}</div>
                                </div>
                            </ListItemIcon>
                        </ListItemIcon>
                        <ListItemIcon button={true}>
                            <ListItemIcon>
                            <div style={{width: "100%", textAlign: "center"}} onClick={() => {
                                    setStatus('lightskyblue')
                                    setChecked(false)}}>
                                    <StaticImage objectFit='contain' placeholder="blurred" src='../../svg/blue-circle.svg' alt="info" className="modal-note-list-circle" />
                                    <div style={{width: "100%", textAlign: "center"}}>{t("msh_messenger.m_housekeeping_team")}</div>
                                </div>
                            </ListItemIcon>
                        </ListItemIcon>
                        <ListItemIcon button={true}>
                            <ListItemIcon>
                            <div style={{width: "100%", textAlign: "center"}} onClick={() => {
                                    setStatus('red')
                                    setChecked(false)}}>
                                    <StaticImage objectFit='contain' placeholder="blurred" src='../../svg/red-circle.svg' alt="urgent" className="modal-note-list-circle" />
                                    <div style={{width: "100%", textAlign: "center"}}>{t("msh_messenger.m_technical_team")}</div>
                                </div>    
                            </ListItemIcon>
                        </ListItemIcon>
                    </List>
                </div>
            </Drawer>
            </>}    
        </div>
    )
}

export default Messenger