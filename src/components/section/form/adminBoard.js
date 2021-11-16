import React, { useState } from 'react'
import { Tooltip, OverlayTrigger, Modal, Tab, Tabs } from 'react-bootstrap'
import Connection from '../../../svg/employee.svg'
import AdminRegister from './adminRegister'
import UserList from './userList'

const AdminBoard = ({user, userDB}) =>{

    const [tab, setTab] = useState(false)

    const handleCloseTab = () => setTab(false)
    const handleShowTab = () => setTab(true)

    if(userDB.adminStatus === true){
        return(
            <div>
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip id="title">
                        Administrateur
                        </Tooltip>
                    }>
                <img src={Connection} alt="connect" className="nav_icons" onClick={handleShowTab} />
                </OverlayTrigger>
    
    
                <Modal show={tab}
                        size="xl"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={handleCloseTab}
                        >
                        <Modal.Header closeButton className="bg-light">
                            <Modal.Title id="contained-modal-title-vcenter">
                            Interface Administrateur
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        
                        <Tabs defaultActiveKey="Créer" id="uncontrolled-tab-example" style={{display: "flex", flexFlow: "row", justifyContent: "space-around"}} variant="dark">
                                <Tab eventKey="Créer" title="Créer un utilisateur">
                                    {!!user && !!userDB &&
                                    <AdminRegister user={user} userDB={userDB} hide={handleCloseTab} /> }  
                                </Tab>
                                <Tab eventKey="Supprimer" title="Supprimer un utilisateur">
                                    {!!user && !!userDB &&
                                    <UserList user={user} userDB={userDB} />}
                                </Tab>
                            </Tabs>
                        </Modal.Body>
                    </Modal>
            </div>
        )
    }else{
        return <></>
    }
    
}

export default AdminBoard