import './News.css'
import video from '../../assets/videos/dimord.mp4'
import { useContext, useLayoutEffect, useRef, useState } from 'react'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import moment from 'moment'
import ROUTES from '../../routes/routes'
import { useLocation, useNavigate } from 'react-router-dom'

function News() {
  const [ isPlaying, setIsPlaying ] = useState(false)
  const [ isHovered, setIsHovered ] = useState(false)
  const { news, setNews } = useContext(UseContext)
  const [ send, setSend ] = useState(true)
  const { pathname } = useLocation()
  const videoRef = useRef(null)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!news?.length && send) {
      if (pathname === ROUTES.HOME) {
        instance
        .get('/news/lastfour')
        .then(res => {
          setNews(res.data)
          if (!res.data.length) {
            setSend(false)
          }
        })
        .catch(err => console.log('Error:',err))
      } else {
        instance
        .get('/news')
        .then(res => {
          setNews(res.data)
          if (!res.data.length) {
            setSend(false)
          }
        })
        .catch(err => console.log('Error:',err))
      }
    }
  }, [ news, setNews, send, pathname ])

  const togglePlayback = () => {
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const deleteNews = id => {
    instance
    .delete(`/news/${id}`)
    .then(() => setNews(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }

  return (
    <>
      {
        pathname === ROUTES.HOME ? 
        <div className='news'>
          <div className="news-container">
            <p className="news-container_title">Վերջին նորությունները</p>
            <hr className='news-container_hr' />
            <div className="news-container-data">
              {
                news?.map(e => 
                  <div className='news-container-data-container' key={e._id}>
                    <p className='news-container-data-container_title'>{e.title}</p>
                    <p className='news-container-data-container_createdat'>
                      <i className="fa-regular fa-clock"></i>
                      {moment(e.createdAt).format('YYYY-MM-DD')}
                    </p>
                  </div>
                )
              }   
            </div>
            <span className='news-container_read-more'>
              <p className='news-container_read-more_btn'>Ավելին տեսնելու համար →</p>
            </span>
          </div>
          <div className="news-container">
            <p className="news-container_title">Dimord.am կայքով ընդունելության դիմում-հայտը լրացնելու ուղեցույց</p>
            <hr className='news-container_hr' />
            <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="news-video-container">
              <video ref={videoRef} src={video}></video>
              {
                (isHovered || !isPlaying) &&
                <i onClick={togglePlayback} className={`video_btn fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              }
            </div>
          </div>
        </div> :
        <div className="profile_news-container">
          {
            news?.map(e => 
              <div className='news-container-data-container' key={e._id}>
                <p className='news-container-data-container_title'>{e.title}</p>
                <p className='news-container-data-container_createdat'>
                  <i className="fa-regular fa-clock"></i>
                  {moment(e.createdAt).format('YYYY-MM-DD')}
                </p>
                <div className="news_btns">
                  <button onClick={() => navigate(`/editpage/news/${e._id}`)} className='news_btn'>Փոփոխել</button>
                  <button onClick={() => deleteNews(e._id)} className='news_btn'>Ջնջել</button>
                </div>
              </div>
            )
          } 
        </div>
      }
    </>
  )
}

export default News