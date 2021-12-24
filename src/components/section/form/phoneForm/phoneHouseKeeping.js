import React from 'react'
import { Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../../itemList'
import StyleBadge from '../../common/badgeMaker'
import { useTranslation } from "react-i18next"

function PhoneHouseKeeping() {
    const { t, i18n } = useTranslation()

    return (
        <div className="phoneCheckList_container">
            <h3 className="phone_title">Conciergerie</h3>
            <Tab.Container defaultActiveKey="Serviette">
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-row justify-content-center">
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
                            <StyleBadge item="toiletPaper">
                                <Nav.Link eventKey="Papier Toilette">Papier Toilette</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="hairDryer">
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
                            <StyleBadge item="babyBed">
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
                            <ItemList item="toiletPaper" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Sèche-cheveux">
 
                            <ItemList item="hairDryer" />
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
                            <ItemList item="babyBed" />
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    )
}

export default PhoneHouseKeeping
