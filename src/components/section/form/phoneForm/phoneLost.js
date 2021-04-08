import React, {useState, useContext} from 'react'
import { Form, Button } from 'react-bootstrap'
import { FirebaseContext } from '../../../../Firebase'



const PhoneLost = () =>{

    const { user, firebase } = useContext(FirebaseContext)

    const [formValue, setFormValue] = useState({type: "", place: "", details: "", description: ""})

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
        firebase.addLostFound({documentId: user.displayName, author: user.username, date: time, type: formValue.type, markup: marker, place: formValue.place, details: formValue.details, description: formValue.description})
        setFormValue({type: "", place: "", details: "", description: ""})
    }

    return(
      <div className="phone_container">
              <h2 className="phone_title">Objets Perdus</h2>
              <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Quel type d'objet ?</Form.Label><br/>
                      <select class="selectpicker" value={formValue.type} name="type" onChange={handleChange} 
                      className="phonePage_select">
                          <option></option>
                          <option>High Tech</option>
                          <option>Documents Officiels</option>
                          <option>Vêtements</option>
                          <option>Autres</option>
                      </select>
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Lieu ?</Form.Label><br/>
                      <select class="selectpicker" value={formValue.place} name="place" onChange={handleChange} 
                      className="phonePage_select">
                          <option></option>
                          <option>Hall</option>
                          <option>Restaurant</option>
                          <option>Parking</option>
                          <option>Toilettes</option>
                          <option>Etages</option>
                          <option>Autres</option>
                      </select>
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="description" className="phone_input">
                  <Form.Label>Description de l'objet</Form.Label>
                  <Form.Control type="text" placeholder="ex: un i-phone noir" value={formValue.description} name="description" onChange={handleChange} />
                  </Form.Group>
              </Form.Row>
              <Form.Row>
                  <Form.Group controlId="details" className="phone_textarea">
                      <Form.Label>Plus de détails</Form.Label>
                      <Form.Control as="textarea" rows="3" name="details" value={formValue.details} onChange={handleChange}  />
                  </Form.Group>
              </Form.Row>
              <Button variant="success" className="phone_submitButton" onClick={handleSubmit}>Enregistrer</Button>
          </div>
    )
}

export default PhoneLost