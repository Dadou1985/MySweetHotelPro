import React, {useState} from 'react'
import StickList from './stickList'
import '../css/memo.css'
import Divider from '@material-ui/core/Divider'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker
  } from '@material-ui/pickers';
  import { useTranslation } from "react-i18next"


const Memo =({userDB})=>{
    const [filterDate, setFilterDate] = useState(new Date())
    const { t, i18n } = useTranslation()

    const handleDateChange = (date) => {
        setFilterDate(date);
      };

    return(
        
            <div className="memo_container">
                <h5 className="memo_title"><b>{t("Le Mur")}</b> - Expression libre</h5>
                <Divider/>
                {userDB && 
                <StickList userDB={userDB} />}
                {/*<MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        variant="dialog"
                        ampm={false}
                        value={filterDate}
                        onChange={handleDateChange}
                        onError={console.log}
                        format={userDB.language === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                        autoOk
                    />                                        
                </MuiPickersUtilsProvider>*/}
            </div>
    )
}

export default Memo