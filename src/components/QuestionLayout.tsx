import { Typography } from '@material-ui/core'
import { useContext } from 'react'
import { solve } from '../service/api'
import { Question } from '../types'
import AnswerForm from './AnswerForm'
import App, { LoginContext } from './App'

function AnswerFormContainer({ qid }: { qid: number }) {
  const [login] = useContext(LoginContext)

  return (
    <AnswerForm
      disabled={login.status !== 'comp'}
      onSubmit={({ flag }) => {
        console.log({ flag })
        solve(qid, flag).then((res) => {
          const message = res.data.ok ? '正解！' : 'はずれ'

          alert(message)
        })

        console.log('sumbit on callback')
      }}
    />
  )
}

type Props = {
  q: Question
}
const QuestionLayout: React.FC<Props> = ({ q, children }) => {
  return (
    <App>
      <Typography variant="h4">
        {q.num}. {q.text}
      </Typography>
      <section>{children}</section>
      <AnswerFormContainer qid={q.num} />
    </App>
  )
}

export default QuestionLayout
