import { useContext, useLayoutEffect, useState } from 'react'
import './Procedures.css'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/routes'

function Procedures() {
  const { procedures, setProcedures, serverURL } = useContext(UseContext)
  const [ send, setSend ] = useState(true)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (!procedures?.length && send) {
      instance
      .get('/procedures')
      .then(res => {
        setProcedures(res.data)
        if (!res.data.length) {
          setSend(false)
        }
      })
      .catch(err => console.log('Error:',err))
    }
  }, [ procedures, setProcedures, send ])

  const deleteProcedure = id => {
    instance
    .delete(`/procedures/${id}`)
    .then(() => setProcedures(prevData => prevData.filter(e => e._id !== id)))
    .catch(err => console.log('Error:', err))
  }

  return (
    <>
      {
        pathname !== ROUTES.PROFILE ?
        <div className='procedures'>
          <h2 className='procedures_title'>Նորություններ և հայտարարություններ</h2>
          <div className="procedures-container">
            {
              procedures?.map(e => 
                <div onClick={() => window.open(`${serverURL}/${e.file}`)} className='procedure' key={e._id}>
                  <img src={`${serverURL}/${e.img}`} alt="" className="procedure_img" />
                </div>
              )
            }
          </div>
        </div> :
        <div className='admin-procedures'>
          {
            procedures?.map(procedure => 
              <div onClick={() => window.open(`${serverURL}/${procedure.file}`)} className='procedure' key={procedure._id}>
                <img src={`${serverURL}/${procedure.img}`} alt="" className="procedure_img" />
                <div className="procedure_btns">
                  <button onClick={e => {e.stopPropagation(); navigate(`/editpage/procedure/${procedure._id}`)}} className='procedure_btn'>Փոփոխել</button>
                  <button onClick={e => {e.stopPropagation(); deleteProcedure(procedure._id)}} className='procedure_btn'>Delete</button>
                </div>
              </div>
            )
          }
        </div>
      }
    </>
  )
}

export default Procedures