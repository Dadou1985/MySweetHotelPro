import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import 'moment/locale/fr';
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'
import { handleSubmitData2, addNotification } from '../../../../helper/globalCommonFunctions';
import { handleChange } from '../../../../helper/formCommonFunctions'
import TextareaElement from '../../../../helper/common/textareaElement'

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
                value={formValue.categorie} name="categorie" onChange={(event) => handleChange(event, setFormValue)} 
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
                <TextareaElement
                    label={t("msh_feedback_box.f_input_textarea")}
                    row="3"
                    value={formValue.feedback} 
                    name="feedback" 
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                    size={{width: "90vw", height: "30vh", resize: "none", marginBottom: "30vh"}}
                />
            </div>
            <Button 
                variant="success" 
                size="md" 
                style={{position: "absolute", bottom: 0,left: 0, width: "100%", padding: "3%", borderRadius: 0}} 
                className="phone_submitButton" 
                onClick={(event) => {
                    handleSubmitData2(event, "feedbacks", "category", formValue.categorie, newData)
                    addNotification(notif, userDB.hotelId)
                    return handleClose()
                }}>{t("msh_feedback_box.f_phone_button")}</Button>
        </div>
    )
}

export default PhoneFeedback
