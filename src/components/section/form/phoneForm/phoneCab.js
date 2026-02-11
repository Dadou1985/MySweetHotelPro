import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Table, FloatingLabel } from 'react-bootstrap'
import moment from 'moment'
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import InputElement from '../../../../helper/common/InputElement'
import { 
    fetchCollectionBySorting2, 
    handleSubmitData2, 
    addNotification,
    handleUpdateData2,
    handleDeleteData2
} from '../../../../helper/globalCommonFunctions'
import { handleChange } from '../../../../helper/formCommonFunctions'
import { FirebaseContext } from '../../../../Firebase'

const PhoneCab = () =>{
    const { userDB } = useContext(FirebaseContext)

    const [formValue, setFormValue] = useState({
        room: "", 
        client: "", 
        date: new Date(), 
        hour: new Date(), 
        passenger:"", 
        model:"", 
        destination: ""
    })
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [step, setStep] = useState(false)
    const [modelClone, setModelClone] = useState("")
    const { t } = useTranslation()

    const handleShow = () => setActivate(true)
    const handleHide = () => {
        setActivate(false)
        setFormValue("")
        setStep(false)
    }

    const handleDateChange = (date) => {
    setFormValue({date: date});
    };

    const notif = t("msh_cab.c_notif")
    const dataStatus = {status: false} 
    const breakPoint = window.innerWidth > 510

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

    useEffect(() => {
        let unsubscribe = fetchCollectionBySorting2("hotels", userDB.hotelId, "cab", "markup", "asc").onSnapshot(function(snapshot) {
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
        <div className="phone_container">
            <h3 className="phone_title">{t("msh_cab.c_title")}</h3>
            <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>*/}
            <Table striped bordered hover size="sm" responsive="sm" className="text-center">
                <thead className="bg-dark text-center text-light">
                    <tr>
                    {expand && <th>Client</th>}
                    <th>{t("msh_general.g_table.t_room")}</th>
                    {expand && <th>Date</th>}
                    <th>{t("msh_general.g_table.t_time")}</th>
                    <th>{t("msh_general.g_table.t_passenger")}</th>
                    <th>{t("msh_general.g_table.t_statut")}</th>
                    {expand && <th>Véhicule</th>}
                    {expand &&<th>Destination</th>}
                    {expand && <th className="bg-dark"></th>}
                    </tr>
                </thead>
                <tbody>
                    {info.map(flow =>(
                        <tr key={flow.id}>
                        {expand && <td>{flow.client}</td>}
                        <td>{flow.room}</td>
                        {expand && <td>{flow.date}</td>}
                        <td>{flow.hour}</td>
                        <td>{flow.pax}</td>
                        <td>
                        <Switch
                            checked={flow.status}
                            onChange={() => handleUpdateData2("hotels", userDB.hotelId, "cab", flow.id, dataStatus)}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        </td>
                        {expand && <td>{flow.model}</td>}
                        {expand && <td>{flow.destination}</td>}
                        {expand && <td className="bg-dark">
                            <Button variant="outline-danger" size="sm" onClick={()=> handleDeleteData2("hotels", userDB.hotelId, "cab", flow.id)}>
                                {t("msh_general.g_button.b_delete")}
                            </Button>
                        </td>}
                    </tr>
                    ))}
                </tbody>
            </Table>
            </div>
            <Button className='btn-msh phone_submitButton' size="md" onClick={handleShow}>{t("msh_cab.c_phone_button.b_show_modal")}</Button>

            <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div className="phone_container_drawer" style={{justifyContent: breakPoint && "space-around"}}>
                <h4 className='phone_tab'>{t("msh_cab.c_phone_button.b_show_modal")}</h4>
                {!step && <div style={{
                    display: "flex",
                    flexFlow: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    width: "70%"
                }}>
                    <Form.Group className='phone_calendar_container'>
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
                {step && <>
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_cab.c_client")}
                        placeholder="ex: Jane Doe"
                        size="90vw"
                        value={formValue.client}
                        name="client"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    />  
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_cab.c_room")}
                        placeholder="ex: 409"
                        size="90vw"
                        value={formValue.room}
                        name="room"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    /> 
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_cab.c_pax")}
                        placeholder={t("msh_cab.c_pax")}
                        size="90vw"
                        value={formValue.passenger}
                        name="passenger"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    /> 
                    <div>
                        <Form.Group controlId="description">
                        <FloatingLabel
                            controlId="floatingInput"
                            label={t("msh_cab.c_vehicule.v_label")}
                            className="mb-3"
                        >
                        <Form.Select class="Form.Selectpicker" value={formValue.model} name="model" onChange={(event) => handleChange(event, setFormValue)} 
                        className="phonePage_select">
                            <option></option>
                            <option>{t("msh_cab.c_vehicule.v_limousin")}</option>
                            <option>{t("msh_cab.c_vehicule.v_van")}</option>
                        </Form.Select>
                        </FloatingLabel>
                        </Form.Group>
                    </div>
                    <div>
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_cab.c_destination.d_label")}
                        placeholder={t("msh_cab.c_destination.d_placeholder")}
                        size="90vw"
                        value={formValue.destination}
                        name="destination"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    /> 
                    </div>
                </>}
                {step && <>
                    <Button variant='link' className="btn-msh-outline phone_return" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                    <Button className="btn-msh phone_submitButton" onClick={(event) => {
                         handleSubmitData2(event, "hotels", userDB.hotelId, "maintenance", newData)
                         addNotification(notif, userDB.hotelId)
                         return handleHide()
                    }}>{t("msh_cab.c_phone_button.b_validation")}</Button>                
                </>}
                {!step && <Button className="btn-msh phone_submitButton" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </div>
            </Drawer>
        </div>
                            
    )
}

export default PhoneCab