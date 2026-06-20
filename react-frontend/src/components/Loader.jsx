import logo from '../assets/logo.png';  // ← импорт логотипа


export function showLoader() {
  let overlay = document.getElementById('loader-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loader-overlay';
    overlay.className = 'loader-overlay';
    const spinner = document.createElement('div');
    spinner.className = 'loader-spinner';
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
  }
  overlay.style.display = 'flex';
}

export function hideLoader() {
  const overlay = document.getElementById('loader-overlay');
  if (overlay) overlay.style.display = 'none';
}