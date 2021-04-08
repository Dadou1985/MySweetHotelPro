import React, {useContext} from 'react'
import Annuaire from './form/annuaire'
import CheckList from './form/checkList'
import '../css/memo.css'
import CallCenter from './CallCenter'
import Caisse from './form/caisse'
import { FirebaseContext, db, auth } from '../../Firebase'


const CoolBar = () => {
    const { userDB, setUserDB } = useContext(FirebaseContext)

    return (
        <div style={{
            display: "flex",
            flexFlow: "row",
            justifyContent: "space-around",
            width:"100%"
        }}>
            {!!userDB && !!setUserDB && 
            <CheckList />}
            {!!userDB && !!setUserDB &&
            <Annuaire />}
            {!!userDB && !!setUserDB &&
            <Caisse />}    
        </div>
    )
}

export default CoolBar