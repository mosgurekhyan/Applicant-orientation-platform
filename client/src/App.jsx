import { Suspense, createContext, lazy, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './pages/Layout/Layout'
import BigLoadingSpinner from './components/BigLoadingSpinner/BigLoadingSpinner'
import ROUTES from './routes/routes'
import instance from './api/axios'

const Errors = lazy(() => import('./pages/Errors/Errors'))
const Home = lazy(() => import('./components/Home/Home'))
const Feedback = lazy(() => import('./components/Feedback/Feedback'))
const Procedures = lazy(() => import('./components/Procedures/Procedures'))
const Statistics = lazy(() => import('./components/Statistics/Statistics'))
const Universities = lazy(() => import('./components/Universities/Universities'))
const Selections = lazy(() => import('./components/Selections/Selections'))
const AddPage = lazy(() => import('./components/AddPage/AddPage'))
const EditPage = lazy(() => import('./components/EditPage/EditPage'))
const About = lazy(() => import('./components/About/About'))
const Test = lazy(() => import('./components/Test/Test'))
const Profile = lazy(() => import('./components/Profile/Profile'))
const UniqueUniversity = lazy(() => import('./components/UniqueUniversity/UniqueUniversity'))
const UniqueProfession = lazy(() => import('./components/UniqueProfession/UniqueProfession'))

function App() {
  const [ news, setNews ] = useState([])
  const [ currentUser, setCurrentUser ] = useState(null)
  const [ email, setEmail ] = useState(null)
  const [ otp, setOtp ] = useState(null)
  const [ showVerify, setShowVerify ] = useState(false)
  const [ forButtonAppearing, setForButtonAppearing ] = useState(false)
  const [ forVerify, setForVerify ] = useState(false)
  const [ showPasswordChanging, setShowPasswordChanging ] = useState(false)
  const [ emailError, setEmailError ] = useState(null)
  const [ showInsertEmail, setShowInsertEmail ] = useState(false)
  const [ selection, setSelection ] = useState('login')
  const [ index, setIndex ] = useState(0)
  const [ temporaryUser, setTemporaryUser ] = useState(null)
  const [ flag, setFlag ] = useState(false)
  const [ showVerifyButton, setShowVerifyButton ] = useState(false)
  const [ professions, setProfessions ] = useState([])
  const [ universities, setUniversities ] = useState([])
  const [ procedures, setProcedures ] = useState([])
  const [ statistics, setStatistics ] = useState([])
  const [ tokenError, setTokenError ] = useState(null)
  const [ statisticsData, setStatisticsData ] = useState(null)
  const [ savedProfessions, setSavedProfessions ] = useState(null)
  const [ jobs, setJobs ] = useState([])
  const [ serverURL ] = useState('http://localhost:3000')

  useEffect(() => {
    if (tokenError === 'AccessTokenRequired') {
      instance 
      .post(`/login/refresh`)
      .then(() => setTokenError(null))
      .catch(err => console.log('Error:',err))
    } else if (tokenError === 'LogoutRequired') {
      localStorage.removeItem('userData')
    } 
  }, [ tokenError, setTokenError ])

  useEffect(() => {
    if (currentUser) {
      instance
      .get(`/users/unique?id=${currentUser._id}`)
      .then(res => setSavedProfessions(res?.data?.savedProfessions))
      .catch(err => console.log('Error:',err))
    }
  }, [ currentUser ])

  useLayoutEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem(`userData`)))
  }, [ setCurrentUser ]) 

  useLayoutEffect(() => {
    setTemporaryUser(JSON.parse(localStorage.getItem(`temporaryUser`)))
  }, [ setCurrentUser ])  

  const enterWithGoogle = useMemo(() => {
    return () => window.open("http://localhost:3000/auth/google", "_self")
  }, [])

  useLayoutEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await instance.get('/auth/login/success')
        if (response.status === 200) {
          const resObject = response.data
          instance
          .get(`/users?id=${resObject.user.id}`)
          .then(res => {
            if (res.data) {
              setCurrentUser(res.data)
              localStorage.setItem(`userData`, JSON.stringify(res.data))
            } else {
              setTemporaryUser(resObject.user)
              localStorage.setItem('temporaryUser', JSON.stringify(resObject.user))
            }
          })
          .catch(err => console.log('Error:',err))
        } else {
          throw new Error("Authentication has failed!")
        }
      } catch (err) {
        console.error(err)
      }
    }
    getCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path={ROUTES.HOME} element={<Layout/>} >
          <Route index element={<Suspense fallback={<BigLoadingSpinner/>}><Home/></Suspense>} />
          <Route path={ROUTES.UNIVERSITIES} element={<Suspense fallback={<BigLoadingSpinner/>}><Universities/></Suspense>} />
          <Route path={ROUTES.FEEDBACK} element={<Suspense fallback={<BigLoadingSpinner/>}><Feedback/></Suspense>} />
          <Route path={ROUTES.PROCEDURES} element={<Suspense fallback={<BigLoadingSpinner/>}><Procedures/></Suspense>} />
          <Route path={ROUTES.STATISTICS} element={<Suspense fallback={<BigLoadingSpinner/>}><Statistics/></Suspense>} />
          <Route path={ROUTES.SELECTIONS} element={<Suspense fallback={<BigLoadingSpinner/>}><Selections/></Suspense>} />
          <Route path={ROUTES.UNIQUE_UNIVERSITY} element={<Suspense fallback={<BigLoadingSpinner/>}><UniqueUniversity/></Suspense>} />
          <Route path={ROUTES.UNIQUE_RROFESSION} element={<Suspense fallback={<BigLoadingSpinner/>}><UniqueProfession/></Suspense>} />
          {
            (currentUser?.role === 'admin' || currentUser?.role === 'redactor') &&
            <>
              <Route path={ROUTES.ADDPAGE} element={<Suspense fallback={<BigLoadingSpinner/>}><AddPage/></Suspense>} />
              <Route path={ROUTES.EDITPAGE} element={<Suspense fallback={<BigLoadingSpinner/>}><EditPage/></Suspense>} />
            </>
          }
          <Route path={ROUTES.ABOUT} element={<Suspense fallback={<BigLoadingSpinner/>}><About/></Suspense>} />
          { currentUser && 
            <>
              <Route path={ROUTES.PROFILE} element={<Suspense fallback={<BigLoadingSpinner/>}><Profile/></Suspense>} />
              <Route path={ROUTES.TEST} element={<Suspense fallback={<BigLoadingSpinner/>}><Test/></Suspense>} />
            </>
          }
        </Route>
        <Route path='*' element={<Suspense fallback={<BigLoadingSpinner/>}><Errors/></Suspense>} />
      </>
    )
  )

  const providerValue = useMemo(() => ({ email, setEmail, otp, setOtp, showVerify, setShowVerify, forButtonAppearing, setForButtonAppearing, forVerify, setForVerify, showPasswordChanging, setShowPasswordChanging, emailError, setEmailError, currentUser, setCurrentUser, showInsertEmail, setShowInsertEmail, news, setNews, selection, setSelection, index, setIndex, flag, setFlag, temporaryUser, setTemporaryUser, showVerifyButton, setShowVerifyButton, professions, setProfessions, universities, setUniversities, procedures, setProcedures, statistics, setStatistics, enterWithGoogle, statisticsData, setStatisticsData, savedProfessions, setSavedProfessions, serverURL, setTokenError, jobs, setJobs }), [ email, setEmail, otp, setOtp, showVerify, setShowVerify, forButtonAppearing, setForButtonAppearing, forVerify, setForVerify, showPasswordChanging, setShowPasswordChanging, emailError, setEmailError, currentUser, setCurrentUser, showInsertEmail, setShowInsertEmail, news, setNews, selection, setSelection, index, setIndex, flag, setFlag, temporaryUser, setTemporaryUser, showVerifyButton, setShowVerifyButton, professions, setProfessions, universities, setUniversities, procedures, setProcedures, statistics, setStatistics, enterWithGoogle, statisticsData, setStatisticsData, savedProfessions, setSavedProfessions, serverURL, setTokenError, jobs, setJobs ])

  return (
    <UseContext.Provider value={providerValue}>
      <RouterProvider router={router} />
    </UseContext.Provider>
  )
}

export default App
export const UseContext = createContext([])