const form = document.getElementById('interestForm');
const success = document.getElementById('formSuccess');
const errorMessage = document.getElementById('formError');
const counter = document.getElementById('interestCount');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

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

// Exibe confirmação ao voltar do FormSubmit.
const params = new URLSearchParams(window.location.search);
if (params.get('enviado') === '1') {
  success.hidden = false;
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
