import React, {useState, useContext } from 'react'
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
import InputElement from '../../../../utils/form/InputElement'
import { handleChange } from '../../../../utils/form/formCommonFunctions'
import { FirebaseContext } from '../../../../config/Firebase'
import { useFirestoreSubscription, useAdd, useUpdate, useDelete } from '../../../../utils/hooks/useFirestore'

const PhoneClock = () =>{
    const { userDB } = useContext(FirebaseContext)

    const [formValue, setFormValue] = useState({
        room: "", 
        client: "", 
        hour: new Date(), 
        date: new Date()
    })
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [step, setStep] = useState(false)
    const { t } = useTranslation()

    const { data: info = [] } = useFirestoreSubscription(
        ['hotels', userDB.hotelId, 'clock'],
        { orderBy: ['markup', 'asc'] }
    )

    const { mutate: addClock } = useAdd([['hotels', userDB.hotelId, 'clock']])
    const { mutate: notify } = useAdd()
    const { mutate: updateClock } = useUpdate([['hotels', userDB.hotelId, 'clock']])
    const { mutate: deleteClock } = useDelete([['hotels', userDB.hotelId, 'clock']])

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
    const breakPoint = window.innerWidth > 510

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
                                            onChange={() => updateClock({ path: ['hotels', userDB.hotelId, 'clock', flow.id], data: dataStatus })}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                    {expand && <td>{moment(flow.date).format('LLL')}</td>}
                                    {expand && <td>{flow.author}</td>}
                                    {expand && <td className="bg-dark">
                                            <Button variant="outline-danger" size="sm" onClick={()=> deleteClock({ path: ['hotels', userDB.hotelId, 'clock', flow.id] })}>
                                                {t("msh_general.g_button.b_delete")}
                                            </Button>
                                        </td>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
            </div>
        <Button  className="btn-msh phone_submitButton" size="md" onClick={handleShow}>{t("msh_alarm.a_first_tab_title")}</Button>
    
        <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div className="phone_container_drawer" style={{justifyContent: breakPoint && "space-around"}}>
                <h4 className='phone_tab'>{t("msh_alarm.a_first_tab_title")}</h4>
                {!step && <div style={{
                    display: "flex",
                    flexFlow: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                }}>
                    <Form.Group className='phone_calendar_container'>
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
                    <Button variant='link' className="btn-msh-outline phone_return" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                    <Button  className="btn-msh phone_submitButton" onClick={() => {
                        addClock({ path: ['hotels', userDB.hotelId, 'clock'], data: newData })
                        notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
                        return handleHide()
                    }}>{t("msh_alarm.a_phone_button.b_validation")}</Button>                
                </>}
                {!step && <Button className="btn-msh phone_submitButton" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </div>
            </Drawer>
    </div>
    )
}

export default PhoneClock