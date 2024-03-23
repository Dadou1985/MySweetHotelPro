import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import { FirebaseContext, db } from '../../../Firebase'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { StaticImage } from 'gatsby-plugin-image'
import { handleChange } from '../../../helper/formCommonFunctions'
import { 
    fetchCollectionBySorting2, 
    handleSubmitData2, 
    addNotification, 
    handleDeleteData2 
} from '../../../helper/globalCommonFunctions'
import InputElement from '../../../helper/common/InputElement'

const Annuaire = () =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({name: "", mobile: "", fix: ""})
    const {userDB} = useContext(FirebaseContext)
    const [footerState, setFooterState] = useState(true)
    const { t } = useTranslation()

    const notif = t("msh_phone_book.p_notif") 

    const handleShow = () => setList(true)
    const handleClose = () => {
        setFormValue("")
        setList(false)
    }

    const newData = {
        name: formValue.name,
        mobile: formValue.mobile,
        fix: formValue.fix,
        markup: Date.now()
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting2('hotels', userDB.hotelId, 'contact', "name", "asc").onSnapshot(function(snapshot) {
            const snapInfo = []
                snapshot.forEach(function(doc) {          
                snapInfo.push({
                    id: doc.id,
                    ...doc.data()
                    })        
                });
                setInfo(snapInfo)
            });
        return unsubscribe
     },[])

    return(
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center"
        }}>
            <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                {t("msh_coolbar.tooltip_phone_book")}
              </Tooltip>
            }>
                <StaticImage objectFit='contain' src='../../../svg/contacts.svg' placeholder="blurred" className="icon" alt="contact" onClick={handleShow} style={{width: "25%"}} />
            </OverlayTrigger>


            <Modal show={list}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        {t("msh_phone_book.p_title")}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Ajouter un contact" id="annuaire" onSelect={(eventKey) => {
                        if(eventKey === 'Répertoire'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                            <Tab eventKey="Répertoire" title={t("msh_phone_book.p_first_tab_title")} style={{overflow: "auto"}}>
                            <PerfectScrollbar style={{height: "55vh"}}>
                                {info.map(flow =>(
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row wrap",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                    key={flow.markup}>
                                        <div style={{padding: "2%", width: "50%"}}>
                                            <h5 className="bold">{flow.name}</h5>
                                            <p><i>{t("msh_phone_book.p_mobile")} : {flow.mobile}</i> 
                                            <br /><i>{t("msh_phone_book.p_local")} : {flow.fix}</i></p>
                                        </div>
                                            <Button variant="outline-danger" size="sm" onClick={() => {
                                                return handleDeleteData2('hotels', user, 'contact', flow.id)
                                            }}>{t("msh_general.g_button.b_delete")}</Button>
                                    </div>
                                ))}
                                </PerfectScrollbar>
                            </Tab>
                            <Tab eventKey="Ajouter un contact" title={t("msh_phone_book.p_second_tab_title")}>
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
                                    <Form.Row>
                                        <InputElement
                                            containerStyle={{marginBottom: "0"}} 
                                            label={t("msh_phone_book.p_contact")}
                                            placeholder="ex: Jane Doe"
                                            size="25vw"
                                            value={formValue.name}
                                            name="name"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "50%"
                                    }}>
                                        <InputElement
                                            containerStyle={{marginBottom: "0"}} 
                                            label={t("msh_phone_book.p_mobile")}
                                            placeholder="ex: 0656872674"
                                            size="11vw"
                                            value={formValue.mobile}
                                            name="mobile"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                        <InputElement
                                            containerStyle={{marginBottom: "0"}} 
                                            label={t("msh_phone_book.p_local")}
                                            placeholder="ex: 0130987654"
                                            size="11vw"
                                            value={formValue.fix}
                                            name="fix"
                                            handleChange={handleChange}
                                            setFormValue={setFormValue}
                                        />
                                    </Form.Row>
                                </div>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        {footerState && <Modal.Footer>
                            <Button variant="dark" onClick={(event) => {
                                handleSubmitData2(event, "hotel", userDB.hotelId, 'contact', newData)
                                addNotification(notif, userDB.hotelId)
                                return handleClose()
                            }}>{t("msh_general.g_button.b_send")}</Button>
                        </Modal.Footer>}
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default Annuaire