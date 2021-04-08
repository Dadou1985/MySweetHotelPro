import React, {useState } from 'react'
import { Form, Button } from 'react-bootstrap'




const PhoneRepair = ({user, firebase}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", details: "", type: ""})

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleSubmit = event => {
        event.preventDefault()
        let day = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()
        let time = day + "/" + month + "/" + year
        let marker = Date.now()
        firebase.addMaintenance({documentId: user.displayName, author: user.username, room: formValue.room, client: formValue.client, markup: marker, date: time, type: formValue.type, details: formValue.details})
        setFormValue({room: "", client: "", details: "", type: ""})
    }

    return(
        
        <div className="phone_container">
            <h2 className="phone_title">Maintenance technique</h2>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Nom du client</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Numéro de chambre</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.room} name="room" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Quel type de problème ?</Form.Label><br/>
                    <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                    className="phonePage_select">
                        <option></option>
                        <option>Peinture</option>
                        <option>Plomberie</option>
                        <option>Electricité</option>
                        <option>Ménage</option>
                        <option>Autres</option>
                    </select>
                </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="details" className="phone_textarea">
                        <Form.Label>Plus de détails</Form.Label>
                        <Form.Control as="textarea" rows="3" value={formValue.details} name="details" onChange={handleChange}  />
                    </Form.Group>
                </Form.Row>
                <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
            </div>
                            
    )
}

export default PhoneRepair