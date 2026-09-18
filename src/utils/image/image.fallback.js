import React from "react"

const FallbackImage = () => {
  // Use a static asset so no GraphQL/sharp is required
  // Adjust path if your image lives elsewhere
  const src = require("../images/msh-front-app.png")
  return <img src={src} alt="App" width={500} />
}

export default FallbackImage


