import React, { useContext, useState} from 'react'
import { Form, FormControl, Button, Table, Tabs, Tab, Tooltip, OverlayTrigger, Modal } from 'react-bootstrap'
import { FirebaseContext } from '../../../Firebase'
import Bed from '../../../svg/bed.svg'


const RoomAvailable = () => {

    const { user, firebase } = useContext(FirebaseContext)
    const [formValue, setFormValue] = useState({room: ""})
    const [list, setList] = useState(false)
    

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChange = (event) =>{
        event.persist()
        setFormValue(currentValue =>({
          ...currentValue,
          [event.target.name]: event.target.value
        }))
      }

      const handleSubmit = event => {
        event.preventDefault()
        firebase.updateRoomAvailable({documentId: user.displayName, room: formValue.room}).then(handleClose)
    }

    return (
        <div>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="title">
                Chambre(s) restante(s)
              </Tooltip>
            }>
              <img src={Bed} alt="contact" className="icon" onClick={handleShow} style={{width: "60%"}} />
            </OverlayTrigger>

            <Modal
                show={list}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Mise à jour des chambre(s) restante(s)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div style={{
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "space-around",
                  padding: "5%", 
                  textAlign: "center",
                  padding: "2%"
              }}>
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}>
                <b>Nombre de chambres restantes :</b>
                <FormControl style={{width: "4vw", height: "5vh", marginLeft: "1%"}}
                  type="text"
                  aria-describedby="basic-addon1"
                  value={formValue.room}
                  name="room"
                  onChange={handleChange}/>
              </div>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleSubmit} size="sm">Actualiser</Button>  
            </Modal.Footer>
            </Modal>   
          </div>
    )
}

export default RoomAvailable