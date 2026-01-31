import React, { useContext } from "react"
import PhoneGhost from '../components/section/form/phoneForm/phoneGhost'
import {FirebaseContext} from '../Firebase'
import { withTrans } from '../../i18n/withTrans'

const GhostHost = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>  
        {!!user && !!userDB && !!setUserDB &&
        <PhoneGhost user={user} userDB={userDB} setUserDB={setUserDB} />}
    </>
    )
}

export default withTrans(GhostHost)
