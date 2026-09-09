let currentSessionId = null;

const uploadBtn = document.getElementById("uploadBtn");
const processBtn = document.getElementById("processBtn");
const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const dropText = document.getElementById("dropText");

/* ---------- icon set per detected PII type ---------- */

const ICONS = {
  "Name": '<path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c1.5-4 4.7-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  "Email": '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  "Phone Number": '<rect x="7" y="2" width="10" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M11 18h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  "Address": '<path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  "Aadhaar Number": '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 15v-2a3 3 0 0 1 6 0v2M16 9h2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  "PAN Number": '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 9h6M7 13h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  "Social Security Number": '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 9h10M7 13h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  "Passport Number": '<rect x="5" y="2" width="14" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 17h8" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  "Date of Birth": '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  "Account Number": '<rect x="2" y="7" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2 11h20" stroke="currentColor" stroke-width="1.6"/>',
  "Card Number": '<rect x="2" y="6" width="20" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2 10.5h20M6 15h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  "Gender": '<circle cx="10" cy="14" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M14 10 19 5m0 0h-4m4 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  "Salary / Financial Info": '<path d="M4 20V10m6 10V4m6 16v-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  "Unknown": '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 16v.01M12 8a2.2 2.2 0 0 1 2.2 2.2c0 1.5-2.2 1.7-2.2 3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
};

function iconFor(label) {
  const path = ICONS[label] || ICONS["Unknown"];
  return `<svg viewBox="0 0 24 24">${path}</svg>`;
}

/* ---------- dropzone UX ---------- */

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    dropText.textContent = fileInput.files[0].name;
  }
});

["dragover", "dragenter"].forEach(evt => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "var(--primary-2)";
    dropzone.style.background = "rgba(0, 217, 255, 0.09)";
  });
});
["dragleave", "drop"].forEach(evt => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "";
    dropzone.style.background = "";
  });
});
dropzone.addEventListener("drop", (e) => {
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    dropText.textContent = e.dataTransfer.files[0].name;
  }
});

/* ---------- gauges ---------- */

const GAUGE_CIRC = 314; // 2 * PI * r(50)

function setGauge(fillEl, score, colorStops) {
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const offset = GAUGE_CIRC - pct * GAUGE_CIRC;

  if (colorStops) {
    const color = score >= 66 ? colorStops.high : score >= 33 ? colorStops.mid : colorStops.low;
    fillEl.style.stroke = color;
  }

  // reset then animate on next frame so the transition always plays
  fillEl.style.strokeDashoffset = GAUGE_CIRC;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fillEl.style.strokeDashoffset = offset;
    });
  });
}

const RISK_STOPS = { high: "#FF5C7A", mid: "#FFC15E", low: "#2FF3B7" };
const IMPROVE_STOPS = { high: "#2FF3B7", mid: "#FFC15E", low: "#FF5C7A" }; // for "after" gauge, low risk should read as good (still color-coded by risk value)

/* ---------- upload ---------- */

uploadBtn.addEventListener("click", async () => {
  const status = document.getElementById("uploadStatus");

  if (!fileInput.files.length) {
    status.textContent = "Please choose a CSV file first.";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  status.textContent = "Uploading and scanning...";
  uploadBtn.disabled = true;

  try {
    const res = await fetch("/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (data.error) {
      status.textContent = "Error: " + data.error;
      uploadBtn.disabled = false;
      return;
    }

    currentSessionId = data.session_id;
    status.textContent = `Loaded ${data.filename} (${data.num_records} records).`;
    document.getElementById("riskBefore").textContent = data.risk_before;
    setGauge(document.getElementById("gaugeBeforeFill"), data.risk_before, RISK_STOPS);
    renderColumnsTable(data.columns);
    document.getElementById("review-section").classList.remove("hidden");
    document.getElementById("review-section").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    status.textContent = "Something went wrong while uploading.";
  } finally {
    uploadBtn.disabled = false;
  }
});

function renderColumnsTable(columns) {
  const tbody = document.querySelector("#columnsTable tbody");
  tbody.innerHTML = "";

  columns.forEach(col => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${col.column}</td>
      <td>
        <span class="type-pill">${iconFor(col.label)}${col.label}</span>
      </td>
      <td>
        <div class="confidence-bar"><span style="width:${col.confidence}%"></span></div>
        <span class="confidence-text">${col.confidence}%</span>
      </td>
      <td class="sample-values">${col.sample_values.join(", ")}</td>
      <td>
        <select data-column="${col.column}">
          <option value="skip" ${!col.detected ? "selected" : ""}>Skip</option>
          <option value="mask" ${col.detected ? "selected" : ""}>Mask</option>
          <option value="hash">Hash</option>
          <option value="encrypt">Encrypt</option>
          <option value="tokenize">Tokenize</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/* ---------- process ---------- */

processBtn.addEventListener("click", async () => {
  const selects = document.querySelectorAll("#columnsTable select");
  const columnMethods = {};
  selects.forEach(sel => {
    columnMethods[sel.dataset.column] = sel.value;
  });

  processBtn.disabled = true;

  try {
    const res = await fetch("/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: currentSessionId, column_methods: columnMethods })
    });

    const data = await res.json();
    if (data.error) {
      alert("Error: " + data.error);
      return;
    }

    document.getElementById("riskBeforeResult").textContent = data.risk_before;
    document.getElementById("riskAfterResult").textContent = data.risk_after;
    setGauge(document.getElementById("gaugeResultBeforeFill"), data.risk_before, RISK_STOPS);
    setGauge(document.getElementById("gaugeResultAfterFill"), data.risk_after, RISK_STOPS);
    document.getElementById("csvLink").href = "/download/" + data.csv_download;
    document.getElementById("reportLink").href = "/download/" + data.report_download;

    if (data.encryption_key) {
      document.getElementById("encKey").textContent = data.encryption_key;
      document.getElementById("keyNotice").classList.remove("hidden");
    }

    document.getElementById("result-section").classList.remove("hidden");
    document.getElementById("result-section").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    alert("Something went wrong while applying protection.");
  } finally {
    processBtn.disabled = false;
  }
});
