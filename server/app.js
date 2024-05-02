require('dotenv').config()
require('./configs/passport')
const session = require('express-session')
const passport = require('passport')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const cron = require('node-cron')
const nodemailer = require('nodemailer')

const userModel = require('./models/user.model')
const newsModel = require('./models/news.model')
const professionModel = require('./models/profession.model')
const jobModel = require('./models/job.model')

const models = require('./models')
const services = require('./services')
const auth = require('./middlewares/auth')

const authRouter = require('./routes/auth')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
const emailRouter = require('./routes/email')
const chatsRouter = require('./routes/chats')
const messagesRouter = require('./routes/messages')
const professionsRouter = require('./routes/professions')
const usersRouter = require('./routes/users')
const universitiesRouter = require('./routes/universities')
const newsRouter = require('./routes/news')
const proceduresRouter = require('./routes/procedures')
const statisticsRouter = require('./routes/statistics')
const statisticsDataRouter = require('./routes/statistics-data')
const jobsRouter = require('./routes/jobs')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000 * 24 * 20
    }
  })
)

app.use(logger('dev'))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET, PUT, POST, DELETE, PATCH',
    credentials: true
  })
)

app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/auth', authRouter)
app.use('/email', emailRouter)
app.use('/chats', chatsRouter)
app.use('/messages', messagesRouter)
app.use('/professions', professionsRouter)
app.use('/statistics', statisticsRouter)
app.use('/statistics-data', statisticsDataRouter)
app.use('/universities', universitiesRouter)
app.use('/news', newsRouter)
app.use('/procedures', proceduresRouter)
app.use('/users', usersRouter)
app.use('/jobs', jobsRouter)
app.use(auth)

app.models = {
  chats: models.chats,
  messages: models.messages,
  users: models.users,
  professions: models.professions,
  universities: models.universities,
  news: models.news,
  procedures: models.procedures,
  statistics: models.statistics,
  statisticsData: models.statisticsData,
  jobs: models.jobs
}

app.services = {
  email: new (services.emailService) (app.models),
  chats: new (services.chatService) (app.models),
  messages: new (services.messageService) (app.models),
  login: new (services.loginService) (app.models),
  register: new (services.registerService) (app.models),
  users: new (services.userService) (app.models),
  professions: new (services.professionService) (app.models),
  universities: new (services.universityService) (app.models),
  news: new (services.newsService) (app.models),
  procedures: new (services.procedureService) (app.models),
  statistics: new (services.statisticService) (app.models),
  statisticsData: new (services.statisticDataService) (app.models),
  jobs: new (services.jobService) (app.models),
}

const sendReminderEmail = (userEmail, news, fullName, jobs) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD
    }
  })

  const info = {
    to: userEmail,
    subject: 'Շաբաթվա նորություններ',
    html: `
      <p>Ողջույն սիրելի ${fullName} Ներկայացնում ենք շաբաթվա թարմացումները</p>
      ${news.map(e => `<p>${e.title}</p>`).join('\n')}
      ${
        jobs?.length > 0 && `
          <p>Թափուր հաստիքներ</p>
          ${jobs.map(e => `<p><a href='${e.link}'>${e.title}</a></p>`).join('\n')}
        `
      }
    `
  }

  transporter.sendMail(info, error => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      return 'Message successfully sent'
    }
  })
}

// cron.schedule('*/10 * * * * *', async () => {
cron.schedule('0 */12 * * *', async () => {
  const currentDate = new Date()
  try {
    const users = await userModel.find()
    const latestNews = await newsModel.find().sort({ createdAt: -1 }).limit(4)

    users.forEach(async user => {
      const daysSinceRegistration = Math.floor((currentDate - user.registeredAt) / 86400000)

      let allRecentJobs = []
      for (const profession of user.professions) {
        const professionsData = await professionModel.find({ title: profession.title })
        for (const professionData of professionsData) {
          for (const jobId of professionData.jobs) {
            const job = await jobModel.findById(jobId)
            if (job) {
              const jobCreatedAt = new Date(job.createdAt);
              const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              if (jobCreatedAt >= sevenDaysAgo) {
                allRecentJobs.push(job)
              }
            }
          }
        }
      }

      if (daysSinceRegistration > 0 && daysSinceRegistration % 7 === 0) {
        sendReminderEmail(user.email, latestNews, user.fullName, allRecentJobs)
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
})

mongoose.connect(
  process.env.MONGOOSE_URL
).then(() => console.log('\n☘️  MongoDb connected!\n')).catch(err => console.log('Error:',err))

app.use(function(req, res, next) {
  next(createError(404))
})

app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app