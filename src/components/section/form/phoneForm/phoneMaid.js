import React, {useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const PhoneMaid = ({user, firebase}) =>{

    const [formValue, setFormValue] = useState({client: "", details: "", fromRoom: "", toRoom: "", reason: "", state: ""})

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
        firebase.addMaid({documentId: user.displayName, author: user.username, fromRoom: formValue.fromRoom, client: formValue.client, markup: marker, date: time, toRoom: formValue.toRoom, reason: formValue.reason, details: formValue.details, state: formValue.state})
        setFormValue({client: "", details: "", fromRoom: "", toRoom: "", reason: "", state: ""})
    }

    return(
        
        <div className="phone_container">
            <h2 className="phone_title">Délogements clients</h2>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_input">
                    <Form.Label>Nom du client</Form.Label>
                    <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.client} name="client" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_smallInput">
                    <Form.Label>Depuis la chambre...</Form.Label>
                    <Form.Control type="text" placeholder="ex: 310" value={formValue.fromRoom} name="fromRoom" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="description" className="phone_smallInput">
                    <Form.Label>...vers la chambre</Form.Label>
                    <Form.Control type="text" placeholder="ex: 409" value={formValue.toRoom} name="toRoom" onChange={handleChange} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Pour quel motif ?</Form.Label><br/>
                    <select class="selectpicker" value={formValue.reason} name="reason" onChange={handleChange} 
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
                    <Form.Group controlId="exampleForm.SelectCustom">
                    <Form.Label>Etat de la chambre</Form.Label><br/>
                    <select class="selectpicker" value={formValue.state} name="state" onChange={handleChange} 
                    className="phonePage_select">
                        <option></option>
                        <option>Sale</option>
                        <option>Propre</option>
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

export default PhoneMaid