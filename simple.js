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
      sec_download: 'Download',
      sec_install: 'Installation',
      toc_title: 'Index',
      toc_aria_label: 'Help index',
      toc_home: 'Home',
      toc_download: 'Download',
      toc_install: 'Installation',
      footer_text: '2026 · SIMPLE · Stellar spectra analysis · <a href="index.html">rubenmegido</a>',
      sha_title: 'SHA256 verification (optional)',
      sha_text_1: 'You can verify the integrity of <code>simple.exe</code> in PowerShell with: <code>Get-FileHash .\\SIMPLE.exe -Algorithm SHA256</code>',
      sha_text_2: 'Compare the result with: <code>907FD329F7FA31153A1C3F2CC68E6A29204595333679F565703C6D087C44EAB5</code>',
      install_step_1: 'Download the <code>simple.exe</code> executable.',
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

  applyLang(savedLang === 'en' ? 'en' : 'es');
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
