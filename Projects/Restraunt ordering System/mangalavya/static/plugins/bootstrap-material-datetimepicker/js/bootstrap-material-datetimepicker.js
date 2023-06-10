!(function (t, e) {
  var i = "bootstrapMaterialDatePicker",
    a = "plugin_" + i;
  function s(i, a) {
    (this.currentView = 0),
      this.minDate,
      this.maxDate,
      (this._attachedEvents = []),
      (this.element = i),
      (this.$element = t(i)),
      (this.params = {
        date: !0,
        time: !0,
        format: "YYYY-MM-DD",
        minDate: null,
        maxDate: null,
        currentDate: null,
        lang: "en",
        weekStart: 0,
        disabledDays: [],
        shortTime: !1,
        clearButton: !1,
        nowButton: !1,
        cancelText: "Cancel",
        okText: "OK",
        clearText: "Clear",
        nowText: "Now",
        switchOnClick: !1,
        triggerEvent: "focus",
        monthPicker: !1,
        year: !0,
      }),
      (this.params = t.fn.extend(this.params, a)),
      (this.name = "dtp_" + this.setName()),
      this.$element.attr("data-dtp", this.name),
      e.locale(this.params.lang),
      this.init();
  }
  e.locale("en"),
    (t.fn[i] = function (e, i) {
      return (
        this.each(function () {
          t.data(this, a)
            ? ("function" == typeof t.data(this, a)[e] && t.data(this, a)[e](i),
              "destroy" === e && t.data(this, a))
            : t.data(this, a, new s(this, e));
        }),
        this
      );
    }),
    (s.prototype = {
      init: function () {
        this.initDays(),
          this.initDates(),
          this.initTemplate(),
          this.initButtons(),
          this._attachEvent(t(window), "resize", this._centerBox.bind(this)),
          this._attachEvent(
            this.$dtpElement.find(".dtp-content"),
            "click",
            this._onElementClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement,
            "click",
            this._onBackgroundClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find(".dtp-close > a"),
            "click",
            this._onCloseClick.bind(this)
          ),
          this._attachEvent(
            this.$element,
            this.params.triggerEvent,
            this._fireCalendar.bind(this)
          );
      },
      initDays: function () {
        this.days = [];
        for (var t = this.params.weekStart; this.days.length < 7; t++)
          t > 6 && (t = 0), this.days.push(t.toString());
      },
      initDates: function () {
        if (this.$element.val().length > 0)
          void 0 !== this.params.format && null !== this.params.format
            ? (this.currentDate = e(
                this.$element.val(),
                this.params.format
              ).locale(this.params.lang))
            : (this.currentDate = e(this.$element.val()).locale(
                this.params.lang
              ));
        else if (
          void 0 !== this.$element.attr("value") &&
          null !== this.$element.attr("value") &&
          "" !== this.$element.attr("value")
        )
          "string" == typeof this.$element.attr("value") &&
            (void 0 !== this.params.format && null !== this.params.format
              ? (this.currentDate = e(
                  this.$element.attr("value"),
                  this.params.format
                ).locale(this.params.lang))
              : (this.currentDate = e(this.$element.attr("value")).locale(
                  this.params.lang
                )));
        else if (
          void 0 !== this.params.currentDate &&
          null !== this.params.currentDate
        ) {
          if ("string" == typeof this.params.currentDate)
            void 0 !== this.params.format && null !== this.params.format
              ? (this.currentDate = e(
                  this.params.currentDate,
                  this.params.format
                ).locale(this.params.lang))
              : (this.currentDate = e(this.params.currentDate).locale(
                  this.params.lang
                ));
          else if (
            void 0 === this.params.currentDate.isValid ||
            "function" != typeof this.params.currentDate.isValid
          ) {
            var t = this.params.currentDate.getTime();
            this.currentDate = e(t, "x").locale(this.params.lang);
          } else this.currentDate = this.params.currentDate;
          this.$element.val(this.currentDate.format(this.params.format));
        } else this.currentDate = e();
        if (void 0 !== this.params.minDate && null !== this.params.minDate)
          if ("string" == typeof this.params.minDate)
            void 0 !== this.params.format && null !== this.params.format
              ? (this.minDate = e(
                  this.params.minDate,
                  this.params.format
                ).locale(this.params.lang))
              : (this.minDate = e(this.params.minDate).locale(
                  this.params.lang
                ));
          else if (
            void 0 === this.params.minDate.isValid ||
            "function" != typeof this.params.minDate.isValid
          ) {
            t = this.params.minDate.getTime();
            this.minDate = e(t, "x").locale(this.params.lang);
          } else this.minDate = this.params.minDate;
        else null === this.params.minDate && (this.minDate = null);
        if (void 0 !== this.params.maxDate && null !== this.params.maxDate)
          if ("string" == typeof this.params.maxDate)
            void 0 !== this.params.format && null !== this.params.format
              ? (this.maxDate = e(
                  this.params.maxDate,
                  this.params.format
                ).locale(this.params.lang))
              : (this.maxDate = e(this.params.maxDate).locale(
                  this.params.lang
                ));
          else if (
            void 0 === this.params.maxDate.isValid ||
            "function" != typeof this.params.maxDate.isValid
          ) {
            t = this.params.maxDate.getTime();
            this.maxDate = e(t, "x").locale(this.params.lang);
          } else this.maxDate = this.params.maxDate;
        else null === this.params.maxDate && (this.maxDate = null);
        this.isAfterMinDate(this.currentDate) ||
          (this.currentDate = e(this.minDate)),
          this.isBeforeMaxDate(this.currentDate) ||
            (this.currentDate = e(this.maxDate));
      },
      initTemplate: function () {
        for (var e = "", i = this.currentDate.year(), a = i - 3; a < i + 4; a++)
          e +=
            '<div class="year-picker-item" data-year="' +
            a +
            '">' +
            a +
            "</div>";
        this.midYear = i;
        var s =
          '<div class="dtp-picker-year hidden" ><div><a href="javascript:void(0);" class="btn btn-default dtp-select-year-range before" style="margin: 0;"><i class="ti-angle-up"></i></a></div>' +
          e +
          '<div><a href="javascript:void(0);" class="btn btn-default dtp-select-year-range after" style="margin: 0;"><i class="ti-angle-down"></i></a></div></div>';
        (this.template =
          '<div class="dtp hidden" id="' +
          this.name +
          '"><div class="dtp-content"><div class="dtp-date-view"><header class="dtp-header"><div class="dtp-actual-day">Lundi</div><div class="dtp-close"><a href="javascript:void(0);"><i class="ti-close"></i></a></div></header><div class="dtp-date hidden"><div><div class="left center p10"><a href="javascript:void(0);" class="dtp-select-month-before"><i class="ti-angle-left"></i></a></div><div class="dtp-actual-month p80">MAR</div><div class="right center p10"><a href="javascript:void(0);" class="dtp-select-month-after"><i class="ti-angle-right"></i></a></div><div class="clearfix"></div></div><div class="dtp-actual-num">13</div><div><div class="left center p10"><a href="javascript:void(0);" class="dtp-select-year-before"><i class="ti-angle-left"></i></a></div><div class="dtp-actual-year p80' +
          (this.params.year ? "" : " disabled") +
          '">2014</div><div class="right center p10"><a href="javascript:void(0);" class="dtp-select-year-after"><i class="ti-angle-right"></i></a></div><div class="clearfix"></div></div></div><div class="dtp-time hidden"><div class="dtp-actual-maxtime">23:55</div></div><div class="dtp-picker"><div class="dtp-picker-calendar"></div><div class="dtp-picker-datetime hidden"><div class="dtp-actual-meridien"><div class="left p20"><a class="dtp-meridien-am" href="javascript:void(0);">AM</a></div><div class="dtp-actual-time p60"></div><div class="right p20"><a class="dtp-meridien-pm" href="javascript:void(0);">PM</a></div><div class="clearfix"></div></div><div id="dtp-svg-clock"></div></div>' +
          s +
          '</div></div><div class="dtp-buttons"><button class="dtp-btn-now btn btn-flat hidden">' +
          this.params.nowText +
          '</button><button class="dtp-btn-clear btn btn-flat hidden">' +
          this.params.clearText +
          '</button><button class="dtp-btn-cancel btn btn-inverse m-r-10">' +
          this.params.cancelText +
          '</button><button class="dtp-btn-ok btn btn-success">' +
          this.params.okText +
          '</button><div class="clearfix"></div></div></div></div>'),
          t("body").find("#" + this.name).length <= 0 &&
            (t("body").append(this.template),
            this && (this.dtpElement = t("body").find("#" + this.name)),
            (this.$dtpElement = t(this.dtpElement)));
      },
      initButtons: function () {
        this._attachEvent(
          this.$dtpElement.find(".dtp-btn-cancel"),
          "click",
          this._onCancelClick.bind(this)
        ),
          this._attachEvent(
            this.$dtpElement.find(".dtp-btn-ok"),
            "click",
            this._onOKClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("a.dtp-select-month-before"),
            "click",
            this._onMonthBeforeClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("a.dtp-select-month-after"),
            "click",
            this._onMonthAfterClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("a.dtp-select-year-before"),
            "click",
            this._onYearBeforeClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("a.dtp-select-year-after"),
            "click",
            this._onYearAfterClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find(".dtp-actual-year"),
            "click",
            this._onActualYearClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("a.dtp-select-year-range.before"),
            "click",
            this._onYearRangeBeforeClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("a.dtp-select-year-range.after"),
            "click",
            this._onYearRangeAfterClick.bind(this)
          ),
          this._attachEvent(
            this.$dtpElement.find("div.year-picker-item"),
            "click",
            this._onYearItemClick.bind(this)
          ),
          !0 === this.params.clearButton &&
            (this._attachEvent(
              this.$dtpElement.find(".dtp-btn-clear"),
              "click",
              this._onClearClick.bind(this)
            ),
            this.$dtpElement.find(".dtp-btn-clear").removeClass("hidden")),
          !0 === this.params.nowButton &&
            (this._attachEvent(
              this.$dtpElement.find(".dtp-btn-now"),
              "click",
              this._onNowClick.bind(this)
            ),
            this.$dtpElement.find(".dtp-btn-now").removeClass("hidden")),
          !0 === this.params.nowButton && !0 === this.params.clearButton
            ? this.$dtpElement
                .find(
                  ".dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok"
                )
                .addClass("btn-xs")
            : (!0 !== this.params.nowButton &&
                !0 !== this.params.clearButton) ||
              this.$dtpElement
                .find(
                  ".dtp-btn-clear, .dtp-btn-now, .dtp-btn-cancel, .dtp-btn-ok"
                )
                .addClass("btn-sm");
      },
      initMeridienButtons: function () {
        this.$dtpElement
          .find("a.dtp-meridien-am")
          .off("click")
          .on("click", this._onSelectAM.bind(this)),
          this.$dtpElement
            .find("a.dtp-meridien-pm")
            .off("click")
            .on("click", this._onSelectPM.bind(this));
      },
      initDate: function (t) {
        (this.currentView = 0),
          !1 === this.params.monthPicker &&
            this.$dtpElement.find(".dtp-picker-calendar").removeClass("hidden"),
          this.$dtpElement.find(".dtp-picker-datetime").addClass("hidden"),
          this.$dtpElement.find(".dtp-picker-year").addClass("hidden");
        var e =
            void 0 !== this.currentDate && null !== this.currentDate
              ? this.currentDate
              : null,
          i = this.generateCalendar(this.currentDate);
        if (void 0 !== i.week && void 0 !== i.days) {
          var a = this.constructHTMLCalendar(e, i);
          this.$dtpElement.find("a.dtp-select-day").off("click"),
            this.$dtpElement.find(".dtp-picker-calendar").html(a),
            this.$dtpElement
              .find("a.dtp-select-day")
              .on("click", this._onSelectDate.bind(this)),
            this.toggleButtons(e);
        }
        this._centerBox(), this.showDate(e);
      },
      initHours: function () {
        (this.currentView = 1),
          this.showTime(this.currentDate),
          this.initMeridienButtons(),
          this.currentDate.hour() < 12
            ? this.$dtpElement.find("a.dtp-meridien-am").click()
            : this.$dtpElement.find("a.dtp-meridien-pm").click();
        var t = this.params.shortTime ? "h" : "H";
        this.$dtpElement.find(".dtp-picker-datetime").removeClass("hidden"),
          this.$dtpElement.find(".dtp-picker-calendar").addClass("hidden"),
          this.$dtpElement.find(".dtp-picker-year").addClass("hidden");
        for (var e = this.createSVGClock(!0), i = 0; i < 12; i++) {
          var a = -162 * Math.sin(2 * -Math.PI * (i / 12)),
            s = -162 * Math.cos(2 * -Math.PI * (i / 12)),
            n = this.currentDate.format(t) == i ? "#26c6da" : "transparent",
            r = this.currentDate.format(t) == i ? "#fff" : "#000",
            d = this.createSVGElement("circle", {
              id: "h-" + i,
              class: "dtp-select-hour",
              style: "cursor:pointer",
              r: "30",
              cx: a,
              cy: s,
              fill: n,
              "data-hour": i,
            });
          ((h = this.createSVGElement("text", {
            id: "th-" + i,
            class: "dtp-select-hour-text",
            "text-anchor": "middle",
            style: "cursor:pointer",
            "font-weight": "bold",
            "font-size": "20",
            x: a,
            y: s + 7,
            fill: r,
            "data-hour": i,
          })).textContent = 0 === i && this.params.shortTime ? 12 : i),
            this.toggleTime(i, !0)
              ? (d.addEventListener("click", this._onSelectHour.bind(this)),
                h.addEventListener("click", this._onSelectHour.bind(this)))
              : ((d.className += " disabled"),
                (h.className += " disabled"),
                h.setAttribute("fill", "#bdbdbd")),
            e.appendChild(d),
            e.appendChild(h);
        }
        if (!this.params.shortTime) {
          for (i = 0; i < 12; i++) {
            var h;
            (a = -110 * Math.sin(2 * -Math.PI * (i / 12))),
              (s = -110 * Math.cos(2 * -Math.PI * (i / 12))),
              (n =
                this.currentDate.format(t) == i + 12
                  ? "#26c6da"
                  : "transparent"),
              (r = this.currentDate.format(t) == i + 12 ? "#fff" : "#000"),
              (d = this.createSVGElement("circle", {
                id: "h-" + (i + 12),
                class: "dtp-select-hour",
                style: "cursor:pointer",
                r: "30",
                cx: a,
                cy: s,
                fill: n,
                "data-hour": i + 12,
              }));
            ((h = this.createSVGElement("text", {
              id: "th-" + (i + 12),
              class: "dtp-select-hour-text",
              "text-anchor": "middle",
              style: "cursor:pointer",
              "font-weight": "bold",
              "font-size": "22",
              x: a,
              y: s + 7,
              fill: r,
              "data-hour": i + 12,
            })).textContent = i + 12),
              this.toggleTime(i + 12, !0)
                ? (d.addEventListener("click", this._onSelectHour.bind(this)),
                  h.addEventListener("click", this._onSelectHour.bind(this)))
                : ((d.className += " disabled"),
                  (h.className += " disabled"),
                  h.setAttribute("fill", "#bdbdbd")),
              e.appendChild(d),
              e.appendChild(h);
          }
          this.$dtpElement.find("a.dtp-meridien-am").addClass("hidden"),
            this.$dtpElement.find("a.dtp-meridien-pm").addClass("hidden");
        }
        this._centerBox();
      },
      initMinutes: function () {
        (this.currentView = 2),
          this.showTime(this.currentDate),
          this.initMeridienButtons(),
          this.currentDate.hour() < 12
            ? this.$dtpElement.find("a.dtp-meridien-am").click()
            : this.$dtpElement.find("a.dtp-meridien-pm").click(),
          this.$dtpElement.find(".dtp-picker-year").addClass("hidden"),
          this.$dtpElement.find(".dtp-picker-calendar").addClass("hidden"),
          this.$dtpElement.find(".dtp-picker-datetime").removeClass("hidden");
        for (var t = this.createSVGClock(!1), e = 0; e < 60; e++) {
          var i = e % 5 == 0 ? 162 : 158,
            a = e % 5 == 0 ? 30 : 20,
            s = -i * Math.sin(2 * -Math.PI * (e / 60)),
            n = -i * Math.cos(2 * -Math.PI * (e / 60)),
            r = this.currentDate.format("m") == e ? "#26c6da" : "transparent",
            d = this.createSVGElement("circle", {
              id: "m-" + e,
              class: "dtp-select-minute",
              style: "cursor:pointer",
              r: a,
              cx: s,
              cy: n,
              fill: r,
              "data-minute": e,
            });
          this.toggleTime(e, !1)
            ? d.addEventListener("click", this._onSelectMinute.bind(this))
            : (d.className += " disabled"),
            t.appendChild(d);
        }
        for (e = 0; e < 60; e++)
          if (e % 5 == 0) {
            (s = -162 * Math.sin(2 * -Math.PI * (e / 60))),
              (n = -162 * Math.cos(2 * -Math.PI * (e / 60))),
              (r = this.currentDate.format("m") == e ? "#fff" : "#000");
            var h = this.createSVGElement("text", {
              id: "tm-" + e,
              class: "dtp-select-minute-text",
              "text-anchor": "middle",
              style: "cursor:pointer",
              "font-weight": "bold",
              "font-size": "20",
              x: s,
              y: n + 7,
              fill: r,
              "data-minute": e,
            });
            (h.textContent = e),
              this.toggleTime(e, !1)
                ? h.addEventListener("click", this._onSelectMinute.bind(this))
                : ((h.className += " disabled"),
                  h.setAttribute("fill", "#bdbdbd")),
              t.appendChild(h);
          }
        this._centerBox();
      },
      animateHands: function () {
        var t = this.currentDate.hour(),
          e = this.currentDate.minute();
        this.$dtpElement
          .find(".hour-hand")[0]
          .setAttribute("transform", "rotate(" + (360 * t) / 12 + ")"),
          this.$dtpElement
            .find(".minute-hand")[0]
            .setAttribute("transform", "rotate(" + (360 * e) / 60 + ")");
      },
      createSVGClock: function (t) {
        var e = this.params.shortTime ? -120 : -90,
          i = this.createSVGElement("svg", {
            class: "svg-clock",
            viewBox: "0,0,400,400",
          }),
          a = this.createSVGElement("g", { transform: "translate(200,200) " }),
          s = this.createSVGElement("circle", {
            r: "192",
            fill: "#eee",
            stroke: "#bdbdbd",
            "stroke-width": 2,
          }),
          n = this.createSVGElement("circle", { r: "15", fill: "#757575" });
        if ((a.appendChild(s), t)) {
          var r = this.createSVGElement("line", {
              class: "minute-hand",
              x1: 0,
              y1: 0,
              x2: 0,
              y2: -150,
              stroke: "#bdbdbd",
              "stroke-width": 2,
            }),
            d = this.createSVGElement("line", {
              class: "hour-hand",
              x1: 0,
              y1: 0,
              x2: 0,
              y2: e,
              stroke: "#26c6da",
              "stroke-width": 8,
            });
          a.appendChild(r), a.appendChild(d);
        } else {
          (r = this.createSVGElement("line", {
            class: "minute-hand",
            x1: 0,
            y1: 0,
            x2: 0,
            y2: -150,
            stroke: "#26c6da",
            "stroke-width": 2,
          })),
            (d = this.createSVGElement("line", {
              class: "hour-hand",
              x1: 0,
              y1: 0,
              x2: 0,
              y2: e,
              stroke: "#bdbdbd",
              "stroke-width": 8,
            }));
          a.appendChild(d), a.appendChild(r);
        }
        return (
          a.appendChild(n),
          i.appendChild(a),
          this.$dtpElement.find("#dtp-svg-clock").empty(),
          this.$dtpElement.find("#dtp-svg-clock")[0].appendChild(i),
          this.animateHands(),
          a
        );
      },
      createSVGElement: function (t, e) {
        var i = document.createElementNS("http://www.w3.org/2000/svg", t);
        for (var a in e) i.setAttribute(a, e[a]);
        return i;
      },
      isAfterMinDate: function (t, i, a) {
        var s = !0;
        if (void 0 !== this.minDate && null !== this.minDate) {
          var n = e(this.minDate),
            r = e(t);
          i || a || (n.hour(0), n.minute(0), r.hour(0), r.minute(0)),
            n.second(0),
            r.second(0),
            n.millisecond(0),
            r.millisecond(0),
            a
              ? (s = parseInt(r.format("X")) >= parseInt(n.format("X")))
              : (r.minute(0),
                n.minute(0),
                (s = parseInt(r.format("X")) >= parseInt(n.format("X"))));
        }
        return s;
      },
      isBeforeMaxDate: function (t, i, a) {
        var s = !0;
        if (void 0 !== this.maxDate && null !== this.maxDate) {
          var n = e(this.maxDate),
            r = e(t);
          i || a || (n.hour(0), n.minute(0), r.hour(0), r.minute(0)),
            n.second(0),
            r.second(0),
            n.millisecond(0),
            r.millisecond(0),
            a
              ? (s = parseInt(r.format("X")) <= parseInt(n.format("X")))
              : (r.minute(0),
                n.minute(0),
                (s = parseInt(r.format("X")) <= parseInt(n.format("X"))));
        }
        return s;
      },
      rotateElement: function (e, i) {
        t(e).css({
          WebkitTransform: "rotate(" + i + "deg)",
          "-moz-transform": "rotate(" + i + "deg)",
        });
      },
      showDate: function (t) {
        t &&
          (this.$dtpElement
            .find(".dtp-actual-day")
            .html(t.locale(this.params.lang).format("dddd")),
          this.$dtpElement
            .find(".dtp-actual-month")
            .html(t.locale(this.params.lang).format("MMM").toUpperCase()),
          this.$dtpElement
            .find(".dtp-actual-num")
            .html(t.locale(this.params.lang).format("DD")),
          this.$dtpElement
            .find(".dtp-actual-year")
            .html(t.locale(this.params.lang).format("YYYY")));
      },
      showTime: function (t) {
        if (t) {
          var e = t.minute(),
            i =
              (this.params.shortTime ? t.format("hh") : t.format("HH")) +
              ":" +
              (2 == e.toString().length ? e : "0" + e) +
              (this.params.shortTime ? " " + t.format("A") : "");
          this.params.date
            ? this.$dtpElement.find(".dtp-actual-time").html(i)
            : (this.params.shortTime
                ? this.$dtpElement.find(".dtp-actual-day").html(t.format("A"))
                : this.$dtpElement.find(".dtp-actual-day").html("&nbsp;"),
              this.$dtpElement.find(".dtp-actual-maxtime").html(i));
        }
      },
      selectDate: function (t) {
        t &&
          (this.currentDate.date(t),
          this.showDate(this.currentDate),
          this.$element.trigger("dateSelected", this.currentDate));
      },
      generateCalendar: function (t) {
        var i = {};
        if (null !== t) {
          var a = e(t).locale(this.params.lang).startOf("month"),
            s = e(t).locale(this.params.lang).endOf("month"),
            n = a.format("d");
          (i.week = this.days), (i.days = []);
          for (var r = a.date(); r <= s.date(); r++) {
            if (r === a.date()) {
              var d = i.week.indexOf(n.toString());
              if (d > 0) for (var h = 0; h < d; h++) i.days.push(0);
            }
            i.days.push(e(a).locale(this.params.lang).date(r));
          }
        }
        return i;
      },
      constructHTMLCalendar: function (t, i) {
        var a = "";
        (a +=
          '<div class="dtp-picker-month">' +
          t.locale(this.params.lang).format("MMMM YYYY") +
          "</div>"),
          (a += '<table class="table dtp-picker-days"><thead>');
        for (var s = 0; s < i.week.length; s++)
          a +=
            "<th>" +
            e(parseInt(i.week[s]), "d")
              .locale(this.params.lang)
              .format("dd")
              .substring(0, 1) +
            "</th>";
        (a += "</thead>"), (a += "<tbody><tr>");
        for (s = 0; s < i.days.length; s++)
          s % 7 == 0 && (a += "</tr><tr>"),
            (a +=
              '<td data-date="' +
              e(i.days[s]).locale(this.params.lang).format("D") +
              '">'),
            0 != i.days[s] &&
              (!1 === this.isBeforeMaxDate(e(i.days[s]), !1, !1) ||
              !1 === this.isAfterMinDate(e(i.days[s]), !1, !1) ||
              -1 !== this.params.disabledDays.indexOf(i.days[s].isoWeekday())
                ? (a +=
                    '<span class="dtp-select-day">' +
                    e(i.days[s]).locale(this.params.lang).format("DD") +
                    "</span>")
                : e(i.days[s]).locale(this.params.lang).format("DD") ===
                  e(this.currentDate).locale(this.params.lang).format("DD")
                ? (a +=
                    '<a href="javascript:void(0);" class="dtp-select-day selected">' +
                    e(i.days[s]).locale(this.params.lang).format("DD") +
                    "</a>")
                : (a +=
                    '<a href="javascript:void(0);" class="dtp-select-day">' +
                    e(i.days[s]).locale(this.params.lang).format("DD") +
                    "</a>"),
              (a += "</td>"));
        return (a += "</tr></tbody></table>");
      },
      setName: function () {
        for (
          var t = "",
            e =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            i = 0;
          i < 5;
          i++
        )
          t += e.charAt(Math.floor(Math.random() * e.length));
        return t;
      },
      isPM: function () {
        return this.$dtpElement.find("a.dtp-meridien-pm").hasClass("selected");
      },
      setElementValue: function () {
        this.$element.trigger("beforeChange", this.currentDate),
          void 0 !== t.material && this.$element.removeClass("empty"),
          this.$element.val(
            e(this.currentDate)
              .locale(this.params.lang)
              .format(this.params.format)
          ),
          this.$element.trigger("change", this.currentDate);
      },
      toggleButtons: function (t) {
        if (t && t.isValid()) {
          var i = e(t).locale(this.params.lang).startOf("month"),
            a = e(t).locale(this.params.lang).endOf("month");
          this.isAfterMinDate(i, !1, !1)
            ? this.$dtpElement
                .find("a.dtp-select-month-before")
                .removeClass("invisible")
            : this.$dtpElement
                .find("a.dtp-select-month-before")
                .addClass("invisible"),
            this.isBeforeMaxDate(a, !1, !1)
              ? this.$dtpElement
                  .find("a.dtp-select-month-after")
                  .removeClass("invisible")
              : this.$dtpElement
                  .find("a.dtp-select-month-after")
                  .addClass("invisible");
          var s = e(t).locale(this.params.lang).startOf("year"),
            n = e(t).locale(this.params.lang).endOf("year");
          this.isAfterMinDate(s, !1, !1)
            ? this.$dtpElement
                .find("a.dtp-select-year-before")
                .removeClass("invisible")
            : this.$dtpElement
                .find("a.dtp-select-year-before")
                .addClass("invisible"),
            this.isBeforeMaxDate(n, !1, !1)
              ? this.$dtpElement
                  .find("a.dtp-select-year-after")
                  .removeClass("invisible")
              : this.$dtpElement
                  .find("a.dtp-select-year-after")
                  .addClass("invisible");
        }
      },
      toggleTime: function (t, i) {
        var a,
          s = !1;
        i
          ? ((a = e(this.currentDate))
              .hour(this.convertHours(t))
              .minute(0)
              .second(0),
            (s = !(
              !1 === this.isAfterMinDate(a, !0, !1) ||
              !1 === this.isBeforeMaxDate(a, !0, !1)
            )))
          : ((a = e(this.currentDate)).minute(t).second(0),
            (s = !(
              !1 === this.isAfterMinDate(a, !0, !0) ||
              !1 === this.isBeforeMaxDate(a, !0, !0)
            )));
        return s;
      },
      _attachEvent: function (t, e, i) {
        t.on(e, null, null, i), this._attachedEvents.push([t, e, i]);
      },
      _detachEvents: function () {
        for (var t = this._attachedEvents.length - 1; t >= 0; t--)
          this._attachedEvents[t][0].off(
            this._attachedEvents[t][1],
            this._attachedEvents[t][2]
          ),
            this._attachedEvents.splice(t, 1);
      },
      _fireCalendar: function () {
        (this.currentView = 0),
          this.$element.blur(),
          this.initDates(),
          this.show(),
          this.params.date
            ? (this.$dtpElement.find(".dtp-date").removeClass("hidden"),
              this.initDate())
            : this.params.time &&
              (this.$dtpElement.find(".dtp-time").removeClass("hidden"),
              this.initHours());
      },
      _onBackgroundClick: function (t) {
        t.stopPropagation(), this.hide();
      },
      _onElementClick: function (t) {
        t.stopPropagation();
      },
      _onKeydown: function (t) {
        27 === t.which && this.hide();
      },
      _onCloseClick: function () {
        this.hide();
      },
      _onClearClick: function () {
        (this.currentDate = null),
          this.$element.trigger("beforeChange", this.currentDate),
          this.hide(),
          void 0 !== t.material && this.$element.addClass("empty"),
          this.$element.val(""),
          this.$element.trigger("change", this.currentDate);
      },
      _onNowClick: function () {
        if (
          ((this.currentDate = e()),
          !0 === this.params.date &&
            (this.showDate(this.currentDate),
            0 === this.currentView && this.initDate()),
          !0 === this.params.time)
        ) {
          switch ((this.showTime(this.currentDate), this.currentView)) {
            case 1:
              this.initHours();
              break;
            case 2:
              this.initMinutes();
          }
          this.animateHands();
        }
      },
      _onOKClick: function () {
        switch (this.currentView) {
          case 0:
            !0 === this.params.time
              ? this.initHours()
              : (this.setElementValue(), this.hide());
            break;
          case 1:
            this.initMinutes();
            break;
          case 2:
            this.setElementValue(), this.hide();
        }
      },
      _onCancelClick: function () {
        if (this.params.time)
          switch (this.currentView) {
            case 0:
              this.hide();
              break;
            case 1:
              this.params.date ? this.initDate() : this.hide();
              break;
            case 2:
              this.initHours();
          }
        else this.hide();
      },
      _onMonthBeforeClick: function () {
        this.currentDate.subtract(1, "months"),
          this.initDate(this.currentDate),
          this._closeYearPicker();
      },
      _onMonthAfterClick: function () {
        this.currentDate.add(1, "months"),
          this.initDate(this.currentDate),
          this._closeYearPicker();
      },
      _onYearBeforeClick: function () {
        this.currentDate.subtract(1, "years"),
          this.initDate(this.currentDate),
          this._closeYearPicker();
      },
      _onYearAfterClick: function () {
        this.currentDate.add(1, "years"),
          this.initDate(this.currentDate),
          this._closeYearPicker();
      },
      refreshYearItems: function () {
        var i = this.currentDate.year(),
          a = this.midYear,
          s = 1850;
        void 0 !== this.minDate &&
          null !== this.minDate &&
          (s = e(this.minDate).year());
        var n = 2200;
        void 0 !== this.maxDate &&
          null !== this.maxDate &&
          (n = e(this.maxDate).year()),
          this.$dtpElement
            .find(".dtp-picker-year .invisible")
            .removeClass("invisible"),
          this.$dtpElement.find(".year-picker-item").each(function (e, r) {
            var d = a - 3 + e;
            t(r).attr("data-year", d).text(d).data("year", d),
              i == d ? t(r).addClass("active") : t(r).removeClass("active"),
              (d < s || d > n) && t(r).addClass("invisible");
          }),
          s >= a - 3 &&
            this.$dtpElement
              .find(".dtp-select-year-range.before")
              .addClass("invisible"),
          n <= a + 3 &&
            this.$dtpElement
              .find(".dtp-select-year-range.after")
              .addClass("invisible"),
          this.$dtpElement.find(".dtp-select-year-range").data("mid", a);
      },
      _onActualYearClick: function () {
        this.params.year &&
          (this.$dtpElement.find(".dtp-picker-year.hidden").length > 0
            ? (this.$dtpElement.find(".dtp-picker-datetime").addClass("hidden"),
              this.$dtpElement.find(".dtp-picker-calendar").addClass("hidden"),
              this.$dtpElement.find(".dtp-picker-year").removeClass("hidden"),
              (this.midYear = this.currentDate.year()),
              this.refreshYearItems())
            : this._closeYearPicker());
      },
      _onYearRangeBeforeClick: function () {
        (this.midYear -= 7), this.refreshYearItems();
      },
      _onYearRangeAfterClick: function () {
        (this.midYear += 7), this.refreshYearItems();
      },
      _onYearItemClick: function (e) {
        var i = t(e.currentTarget).data("year") - this.currentDate.year();
        this.currentDate.add(i, "years"),
          this.initDate(this.currentDate),
          this._closeYearPicker(),
          this.$element.trigger("yearSelected", this.currentDate);
      },
      _closeYearPicker: function () {
        this.$dtpElement.find(".dtp-picker-calendar").removeClass("hidden"),
          this.$dtpElement.find(".dtp-picker-year").addClass("hidden");
      },
      enableYearPicker: function () {
        (this.params.year = !0),
          this.$dtpElement.find(".dtp-actual-year").reomveClass("disabled");
      },
      disableYearPicker: function () {
        (this.params.year = !1),
          this.$dtpElement.find(".dtp-actual-year").addClass("disabled"),
          this._closeYearPicker();
      },
      _onSelectDate: function (e) {
        this.$dtpElement.find("a.dtp-select-day").removeClass("selected"),
          t(e.currentTarget).addClass("selected"),
          this.selectDate(t(e.currentTarget).parent().data("date")),
          !0 === this.params.switchOnClick &&
            !0 === this.params.time &&
            setTimeout(this.initHours.bind(this), 200),
          !0 === this.params.switchOnClick &&
            !1 === this.params.time &&
            setTimeout(this._onOKClick.bind(this), 200);
      },
      _onSelectHour: function (e) {
        if (!t(e.target).hasClass("disabled")) {
          for (
            var i = t(e.target).data("hour"),
              a = t(e.target).parent(),
              s = a.find(".dtp-select-hour"),
              n = 0;
            n < s.length;
            n++
          )
            t(s[n]).attr("fill", "transparent");
          var r = a.find(".dtp-select-hour-text");
          for (n = 0; n < r.length; n++) t(r[n]).attr("fill", "#000");
          t(a.find("#h-" + i)).attr("fill", "#26c6da"),
            t(a.find("#th-" + i)).attr("fill", "#fff"),
            this.currentDate.hour(parseInt(i)),
            !0 === this.params.shortTime &&
              this.isPM() &&
              this.currentDate.add(12, "hours"),
            this.showTime(this.currentDate),
            this.animateHands(),
            !0 === this.params.switchOnClick &&
              setTimeout(this.initMinutes.bind(this), 200);
        }
      },
      _onSelectMinute: function (e) {
        if (!t(e.target).hasClass("disabled")) {
          for (
            var i = t(e.target).data("minute"),
              a = t(e.target).parent(),
              s = a.find(".dtp-select-minute"),
              n = 0;
            n < s.length;
            n++
          )
            t(s[n]).attr("fill", "transparent");
          var r = a.find(".dtp-select-minute-text");
          for (n = 0; n < r.length; n++) t(r[n]).attr("fill", "#000");
          t(a.find("#m-" + i)).attr("fill", "#26c6da"),
            t(a.find("#tm-" + i)).attr("fill", "#fff"),
            this.currentDate.minute(parseInt(i)),
            this.showTime(this.currentDate),
            this.animateHands(),
            !0 === this.params.switchOnClick &&
              setTimeout(
                function () {
                  this.setElementValue(), this.hide();
                }.bind(this),
                200
              );
        }
      },
      _onSelectAM: function (e) {
        t(".dtp-actual-meridien").find("a").removeClass("selected"),
          t(e.currentTarget).addClass("selected"),
          this.currentDate.hour() >= 12 &&
            this.currentDate.subtract(12, "hours") &&
            this.showTime(this.currentDate),
          this.toggleTime(1 === this.currentView);
      },
      _onSelectPM: function (e) {
        t(".dtp-actual-meridien").find("a").removeClass("selected"),
          t(e.currentTarget).addClass("selected"),
          this.currentDate.hour() < 12 &&
            this.currentDate.add(12, "hours") &&
            this.showTime(this.currentDate),
          this.toggleTime(1 === this.currentView);
      },
      _hideCalendar: function () {
        this.$dtpElement.find(".dtp-picker-calendar").addClass("hidden");
      },
      convertHours: function (t) {
        var e = t;
        return (
          !0 === this.params.shortTime && t < 12 && this.isPM() && (e += 12), e
        );
      },
      setDate: function (t) {
        (this.params.currentDate = t), this.initDates();
      },
      setMinDate: function (t) {
        (this.params.minDate = t), this.initDates();
      },
      setMaxDate: function (t) {
        (this.params.maxDate = t), this.initDates();
      },
      destroy: function () {
        this._detachEvents(), this.$dtpElement.remove();
      },
      show: function () {
        this.$dtpElement.removeClass("hidden"),
          this._attachEvent(t(window), "keydown", this._onKeydown.bind(this)),
          this._centerBox(),
          this.$element.trigger("open"),
          !0 === this.params.monthPicker && this._hideCalendar();
      },
      hide: function () {
        t(window).off("keydown", null, null, this._onKeydown.bind(this)),
          this.$dtpElement.addClass("hidden"),
          this.$element.trigger("close");
      },
      _centerBox: function () {
        var t =
          (this.$dtpElement.height() -
            this.$dtpElement.find(".dtp-content").height()) /
          2;
        this.$dtpElement
          .find(".dtp-content")
          .css(
            "marginLeft",
            -this.$dtpElement.find(".dtp-content").width() / 2 + "px"
          ),
          this.$dtpElement.find(".dtp-content").css("top", t + "px");
      },
      enableDays: function () {
        var e = this.params.enableDays;
        e &&
          t(".dtp-picker-days tbody tr td").each(function () {
            t.inArray(t(this).index(), e) >= 0 ||
              t(this)
                .find("a")
                .css({
                  background: "#e3e3e3",
                  cursor: "no-drop",
                  opacity: "0.5",
                })
                .off("click");
          });
      },
    });
})(jQuery, moment);
