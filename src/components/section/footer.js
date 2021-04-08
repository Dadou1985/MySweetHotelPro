import React, {useContext} from 'react'
import Notifications from './notifications'
import { FirebaseContext, db, auth } from '../../Firebase'

const Footer = () =>{
    const { userDB, setUserDB } = useContext(FirebaseContext)

    return(
        <div className="footer_container">
            {!!userDB && !!setUserDB &&
            <Notifications userDB={userDB} setUserDB={setUserDB} />}
        </div>
    )
}

export default Footer