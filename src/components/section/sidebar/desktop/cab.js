import React, { useState, useContext } from 'react'
import {
    Form,
    Button,
    Tabs,
    Tab,
    Modal,
    FloatingLabel
} from 'react-bootstrap'
import Taxi from '../../../../assets/svg/taxi.svg'
import moment from 'moment'
import 'moment/locale/fr';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { StyledBadge } from '../../../../utils/form/formCommonUI'
import InputElement from "../../../../utils/form/InputElement"
import BadgeContent from '../../../../utils/badge/badgeContent'
import ModalHeaderFormTemplate from '../../../../utils/modal/modalHeaderFormTemplate'
import TableTemplate from '../../../../utils/table/tableTemplate';
import { handleChange } from '../../../../utils/form/formCommonFunctions'
import { FirebaseContext } from '../../../../config/Firebase'
import { useFirestoreSubscription, useAdd } from '../../../../utils/hooks/useFirestore'

/*
 ! FIX => SELECT DEFAULT OPTION
*/

const Cab = () =>{
    const { userDB } = useContext(FirebaseContext)

    const [list, setList] = useState(false)
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
    const [step, setStep] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const { t } = useTranslation()

    const { mutate: addCab } = useAdd(['hotels', userDB.hotelId, 'cab'])
    const { mutate: notify } = useAdd()

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
        modelClone: modelClone !== "" ? modelClone : t("msh_cab.c_vehicule.v_limousin"),
        markup: Date.now(),
        hour: moment(formValue.date).format('LT'),
        date: moment(formValue.date).format('L'),
        status: false,
        hotelId: userDB.hotelId
    }

    const { data: info = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, 'cab'],
        { orderBy: ['markup', 'asc'] }
    )

    const { data: demandQtyData = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, 'cab'],
        { where: ['status', '==', true] }
    )

    return(
        <div>
            <StyledBadge badgeContent={demandQtyData.length} color="secondary">
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
                            <form  style={{
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
                                    width: "100%",
                                    marginBottom: "2vh"
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "0", width: "45%"}} 
                                        label={t("msh_cab.c_client")}
                                        placeholder="ex: Jane Doe"
                                        size="100%"
                                        value={formValue.client}
                                        name="client"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />  
                                    <InputElement
                                        containerStyle={{marginBottom: "0", width: "45%"}} 
                                        label={t("msh_cab.c_room")}
                                        placeholder="ex: 409"
                                        size="100%"
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
                                    width: "100%",
                                    marginBottom: "2vh"
                                }}>
                                    <InputElement
                                        containerStyle={{marginBottom: "0", width: "45%"}} 
                                        label={t("msh_cab.c_pax")}
                                        placeholder={t("msh_cab.c_pax")}
                                        size="100%"
                                        value={formValue.passenger}
                                        name="passenger"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    /> 
                                    <div style={{width: "45%"}}>
                                        <Form.Group controlId="description6">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_cab.c_vehicule.v_label")}
                                            className="mb-3"
                                        >
                                            <Form.Select className="selectpicker" defaultValue={formValue.model} name="model" onChange={(event) => handleChange(event, setFormValue)} 
                                                style={{
                                                width: "100%", 
                                                border: "1px solid lightgrey", 
                                                borderRadius: "3px",
                                                backgroundColor: "white", 
                                                paddingLeft: "1vw"}}
                                                required>
                                                <option></option>
                                                <option value="limousin" onClick={() => setModelClone(t("msh_cab.c_vehicule.v_limousin"))}>{t("msh_cab.c_vehicule.v_limousin")}</option>
                                                <option value="Van" onClick={() => setModelClone(t("msh_cab.c_vehicule.v_van"))}>{t("msh_cab.c_vehicule.v_van")}</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div style={{width: "95%"}}>
                                    <InputElement
                                        containerStyle={{marginBottom: "0", width: "100%"}} 
                                        label={t("msh_cab.c_destination.d_label")}
                                        placeholder={t("msh_cab.c_destination.d_placeholder")}
                                        size="100%"
                                        value={formValue.destination}
                                        name="destination"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    /> 
                                </div>
                                </>}
                            </form>
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
                        <Button className='btn-msh-dark-outline' onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                        <Button className='btn-msh-dark' onClick={(event) => {
                            event.preventDefault()
                            addCab({ path: ['hotels', userDB.hotelId, 'cab'], data: newData })
                            notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
                            return handleClose()
                        }}>{t("msh_general.g_button.b_send")}</Button>
                    </>}
                    {!step && <Button className='btn-msh-dark-outline' onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </Modal.Footer>}
            </Modal>
        </div>
    )
}

export default Cab