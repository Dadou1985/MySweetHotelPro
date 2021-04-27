import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Taxi from '../../../svg/taxi.svg'
import { db, auth } from '../../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import Switch from '@material-ui/core/Switch';
import Badge from '@material-ui/core/Badge'
import StyleBadge from '../common/badgeMaker'
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import DateFnsAdapter from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker
} from '@material-ui/pickers';

const Cab = ({userDB, user}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({room: "", client: "", date: new Date(), hour: new Date(), passenger:"", model:"", destination: ""})
    const [demandQty, setDemandQty] = useState([])
    const [step, setStep] = useState(false)
    const [footerState, setFooterState] = useState(true)

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

      const handleHourChange = (hour) => {
        setFormValue({hour: hour});
      };

      const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

    const handleSubmit = event => {
        event.preventDefault()
        setFormValue("")
        return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('cab')
            .add({
            author: user.displayName,
            destination: formValue.destination,
            client: formValue.client,
            room: formValue.room,
            pax: formValue.passenger,
            model: formValue.model,
            markup: Date.now(),
            hour: moment(formValue.hour).format('LT'),
            date: moment(formValue.date).format('L'),
            status: false
            })
        .then(handleClose)
    }

    const changeDemandStatus = (document) => {
        return db.collection('mySweetHotel')
          .doc('country')
          .collection('France')
          .doc('collection')
          .collection('hotel')
          .doc('region')
          .collection(userDB.hotelRegion)
          .doc('departement')
          .collection(userDB.hotelDept)
          .doc(`${userDB.hotelId}`)
          .collection('cab')
          .doc(document)
          .update({
            status: false,
        })      
      }


    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
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

     useEffect(() => {
        const toolOnAir = () => {
            return db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('cab')
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
                    console.log(snapInfo)
                    setDemandQty(snapInfo)
                });
                return unsubscribe
     },[])

     const dateFns = new DateFnsAdapter();

     console.log("######", formValue.client)
     console.log("??????", formValue.date)

    return(
        <div>
            <StyledBadge badgeContent={info.length} color="secondary">
                <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    Taxi
                </Tooltip>
                }>
                    <img src={Taxi} className="icon" alt="contact" onClick={handleShow} style={{width: "3vw", marginRight: "1vw"}} />
                </OverlayTrigger>
            </StyledBadge>

            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Réservation de taxi
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Réserver" id="uncontrolled-tab-example" onClick={(eventKey) => {
                        if(eventKey === 'Liste des réservations'){
                            return setFooterState(false)
                        }else{
                            return setFooterState(true)
                        }
                    }}>
                            <Tab eventKey="Réserver" title="Réserver un taxi">
                                <div  style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
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
                                            variant="inline"
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
                                    {step &&
                                        <>
                                        <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        width: "70%"
                                    }}>
                                        <Form.Group controlId="description">
                                        <Form.Label>Nom du client</Form.Label>
                                        <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "10vw"}} value={formValue.client} name="client" onChange={handleChange} />
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description2">
                                        <Form.Label>Numéro de chambre</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 409" style={{width: "10vw"}} value={formValue.room} name="room" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        width: "70%"
                                    }}>
                                        <Form.Group controlId="description5">
                                        <Form.Label>Nbre de passagers</Form.Label>
                                        <Form.Control type="number" style={{width: "10vw"}} value={formValue.passenger} name="passenger" onChange={handleChange} />
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description6">
                                        <Form.Label>Type de véhicule</Form.Label><br/>
                                        <select class="selectpicker" value={formValue.model} name="model" onChange={handleChange} 
                                        style={{width: "10vw", 
                                        height: "4vh", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option></option>
                                            <option>Berline</option>
                                            <option>Van</option>
                                        </select>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="description7">
                                        <Form.Label>Adresse de destination</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 16 avenue Paul Cézanne, 78990 Elancourt" style={{width: "23vw"}} value={formValue.destination} name="destination" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    </>}
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des réservations" title="Liste des réservations">
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>Client</th>
                                    <th>Chambre</th>
                                    <th>Date</th>
                                    <th>Heure</th>
                                    <th>Passagers</th>
                                    <th>Véhicule</th>
                                    <th>Destination</th>
                                    <th>Statut</th>
                                    <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(flow =>(
                                        <tr key={flow.id}>
                                        {console.log("333333333", flow.date)}

                                        <td>{flow.client}</td>
                                        <td>{flow.room}</td>
                                        <td>{flow.date}</td>
                                        <td>{flow.hour}</td>
                                        <td>{flow.pax}</td>
                                        <td>{flow.model}</td>
                                        <td>{flow.destination}</td>
                                        <td>
                                        <Switch
                                            checked={flow.status}
                                            onChange={() => changeDemandStatus(flow.id)}
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                        </td>
                                        <td className="bg-dark"><Button variant="outline-danger" size="sm" onClick={()=> {
                                            return db.collection('mySweetHotel')
                                            .doc('country')
                                            .collection('France')
                                            .doc('collection')
                                            .collection('hotel')
                                            .doc('region')
                                            .collection(userDB.hotelRegion)
                                            .doc('departement')
                                            .collection(userDB.hotelDept)
                                            .doc(`${userDB.hotelId}`)
                                            .collection("cab")
                                            .doc(flow.id)
                                            .delete()
                                            .then(function() {
                                              console.log("Document successfully deleted!");
                                            }).catch(function(error) {
                                                console.log(error);
                                            });
                                        }}>Supprimer</Button></td>
                                    </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </Tab>
                        </Tabs>
                    </Modal.Body>
                    {footerState && <Modal.Footer>
                        {step && <Button variant="outline-success" onClick={handleSubmit}>Enregistrer</Button>}
                        {!step && <Button variant="outline-info" onClick={() => setStep(true)}>Poursuivre</Button>}
                    </Modal.Footer>}
                </Modal>
        </div>
    )
}

export default Cab