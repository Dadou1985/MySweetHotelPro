import React, { useState, useEffect, useContext } from 'react'
import { Form, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Contact from '../../../svg/contacts.svg'
import { FirebaseContext, db, auth } from '../../../Firebase'

const Annuaire = () =>{

    const [list, setList] = useState(false)
    const [info, setInfo] = useState([])
    const [formValue, setFormValue] = useState({name: "", mobile: "", fix: ""})
    const [user, setUser] = useState(auth.currentUser)
    const {userDB} = useContext(FirebaseContext)


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
    let marker = Date.now()
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
    .collection('contact')
    .add({
      name: formValue.name,
      mobile: formValue.mobile,
      fix: formValue.fix,
      markup: Date.now()
    })
    .then(handleClose)
    }

    useEffect(() => {
        const contactOnAir = () => {
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
            .collection('contact')
            .orderBy("name")
        }
        
        let unsubscribe = contactOnAir().onSnapshot(function(snapshot) {
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
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center"
        }}>
            <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="title">
                Annuaire
              </Tooltip>
            }>
                <img src={Contact} alt="contact" onClick={handleShow} style={{width: "30%"}} />
            </OverlayTrigger>


            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Annuaire du personnel
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                    <Tabs defaultActiveKey="Ajouter un contact" id="annuaire">
                            <Tab eventKey="Répertoire" title="Répertoire" style={{overflow: "auto"}}>
                                {info.map(flow =>(
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row wrap",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                    key={flow.markup}>
                                        <div style={{padding: "2%", width: "50%"}}>
                                            <h5 className="bold">{flow.name}</h5>
                                            <p><i>Mobile : {flow.mobile}</i> 
                                            <br /><i>Fixe : {flow.fix}</i></p>
                                        </div>
                                            <Button variant="outline-danger" size="sm" onClick={()=>db.deleteDocument({hotelId: userDB.hotelId, region: userDB.hotelRegion, departement: userDB.hotelDept, collection: "contact", document: flow.id})}>Supprimer</Button>
                                    </div>
                                ))}
                            </Tab>
                            <Tab eventKey="Ajouter un contact" title="Ajouter un contact">
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    padding: "5%",
                                    textAlign: "center"
                                }}>
                                    <Form.Row>
                                        <Form.Group controlId="description">
                                        <Form.Label>Nom du collaborateur</Form.Label>
                                        <Form.Control type="text" placeholder="ex: Jane Doe" style={{width: "20vw"}} value={formValue.name} name="name" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around",
                                        width: "70%"
                                    }}>
                                        <Form.Group controlId="description">
                                        <Form.Label>Numéro de mobile</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 0656872674" style={{width: "11vw"}} value={formValue.mobile} name="mobile" onChange={handleChange} />
                                        </Form.Group>
                                    
                                        <Form.Group controlId="description">
                                        <Form.Label>Numéro de fixe</Form.Label>
                                        <Form.Control type="text" placeholder="ex: 0130987654" style={{width: "11vw"}} value={formValue.fix} name="fix" onChange={handleChange} />
                                        </Form.Group>
                                    </Form.Row>
                                </div>
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

export default Annuaire