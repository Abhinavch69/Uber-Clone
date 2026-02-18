import React, { createContext, useState } from 'react'

export const UserDataContext = createContext()

const userContext = ({children}) => {

  const [user, setUser] = useState({
    email:'',
    fullname:{
      firstname:'',
      lastname:''
    }
  })
  return (
    <div>
      <UserDataContext.Provider value={user}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default userContext
