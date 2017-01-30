KORERO.Elements = (function () {
  'use strict';

  function init() {
    KORERO.Elements.Template = document.getElementById('core-app');
    KORERO.Elements.Loader = document.getElementById('showbox');

  }

  return {
    init: init
  };
}());
