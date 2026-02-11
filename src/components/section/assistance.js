import React, {useState, useEffect, useContext } from 'react'
import { Form, Input, FormGroup } from 'reactstrap'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import SupportRoom from './supportRoom'
import { Button, DropdownButton, Dropdown } from 'react-bootstrap'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import moment from 'moment'
import 'moment/locale/fr';
import Drawer from '@material-ui/core/Drawer'
import Switch from '@material-ui/core/Switch';
import { useTranslation } from "react-i18next"
import '../css/section/chat.css'
import '../css/section/accordion.css'
import { handleChange } from '../../helper/formCommonFunctions'
import { 
  handleUpdateData1, 
  fetchCollectionBySorting1, 
  handleSubmitData2, 
  addNotification 
} from '../../helper/globalCommonFunctions'
import { FirebaseContext } from '../../Firebase'

export default function Assistance() {
  const { user, userDB } = useContext(FirebaseContext)
    
  const [info, setInfo] = useState([])
  const [note, setNote] = useState('')
  const [expanded, setExpanded] = useState('')
  const [activate, setActivate] = useState(false)
  const [initialFilter, setInitialFilter] = useState('')
  const { t, i18n } = useTranslation()

  const handleHideDrawer = () => {
    setActivate(false)
    setNote('')
    setInitialFilter('')
  }

  const notif = `Votre message a bien été envoyé à l'hôtel ${expanded}`

  const newData = {
    author: userDB.username,
    text: note,
    date: new Date(),
    userId: user.uid,
    markup: Date.now(),
    photo: user.photoURL
  }

  const newRoomData = {
    status: false,
    markup: Date.now()
  }

  const handleChangeExpanded = (title) => setExpanded(title)
  
  useEffect(() => {
    let unsubscribe = fetchCollectionBySorting1("assistance", "markup", "desc").onSnapshot(function(snapshot) {
        const snapInfo = []
      snapshot.forEach(function(doc) {          
        snapInfo.push({
            id: doc.id,
            ...doc.data()
          })        
        });
        setInfo(snapInfo)
    });
    return unsubscribe
    },[])

    return (
        <div className="communizi-container">
          
            <PerfectScrollbar className='chat-perfectscrollbar'>
            <div className="communizi_notebox">
            <Accordion allowZeroExpanded>
                {info.map((flow) => (
                  flow.status &&
                  <AccordionItem key={flow.id} onClick={() => handleChangeExpanded(flow.id)}>
                    <AccordionItemHeading style={{
                      backgroundColor: flow.pricingModel === "Premium" ? "darkgoldenrod" : "lightblue", 
                      padding: "2%",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px",
                      marginTop: "1vh"
                      }}>
                        <AccordionItemButton style={{outline: "none", color: "black", display: "flex", justifyContent: "space-between"}}>
                          <div style={{display: "flex", alignItems: "center", width: "50%"}}>{flow.id}</div>
                            <div style={{display: "flex", alignItems: "center"}}>
                              <Switch
                                checked={flow.status}
                                onChange={() => handleUpdateData1("assistance", flow.id, newRoomData)}
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                              />
                              <i style={{color: "gray", float: "right", fontSize: "13px"}}>{moment(flow.markup).format('ll')}</i>
                            </div>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel style={{marginBottom: "1vh"}}>
                      {user&& userDB&& 
                      <SupportRoom title={flow.id} />}
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            </PerfectScrollbar>
            <div className={typeof window !== `undefined` && window.innerWidth < 768 && "communizi_form_input_div"}>
                <Form inline className="communizi_form">
                <FormGroup  className="communizi_form_input_container"> 
                    <Input type="text" placeholder="Répondre au client..."  
                    value={note}
                    onChange={(event) => handleChange(event, setNote)}
                    id="dark_message_note" />
                </FormGroup>
                    <div className="communizi-button-container">
                        <img src='../../images/paper-plane.png' alt="sendIcon" className="communizi-send-button" onClick={(event) => {
                          handleSubmitData2(event, "assistance", `${expanded}`, "chatRoom", newData)
                          addNotification(notif, userDB.hotelId)
                          return handleHideDrawer()
                        }} />          
                      </div>
                </Form>
            </div>

            <Drawer anchor="bottom" open={activate} onClose={handleHideDrawer}>
              <div id="drawer-container" style={{
                  display: "flex",
                  flexFlow: "column", 
                  justifyContent: "flex-end",
                  padding: "5%", 
                  maxHeight: "100vh"}}>
                  <h4 style={{textAlign: "center", marginBottom: "2vh"}}>Contacter un hôtel</h4>
                    <DropdownButton id="dropdown-basic-button" title={expanded} drop="bottom" variant="outline-dark">
                    {info.map(hotel => (
                        <Dropdown.Item 
                        onClick={() => {
                        setExpanded(hotel.id)
                        setInitialFilter(hotel.id)}}>{hotel.id}</Dropdown.Item>
                    ))}
                    </DropdownButton>
                    <Input 
                      type="text" 
                      placeholder="Ecrire un message..." 
                      value={note} 
                      style={{
                        borderTop: "none", 
                        borderLeft: "none", 
                        borderRight: "none", 
                        marginTop: "2vh"}} 
                      maxLength="60" 
                      onChange={(event) => handleChange(event, setNote)} />
              </div>
              <Button variant="success" size="lg" onClick={(event) => {
                handleSubmitData2(event, "assistance", `${expanded}`, "chatRoom", newData)
                addNotification(notif, userDB.hotelId)
                return handleHideDrawer()
                    }}>Envoyer</Button>
            </Drawer>
        </div>
    )
}
