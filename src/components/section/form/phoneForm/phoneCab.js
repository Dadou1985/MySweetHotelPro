import React, { useState, useEffect } from 'react'
import { Form, Button, Table } from 'react-bootstrap'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Left from '../../../../svg/arrow-left.svg'
import Right from '../../../../svg/arrow-right.svg'
import Switch from '@material-ui/core/Switch';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';

const PhoneCab = ({user, userDB}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", date: new Date(), hour: new Date(), passenger:"", model:"", destination: ""})
    const [info, setInfo] = useState([])
    const [activate, setActivate] = useState(false)
    const [expand, setExpand] = useState(false)
    const [step, setStep] = useState(false)

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

      const handleChangeExpand = () => setExpand(!expand)

      const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        setStep(false)
        const notif = "Vous venez d'ajouter une demande de réservation de taxi à la liste !" 
        addNotification(notif)
        return db.collection('hotel')
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
        return db.collection('hotel')
          .doc(userDB.hotelId)
          .collection('cab')
          .doc(document)
          .update({
            status: false,
        })      
      }

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotel')
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
            <h3 className="phone_title">Réservation de taxi</h3>
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
                    <th>Chambre</th>
                    {expand && <th>Date</th>}
                    <th>Heure</th>
                    <th>Pax</th>
                    <th>Statut</th>
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
                            return db.collection('hotel')
                            .doc(userDB.hotelId)
                            .collection("cab")
                            .doc(flow.id)
                            .delete()
                            .then(function() {
                                console.log("Document successfully deleted!");
                            }).catch(function(error) {
                                console.log(error);
                            });
                        }}>Supprimer</Button></td>}
                    </tr>
                    ))}
                </tbody>
            </Table>
            </div>
            <Button variant="success" size="md" style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%"}} onClick={handleShow}>Réserver un taxi</Button>

            <Drawer anchor="bottom" open={activate} onClose={handleHide}  className="phone_container_drawer">
                <div  className="phone_container_drawer">
                <h4 style={{marginBottom: "5vh", borderBottom: "1px solid lightgrey"}}>Réserver un taxi</h4>
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
                        label="Date et Heure de réservation"
                        value={formValue.date}
                        onChange={handleDateChange}
                        onError={console.log}
                        disablePast
                        format="dd/MM/yyyy HH:mm"
                    />                                        
                    </MuiPickersUtilsProvider>
                    </Form.Group>
                </Form.Row>}
                {step && <>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Nom du client</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Numéro de chambre</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.room} name="room" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Nbre de passagers</Form.Label>
                    <Form.Control type="number" value={formValue.passenger} name="passenger" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description">
                    <Form.Label>Type de véhicule</Form.Label><br/>
                    <select class="selectpicker" value={formValue.model} name="model" onChange={handleChange} 
                    className="phonePage_select">
                        <option></option>
                        <option>Berline</option>
                        <option>Van</option>
                    </select>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Adresse de destination</Form.Label>
                    <Form.Control type="text" placeholder="ex: 16 avenue Paul Cézanne, 78990 Elancourt" value={formValue.destination} name="destination" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                </>}
                {step && <>
                    <Button variant="outline-info" className="phone_return" onClick={() => setStep(false)}>Retour</Button>
                    <Button variant="success" className="phone_submitButton" onClick={(event) => {
                    handleSubmit(event)
                    setActivate(false)
                    }}>Réserver maintenant</Button>                
                </>}
                {!step && <Button variant="outline-info" className="phone_submitButton" onClick={() => setStep(true)}>Poursuivre</Button>}
                </div>
            </Drawer>
        </div>
                            
    )
}

export default PhoneCab