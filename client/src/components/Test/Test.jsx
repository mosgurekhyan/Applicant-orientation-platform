import './Test.css'
import test_img from '../../assets/images/test_img.png'
import { questions } from '../../constants/questions'
import { useContext, useEffect, useState } from 'react'
import { UseContext } from '../../App'
import instance from '../../api/axios'
import { useNavigate } from 'react-router-dom'
import ROUTES from '../../routes/routes'

function Test() {
  const navigate = useNavigate()
  const [ selectedAnswers, setSelectedAnswers ] = useState([])
  const [ unselectedQuestionIndices, setUnselectedQuestionIndices ] = useState([])
  const { currentUser } = useContext(UseContext)
  const [ showError, setShowError ] = useState(false)
  const [ showResponse, setShowResponse ] = useState(false)

  useEffect(() => window.scrollTo(0, 0), [])

  const toggleCheckbox = (questionId, value) => {
    const index = selectedAnswers.findIndex(e => e.questionId === questionId)

    if (index !== -1) { 
      if (selectedAnswers[index].value === value) {
        setSelectedAnswers(prevState => prevState.filter(e => e.questionId !== questionId))
      } else {
        setSelectedAnswers(prevState => {
          const updatedAnswers = [...prevState]
          updatedAnswers[index].value = value
          return updatedAnswers
        })
      }
    } else { 
      setSelectedAnswers(prevState => [...prevState, { questionId, value }])
    }
    setUnselectedQuestionIndices(prevState => prevState.filter(index => index !== questionId - 1))
  }

  const questionsBySphere = questions.reduce((acc, curr) => {
    if (!acc[curr.sphere]) {
      acc[curr.sphere] = []
    }
    acc[curr.sphere].push(curr)
    return acc
  }, {})

  const totalValuesBySphere = {}
  for (const sphere in questionsBySphere) {
    totalValuesBySphere[sphere] = questionsBySphere[sphere].reduce((total, question) => {
      const selectedAnswer = selectedAnswers.find(answer => answer.questionId === question.id)
      return total + (selectedAnswer ? selectedAnswer.value : 0)
    }, 0)
  }

  const unansweredIndices = questions
  .map((question, index) => (selectedAnswers.find(answer => answer.questionId === question.id) ? null : index))
  .filter(index => index !== null)

  useEffect(() => {
    if (unansweredIndices.length === 0) {
      setShowError(false)
    }
  }, [ unansweredIndices ])

  const sendAnswers = () => {
    setUnselectedQuestionIndices(unansweredIndices)

    if (unansweredIndices.length === 0) {
      const sortedTotalValues = Object.entries(totalValuesBySphere).sort(([, totalValueA], [, totalValueB]) => totalValueB - totalValueA)
      const topThreeSpheres = sortedTotalValues.slice(0, 3).map(([sphere, totalValue]) => ({ sphere, totalValue }))
      instance
      .post('/email/test', { sphers: topThreeSpheres, email: currentUser.email, name: currentUser.fullName })
      .then(() => setShowResponse(true))
      .catch(err => console.log('Error:', err))
    } else {
      setShowError(true)
    }
  }

  return (
    <div className='test'>
      <div className="test-container1">
        <img src={test_img} className='test_img' alt="" />
      </div>
      <div className="test-container2">
        <div className="test-questions">
          {
            questions.map((question, questionIndex) => 
              <div key={question.id} className='test-question'>
                <h4 className="test-question_text">{questionIndex + 1}.{question.question}</h4>
                <div className="test-question_answers">
                  {
                    question.answers.map(answer => 
                      <div key={answer.value} className="test-question_answer">
                        <span onClick={() => toggleCheckbox(question.id, answer.value)} className='checkbox'>
                          {selectedAnswers.some(e => e.questionId === question.id && e.value === answer.value) && <i className="fa-solid fa-check"></i>}
                        </span>
                        <p className='test-question_answer_text'>{answer.text}</p>
                      </div>
                    )
                  }
                </div>
                {unselectedQuestionIndices.includes(questionIndex) && <p className='error test_error'>Խնդրում ենք նշել պատասխանը</p>}
              </div>
            )
          }
        </div>
        {showError && <p className='error'>Խնդում ենք պատասխանել բոլոր հարցերին</p>}
        <button className='test_btn' onClick={sendAnswers}>Հաստատել</button>
      </div>
      {
        showResponse &&
        <div className="test-examination">
          <p className='test-examination_subject'>Շնորհակալություն թեստը լրացնելու համար</p>
          <i className="fa-solid fa-check test-examination_check"></i>
          <p className='test-examination_text'>Թեստի արդյունքները կստանաք նշված էլեկտրոնային հասցեին</p>
          <button onClick={() => navigate(ROUTES.HOME)} className='test-examination_btn'>Գնալ գլխավոր էջ</button>
        </div>
      }
      {showResponse && <div onClick={() => setShowResponse(false)} className="test_overlay"></div>}
    </div>
  )
}

export default Test