const revealItems = document.querySelectorAll('.reveal');
const year = document.querySelector('#year');
const glow = document.querySelector('.cursor-glow');
const openEnvelope = document.querySelector('#openEnvelope');
const welcomeOverlay = document.querySelector('#welcomeOverlay');

if (year) year.textContent = new Date().getFullYear();

openEnvelope?.addEventListener('click', () => {
  openEnvelope.classList.add('is-opening');
  window.setTimeout(() => {
    welcomeOverlay?.classList.add('is-open');
    document.body.classList.remove('envelope-closed');
    document.querySelectorAll('.welcome-overlay .reveal').forEach((item) => item.classList.add('is-visible'));
  }, 560);
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

document.querySelectorAll('[data-photo-input]').forEach((input) => {
  input.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    const card = event.target.closest('[data-photo-card]');
    const preview = card?.querySelector('[data-photo-preview]');
    if (!file || !card || !preview || !file.type.startsWith('image/')) return;

    const imageUrl = URL.createObjectURL(file);
    preview.style.backgroundImage = `url("${imageUrl}")`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
    card.classList.add('has-photo');
  });
});

const albumUpload = document.querySelector('#albumUpload');
const albumViewer = document.querySelector('#albumViewer');
const albumMainPhoto = document.querySelector('#albumMainPhoto');
const albumMainNumber = document.querySelector('#albumMainNumber');
const albumSlots = [...document.querySelectorAll('[data-album-index]')];
const albumImages = [
  'assets/album/album-01.png',
  'assets/album/album-02.png',
  'assets/album/album-03.png',
  'assets/album/album-04.png',
  'assets/album/album-05.png',
  'assets/album/album-06.png',
  'assets/album/album-07.png',
  'assets/album/album-08.png',
  'assets/album/album-09.png',
  'assets/album/album-10.png',
];
let activeAlbumIndex = 0;

function renderAlbum() {
  const activeImage = albumImages[activeAlbumIndex];
  albumMainNumber.textContent = String(activeAlbumIndex + 1).padStart(2, '0');
  if (activeImage) {
    albumMainPhoto.style.backgroundImage = `url("${activeImage}")`;
    albumMainPhoto.classList.add('has-image');
  } else {
    albumMainPhoto.style.backgroundImage = '';
    albumMainPhoto.classList.remove('has-image');
  }

  albumSlots.forEach((slot, index) => {
    const image = albumImages[index];
    slot.classList.toggle('is-active', index === activeAlbumIndex);
    slot.classList.toggle('has-image', Boolean(image));
    slot.style.backgroundImage = image ? `linear-gradient(rgba(30,20,25,.16), rgba(30,20,25,.16)), url("${image}")` : '';
    slot.querySelector('small').textContent = image ? 'photo added' : 'memory';
  });
}

albumUpload?.addEventListener('change', (event) => {
  const selectedFiles = [...(event.target.files || [])].filter((file) => file.type.startsWith('image/')).slice(0, 10);
  selectedFiles.forEach((file, index) => {
    albumImages[index] = URL.createObjectURL(file);
  });
  if (selectedFiles.length) activeAlbumIndex = 0;
  renderAlbum();
});

albumViewer?.addEventListener('click', () => {
  activeAlbumIndex = (activeAlbumIndex + 1) % albumImages.length;
  renderAlbum();
});

albumSlots.forEach((slot) => {
  slot.addEventListener('click', () => {
    activeAlbumIndex = Number(slot.dataset.albumIndex);
    renderAlbum();
  });
});

renderAlbum();
