import React from "react";

// Default value is a non-null object so consumers can safely destructure
// even if a Provider is missing/misconfigured.
const FirebaseContext = React.createContext({ user: null, userDB: null });

export default FirebaseContext;
