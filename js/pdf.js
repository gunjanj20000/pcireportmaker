/**
 * PCI Report Maker - Single-Page PDF & Mobile Print Engine
 */

function generatePDF() {
  const originalElement = document.getElementById('report-paper');
  if (!originalElement) return;

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

  // Create an off-screen container to isolate canvas generation from screen width and scroll offsets
  const offscreenContainer = document.createElement('div');
  offscreenContainer.style.position = 'fixed';
  offscreenContainer.style.left = '-9999px';
  offscreenContainer.style.top = '0';
  offscreenContainer.style.width = '794px';
  offscreenContainer.style.height = 'auto';
  offscreenContainer.style.zIndex = '-9999';
  offscreenContainer.style.overflow = 'visible';

  const clone = originalElement.cloneNode(true);
  clone.classList.add('force-single-page-export');
  clone.style.width = '794px';
  clone.style.margin = '0';
  clone.style.boxSizing = 'border-box';
  offscreenContainer.appendChild(clone);
  document.body.appendChild(offscreenContainer);

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
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      windowWidth: 794,
      width: 794
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'avoid-all' }
  };

  const cleanup = () => {
    if (document.body.contains(offscreenContainer)) {
      document.body.removeChild(offscreenContainer);
    }
    if (btnPdf) {
      btnPdf.innerHTML = originalHtml;
      btnPdf.disabled = false;
    }
  };

  if (window.html2pdf) {
    setTimeout(() => {
      window.html2pdf().set(opt).from(clone).save().then(() => {
        cleanup();
      }).catch(err => {
        console.error('PDF Generation Error:', err);
        cleanup();
        alert('Opening browser print to save single-page PDF.');
        window.print();
      });
    }, 100);
  } else {
    cleanup();
    window.print();
  }
}
