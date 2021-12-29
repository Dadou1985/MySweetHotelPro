import React, {useState} from 'react'
import CoolBar from './coolBar'
import '../css/memo.css'
import Messenger from './messenger'
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
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
                    <h5 className="font-weight-bolder memo_title">{t("msh_messenger.m_note_big_title")}</h5>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            variant="dialog"
                            ampm={false}
                            value={filterDate}
                            onChange={handleDateChange}
                            onError={console.log}
                            format={userDB.language === "en" ? "MM/dd/yyyy" : "dd/MM/yyyy"}
                            autoOk
                        />                                        
                        </MuiPickersUtilsProvider>
                </div>
                {!!filterDate && <Messenger filterDate={filterDate} />}
                <CoolBar />
            </div>
    )
}

export default Memo