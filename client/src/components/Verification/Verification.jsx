import { useContext, useEffect, useRef } from 'react'
import './Verification.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'

function Verification() {
  const { setEmailError, setShowInsertEmail, setShowVerifyButton, showVerify, otp, email, setForVerify, setOtp, forButtonAppearing, setForButtonAppearing, setShowVerify, setShowPasswordChanging, emailError, setSelection } = useContext(UseContext)

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ]

  useEffect(() => {
    if (showVerify) {
      inputRefs[0].current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ showVerify] )

  const focusNextInput = index => {
    if (index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus()
    }
  }

  const focusPrevInput = index => {
    if (index > 0) {
      inputRefs[index - 1].current.focus()
    }
  }

  const handleInputChange = (e, index) => {
    let value = e.target.value  
    value = value.replace(/[^\d]/g, '')  
  
    if (value.length > 1) {
      value = value.slice(0, 1)
    }
  
    e.target.value = value
  
    if (value === '') {
      focusPrevInput(index)
    } else {
      if (index < inputRefs.length - 1) {
        focusNextInput(index)
      } else {
        const userCode = inputRefs.map(ref => ref.current.value).join('')
        if (userCode === otp) {
          setForButtonAppearing(1)
        } else {
          setForButtonAppearing(0)
        }
      }
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.keyCode === 8 && inputRefs[index].current.value === '') {
      e.preventDefault()
      focusPrevInput(index)
    }
  }

  const verifyEmail = () => {
    instance
    .patch('/register/verify', { email })
    .then(() => {
      setForVerify(false)
      setForButtonAppearing(false)
      setShowVerifyButton(false)
      setShowVerify(false)
      setOtp(null)
      setShowInsertEmail(false)
      setSelection('login')
      if (emailError === `email isn't verified`) {
        setShowPasswordChanging(true)
      }
      setEmailError(null)
    })
    .catch(err => console.log(err))
  }

  return (
    <>
      {
        showVerify &&
        <div className="examination">
          <h3 className='examination_title'>Գրեք վեցանիշ թիվը</h3>
          <div className="otp_numbers">
            {
              inputRefs.map((ref, i) => 
              <input key={i} onKeyDown={(e) => handleKeyDown(e, i)} type="number" id={`ver${i}`} className="otp_input" ref={ref} onChange={(e) => handleInputChange(e, i)}/>
              )
            }
          </div>
          <p style={{opacity: forButtonAppearing === 0 && '1'}} className="incorrect_code">Սխալ</p>
          <button type="button" onClick={verifyEmail} style={{opacity: forButtonAppearing === 1 && '1'}} className="verify_button">Հաստատել</button>
        </div>
      }
    </>
  )
}

export default Verification