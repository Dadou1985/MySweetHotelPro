import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next"
import { Modal, Button, Tab, Tabs, Table, ModalBody, Nav, Row, Col } from 'react-bootstrap'
import {db} from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';
import { Chart } from 'primereact/chart';
import Dougnut from '../../images/doughtnut.png'

const RoomChangeDoughtnut = ({userDB, filter}) => {
    const [roomChangeCategory, setRoomChangeCategory] = useState({paint: [], electricity: [], plumbery: [], housekeeping: [], others: []});

    useEffect(() => {
        const toolOnAir = () => {
            return db.collection('hotels')
            .doc(userDB.hotelId)
            .collection("roomChange")
            .where("markup", ">=", filter)
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
    
                    setRoomChangeCategory({
                        paint: paint,
                        electricity: electricity,
                        plumbery: plumbery,
                        housekeeping: housekeeping,
                        others: others
                    })
                });
                return unsubscribe
        },[filter])   

    const roomChangeData = {
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
                },
                position: "bottom"
            }
        }
    };

  return <div className="card" style={{
            display: "flex",
            flexFlow: "row",
            width: "100%",  
            padding: "3%",
            border: "transparent",
            justifyContent: "center",
        }}>
            {roomChangeCategory !== {paint: [], electricity: [], plumbery: [], housekeeping: [], others: []}  ? <Chart type="doughnut" data={roomChangeData} options={lightOptions} style={{ width: '100%' }} /> : <div style={{
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
}

export default RoomChangeDoughtnut;
