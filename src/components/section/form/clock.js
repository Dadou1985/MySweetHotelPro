import React, {useState, useEffect } from 'react'
import { 
    Form, 
    Button, 
    Table, 
    Tabs, 
    Tab, 
    Modal, 
} from 'react-bootstrap'
import Timer from '../../../svg/timer.svg'
import moment from 'moment'
import 'moment/locale/fr'
import Switch from '@material-ui/core/Switch'
import DateFnsUtils from '@date-io/date-fns'
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
import { 
    fetchCollectionBySorting2, 
    fetchCollectionByMapping2, 
    handleSubmitData2, 
    addNotification,
    handleUpdateData2,
    handleDeleteData2
} from '../../../helper/globalCommonFunctions'
import { handleChange } from '../../../helper/formCommonFunctions'

const Clock = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({
        room: "", 
        client: "", 
        hour: new Date(), 
        date: new Date()
    })
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
    }

    const notif = t("msh_alarm.a_notif")
    const dataStatus = {status: false} 
    const tooltipTitle = t("msh_toolbar.tooltip_alarm")
    const modalTitle = t("msh_alarm.a_title")

    const newData = {
            author: userDB.username,
            client: formValue.client,
            room: formValue.room,
            day: Date.now(),
            markup: Date.now(),
            hour: moment(formValue.date).format('LT'),
            date: moment(formValue.date).format('L'),            
            status: false
    }

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting2("hotels", userDB.hotelId, "clock", "markup", "asc").onSnapshot(function(snapshot) {
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
        let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "clock", "status", "==", true).onSnapshot(function(snapshot) {
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
                <BadgeContent tooltipTitle={tooltipTitle} icon={Timer} handleShow={handleShow} />
            </StyledBadge>
            <Modal show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}
                >
                <ModalHeaderFormTemplate title={modalTitle} />
                <Modal.Body>
                    <Tabs defaultActiveKey="Programmer un réveil" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des réveils'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                        <Tab eventKey="Programmer un réveil" title={t("msh_alarm.a_first_tab_title")}>
                        <div style={{
                                    display: "flex",
                                    flexFlow: "row wrap",
                                    justifyContent: "space-around",
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
                                            label={t("msh_alarm.a_calendar_title")}
                                            value={formValue.date}
                                            onChange={handleDateChange}
                                            onError={console.log}
                                            disablePast
                                            format={userDB.language === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                                        />                                        
                                        </MuiPickersUtilsProvider>
                                        </Form.Group>
                                    </div>}
                                {step && <div style={{display: "flex", width: "100%", justifyContent: "space-between"}}>
                                    <InputElement
                                        containerStyle={{marginBottom: "0", width: "45%"}} 
                                        label={t("msh_alarm.a_client")}
                                        placeholder="ex: Jane Doe"
                                        size="100%"
                                        value={formValue.client}
                                        name="client"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />  
                                    <InputElement
                                        containerStyle={{marginBottom: "0", width: "45%"}} 
                                        label={t("msh_alarm.a_room")}
                                        placeholder="ex: 409"
                                        size="100%"
                                        value={formValue.room}
                                        name="room"
                                        handleChange={handleChange}
                                        setFormValue={setFormValue}
                                    />  
                                </div>}
                            </div>
                        </Tab>
                        <Tab eventKey="Liste des réveils" title={t("msh_alarm.a_second_tab_title")}>
                        <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                        <th>{t("msh_general.g_table.t_client")}</th>
                                        <th>{t("msh_general.g_table.t_room")}</th>
                                        <th>{t("msh_general.g_table.t_date")}</th>
                                        <th>{t("msh_general.g_table.t_time")}</th>
                                        <th>{t("msh_general.g_table.t_phone")}</th>
                                        <th>{t("msh_general.g_table.t_statut")}</th>
                                        <th>{t("msh_general.g_table.t_coworker")}</th>
                                        <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(flow =>(
                                        <tr key={flow.id}>
                                            <td>{flow.client}</td>
                                            <td>{flow.room}</td>
                                            <td>{flow.date}</td>
                                            <td>{flow.hour}</td>
                                            <td>{flow.phoneNumber}</td>
                                            <td>
                                                <Switch
                                                    checked={flow.status}
                                                    onChange={() => handleUpdateData2("hotels", userDB.hotelId, "clock", flow.id, dataStatus)}
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                                </td>
                                            <td>{flow.author}</td>
                                            <td className="bg-dark">
                                                <Button variant="outline-danger" size="sm" onClick={()=> handleDeleteData2("hotels", userDB.hotelId, "clock", flow.id)}>
                                                    {t("msh_general.g_button.b_delete")}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </PerfectScrollbar>
                        </Tab>
                    </Tabs>
                    </Modal.Body>
                    {footerState && <Modal.Footer>
                        {step && <>
                            <Button className='btn-msh-dark-outline' onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                            <Button className='btn-msh-dark' onClick={(event) => {
                                handleSubmitData2(event, "hotels", userDB.hotelId, "clock", newData)
                                addNotification(notif, userDB.hotelId)
                                return handleClose()
                        }}>{t("msh_general.g_button.b_send")}</Button>
                        </>}
                        {!step && <Button className='btn-msh-dark-outline' onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Clock