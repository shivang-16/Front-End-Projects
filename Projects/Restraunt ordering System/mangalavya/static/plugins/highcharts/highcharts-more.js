/*
 Highcharts JS v6.2.0 (2018-10-17)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (A) {
  "object" === typeof module && module.exports
    ? (module.exports = A)
    : "function" === typeof define && define.amd
    ? define(function () {
        return A;
      })
    : A(Highcharts);
})(function (A) {
  (function (b) {
    function q(b, a) {
      this.init(b, a);
    }
    var v = b.CenteredSeriesMixin,
      w = b.each,
      n = b.extend,
      p = b.merge,
      y = b.splat;
    n(q.prototype, {
      coll: "pane",
      init: function (b, a) {
        this.chart = a;
        this.background = [];
        a.pane.push(this);
        this.setOptions(b);
      },
      setOptions: function (b) {
        this.options = p(
          this.defaultOptions,
          this.chart.angular ? { background: {} } : void 0,
          b
        );
      },
      render: function () {
        var b = this.options,
          a = this.options.background,
          e = this.chart.renderer;
        this.group ||
          (this.group = e
            .g("pane-group")
            .attr({ zIndex: b.zIndex || 0 })
            .add());
        this.updateCenter();
        if (a)
          for (
            a = y(a),
              b = Math.max(a.length, this.background.length || 0),
              e = 0;
            e < b;
            e++
          )
            a[e] && this.axis
              ? this.renderBackground(p(this.defaultBackgroundOptions, a[e]), e)
              : this.background[e] &&
                ((this.background[e] = this.background[e].destroy()),
                this.background.splice(e, 1));
      },
      renderBackground: function (b, a) {
        var e = "animate";
        this.background[a] ||
          ((this.background[a] = this.chart.renderer.path().add(this.group)),
          (e = "attr"));
        this.background[a][e]({
          d: this.axis.getPlotBandPath(b.from, b.to, b),
        }).attr({
          fill: b.backgroundColor,
          stroke: b.borderColor,
          "stroke-width": b.borderWidth,
          class: "highcharts-pane " + (b.className || ""),
        });
      },
      defaultOptions: { center: ["50%", "50%"], size: "85%", startAngle: 0 },
      defaultBackgroundOptions: {
        shape: "circle",
        borderWidth: 1,
        borderColor: "#cccccc",
        backgroundColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "#ffffff"],
            [1, "#e6e6e6"],
          ],
        },
        from: -Number.MAX_VALUE,
        innerRadius: 0,
        to: Number.MAX_VALUE,
        outerRadius: "105%",
      },
      updateCenter: function (b) {
        this.center = (b || this.axis || {}).center = v.getCenter.call(this);
      },
      update: function (b, a) {
        p(!0, this.options, b);
        this.setOptions(this.options);
        this.render();
        w(
          this.chart.axes,
          function (e) {
            e.pane === this && ((e.pane = null), e.update({}, a));
          },
          this
        );
      },
    });
    b.Pane = q;
  })(A);
  (function (b) {
    var q = b.addEvent,
      v = b.Axis,
      w = b.each,
      n = b.extend,
      p = b.map,
      y = b.merge,
      l = b.noop,
      a = b.pick,
      e = b.pInt,
      g = b.Tick,
      c = b.wrap,
      d = b.correctFloat,
      h,
      m,
      f = v.prototype,
      r = g.prototype;
    b.radialAxisExtended ||
      ((b.radialAxisExtended = !0),
      (h = {
        getOffset: l,
        redraw: function () {
          this.isDirty = !1;
        },
        render: function () {
          this.isDirty = !1;
        },
        setScale: l,
        setCategories: l,
        setTitle: l,
      }),
      (m = {
        defaultRadialGaugeOptions: {
          labels: { align: "center", x: 0, y: null },
          minorGridLineWidth: 0,
          minorTickInterval: "auto",
          minorTickLength: 10,
          minorTickPosition: "inside",
          minorTickWidth: 1,
          tickLength: 10,
          tickPosition: "inside",
          tickWidth: 2,
          title: { rotation: 0 },
          zIndex: 2,
        },
        defaultRadialXOptions: {
          gridLineWidth: 1,
          labels: {
            align: null,
            distance: 15,
            x: 0,
            y: null,
            style: { textOverflow: "none" },
          },
          maxPadding: 0,
          minPadding: 0,
          showLastLabel: !1,
          tickLength: 0,
        },
        defaultRadialYOptions: {
          gridLineInterpolation: "circle",
          labels: { align: "right", x: -3, y: -2 },
          showLastLabel: !1,
          title: { x: 4, text: null, rotation: 90 },
        },
        setOptions: function (a) {
          a = this.options = y(
            this.defaultOptions,
            this.defaultRadialOptions,
            a
          );
          a.plotBands || (a.plotBands = []);
          b.fireEvent(this, "afterSetOptions");
        },
        getOffset: function () {
          f.getOffset.call(this);
          this.chart.axisOffset[this.side] = 0;
        },
        getLinePath: function (c, e) {
          c = this.center;
          var g = this.chart,
            d = a(e, c[2] / 2 - this.offset);
          this.isCircular || void 0 !== e
            ? ((e = this.chart.renderer.symbols.arc(
                this.left + c[0],
                this.top + c[1],
                d,
                d,
                {
                  start: this.startAngleRad,
                  end: this.endAngleRad,
                  open: !0,
                  innerR: 0,
                }
              )),
              (e.xBounds = [this.left + c[0]]),
              (e.yBounds = [this.top + c[1] - d]))
            : ((e = this.postTranslate(this.angleRad, d)),
              (e = ["M", c[0] + g.plotLeft, c[1] + g.plotTop, "L", e.x, e.y]));
          return e;
        },
        setAxisTranslation: function () {
          f.setAxisTranslation.call(this);
          this.center &&
            ((this.transA = this.isCircular
              ? (this.endAngleRad - this.startAngleRad) /
                (this.max - this.min || 1)
              : this.center[2] / 2 / (this.max - this.min || 1)),
            (this.minPixelPadding = this.isXAxis
              ? this.transA * this.minPointOffset
              : 0));
        },
        beforeSetTickPositions: function () {
          if (
            (this.autoConnect =
              this.isCircular &&
              void 0 === a(this.userMax, this.options.max) &&
              d(this.endAngleRad - this.startAngleRad) === d(2 * Math.PI))
          )
            this.max +=
              (this.categories && 1) ||
              this.pointRange ||
              this.closestPointRange ||
              0;
        },
        setAxisSize: function () {
          f.setAxisSize.call(this);
          this.isRadial &&
            (this.pane.updateCenter(this),
            this.isCircular &&
              (this.sector = this.endAngleRad - this.startAngleRad),
            (this.len =
              this.width =
              this.height =
                (this.center[2] * a(this.sector, 1)) / 2));
        },
        getPosition: function (c, e) {
          return this.postTranslate(
            this.isCircular ? this.translate(c) : this.angleRad,
            a(this.isCircular ? e : this.translate(c), this.center[2] / 2) -
              this.offset
          );
        },
        postTranslate: function (a, c) {
          var e = this.chart,
            d = this.center;
          a = this.startAngleRad + a;
          return {
            x: e.plotLeft + d[0] + Math.cos(a) * c,
            y: e.plotTop + d[1] + Math.sin(a) * c,
          };
        },
        getPlotBandPath: function (c, d, g) {
          var h = this.center,
            b = this.startAngleRad,
            f = h[2] / 2,
            k = [a(g.outerRadius, "100%"), g.innerRadius, a(g.thickness, 10)],
            m = Math.min(this.offset, 0),
            t = /%$/,
            r,
            x = this.isCircular;
          "polygon" === this.options.gridLineInterpolation
            ? (h = this.getPlotLinePath(c).concat(this.getPlotLinePath(d, !0)))
            : ((c = Math.max(c, this.min)),
              (d = Math.min(d, this.max)),
              x || ((k[0] = this.translate(c)), (k[1] = this.translate(d))),
              (k = p(k, function (a) {
                t.test(a) && (a = (e(a, 10) * f) / 100);
                return a;
              })),
              "circle" !== g.shape && x
                ? ((c = b + this.translate(c)), (d = b + this.translate(d)))
                : ((c = -Math.PI / 2), (d = 1.5 * Math.PI), (r = !0)),
              (k[0] -= m),
              (k[2] -= m),
              (h = this.chart.renderer.symbols.arc(
                this.left + h[0],
                this.top + h[1],
                k[0],
                k[0],
                {
                  start: Math.min(c, d),
                  end: Math.max(c, d),
                  innerR: a(k[1], k[0] - k[2]),
                  open: r,
                }
              )));
          return h;
        },
        getPlotLinePath: function (a, c) {
          var d = this,
            e = d.center,
            g = d.chart,
            h = d.getPosition(a),
            b,
            f,
            k;
          d.isCircular
            ? (k = ["M", e[0] + g.plotLeft, e[1] + g.plotTop, "L", h.x, h.y])
            : "circle" === d.options.gridLineInterpolation
            ? ((a = d.translate(a)), (k = d.getLinePath(0, a)))
            : (w(g.xAxis, function (a) {
                a.pane === d.pane && (b = a);
              }),
              (k = []),
              (a = d.translate(a)),
              (e = b.tickPositions),
              b.autoConnect && (e = e.concat([e[0]])),
              c && (e = [].concat(e).reverse()),
              w(e, function (c, d) {
                f = b.getPosition(c, a);
                k.push(d ? "L" : "M", f.x, f.y);
              }));
          return k;
        },
        getTitlePosition: function () {
          var a = this.center,
            c = this.chart,
            d = this.options.title;
          return {
            x: c.plotLeft + a[0] + (d.x || 0),
            y:
              c.plotTop +
              a[1] -
              { high: 0.5, middle: 0.25, low: 0 }[d.align] * a[2] +
              (d.y || 0),
          };
        },
      }),
      q(v, "init", function (a) {
        var c = this.chart,
          d = c.angular,
          e = c.polar,
          g = this.isXAxis,
          b = d && g,
          f,
          k = c.options;
        a = a.userOptions.pane || 0;
        a = this.pane = c.pane && c.pane[a];
        if (d) {
          if ((n(this, b ? h : m), (f = !g)))
            this.defaultRadialOptions = this.defaultRadialGaugeOptions;
        } else e && (n(this, m), (this.defaultRadialOptions = (f = g) ? this.defaultRadialXOptions : y(this.defaultYAxisOptions, this.defaultRadialYOptions)));
        d || e
          ? ((this.isRadial = !0), (c.inverted = !1), (k.chart.zoomType = null))
          : (this.isRadial = !1);
        a && f && (a.axis = this);
        this.isCircular = f;
      }),
      q(v, "afterInit", function () {
        var c = this.chart,
          d = this.options,
          e = this.pane,
          g = e && e.options;
        (c.angular && this.isXAxis) ||
          !e ||
          (!c.angular && !c.polar) ||
          ((this.angleRad = ((d.angle || 0) * Math.PI) / 180),
          (this.startAngleRad = ((g.startAngle - 90) * Math.PI) / 180),
          (this.endAngleRad =
            ((a(g.endAngle, g.startAngle + 360) - 90) * Math.PI) / 180),
          (this.offset = d.offset || 0));
      }),
      c(f, "autoLabelAlign", function (a) {
        if (!this.isRadial) return a.apply(this, [].slice.call(arguments, 1));
      }),
      q(g, "afterGetPosition", function (a) {
        this.axis.getPosition && n(a.pos, this.axis.getPosition(this.pos));
      }),
      q(g, "afterGetLabelPosition", function (c) {
        var d = this.axis,
          e = this.label,
          g = d.options.labels,
          h = g.y,
          b,
          f = 20,
          m = g.align,
          k =
            (((d.translate(this.pos) + d.startAngleRad + Math.PI / 2) /
              Math.PI) *
              180) %
            360;
        d.isRadial &&
          ((b = d.getPosition(this.pos, d.center[2] / 2 + a(g.distance, -25))),
          "auto" === g.rotation
            ? e.attr({ rotation: k })
            : null === h &&
              (h =
                d.chart.renderer.fontMetrics(e.styles && e.styles.fontSize).b -
                e.getBBox().height / 2),
          null === m &&
            (d.isCircular
              ? (this.label.getBBox().width >
                  (d.len * d.tickInterval) / (d.max - d.min) && (f = 0),
                (m =
                  k > f && k < 180 - f
                    ? "left"
                    : k > 180 + f && k < 360 - f
                    ? "right"
                    : "center"))
              : (m = "center"),
            e.attr({ align: m })),
          (c.pos.x = b.x + g.x),
          (c.pos.y = b.y + h));
      }),
      c(r, "getMarkPath", function (a, d, c, e, g, h, b) {
        var f = this.axis;
        f.isRadial
          ? ((a = f.getPosition(this.pos, f.center[2] / 2 + e)),
            (d = ["M", d, c, "L", a.x, a.y]))
          : (d = a.call(this, d, c, e, g, h, b));
        return d;
      }));
  })(A);
  (function (b) {
    var q = b.each,
      v = b.pick,
      w = b.extend,
      n = b.isArray,
      p = b.defined,
      y = b.seriesType,
      l = b.seriesTypes,
      a = b.Series.prototype,
      e = b.Point.prototype;
    y(
      "arearange",
      "area",
      {
        lineWidth: 1,
        threshold: null,
        tooltip: {
          pointFormat:
            '\x3cspan style\x3d"color:{series.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e',
        },
        trackByArea: !0,
        dataLabels: {
          align: null,
          verticalAlign: null,
          xLow: 0,
          xHigh: 0,
          yLow: 0,
          yHigh: 0,
        },
      },
      {
        pointArrayMap: ["low", "high"],
        toYData: function (a) {
          return [a.low, a.high];
        },
        pointValKey: "low",
        deferTranslatePolar: !0,
        highToXY: function (a) {
          var c = this.chart,
            d = this.xAxis.postTranslate(
              a.rectPlotX,
              this.yAxis.len - a.plotHigh
            );
          a.plotHighX = d.x - c.plotLeft;
          a.plotHigh = d.y - c.plotTop;
          a.plotLowX = a.plotX;
        },
        translate: function () {
          var a = this,
            c = a.yAxis,
            d = !!a.modifyValue;
          l.area.prototype.translate.apply(a);
          q(a.points, function (e) {
            var g = e.low,
              f = e.high,
              b = e.plotY;
            null === f || null === g
              ? ((e.isNull = !0), (e.plotY = null))
              : ((e.plotLow = b),
                (e.plotHigh = c.translate(
                  d ? a.modifyValue(f, e) : f,
                  0,
                  1,
                  0,
                  1
                )),
                d && (e.yBottom = e.plotHigh));
          });
          this.chart.polar &&
            q(this.points, function (d) {
              a.highToXY(d);
              d.tooltipPos = [
                (d.plotHighX + d.plotLowX) / 2,
                (d.plotHigh + d.plotLow) / 2,
              ];
            });
        },
        getGraphPath: function (a) {
          var c = [],
            d = [],
            e,
            b = l.area.prototype.getGraphPath,
            f,
            g,
            k;
          k = this.options;
          var t = this.chart.polar && !1 !== k.connectEnds,
            x = k.connectNulls,
            z = k.step;
          a = a || this.points;
          for (e = a.length; e--; )
            (f = a[e]),
              f.isNull ||
                t ||
                x ||
                (a[e + 1] && !a[e + 1].isNull) ||
                d.push({ plotX: f.plotX, plotY: f.plotY, doCurve: !1 }),
              (g = {
                polarPlotY: f.polarPlotY,
                rectPlotX: f.rectPlotX,
                yBottom: f.yBottom,
                plotX: v(f.plotHighX, f.plotX),
                plotY: f.plotHigh,
                isNull: f.isNull,
              }),
              d.push(g),
              c.push(g),
              f.isNull ||
                t ||
                x ||
                (a[e - 1] && !a[e - 1].isNull) ||
                d.push({ plotX: f.plotX, plotY: f.plotY, doCurve: !1 });
          a = b.call(this, a);
          z &&
            (!0 === z && (z = "left"),
            (k.step = { left: "right", center: "center", right: "left" }[z]));
          c = b.call(this, c);
          d = b.call(this, d);
          k.step = z;
          k = [].concat(a, c);
          this.chart.polar || "M" !== d[0] || (d[0] = "L");
          this.graphPath = k;
          this.areaPath = a.concat(d);
          k.isArea = !0;
          k.xMap = a.xMap;
          this.areaPath.xMap = a.xMap;
          return k;
        },
        drawDataLabels: function () {
          var e = this.points,
            c = e.length,
            d,
            b = [],
            m = this.options.dataLabels,
            f,
            r,
            k = this.chart.inverted,
            t,
            x;
          n(m)
            ? 1 < m.length
              ? ((t = m[0]), (x = m[1]))
              : ((t = m[0]), (x = { enabled: !1 }))
            : ((t = w({}, m)),
              (t.x = m.xHigh),
              (t.y = m.yHigh),
              (x = w({}, m)),
              (x.x = m.xLow),
              (x.y = m.yLow));
          if (t.enabled || this._hasPointLabels) {
            for (d = c; d--; )
              if ((f = e[d]))
                (r = t.inside
                  ? f.plotHigh < f.plotLow
                  : f.plotHigh > f.plotLow),
                  (f.y = f.high),
                  (f._plotY = f.plotY),
                  (f.plotY = f.plotHigh),
                  (b[d] = f.dataLabel),
                  (f.dataLabel = f.dataLabelUpper),
                  (f.below = r),
                  k
                    ? t.align || (t.align = r ? "right" : "left")
                    : t.verticalAlign ||
                      (t.verticalAlign = r ? "top" : "bottom");
            this.options.dataLabels = t;
            a.drawDataLabels && a.drawDataLabels.apply(this, arguments);
            for (d = c; d--; )
              if ((f = e[d]))
                (f.dataLabelUpper = f.dataLabel),
                  (f.dataLabel = b[d]),
                  delete f.dataLabels,
                  (f.y = f.low),
                  (f.plotY = f._plotY);
          }
          if (x.enabled || this._hasPointLabels) {
            for (d = c; d--; )
              if ((f = e[d]))
                (r = x.inside
                  ? f.plotHigh < f.plotLow
                  : f.plotHigh > f.plotLow),
                  (f.below = !r),
                  k
                    ? x.align || (x.align = r ? "left" : "right")
                    : x.verticalAlign ||
                      (x.verticalAlign = r ? "bottom" : "top");
            this.options.dataLabels = x;
            a.drawDataLabels && a.drawDataLabels.apply(this, arguments);
          }
          if (t.enabled)
            for (d = c; d--; )
              (f = e[d]) &&
                f.dataLabelUpper &&
                (f.dataLabels = [f.dataLabelUpper, f.dataLabel]);
          this.options.dataLabels = m;
        },
        alignDataLabel: function () {
          l.column.prototype.alignDataLabel.apply(this, arguments);
        },
        drawPoints: function () {
          var e = this.points.length,
            c,
            d;
          a.drawPoints.apply(this, arguments);
          for (d = 0; d < e; )
            (c = this.points[d]),
              (c.origProps = {
                plotY: c.plotY,
                plotX: c.plotX,
                isInside: c.isInside,
                negative: c.negative,
                zone: c.zone,
                y: c.y,
              }),
              (c.lowerGraphic = c.graphic),
              (c.graphic = c.upperGraphic),
              (c.plotY = c.plotHigh),
              p(c.plotHighX) && (c.plotX = c.plotHighX),
              (c.y = c.high),
              (c.negative = c.high < (this.options.threshold || 0)),
              (c.zone = this.zones.length && c.getZone()),
              this.chart.polar ||
                (c.isInside = c.isTopInside =
                  void 0 !== c.plotY &&
                  0 <= c.plotY &&
                  c.plotY <= this.yAxis.len &&
                  0 <= c.plotX &&
                  c.plotX <= this.xAxis.len),
              d++;
          a.drawPoints.apply(this, arguments);
          for (d = 0; d < e; )
            (c = this.points[d]),
              (c.upperGraphic = c.graphic),
              (c.graphic = c.lowerGraphic),
              b.extend(c, c.origProps),
              delete c.origProps,
              d++;
        },
        setStackedPoints: b.noop,
      },
      {
        setState: function () {
          var a = this.state,
            c = this.series,
            d = c.chart.polar;
          p(this.plotHigh) || (this.plotHigh = c.yAxis.toPixels(this.high, !0));
          p(this.plotLow) ||
            (this.plotLow = this.plotY = c.yAxis.toPixels(this.low, !0));
          c.stateMarkerGraphic &&
            ((c.lowerStateMarkerGraphic = c.stateMarkerGraphic),
            (c.stateMarkerGraphic = c.upperStateMarkerGraphic));
          this.graphic = this.upperGraphic;
          this.plotY = this.plotHigh;
          d && (this.plotX = this.plotHighX);
          e.setState.apply(this, arguments);
          this.state = a;
          this.plotY = this.plotLow;
          this.graphic = this.lowerGraphic;
          d && (this.plotX = this.plotLowX);
          c.stateMarkerGraphic &&
            ((c.upperStateMarkerGraphic = c.stateMarkerGraphic),
            (c.stateMarkerGraphic = c.lowerStateMarkerGraphic),
            (c.lowerStateMarkerGraphic = void 0));
          e.setState.apply(this, arguments);
        },
        haloPath: function () {
          var a = this.series.chart.polar,
            c = [];
          this.plotY = this.plotLow;
          a && (this.plotX = this.plotLowX);
          this.isInside && (c = e.haloPath.apply(this, arguments));
          this.plotY = this.plotHigh;
          a && (this.plotX = this.plotHighX);
          this.isTopInside && (c = c.concat(e.haloPath.apply(this, arguments)));
          return c;
        },
        destroyElements: function () {
          q(
            ["lowerGraphic", "upperGraphic"],
            function (a) {
              this[a] && (this[a] = this[a].destroy());
            },
            this
          );
          this.graphic = null;
          return e.destroyElements.apply(this, arguments);
        },
      }
    );
  })(A);
  (function (b) {
    var q = b.seriesType;
    q("areasplinerange", "arearange", null, {
      getPointSpline: b.seriesTypes.spline.prototype.getPointSpline,
    });
  })(A);
  (function (b) {
    var q = b.defaultPlotOptions,
      v = b.each,
      w = b.merge,
      n = b.noop,
      p = b.pick,
      y = b.seriesType,
      l = b.seriesTypes.column.prototype;
    y(
      "columnrange",
      "arearange",
      w(q.column, q.arearange, {
        pointRange: null,
        marker: null,
        states: { hover: { halo: !1 } },
      }),
      {
        translate: function () {
          var a = this,
            e = a.yAxis,
            b = a.xAxis,
            c = b.startAngleRad,
            d,
            h = a.chart,
            m = a.xAxis.isRadial,
            f = Math.max(h.chartWidth, h.chartHeight) + 999,
            r;
          l.translate.apply(a);
          v(a.points, function (g) {
            var k = g.shapeArgs,
              x = a.options.minPointLength,
              z,
              l;
            g.plotHigh = r = Math.min(
              Math.max(-f, e.translate(g.high, 0, 1, 0, 1)),
              f
            );
            g.plotLow = Math.min(Math.max(-f, g.plotY), f);
            l = r;
            z = p(g.rectPlotY, g.plotY) - r;
            Math.abs(z) < x
              ? ((x -= z), (z += x), (l -= x / 2))
              : 0 > z && ((z *= -1), (l -= z));
            m
              ? ((d = g.barX + c),
                (g.shapeType = "path"),
                (g.shapeArgs = {
                  d: a.polarArc(l + z, l, d, d + g.pointWidth),
                }))
              : ((k.height = z),
                (k.y = l),
                (g.tooltipPos = h.inverted
                  ? [
                      e.len + e.pos - h.plotLeft - l - z / 2,
                      b.len + b.pos - h.plotTop - k.x - k.width / 2,
                      z,
                    ]
                  : [
                      b.left - h.plotLeft + k.x + k.width / 2,
                      e.pos - h.plotTop + l + z / 2,
                      z,
                    ]));
          });
        },
        directTouch: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        drawGraph: n,
        getSymbol: n,
        crispCol: l.crispCol,
        drawPoints: l.drawPoints,
        drawTracker: l.drawTracker,
        getColumnMetrics: l.getColumnMetrics,
        pointAttribs: l.pointAttribs,
        animate: function () {
          return l.animate.apply(this, arguments);
        },
        polarArc: function () {
          return l.polarArc.apply(this, arguments);
        },
        translate3dPoints: function () {
          return l.translate3dPoints.apply(this, arguments);
        },
        translate3dShapes: function () {
          return l.translate3dShapes.apply(this, arguments);
        },
      },
      { setState: l.pointClass.prototype.setState }
    );
  })(A);
  (function (b) {
    var q = b.each,
      v = b.isNumber,
      w = b.merge,
      n = b.pick,
      p = b.pInt,
      y = b.Series,
      l = b.seriesType,
      a = b.TrackerMixin;
    l(
      "gauge",
      "line",
      {
        dataLabels: {
          enabled: !0,
          defer: !1,
          y: 15,
          borderRadius: 3,
          crop: !1,
          verticalAlign: "top",
          zIndex: 2,
          borderWidth: 1,
          borderColor: "#cccccc",
        },
        dial: {},
        pivot: {},
        tooltip: { headerFormat: "" },
        showInLegend: !1,
      },
      {
        angular: !0,
        directTouch: !0,
        drawGraph: b.noop,
        fixedBox: !0,
        forceDL: !0,
        noSharedTooltip: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        translate: function () {
          var a = this.yAxis,
            b = this.options,
            c = a.center;
          this.generatePoints();
          q(this.points, function (d) {
            var e = w(b.dial, d.dial),
              g = (p(n(e.radius, 80)) * c[2]) / 200,
              f = (p(n(e.baseLength, 70)) * g) / 100,
              r = (p(n(e.rearLength, 10)) * g) / 100,
              k = e.baseWidth || 3,
              t = e.topWidth || 1,
              x = b.overshoot,
              l = a.startAngleRad + a.translate(d.y, null, null, null, !0);
            v(x)
              ? ((x = (x / 180) * Math.PI),
                (l = Math.max(
                  a.startAngleRad - x,
                  Math.min(a.endAngleRad + x, l)
                )))
              : !1 === b.wrap &&
                (l = Math.max(a.startAngleRad, Math.min(a.endAngleRad, l)));
            l = (180 * l) / Math.PI;
            d.shapeType = "path";
            d.shapeArgs = {
              d: e.path || [
                "M",
                -r,
                -k / 2,
                "L",
                f,
                -k / 2,
                g,
                -t / 2,
                g,
                t / 2,
                f,
                k / 2,
                -r,
                k / 2,
                "z",
              ],
              translateX: c[0],
              translateY: c[1],
              rotation: l,
            };
            d.plotX = c[0];
            d.plotY = c[1];
          });
        },
        drawPoints: function () {
          var a = this,
            b = a.yAxis.center,
            c = a.pivot,
            d = a.options,
            h = d.pivot,
            m = a.chart.renderer;
          q(a.points, function (e) {
            var c = e.graphic,
              b = e.shapeArgs,
              f = b.d,
              g = w(d.dial, e.dial);
            c
              ? (c.animate(b), (b.d = f))
              : ((e.graphic = m[e.shapeType](b)
                  .attr({ rotation: b.rotation, zIndex: 1 })
                  .addClass("highcharts-dial")
                  .add(a.group)),
                e.graphic.attr({
                  stroke: g.borderColor || "none",
                  "stroke-width": g.borderWidth || 0,
                  fill: g.backgroundColor || "#000000",
                }));
          });
          c
            ? c.animate({ translateX: b[0], translateY: b[1] })
            : ((a.pivot = m
                .circle(0, 0, n(h.radius, 5))
                .attr({ zIndex: 2 })
                .addClass("highcharts-pivot")
                .translate(b[0], b[1])
                .add(a.group)),
              a.pivot.attr({
                "stroke-width": h.borderWidth || 0,
                stroke: h.borderColor || "#cccccc",
                fill: h.backgroundColor || "#000000",
              }));
        },
        animate: function (a) {
          var e = this;
          a ||
            (q(e.points, function (a) {
              var d = a.graphic;
              d &&
                (d.attr({ rotation: (180 * e.yAxis.startAngleRad) / Math.PI }),
                d.animate(
                  { rotation: a.shapeArgs.rotation },
                  e.options.animation
                ));
            }),
            (e.animate = null));
        },
        render: function () {
          this.group = this.plotGroup(
            "group",
            "series",
            this.visible ? "visible" : "hidden",
            this.options.zIndex,
            this.chart.seriesGroup
          );
          y.prototype.render.call(this);
          this.group.clip(this.chart.clipRect);
        },
        setData: function (a, b) {
          y.prototype.setData.call(this, a, !1);
          this.processData();
          this.generatePoints();
          n(b, !0) && this.chart.redraw();
        },
        drawTracker: a && a.drawTrackerPoint,
      },
      {
        setState: function (a) {
          this.state = a;
        },
      }
    );
  })(A);
  (function (b) {
    var q = b.each,
      v = b.noop,
      w = b.pick,
      n = b.seriesType,
      p = b.seriesTypes;
    n(
      "boxplot",
      "column",
      {
        threshold: null,
        tooltip: {
          pointFormat:
            '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e \x3cb\x3e {series.name}\x3c/b\x3e\x3cbr/\x3eMaximum: {point.high}\x3cbr/\x3eUpper quartile: {point.q3}\x3cbr/\x3eMedian: {point.median}\x3cbr/\x3eLower quartile: {point.q1}\x3cbr/\x3eMinimum: {point.low}\x3cbr/\x3e',
        },
        whiskerLength: "50%",
        fillColor: "#ffffff",
        lineWidth: 1,
        medianWidth: 2,
        whiskerWidth: 2,
      },
      {
        pointArrayMap: ["low", "q1", "median", "q3", "high"],
        toYData: function (b) {
          return [b.low, b.q1, b.median, b.q3, b.high];
        },
        pointValKey: "high",
        pointAttribs: function () {
          return {};
        },
        drawDataLabels: v,
        translate: function () {
          var b = this.yAxis,
            l = this.pointArrayMap;
          p.column.prototype.translate.apply(this);
          q(this.points, function (a) {
            q(l, function (e) {
              null !== a[e] && (a[e + "Plot"] = b.translate(a[e], 0, 1, 0, 1));
            });
          });
        },
        drawPoints: function () {
          var b = this,
            l = b.options,
            a = b.chart.renderer,
            e,
            g,
            c,
            d,
            h,
            m,
            f = 0,
            r,
            k,
            t,
            x,
            p = !1 !== b.doQuartiles,
            n,
            v = b.options.whiskerLength;
          q(b.points, function (u) {
            var z = u.graphic,
              q = z ? "animate" : "attr",
              y = u.shapeArgs,
              A = {},
              B = {},
              I = {},
              J = {},
              C = u.color || b.color;
            void 0 !== u.plotY &&
              ((r = y.width),
              (k = Math.floor(y.x)),
              (t = k + r),
              (x = Math.round(r / 2)),
              (e = Math.floor(p ? u.q1Plot : u.lowPlot)),
              (g = Math.floor(p ? u.q3Plot : u.lowPlot)),
              (c = Math.floor(u.highPlot)),
              (d = Math.floor(u.lowPlot)),
              z ||
                ((u.graphic = z = a.g("point").add(b.group)),
                (u.stem = a.path().addClass("highcharts-boxplot-stem").add(z)),
                v &&
                  (u.whiskers = a
                    .path()
                    .addClass("highcharts-boxplot-whisker")
                    .add(z)),
                p &&
                  (u.box = a
                    .path(void 0)
                    .addClass("highcharts-boxplot-box")
                    .add(z)),
                (u.medianShape = a
                  .path(void 0)
                  .addClass("highcharts-boxplot-median")
                  .add(z))),
              (B.stroke = u.stemColor || l.stemColor || C),
              (B["stroke-width"] = w(u.stemWidth, l.stemWidth, l.lineWidth)),
              (B.dashstyle = u.stemDashStyle || l.stemDashStyle),
              u.stem.attr(B),
              v &&
                ((I.stroke = u.whiskerColor || l.whiskerColor || C),
                (I["stroke-width"] = w(
                  u.whiskerWidth,
                  l.whiskerWidth,
                  l.lineWidth
                )),
                u.whiskers.attr(I)),
              p &&
                ((A.fill = u.fillColor || l.fillColor || C),
                (A.stroke = l.lineColor || C),
                (A["stroke-width"] = l.lineWidth || 0),
                u.box.attr(A)),
              (J.stroke = u.medianColor || l.medianColor || C),
              (J["stroke-width"] = w(
                u.medianWidth,
                l.medianWidth,
                l.lineWidth
              )),
              u.medianShape.attr(J),
              (m = (u.stem.strokeWidth() % 2) / 2),
              (f = k + x + m),
              u.stem[q]({ d: ["M", f, g, "L", f, c, "M", f, e, "L", f, d] }),
              p &&
                ((m = (u.box.strokeWidth() % 2) / 2),
                (e = Math.floor(e) + m),
                (g = Math.floor(g) + m),
                (k += m),
                (t += m),
                u.box[q]({
                  d: [
                    "M",
                    k,
                    g,
                    "L",
                    k,
                    e,
                    "L",
                    t,
                    e,
                    "L",
                    t,
                    g,
                    "L",
                    k,
                    g,
                    "z",
                  ],
                })),
              v &&
                ((m = (u.whiskers.strokeWidth() % 2) / 2),
                (c += m),
                (d += m),
                (n = /%$/.test(v) ? (x * parseFloat(v)) / 100 : v / 2),
                u.whiskers[q]({
                  d: [
                    "M",
                    f - n,
                    c,
                    "L",
                    f + n,
                    c,
                    "M",
                    f - n,
                    d,
                    "L",
                    f + n,
                    d,
                  ],
                })),
              (h = Math.round(u.medianPlot)),
              (m = (u.medianShape.strokeWidth() % 2) / 2),
              (h += m),
              u.medianShape[q]({ d: ["M", k, h, "L", t, h] }));
          });
        },
        setStackedPoints: v,
      }
    );
  })(A);
  (function (b) {
    var q = b.each,
      v = b.noop,
      w = b.seriesType,
      n = b.seriesTypes;
    w(
      "errorbar",
      "boxplot",
      {
        color: "#000000",
        grouping: !1,
        linkedTo: ":previous",
        tooltip: {
          pointFormat:
            '\x3cspan style\x3d"color:{point.color}"\x3e\u25cf\x3c/span\x3e {series.name}: \x3cb\x3e{point.low}\x3c/b\x3e - \x3cb\x3e{point.high}\x3c/b\x3e\x3cbr/\x3e',
        },
        whiskerWidth: null,
      },
      {
        type: "errorbar",
        pointArrayMap: ["low", "high"],
        toYData: function (b) {
          return [b.low, b.high];
        },
        pointValKey: "high",
        doQuartiles: !1,
        drawDataLabels: n.arearange
          ? function () {
              var b = this.pointValKey;
              n.arearange.prototype.drawDataLabels.call(this);
              q(this.data, function (n) {
                n.y = n[b];
              });
            }
          : v,
        getColumnMetrics: function () {
          return (
            (this.linkedParent && this.linkedParent.columnMetrics) ||
            n.column.prototype.getColumnMetrics.call(this)
          );
        },
      }
    );
  })(A);
  (function (b) {
    var q = b.correctFloat,
      v = b.isNumber,
      w = b.pick,
      n = b.Point,
      p = b.Series,
      y = b.seriesType,
      l = b.seriesTypes;
    y(
      "waterfall",
      "column",
      {
        dataLabels: { inside: !0 },
        lineWidth: 1,
        lineColor: "#333333",
        dashStyle: "dot",
        borderColor: "#333333",
        states: { hover: { lineWidthPlus: 0 } },
      },
      {
        pointValKey: "y",
        showLine: !0,
        generatePoints: function () {
          var a = this.options.threshold,
            e,
            b,
            c,
            d;
          l.column.prototype.generatePoints.apply(this);
          c = 0;
          for (b = this.points.length; c < b; c++)
            (e = this.points[c]),
              (d = this.processedYData[c]),
              e.isSum
                ? (e.y = q(d))
                : e.isIntermediateSum && ((e.y = q(d - a)), (a = d));
        },
        translate: function () {
          var a = this.options,
            e = this.yAxis,
            b,
            c,
            d,
            h,
            m,
            f,
            r,
            k,
            t,
            n,
            p = w(a.minPointLength, 5),
            q = p / 2,
            v = a.threshold,
            u = a.stacking,
            y;
          l.column.prototype.translate.apply(this);
          k = t = v;
          c = this.points;
          b = 0;
          for (a = c.length; b < a; b++)
            (d = c[b]),
              (r = this.processedYData[b]),
              (h = d.shapeArgs),
              (m =
                u &&
                e.stacks[(this.negStacks && r < v ? "-" : "") + this.stackKey]),
              (y = this.getStackIndicator(y, d.x, this.index)),
              (n = w(m && m[d.x].points[y.key], [0, r])),
              (f = Math.max(k, k + d.y) + n[0]),
              (h.y = e.translate(f, 0, 1, 0, 1)),
              d.isSum
                ? ((h.y = e.translate(n[1], 0, 1, 0, 1)),
                  (h.height =
                    Math.min(e.translate(n[0], 0, 1, 0, 1), e.len) - h.y))
                : d.isIntermediateSum
                ? ((h.y = e.translate(n[1], 0, 1, 0, 1)),
                  (h.height =
                    Math.min(e.translate(t, 0, 1, 0, 1), e.len) - h.y),
                  (t = n[1]))
                : ((h.height =
                    0 < r
                      ? e.translate(k, 0, 1, 0, 1) - h.y
                      : e.translate(k, 0, 1, 0, 1) -
                        e.translate(k - r, 0, 1, 0, 1)),
                  (k += m && m[d.x] ? m[d.x].total : r),
                  (d.below = k < w(v, 0))),
              0 > h.height && ((h.y += h.height), (h.height *= -1)),
              (d.plotY = h.y = Math.round(h.y) - (this.borderWidth % 2) / 2),
              (h.height = Math.max(Math.round(h.height), 0.001)),
              (d.yBottom = h.y + h.height),
              h.height <= p && !d.isNull
                ? ((h.height = p),
                  (h.y -= q),
                  (d.plotY = h.y),
                  (d.minPointLengthOffset = 0 > d.y ? -q : q))
                : (d.isNull && (h.width = 0), (d.minPointLengthOffset = 0)),
              (h = d.plotY + (d.negative ? h.height : 0)),
              this.chart.inverted
                ? (d.tooltipPos[0] = e.len - h)
                : (d.tooltipPos[1] = h);
        },
        processData: function (a) {
          var e = this.yData,
            b = this.options.data,
            c,
            d = e.length,
            h,
            m,
            f,
            r,
            k,
            t;
          m = h = f = r = this.options.threshold || 0;
          for (t = 0; t < d; t++)
            (k = e[t]),
              (c = b && b[t] ? b[t] : {}),
              "sum" === k || c.isSum
                ? (e[t] = q(m))
                : "intermediateSum" === k || c.isIntermediateSum
                ? (e[t] = q(h))
                : ((m += k), (h += k)),
              (f = Math.min(m, f)),
              (r = Math.max(m, r));
          p.prototype.processData.call(this, a);
          this.options.stacking || ((this.dataMin = f), (this.dataMax = r));
        },
        toYData: function (a) {
          return a.isSum
            ? 0 === a.x
              ? null
              : "sum"
            : a.isIntermediateSum
            ? 0 === a.x
              ? null
              : "intermediateSum"
            : a.y;
        },
        pointAttribs: function (a, b) {
          var e = this.options.upColor;
          e && !a.options.color && (a.color = 0 < a.y ? e : null);
          a = l.column.prototype.pointAttribs.call(this, a, b);
          delete a.dashstyle;
          return a;
        },
        getGraphPath: function () {
          return ["M", 0, 0];
        },
        getCrispPath: function () {
          var a = this.data,
            b = a.length,
            g = this.graph.strokeWidth() + this.borderWidth,
            g = (Math.round(g) % 2) / 2,
            c = this.xAxis.reversed,
            d = this.yAxis.reversed,
            h = [],
            m,
            f,
            r;
          for (r = 1; r < b; r++) {
            f = a[r].shapeArgs;
            m = a[r - 1].shapeArgs;
            f = [
              "M",
              m.x + (c ? 0 : m.width),
              m.y + a[r - 1].minPointLengthOffset + g,
              "L",
              f.x + (c ? m.width : 0),
              m.y + a[r - 1].minPointLengthOffset + g,
            ];
            if ((0 > a[r - 1].y && !d) || (0 < a[r - 1].y && d))
              (f[2] += m.height), (f[5] += m.height);
            h = h.concat(f);
          }
          return h;
        },
        drawGraph: function () {
          p.prototype.drawGraph.call(this);
          this.graph.attr({ d: this.getCrispPath() });
        },
        setStackedPoints: function () {
          var a = this.options,
            b,
            g;
          p.prototype.setStackedPoints.apply(this, arguments);
          b = this.stackedYData ? this.stackedYData.length : 0;
          for (g = 1; g < b; g++)
            a.data[g].isSum ||
              a.data[g].isIntermediateSum ||
              (this.stackedYData[g] += this.stackedYData[g - 1]);
        },
        getExtremes: function () {
          if (this.options.stacking)
            return p.prototype.getExtremes.apply(this, arguments);
        },
      },
      {
        getClassName: function () {
          var a = n.prototype.getClassName.call(this);
          this.isSum
            ? (a += " highcharts-sum")
            : this.isIntermediateSum && (a += " highcharts-intermediate-sum");
          return a;
        },
        isValid: function () {
          return v(this.y, !0) || this.isSum || this.isIntermediateSum;
        },
      }
    );
  })(A);
  (function (b) {
    var q = b.Series,
      v = b.seriesType,
      w = b.seriesTypes;
    v(
      "polygon",
      "scatter",
      {
        marker: { enabled: !1, states: { hover: { enabled: !1 } } },
        stickyTracking: !1,
        tooltip: { followPointer: !0, pointFormat: "" },
        trackByArea: !0,
      },
      {
        type: "polygon",
        getGraphPath: function () {
          for (
            var b = q.prototype.getGraphPath.call(this), p = b.length + 1;
            p--;

          )
            (p === b.length || "M" === b[p]) && 0 < p && b.splice(p, 0, "z");
          return (this.areaPath = b);
        },
        drawGraph: function () {
          this.options.fillColor = this.color;
          w.area.prototype.drawGraph.call(this);
        },
        drawLegendSymbol: b.LegendSymbolMixin.drawRectangle,
        drawTracker: q.prototype.drawTracker,
        setStackedPoints: b.noop,
      }
    );
  })(A);
  (function (b) {
    var q = b.arrayMax,
      v = b.arrayMin,
      w = b.Axis,
      n = b.color,
      p = b.each,
      y = b.isNumber,
      l = b.noop,
      a = b.pick,
      e = b.pInt,
      g = b.Point,
      c = b.Series,
      d = b.seriesType,
      h = b.seriesTypes;
    d(
      "bubble",
      "scatter",
      {
        dataLabels: {
          formatter: function () {
            return this.point.z;
          },
          inside: !0,
          verticalAlign: "middle",
        },
        animationLimit: 250,
        marker: {
          lineColor: null,
          lineWidth: 1,
          fillOpacity: 0.5,
          radius: null,
          states: { hover: { radiusPlus: 0 } },
          symbol: "circle",
        },
        minSize: 8,
        maxSize: "20%",
        softThreshold: !1,
        states: { hover: { halo: { size: 5 } } },
        tooltip: { pointFormat: "({point.x}, {point.y}), Size: {point.z}" },
        turboThreshold: 0,
        zThreshold: 0,
        zoneAxis: "z",
      },
      {
        pointArrayMap: ["y", "z"],
        parallelArrays: ["x", "y", "z"],
        trackerGroups: ["group", "dataLabelsGroup"],
        specialGroup: "group",
        bubblePadding: !0,
        zoneAxis: "z",
        directTouch: !0,
        pointAttribs: function (a, b) {
          var d = this.options.marker.fillOpacity;
          a = c.prototype.pointAttribs.call(this, a, b);
          1 !== d && (a.fill = n(a.fill).setOpacity(d).get("rgba"));
          return a;
        },
        getRadii: function (a, b, d, e) {
          var c,
            f,
            g,
            h = this.zData,
            m = [],
            k = this.options,
            r = "width" !== k.sizeBy,
            l = k.zThreshold,
            n = b - a;
          f = 0;
          for (c = h.length; f < c; f++)
            (g = h[f]),
              k.sizeByAbsoluteValue &&
                null !== g &&
                ((g = Math.abs(g - l)),
                (b = n = Math.max(b - l, Math.abs(a - l))),
                (a = 0)),
              y(g)
                ? g < a
                  ? (g = d / 2 - 1)
                  : ((g = 0 < n ? (g - a) / n : 0.5),
                    r && 0 <= g && (g = Math.sqrt(g)),
                    (g = Math.ceil(d + g * (e - d)) / 2))
                : (g = null),
              m.push(g);
          this.radii = m;
        },
        animate: function (a) {
          !a &&
            this.points.length < this.options.animationLimit &&
            (p(
              this.points,
              function (a) {
                var b = a.graphic,
                  d;
                b &&
                  b.width &&
                  ((d = { x: b.x, y: b.y, width: b.width, height: b.height }),
                  b.attr({ x: a.plotX, y: a.plotY, width: 1, height: 1 }),
                  b.animate(d, this.options.animation));
              },
              this
            ),
            (this.animate = null));
        },
        translate: function () {
          var a,
            d = this.data,
            e,
            c,
            g = this.radii;
          h.scatter.prototype.translate.call(this);
          for (a = d.length; a--; )
            (e = d[a]),
              (c = g ? g[a] : 0),
              y(c) && c >= this.minPxSize / 2
                ? ((e.marker = b.extend(e.marker, {
                    radius: c,
                    width: 2 * c,
                    height: 2 * c,
                  })),
                  (e.dlBox = {
                    x: e.plotX - c,
                    y: e.plotY - c,
                    width: 2 * c,
                    height: 2 * c,
                  }))
                : (e.shapeArgs = e.plotY = e.dlBox = void 0);
        },
        alignDataLabel: h.column.prototype.alignDataLabel,
        buildKDTree: l,
        applyZones: l,
      },
      {
        haloPath: function (a) {
          return g.prototype.haloPath.call(
            this,
            0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a
          );
        },
        ttBelow: !1,
      }
    );
    w.prototype.beforePadding = function () {
      var d = this,
        c = this.len,
        g = this.chart,
        h = 0,
        l = c,
        n = this.isXAxis,
        w = n ? "xData" : "yData",
        A = this.min,
        B = {},
        u = Math.min(g.plotWidth, g.plotHeight),
        E = Number.MAX_VALUE,
        F = -Number.MAX_VALUE,
        G = this.max - A,
        D = c / G,
        H = [];
      p(this.series, function (c) {
        var f = c.options;
        !c.bubblePadding ||
          (!c.visible && g.options.chart.ignoreHiddenSeries) ||
          ((d.allowZoomOutside = !0),
          H.push(c),
          n &&
            (p(["minSize", "maxSize"], function (a) {
              var b = f[a],
                c = /%$/.test(b),
                b = e(b);
              B[a] = c ? (u * b) / 100 : b;
            }),
            (c.minPxSize = B.minSize),
            (c.maxPxSize = Math.max(B.maxSize, B.minSize)),
            (c = b.grep(c.zData, b.isNumber)),
            c.length &&
              ((E = a(
                f.zMin,
                Math.min(
                  E,
                  Math.max(
                    v(c),
                    !1 === f.displayNegative ? f.zThreshold : -Number.MAX_VALUE
                  )
                )
              )),
              (F = a(f.zMax, Math.max(F, q(c)))))));
      });
      p(H, function (a) {
        var b = a[w],
          c = b.length,
          e;
        n && a.getRadii(E, F, a.minPxSize, a.maxPxSize);
        if (0 < G)
          for (; c--; )
            y(b[c]) &&
              d.dataMin <= b[c] &&
              b[c] <= d.dataMax &&
              ((e = a.radii[c]),
              (h = Math.min((b[c] - A) * D - e, h)),
              (l = Math.max((b[c] - A) * D + e, l)));
      });
      H.length &&
        0 < G &&
        !this.isLog &&
        ((l -= c),
        (D *= (c + Math.max(0, h) - Math.min(l, c)) / c),
        p(
          [
            ["min", "userMin", h],
            ["max", "userMax", l],
          ],
          function (b) {
            void 0 === a(d.options[b[0]], d[b[1]]) && (d[b[0]] += b[2] / D);
          }
        ));
    };
  })(A);
  (function (b) {
    var q = b.each,
      v = b.pick,
      w = b.Series,
      n = b.seriesTypes,
      p = b.wrap,
      y = w.prototype,
      l = b.Pointer.prototype;
    b.polarExtended ||
      ((b.polarExtended = !0),
      (y.searchPointByAngle = function (a) {
        var b = this.chart,
          g = this.xAxis.pane.center;
        return this.searchKDTree({
          clientX:
            180 +
            (-180 / Math.PI) *
              Math.atan2(
                a.chartX - g[0] - b.plotLeft,
                a.chartY - g[1] - b.plotTop
              ),
        });
      }),
      (y.getConnectors = function (a, b, g, c) {
        var d, e, m, f, l, k, n, p;
        e = c ? 1 : 0;
        d = 0 <= b && b <= a.length - 1 ? b : 0 > b ? a.length - 1 + b : 0;
        b = 0 > d - 1 ? a.length - (1 + e) : d - 1;
        e = d + 1 > a.length - 1 ? e : d + 1;
        m = a[b];
        e = a[e];
        f = m.plotX;
        m = m.plotY;
        l = e.plotX;
        k = e.plotY;
        e = a[d].plotX;
        d = a[d].plotY;
        f = (1.5 * e + f) / 2.5;
        m = (1.5 * d + m) / 2.5;
        l = (1.5 * e + l) / 2.5;
        n = (1.5 * d + k) / 2.5;
        k = Math.sqrt(Math.pow(f - e, 2) + Math.pow(m - d, 2));
        p = Math.sqrt(Math.pow(l - e, 2) + Math.pow(n - d, 2));
        f = Math.atan2(m - d, f - e);
        n = Math.PI / 2 + (f + Math.atan2(n - d, l - e)) / 2;
        Math.abs(f - n) > Math.PI / 2 && (n -= Math.PI);
        f = e + Math.cos(n) * k;
        m = d + Math.sin(n) * k;
        l = e + Math.cos(Math.PI + n) * p;
        n = d + Math.sin(Math.PI + n) * p;
        e = {
          rightContX: l,
          rightContY: n,
          leftContX: f,
          leftContY: m,
          plotX: e,
          plotY: d,
        };
        g && (e.prevPointCont = this.getConnectors(a, b, !1, c));
        return e;
      }),
      p(y, "buildKDTree", function (a) {
        this.chart.polar &&
          (this.kdByAngle
            ? (this.searchPoint = this.searchPointByAngle)
            : (this.options.findNearestPointBy = "xy"));
        a.apply(this);
      }),
      (y.toXY = function (a) {
        var b,
          g = this.chart,
          c = a.plotX;
        b = a.plotY;
        a.rectPlotX = c;
        a.rectPlotY = b;
        b = this.xAxis.postTranslate(a.plotX, this.yAxis.len - b);
        a.plotX = a.polarPlotX = b.x - g.plotLeft;
        a.plotY = a.polarPlotY = b.y - g.plotTop;
        this.kdByAngle
          ? ((g =
              ((c / Math.PI) * 180 + this.xAxis.pane.options.startAngle) % 360),
            0 > g && (g += 360),
            (a.clientX = g))
          : (a.clientX = a.plotX);
      }),
      n.spline &&
        (p(n.spline.prototype, "getPointSpline", function (a, b, g, c) {
          this.chart.polar
            ? c
              ? ((a = this.getConnectors(b, c, !0, this.connectEnds)),
                (a = [
                  "C",
                  a.prevPointCont.rightContX,
                  a.prevPointCont.rightContY,
                  a.leftContX,
                  a.leftContY,
                  a.plotX,
                  a.plotY,
                ]))
              : (a = ["M", g.plotX, g.plotY])
            : (a = a.call(this, b, g, c));
          return a;
        }),
        n.areasplinerange &&
          (n.areasplinerange.prototype.getPointSpline =
            n.spline.prototype.getPointSpline)),
      b.addEvent(
        w,
        "afterTranslate",
        function () {
          var a = this.chart,
            e,
            g;
          if (a.polar) {
            this.kdByAngle = a.tooltip && a.tooltip.shared;
            if (!this.preventPostTranslate)
              for (e = this.points, g = e.length; g--; ) this.toXY(e[g]);
            this.hasClipCircleSetter ||
              (this.hasClipCircleSetter = !!b.addEvent(
                this,
                "afterRender",
                function () {
                  var c;
                  a.polar &&
                    ((c = this.yAxis.center),
                    this.group.clip(
                      a.renderer.clipCircle(c[0], c[1], c[2] / 2)
                    ),
                    (this.setClip = b.noop));
                }
              ));
          }
        },
        { order: 2 }
      ),
      p(y, "getGraphPath", function (a, b) {
        var e = this,
          c,
          d,
          h;
        if (this.chart.polar) {
          b = b || this.points;
          for (c = 0; c < b.length; c++)
            if (!b[c].isNull) {
              d = c;
              break;
            }
          !1 !== this.options.connectEnds &&
            void 0 !== d &&
            ((this.connectEnds = !0), b.splice(b.length, 0, b[d]), (h = !0));
          q(b, function (a) {
            void 0 === a.polarPlotY && e.toXY(a);
          });
        }
        c = a.apply(this, [].slice.call(arguments, 1));
        h && b.pop();
        return c;
      }),
      (w = function (a, b) {
        var e = this.chart,
          c = this.options.animation,
          d = this.group,
          h = this.markerGroup,
          m = this.xAxis.center,
          f = e.plotLeft,
          l = e.plotTop;
        e.polar
          ? e.renderer.isSVG &&
            (!0 === c && (c = {}),
            b
              ? ((a = {
                  translateX: m[0] + f,
                  translateY: m[1] + l,
                  scaleX: 0.001,
                  scaleY: 0.001,
                }),
                d.attr(a),
                h && h.attr(a))
              : ((a = { translateX: f, translateY: l, scaleX: 1, scaleY: 1 }),
                d.animate(a, c),
                h && h.animate(a, c),
                (this.animate = null)))
          : a.call(this, b);
      }),
      p(y, "animate", w),
      n.column &&
        ((n = n.column.prototype),
        (n.polarArc = function (a, b, g, c) {
          var d = this.xAxis.center,
            e = this.yAxis.len;
          return this.chart.renderer.symbols.arc(d[0], d[1], e - b, null, {
            start: g,
            end: c,
            innerR: e - v(a, e),
          });
        }),
        p(n, "animate", w),
        p(n, "translate", function (a) {
          var b = this.xAxis,
            g = b.startAngleRad,
            c,
            d,
            h;
          this.preventPostTranslate = !0;
          a.call(this);
          if (b.isRadial)
            for (c = this.points, h = c.length; h--; )
              (d = c[h]),
                (a = d.barX + g),
                (d.shapeType = "path"),
                (d.shapeArgs = {
                  d: this.polarArc(d.yBottom, d.plotY, a, a + d.pointWidth),
                }),
                this.toXY(d),
                (d.tooltipPos = [d.plotX, d.plotY]),
                (d.ttBelow = d.plotY > b.center[1]);
        }),
        p(n, "alignDataLabel", function (a, b, g, c, d, h) {
          this.chart.polar
            ? ((a = (b.rectPlotX / Math.PI) * 180),
              null === c.align &&
                (c.align =
                  20 < a && 160 > a
                    ? "left"
                    : 200 < a && 340 > a
                    ? "right"
                    : "center"),
              null === c.verticalAlign &&
                (c.verticalAlign =
                  45 > a || 315 < a
                    ? "bottom"
                    : 135 < a && 225 > a
                    ? "top"
                    : "middle"),
              y.alignDataLabel.call(this, b, g, c, d, h))
            : a.call(this, b, g, c, d, h);
        })),
      p(l, "getCoordinates", function (a, b) {
        var e = this.chart,
          c = { xAxis: [], yAxis: [] };
        e.polar
          ? q(e.axes, function (a) {
              var d = a.isXAxis,
                g = a.center,
                f = b.chartX - g[0] - e.plotLeft,
                g = b.chartY - g[1] - e.plotTop;
              c[d ? "xAxis" : "yAxis"].push({
                axis: a,
                value: a.translate(
                  d
                    ? Math.PI - Math.atan2(f, g)
                    : Math.sqrt(Math.pow(f, 2) + Math.pow(g, 2)),
                  !0
                ),
              });
            })
          : (c = a.call(this, b));
        return c;
      }),
      (b.SVGRenderer.prototype.clipCircle = function (a, e, g) {
        var c = b.uniqueKey(),
          d = this.createElement("clipPath").attr({ id: c }).add(this.defs);
        a = this.circle(a, e, g).add(d);
        a.id = c;
        a.clipPath = d;
        return a;
      }),
      b.addEvent(b.Chart, "getAxes", function () {
        this.pane || (this.pane = []);
        q(
          b.splat(this.options.pane),
          function (a) {
            new b.Pane(a, this);
          },
          this
        );
      }),
      b.addEvent(b.Chart, "afterDrawChartBox", function () {
        q(this.pane, function (a) {
          a.render();
        });
      }),
      p(b.Chart.prototype, "get", function (a, e) {
        return (
          b.find(this.pane, function (a) {
            return a.options.id === e;
          }) || a.call(this, e)
        );
      }));
  })(A);
});
//# sourceMappingURL=highcharts-more.js.map
