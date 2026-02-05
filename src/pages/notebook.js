import React, { useState, useContext } from "react"
import {FirebaseContext} from '../Firebase'
import Notebook from '../components/section/messenger'
import MomentUtils from "@date-io/moment";
import Memo from '../components/section/memo'
import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers';
import { withTrans } from '../../i18n/withTrans'
import { useTranslation } from "react-i18next"
import ToolBar from "../components/section/toolbar"
import moment from 'moment'
import 'moment/locale/fr';
import DateFnsUtils from '@date-io/date-fns';
import Background from "../images/desk-note.png"

const NotebookPage = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)
  const [filterDate, setFilterDate] = useState(new Date())
  const { t } = useTranslation()

  const handleDateChange = (date) => {
    setFilterDate(date);
  };

  const isBrowser = () => typeof window !== "undefined"
  moment.locale("fr")

  console.log("DATE+++++++++++++", filterDate)

  return(
    <> 
        <div className="landscape-display"></div> 
        <div style={{
            display: "flex",
            backgroundImage: isBrowser() && window.innerWidth > 768 ? `url(${Background})` : "none",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          }}>
          <ToolBar />
          <div id="iziChat"  style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
            height: "100%",
            width: "100%",
            backgroundRepeat: "no-repeat",
            backgroundPositionY: "5vh",
          }}>
              <h3 className="dark_messenger_title">{t("msh_messenger.m_note_big_title")}</h3>
              <div style={{
                display: "flex",
                flexFlow: "column",
                // alignItems: "end",
                height: "80vh",
                width: window.innerWidth > 1023 ? "55%" : "100%",
                marginTop: "3vh", 
                padding: "3%"
              }}>
                <div style={{paddingRight: window.innerWidth > 768 ? "0vw" : "2vw"}}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} >
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
              {/* <div style={{
                  display: window.innerWidth > 1023 ? "flex" : "none",
                  flexFlow: "column",
                  alignItems: "center",
                  width: "45%"
                }}>
                  {!!user && !! userDB &&
                  <Memo user={user} userDB={userDB} />}
              </div> */}
          </div>
        </div>
    </>
  )
}

export default withTrans(NotebookPage)