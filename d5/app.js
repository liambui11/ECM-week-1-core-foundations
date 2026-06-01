const form = document.getElementById("registration-form");
const submitBtn = document.getElementById("submit-btn");

const fields = {
  name: {
    el: document.getElementById("name"),
    validate: (v) => v.trim().length >= 3,
  },
  email: {
    el: document.getElementById("email"),
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  },
  password: {
    el: document.getElementById("password"),
    validate: (v) => {
      return (
        v.length >= 8 &&
        /[A-Z]/.test(v) &&
        /[0-9]/.test(v) &&
        /[^A-Za-z0-9]/.test(v)
      );
    },
  },
  confirm: {
    el: document.getElementById("confirm"),
    validate: (v) => v === fields.password.el.value,
  },
  phone: {
    el: document.getElementById("phone"),
    validate: (v) => /^[0-9]{10}$/.test(v),
  },
};

const messages = {
  name: "Name must be at least 3 characters.",
  email: "Please enter a valid email address.",
  password: "Min 8 chars, 1 uppercase, 1 number, 1 special char.",
  confirm: "Passwords do not match.",
  phone: "Phone must be exactly 10 digits.",
};

const validateField = (id, showUI = true) => {
  const field = fields[id];
  const isValid = field.validate(field.el.value);

  if (showUI) {
    const errorEl = field.el.nextElementSibling.classList.contains("error-msg")
      ? field.el.nextElementSibling
      : field.el.parentElement.querySelector(".error-msg");
    field.el.classList.toggle("invalid", !isValid);
    field.el.classList.toggle("valid", isValid);
    errorEl.textContent = isValid ? "" : messages[id];
  }

  checkFormValidity();
  return isValid;
};

const checkFormValidity = () => {
  const isAllValid = Object.keys(fields).every((id) =>
    fields[id].validate(fields[id].el.value),
  );
  submitBtn.disabled = !isAllValid;
};

fields.password.el.addEventListener("input", () => {
  const val = fields.password.el.value;
  const bar = document.getElementById("strength-bar");
  let strength = 0;
  if (val.length >= 8) strength += 25;
  if (/[A-Z]/.test(val)) strength += 25;
  if (/[0-9]/.test(val)) strength += 25;
  if (/[^A-Za-z0-9]/.test(val)) strength += 25;

  bar.style.width = strength + "%";
  bar.style.backgroundColor =
    strength <= 50 ? "#ef4444" : strength <= 75 ? "#f39c12" : "#22c55e";
  validateField("password");
  if (fields.confirm.el.value) validateField("confirm");
});

Object.keys(fields).forEach((id) => {
  const input = fields[id].el;
  if (input.type !== "password") {
    input.addEventListener("input", () => validateField(id));
  }
  input.addEventListener("blur", () => validateField(id));
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Form submitted successfully!");
});
