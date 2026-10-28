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
     4. SEARCH & LISTING PAGE: LIVE FILTERING, DUAL SLIDER & PAGINATION
     -------------------------------------------------------------------------- */
  const listingGrid = document.getElementById('listingGrid');
  const searchInput = document.getElementById('mainSearchInput');
  const countNum = document.getElementById('countNum');
  const emptyState = document.getElementById('emptyState');
  const sortDropdown = document.getElementById('sortDropdown');
  const btnReset = document.getElementById('btnResetFilters');
  const btnEmptyReset = document.getElementById('btnEmptyReset');
  const btnApply = document.getElementById('btnApplyFilters');

  // Dual Range Slider & Number Inputs
  const priceSliderMin = document.getElementById('priceSliderMin');
  const priceSliderMax = document.getElementById('priceSliderMax');
  const priceInputMin = document.getElementById('priceInputMin');
  const priceInputMax = document.getElementById('priceInputMax');
  const sliderTrackFill = document.getElementById('sliderTrackFill');
  const priceRangeDisplay = document.getElementById('priceRangeDisplay');

  // Pagination Elements
  const paginationContainer = document.getElementById('paginationContainer');
  const pageNumbersGroup = document.getElementById('pageNumbersGroup');
  const btnPrevPage = document.getElementById('btnPrevPage');
  const btnNextPage = document.getElementById('btnNextPage');
  const paginationInfo = document.getElementById('paginationInfo');

  if (listingGrid) {
    const cards = Array.from(listingGrid.querySelectorAll('.product-card'));
    const PAGE_SIZE = 6;
    let currentPage = 1;
    let matchingCards = [];

    // Filter states
    const activeFilters = {
      query: '',
      categories: new Set(),
      size: null,
      color: null,
      minPrice: 0,
      maxPrice: 1000000,
      sort: 'default'
    };

    // Helper: format currency
    function formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
    }

    // Update Slider Visuals (Fill Bar & Label)
    function updateSliderVisuals() {
      const minVal = activeFilters.minPrice;
      const maxVal = activeFilters.maxPrice;
      const maxLimit = 1000000;

      const leftPercent = Math.min(100, Math.max(0, (minVal / maxLimit) * 100));
      const rightPercent = Math.min(100, Math.max(0, 100 - (maxVal / maxLimit) * 100));

      if (sliderTrackFill) {
        sliderTrackFill.style.left = `${leftPercent}%`;
        sliderTrackFill.style.right = `${rightPercent}%`;
      }

      if (priceRangeDisplay) {
        priceRangeDisplay.textContent = `${formatCurrency(minVal)} – ${formatCurrency(maxVal)}`;
      }

      if (priceInputMin && parseInt(priceInputMin.value, 10) !== minVal) {
        priceInputMin.value = minVal;
      }
      if (priceInputMax && parseInt(priceInputMax.value, 10) !== maxVal) {
        priceInputMax.value = maxVal;
      }
      if (priceSliderMin && parseInt(priceSliderMin.value, 10) !== minVal) {
        priceSliderMin.value = minVal;
      }
      if (priceSliderMax && parseInt(priceSliderMax.value, 10) !== maxVal) {
        priceSliderMax.value = maxVal;
      }
    }

    // Render Paginated Products
    function renderPagination() {
      const totalItems = matchingCards.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

      if (currentPage > totalPages) currentPage = 1;
      if (currentPage < 1) currentPage = 1;

      // 1. Show only items on the current page
      const startIndex = (currentPage - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;

      cards.forEach((card) => {
        const isMatching = matchingCards.includes(card);
        if (!isMatching) {
          card.style.display = 'none';
        } else {
          const matchIndex = matchingCards.indexOf(card);
          if (matchIndex >= startIndex && matchIndex < endIndex) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });

      // 2. Render Page Buttons
      if (pageNumbersGroup) {
        pageNumbersGroup.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
          const pBtn = document.createElement('button');
          pBtn.type = 'button';
          pBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
          pBtn.textContent = i;
          pBtn.addEventListener('click', () => {
            currentPage = i;
            renderPagination();
            listingGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          pageNumbersGroup.appendChild(pBtn);
        }
      }

      // 3. Update Prev / Next Buttons
      if (btnPrevPage) {
        btnPrevPage.disabled = currentPage === 1;
        btnPrevPage.onclick = () => {
          if (currentPage > 1) {
            currentPage--;
            renderPagination();
            listingGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        };
      }

      if (btnNextPage) {
        btnNextPage.disabled = currentPage === totalPages;
        btnNextPage.onclick = () => {
          if (currentPage < totalPages) {
            currentPage++;
            renderPagination();
            listingGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        };
      }

      // 4. Update Info Text & Visibility
      if (paginationInfo) {
        paginationInfo.textContent = `Hiển thị trang ${currentPage} / ${totalPages} (${totalItems} sản phẩm)`;
      }

      if (paginationContainer) {
        paginationContainer.style.display = totalItems === 0 ? 'none' : 'flex';
      }

      if (countNum) {
        countNum.textContent = totalItems;
      }

      if (emptyState) {
        emptyState.classList.toggle('visible', totalItems === 0);
      }
    }

    // Filter Application Function
    function applyAllFilters() {
      matchingCards = [];

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

        // 5. Price Range (Dual Slider & Inputs)
        if (matches) {
          if (price < activeFilters.minPrice || price > activeFilters.maxPrice) {
            matches = false;
          }
        }

        if (matches) {
          matchingCards.push(card);
        }
      });

      // Reset to page 1 upon new search/filter
      currentPage = 1;
      renderPagination();
    }

    // Sort Function
    function sortCards(mode) {
      cards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'), 10) || 0;
        const priceB = parseInt(b.getAttribute('data-price'), 10) || 0;
        const isBestA = a.getAttribute('data-bestseller') === 'true';
        const isBestB = b.getAttribute('data-bestseller') === 'true';

        if (mode === 'price-asc') return priceA - priceB;
        if (mode === 'price-desc') return priceB - priceA;
        if (mode === 'bestseller') return (isBestB ? 1 : 0) - (isBestA ? 1 : 0);
        return 0; // default order
      });

      cards.forEach((card) => {
        listingGrid.appendChild(card);
      });

      applyAllFilters();
    }

    // Event Listeners for Dual Range Sliders
    if (priceSliderMin && priceSliderMax) {
      const minGap = 20000;

      priceSliderMin.addEventListener('input', () => {
        let val1 = parseInt(priceSliderMin.value, 10);
        let val2 = parseInt(priceSliderMax.value, 10);

        if (val2 - val1 < minGap) {
          val1 = val2 - minGap;
          priceSliderMin.value = val1;
        }

        activeFilters.minPrice = Math.max(0, val1);
        updateSliderVisuals();
        applyAllFilters();
      });

      priceSliderMax.addEventListener('input', () => {
        let val1 = parseInt(priceSliderMin.value, 10);
        let val2 = parseInt(priceSliderMax.value, 10);

        if (val2 - val1 < minGap) {
          val2 = val1 + minGap;
          priceSliderMax.value = val2;
        }

        activeFilters.maxPrice = Math.min(1000000, val2);
        updateSliderVisuals();
        applyAllFilters();
      });
    }

    // Event Listeners for Direct Numeric Price Inputs
    if (priceInputMin) {
      priceInputMin.addEventListener('change', () => {
        let val = parseInt(priceInputMin.value, 10) || 0;
        if (val < 0) val = 0;
        if (val > activeFilters.maxPrice - 20000) val = activeFilters.maxPrice - 20000;

        activeFilters.minPrice = val;
        updateSliderVisuals();
        applyAllFilters();
      });
    }

    if (priceInputMax) {
      priceInputMax.addEventListener('change', () => {
        let val = parseInt(priceInputMax.value, 10) || 1000000;
        if (val > 1000000) val = 1000000;
        if (val < activeFilters.minPrice + 20000) val = activeFilters.minPrice + 20000;

        activeFilters.maxPrice = val;
        updateSliderVisuals();
        applyAllFilters();
      });
    }

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

    // 5. Sorting
    if (sortDropdown) {
      sortDropdown.addEventListener('change', () => {
        sortCards(sortDropdown.value);
      });
    }

    // Reset All Filters
    function resetFilters() {
      if (searchInput) searchInput.value = '';
      activeFilters.query = '';
      activeFilters.categories.clear();
      activeFilters.size = null;
      activeFilters.color = null;
      activeFilters.minPrice = 0;
      activeFilters.maxPrice = 1000000;

      categoryCheckboxes.forEach((cb) => (cb.checked = false));
      sizeBtns.forEach((b) => b.classList.remove('active'));
      colorOptions.forEach((o) => o.classList.remove('active'));

      updateSliderVisuals();

      if (sortDropdown) sortDropdown.value = 'default';
      sortCards('default');
    }

    if (btnReset) btnReset.addEventListener('click', resetFilters);
    if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetFilters);
    if (btnApply) btnApply.addEventListener('click', applyAllFilters);

    // Read URL Parameters (e.g. search.html?category=hoodie-zip)
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
    } else {
      updateSliderVisuals();
      applyAllFilters();
    }
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

  /* --------------------------------------------------------------------------
     10. PDP: REVIEW PHOTO LIGHTBOX MODAL
     -------------------------------------------------------------------------- */
  const reviewLightbox = document.getElementById('reviewLightbox');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxAuthor = document.getElementById('lightboxAuthor');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function openLightbox(fullImg, author, caption) {
    if (!reviewLightbox || !lightboxImage) return;
    lightboxImage.src = fullImg;
    if (lightboxAuthor) lightboxAuthor.textContent = author || 'Khách hàng meandee';
    if (lightboxCaption) lightboxCaption.textContent = caption || 'Ảnh thực tế sản phẩm';
    reviewLightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!reviewLightbox) return;
    reviewLightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind to review photo cards and attachments
  const clickablePhotos = document.querySelectorAll('.review-photo-card, .review-thumbnail-attachment');
  clickablePhotos.forEach((item) => {
    item.addEventListener('click', () => {
      const fullImg = item.getAttribute('data-fullimg');
      const author = item.getAttribute('data-author');
      const caption = item.getAttribute('data-caption');
      if (fullImg) {
        openLightbox(fullImg, author, caption);
      }
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (reviewLightbox) {
    reviewLightbox.addEventListener('click', (e) => {
      if (e.target === reviewLightbox) {
        closeLightbox();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && reviewLightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

})();

