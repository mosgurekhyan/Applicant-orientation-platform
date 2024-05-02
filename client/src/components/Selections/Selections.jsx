import { useContext, useEffect } from 'react'
import './Selections.css'
import Login from '../Login/Login'
import Register from '../Register/Register'
import Verification from '../Verification/Verification'
import { UseContext } from '../../App'
import InsertEmail from '../InsertEmail/InsertEmail'
import PasswordChanging from '../PasswordChanging/PasswordChanging'

function Selections() {
  const { showVerify, selection, setSelection } = useContext(UseContext)
  useEffect(() => scrollTo(0, 0), [])
  
  return (
    <div className='selections'>
      <img src="https://brandio.io/envato/iofrm/html/images/graphic2.svg" alt="" className="selections_img" />
      <div className="selections-container">
        <div className="forms">
          <div className="options">
            <p data-value='login' onClick={e => setSelection(e.target.dataset.value)} className={`option ${selection === 'login' && 'border'} ${selection === 'login' && 'white_color'}`}>Մուտք</p>
            <p data-value='register' onClick={e => setSelection(e.target.dataset.value)} className={`option ${selection === 'register' && 'border'} ${selection === 'register' && 'white_color'}`}>Գրանցվել</p>
          </div>
          { selection === 'login' ? <Login/> : <Register/> }
        </div>
      </div>
      <InsertEmail/>
      <PasswordChanging/>
      <Verification/>
      {showVerify && <div className="overlay"></div>}
    </div>
  )
}

export default Selections