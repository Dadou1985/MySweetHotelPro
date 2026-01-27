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
import { useTranslation } from "react-i18next"
import Arrow from '../../svg/arrowDown.svg'
import { StaticImage } from 'gatsby-plugin-image'
import '../css/section/accordion.css'

const NoteBox = ({filterDate, category, title}) => {

    const [messages, setMessages] = useState([])
    const [expanded, setExpanded] = useState(null)
    const { t } = useTranslation()
    const [data, setData] = useState(false);

    const {userDB} = useContext(FirebaseContext)

    useEffect(() => {
      const noteOnAir = () => {
        return db.collection('hotels')
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

                    const noteFiltered = snapMessages.length > 0 && snapMessages.filter(note => note.status == category)
                    setMessages(noteFiltered)
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
      <>
      <h6 style={{color: category, borderBottom: `1px solid ${category}`}}>
        <b>{t(title)}</b> {messages.length > 0 ? `- ${messages.length} consigne(s)` : null} <div onClick={() => setData(!data)}>
          <img src={Arrow} style={{
            width: "2vw", 
            color: "red", 
            float: "right", 
            transform: data ? "rotate(180deg)" : "rotate(0deg)", 
            backgroundColor: category, 
            borderRadius: "50%",
            padding: "1%"}} 
            />
        </div>
      </h6>
        <Accordion allowZeroExpanded className="accordion-note">
                {data && messages.length > 0 && messages.map((flow, index) => {
                  return <AccordionItem key={flow.id} onClick={() => setExpanded(index)} className="user_Message">
                    <AccordionItemHeading style={{
                      paddingLeft: "1%",
                      paddingRight: "1%",
                      borderLeft: `5px solid ${flow.status}`,
                      borderBottom: `1px solid ${flow.status}`,
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
                            color={Avatar.getRandomColor('sitebase', ['red', 'green', 'blue'])}
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
      </>
    )
}

export default NoteBox