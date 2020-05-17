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
      addCardTool(props.roomId, values)
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
