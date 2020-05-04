import React, {useContext} from 'react';

import Ingredients from "./components/Ingredients/Ingredients";
import {AuthContext} from "./context/auth-context";
import Auth from "./components/Auth";

function App() {
  const authContext = useContext(AuthContext)

  let content = <Auth/>
  if (authContext.isAuth)
    content = <Ingredients/>

  return content;
}

export default App;
