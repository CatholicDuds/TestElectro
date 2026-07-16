const form = document.getElementById('interestForm');
const success = document.getElementById('formSuccess');
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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
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
  form.reset();
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

updateCounter();
