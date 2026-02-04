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
import { FirebaseContext, db } from '../../Firebase'
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import '../css/section/accordion.css'

const NoteBox = ({filterDate}) => {

    const [messages, setMessages] = useState([])
    const [expanded, setExpanded] = useState(null)
    const {userDB} = useContext(FirebaseContext)

    useEffect(() => {
      const noteOnAir = () => {
        return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('note')
          .where("date", "==", moment(filterDate).format('LL'))
          .orderBy('markup', "desc")
          .limit(50)
      }

        let unsubscribe = noteOnAir().onSnapshot(function(snapshot) {
                    const snapMessages = []
                  snapshot.forEach(function(doc) {          
                      snapMessages.push({
                        id: doc.id,
                        ...doc.data()
                      })        
                    });
                    setMessages(snapMessages)
                });
                return unsubscribe
           
     },[filterDate])

    const handleChangeCheckboxStatus = (noteId, status) => {
      return db.collection('hotels')
          .doc(userDB.hotelId)
          .collection('note')
          .doc(noteId)
          .update({
            isChecked: status
          })
    }

    const GreenCheckbox = withStyles({
      root: {
        color: "#B8860B",
        '&$checked': {
          color: "#B8860B",
        },
      },
      checked: {},
    })((props) => <Checkbox color="default" {...props} />);

    return (
        <Accordion allowZeroExpanded className="accordion-note">
                {messages.map((flow, index) => {
                  return <AccordionItem key={flow.id} onClick={() => setExpanded(index)} className="user_Message">
                    <AccordionItemHeading style={{
                      padding: "2%",
                      backgroundColor: "rgb(33, 35, 39)",
                      borderTopLeftRadius: "5px",
                      borderTopRightRadius: "5px"
                      }}>
                        <AccordionItemButton style={{
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            outline: "none"}}>
                         <div style={{
                            display: "flex",
                            flexFlow: "row",
                            justifyContent: "space-between",
                            alignItems: "center"}}>
                          <Avatar 
                              round={true}
                              name={flow.author}
                              size="30"
                              color="#B8860B"
                              style={{marginRight: "5vw"}} />
                            <span style={{
                              color: "white", 
                              maxWidth: "40vw", 
                              textOverflow: "ellipsis", 
                              whiteSpace: "nowrap", 
                              overflow: "hidden"}}>{flow.title}</span>
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
                            <i style={{color: "gray", float: "right", fontSize: "13px"}}>{moment(flow.markup).format('ll')}</i>
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