import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/shiftLoader'
import {FirebaseContext, db, auth} from '../Firebase'
import Notebook from '../components/section/messenger'
import Navigation from '../components/section/navigation'
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from "@date-io/moment";
import Memo from '../components/section/memo'
import Pens from '../images/pens.png'
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
  const { t, i18n } = useTranslation()

  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          await setUser(user)
          await db.collection('businessUsers')
          .doc(user.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                console.log("+++++++", doc.data())
                setUserDB(doc.data())
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!")
              }
            })
            return setHide("none")
        }
      })
    return unsubscribe
}, [])

const handleDateChange = (date) => {
  setFilterDate(date);
};

moment.locale("fr")
console.log(userDB && userDB.language)

  return(
    <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
          <Loader hide={hide} />
        </div>     
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}  
        <div style={{
            display: "flex"
          }}>
          <ToolBar />
          <div id="iziChat"  style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
            height: "100%",
            width: "100%",
            backgroundImage: typeof window && window.innerWidth > 768 ? `url(${Book})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundPositionY: "5vh",
          }}>
              <h3 className="dark_messenger_title">{t("msh_messenger.m_note_big_title")}</h3>
              <div style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "end",
                height: "83vh",
                width: typeof window !== `undefined` && window.innerWidth > 768 ? "55%" : "100%",
                marginTop: "3vh"
              }}>
                <div style={{paddingRight: typeof window && window.innerWidth > 768 ? "0vw" : "2vw"}}>
                  <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={userDB && userDB.language} >
                    <DatePicker
                        variant="inline"
                        ampm={false}
                        value={filterDate}
                        onChange={handleDateChange}
                        onError={console.log}
                        autoOk
                        inputVariant="outlined"
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