import React, { useState, useContext } from 'react';
import { useTranslation } from "react-i18next"
import moment from 'moment'
import 'moment/locale/fr'
import { navigate } from 'gatsby'
import { Chart } from 'primereact/chart';
import Notebook from '../../assets/svg/notebook.png'
import ChatLogo from '../../assets/images/chat.png'
import BarChart from '../../assets/images/barChart.png'
import RoomChangeRate from './roomChange/roomChangeRate'
import MaintenanceRate from './maintenance/maintenanceRate'
import { useFirestoreSubscription } from '../../utils/hooks/useFirestore'
import { stackedDataForWeek } from '../../utils/timeRange/stackedData'
import { sevenDayAgo } from '../../utils/timeRange/week'
import { FirebaseContext } from '../../config/Firebase'
import '../../css/section/dashboard.css'

const DashboardComponent = () => {
  const { userDB } = useContext(FirebaseContext)
  const { t } = useTranslation()
  const [showRoomChangeModal, setShowRoomChangeModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

const dDay = t("msh_dashboard.d_time_period.t_day").charAt(0)

  let basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: .8,
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }
  };

  const { data: consigne = [] } = useFirestoreSubscription(
    ['hotels', userDB.hotelId, 'note'],
    { where: ['date', '==', moment(new Date()).format('LL')], orderBy: ['markup', 'desc'] }
  )

  const { data: chatRaw = [] } = useFirestoreSubscription(
    ['hotels', userDB.hotelId, 'chat'],
    { where: ['checkoutDate', '!=', ''] }
  )
  const chat = chatRaw.filter(c => c.status === true)

  const { data: roomChange = [] } = useFirestoreSubscription(
    ['hotels', userDB.hotelId, 'roomChange'],
    { where: ['markup', '>=', sevenDayAgo] }
  )

  const { data: maintenance = [] } = useFirestoreSubscription(
    ['hotels', userDB.hotelId, 'maintenance'],
    { where: ['markup', '>=', sevenDayAgo] }
  )

  const roomChangeData = {
    labels: [`${dDay}-6`, `${dDay}-5`, `${dDay}-4`, `${dDay}-3`, `${dDay}-2`, `${dDay}-1`, `${dDay} 0`],
    datasets: [{ data: stackedDataForWeek(roomChange), backgroundColor: "black", label: t('msh_dashboard.d_rate') }]
  }

  const maintenanceData = {
    labels: [`${dDay}-6`, `${dDay}-5`, `${dDay}-4`, `${dDay}-3`, `${dDay}-2`, `${dDay}-1`, `${dDay} 0`],
    datasets: [{ data: stackedDataForWeek(maintenance), backgroundColor: "black", label: t('msh_dashboard.d_rate') }]
  }

  return <div style={{
      display: "flex",
      flexFlow: "column",
      width: "100%",
      padding: "1%",
      marginTop: "2vh",
      alignItems: window?.innerWidth > 768 ? "flex-start" : "center"
  }}>
        <div style={{width: "100%", marginBottom: typeof window && window.innerWidth > 768 ? "2vh" : "1vh"}}>
          <div className='dashboard-note-container'>
            <div className='dashboard-icon dashboard-note-card' style={{
              borderBottom: "2px solid lightgrey",
              borderRight: "2px solid lightgrey"}} onClick={() => navigate('/notebook')}>
                <div style={{
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "5px solid lightgray",
                  borderRight: "5px solid lightgray",
                  border: '1px solid lightgrey',
                  borderRadius: "100%",
                  padding: "2vw",
                  width: "3rem",
                  height: "3rem",
                  // minWidth: "67px",
                  // maxWidth: "107px",
                  height: window && window.innerWidth > 768 ? "4vh" : "4em",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <img src={Notebook} style={{width: typeof window && window.innerWidth > 768 ? "2vw" : "2em"}} />
                </div>
                <div style={{paddingLeft: typeof window && window.innerWidth > 768 ? "2vw" : "6vw", display: "flex", flexFlow: "column", justifyContent: "space-between"}}>
                  <h6 className='dashboard-note-title'>{t("msh_messenger.m_note_big_title")}</h6>
                  <h3>{consigne.length > 0 ? consigne.length : 0} </h3>
                </div>
            </div>
            <div className='dashboard-icon dashboard-note-card' style={{
              borderBottom: "2px solid lightgrey"}} onClick={() => navigate('/chat')}>
                <div style={{
                  display: "flex",
                  flexFlow: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "5px solid lightgray",
                  borderRight: "5px solid lightgray",
                  border: '1px solid lightgrey',
                  borderRadius: "100%",
                  padding: "2vw",
                  width: "3rem",
                  height: "3rem",
                  // minWidth: "67px",
                  // maxWidth: "107px",
                  height: window && window.innerWidth > 768 ? "4vh" : "4em",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <img src={ChatLogo} style={{width: typeof window && window.innerWidth > 768 ? "2vw" : "2.5em"}} />
                </div>
                <div style={{paddingLeft: typeof window && window.innerWidth > 768 ? "2vw" : "6vw", display: "flex", flexFlow: "column", justifyContent: "space-between"}}>
                  <h6 className='dashboard-note-title'>{t("msh_dashboard.d_chat_room")}</h6>
                  <h3>{chat.length > 0 ? chat.length : 0}</h3>
                </div>
              </div>
          </div>
        </div>
        <div style={{
          width: "100%",
          display: "flex",
          flexFlow:  typeof window && window.innerWidth > 768 ? "row" : "column",
          justifyContent: "space-around"
        }}>
          <div className="card dashboard-icon dasbhboard-rate-card" onClick={() => setShowRoomChangeModal(true)}>
              <div>
                <h5 style={{textAlign: "center", marginBottom: "0vh"}}>{t('msh_dashboard.d_doughnut_chart.d_title')}</h5>
                <p style={{textAlign: "center", color: "gray"}}>{t('msh_dashboard.d_doughnut_chart.d_subtitle')}</p>
              </div>
              {roomChange.length > 0 ? <Chart type="bar" data={roomChangeData} options={basicOptions} style={{ position: 'relative', width: '100%', height: "90%", borderTop: "1px solid #B8860B", paddingTop: "1vh" }} /> : <div style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center"
              }}>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "5px solid lightgray",
                    borderRight: "5px solid lightgray",
                    border: '1px solid lightgrey',
                    borderRadius: "100%",
                    padding: "2vw",
                    width: typeof window && window.innerWidth > 768 ? "12rem" : "100px",
                    height: typeof window && window.innerWidth > 768 ? "12rem" : "100px",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "2vh",
                    marginBottom: "2vh"
                  }}>
                    <img src={BarChart} style={{width: typeof window && window.innerWidth > 768 ? "6rem" : "6vw"}} />
                  </div>
                  <h6>{t("msh_dashboard.d_no_data")}</h6>
                </div>}
          </div>
          <div className="card dashboard-icon dasbhboard-rate-card" onClick={() => setShowMaintenanceModal(true)}>
              <div>
                <h5 style={{textAlign: "center", marginBottom: "0vh"}}>{t('msh_dashboard.d_pie_chart.p_title')}</h5>
                <p style={{textAlign: "center", color: "gray"}}>{t('msh_dashboard.d_pie_chart.p_subtitle')}</p>
              </div>
              {maintenance.length > 0 ? <Chart type="bar" data={maintenanceData} options={basicOptions} style={{ position: 'relative', width: '100%', height: "90%", borderTop: "1px solid #B8860B", paddingTop: "1vh" }} /> : <div style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                width: "70%"
              }}>
                <div style={{
                    display: "flex",
                    flexFlow: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "5px solid lightgray",
                    borderRight: "5px solid lightgray",
                    border: '1px solid lightgrey',
                    borderRadius: "100%",
                    padding: "2vw",
                    width: typeof window && window.innerWidth > 768 ? "12rem" : "100px",
                    height: typeof window && window.innerWidth > 768 ? "12rem" : "100px",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "2vh",
                    marginBottom: "2vh"
                  }}>
                    <img src={BarChart} style={{width: typeof window && window.innerWidth > 768 ? "6rem" : "6vw"}} />
                  </div>
                  <h6>{t("msh_dashboard.d_no_data")}</h6>
                </div>}
          </div>
        </div>

        <RoomChangeRate showModal={showRoomChangeModal} closeModal={() => setShowRoomChangeModal(false)} />
        <MaintenanceRate showModal={showMaintenanceModal} closeModal={() => setShowMaintenanceModal(false)} />
  </div>;
}

export default DashboardComponent