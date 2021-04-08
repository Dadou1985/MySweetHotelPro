import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Taxi from '../../../svg/taxi.svg'
import DatePicker from "react-datepicker";
import { db, auth } from '../../../Firebase'


const Cab = ({userDB, setUserDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({room: "", client: "", date: "", hour: "", passenger:"", model:"", destination: ""})
    const [user, setUser] = useState(auth.currentUser)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

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
            date: formValue.date,
            destination: formValue.destination,
            client: formValue.client,
            room: formValue.room,
            pax: formValue.pax,
            model: formValue.model,
            markup: Date.now(),
            hour: formValue.hour
            })
        .then(handleClose)
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

    return(
        <div>
            <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Taxi
              </Tooltip>
            }>
                <img src={Taxi} className="icon" alt="contact" onClick={handleShow} style={{width: "40%", marginLeft: "20%"}} />
            </OverlayTrigger>

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
                    
                    <Tabs defaultActiveKey="Réserver" id="uncontrolled-tab-example">
                            <Tab eventKey="Réserver" title="Réserver un taxi">
                                <div  style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
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
                                    
                                        <Form.Group controlId="description">
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
                                        <Form.Group controlId="description">
                                        <Form.Label>Date de réservation</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 16/04/2020" style={{width: "10vw"}} value={formValue.date} name="date" onChange={handleChange} />
                                        </Form.Group>
                                   
                                        <Form.Group controlId="description">
                                        <Form.Label>Heure de réservation</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 08h30" style={{width: "10vw"}} value={formValue.hour} name="hour" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        alignItems: "center",
                                        justifyContent: "space-around",
                                        width: "70%"
                                    }}>
                                        <Form.Group controlId="description">
                                        <Form.Label>Nbre de passagers</Form.Label>
                                        <Form.Control type="number" style={{width: "10vw"}} value={formValue.passenger} name="passenger" onChange={handleChange} />
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description">
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
                                        <Form.Group controlId="description">
                                        <Form.Label>Adresse de destination</Form.Label>
                                        <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "23vw"}} value={formValue.destination} name="destination" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
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
                                        <td>{flow.model}</td>
                                        <td>{flow.destination}</td>
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
                    <Modal.Footer>
                        <Button variant="outline-success" onClick={handleSubmit}>Enregistrer</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default Cab