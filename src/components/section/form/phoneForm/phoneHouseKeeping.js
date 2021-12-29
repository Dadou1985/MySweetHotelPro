import React from 'react'
import { Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../../itemList'
import StyleBadge from '../../common/badgeMaker'
import { useTranslation } from "react-i18next"

function PhoneHouseKeeping() {
    const { t, i18n } = useTranslation()

    return (
        <div className="phoneCheckList_container">
            <h3 className="phone_title">{t("msh_housekeeping.h_title")}</h3>
            <Tab.Container defaultActiveKey={t("msh_housekeeping.h_towel")}>
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-row justify-content-center">
                    <Nav.Item>
                            <StyleBadge item="towel">
                                <Nav.Link eventKey={t("msh_housekeeping.h_towel")}>{t("msh_housekeeping.h_towel")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="soap">
                                <Nav.Link eventKey={t("msh_housekeeping.h_soap")}>{t("msh_housekeeping.h_soap")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="toiletPaper">
                                <Nav.Link eventKey={t("msh_housekeeping.h_toilet_paper")}>{t("msh_housekeeping.h_toilet_paper")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="hairDryer">
                                <Nav.Link eventKey={t("msh_housekeeping.h_hair_dryer")}>{t("msh_housekeeping.h_hair_dryer")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                        <StyleBadge item="pillow">
                            <Nav.Link eventKey={t("msh_housekeeping.h_pillow")}>{t("msh_housekeeping.h_pillow")}</Nav.Link>
                        </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="blanket">
                                <Nav.Link eventKey={t("msh_housekeeping.h_blanket")}>{t("msh_housekeeping.h_blanket")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="iron">
                                <Nav.Link eventKey={t("msh_housekeeping.h_iron")}>{t("msh_housekeeping.h_iron")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="babyBed">
                                <Nav.Link eventKey={t("msh_housekeeping.h_baby_bed")}>{t("msh_housekeeping.h_baby_bed")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_towel")}>
                            <ItemList item="towel" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_soap")}> 
                            <ItemList item="soap" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_toilet_paper")}> 
                            <ItemList item="toiletPaper" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_hair_dryer")}>
                            <ItemList item="hairDryer" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_pillow")}> 
                            <ItemList item="pillow" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_blanket")}> 
                            <ItemList item="blanket" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_iron")}>
                            <ItemList item="iron" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_baby_bed")}> 
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
