import React, { useState, useContext } from 'react'
import { Form, Button, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Feedback from '../../../svg/feedbackBox.svg'
import { FirebaseContext, db, auth } from '../../../Firebase'

const FeedbackBox = () =>{

    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({categorie: "Améliorations", feedback: ""})
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleSubmitFeedback = async(event) => {
        event.preventDefault()
        setFormValue({categorie: "improvement", feedback: ""})
        const notif = "La Team MSH vous remercie pour votre contribution !"
        await db.collection('mySweetHotel')
            .doc('country')
            .collection('France')
            .doc('collection')
            .collection('business')
            .doc('collection')
            .collection('feedback')
            .doc('category')
            .collection(formValue.categorie)
            .add({
                author: user.displayName,
                hotelName: userDB.hotelName,
                hotelRegion: userDB.hotelRegion,
                hotelDept: userDB.hotelDept,
                text: formValue.feedback,
                markup: Date.now()
            })
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
                .collection('notifications')
                .add({
                content: notif,
                markup: Date.now()})
                .then(doc => console.log('nouvelle notitfication'))
        .then(handleClose)
    }

    return(
        <div>
            <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="title">
                Feedback Box
              </Tooltip>
            }>
                <img src={Feedback} alt="contact" onClick={handleShow} className="nav_icons" />
            </OverlayTrigger>


            <Modal show={list}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onHide={handleClose}
                    >
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title id="contained-modal-title-vcenter">
                        Feedback Box
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
            
                    <div style={{
                            display: "flex",
                            flexFlow: "row wrap",
                            justifyContent: "space-around",
                            padding: "5%",
                            textAlign: "center"
                        }}>
                            <Form.Row>
                                <Form.Group controlId="description">
                                <h4>Pour une meilleure expérience utilisateur</h4>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                <select class="selectpicker" 
                                value={formValue.categorie} name="categorie" onChange={handleChange} 
                                    style={{width: "35vw", 
                                    height: "6vh", 
                                    border: "1px solid lightgrey", 
                                    borderRadius: "3px",
                                    backgroundColor: "white", 
                                    paddingLeft: "1vw"}}>
                                        <option value="improvement">Améliorations</option>
                                        <option value="satisfaction">Satisfaction</option>
                                    </select>
                                </Form.Group>
                                </Form.Row>
                            <Form.Row>
                                <Form.Group controlId="description">
                                <Form.Control as="textarea" type="text" 
                                placeholder="Faites-nous un retour de votre expérience..." 
                                style={{width: "35vw", height: "30vh", resize: "none"}} 
                                value={formValue.feedback} name="feedback" onChange={handleChange} />
                                </Form.Group>
                            </Form.Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-success" onClick={handleSubmitFeedback}>Enregistrer</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default FeedbackBox