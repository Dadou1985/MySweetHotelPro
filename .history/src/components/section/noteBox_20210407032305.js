import React, {useState, useEffect, useContext } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
  } from 'react-accessible-accordion'
import moment from 'moment'
import Avatar from 'react-avatar'
import Checkbox from '@material-ui/core/Checkbox';
import { FirebaseContext, db, auth } from '../../Firebase'


const NoteBox = () => {

    const [messages, setMessages] = useState([])
    const [dayDate, setDayDate] = useState(new Date())
    const [expanded, setExpanded] = useState(null)
    const [user, setUser] = useState(auth.currentUser)

    const {userDB} = useContext(FirebaseContext)

    Date.prototype.standard = function() {
        let day = this.getDate() - 1
        let month = this.getMonth() + 1
        let year = this.getFullYear()

        let date = year + "-" + month + "-" + day
        return date
    };

    let dateString = dayDate.standard()
    let nextDay = Date.parse(dayDate) + 123274000
    console.log(nextDay)

    Date.prototype.yyyymmdd = function() {
        let day = this.getDate()
        let month = this.getMonth()
        let calendar = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
        let year = this.getFullYear()
  
        let date = day + " " + calendar[month] + " " + year
        return date
    };


    useEffect(() => {
      const noteOnAir = () => {
        return db.collection('mySweetHotel')
          .doc('country')
          .collection('France')
          .doc('collection')
          .collection('hotel')
          .doc('region')
          .collection(userDB.hotelRegion)
          .doc('departement')
          .collection(userDB.hotelDept)
          .doc(`${userDB.hotelId}`)
          .collection('note')
          .where("markup", "<", nextDay)
          .orderBy("markup", "desc")
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
                    setMessages(snapMessages)
                });
                return unsubscribe
           
     },[])

    return (
        <Accordion allowZeroExpanded className="accordion">
                {messages.map((flow, index) => {
                  return moment(flow.date).format('L') === moment(new Date()).format('L') ? 
                  <AccordionItem key={flow.id} onClick={() => setExpanded(index)} className="user_Message bg-light">
                    <AccordionItemHeading style={{
                      padding: "2%",
                      backgroundColor: flow.status,
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px"
                      }}>
                        <AccordionItemButton style={{
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            outline: "none"}}>
                         <div>
                         <Avatar 
                            round={true}
                            name={flow.author}
                            size="30"
                            color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
                            style={{marginRight: "1vw"}} />
                            <b>{flow.id}</b>
                         </div>
                          <div style={{
                            display:"flex",
                            flexflow: "row",
                            alignItems: "center"
                          }}>
                          <Checkbox
                            color="primary"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                            <i style={{color: "black", float: "right", fontSize: "13px"}}>{moment(flow.markup).format('ll')}</i>
                          </div>
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel style={{
                        display: "flex",
                        flexFlow: "column",
                        backgroundColor: 'white',
                        padding: "2%",
                        width: "100%"}}>
                      {flow.img &&
                        <span>
                            <img src={flow.img} style={{width: "100%", backgroundSize: "cover", marginBottom: "1vh"}} />
                        </span>}
                      {flow.text}
                    <div><i style={{color: "gray", float: "right", fontWeight: "bolder"}}> noté à {moment(flow.hour).format('LT')}</i></div>
                    </AccordionItemPanel>
                  </AccordionItem> 
                  :
                  <AccordionItem key={flow.id} onClick={() => setExpanded(index)} className="user_Message">
                    <AccordionItemHeading style={{
                      padding: "2%",
                      filter: "grayscale(100%)",
                      borderBottom: "1px solid lightgrey"
                      }}>
                        <AccordionItemButton style={{
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            outline: "none"}}>
                         <div>
                         <Avatar 
                            round={true}
                            name={flow.author}
                            size="30"
                            color={'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
                            style={{marginRight: "1vw"}} />
                            <b>{flow.id}</b>
                         </div>
                         <div style={{
                            display:"flex",
                            flexflow: "row",
                            alignItems: "center"
                          }}>
                          <Checkbox
                            color="green"
                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                          />
                            <i style={{color: "black", float: "right", fontSize: "13px"}}>{moment(flow.markup).format('ll')}</i>
                          </div>                        
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel style={{
                        display: "flex",
                        flexFlow: "column",
                        padding: "2%",
                        width: "100%"}}>
                          {flow.img &&
                        <span>
                            <img src={flow.img} style={{width: "100%", backgroundSize: "cover", marginBottom: "1vh"}} />
                        </span>}
                      {flow.text}
                      <div><i style={{color: "gray", float: "right", fontWeight: "bolder"}}> noté à {moment(flow.hour).format('LT')}</i></div>
                    </AccordionItemPanel>
                  </AccordionItem> 
                })}
              </Accordion>
    )
}

export default NoteBox