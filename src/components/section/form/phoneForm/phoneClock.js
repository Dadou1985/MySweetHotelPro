import React, {useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const PhoneClock = ({user, firebase}) =>{

    const [formValue, setFormValue] = useState({room: "", client: "", hour: "", date: ""})

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
        firebase.addClock({documentId: user.displayName, author: user.username, room: formValue.room, day: formValue.date, client: formValue.client, markup: marker, date: time, hour: formValue.hour})
        setFormValue({room: "", client: "", hour: "", date: ""})
    }

    return(

    <div className="phone_container">
        <h3 className="phone_title">Programmation des réveils</h3>
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
                <Form.Group controlId="description" className="phone_input">
                <Form.Label>Date de réveil</Form.Label>
                <Form.Control type="text" placeholder="ex: 16/04/2020" value={formValue.date} name="date" onChange={handleChange} />
                </Form.Group>
            </Form.Row>
        <Form.Row>
            <Form.Group controlId="description" className="phone_input">
            <Form.Label>Heure de réveil</Form.Label>
            <Form.Control type="text" placeholder="ex: 08h30" value={formValue.hour} name="hour" onChange={handleChange} />
            </Form.Group>
        </Form.Row>
        <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
    </div>
    )
}

export default PhoneClock