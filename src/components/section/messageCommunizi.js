import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext, db, auth } from '../../Firebase'
import moment from 'moment'
import 'moment/locale/fr';

  const MessageCommunizi = ({author, text, date, email, user, userDB}) =>{

  if(moment(date).format('L') === moment(new Date()).format('L')){
    if(author === user.displayName){
      return (
        <span className="darkTextUser">
          <span style={{fontWeight: "bolder", color: "black"}}>{author}</span>
          <div className="darkTextBodyUser">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
        </span>
      )
    }else{
      return (
        <span className="darkTextOther">
          <span style={{fontWeight: "bolder", color: "black"}}>{author}</span>
          <div className="darkTextBodyOther">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
        </span>
      )
    }
  }else{
    if(author === user.displayName){
      return (
        <span className="oldDarkTextUser" style={{fontWeight: "bolder"}}>
          <span style={{color: "gray"}}>{author}</span>
          <div className="oldDarkTextBodyUser">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
        </span>
      )
    }else{
      return (
        <span className="oldDarkTextOther" style={{fontWeight: "bolder"}}>
          <span style={{color: "gray"}}>{author}</span>
          <div className="oldDarkTextBodyOther">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
        </span>
      )
    }
  }
            
    
  }

  export default MessageCommunizi