import React, { useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { db } from '../../../../Firebase'
import moment from 'moment'
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import { useTranslation } from "react-i18next"

const PhoneCab = ({userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", date: new Date(), hour: new Date(), passenger:"", model:"", destination: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [step, setStep] = useState(false)
    const { t, i18n } = useTranslation()

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
            .then(doc => console.log('nouvelle notitfication'))
    }

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        setStep(false)
        const notif = t("msh_cab.c_notif") 
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('cab')
            .add({
            author: userDB.username,
            destination: formValue.destination,
            client: formValue.client,
            room: formValue.room,
            pax: formValue.passenger,
            model: formValue.model,
            markup: Date.now(),
            hour: moment(formValue.date).format('LT'),
            date: moment(formValue.date).format('L'),            
            status: false
            })
    }

    const changeDemandStatus = (document) => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('cab')
          .doc(document)
          .update({
            status: false,
        })      
      }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection('cab')
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
                    console.log(snapInfo)
                    setInfo(snapInfo)
                });
                return unsubscribe
     },[])

     const handleShow = () => setActivate(true)
     const handleHide = () => setActivate(false)

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
                            onChange={() => changeDemandStatus(flow.id)}
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                        </td>
                        {expand && <td>{flow.model}</td>}
                        {expand && <td>{flow.destination}</td>}
                        {expand && <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                            return db.collection('hotels')
                            .doc(userDB.hotelId)
                            .collection("cab")
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
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} onClick={handleShow}>{t("msh_cab.c_phone_button.b_show_modal")}</Button>

            <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>{t("msh_cab.c_phone_button.b_show_modal")}</h4>
                {!step && <Form.Row style={{
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
                </Form.Row>}
                {step && <>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_cab.c_client")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_cab.c_room")}</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.room} name="room" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_cab.c_pax")}</Form.Label>
                    <Form.Control type="number" value={formValue.passenger} name="passenger" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description">
                    <Form.Label>{t("msh_cab.c_vehicule.v_label")}</Form.Label><br/>
                    <select class="selectpicker" value={formValue.model} name="model" onChange={handleChange} 
                    className="phonePage_select">
                        <option></option>
                        <option>{t("msh_cab.c_vehicule.v_limousin")}</option>
                        <option>{t("msh_cab.c_vehicule.v_van")}</option>
                    </select>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>{t("msh_cab.c_destination.d_label")}</Form.Label>
                    <Form.Control type="text" placeholder={t("msh_cab.c_destination.d_placeholder")} value={formValue.destination} name="destination" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                </>}
                {step && <>
                    <Button variant="outline-info" className="phone_return" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                    <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>{t("msh_cab.c_phone_button.b_validation")}</Button>                
                </>}
                {!step && <Button variant="outline-info" className="phone_submitButton" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                </div>
            </Drawer>
        </div>
                            
    )
}

export default PhoneCab