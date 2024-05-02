import { useNavigate } from 'react-router-dom'
import EducationalPrograms from '../EducationalPrograms/EducationalPrograms'
import ForUniversities from '../ForUniversities/ForUniversities'
import News from '../News/News'
import Slider from '../Slider/Slider'
import './Home.css'
import { useContext, useEffect } from 'react'
import { UseContext } from '../../App'
import ROUTES from '../../routes/routes'
import home_img from '../../assets/images/home_img.jpg'

function Home() {
  const navigate = useNavigate()
  const { currentUser, setFlag } = useContext(UseContext)
  
  useEffect(() => {
    scrollTo(0, 0)
    setFlag(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='home'>
      <Slider/>
      <EducationalPrograms/>
      <ForUniversities/>
      <div className="home-header">
        <div className="home-header-container1">
          <p className="home-header-container1_title">Անցի՛ր մասնագիտական կողմնորոշման թեստը</p>
          <p className="home-header-container1_text">Գրանցվեք կայքում և լրացրեք թեստը, որի արդյունքում համակարքը կառանձնացնի ձեր նախասիրություններին համապատասխան ոլորտները, ինչն էլ կհեշտացնի ձեր ընտրությունը</p>
          <button onClick={() => navigate(currentUser ? ROUTES.TEST : ROUTES.SELECTIONS)} className='home-header-container1_btn'>Սկսել թեստը</button>
        </div>
        <div className="home-header-container2">
          <img src={home_img} alt="" className="home-header_img" />
        </div>
      </div>
      <News/>
    </div>
  )
}

export default Home