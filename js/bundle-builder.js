/* Same logic as the live header-popup builder, scoped to this section instead of global IDs
   so it can coexist with the popup on the homepage. */
(function () {
  var root = document.getElementById('mnj_section_bundleinline');
  if (!root) return;
  var $ = function (sel) { return root.querySelector(sel); };
  var innerContainer = $('[data-mnj-inner]');
  var tierSelect = $('[data-mnj-tier]');
  var badgeText = $('[data-mnj-badge-text]');
  var sidebarBadgeText = $('[data-mnj-sidebar-badge-text]');
  var gridContainer = $('[data-mnj-grid]');
  var sidebarItems = $('[data-mnj-items]');
  var selectedBoxesCount = $('[data-mnj-count]');
  var subtotalLabel = $('[data-mnj-subtotal-label]');
  var subtotalVal = $('[data-mnj-subtotal]');
  var discountLabel = $('[data-mnj-discount-label]');
  var discountVal = $('[data-mnj-discount]');
  var compareTotalVal = $('[data-mnj-compare]');
  var finalTotalVal = $('[data-mnj-final]');
  var progressNotice = $('[data-mnj-progress]');
  var progressText = $('[data-mnj-progress-text]');
  var addToCartBtn = $('[data-mnj-cta]');
  var toast = document.querySelector('[data-mnj-toast]');

  var selections = {}; // { productId: { id, variantId, title, price, image, qty } }

  function getMaxLimit() { return parseInt(tierSelect.value, 10) || 2; }
  function getTotalQty() {
    var sum = 0;
    for (var id in selections) sum += selections[id].qty;
    return sum;
  }
  function money(cents) { return '$' + (cents / 100).toFixed(2); }

  function updateUI() {
    var maxLimit = getMaxLimit();
    var totalQty = getTotalQty();
    var selectedOption = tierSelect.options[tierSelect.selectedIndex];
    var discountPercent = parseInt(selectedOption.getAttribute('data-discount'), 10) || 20;

    badgeText.textContent = discountPercent + '% Off';
    sidebarBadgeText.textContent = discountPercent + '% Off';

    // If the pack size shrinks below what's selected, trim from the most recently added items
    if (totalQty > maxLimit) {
      var diff = totalQty - maxLimit;
      var keys = Object.keys(selections);
      for (var i = keys.length - 1; i >= 0 && diff > 0; i--) {
        var prodId = keys[i];
        if (selections[prodId].qty > diff) {
          selections[prodId].qty -= diff;
          diff = 0;
        } else {
          diff -= selections[prodId].qty;
          delete selections[prodId];
        }
      }
    }

    var updatedTotalQty = getTotalQty();
    innerContainer.classList.toggle('mnj_has_selection_bundleinline', updatedTotalQty > 0);

    // Card steppers – any mix of flavors is allowed, up to the pack size
    gridContainer.querySelectorAll('.mnj_card_bundleinline').forEach(function (card) {
      var prodId = card.getAttribute('data-product-id');
      var itemQty = selections[prodId] ? selections[prodId].qty : 0;
      card.querySelector('[data-qty-display]').textContent = itemQty;
      card.querySelector('.mnj_decrement_bundleinline').disabled = itemQty <= 0;
      card.querySelector('.mnj_increment_bundleinline').disabled = updatedTotalQty >= maxLimit;
    });

    // Sidebar rows
    sidebarItems.innerHTML = '';
    if (updatedTotalQty === 0) {
      sidebarItems.innerHTML = '<div class="mnj_empty_sidebar_state_bundleinline"><p>Your bundle is currently empty. Use the quantity selectors to add items.</p></div>';
    } else {
      for (var id in selections) {
        var item = selections[id];
        if (item.qty <= 0) continue;
        var row = document.createElement('div');
        row.className = 'mnj_sidebar_item_row_bundleinline';
        row.innerHTML =
          '<div class="mnj_sidebar_item_left_bundleinline">' +
            '<div class="mnj_sidebar_item_img_bundleinline"><img src="' + item.image + '" alt="' + item.title + '"></div>' +
            '<div class="mnj_sidebar_item_details_bundleinline">' +
              '<h4>' + item.title + '</h4>' +
              '<p>Box of 12 Shots</p>' +
              '<div class="mnj_stepper_bundleinline" style="height: 24px;">' +
                '<button type="button" class="mnj_stepper_btn_bundleinline mnj_sidebar_dec" data-id="' + id + '" style="width: 24px; height: 24px; font-size: 12px;" aria-label="Decrease quantity">-</button>' +
                '<span class="mnj_stepper_val_bundleinline" style="font-size: 12px; width: 20px;">' + item.qty + '</span>' +
                '<button type="button" class="mnj_stepper_btn_bundleinline mnj_sidebar_inc" data-id="' + id + '" style="width: 24px; height: 24px; font-size: 12px;" aria-label="Increase quantity"' + (updatedTotalQty >= maxLimit ? ' disabled' : '') + '>+</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="mnj_sidebar_item_right_bundleinline">' +
            '<span class="mnj_sidebar_item_price_bundleinline">' + money(item.price * item.qty) + '</span>' +
          '</div>' +
          '<button type="button" class="mnj_sidebar_item_remove_bundleinline" data-remove-id="' + id + '" aria-label="Remove item">' +
            '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>';
        sidebarItems.appendChild(row);
      }
    }

    // Totals
    var subtotalCents = 0;
    for (var sid in selections) subtotalCents += selections[sid].price * selections[sid].qty;
    var discountCents = Math.round(subtotalCents * (discountPercent / 100));
    var finalCents = subtotalCents - discountCents;
    selectedBoxesCount.textContent = 'Selected Boxes(' + updatedTotalQty + ')';
    subtotalLabel.textContent = 'Subtotal (' + updatedTotalQty + ' boxes)';
    subtotalVal.textContent = money(subtotalCents);
    discountLabel.textContent = 'Bundle Discount (' + discountPercent + '%)';
    discountVal.textContent = '-' + money(discountCents);
    compareTotalVal.textContent = subtotalCents > 0 ? money(subtotalCents) : '';
    finalTotalVal.textContent = money(finalCents);

    // Progress notice + CTA (bundle must be complete before adding)
    if (updatedTotalQty < maxLimit) {
      var remaining = maxLimit - updatedTotalQty;
      var nextDiscount = discountPercent === 20 ? '20%OFF' : 'extra savings';
      progressNotice.className = 'mnj_progress_notice_bundleinline';
      progressText.innerHTML = 'Add ' + remaining + ' more box to unlock <strong>' + nextDiscount + '</strong>';
      addToCartBtn.disabled = true;
    } else {
      progressNotice.className = 'mnj_progress_notice_bundleinline mnj_complete_notice_bundleinline';
      progressText.innerHTML = 'Bundle complete! You saved <strong>' + discountPercent + '%</strong>.';
      addToCartBtn.disabled = false;
    }
  }

  gridContainer.addEventListener('click', function (e) {
    var btn = e.target.closest('.mnj_stepper_btn_bundleinline');
    if (!btn || btn.disabled) return;
    var card = btn.closest('.mnj_card_bundleinline');
    var prodId = card.getAttribute('data-product-id');
    if (!selections[prodId]) {
      selections[prodId] = {
        id: prodId,
        variantId: card.getAttribute('data-variant-id'),
        title: card.getAttribute('data-title'),
        price: parseInt(card.getAttribute('data-price'), 10) || 0,
        image: card.getAttribute('data-image'),
        qty: 0
      };
    }
    var action = btn.getAttribute('data-action');
    if (action === 'increase' && getTotalQty() < getMaxLimit()) {
      selections[prodId].qty += 1;
    } else if (action === 'decrease' && selections[prodId].qty > 0) {
      selections[prodId].qty -= 1;
    }
    if (selections[prodId].qty === 0) delete selections[prodId];
    updateUI();
  });

  sidebarItems.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('.mnj_sidebar_item_remove_bundleinline');
    if (removeBtn) {
      delete selections[removeBtn.getAttribute('data-remove-id')];
      updateUI();
      return;
    }
    var decBtn = e.target.closest('.mnj_sidebar_dec');
    if (decBtn) {
      var d = decBtn.getAttribute('data-id');
      if (selections[d]) {
        selections[d].qty -= 1;
        if (selections[d].qty <= 0) delete selections[d];
        updateUI();
      }
      return;
    }
    var incBtn = e.target.closest('.mnj_sidebar_inc');
    if (incBtn) {
      var n = incBtn.getAttribute('data-id');
      if (selections[n] && getTotalQty() < getMaxLimit()) {
        selections[n].qty += 1;
        updateUI();
      }
    }
  });

  tierSelect.addEventListener('change', updateUI);

  function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add('is-visible');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(function () { toast.classList.remove('is-visible'); }, 4200);
  }

  addToCartBtn.addEventListener('click', function () {
    var itemsToAdd = [];
    for (var id in selections) {
      if (selections[id].qty > 0) itemsToAdd.push({ id: selections[id].variantId, quantity: selections[id].qty });
    }
    if (!itemsToAdd.length) return;

    addToCartBtn.classList.add('mnj_loading_bundleinline');
    addToCartBtn.disabled = true;

    var summary = Object.keys(selections).map(function (k) {
      return selections[k].qty + '× ' + selections[k].title.replace(' flavored Kanin Shot', '');
    }).join(', ');
    var total = finalTotalVal.textContent;

    // On the Shopify store this posts every flavor as its own line item to /cart/add.js
    // (exactly like the header popup). In this standalone mockup there is no cart, so we simulate it.
    var request = window.Shopify
      ? fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ items: itemsToAdd })
        }).then(function (r) {
          if (!r.ok) return r.json().then(function (err) { throw new Error(err.description || 'Failed to add bundle to cart'); });
          return r.json();
        })
      : new Promise(function (resolve) { setTimeout(resolve, 700); });

    request.then(function (data) {
      document.dispatchEvent(new CustomEvent('cart:refresh', { detail: data }));
      document.dispatchEvent(new CustomEvent('shopify:cart:changed', { detail: data }));
      selections = {};
      updateUI();
      if (window.Shopify) {
        if (window.theme && typeof window.theme.openCartDrawer === 'function') window.theme.openCartDrawer();
        else window.location.href = '/cart';
      } else {
        showToast('<strong>Added to cart:</strong> ' + summary + ' — ' + total);
      }
    }).catch(function (error) {
      alert(error.message || 'An error occurred while adding items to cart.');
    }).finally(function () {
      addToCartBtn.classList.remove('mnj_loading_bundleinline');
      if (getTotalQty() >= getMaxLimit()) addToCartBtn.disabled = false;
    });
  });

  updateUI();
})();
