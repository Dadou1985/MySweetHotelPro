import React, { useContext } from 'react'
import { Nav, Row, Col, Tab } from 'react-bootstrap'
import CheckListTable from '../../checkListTable'
import { FirebaseContext } from '../../../../Firebase'


const PhoneCheckList = () =>{

    const { user, firebase } = useContext(FirebaseContext)

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
                        {!!firebase && !!user && 
                        <CheckListTable shift="matin" firebase={firebase} user={user} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="soir">
                    {!!firebase && !!user && 
                        <CheckListTable shift="soir" firebase={firebase} user={user} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="nuit">
                    {!!firebase && !!user && 
                        <CheckListTable shift="nuit" firebase={firebase} user={user} />}
                    </Tab.Pane>
                </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    </div>
    )
}

export default PhoneCheckList