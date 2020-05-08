import Link from 'next/link'
import { useContext } from 'react'
import { questions } from '../../questions'
import { User } from '../../types'
import App, { LoginContext } from '../App'

function ListWithLogin({ user }: { user: User }) {
  console.log(user)

  return (
    <ul>
      {questions.map((q) => (
        <li key={q.num}>
          <Link href={`/q/${q.num}`}>
            <a>{q.text}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function List() {
  return (
    <ul>
      {questions.map((q) => (
        <li key={q.num}>
          <Link href={`/q/${q.num}`}>
            <a>{q.text}</a>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function TopPage() {
  const [login] = useContext(LoginContext)

  if (login.status === 'comp') {
    return <ListWithLogin user={login.user} />
  }
  return <List />
}

function TopPageContainer() {
  return (
    <App>
      <TopPage />
    </App>
  )
}

export default TopPageContainer
