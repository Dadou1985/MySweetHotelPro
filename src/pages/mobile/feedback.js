import React, { useContext } from "react"
import {FirebaseContext} from '../../config/Firebase'
import MobileFeedback from '../../components/section/sidebar/mobile/feedback.mobile'
import { withTrans } from '../../../i18n/withTrans'

const Feedback = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
        <> 
        <div className="landscape-display"></div>    
        {!!user && !!userDB &&
        <MobileFeedback user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(Feedback)
