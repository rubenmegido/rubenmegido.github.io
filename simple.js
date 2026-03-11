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
      sec_quick_guide: 'Quick Start Guide',
      sec_docs: 'Documentation',
      quick_guide_pending: 'Pending publication',
      docs_pending: 'Pending publication',
      sec_contact: 'Contact',
      download_tooltip: 'Download during March 2026',
      download_exe_heading: 'For updating an existing installation',
      download_exe_text: 'Keep your saved profiles and settings. Replace only <code>simple.exe</code> in your current <code>SIMPLE</code> folder.',
      download_zip_title: 'simple.zip',
      download_zip_heading: 'For a new installation',
      download_zip_text: 'Extract <code>simple.zip</code> into the Documents folder or onto the Desktop. You will see the <code>SIMPLE</code> folder with the <code>simple.exe</code> file. Run it and the application will open.',
      download_note_1: 'If you already use SIMPLE and want to keep your profiles, download <code>simple.exe</code> and replace only that file in the folder where you usually work.',
      download_note_2: 'If this is your first installation, extract <code>simple.zip</code> to <code>Documents\\\\SIMPLE</code> or <code>Downloads\\\\SIMPLE</code> and run <code>simple.exe</code> from that folder.',
      download_observation: 'In both cases: if Windows SmartScreen shows a warning, click <code>More info</code> and then <code>Run anyway</code>. Once the application is open, load a local or web FITS and start working.',
      toc_title: 'Index',
      toc_aria_label: 'Help index',
      toc_home: 'Home',
      toc_news: 'News',
      toc_download: 'Download',
      toc_quick_guide: 'Quick guide',
      toc_docs: 'Documentation',
      toc_contact: 'Contact',
      footer_text: '2026 · SIMPLE · Stellar spectra analysis',
      news_release_march: 'SIMPLE will be released during March 2026 in its 1.0-beta1 version. It is an application under continuous development until the release of the final 1.0 version.',
      sha_title: 'SHA256 verification (optional)',
      sha_text_1: 'You can verify the integrity of <code>simple.exe</code> in PowerShell with: <code>Get-FileHash .\\SIMPLE.exe -Algorithm SHA256</code>',
      sha_text_2: 'Compare the result with: <code>907FD329F7FA31153A1C3F2CC68E6A29204595333679F565703C6D087C44EAB5</code>',
      contact_email_label: 'Email:',
    }
  };
  const sourceTranslations = {};
  const sourceAttrTranslations = {};

  translatableNodes.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && !(key in sourceTranslations)) {
      sourceTranslations[key] = el.innerHTML;
    }
    const attrName = el.getAttribute('data-i18n-attr');
    if (key && attrName) {
      const attrKey = key + '::' + attrName;
      if (!(attrKey in sourceAttrTranslations)) {
        sourceAttrTranslations[attrKey] = el.getAttribute(attrName) || '';
      }
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
        const attrKey = key + '::' + attrName;
        const attrText = lang === 'en'
          ? (i18n.en[key] || sourceAttrTranslations[attrKey] || sourceTranslations[key] || '')
          : (sourceAttrTranslations[attrKey] || sourceTranslations[key] || '');
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

  const browserLang = (navigator.language || '').toLowerCase();
  const defaultLang = browserLang.startsWith('es') ? 'es' : 'en';
  const defaultTheme = window.matchMedia('(max-width: 980px)').matches ? 'dark' : 'light';
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const initialLang = queryLang === 'en' || queryLang === 'es'
    ? queryLang
    : (savedLang === 'en' || savedLang === 'es' ? savedLang : defaultLang);

  applyLang(initialLang);
  try {
    localStorage.setItem(langKey, initialLang);
  } catch (_) {}
  applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : defaultTheme);

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
