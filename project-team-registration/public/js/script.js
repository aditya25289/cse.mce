const form = document.getElementById("teamForm");
const msg = document.getElementById("msg");
const error = document.getElementById("error");
const submitBtn = document.getElementById("submitBtn");

const nameEl = document.getElementById("name");
const roll = document.getElementById("roll");
const email = document.getElementById("email");
const branch = document.getElementById("branch");
const phone = document.getElementById("phone");
const year = document.getElementById("year");
const semester = document.getElementById("semester");
const area = document.getElementById("area");
const confirmChk = document.getElementById("confirm");

const branchHint = document.getElementById("branchHint");
const semesterHint = document.getElementById("semesterHint");

const otherBranchInput = document.getElementById("otherBranchInput");
const otherLangCheckbox = document.getElementById("otherLang");
const otherLangInput = document.getElementById("otherLangInput");

const proficiency = document.getElementById("proficiency");
const proficiencyValue = document.getElementById("proficiencyValue");

const confirmationModal = document.getElementById("confirmationModal");
const whatsappBtn = document.getElementById("whatsappBtn");
const emailBtn = document.getElementById("emailBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

// Initialize form state
otherBranchInput.style.display = "none";
otherLangInput.style.display = "none";

// Live display for range
proficiency.addEventListener("input", function () {
  proficiencyValue.textContent = this.value;
});

// Show/hide other branch input
branch.addEventListener("change", function () {
  if (branch.value === "Other") {
    otherBranchInput.style.display = "block";
    otherBranchInput.setAttribute("required", "");
    branchHint.className = "instructions warn";
    branchHint.textContent = "Only CSE is eligible to submit; 'Other' is for display only.";
  } else {
    otherBranchInput.style.display = "none";
    otherBranchInput.removeAttribute("required");
    branchHint.textContent = branch.value && branch.value !== "CSE"
      ? "Only CSE is eligible to submit; others can still view this form."
      : "";
    branchHint.className = branch.value === "CSE" ? "instructions ok" : "instructions warn";
  }
});

// Show/hide other language input
otherLangCheckbox.addEventListener("change", function () {
  if (otherLangCheckbox.checked) {
    otherLangInput.style.display = "block";
    otherLangInput.setAttribute("required", "");
  } else {
    otherLangInput.style.display = "none";
    otherLangInput.removeAttribute("required");
  }
});

// Real-time phone validation (Indian 10-digit starting 6–9)
phone.addEventListener("input", function () {
  const ok = /^[6-9][0-9]{9}$/.test(phone.value.trim());
  toggleFieldError(phone, "phoneError", !ok);
});

// Real-time email validation
email.addEventListener("input", function () {
  const ok = email.validity.valid && /\S+@\S+\.\S+/.test(email.value.trim());
  toggleFieldError(email, "emailError", !ok);
});

// Update semester inline hint
semester.addEventListener("change", () => {
  if (!semester.value) {
    semesterHint.textContent = "";
    semesterHint.className = "instructions";
    return;
  }
  if (semester.value === "2nd Semester") {
    semesterHint.textContent = "Eligible semester selected.";
    semesterHint.className = "instructions ok";
  } else {
    semesterHint.textContent = "Only 2nd Semester submissions are accepted.";
    semesterHint.className = "instructions warn";
  }
});

// Utility: toggle a field's error state and aria-invalid
function toggleFieldError(field, errorId, show) {
  const err = document.getElementById(errorId);
  if (show) {
    field.classList.add("input-error");
    field.setAttribute("aria-invalid", "true");
    if (err) err.style.display = "block";
  } else {
    field.classList.remove("input-error");
    field.removeAttribute("aria-invalid");
    if (err) err.style.display = "none";
  }
}

// Focus trap for modal
function initFocusTrap() {
  const focusable = confirmationModal.querySelectorAll("button, [tabindex='0']");
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handler(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
  confirmationModal.addEventListener("keydown", handler);
  first.focus();
}

// Gather all required fields at the time of submission (handles dynamic required)
function getRequiredFields() {
  return form.querySelectorAll("[required]");
}

// Trim helpers on blur
[nameEl, roll, email, phone, otherBranchInput, otherLangInput].forEach?.(el => {
  if (!el) return;
  el.addEventListener("blur", () => { el.value = el.value.trim(); });
});

// Generic “blur” required check (delegated)
form.addEventListener("focusout", (e) => {
  const t = e.target;
  if (!(t instanceof HTMLElement)) return;
  if (t.hasAttribute("required")) {
    const empty = !t.value || !t.value.trim();
    const errorId = t.id + "Error";
    toggleFieldError(t, errorId, empty);
  }
});

// Submission
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const spinner = submitBtn.querySelector(".fa-spinner");
  const btnText = submitBtn.querySelector("span");
  submitBtn.disabled = true;
  spinner.style.display = "inline-block";
  btnText.textContent = "Submitting...";

  // Clear previous state
  msg.style.display = "none";
  error.style.display = "none";
  document.querySelectorAll(".error-text").forEach(el => (el.style.display = "none"));
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));

  let isValid = true;
  const errors = [];

  // Restrictions (visible options but enforced on submit)
  if (branch.value !== "CSE") {
    errors.push("Only Computer Science & Engineering (CSE) students are eligible.");
    toggleFieldError(branch, "branchError", true);
  } else {
    toggleFieldError(branch, "branchError", false);
  }

  if (semester.value !== "2nd Semester") {
    errors.push("Only students of 2nd Semester are eligible.");
    toggleFieldError(semester, "semesterError", true);
  } else {
    toggleFieldError(semester, "semesterError", false);
  }

  // Phone format
  if (!/^[6-9][0-9]{9}$/.test(phone.value.trim())) {
    errors.push("Please enter a valid 10-digit Indian mobile number starting with 6–9.");
    toggleFieldError(phone, "phoneError", true);
  } else {
    toggleFieldError(phone, "phoneError", false);
  }

  // Email format
  const emailOk = email.validity.valid && /\S+@\S+\.\S+/.test(email.value.trim());
  if (!emailOk) {
    errors.push("Please enter a valid email address (e.g., your.name@domain.com).");
    toggleFieldError(email, "emailError", true);
  } else {
    toggleFieldError(email, "emailError", false);
  }

  // Required fields (dynamic safe)
  const requiredFields = getRequiredFields();
  requiredFields.forEach(field => {
    const empty = !field.value || !field.value.trim();
    if (empty) {
      isValid = false;
      const errorId = field.id + "Error";
      toggleFieldError(field, errorId, true);
    }
  });

  // If “Other” selected, ensure inputs are provided
  if (branch.value === "Other" && !otherBranchInput.value.trim()) {
    isValid = false;
    errors.push("Please specify your branch in the 'Other' field.");
    otherBranchInput.classList.add("input-error");
  }
  if (otherLangCheckbox.checked && !otherLangInput.value.trim()) {
    isValid = false;
    errors.push("Please specify your 'Other' programming language.");
    otherLangInput.classList.add("input-error");
  }

  if (!isValid || errors.length) {
    error.textContent = `⚠️ Please fix the following issues:\n${errors.join("\n")}`;
    error.style.display = "block";
    const firstError = form.querySelector(".input-error") || branch || semester;
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      firstError.focus?.();
    }
    submitBtn.disabled = false;
    spinner.style.display = "none";
    btnText.textContent = "Submit Registration";
    return;
  }

  // Collect data
  const formData = {
    name: nameEl.value.trim(),
    roll: roll.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    year: year.value,
    semester: semester.value,
    branch: branch.value,
    otherBranch: otherBranchInput.value.trim(),
    lang: Array.from(document.querySelectorAll('input[name="lang"]:checked')).map(el => el.value),
    otherLang: otherLangInput.value.trim(),
    proficiency: document.getElementById("proficiency").value,
    area: area.value,
    experience: document.getElementById("experience").value.trim(),
    hours: document.querySelector('input[name="hours"]:checked')?.value || "",
    learn: document.querySelector('input[name="learn"]:checked')?.value || "",
    reason: document.getElementById("reason").value.trim(),
    confirm: confirmChk.checked
  };

  // Submit
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      confirmationModal.classList.add("active");
      confirmationModal.setAttribute("aria-hidden", "false");
      initFocusTrap();
    } else {
      error.textContent = `⚠️ ${result.error || "Submission failed. Please try again."}`;
      error.style.display = "block";
    }
  } catch (err) {
    error.textContent = "⚠️ Submission failed. Please try again later.";
    error.style.display = "block";
  }

  submitBtn.disabled = false;
  spinner.style.display = "none";
  btnText.textContent = "Submit Registration";
});

// WhatsApp confirmation
whatsappBtn.addEventListener("click", function () {
  const name = nameEl.value.trim();
  let phoneNumber = phone.value.trim();
  if (!phoneNumber.startsWith("+91")) phoneNumber = `+91${phoneNumber}`;
  const message = `Hi ${name}! Thank you for registering for our Project Team. Your registration has been received successfully. We will contact you soon regarding the next steps.`;
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  confirmationModal.classList.remove("active");
  confirmationModal.setAttribute("aria-hidden", "true");
  showSuccessMessage("Confirmation sent via WhatsApp!");
});

// Email confirmation
emailBtn.addEventListener("click", function () {
  const name = nameEl.value.trim();
  const emailVal = email.value.trim();
  const subject = "Project Team Registration Confirmation";
  const body = `Dear ${name},\n\nThank you for registering for our Project Team. Your registration has been received successfully.\n\nWe will contact you soon regarding the next steps.\n\nBest regards,\nProject Team`;
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  window.location.href = `mailto:${emailVal}?subject=${encodedSubject}&body=${encodedBody}`;
  confirmationModal.classList.remove("active");
  confirmationModal.setAttribute("aria-hidden", "true");
  showSuccessMessage("Confirmation sent via Email!");
});

// Close modal
closeModalBtn.addEventListener("click", function () {
  confirmationModal.classList.remove("active");
  confirmationModal.setAttribute("aria-hidden", "true");
  showSuccessMessage("Registration submitted successfully!");
});

// Show success message and reset form
function showSuccessMessage(message) {
  msg.textContent = message;
  msg.style.display = "block";
  setTimeout(() => {
    form.reset();
    otherBranchInput.style.display = "none";
    otherBranchInput.removeAttribute("required");
    otherLangInput.style.display = "none";
    otherLangInput.removeAttribute("required");
    proficiencyValue.textContent = "3";
    branchHint.textContent = "";
    semesterHint.textContent = "";
    document.querySelectorAll(".error-text").forEach(el => (el.style.display = "none"));
    document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    msg.style.display = "none";
  }, 10000);
}
