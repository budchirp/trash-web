'use client'

import { createContext, useContext, useState } from 'react'

import type { User } from '@/types/api/user'

type UserContextValue = {
  user: User | null
  setUser: (user: User | null) => void
}

export const UserContext = createContext<UserContextValue | null>(null)

type UserContextProviderProps = {
  children: React.ReactNode
  initialUser: User | null
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
  initialUser
}: UserContextProviderProps): React.ReactNode => {
  const [user, setUser] = useState<User | null>(initialUser)

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserContextProvider')
  return context
}
