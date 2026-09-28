import React, { useContext } from "react"
import {FirebaseContext} from '../config/Firebase'
import CrmTable from '../components/crm/crmTable'
import { withTrans } from '../../i18n/withTrans'
import Sidebar from "../components/section/sidebar/sidebar"

const UserDatabase = () => {
  const { userDB, setUserDB, user, setUser } = useContext(FirebaseContext)

  return(
    <> 
        <div className="landscape-display"></div>   
        <div style={{
            display: "flex"
          }}>
          <Sidebar />
          {!!user && !!userDB &&
          <CrmTable />}
        </div>
    </>
  )
}

export default withTrans(UserDatabase)