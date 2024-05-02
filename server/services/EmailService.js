const nodemailer = require('nodemailer')

class EmailService {
  async sendEmail (body) {
    const { email, subject, name, message } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
      }
    })

    const info = {
      to: 'platformorientation@gmail.com',
      subject,
      html: `
        <h2>name: ${name}</h2>
        <h3>subject: ${subject}</h3>
        <h4>email: ${email}</h4>
        <p>${message}</p>
      `
    }

    await transporter.sendMail(info)
    return 'Message successfully sent'
  }

  async sendEmailForTest (body) {
    const { email, name, sphers } = body

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASSWORD
      }
    })

    const info = {
      to: email,
      subject: 'Ձեր մասնագիտական կողմնորոշման թեստի արդյունքները',
      html: `
        <p><b>Ողջույն հարգելի ${name}</b></p>
        <p>Գրում ենք ձեզ ՝ տեղեկացնելու ձեր վերջերս անցած մասնագիտության կողմնորոշման թեստի արդյունքների մասին:</p>
        <p>Ձեր պատասխանները մանրակրկիտ վերլուծելուց հետո մենք հայտնաբերել ենք մի քանի պոտենցիալ ոլորտներ, որոնք համապատասխանում են ձեր նախասիրություններին:</p>
        <p><b>Ահա 3 հիմնական ոլորտները՝</b></p>
        ${sphers.map((e, i) => `<b><p key=${i}>${e.sphere}</b></p>`).join('')}
        <p>Առաջարկում ենք որոշ ժամանակ հատկացնել այս ոլորտների շուրջ մտածելու և դրանց հնարավորությունների ուսումնասիրության համար: Հիշեք, որ ձեր կարիերայի ուղին սկսվում է ձեր ճիշտ կատարած ընտրությունից։ Այսպիսով կարող եք այցելել մեր կայք որտեղ դուք կգտնեք մանրամասն ինֆորմացիա ձեզ հետաքրքրող ոլորտների վերաբերյալ և կկարողանաք ընտրել ձեզ համար լավագույն մասնագիտությունը։</p>
        <p>Եթե ունեք հարցեր կամ ցանկանում եք լրացուցիչ խորհրդատվություն ստանալ, Խնդրում ենք ազատ զգալ կապվել մեզ հետ: Մենք պատրաստ ենք Ձեզ տրամադրել ցանկացած հնարավոր աջակցություն:</p>
        <p>Հարգանքով՝ Դիմորդների կողմնորոշիչ հարթակ</p>
      `
    }

    await transporter.sendMail(info)
    return 'Message successfully sent'
  }
}

module.exports = EmailService