import React, { useState } from 'react'
import {Form, Button, Modal} from 'react-bootstrap'
import { db, functions } from '../../../Firebase'

const AdminRegister = ({hide, userDB}) => {

    const [formValue, setFormValue] = useState({username: "", email: ""})
    const [language, setLanguage] = useState(navigator.language || navigator.userLanguage)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const createUser = functions.httpsCallable('createUser')

    let newUid = userDB.hotelId + Date.now()

    const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }
 
    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        const notif = "Vous venez de créer un compte collaborateur !" 
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
        logo: userDB.logo,
        appLink: userDB.appLink,
        adresse: userDB.adresses,
        website: userDB.website,
        pricingModel: userDB.pricingModel
        }) 
        .then(() => {
            hide()
            addNotification(notif)
        })
      }

      console.log("$$$$$", formValue)

    return (
        <div>
            <Modal.Body>
            <div style={{
                    display: "flex",
                    flexFlow: "column wrap",
                    justifyContent: "space-around",
                    alignItems: "center",
                    padding: "5%",
                    textAlign: "center"
                }}>
                <Form.Group controlId="formGroupName">
                    <Form.Control style={{width: "20vw"}} value={formValue.username} name="username" type="text" placeholder="Prénom et Nom du collaborateur" onChange={handleChange} required />
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
                    <Form.Control style={{width: "20vw"}} value={formValue.email} name="email" type="text" placeholder="Email du collaborateur" onChange={handleChange} required />
                </Form.Group>
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSubmit}>Enregistrer</Button>
            </Modal.Footer>
         </div>
    )
}

export default AdminRegister