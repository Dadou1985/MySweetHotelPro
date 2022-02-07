import React, { useState, useEffect } from 'react';
import Coffee from '../../images/morningCoffee.png'
import { useTranslation } from "react-i18next"
import Taxi from '../../svg/taxi.svg'
import Timer from '../../svg/timer.svg'
import RoomChage from '../../svg/logout.svg'
import Maintenance from '../../svg/repair.svg'
import {db} from '../../Firebase'
import Background from '../../images/background.png'
import moment from 'moment'
import 'moment/locale/fr';
import { navigate } from 'gatsby'
import { Chart } from 'primereact/chart';
import Notebook from '../../svg/notebook.png'
import ChatLogo from '../../images/chat.png'

export default function Dashboard({user, userDB}) {
  const { t, i18n } = useTranslation()
  const [reception, setReception] = useState([])
  const [menage, setMenage] = useState([])
  const [maintenance, setMaintenance] = useState([]);
  const [chat, setChat] = useState([]);
  const [taxi, setTaxi] = useState([]);
  const [alarm, setAlarm] = useState([]);
  const [roomChange, setRoomChange] = useState([]);
  const [technical, setTechnical] = useState([]);
  const [roomChangeCategory, setRoomChangeCategory] = useState({paint: [], electricity: [], plumbery: [], housekeeping: [], others: []});

  const chartData = {
    labels: ['Peinture', 'Electricité', 'Plomberie', 'Ménage', 'Autres'],
    datasets: [
        {
            data: [roomChangeCategory.paint.length, roomChangeCategory.electricity.length, roomChangeCategory.plumbery.length, roomChangeCategory.housekeeping.length, roomChangeCategory.others.length],
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
                color: '#495057'
            }
        }
    }
};

  useEffect(() => {
    const noteOnAir = () => {
      return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection('note')
        .where("date", "==", moment(new Date()).format('LL'))
        .orderBy('markup', "desc")
    }

      let unsubscribe = noteOnAir().onSnapshot(function(snapshot) {
        const snapMessages = []
        snapshot.forEach(function(doc) {          
            snapMessages.push({
              id: doc.id,
              ...doc.data()
            })        
          });
          console.log(snapMessages)
          const noteReception = snapMessages.length > 0 && snapMessages.filter(note => note.status === "darkgoldenrod")
          const noteMenage = snapMessages.length > 0 && snapMessages.filter(note => note.status === "cornflowerblue")
          const noteMaintenance = snapMessages.length > 0 && snapMessages.filter(note => note.status === "red")

          setReception(noteReception)
          setMenage(noteMenage)
          setMaintenance(noteMaintenance)
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
useEffect(() => {
  const toolOnAir = () => {
      return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection("roomChange")
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

              const paint = snapInfo && snapInfo.filter(reason => reason.reason === "Peinture")
              const electricity = snapInfo && snapInfo.filter(reason => reason.reason === "Electricité")
              const plumbery = snapInfo && snapInfo.filter(reason => reason.reason === "Plomberie")
              const housekeeping = snapInfo && snapInfo.filter(reason => reason.reason === "Ménage")
              const others = snapInfo && snapInfo.filter(reason => reason.reason === "Autres")

              setRoomChange(snapInfo)
              setRoomChangeCategory({
                paint: paint,
                electricity: electricity,
                plumbery: plumbery,
                housekeeping: housekeeping,
                others: others
              })
          });
          return unsubscribe
},[])
useEffect(() => {
  const toolOnAir = () => {
      return db.collection('hotels')
      .doc(userDB.hotelId)
      .collection("maintenance")
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
              setTechnical(snapInfo)
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
        <div style={{width: "100%", marginBottom: typeof window && window.innerWidth > 768 ? "7vh" : "1vh"}}>
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
                  <h3>{reception.length > 0 ? reception.length : 0} </h3>
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
                  <h3>{menage.length > 0 ? menage.length : 0}</h3>
                  <h6 className='dashboard-note-title'>{t("msh_dashboard.d_chat_room")}</h6>
                </div>
              </div>
          </div>
        </div>
        <div className="card flex justify-content-center" style={{
          width: "95%", 
          marginLeft: "1vw",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          border: "1px solid lightgrey", 
          borderBottom: "2px solid lightgrey",
          borderRight: "2px solid lightgrey",
          filter: "drop-shadow(2px 4px 6px)", 
          padding: "3%"
        }}>
            <h5 style={{textAlign: "center"}}>Statistiques de l'hôtel</h5>
            <p style={{textAlign: "center", color: "gray"}}>Sur les 7 jours précédents</p>
            <Chart type="doughnut" data={chartData} options={lightOptions} style={{ position: 'relative', width: '50%' }} />
        </div>
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
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={RoomChage} style={{width: "3vw"}} /><h5 style={{position: "absolute", marginLeft: "7vw"}}>{roomChange.length}</h5>
          </div>
          <h6 style={{display: "flex", flexFlow: "row wrap", justifyContent: "center"}}>{t("msh_toolbar.tooltip_room_change")}</h6>
        </div>
        <div style={{display: "flex", flexFlow: "column", alignItems: "center"}}>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={Maintenance} style={{width: "3vw"}} /><h5 style={{position: "absolute", marginLeft: "7vw"}}>{technical.length}</h5>
          </div>
          <h6 style={{width: "5vw", textAlign: "center"}}>{t("msh_toolbar.tooltip_technical")}</h6>
        </div>
              </div>*/}
  </div>;
}
