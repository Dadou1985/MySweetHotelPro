import React, {useContext} from 'react'
import StickList from './stickList'
import CoolBar from './coolBar'
import '../css/memo.css'
import Divider from '@material-ui/core/Divider'
import { FirebaseContext, db, auth } from '../../Firebase'
import Messenger from './messenger'


const Memo =()=>{
    const { userDB, setUserDB } = useContext(FirebaseContext)

    return(
        
            <div className="memo_container">
                <h5 className="font-weight-bolder memo_title">Note de service</h5>
                <Messenger />
                <CoolBar />
            </div>
    )
}

export default Memo