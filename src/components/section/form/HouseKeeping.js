import React, {useState, useEffect } from 'react'
import { Modal, OverlayTrigger, Tooltip, Nav, Row, Col, Tab } from 'react-bootstrap'
import ItemList from '../itemList'
import Maid from '../../../svg/maid.svg'
import { db, auth } from '../../../Firebase'
import Badge from '@material-ui/core/Badge'
import StyleBadge from '../common/badgeMaker'
import { withStyles } from '@material-ui/core/styles';


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
                    Click & Wait
                </Tooltip>
                }>
                        <img src={Maid} alt="todolist" onClick={handleShow} style={{width: "4vw"}} />
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
                Click & Wait
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            style={{overflow: "auto"}}>
                <Tab.Container defaultActiveKey="Serviette">
                <Row>
                    <Col sm={3}>
                    <Nav variant="pills" className="flex-column">
                        <Nav.Item>
                            <StyleBadge item="towel">
                                <Nav.Link eventKey="Serviette">Serviette</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="soap">
                                <Nav.Link eventKey="Savon">Savon</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="toiletPaper">
                                <Nav.Link eventKey="Papier Toilette">Papier Toilette</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="hairDryer">
                                <Nav.Link eventKey="Sèche-cheveux">Sèche-cheveux</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                        <StyleBadge item="pillow">
                            <Nav.Link eventKey="Coussin">Coussin</Nav.Link>
                        </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="blanket">
                                <Nav.Link eventKey="Couverture">Couverture</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="iron">
                                <Nav.Link eventKey="Fer à repasser">Fer à repasser</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                        <Nav.Item>
                            <StyleBadge item="babyBed">
                                <Nav.Link eventKey="Lit Bébé">Lit Bébé</Nav.Link>
                            </StyleBadge>
                        </Nav.Item>
                    </Nav>
                    </Col>
                    <Col sm={9}>
                    <Tab.Content>
                        <Tab.Pane eventKey="Serviette">
                            <ItemList item="towel" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Savon"> 
                            <ItemList item="soap" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Papier Toilette"> 
                            <ItemList item="toiletPaper" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Sèche-cheveux">
 
                            <ItemList item="hairDryer" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Coussin"> 
                            <ItemList item="pillow" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Couverture"> 
                            <ItemList item="blanket" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Fer à repasser">
                            <ItemList item="iron" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Lit Bébé"> 
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