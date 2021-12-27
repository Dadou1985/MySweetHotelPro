import React, {useState } from 'react'
import { Modal, OverlayTrigger, Tooltip, Nav, Row, Col, Tab } from 'react-bootstrap'
import CheckListTable from '../checkListTable'
import TodoList from '../../../svg/todoList.svg'
import { useTranslation } from "react-i18next"


const CheckList = () =>{

    const [list, setList] = useState(false)
    const { t, i18n } = useTranslation()

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
                {t("msh_check_list.c_title")}
              </Tooltip>
            }>
                <img src={TodoList} className="icon" alt="todolist" onClick={handleShow} style={{width: "25%"}} />
        </OverlayTrigger>

            <Modal
                show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                {t("msh_check_list.c_title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            style={{overflow: "auto"}}>
                <Tab.Container defaultActiveKey="matin">
                <Row>
                    <Col sm={2}>
                    <Nav variant="pills" className="flex-column">
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
                            <CheckListTable shift="matin" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="soir">
                            <CheckListTable shift="soir" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="nuit">
                            <CheckListTable shift="nuit" />
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

export default CheckList