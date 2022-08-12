import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { navigate } from 'gatsby'
import { Chart } from 'primereact/chart';
import Notebook from '../../svg/notebook.png'
import ChatLogo from '../../images/chat.png'
import BarChart from '../../images/barChart.png'
import RoomChangeRate from './roomChangeRate'
import MaintenanceRate from './maintenanceRate'
import { fetchCollectionByCombo2, fetchCollectionByMapping2 } from '../../helper/globalCommonFunctions';
import '../css/section/dashboard.css'

const Dashboard = ({userDB}) => {
  const { t } = useTranslation()
  const [consigne, setConsigne] = useState([]);
  const [chat, setChat] = useState([]);
  const [roomChange, setRoomChange] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [showRoomChangeModal, setShowRoomChangeModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const reasonFilter = (array, start, end) => {
    const arrayFiltered = array.filter(reason => {return reason.markup < start && reason.markup > end})
    return arrayFiltered.length
}

const oneDayAgo = Date.now() - 86400000
const twoDayAgo = Date.now() - 172800000
const threeDayAgo = Date.now() - 259200000
const fourDayAgo = Date.now() - 345600000
const fiveDayAgo = Date.now() - 432000000
const sixDayAgo = Date.now() - 518400000
const sevenDayAgo = Date.now() - 604800000

const dDay = t("msh_dashboard.d_time_period.t_day").charAt(0)

const roomChangeData = {
  labels: [`${dDay}-6`, `${dDay}-5`, `${dDay}-4`, `${dDay}-3`, `${dDay}-2`, `${dDay}-1`, `${dDay} 0`],
  datasets: [
    {
        data: [
          reasonFilter(roomChange, sixDayAgo, sevenDayAgo),
          reasonFilter(roomChange, fiveDayAgo, sixDayAgo),
          reasonFilter(roomChange, fourDayAgo, fiveDayAgo),
          reasonFilter(roomChange, threeDayAgo, fourDayAgo),
          reasonFilter(roomChange, twoDayAgo, threeDayAgo),
          reasonFilter(roomChange, oneDayAgo, twoDayAgo),
          reasonFilter(roomChange, Date.now(), oneDayAgo)
        ],
        backgroundColor: "black",
        label: t('msh_dashboard.d_rate')
      }
    ]
  };

  const maintenanceData = {
    labels: [`${dDay}-6`, `${dDay}-5`, `${dDay}-4`, `${dDay}-3`, `${dDay}-2`, `${dDay}-1`, `${dDay} 0`],
    datasets: [
      {
        data: [
          reasonFilter(maintenance, sixDayAgo, sevenDayAgo),
          reasonFilter(maintenance, fiveDayAgo, sixDayAgo),
          reasonFilter(maintenance, fourDayAgo, fiveDayAgo),
          reasonFilter(maintenance, threeDayAgo, fourDayAgo),
          reasonFilter(maintenance, twoDayAgo, threeDayAgo),
          reasonFilter(maintenance, oneDayAgo, twoDayAgo),
          reasonFilter(maintenance, Date.now(), oneDayAgo)
        ],
        backgroundColor: "black",
        label: t('msh_dashboard.d_rate')
      }]
  }

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

  useEffect(() => {
    let unsubscribe = fetchCollectionByCombo2("hotels", userDB.hotelId, 'note', "date", "==", moment(new Date()).format('LL'), 'markup', 'desc').onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
          snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });

        setConsigne(snapInfo)
    });
    return unsubscribe 
  },[])

  useEffect(() => {
    let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "chat", "checkoutDate", "!=", "").onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });
      const chatStatus = snapInfo && snapInfo.filter(chat => chat.status === true)
      setChat(chatStatus)
    });
  return unsubscribe
  },[])

  useEffect(() => {
    let unsubscribe = fetchCollectionByMapping2("hotels", userDB.hotelId, "roomChange", "markup", ">=", sevenDayAgo).onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });
      setRoomChange(snapInfo)
    });
    return unsubscribe
  },[])


  useEffect(() => {
    let unsubscribe = fetchCollectionByMapping2('hotels', userDB.hotelId, "maintenance", "markup", ">=", sevenDayAgo).onSnapshot(function(snapshot) {
      const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });
      setMaintenance(snapInfo)
    });
    return unsubscribe
  },[])

  return <div style={{
      display: "flex",
      flexFlow: "column",
      width: "100%",
      padding: "1%",
      marginTop: "2vh",
      alignItems: typeof window && window.innerWidth > 768 ? "flex-start" : "center"
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
                  width: typeof window && window.innerWidth > 768 ? "4vw" : "18vw",
                  height: typeof window && window.innerWidth > 768 ? "8vh" : "11vh",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <img src={Notebook} style={{width: typeof window && window.innerWidth > 768 ? "2vw" : "7vw"}} />
                </div>
                <div style={{paddingLeft: typeof window && window.innerWidth > 768 ? "2vw" : "6vw"}}>
                  <h3>{consigne.length > 0 ? consigne.length : 0} </h3>
                  <h6 className='dashboard-note-title'>{t("msh_messenger.m_note_big_title")}</h6>
                </div>
            </div>
            <div className='dashboard-icon dashboard-note-card' style={{
              border: "1px solid lightgrey", 
              borderBottom: "2px solid lightgrey",
              borderRight: "2px solid lightgrey"}} onClick={() => navigate('/chat')}>
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
                  width: typeof window && window.innerWidth > 768 ? "4vw" : "18vw",
                  height: typeof window && window.innerWidth > 768 ? "8vh" : "11vh",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <img src={ChatLogo} style={{width: typeof window && window.innerWidth > 768 ? "2vw" : "9vw"}} />
                </div>
                <div style={{paddingLeft: typeof window && window.innerWidth > 768 ? "2vw" : "6vw"}}>
                  <h3>{chat.length > 0 ? chat.length : 0}</h3>
                  <h6 className='dashboard-note-title'>{t("msh_dashboard.d_chat_room")}</h6>
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
              <h5 style={{textAlign: "center", marginBottom: "0vh"}}>{t('msh_dashboard.d_doughnut_chart.d_title')}</h5>
              <p style={{textAlign: "center", color: "gray"}}>{t('msh_dashboard.d_doughnut_chart.d_subtitle')}</p>
              {roomChange.length > 0 ? <Chart type="bar" data={roomChangeData} options={basicOptions} style={{ position: 'relative', width: '100%', height: "90%", borderTop: "1px solid lightgrey", paddingTop: "1vh" }} /> : <div style={{
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
                    width: typeof window && window.innerWidth > 768 ? "6vw" : "20vw",
                    height: "12vh",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "2vh",
                    marginBottom: "2vh"
                  }}>
                    <img src={BarChart} style={{width: typeof window && window.innerWidth > 768 ? "3vw" : "6vw"}} />
                  </div>
                  <h6>{t("msh_dashboard.d_no_data")}</h6>
                </div>}
          </div>
          <div className="card dashboard-icon dasbhboard-rate-card" onClick={() => setShowMaintenanceModal(true)}>
              <h5 style={{textAlign: "center", marginBottom: "0vh"}}>{t('msh_dashboard.d_pie_chart.p_title')}</h5>
              <p style={{textAlign: "center", color: "gray"}}>{t('msh_dashboard.d_pie_chart.p_subtitle')}</p>
              {maintenance.length > 0 ? <Chart type="bar" data={maintenanceData} options={basicOptions} style={{ position: 'relative', width: '100%', height: "90%", borderTop: "1px solid lightgrey", paddingTop: "1vh" }} /> : <div style={{
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
                    width: typeof window && window.innerWidth > 768 ? "6vw" : "20vw",
                    height: "12vh",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "2vh",
                    marginBottom: "2vh"
                  }}>
                    <img src={BarChart} style={{width: typeof window && window.innerWidth > 768 ? "3vw" : "6vw"}} />
                  </div>
                  <h6>{t("msh_dashboard.d_no_data")}</h6>
                </div>}
          </div>
        </div>

        <RoomChangeRate userDB={userDB} showModal={showRoomChangeModal} closeModal={() => setShowRoomChangeModal(false)} />
        <MaintenanceRate userDB={userDB} showModal={showMaintenanceModal} closeModal={() => setShowMaintenanceModal(false)} />
  </div>;
}

export default Dashboard