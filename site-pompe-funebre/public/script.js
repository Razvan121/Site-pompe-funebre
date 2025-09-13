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

