const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const emails = {
    sendWelcomeEmail: (email, name) => {
    const msg = {
      to: email,
      from: 'igorbezanovic@gmail.com',
      subject: 'Mail dobrodošlice',
      text: `${name} dobro došao u našu aplikaciju za zakazivanje treninga. Za sve nedoumice možete nam se obratiti na: igorbezanovic@gmail.com`,
    }
    sgMail.send(msg).then(() => {
        console.log('Email sent')
      }).catch((error) => {
        console.error(error)
      })
    },
    cancelUsingApp: (email, name) => {
        const msg = {
          to: email,
          from: 'igorbezanovic@gmail.com',
          subject: 'Mail pozdrava',
          text: `${name} zao nam je sto nas napustate. Za sve nedoumice možete nam se obratiti na: igorbezanovic@gmail.com`,
        }
        sgMail.send(msg).then(() => {
            console.log('Email sent')
          }).catch((error) => {
            console.error(error)
          })
    }
}

module.exports = emails