import React, { useState } from 'react'
import {Form, Button, Modal} from 'react-bootstrap'

const Register = ({firebase, hide}) => {

    const [formValue, setFormValue] = useState({username: "" || undefined, email: "" || undefined, password: "" || undefined, confPassword: "" || undefined})
    const [errorMessage, setErrorMessage] = useState('')
    const [messageError, setMessageError] = useState('')


    const handleChange = (event) =>{
        event.persist()
        setErrorMessage('')
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleSubmit = (event) => {
        event.preventDefault()
        setFormValue("")
            if(formValue.password === formValue.confPassword){
                firebase.freeRegister({username: formValue.username, email: formValue.email, password: formValue.password})
                .catch(error=>{
                    if(error.message){
                        setErrorMessage("Inscription invalide")
                    }else{}
                })
                return hide()
            }else{
                setFormValue({username: "",email: "", password: "", confPassword: "", refHotel: ""})
                return setErrorMessage("Désolé, confirmation de mot de passe incorrecte !")
            }
      }

    return (
        <div>
            <Modal.Body>
            <div className="register_modal_container">
                <Form.Group controlId="formGroupName" className="register_input">
                    <Form.Control value={formValue.username} name="username" type="text" placeholder="Entrer votre prénom et votre nom" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formGroupEmail" className="register_input">
                    <Form.Control value={formValue.email} name="email" type="email" placeholder="Entrer un e-mail" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formGroupPassword" className="register_input">
                    <Form.Control value={formValue.password} name="password" type="password" placeholder="Entrer un mot de passe" onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formGroupConfPassword" className="register_input">
                    <Form.Control value={formValue.confPassword} name="confPassword" type="password" placeholder="Confirmer le mot de passe" onChange={handleChange} required />
                </Form.Group>
                {!!errorMessage && <div id="wrongConf">{errorMessage}</div>}
                {!!messageError && <div id="uncompleteRegistration">{messageError}</div>}
            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-success" onClick={handleSubmit}>Enregistrer</Button>
            </Modal.Footer>
         </div>
    )
}

export default Register