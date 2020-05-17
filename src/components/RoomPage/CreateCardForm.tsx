import { Button, TextField } from '@material-ui/core'
import { useFormik } from 'formik'
import * as React from 'react'
import { addCardTool } from '../../service/firebase'

export type CardFields = {
  kind1: string
  kind1Num: number
  kind2: string
  kind2Num: number
  kind3: string
  kind3Num: number
  kind4: string
  kind4Num: number
  kind5: string
  kind5Num: number
}
const kinds = ['kind1', 'kind2', 'kind3', 'kind4', 'kind5'] as const

export type Props = {
  roomId: string
  finishForm: () => void
}

const CreateCardForm = (props: Props) => {
  const formik = useFormik<CardFields>({
    initialValues: {
      kind1: '',
      kind1Num: 1,
      kind2: '',
      kind2Num: 0,
      kind3: '',
      kind3Num: 0,
      kind4: '',
      kind4Num: 0,
      kind5: '',
      kind5Num: 0,
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values, actions) => {
      addCardTool(props.roomId, values).then(() => {
        props.finishForm()
      })
      setTimeout(() => {
        actions.setSubmitting(false)
      }, 1000)
    },
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: 'flex',
        maxWidth: '400px',
        flexDirection: 'column',
      }}
    >
      <div>
        プリセッツ:
        <Button
          onClick={() => {
            formik.setFieldValue('kind1', '♠')
            formik.setFieldValue('kind1Num', 13)
            formik.setFieldValue('kind2', '♣')
            formik.setFieldValue('kind2Num', 13)
            formik.setFieldValue('kind3', '♡')
            formik.setFieldValue('kind3Num', 13)
            formik.setFieldValue('kind4', '◇')
            formik.setFieldValue('kind4Num', 13)
            formik.setFieldValue('kind5', 'JK')
            formik.setFieldValue('kind5Num', 2)
          }}
        >
          トランプ
        </Button>
        <Button
          onClick={() => {
            formik.setFieldValue('kind1', '村人')
            formik.setFieldValue('kind1Num', 5)
            formik.setFieldValue('kind2', '人狼')
            formik.setFieldValue('kind2Num', 2)
            formik.setFieldValue('kind3', '狂人')
            formik.setFieldValue('kind3Num', 1)
            formik.setFieldValue('kind4', '占い師')
            formik.setFieldValue('kind4Num', 1)
            formik.setFieldValue('kind5', '狩人')
            formik.setFieldValue('kind5Num', 1)
          }}
        >
          人狼
        </Button>
      </div>
      {kinds.map((kind, i) => (
        <div key={kind}>
          <TextField
            name={kind}
            label={`カードの種類${i + 1}`}
            value={formik.values[kind]}
            onChange={formik.handleChange}
            type="text"
            margin="normal"
          />
          <TextField
            name={kind + 'Num'}
            label={`カードの種類${i + 1}`}
            value={formik.values[(kind + 'Num') as keyof CardFields]}
            onChange={formik.handleChange}
            type="number"
            margin="normal"
          />
        </div>
      ))}
      <Button type="submit" variant="outlined" color="primary">
        作る
      </Button>
    </form>
  )
}

export default CreateCardForm
