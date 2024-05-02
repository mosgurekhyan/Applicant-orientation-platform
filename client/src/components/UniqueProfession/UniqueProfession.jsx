import { useParams } from 'react-router-dom'
import './UniqueProfession.css'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import instance from '../../api/axios'
import SmallLoadingSpinner from '../SmallLoadingSpinner/SmallLoadingSpinner'
import { UseContext } from '../../App'

function UniqueProfession() {
  const { id } = useParams()
  const [ profession, setProfession ] = useState(null)
  const { serverURL } = useContext(UseContext)

  useEffect(() => window.scrollTo(0, 0), [])

  useLayoutEffect(() => {
    instance
    .get(`/professions/unique?id=${id}`)
    .then(res => setProfession(res.data))
    .catch(err => console.log('Error:', err))
  }, [ id ])

  return (
    <div className={`unique_profession_page ${!profession && 'align_center'}`}>
      {
        !profession ? <SmallLoadingSpinner/> :
        <div className='unique_profession'>
          <h1 className='unique_profession_title'>{profession.title}</h1>
          <img src={`${serverURL}/${profession.img}`} alt="" className="unique_profession_img" />
          <h2 className='unique_profession_subtitle'>Կրթական ծրագրի մասին</h2>
          <div className='unique_profession_text_wrapper'>
            {
              profession.aboutText.split('<br>').map((e, i) => 
                <p key={i} className='unique_profession_text'>{e}</p>
              )
            }
          </div>
          <div className="unique_profession_wrapper">
            <p className='unique_profession_duration'>Ուսման տևողությունը։  {profession.duration}</p>
            <div className="unique_profession_line"></div>
            <p className='unique_profession_duration'>Ուսման վարձը։  {profession.tuition} դրամ</p>
          </div>
          {
            !!profession.jobs.length && 
            <>
              <h2 className='unique_profession_opportunity'>Կարիերայի հնարավորություն</h2>
              <div className="unique_profession_jobs">
                {
                  profession.jobs.map(e => 
                    <a href={e.link} key={e._id} className="unique_profession_data">
                      <img src={`${serverURL}/${e.img}`} alt="" className="unique_profession_data_img" />
                      <p className='unique_profession_job'>{e.title}</p>
                    </a>
                  )
                }
              </div>
            </>
          }
        </div>
      }
    </div>
  )
}

export default UniqueProfession