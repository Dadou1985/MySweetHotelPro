import React from 'react'
import { Nav, Row, Col, Tab } from 'react-bootstrap'
import CheckListTable from '../../checkListTable'
import { useTranslation } from "react-i18next"

const PhoneCheckList = ({user, userDB}) =>{
    const { t, i18n } = useTranslation()


    return(
        <div className="phoneCheckList_container">
            <h3 className="phone_title">{t("msh_check_list.c_title")}</h3>
            <Tab.Container defaultActiveKey="matin">
            <Row>
                <Col sm={2}>
                <Nav variant="pills" className="flex-row">
                <Nav.Item>
                    <Nav.Link eventKey="matin">{t("msh_check_list.c_button.b_morning_shift")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="soir">{t("msh_check_list.c_button.b_afternoon_shift")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="nuit">{t("msh_check_list.c_button.b_night_shift")}</Nav.Link>
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