import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import PhoneFeedback from '../components/section/form/phoneForm/phoneFeedback'
import { withTrans } from '../../i18n/withTrans'

const Feedback = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
        <> 
        <div className="landscape-display"></div>    
        {!!user && !!userDB &&
        <PhoneFeedback user={user} userDB={userDB} />}
    </>
    )
}

export default withTrans(Feedback)
