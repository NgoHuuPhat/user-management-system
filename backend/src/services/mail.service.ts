import nodemailer from 'nodemailer'

const sendEmail = async (email: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"User Management System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  })
}

const mailTemplate = (otp: number) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Password Reset OTP</h2>
      <p>Your OTP for password reset is:</p>
      <h1 style="color: #007BFF;">${otp}</h1>
      <p>This OTP is valid for the next 3 minutes. If you did not request a password reset, please ignore this email.</p>
      <br/>
      <p>Best regards,<br/>User Management System Team</p>
    </div>
  `
}

export { sendEmail, mailTemplate }