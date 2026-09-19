import React, { useState } from 'react'
import { 
    Form, 
    Button, 
    Tooltip, 
    OverlayTrigger, 
    Modal, 
    FloatingLabel 
} from 'react-bootstrap'
import ModalHeaderFormTemplate from '../../../utils/modal/modalHeaderFormTemplate'
import TextareaElement from '../../../utils/form/textareaElement'
import Feedback from '../../../assets/images/feedback.png'
import { useTranslation } from "react-i18next"
import {
    handleChange
} from '../../../utils/form/formCommonFunctions'
import { useAdd } from '../../../utils/hooks/useFirestore'

const FeedbackBox = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({categorie: "improvement", feedback: ""})
    const { mutate: addFeedback } = useAdd()
    const { mutate: notify } = useAdd()
    const { t } = useTranslation()

    const handleShow = () => setList(true)
    const handleClose = () => {
        setList(false)
        setFormValue("")
    }

    const notif = t("msh_feedback_box.f_notif")
    const modalTitle = t("msh_feedback_box.f_title")

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
                <ModalHeaderFormTemplate title={modalTitle} />
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
                                    value={formValue.categorie} name="categorie" onChange={(event) => handleChange(event, setFormValue)} 
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
                            <TextareaElement
                                label={t("msh_feedback_box.f_input_textarea")}
                                row="3"
                                value={formValue.feedback} 
                                name="feedback" 
                                handleChange={handleChange}
                                setFormValue={setFormValue}
                                size={{width: "100%", height: "30vh", resize: "none"}} 
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={(event) => {
                            event.preventDefault()
                            addFeedback({ path: ['feedbacks', 'category', formValue.categorie], data: {
                                author: userDB.username,
                                hotelName: userDB.hotelName,
                                hotelRegion: userDB.hotelRegion,
                                hotelDept: userDB.hotelDept,
                                text: formValue.feedback,
                                markup: Date.now()
                            }})
                            notify({ path: ['notifications'], data: { content: notif, hotelId: userDB.hotelId, markup: Date.now() } })
                            handleClose()
                        }}>{t("msh_general.g_button.b_send")}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default FeedbackBox