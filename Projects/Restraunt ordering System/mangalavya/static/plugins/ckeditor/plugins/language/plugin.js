/*
 Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
(function () {
  CKEDITOR.plugins.add("language", {
    requires: "menubutton",
    lang: "ar,az,bg,ca,cs,cy,da,de,de-ch,el,en,en-au,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,gl,he,hr,hu,id,it,ja,km,ko,ku,lv,nb,nl,no,oc,pl,pt,pt-br,ro,ru,sk,sl,sq,sv,tr,tt,ug,uk,vi,zh,zh-cn",
    icons: "language",
    hidpi: !0,
    init: function (a) {
      var b = a.config.language_list || [
          "ar:Arabic:rtl",
          "fr:French",
          "es:Spanish",
        ],
        c = this,
        d = a.lang.language,
        e = {},
        g,
        h,
        k,
        f;
      a.addCommand("language", {
        allowedContent: "span[!lang,!dir]",
        requiredContent: "span[lang,dir]",
        contextSensitive: !0,
        exec: function (a, b) {
          var c = e["language_" + b];
          if (c)
            a[
              c.style.checkActive(a.elementPath(), a)
                ? "removeStyle"
                : "applyStyle"
            ](c.style);
        },
        refresh: function (a) {
          this.setState(
            c.getCurrentLangElement(a)
              ? CKEDITOR.TRISTATE_ON
              : CKEDITOR.TRISTATE_OFF
          );
        },
      });
      for (f = 0; f < b.length; f++)
        (g = b[f].split(":")),
          (h = g[0]),
          (k = "language_" + h),
          (e[k] = {
            label: g[1],
            langId: h,
            group: "language",
            order: f,
            ltr: "rtl" != ("" + g[2]).toLowerCase(),
            onClick: function () {
              a.execCommand("language", this.langId);
            },
            role: "menuitemcheckbox",
          }),
          (e[k].style = new CKEDITOR.style({
            element: "span",
            attributes: { lang: h, dir: e[k].ltr ? "ltr" : "rtl" },
          }));
      e.language_remove = {
        label: d.remove,
        group: "language_remove",
        state: CKEDITOR.TRISTATE_DISABLED,
        order: e.length,
        onClick: function () {
          var b = c.getCurrentLangElement(a);
          b && a.execCommand("language", b.getAttribute("lang"));
        },
      };
      a.addMenuGroup("language", 1);
      a.addMenuGroup("language_remove");
      a.addMenuItems(e);
      a.ui.add("Language", CKEDITOR.UI_MENUBUTTON, {
        label: d.button,
        allowedContent: "span[!lang,!dir]",
        requiredContent: "span[lang,dir]",
        toolbar: "bidi,30",
        command: "language",
        onMenu: function () {
          var b = {},
            d = c.getCurrentLangElement(a),
            f;
          for (f in e) b[f] = CKEDITOR.TRISTATE_OFF;
          b.language_remove = d
            ? CKEDITOR.TRISTATE_OFF
            : CKEDITOR.TRISTATE_DISABLED;
          d && (b["language_" + d.getAttribute("lang")] = CKEDITOR.TRISTATE_ON);
          return b;
        },
      });
      a.addRemoveFormatFilter &&
        a.addRemoveFormatFilter(function (a) {
          return !(
            a.is("span") &&
            a.getAttribute("dir") &&
            a.getAttribute("lang")
          );
        });
    },
    getCurrentLangElement: function (a) {
      var b = a.elementPath();
      a = b && b.elements;
      var c;
      if (b)
        for (var d = 0; d < a.length; d++)
          (b = a[d]),
            !c &&
              "span" == b.getName() &&
              b.hasAttribute("dir") &&
              b.hasAttribute("lang") &&
              (c = b);
      return c;
    },
  });
})();
