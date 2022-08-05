import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import 'moment/locale/fr';
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import {
    handleChange,
    handleSubmit
} from '../../../../helper/formCommonFunctions'

function PhoneFeedback({userDB}) {
    
    const [list, setList] = useState(false)
    const [formValue, setFormValue] = useState({categorie: "improvement", feedback: ""})
    const { t } = useTranslation()

    const handleClose = () => {
        setList(false)
        setFormValue("")
    }

    const notif = t("msh_feedback_box.f_notif")

    const newData = {
        author: userDB.username,
        hotelName: userDB.hotelName,
        hotelRegion: userDB.hotelRegion,
        hotelDept: userDB.hotelDept,
        text: formValue.feedback,
        markup: Date.now()
    }
    
    return (
        <div className="phone_container">
            <h4 style={{marginBottom: "5vh"}}>{t("msh_feedback_box.f_title")}</h4>
            <select class="selectpicker" 
                value={formValue.categorie} name="categorie" onChange={handleChange} 
                style={{width: "90vw", 
                height: "6vh", 
                border: "1px solid lightgrey", 
                borderRadius: "3px",
                backgroundColor: "white", 
                paddingLeft: "1vw", 
                marginBottom: "3vh"}}>
                    <option value="improvement">{t("msh_feedback_box.f_comment.c_improvement")}</option>
                    <option value="satisfaction">{t("msh_feedback_box.f_comment.c_satisfaction")}</option>
            </select>
            <div>
                <Form.Group controlId="description">
                <Form.Control as="textarea" type="text" 
                placeholder={t("msh_feedback_box.f_input_textarea")} 
                style={{width: "90vw", height: "30vh", resize: "none", marginBottom: "30vh"}} 
                value={formValue.feedback} name="feedback" onChange={handleChange} />
                </Form.Group>
            </div>
            <Button 
                variant="success" 
                size="md" 
                style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} 
                className="phone_submitButton" 
                onClick={(event) => {
                    return handleSubmit(
                        event, 
                        notif, 
                        userDB.hotelId,
                        "feedbacks",
                        "category", 
                        formValue.categorie, 
                        newData, 
                        handleClose)
                }}>{t("msh_feedback_box.f_phone_button")}</Button>
        </div>
    )
}

export default PhoneFeedback
