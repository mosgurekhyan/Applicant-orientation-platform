import { useContext } from 'react'
import './PasswordChanging.css'
import { UseContext } from '../../App'
import { Formik } from "formik"
import * as yup from 'yup'
import instance from '../../api/axios'

function PasswordChanging() {
  const { showPasswordChanging, setShowPasswordChanging, email, setShowInsertEmail } = useContext(UseContext)

  const validationSchema = yup.object().shape({
    newPassword: yup.string().typeError('must be a string').min(8, 'գաղտնաբառը պետք է ունենա գոնե 8 նիշ').max(20, 'գաղտնաբառը պետք է ունենա ամենաշատը 20 նիշ').required("դատարկ չի կարող լինել"),
    confirmPassword: yup.string().typeError('must be a string').oneOf([yup.ref('newPassword')], "գաղտնաբառերը չեն համապատասխանում").required("դատարկ չի կարող լինել")
  })

  return (
    <>
      {
        showPasswordChanging &&
        <Formik
          initialValues={{
            newPassword: '',
            confirmPassword: ''
          }}
  
          onSubmit = {(values, { resetForm }) => {
            instance
            .patch('/login/changepassword', { ...values, email })
            .then(() => {
              setShowPasswordChanging(false)
              setShowInsertEmail(false)
              resetForm()
            })
            .catch(err => console.log(err))
          }}
        
          validateOnBlur
          validationSchema={validationSchema}>
  
          {
            ({values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty}) => (
              <div className='password-changing'>
                <form className="selection custom_width" onSubmit={handleSubmit}>
                  <h2 className="password-changing_title">Լրացրեք նոր գաղտնաբառը</h2>
                  <div className='selection-input_container'>   
                    <input 
                      className="selection_input"
                      type='password'
                      name='newPassword'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.newPassword}
                      placeholder='password'
                      autoFocus
                    />
                    {touched.newPassword && errors.newPassword && <p className="error">{errors.newPassword}</p>}
                  </div>
                  <div className='selection-input_container'>  
                    <input 
                      className="selection_input"
                      type='password'
                      name='confirmPassword'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.confirmPassword}
                      placeholder='confirm password'
                    />
                    {touched.confirmPassword && errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                  </div>
                  <button className='selection_btn' disabled={!isValid && !dirty} type='submit'>Փոխել գատնաբառը</button>
                </form>
              </div>
            )
          }
        </Formik>
      }
    </>
  )
}

export default PasswordChanging