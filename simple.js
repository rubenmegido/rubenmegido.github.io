(function () {
  const themeBtn = document.getElementById('theme-toggle');
  const langBtn = document.getElementById('lang-toggle');
  const translatableNodes = Array.from(document.querySelectorAll('[data-i18n]'));

  if (!themeBtn && !langBtn && translatableNodes.length === 0) {
    return;
  }

  const themeKey = 'simple_docs_theme';
  const langKey = 'simple_docs_lang';
  const i18n = {
    en: {
      home_page_title: 'rubenmegido',
      home_title: 'ruben megido',
      home_subtitle: 'Physics · Stellar spectroscopy',
      home_simple_desc: 'A minimalist desktop application for the study of stellar atmospheres.',
      home_contact: 'Contact',
      home_email_label: 'Email:',
      home_footer: '2026 · I watched C-beams glitter in the dark near the Tannhauser Gate ;)',
      page_title: 'SIMPLE · Stellar spectra analysis',
      logo_alt: 'SIMPLE logo',
      main_title: 'SIMPLE · Stellar Spectra Analysis',
      main_subtitle: 'A minimalist application for the study of stellar atmospheres.',
      sec_news: 'News',
      sec_download: 'Download (version 1.0-beta1)',
      sec_install: 'Installation',
      sec_contact: 'Contact',
      download_tooltip: 'Download during April 2026',
      toc_title: 'Index',
      toc_aria_label: 'Help index',
      toc_home: 'Home',
      toc_news: 'News',
      toc_download: 'Download',
      toc_install: 'Installation',
      toc_contact: 'Contact',
      footer_text: '2026 · SIMPLE · Stellar spectra analysis',
      news_release_march: 'Simple will be released during April 2026 in its 1.0-beta1 version. It is an application under continuous development until the release of the final 1.0 version.',
      sha_title: 'SHA256 verification (optional)',
      sha_text_1: 'You can verify the integrity of <code>simple.exe</code> in PowerShell with: <code>Get-FileHash .\\SIMPLE.exe -Algorithm SHA256</code>',
      sha_text_2: 'Compare the result with: <code>907FD329F7FA31153A1C3F2CC68E6A29204595333679F565703C6D087C44EAB5</code>',
      contact_email_label: 'Email:',
      install_step_1: 'Download the Windows executable <code>simple.exe</code>.',
      install_step_2: 'Create a folder named SIMPLE, copy it there, and run the file.',
      install_step_3: 'If SmartScreen warns you, click <code>More info</code> and then <code>Run anyway</code>.',
      install_step_4: 'Open a local or web FITS and start working.'
    }
  };
  const sourceTranslations = {};

  translatableNodes.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && !(key in sourceTranslations)) {
      sourceTranslations[key] = el.innerHTML;
    }
  });

  let lang = document.documentElement.lang === 'en' ? 'en' : 'es';

  const updateInternalLangLinks = () => {
    document.querySelectorAll('[data-lang-link]').forEach((el) => {
      const rawHref = el.getAttribute('href');
      if (!rawHref) {
        return;
      }
      const url = new URL(rawHref, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }
      url.searchParams.set('lang', lang);
      el.setAttribute('href', url.pathname + url.search + url.hash);
    });
  };

  const applyTheme = (mode) => {
    const isDark = mode === 'dark';
    document.body.classList.toggle('dark', isDark);
    if (themeBtn) {
      themeBtn.textContent = lang === 'en'
        ? (isDark ? 'Light mode' : 'Dark mode')
        : (isDark ? 'Modo claro' : 'Modo oscuro');
    }
  };

  const applyLang = (nextLang) => {
    lang = nextLang === 'en' ? 'en' : 'es';
    document.documentElement.lang = lang;
    translatableNodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const attrOnly = el.getAttribute('data-i18n-attr-only') === 'true';
      const text = lang === 'en'
        ? (i18n.en[key] || sourceTranslations[key] || '')
        : (sourceTranslations[key] || '');
      if (text && !attrOnly) {
        el.innerHTML = text;
      }
      const attrName = el.getAttribute('data-i18n-attr');
      if (attrName) {
        const attrText = lang === 'en'
          ? (i18n.en[key] || sourceTranslations[key] || '')
          : (sourceTranslations[key] || '');
        if (attrText) {
          el.setAttribute(attrName, attrText.replace(/<[^>]*>/g, ''));
        }
      }
    });
    if (langBtn) {
      langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
    }
    updateInternalLangLinks();
    applyTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
  };

  let savedTheme = '';
  try {
    savedTheme = localStorage.getItem(themeKey) || '';
  } catch (_) {}

  let savedLang = '';
  try {
    savedLang = localStorage.getItem(langKey) || '';
  } catch (_) {}

  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const initialLang = queryLang === 'en' || queryLang === 'es'
    ? queryLang
    : (savedLang === 'en' ? 'en' : 'es');

  applyLang(initialLang);
  try {
    localStorage.setItem(langKey, initialLang);
  } catch (_) {}
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(themeKey, next);
      } catch (_) {}
    });
  }

  if (langBtn) {
    langBtn.addEventListener('click', function () {
      const nextLang = lang === 'es' ? 'en' : 'es';
      applyLang(nextLang);
      try {
        localStorage.setItem(langKey, nextLang);
      } catch (_) {}
    });
  }
})();
