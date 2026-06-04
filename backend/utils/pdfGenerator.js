import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateApplicationPDF = (data, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);

      // Header block
      doc.rect(0, 0, doc.page.width, 120).fill("#15803d"); // Green primary color
      doc.fillColor("#ffffff")
         .fontSize(24)
         .text("JOB APPLICATION SUMMARY", 50, 45, { align: "center", bold: true });

      // Title & Date
      doc.fillColor("#333333").fontSize(18).text("Candidate Profile", 50, 150, { underline: true });
      doc.fontSize(10).fillColor("#666666").text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 175);

      // Horizontal separator
      doc.moveTo(50, 190).lineTo(doc.page.width - 50, 190).strokeColor("#cccccc").stroke();

      // Form layout for details
      let currentY = 210;
      const addField = (label, val) => {
        doc.fontSize(12).fillColor("#15803d").text(label, 50, currentY, { bold: true });
        doc.fontSize(12).fillColor("#333333").text(val || "N/A", 200, currentY);
        currentY += 25;
      };

      addField("Applicant Name:", data.name);
      addField("Email Address:", data.email);
      addField("Phone Number:", data.phone);
      addField("Location:", data.location);
      addField("Expected Salary:", data.expectedSalary);
      addField("Job Applied For:", data.jobTitle);

      currentY += 10;
      doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).strokeColor("#cccccc").stroke();
      currentY += 20;

      // Cover Letter Section
      doc.fontSize(14).fillColor("#15803d").text("Cover Letter", 50, currentY, { bold: true });
      currentY += 20;
      doc.fontSize(11).fillColor("#4b5563").text(data.coverLetter || "No cover letter provided.", 50, currentY, {
        width: doc.page.width - 100,
        align: "justify",
        lineGap: 4
      });

      // CV Link Section
      if (data.resumeUrl) {
        // Find Y position after cover letter text
        const textHeight = doc.heightOfString(data.coverLetter || "No cover letter provided.", {
          width: doc.page.width - 100
        });
        currentY += textHeight + 30;

        doc.moveTo(50, currentY).lineTo(doc.page.width - 50, currentY).strokeColor("#cccccc").stroke();
        currentY += 20;

        doc.fontSize(12).fillColor("#15803d").text("Applicant CV / Resume:", 50, currentY, { bold: true });
        doc.fontSize(12)
           .fillColor("#2563eb") // Blue link color
           .text("Download Resume", 200, currentY, {
             link: data.resumeUrl,
             underline: true
           });
      }

      doc.end();

      writeStream.on("finish", () => {
        resolve();
      });

      writeStream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
