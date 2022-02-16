import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { navigate } from 'gatsby'
import { Chart } from 'primereact/chart';
import Notebook from '../../svg/notebook.png'
import ChatLogo from '../../images/chat.png'
import PieChart from '../../images/pie-chart.png'
import Dougnut from '../../images/doughtnut.png'
import RoomChangeRate from './roomChangeRate'
import MaintenanceRate from './maintenanceRate';

const Dashboard = ({user, userDB}) => {
  const { t, i18n } = useTranslation()
  const [consigne, setConsigne] = useState([]);
  const [chat, setChat] = useState([]);
  const [taxi, setTaxi] = useState([]);
  const [alarm, setAlarm] = useState([]);
  const [roomChange, setRoomChange] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [roomChangeCategory, setRoomChangeCategory] = useState({noise: [], temperature: [], maintenance: [], cleaning: [], others: []});
  const [maintenanceCategory, setMaintenanceCategory] = useState({paint: [], electricity: [], plumbery: [], cleaning: [], others: []});
  const [showRoomChangeModal, setShowRoomChangeModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);


  const roomChangeData = {
    labels: ['Bruit', 'Température', 'Technique', 'Ménage', 'Autres'],
    datasets: [
        {
            data: [roomChangeCategory.noise.length, roomChangeCategory.temperature.length, roomChangeCategory.maintenance.length, roomChangeCategory.cleaning.length, roomChangeCategory.others.length],
            backgroundColor: [
                "yellow",
                "blue",
                "red",
                "green",
                "orange"
            ],
            hoverBackgroundColor: [
              "yellow",
              "blue",
              "red",
              "green",
              "orange"
            ]
        }]
};

const lightOptions = {
    plugins: {
        legend: {
            labels: {
                color: '#495057',
            },
            position: "bottom"
        }
    }
};

const maintenanceData = {
  labels: ['Peinture', 'Electricité', 'Plomberie', 'Ménage', 'Autres'],
  datasets: [
    {
      data: [maintenanceCategory.paint.length, maintenanceCategory.electricity.length, maintenanceCategory.plumbery.length, maintenanceCategory.cleaning.length, maintenanceCategory.others.length],
      backgroundColor: [
        "yellow",
        "blue",
        "red",
        "green",
        "orange"
    ],
    hoverBackgroundColor: [
      "yellow",
      "blue",
      "red",
      "green",
      "orange"
    ]
  }]
}

  useEffect(() => {
    const noteOnAir = () => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection('note')
        .where("date", "==", moment(new Date()).format('LL'))
        .orderBy('markup', "desc")
    }

      let unsubscribe = noteOnAir().onSnapshot(function(snapshot) {
        const snapInfo = []
        snapshot.forEach(function(doc) {          
            snapInfo.push({
              id: doc.id,
              ...doc.data()
            })        
          });
          console.log(snapInfo)

          setConsigne(snapInfo)
      });
      return unsubscribe
         
   },[])

   useEffect(() => {
    const chatOnAir = () => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection("chat")
        .where("checkoutDate", "!=", "")
      }

    let unsubscribe = chatOnAir().onSnapshot(function(snapshot) {
        const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });
        console.log(snapInfo)
        
        const chatStatus = snapInfo && snapInfo.filter(chat => chat.status === true)

        setChat(chatStatus)
    });
    return unsubscribe
   },[])

   useEffect(() => {
    const toolOnAir = () => {
        return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection("cab")
        .orderBy("markup", "asc")
    }

    let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
                const snapInfo = []
              snapshot.forEach(function(doc) {          
                snapInfo.push({
                    id: doc.id,
                    ...doc.data()
                  })        
                });
                console.log(snapInfo)
                setTaxi(snapInfo)
            });
            return unsubscribe
 },[])
 useEffect(() => {
  const toolOnAir = () => {
      return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection("clock")
      .orderBy("markup", "asc")
  }

  let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
              const snapInfo = []
            snapshot.forEach(function(doc) {          
              snapInfo.push({
                  id: doc.id,
                  ...doc.data()
                })        
              });
              console.log(snapInfo)
              setAlarm(snapInfo)
          });
          return unsubscribe
},[])

const roomChangeWeekAgo = Date.now() - 604800000

useEffect(() => {
  const toolOnAir = () => {
      return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection("roomChange")
      .where("markup", ">=", roomChangeWeekAgo)
  }

  let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
              const snapInfo = []
            snapshot.forEach(function(doc) {          
              snapInfo.push({
                  id: doc.id,
                  ...doc.data()
                })        
              });
              console.log(snapInfo)
              setRoomChange(snapInfo)

              const noise = snapInfo && snapInfo.filter(reason => reason.reason === "noise")
              const temperature = snapInfo && snapInfo.filter(reason => reason.reason === "temperature")
              const maintenance = snapInfo && snapInfo.filter(reason => reason.reason === "maintenance")
              const cleaning = snapInfo && snapInfo.filter(reason => reason.reason === "cleaning")
              const others = snapInfo && snapInfo.filter(reason => reason.reason === "others")

              setRoomChangeCategory({
                noise: noise,
                temperature: temperature,
                maintenance: maintenance,
                cleaning: cleaning,
                others: others
              })
          });
          return unsubscribe
},[])

const maintenanceWeekAgo = Date.now() - 604800000

useEffect(() => {
  const toolOnAir = () => {
      return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection("maintenance")
      .where("markup", ">=", maintenanceWeekAgo)
  }

  let unsubscribe = toolOnAir().onSnapshot(function(snapshot) {
              const snapInfo = []
            snapshot.forEach(function(doc) {          
              snapInfo.push({
                  id: doc.id,
                  ...doc.data()
                })        
              });

              setMaintenance(snapInfo)

              const paint = snapInfo && snapInfo.filter(reason => reason.type === "paint")
              const electricity = snapInfo && snapInfo.filter(reason => reason.type === "electricity")
              const plumbery = snapInfo && snapInfo.filter(reason => reason.type === "plumbery")
              const cleaning = snapInfo && snapInfo.filter(reason => reason.type === "cleaning")
              const others = snapInfo && snapInfo.filter(reason => reason.type === "others")


              console.log(snapInfo)
              setMaintenanceCategory({
                paint: paint,
                electricity: electricity,
                plumbery: plumbery,
                cleaning: cleaning,
                others: others
              })
          });
          return unsubscribe
},[])

console.log("------------", maintenanceCategory)

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
                  width: "4vw",
                  height: "8vh",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <img src={Notebook} style={{width: "2vw"}} />
                </div>
                <div style={{paddingLeft: "2vw"}}>
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
                  width: "4vw",
                  height: "8vh",
                  backgroundColor: "whitesmoke",
                  filter: "drop-shadow(2px 4px 6px)", 
                  marginBottom: "1vh"
                }}>
                  <img src={ChatLogo} style={{width: "2vw"}} />
                </div>
                <div style={{paddingLeft: "2vw"}}>
                  <h3>{chat.length > 0 ? chat.length : 0}</h3>
                  <h6 className='dashboard-note-title'>{t("msh_dashboard.d_chat_room")}</h6>
                </div>
              </div>
          </div>
        </div>
        <div style={{
          width: "100%",
          display: "flex",
          flexFlow: "row",
          justifyContent: "space-around"
        }}>
          <div className="card" style={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            width: "45%", 
            height: "40vh",
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            border: "1px solid lightgrey", 
            borderBottom: "2px solid lightgrey",
            borderRight: "2px solid lightgrey",
            padding: "3%",
            cursor: "pointer"
          }} 
          className="dashboard-icon" 
          onClick={() => setShowRoomChangeModal(true)}>
              <h5 style={{textAlign: "center", marginBottom: "0vh"}}>Taux de délogement en interne</h5>
              <p style={{textAlign: "center", color: "gray"}}>Sur les 7 derniers jours</p>
              {roomChange.length > 0 ? <Chart type="doughnut" data={roomChangeData} options={lightOptions} style={{ position: 'relative', width: '75%', borderTop: "1px solid lightgrey", paddingTop: "3vh" }} /> : <div style={{
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
                    width: "6vw",
                    height: "12vh",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "2vh",
                    marginBottom: "2vh"
                  }}>
                    <img src={Dougnut} style={{width: "3vw"}} />
                  </div>
                  <h6>Aucune donnée trouvé</h6>
                </div>}
          </div>
          <div className="card" style={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            width: "45%", 
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            border: "1px solid lightgrey", 
            borderBottom: "2px solid lightgrey",
            borderRight: "2px solid lightgrey",
            padding: "3%",
            cursor: "pointer"
          }} className="dashboard-icon"
            onClick={() => setShowMaintenanceModal(true)}>
              <h5 style={{textAlign: "center", marginBottom: "0vh"}}>Taux d'incidence technique</h5>
              <p style={{textAlign: "center", color: "gray"}}>Sur les 7 derniers jours</p>
              {maintenance.length > 0 ? <Chart type="pie" data={maintenanceData} options={lightOptions} style={{ position: 'relative', width: '75%', borderTop: "1px solid lightgrey", paddingTop: "1vh" }} /> : <div style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                borderTop: "1px solid lightgrey",
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
                    width: "6vw",
                    height: "12vh",
                    backgroundColor: "whitesmoke",
                    filter: "drop-shadow(2px 4px 6px)", 
                    marginTop: "5vh",
                    marginBottom: "2vh"
                  }}>
                    <img src={PieChart} style={{width: "3vw"}} />
                  </div>
                  <h6>Aucune donnée trouvé</h6>
                </div>}
          </div>
        </div>

        <RoomChangeRate userDB={userDB} showModal={showRoomChangeModal} closeModal={() => setShowRoomChangeModal(false)} />
        <MaintenanceRate userDB={userDB} showModal={showMaintenanceModal} closeModal={() => setShowMaintenanceModal(false)} />
      {/*<div className='dashboard-task-container'>
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={Taxi}  style={{width: "3vw"}} /><h5 style={{position: "absolute", marginLeft: "7vw"}}>{taxi.length}</h5>
          </div>
          <h6 style={{display: "flex", flexFlow: "row wrap", justifyContent: "center"}}>{t("msh_toolbar.tooltip_cab")}</h6>
        </div>
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={Timer} style={{width: "3vw"}} /><h5 style={{position: "absolute", marginLeft: "7vw"}}>{alarm.length}</h5>
          </div>
          <h6 style={{display: "flex", flexFlow: "row wrap", justifyContent: "center"}}>{t("msh_toolbar.tooltip_alarm")}</h6>
        </div>
      </div>*/}
  </div>;
}

export default Dashboard