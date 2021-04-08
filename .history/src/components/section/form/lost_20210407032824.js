import React, {useState, useEffect, useContext } from 'react'
import LostOnes from '../../../svg/lost-items.svg'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import BootstrapInput from '../common/button/selectButton'
import { db, auth } from '../../../Firebase'


const Lost = ({userDB, setUserDB}) =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: ""})
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
            .collection('lostNfound')
            .add({
            author: user.displayName,
            date: new Date(),
            description: formValue.description,
            details: formValue.details,
            place: formValue.place,
            markup: Date.now(),
            type: formValue.type
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
            .collection('lostNfound')
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

     console.log("///////", userDB)


    return(
        <div>
            <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Objets trouvés
              </Tooltip>
            }>
                <img src={LostOnes} className="icon" alt="contact" onClick={handleShow} style={{width: "40%", marginLeft: "20%"}} />
            </OverlayTrigger>


            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Objets trouvés
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Enregistrer un objet" id="uncontrolled-tab-example">
                            <Tab eventKey="Enregistrer un objet" title="Enregistrer un objet">
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
                                    <Form.Row>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Quel type d'objet ?</Form.Label><br/>
                                            <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                                            style={{width: "20vw", 
                                            height: "4vh", 
                                            border: "1px solid lightgrey", 
                                            borderRadius: "3px",
                                            backgroundColor: "white"}}>
                                                <option></option>
                                                <option>High Tech</option>
                                                <option>Documents Officiels</option>
                                                <option>Vêtements</option>
                                                <option>Autres</option>
                                            </select>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="exampleForm.SelectCustom">
                                        <Form.Label>Lieu ?</Form.Label><br/>
                                            <select class="selectpicker" value={formValue.place} name="place" onChange={handleChange} 
                                            style={{width: "20vw", 
                                            height: "4vh", 
                                            border: "1px solid lightgrey", 
                                            borderRadius: "3px",
                                            backgroundColor: "white"}}>
                                                <option></option>
                                                <option>Hall</option>
                                                <option>Restaurant</option>
                                                <option>Parking</option>
                                                <option>Toilettes</option>
                                                <option>Etages</option>
                                                <option>Autres</option>
                                            </select>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="description">
                                        <Form.Label>Description de l'objet</Form.Label>
                                        <Form.Control type="text" placeholder="ex: un i-phone noir" style={{width: "20vw"}} value={formValue.description} name="description" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group controlId="details">
                                            <Form.Label>Plus de détails</Form.Label>
                                            <Form.Control as="textarea" rows="3" style={{width: "20vw", maxHeight: "30vh"}} value={formValue.details} name="details" onChange={handleChange}  />
                                        </Form.Group>
                                    </Form.Row>
                                </div>
                            </Tab>
                            <Tab eventKey="Panier d'objets trouvés" title="Panier d'objets trouvés">
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>Type</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Lieu</th>
                                    <th>Details</th>
                                    <th>Collaborateur</th>
                                    <th className="bg-dark"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(flow =>(
                                        <tr key={flow.id}>
                                        <td>{flow.type}</td>
                                        <td>{flow.description}</td>
                                        <td>{flow.date}</td>
                                        <td>{flow.place}</td>
                                        <td>{flow.details}</td>
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
                                            .collection("lostNfound")
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

export default Lost