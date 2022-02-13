import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Modal, Button, Tab, Tabs, Table, ModalBody, Nav, Row, Col } from 'react-bootstrap'
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import MaintenancePieChart from "./maintenancePieChart"

const MaintenanceRate = ({userDB, showModal, closeModal}) => {
    const [filter, setFilter] = useState(Date.now() - 604800000);

    const roomChangeWeekAgo = Date.now() - 604800000
    const roomChangeMonthAgo = Date.now() - 2678400000
    const roomChangeSixMonthsAgo = Date.now() - 15901200000
    const roomChangeYearAgo = Date.now() - 31536000000 
    const [activeTab, setActiveTab] = useState("week");

  return <div>
      <Modal show={showModal}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={closeModal}
      enforceFocus={false}>
      <Modal.Header closeButton className="bg-light">
      <Modal.Title id="contained-modal-title-vcenter">
        Taux d'incidence technique
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
                borderRight: activeTab === "week" ? "50px solid darkgoldenrod" : "50px solid lightgray",
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer",
                color: activeTab === "week" ? "darkgoldenrod" : "gray",
            }}
            className="softSkin dashboard-icon"
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
                borderRight: activeTab === "month" ? "50px solid darkgoldenrod" : "50px solid lightgray",
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer",
                color: activeTab === "month" ? "darkgoldenrod" : "gray",
            }}
            className="softSkin dashboard-icon"
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
                borderRight: activeTab === "semester" ? "50px solid darkgoldenrod" : "50px solid lightgray",
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer",
                color: activeTab === "semester" ? "darkgoldenrod" : "gray",
            }}
            className="softSkin dashboard-icon"
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
                borderRight: activeTab === "year" ? "50px solid darkgoldenrod" : "50px solid lightgray",
                padding: "5%",
                marginBottom: "2vh",
                cursor: "pointer",
                color: activeTab === "year" ? "darkgoldenrod" : "gray",
            }}
            className="softSkin dashboard-icon"
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
            {activeTab === "week" && <h5 style={{textAlign: "center"}}>7 derniers jours</h5>}
            {activeTab === "month" && <h5 style={{textAlign: "center"}}>30 derniers jours</h5>}
            {activeTab === "semester" && <h5 style={{textAlign: "center"}}>6 derniers mois</h5>}
            {activeTab === "year" && <h5 style={{textAlign: "center"}}>12 derniers mois</h5>}
            <MaintenancePieChart filter={filter} userDB={userDB} />
        </div>
      </ModalBody>
    </Modal>
  </div>;
}

export default MaintenanceRate;
