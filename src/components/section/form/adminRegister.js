import React, { useState, useContext } from 'react'
import {Form, Button, FloatingLabel} from 'react-bootstrap'
import { db, functions, FirebaseContext } from '../../../Firebase'
import { useTranslation } from "react-i18next"
import { handleChange } from '../../../helper/formCommonFunctions'
import { handleCreateData1, addNotification } from '../../../helper/globalCommonFunctions'
import InputElement from '../../../helper/common/InputElement'
import { sha256 } from 'js-sha256'

const AdminRegister = ({hide}) => {
    const { userDB } = useContext(FirebaseContext)

    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [language, setLanguage] = useState(navigator.language || navigator.userLanguage)
    const { t } = useTranslation()

    const createUser = functions.httpsCallable('createUser')
    const sendNewCoworkerAccountMail = functions.httpsCallable('sendNewCoworkerAccountMail')

    let newUid = sha256("mshPro" + Date.now() + userDB.hotelId)

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
        language: language.substring(0, 2) ?? "fr",
        logo: userDB.logo ?? null,
        appLink: userDB.appLink ?? null,
        adresse: userDB.adresse ?? null,
        website: userDB.website ?? null,
        pricingModel: userDB.pricingModel
    }

    const sendWelcomeMail = () => {
        console.log("Email sent successfully !!!")
        return sendNewCoworkerAccountMail({
            adminName: userDB.username, 
            coworkerName: formValue.username, 
            coworkerMail: formValue.email,
            mshLogo: "https://i.postimg.cc/YqRNzcSJ/msh-new-Logo-transparent.png", 
            mshLogoPro: null
        })
    }
 
    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        try {
            const notif = `${t("msh_admin_board.a_notif")} ${formValue.username}`  
            await createUser({email: formValue.email, password: "password", username: formValue.username, uid: newUid})
            return handleCreateData1(event, "businessUsers", newUid, createdData) 
            .then(() => {
                hide()
                addNotification(notif, userDB.hotelId)
                sendWelcomeMail()
            })
        } catch (error) {
            const notif = t("msh_admin_board.a_notif_error_create_user") 
            addNotification(notif, userDB.hotelId)
        }
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
                    containerStyle={{width: "100%"}} 
                    label={t("msh_admin_board.a_cowoker")}
                    placeholder={t("msh_admin_board.a_cowoker")}
                    size="100%"
                    value={formValue.username}
                    name="username"
                    handleChange={handleChange}
                    setFormValue={setFormValue}
                />
                <InputElement
                    containerStyle={{marginBottom: "2vh", width: "100%"}} 
                    label={t("msh_admin_board.a_email")}
                    placeholder={t("msh_admin_board.a_email")}
                    size="100%"
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
                padding: "1vw", 
                float: "right"}}>
                <Button className='btn-msh' onClick={handleSubmit}>{t("msh_general.g_button.b_send")}</Button>
            </div>
         </div>
    )
}

export default AdminRegister