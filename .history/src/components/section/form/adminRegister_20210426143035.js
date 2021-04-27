import React, { useState, useContext } from 'react'
import {Form, Button, Modal} from 'react-bootstrap'
import { db, auth, functions } from '../../../Firebase'

const AdminRegister = ({hide, user, userDB}) => {

    const [formValue, setFormValue] = useState({username: "", email: ""})

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const resetPassword = () => {
        return auth.sendPasswordResetEmail(formValue.email).then(function() {
        }).catch(function(error) {
        });
    }

    const createUser = functions.httpsCallable('createUser')
    const checkUserStatus = functions.httpsCallable('checkUserExists')
    
    const handleCheckUserStatus = (email, username) => {
        let userStatus = checkUserStatus({email: email})
        console.log("#######", userStatus)
        if(userStatus === null) {
            return createUser({email: email, password: "password", username: username})
        }
    }

    let newUid = userDB.hotelId + Date.now()
 
    const handleSubmit = async(event) => {
        event.preventDefault()
        //setFormValue("")
        await createUser({email: formValue.email, password: "password", username: formValue.username, hotelId})
        return db.collection("mySweetHotel")
        .doc("country")
        .collection("France")
        .doc('collection')
        .collection('business')
        .doc('collection')
        .collection('users')
        .doc(formValue.username)
        .set({   
        adminStatus: false, 
        email: formValue.email,
        password: "password",
        hotelId: userDB.hotelId,
        hotelName: userDB.hotelName,
        hotelRegion: userDB.hotelRegion,
        hotelDept: userDB.hotelDept,
        createdAt: Date.now(),
        }) 
        .then(hide())
      }

      console.log("$$$$$", newUid)

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
                <Button variant="outline-success" onClick={handleSubmit}>Enregistrer</Button>
            </Modal.Footer>
         </div>
    )
}

export default AdminRegister