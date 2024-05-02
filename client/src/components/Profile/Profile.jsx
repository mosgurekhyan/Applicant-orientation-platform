import { useContext, useEffect, useRef } from 'react'
import './Profile.css'
import { UseContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/routes'
import Professions from '../Professions/Professions'
import Universities from '../Universities/Universities'
import News from '../News/News'
import Procedures from '../Procedures/Procedures'
import Statistics from '../Statistics/Statistics'
import StatisticsData from '../StatisticsData/StatisticsData'
import instance from '../../api/axios'
import Jobs from '../Jobs/Jobs'

function Profile() {
  const { currentUser, savedProfessions, setSavedProfessions, serverURL } = useContext(UseContext)
  const navigate = useNavigate()
  const lastClickTimestamp = useRef(0)

  useEffect(() => window.scrollTo(0, 0), [])

  const saveProfession = professionId => {
    if (currentUser) {
      const currentTimestamp = Date.now()
      if (professionId && currentUser._id) { 
        let newProfession
        const isNewlySaved = !savedProfessions.some(savedProfession => savedProfession._id === professionId)
        if (isNewlySaved) {
          newProfession = { _id: `${professionId}-${currentTimestamp}` }
          setSavedProfessions(prevSavedProfessions => [...prevSavedProfessions, newProfession])
        } else {
          setSavedProfessions(
            prevSavedProfessions => prevSavedProfessions.filter(savedProfession => savedProfession._id !== professionId)
          )
        }

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
    <div className='profile'>
      <div className="profile-container">
        <figure className="profile-img">
          <p className='name-letter'>{currentUser?.fullName?.split(' ')[1].split('')[0]}</p>
        </figure>
        <p className="profile-name">{currentUser?.fullName}</p>
        <p className='profile-role'>{currentUser?.role}</p>
        <div className="profile-saved-professions-container">
          <h2 className='profile-saved-professions-container_title'>Իմ նախընտրած մասնագիտությունները</h2>
          <div className='profile-selected_professions'>
            {
              currentUser?.professions.map(e => 
                <p className='profile-selected_profession' key={e._id}>{e.title}</p>
              )
            }
          </div>
        </div>
        <div className="profile-saved-professions">
          {
            savedProfessions?.map(e => 
              <div className='saved-profession' key={e._id}>
                <img src={`${serverURL}/${e.img}`} className='saved-profession_img' alt="" />
                <i onClick={() => saveProfession(e._id)} className={ `fa-bookmark ${savedProfessions.some(savedProfession => savedProfession._id === e._id) ? 'fa-solid' : 'fa-regular'}`}></i>
              </div>
            )
          }
        </div>
        {
          (currentUser?.role === 'admin' || currentUser?.role === 'redactor') && 
          <div className="admin-universities">
            <button onClick={() => navigate(ROUTES.ADDPAGE)} className='admin-universities_btn'>Անցնել թարմացումների էջ</button>
            <Universities/><br />
            <h2 className='admin-universities_title'>Կրթական ծրագրեր</h2>
            <Professions/>
            <h2 className='admin-universities_title'>Նորություններ</h2>
            <News/>
            <h2 className='admin-universities_title'>Հայտարարություններ</h2>
            <Procedures/>
            <h2 className='admin-universities_title'>Վիճակագրություններ քննությունների մասին</h2>
            <Statistics/>
            <h2 className='admin-universities_title'>Վիճակագրություններ</h2>
            <StatisticsData/>
            <h2 className='admin-universities_title'>Աշխատանքներ</h2>
            <Jobs/>
          </div>
        }
      </div>
    </div>
  )
}

export default Profile