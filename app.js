document.body.classList.add('loading');

const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const timelineModal = document.getElementById('timelineModal');

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
};

window.addEventListener('load', () => {
  const MIN_LOADER = 2450;
  const started = performance.timeOrigin || Date.now();
  const elapsed = Date.now() - started;
  const remaining = Math.max(250, MIN_LOADER - elapsed);
  window.setTimeout(() => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('loading');
  }, remaining);
});

// Absolute safety cap: the loader can never block the profile beyond 3 seconds.
window.setTimeout(() => {
  loader.classList.add('is-hidden');
  document.body.classList.remove('loading');
}, 2950);

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
  URL.revokeObjectURL(url);
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
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Profile link copied');
    }
  } catch (error) {
    if (error?.name !== 'AbortError') showToast('Unable to share right now');
  }
});

document.getElementById('timelineBtn')?.addEventListener('click', () => timelineModal?.showModal());
document.getElementById('timelineClose')?.addEventListener('click', () => timelineModal?.close());

timelineModal?.addEventListener('click', (event) => {
  const rect = timelineModal.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) timelineModal.close();
});
