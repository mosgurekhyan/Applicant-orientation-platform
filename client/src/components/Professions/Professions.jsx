import { useContext, useLayoutEffect, useState } from 'react'
import './Professions.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/routes'

function Professions() {
  const navigate = useNavigate()
  const { professions, setProfessions, serverURL } = useContext(UseContext)
  const { pathname } = useLocation()
  const [ send, setSend ] = useState(true)

  useLayoutEffect(() => {
    if (!professions?.length && send) {
      instance
      .get('/professions')
      .then(res => {
        setProfessions(res.data)
        if (!res.data.length) {
          setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ professions, send, setProfessions ])

  const deleteProfession = id => {
    instance
    .delete(`/professions/${id}`)
    .then(() => setProfessions(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }

  return (
    <div className={`professions ${!professions?.length && 'professions_additional_property'}`}>
      { 
        professions?.map(profession => 
          <div className='profession' key={profession._id}>
            <img src={`${serverURL}/${profession.img}`} className='profession_img' alt="" />
            {
              pathname === ROUTES.PROFILE &&
              <div className="profession_btns">
                <button onClick={e => { e.stopPropagation(); navigate(`/editpage/profession/${profession._id}`) }} className='profession_btn'>Փոփոխել</button>
                <button onClick={e => { e.stopPropagation(); deleteProfession(profession._id) }} className='profession_btn'>Ջնջել</button>
              </div>
            }
          </div>
        )
      }
    </div>
  )
}

export default Professions