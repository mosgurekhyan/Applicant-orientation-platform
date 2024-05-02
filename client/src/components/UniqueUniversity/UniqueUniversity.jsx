import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './UniqueUniversity.css'
import { useNavigate, useParams } from 'react-router-dom'
import instance from '../../api/axios'
import SmallLoadingSpinner from '../SmallLoadingSpinner/SmallLoadingSpinner'
import { UseContext } from '../../App'
import ROUTES from '../../routes/routes'

function UniqueUniversity() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, savedProfessions, setSavedProfessions, serverURL } = useContext(UseContext)
  const [ university, setUniversity ] = useState([])
  const lastClickTimestamp = useRef(0)

  useEffect(() => window.scrollTo(0, 0), [])

  useLayoutEffect(() => {
    instance
    .get(`/universities/unique-professions?id=${id}`)
    .then(res => setUniversity(res.data))
    .catch(err => console.log('Error:', err))
  }, [ id ])

  const saveProfession = professionId => {
    if (currentUser) {
      const currentTimestamp = Date.now()
      if (professionId && currentUser._id) {  
        setSavedProfessions(prevSavedProfessions => [
          ...prevSavedProfessions,
          { _id: professionId } 
        ])
        if (currentTimestamp - lastClickTimestamp.current > 500) {
          lastClickTimestamp.current = currentTimestamp 

          instance
          .post('/users/save-profession', { userId: currentUser._id, professionId })
          .then(res => setSavedProfessions(res.data.savedProfessions))
          .catch(err => console.log('Error:', err))
        }
      }
    } else {
      navigate(ROUTES.SELECTIONS)
    }
  }

  return (
    <div className='unique_university'>
      <h2>{university?.name}</h2>
      {
        !university ? <SmallLoadingSpinner/> :
        <div className="unique_university-professions">
          {
            university?.professions?.map(profession => 
              <div onClick={() => navigate(`/professions/${profession._id}`)} className='unique_university-professions_profession' key={profession._id}>
                <img src={`${serverURL}/${profession.img}`} className='unique_university-professions_profession_img' alt="" />
                <i onClick={e => { e.stopPropagation(), saveProfession(profession._id) }} className={ `fa-bookmark ${savedProfessions?.some(savedProfession => savedProfession._id === profession._id) ? 'fa-solid' : 'fa-regular'}`}></i>
              </div>
            )
          }
        </div>
      }
    </div>
  )
}

export default UniqueUniversity