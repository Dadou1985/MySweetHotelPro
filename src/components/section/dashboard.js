import React, { useState, useEffect } from 'react';
import Coffee from '../../images/morningCoffee.png'
import { useTranslation } from "react-i18next"
import Taxi from '../../svg/taxi.svg'
import Timer from '../../svg/timer.svg'
import RoomChage from '../../svg/logout.svg'
import Maintenance from '../../svg/repair.svg'
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { navigate } from 'gatsby'

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
              setRoomChange(snapInfo)
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
        <div style={{width: "100%", marginBottom: "7vh"}}>
          <div className='dashboard-note-container'>
            <div className='dashboard-icon dashboard-note-card' style={{
              borderBottom: "15px solid darkgoldenrod",
              borderRight: "5px solid darkgoldenrod",  
              color: "darkgoldenrod"}} onClick={() => navigate('/notebook')}>
                <div style={{display: "flex", borderBottom: "1px solid darkgoldenrod"}}>{reception.length > 0 ? reception.length : "Aucune"} consigne(s)</div>
                <h4 className='dashboard-note-title'>{t("msh_messenger.m_reception_team")}</h4>
            </div>
            <div className='dashboard-icon dashboard-note-card' style={{
              border: "1px solid lightgrey", 
              borderBottom: "15px solid cornflowerblue",
              borderRight: "5px solid cornflowerblue",
              color: "cornflowerblue"}} onClick={() => navigate('/notebook')}>
              <div style={{display: "flex", borderBottom: "1px solid cornflowerblue"}}>{menage.length > 0 ? menage.length : "Aucune"} consigne(s)</div>
                <h4 className='dashboard-note-title'>{t("msh_messenger.m_housekeeping_team")}</h4>
              </div>
            <div className='dashboard-icon dashboard-note-card' style={{ 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid red",
              borderRight: "5px solid red", 
              color: "red"}} onClick={() => navigate('/notebook')}>
              <div style={{display: "flex", borderBottom: "1px solid red"}}>{maintenance.length > 0 ? maintenance.length : "Aucune"} consigne(s)</div>
                <h4 className='dashboard-note-title'>{t("msh_maintenance.m_title")}</h4>
            </div>
          </div>
        </div>
      <div className='dashboard-icon dashboard-chat-card' onClick={() => navigate('/chat')}> 
        <div style={{display: "flex", borderBottom: typeof window && window.innerWidth > 768 ? "none" : "1px solid gray"}}>{chat.length} conversation(s) active(s)</div>
        <h4 className='dashboard-chat-title'>{t("msh_chat.c_chat_title")}</h4>
      </div>
      <div className='dashboard-task-container'>
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={Taxi}  style={{width: typeof window && window.innerWidth > 768 ? "3vw" : "6vw"}} /><h5 style={{position: "absolute", marginLeft: typeof window && window.innerWidth > 768 ? "7vw" : "15vw"}}>{taxi.length}</h5>
          </div>
          <h6 style={{display: typeof window && window.innerWidth > 768 ? "flex" : "none", flexFlow: "row wrap", justifyContent: "center"}}>Taxi</h6>
        </div>
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={Timer} style={{width: typeof window && window.innerWidth > 768 ? "3vw" : "6vw"}} /><h5 style={{position: "absolute", marginLeft: typeof window && window.innerWidth > 768 ? "7vw" : "15vw"}}>{alarm.length}</h5>
          </div>
          <h6 style={{display: typeof window && window.innerWidth > 768 ? "flex" : "none", flexFlow: "row wrap", justifyContent: "center"}}>Réveils</h6>
        </div>
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={RoomChage} style={{width: typeof window && window.innerWidth > 768 ? "3vw" : "6vw"}} /><h5 style={{position: "absolute", marginLeft: typeof window && window.innerWidth > 768 ? "7vw" : "15vw"}}>{roomChange.length}</h5>
          </div>
          <h6 style={{display: typeof window && window.innerWidth > 768 ? "flex" : "none", flexFlow: "row wrap", justifyContent: "center"}}>Délogements</h6>
        </div>
        <div>
          <div className='dasboard-task-badge softSkin dashboard-circle-icon'>
              <img src={Maintenance} style={{width: typeof window && window.innerWidth > 768 ? "3vw" : "6vw"}} /><h5 style={{position: "absolute", marginLeft: typeof window && window.innerWidth > 768 ? "7vw" : "15vw"}}>{technical.length}</h5>
          </div>
          <h6 style={{display: typeof window && window.innerWidth > 768 ? "flex" : "none", flexFlow: "row wrap", justifyContent: "center"}}>Interventions</h6>
        </div>
      </div>
  </div>;
}
