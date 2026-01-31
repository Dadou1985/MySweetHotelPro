import React from 'react'
import { Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../../itemList'
import StyleBadge from '../../../../helper/common/badgeMaker'
import { useTranslation } from "react-i18next"
import '../../../css/section/form/phoneForm/phonePageTemplate.css'

function PhoneHouseKeeping() {
  const { t } = useTranslation()

  const housekeepingItems = [
    { key: "towel", item: "towel", label: t("msh_housekeeping.h_towel") },
    { key: "soap", item: "soap", label: t("msh_housekeeping.h_soap") },
    { key: "toiletPaper", item: "toiletPaper", label: t("msh_housekeeping.h_toilet_paper") },
    { key: "hairDryer", item: "hairDryer", label: t("msh_housekeeping.h_hair_dryer") },
    { key: "pillow", item: "pillow", label: t("msh_housekeeping.h_pillow") },
    { key: "blanket", item: "blanket", label: t("msh_housekeeping.h_blanket") },
    { key: "iron", item: "iron", label: t("msh_housekeeping.h_iron") },
    { key: "babyBed", item: "babyBed", label: t("msh_housekeeping.h_baby_bed") },
  ]

  return (
    <div className="phoneCheckList_container">
      <h3 className="phone_title">{t("msh_housekeeping.h_title")}</h3>

      <Tab.Container defaultActiveKey={housekeepingItems[0].label}>
        <Row>
          <Col sm={12}>
            <Nav variant="pills" className="flex-row justify-content-center">
              {housekeepingItems.map(({ key, item, label }) => (
                <Nav.Item key={key}>
                  <StyleBadge item={item}>
                    <Nav.Link eventKey={label}>{label}</Nav.Link>
                  </StyleBadge>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          <Col sm={12}>
            <Tab.Content>
              {housekeepingItems.map(({ key, item, label }) => (
                <Tab.Pane key={key} eventKey={label}>
                  <ItemList item={item} />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}

export default PhoneHouseKeeping
