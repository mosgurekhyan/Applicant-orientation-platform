import { useLocation, useNavigate } from 'react-router-dom'
import './StatisticsData.css'
import ROUTES from '../../routes/routes'
import { useContext, useLayoutEffect, useState } from 'react'
import { UseContext } from '../../App'
import instance from '../../api/axios'

function StatisticsData() {
  const { statisticsData, setStatisticsData, serverURL } = useContext(UseContext)
  const { pathname } = useLocation()
  const [ send, setSend ] = useState(true)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!statisticsData?.length && send) {
      instance
      .get('/statistics-data')
      .then(res => {
        setStatisticsData(res.data)
        if (!res.data.length) {
        setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ statisticsData, setStatisticsData, send ])

  const deleteStatisticData = id => {
    instance
    .delete(`/statistics-data/${id}`)
    .then(() => setStatisticsData(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }

  return (
    <>
      {
        pathname !== ROUTES.PROFILE ?
        <div className='statistics_data'>
          {
            statisticsData?.map(e => 
              <div className='statistic_data' key={e._id}>
                <img className='statistic_data_img' src={`${serverURL}/${e.img}`} alt="" />
                <p className="statistic_data_title">{e.title}</p>
              </div>
            )
          }
          <div className="pagination">
            <span className="pagination_span">1</span>
            <div className="pagination_element_wrapper">
              <p className='pagination_number'>2</p>
            </div>
            <div className="pagination_element_wrapper">
              <p className='pagination_number'>3</p>
            </div>
            <div className="pagination_element_wrapper">
              <p className='pagination_number'>4</p>
            </div>
            <p className="pagination_dots">...</p>
            <div className="pagination_element_wrapper">
              <p className='pagination_number'>8</p>
            </div>
            <p className="pagination_next">հաջորդը</p>
            <i className="pagination_icon fa-solid fa-chevron-right"></i>
          </div>
        </div> :
        <div className="statistics_data">
          {
            statisticsData?.map(e => 
              <div className='statistic_data' key={e._id}>
                <img className='statistic_data_img' src={`${serverURL}/${e.img}`} alt="" />
                <p className="statistic_data_title">{e.title}</p>
                <div className="statistic_data_btns">
                  <button onClick={() => navigate(`/editpage/statistic-data/${e._id}`)} className='statistic_data_btn'>Փոփոխել</button>
                  <button onClick={() => deleteStatisticData(e._id)} className='statistic_data_btn'>Ջնջել</button>
                </div>
              </div>
            )
          }
        </div>
      }
    </>
  )
}

export default StatisticsData