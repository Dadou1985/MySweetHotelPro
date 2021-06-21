import React, { useEffect, useState } from "react"
import Loader from '../components/section/common/loader'
import {FirebaseContext, db, auth} from '../Firebase'
import Notebook from '../components/section/messenger'
import Navigation from '../components/section/navigation'
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DatePicker
} from '@material-ui/pickers';


const NotebookPage = () => {
  const [hide, setHide] = useState("flex")
  const [userDB, setUserDB] = useState(null)
  const [user, setUser] = useState(null)
  const [filterDate, setFilterDate] = useState(new Date())

  useEffect(() => {
        
    let unsubscribe = auth.onAuthStateChanged(async(user) => {
        if (user) {
          await setUser(user)
          await db.collection('businessUsers')
          .doc(user.displayName)
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


  return(
    <FirebaseContext.Provider value={{ userDB, setUserDB, user, setUser }}> 
        <div style={{position: "absolute", zIndex: "9", width: "100%"}}> 
                <Loader hide={hide} />
            </div>     
            {!!user && !!userDB &&
            <Navigation user={user} userDB={userDB} />}  
        <div id="iziChat" className="dark_messenger_communizi_container">
            <h5 className="font-weight-bolder dark_messenger_title">Note de service</h5>
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
            {!!userDB && !!user && !!filterDate &&
            <Notebook userDB={userDB} user={user} filterDate={filterDate} />}
        </div>
    </FirebaseContext.Provider>
  )
}

export default NotebookPage