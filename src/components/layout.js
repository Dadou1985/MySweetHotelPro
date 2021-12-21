/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useState } from "react"
import PropTypes from "prop-types"
import Navigation from './section/navigation'
import "./css/layout.css"
import {FirebaseContext} from '../Firebase'
import { withTrans } from '../../i18n/withTrans'


const Layout = ({ children, t, i18n }) => {

  const [userDB, setUserDB] = useState(null)
 
  return (
    <FirebaseContext.Provider value={{ userDB, setUserDB }}>
      <Navigation />
      <div
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          height: "100%"}}>
        <main className="softSkin">{children}</main>  
      </div>
    </FirebaseContext.Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default withTrans(Layout)
