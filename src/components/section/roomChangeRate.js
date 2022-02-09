import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Modal, Button, Tab, Tabs, Table, ModalBody } from 'react-bootstrap'
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { Chart } from 'primereact/chart';
import Dougnut from '../../images/doughtnut.png'

const RoomChangeRate = ({userDB, showModal, closeModal}) => {
    const [roomChangeWeek, setRoomChangeWeek] = useState({paint: [], electricity: [], plumbery: [], housekeeping: [], others: []});
    const [roomChangeMonth, setRoomChangeMonth] = useState({paint: [], electricity: [], plumbery: [], housekeeping: [], others: []});
    const [roomChangeSemester, setRoomChangeSemester] = useState({paint: [], electricity: [], plumbery: [], housekeeping: [], others: []});
    const [roomChangeYear, setRoomChangeYear] = useState({paint: [], electricity: [], plumbery: [], housekeeping: [], others: []});

    const roomChangeDataWeek = {
        datasets: [
            {
                data: [roomChangeWeek.paint.length, roomChangeWeek.electricity.length, roomChangeWeek.plumbery.length, roomChangeWeek.housekeeping.length, roomChangeWeek.others.length],
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

    const roomChangeDataMonth = {
        datasets: [
            {
                data: [roomChangeMonth.paint.length, roomChangeMonth.electricity.length, roomChangeMonth.plumbery.length, roomChangeMonth.housekeeping.length, roomChangeMonth.others.length],
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
    
    const roomChangeDataSemester = {
        datasets: [
            {
                data: [roomChangeSemester.paint.length, roomChangeSemester.electricity.length, roomChangeSemester.plumbery.length, roomChangeSemester.housekeeping.length, roomChangeSemester.others.length],
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
    
    const roomChangeDataYear = {
        labels: ['Peinture', 'Electricité', 'Plomberie', 'Ménage', 'Autres'],
        datasets: [
            
            {
                data: [roomChangeYear.paint.length, roomChangeYear.electricity.length, roomChangeYear.plumbery.length, roomChangeYear.housekeeping.length, roomChangeYear.others.length],
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
                },
                position: "bottom"
            }
        }
    };

    const roomChangeWeekAgo = Date.now() - 604800000
    const roomChangeMonthAgo = Date.now() - 2678400000
    const roomChangeSixMonthsAgo = Date.now() - 15901200000
    const roomChangeYearAgo = Date.now() - 31536000000

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

                const paint = snapInfo && snapInfo.filter(reason => reason.reason === "Peinture")
                const electricity = snapInfo && snapInfo.filter(reason => reason.reason === "Electricité")
                const plumbery = snapInfo && snapInfo.filter(reason => reason.reason === "Plomberie")
                const housekeeping = snapInfo && snapInfo.filter(reason => reason.reason === "Ménage")
                const others = snapInfo && snapInfo.filter(reason => reason.reason === "Autres")

                setRoomChangeWeek({
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
            .collection("roomChange")
            .where("markup", ">=", roomChangeMonthAgo)
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
    
                    setRoomChangeMonth({
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
                .collection("roomChange")
                .where("markup", ">=", roomChangeSixMonthsAgo)
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
        
                        setRoomChangeSemester({
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
                    .collection("roomChange")
                    .where("markup", ">=", roomChangeYearAgo)
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
            
                            setRoomChangeYear({
                                paint: paint,
                                electricity: electricity,
                                plumbery: plumbery,
                                housekeeping: housekeeping,
                                others: others
                            })
                        });
                        return unsubscribe
                },[])   

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
          justifyContent: "space-around"
      }}>
          <div style={{width: "100%", display: "flex", marginBottom: "3vh", marginLeft: "1vw"}}>
            <div style={{display: "flex", marginRight: "1vw"}}>
                <div style={{background: "yellow", width: "1vw", color: "yellow", marginRight: "5px"}}>.</div> Peinture
            </div>
            <div style={{display: "flex", marginRight: "1vw"}}>
                <div style={{background: "blue", width: "1vw", color: "blue", marginRight: "5px"}}>.</div> Electricité
            </div>
            <div style={{display: "flex", marginRight: "1vw"}}>
                <div style={{background: "red", width: "1vw", color: "red", marginRight: "5px"}}>.</div> Plomberie
            </div>
            <div style={{display: "flex", marginRight: "1vw"}}>
                <div style={{background: "green", width: "1vw", color: "green", marginRight: "5px"}}>.</div> Ménage
            </div>
            <div style={{display: "flex", marginRight: "1vw"}}>
                <div style={{background: "orange", width: "1vw", color: "orange", marginRight: "5px"}}>.</div> Autres
            </div>
        </div>
      <div style={{
          width: "45%"
      }}>
            <div className="card" style={{
                display: "flex",
                flexFlow: "row",
                width: "100%", 
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                border: "1px solid lightgrey", 
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)", 
                padding: "3%",
                cursor: "pointer",
                marginBottom: "2vh"
            }}>
                <h6>7 derniers jours</h6>
                {roomChangeWeek !== {paint: [], electricity: [], plumbery: [], housekeeping: [], others: []}  ? <Chart type="doughnut" data={roomChangeDataWeek} options={lightOptions} style={{ position: 'absloute', width: '40%', left: "8vw", bottom: "1vh", filter: "drop-shadow(2px 4px 6px)" }} /> : <div style={{
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
                flexFlow: "row",
                width: "100%", 
                height: "18vh",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                border: "1px solid lightgrey", 
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)", 
                padding: "3%"
            }}>
                {roomChangeWeek !== {paint: [], electricity: [], plumbery: [], housekeeping: [], others: []}  ? <Chart type="doughnut" data={roomChangeDataMonth} options={lightOptions} style={{ position: 'absolute', width: '60%', left: "12vw", bottom: "2vh", filter: "drop-shadow(2px 4px 6px)" }} /> : <div style={{
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
                    <h6>30 derniers jours</h6>
            </div>
        </div>
          <div className="card" style={{
            display: "flex",
            flexFlow: "row",
            width: "50%", 
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            border: "1px solid lightgrey", 
            borderBottom: "2px solid lightgrey",
            borderRight: "2px solid lightgrey",
            filter: "drop-shadow(2px 4px 6px)", 
            padding: "3%"
          }}>
                {roomChangeWeek !== {paint: [], electricity: [], plumbery: [], housekeeping: [], others: []}  ? <Chart type="doughnut" data={roomChangeDataSemester} options={lightOptions} style={{ width: '90%', position: "absolute", left: "7vw", filter: "drop-shadow(2px 4px 6px)" }} /> : <div style={{
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
                <h6>6 derniers mois</h6>
          </div>
          <div className="card" style={{
            display: "flex",
            flexFlow: "row",
            width: "97%", 
            height: "40vh",
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            border: "1px solid lightgrey", 
            borderBottom: "2px solid lightgrey",
            borderRight: "2px solid lightgrey",
            filter: "drop-shadow(2px 4px 6px)", 
            padding: "3%",
            marginTop: "2vh"
          }}>
              <h6>12 derniers mois</h6>
              {roomChangeWeek !== {paint: [], electricity: [], plumbery: [], housekeeping: [], others: []}  ? <Chart type="doughnut" data={roomChangeDataSemester} options={lightOptions} style={{ position: 'absolute', width: '65%', left: "25vw", bottom: "2vh", filter: "drop-shadow(2px 4px 6px)" }} /> : <div style={{
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
      </ModalBody>
    </Modal>
  </div>;
}

export default RoomChangeRate;
