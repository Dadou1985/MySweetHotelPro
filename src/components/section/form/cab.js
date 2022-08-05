import React, { useState, useEffect } from 'react'
import { 
    Form, 
    Button, 
    Tabs, 
    Tab, 
    Modal, 
    FloatingLabel 
} from 'react-bootstrap'
import Taxi from '../../../svg/taxi.svg'
import moment from 'moment'
import 'moment/locale/fr';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { StyledBadge } from '../../../helper/formCommonUI'
import InputElement from "../../../helper/common/InputElement"
import BadgeContent from '../../../helper/common/badgeContent'
import ModalHeaderFormTemplate from '../../../helper/common/modalHeaderFormTemplate'
import TableTemplate from '../../../helper/common/tableTemplate';
import { fetchCollectionBySorting, fetchCollectionByMapping } from '../../../helper/globalCommonFunctions'
import {
    handleChange,
    handleSubmit,
} from '../../../helper/formCommonFunctions'

const Cab = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({
        room: "",
        client: "", 
        date: new Date(),
        hour: new Date(), 
        passenger:"", 
        model:"limousin", 
        destination: ""
    })
    const [modelClone, setModelClone] = useState("")
    const [demandQty, setDemandQty] = useState([])
    const [step, setStep] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const { t } = useTranslation()

    const handleShow = () => setList(true)
    const handleClose = () => {
        setList(false)
        setFormValue("")
        setStep(false)
    }

    const handleDateChange = (date) => {
    setFormValue({date: date});
    };

    const notif = t("msh_cab.c_notif")
    const dataStatus = {status: false} 
    const tooltipTitle = t("msh_toolbar.tooltip_cab")
    const modalTitle = t("msh_cab.c_title")

    const newData = {
        author: userDB.username,
        destination: formValue.destination,
        client: formValue.client,
        room: formValue.room,
        pax: formValue.passenger,
        model: formValue.model,
        modelClone: modelClone !== null ? modelClone : t("msh_cab.c_vehicule.v_limousin"),
        markup: Date.now(),
        hour: moment(formValue.date).format('LT'),
        date: moment(formValue.date).format('L'),
        status: false,
        hotelId: userDB.hotelId
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting(userDB.hotelId, "cab", "markup", "asc").onSnapshot(function(snapshot) {
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

     useEffect(() => {
        let unsubscribe = fetchCollectionByMapping(userDB.hotelId, "cab", "status", "==", true).onSnapshot(function(snapshot) {
            const snapInfo = []
            snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
                })        
            });
            setDemandQty(snapInfo)
        });
        return unsubscribe
     },[])

    return(
        <div>
            <StyledBadge badgeContent={demandQty.length} color="secondary">
                <BadgeContent tooltipTitle={tooltipTitle} icon={Taxi} handleShow={handleShow} />
            </StyledBadge>
            <Modal show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                >      
                <ModalHeaderFormTemplate title={modalTitle} />
                <Modal.Body>
                    <Tabs defaultActiveKey="Réserver" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des réservations'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                        <Tab eventKey="Réserver" title={t("msh_cab.c_phone_button.b_show_modal")}>
                            <div  style={{
                                display: "flex",
                                flexFlow: "column",
                                justifyContent: "space-around",
                                alignItems: "center",
                                padding: "5%",
                                textAlign: "center"
                            }}>
                                {!step && <div style={{
                                    display: "flex",
                                    flexFlow: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    width: "70%"
                                }}>
                                    <Form.Group>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDateTimePicker
                                        variant="dialog"
                                        ampm={false}
                                        label={t("msh_cab.c_calendar_title")}
                                        value={formValue.date}
                                        onChange={handleDateChange}
                                        onError={console.log}
                                        disablePast
                                        format={userDB.language === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                                    />                                        
                                    </MuiPickersUtilsProvider>
                                    </Form.Group>
                                </div>}
                                {step &&
                                    <>
                                    <div style={{
                                    display: "flex",
                                    flexFlow: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    width: "50%",
                                    marginBottom: "2vh"
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "0"}} 
                                        label={t("msh_cab.c_client")}
                                        placeholder="ex: Jane Doe"
                                        size="12vw"
                                        value={formValue.client}
                                        name="client"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />  
                                    <InputElement
                                        containerStyle={{marginBottom: "0"}} 
                                        label={t("msh_cab.c_room")}
                                        placeholder="ex: 409"
                                        size="12vw"
                                        value={formValue.room}
                                        name="room"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    /> 
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexFlow: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    width: "50%",
                                    marginBottom: "2vh"
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "0"}} 
                                        label={t("msh_cab.c_pax")}
                                        placeholder={t("msh_cab.c_pax")}
                                        size="12vw"
                                        value={formValue.passenger}
                                        name="passenger"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    /> 
                                    <Form.Group controlId="description6">
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label={t("msh_cab.c_vehicule.v_label")}
                                        className="mb-3"
                                    >
                                        <Form.Select className="selectpicker" value={formValue.model} name="model" onChange={(event) => handleChange(event, setFormValue)} 
                                        style={{
                                        width: "12vw", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option value="limousin" onClick={() => setModelClone(t("msh_cab.c_vehicule.v_limousin"))}>{t("msh_cab.c_vehicule.v_limousin")}</option>
                                            <option value="Van" onClick={() => setModelClone(t("msh_cab.c_vehicule.v_van"))}>{t("msh_cab.c_vehicule.v_van")}</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                    </Form.Group>
                                </div>
                                <div>
                                    <InputElement
                                        containerStyle={{marginBottom: "0"}} 
                                        label={t("msh_cab.c_destination.d_label")}
                                        placeholder={t("msh_cab.c_destination.d_placeholder")}
                                        size="25vw"
                                        value={formValue.destination}
                                        name="destination"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    /> 
                                </div>
                                </>}
                            </div>
                        </Tab>
                        <Tab eventKey="Liste des réservations" title={t("msh_cab.c_table_title")}>
                        <PerfectScrollbar style={{height: "55vh"}}>
                            <TableTemplate data={info} scale={true} userDB={userDB} dataStatus={dataStatus} />
                        </PerfectScrollbar>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                {footerState && <Modal.Footer>
                    {step && <>
                        <Button variant="outline-dark" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                        <Button variant="dark" onClick={(event) => {
                            return handleSubmit(
                                event, 
                                notif, 
                                userDB.hotelId,
                                "hotels",
                                userDB.hotelId, 
                                "cab", 
                                newData, 
                                handleClose)
                        }}>{t("msh_general.g_button.b_send")}</Button>
                    </>}
                    {!step && <Button variant="outline-dark" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </Modal.Footer>}
            </Modal>
        </div>
    )
}

export default Cab