import React, { useContext } from "react"
import {FirebaseContext} from '../Firebase'
import GuestDatabase from '../components/section/guestDatabase'
import { withTrans } from '../../i18n/withTrans'
import ToolBar from "../components/section/toolbar"

const UserDatabase = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        <div style={{
            display: "flex"
          }}>
          <ToolBar />
          {!!user && !!userDB &&
          <GuestDatabase />}
        </div>
    </>
  )
}

export default withTrans(UserDatabase)