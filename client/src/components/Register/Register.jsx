import './Register.css'

import { UseContext } from '../../App'

import { useContext, useState } from 'react'
import * as yup from 'yup'
import { Formik } from 'formik'
import instance from '../../api/axios'
import { roles } from '../../constants/roles'

function Register() {
  const { enterWithGoogle, setEmail, setOtp, setShowVerify, professions } = useContext(UseContext)
  const [ showPassword1, setShowPassword1 ] = useState(false)
  const [ showPassword2, setShowPassword2 ] = useState(false)
  const [ showMessage, setShowMessage ] = useState(false) 
  const [ existingEmail, setExistingEmail ] = useState(null)
  const [ showRoles, setShowRoles ] = useState(false)
  const [ updatedRoles, setUpdatedRoles ] = useState([...roles])
  const [ showProfessions, setShowProfessions ] = useState(false)
  const [ selectedProfessions, setSelectedProfessions ] = useState([])

  const handleRoleSelection = role => {
    setShowRoles(!showRoles)
    const selectedRoleIndex = updatedRoles.findIndex(r => r.role === role)
    const firstRole = updatedRoles[0]
    const selectedRoleObject = updatedRoles[selectedRoleIndex]
    const updatedRolesCopy = [...updatedRoles]
    updatedRolesCopy[0] = selectedRoleObject
    updatedRolesCopy[selectedRoleIndex] = firstRole

    setUpdatedRoles(updatedRolesCopy)
  }

  const handleProfessionSelection = e => {
    setShowProfessions(false)
    if (selectedProfessions.includes(e)) {
      setSelectedProfessions(selectedProfessions.filter(item => item !== e))
    } else {
      if (selectedProfessions.length < 4) {
        setSelectedProfessions([...selectedProfessions, e])
      }
    }
  }

  const validationSchema = yup.object().shape({
    fullName: yup.string()
    .typeError('must be a string')
    .required("can't be empty")
    .test(
      'two-words',
      'must contain exactly two words',
      value => {
        if (!value) return false
        const words = value.trim().split(' ')
        return words.length === 2
      }
    )
    .max(30, 'անունը պետք է լինի ամենաշատը 30 նիշանոց'),
    email: yup.string().email('խնդրում ենք նշել գործող էլեկտրոնային հասցե').required("դատարկ չի կարող լինել"),
    role: yup.string().required("նշեք ձեր կարգավիճակը"),
    password: yup.string().typeError('must be a string').min(8, 'գաղտնաբառը պետք է պարունակի ամենաքիչը 8 նիշ').max(20, 'Գաղտնաբառը պետք է պարունակի ամենաշատը 20 նիշ').required("դատարկ չի կարող լինել"),
    confirmPassword: yup.string().typeError('must be a string').oneOf([yup.ref('password')], "գաղտնաբառերը չեն համապատասխանում").required("դատարկ չի կարող լինել"),
    professions: yup.array()
    .of(yup.object().shape({_id: yup.string().required()}))
    .max(4, 'Կարող եք ընտրել մինչև 4 մասնագիտություն')
  })

  const getPasswordStrength = password => {
    const regex = {
      digit: /\d/,
      lowerCase: /[a-z]/,
      upperCase: /[A-Z]/,
      symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
    }
  
    let strength = 0
  
    if (
      password.length >= 12 &&
      regex.upperCase.test(password) &&
      regex.lowerCase.test(password) &&
      regex.digit.test(password) &&
      regex.symbol.test(password)
    ) {
      strength = 4
    }
    else if (
      password.length >= 9 &&
      (regex.upperCase.test(password) ||
        regex.lowerCase.test(password) ||
        regex.digit.test(password) ||
        regex.symbol.test(password))
    ) {
      strength = 3
    }
    else {
      strength = 2
    }
  
    return strength
  }

  const generateStrongPassword = () => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const numericChars = '0123456789'
    const specialChars = '!@#$%^&*()-_=+'
    const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars
  
    let password = ''
    
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
    password += numericChars[Math.floor(Math.random() * numericChars.length)]
    password += specialChars[Math.floor(Math.random() * specialChars.length)]
  
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    return password
  }


  return (
    <Formik
      initialValues = {{
        fullName: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: '',
        professions: []
      }}
      onSubmit = {( values, { resetForm } ) => {
        instance
        .post('/register', values)
        .then(res => {
          setEmail(res.data.email)
          if (res.data.message) {
            setExistingEmail(res.data.message)
            setShowMessage(true)
            setTimeout(() => {
              setShowMessage(false)
            }, 2500)
          } else {
            setOtp(res.data?.OTP?.toString())
            setShowVerify(true)
            resetForm()
          }
        })
        .catch(err => console.log('Error:',err))
      }}
      
      validateOnBlur
      validationSchema = { validationSchema }
      >

      {
        ({ values, errors, touched, handleChange, handleBlur, isValid, handleSubmit, dirty, setFieldValue }) => (
          <form className='selection' onSubmit={handleSubmit}>
            <div className='selection-input_container'>
              <input 
                className="selection_input"
                type='text'
                name='fullName'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fullName}
                placeholder='full name'
                autoFocus
              />
              {touched.fullName && errors.fullName && <p className="error">{errors.fullName}</p>}
            </div>
            <div className='selection-input_container'>    
              <input 
                type='text'
                className="selection_input"
                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder='email'
              />
              {touched.email && errors.email && <p className="error">{errors.email}</p>}
              {showMessage && <p className="error">{existingEmail}</p>}
            </div>
            <div className="selection-input_container">
              <div className={`role-selections ${showRoles && 'custom_height'}`}>
                {
                  updatedRoles.map((e, i) => 
                    <div onClick={() => {setFieldValue("role", `${e.role}`); handleRoleSelection(e.role)}} key={e.id} className="role-selection">
                      <p className={`role-selection_role ${i === 0 && 'border_none'}`}>{e.role}</p>
                      { i === 0 && <i className="fa-solid fa-sort-down"></i> }
                    </div>
                  )
                }
              </div>
              {touched.role && errors.role && <p className="selection_error">{errors.role}</p>}
            </div>
            <div className='selection-input_container'>
              <div className={`profession-selections ${showProfessions && 'custom_height scroll'}`}>
                <div onClick={() => setShowProfessions(!showProfessions)} className="role-selection">
                  <p className='role-selection_profession'>professions</p>
                  <i className="fa-solid fa-sort-down"></i>
                </div>
                {
                  professions?.map(e =>
                    <div 
                      onClick={() => {handleProfessionSelection(e); setFieldValue("professions", values.professions.some(pro => pro._id === e._id) ? values.professions.filter(item => item._id !== e._id) : [...values.professions, e])}} 
                      className='role-selection'
                      key={e._id} 
                    >
                      <p className={`role-selection_role ${selectedProfessions.includes(e) && 'active_profession'}`}>{e.title}</p>
                    </div>
                  )
                }
              </div>
              {touched.professions && errors.professions && <p className="selection_error">{errors.professions}</p>}
            </div>
            <div className={`selection-input_container ${values.password && 'custom_height'}`}>  
              <figure className="password_wrapper">
                <input 
                  className="selection_input"
                  type={showPassword1 ? 'text' : 'password'}
                  name='password'
                  onChange={(e) => {handleChange(e); getPasswordStrength(e.target.value)}}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder='password'
                />
                <i onClick={() => setShowPassword1(!showPassword1)} className={`eye fa-solid ${showPassword1 ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </figure>
              {touched.password && errors.password && <p className="error">{errors.password}</p>}
              {
                values.password && 
                <div className="password-strength">
                  <span>Password Strength: </span>
                  {getPasswordStrength(values.password) === 4 && <span className="strong">Ուժեղ</span>}
                  {getPasswordStrength(values.password) === 3 && <span className="medium">Միջին</span>}
                  {(getPasswordStrength(values.password) === 2 || getPasswordStrength(values.password) === 1) && <span className="weak">Թույլ</span>}
                </div>
              }
            </div>
            <p className='strength_password_btn' onClick={() => handleChange({ target: { name: 'password', value: generateStrongPassword() } })}>Գեներացնել ուժեղ գաղտնաբառ</p>
            <div className='selection-input_container'>  
              <figure className="password_wrapper">
                <input 
                  className="selection_input"
                  type={showPassword2 ? 'text' : 'password'}
                  name='confirmPassword'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  placeholder='confirm password'
                />
                <i onClick={() => setShowPassword2(!showPassword2)} className={`eye fa-solid ${showPassword2 ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </figure> 
              {touched.confirmPassword && errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            </div>
            <button type='submit' disabled={!isValid && !dirty} className='selection_btn'>Գրանցվել</button>
            <div className="alternatives">
              <p className='alternatives_text'>Կամ գրանցվել՝ </p>
              <p onClick={enterWithGoogle} className='alternatives_selection'>Google</p>
            </div>
          </form>
        )
      }
    </Formik>
  )
}

export default Register