import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  // Use environment variables if configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate an Ethereal SMTP test account for development
    console.log("No SMTP credentials found in env. Creating Ethereal mock account...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
  return transporter;
};

export const sendApplicationEmail = async (data, pdfPath) => {
  try {
    const smtpTransporter = await getTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || '"CRM Job Shopee Notifications" <no-reply@crmjobshopee.com>',
      to: process.env.NOTIFICATION_EMAIL || "crmjobshopee.hr@gmail.com",
      subject: `New Job Application: ${data.name} for ${data.jobTitle}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Applicant Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Expected Salary:</strong> ${data.expectedSalary}</p>
        <p><strong>Job Title:</strong> ${data.jobTitle}</p>
        <br/>
        <p>A PDF summary containing candidate details has been attached to this email.</p>
        ${data.resumeUrl ? `<p>You can download the candidate's CV directly from: <a href="${data.resumeUrl}">Download CV</a></p>` : ""}
      `,
      attachments: [
        {
          filename: `Application_${data.name.replace(/\s+/g, "_")}.pdf`,
          path: pdfPath
        }
      ]
    };

    const info = await smtpTransporter.sendMail(mailOptions);
    console.log("Application email sent successfully.");
    
    // Log Ethereal URL if using test account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Ethereal Mock Email Preview URL]: ${previewUrl}`);
    }
    return info;
  } catch (error) {
    console.error("Failed to send application email:", error);
    throw error;
  }
};
