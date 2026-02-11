import React, {useContext} from 'react'
import moment from 'moment'
import Avatar from '@material-ui/core/Avatar';
import DefaultProfile from "../../svg/profile.png"
import DefaultImg from "../../images/avatar-client.png"
import 'moment/locale/fr';
import '../css/section/chatTemplate.css'
import { FirebaseContext } from '../../Firebase';

const MessageCommunizi = ({author, text, date, translation, photo, markup, title, key, lastMessage}) =>{
  const {userDB} = useContext(FirebaseContext)

  if(date && moment(date.toDate()).format('L') === moment(new Date()).format('L')){
    if(title === "host"){
      return (
        <span key={key} className="darkTextUser">
          {lastMessage && <span className="user_avatar_chat_label">{author}</span>}
          <div className="darkTextBodyUser" style={{backgroundColor: author === userDB?.username ? "#B8860B" : "rgb(30, 52, 107)"}}>
            <span style={{marginBottom: "2%", color: author === userDB?.username ? "black" : "white"}}>{translation || text}</span>
            <span style={{color: "lightgrey", fontSize: "85%", textAlign: "right"}}><i>{moment(markup).format('LT')}</i></span>
          </div>
          {lastMessage && <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            className="avatar_chat" />}
        </span>
      )
    }else{
      return (
        <span key={key} className="darkTextOther">
          {lastMessage && <span className="customer_avatar_chat_label">{author}</span>}
          <div className="darkTextBodyOther">
            <span style={{marginBottom: "2%", color: "white"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(markup).format('LT')}</i></span>
          </div>
          {lastMessage && <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultImg}
            className="avatar_chat" />}
        </span>
      )
    }
  }else{
    if(title === "host"){
      return (
        <span key={key} className="oldDarkTextUser" style={{fontWeight: "bolder", position: "relative"}}>
          {lastMessage && <span className="old_user_avatar_chat_label">{author}</span>}
          <div className="oldDarkTextBodyUser">
            <span style={{marginBottom: "2%", color: "lightskyblue"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(markup).format('LT')}</i></span>
          </div>
          {lastMessage && <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultProfile}
            className="old_avatar_chat" />}
        </span>
      )
    }else{
      return (
        <span key={key} className="oldDarkTextOther" style={{fontWeight: "bolder", position: "relative"}}>
          {lastMessage && <span className="customer_old_user_avatar_chat_label">{author}</span>}
          <div className="oldDarkTextBodyOther">
          <span style={{marginBottom: "2%", color: "lightskyblue"}}>{translation || text}</span>
            <span style={{color: "gray", fontSize: "85%", textAlign: "right"}}><i>{moment(markup).format('LT')}</i></span>
          </div>
          {lastMessage && <Avatar alt="user-profile-photo" 
            src={photo ? photo : DefaultImg}
            className="old_avatar_chat" />}
        </span>
      )
    }
  }
            
    
  }

  export default MessageCommunizi