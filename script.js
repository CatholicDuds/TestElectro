const form = document.getElementById('interestForm');
const success = document.getElementById('formSuccess');
const errorMessage = document.getElementById('formError');
const counter = document.getElementById('interestCount');
const year = document.getElementById('year');
const anonymousCheckbox = document.getElementById('anonymousSubmission');
const nameInput = form.elements.namedItem('nome');
const contactInput = form.elements.namedItem('contato');

year.textContent = new Date().getFullYear();

function updateAnonymousFields() {
  const anonymous = anonymousCheckbox.checked;
  [nameInput, contactInput].forEach((field) => {
    field.required = !anonymous;
    field.disabled = anonymous;
    if (anonymous) field.value = '';
  });
}

anonymousCheckbox.addEventListener('change', updateAnonymousFields);
updateAnonymousFields();

function getLeads() {
  try {
    return JSON.parse(localStorage.getItem('makerja_leads')) || [];
  } catch {
    return [];
  }
}

function updateCounter() {
  counter.textContent = getLeads().length;
}

const params = new URLSearchParams(window.location.search);
if (params.get('enviado') === '1') {
  success.hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

form.addEventListener('submit', () => {
  const data = Object.fromEntries(new FormData(form).entries());
  delete data._subject;
  delete data._template;
  delete data._captcha;
  delete data._next;
  delete data._honey;

  const leads = getLeads();
  leads.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem('makerja_leads', JSON.stringify(leads));

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: 'validacao',
      perfil: data.perfil || 'nao_informado',
      frete_preferido: data.frete || 'nao_informado'
    });
  }

  updateCounter();
});

updateCounter();
