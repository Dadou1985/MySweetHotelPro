import React from "react"
import '@progress/kendo-theme-default/dist/all.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import Connection from '../components/connection'
import SEO from '../components/seo'

const IndexPage = () => {

  return(
    <Connection />
  )
}

export default IndexPage