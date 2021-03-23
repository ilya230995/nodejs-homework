const Mailgen = require("mailgen");
const sgMail = require("@sendgrid/mail");
const config = require("../config/email.json");

require("dotenv").config();

class EmailServices {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  constructor(env) {
    switch (env) {
      case "development":
        this.link = config.dev;
        break;
      case "stage":
        this.link = config.stage;
        break;
      case "production":
        this.link = config.production;
        break;
      default:
        this.link = config.dev;
        break;
    }
  }
  #createTemplate(verifyToken, name = "Guest") {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "salted",
      product: {
        name: "ilya230995-GoIt-NodeJS",
        link: this.link,
      },
    });
    const emailTemplate = {
      body: {
        name,
        intro: "Welcome to ilya230995-contacts!",
        action: {
          instructions: "To get started, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/auth/verify/${verifyToken}`,
          },
        },
      },
    };
    return mailGenerator.generate(emailTemplate);
  }
  async sendEmail(verifyToken, email, name) {
    const emailBody = this.#createTemplate(verifyToken, name);
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: "ilyalysenko233@gmail.com",
      subject: "Verify you email",
      html: emailBody,
    };
    await this.#sender.send(msg);
  }
}

module.exports = EmailServices;
