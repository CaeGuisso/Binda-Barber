/* =====================================================
   CONFIGURAÇÃO — edite aqui as informações da barbearia
   ===================================================== */
const CONFIG = {
  // WhatsApp: só números, com código do país e DDD. Ex.: "5519999999999"
  // Enquanto estiver vazio, os botões rolam até a seção de contato.
  whatsappNumber: "5519993197761",
  whatsappMessage: "Olá! Vim pelo site da Binda Barber.",

  instagram: "bindabarber_b.b",

  // Endereço usado no mapa e no botão "Abrir no Google Maps".
  // Se necessário, acrescente a cidade/UF para o mapa ficar exato.
  address: "Rua Alexandre Cunali, 2070 - Santa Maria",
};

// Serviços e preços. Troque "R$ 00,00" pelos valores reais.
// Para adicionar um serviço, copie um bloco e mude os campos.
const SERVICES = [
  { name: "Corte Masculino", desc: "Corte personalizado de acordo com seu estilo.", price: "R$ 00,00" },
  { name: "Barba",           desc: "Acabamento e cuidado completo para a barba.",  price: "R$ 00,00" },
  {   name: "Corte + Barba",   desc: "Combo completo para renovar o visual.",         price: "R$ 00,00" },
];

// Horários (conforme divulgado no Instagram da barbearia).
// open/close no formato "HH:MM". Use null em open para "Fechado".
const HOURS = [
  { day: "Segunda", open: "09:00", close: "19:00" },
  { day: "Terça",   open: "09:00", close: "19:00" },
  { day: "Quarta",  open: "09:00", close: "19:00" },
  { day: "Quinta",  open: "08:30", close: "19:00" },
  { day: "Sexta",   open: "07:30", close: "20:00" },
  { day: "Sábado",  open: "07:30", close: "19:00" },
  { day: "Domingo", open: "07:30", close: "11:00" },
];

// Galeria. Para usar suas fotos, coloque os arquivos em /images e troque o "src".
// As 3 primeiras imagens são reais (artes da barbearia); as demais são marcadores.
const GALLERY = [
  { src: "images/logo-post.jpg",    alt: "Logotipo metálico da Binda Barber" },
  { src: "images/corte-01.jpg",     alt: "Corte masculino" },
  { src: "images/horario-post.jpg", alt: "Arte com o horário de funcionamento da Binda Barber" },
  { src: "images/barba-01.jpg",     alt: "Barba feita na Binda Barber" },
  { src: "images/barbeiro-01.jpg",  alt: "Barbeiro trabalhando" },
  { src: "images/ambiente-01.jpg",  alt: "Ambiente da barbearia" },
  { src: "images/detalhe-01.jpg",   alt: "Detalhe de máquinas e ferramentas" },
];

/* ===================================================== */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* WhatsApp */
const waUrl = CONFIG.whatsappNumber
  ? `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`
  : "#contato";
$$(".js-wa").forEach(a => {
  a.href = waUrl;
  if (CONFIG.whatsappNumber) { a.target = "_blank"; a.rel = "noopener"; }
});
if (!CONFIG.whatsappNumber) console.warn("Binda Barber: defina CONFIG.whatsappNumber em script.js.");

/* Instagram e mapa */
$("#igLink").href = `https://instagram.com/${CONFIG.instagram}`;
const q = encodeURIComponent(CONFIG.address);
$("#map").src = `https://www.google.com/maps?q=${q}&output=embed`;
$("#mapLink").href = `https://maps.google.com/?cid=17770286505393713563&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=pt-BR&source=embed`;

/* Serviços */
$("#services").innerHTML = SERVICES.map((s, i) => `
  <article class="card reveal">
    <span>0${i + 1} / SERVIÇO</span>
    <h3>${s.name}</h3>
    <p>${s.desc}</p>
    <strong>${s.price}</strong>
  </article>`).join("");

/* Horários + status */
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const todayIdx = (new Date().getDay() + 6) % 7; // segunda = 0
$("#hours").innerHTML = HOURS.map((h, i) => `
  <li class="${i === todayIdx ? "is-today" : ""}">
    <span>${h.day}</span>
    <span>${h.open ? `${h.open.replace(":", "h").replace("h00", "h")} às ${h.close.replace(":", "h").replace("h00", "h")}` : "Fechado"}</span>
  </li>`).join("");

function updateStatus() {
  const now = new Date();
  const h = HOURS[(now.getDay() + 6) % 7];
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = h.open && mins >= toMin(h.open) && mins < toMin(h.close);
  const txt = open
    ? `Aberto agora, atendendo até ${h.close.replace(":", "h")}`
    : "Fechado no momento. Veja os horários abaixo";
  ["#status", "#status2"].forEach(id => {
    const el = $(id); el.textContent = txt; el.classList.toggle("is-open", open);
  });
}
updateStatus();
setInterval(updateStatus, 60000);

/* Galeria + lightbox */
$("#gallery").innerHTML = GALLERY.map((g, i) => `
  <button class="g reveal" data-i="${i}" aria-label="Ampliar: ${g.alt}">
    <img src="${g.src}" alt="${g.alt}" loading="lazy">
  </button>`).join("");

const lb = $("#lb"), lbImg = $("#lbImg");
let cur = 0;
const show = i => {
  cur = (i + GALLERY.length) % GALLERY.length;
  lbImg.src = GALLERY[cur].src; lbImg.alt = GALLERY[cur].alt;
};
const openLb = i => { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lbX").focus(); };
const closeLb = () => { lb.hidden = true; document.body.style.overflow = ""; };
$("#gallery").addEventListener("click", e => {
  const b = e.target.closest(".g"); if (b) openLb(+b.dataset.i);
});
$("#lbX").onclick = closeLb;
$("#lbP").onclick = () => show(cur - 1);
$("#lbN").onclick = () => show(cur + 1);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") show(cur - 1);
  if (e.key === "ArrowRight") show(cur + 1);
});

/* Navbar: scroll + menu mobile */
const nav = $("#nav"), burger = $("#burger"), menu = $("#menu");
const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true }); onScroll();
const setMenu = open => {
  menu.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  };
burger.onclick = () => setMenu(!menu.classList.contains("is-open"));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* Reveal ao rolar */
const io = new IntersectionObserver((entries, o) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("is-in"); o.unobserve(en.target); } });
}, { threshold: .12 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el); });
