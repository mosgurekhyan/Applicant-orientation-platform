import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import './Layout.css'
import Footer from '../../components/Footer/Footer'
import ChatBot from '../../components/ChatBot/ChatBot'
import { useContext, useState } from 'react'
import { roles } from '../../constants/roles'
import * as yup from 'yup'
import { Formik } from 'formik'
import instance from '../../api/axios'
import { UseContext } from '../../App'

function Layout() {
  const { pathname } = useLocation()
  const { temporaryUser, setTemporaryUser, setCurrentUser, professions } = useContext(UseContext)
  const [ showRoles, setShowRoles ] = useState(false)
  const [ updatedRoles, setUpdatedRoles ] = useState([...roles])
  const [ showProfessions, setShowProfessions ] = useState(false)
  const [ selectedProfessions, setSelectedProfessions ] = useState([])

  const handleProfessionSelection = e => {
    if (selectedProfessions.includes(e)) {
      setSelectedProfessions(selectedProfessions.filter(item => item !== e))
    } else {
      if (selectedProfessions.length < 4) {
        setSelectedProfessions([...selectedProfessions, e])
      }
    }
  }
  
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

  const validationSchema = yup.object().shape({
    role: yup.string().required("please select a role"),
    professions: yup.array()
    .of(yup.object().shape({_id: yup.string().required()}))
    .max(4, 'You can select a maximum of 4 professions')
  })

  return (
    <>
      { !pathname.startsWith('/test') && <Navbar/> }
      { !pathname.startsWith('/addpage') && !pathname.startsWith('/editpage') && <ChatBot/> }
      <Outlet/>
      { !pathname.startsWith('/test') && !pathname.startsWith('/addpage') && !pathname.startsWith('/editpage') && <Footer/> }
      { temporaryUser &&
        <div className="popup">
          <p className="popup_title">Խնդրում ենք լրացնել </p>
          <Formik
            initialValues = {{
              role: '',
              professions: []
            }}
            onSubmit = {( values, { resetForm } ) => {
              const obj = {
                fullName: temporaryUser.displayName,
                googleId: temporaryUser.id,
                email: temporaryUser.emails[0].value,
                password: temporaryUser.id,
                professions: values.professions,
                role: values.role,
                isVerified: true
              }
              instance
              .post('/register', obj)
              .then(res => {
                setTemporaryUser(null)
                setCurrentUser(res.data)
                localStorage.removeItem('temporaryUser')
                localStorage.setItem('userData', JSON.stringify(res.data))
                resetForm()
              })
              .catch(err => console.log('Error:',err))
            }}
            
            validateOnBlur
            validationSchema = { validationSchema }
            >

            {
              ({ values, errors, touched, isValid, handleSubmit, dirty, setFieldValue }) => (
                <form className='additional-fields' onSubmit={handleSubmit}>
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
                        <p className='role-selection_profession'>Մասնագիտություններ</p>
                        <i className="fa-solid fa-sort-down"></i>
                      </div>
                      {
                        professions.map(e =>
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
                  <button type='submit' disabled={!isValid && !dirty} className='selection_btn additional-fields_btn'>Հաստատել</button>
                </form>
              )
            }
          </Formik>
        </div>
      }
      {temporaryUser && <div className="test_overlay"></div>}
    </>
  )
}

export default Layout