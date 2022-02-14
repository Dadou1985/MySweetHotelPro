import React, { useState } from 'react'
import { Form, Button, Tooltip, OverlayTrigger, Modal, FloatingLabel } from 'react-bootstrap'
import Feedback from '../../../images/feedback.png'
import { db } from '../../../Firebase'
import { useTranslation } from "react-i18next"

const FeedbackBox = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({categorie: "improvement", feedback: ""})
    const { t, i18n } = useTranslation()

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
        const notif = t("msh_feedback_box.f_notif")
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
                {t("msh_feedback_box.f_title")}
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
                        {t("msh_feedback_box.f_title")}
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
                            <div style={{marginBottom: "2vh"}}>
                                <Form.Group controlId="description">
                                <h4>{t("msh_feedback_box.f_subtitle")}</h4>
                                </Form.Group>
                            </div>
                            <div style={{width: "100%", marginBottom: "1vh"}}>
                                <Form.Group controlId="exampleForm.SelectCustom" style={{width: "100%"}}>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label="Catégorie"
                                    className="mb-3"
                                >
                                    <Form.Select class="selectpicker" 
                                        value={formValue.categorie} name="categorie" onChange={handleChange} 
                                            style={{
                                            width: "100%", 
                                            border: "1px solid lightgrey", 
                                            borderRadius: "3px",
                                            backgroundColor: "white", 
                                            paddingLeft: "1vw"}}>
                                                <option value="improvement">{t("msh_feedback_box.f_comment.c_improvement")}</option>
                                                <option value="satisfaction">{t("msh_feedback_box.f_comment.c_satisfaction")}</option>
                                    </Form.Select>
                                </FloatingLabel>
                                </Form.Group>
                                </div>
                            <div style={{width: "100%", marginBottom: "1vh"}}>
                                <Form.Group controlId="description" style={{width: "100%"}}>
                                <FloatingLabel
                                    controlId="floatingInput"
                                    label={t("msh_feedback_box.f_input_textarea")}
                                    className="mb-3"
                                >
                                    <Form.Control as="textarea" type="text" 
                                    placeholder={t("msh_feedback_box.f_input_textarea")} 
                                    style={{width: "100%", height: "30vh", resize: "none"}} 
                                    value={formValue.feedback} name="feedback" onChange={handleChange} />
                                </FloatingLabel>
                                </Form.Group>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={handleSubmitFeedback}>{t("msh_general.g_button.b_send")}</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default FeedbackBox