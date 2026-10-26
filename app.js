"use strict";
const menu = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}));
document.querySelectorAll('[data-equipment]').forEach(link => link.addEventListener('click', () => {
  document.getElementById('equipment').value = link.dataset.equipment;
}));
let dialogOpener;
const contactDialog = document.getElementById('contact-dialog');
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  dialogOpener = button;
  contactDialog.showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => dialogOpener?.focus());
});
const inquiry = document.getElementById('rental-inquiry');
const inquiryError = document.getElementById('inquiry-error');
inquiry.addEventListener('input', event => {
  if (event.target.validity?.valid) event.target.removeAttribute('aria-invalid');
  if (inquiry.checkValidity()) inquiryError.hidden = true;
});
inquiry.addEventListener('submit', event => {
  event.preventDefault();
  const error = document.getElementById('inquiry-error');
  error.hidden = true;
  if (!inquiry.checkValidity()) {
    for (const field of inquiry.elements) {
      if (field.willValidate) field.setAttribute('aria-invalid', String(!field.validity.valid));
    }
    error.textContent = 'Check your details. Guest or crew count must be a whole number between 1 and 100,000, or leave it blank.';
    error.hidden = false;
    inquiry.reportValidity();
    return;
  }
  for (const field of inquiry.elements) field.removeAttribute('aria-invalid');
  const values = new FormData(inquiry);
  const entries = [
    ['Occasion', values.get('occasion')],
    ['Equipment', values.get('equipment')],
    ['Start date', values.get('date') || 'To be discussed'],
    ['Guests or crew', values.get('guests') || 'To be discussed'],
    ['Event city or area', String(values.get('city')).trim() || 'To be discussed'],
    ['Additional details', String(values.get('notes')).trim() || 'None added']
  ];
  const summary = document.getElementById('inquiry-summary');
  summary.replaceChildren();
  for (const [label, value] of entries) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    summary.append(row);
  }
  dialogOpener = inquiry.querySelector('[type="submit"]');
  document.getElementById('inquiry-dialog').showModal();
});
