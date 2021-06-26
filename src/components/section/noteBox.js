import React, {useState, useEffect, useContext } from 'react'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
  } from 'react-accessible-accordion'
import moment from 'moment'
import 'moment/locale/fr';
import Avatar from 'react-avatar'
import Checkbox from '@material-ui/core/Checkbox';
import { FirebaseContext, db, auth } from '../../Firebase'
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const NoteBox = ({filterDate}) => {

    const [messages, setMessages] = useState([])
    const [dayDate, setDayDate] = useState(new Date())
    const [expanded, setExpanded] = useState(null)

    const {userDB, user} = useContext(FirebaseContext)

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
        return db.collection('hotel')
          .doc(userDB.hotelId)
          .collection('note')
          .where("date", "==", moment(filterDate).format('LL'))
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
                    setMessages(snapMessages)
                });
                return unsubscribe
           
     },[filterDate])

    const handleChangeCheckboxStatus = (noteId, status) => {
      return db.collection('hotel')
          .doc(userDB.hotelId)
          .collection('note')
          .doc(noteId)
          .update({
            isChecked: status
          })
    }

    const GreenCheckbox = withStyles({
      root: {
        color: green[400],
        '&$checked': {
          color: green[600],
        },
      },
      checked: {},
    })((props) => <Checkbox color="default" {...props} />);

     console.log(filterDate)

    return (
        <Accordion allowZeroExpanded className="accordion-note">
                {messages.map((flow, index) => {
                  return <AccordionItem key={flow.id} onClick={() => setExpanded(index)} className="user_Message">
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
                            style={{marginRight: "2vw"}} />
                            <b>{flow.title}</b>
                         </div>
                          <div style={{
                            display:"flex",
                            flexflow: "row",
                            alignItems: "center"
                          }}>
                            <GreenCheckbox 
                              checked={flow.isChecked} 
                              onChange={(event) => handleChangeCheckboxStatus(flow.id, event.target.checked)}
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
                    <div><i style={{color: "gray", float: "right", fontWeight: "bolder"}}> noté à {moment(flow.markup).format('LT')}</i></div>
                    </AccordionItemPanel>
                  </AccordionItem> 
                })}
              </Accordion>
    )
}

export default NoteBox