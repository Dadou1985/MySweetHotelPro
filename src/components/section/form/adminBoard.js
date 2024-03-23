import React, { useState } from 'react'
import { Tooltip, OverlayTrigger, Modal, Tab, Tabs } from 'react-bootstrap'
import AdminRegister from './adminRegister'
import UserList from './userList'
import Divider from '@material-ui/core/Divider';
import { useTranslation } from "react-i18next"
import { StaticImage } from 'gatsby-plugin-image'

const AdminBoard = ({user, userDB}) =>{

    const [tab, setTab] = useState(false)
    const { t } = useTranslation()

    const handleCloseTab = () => setTab(false)
    const handleShowTab = () => setTab(true)

    if(userDB.adminStatus === true){
        return(
            <div>
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip id="title">
                        {t("msh_navigation.tooltip_admin_board")}
                        </Tooltip>
                    }>
                <StaticImage objectFit='contain' src='../../../images/admin.png' placeholder="blurred" alt="connect" className="nav_icons" onClick={handleShowTab} />
                </OverlayTrigger>
    
                <Modal show={tab}
                        size="xl"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide={handleCloseTab}
                        >
                        <Modal.Header closeButton className="bg-light">
                            <Modal.Title id="contained-modal-title-vcenter">
                            {t("msh_admin_board.a_title")}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        
                        <Tabs defaultActiveKey="Créer" id="uncontrolled-tab-example" style={{display: "flex", flexFlow: "row", justifyContent: "space-around"}} variant="dark">
                            <Tab eventKey="Créer" title={t("msh_admin_board.a_first_tab_title")}>
                                <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    alignItems: "center"
                                }}>
                                    <h3 style={{textAlign: "center"}}>{t("msh_admin_board.a_first_tab_title")}</h3>
                                    <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                                </div>
                                {!!user && !!userDB &&
                                <AdminRegister user={user} userDB={userDB} hide={handleCloseTab} /> }  
                            </Tab>
                            <Tab eventKey="Supprimer" title={t("msh_admin_board.a_second_tab_title")}>
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    alignItems: "center"
                                }}>
                                    <h3 style={{textAlign: "center"}}>{t("msh_admin_board.a_second_tab_title")}</h3>
                                    <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                                </div>
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