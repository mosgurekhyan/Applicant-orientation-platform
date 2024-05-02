import { useContext, useRef } from 'react'
import './InsertEmail.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'

function InsertEmail() {
  const { showInsertEmail, setShowInsertEmail, setShowVerify, setOtp, setEmail } = useContext(UseContext)
  const inputRef = useRef()

  const sendOtp = e => {
    e.preventDefault()
    setEmail(inputRef.current?.value)
    instance
    .post(`/register/sendotp`, { email: inputRef.current?.value })
    .then(res => {
      setShowVerify(true)
      setOtp(res.data)
    })
    .catch(err => console.log('Error:',err))
  }

  return (
    <>
      {
        showInsertEmail && 
        <div className='insert-email'>
          <div className='insert-email-container'>
            <h1 className='insert-email_title'>Նոր գաղտնաբառ 🔒️</h1>
            <p className='insert-email_description'>Լրացրեք ձեր էլեկտրոնային հասցեն գաղտնաբառը վերականգնելու համար։</p>
            <hr className='hr2'></hr>
            <form onSubmit={sendOtp}>
              <label className='login-label'>էլեկտրոնային հասցե</label>
              <input 
                ref={inputRef}
                className="insert-email-input"
                type='text'
                name='email'
                autoFocus                  
              />
              <div className="insert-email_wrapper">
                <button className='inser-imail_btn1' onClick={() => setShowInsertEmail(false)} type='button'>Հետ</button>
                <button className='inser-imail_btn2' type='submit'>Ուղարկել ուղեցույցը</button>
              </div>
            </form>
            <hr className='hr2'></hr>
          </div>
        </div>
      }
    </>
  )
}

export default InsertEmail