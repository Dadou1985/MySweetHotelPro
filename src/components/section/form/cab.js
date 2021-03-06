import React, { useState, useEffect } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal, FloatingLabel } from 'react-bootstrap'
import Taxi from '../../../svg/taxi.svg'
import { db } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"

const Cab = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({room: "", client: "", date: new Date(), hour: new Date(), passenger:"", model:"limousin", destination: ""})
    const [modelClone, setModelClone] = useState(null)
    const [demandQty, setDemandQty] = useState([])
    const [step, setStep] = useState(false)
    const [footerState, setFooterState] = useState(true)
    const { t } = useTranslation()

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

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

      const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

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
        const notif = t("msh_cab.c_notif") 
        addNotification(notif)
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("cab")
            .add({
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
            })
        .then(handleClose)
    }

    const changeDemandStatus = (document) => {
        return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("cab")
          .doc(document)
          .update({
            status: false,
        })      
      }


    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("cab")
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

     useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("cab")
            .where("status", "==", true)
        }

        let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
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
                <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    {t("msh_toolbar.tooltip_cab")}
                </Tooltip>
                }>
                    <img src={Taxi} alt="contact" onClick={handleShow} style={{width: "2vw"}} />
                </OverlayTrigger>
            </StyledBadge>

            <Modal show={list}
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        {t("msh_cab.c_title")}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="R??server" id="uncontrolled-tab-example" onSelect={(eventKey) => {
                        if(eventKey === 'Liste des r??servations'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                            <Tab eventKey="R??server" title={t("msh_cab.c_phone_button.b_show_modal")}>
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
                                        <Form.Group controlId="description">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_cab.c_client")}
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "12vw"}} value={formValue.client} name="client" onChange={handleChange} required /> 
                                        </FloatingLabel>
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description2">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_cab.c_room")}
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder="ex: 409" style={{width: "12vw"}} value={formValue.room} name="room" onChange={handleChange} />
                                        </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        width: "50%",
                                        marginBottom: "2vh"
                                    }}>
                                        <Form.Group controlId="description5">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_cab.c_pax")}
                                            className="mb-3"
                                        >
                                            <Form.Control placeholder={t("msh_cab.c_pax")} type="number" style={{width: "12vw"}} value={formValue.passenger} name="passenger" onChange={handleChange} />
                                        </FloatingLabel>
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description6">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_cab.c_vehicule.v_label")}
                                            className="mb-3"
                                        >
                                            <Form.Select class="selectpicker" value={formValue.model} name="model" onChange={handleChange} 
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
                                        <Form.Group controlId="description7">
                                        <FloatingLabel
                                            controlId="floatingInput"
                                            label={t("msh_cab.c_destination.d_label")}
                                            className="mb-3"
                                        >
                                            <Form.Control type="text" placeholder={t("msh_cab.c_destination.d_placeholder")} style={{width: "25vw"}} value={formValue.destination} name="destination" onChange={handleChange} />
                                        </FloatingLabel>
                                        </Form.Group>
                                    </div>
                                    </>}
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des r??servations" title={t("msh_cab.c_table_title")}>
                            <PerfectScrollbar style={{height: "55vh"}}>
                                <Table striped bordered hover size="sm" className="text-center">
                                    <thead className="bg-dark text-center text-light">
                                        <tr>
                                        <th>{t("msh_general.g_table.t_client")}</th>
                                        <th>{t("msh_general.g_table.t_room")}</th>
                                        <th>{t("msh_general.g_table.t_date")}</th>
                                        <th>{t("msh_general.g_table.t_time")}</th>
                                        <th>{t("msh_general.g_table.t_passenger")}</th>
                                        <th>{t("msh_general.g_table.t_type_of_car")}</th>
                                        <th>{t("msh_general.g_table.t_destination")}</th>
                                        <th>{t("msh_general.g_table.t_statut")}</th>
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
                                            <td>{flow.pax}</td>
                                            <td>{flow.modelClone}</td>
                                            <td>{flow.destination}</td>
                                            <td>
                                            <Switch
                                                checked={flow.status}
                                                onChange={() => changeDemandStatus(flow.id)}
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            />
                                            </td>
                                            <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
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
                                            }}>{t("msh_general.g_button.b_delete")}</Button></td>
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
                            <Button variant="outline-dark" onClick={() => setStep(false)}>{t("msh_general.g_button.b_back")}</Button>
                            <Button variant="dark" onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
                        </>}
                        {!step && <Button variant="outline-dark" onClick={() => setStep(true)}>{t("msh_general.g_button.b_next_step")}</Button>}
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Cab