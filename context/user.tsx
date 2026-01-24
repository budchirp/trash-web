'use client'

import { createContext, useState } from 'react'

import type { User } from '@/types/api/user'

export const UserContext = createContext<{
  user: User | null
  setUser: (user: User | null) => void
}>({
  user: null,
  setUser: () => {}
})

type UserContextProviderProps = {
  children: React.ReactNode
  initialUser: User | null
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
  initialUser
}: UserContextProviderProps): React.ReactNode => {
  const [user, setUser] = useState<User | null>(initialUser)

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
