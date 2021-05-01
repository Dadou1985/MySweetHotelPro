import React, { useContext, useState } from 'react'
import { navigate } from 'gatsby'
import { Navbar, OverlayTrigger, Tooltip, Modal, Button } from 'react-bootstrap'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'
import AdminBoard from './form/adminBoard'
import FeedbackBox from './form/feedbackBox'
import CallCenter from './CallCenter'
import Avatar from 'react-avatar'
import MenuSharpIcon from '@material-ui/icons/MenuSharp'
import Drawer from './common/drawer'
import SuperAdminDrawer from '@material-ui/core/Drawer'
import Fom from '../../svg/fom.svg'
import SuperAdmin from '../../svg/superhero.svg'
import Magician from '../../svg/magician.svg'
import Ghost from '../../svg/ghost.svg'
import Support from '../../svg/support.svg'
import '../css/navigation.css'
import Notifications from './notifications'
import { FirebaseContext, db, auth } from '../../Firebase'
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';


const Navigation = ({user, userDB}) =>{

    const [list, setList] = useState(false)
    const [activate, setActivate] = useState(false)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleShowDrawer = () => setActivate(true)
     const handleHideDrawer = () => setActivate(false)

    const handleLogout = async() =>{
        await auth.signOut().then(()=>navigate('/'))
    }

    const handleMove = () => navigate('/singlePage')

    console.log("///////", userDB)

    return(
        <div className="shadow-lg bg-white">
            <Navbar bg="light" expand="lg" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "7vh"
                }}>
                {!!user && userDB &&
                <Drawer className="drawer" user={user} userDB={userDB} />}
                <Navbar.Brand className="brand"
                    onClick={handleMove}>MySweetHotel<p>Pro</p></Navbar.Brand>
                    {/*{!!user &&
                    <div style={{
                        display: "flex",
                        width: "50%",
                        height: "5vh",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bolder",
                        fontSize: "XXL"
                    }}>{user.displayName}</div>}*/}
                    {user.uid === "007ec77a3e6adcf041b88bc5f07a84dce4e2ea2e1619832341794" && <img src={SuperAdmin} className="super-admin-icon" onClick={() => handleShowDrawer()} />}
                    <div className="nav_container">
                    <div className="icon_container">
                    {/*!!user &&
                    <Avatar 
                    name={user.username}
                    round={true}
                    size="30"
                    color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
                    />*/}
                    {userDB && user&&
                        <AdminBoard user={user} userDB={userDB} />}
                    {userDB && user&&
                        <FeedbackBox user={user} userDB={userDB} />}
                    </div>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="title">
                            Portail utilisateur
                          </Tooltip>
                        }>
                    <img src={Fom} alt="Fom" style={{width: "7%", marginLeft: "1vw", marginRight: "1vw", filter: "drop-shadow(1px 1px 1px)"}} onClick={()=>navigate('/doorsStage')} />
                    </OverlayTrigger>
                    <div className="username_title"><b>{user.displayName}</b></div>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="title">
                            Déconnection
                          </Tooltip>
                        }>
                    <PowerSettingsNewIcon alt="connect" className="shuttDown_button nav_icons" onClick={handleShow} />
                    </OverlayTrigger>
                </div>
            </Navbar>
            <Modal show={list} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-sm">
                    Voulez-vous quitter l'application ?
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button variant="danger" onClick={handleLogout}>Quitter</Button>
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
                    <img src={Support} alt="Cab" className="drawer_icons" onClick={()=>{navigate("/chatSupport")}} />
                    <img src={Magician} alt="Cab" className="drawer_icons" onClick={()=>{navigate("/adminMaker")}} />
                    <img src={Ghost} alt="Cab" className="drawer_icons" onClick={()=>{navigate("/ghostHost")}} />
                    </List>
               </div>
            </SuperAdminDrawer>}
        </div>
    )
}

export default Navigation