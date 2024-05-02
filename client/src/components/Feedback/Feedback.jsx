import './Feedback.css'
import { Formik } from "formik"
import { useEffect, useState } from 'react'
import * as yup from 'yup'
import instance from '../../api/axios'
import SmallLoadingSpinner from '../SmallLoadingSpinner/SmallLoadingSpinner'
import contact_us from '../../assets/images/contact_us.png'

function Feedback() {
  const [ message, setMessage ] = useState(null)
  const [ showMessage, setShowMessage ] = useState(false) 
  const [ loading, setLoading ] = useState(false)
  const [ enter, setEnter ] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      setEnter(true)
    }, 100)
  
    return () => clearTimeout(timer)
  }, [])


  const validationSchema = yup.object().shape({
    email: yup.string().email('Խնդրում ենք լրացնել գործող էլեկտրոնային հասցե').required("դատարկ չի կարող լինել"),
    name: yup.string().required("դատարկ չի կարող լինել"),
    subject: yup.string().required("դատարկ չի կարող լինել"),
    message: yup.string().required("դատարկ չի կարող լինել")
  })

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        subject: '',
        message: ''
      }}

      onSubmit={(values, { resetForm }) => {
        setLoading(true)
        instance
        .post('/email', values)
        .then(res => {
          setMessage(res.data)
          setShowMessage(true)
          setLoading(false)
          setTimeout(() => {
            setShowMessage(false)
          }, 2500)
          resetForm()
        })
        .catch(err => console.log('err:',err))
      }}

      validateOnBlur
      validationSchema={validationSchema}>

      {
        ({values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty}) => (
          <div className='feedback'>
            <div className={`feedback-container1 ${enter && 'enter1'}`}>
            <form className="feedback-form" onSubmit={handleSubmit}>
              <h2 className='feedback_title'>Կապ մեզ հետ</h2>
              <div className="feedback-form-input_container">
                <input 
                  className='feedback-form_input' 
                  placeholder='Your name' 
                  name='name' 
                  type="text" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  autoFocus
                />
                {touched.name && errors.name && <p className="error">{errors.name}</p>}
              </div>
              <div className="feedback-form-input_container">
                <input 
                  className='feedback-form_input' 
                  placeholder='Your email' 
                  name='email' 
                  type="text" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && <p className="error">{errors.email}</p>}
              </div>
              <div className="feedback-form-input_container">
                <input 
                  className='feedback-form_input' 
                  placeholder='Your subject' 
                  name='subject' 
                  type="text" 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subject}
                />
                {touched.subject && errors.subject && <p className="error">{errors.subject}</p>}
              </div>
              <div className="feedback-form-textarea_container">
                <textarea
                  className='feedback-form_input textarea' 
                  placeholder='Your message' 
                  name='message'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                />
                {touched.message && errors.message && <p className="error">{errors.message}</p>}
                {loading && <SmallLoadingSpinner/>}
                {showMessage && <p className='feedbeck_message'>{message}</p>}
              </div>
              <button disabled={!isValid && !dirty} type='submit' className='feedback-form_button'>Ուղարկել</button>
            </form>
            </div>
            <img className={`feedback-container2 ${enter && 'enter2'}`} src={contact_us} alt="" />            
          </div>
        )
      }
    </Formik>
  )
}

export default Feedback