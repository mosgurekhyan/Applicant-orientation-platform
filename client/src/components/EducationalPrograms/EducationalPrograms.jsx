import { educational_programs } from '../../constants/educational_programs'
import './EducationalPrograms.css'

function EducationalPrograms() {
  return (
    <div className='educational_programs'>
      {
        educational_programs?.map(e =>  
          <div className='educational_programs-program' key={e.id}>
            <p className='educational_programs-program_quantity'>{e.quantity}</p>
            <p className='educational_programs-program-container_name'>{e.name}</p>
          </div>
        )
      }
    </div>
  )
}

export default EducationalPrograms