import React from "react"
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