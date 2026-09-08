/**
 * PCI Report Maker - Single-Page PDF & Mobile Print Engine
 */

function generatePDF() {
  const element = document.getElementById('report-paper');
  if (!element) return;

  const patientName = document.getElementById('field-name')?.value || 'Patient';
  const reportDate = document.getElementById('field-date')?.value || new Date().toISOString().split('T')[0];
  const sanitizedName = patientName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `PCI_Report_${sanitizedName}_${reportDate}.pdf`;

  const btnPdf = document.getElementById('btn-save-pdf');
  const originalHtml = btnPdf ? btnPdf.innerHTML : '';
  if (btnPdf) {
    btnPdf.innerHTML = `<span>⏳ Generating PDF...</span>`;
    btnPdf.disabled = true;
  }

  // Force single-page print layout class during export
  element.classList.add('force-single-page-export');

  // Options engineered for exact single A4 page output on Mobile & Desktop
  const opt = {
    margin: [0, 0, 0, 0], // Margin handled inside paper-sheet padding
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      logging: false,
      letterRendering: true,
      windowWidth: 1024 // Fix virtual viewport width so mobile canvas renders desktop A4 proportions
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove('force-single-page-export');
      if (btnPdf) {
        btnPdf.innerHTML = originalHtml;
        btnPdf.disabled = false;
      }
    }).catch(err => {
      console.error('PDF Generation Error:', err);
      element.classList.remove('force-single-page-export');
      alert('Opening browser print to save single-page PDF.');
      window.print();
      if (btnPdf) {
        btnPdf.innerHTML = originalHtml;
        btnPdf.disabled = false;
      }
    });
  } else {
    element.classList.remove('force-single-page-export');
    window.print();
    if (btnPdf) {
      btnPdf.innerHTML = originalHtml;
      btnPdf.disabled = false;
    }
  }
}
