import React from "react"
import PropTypes from "prop-types"
import "./css/layout.css"

const Layout = ({ children }) => {
 
  return (
    <div>
      <div
        style={{
          overflow: "hidden",
          maxWidth: "100%",
          height: "100%"}}>
        <main className="softSkin">{children}</main>  
      </div>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
