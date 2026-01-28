import React, { useState, useEffect, useContext } from 'react'
import { navigate } from 'gatsby'
import { Navbar,  Modal, Button, Tab, FloatingLabel, Row, Col, Nav, Form } from 'react-bootstrap'
import Drawer from '../../helper/common/drawer'
import SuperAdminDrawer from '@material-ui/core/Drawer'
import { StaticImage } from 'gatsby-plugin-image'
import Support from './form/phoneForm/phoneToolbarOverlays/supportOverlay'
import Notifications from './notifications'
import { db, auth, storage } from '../../Firebase'
import List from '@material-ui/core/List';
import moment from 'moment'
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/pt';
import 'moment/locale/en-gb';
import { useTranslation } from "react-i18next"
import { Link } from 'gatsby'
import { Menubar } from 'primereact/menubar';
import AdminRegister from './form/adminRegister'
import UserList from './form/userList'
import Logo from '../../svg/msh-newLogo-transparent.png'
import '../css/section/navigation.css'
import {FirebaseContext} from '../../Firebase'
import { withTrans } from '../../../i18n/withTrans'

const Navigation = () =>{
    // const firebaseCtx = useContext(FirebaseContext) || { user: null, userDB: null }
    const { userDB, user } = useContext(FirebaseContext)   
    const [list, setList] = useState(false)
    const [activate, setActivate] = useState(false)
    const [oldNote, setOldNote] = useState([])
    const [formValue, setFormValue] = useState({categorie: "improvement", feedback: ""})
    const [showAdminModal, setShowAdminModal] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const { t } = useTranslation() 

    const isDesktop = window && window.innerWidth > 768 ? "flex" : "none"
    const isMobile = window && window.innerWidth < 768 ? "flex" : "none"

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleShowDrawer = () => setActivate(true)
     const handleHideDrawer = () => setActivate(false)

    const handleLogout = async() =>{
        await auth.signOut().then(()=>navigate('/'))
    }

    const handleMove = () => navigate('/singlePage')

    let previousDays = Date.now() - 123274000

    useEffect(() => {
        const handleDeleteImgNote = () => {
            return db.collection('hotels')
            .doc(userDB?.hotelId)
            .collection("note")
            .where("markup", "<", previousDays)
        }

        let unsubscribe = handleDeleteImgNote().onSnapshot(function(snapshot) {
            const snapMessages = []
            snapshot.forEach(function(doc) {          
                snapMessages.push({
                    id: doc.id,
                    ...doc.data()
                })        
                });
                setOldNote(snapMessages)
            });
            return unsubscribe
    }, [])

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleSubmitFeedback = async(event) => {
    event.preventDefault()
    setFormValue({categorie: "improvement", feedback: ""})
    const notif = t("msh_feedback_box.f_notif")
    await db.collection('feedbacks')
        .doc('category')
        .collection(formValue.categorie)
        .add({
            author: userDB.username,
            hotelName: userDB.hotelName,
            hotelRegion: userDB.hotelRegion,
            hotelDept: userDB.hotelDept,
            text: formValue.feedback,
            markup: Date.now()
        })
        return db.collection('notifications')
            .add({
            content: notif,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(handleClose)
    }


    const listImg = oldNote.filter(note => note.img)

    const handleDeleteImg = (imgId) => {
        const storageRef = storage.refFromURL(imgId)
        const imageRef = storage.ref(storageRef.fullPath)

        imageRef.delete()
        .then(() => {
            console.log(`${imgId} has been deleted succesfully`)
        })
        .catch((e) => {
            console.log('Error while deleting the image ', e)
        })
      }

    const handleDeleteImgNoteDB = (noteId) => {
        return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection('note')
        .doc(noteId)
        .update({
            img: ""
        })
    }

    if(listImg.length > 0) {
        listImg.forEach(function(note){
            handleDeleteImgNoteDB(note.id)
            .then(handleDeleteImg(note.img))
        })
    }

    const items = [
        {
            label: 'Utilisateur',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: t("msh_navigation.tooltip_user_profile"),
                    icon: 'pi pi-fw pi-id-card',
                    command: ()=> navigate('/doorsStage'),
                },
                {
                    label: t("msh_admin_board.a_title"),
                    icon: 'pi pi-fw pi-cog',
                    command: () => setShowAdminModal(true)
                },
                // {
                //     label: t("msh_feedback_box.f_title"),
                //     icon: 'pi pi-fw pi-star',
                //     command: () => setShowFeedbackModal(true)
                // },
                {
                    label: t("msh_navigation.tooltip_deconnexion"),
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => handleShow()
                }
            ]
        }
    ];

    moment.locale(userDB?.language)

    return(
        <div className="shadow-lg bg-white">
            <Navbar expand="lg" style={{
                    display: "flex",
                    flexFlow: "row",
                    justifyContent: "space-between",
                    height: "7vh",
                    paddingInline: "2vw"
                }}>
                {!!user && userDB &&
                <Drawer className="drawer" user={user} userDB={userDB} style={{display: isMobile}} />}
                <Navbar.Brand className="brand"
                    onClick={handleMove}>
                        <img src={userDB?.logo ? userDB.logo : Logo} className="logo-msh" alt="Logo MSH" /></Navbar.Brand>
                    {user?.uid === process.env.GATSBY_GHOST_HOST_UID && <div onClick={() => handleShowDrawer()}>
                            <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/superhero.svg' className="super-admin-icon" style={{display: isMobile}} alt="Logo" />
                        </div>}
                    {/*<div style={{display: typeof window && window.innerWidth < 768 ? "none" : "flex", fontSize: "1.5em"}}>{moment().format('LL')}</div>*/}
                    <div style={{
                        display: "flex",
                        flexFlow: "row",
                        justifyContent: "space-around",
                        width: "70%",
                        maxWidth: "720px",
                        height: "7vh",
                        // marginLeft: "10vw"
                    }}>
                        <Link className='cental-menu' style={{display: isDesktop}} to="/singlePage">{t("msh_dashboard.d_title")}</Link>
                        <Link className='cental-menu' style={{display: isDesktop}} to="/notebook">{t("msh_messenger.m_note_big_title")}</Link>
                        <Link className='cental-menu' style={{display: isDesktop}} to="/chat">{t('msh_chat.c_chat_title')}</Link>
                        <Link className='cental-menu' style={{display: isDesktop}} to="/crm">C.R.M</Link>
                        <Link className='cental-menu' style={{display: isDesktop}} to="/Lost">{t("msh_lost_found.l_title")}</Link>
                    </div>
                    <div className="nav_container">
                    <Menubar model={items} style={{backgroundColor: "white", border: "none"}} />
                </div>
            </Navbar>

            <Modal show={list} centered onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                    {t("msh_navigation.deconnexion_modal_title")}
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="danger" style={{width: "100%"}} onClick={handleLogout}>{t("msh_navigation.deconnexion_modal_button")}</Button>
                </Modal.Body>
            </Modal>

            <Modal show={showAdminModal}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setShowAdminModal(false)}
                >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title id="contained-modal-title-vcenter">
                    {t("msh_admin_board.a_title")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Tab.Container defaultActiveKey="Créer" id="uncontrolled-tab-example">
                    <Row>
                        <Col sm={3} style={{borderRight: "1px solid lightgrey"}}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item style={{cursor: "pointer"}}>
                            <Nav.Link  eventKey="Créer">{t("msh_admin_board.a_first_tab_title")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{cursor: "pointer"}}>
                            <Nav.Link eventKey="Supprimer">{t("msh_admin_board.a_second_tab_title")}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        </Col>
                        <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="Créer">
                                {!!user && !!userDB &&
                                <AdminRegister user={user} userDB={userDB} hide={() => setShowAdminModal(false)} /> }
                            </Tab.Pane>
                            <Tab.Pane eventKey="Supprimer">
                                {!!user && !!userDB &&
                                <UserList user={user} userDB={userDB} />}
                            </Tab.Pane>
                        </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
                </Modal.Body>
            </Modal>

            <Modal show={showFeedbackModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => setShowFeedbackModal(false)}
                >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title id="contained-modal-title-vcenter">
                    {t("msh_feedback_box.f_title")}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
        
                <div style={{
                        display: "flex",
                        flexFlow: "row wrap",
                        justifyContent: "space-around",
                        padding: "5%",
                        textAlign: "center"
                    }}>
                        <div style={{marginBottom: "2vh"}}>
                            <Form.Group controlId="description">
                            <h4>{t("msh_feedback_box.f_subtitle")}</h4>
                            </Form.Group>
                        </div>
                        <div style={{width: "100%", marginBottom: "1vh"}}>
                            <Form.Group controlId="exampleForm.SelectCustom" style={{width: "100%"}}>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Catégorie"
                                className="mb-3"
                            >
                                <Form.Select class="selectpicker" 
                                    value={formValue.categorie} name="categorie" onChange={handleChange} 
                                        style={{
                                        width: "100%", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option value="improvement">{t("msh_feedback_box.f_comment.c_improvement")}</option>
                                            <option value="satisfaction">{t("msh_feedback_box.f_comment.c_satisfaction")}</option>
                                </Form.Select>
                            </FloatingLabel>
                            </Form.Group>
                            </div>
                        <div style={{width: "100%", marginBottom: "1vh"}}>
                            <Form.Group controlId="description" style={{width: "100%"}}>
                            <FloatingLabel
                                controlId="floatingInput"
                                label={t("msh_feedback_box.f_input_textarea")}
                                className="mb-3"
                            >
                                <Form.Control as="textarea" type="text" 
                                placeholder={t("msh_feedback_box.f_input_textarea")} 
                                style={{width: "100%", height: "30vh", resize: "none"}} 
                                value={formValue.feedback} name="feedback" onChange={handleChange} />
                            </FloatingLabel>
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleSubmitFeedback}>{t("msh_general.g_button.b_send")}</Button>
                </Modal.Footer>
            </Modal>

            {!!userDB && !!user&&
            <Notifications />}
            {userDB && user &&
            <SuperAdminDrawer 
            anchor="right" 
            open={activate} 
            onClose={handleHideDrawer} 
            className="drawer_listlist drawer_fullList"
            user={user}
            userDB={userDB}>
               <div style={{padding: "3vw"}}> 
                <h4 className="drawer_title">Super Menu</h4>
                    <List className="drawer_listIcons3">
                    <Support />
                    <a href="https://mysweethotelpro.com/registerForm" target="_blank"><StaticImage objectFit='contain' placeholder='blurred' src='../../svg/magician.svg' alt="Magic box" className="drawer_icons" /></a>
                    <div onClick={()=>{navigate("/ghostHost")}}>
                        <StaticImage objectFit='contain' placeholder="blurred" src='../../svg/ghost.svg' alt="Ghost Host" className="drawer_icons" />
                    </div>
                    </List>
               </div>
            </SuperAdminDrawer>}
        </div>
    )
}

export default withTrans(Navigation)