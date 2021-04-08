import React, {useState, useContext } from 'react'
import { Button, Modal, InputGroup, FormControl, Form, OverlayTrigger, Tooltip, Nav, Row, Col, Tab } from 'react-bootstrap'
import CheckListTable from '../checkListTable'
import Maid from '../../../svg/maid.svg'
import { FirebaseContext, db, auth } from '../../../Firebase'


const HouseKeeping = () =>{

    const [list, setList] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    const { userDB, setUserDB } = useContext(FirebaseContext)
    
    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    console.log("%%%%%%", user)
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
                Conciergerie
              </Tooltip>
            }>
                <img src={Maid} className="icon" alt="todolist" onClick={handleShow} style={{width: "55%", marginRight: "1vw"}} />
        </OverlayTrigger>

            <Modal
                show={list}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Conciergerie
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            style={{overflow: "auto"}}>
                <Tab.Container defaultActiveKey="matin">
                <Row>
                    <Col sm={2}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                        <Nav.Link eventKey="Serviette">Serviette</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="Savon">Savon</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="Papier Toilette">Papier Toilette</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="Sèche-cheveux">Sèche-cheveux</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="Coussin">Coussin</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="Couverture">Couverture</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="matin">Fer à repasser</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Nav.Link eventKey="soir">Lit Bébé</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={10}>
                    <Tab.Content>
                        <Tab.Panel eventKey="Serviette">
                            <CheckListTable shift="towel" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Savon"> 
                            <CheckListTable shift="soap" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Papier Toilette"> 
                            <CheckListTable shift="toilet-paper" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Sèche-cheveux">
 
                            <CheckListTable shift="hair-dryer" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Coussin"> 
                            <CheckListTable shift="pillow" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Couverture"> 
                            <CheckListTable shift="blanket" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Fer à repasser">
 
                            <CheckListTable shift="iron" />
                        </Tab.Panel>
                        <Tab.Panel eventKey="Lit Bébé"> 
                            <CheckListTable shift="baby-bed" />
                        </Tab.Panel>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            </Modal.Body>
            </Modal>
    </div>
    )
}

export default HouseKeeping