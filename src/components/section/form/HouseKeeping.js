import React, {useState, useEffect } from 'react'
import { Button, Modal, InputGroup, FormControl, Form, OverlayTrigger, Tooltip, Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../itemList'
import Maid from '../../../svg/maid.svg'
import { db, auth } from '../../../Firebase'
import Badge from '@material-ui/core/Badge'
import StyleBadge from '../common/badgeMaker'
import GlobalBadge from '../common/globalBadgeGather'


const HouseKeeping = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [user, setUser] = useState(auth.currentUser)
    const [itemQty, setItemQty] = useState([])
    
    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

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
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <StyleBadge item="towel">
                                <Nav.Link eventKey="Serviette">Serviette</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="soap">
                                <Nav.Link eventKey="Savon">Savon</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="toilet-paper">
                                <Nav.Link eventKey="Papier Toilette">Papier Toilette</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="hair-dryer">
                                <Nav.Link eventKey="Sèche-cheveux">Sèche-cheveux</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                        <StyleBadge item="pillow">
                            <Nav.Link eventKey="Coussin">Coussin</Nav.Link>
                        </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="blanket">
                                <Nav.Link eventKey="Couverture">Couverture</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="iron">
                                <Nav.Link eventKey="Fer à repasser">Fer à repasser</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="baby-bed">
                                <Nav.Link eventKey="Lit Bébé">Lit Bébé</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
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