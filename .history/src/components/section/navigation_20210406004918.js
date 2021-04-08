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
import Fom from '../../svg/fom.svg'
import '../css/navigation.css'
import Notifications from './notifications'
import FirebaseContext from '../../Firebase/context'
import { db, auth } from '../../Firebase/config'

const Navigation = () =>{

    const [list, setList] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

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
                <Drawer className="drawer" />
                <Navbar.Brand className="brand"
                    onClick={handleMove}><p>Izi</p>Shift</Navbar.Brand>
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
                    <div className="nav_container">
                    <div className="icon_container">
                    {/*!!user &&
                    <Avatar 
                    name={user.username}
                    round={true}
                    size="30"
                    color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
                    />*/}
                    {!!userDB && !!setUserDB &&
                        <AdminBoard />}
                    <FeedbackBox />
                    </div>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="title">
                            Changer d'espace
                          </Tooltip>
                        }>
                    <img src={Fom} alt="Fom" style={{width: "7%", marginLeft: "1vw", marginRight: "1vw", filter: "drop-shadow(1px 1px 1px)"}} onClick={()=>navigate('/doorsStage')} />
                    </OverlayTrigger>
                    <div className="username_title">Dadou</div>
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
            {!!userDB && !!setUserDB &&
            <Notifications />}
        </div>
    )
}

export default Navigation