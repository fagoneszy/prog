(() => {
  'use strict';
  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navToggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');

  const setDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    if (drawerOverlay) drawerOverlay.classList.toggle('is-open', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (navToggle && drawer) {
    navToggle.addEventListener('click', () => {
      setDrawer(!drawer.classList.contains('is-open'));
    });
  }
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => setDrawer(false));
  if (drawer) {
    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setDrawer(false));
    });
  }

  const modal = document.querySelector('.modal');
  const modalOverlay = modal ? modal.querySelector('.modal__overlay') : null;
  const modalClose = modal ? modal.querySelector('.modal__close') : null;
  let lastFocused = null;

  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  };

  const closeModal = () => {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalClose) modalClose.addEventListener('click', closeModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setDrawer(false);
      closeModal();
    }
  });

  const revealEls = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => observer.observe(el));
  }

  document.querySelectorAll('.accordion').forEach((accordion) => {
    accordion.querySelectorAll('.accordion__trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const item = trigger.closest('.accordion__item');
        const wasOpen = item.classList.contains('is-open');
        accordion.querySelectorAll('.accordion__item.is-open').forEach((openItem) => {
          openItem.classList.remove('is-open');
          openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  let toastTimer = null;
  const showToast = (message) => {
    const region = document.querySelector('.toast-region');
    if (!region) return;
    region.innerHTML = [
      '<div class="toast is-visible" role="status">',
      '<svg class="toast__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      `<span>${message}</span>`,
      '</div>'
    ].join('');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      const toast = region.querySelector('.toast');
      if (toast) toast.classList.remove('is-visible');
    }, 3500);
  };

  const contactForm = document.querySelector('.js-contact-form');
  if (contactForm) {
    const statusEl = contactForm.querySelector('.form-status');
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;
      contactForm.querySelectorAll('[required]').forEach((field) => {
        const wrap = field.closest('.field');
        const empty = !field.value.trim();
        const badEmail = field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        const invalid = empty || badEmail;
        if (wrap) wrap.classList.toggle('field--invalid', invalid);
        if (invalid) isValid = false;
      });
      if (!isValid) return;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.classList.add('is-loading');
      if (statusEl) statusEl.classList.remove('form-status--success');
      setTimeout(() => {
        if (submitBtn) submitBtn.classList.remove('is-loading');
        contactForm.reset();
        showToast('Mensagem enviada com sucesso.');
        if (statusEl) {
          statusEl.classList.add('form-status--success');
          setTimeout(() => statusEl.classList.remove('form-status--success'), 6000);
        }
      }, 900);
    });
    contactForm.addEventListener('input', (event) => {
      const wrap = event.target.closest('.field');
      if (wrap) wrap.classList.remove('field--invalid');
      if (statusEl) statusEl.classList.remove('form-status--success');
    });
  }

  const catalog = document.querySelector('.js-catalog');
  if (catalog) {
    const species = [
      { id: 1, name: 'Ipê-amarelo', latin: 'Handroanthus albus', category: 'nativa', categoryLabel: 'Nativa', description: 'Florescimento amarelo intenso no inverno; é um dos símbolos mais admirados das ruas e praças do Brasil.', height: '6–12 m', longevity: 'até 80 anos', origin: 'Brasil' },
      { id: 2, name: 'Pau-brasil', latin: 'Paubrasilia echinata', category: 'nativa', categoryLabel: 'Nativa', description: 'Deu nome ao país: sua madeira avermelhada foi o primeiro produto explorado no Brasil colonial.', height: '8–15 m', longevity: 'até 100 anos', origin: 'Mata Atlântica' },
      { id: 3, name: 'Jequitibá-rosa', latin: 'Cariniana legalis', category: 'nativa', categoryLabel: 'Nativa', description: 'Uma das maiores árvores da Mata Atlântica, pode ultrapassar 50 metros de altura e viver séculos.', height: 'até 50 m', longevity: '500+ anos', origin: 'Mata Atlântica' },
      { id: 4, name: 'Araucária', latin: 'Araucaria angustifolia', category: 'nativa', categoryLabel: 'Nativa', description: 'O pinheiro-do-paraná tem silhueta inconfundível e hoje é considerado uma espécie ameaçada.', height: 'até 50 m', longevity: '200+ anos', origin: 'Sul do Brasil' },
      { id: 5, name: 'Jabuticabeira', latin: 'Plinia cauliflora', category: 'frutífera', categoryLabel: 'Frutífera', description: 'Famosa por dar frutos diretamente no tronco, é presença constante nos quintais brasileiros.', height: '4–9 m', longevity: 'até 70 anos', origin: 'Brasil' },
      { id: 6, name: 'Mangueira', latin: 'Mangifera indica', category: 'frutífera', categoryLabel: 'Frutífera', description: 'Copas amplas e densas que oferecem sombra generosa e frutos doces durante o verão.', height: '10–25 m', longevity: '100+ anos', origin: 'Índia' },
      { id: 7, name: 'Laranjeira', latin: 'Citrus × sinensis', category: 'frutífera', categoryLabel: 'Frutífera', description: 'Cultivada há milhares de anos, une flores perfumadas a frutos ricos em vitamina C.', height: '6–10 m', longevity: 'até 50 anos', origin: 'Ásia' },
      { id: 8, name: 'Açaizeiro', latin: 'Euterpe oleracea', category: 'frutífera', categoryLabel: 'Frutífera', description: 'Palmeira das várzeas amazônicas cujos frutos sustentam a economia de milhares de famílias.', height: '12–20 m', longevity: 'até 50 anos', origin: 'Amazônia' },
      { id: 9, name: 'Ginkgo', latin: 'Ginkgo biloba', category: 'exótica', categoryLabel: 'Exótica', description: 'Conhecido como fóssil vivo, é uma das espécies mais antigas do planeta, dourada no outono.', height: '20–35 m', longevity: '1.000+ anos', origin: 'China' },
      { id: 10, name: 'Sequoia', latin: 'Sequoiadendron giganteum', category: 'exótica', categoryLabel: 'Exótica', description: 'Maior árvore do mundo em volume, pode viver mais de três mil anos e pesar milhares de toneladas.', height: 'até 95 m', longevity: '3.000+ anos', origin: 'Califórnia' },
      { id: 11, name: 'Cerejeira', latin: 'Prunus serrulata', category: 'exótica', categoryLabel: 'Exótica', description: 'Sua floração efêmera é celebrada há séculos no Japão como símbolo de renovação.', height: '5–12 m', longevity: 'até 50 anos', origin: 'Japão' },
      { id: 12, name: 'Eucalipto', latin: 'Eucalyptus globulus', category: 'exótica', categoryLabel: 'Exótica', description: 'Entre as árvores de crescimento mais rápido do mundo, cultivada em larga escala para madeira.', height: '30–55 m', longevity: '100+ anos', origin: 'Austrália' }
    ];

    const PER_PAGE = 6;
    const grid = catalog.querySelector('.js-catalog-grid');
    const skeletons = catalog.querySelector('.js-catalog-skeletons');
    const emptyState = catalog.querySelector('.empty-state');
    const pagination = catalog.querySelector('.pagination');
    const searchInput = catalog.querySelector('.js-catalog-search');
    const tabs = Array.from(catalog.querySelectorAll('.tab'));

    const modalBadge = document.getElementById('modal-badge');
    const modalTitle = document.getElementById('modal-title');
    const modalLatin = document.getElementById('modal-latin');
    const modalDesc = document.getElementById('modal-desc');
    const modalFacts = document.getElementById('modal-facts');

    let activeCategory = 'todas';
    let query = '';
    let page = 1;

    const filterSpecies = () => species.filter((item) => {
      const inCategory = activeCategory === 'todas' || item.category === activeCategory;
      const inQuery = !query || item.name.toLowerCase().includes(query) || item.latin.toLowerCase().includes(query);
      return inCategory && inQuery;
    });

    const cardHTML = (item) => `
      <button type="button" class="card card--interactive js-species-card" data-id="${item.id}" aria-haspopup="dialog">
        <div class="card__title-row">
          <h3 class="card__title">${item.name}</h3>
          <span class="badge badge--accent">${item.categoryLabel}</span>
        </div>
        <p class="card__subtitle">${item.latin}</p>
        <p class="card__text">${item.description}</p>
        <div class="card__meta">
          <span class="card__meta-item">${item.height}</span>
          <span class="card__meta-item">${item.longevity}</span>
        </div>
      </button>`;

    const renderPagination = (totalPages) => {
      let html = `
        <button type="button" class="page-btn" data-page="prev" aria-label="Página anterior"${page === 1 ? ' disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </button>`;
      for (let i = 1; i <= totalPages; i += 1) {
        html += `<button type="button" class="page-btn" data-page="${i}"${i === page ? ' aria-current="page"' : ''}>${i}</button>`;
      }
      html += `
        <button type="button" class="page-btn" data-page="next" aria-label="Próxima página"${page === totalPages ? ' disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </button>`;
      pagination.innerHTML = html;
    };

    const render = () => {
      const results = filterSpecies();
      const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
      page = Math.min(page, totalPages);
      const start = (page - 1) * PER_PAGE;
      const visible = results.slice(start, start + PER_PAGE);

      grid.innerHTML = visible.map(cardHTML).join('');
      grid.style.display = visible.length ? '' : 'none';
      emptyState.classList.toggle('is-visible', !visible.length);
      pagination.style.display = totalPages > 1 ? '' : 'none';
      if (totalPages > 1) renderPagination(totalPages);
    };

    const withSkeletons = (callback) => {
      if (reducedMotion) { callback(); return; }
      skeletons.hidden = false;
      grid.style.display = 'none';
      pagination.style.display = 'none';
      emptyState.classList.remove('is-visible');
      setTimeout(() => {
        skeletons.hidden = true;
        callback();
      }, 450);
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
        activeCategory = tab.dataset.category;
        page = 1;
        withSkeletons(render);
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        query = searchInput.value.trim().toLowerCase();
        page = 1;
        withSkeletons(render);
      });
    }

    pagination.addEventListener('click', (event) => {
      const btn = event.target.closest('.page-btn');
      if (!btn || btn.disabled) return;
      const p = btn.dataset.page;
      if (p === 'prev') page -= 1;
      else if (p === 'next') page += 1;
      else page = Number(p);
      withSkeletons(render);
    });

    const fillModal = (item) => {
      modalBadge.textContent = item.categoryLabel;
      modalTitle.textContent = item.name;
      modalLatin.textContent = item.latin;
      modalDesc.textContent = item.description;
      modalFacts.innerHTML = [
        ['Altura', item.height],
        ['Longevidade', item.longevity],
        ['Origem', item.origin]
      ].map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join('');
    };

    grid.addEventListener('click', (event) => {
      const card = event.target.closest('.js-species-card');
      if (!card) return;
      const id = Number(card.dataset.id);
      const item = species.find((s) => s.id === id);
      if (item) {
        fillModal(item);
        openModal();
      }
    });

    const tablist = catalog.querySelector('[role="tablist"]');
    if (tablist) {
      tablist.addEventListener('keydown', (event) => {
        const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        const tabArray = tabs;
        const idx = tabArray.indexOf(document.activeElement);
        let next = idx;
        if (event.key === 'ArrowRight') next = (idx + 1) % tabArray.length;
        if (event.key === 'ArrowLeft') next = (idx - 1 + tabArray.length) % tabArray.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabArray.length - 1;
        tabArray[next].focus();
      });
    }

    withSkeletons(render);
  }
})();
