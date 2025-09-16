/* =========================
   SLIDER
========================= */
(() => {
  const slides = document.querySelectorAll('.slide');
  if (!slides.length) return;

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  let current = 0;

  const show = (i) => slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
  show(current);

  prevBtn?.addEventListener('click', () => {
    current = (current === 0) ? slides.length - 1 : current - 1;
    show(current);
  });

  nextBtn?.addEventListener('click', () => {
    current = (current === slides.length - 1) ? 0 : current + 1;
    show(current);
  });

  setInterval(() => {
    current = (current === slides.length - 1) ? 0 : current + 1;
    show(current);
  }, 3500);
})();

/* =========================
   MODALE (unificate)
========================= */
(() => {
  function mountToBody(m) {
    if (m && m.parentNode !== document.body) document.body.appendChild(m);
  }
  function openById(id) {
    const m = document.getElementById(id);
    if (!m) return;
    mountToBody(m);
    m.style.display = 'flex';            // compatibil cu CSS-ul tău
    m.classList.add('open');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m) {
    if (!m) return;
    m.classList.remove('open');
    m.style.display = 'none';
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  // open din butoane
  document.querySelectorAll('.details-button[data-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openById(btn.getAttribute('data-modal'));
    });
  });

  // close pe X sau click pe overlay
  document.addEventListener('click', (e) => {
    if (e.target.closest('.close-button')) {
      closeModal(e.target.closest('.modal'));
      return;
    }
    if (e.target.classList?.contains('modal')) {
      closeModal(e.target);
    }
  });

  // ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(closeModal);
    }
  });
})();

/* =========================
   COOKIE BANNER
========================= */
(() => {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  if (!banner || !acceptBtn) return;

  if (!localStorage.getItem('cookiesAccepted')) {
    banner.style.display = 'flex';
  }
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.style.display = 'none';
  });
})();

/* =========================
   RECENZII
========================= */
(() => {
  const form = document.getElementById('review-form');
  const lista = document.getElementById('lista-recenzii');
  if (!form || !lista) return;

  async function incarcaRecenzii() {
    try {
      const res = await fetch('/api/recenzii');
      const recenzii = await res.json();
      lista.innerHTML = recenzii.map(r => `
        <article class="recenzie">
          <h4>${r.nume}</h4>
          <p>${r.text_recenzie}</p>
          <small>${new Date(r.data).toLocaleDateString()}</small>
        </article>
      `).join('');
    } catch (err) {
      console.error('Eroare încărcare recenzii', err);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nume: form.nume.value.trim(),
      email: form.email.value.trim(),
      text_recenzie: form.text_recenzie.value.trim()
    };
    try {
      const res = await fetch('/api/recenzii', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if (res.ok) {
        form.reset();
        incarcaRecenzii();
      } else {
        alert('Eroare la trimiterea recenziei!');
      }
    } catch {
      alert('Conexiune indisponibilă.');
    }
  });

  // prima încărcare
  incarcaRecenzii();
})();

/* =========================
   FORMULAR CONTACT (Formspree, fără redirect)
========================= */
(() => {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const statusEl = document.getElementById('form-status');
  const sendBtn  = document.getElementById('send-btn');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusEl && (statusEl.textContent = 'Se trimite...');
    statusEl && (statusEl.className = 'form-status');
    sendBtn && (sendBtn.disabled = true);

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' } // <- oprește redirectul
      });

      if (res.ok) {
        contactForm.reset();  // ← goliți câmpurile
        statusEl && (statusEl.textContent = 'Mulțumim! Mesajul a fost trimis.');
        statusEl && statusEl.classList.add('ok');
      } else {
        const data = await res.json().catch(() => null);
        const msg = data?.errors?.map(e => e.message).join(', ')
                 || 'Eroare la trimitere. Încearcă din nou.';
        statusEl && (statusEl.textContent = msg);
        statusEl && statusEl.classList.add('err');
      }
    } catch {
      statusEl && (statusEl.textContent = 'Conexiune indisponibilă. Încearcă din nou.');
      statusEl && statusEl.classList.add('err');
    } finally {
      sendBtn && (sendBtn.disabled = false);
    }
  });
})();


// setează offset-ul real (top-bar + navbar) ca să nu mai intre sub ele
(() => {
  function applyHeaderOffset(){
    const top = document.querySelector('.top-bar')?.offsetHeight || 0;
    const nav = document.querySelector('.navbar')?.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-offset', (top + nav) + 'px');
  }
  applyHeaderOffset();
  window.addEventListener('resize', applyHeaderOffset);
  window.addEventListener('orientationchange', applyHeaderOffset);
})();


document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".navbar nav ul");

  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

  // Închide meniul după ce dai click pe un link
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });
});
