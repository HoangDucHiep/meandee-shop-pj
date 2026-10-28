/* ==========================================================================
   meandee STUDIO — Master Frontend JavaScript
   Features:
   - Header scroll effect
   - Toast notification system
   - Homepage & Listing Card variant color preview
   - Search & Listing live filtering (Categories, Sizes, Colors, Price, Sorting)
   - URL Query Parameter syncing (pre-filters from Homepage)
   - PDP Variant Color image switching (two-way sync with gallery thumbnails)
   - PDP Size selection & Quantity adjustment
   - PDP Add to cart badge counter micro-interaction
   - PDP Information tabs switching & Size guide smooth scroll
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. GLOBAL TOAST NOTIFICATION
     -------------------------------------------------------------------------- */
  const toastEl = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer = null;

  window.showToast = function (message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3200);
  };

  /* --------------------------------------------------------------------------
     2. HEADER SCROLL SHADOW
     -------------------------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     3. PRODUCT CARD VARIANT SWATCH HOVER / CLICK (Homepage & Search)
     -------------------------------------------------------------------------- */
  function initCardSwatches() {
    const swatchDots = document.querySelectorAll('.product-card .color-swatch-dot');
    swatchDots.forEach((dot) => {
      const card = dot.closest('.product-card');
      if (!card) return;
      const img = card.querySelector('.product-thumb-wrap img');
      if (!img) return;

      const newSrc = dot.getAttribute('data-img');
      if (!newSrc) return;

      // On click or hover, preview that color variant
      const updateCardImage = () => {
        const parent = dot.parentElement;
        if (parent) {
          parent.querySelectorAll('.color-swatch-dot').forEach((d) => d.classList.remove('active'));
        }
        dot.classList.add('active');
        img.src = newSrc;
      };

      dot.addEventListener('mouseenter', updateCardImage);
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        updateCardImage();
      });
    });
  }
  initCardSwatches();

  /* --------------------------------------------------------------------------
     4. SEARCH & LISTING PAGE: LIVE FILTERING & SORTING
     -------------------------------------------------------------------------- */
  const listingGrid = document.getElementById('listingGrid');
  const searchInput = document.getElementById('mainSearchInput');
  const countNum = document.getElementById('countNum');
  const emptyState = document.getElementById('emptyState');
  const sortDropdown = document.getElementById('sortDropdown');
  const btnReset = document.getElementById('btnResetFilters');
  const btnEmptyReset = document.getElementById('btnEmptyReset');
  const btnApply = document.getElementById('btnApplyFilters');

  if (listingGrid) {
    const cards = Array.from(listingGrid.querySelectorAll('.product-card'));

    // Filter states
    const activeFilters = {
      query: '',
      categories: new Set(),
      size: null,
      color: null,
      priceRange: 'all',
      sort: 'default'
    };

    // Filter Application Function
    function applyAllFilters() {
      let visibleCount = 0;

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const price = parseInt(card.getAttribute('data-price'), 10) || 0;
        const sizes = (card.getAttribute('data-sizes') || '').split(',');
        const colors = (card.getAttribute('data-colors') || '').split(',');

        let matches = true;

        // 1. Text Query
        if (activeFilters.query) {
          const q = activeFilters.query.toLowerCase().trim();
          const cardText = (card.textContent || '').toLowerCase();
          if (!name.includes(q) && !cardText.includes(q)) {
            matches = false;
          }
        }

        // 2. Category Checkboxes
        if (matches && activeFilters.categories.size > 0) {
          if (!activeFilters.categories.has(cat)) {
            matches = false;
          }
        }

        // 3. Size Filter
        if (matches && activeFilters.size) {
          if (!sizes.includes(activeFilters.size)) {
            matches = false;
          }
        }

        // 4. Color Filter
        if (matches && activeFilters.color) {
          if (!colors.includes(activeFilters.color)) {
            matches = false;
          }
        }

        // 5. Price Range
        if (matches && activeFilters.priceRange !== 'all') {
          if (activeFilters.priceRange === 'under-400' && price >= 400000) {
            matches = false;
          } else if (activeFilters.priceRange === '400-650' && (price < 400000 || price > 650000)) {
            matches = false;
          } else if (activeFilters.priceRange === 'above-650' && price <= 650000) {
            matches = false;
          }
        }

        if (matches) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Update count & empty state
      if (countNum) {
        countNum.textContent = visibleCount;
      }
      if (emptyState) {
        emptyState.classList.toggle('visible', visibleCount === 0);
      }
    }

    // Sort Function
    function sortCards(mode) {
      const sortedCards = [...cards].sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'), 10) || 0;
        const priceB = parseInt(b.getAttribute('data-price'), 10) || 0;
        const isBestA = a.getAttribute('data-bestseller') === 'true';
        const isBestB = b.getAttribute('data-bestseller') === 'true';

        if (mode === 'price-asc') return priceA - priceB;
        if (mode === 'price-desc') return priceB - priceA;
        if (mode === 'bestseller') return (isBestB ? 1 : 0) - (isBestA ? 1 : 0);
        return 0; // default order
      });

      sortedCards.forEach((card) => {
        listingGrid.appendChild(card);
      });
    }

    // Event Listeners for Filters
    // 1. Text Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        activeFilters.query = e.target.value;
        applyAllFilters();
      });
    }

    // Suggestion Tags
    document.querySelectorAll('.suggest-tag').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-query') || '';
        if (searchInput) searchInput.value = q;
        activeFilters.query = q;
        applyAllFilters();
      });
    });

    // 2. Category Checkboxes
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    categoryCheckboxes.forEach((cb) => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          activeFilters.categories.add(cb.value);
        } else {
          activeFilters.categories.delete(cb.value);
        }
        applyAllFilters();
      });
    });

    // 3. Size Filter Buttons
    const sizeBtns = document.querySelectorAll('.size-filter-btn');
    sizeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          activeFilters.size = null;
        } else {
          sizeBtns.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          activeFilters.size = size;
        }
        applyAllFilters();
      });
    });

    // 4. Color Swatches
    const colorOptions = document.querySelectorAll('.filter-color-option');
    colorOptions.forEach((opt) => {
      opt.addEventListener('click', () => {
        const color = opt.getAttribute('data-color');
        if (opt.classList.contains('active')) {
          opt.classList.remove('active');
          activeFilters.color = null;
        } else {
          colorOptions.forEach((o) => o.classList.remove('active'));
          opt.classList.add('active');
          activeFilters.color = color;
        }
        applyAllFilters();
      });
    });

    // 5. Price Radio Options
    const priceRadios = document.querySelectorAll('input[name="priceRange"]');
    priceRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        if (radio.checked) {
          activeFilters.priceRange = radio.value;
          applyAllFilters();
        }
      });
    });

    // 6. Sorting
    if (sortDropdown) {
      sortDropdown.addEventListener('change', () => {
        sortCards(sortDropdown.value);
        applyAllFilters();
      });
    }

    // Reset All Filters
    function resetFilters() {
      if (searchInput) searchInput.value = '';
      activeFilters.query = '';
      activeFilters.categories.clear();
      activeFilters.size = null;
      activeFilters.color = null;
      activeFilters.priceRange = 'all';

      categoryCheckboxes.forEach((cb) => (cb.checked = false));
      sizeBtns.forEach((b) => b.classList.remove('active'));
      colorOptions.forEach((o) => o.classList.remove('active'));
      priceRadios.forEach((r) => {
        if (r.value === 'all') r.checked = true;
      });

      if (sortDropdown) sortDropdown.value = 'default';
      sortCards('default');
      applyAllFilters();
    }

    if (btnReset) btnReset.addEventListener('click', resetFilters);
    if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetFilters);
    if (btnApply) btnApply.addEventListener('click', applyAllFilters);

    // Read URL Parameters (e.g. from homepage category clicks: search.html?category=hoodie-zip)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const sortParam = urlParams.get('sort');

    if (catParam) {
      const targetCheckbox = document.querySelector(`input[name="category"][value="${catParam}"]`);
      if (targetCheckbox) {
        targetCheckbox.checked = true;
        activeFilters.categories.add(catParam);
      }
    }

    if (sortParam && sortDropdown) {
      sortDropdown.value = sortParam;
      sortCards(sortParam);
    }

    applyAllFilters();
  }

  /* --------------------------------------------------------------------------
     5. PRODUCT DETAIL PAGE (PDP): COLOR VARIANT & GALLERY TWO-WAY SYNC
     -------------------------------------------------------------------------- */
  const pdpMainImage = document.getElementById('pdpMainImage');
  const selectedColorName = document.getElementById('selectedColorName');
  const pdpColorSwatches = document.querySelectorAll('.pdp-color-swatch-btn');
  const pdpThumbnails = document.querySelectorAll('.pdp-thumb-item');

  function switchProductColor(colorKey, colorLabel, imageSrc) {
    if (!pdpMainImage) return;

    // 1. Update text label
    if (selectedColorName && colorLabel) {
      selectedColorName.textContent = colorLabel;
    }

    // 2. Update color swatches active state
    pdpColorSwatches.forEach((swatch) => {
      const match = swatch.getAttribute('data-color') === colorKey;
      swatch.classList.toggle('active', match);
    });

    // 3. Update thumbnails active state
    pdpThumbnails.forEach((thumb) => {
      const match = thumb.getAttribute('data-color') === colorKey;
      thumb.classList.toggle('active', match);
    });

    // 4. Smooth image swap with cross-dissolve / fade transition
    pdpMainImage.classList.remove('fade-in');
    pdpMainImage.classList.add('fade-out');

    setTimeout(() => {
      pdpMainImage.src = imageSrc;
      pdpMainImage.alt = `Magic Venue Heavyweight Zip Hoodie - ${colorLabel}`;

      pdpMainImage.onload = () => {
        pdpMainImage.classList.remove('fade-out');
        pdpMainImage.classList.add('fade-in');
      };
    }, 120);
  }

  // Right column color swatch clicks
  pdpColorSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const color = swatch.getAttribute('data-color');
      const name = swatch.getAttribute('data-color-name');
      const img = swatch.getAttribute('data-img');
      switchProductColor(color, name, img);
    });
  });

  // Left column thumbnail clicks
  pdpThumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const color = thumb.getAttribute('data-color');
      const name = thumb.getAttribute('data-name');
      const img = thumb.getAttribute('data-img');
      switchProductColor(color, name, img);
    });
  });

  /* --------------------------------------------------------------------------
     6. PDP: SIZE SELECTION
     -------------------------------------------------------------------------- */
  const sizeButtons = document.querySelectorAll('#pdpSizesList .pdp-size-btn');
  let selectedSize = 'L'; // default selected size

  sizeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('disabled')) return;
      sizeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = btn.getAttribute('data-size') || 'L';
    });
  });

  /* --------------------------------------------------------------------------
     7. PDP: QUANTITY PICKER
     -------------------------------------------------------------------------- */
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  if (qtyInput && qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) {
        qtyInput.value = val - 1;
      }
    });

    qtyPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < 99) {
        qtyInput.value = val + 1;
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. PDP: ADD TO CART & BUY NOW MICRO-INTERACTIONS
     -------------------------------------------------------------------------- */
  const btnAddToCart = document.getElementById('btnAddToCart');
  const btnBuyNow = document.getElementById('btnBuyNow');
  const cartBadge = document.getElementById('cartBadgeCount');

  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      const qty = parseInt(qtyInput ? qtyInput.value : '1', 10) || 1;
      const colorName = selectedColorName ? selectedColorName.textContent : 'Đen';

      // Increment badge
      if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent, 10) || 0;
        cartBadge.textContent = currentCount + qty;
        cartBadge.style.transform = 'scale(1.4)';
        setTimeout(() => {
          cartBadge.style.transform = '';
        }, 250);
      }

      // Button micro-interaction
      const origText = btnAddToCart.innerHTML;
      btnAddToCart.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
        <span>Đã thêm thành công!</span>
      `;
      btnAddToCart.style.backgroundColor = '#15803D';

      setTimeout(() => {
        btnAddToCart.innerHTML = origText;
        btnAddToCart.style.backgroundColor = '';
      }, 1600);

      window.showToast(`Đã thêm ${qty}x Magic Venue Hoodie (${colorName} - Size ${selectedSize}) vào giỏ!`);
    });
  }

  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      const colorName = selectedColorName ? selectedColorName.textContent : 'Đen';
      window.showToast(`Đang chuyển tới trang thanh toán an toàn cho size ${selectedSize} (${colorName})...`);
    });
  }

  /* --------------------------------------------------------------------------
     9. PDP: TABS SWITCHER
     -------------------------------------------------------------------------- */
  const tabButtons = document.querySelectorAll('.tab-nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const btnOpenSizeGuide = document.getElementById('btnOpenSizeGuide');

  function activateTab(tabId) {
    tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    tabPanes.forEach((pane) => {
      const isTarget = pane.id === tabId;
      pane.classList.toggle('active', isTarget);
    });
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      if (targetId) activateTab(targetId);
    });
  });

  // Link to size guide: switches to description tab and scrolls
  if (btnOpenSizeGuide) {
    btnOpenSizeGuide.addEventListener('click', (e) => {
      e.preventDefault();
      activateTab('tabDescription');
      const tabsSection = document.getElementById('productTabsSection');
      if (tabsSection) {
        tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

})();
