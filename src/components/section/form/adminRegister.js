import React, { useState } from 'react'
import {Form, Button, FloatingLabel} from 'react-bootstrap'
import { db, functions } from '../../../Firebase'
import { useTranslation } from "react-i18next"

const AdminRegister = ({hide, userDB}) => {

    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [language, setLanguage] = useState(navigator.language || navigator.userLanguage)
    const { t } = useTranslation()

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const createUser = functions.httpsCallable('createUser')
    const sendNewCoworkerAccountMail = functions.httpsCallable('sendNewCoworkerAccountMail')

    let newUid = userDB.hotelId + Date.now()

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
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
        return db.collection('businessUsers')
        .doc(newUid)
        .set({  
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
        }) 
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
                <Form.Group controlId="formGroupName">
                <FloatingLabel
                    controlId="floatingInput"
                    label={t("msh_admin_board.a_cowoker")}
                    className="mb-3"
                    >
                    <Form.Control style={{width: "20vw"}} value={formValue.username} name="username" type="text" placeholder={t("msh_admin_board.a_cowoker")} onChange={handleChange} required />
                </FloatingLabel>
                </Form.Group>
                {/*<Form.Group controlId="formGroupEmail">
                    <Form.Control style={{width: "20vw"}} value={formValue.email} name="email" type="email" placeholder="Entrer un email" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formGroupPassword">
                    <Form.Control style={{width: "20vw"}} value={formValue.password} name="password" type="password" placeholder="Entrer un mot de passe" onChange={handleChange} required />
                </Form.Group>
                {!!errorMessage && <div id="wrongConf" style={{color: 'red', textAlign: 'center'}}>{errorMessage}</div>}
                <Form.Group controlId="formGroupConfPassword">
                    <Form.Control style={{width: "20vw"}} value={formValue.confPassword} name="confPassword" type="password" placeholder="Confirmer le mot de passe" onChange={handleChange} required />
                </Form.Group>*/}
                <Form.Group controlId="formGroupRefHotel">
                <FloatingLabel
                    controlId="floatingInput"
                    label={t("msh_admin_board.a_email")}
                    className="mb-3"
                    >
                    <Form.Control style={{width: "20vw"}} value={formValue.email} name="email" type="text" placeholder={t("msh_admin_board.a_email")} onChange={handleChange} required />
                </FloatingLabel>
                </Form.Group>
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