import React, {useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { db } from '../../../../Firebase'
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

const PhoneClock = ({userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", hour: new Date(), date: new Date()})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [step, setStep] = useState(false)
    const { t } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleDateChange = (date) => {
        setFormValue({date: date});
      };

      const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
    }

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        setStep(false)
        const notif = t("msh_alarm.a_notif")
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('clock')
            .add({
            author: userDB.username,
            client: formValue.client,
            room: formValue.room,
            day: new Date(),
            markup: Date.now(),
            hour: moment(formValue.date).format('LT'),
            date: moment(formValue.date).format('L'),            
            status: false
            })
    }

    const changeDemandStatus = (document) => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('clock')
          .doc(document)
          .update({
            status: false,
        })      
      }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('clock')
            .orderBy("markup", "asc")
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
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

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

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
                                            onChange={() => changeDemandStatus(flow.id)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                    {expand && <td>{moment(flow.date).format('LLL')}</td>}
                                    {expand && <td>{flow.author}</td>}
                                    {expand && <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return db.collection('hotels')
                                            .doc(userDB.hotelId)
                                            .collection("clock")
                                            .doc(flow.id)
                                            .delete()
                                            .then(function() {
                                              console.log("Document successfully deleted!");
                                            }).catch(function(error) {
                                                console.log(error);
                                            });
                                        }}>{t("msh_general.g_button.b_delete")}</Button></td>}
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
                <div>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_alarm.a_client")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_alarm.a_room")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.room} name="room" onChange={handleChange} />
                    </Form.Group>
                </div>
                </>}
                {step && <>
                    <Button variant="outline-info" className="phone_return" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                    <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>{t("msh_alarm.a_phone_button.b_validation")}</Button>                
                </>}
                {!step && <Button variant="outline-info" className="phone_submitButton" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </div>
            </Drawer>
    </div>
    )
}

export default PhoneClock