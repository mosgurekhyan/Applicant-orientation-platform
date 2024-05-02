import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './AddPage.css'
import { useNavigate } from 'react-router-dom'
import { UseContext } from '../../App'
import instance from '../../api/axios'

function AddPage() {
  const navigate = useNavigate()
  const { professions, setProfessions } = useContext(UseContext)
  const [ isImageSelected, setIsImageSelected ] = useState(null)
  const [ isProcedureFileSelected, setIsProcedureFileSelected ] = useState(null)
  const [ showProfessions, setShowProfessions ] = useState(false)
  const [ send, setSend ] = useState(true)
  const [ jobProfessions, setJobProfessions ] = useState([])
  const [ university, setUniversity ] = useState({
    img: '',
    professions: []
  })

  const nameRef = useRef(null)
  const newsRef = useRef(null)

  const procedureRefs = {
    img: useRef(null),
    file: useRef(null)
  }
  const statisticRefs = {
    title: useRef(null),
    link: useRef(null)
  }
  const statisticDataRefs = {
    img: useRef(null),
    title: useRef(null)
  }

  const jobRefs = {
    img: useRef(null),
    title: useRef(null),
    link: useRef(null)
  }

  useEffect(() => window.scrollTo(0, 0), [])

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

  const professionRefs = {
    title: useRef(null),
    aboutText: useRef(null),
    img: useRef(null),
    duration: useRef(null),
    tuition: useRef(null)
  } 

  const addProfession = e => {
    e.preventDefault()
    const professionData = {
      title: professionRefs.title.current.value,
      aboutText: professionRefs.aboutText.current.value,
      img: professionRefs.img.current.files[0],
      duration: professionRefs.duration.current.value,
      tuition: professionRefs.tuition.current.value
    }

    instance
    .post('/professions/add', professionData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))

    Object.values(professionRefs).forEach(ref => {
      if (ref.current) ref.current.value = ''
    })
    setIsImageSelected(false)
  }

  const addProfessionInUniversity = id => {
    const index = university.professions?.findIndex(e => e === id)
  
    if (index === -1) {
      setUniversity(prevUniversity => ({
        ...prevUniversity,
        professions: [...prevUniversity.professions, id]
      }))
    } else {
      setUniversity(prevUniversity => ({
        ...prevUniversity,
        professions: prevUniversity.professions?.filter((_, i) => i !== index)
      }))
    }
  }

  const addUniversity = e => {
    e.preventDefault()
    const universityData = {
      img: university.img,
      professions: university.professions,
      name: nameRef.current.value
    }

    instance
    .post('/universities/add', universityData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))

    setUniversity({ img: '', professions: [] })
    nameRef.current.value = ''
    setIsImageSelected(false)
  }

  const addNews = e => {
    e.preventDefault()
    instance
    .post('/news/add', { title: newsRef.current.value })
    .catch(err => console.log('Error:',err))

    newsRef.current.value = ''
  }

  const addProcedure = e => {
    e.preventDefault()

    const procedureData = {
      img: procedureRefs.img.current.files[0],
      file: procedureRefs.file.current.files[0]
    }

    instance
    .post('/procedures/add', procedureData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))

    procedureRefs.img.current.value = ''
    procedureRefs.file.current.value = ''
    setIsProcedureFileSelected(null)
    setIsImageSelected(null)
  }

  const addStatistic = e => {
    e.preventDefault()
    const statisticData = {
      title: statisticRefs.title.current.value,
      link: statisticRefs.link.current.value
    }

    instance
    .post('/statistics/add', statisticData)
    .catch(err => console.log('Error:',err))

    statisticRefs.title.current.value = ''
    statisticRefs.link.current.value = ''
  }

  const addStatisticData = e => {
    e.preventDefault()

    const statisticData = {
      img: statisticDataRefs.img.current.files[0],
      title: statisticDataRefs.title.current.value
    }

    instance
    .post('/statistics-data/add', statisticData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))

    statisticDataRefs.img.current.value = ''
    statisticDataRefs.title.current.value = ''
    setIsImageSelected(null)
  }

  const addJob = e => {
    e.preventDefault()

    const jobData = {
      img: jobRefs.img.current.files[0],
      title: jobRefs.title.current.value,
      link: jobRefs.link.current.value,
      professions: jobProfessions
    }

    instance
    .post('/jobs/add', jobData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .catch(err => console.log('Error:',err))

    for (const key in jobRefs) {
      jobRefs[key].current.value = ''
    }
    setJobProfessions([])
    setIsImageSelected(null)
  }

  const toggleProfessionInJob = id => {
    if (jobProfessions.includes(id)) {
      setJobProfessions(prev => prev.filter(profId => profId !== id))
    } else {
      setJobProfessions(prev => [...prev, id])
    }
  }

  return (
    <div className='addpage'>
      <h1>Կայքի թարմացումների էջ</h1>
      <button onClick={() => navigate(-1)} className='addpage_btn addpage_additional_property'>Վերադառնալ նախորդ էջ</button>
      <div className="add-containers">
        <div className="add-container">
          <h4>Ավելացնել համալսարան</h4>
          <form onSubmit={addUniversity} className='add-container_form'>
            <label className={`img_label ${isImageSelected && 'addpage_active_color'}`} htmlFor="universityImg">
              {!isImageSelected ? 'select image' : `image is selected`}
            </label>
            <input 
              id='universityImg' 
              required
              className='addpage_input img_input' 
              type="file" 
              accept='image/*' 
              name='img' 
              onChange={e => {
                setIsImageSelected(!!e.target.files[0])
                setUniversity(prevUniversity => ({
                  ...prevUniversity,
                  img: e.target.files[0]
                }))
              }}
            />
            <input 
              id='name' 
              required
              className='addpage_input' 
              type="text" 
              name='name' 
              placeholder='name'
              ref={nameRef}
            />
            <div className={`addpage_professions ${showProfessions && 'custom_height scroll'}`}>
              <div onClick={() => setShowProfessions(!showProfessions)} className="addpage_professions_subject">
                <p>professions</p>
                <i className="fa-solid fa-sort-down"></i>
              </div>
              {
                professions.map(e => 
                  <p onClick={() => addProfessionInUniversity(e._id)} className={`addpage_profession_title ${university.professions?.includes(e._id) && 'addpage_active_color'}`} key={e._id}>{e.title}</p>
                )
              }
            </div>
            <button className='addpage_btn' type='submit'>Ավելացնել</button>
          </form>
        </div>
        <div className="add-container">
          <h4>Ավելացնել կրթական ծրագիր</h4>
          <form onSubmit={addProfession} className='add-container_form'>
            <input 
              id='title' 
              required
              className='addpage_input' 
              type="text" 
              name='title' 
              placeholder='title' 
              ref={professionRefs.title}
            />
            <input 
              id='aboutText' 
              required
              className='addpage_input' 
              type="text" 
              name='aboutText' 
              placeholder='about text' 
              ref={professionRefs.aboutText}
            />
            <input 
              id='duration' 
              required
              className='addpage_input' 
              type="text" 
              name='duration' 
              placeholder='duration' 
              ref={professionRefs.duration}
            />
            <input 
              id='tuition' 
              required
              className='addpage_input' 
              type="number" 
              name='tuition' 
              placeholder='tuition' 
              ref={professionRefs.tuition}
            />
            <label className={`img_label ${isImageSelected && 'addpage_active_color'}`} htmlFor="img">
              {!isImageSelected ? 'select image' : `image is selected`}
            </label>
            <input 
              id='img' 
              required
              className='addpage_input img_input' 
              type="file" 
              accept='image/*' 
              name='img' 
              ref={professionRefs.img}
              onChange={e => setIsImageSelected(!!e.target.files[0])}
            />
            <button type='submit' className='addpage_btn'>Ավելացնել</button>
          </form>
        </div>
        <div className="add-container">
          <h4>Ավելացնել նոր հայտարարություն</h4>
          <form onSubmit={addNews} className='add-container_form'>
            <input 
              id='news' 
              required
              className='addpage_input' 
              type="text" 
              name='title' 
              placeholder='title'
              ref={newsRef}
            />
            <input 
              id='newsAbout' 
              className='addpage_input' 
              type="text" 
              name='aboutText' 
              placeholder='about text'
            />
            <button type='submit' className='addpage_btn'>Ավելացնել</button>
          </form>
        </div>
        <div className="add-container">
          <h4>Ավելացնել հայտարարություն </h4>
          <form onSubmit={addProcedure} className='add-container_form'>
            <label className={`img_label ${isImageSelected && 'addpage_active_color'}`} htmlFor="procedureImg">
              {!isImageSelected ? 'select image' : `image is selected`}
            </label>
            <input 
              id='procedureImg' 
              required
              className='addpage_input img_input' 
              type="file" 
              accept='image/*' 
              name='img' 
              ref={procedureRefs.img}
              onChange={e => setIsImageSelected(!!e.target.files[0])}
            />
            <label className={`img_label ${isProcedureFileSelected && 'addpage_active_color'}`} htmlFor="procedureFile">
              {!isProcedureFileSelected ? 'select file' : `file is selected`}
            </label>
            <input 
              id='procedureFile' 
              required
              className='addpage_input img_input' 
              type="file" 
              name='file' 
              ref={procedureRefs.file}
              onChange={e => setIsProcedureFileSelected(!!e.target.files[0])}
            />
            <button type='submit' className='addpage_btn'>Ավելացնել</button>
          </form>
        </div>
        <div className="add-container">
          <h4>Ավելացնել վիճակագրական տվյալ քննությունների մասին</h4>
          <form onSubmit={addStatistic} className='add-container_form'>
            <input 
              id='statisticTitle' 
              required
              className='addpage_input' 
              type="text" 
              name='title' 
              placeholder='title'
              ref={statisticRefs.title}
            />
            <input 
              id='statisticLink' 
              required
              className='addpage_input' 
              type="text" 
              name='link' 
              placeholder='link'
              ref={statisticRefs.link}
            />
            <button type='submit' className='addpage_btn'>Ավելացնել</button>
          </form>
        </div>
        <div className="add-container">
          <h4>Ավելացնել վիճակագրություն </h4>
          <form onSubmit={addStatisticData} className='add-container_form'>
            <label className={`img_label ${isImageSelected && 'addpage_active_color'}`} htmlFor="staticsticDataImg">
              {!isImageSelected ? 'select image' : `image is selected`}
            </label>
            <input 
              id='staticsticDataImg' 
              className='addpage_input img_input' 
              type="file" 
              accept='image/*' 
              name='img' 
              ref={statisticDataRefs.img}
              onChange={e => setIsImageSelected(!!e.target.files[0])}
            />
            <input 
              id='statisticDataTitle' 
              required
              className='addpage_input' 
              type="text" 
              name='title' 
              placeholder='title'
              ref={statisticDataRefs.title}
            />
            <button type='submit' className='addpage_btn'>Ավելացնել</button>
          </form>
        </div>
        <div className="add-container">
          <h4>Ավելացնել աշխատանք</h4>
          <form onSubmit={addJob} className='add-container_form'>
            <label className={`img_label ${isImageSelected && 'addpage_active_color'}`} htmlFor="jobImg">
              {!isImageSelected ? 'select image' : `image is selected`}
            </label>
            <input 
              id='jobImg' 
              className='addpage_input img_input' 
              type="file" 
              accept='image/*' 
              name='img' 
              ref={jobRefs.img}
              onChange={e => setIsImageSelected(!!e.target.files[0])}
            />
            <input 
              id='jobTitle' 
              required
              className='addpage_input' 
              type="text" 
              name='title' 
              placeholder='title'
              ref={jobRefs.title}
            />
            <input 
              id='jobLink' 
              required
              className='addpage_input' 
              type="text" 
              name='link' 
              placeholder='link'
              ref={jobRefs.link}
            />
            <div className={`addpage_professions ${showProfessions && 'custom_height scroll'}`}>
              <div onClick={() => setShowProfessions(!showProfessions)} className="addpage_professions_subject">
                <p>professions</p>
                <i className="fa-solid fa-sort-down"></i>
              </div>
              {
                professions?.map(e => 
                  <p onClick={() => toggleProfessionInJob(e._id)} className={`addpage_profession_title ${jobProfessions?.includes(e._id) && 'addpage_active_color'}`} key={e._id}>{e.title}</p>
                )
              }
            </div>
            <button type='submit' className='addpage_btn'>Ավելացնել</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPage