import React, {useState, useEffect } from 'react'
import { Modal, OverlayTrigger, Tooltip, Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../itemList'
import Maid from '../../../svg/maid.svg'
import { db, auth } from '../../../Firebase'
import Badge from '@material-ui/core/Badge'
import StyleBadge from '../common/badgeMaker'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next"


const HouseKeeping = ({userDB}) =>{

    const [list, setList] = useState(false)
    const [user, setUser] = useState(auth.currentUser)
    const [towel, setTowel] = useState([])
    const [soap, setSoap] = useState([])
    const [toiletPaper, setToiletPaper] = useState([])
    const [hairDryer, setHairDryer] = useState([])
    const [blanket, setBlanket] = useState([])
    const [pillow, setPillow] = useState([])
    const [iron, setIron] = useState([])
    const [babyBed, setBabyBed] = useState([])
    const { t, i18n } = useTranslation()

    
    const handleClose = () => setList(false)
    const handleShow = () => setList(true)

    const itemList = (item) => {
        return db.collection('hotels')
        .doc(userDB.hotelId)
        .collection('housekeeping')
        .doc("item")
        .collection(item)
        .orderBy("markup", "asc")
    }

    useEffect(() => {
        
        let unsubscribe = itemList('towel').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setTowel(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('soap').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setSoap(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('toiletPaper').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setToiletPaper(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('hairDryer').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setHairDryer(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('pillow').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setPillow(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('blanket').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setBlanket(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('iron').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setIron(snapInfo)
        });
        return unsubscribe
    }, [])

    useEffect(() => {
        
        let unsubscribe = itemList('babyBed').onSnapshot(function(snapshot) {
            const snapInfo = []
          snapshot.forEach(function(doc) {          
            snapInfo.push({
                id: doc.id,
                ...doc.data()
              })        
            });
            console.log(snapInfo)
            setBabyBed(snapInfo)
        });
        return unsubscribe
    }, [])

    let itemQty = [towel.length, soap.length, toiletPaper.length, hairDryer.length, pillow.length, blanket.length, iron.length, babyBed.length]
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let itemBadgeQty = itemQty.reduce(reducer)

    const StyledBadge = withStyles((theme) => ({
        badge: {
          right: -3,
          top: 13,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      }))(Badge);

    console.log("+++++", itemBadgeQty)

    return(
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "center"
        }}>
        <StyledBadge badgeContent={itemBadgeQty} color="secondary">
            <OverlayTrigger
                placement="right"
                overlay={
                <Tooltip id="title">
                    {t("msh_housekeeping.h_title")}                
                </Tooltip>
                }>
                        <img src={Maid} alt="todolist" className="icon" onClick={handleShow} style={{width: "2vw"}} />
            </OverlayTrigger>
        </StyledBadge>

            <Modal
                show={list}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={handleClose}>
            <Modal.Header closeButton className="bg-light">
                <Modal.Title id="contained-modal-title-vcenter">
                {t("msh_housekeeping.h_title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            style={{overflow: "auto"}}>
                <Tab.Container defaultActiveKey={t("msh_housekeeping.h_towel")}>
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <StyleBadge item="towel">
                                <Nav.Link eventKey={t("msh_housekeeping.h_towel")}>{t("msh_housekeeping.h_towel")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="soap">
                                <Nav.Link eventKey={t("msh_housekeeping.h_soap")}>{t("msh_housekeeping.h_soap")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="toiletPaper">
                                <Nav.Link eventKey={t("msh_housekeeping.h_toilet_paper")}>{t("msh_housekeeping.h_toilet_paper")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="hairDryer">
                                <Nav.Link eventKey={t("msh_housekeeping.h_hair_dryer")}>{t("msh_housekeeping.h_hair_dryer")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                        <StyleBadge item="pillow">
                            <Nav.Link eventKey={t("msh_housekeeping.h_pillow")}>{t("msh_housekeeping.h_pillow")}</Nav.Link>
                        </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="blanket">
                                <Nav.Link eventKey={t("msh_housekeeping.h_blanket")}>{t("msh_housekeeping.h_blanket")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="iron">
                                <Nav.Link eventKey={t("msh_housekeeping.h_iron")}>{t("msh_housekeeping.h_iron")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="babyBed">
                                <Nav.Link eventKey={t("msh_housekeeping.h_baby_bed")}>{t("msh_housekeeping.h_baby_bed")}</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_towel")}>
                            <ItemList item="towel" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_soap")}> 
                            <ItemList item="soap" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_toilet_paper")}> 
                            <ItemList item="toiletPaper" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_hair_dryer")}>
                            <ItemList item="hairDryer" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_pillow")}> 
                            <ItemList item="pillow" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_blanket")}> 
                            <ItemList item="blanket" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_iron")}>
                            <ItemList item="iron" />
                        </Tab.Pane>
                        <Tab.Pane eventKey={t("msh_housekeeping.h_baby_bed")}> 
                            <ItemList item="babyBed" />
                        </Tab.Pane>
                    </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            </Modal.Body>
            </Modal>
    </div>
    )
}

export default HouseKeeping