import React, {useState, useEffect } from 'react'
import { Button, Modal, InputGroup, FormControl, Form, OverlayTrigger, Tooltip, Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../itemList'
import Maid from '../../../svg/maid.svg'
import { db, auth } from '../../../Firebase'
import Badge from '@material-ui/core/Badge';


const HouseKeeping = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    
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
                Click & Wait
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
                Click & Wait
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            style={{overflow: "auto"}}>
                <Tab.Container defaultActiveKey="Serviette">
                <Row>
                    <Col sm={4}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <Badge badgeContent={4} color="primary"></Badge>
                            <Nav.Link eventKey="Serviette">Serviette</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Badge badgeContent={4} color="primary"></Badge>

                            <Nav.Link eventKey="Savon">Savon</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Badge badgeContent={4} color="primary"></Badge>

                            <Nav.Link eventKey="Papier Toilette">Papier Toilette</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Badge badgeContent={4} color="primary"></Badge>

                            <Nav.Link eventKey="Sèche-cheveux">Sèche-cheveux</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Badge badgeContent={4} color="primary"></Badge>

                            <Nav.Link eventKey="Coussin">Coussin</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Couverture">Couverture</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                        <Badge badgeContent={4} color="primary"></Badge>

                            <Nav.Link eventKey="Fer à repasser">Fer à repasser</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Lit Bébé">Lit Bébé</Nav.Link>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={8}>
                    <Tab.Content>
                        <Tab.Pane eventKey="Serviette">
                            <ItemList item="towel" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Savon"> 
                            <ItemList item="soap" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Papier Toilette"> 
                            <ItemList item="toilet-paper" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Sèche-cheveux">
 
                            <ItemList item="hair-dryer" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Coussin"> 
                            <ItemList item="pillow" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Couverture"> 
                            <ItemList item="blanket" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Fer à repasser">
                            <ItemList item="iron" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Lit Bébé"> 
                            <ItemList item="baby-bed" />
                        </Tab.Pane>
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