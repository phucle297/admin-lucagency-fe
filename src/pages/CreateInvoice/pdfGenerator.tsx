import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import { IInvoice } from "@constants/invoices";
import Pdf from "./Pdf";

const generatePdf = async (invoiceData: IInvoice) => {
  const pdf = new jsPDF("p", "pt", "a4");
  pdf.setProperties({
    title: "Invoice",
    subject: "Invoice Document",
    author: "Your Name",
  });

  const container = document.createElement("div");
  document.body.appendChild(container);

  // Render the React component to the container
  ReactDOM.render(<Pdf invoiceData={invoiceData} />, container);

  // Use html2canvas to capture the rendered content as an image
  const canvas = await html2canvas(container, {
    scale: 1, // Increase scale for higher DPI
    logging: true, // Enable logging for troubleshooting
    useCORS: true, // Enable CORS support
    allowTaint: true, // Allow taint (required if content includes images from other domains)
  });
  const imgData = canvas.toDataURL("image/png");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 10;
  pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

  // Save the PDF to a file
  pdf.save("invoice.pdf");

  // Clean up: remove the temporary container
  document.body.removeChild(container);
};

export default generatePdf;
