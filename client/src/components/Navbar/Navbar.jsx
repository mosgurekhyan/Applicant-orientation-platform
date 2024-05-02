import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ROUTES from '../../routes/routes'
import './Navbar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { UseContext } from '../../App'
import logo from '../../assets/images/logo.png'
import instance from '../../api/axios'

function Navbar() {
  const navigate = useNavigate()
  const [ showMatchingProfessions, setShowMatchingProfessions ] = useState(false)
  const [ matchingProfessions, setMatchingProfessions ] = useState([])
  const [ showInput, setShowInput ] = useState(false)
  const [ showSelections, setShowSelections ] = useState(false)
  const [ selectionsWidth, setSelectionsWidth ] = useState(0)
  const { currentUser, setCurrentUser, professions, setProfessions, serverURL } = useContext(UseContext)
  const [ send, setSend ] = useState(true)
  const ref = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.offsetWidth
      setSelectionsWidth(width)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ref.current ])

  useEffect(() => {
    const handleClickOutside = event => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSelections(false)
      }
    }

    document.body.addEventListener('click', handleClickOutside)

    return () => document.body.removeEventListener('click', handleClickOutside)
  }, [ref])

  const logOut = () => {
    window.open(`${serverURL}/auth/logout`, "_self")
    setShowSelections(false)
    setCurrentUser(null)
    localStorage.removeItem('userData')
  }

  useLayoutEffect(() => {
    if (!professions?.length && send) {
      instance
      .get('/professions')
      .then(res => {
        setProfessions(res.data)
        if (!res.data.length) {
          setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ professions, setProfessions, send ])

  const handleSearch = e => {
    e.preventDefault()
    const searchQuery = searchInputRef.current.value.trim().toLowerCase()
    const foundProfessions = professions?.filter(profession => profession.title.toLowerCase() === searchQuery)
    setMatchingProfessions(foundProfessions)
    if (foundProfessions.length) {
      setShowMatchingProfessions(true)
    } else {
      alert(`No profession found with the name '${searchQuery}'`)
    }
    searchInputRef.current.value = ''
  }

  return (
    <nav>
      { showMatchingProfessions && <div className="search_overlay"></div> }
      { showMatchingProfessions && 
        <div className="matching_professions">
          <h4 className="matching_professions_title">Գտնվեց {matchingProfessions.length} մասնագիտություն</h4>
          <div className="matching_professions_data">
            {
              matchingProfessions?.map(e => 
                <div onClick={() => { navigate(`/professions/${e._id}`), setShowMatchingProfessions(false) }} className='matching_profession' key={e._id}>
                  <img className='matching_profession_img' src={`${serverURL}/${e.img}`} alt="" />
                  <div className='matching_profession_container'>
                    <p className='matching_profession_title'>{e.title}</p>
                    <p className='matching_profession_university'>{e.university}</p>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      }
      <img onClick={() => navigate(ROUTES.HOME)} className='navbar_logo' src={logo} alt="" />
      <ul>
        <li><NavLink className={({isActive}) => isActive ? 'active_color' : 'prefered_color'} to={ROUTES.HOME}>Գլխավոր էջ</NavLink></li>
        <li><NavLink className={({isActive}) => isActive ? 'active_color' : 'prefered_color'} to={ROUTES.UNIVERSITIES}>Բուհեր</NavLink></li>
        <li><NavLink className={({isActive}) => isActive ? 'active_color' : 'prefered_color'} to={ROUTES.PROCEDURES}>Նորություններ</NavLink></li>
        <li><NavLink className={({isActive}) => isActive ? 'active_color' : 'prefered_color'} to={ROUTES.STATISTICS}>Վիճակագրություններ</NavLink></li>
        <li><NavLink className={({isActive}) => isActive ? 'active_color' : 'prefered_color'} to={ROUTES.FEEDBACK}>Հետադարձ կապ</NavLink></li>
      </ul>
      <form onSubmit={handleSearch} className='search-bar'>
        { showInput && <input ref={searchInputRef} autoFocus={showInput} className='search-bar_input' type="text" /> }
        <i onClick={() => setShowInput(true)} className="fa-solid fa-magnifying-glass search_icon"></i>
      </form>
      { currentUser &&
        <div ref={ref} className='navbar-selections'>
          <p onClick={() => setShowSelections(true)} className={`username ${showSelections && 'unvisible'}`}>{currentUser?.fullName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0]}</p>
          {
            showSelections &&
            <div style={{ width: selectionsWidth + 40 }} className='navbar-selections-container'>
              <div className='user-data'>
                <figure className="user-img-wrapper">
                  <p>{currentUser?.fullName?.split(' ')[1].split('')[0]}</p>
                </figure>
                <p className='user_name'>{currentUser?.fullName?.split(' ')[0]}</p>
              </div>
              <p onClick={() => {navigate(ROUTES.PROFILE); setShowSelections(false)}} className='navbar_selection'>Իմ էջը</p>
              <p onClick={logOut} className='navbar_selection'>Դուրս գալ</p>
            </div>
          }
        </div>
      }
    </nav>
  )
}

export default Navbar