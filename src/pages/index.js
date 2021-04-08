import React, { useState, useEffect } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Connection from '../components/connection'
import {FirebaseContext, db, auth} from '../Firebase'
import SEO from '../components/seo'
import { navigate } from 'gatsby'

const IndexPage = () => {

  return(
        <Connection />
  )
}

export default IndexPage