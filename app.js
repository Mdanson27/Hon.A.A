document.body.classList.add('loading');

const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const bootStarted = performance.now();

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1800);
};

const releaseLoader = () => {
  if (!loader || loader.classList.contains('is-hidden')) return;
  const elapsed = performance.now() - bootStarted;
  const minimumVisible = 1650;
  const wait = Math.max(0, minimumVisible - elapsed);
  window.setTimeout(() => {
    requestAnimationFrame(() => {
      loader.classList.add('is-hidden');
      document.body.classList.remove('loading');
    });
  }, wait);
};

// Do not wait for large images or network resources before releasing the profile.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', releaseLoader, { once: true });
} else {
  releaseLoader();
}

// Hard cap for reliability on slower phones.
window.setTimeout(() => {
  if (!loader) return;
  loader.classList.add('is-hidden');
  document.body.classList.remove('loading');
}, 2200);

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
