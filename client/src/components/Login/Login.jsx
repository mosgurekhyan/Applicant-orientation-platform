import { Formik } from "formik"
import * as yup from 'yup'
import { useNavigate } from "react-router-dom"
import { useContext, useState } from 'react'
import instance from '../../api/axios'
import { UseContext } from '../../App'
import ROUTES from '../../routes/routes'

function Login() {
  const navigate = useNavigate()
  const { enterWithGoogle, setEmailError, showVerifyButton, setShowVerifyButton, setShowInsertEmail, setShowVerify, setEmail, setOtp, setCurrentUser, emailError } = useContext(UseContext)
  const [ showPassword, setShowPassword ] = useState(false)

  const validationSchema = yup.object().shape({
    email: yup.string().email('Խնդրում ենք լրացրեք գործող էլեկտրոնային հասցե').required("դատարկ չի կարող լինել"),
    password: yup.string().typeError('թիվ չի կարող լինել').required("դատարկ չի կարող լինել")
  })

  const sendOtp = email => {
    instance
    .post(`/register/sendotp`, { email })
    .then(res => {
      setEmailError(null)
      setEmail(email)
      setShowVerify(true)
      setOtp(res.data)
    })
    .catch(err => console.log('Error:',err))
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: ''
      }}

      onSubmit={(values, { resetForm }) => {
        instance
        .post('/login', values)
        .then(res => {
          setCurrentUser(res.data)
          localStorage.setItem(`userData`, JSON.stringify(res.data))
          setShowVerifyButton(false)
          setEmailError(null)
          navigate(ROUTES.HOME)
          resetForm()
        })
        .catch(err => {
          console.log('Error:',err)
          setEmailError(err.response.data.message)
          if (err.response.data.message === "Էլեկտրոնային հասցեն վավեր չէ") {
            setShowVerifyButton(true)
          }
        })
      }}

      validateOnBlur
      validationSchema={validationSchema}>

      {
        ({values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty}) => (
          <form className="selection" onSubmit={handleSubmit}>
            <div className='selection-input_container'>    
              <input 
                className="selection_input" 
                type='text'
                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder='email'
                autoComplete="email"
                autoFocus
              />
              {touched.email && errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className='selection-input_container'>    
              <figure className="password_wrapper">
                <input 
                className="selection_input" 
                type={showPassword ? 'text' : 'password'}
                name='password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder='password'
                autoComplete="current-password"
                />
                <i onClick={() => setShowPassword(!showPassword)} className={`eye fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </figure>
              {touched.password && errors.password && <p className="error">{errors.password}</p>}
              {emailError && <p className="error">{emailError}</p>}
              {showVerifyButton && <p onClick={() => sendOtp(values.email)} className="forget">Verify</p>}
            </div>
            <div className="selection-buttons">
              <button type='submit' disabled={!isValid && !dirty} className='selection_btn'>Մուտք</button>
              <p onClick={() => {setShowInsertEmail(true); setEmailError(`email isn't verified`)}} className='forget'>Մոռացել եք գաղտնաբառը?</p>
            </div>
            <div className="alternatives">
              <p className='alternatives_text'>Կամ մուտք գործել՝</p>
              <p onClick={enterWithGoogle} className='alternatives_selection'>Google</p>
            </div>
          </form>
        )
      }
    </Formik>
  )
}

export default Login