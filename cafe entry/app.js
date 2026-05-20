const STORAGE_KEY = "cafe_entries_v1";

const els = {
  form: document.getElementById("entryForm"),
  formTitle: document.getElementById("formTitle"),
  entryId: document.getElementById("entryId"),
  name: document.getElementById("name"),
  date: document.getElementById("date"),
  dob: document.getElementById("dob"),
  kycDoc: document.getElementById("kycDoc"),
  pcType: document.getElementById("pcType"),
  pcNo: document.getElementById("pcNo"),
  inTime: document.getElementById("inTime"),
  outTime: document.getElementById("outTime"),
  hours: document.getElementById("hours"),
  cash: document.getElementById("cash"),
  gpay: document.getElementById("gpay"),
  contact: document.getElementById("contact"),
  saveBtn: document.getElementById("saveBtn"),
  resetBtn: document.getElementById("resetBtn"),
  printBtn: document.getElementById("printBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  body: document.getElementById("entriesBody"),
  count: document.getElementById("entryCount"),
  emptyMsg: document.getElementById("emptyMsg"),
  table: document.getElementById("entriesTable"),
};

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function formatDateDMY(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function to12Hour(t24) {
  if (!t24) return "";
  const [hStr, m] = t24.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m}${ampm}`;
}

function formatTimeRange(inT, outT) {
  if (!inT && !outT) return "";
  return `${to12Hour(inT)} - ${to12Hour(outT)}`;
}

function computeDuration(inT, outT) {
  if (!inT || !outT) return "";
  const [ih, im] = inT.split(":").map(Number);
  const [oh, om] = outT.split(":").map(Number);
  let mins = (oh * 60 + om) - (ih * 60 + im);
  if (mins < 0) mins += 24 * 60;
  const h = Math.floor(mins / 60);
  const mm = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function readForm() {
  return {
    id: els.entryId.value || uid(),
    name: els.name.value.trim(),
    date: els.date.value,
    dob: els.dob.value,
    kycDoc: els.kycDoc.value.trim(),
    pcType: els.pcType.value,
    pcNo: els.pcNo.value.trim(),
    inTime: els.inTime.value,
    outTime: els.outTime.value,
    hours: els.hours.value.trim(),
    cash: els.cash.value,
    gpay: els.gpay.value,
    contact: els.contact.value.trim(),
  };
}

function fillForm(e) {
  els.entryId.value = e.id;
  els.name.value = e.name || "";
  els.date.value = e.date || "";
  els.dob.value = e.dob || "";
  els.kycDoc.value = e.kycDoc || "";
  els.pcType.value = e.pcType || "PC";
  els.pcNo.value = e.pcNo || "";
  els.inTime.value = e.inTime || "";
  els.outTime.value = e.outTime || "";
  els.hours.value = e.hours || "";
  els.cash.value = e.cash || "";
  els.gpay.value = e.gpay || "";
  els.contact.value = e.contact || "";
  els.formTitle.textContent = "Edit Entry";
  els.saveBtn.textContent = "Update Entry";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  els.form.reset();
  els.entryId.value = "";
  els.formTitle.textContent = "New Entry";
  els.saveBtn.textContent = "Save Entry";
  els.pcType.value = "PC";
  const today = new Date().toISOString().slice(0, 10);
  els.date.value = today;
}

function pcDisplay(e) {
  if (!e.pcType && !e.pcNo) return "";
  if (e.pcNo) return `${e.pcType} - ${e.pcNo}`;
  return e.pcType;
}

function render() {
  const entries = loadEntries();
  els.body.innerHTML = "";
  els.count.textContent = entries.length;

  if (entries.length === 0) {
    els.table.style.display = "none";
    els.emptyMsg.style.display = "block";
    return;
  }
  els.table.style.display = "table";
  els.emptyMsg.style.display = "none";

  entries.forEach((e) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(e.name)}</td>
      <td>${formatDateDMY(e.date)}</td>
      <td>${formatDateDMY(e.dob)}</td>
      <td>${escapeHtml(e.kycDoc)}</td>
      <td>${escapeHtml(pcDisplay(e))}</td>
      <td>${escapeHtml(e.pcNo)}</td>
      <td>${formatTimeRange(e.inTime, e.outTime)}</td>
      <td>${to12Hour(e.inTime)}</td>
      <td>${to12Hour(e.outTime)}</td>
      <td>${escapeHtml(e.hours)}</td>
      <td>${escapeHtml(e.cash)}</td>
      <td>${escapeHtml(e.gpay)}</td>
      <td>${escapeHtml(e.contact)}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm" data-action="edit" data-id="${e.id}">Edit</button>
        <button class="btn btn-danger btn-sm" data-action="delete" data-id="${e.id}">Del</button>
      </td>
    `;
    els.body.appendChild(tr);
  });
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

els.form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const entry = readForm();
  if (!entry.name || !entry.date) return;

  const entries = loadEntries();
  const existingIdx = entries.findIndex((e) => e.id === entry.id);
  if (existingIdx >= 0) {
    entries[existingIdx] = entry;
  } else {
    entries.push(entry);
  }
  saveEntries(entries);
  resetForm();
  render();
});

els.resetBtn.addEventListener("click", resetForm);

els.body.addEventListener("click", (ev) => {
  const btn = ev.target.closest("button[data-action]");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;
  const entries = loadEntries();

  if (action === "edit") {
    const e = entries.find((x) => x.id === id);
    if (e) fillForm(e);
  } else if (action === "delete") {
    if (!confirm("Delete this entry?")) return;
    saveEntries(entries.filter((x) => x.id !== id));
    render();
  }
});

els.clearAllBtn.addEventListener("click", () => {
  if (!confirm("Delete ALL entries? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  render();
});

els.printBtn.addEventListener("click", exportToExcel);

function exportToExcel() {
  const entries = loadEntries();
  if (entries.length === 0) {
    alert("No entries to export.");
    return;
  }

  const headers = [
    "NAME", "DATE", "DOB", "KYC.Doc", "PC/PS - 5", "PC/PS no.",
    "TIME", "IN", "OUT", "HOURS", "CASH", "GPAY", "CONTACT NO."
  ];

  const rows = entries.map((e) => [
    e.name || "",
    formatDateDMY(e.date),
    formatDateDMY(e.dob),
    e.kycDoc || "",
    pcDisplay(e),
    e.pcNo || "",
    formatTimeRange(e.inTime, e.outTime),
    computeDuration(e.inTime, e.outTime),
    "",
    e.hours || "",
    e.cash ? Number(e.cash) : "",
    e.gpay ? Number(e.gpay) : "",
    e.contact || "",
  ]);

  const aoa = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  ws["!cols"] = [
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    { wch: 10 }, { wch: 22 }, { wch: 8 },  { wch: 8 },  { wch: 10 },
    { wch: 8 },  { wch: 8 },  { wch: 14 },
  ];

  const headerStyle = {
    fill: { patternType: "solid", fgColor: { rgb: "FFFF00" } },
    font: { bold: true, color: { rgb: "CC0000" } },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } },
    },
  };

  const cellBorder = {
    top: { style: "thin", color: { rgb: "000000" } },
    bottom: { style: "thin", color: { rgb: "000000" } },
    left: { style: "thin", color: { rgb: "000000" } },
    right: { style: "thin", color: { rgb: "000000" } },
  };

  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[addr]) ws[addr] = { t: "s", v: "" };
      if (R === 0) {
        ws[addr].s = headerStyle;
      } else {
        ws[addr].s = { border: cellBorder, alignment: { vertical: "center" } };
      }
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cafe Entries");

  const today = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `cafe-entries-${today}.xlsx`);
}

resetForm();
render();
