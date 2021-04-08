import React, {useState, useEffect, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import ChangeRoom from '../../../svg/logout.png'
import {  db, auth } from '../../../Firebase'


const Maid = ({userDB, setUserDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({client: "", details: "", fromRoom: "", toRoom: "", reason: "", state: ""})
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
        return this.db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('hotel')
            .doc('region')
            .collection(userDB.hotelRegion)
            .doc('departement')
            .collection(userDB.hotelDept)
            .doc(`${userDB.hotelId}`)
            .collection('maid')
            .add({
            author: user.displayName,
            date: new Date(),
            details: formValue.details,
            client: formValue.client,
            fromRoom: formValue.fromRoom,
            markup: Date.now(),
            toRoom: formValue.toRoom,
            reason: formValue.reason,
            state: formValue.state
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
            .collection('roomChange')
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
                Délogement
              </Tooltip>
            }>
                <img src={ChangeRoom} className="icon" alt="contact" onClick={handleShow} style={{width: "50%", marginLeft: "20%"}} />
            </OverlayTrigger>


            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Délogement client
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Déloger un client" id="uncontrolled-tab-example">
                            <Tab eventKey="Déloger un client" title="Déloger un client">
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center",
                                }}>
                                    <Form.Row>
                                        <Form.Group controlId="description">
                                        <Form.Label>Nom du client</Form.Label>
                                        <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "20vw"}} value={formValue.client} name="client" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "60%"
                                    }}>
                                        <Form.Group controlId="description">
                                        <Form.Label>Depuis la chambre...</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 310" style={{width: "10vw"}} value={formValue.fromRoom} name="fromRoom" onChange={handleChange} />
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description">
                                        <Form.Label>...vers la chambre</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 409" style={{width: "10vw"}} value={formValue.toRoom} name="toRoom" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "60%"
                                    }}>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Pour quel motif ?</Form.Label><br/>
                                        <select class="selectpicker" value={formValue.reason} name="reason" onChange={handleChange} 
                                        style={{width: "10vw", 
                                        height: "60%", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option></option>
                                            <option>Peinture</option>
                                            <option>Plomberie</option>
                                            <option>Electricité</option>
                                            <option>Ménage</option>
                                            <option>Autres</option>
                                        </select>
                                    </Form.Group>
                                    
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Etat de la chambre</Form.Label><br/>
                                        <select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                                        style={{width: "10vw", 
                                        height: "60%", 
                                        border: "1px solid lightgrey", 
                                        borderRadius: "3px",
                                        backgroundColor: "white", 
                                        paddingLeft: "1vw"}}>
                                            <option></option>
                                            <option>Sale</option>
                                            <option>Propre</option>
                                        </select>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="details">
                                            <Form.Label>Plus de détails</Form.Label>
                                            <Form.Control as="textarea" rows="3" style={{width: "20vw", maxHeight: "15vh"}} value={formValue.details} name="details" onChange={handleChange}  />
                                        </Form.Group>
                                    </Form.Row>
                                </div>
                            </Tab>
                            <Tab eventKey="Liste des délogements" title="Liste des délogements">
                            <Table striped bordered hover size="sm" className="text-center"  style={{overflowX: "auto",
                                    maxWidth: "90vw"}}>
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>Client</th>
                                    <th>Ch. initiale</th>
                                    <th>Ch. finale</th>
                                    <th>Motif</th>
                                    <th>Etat</th>
                                    <th>Details</th>
                                    <td>Date</td>
                                    <th>Collaborateur</th>
                                    <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(flow =>(
                                        <tr key={flow.id}>
                                        <td>{flow.client}</td>
                                        <td>{flow.fromRoom}</td>
                                        <td>{flow.toRoom}</td>
                                        <td>{flow.reason}</td>
                                        <td>{flow.state}</td>
                                        <td>{flow.details}</td>
                                        <td>{flow.date}</td>
                                        <td>{flow.author}</td>
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
                                            .collection("roomChange")
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

export default Maid