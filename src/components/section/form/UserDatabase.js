import React, {useState, useEffect } from 'react'
import { Modal, OverlayTrigger, Tooltip, Nav, Row, Col, Tab, Card, Button, Form } from 'react-bootstrap'
import Database from '../../../svg/database.png'
import { db, functions } from '../../../Firebase'
import defaultImg from "../../../images/avatar-client.png"
import PerfectScrollbar from 'react-perfect-scrollbar'
import moment from 'moment'
import 'moment/locale/fr';
import FrenchFlag from '../../../images/france.png'
import GermanFlag from '../../../images/allemagne.png'
import ItalianFlag from '../../../images/italie.png'
import SpanishFlag from '../../../images/espagne.png'
import PortugueseFlag from '../../../images/le-portugal.png'
import EnglishFlag from '../../../images/royaume-uni.png'
import Mail from '../../../images/email.png'
import Room from '../../../images/room2.png'
import Phone from '../../../images/phone.png'
import Birthday from '../../../images/calendar.png'
import SendMail from '../../../images/mail.png'
import Category from '../../../images/categories.png'
import CheckoutDate from '../../../images/checkout.png'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles';
import Loader from "react-loader-spinner"
import '../../css/loader.css'


const UserDatabase = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [Info, setInfo] = useState([])
    const [selectedUser, setselectedUser] = useState(null)
    const [sendingMail, setSendingMail] = useState(false)
    const [guestMail, setguestMail] = useState([])
    const [IsLoading, setIsLoading] = useState(false)

    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const handleChangeCheckbox = (email) => {
        return guestMail.push(email)
    }

    useEffect(() => {
        const guestOnAir = () => {
          return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection("chat")
          .orderBy("title", "asc")
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
            setInfo(snapInfo)
        });
        return unsubscribe
       },[])

    const sendCheckinMail = functions.httpsCallable('sendCheckinMail')

    const handleMailSent = () => {
        setIsLoading(true)
        return sendCheckinMail({hotelName: userDB.hotelName, emails: guestMail, logo: userDB.logo, appLink: userDB.appLink})
    }

    const handleMailSended = () => {
        setSendingMail(false)
        setIsLoading(false)
        setguestMail([])
        return addNotification("Les e-mails ont bien été envoyés !")
    }

    const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);
      
      const addNotification = (notification) => {
        return db.collection('notifications')
            .add({
            content: notification,
            hotelId: userDB.hotelId,
            markup: Date.now()})
            .then(doc => console.log('nouvelle notitfication'))
    }
    
    const renderSwitchFlag = (country) => {
        switch(country) {
            case 'fr':
                return <img src={FrenchFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
            case 'en':
                return <img src={EnglishFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
            case 'es':
                return <img src={SpanishFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
            case 'de':
                return <img src={GermanFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
            case 'it':
                return <img src={ItalianFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
            case 'pt':
                return <img src={PortugueseFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
            default:
                return <img src={FrenchFlag} 
                style={{width: "7%", height: "7%", marginLeft: "1vw"}} />
        }
    }

    console.log("++++++++++", guestMail)

    return(
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center"
        }}>
        <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip id="title">
                Base de données clients
              </Tooltip>
            }>
                <img src={Database} className="icon" alt="todolist" onClick={handleShow} style={{width: "45%"}} />
        </OverlayTrigger>

            <Modal
                show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => {
                    handleClose()
                    setSendingMail(false)
                    setselectedUser(null)}}
                    style={{height: "90vh"}}>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                Base de données clients
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tab.Container>
                    <Row>
                    <Col sm={3} style={{borderRight: "1px solid lightgrey"}}>
                    <PerfectScrollbar style={{height: "65vh"}}>
                    {Info.map(flow => (
                    <Nav variant="pills" className="flex-column" style={{borderBottom: "1px solid lightgrey"}}>
                        <Nav.Item>
                            <Nav.Link eventKey={flow.title} onClick={() => setselectedUser(flow)} style={{
                                color: "black", 
                                fontWeight: "bolder",}}>
                                    {flow.checkoutDate ? <StyledBadge badgeContent="" color="primary">
                                        <div style={{width: "11vw"}}>{flow.title}</div>
                                    </StyledBadge> : 
                                        <div style={{width: "11vw"}}>{flow.title}</div>}
                                    </Nav.Link>
                            {sendingMail && <Form.Group controlId="formBasicCheckbox" style={{display: "flex", marginTop: "1vh"}}>
                                <Form.Check type="checkbox" onChange={() => handleChangeCheckbox(flow.email)} /> Envoyer le mail
                            </Form.Group>} 
                        </Nav.Item>
                    </Nav>
                    ))}
                    </PerfectScrollbar>
                    </Col>
                    {!sendingMail ? 
                    <Col sm={9}>
                    {selectedUser ? <PerfectScrollbar style={{height: "65vh"}}>
                    <Tab.Content>
                        <Tab.Pane eventKey={selectedUser.title} style={{
                            display: "flex",
                            flexFlow: "column",
                            alignItems: "center"
                        }}>
                            <Card style={{ width: '45%', borderRadius: "5%", filter: "drop-shadow(2px 2px 2px)" }}>
                                <Card.Img variant="top" src={selectedUser.photo ? selectedUser.photo : defaultImg} />
                                <Card.Body style={{
                                    display: "flex",
                                    flexFlow: "column",
                                    alignItems: "center"
                                    }}>
                                    <Card.Title style={{
                                        fontWeight: "bolder", 
                                        fontSize: "1.5em", 
                                        borderBottom: "1px solid black", 
                                        width: "100%", 
                                        textAlign: "center", 
                                        paddingBottom: "1vh"}}>{selectedUser.title}{renderSwitchFlag(selectedUser.guestLanguage)}</Card.Title>
                                    <Card.Text style={{paddingLeft: "1vw"}}>
                                        <img src={Mail} style={{width: "5%", marginRight: "1vw"}} />
                                    {selectedUser.email}
                                    </Card.Text>
                                    <Card.Text style={{paddingLeft: "1vw"}}>
                                        <img src={Category} style={{width: "5%", marginRight: "1vw"}} />
                                    {selectedUser.category}
                                    </Card.Text>
                                    {selectedUser.room ? <Card.Text style={{paddingLeft: "1vw"}}>
                                    <img src={Room} style={{width: "5%", marginRight: "1vw"}} />
                                    {selectedUser.room}
                                    </Card.Text> : <></>}
                                    {selectedUser.checkoutDate ? <Card.Text style={{paddingLeft: "1vw"}}>
                                    <img src={CheckoutDate} style={{width: "5%", marginRight: "1vw"}} />
                                    {selectedUser.checkoutDate}
                                    </Card.Text> : <></>}
                                    {selectedUser.phone ? <Card.Text style={{paddingLeft: "1vw"}}>
                                    <img src={Phone} style={{width: "5%", marginRight: "1vw"}} />
                                    {selectedUser.phone}
                                    </Card.Text> : <></>}
                                    <Card.Text style={{paddingLeft: "1vw"}}>
                                    <img src={Birthday} style={{width: "5%", marginRight: "1vw"}} />
                                    {moment(selectedUser.firstTimeConnected).format('LL')}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Tab.Pane>
                    </Tab.Content>
                    </PerfectScrollbar> :
                    <div style={{
                            display: "flex",
                            flexFlow: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            width: '100%',
                            height: "65vh"
                        }}>
                            <img src={Database} style={{width: "30%", marginBottom: "5vh"}} />
                            <h2>Base de données des clients</h2>
                            <p>Cliquez sur le nom d'un client pour afficher son profil</p>
                        </div>}
                    </Col> : 
                    <Col sm={9}>
                        <div style={{
                                display: "flex",
                                flexFlow: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: '100%',
                                height: "65vh"
                            }}>
                                <img src={SendMail} style={{width: "30%", marginBottom: "5vh"}} />
                                <h2>Envoyer un mail de bienvenue</h2>
                                <p>Sélectionnez les clients que vous voulez cibler</p>
                            </div>
                    </Col>}
                </Row>
            </Tab.Container>
            </Modal.Body>
            <Modal.Footer>
                {sendingMail ? 
                IsLoading ? <Loader type="Puff" color="#000" height={15} width={15} timeout={10000} /> : <span>
                <Button variant="outline-danger" style={{marginRight: "1vw"}} onClick={() => setSendingMail(false)}>Annuler</Button>
                <Button variant="success" onClick={async() => {
                await handleMailSent()
                return handleMailSended()
                }}>Envoyer</Button>
            </span>
                 : <Button variant="outline-info" onClick={() => setSendingMail(true)}>Envoyer un e-mail de bienvenue</Button>}
            </Modal.Footer>
            </Modal>
    </div>
    )
}

export default UserDatabase