import { useContext, useEffect, useState } from 'react'
import './Jobs.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import { useNavigate } from 'react-router-dom'

function Jobs() {
  const navigate = useNavigate()
  const { jobs, setJobs, serverURL } = useContext(UseContext)
  const [ send, setSend ] = useState(true)

  useEffect(() => {
    if (!jobs?.length && send) {
      instance
      .get('/jobs')
      .then(res => {
        setJobs(res.data)
        if (!res.data.length) {
          setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ jobs, setJobs, send ])

  const deleteJob = id => {
    instance
    .delete(`/jobs/${id}`)
    .then(() => setJobs(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }

  return (
    <div className='jobs'>
      {
        jobs?.map(e => 
          <div key={e._id} className="job">
            <img className='job_img' src={`${serverURL}/${e.img}`} alt="" />
            <div className="job_btns">
              <button onClick={() => deleteJob(e._id)} className='job_btn'>Ջնջել</button>
              <button onClick={() => navigate(`/editpage/job/${e._id}`)} className='job_btn'>Փոփոխել</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Jobs