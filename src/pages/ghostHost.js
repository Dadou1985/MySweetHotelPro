import React, { useContext } from "react"
import PhoneGhost from '../components/section/form/phoneForm/phoneGhost'
import {FirebaseContext} from '../Firebase'
import Navigation from '../components/section/navigation'
import { withTrans } from '../../i18n/withTrans'

const GhostHost = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>
        {!!user && !!userDB &&
        <Navigation user={user} userDB={userDB} />}    
        {!!user && !!userDB && !!setUserDB &&
        <PhoneGhost user={user} userDB={userDB} setUserDB={setUserDB} />}
    </>
    )
}

export default withTrans(GhostHost)
