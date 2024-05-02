import { useContext, useEffect, useState } from 'react'
import ROUTES from '../../routes/routes'
import './ForUniversities.css'
import { useNavigate } from "react-router-dom"
import { UseContext } from '../../App'
import instance from '../../api/axios'

function ForUniversities() {
  const navigate = useNavigate()
  const [ send, setSend ] = useState(true)
  const { universities, setUniversities, serverURL } = useContext(UseContext)

  useEffect(() => {
    if (!universities?.length && send) {
      instance
      .get('/universities')
      .then(res => {
        setUniversities(res.data)
        if (res.data.length === 0) {
          setSend(false)
        }
      })
    }
  }, [ universities, send, setUniversities ])

  return (
    <div className='for_universities'>
      <h2 className='for_universities_title'>ՀՀ բարձրագույն ուսումնական հաստատությաուններ</h2>
      <hr className='for_universities_hr' />
      <div className="for_universities-container">
        {
          universities?.map((e, i) => i < 4 &&
            <div onClick={() => navigate(`${ROUTES.UNIVERSITIES}/${e._id}`)} className='for_universities-container-university' key={e._id}>
              <img src={`${serverURL}/${e.img}`} className='for_universities-container-university_img' alt="" />
            </div>
          )
        }
      </div>
      <p onClick={() => navigate(ROUTES.UNIVERSITIES)} className="for_universities_more">Տեսնել բոլորը</p>
    </div>
  )
}

export default ForUniversities