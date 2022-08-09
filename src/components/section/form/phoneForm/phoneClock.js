import React, {useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import moment from 'moment'
import 'moment/locale/fr';
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
import { fetchCollectionBySorting2 } from '../../../../helper/globalCommonFunctions'
import {
    handleChange,
    handleSubmit,
    handleUpdateHotelData,
    deleteData
} from '../../../../helper/formCommonFunctions'

const PhoneClock = ({userDB}) =>{

    const [formValue, setFormValue] = useState({
        room: "", 
        client: "", 
        hour: new Date(), 
        date: new Date()
    })
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [step, setStep] = useState(false)
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

    const notif = t("msh_alarm.a_notif")
    const dataStatus = {status: false} 

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

    return(

    <div className="phone_container">
        <h3 className="phone_title">{t("msh_alarm.a_title")}</h3>
        <div style={{width: "90vw", overflow: "scroll", height: '100%'}}>
            {/*<div style={{display: "flex", flexFlow: "row", justifyContent: expand ? "flex-start" : "flex-end", width: "100%"}}>
                <span style={{display: "flex", flexFlow: expand ? "row-reverse" : "row"}}  onClick={handleChangeExpand}>
                {expand ? "Rétrécir" : "Agrandir"}
                {expand ? <img src={Left} style={{width: "3vw", marginRight: "1vw"}} /> : <img src={Right} style={{width: "3vw", marginLeft: "1vw"}} />}
                </span>
            </div>*/}
            <Table striped bordered hover size="sm" className="text-center">
                            <thead className="bg-dark text-center text-light">
                                <tr>
                                {expand && <th>Client</th>}
                                <th>{t("msh_general.g_table.t_room")}</th>
                                <th>{t("msh_general.g_table.t_date")}</th>
                                <th>{t("msh_general.g_table.t_time")}</th>
                                <th>{t("msh_general.g_table.t_phone")}</th>
                                <th>{t("msh_general.g_table.t_statut")}</th>
                                {expand && <th>Date</th>}
                                {expand && <th>Collaborateur</th>}
                                {expand && <th className="bg-dark"></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {info.map(flow =>(
                                    <tr key={flow.id}>
                                    {expand && <td>{flow.client}</td>}
                                    <td>{flow.room}</td>
                                    <td>{flow.date}</td>
                                    <td>{flow.hour}</td>
                                    <td>{flow.phoneNumber}</td>
                                    <td>
                                        <Switch
                                            checked={flow.status}
                                            onChange={() => handleUpdateHotelData(userDB.hotelId, "clock", flow.id, dataStatus)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                    {expand && <td>{moment(flow.date).format('LLL')}</td>}
                                    {expand && <td>{flow.author}</td>}
                                    {expand && <td className="bg-dark">
                                            <Button variant="outline-danger" size="sm" onClick={()=> deleteData(userDB.hotelId, "clock", flow.id)}>
                                                {t("msh_general.g_button.b_delete")}
                                            </Button>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
            </div>
        <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={handleShow}>{t("msh_alarm.a_first_tab_title")}</Button>
    
        <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>{t("msh_alarm.a_first_tab_title")}</h4>
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
                {step && <>
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_alarm.a_client")}
                        placeholder="ex: Jane Doe"
                        size="90vw"
                        value={formValue.client}
                        name="client"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    />  
                    <InputElement
                        containerStyle={{marginBottom: "0"}} 
                        label={t("msh_alarm.a_room")}
                        placeholder="ex: 409"
                        size="90vw"
                        value={formValue.room}
                        name="room"
                        handleChange={handleChange}
                        setFormValue={setFormValue}
                    />  
                </>}
                {step && <>
                    <Button variant="outline-info" className="phone_return" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                    <Button variant="success" className="phone_submitButton" onClick={(event) => {
                        return handleSubmit(
                            event, 
                            notif, 
                            userDB.hotelId,
                            "hotels",
                            userDB.hotelId, 
                            "clock", 
                            newData, 
                            handleHide)
                    }}>{t("msh_alarm.a_phone_button.b_validation")}</Button>                
                </>}
                {!step && <Button variant="outline-info" className="phone_submitButton" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </div>
            </Drawer>
    </div>
    )
}

export default PhoneClock