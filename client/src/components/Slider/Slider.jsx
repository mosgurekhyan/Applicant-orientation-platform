import './Slider.css'
import { Fragment, useContext, useEffect } from 'react'
import { slides } from '../../constants/slides'
import { useNavigate } from 'react-router-dom'
import { UseContext } from '../../App'
import ROUTES from '../../routes/routes'

function Slider() {
  const { currentUser, index, setIndex, flag } = useContext(UseContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (flag) {
      let slider = setInterval(() => {
        setIndex(index + 1)
      }, 2500)
      const lastIndex = slides.length - 1
      if (index < 0) {
        setIndex(lastIndex)
      }
      if (index > lastIndex) {
        setIndex(0)
      }
      return () => clearInterval(slider)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ index, slides, flag ])

  return (
    <div className='slider'>
      {
        slides?.map((e, i) => {
          const { id, img, route } = e
          let position = "next-slide"
          if (i === index) {
            position = "active-slide"
          }
          if (
            i === index - 1 || (index === 0 && i === slides?.length - 1)
          ) {
            position = "last-slide"
          }

          return (
            <Fragment key={id}>
              <div className='arrows-container'>
                <span onClick={() => setIndex(prevIndex => (prevIndex - 1 + slides?.length) % slides?.length)} className='arrow-span'>
                  <i className='fa-solid fa-angle-left'></i>
                </span>
                <span onClick={() => setIndex(prevIndex => (prevIndex + 1) % slides?.length)} className='arrow-span'>
                  <i className='fa-solid fa-angle-right'></i>
                </span>
              </div>
              <article onClick={() => navigate((route === ROUTES.TEST && !currentUser) ? ROUTES.SELECTIONS : route)} className={position}>
                <div className='dots'>
                  {
                    slides?.map((_, dotIndex) => 
                      <div key={dotIndex} onClick={() => setIndex(dotIndex)} className={`${dotIndex === index ? 'dot2' : 'dot1'}`}></div>
                    )
                  }
                </div>
                <img src={img} className="slider-img" alt="" />
              </article>
            </Fragment>
          )
        })
      }
    </div>
  )
}

export default Slider