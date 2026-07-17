const form = document.getElementById('interestForm');
const success = document.getElementById('formSuccess');
const errorMessage = document.getElementById('formError');
const counter = document.getElementById('interestCount');
const year = document.getElementById('year');
const anonymousCheckbox = document.getElementById('anonymousSubmission');
const nameInput = form.elements.namedItem('nome');
const contactInput = form.elements.namedItem('contato');
const interestButtons = document.querySelectorAll('[data-interest-cta]');
const counterEndpoint = 'https://api.counterapi.dev/v1/makerja-campo-largo/interesse-cliques';
const interestClickKey = 'makerja_interest_click_registered';
const interestCountCacheKey = 'makerja_interest_count_cache';

let counterRequestInFlight = false;

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

function getCachedInterestCount() {
  const cachedValue = Number(localStorage.getItem(interestCountCacheKey));
  return Number.isFinite(cachedValue) && cachedValue >= 0 ? cachedValue : null;
}

function displayInterestCount(value) {
  const normalizedValue = Number(value);
  if (!Number.isFinite(normalizedValue) || normalizedValue < 0) return;

  counter.textContent = Math.floor(normalizedValue).toLocaleString('pt-BR');
  localStorage.setItem(interestCountCacheKey, String(Math.floor(normalizedValue)));
}

async function requestInterestCount(action = '') {
  const response = await fetch(`${counterEndpoint}${action}`, {
    method: 'GET',
    cache: 'no-store',
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) throw new Error(`Falha ao consultar contador: ${response.status}`);

  const result = await response.json();
  return result.count;
}

async function loadInterestCount() {
  const cachedCount = getCachedInterestCount();
  if (cachedCount !== null) displayInterestCount(cachedCount);

  try {
    displayInterestCount(await requestInterestCount());
  } catch {
    if (cachedCount === null) counter.textContent = '0';
  }
}

async function registerInterestClick() {
  if (localStorage.getItem(interestClickKey) === '1' || counterRequestInFlight) return;

  counterRequestInFlight = true;

  try {
    const updatedCount = await requestInterestCount('/up');
    localStorage.setItem(interestClickKey, '1');
    displayInterestCount(updatedCount);
  } catch {
    // O clique não impede a navegação caso o serviço de contagem esteja indisponível.
  } finally {
    counterRequestInFlight = false;
  }
}

interestButtons.forEach((button) => {
  button.addEventListener('click', registerInterestClick);
});

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

});

loadInterestCount();
