import React, { useState, useEffect } from 'react';
import { Modal, Table, Tabs, Tab } from 'react-bootstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useTranslation } from "react-i18next"
import { StaticImage } from 'gatsby-plugin-image'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import moment from 'moment'
import 'moment/locale/fr';
import { fetchCollectionBySorting3, fetchCollectionByCombo2 } from '../../helper/globalCommonFunctions'
import ModalHeaderFormTemplate from '../../helper/common/modalHeaderFormTemplate';
import '../css/section/timeLine.css'

const GuestTimeLine = ({userDB, guestId}) => {
    const [tab, setTab] = useState(false)
    const [timelineData, setTimelineData] = useState([])
    const [housekeepingFilter, setHousekeepingFilter] = useState(null)
    const [housekeeping, setHousekeeping] = useState([])
    const [journey, setJourney] = useState({
        cab: [],
        clock: [],
        roomChange: [],
        maintenance: [],
        housekeeping: [],
        date: moment(new Date()).format("LL")
    })
    const { t } = useTranslation()

    const modalTitle = <h5>Séjour du {journey.date}</h5>

    const emptyJourney = {
        cab: [],
        clock: [],
        roomChange: [],
        maintenance: [],
        housekeeping: [],
        date: moment(new Date()).format("LL")
    }

    const handleCloseTab = () => setTab(false)
    
    useEffect(() => {
        let unsubscribe = fetchCollectionByCombo2("guestUsers", guestId, "journey", "hotelId", "==", userDB.hotelId, "markup", "desc").onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            setTimelineData(snapInfo)
        });
        return unsubscribe
    },[guestId])

    useEffect(() => {
        if(housekeepingFilter !== null){
            const handleGetHousekeepingData = () => {
                return fetchCollectionBySorting3("guestUsers", guestId, "journey", housekeepingFilter, "housekeeping", "markup", "desc")
            }

        let unsubscribe = handleGetHousekeepingData().onSnapshot(function(snapshot) {
            const snapInfo = []
            snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
                })        
            });
            setHousekeeping(snapInfo)
        });
        return unsubscribe
    }
       },[guestId, housekeepingFilter])

    return (
        <div className="timeline-demo" style={{
            padding: window?.innerWidth > 1439 && "2vw"
        }}>
            <h5 style={{
                textAlign: "center", 
                marginBottom: "2vh",
                backgroundColor: window?.innerWidth < 1440 && "#B8860B",
                padding: window?.innerWidth < 1440 && "2%",
                borderTopLeftRadius: "5px", borderTopRightRadius: "5px"}}>{t("msh_crm.c_guest_line.g_title")}</h5>
                <Timeline position="alternate">
                    <PerfectScrollbar style={{height: "65vh"}}>
                    {timelineData.map(data => (
                            <TimelineItem>
                            <TimelineOppositeContent color="text.secondary">
                                {data.date}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                            <div style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                    marginBottom: "1vh",
                                    cursor: "pointer",
                                    border: "1px solid lightgrey",
                                    borderBottom: "2px solid lightgrey",
                                    borderRight: "2px solid lightgrey",
                                    filter: "drop-shadow(2px 4px 6px)",
                                    height: window?.innerWidth > 1439 && "15vh",
                                    padding: window?.innerWidth > 1439 ? "1vw" : "10%",
                                    backgroundColor: "white",
                                    borderRadius: "5px"}}
                                    onClick={() => {
                                        setJourney(data)
                                        setTab(true)
                                        setHousekeepingFilter(data.id)
                                    }}> 
                                    <h6 style={{fontSize: "0.6rem", color: "black", marginTop: "-1vh"}}>{t("msh_crm.c_guest_line.g_services")}</h6>
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around"}}>
                                        <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/timer.svg' style={{width: "15%", filter: data.clock.length > 0 ? "invert(0%)" : "invert(90%)"}} />
                                        <StaticImage objectFit='contain' placeholder='blurred' src="../../svg/taxi.svg" style={{width: "15%", filter: data.cab.length > 0 ? "invert(0%)" : "invert(90%)"}} />
                                        {/*<StaticImage objectFit='contain' placeholder='blurred' src='../../svg/maid.svg' style={{width: "15%", filter: data.housekeeping.length > 0 ? "invert(0%)" : "invert(90%)"}} />*/}
                                    </div>
                                    <h6 style={{fontSize: "0.6rem", color: "black", borderTop: "1px solid lightgrey", paddingTop: "1vh", marginTop: "1vh"}}>{t("msh_crm.c_guest_line.g_event")}</h6>
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row",
                                        justifyContent: "space-around"}}>
                                        <StaticImage objectFit='contain' placeholder='blurred' src="../../svg/logout.svg" style={{width: "15%", filter: data.roomChange.length > 0 ? "invert(0%)" : "invert(90%)"}} />
                                        <StaticImage objectFit='contain' placeholder='blurred' src='../../svg/repair.svg' style={{width: "15%", filter: data.maintenance.length > 0 ? "invert(0%)" : "invert(90%)"}} />
                                    </div>
                                </div>
                            </TimelineContent>
                            </TimelineItem>
                        ))}
                    </PerfectScrollbar>  
                </Timeline>

                <Modal show={tab}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => {
                    handleCloseTab(false)
                    setJourney(emptyJourney)
                    setHousekeepingFilter(null)
                }}
                >
                <ModalHeaderFormTemplate title={modalTitle} />
                <Modal.Body>
                
                <div style={{width: "100%", padding: "2%"}}>
                <Tabs defaultActiveKey="cab" id="uncontrolled-tab-example">
                    <Tab eventKey="cab" title="Taxi">
                        <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>{t("msh_general.g_table.t_time")}</th>
                                    <th>{t("msh_general.g_table.t_passenger")}</th>
                                    <th>{t("msh_general.g_table.t_type_of_car")}</th>
                                    <th>{t("msh_general.g_table.t_destination")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {journey && journey.cab.map(flow =>(
                                        <tr key={flow.id}>
                                        <td>{flow.hour}</td>
                                        <td>{flow.pax}</td>
                                        <td>{flow.carType}</td>
                                        <td>{flow.destination}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </PerfectScrollbar>
                    </Tab>
                    <Tab eventKey="alarm" title="Réveil">
                    <PerfectScrollbar style={{height: "55vh"}}>
                        <Table striped bordered hover size="sm" className="text-center">
                            <thead className="bg-dark text-center text-light">
                                <tr>
                                    <th>{t("msh_general.g_table.t_date")}</th>
                                    <th>{t("msh_general.g_table.t_time")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {journey && journey.clock.map(flow =>(
                                    <tr key={flow.id}>
                                        <td>{moment(flow.markup).format('L')}</td>
                                        <td>{flow.hour}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </PerfectScrollbar>
                    </Tab>
                    {/* <Tab eventKey="housekeeping" title="Conciergerie">
                        <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                        <th>Eléments</th>
                                    </tr>
                            </thead>
                                <tbody>
                                    {flow.housekeeping.length > 0 && flow.housekeeping.map(flow =>(
                                        <>
                                            {flow.towel && <tr>
                                                <td>Serviette</td>
                                                <td>{flow.towel.length}</td>
                                            </tr>}
                                            {flow.soap && <tr>
                                                <td>Savon</td>
                                                <td>{flow.soap.length}</td>
                                            </tr>}
                                            {flow.iron && <tr>
                                                <td>Fer à repasser</td>
                                                <td>{flow.iron.length}</td>
                                            </tr>}
                                            {flow.hairDryer && <tr>
                                                <td>Sèche-cheveux</td>
                                                <td>{flow.hairDryer.length}</td>
                                            </tr>}
                                            {flow.pillow && <tr>
                                                <td>Coussin</td>
                                                <td>{flow.pillow.length}</td>
                                            </tr>}
                                            {flow.blanket && <tr>
                                                <td>Couverture</td>
                                                <td>{flow.blanket.length}</td>
                                            </tr>}
                                            {flow.toiletPaper && <tr>
                                                <td>Papier toilette</td>
                                                <td>{flow.toiletPaper.length}</td>
                                            </tr>}
                                            {flow.babyBed && <tr>
                                                <td>Lit bébé</td>
                                                <td>{flow.babyBed.length}</td>
                                            </tr>}
                                        </>
                                    ))}
                                </tbody>
                            </Table>
                        </PerfectScrollbar>
                                            </Tab> */}
                    <Tab eventKey="roomChange" title="Délogement">
                        <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover size="sm" className="text-center"  style={{overflowX: "auto",
                                    maxWidth: "90vw"}}>
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                    <th>{t("msh_general.g_table.t_reason")}</th>
                                    <th>{t("msh_general.g_table.t_details")}</th>
                                    <td>{t("msh_general.g_table.t_date")}</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {journey && journey.roomChange.map(flow =>(
                                        <tr key={flow.id}>
                                            <td>{flow.reason}</td>
                                            <td>{flow.details}</td>
                                            <td>{moment(flow.markup).format('L')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </PerfectScrollbar>
                    </Tab>
                    <Tab eventKey="Maintenance" title="Maintenance">
                        <PerfectScrollbar style={{height: "55vh"}}>
                            <Table striped bordered hover size="sm" className="text-center">
                                <thead className="bg-dark text-center text-light">
                                    <tr>
                                        <th>{t("msh_general.g_table.t_room")}</th>
                                        <th>{t("msh_general.g_table.t_category")}</th>
                                        <th>{t("msh_general.g_table.t_details")}</th>
                                        <th>{t("msh_general.g_table.t_date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {journey && journey.maintenance.map(flow =>(
                                        <tr key={flow.id}>
                                            <td>{flow.type}</td>
                                            <td>{flow.details}</td>
                                            <td>{moment(flow.markup).format('L')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </PerfectScrollbar>
                    </Tab>
                </Tabs>
                    
                </div>

                </Modal.Body>
            </Modal>
        </div>
    );

}

export default GuestTimeLine