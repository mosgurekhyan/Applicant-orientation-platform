import { useContext, useLayoutEffect, useState } from 'react'
import './Statistics.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/routes'
import StatisticsData from '../StatisticsData/StatisticsData'

function Statistics() {
  const { statistics, setStatistics } = useContext(UseContext)
  const [ send, setSend ] = useState(true)
  const [ show, setShow ] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!statistics?.length && send) {
      instance
      .get('/statistics')
      .then(res => {
        setStatistics(res.data)
        if (!res.data.length) {
          setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ statistics, send, setStatistics ])

  const deleteStatistic = id => {
    instance
    .delete(`/statistics/${id}`)
    .then(() => setStatistics(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }

  return (
    <>
      {
        pathname !== ROUTES.PROFILE ?
        <div className='statistics'>
          <h2 className='procedures_title'>Վիճակագրություններ</h2>
          <StatisticsData/>
          <div className="statistics-container">
            <p onClick={() => setShow(!show)} className={`statistics_title ${show && 'margin_bottom'}`}>Օգտակար նյութեր նախորդ տարիների ընդունելության քննությունների մասին</p>
            {
              show &&
              statistics?.map(e => 
                <a href={e.link} key={e._id} className='statistic'>{e.title}</a>
              )
            }
          </div>
        </div> :
        <div className="admin-statistics">
          {
            statistics?.map(e => 
              <div className='admin-statistic' key={e._id}>
                <p>{e.title}</p>
                <p>{e.link}</p>
                <div className="statistic_btns">
                  <button onClick={() => navigate(`/editpage/statistic/${e._id}`)} className='statistic_btn'>Փոփոխել</button>
                  <button onClick={() => deleteStatistic(e._id)} className='statistic_btn'>Ջնջել</button>
                </div>
              </div>
            )
          }
        </div>
      }
    </>
  )
}

export default Statistics