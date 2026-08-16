/* Proteção de conteúdo — dissuasão contra cópia casual.
 * Não substitui controle de acesso: screenshots, DevTools e requisições de rede continuam possíveis.
 */
(function () {
  'use strict';

  var allow = 'input, textarea, select, button, [contenteditable="true"], [data-allow-copy]';
  var editable = function (target) {
    return target && target.closest && target.closest(allow);
  };
  var isProtected = function (target) {
    return target && target.closest && target.closest('img, picture, video, canvas, svg, .pdf-frame, .pdf-mobile, .map-embed, [data-protected]');
  };

  document.documentElement.classList.add('conteudo-protegido');

  document.addEventListener('contextmenu', function (event) {
    if (!editable(event.target)) event.preventDefault();
  }, true);

  document.addEventListener('dragstart', function (event) {
    if (isProtected(event.target)) event.preventDefault();
  }, true);

  document.addEventListener('selectstart', function (event) {
    if (!editable(event.target) && !event.target.closest('a, nav')) event.preventDefault();
  }, true);

  document.addEventListener('copy', function (event) {
    if (!editable(event.target)) event.preventDefault();
  }, true);

  document.addEventListener('cut', function (event) {
    if (!editable(event.target)) event.preventDefault();
  }, true);

  document.addEventListener('keydown', function (event) {
    var key = String(event.key || '').toLowerCase();
    var modifier = event.ctrlKey || event.metaKey;
    var blocked = modifier && ['s', 'u', 'p', 'c', 'x'].indexOf(key) !== -1;
    blocked = blocked || event.key === 'F12' || (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].indexOf(key) !== -1);
    if (blocked && !editable(event.target)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  document.addEventListener('mousedown', function (event) {
    if (event.button === 2 && !editable(event.target)) event.preventDefault();
  }, true);

  window.addEventListener('load', function () {
    document.querySelectorAll('img, picture img, video, canvas').forEach(function (node) {
      node.setAttribute('draggable', 'false');
      node.setAttribute('ondragstart', 'return false');
    });
  });
})();
