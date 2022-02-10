import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Modal, Button, Tab, Tabs, Table, ModalBody, Nav, Row, Col } from 'react-bootstrap'
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { Chart } from 'primereact/chart';
import Dougnut from '../../images/doughtnut.png'
import DoughnutChart from "./roomChangeDoughtnut"

const RoomChangeRate = ({userDB, showModal, closeModal}) => {
    const [filter, setFilter] = useState(Date.now() - 604800000);

    const roomChangeWeekAgo = Date.now() - 604800000
    const roomChangeMonthAgo = Date.now() - 2678400000
    const roomChangeSixMonthsAgo = Date.now() - 15901200000
    const roomChangeYearAgo = Date.now() - 31536000000 
    const [ActiveTab, setActiveTab] = useState("week");

    console.log("++++++++++++", filter)

  return <div>
      <Modal show={showModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={closeModal}
      enforceFocus={false}>
      <Modal.Header closeButton className="bg-light">
      <Modal.Title id="contained-modal-title-vcenter">
        Taux de délogement
        </Modal.Title>
      </Modal.Header>
      <ModalBody style={{
          display: "flex",
          flexFlow: "row wrap",
      }}>
        <div style={{
            display: "flex",
            flexFlow: "column",
            padding: "1vw",
            width: "20%",
            borderRight: "1px solid lightgrey"
        }}>
            <h5 style={{paddingBottom: "4vh"}}>Périodes</h5>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%", 
                backgroundColor: "whitesmoke",
                borderBottomRightRadius: "50px",
                borderTopRightRadius: "50px",
                border: "1px solid lightgrey", 
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)", 
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer",
            }}
            className="softSkin"
            onClick={() => {
                setFilter(roomChangeWeekAgo)
                setActiveTab("week")
                }}>7 derniers jours</div>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%", 
                backgroundColor: "whitesmoke",
                borderBottomRightRadius: "50px",
                borderTopRightRadius: "50px",
                border: "1px solid lightgrey", 
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)", 
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer"
            }}
            className="softSkin"
            onClick={() => {
                setActiveTab("month")
                setFilter(roomChangeMonthAgo)
                }}>30 derniers jours</div>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%", 
                backgroundColor: "whitesmoke",
                borderBottomRightRadius: "50px",
                borderTopRightRadius: "50px",
                border: "1px solid lightgrey", 
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)", 
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer"
            }}
            className="softSkin"
            onClick={() => {
                setActiveTab("semester")
                setFilter(roomChangeSixMonthsAgo)
                }}>6 derniers mois</div>
            <div style={{
                display: "flex",
                flexFlow: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%", 
                backgroundColor: "whitesmoke",
                borderBottomRightRadius: "50px",
                borderTopRightRadius: "50px",
                border: "1px solid lightgrey", 
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)", 
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer"
            }}
            className="softSkin"
            onClick={() => {
                setActiveTab("year")
                setFilter(roomChangeYearAgo)
                }}>12 derniers mois</div>
        </div>
        
        <div style={{
            display: "flex",
            flexFlow: "column",
            width: "80%",
            padding: "1vw"
        }}>
            {ActiveTab === "week" && <h5 style={{textAlign: "center"}}>7 derniers jours</h5>}
            {ActiveTab === "month" && <h5 style={{textAlign: "center"}}>30 derniers jours</h5>}
            {ActiveTab === "semester" && <h5 style={{textAlign: "center"}}>6 derniers mois</h5>}
            {ActiveTab === "year" && <h5 style={{textAlign: "center"}}>12 derniers mois</h5>}
            <DoughnutChart filter={filter} userDB={userDB} />
        </div>
      </ModalBody>
    </Modal>
  </div>;
}

export default RoomChangeRate;
