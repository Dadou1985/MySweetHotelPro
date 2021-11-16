import React, { useState } from 'react'
import { Form, Button, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import Feedback from '../../../svg/feedbackBox.svg'
import { db } from '../../../Firebase'

const FeedbackBox = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({categorie: "improvement", feedback: ""})

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
        await db.collection('feedbacks')
            .doc('category')
            .collection(formValue.categorie)
            .add({
                author: userDB.username,
                hotelName: userDB.hotelName,
                hotelRegion: userDB.hotelRegion,
                hotelDept: userDB.hotelDept,
                text: formValue.feedback,
                markup: Date.now()
            })
            return db.collection('notifications')
                .add({
                content: notif,
                hotelId: userDB.hotelId,
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
                            <Form.Row style={{width: "100%"}}>
                                <Form.Group controlId="exampleForm.SelectCustom" style={{width: "100%"}}>
                                <select class="selectpicker" 
                                value={formValue.categorie} name="categorie" onChange={handleChange} 
                                    style={{
                                    width: "100%", 
                                    height: "3vh", 
                                    border: "1px solid lightgrey", 
                                    borderRadius: "3px",
                                    backgroundColor: "white", 
                                    paddingLeft: "1vw"}}>
                                        <option value="improvement">Améliorations</option>
                                        <option value="satisfaction">Satisfaction</option>
                                    </select>
                                </Form.Group>
                                </Form.Row>
                            <Form.Row style={{width: "100%"}}>
                                <Form.Group controlId="description" style={{width: "100%"}}>
                                <Form.Control as="textarea" type="text" 
                                placeholder="Faites-nous un retour de votre expérience..." 
                                style={{width: "100%", height: "30vh", resize: "none"}} 
                                value={formValue.feedback} name="feedback" onChange={handleChange} />
                                </Form.Group>
                            </Form.Row>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={handleSubmitFeedback}>Enregistrer</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default FeedbackBox