document.body.classList.add('loading');

const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const bootStarted = performance.now();

const logoSources = ['parliament.png', 'pan-africa.png'];
const logoImages = logoSources.map((src) => {
  const img = new Image();
  img.fetchPriority = 'high';
  img.decoding = 'sync';
  img.src = src;
  return img;
});

const loaderMarks = document.querySelectorAll('.loader-wordmark');
loaderMarks.forEach((mark, index) => {
  mark.style.background = `#fff url('${logoSources[index]}') center / contain no-repeat`;
  mark.style.backgroundOrigin = 'content-box';
  mark.style.padding = index === 0 ? '9px 12px' : '8px 10px';
  [...mark.children].forEach((child) => { child.style.visibility = 'hidden'; });
});

// Keep the two principal offices intentionally separated so the title block
// remains clean and predictable across narrow phone widths.
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  heroTitle.innerHTML = `
    <span class="hero-role">Member of Parliament, Uganda</span>
    <span class="hero-role">Member of the Pan-African Parliament</span>
  `;
}

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1600);
};

const hideLoader = () => {
  if (!loader || loader.classList.contains('is-hidden')) return;
  loader.classList.add('is-hidden');
  document.body.classList.remove('loading');
};

const imageReady = (img) => {
  if (img.complete && img.naturalWidth) return Promise.resolve();
  return new Promise((resolve) => {
    const finish = () => resolve();
    img.addEventListener('load', finish, { once: true });
    img.addEventListener('error', finish, { once: true });
  });
};

// Deliberate brand presentation: keep the real-logo loader visible for at least 2.2s,
// but never allow it to block the profile beyond 2.8s.
Promise.all(logoImages.map(imageReady)).finally(() => {
  const elapsed = performance.now() - bootStarted;
  const minimumVisible = 2200;
  const remaining = Math.max(0, minimumVisible - elapsed);
  window.setTimeout(() => requestAnimationFrame(hideLoader), remaining);
});

window.setTimeout(hideLoader, 2800);

const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Akol;Anthony;;;Hon.\nFN:Hon. Anthony Akol\nORG:Parliament of the Republic of Uganda\nTITLE:Member of Parliament, Kilak North County; Member of the Pan-African Parliament\nTEL;TYPE=CELL,VOICE:+256772421029\nTEL;TYPE=CELL,WHATSAPP:+256772421029\nEMAIL;TYPE=INTERNET:akolanthony@gmail.com\nADR;TYPE=WORK:;;Parliament Avenue;Kampala;;;Uganda\nNOTE:Member of Parliament for Kilak North County, Amuru District, Uganda and Member of the Pan-African Parliament.\nEND:VCARD`;

const downloadContact = () => {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Hon-Anthony-Akol.vcf';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
  showToast('Contact card ready');
};

document.getElementById('saveContact')?.addEventListener('click', downloadContact);
document.getElementById('saveContactBottom')?.addEventListener('click', downloadContact);

document.getElementById('shareBtn')?.addEventListener('click', async () => {
  const shareData = {
    title: 'Hon. Anthony Akol',
    text: 'Smart digital profile of Hon. Anthony Akol — Member of Parliament, Kilak North County and Member of the Pan-African Parliament.',
    url: window.location.href
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied');
    } else {
      showToast('Use your browser share menu');
    }
  } catch (error) {
    if (error?.name !== 'AbortError') showToast('Unable to share right now');
  }
});