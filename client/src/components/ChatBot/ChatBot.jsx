import './ChatBot.css'
import { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import botImg from '../../assets/images/download.png'
import logo from '../../assets/images/logo.png'
import instance from '../../api/axios'
import { bot_questions } from '../../constants/bot_questions'

function ChatBot() {
  const inputValue = useRef(null)
  const [ showChatBot, setShowChatBot ] = useState(false)
  const [ messages, setMessages ] = useState([])
  const [ chatId, setChatId ] = useState(null)
  const [ firstMessage, setFirstMessage ] = useState(false)
  const [ secondMessage, setSecondMessage ] = useState(false)
  const [ forSecondMessage, setForSecondMessage ] = useState(false)
  const [ sendingMessage, setSendingMessage ] = useState(false)
  const [ forRegenerating, setForRegenerating ] = useState(null)
  const [ forSecondText, setForSecondText ] = useState(null)
  const [ forDefaultMessages, setForDefaultMessages ] = useState(false)
  const [ forTextWrapping, setForTextWrapping ] = useState(true)

  const messagesEndRef = useRef(null)

  useEffect(() => scrollToBottom(), [ messages, showChatBot ])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView()

  useEffect(() => {
    if (showChatBot) {
      setTimeout(() => setFirstMessage(true), 500)
    }
  }, [ showChatBot ])

  useEffect(() => {
    if (showChatBot) {
      setTimeout(() => setSecondMessage(true), 1200)
    }
  }, [ showChatBot ])

  useEffect(() => {
    if (secondMessage) {
      setTimeout(() => setForSecondMessage(true), 2000)
    }
  }, [ secondMessage ])

  useEffect(() => {
    if (forSecondMessage) {
      setTimeout(() => setForDefaultMessages(true), 1500)
    }
  }, [ forSecondMessage ])

  useEffect(() => {
    if (forSecondMessage) {
      setTimeout(() => setForSecondText(true), 600)
    }
  }, [ forSecondMessage ])

  useEffect(() => {
    if (chatId) {
      setFirstMessage(true)
      setSecondMessage(true)
      setForSecondMessage(true)
      setForSecondText(true)
      setTimeout(() => setForTextWrapping(false), 600)
    }
  }, [ chatId ])

  useEffect(() => {
    const regenerating = JSON.parse(localStorage.getItem('regenerating'))
    if (regenerating) {
      setForRegenerating(regenerating)
    }
  }, [])
  
  useEffect(() => {
    const storedChatId = JSON.parse(localStorage.getItem('chatId'))
    if (storedChatId) {
      setChatId(storedChatId)
    }
  }, [])
  
  useEffect(() => {
    if (chatId) {
      instance
      .get(`/chats?chatId=${chatId}`)
      .then(res => setMessages(res?.data?.messages))
      .catch(err => console.error('Error:',err))
    }
  }, [ chatId ])

  const sendMessage = e => {
    e.preventDefault()

    const messageContent = inputValue.current.value.trim()
    if (!messageContent || sendingMessage) return

    const isEmail = message => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|ru)$/i
      return emailRegex.test(message)
    }

    const isUserEmail = isEmail(messageContent)
    setSendingMessage(true)

    const matchedQuestion = bot_questions.find(question => messageContent.toLowerCase() === question.question.toLowerCase())
    const botResponse = matchedQuestion ? matchedQuestion.answer : "Նշեք ձեր էլեկտրոնային փոստի հասցեն և մենք հնարավորինս շուտ կպատասխանենք ձեր հարցին:"

    instance
    .post("/messages/add", { content: messageContent, chatId, sender: 'user' })
    .then(res => {
      inputValue.current.value = ''
      setMessages(prev => {
        if (prev.some(message => message._id === res.data._id)) {
          return prev
        } else {
          return [...prev, res.data]
        }
      })
      instance
      .post("/messages/add", { content: isUserEmail ? 'Շնորհակալություն!' : botResponse, chatId, sender: 'bot' })
      .then(res => {
        if (isUserEmail) {
          setTimeout(() => {
            setForRegenerating('true')
            localStorage.setItem('regenerating', JSON.stringify('true'))
          }, 2000)
        }
        setMessages(prev => {
          if (prev.some(message => message._id === res.data._id)) {
            return prev
          } else {
            return [ ...prev, { ...res.data, loading: true } ] 
          }
        })
        setTimeout(() => {
          setMessages(prev => prev.map(message => message._id === res.data._id ? { ...message, loading: false } : message))
        }, 1500)
      })
      .catch(err => console.error('Error:', err))
      .finally(() => setSendingMessage(false))
    })
    .catch(err => console.error('Error:', err))
    .finally(() => setSendingMessage(false))
  }

  const handleAnswerClick = answer => {
    instance
    .post('/chats/add')
    .then(res => {
      localStorage.setItem('chatId', JSON.stringify(res.data._id))
      setChatId(res.data._id)
      setSendingMessage(true)
      const id = res.data._id
      instance
      .post("/messages/add", { content: answer, chatId: res.data._id, sender: 'user' })
      .then(res => {
        setMessages(prev => {
          if (prev.some(message => message._id === res.data._id)) {
            return prev
          } else {
            return [ res.data ]
          }
        })
        const matchedQuestion = bot_questions.find(
          question => answer.toLowerCase() === question.question.toLowerCase()
        )

        instance
        .post("/messages/add", { content: matchedQuestion.answer, chatId: id, sender: 'bot' })
        .then(res => {
          setMessages(prev => {
            if (prev.some(message => message._id === res.data._id)) {
              return prev
            } else {
              return [ ...prev, { ...res.data, loading: true } ] 
            }
          })
          setSendingMessage(false)
          setTimeout(() => {
            setMessages(prev => prev.map(message => message._id === res.data._id ? { ...message, loading: false } : message))
          }, 1500)
        })
        .catch(err => console.error('Error:', err))
      })
      .catch(err => console.error('Error:', err))
    })
    .catch(err => console.error('Error:', err))  
    inputValue.current.value = ''
  }

  const reGenerate = () => {
    localStorage.removeItem('regenerating')
    localStorage.removeItem('chatId')
    setForRegenerating(false)
    setChatId(null)
    setMessages(null)
    instance
    .delete(`/chats/${chatId}`)
    .catch(err => console.log('Error:',err))
  }

  return (
    <>
      {
        showChatBot ? 
        <div className='chat-bot'>
          <div className='chat-bot-header'>
            <img src={logo} className='chat-bot_logo' alt="" />
            <i onClick={() => setShowChatBot(false)} className="fa-solid fa-x x"></i>
          </div>
          <div className='chat-bot-container'>
            <p className='chat-bot-container_time'>{moment(Date.now()).format("MMMM Do [at] h:mm A")}</p>
            <div className='chat-bot-container_messages'>
              <div className='message-wrapper'>
                <img style={{ marginBottom: secondMessage && '-35px' }} className='bot-img' src={botImg} alt=''/> 
                <div style={{ width: firstMessage ? '85px' : 0, padding: !firstMessage && 0 }} className='bot-message-wrapper'> 
                  { secondMessage && <p className={`message white_color ${forTextWrapping && 'nowrap'}`}>Ողջույն 👋</p> }
                </div> 
              </div>
              <div className='message-wrapper'>
                <img className='bot-img hidden_img' src={botImg} alt=''/> 
                {
                  secondMessage && !forSecondMessage &&
                  <div className='loader-wrapper'>
                    <div className="loader"></div>
                  </div>
                }
                <div style={{ width: forSecondMessage ? '140px' : 0, padding: !forSecondMessage && 0 }} className='bot-message-wrapper2'>
                  { forSecondText && <p className={`message white_color ${forTextWrapping && 'nowrap'}`}>Ինչով կարող եմ օգնել</p> }
                </div>
              </div>
              <div className='default-answers'>
                {
                  !chatId && forDefaultMessages &&
                  bot_questions.map(e => 
                    <div key={e.id} className='message-wrapper'>
                      <div className='user-message-wrapper'>
                        <p onClick={() => handleAnswerClick(e.question)} className='message'>{e.question}</p>
                      </div>
                    </div>
                  )
                }
              </div>
              <div className='messages'>
                {
                  messages?.map(e => 
                    <div className={`message-wrapper ${e.sender === 'user' && 'goLeft'}`} key={e._id}>
                      { e.sender === 'bot' && <img className='bot-img' src={botImg} alt=''/> }
                      {
                        e.loading ?
                        <div className='loader-wrapper'>
                          <div className="loader"></div>
                        </div> :
                        <div className={`${e.sender === 'user' ? 'user-message-wrapper' : 'bot-message-wrapper-custom'}`}>
                          <p className={`message ${e.sender === 'bot' ? 'white_color' : 'black_color'}`}>{e.content}</p>
                        </div>  
                      }
                    </div>
                  )
                }
                <div ref={messagesEndRef} />
              </div>
            </div> 
            {
              forRegenerating ?
              <button className='re-generate' onClick={reGenerate}>Վերսկսել</button> :
              <form style={{display: !chatId && 'none'}} onSubmit={sendMessage} className='chat-bot-container-form'>
                <input
                  type="text"
                  ref={inputValue}
                  placeholder="Type your message..."
                  className="chat-bot-container-form_input"
                />
                <i onClick={sendMessage} className="fa-solid fa-paper-plane"></i>
              </form>
            }
          </div>
        </div> : 
        <div  className='chat-bot_icon' onClick={() => setShowChatBot(true)} >
          <i className="fa-solid fa-comment-dots chatbot_message"></i>
        </div>
      }
    </>
  )
}

export default ChatBot