/**
 * PCI Report Maker - Dynamic Dropdown, Responsive Mobile & Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  populateDropdowns();
  bindFormEvents();
  initHistoryStorage();
  initDoctorDefaults();
});

// Mobile & Tablet View Switching (Form Cards <-> Live Performa Preview)
function switchMobileView(viewMode) {
  const container = document.getElementById('app-container');
  const btnEditor = document.getElementById('tab-btn-editor');
  const btnPreview = document.getElementById('tab-btn-preview');

  if (!container) return;

  if (viewMode === 'show-editor') {
    container.classList.remove('show-preview');
    container.classList.add('show-editor');
    if (btnEditor) btnEditor.classList.add('active');
    if (btnPreview) btnPreview.classList.remove('active');
  } else {
    container.classList.remove('show-editor');
    container.classList.add('show-preview');
    if (btnPreview) btnPreview.classList.add('active');
    if (btnEditor) btnEditor.classList.remove('active');
  }
}

// Initialize Default Date & Time
function initDateDefaults() {
  const dateInput = document.getElementById('field-date');
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    updatePreviewField('date', today);
  }
}

// Initial Doctors Default
function initDoctorDefaults() {
  const d1 = document.getElementById('field-doc1')?.value || 'Dr. PRAKASH CHANDWANI';
  const d2 = document.getElementById('field-doc2')?.value || 'Dr. KUSHAL JANGID';
  const d3 = document.getElementById('field-doc3')?.value || 'Dr. NITESH PANSARI';
  
  updatePreviewField('doc1', d1);
  updatePreviewField('doc2', d2);
  updatePreviewField('doc3', d3);
}

// Populate ALL Dropdowns with Defaults + Saved Customs
function populateDropdowns() {
  const dropdowns = document.querySelectorAll('select.dropdown-select');
  dropdowns.forEach(select => {
    const categoryKey = select.getAttribute('data-category');
    const targetFieldId = select.getAttribute('data-target');
    if (!categoryKey) return;

    const presets = getCombinedPresets(categoryKey);
    const currentValue = select.value;

    let html = `<option value="">-- Select from Dropdown List --</option>`;
    presets.forEach(item => {
      html += `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`;
    });
    html += `<option value="__ADD_CUSTOM__" class="opt-add-custom">➕ Add New Custom Entry...</option>`;

    select.innerHTML = html;
    if (currentValue && currentValue !== '__ADD_CUSTOM__') {
      select.value = currentValue;
    }

    // Attach change listener
    select.onchange = () => handleDropdownChange(select, categoryKey, targetFieldId);
  });
}

// Handle Dropdown Selection
function handleDropdownChange(selectElem, categoryKey, targetFieldId) {
  const selectedVal = selectElem.value;
  const targetInput = document.getElementById(targetFieldId);
  
  if (selectedVal === '__ADD_CUSTOM__') {
    const fieldTitle = selectElem.previousElementSibling?.querySelector('label')?.textContent || categoryKey;
    promptAddCustom(categoryKey, targetFieldId, fieldTitle, selectElem);
    return;
  }

  if (targetInput) {
    targetInput.value = selectedVal;
    targetInput.dispatchEvent(new Event('input'));
  }
}

// Prompt & Save New Custom Dropdown Entry
function promptAddCustom(categoryKey, targetFieldId, fieldTitle, selectElem) {
  const userText = prompt(`Enter new custom "${fieldTitle}" option to save permanently in your dropdown list:`);
  if (userText && userText.trim() !== '') {
    const cleanText = userText.trim();
    
    // Save to LocalStorage permanently
    saveCustomPreset(categoryKey, cleanText);
    
    // Re-populate all dropdowns for this category
    populateDropdowns();

    // Set input value & select option
    const targetInput = document.getElementById(targetFieldId);
    if (targetInput) {
      targetInput.value = cleanText;
      targetInput.dispatchEvent(new Event('input'));
    }

    if (selectElem) {
      selectElem.value = cleanText;
    }
  } else {
    // Reset dropdown selection if cancelled
    if (selectElem) {
      selectElem.value = '';
    }
  }
}

// Bind Input Events to Live Preview
function bindFormEvents() {
  const formInputs = document.querySelectorAll('[id^="field-"]');
  formInputs.forEach(input => {
    const fieldKey = input.id.replace('field-', '');
    
    input.addEventListener('input', () => {
      updatePreviewField(fieldKey, input.value);
    });

    input.addEventListener('change', () => {
      updatePreviewField(fieldKey, input.value);
    });
  });
}

// Live Update Preview paper
function updatePreviewField(key, val) {
  const target = document.getElementById(`preview-${key}`);
  if (target) {
    target.textContent = val || '';
  }
}

// Quick Fill Demo Data
function fillDemoData() {
  const demoData = {
    name: "RAMESH KUMAR SHARMA",
    age: "58 Y",
    sex: "Male",
    regNo: "IPD-88421",
    cathNo: "CATH-2026-104",
    date: new Date().toISOString().split('T')[0],
    address: "Jaipur, Rajasthan",
    operator: "Dr. PRAKASH CHANDWANI / Dr. KUSHAL JANGID",
    indication: "Acute Anterior Wall Myocardial Infarction (AWMI)",
    lesion1: "LAD: 95% Subtotal Stenosis in Proximal Segment",
    lesion2: "LCX: 40% Irregular Plaque in Mid Segment",
    lesion3: "Nil / Normal Coronaries",
    route: "Right Radial",
    aorticPressure: "130/80 mmHg",
    contrast: "Omnipaque 350 (90 ml)",
    gp2b3a: "Inj. Eptifibatide (Bolus 180 mcg/kg + Infusion)",
    guidingCatheter: "6F EBU 3.5 (Medtronic)",
    guideWire: "Runthrough NS 0.014\" x 180 cm",
    preDilatation: "NC Balloon 2.5 x 12 mm @ 14 atm",
    stent: "DES (Resolute Onyx) 3.0 x 28 mm",
    postDilatation: "NC Balloon 3.25 x 12 mm @ 18 atm",
    endResult: "TIMI III Flow with 0% Residual Stenosis and no dissection/thrombus.",
    conclusion: "Successful Primary PCI to LAD with Drug Eluting Stent (DES).",
    advise: "1. Tab. Aspirin 75mg OD continuously.\n2. Tab. Ticagrelor 90mg BD for 12 months.\n3. Tab. Atorvastatin 80mg HS.\n4. Radial puncture site care; review in Cath OPD after 7 days.",
    doc1: "Dr. PRAKASH CHANDWANI",
    doc2: "Dr. KUSHAL JANGID",
    doc3: "Dr. NITESH PANSARI"
  };

  Object.keys(demoData).forEach(key => {
    const input = document.getElementById(`field-${key}`);
    if (input) {
      input.value = demoData[key];
      updatePreviewField(key, demoData[key]);
    }
  });
}

// Clear Form / New Report
function clearForm() {
  if (confirm("Are you sure you want to clear the form? Any unsaved data will be lost.")) {
    const inputs = document.querySelectorAll('[id^="field-"]');
    inputs.forEach(input => {
      input.value = '';
      const key = input.id.replace('field-', '');
      updatePreviewField(key, '');
    });
    initDateDefaults();
    initDoctorDefaults();
    populateDropdowns();
  }
}

// History Storage & Management
const STORAGE_KEY = 'cks_pci_reports_history';

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveReportToHistory() {
  const name = document.getElementById('field-name')?.value || 'Unnamed Patient';
  const regNo = document.getElementById('field-regNo')?.value || '';
  const date = document.getElementById('field-date')?.value || new Date().toISOString().split('T')[0];

  const reportData = {};
  document.querySelectorAll('[id^="field-"]').forEach(input => {
    const key = input.id.replace('field-', '');
    reportData[key] = input.value;
  });

  const record = {
    id: 'PCI_' + Date.now(),
    name: name,
    regNo: regNo,
    date: date,
    savedAt: new Date().toLocaleString(),
    data: reportData
  };

  const history = getHistory();
  history.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

  alert(`Report for "${name}" saved to local history successfully!`);
}

function toggleHistoryModal(show) {
  const modal = document.getElementById('history-modal');
  if (!modal) return;
  if (show) {
    renderHistoryList();
    modal.classList.add('active');
  } else {
    modal.classList.remove('active');
  }
}

function renderHistoryList() {
  const listContainer = document.getElementById('history-list-container');
  if (!listContainer) return;

  const history = getHistory();
  if (history.length === 0) {
    listContainer.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No saved reports found in local history.</p>';
    return;
  }

  listContainer.innerHTML = history.map((item) => `
    <div class="history-item">
      <div class="history-item-info">
        <h4>${escapeHtml(item.name)} <span style="font-weight:normal; font-size: 0.8rem; color:#6b7280;">(${escapeHtml(item.regNo || 'No Reg No')})</span></h4>
        <p>Date: ${escapeHtml(item.date)} | Saved: ${escapeHtml(item.savedAt)}</p>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-primary" onclick="loadHistoryItem('${item.id}')">Load</button>
        <button class="btn btn-danger" onclick="deleteHistoryItem('${item.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function loadHistoryItem(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (item && item.data) {
    Object.keys(item.data).forEach(key => {
      const input = document.getElementById(`field-${key}`);
      if (input) {
        input.value = item.data[key];
        updatePreviewField(key, item.data[key]);
      }
    });
    toggleHistoryModal(false);
  }
}

function deleteHistoryItem(id) {
  if (confirm("Delete this saved report from history?")) {
    let history = getHistory();
    history = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    renderHistoryList();
  }
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
