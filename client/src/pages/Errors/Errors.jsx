import { useNavigate } from "react-router-dom"
import './Errors.css'
import ROUTES from "../../routes/routes"
import { useEffect, useState } from "react"
import BigLoadingSpinner from "../../components/BigLoadingSpinner/BigLoadingSpinner"

function Errors() {
  const navigate = useNavigate()
  const [ wait, setWait ] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setWait(false)
    }, 2000)
  }, [])

  return (
    <>
      {
        wait ? <BigLoadingSpinner/> :
        <div className="error-page">
          <h1 className="error_text">Error 404, Page not found</h1>
          <button onClick={() => navigate(ROUTES.HOME)}>Go to Home</button>
        </div>
      }
    </>
  )
}

export default Errors