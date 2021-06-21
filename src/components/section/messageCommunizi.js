import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext, db, auth } from '../../Firebase'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar';
import DefaultProfile from "../../svg/profile.png"
import 'moment/locale/fr';

  const MessageCommunizi = ({author, text, date, email, user, translation, photo, title, key}) =>{

  if(moment(date).format('L') === moment(new Date()).format('L')){
    if(title === "host"){
      return (
        <span key={key} className="darkTextUser">
          <span className="user_avatar_chat_label">{author}</span>
          <div className="darkTextBodyUser" style={{backgroundColor: author === user.displayName ? "lightblue" : "rgb(30, 52, 107)"}}>
          <span style={{marginBottom: "2%", color: author === user.displayName ? "black" : "white"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            className="avatar_chat" />
        </span>
      )
    }else{
      return (
        <span key={key} className="darkTextOther">
          <span className="customer_avatar_chat_label">{author}</span>
          <div className="darkTextBodyOther">
          <span style={{marginBottom: "2%", color: "white"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            className="avatar_chat" />
        </span>
      )
    }
  }else{
    if(title === "host"){
      return (
        <span key={key} className="oldDarkTextUser" style={{fontWeight: "bolder"}}>
          <span className="old_user_avatar_chat_label">{author}</span>
          <div className="oldDarkTextBodyUser">
          <span style={{marginBottom: "2%", color: "lightskyblue"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            className="old_avatar_chat" />
        </span>
      )
    }else{
      return (
        <span key={key} className="oldDarkTextOther" style={{fontWeight: "bolder"}}>
          <span className="customer_old_user_avatar_chat_label">{author}</span>
          <div className="oldDarkTextBodyOther">
          <span style={{marginBottom: "2%", color: "lightskyblue"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(date).startOf('hour').fromNow()}</i></span>
          </div>
          <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            className="old_avatar_chat" />
        </span>
      )
    }
  }
            
    
  }

  export default MessageCommunizi