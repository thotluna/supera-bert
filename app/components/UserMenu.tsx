import { verifyUser } from '@/libs/auth/actions/verify-user'
import UserMenuClient from './UserMenuClient'

export default async function UserMenu() {
  const { data: user, } = await verifyUser()

  if (!user) return null

  const avatarUrl = user.avatarUrl
  const userName = user.name
  const emailFirstLetter = user.email?.[0].toUpperCase()

  return (
    <UserMenuClient
      avatarUrl={avatarUrl}
      userName={userName}
      emailFirstLetter={emailFirstLetter}
    />
  )
}
