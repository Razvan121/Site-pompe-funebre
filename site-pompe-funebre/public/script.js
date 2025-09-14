const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

prevBtn.addEventListener('click', () => {
  current = (current === 0) ? slides.length - 1 : current - 1;
  showSlide(current);
});

nextBtn.addEventListener('click', () => {
  current = (current === slides.length - 1) ? 0 : current + 1;
  showSlide(current);
});


setInterval(() => {
  current = (current === slides.length - 1) ? 0 : current + 1;
  showSlide(current);
}, 3500);
document.querySelectorAll('.details-button').forEach(button => {
  button.addEventListener('click', function () {
    const modalId = this.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
  });
});

document.querySelectorAll('.close-button').forEach(button => {
  button.addEventListener('click', function () {
    this.closest('.modal').style.display = 'none';
  });
});

window.addEventListener('click', function (e) {
  document.querySelectorAll('.modal').forEach(modal => {
    if (e.target === modal) modal.style.display = 'none';
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");

  if (!localStorage.getItem("cookiesAccepted")) {
    banner.style.display = "block";
  }

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    banner.style.display = "none";
  });
});

const form = document.getElementById("review-form");
const lista = document.getElementById("lista-recenzii");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nume: form.nume.value,
    email: form.email.value,
    text_recenzie: form.text_recenzie.value
  };

  const res = await fetch("/api/recenzii", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    form.reset();
    incarcaRecenzii();
  } else {
    alert("Eroare la trimiterea recenziei!");
  }
});

async function incarcaRecenzii() {
  const res = await fetch("/api/recenzii");
  const recenzii = await res.json();

  lista.innerHTML = recenzii.map(r => `
    <article class="recenzie">
      <h4>${r.nume}</h4>
      <p>${r.text_recenzie}</p>
      <small>${new Date(r.data).toLocaleDateString()}</small>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", incarcaRecenzii);




const modal = document.querySelector('#modal-serviciu');   // id-ul modalului tău
  const openBtns = document.querySelectorAll('.details-button');
  const closeBtn = modal?.querySelector('.close-button');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.classList.add('modal-open');
    });
  });

  // închidere pe X sau click pe fundal
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) { // click pe overlay
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  });
  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  });



  function mountToBody(modal){
  if (modal && modal.parentNode !== document.body) document.body.appendChild(modal);
}

function openModalById(id){
  const modal = document.getElementById(id);
  if (!modal) return;
  mountToBody(modal);                 // scoate-o din secțiune ca să nu fie prinsă în stacking contexts
  modal.classList.add('open');        // afişează (CSS .modal.open)
  document.body.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal){
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.details-button').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = btn.getAttribute('data-modal');
    openModalById(id);
  });
});

document.addEventListener('click', (e) => {
  // X apăsat
  if (e.target.closest('.close-button')) {
    closeModal(e.target.closest('.modal'));
    return;
  }
  // click pe overlay
  const opened = document.querySelectorAll('.modal.open');
  opened.forEach(m => { if (e.target === m) closeModal(m); });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m));
  }
});


// la DESCHIDERE (unde ai: modal.style.display = 'block';)
modal.style.display = 'block';
document.body.classList.add('modal-open');

// la ÎNCHIDERE (unde ascunzi modalul)
this.closest('.modal').style.display = 'none';
document.body.classList.remove('modal-open');



const contactForm = document.getElementById('contact-form');
const statusEl    = document.getElementById('form-status');
const sendBtn     = document.getElementById('send-btn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Se trimite...';
    statusEl.className = 'form-status';
    sendBtn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }   // <- asta oprește redirectul
      });

      if (res.ok) {
        contactForm.reset();
        statusEl.textContent = 'Mulțumim! Mesajul a fost trimis.';
        statusEl.classList.add('ok');
      } else {
        const data = await res.json().catch(() => null);
        const msg = data?.errors?.map(e => e.message).join(', ') || 'Eroare la trimitere. Încearcă din nou.';
        statusEl.textContent = msg;
        statusEl.classList.add('err');
      }
    } catch {
      statusEl.textContent = 'Conexiune indisponibilă. Încearcă din nou.';
      statusEl.classList.add('err');
    } finally {
      sendBtn.disabled = false;
    }
  });
}
