import React, { useContext, useEffect } from 'react'
import { Nav, Row, Col, Tab } from 'react-bootstrap'
import CheckListTable from '../../checkListTable'
import { FirebaseContext, auth, db } from '../../../../Firebase'
import Drawer from '@material-ui/core/Drawer'

const PhoneCheckList = ({user, userDB}) =>{


    return(
        <div className="phoneCheckList_container">
            <h2 className="phone_title">Check List</h2>
            <Tab.Container defaultActiveKey="matin">
            <Row>
                <Col sm={2}>
                <Nav variant="pills" className="flex-row">
                    <Nav.Item>
                    <Nav.Link eventKey="matin">Matin</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="soir">Soir</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="nuit">Nuit</Nav.Link>
                    </Nav.Item>
                </Nav>
                </Col>
                <Col sm={10}>
                <Tab.Content>
                    <Tab.Pane eventKey="matin">
                        {!!userDB && !!user && 
                        <CheckListTable shift="matin" userDB={userDB} user={user} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="soir">
                    {!!userDB && !!user && 
                        <CheckListTable shift="soir" userDB={userDB} user={user} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="nuit">
                    {!!userDB && !!user && 
                        <CheckListTable shift="nuit" userDB={userDB} user={user} />}
                    </Tab.Pane>
                </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    </div>
    )
}

export default PhoneCheckList