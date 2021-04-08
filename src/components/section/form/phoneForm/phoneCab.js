import React, { useState, useContext } from 'react'
import { Form, Button } from 'react-bootstrap'
import { FirebaseContext } from '../../../../Firebase'


const PhoneCab = () =>{

    const { user, firebase } = useContext(FirebaseContext)

    const [formValue, setFormValue] = useState({room: "", client: "", date: "", hour: "", passenger:"", model:"", destination: ""})

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

    const handleSubmit = event => {
        event.preventDefault()
        let marker = Date.now()
        firebase.addCab({documentId: user.displayName, author: user.username, room: formValue.room, client: formValue.client, markup: marker, date: formValue.date, hour: formValue.hour, destination: formValue.destination, pax: formValue.passenger, model: formValue.model})
        setFormValue({room: "", client: "", date: "", hour: "", passenger:"", model:"", destination: ""})

    }

    return(
        <div className="phone_container">
            <h2 className="phone_title">Réservation de taxi</h2>
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
                <Form.Group controlId="description" className="phone_smallInput">
                <Form.Label>Date de réservation</Form.Label>
                <Form.Control type="text" placeholder="ex: 16/04/2020" value={formValue.date} name="date" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group controlId="description" className="phone_smallInput">
                <Form.Label>Heure de réservation</Form.Label>
                <Form.Control type="text" placeholder="ex: 08h30" value={formValue.hour} name="hour" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group controlId="description" className="phone_input">
                <Form.Label>Nbre de passagers</Form.Label>
                <Form.Control type="number" value={formValue.passenger} name="passenger" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group controlId="description">
                <Form.Label>Type de véhicule</Form.Label><br/>
                <select class="selectpicker" value={formValue.model} name="model" onChange={handleChange} 
                className="phonePage_select">
                    <option></option>
                    <option>Berline</option>
                    <option>Van</option>
                </select>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group controlId="description" className="phone_input">
                <Form.Label>Adresse de destination</Form.Label>
                <Form.Control type="text" placeholder="ex: Jane Doe" value={formValue.destination} name="destination" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
            <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
        </div>
                            
    )
}

export default PhoneCab