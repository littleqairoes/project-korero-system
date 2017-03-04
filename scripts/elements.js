KORERO.Elements = (function () {
  'use strict';

  function init() {
    KORERO.Elements.Template = document.getElementById('core-app');
    KORERO.Elements.Loader = document.getElementById('showbox');
    KORERO.Actions = {
      SET_INTERFACE_ID: "SET_INTERFACE_ID",
      OPEN_CREATE_DISCUSSION: "OPEN_CREATE_DISCUSSION",
      CLOSE_CREATE_DISCUSSION: "CLOSE_CREATE_DISCUSSION",
      CLOSE_DISCUSSION_TOOLBAR: "CLOSE_DISCUSSION_TOOLBAR",
      CLOSE_REFER_VIEW: "CLOSE_REFER_VIEW",
      SET_SELECTION: "SET_SELECTION",
      SET_NEW_DISCUSSION_LINKS: "SET_NEW_DISCUSSION_LINKS",
      CLOSE_BOTTOM: "CLOSE_BOTTOM"
    }
  }

  return {
    init: init
  };
}());
