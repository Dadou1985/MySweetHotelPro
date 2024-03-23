import React, { useEffect, useState } from "react"
import Loader from '../helper/common/mshLoader'
import {FirebaseContext, db, auth} from '../Firebase'
import Notebook from '../components/section/messenger'
import Navigation from '../components/section/navigation'
import MomentUtils from "@date-io/moment";
import Memo from '../components/section/memo'
import Book from '../images/book2.png'
import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers';
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import ToolBar from "../components/section/toolbar"
import moment from 'moment'
import 'moment/locale/fr';

const NotebookPage = () => {
  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = useState(null)
  const [filterDate, setFilterDate] = useState(new Date())
  const { t } = useTranslation()

  useEffect(() => {     
    if(!user && !userDB){
      const userStorage = JSON.parse(sessionStorage.getItem('userStorage'))
    const userAuth = JSON.parse(sessionStorage.getItem('userAuth'))
    
    setUser(userAuth)
    setUserDB(userStorage)
    return setHide("none")
    }
        
}, [user, userDB])

const handleDateChange = (date) => {
  setFilterDate(date);
};

const isBrowser = () => typeof window !== "undefined"
moment.locale("fr")

  return(
    <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div className="landscape-display"></div>
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
          <Loader hide={hide} />
        </div>     
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}  
        <div style={{
            display: "flex",
          }}>
          <ToolBar />
          <div id="iziChat"  style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
            height: "100%",
            width: "100%",
            // backgroundImage: isBrowser() && window.innerWidth > 768 ? `url(${Book})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundPositionY: "5vh",
          }}>
              <h3 className="dark_messenger_title">{t("msh_messenger.m_note_big_title")}</h3>
              <div style={{
                display: "flex",
                flexFlow: "column",
                // alignItems: "end",
                height: "80vh",
                width: isBrowser() && window.innerWidth > 768 ? "55%" : "100%",
                marginTop: "3vh", 
                padding: "3%"
              }}>
                <div style={{paddingRight: isBrowser() && window.innerWidth > 768 ? "0vw" : "2vw"}}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={userDB && userDB.language} >
                    <DatePicker
                        variant="inline"
                        ampm={false}
                        value={filterDate}
                        onChange={handleDateChange}
                        onError={console.log}
                        autoOk
                        label={t('msh_messenger.m_calendar')}
                        disableFuture
                        format={userDB && userDB.language === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                    />   
                    </MuiPickersUtilsProvider>
                </div>
                {!!userDB && !!user && !!filterDate &&
                <Notebook userDB={userDB} user={user} filterDate={filterDate} />}
              </div>
              <div style={{
                      display: "flex",
                      flexFlow: "column",
                      alignItems: "center",
                      width: "45%"
                    }}>
                      {!!user && !! userDB &&
                      <Memo user={user} userDB={userDB} />}
                  </div>
          </div>
        </div>
    </FirebaseContext.Provider>
  )
}

export default withTrans(NotebookPage)