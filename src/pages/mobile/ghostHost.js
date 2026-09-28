import React, { useContext } from "react"
import MobileGhost from '../../components/section/sidebar/mobile/ghost.mobile'
import {FirebaseContext} from '../../config/Firebase'
import { withTrans } from '../../../i18n/withTrans'

const GhostHost = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
       <> 
        <div className="landscape-display"></div>  
        {!!user && !!userDB && !!setUserDB &&
        <MobileGhost user={user} userDB={userDB} setUserDB={setUserDB} />}
    </>
    )
}

export default withTrans(GhostHost)
