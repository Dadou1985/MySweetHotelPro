import React, { useState } from 'react'
import {Form, Button, FloatingLabel} from 'react-bootstrap'
import { db, functions } from '../../../Firebase'
import { useTranslation } from "react-i18next"
import { handleChange } from '../../../helper/formCommonFunctions'
import { handleCreateData1, addNotification } from '../../../helper/globalCommonFunctions'
import InputElement from '../../../helper/common/InputElement'

const AdminRegister = ({hide, userDB}) => {

    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [language, setLanguage] = useState(navigator.language || navigator.userLanguage)
    const { t } = useTranslation()

    const createUser = functions.httpsCallable('createUser')
    const sendNewCoworkerAccountMail = functions.httpsCallable('sendNewCoworkerAccountMail')

    let newUid = userDB.hotelId + Date.now()

    const createdData = {  
        username: formValue.username, 
        adminStatus: false, 
        email: formValue.email,
        password: "password",
        hotelId: userDB.hotelId,
        hotelName: userDB.hotelName,
        hotelRegion: userDB.hotelRegion,
        hotelDept: userDB.hotelDept,
        createdAt: Date.now(),
        userId: newUid,
        city: userDB.city,
        classement: userDB.classement,
        room: userDB.room,
        country: userDB.country,
        code_postal: userDB.code_postal,
        language: language.substring(0, 2),
        logo: userDB.logo ? userDB.logo : null,
        appLink: userDB.appLink ? userDB.appLink : null,
        adresse: userDB.adresse,
        website: userDB.website ? userDB.website : null,
        pricingModel: userDB.pricingModel
    }

    const sendWelcomeMail = () => {
        return sendNewCoworkerAccountMail({
            adminName: userDB.username, 
            coworkerName: formValue.username, 
            coworkerMail: formValue.email,
            mshLogo: "https://i.postimg.cc/YqRNzcSJ/msh-new-Logo-transparent.png", 
            mshLogoPro: "https://i.postimg.cc/L68gRJHb/msh-Pro-new-Logo-transparent.png"
        })
    }
 
    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        const notif = t("msh_admin_board.a_notif") 
        await createUser({email: formValue.email, password: "password", username: formValue.username, uid: newUid})
        return handleCreateData1("bussinessUsers", newUid, createdData) 
        .then(() => {
            hide()
            addNotification(notif)
            sendWelcomeMail()
        })
      }

    return (
        <div> 
            <div style={{
                    display: "flex",
                    flexFlow: "column wrap",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: "1%",
                    textAlign: "center"
                }}>
                <h5 style={{marginBottom: "2vh"}}>{t("msh_admin_board.a_first_tab_title")}</h5>
                <InputElement
                    containerStyle={{marginBottom: "2vh"}} 
                    label={t("msh_admin_board.a_cowoker")}
                    placeholder={t("msh_admin_board.a_cowoker")}
                    size="20vw"
                    value={formValue.username}
                    name="username"
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                />
                <InputElement
                    containerStyle={{marginBottom: "2vh"}} 
                    label={t("msh_admin_board.a_email")}
                    placeholder={t("msh_admin_board.a_email")}
                    size="20vw"
                    value={formValue.email}
                    name="email"
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                />
            </div>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "end",
                width: "100%", 
                borderTop: "1px solid lightgrey", 
                padding: "1vw", 
                float: "right"}}>
                <Button variant="dark" onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
            </div>
         </div>
    )
}

export default AdminRegister