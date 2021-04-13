import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext, db, auth } from '../../Firebase'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar';
import DefaultProfile from "../../svg/profile.png"
import 'moment/locale/fr';

  const MessageCommunizi = ({author, text, date, email, user, userDB, photo}) =>{

  if(moment(date).format('L') === moment(new Date()).format('L')){
    if(author === user.displayName){
      return (
        <span className="darkTextUser">
          <span style={{fontWeight: "bolder", color: "black", marginRight: "2vw"}}>{author}</span>
          <div className="darkTextBodyUser">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            style={{
                display: "flex",
                width: "4%",
                height: "4%",
                position: "absolute",
                filter: "drop-shadow(1px 1px 1px)"
            }} />
        </span>
      )
    }else{
      return (
        <span className="darkTextOther">
          <span style={{fontWeight: "bolder", color: "black", marginLeft: "2vw"}}>{author}</span>
          <div className="darkTextBodyOther">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            style={{
                display: "flex",
                width: "4%",
                height: "4%",
                position: "absolute",
                filter: "drop-shadow(1px 1px 1px)"

            }} />
        </span>
      )
    }
  }else{
    if(author === user.displayName){
      return (
        <span className="oldDarkTextUser" style={{fontWeight: "bolder"}}>
          <span style={{color: "gray", marginRight: "2vw"}}>{author}</span>
          <div className="oldDarkTextBodyUser">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            style={{
                display: "flex",
                width: "4%",
                height: "4%",
                position: "absolute",
                filter: "grayscale(90%) drop-shadow(1px 1px 1px)",

            }} />
        </span>
      )
    }else{
      return (
        <span className="oldDarkTextOther" style={{fontWeight: "bolder"}}>
          <span style={{color: "gray", marginLeft: "2vw"}}>{author}</span>
          <div className="oldDarkTextBodyOther">
          <span style={{marginBottom: "2%", color: "lightskyblue", fontFamily: "Coiny"}}>{text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            style={{
                display: "flex",
                width: "4%",
                height: "4%",
                position: "absolute",
                filter: "grayscale(90%) drop-shadow(1px 1px 1px)",

            }} />
        </span>
      )
    }
  }
            
    
  }

  export default MessageCommunizi