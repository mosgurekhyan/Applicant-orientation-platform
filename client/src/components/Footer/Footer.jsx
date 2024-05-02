import ROUTES from '../../routes/routes'
import './Footer.css'
import { useNavigate } from "react-router-dom"

function Footer() {
  const navigate = useNavigate()

  return (
    <footer>
      <div className="footer-container1">
        <div className='footer-container1-list'>
          <p className='footer-container1-list_title'>Կապ մեզ հետ</p>
          <a className='footer-container1-list_link' href="tel:+1234567890"><i className="fa-solid fa-phone footer-container1-list_icon"></i>+37496008667</a>
          <a className='footer-container1-list_link' href="mailto:platformorientation@gmail.com"><i className="fa-solid fa-envelope footer-container1-list_icon"></i>platformorientation@gmail.com</a>
        </div>
        <div className='footer-container1-list'>
          <p className='footer-container1-list_title'>Մեր մասին</p>
          <p onClick={() => navigate(ROUTES.ABOUT)} className='footer-container1-list_link'>Մեր մասին</p>
          <p onClick={() => navigate(ROUTES.FEEDBACK)} className='footer-container1-list_link'>Կապ մեզ հետ</p>
        </div>
      </div>
      <div className="footer-intermediate_container">
        <div className="footer-container1-list_websites">
          <span className="footer-container1-list_websites_wrapper">
            <i className="fa-brands fa-facebook footer-container1-list_website_icon"></i>
          </span>
          <span className="footer-container1-list_websites_wrapper">
            <i className="fa-brands fa-x-twitter footer-container1-list_website_icon"></i>
          </span>
          <span className="footer-container1-list_websites_wrapper">
            <i className="fa-brands fa-linkedin-in footer-container1-list_website_icon"></i>
          </span>
        </div>
      </div>
      <div className="footer-container2">
        <span className='footer-container2_text text_color'>Ստեղծվել է <p className='developer_name'>Սիրանուշ Դոխոլյանի</p> կողմից 2024թ.</span>
      </div>
    </footer>
  )
}

export default Footer