import React, {useState, useEffect } from 'react'
import { Modal, OverlayTrigger, Tooltip, Nav, Row, Col, Tab, Card, Button, Form } from 'react-bootstrap'
import Database from '../../../svg/database.png'
import { db, functions } from '../../../Firebase'
import defaultImg from "../../../svg/angry-bear.jpg"

const UserDatabase = ({user, userDB}) =>{

    const [list, setList] = useState(false)
    const [Info, setInfo] = useState([])
    const [selectedUser, setselectedUser] = useState({})
    const [sendingMail, setSendingMail] = useState(false)
    const [guestMail, setguestMail] = useState([])

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChangeCheckbox = (email) => {
        return guestMail.push(email)
    }

    useEffect(() => {
        const guestOnAir = () => {
          return db.collection('guestUsers')
          .orderBy("username", "asc")
          }
  
        let unsubscribe = guestOnAir().onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setInfo(snapInfo)
        });
        return unsubscribe
       },[])

    const sendCheckinMail = functions.httpsCallable('sendCheckinMail')

    console.log("++++++++++", guestMail)

    return(
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center"
        }}>
        <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Base de données clients
              </Tooltip>
            }>
                <img src={Database} className="icon" alt="todolist" onClick={handleShow} style={{width: "45%"}} />
        </OverlayTrigger>

            <Modal
                show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => {
                    handleClose()
                    setSendingMail(false)}}>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Base de données clients
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            style={{overflow: "auto"}}>
                <Tab.Container>
                    <Row style={{marginBottom: "1vh"}}>
                    <Col sm={3}>
                    {Info.map(flow => (
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Nav.Link eventKey={flow.username} onClick={() => setselectedUser(flow)}>{flow.username}</Nav.Link>
                            {sendingMail && <Form.Group controlId="formBasicCheckbox" style={{display: "flex"}}>
                                <Form.Check type="checkbox" onChange={() => handleChangeCheckbox(flow.email)} /> Envoyer un mail de bienvenue
                            </Form.Group>} 
                        </Nav.Item>
                    </Nav>
                    ))}
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey={selectedUser.username} style={{
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center"
                        }}>
                        <Card style={{ width: '50%' }}>
                            <Card.Img variant="top" src={defaultImg} />
                            <Card.Body>
                                <Card.Title>{selectedUser.username}</Card.Title>
                                <Card.Text>
                                {selectedUser.email}
                                </Card.Text>
                            </Card.Body>
                            </Card>
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                {sendingMail ? <Button variant="success" onClick={async() => {
                    await sendCheckinMail({hotelName: userDB.hotelName, emails: guestMail, logo: userDB.logo, appLink: userDB.appLink})
                    setSendingMail(false)
                    return setguestMail([])}}>Envoyer</Button> : <Button variant="outline-info" onClick={() => setSendingMail(true)}>Envoyer un e-mail de bienvenue</Button>}
            </Modal.Footer>
            </Modal>
    </div>
    )
}

export default UserDatabase