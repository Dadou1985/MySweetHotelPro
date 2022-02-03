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

export default function Dashboard({user, userDB}) {
  const { t, i18n } = useTranslation()
  const [reception, setReception] = useState([])
  const [menage, setMenage] = useState([])
  const [maintenance, setMaintenance] = useState([]);
  const [chat, setChat] = useState([]);

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

  return <div style={{
      display: "flex",
      flexFlow: "column",
      width: "100%",
      padding: "1%",
      marginTop: "2vh"
  }}>
        <div style={{width: "100%", marginBottom: "7vh"}}>
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "space-around"
          }}>
            <div style={{
              width: "25%",
              height: "25vh", 
              padding: "1%", 
              borderRadius: "10px", 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid darkgoldenrod",
              borderRight: "5px solid darkgoldenrod", 
              filter: "drop-shadow(2px 4px 6px gray", 
              color: "darkgoldenrod",
              backgroundColor: "whitesmoke"}}>
                <div style={{display: "flex", borderBottom: "1px solid darkgoldenrod"}}>{reception.length > 0 ? reception.length : "Aucune"} consigne(s)</div>
                <h4 style={{textAlign: "center", marginTop: "8vh"}}>Réception</h4>
            </div>
            <div style={{
              width: "25%",
              height: "25vh", 
              padding: "1%", 
              borderRadius: "10px", 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid cornflowerblue",
              borderRight: "5px solid cornflowerblue",
               filter: "drop-shadow(2px 4px 6px gray",
               color: "cornflowerblue",
               backgroundColor: "whitesmoke"}}>
              <div style={{display: "flex", borderBottom: "1px solid cornflowerblue"}}>{menage.length > 0 ? menage.length : "Aucune"} consigne(s)</div>
                <h4 style={{textAlign: "center", marginTop: "8vh"}}>Ménage</h4>
              </div>
            <div style={{
              width: "25%",
              height: "25vh", 
              padding: "1%", 
              borderRadius: "10px", 
              border: "1px solid lightgrey", 
              borderBottom: "15px solid red",
              borderRight: "5px solid red", 
              filter: "drop-shadow(2px 4px 6px gray",
              color: "red",
              backgroundColor: "whitesmoke"}}>
              <div style={{display: "flex", borderBottom: "1px solid red"}}>{maintenance.length > 0 ? maintenance.length : "Aucune"} consigne(s)</div>
                <h4 style={{textAlign: "center", marginTop: "8vh"}}>Maintenance Technique</h4>
            </div>
          </div>
        </div>
      <div style={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "space-between",
          width: "90%",
          height: "10vh",
          marginLeft: "2vw", 
          padding: "1%", 
          borderRadius: "10px", 
          filter: "drop-shadow(2px 4px 6px black",
          backgroundColor: "transparent", 
          border: "1px solid lightgrey",
          borderBottom: "15px solid gray",
          borderRight: "5px solid gray",
          color: "gray",
          backgroundColor: "whitesmoke"}}> 
        <div style={{display: "flex"}}>{chat.length} conversation(s) active(s)</div>
        <h4 style={{marginTop: "4vh"}}>Chat Client</h4>
      </div>
      <div style={{
        display: "flex", 
        width: "90%", 
        flexFlow: "row",
        justifyContent: "space-between",
        marginTop: "7vh",
        marginLeft: "2vw"
        }}>
        <div>
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            padding: "1%",
            width: "7vw", 
            height: "14vh", 
            border: "1px solid lightgrey", 
            borderRadius: "50%",   
            filter: "drop-shadow(2px 4px 6px)",
            marginBottom: "1vh",
            cursor: "pointer"}}
            className='softSkin'>
              <img src={Taxi}  style={{width: "3vw"}} /><h4 style={{position: "absolute", marginLeft: "7vw"}}>5</h4>
          </div>
          <h6 style={{textAlign: "center"}}>Réservations<br/> de taxi</h6>
        </div>
        <div>
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            padding: "1%",
            width: "7vw", 
            height: "14vh", 
            border: "1px solid lightgrey", 
            borderRadius: "50%",   
            filter: "drop-shadow(2px 4px 6px)",
            marginBottom: "1vh",
            cursor: "pointer"}}
            className='softSkin'>
              <img src={Timer} style={{width: "3vw"}} /><h4 style={{position: "absolute", marginLeft: "7vw"}}>5</h4>
          </div>
          <h6 style={{textAlign: "center"}}>Réveils</h6>
        </div>
        <div>
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            padding: "1%",
            width: "7vw", 
            height: "14vh", 
            border: "1px solid lightgrey", 
            borderRadius: "50%",   
            filter: "drop-shadow(2px 4px 6px)",
            marginBottom: "1vh",
            cursor: "pointer"}}
            className='softSkin'>
              <img src={RoomChage} style={{width: "3vw"}} /><h4 style={{position: "absolute", marginLeft: "7vw"}}>5</h4>
          </div>
          <h6 style={{textAlign: "center"}}>Délogements</h6>
        </div>
        <div>
          <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center",
            padding: "1%",
            width: "7vw", 
            height: "14vh", 
            border: "1px solid lightgrey", 
            borderRadius: "50%",   
            filter: "drop-shadow(2px 4px 6px)",
            marginBottom: "1vh",
            cursor: "pointer"}}
            className='softSkin'>
              <img src={Maintenance} style={{width: "3vw"}} /><h4 style={{position: "absolute", marginLeft: "7vw"}}>5</h4>
          </div>
          <h6 style={{textAlign: "center"}}>Interventions<br/>techniques</h6>
        </div>
      </div>
  </div>;
}
