(function () {
  var section = document.getElementById('kfs');
  if (!section) return;
  var bgs = section.querySelectorAll('.kfs__bg');
  var cards = section.querySelectorAll('.kfs-card');
  var items = section.querySelectorAll('.kfs__item');
  var order = ['cherry', 'napa', 'candy'];
  var current = 'cherry';

  // One "active" flavor drives the background colour, the list highlight and the bottle emphasis.
  // Every bottle stays visible and clickable at all times.
  function setActive(flavor) {
    if (!flavor || flavor === current) return;
    current = flavor;
    [bgs, cards, items].forEach(function (list) {
      list.forEach(function (el) { el.classList.toggle('is-active', el.dataset.flavor === flavor); });
    });
  }

  [cards, items].forEach(function (list) {
    list.forEach(function (el) {
      el.addEventListener('mouseenter', function () { setActive(el.dataset.flavor); });
      el.addEventListener('focus', function () { setActive(el.dataset.flavor); });
    });
  });

  // Subtle mouse-parallax on the fruit, like the live section.
  var raf = null;
  section.addEventListener('mousemove', function (e) {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var r = section.getBoundingClientRect();
      section.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      section.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  });

  // Touch devices have no hover: gently cycle the colour theme so all three flavors get their moment.
  var noHover = window.matchMedia('(hover: none)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noHover && !reduce) {
    setInterval(function () {
      setActive(order[(order.indexOf(current) + 1) % order.length]);
    }, 3500);
  }
})();
