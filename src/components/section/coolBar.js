import React, {useContext} from 'react'
import Annuaire from './form/annuaire'
import CheckList from './form/checkList'
import '../css/memo.css'
import CallCenter from './CallCenter'
import Caisse from './form/caisse'
import { FirebaseContext } from '../../Firebase'


const CoolBar = () => {
    const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

    return (
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "space-around",
            width:"100%"
        }}>
            {!!userDB && !!setUserDB && !!user && !!setUser &&
            <CheckList />}
            {!!userDB && !!setUserDB && !!user && !!setUser &&
            <Annuaire />}
            {!!userDB && !!setUserDB && !!user && !!setUser &&
            <Caisse />} 
            {!!userDB && !!setUserDB && !!user && !!setUser &&
            <CallCenter user={user} userDB={userDB} />}    
        </div>
    )
}

export default CoolBar