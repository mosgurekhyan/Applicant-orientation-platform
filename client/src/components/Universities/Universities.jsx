import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import './Universities.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/routes'

function Universities() {
  const { universities, setUniversities, serverURL } = useContext(UseContext)
  const { pathname } = useLocation()
  const [ send, setSend ] = useState(true)
  const navigate = useNavigate()

  useEffect(() => window.scrollTo(0, 0), [])

  useLayoutEffect(() => {
    if (!universities?.length && send) {
      instance
      .get('/universities')
      .then(res => {
        setUniversities(res.data)
        if (res.data.length === 0) {
          setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ universities, send, setUniversities ])

  const deleteUniversity = id => {
    instance
    .delete(`/universities/${id}`)
    .then(() => setUniversities(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }
  
  return (
    <div className={`universities ${pathname === ROUTES.PROFILE && 'university_background'}`}>
      <h2 className={`universities_title ${pathname === ROUTES.PROFILE && 'black_color'}`}>ՀՀ բարձրագույն ուսումնական հաստատությաուններ</h2>
      <div className="universities-data">
        {
          universities?.map(university => 
            <div onClick={() => navigate(`${ROUTES.UNIVERSITIES}/${university._id}`)} className='university' key={university._id}>
              <img src={`${serverURL}/${university.img}`} className='university_img' alt="" />
              {
                pathname === ROUTES.PROFILE &&
                <div className="university_btns">
                  <button onClick={e => { e.stopPropagation(); navigate(`/editpage/university/${university._id}`) }} className='university_btn'>Փոփոխել</button>
                  <button onClick={e => { e.stopPropagation(); deleteUniversity(university._id) }} className='university_btn'>Ջնջել</button>
                </div>
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Universities