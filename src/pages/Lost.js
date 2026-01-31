import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import LostNFound from '../components/section/LostNFound'
import { withTrans } from '../../i18n/withTrans'
import ToolBar from "../components/section/toolbar"

const Lost = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
         <div style={{
            display: "flex"
          }}>
          <ToolBar />
          {!!user && !!userDB &&
          <LostNFound user={user} userDB={userDB} />}
        </div>
    </>
  )
}

export default withTrans(Lost)