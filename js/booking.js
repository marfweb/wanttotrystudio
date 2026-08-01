/* ==========================================================================
   booking.js — Booking page logic (WhatsApp-only flow)
   - Builds category / package selects from CONFIG
   - Generates time slots based on day-of-week operating hours
     (display only — availability is confirmed manually via WhatsApp)
   - Live pricing summary
   - On submit, builds a pre-filled, nicely formatted WhatsApp message with
     all booking details and opens a chat with the studio's number. No
     database, no backend — every booking is confirmed by chat.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("booking-form");
  if (!form) return; // not on booking page

  const dateInput = document.getElementById("bk-date");
  const catSelect = document.getElementById("bk-category");
  const pkgSelect = document.getElementById("bk-package");
  const peopleInput = document.getElementById("bk-people");
  const extraTimeInput = document.getElementById("bk-extra-time");
  const slotGrid = document.getElementById("bk-slot-grid");
  const slotHint = document.getElementById("bk-slot-hint");
  const hiddenSlotField = document.getElementById("bk-selected-slot");
  const formMsg = document.getElementById("bk-form-msg");
  const submitBtn = document.getElementById("bk-submit");

  // Summary elements
  const sumPackage = document.getElementById("sum-package");
  const sumDate = document.getElementById("sum-date");
  const sumTime = document.getElementById("sum-time");
  const sumPeople = document.getElementById("sum-people");
  const sumTotal = document.getElementById("sum-total");

  let selectedSlot = null;

  /* ---------- Populate category select ---------- */
  Object.entries(CONFIG.PACKAGES).forEach(([key, cat]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = cat.label;
    catSelect.appendChild(opt);
  });

  const populatePackages = () => {
    pkgSelect.innerHTML = "";
    const cat = CONFIG.PACKAGES[catSelect.value];
    if (!cat) return;
    Object.entries(cat.pkgs).forEach(([key, pkg]) => {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = `${pkg.label} — Rp${pkg.price.toLocaleString("id-ID")} (${pkg.people}, ${pkg.minutes} menit)`;
      pkgSelect.appendChild(opt);
    });
  };
  catSelect.addEventListener("change", () => { populatePackages(); updateSummary(); });
  populatePackages();

  /* ---------- Time slot generation ---------- */
  function getDayRule(date) {
    const day = date.getDay(); // 0=Sun..6=Sat
    if (CONFIG.HOURS.closedDays.includes(day)) return null;
    if (CONFIG.HOURS.weekday.days.includes(day)) return CONFIG.HOURS.weekday;
    if (CONFIG.HOURS.weekend.days.includes(day)) return CONFIG.HOURS.weekend;
    return null;
  }

  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }
  function toHHMM(mins) {
    const h = Math.floor(mins / 60).toString().padStart(2, "0");
    const m = (mins % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  }

  function renderSlots() {
    slotGrid.innerHTML = "";
    hiddenSlotField.value = "";
    selectedSlot = null;
    updateSummary();

    if (!dateInput.value) {
      slotHint.textContent = "Pilih tanggal terlebih dahulu untuk melihat pilihan jam.";
      return;
    }
    const date = new Date(dateInput.value + "T00:00:00");
    const rule = getDayRule(date);

    if (!rule) {
      slotHint.innerHTML = `<span class="form-msg closed show">Studio tutup pada tanggal ini. Silakan pilih tanggal lain.</span>`;
      return;
    }
    slotHint.textContent = "Jam berikut adalah jam operasional studio. Ketersediaan akan dikonfirmasi langsung melalui WhatsApp.";

    const startM = toMinutes(rule.open);
    const endM = toMinutes(rule.close);
    for (let t = startM; t < endM; t += CONFIG.SLOT_MINUTES) {
      const label = toHHMM(t);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        slotGrid.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
        btn.classList.add("selected");
        selectedSlot = label;
        hiddenSlotField.value = label;
        updateSummary();
      });
      slotGrid.appendChild(btn);
    }
  }

  dateInput.addEventListener("change", renderSlots);

  // Set min date to today
  const todayStr = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", todayStr);

  renderSlots();

  /* ---------- Live pricing summary ---------- */
  function updateSummary() {
    const cat = CONFIG.PACKAGES[catSelect.value];
    const pkg = cat ? cat.pkgs[pkgSelect.value] : null;

    sumPackage.textContent = pkg ? `${cat.label} — ${pkg.label}` : "—";
    sumDate.textContent = dateInput.value ? new Date(dateInput.value + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—";
    sumTime.textContent = selectedSlot || "—";
    sumPeople.textContent = peopleInput.value ? `${peopleInput.value} Orang` : "—";

    if (!pkg) { sumTotal.textContent = "Rp0"; return; }

    let total = pkg.price;

    // Extra people beyond package's base max (approximate using the number typed)
    const baseMax = parseInt(pkg.people.match(/\d+-(\d+)/)?.[1] || pkg.people.match(/\d+/)?.[0] || "0", 10);
    const peopleCount = parseInt(peopleInput.value || "0", 10);
    if (peopleCount > baseMax) total += (peopleCount - baseMax) * CONFIG.ADDONS.extraPerson;

    const extraTimeBlocks = parseInt(extraTimeInput.value || "0", 10);
    total += extraTimeBlocks * CONFIG.ADDONS.extraTime5min;

    sumTotal.textContent = "Rp" + total.toLocaleString("id-ID");
  }

  [pkgSelect, peopleInput, extraTimeInput].forEach(el => {
    el && el.addEventListener("input", updateSummary);
    el && el.addEventListener("change", updateSummary);
  });
  updateSummary();

  /* ---------- Build aligned "Label : Value" line for the WA message ---------- */
  const LABEL_WIDTH = 18;
  function line(label, value) {
    return `${label.padEnd(LABEL_WIDTH, " ")}: ${value}`;
  }

  /* ---------- Submit booking straight to WhatsApp ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    formMsg.className = "form-msg";

    const name = document.getElementById("bk-name").value.trim();
    const whatsapp = document.getElementById("bk-whatsapp").value.trim();
    const backgroundDetail = document.getElementById("bk-background").value.trim();
    const notes = document.getElementById("bk-notes").value.trim();

    if (!name || !whatsapp) {
      showMsg("error", "Nama dan Nomor WhatsApp wajib diisi.");
      return;
    }
    if (!dateInput.value) {
      showMsg("error", "Silakan pilih tanggal booking.");
      return;
    }
    const rule = getDayRule(new Date(dateInput.value + "T00:00:00"));
    if (!rule) {
      showMsg("error", "Studio tutup pada tanggal ini. Silakan pilih tanggal lain.");
      return;
    }
    if (!selectedSlot) {
      showMsg("error", "Silakan pilih jam booking.");
      return;
    }

    const cat = CONFIG.PACKAGES[catSelect.value];
    const pkg = cat.pkgs[pkgSelect.value];
    const dateLabel = new Date(dateInput.value + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const extraTimeBlocks = parseInt(extraTimeInput.value || "0", 10);

    const fieldLines = [
      line("Tanggal & Jam", `${dateLabel}, ${selectedSlot}`),
      line("Nama", name),
      line("No. WhatsApp", whatsapp),
      line("Jenis Studio/Box", backgroundDetail ? `${cat.label} (${backgroundDetail})` : cat.label),
      line("Paket Foto", `${pkg.label} — Rp${pkg.price.toLocaleString("id-ID")}`),
      line("Jumlah orang", `${peopleInput.value} Orang`),
      extraTimeBlocks > 0 ? line("Tambahan Waktu", `${extraTimeBlocks} x 5 menit`) : null,
      notes ? line("Catatan", notes) : null,
      line("Estimasi Total", sumTotal.textContent)
    ].filter(Boolean);

    const message = [
      "Halo WantToTry Studio, saya ingin booking sesi foto dengan detail berikut:",
      "",
      ...fieldLines,
      "",
      "Mohon info ketersediaan jam tersebut. Terima kasih!"
    ].join("\n");

    const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, "_blank", "noopener");
    showMsg("success", "Pesan booking sudah disiapkan di WhatsApp. Silakan kirim chat tersebut untuk menyelesaikan booking Anda.");
  });

  function showMsg(type, text) {
    formMsg.textContent = text;
    formMsg.className = `form-msg show ${type}`;
    formMsg.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});
