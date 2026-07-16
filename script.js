const form = document.getElementById('interestForm');
const success = document.getElementById('formSuccess');
const errorMessage = document.getElementById('formError');
const counter = document.getElementById('interestCount');
const year = document.getElementById('year');

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/eduardo.emilio.gomes@gmail.com';

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

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  success.hidden = true;
  errorMessage.hidden = true;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  const originalButtonText = button.textContent;
  button.disabled = true;
  button.textContent = 'Enviando...';

  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    ...data,
    _subject: 'Novo interesse recebido pelo site MakerJá',
    _template: 'table',
    origem: window.location.href,
    enviado_em: new Date().toLocaleString('pt-BR')
  };

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Falha no envio: ${response.status}`);
    }

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
  } catch (error) {
    console.error(error);
    errorMessage.hidden = false;
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } finally {
    button.disabled = false;
    button.textContent = originalButtonText;
  }
});

updateCounter();
