import React, { useContext } from "react"
import Support from '../components/section/assistance'
import {FirebaseContext} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

function Assistance() {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
       <div id="iziChat" className="dark_messenger_communizi_container">
            <h5 className="font-weight-bolder dark_messenger_title">Support Technique</h5>
            {!!userDB && !!user&&
            <Support userDB={userDB} user={user} />}
        </div>
    </>
    )
}

export default withTrans(Assistance)
