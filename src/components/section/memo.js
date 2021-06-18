import React, {useContext, useState} from 'react'
import StickList from './stickList'
import CoolBar from './coolBar'
import '../css/memo.css'
import Divider from '@material-ui/core/Divider'
import { FirebaseContext, db, auth } from '../../Firebase'
import Messenger from './messenger'
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker
  } from '@material-ui/pickers';


const Memo =()=>{
    const { userDB, setUserDB } = useContext(FirebaseContext)
    const [filterDate, setFilterDate] = useState(new Date())

    const handleDateChange = (date) => {
        setFilterDate(date);
      };

    return(
        
            <div className="memo_container">
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
                    <h5 className="font-weight-bolder memo_title">Note de service</h5>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            variant="dialog"
                            ampm={false}
                            value={filterDate}
                            onChange={handleDateChange}
                            onError={console.log}
                            format="dd/MM/yyyy"
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