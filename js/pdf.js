/**
 * PCI Report Maker - PDF Generator Logic
 */

function generatePDF() {
  const element = document.getElementById('report-paper');
  if (!element) return;

  const patientName = document.getElementById('field-name')?.value || 'Patient';
  const reportDate = document.getElementById('field-date')?.value || new Date().toISOString().split('T')[0];
  const sanitizedName = patientName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `PCI_Report_${sanitizedName}_${reportDate}.pdf`;

  // Options for html2pdf
  const opt = {
    margin: [10, 12, 10, 12], // [top, left, bottom, right] in mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Show status notification
  const btnPdf = document.getElementById('btn-save-pdf');
  const originalHtml = btnPdf ? btnPdf.innerHTML : '';
  if (btnPdf) {
    btnPdf.innerHTML = `<span>⏳ Generating PDF...</span>`;
    btnPdf.disabled = true;
  }

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save().then(() => {
      if (btnPdf) {
        btnPdf.innerHTML = originalHtml;
        btnPdf.disabled = false;
      }
    }).catch(err => {
      console.error('PDF Generation Error:', err);
      alert('Error generating PDF. Printing will open as fallback.');
      window.print();
      if (btnPdf) {
        btnPdf.innerHTML = originalHtml;
        btnPdf.disabled = false;
      }
    });
  } else {
    // Fallback if script loading failed
    window.print();
    if (btnPdf) {
      btnPdf.innerHTML = originalHtml;
      btnPdf.disabled = false;
    }
  }
}
