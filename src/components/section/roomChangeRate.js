import React, { useState, useContext } from 'react';
import { useTranslation } from "react-i18next"
import { Modal, ModalBody } from 'react-bootstrap'
import DoughnutChart from "./roomChangeDoughtnut"
import { oneWeekAgo, fourWeekAgo } from '../../helper/common/timeRange/month'
import { sixMonthAgo, twelveMonthAgo } from '../../helper/common/timeRange/year'
import { FirebaseContext } from '../../Firebase'

const RoomChangeRate = ({showModal, closeModal}) => {
    const { userDB } = useContext(FirebaseContext)
    const [filter, setFilter] = useState(Date.now() - 604800000);
    const { t } = useTranslation() 
    const [activeTab, setActiveTab] = useState("week");

    return <div>
        <Modal show={showModal}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={closeModal}
        enforceFocus={false}>
        <Modal.Header closeButton className="msh-bg">
        <Modal.Title id="contained-modal-title-vcenter">
        {t('msh_dashboard.d_doughnut_chart.d_title')}
            </Modal.Title>
        </Modal.Header>
        <ModalBody style={{
            display: "flex",
            flexFlow: "row wrap",
        }}>
        <div style={{
            display: typeof window && window.innerWidth > 768 ? "flex" : "none",
            flexFlow: "column",
            padding: "1vw",
            width: "20%",
            borderRight: "1px solid lightgrey"
        }}>
            <h5 style={{paddingBottom: "4vh"}}>{t('msh_dashboard.d_data_modal.d_period_title')}</h5>
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
                setFilter(oneWeekAgo)
                setActiveTab("week")
                }}>{t('msh_dashboard.d_data_modal.d_period.p_week')}</div>
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
                setFilter(fourWeekAgo)
                }}>{t('msh_dashboard.d_data_modal.d_period.p_month')}</div>
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
                setFilter(sixMonthAgo)
                }}>{t('msh_dashboard.d_data_modal.d_period.p_semester')}</div>
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
                setFilter(twelveMonthAgo)
                }}>{t('msh_dashboard.d_data_modal.d_period.p_year')}</div>
        </div>
        
        <div style={{
            display: "flex",
            flexFlow: "column",
            width: typeof window && window.innerWidth > 768 ? "80%" : "100%",
            padding: "1vw"
        }}>
            {activeTab === "week" && <h5 style={{textAlign: "center"}}>{t('msh_dashboard.d_data_modal.d_period.p_week')}</h5>}
            {activeTab === "month" && <h5 style={{textAlign: "center"}}>{t('msh_dashboard.d_data_modal.d_period.p_month')}</h5>}
            {activeTab === "semester" && <h5 style={{textAlign: "center"}}>{t('msh_dashboard.d_data_modal.d_period.p_semester')}</h5>}
            {activeTab === "year" && <h5 style={{textAlign: "center"}}>{t('msh_dashboard.d_data_modal.d_period.p_year')}</h5>}
            <DoughnutChart filter={filter} period={activeTab} userDB={userDB} />
        </div>
      </ModalBody>
    </Modal>
  </div>;
}

export default RoomChangeRate;
