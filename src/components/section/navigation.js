import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import { Navbar, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import AdminBoard from './form/adminBoard'
import FeedbackBox from './form/feedbackBox'
import Drawer from './common/drawer'
import SuperAdminDrawer from '@material-ui/core/Drawer'
import Logout from '../../images/logout.png'
import SuperAdmin from '../../svg/superhero.svg'
import Magician from '../../svg/magician.svg'
import Ghost from '../../svg/ghost.svg'
import Support from './form/phoneForm/phoneToolbarOverlays/supportOverlay'
import '../css/navigation.css'
import Notifications from './notifications'
import { db, auth, storage } from '../../Firebase'
import List from '@material-ui/core/List';
import Logo from '../../svg/mshPro-newLogo-transparent.png'
import moment from 'moment'
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/pt';
import 'moment/locale/en-gb';
import { useTranslation } from "react-i18next"
import Avatar from 'react-avatar'
import { Link } from 'gatsby'

const Navigation = ({user, userDB}) =>{

    const [list, setList] = useState(false)
    const [activate, setActivate] = useState(false)
    const [oldNote, setOldNote] = useState([])
    const { t, i18n } = useTranslation()

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
            .doc(userDB.hotelId)
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
                console.log(snapMessages)
                setOldNote(snapMessages)
            });
            return unsubscribe
    }, [])


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

    console.log("///////", listImg)
    moment.locale(userDB.language)
    return(
        <div className="shadow-lg bg-white">
            <Navbar expand="lg" style={{
                    display: "flex",
                    flexFlow: "row",
                    justifyContent: "space-between",
                    height: "7vh"
                }}>
                {!!user && userDB &&
                <Drawer className="drawer" user={user} userDB={userDB} style={{display: typeof window && window.innerWidth < 768 ? "flex" : "none"}} />}
                <Navbar.Brand className="brand"
                    onClick={handleMove}>
                        <img src={userDB.logo ? userDB.logo : Logo} className="logo-msh" /></Navbar.Brand>
                    {user.uid === "06nOvemBre198524SEptEMbrE201211noVEMbre20171633323179047" && <img src={SuperAdmin} className="super-admin-icon" style={{display: typeof window && window.innerWidth < 768 ? "flex" : "none"}} onClick={() => handleShowDrawer()} />}
                    {/*<div style={{display: typeof window && window.innerWidth < 768 ? "none" : "flex", fontSize: "1.5em"}}>{moment().format('LL')}</div>*/}
                    <div style={{
                        display: "flex",
                        flexFlow: "row",
                        justifyContent: "space-around",
                        width: "35%",
                        marginLeft: "10vw"
                    }}>
                        <Link style={{color: "black", textDecoration: "none"}} to="/singlePage">Activités</Link>
                        <Link style={{color: "black", textDecoration: "none"}} to="/notebook">Consignes</Link>
                        <Link style={{color: "black", textDecoration: "none"}} to="/chat">Chat Client</Link>
                        <Link style={{color: "black", textDecoration: "none"}} to="/crm">C.R.M</Link>
                        <Link style={{color: "black", textDecoration: "none"}} to="/Lost">Objets Trouvés</Link>
                    </div>
                    <div className="nav_container">
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="title">
                            {t("msh_navigation.tooltip_user_profile")}
                          </Tooltip>
                        }>
                        <Avatar 
                        name={userDB.username}
                        round={true}
                        size="25"
                        color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])}
                        style={{cursor: "pointer"}}
                        onClick={()=>navigate('/doorsStage')}
                        />
                    </OverlayTrigger>
                    {userDB && user&&
                        <AdminBoard user={user} userDB={userDB} />}
                    {userDB && user&&
                        <FeedbackBox user={user} userDB={userDB} />}
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="title">
                            {t("msh_navigation.tooltip_deconnexion")}
                          </Tooltip>
                        }>
                    <img src={Logout} alt="Fom" className="nav_icons" alt="connect" onClick={handleShow} />
                    </OverlayTrigger>
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
                    <a href="https://mysweethotelpro.com/registerForm" target="_blank"><img src={Magician} alt="Magic box" className="drawer_icons" /></a>
                    <img src={Ghost} alt="Ghost Host" className="drawer_icons" onClick={()=>{navigate("/ghostHost")}} />
                    </List>
               </div>
            </SuperAdminDrawer>}
        </div>
    )
}

export default Navigation