import React, { useState, useRef, useEffect } from 'react';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Modal, Table, Tabs, Tab } from 'react-bootstrap'
import Divider from '@material-ui/core/Divider';
import { useTranslation } from "react-i18next"
import Housekeeping from '../../svg/maid.svg'
import RoomChange from "../../svg/logout.svg"
import Cab from "../../svg/taxi.svg"
import Maintenance from '../../svg/repair.svg'
import Alarm from '../../svg/timer.svg'
import HotelIcon from '../../svg/hotel.svg'
import { db, functions, specialFirestoreOptions } from '../../Firebase'

const GuestTimeLine = ({user, userDB, guestId}) => {
    const [tab, setTab] = useState(false)
    const [data, setData] = useState([])
    const { t, i18n } = useTranslation()

    const handleCloseTab = () => setTab(false)
    const handleShowTab = () => setTab(true)
    
    useEffect(() => {
        const guestOnAir = () => {
          return db.collection('guestUsers')
          .doc(guestId)
          .collection("journey")
          .orderBy("markup", "desc")
          }
  
        let unsubscribe = guestOnAir().onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setData(snapInfo)
        });
        return unsubscribe
       },[guestId])

    const customizedMarker = (item) => {
        return (
            <span className="custom-marker p-shadow-2" style={{ backgroundColor: item.color }}>
                <img src={HotelIcon} style={{width:"2vw"}} />
            </span>
        );
    };

    const customizedContent = (item) => {
        return (
            <Card style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
                justifyContent: "space-around",
                marginBottom: "1vh",
                cursor: "pointer",
                border: "1px solid lightgrey",
                borderBottom: "2px solid lightgrey",
                borderRight: "2px solid lightgrey",
                filter: "drop-shadow(2px 4px 6px)"}} 
                subTitle={item.date}>
                <h6 style={{fontSize: "0.6rem", color: "gray", borderTop: "1px solid lightgrey", paddingTop: "1vh", marginTop: "-1vh"}}>Services</h6>
                <div style={{
                    display: "flex",
                    flexFlow: "row",
                    justifyContent: "space-around"}}>
                    <img src={Alarm} style={{width: "15%", filter: item.clock ? "invert(0%)" : "invert(90%)"}} />
                    <img src={Cab} style={{width: "15%", filter: item.cab ? "invert(0%)" : "invert(90%)"}} />
                    <img src={Housekeeping} style={{width: "15%", filter: item ? "invert(0%)" : "invert(90%)"}} />
                </div>
                <h6 style={{fontSize: "0.6rem", color: "gray", borderTop: "1px solid lightgrey", paddingTop: "1vh", marginTop: "1vh"}}>Evènements</h6>
                <div style={{
                    display: "flex",
                    flexFlow: "row",
                    justifyContent: "space-around"}}>
                    <img src={RoomChange} style={{width: "15%", filter: item.roomChange ? "invert(0%)" : "invert(90%)"}} />
                    <img src={Maintenance} style={{width: "15%", filter: item.maintenance ? "invert(0%)" : "invert(90%)"}} />
                </div>
            </Card>
        );
    };

    return (
        <div className="timeline-demo" style={{
            padding: "2vw",
            width: "25%"
        }}>
            <h5 style={{textAlign: "center", marginBottom: "2vh"}}>Liste des séjours</h5>
            <ScrollPanel style={{height: "65vh"}}>
                <Timeline value={data} align="alternate" marker={customizedMarker} content={customizedContent} style={{width: "100%"}} />        
            </ScrollPanel>  

            <Modal show={tab}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleCloseTab}
                >
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title id="contained-modal-title-vcenter">
                    Séjour du 
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                
                <Tabs defaultActiveKey="Créer" id="uncontrolled-tab-example" style={{display: "flex", flexFlow: "row", justifyContent: "space-around"}} variant="dark">
                        <Tab eventKey="Créer" title="Conciergerie">
                            <div style={{
                                display: "flex",
                                flexFlow: "column",
                                alignItems: "center"
                            }}>
                                <h3 style={{textAlign: "center"}}>Conciergerie</h3>
                                <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                            </div>  
                        </Tab>
                        <Tab eventKey="Supprimer" title="Réveil">
                        <div style={{
                                display: "flex",
                                flexFlow: "column",
                                alignItems: "center"
                            }}>
                                <h3 style={{textAlign: "center"}}>Réveil</h3>
                                <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                            </div>
                        </Tab>
                        <Tab eventKey="Supprimer" title="Taxi">
                        <div style={{
                                display: "flex",
                                flexFlow: "column",
                                alignItems: "center"
                            }}>
                                <h3 style={{textAlign: "center"}}>Taxi</h3>
                                <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                            </div>
                        </Tab>
                        <Tab eventKey="Supprimer" title="Délogement">
                        <div style={{
                                display: "flex",
                                flexFlow: "column",
                                alignItems: "center"
                            }}>
                                <h3 style={{textAlign: "center"}}>Délogement</h3>
                                <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                            </div>
                        </Tab>
                        <Tab eventKey="Supprimer" title='Incident technique'>
                        <div style={{
                                display: "flex",
                                flexFlow: "column",
                                alignItems: "center"
                            }}>
                                <h3 style={{textAlign: "center"}}>Incident technique</h3>
                                <Divider style={{width: "90%", marginBottom: "2vh", filter: "drop-shadow(1px 1px 1px)"}} />
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>          
        </div>
    );

}

export default GuestTimeLine