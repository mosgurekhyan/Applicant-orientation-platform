import { useNavigate, useParams } from 'react-router-dom'
import './EditPage.css'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import instance from '../../api/axios'
import { UseContext } from '../../App'
import SmallLoadingSpinner from '../SmallLoadingSpinner/SmallLoadingSpinner'
import ROUTES from '../../routes/routes'

function EditPage() {
  const navigate = useNavigate()
  const { id, type } = useParams()
  const { professions, universities, setProfessions, news, procedures, statistics, statisticsData, serverURL, jobs, setJobs } = useContext(UseContext)
  const [ currentProfession, setCurrentProfession ] = useState(null)
  const [ currentUniversity, setCurrentUniversity ] = useState(null)
  const [ isImageSelected, setIsImageSelected ] = useState(false)
  const [ selectedImage, setSelectedImage ] = useState(null)
  const [ showProfessions, setShowProfessions ] = useState(false)
  const [ selectedProfessions, setSelectedProfessions ] = useState([])
  const [ send, setSend ] = useState(true)
  const [ send2, setSend2 ] = useState(true)
  const [ selectedImg, setSelectedImg ] = useState(null)
  const [ currentNews, setCurrentNews ] = useState(null)
  const [ currentStatistic, setCurrentStatistic ] = useState(null)
  const [ currentProcedure, setCurrentProcedure ] = useState(null)
  const [ currentStatisticData, setCurrentStatisticData ] = useState(null)
  const [ currentJob, setCurrentJob ] = useState(null)
  const [ isProcedureImgSelected, setIsProcedureImgSelected ] = useState(null)
  const [ isProcedureFileSelected, setIsProcedureFileSelected ] = useState(null)
  const [ procedureImg, setProcedureImg ] = useState(null)
  const [ professionJobs, setProfessionJobs ] = useState([])
  const nameRef = useRef(null)
  const newsRef = useRef(null)

  const professionRefs = {
    title: useRef(null),
    aboutText: useRef(null),
    img: useRef(null),
    duration: useRef(null),
    tuition: useRef(null)
  }

  const procedureRefs = {
    img: useRef(null),
    file: useRef(null)
  }

  const statisticDataRefs = {
    img: useRef(null),
    title: useRef(null)
  }

  const statisticRefs = {
    title: useRef(null),
    link: useRef(null)
  }

  const jobRefs = {
    title: useRef(null),
    link: useRef(null),
    img: useRef(null)
  }

  useEffect(() => {
    if (!jobs?.length && send2) {
      instance
      .get('/jobs')
      .then(res => {
        setJobs(res.data)
        if (!res.data.length) {
          setSend2(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ jobs, setJobs, send2 ])

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
  }, [ professions, send, setProfessions ])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (type === 'profession') {
      if (professions?.some(e => e._id === id)) {
        const foundProfession = professions.find(e => e._id === id)
        setCurrentProfession({ ...foundProfession })
        setProfessionJobs(foundProfession.jobs)
      } else {
        instance
        .get(`/professions/unique/?id=${id}`)
        .then(res => {
          setCurrentProfession(res.data)
          setProfessionJobs(res.data.jobs)
        })
        .catch(err => console.log('Error:', err))
      }
    } else if (type === 'university') {
      const foundUniversity = universities?.find(university => university._id === id)
      if (foundUniversity) {
        setCurrentUniversity(foundUniversity)
        setSelectedProfessions(foundUniversity.professions)
      } else {
        instance
        .get(`/universities/unique/?id=${id}`)
        .then(res => {
          setCurrentUniversity(res.data)
          setSelectedProfessions(res.data.professions)
        })
        .catch(err => console.log('Error:', err))
      } 
    } else if (type === 'news') {
      if (news?.some(e => e._id === id)) {
        setCurrentNews({ ...news.find(e => e._id === id) })
      } else {
        instance
        .get(`/news/unique/?id=${id}`)
        .then(res => setCurrentNews(res.data))
        .catch(err => console.log('Error:', err))
      } 
    } else if (type === 'procedure') {
      if (procedures?.some(e => e._id === id)) {
        setCurrentProcedure({ ...procedures.find(e => e._id === id) })
      } else {
        instance
        .get(`/procedures/unique/?id=${id}`)
        .then(res => {
          setCurrentProcedure(res.data)
          setIsProcedureImgSelected(!!res.data.img)
          setIsProcedureFileSelected(!!res.data.file)
        })
        .catch(err => console.log('Error:', err))
      } 
    } else if (type === 'statistic') {
      if (statistics?.some(e => e._id === id)) {
        setCurrentStatistic({ ...statistics.find(e => e._id === id) })
      } else {
        instance
        .get(`/statistics/unique/?id=${id}`)
        .then(res => setCurrentStatistic(res.data))
        .catch(err => console.log('Error:', err))
      } 
    } else if (type === 'statistic-data') {
      if (statisticsData?.some(e => e._id === id)) {
        setCurrentStatisticData({ ...statisticsData.find(e => e._id === id) })
      } else {
        instance
        .get(`/statistics-data/unique/?id=${id}`)
        .then(res => setCurrentStatisticData(res.data))
        .catch(err => console.log('Error:', err))
      } 
    } else if (type === 'job') {
      if (jobs?.some(e => e._id === id)) {
        setCurrentJob({ ...jobs.find(e => e._id === id) })
      } else {
        instance
        .get(`/jobs/unique/?id=${id}`)
        .then(res => setCurrentJob(res.data))
        .catch(err => console.log('Error:', err))
      } 
    }
  }, [ id, professions, type, universities, news, procedures, statistics, statisticsData, jobs ])

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(URL.createObjectURL(file))
      setSelectedImg(file)
      setIsImageSelected(true)
    } else {
      setSelectedImage(null)
      setIsImageSelected(false)
    }
  }

  const editProfession = e => {
    e.preventDefault()

    const professionData = new FormData()
    professionData.append('title', professionRefs.title.current.value)
    professionData.append('aboutText', professionRefs.aboutText.current.value)
    professionData.append('img', professionRefs.img.current.files[0])
    professionData.append('duration', professionRefs.duration.current.value)
    professionData.append('tuition', professionRefs.tuition.current.value)
    professionJobs.forEach(id => { professionData.append('jobs', id) })

    instance
    .patch(`/professions/${id}`, professionData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))

    navigate(ROUTES.PROFILE)
    Object.values(professionRefs).forEach(ref => {
      if (ref.current) ref.current.value = ''
    })
    setIsImageSelected(false)
  }

  const toggleProfessionSelection = professionId => {
    setSelectedProfessions(prevSelectedProfessions => {
      if (prevSelectedProfessions.includes(professionId)) {
        return prevSelectedProfessions.filter(id => id !== professionId)
      } else {
        return [...prevSelectedProfessions, professionId]
      }
    })
  }

  const editUniversity = e => {
    e.preventDefault()
    const updatedUniversity = {
      img: selectedImg, 
      professions: selectedProfessions,
      name: nameRef.current.value
    }

    instance
    .patch(`/universities/${id}`, updatedUniversity, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:', err))

    navigate(ROUTES.PROFILE)
  }

  const editNews = e => {
    e.preventDefault()

    instance
    .patch(`/news/${id}`, { title: newsRef.current.value})
    .catch(err => console.log('Error:',err))
    
    newsRef.current.value = ''
    navigate(ROUTES.PROFILE)
  }

  const editProcedure = e => {
    e.preventDefault()

    const procedureData = {
      img: procedureRefs.img.current.files[0],
      file: procedureRefs.file.current.files[0]
    }

    instance
    .patch(`/procedures/${id}`, procedureData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))
    
    procedureRefs.img.current.value = ''
    procedureRefs.file.current.value = ''
    navigate(ROUTES.PROFILE)
  }

  const editStatistic = e => {
    e.preventDefault()

    const statisticData = {
      title: statisticRefs.title.current.value,
      link: statisticRefs.link.current.value
    }

    instance
    .patch(`/statistics/${id}`, statisticData)
    .catch(err => console.log('Error:',err))
    
    statisticRefs.title.current.value = ''
    statisticRefs.link.current.value = ''
    navigate(ROUTES.PROFILE)
  }

  const editStatisticData = e => {
    e.preventDefault()
    const updatedStatisticData = {
      img: statisticDataRefs.img.current?.files[0], 
      title: statisticDataRefs.title.current.value
    }

    instance
    .patch(`/statistics-data/${id}`, updatedStatisticData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:', err))

    navigate(ROUTES.PROFILE)
  }

  const editJob = e => {
    e.preventDefault()
    const jobData = {
      img: jobRefs.img.current?.files[0], 
      title: jobRefs.title.current.value,
      link: jobRefs.link.current.value
    }

    instance
    .patch(`/jobs/${id}`, jobData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:', err))

    navigate(ROUTES.PROFILE)
  }

  const toggleProfessionInJob = id => {
    if (professionJobs.includes(id)) {
      setProfessionJobs(prev => prev.filter(profId => profId !== id))
    } else {
      setProfessionJobs(prev => [...prev, id])
    }
  }

  return (
    <div className='editpage'>
      <h1>Թարմացումների էջ</h1>
      <button onClick={() => navigate(-1)} className='editpage_btn editpage_additional_property'>Հետ</button>
      <div className="edit-container">
        {
          type === 'profession'  ?
          <>
            <h4>Փոփոխել կրթական ծրագիրը</h4>
            {
              !currentProfession ? <SmallLoadingSpinner/> :
              <form onSubmit={editProfession} className="edit-container_form">
                <input 
                  required 
                  id='title' 
                  ref={professionRefs.title}
                  defaultValue={currentProfession?.title}
                  className='editpage_input' 
                  placeholder='title' 
                  type="text" 
                  name='title' 
                />
                <input 
                  required 
                  id='aboutText' 
                  ref={professionRefs.aboutText}
                  defaultValue={currentProfession?.aboutText}
                  className='editpage_input' 
                  placeholder='about text' 
                  type="text" 
                  name='aboutText' 
                />
                <input 
                  required 
                  id='duration' 
                  ref={professionRefs.duration} 
                  defaultValue={currentProfession?.duration}
                  className='editpage_input' 
                  placeholder='duration' 
                  type="text" 
                  name='duration' 
                />
                <input 
                  required 
                  id='tuition' 
                  ref={professionRefs.tuition} 
                  defaultValue={currentProfession?.tuition}
                  className='editpage_input' 
                  placeholder='tuition' 
                  type="number" 
                  name='tuition' 
                />
                <label className={`img_label ${isImageSelected && 'editpage_active_color'}`} htmlFor="img">
                  {!isImageSelected ? 'select image' : `image is selected`}
                </label>
                <input 
                  id='img' 
                  className='editpage_input img_input' 
                  type="file" 
                  accept='image/*' 
                  name='img' 
                  placeholder='img' 
                  ref={professionRefs.img}
                  onChange={handleImageChange}
                />
                { selectedImage && <img className='editpage_img' src={selectedImage} alt="" /> }
                { !selectedImage && <img className='editpage_img' src={`${serverURL}/${currentProfession?.img}`} alt="" /> }
                <div className={`editpage_professions ${showProfessions && 'custom_height scroll'}`}>
                  <div onClick={() => setShowProfessions(!showProfessions)} className="editpage_professions_subject">
                    <p>աշխատանքներ</p>
                    <i className="fa-solid fa-sort-down"></i>
                  </div>
                  {
                    jobs?.map(e => 
                      <p onClick={() => toggleProfessionInJob(e._id)} className={`editpage_profession_title ${professionJobs.includes(e._id) && 'editpage_active_color'}`} key={e._id}>{e.title}</p>
                    )
                  }
                </div>
                <button type='submit' className='editpage_btn'>Փոփոխել</button>
              </form>
            }
          </> : type === 'university' ?
          <>
            <h4>Փոփոխել համալսարանը</h4>
            {
              !currentUniversity ? <SmallLoadingSpinner/> :
              <form  onSubmit={editUniversity} className="edit-container_form">
                <label className={`img_label ${isImageSelected && 'editpage_active_color'}`} htmlFor="img">
                  {!isImageSelected ? 'select image' : `image is selected`}
                </label>
                <input 
                  id='img' 
                  className='editpage_input img_input' 
                  type="file" 
                  accept='image/*' 
                  name='img' 
                  placeholder='img' 
                  onChange={handleImageChange}
                />
                { selectedImage && <img className='editpage_img' src={selectedImage} alt="" /> }
                { !selectedImage && <img className='editpage_img' src={`${serverURL}/${currentUniversity?.img}`} alt="" /> }
                <input 
                  id='name' 
                  className='editpage_input' 
                  type="text" 
                  name='name' 
                  placeholder='name' 
                  defaultValue={currentUniversity.name}
                  ref={nameRef}
                />
                <div className={`editpage_professions ${showProfessions && 'custom_height scroll'}`}>
                  <div onClick={() => setShowProfessions(!showProfessions)} className="editpage_professions_subject">
                    <p>professions</p>
                    <i className="fa-solid fa-sort-down"></i>
                  </div>
                  {
                    professions.map(profession => 
                      <p onClick={() => toggleProfessionSelection(profession._id)} className={`editpage_profession_title ${selectedProfessions.includes(profession._id) && 'editpage_active_color'}`} key={profession._id}>{profession.title}</p>
                    )
                  }
                </div>
                <button className='editpage_btn' type='submit'>Փոփոխել</button>
              </form>
            }
          </> : type === 'news' ?
          <>
            <h4>Փոփոխել նորությունը</h4>
            {
              !currentNews ? <SmallLoadingSpinner/> :
              <form  onSubmit={editNews} className="edit-container_form">
                <input 
                  id='news' 
                  className='editpage_input' 
                  type="text" 
                  name='title' 
                  placeholder='title' 
                  defaultValue={currentNews.title}
                  ref={newsRef}
                />
                <button className='editpage_btn' type='submit'>Փոփոխել</button>
              </form>
            }
          </> : type === 'procedure' ?
          <>
          <h4>Փոփոխել հայտարարությունը</h4>
            {
              !currentProcedure ? <SmallLoadingSpinner/> :
              <form  onSubmit={editProcedure} className="edit-container_form">
                <label className={`img_label ${isProcedureImgSelected && 'editpage_active_color'}`} htmlFor="procedureImg">
                  {!isProcedureImgSelected ? 'select image' : `image is selected`}
                </label>
                <input 
                  id='procedureImg' 
                  className='editpage_input img_input' 
                  type="file" 
                  accept='image/*' 
                  name='img' 
                  ref={procedureRefs.img}
                  onChange={e => {setProcedureImg(e.target.files[0]); setIsProcedureImgSelected(!!procedureRefs.img.current.files[0])}}
                />
                {
                  procedureImg ?
                  <img className='editpage_img' src={URL.createObjectURL(procedureImg)} alt="" /> :
                  <img className='editpage_img' src={`${serverURL}/${currentProcedure.img}`} alt="" />
                }
                <label className={`img_label ${isProcedureFileSelected && 'editpage_active_color'}`} htmlFor="procedureFile">
                  {!isProcedureFileSelected ? 'select file' : `file is selected`}
                </label>
                <input 
                  id='procedureFile' 
                  className='editpage_input img_input' 
                  type="file" 
                  name='file' 
                  ref={procedureRefs.file}
                  onChange={() => setIsProcedureFileSelected(!!procedureRefs.file.current.files[0])}
                />
                <button className='editpage_btn' type='submit'>Փոփոխել</button>
              </form>
            }
          </> : type === 'statistic' ?
          <>
            <h4>Փոփոխել վիճակագրական տվյալը</h4>
            {
              !currentStatistic ? <SmallLoadingSpinner/> :
              <form  onSubmit={editStatistic} className="edit-container_form">
                <input 
                  id='statisticTitle' 
                  className='editpage_input' 
                  type="text" 
                  name='title' 
                  placeholder='title' 
                  defaultValue={currentStatistic.title}
                  ref={statisticRefs.title}
                />
                <input 
                  id='statisticLink' 
                  className='editpage_input' 
                  type="text" 
                  name='link' 
                  placeholder='link' 
                  defaultValue={currentStatistic.link}
                  ref={statisticRefs.link}
                />
                <button className='editpage_btn' type='submit'>Փոփոխել</button>
              </form>
            }
          </> : type === 'statistic-data' ?
          <>
            <h4>Փոփոխել վիճակագրական տվյալը</h4>
            {
              !currentStatisticData ? <SmallLoadingSpinner/> :
              <form  onSubmit={editStatisticData} className="edit-container_form">
                <label className={`img_label ${selectedImage && 'editpage_active_color'}`} htmlFor="img">
                  {!selectedImage ? 'select image' : `image is selected`}
                </label>
                <input 
                  id='img' 
                  className='editpage_input img_input' 
                  type="file" 
                  accept='image/*' 
                  name='img' 
                  placeholder='img' 
                  ref={statisticDataRefs.img}
                  onChange={handleImageChange}
                />
                { selectedImage && <img className='editpage_img' src={selectedImage} alt="" /> }
                { !selectedImage && <img className='editpage_img' src={`${serverURL}/${currentStatisticData?.img}`} alt="" /> }
                <input 
                  id='name' 
                  className='editpage_input' 
                  type="text" 
                  name='name' 
                  placeholder='name' 
                  defaultValue={currentStatisticData.title}
                  ref={statisticDataRefs.title}
                />
                <button className='editpage_btn' type='submit'>Փոփոխել</button>
              </form>
            }
          </> : type === 'job' ?
          <>
            <h4>Փոփոխել աշխատանքը</h4>
            {
              !currentJob ? <SmallLoadingSpinner/> :
              <form  onSubmit={editJob} className="edit-container_form">
                <label className={`img_label ${selectedImage && 'editpage_active_color'}`} htmlFor="img">
                  {!selectedImage ? 'select image' : `image is selected`}
                </label>
                <input 
                  id='img' 
                  className='editpage_input img_input' 
                  type="file" 
                  accept='image/*' 
                  name='img' 
                  placeholder='img' 
                  ref={jobRefs.img}
                  onChange={handleImageChange}
                />
                { selectedImage && <img className='editpage_img' src={selectedImage} alt="" /> }
                { !selectedImage && <img className='editpage_img' src={`${serverURL}/${currentJob?.img}`} alt="" /> }
                <input 
                  id='name' 
                  className='editpage_input' 
                  type="text" 
                  name='name' 
                  placeholder='name' 
                  defaultValue={currentJob.title}
                  ref={jobRefs.title}
                />
                <input 
                  id='link' 
                  className='editpage_input' 
                  type="text" 
                  name='link' 
                  placeholder='link' 
                  defaultValue={currentJob.link}
                  ref={jobRefs.link}
                />
                <button className='editpage_btn' type='submit'>Փոփոխել</button>
              </form>
            }
          </> : ''
        }
      </div>
    </div>
  )
}

export default EditPage