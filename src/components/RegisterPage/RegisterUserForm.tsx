import { TextField, Button } from '@material-ui/core'
import * as React from 'react'
import { useFormik, FormikErrors } from 'formik'
import * as Yup from 'yup'

type Fields = {
  username: string
}
export type Props = {
  onSubmit: (
    fields: Fields,
    setErrors: (errors: FormikErrors<Fields>) => void
  ) => void
}

const loginSchema = Yup.object().shape({
  username: Yup.string().max(20, 'IDが長すぎます').required('必須項目です'),
})

function RegisterUserForm(props: Props) {
  const formik = useFormik<Fields>({
    initialValues: { username: '' },
    onSubmit: (values, { setErrors }) => props.onSubmit(values, setErrors),
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: loginSchema,
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
      <TextField
        name="username"
        label="ユーザID"
        value={formik.values.username}
        helperText={formik.touched.username ? formik.errors.username : ''}
        error={!!formik.errors.username}
        onChange={(e) => {
          formik.setFieldValue(
            'username',
            e.target.value
              .trim()
              .replace(/[^0-9a-zA-Z]/g, '')
              .toLowerCase()
          )
        }}
        type="text"
        autoComplete="username"
        margin="normal"
        required
      />
      <Button type="submit" variant="outlined" color="primary">
        ログイン
      </Button>
    </form>
  )
}

export default RegisterUserForm
