! function () {
    window.turnsocial_has_run = !1;
    var t = {
        captureException: function (t) {
            throw t
        },
        wrap: function (t, e) {
            return "function" == typeof t && (e = t, t = void 0),
            function () {
                e.apply(this, arguments)
            }
        }
    }, e = t.wrap(function (e, n) {
            function i(e) {
                var n = {};
                n.name = e.name, n.icon = e.icon, n.description = e.description || i.convert_name_to_description(e.name), n.protected = !! e.protected, n.draw_button = e.draw_button || function () {
                    return s("<img />", {
                        src: "//turnsocial.com/assets/blank-3eaf0f4686754462cbd6a495f152c130.png",
                        "class": "ts_sprite_icons_" + (n.icon || n.name),
                        alt: n.description
                    })
                };
                var o = e.click || function () {
                        n.activate()
                    }, a = function () {
                        d.track("app opened", {
                            name: n.name
                        }), o()
                    };
                return n.link = s("<div />", {
                    "class": "ts_app_link",
                    id: "ts_" + n.name + "_link",
                    click: t.wrap(a)
                }), n.protected ? l.find("#ts_protected_links").append(n.link) : l.find("#ts_app_links").append(n.link), n.link.append(n.draw_button()), n
            }

            function o(e) {
                var n = i(e);
                n.onload = e.onload || function () {}, n.type = e.type, n.loaded = e.loaded || !1, n.shadow = "undefined" == typeof e.shadow ? !0 : e.shadow, n.load_content = n.load_content || e.load_content, n.on_close = e.on_close, n.app_window = s("<div />", {
                    id: "ts_" + n.name,
                    "class": "ts_widget ts_" + n.type
                }), n.display_div = s("<div />", {
                    "class": "ts_display_div"
                });
                var o = s("<div />", {
                    "class": "ts_title_bar"
                }),
                    a = s("<div />", {
                        "class": "ts_close_button",
                        click: t.wrap(function () {
                            n.deactivate()
                        })
                    });
                return o.append(a), n.app_window.append(o), n.app_window.append(n.display_div), l.append(n.app_window), n.display_div.prevent_scroll(), n.activate = function () {
                    if (n == i.active_app) return n.deactivate(), void 0;
                    i.active_app && i.active_app.deactivate(!0), i.active_app = n;
                    var t = n.show_app_window();
                    if (s(document).bind("keydown.ts_abort", function (t) {
                        27 == t.keyCode && n.deactivate()
                    }), !n.loaded) {
                        var e = n.app_window.height_defined();
                        e || n.app_window.height(n.app_window.width());
                        var o = !1;
                        n.display_div.html("");
                        var a = b(n.display_div);
                        n.error = function (t) {
                            if (!o && !n.loaded) {
                                o = !0, a.stop();
                                var e = s("<div />", {
                                    "class": "ts_error",
                                    text: t
                                });
                                n.display_div.html(e), e.css("margin-top", -e.outerHeight() / 2)
                            }
                        }, setTimeout(function () {
                            n.error("The application timed out. Please refresh the page and try again.")
                        }, 15e3), n.load_content(function () {
                            if (n.loaded = !0, a.stop(), n.onload(), !e) {
                                n.app_window.css({
                                    height: "auto"
                                });
                                var i = Math.min(n.app_window.height(), 1500),
                                    o = function () {
                                        var t = n.app_window.offset().top - s(document).scrollTop(),
                                            e = 40;
                                        e > t && n.app_window.css({
                                            top: e,
                                            height: "auto"
                                        });
                                        var o = n.app_window.height();
                                        o > i && n.app_window.css({
                                            top: "auto",
                                            height: i
                                        })
                                    };
                                s(window).bind("resize.ts_resize_app", o), s.when(t).then(o)
                            }
                        })
                    }
                }, n.deactivate = function (t) {
                    n == i.active_app && (i.active_app = null, s(document).unbind("keydown.ts_abort"), s(window).unbind("resize.ts_resize_app"), t || s("#ts_shadow").hide(), n.app_window.fadeOut(200), "function" == typeof n.on_close && n.on_close())
                }, n.show_app_window = function () {
                    var t = s("#ts_shadow"),
                        e = s.Deferred();
                    return n.shadow ? t.fadeTo(200, .3, function () {
                        n.app_window.fadeIn(200), setTimeout(e.resolve, 1)
                    }) : (n.app_window.fadeIn(200), setTimeout(e.resolve, 1)), e
                }, n.reload = function () {
                    n.deactivate(!0), n.loaded = !1, n.activate()
                }, n
            }

            function a(e) {
                var n = o(s.extend(e, {
                    type: "iframe_app"
                }));
                return n.src = e.src, n.scrollable = e.scrollable || !1, n.load_content = function (e) {
                    n.iframe = s('<iframe src="' + n.src + '" ' + 'marginwidth="0" marginheight="0" vspace="0" hspace="0" ' + 'allowtransparency="true" frameborder="0" scrolling="no"></iframe>'), n.display_div.append(n.iframe), n.iframe.width(0).height(0), n.iframe.load(t.wrap(function () {
                        n.iframe.siblings().remove(), n.iframe.width("100%"), n.iframe.height("100%"), e()
                    }))
                }, n
            }

            function r(e) {
                var n = o(s.extend(e, {
                    type: "json_app"
                }));
                return n.url = e.url, n.display = e.display, n.styles = e.styles, n.load_content = function (e) {
                    s.jsonp({
                        url: n.url,
                        success: function (i) {
                            try {
                                var o = n.display(i);
                                n.display_div.html(o), e()
                            } catch (a) {
                                n.error("Whoops... There was an error. We're working on fixing it now!"), t.captureException(a)
                            }
                        },
                        error: function (e) {
                            n.error("Error loading data. Refresh the page and try again."), t.captureException(e)
                        }
                    })
                }, n
            }
            if (!turnsocial_has_run) {
                turnsocial_has_run = !0, "undefined" == typeof console && (this.console = {
                    log: function () {}
                });
                var s = e;
                ! function (t) {
                    function e() {}

                    function n(t) {
                        r = [t]
                    }

                    function i(t, e, n) {
                        return t && t.apply(e.context || e, n)
                    }

                    function o(t) {
                        return /\?/.test(t) ? "&" : "?"
                    }

                    function a(a) {
                        function h(t) {
                            X++ || (Q(), R && (z[B] = {
                                s: [t]
                            }), Y && (t = Y.apply(a, [t])), i(F, a, [t, x, a]), i(q, a, [a, x]))
                        }

                        function W(t) {
                            X++ || (Q(), R && t != y && (z[B] = t), i(E, a, [a, t]), i(q, a, [a, t]))
                        }
                        a = t.extend({}, j, a);
                        var H, O, C, A, L, F = a.success,
                            E = a.error,
                            q = a.complete,
                            Y = a.dataFilter,
                            P = a.callbackParameter,
                            $ = a.callback,
                            U = a.cache,
                            R = a.pageCache,
                            N = a.charset,
                            B = a.url,
                            Z = a.data,
                            J = a.timeout,
                            X = 0,
                            Q = e;
                        return T && T(function (t) {
                            t.done(F).fail(E), F = t.resolve, E = t.reject
                        }).promise(a), a.abort = function () {
                            !X++ && Q()
                        }, i(a.beforeSend, a, [a]) === !1 || X ? a : (B = B || l, Z = Z ? "string" == typeof Z ? Z : t.param(Z, a.traditional) : l, B += Z ? o(B) + Z : l, P && (B += o(B) + encodeURIComponent(P) + "=?"), !U && !R && (B += o(B) + "_" + (new Date).getTime() + "="), B = B.replace(/=\?(&|$)/, "=" + $ + "$1"), R && (H = z[B]) ? H.s ? h(H.s[0]) : W(H) : (k[$] = n, C = t(v)[0], C.id = u + D++, N && (C[c] = N), S && S.version() < 11.6 ? (A = t(v)[0]).text = "document.getElementById('" + C.id + "')." + g + "()" : C[s] = s, M && (C.htmlFor = C.id, C.event = f), C[m] = C[g] = C[_] = function (t) {
                            if (!C[w] || !/i/.test(C[w])) {
                                try {
                                    C[f] && C[f]()
                                } catch (e) {}
                                t = r, r = 0, t ? h(t[0]) : W(p)
                            }
                        }, C.src = B, Q = function () {
                            L && clearTimeout(L), C[_] = C[m] = C[g] = null, I[b](C), A && I[b](A)
                        }, I[d](C, O = I.firstChild), A && I[d](A, O), L = J > 0 && setTimeout(function () {
                            W(y)
                        }, J)), a)
                    }
                    var r, s = "async",
                        c = "charset",
                        l = "",
                        p = "error",
                        d = "insertBefore",
                        u = "_jqjsp",
                        h = "on",
                        f = h + "click",
                        g = h + p,
                        m = h + "load",
                        _ = h + "readystatechange",
                        w = "readyState",
                        b = "removeChild",
                        v = "<script>",
                        x = "success",
                        y = "timeout",
                        k = window,
                        T = t.Deferred,
                        I = t("head")[0] || document.documentElement,
                        z = {}, D = 0,
                        j = {
                            callback: u,
                            url: location.href
                        }, S = k.opera,
                        M = !! t("<div>").html("<!--[if IE]><i><![endif]-->").find("i").length;
                    a.setup = function (e) {
                        t.extend(j, e)
                    }, t.jsonp = a
                }(e);
                var c = {};
                ! function (t) {
                    var e = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        i = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                        o = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        a = {
                            1: "st",
                            2: "nd",
                            3: "rd",
                            "default": "th"
                        };
                    t.extend_date = function () {
                        Date.strptime = t.strptime, Date.prototype.strftime = function (e) {
                            return t.strftime(this, e)
                        }
                    };
                    var r = {
                        daysInMonth: function (t) {
                            var e = r.isLeapYear(t) ? 29 : 28;
                            return [31, e, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
                        },
                        getTimezone: function (t) {
                            return t.toString().replace(/^.*? ([A-Z]{3}) [0-9]{4}.*$/, "$1").replace(/^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/, "$1$2$3")
                        },
                        getGMTOffset: function (t) {
                            return (t.getTimezoneOffset() > 0 ? "-" : "+") + l.pad(Math.floor(t.getTimezoneOffset() / 60), 2) + l.pad(t.getTimezoneOffset() % 60, 2)
                        },
                        getDayOfYear: function (t) {
                            for (var e = 0, n = 0; n < t.getMonth(); ++n) e += r.daysInMonth(t)[n];
                            return e + t.getDate()
                        },
                        getWeekOfYear: function (t, e) {
                            var n = this.getDayOfYear(t) + (e - t.getDay()),
                                i = new Date(t.getFullYear(), 0, 1),
                                o = 7 - i.getDay() + e;
                            return l.pad(Math.floor((n - o) / 7) + 1, 2)
                        },
                        isLeapYear: function (t) {
                            var e = t.getFullYear();
                            return !(0 != (3 & e) || !(e % 100 || 0 == e % 400 && e))
                        },
                        getFirstDayOfMonth: function (t) {
                            var e = (t.getDay() - (t.getDate() - 1)) % 7;
                            return 0 > e ? e + 7 : e
                        },
                        getLastDayOfMonth: function (t) {
                            var e = (t.getDay() + (r.daysInMonth(t)[t.getMonth()] - t.getDate())) % 7;
                            return 0 > e ? e + 7 : e
                        },
                        getSuffix: function (t) {
                            var e = t.getDate().toString(),
                                n = parseInt(e.slice(-1));
                            return a[n] || a["default"]
                        },
                        applyOffset: function (t, e) {
                            return t.setTime(t.valueOf() - 1e3 * e), t
                        },
                        century: function (t) {
                            return parseInt(t.getFullYear().toString().substring(0, 2), 10)
                        }
                    }, c = {
                            values_of: function (t) {
                                var e = [];
                                return s.each(t, function (t, n) {
                                    e.push(n)
                                }), e
                            }
                        }, l = {
                            pad: function (t, e, n) {
                                n || (n = "0");
                                for (var i = t.toString(), o = e - i.length; o-- > 0;) i = n + i;
                                return i
                            }
                        }, p = {
                            a: function (t) {
                                return o[t.getDay()]
                            },
                            A: function (t) {
                                return i[t.getDay()]
                            },
                            b: function (t) {
                                return n[t.getMonth()]
                            },
                            B: function (t) {
                                return e[t.getMonth()]
                            },
                            c: function (t) {
                                return t.toLocaleString()
                            },
                            C: function (t) {
                                return r.century(t)
                            },
                            d: function (t) {
                                return l.pad(t.getDate(), 2)
                            },
                            e: function (t) {
                                return l.pad(t.getDate(), 2, " ")
                            },
                            H: function (t) {
                                return l.pad(t.getHours(), 2)
                            },
                            I: function (t) {
                                return l.pad(t.getHours() % 12 || 12, 2)
                            },
                            j: function (t) {
                                return l.pad(r.getDayOfYear(t), 3)
                            },
                            k: function (t) {
                                return l.pad(t.getHours(), 2, " ")
                            },
                            l: function (t) {
                                return l.pad(t.getHours() % 12 || 12, 2, " ")
                            },
                            L: function (t) {
                                return l.pad(t.getMilliseconds(), 3)
                            },
                            m: function (t) {
                                return l.pad(t.getMonth() + 1, 2)
                            },
                            M: function (t) {
                                return l.pad(t.getMinutes(), 2)
                            },
                            p: function (t) {
                                return t.getHours() < 12 ? "AM" : "PM"
                            },
                            P: function (t) {
                                return t.getHours() < 12 ? "am" : "pm"
                            },
                            q: function (t) {
                                return r.getSuffix(t)
                            },
                            s: function (t) {
                                return Math.round(t.valueOf() / 1e3)
                            },
                            S: function (t) {
                                return l.pad(t.getSeconds(), 2)
                            },
                            u: function (t) {
                                return t.getDay() || 7
                            },
                            U: function (t) {
                                return r.getWeekOfYear(t, 0)
                            },
                            w: function (t) {
                                return t.getDay()
                            },
                            W: function (t) {
                                return r.getWeekOfYear(t, 1)
                            },
                            x: function (t) {
                                return t.toLocaleDateString()
                            },
                            X: function (t) {
                                return t.toLocaleTimeString()
                            },
                            y: function (t) {
                                return t.getFullYear().toString().substring(2, 4)
                            },
                            Y: function (t) {
                                return t.getFullYear()
                            },
                            z: function (t) {
                                var e = 100 * (t.getTimezoneOffset() / 60);
                                return (e > 0 ? "-" : "+") + l.pad(e, 4)
                            },
                            "%": function () {
                                return "%"
                            }
                        };
                    p.h = p.b, p.N = p.L;
                    var d = {
                        a: {
                            r: "(?:" + o.join("|") + ")"
                        },
                        A: {
                            r: "(?:" + i.join("|") + ")"
                        },
                        b: {
                            r: "(" + n.join("|") + ")",
                            p: function (t) {
                                this.month = s.inArray(t, n)
                            }
                        },
                        B: {
                            r: "(" + e.join("|") + ")",
                            p: function (t) {
                                this.month = s.inArray(t, e)
                            }
                        },
                        C: {
                            r: "(\\d{1,2})",
                            p: function (t) {
                                this.century = parseInt(t, 10)
                            }
                        },
                        d: {
                            r: "(\\d{1,2})",
                            p: function (t) {
                                this.day = parseInt(t, 10)
                            }
                        },
                        H: {
                            r: "(\\d{1,2})",
                            p: function (t) {
                                this.hour = parseInt(t, 10)
                            }
                        },
                        j: {
                            r: "(\\d{1,3})",
                            p: function (t) {
                                this.day = parseInt(t, 10)
                            }
                        },
                        L: {
                            r: "(\\d{3})",
                            p: function (t) {
                                this.milliseconds = parseInt(t, 10)
                            }
                        },
                        m: {
                            r: "(\\d{1,2})",
                            p: function (t) {
                                this.month = parseInt(t, 10) - 1
                            }
                        },
                        M: {
                            r: "(\\d{2})",
                            p: function (t) {
                                this.minute = parseInt(t, 10)
                            }
                        },
                        M: {
                            r: "(\\d{2})",
                            p: function (t) {
                                this.minute = parseInt(t, 10)
                            }
                        },
                        p: {
                            r: "(AM|PM)",
                            p: function (t) {
                                "AM" == t ? 12 == this.hour && (this.hour = 0) : this.hour < 12 && (this.hour += 12)
                            }
                        },
                        P: {
                            r: "(am|pm)",
                            p: function (t) {
                                "am" == t ? 12 == this.hour && (this.hour = 0) : this.hour < 12 && (this.hour += 12)
                            }
                        },
                        q: {
                            r: "(?:" + c.values_of(a).join("|") + ")"
                        },
                        S: {
                            r: "(\\d{2})",
                            p: function (t) {
                                this.second = parseInt(t, 10)
                            }
                        },
                        y: {
                            r: "(\\d{1,2})",
                            p: function (t) {
                                this.year = parseInt(t, 10)
                            }
                        },
                        Y: {
                            r: "(\\d{4})",
                            p: function (t) {
                                this.century = Math.floor(parseInt(t, 10) / 100), this.year = parseInt(t, 10) % 100
                            }
                        },
                        z: {
                            r: "(Z|[+-]\\d{2}:?\\d{2})",
                            p: function (t) {
                                if ("Z" == t) return this.zone = 0, void 0;
                                var e = 3600 * parseInt(t[0] + t[1] + t[2], 10);
                                e += ":" == t[3] ? 60 * parseInt(t[4] + t[5], 10) : 60 * parseInt(t[3] + t[4], 10), this.zone = e
                            }
                        }
                    };
                    d.e = d.d, d.h = d.b, d.I = d.H, d.k = d.H, d.l = d.H, t.strftime = function (t, e) {
                        for (var n = "", i = e;;) {
                            var o = /%./g,
                                a = o.exec(i);
                            if (!a) return n + i;
                            n += i.slice(0, o.lastIndex - 2), i = i.slice(o.lastIndex);
                            var r = a[0].charAt(1),
                                s = p[r];
                            n += s ? s.call(this, t) : "%" + r
                        }
                    }, t.strptime = function (t, e) {
                        for (var n = [], i = "", o = e;;) {
                            var a = /%./g,
                                c = a.exec(o);
                            if (!c) {
                                i += o;
                                break
                            }
                            i += o.slice(0, a.lastIndex - 2), o = o.slice(a.lastIndex);
                            var l = c[0].charAt(1),
                                p = d[l];
                            p.p && (n = n.concat(p.p)), i += p.r
                        }
                        var i = new RegExp("^" + i + "$"),
                            u = t.match(i) || [];
                        if (u.length != n.length + 1) return null;
                        var h = {};
                        s.each(n, function (t, e) {
                            e.call(h, u[t + 1])
                        });
                        var f = new Date;
                        if ("year" in h)
                            if ("century" in h) h.year += 100 * h.century;
                            else {
                                h.year += 100 * r.century(f);
                                var g = new Date(f.getFullYear() + 50, f.getMonth(), f.getDate());
                                h.year > g.getFullYear() && (h.year -= 100)
                            }
                        if ("year" in h && "day" in h && !("month" in h))
                            for (var m = new Date(h.year, 0, 1), _ = r.daysInMonth(m), w = 0; w < _.length; w++) {
                                if (h.day <= _[w]) {
                                    h.month = w;
                                    break
                                }
                                h.day -= _[w]
                            }
                        var b = new Date("year" in h ? h.year : f.getFullYear(), "month" in h ? h.month : f.getMonth(), "day" in h ? h.day : f.getDate(), h.hour || 0, h.minute || 0, h.second || 0, h.milliseconds || 0);
                        return "zone" in h ? (b = new Date(b.valueOf() - 60 * 1e3 * b.getTimezoneOffset()), r.applyOffset(b, h.zone || 0)) : b
                    }
                }(c);
                var l = s('<div id="ts" class="ts"> <div class="ts_bar"> <div class="ts_bar_left">&nbsp;</div> <div id="ts_bar_content"> <div id="ts_app_links"><div id="google_translate_element"></div></div> <div id="ts_protected_links"></div> </div> <div class="ts_bar_right">&nbsp;</div> </div> <div id="ts_shadow"></div> </div>'),
                    p = '#ts h1,#ts h2,#ts h3,#ts h4,#ts h5,#ts h6,#ts p,#ts td,#ts dl,#ts tr,#ts dt,#ts ol,#ts form,#ts select,#ts option,#ts pre,#ts div,#ts table,#ts th,#ts tbody,#ts tfoot,#ts caption,#ts thead,#ts ul,#ts li,#ts address,#ts blockquote,#ts dd,#ts fieldset,#ts li,#ts iframe,#ts strong,#ts legend,#ts em,#ts s,#ts cite,#ts span,#ts input,#ts sup,#ts label,#ts dfn,#ts object,#ts big,#ts q,#ts font,#ts samp,#ts acronym,#ts small,#ts img,#ts strike,#ts code,#ts sub,#ts ins,#ts textarea,#ts var,#ts a,#ts abbr,#ts applet,#ts del,#ts kbd,#ts tt,#ts b,#ts i,#ts hr,#ts article,#ts aside,#ts dialog,#ts figure,#ts footer,#ts header,#ts hgroup,#ts menu,#ts nav,#ts section,#ts time,#ts mark,#ts audio,#ts video{background-attachment:scroll;background-color:transparent;background-image:none;background-position:0 0;background-repeat:repeat;border-color:black;border-radius:0;border-style:none;border-width:medium;bottom:auto;clear:none;clip:auto;color:inherit;counter-increment:none;counter-reset:none;cursor:auto;direction:inherit;display:inline;float:none;font-family:inherit;font-size:inherit;font-style:inherit;font-variant:normal;font-weight:inherit;height:auto;left:auto;letter-spacing:normal;line-height:inherit;list-style-type:none;list-style-position:outside;list-style-image:none;margin:0;max-height:none;max-width:none;min-height:0;min-width:0;opacity:1;outline:invert none medium;overflow:visible;padding:0;position:static;quotes:"" "";right:auto;table-layout:auto;text-align:inherit;text-decoration:inherit;text-indent:0;text-transform:none;top:auto;unicode-bidi:normal;vertical-align:baseline;visibility:inherit;white-space:normal;width:auto;word-spacing:normal;z-index:auto;-moz-border-radius:0;-webkit-border-radius:0}#ts h3,#ts h5,#ts p,#ts h1,#ts dl,#ts dt,#ts h6,#ts ol,#ts form,#ts select,#ts option,#ts pre,#ts div,#ts h2,#ts caption,#ts h4,#ts ul,#ts address,#ts blockquote,#ts dd,#ts fieldset,#ts textarea,#ts hr,#ts article,#ts aside,#ts dialog,#ts figure,#ts footer,#ts header,#ts hgroup,#ts menu,#ts nav,#ts section{display:block}#ts table{display:table}#ts thead{display:table-header-group}#ts tbody{display:table-row-group}#ts tfoot{display:table-footer-group}#ts tr{display:table-row}#ts th,#ts td{display:table-cell}#ts li{display:list-item;min-height:auto;min-width:auto}#ts strong{font-weight:bold}#ts em{font-style:italic}#ts kbd,#ts samp,#ts code{font-family:monospace}#ts a,#ts a,#ts *,#ts input[type=submit],#ts input[type=radio],#ts input[type=checkbox],#ts select{cursor:pointer}#ts a:hover{text-decoration:none}#ts button,#ts input[type=submit]{text-align:center}#ts input[type=hidden]{display:none}#ts abbr[title],#ts acronym[title],#ts dfn[title]{cursor:help;border-bottom-width:1px;border-bottom-style:dotted}#ts ins{background-color:#ff9;color:black}#ts del{text-decoration:line-through}#ts blockquote,#ts q{quotes:none}#ts blockquote:before,#ts blockquote:after,#ts q:before,#ts q:after,#ts li:before,#ts li:after{content:""}#ts input,#ts select{vertical-align:middle}#ts select,#ts textarea,#ts input{border:1px solid #ccc}#ts table{border-collapse:collapse;border-spacing:0}#ts hr{display:block;height:1px;border:0;border-top:1px solid #ccc;margin:1em 0}#ts *[dir=rtl]{direction:rtl}#ts mark{background-color:#ff9;color:black;font-style:italic;font-weight:bold}#ts{font-size:medium;line-height:1;direction:ltr;text-align:left;font-family:"Times New Roman", Times, serif;color:black;font-style:normal;font-weight:normal;text-decoration:none;list-style-type:disc;display:block}\n';
                p += "#ts .ts_sprite_icons_ads{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 0px no-repeat}#ts .ts_sprite_icons_apartment_ratings{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -23px no-repeat}#ts .ts_sprite_icons_facebook{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -46px no-repeat}#ts .ts_sprite_icons_facebook_fan{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -69px no-repeat}#ts .ts_sprite_icons_flickr{width:24px;height:24px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -92px no-repeat}#ts .ts_sprite_icons_foursquare{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -116px no-repeat}#ts .ts_sprite_icons_hide{width:23px;height:22px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -139px no-repeat}#ts .ts_sprite_icons_myspace{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -161px no-repeat}#ts .ts_sprite_icons_outside{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -184px no-repeat}#ts .ts_sprite_icons_rentwiki{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -207px no-repeat}#ts .ts_sprite_icons_resident_places{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -230px no-repeat}#ts .ts_sprite_icons_rss{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -253px no-repeat}#ts .ts_sprite_icons_satisfacts{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -276px no-repeat}#ts .ts_sprite_icons_share{width:23px;height:18px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -299px no-repeat}#ts .ts_sprite_icons_show{width:23px;height:22px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -317px no-repeat}#ts .ts_sprite_icons_turnsocial{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -339px no-repeat}#ts .ts_sprite_icons_twitter_search{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -362px no-repeat}#ts .ts_sprite_icons_twitter_user{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -385px no-repeat}#ts .ts_sprite_icons_walkscore{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -408px no-repeat}#ts .ts_sprite_icons_yelp_search{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -431px no-repeat}#ts .ts_sprite_icons_yelp_venue{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -454px no-repeat}#ts .ts_sprite_icons_youtube{width:23px;height:23px;background:transparent url(//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png) 0 -477px no-repeat}#ts *{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}#ts .ts_bar{position:fixed;bottom:0;right:13px;height:37px;z-index:2147483645;display:none;overflow:none;white-space:nowrap}#ts .ts_bar .ts_bar a:hover{text-decoration:none}#ts .ts_bar .ts_bar a{text-decoration:none;outline:none}#ts .ts_bar_left{position:absolute;left:0;top:0;bottom:0;width:13px;background:url(//turnsocial.com/assets/background-8165eb0c9e2c5e0347a0a21e2a92efed.png) no-repeat 0 0}#ts #ts_bar_content{background:url(//turnsocial.com/assets/background-8165eb0c9e2c5e0347a0a21e2a92efed.png) repeat-x 0 -37px;height:37px;margin:0 13px;padding-top:10px}#ts .ts_bar_right{position:absolute;right:0;top:0;bottom:0;width:13px;background:url(//turnsocial.com/assets/background-8165eb0c9e2c5e0347a0a21e2a92efed.png) no-repeat 0 -74px}#ts #ts_app_links,#ts #ts_protected_links{float:left}#ts .ts_app_link{display:inline-block;padding:0 5px;cursor:pointer;vertical-align:middle;height:146px;marginBottom:91px;}#ts .ts_app_link *{cursor:pointer}#ts .ts_error{position:absolute;top:50%;left:50%;margin-left:-120px;width:220px;border-radius:14px;line-height:18px;text-align:center;background-color:#fdd;color:#b00;font-weight:bold;padding:10px}#ts .ts_spinner{position:absolute;left:50%;top:50%;height:18px}#ts .ts_spinner_segment{position:absolute;width:14px;height:14px;background-color:white;border:solid 2px #7493d0;border-radius:14px}#ts #ts_shadow{background-color:black;position:fixed;left:0;top:0;right:0;bottom:0;z-index:2147483644;display:none}#ts .ts_display_div{height:100%;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}#ts .ts_json_app .ts_display_div{padding:10px;overflow-y:auto}#ts .ts_iframe_app .ts_display_div{overflow:hidden}#ts .ts_widget{font-family:Arial, sans-serif;display:none;background-color:white;position:fixed;border:2px solid #88a3d7;z-index:2147483645;bottom:43px;right:13px;font-size:13px;overflow:hidden;padding:22px 0 0 0}#ts .ts_widget a{color:#7D99CC;text-decoration:none}#ts .ts_widget a:hover{text-decoration:underline}#ts .ts_widget h1{font-size:28px;font-weight:bold}#ts .ts_widget h2{font-size:18px;font-weight:bold}#ts .ts_widget .ts_title_bar{position:absolute;height:22px;left:0;right:0;top:0;background-color:#88a3d7}#ts .ts_widget .ts_title_bar .ts_close_button{position:absolute;display:block;cursor:pointer;right:4px;top:3px;width:15px;height:15px;background:url(//turnsocial.com/assets/close_window-29998499c5e7db1ecf3c2bf9f3fdc27a.png) no-repeat 0 0}#ts .ts_widget .ts_title_bar .ts_close_button:hover{background-position:0 -16px}#ts .ts_widget .ts_title_bar .ts_close_button:active{background-position:0 -32px}#ts .ts_iframe_app iframe{width:100%;height:100%;overflow-x:hidden;overflow-y:auto}#ts #ts_facebook_fan{width:500px;height:560px}#ts #ts_walkscore{width:600px;height:442px}#ts #ts_walkscore iframe{overflow:hidden}#ts #ts_linkedin{display:inline-block;min-width:93px}#ts #ts_youtube{width:580px;height:560px}#ts #ts_satisfacts{width:460px;height:340px;left:50%;margin-left:-230px;top:50%;margin-top:-170px;border-radius:12px}#ts #ts_satisfacts iframe{overflow:hidden}#ts #google_translate_element{width:auto;height:20px;overflow:hidden;left:285px;position:absolute;top:12px;margin-left:10px;border:2px solid #7D9FD7; border-radius: 4px 4px 4px 4px;ts_app_linksts_app_links} #ts_google_plusone{width:80px;height:20px;overflow:hidden}#ts #ts_facebook_like{width:90px;height:20px;overflow:hidden}#ts #ts_ads{width:300px;height:250px;overflow:hidden}#ts .ts_tooltip{display:none;border:3px solid #333;border-radius:8px;background-color:#505050;padding:5px 9px;position:fixed;left:0;top:0;overflow:hidden;text-align:center;z-index:2147483647;font-family:sans-serif;color:#f3f3f3;letter-spacing:0.05em;white-space:nowrap;font-size:12px}#ts .default_height_check{height:1337px}\n";
                var d;
                d = {
                    track: function (t, e) {
                        var n, i, o, a;
                        return null == e && (e = {}), s.extend(e, {
                            event: t
                        }), i = "xxxxxxxx".replace(/x/g, function () {
                            return (0 | 16 * Math.random()).toString(16)
                        }), o = (new Date).getTime(), a = "//turnsocial.com/track/" + i + "-" + o + ".gif?" + s.param(e), n = s("<img />", {
                            "class": "ts_analytics",
                            style: "display: none !important;",
                            width: 0,
                            height: 0
                        }), n.load(function () {
                            return n.remove()
                        }), n.attr("src", a), s("body").append(n)
                    }
                };
                var u = {
                    bind: function (t, e, n) {
                        var i = this._callbacks || (this._callbacks = {}),
                            o = i[t] || (i[t] = []);
                        return o.push([e, n]), this
                    },
                    unbind: function (t, e) {
                        var n;
                        if (t) {
                            if (n = this._callbacks)
                                if (e) {
                                    var i = n[t];
                                    if (!i) return this;
                                    for (var o = 0, a = i.length; a > o; o++)
                                        if (i[o] && e === i[o][0]) {
                                            i[o] = null;
                                            break
                                        }
                                } else n[t] = []
                        } else this._callbacks = {};
                        return this
                    },
                    trigger: function (t) {
                        var e, n, i, o, a, r = 2;
                        if (!(n = this._callbacks)) return this;
                        for (; r--;)
                            if (i = r ? t : "all", e = n[i])
                                for (var s = 0, c = e.length; c > s; s++)(o = e[s]) ? (a = r ? Array.prototype.slice.call(arguments, 1) : arguments, o[0].apply(o[1] || this, a)) : (e.splice(s, 1), s--, c--);
                        return this
                    }
                };
                u.bind("insert", function () {
                    l.find("#ts_shadow").bind("click", function () {
                        return i.active_app.deactivate(), !1
                    }), s(".ts_widget").on("click", "a", function (t) {
                        return t.stopPropagation(), window.open(this.href), !1
                    })
                }),
                function (t) {
                    function e(e) {
                        var i = e || window.event,
                            o = [].slice.call(arguments, 1),
                            a = 0,
                            r = 0,
                            s = 0;
                        return e = t.event.fix(i), e.type = "mousewheel", i.wheelDelta && (a = i.wheelDelta / 120), i.detail && (a = -i.detail / 3), s = a, i.axis !== n && i.axis === i.HORIZONTAL_AXIS && (s = 0, r = -1 * a), i.wheelDeltaY !== n && (s = i.wheelDeltaY / 120), i.wheelDeltaX !== n && (r = -1 * i.wheelDeltaX / 120), o.unshift(e, a, r, s), (t.event.dispatch || t.event.handle).apply(this, o)
                    }
                    var i = ["DOMMouseScroll", "mousewheel"];
                    if (t.event.fixHooks)
                        for (var o = i.length; o;) t.event.fixHooks[i[--o]] = t.event.mouseHooks;
                    t.event.special.mousewheel = {
                        setup: function () {
                            if (this.addEventListener)
                                for (var t = i.length; t;) this.addEventListener(i[--t], e, !1);
                            else this.onmousewheel = e
                        },
                        teardown: function () {
                            if (this.removeEventListener)
                                for (var t = i.length; t;) this.removeEventListener(i[--t], e, !1);
                            else this.onmousewheel = null
                        }
                    }, t.fn.extend({
                        mousewheel: function (t) {
                            return t ? this.bind("mousewheel", t) : this.trigger("mousewheel")
                        },
                        unmousewheel: function (t) {
                            return this.unbind("mousewheel", t)
                        }
                    })
                }(e), s.fn.prevent_scroll = function () {
                    this.bind("mousewheel", function (t, e) {
                        return this.scrollHeight == this.clientHeight ? !0 : this.scrollTop <= 0 && e > 0 ? !1 : this.scrollTop + this.offsetHeight >= this.scrollHeight && 0 > e ? !1 : !0
                    })
                }, s.last = function (t) {
                    return t[t.length - 1]
                }, s.select = function (t, e) {
                    var n = [];
                    return s.each(t, function (t) {
                        e.call(this, t) && n.push(this)
                    }), n
                }, s.arraysEqual = function (t, e) {
                    return !(e > t || t > e)
                }, s.fn.height_defined = function () {
                    this.addClass("default_height_check");
                    var t = 1337 != Math.round(this.height());
                    return this.removeClass("default_height_check"), t
                }, s.getParameterByName = function (t) {
                    var e = RegExp("[?&]" + t + "=([^&]*)").exec(window.location.search);
                    return e && decodeURIComponent(e[1].replace(/\+/g, " "))
                }, s.parse_hash = function (t) {
                    var e = t.substr(1).split("&"),
                        n = {};
                    return s.each(e, function () {
                        var t = this.split("=");
                        n[t[0]] = t[1]
                    }), n
                }, s.fn.placeholder = function () {
                    return s(this).each(function () {
                        s(this).addClass("ts_placeholder").data("original-value", s(this).val()).focus(function () {
                            var t = s(this);
                            t.val() == t.data("original-value") && (t.removeClass("ts_placeholder"), t.val(""))
                        }).blur(function () {
                            var t = s(this);
                            "" == s.trim(t.val()) && (t.addClass("ts_placeholder"), t.val(t.data("original-value")))
                        })
                    })
                };
                var h = {
                    new_window: function (t, e, i) {
                        s.isFunction(e) && (i = e, e = n);
                        var o = {
                            height: 500,
                            width: 950
                        };
                        s.extend(o, e);
                        var a = window.screenLeft || window.screenX || 0;
                        a += (s(window).width() - o.width) / 2;
                        var r = window.screenTop || window.screenY || 0;
                        r += (s(window).height() - o.height) / 2;
                        var c = "width=" + o.width + "," + "height=" + o.height + "," + "left=" + a + ",top=" + r + "," + "scrollbars=no,toolbar=no,location=no,menubar=no",
                            l = window.open(t, "turnsocial", c);
                        if (s.isFunction(i)) var p = setInterval(function () {
                            l.closed && (clearInterval(p), i())
                        }, 100);
                        return l
                    },
                    new_frame: function () {
                        var t = s("<iframe />", {
                            name: "ts_frame",
                            style: "display: none !important",
                            width: 0,
                            height: 0
                        });
                        return s("#ts").append(t), t
                    },
                    xd_frame: function (t) {
                        var e = h.new_frame(),
                            n = e[0].contentWindow || e[0].documentWindow;
                        return h.xd_listener(n, function (n) {
                            e.remove(), t(n)
                        }), e
                    },
                    xd_popup: function (t, e) {
                        s.isFunction(t) && (e = t, t = "");
                        var n = !1,
                            i = h.new_window(t, function () {
                                n || e()
                            });
                        return h.xd_listener(i, function (t) {
                            e(t), n = !0, i.close()
                        }), i
                    },
                    xd_listener: function (t, e) {
                        try {
                            return t.postMessage("", "*"), s(window).bind("message", function (t) {
                                var n = t.originalEvent.data;
                                n = s.parse_hash(n), e(n)
                            }), void 0
                        } catch (n) {}
                        var i = setInterval(function () {
                            try {
                                if ("about:blank" !== t.location.toString()) {
                                    var n = t.location.hash;
                                    if ("#loading" == n) return;
                                    clearInterval(i);
                                    var o = s.parse_hash(n);
                                    e(o)
                                }
                            } catch (a) {}
                        }, 100)
                    },
                    post_into: function (t, e, i) {
                        var o = s("<form />", {
                            method: "post",
                            target: i.name || i.attr("name") || i.attr("id"),
                            action: t
                        });
                        s.each(e, function (t, e) {
                            if (e != n) {
                                var i = s("<input />", {
                                    type: "hidden",
                                    name: t,
                                    value: e
                                });
                                o.append(i)
                            }
                        }), s("#ts").append(o), o.submit()
                    }
                }, f = {
                        set: function (t, e, n, i) {
                            var o = "";
                            if (n) {
                                var a = new Date;
                                a.setDate(a.getDate() + n), o = "; expires=" + a.toGMTString()
                            }
                            domain_str = "", i && ("." != i[0] && (i = "." + i), domain_str = "; domain=" + i), document.cookie = t + "=" + encodeURIComponent(e) + domain_str + "; path=/" + o
                        },
                        get: function (t) {
                            var e = document.cookie.split(";"),
                                n = s.map(e, function (e) {
                                    var n = e.split("=");
                                    return s.trim(n[0]) == t ? decodeURIComponent(s.trim(n[1])) : void 0
                                });
                            return n[0]
                        },
                        erase: function (t) {
                            this.set(t, "", -1)
                        }
                    }, g = {
                        parse: s.parseJSON
                    };
                ! function () {
                    var t, e, n, i = function (t) {
                            return 10 > t ? "0" + t : t
                        }, o = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                        a = {
                            "\b": "\\b",
                            "	": "\\t",
                            "\n": "\\n",
                            "\f": "\\f",
                            "\r": "\\r",
                            '"': '\\"',
                            "\\": "\\\\"
                        }, r = function (t) {
                            return o.lastIndex = 0, o.test(t) ? '"' + t.replace(o, function (t) {
                                var e = a[t];
                                return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
                            }) + '"' : '"' + t + '"'
                        }, s = function (o, a) {
                            var c, l, p, d, u, h = t,
                                f = a[o];
                            switch ("function" == typeof n && (f = n.call(a, o, f)), "object" == typeof f && Object.prototype.toString.apply(f)) {
                            case "[object Boolean]":
                            case "[object Number]":
                            case "[object String]":
                                f = f.valueOf()
                            }
                            switch (typeof f) {
                            case "string":
                                return r(f);
                            case "number":
                                return isFinite(f) ? String(f) : "null";
                            case "boolean":
                            case "null":
                                return String(f);
                            case "object":
                                if (!f) return "null";
                                if (t += e, u = [], "[object Date]" === Object.prototype.toString.apply(f)) return isFinite(f.valueOf()) ? f.getUTCFullYear() + "-" + i(f.getUTCMonth() + 1) + "-" + i(f.getUTCDate()) + "T" + i(f.getUTCHours()) + ":" + i(f.getUTCMinutes()) + ":" + i(f.getUTCSeconds()) + "Z" : null;
                                if ("[object Array]" === Object.prototype.toString.apply(f)) {
                                    for (d = f.length, c = 0; d > c; c += 1) u[c] = s(c, f) || "null";
                                    return p = 0 === u.length ? "[]" : t ? "[\n" + t + u.join(",\n" + t) + "\n" + h + "]" : "[" + u.join(",") + "]", t = h, p
                                }
                                if (n && "object" == typeof n)
                                    for (d = n.length, c = 0; d > c; c += 1) "string" == typeof n[c] && (l = n[c], p = s(l, f), p && u.push(r(l) + (t ? ": " : ":") + p));
                                else
                                    for (l in f) Object.prototype.hasOwnProperty.call(f, l) && (p = s(l, f), p && u.push(r(l) + (t ? ": " : ":") + p));
                                return p = 0 === u.length ? "{}" : t ? "{\n" + t + u.join(",\n" + t) + "\n" + h + "}" : "{" + u.join(",") + "}", t = h, p
                            }
                        };
                    g.stringify = function (i, o, a) {
                        var r;
                        if (t = "", e = "", "number" == typeof a)
                            for (r = 0; a > r; r += 1) e += " ";
                        else "string" == typeof a && (e = a); if (n = o, o && "function" != typeof o && ("object" != typeof o || "number" != typeof o.length)) throw new Error("JSON.stringify");
                        return s("", {
                            "": i
                        })
                    }
                }();
                var m = g.parse(f.get("turnsocial") || "{}");
                m.save = function () {
                    f.set("turnsocial", g.stringify(m), 3660)
                }, "false" === f.get("turnsocial_visible") && (m.visible = !1, m.save()), f.erase("turnsocial_visible"), f.erase("turnsocial_unique");
                var _ = {
                    linkify: function (t) {
                        var e = t.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function (t) {
                            var e = s("<a />", {
                                href: t,
                                text: t
                            });
                            return s("<div />").append(e).html()
                        });
                        return e = e.replace(/(^|\s)@(\w+)/g, '$1<a href="http://www.twitter.com/$2">@$2</a>'), e.replace(/(^|\s)#(\w+)/g, '$1<a href="http://search.twitter.com/search?q=%23$2">#$2</a>')
                    },
                    truncate: function (t, e) {
                        return t.length < e ? t : t.substring(0, e - 3) + "..."
                    },
                    striptags: function (t) {
                        return t.replace(/<\/?[^>]+>/gi, "")
                    },
                    capitalize: function (t) {
                        return t.replace(/\S+/g, function (t) {
                            return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
                        })
                    },
                    format_phone: function (t) {
                        return 10 != t.length ? t : "(" + t.substring(0, 3) + ") " + t.substring(3, 6) + "-" + t.substring(6, 10)
                    },
                    pluralize: function (t, e, n) {
                        return 1 == t ? e : n
                    }
                }, w = {
                        relative_time: function (t, e) {
                            var n = new Date - t;
                            if (e = parseInt(e, 10) || 0, e >= n) return "Just now";
                            var i = null,
                                o = {
                                    millisecond: 1,
                                    second: 1e3,
                                    minute: 60,
                                    hour: 60,
                                    day: 24,
                                    month: 30,
                                    year: 12
                                };
                            for (var a in o) {
                                if (n < o[a]) break;
                                i = a, n /= o[a]
                            }
                            return n = Math.floor(n), 1 !== n && (i += "s"), [n, i, "ago"].join(" ")
                        }
                    }, b = function (t) {
                        var e = [],
                            n = 5,
                            i = 200,
                            o = !0,
                            a = s("<div />", {
                                "class": "ts_spinner"
                            });
                        t.append(a);
                        for (var r = 0; n > r; r++) {
                            var c = s("<div />", {
                                "class": "ts_spinner_segment"
                            });
                            a.append(c), c.css({
                                left: 2 * c.width() * r,
                                opacity: 0
                            }), e.push(c)
                        }
                        var l = 2 * n * c.width();
                        a.css({
                            width: l,
                            "margin-left": -l / 2,
                            "margin-top": -a.height() / 2
                        });
                        var p = 1,
                            d = function (t) {
                                o && (e[t].queue("fx").length > 0 && e[t].stop(!0, !0), e[t].css({
                                    opacity: 1
                                }), e[t].animate({
                                    opacity: 0
                                }, 200 * n), t += p, (0 == t || t == n - 1) && (p *= -1), setTimeout(function () {
                                    d(t)
                                }, i))
                            };
                        return d(0), {
                            stop: function () {
                                o = !1, a.remove()
                            }
                        }
                    };
                ! function (t, e) {
                    function n(t, e, n) {
                        return [parseInt(t[0], 10) * (h.test(t[0]) ? e / 100 : 1), parseInt(t[1], 10) * (h.test(t[1]) ? n / 100 : 1)]
                    }

                    function i(e, n) {
                        return parseInt(t.css(e, n), 10) || 0
                    }

                    function o(e) {
                        var n = e[0];
                        return 9 === n.nodeType ? {
                            width: e.width(),
                            height: e.height(),
                            offset: {
                                top: 0,
                                left: 0
                            }
                        } : t.isWindow(n) ? {
                            width: e.width(),
                            height: e.height(),
                            offset: {
                                top: e.scrollTop(),
                                left: e.scrollLeft()
                            }
                        } : n.preventDefault ? {
                            width: 0,
                            height: 0,
                            offset: {
                                top: n.pageY,
                                left: n.pageX
                            }
                        } : {
                            width: e.outerWidth(),
                            height: e.outerHeight(),
                            offset: e.offset()
                        }
                    }
                    t.ui = t.ui || {};
                    var a, r = Math.max,
                        s = Math.abs,
                        c = Math.round,
                        l = /left|center|right/,
                        p = /top|center|bottom/,
                        d = /[\+\-]\d+%?/,
                        u = /^\w+/,
                        h = /%$/,
                        f = t.fn.position;
                    t.position = {
                        scrollbarWidth: function () {
                            if (a !== e) return a;
                            var n, i, o = t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                                r = o.children()[0];
                            return t("body").append(o), n = r.offsetWidth, o.css("overflow", "scroll"), i = r.offsetWidth, n === i && (i = o[0].clientWidth), o.remove(), a = n - i
                        },
                        getScrollInfo: function (e) {
                            var n = e.isWindow ? "" : e.element.css("overflow-x"),
                                i = e.isWindow ? "" : e.element.css("overflow-y"),
                                o = "scroll" === n || "auto" === n && e.width < e.element[0].scrollWidth,
                                a = "scroll" === i || "auto" === i && e.height < e.element[0].scrollHeight;
                            return {
                                width: o ? t.position.scrollbarWidth() : 0,
                                height: a ? t.position.scrollbarWidth() : 0
                            }
                        },
                        getWithinInfo: function (e) {
                            var n = t(e || window),
                                i = t.isWindow(n[0]);
                            return {
                                element: n,
                                isWindow: i,
                                offset: n.offset() || {
                                    left: 0,
                                    top: 0
                                },
                                scrollLeft: n.scrollLeft(),
                                scrollTop: n.scrollTop(),
                                width: i ? n.width() : n.outerWidth(),
                                height: i ? n.height() : n.outerHeight()
                            }
                        }
                    }, t.fn.position = function (e) {
                        if (!e || !e.of) return f.apply(this, arguments);
                        e = t.extend({}, e);
                        var a, h, g, m, _, w, b = t(e.of),
                            v = t.position.getWithinInfo(e.within),
                            x = t.position.getScrollInfo(v),
                            y = (e.collision || "flip").split(" "),
                            k = {};
                        return w = o(b), b[0].preventDefault && (e.at = "left top"), h = w.width, g = w.height, m = w.offset, _ = t.extend({}, m), t.each(["my", "at"], function () {
                            var t, n, i = (e[this] || "").split(" ");
                            1 === i.length && (i = l.test(i[0]) ? i.concat(["center"]) : p.test(i[0]) ? ["center"].concat(i) : ["center", "center"]), i[0] = l.test(i[0]) ? i[0] : "center", i[1] = p.test(i[1]) ? i[1] : "center", t = d.exec(i[0]), n = d.exec(i[1]), k[this] = [t ? t[0] : 0, n ? n[0] : 0], e[this] = [u.exec(i[0])[0], u.exec(i[1])[0]]
                        }), 1 === y.length && (y[1] = y[0]), "right" === e.at[0] ? _.left += h : "center" === e.at[0] && (_.left += h / 2), "bottom" === e.at[1] ? _.top += g : "center" === e.at[1] && (_.top += g / 2), a = n(k.at, h, g), _.left += a[0], _.top += a[1], this.each(function () {
                            var o, l, p = t(this),
                                d = p.outerWidth(),
                                u = p.outerHeight(),
                                f = i(this, "marginLeft"),
                                w = i(this, "marginTop"),
                                T = d + f + i(this, "marginRight") + x.width,
                                I = u + w + i(this, "marginBottom") + x.height,
                                z = t.extend({}, _),
                                D = n(k.my, p.outerWidth(), p.outerHeight());
                            "right" === e.my[0] ? z.left -= d : "center" === e.my[0] && (z.left -= d / 2), "bottom" === e.my[1] ? z.top -= u : "center" === e.my[1] && (z.top -= u / 2), z.left += D[0], z.top += D[1], t.support.offsetFractions || (z.left = c(z.left), z.top = c(z.top)), o = {
                                marginLeft: f,
                                marginTop: w
                            }, t.each(["left", "top"], function (n, i) {
                                t.ui.position[y[n]] && t.ui.position[y[n]][i](z, {
                                    targetWidth: h,
                                    targetHeight: g,
                                    elemWidth: d,
                                    elemHeight: u,
                                    collisionPosition: o,
                                    collisionWidth: T,
                                    collisionHeight: I,
                                    offset: [a[0] + D[0], a[1] + D[1]],
                                    my: e.my,
                                    at: e.at,
                                    within: v,
                                    elem: p
                                })
                            }), e.using && (l = function (t) {
                                var n = m.left - z.left,
                                    i = n + h - d,
                                    o = m.top - z.top,
                                    a = o + g - u,
                                    c = {
                                        target: {
                                            element: b,
                                            left: m.left,
                                            top: m.top,
                                            width: h,
                                            height: g
                                        },
                                        element: {
                                            element: p,
                                            left: z.left,
                                            top: z.top,
                                            width: d,
                                            height: u
                                        },
                                        horizontal: 0 > i ? "left" : n > 0 ? "right" : "center",
                                        vertical: 0 > a ? "top" : o > 0 ? "bottom" : "middle"
                                    };
                                d > h && s(n + i) < h && (c.horizontal = "center"), u > g && s(o + a) < g && (c.vertical = "middle"), c.important = r(s(n), s(i)) > r(s(o), s(a)) ? "horizontal" : "vertical", e.using.call(this, t, c)
                            }), p.offset(t.extend(z, {
                                using: l
                            }))
                        })
                    }, t.ui.position = {
                        fit: {
                            left: function (t, e) {
                                var n, i = e.within,
                                    o = i.isWindow ? i.scrollLeft : i.offset.left,
                                    a = i.width,
                                    s = t.left - e.collisionPosition.marginLeft,
                                    c = o - s,
                                    l = s + e.collisionWidth - a - o;
                                e.collisionWidth > a ? c > 0 && 0 >= l ? (n = t.left + c + e.collisionWidth - a - o, t.left += c - n) : t.left = l > 0 && 0 >= c ? o : c > l ? o + a - e.collisionWidth : o : c > 0 ? t.left += c : l > 0 ? t.left -= l : t.left = r(t.left - s, t.left)
                            },
                            top: function (t, e) {
                                var n, i = e.within,
                                    o = i.isWindow ? i.scrollTop : i.offset.top,
                                    a = e.within.height,
                                    s = t.top - e.collisionPosition.marginTop,
                                    c = o - s,
                                    l = s + e.collisionHeight - a - o;
                                e.collisionHeight > a ? c > 0 && 0 >= l ? (n = t.top + c + e.collisionHeight - a - o, t.top += c - n) : t.top = l > 0 && 0 >= c ? o : c > l ? o + a - e.collisionHeight : o : c > 0 ? t.top += c : l > 0 ? t.top -= l : t.top = r(t.top - s, t.top)
                            }
                        },
                        flip: {
                            left: function (t, e) {
                                var n, i, o = e.within,
                                    a = o.offset.left + o.scrollLeft,
                                    r = o.width,
                                    c = o.isWindow ? o.scrollLeft : o.offset.left,
                                    l = t.left - e.collisionPosition.marginLeft,
                                    p = l - c,
                                    d = l + e.collisionWidth - r - c,
                                    u = "left" === e.my[0] ? -e.elemWidth : "right" === e.my[0] ? e.elemWidth : 0,
                                    h = "left" === e.at[0] ? e.targetWidth : "right" === e.at[0] ? -e.targetWidth : 0,
                                    f = -2 * e.offset[0];
                                0 > p ? (n = t.left + u + h + f + e.collisionWidth - r - a, (0 > n || n < s(p)) && (t.left += u + h + f)) : d > 0 && (i = t.left - e.collisionPosition.marginLeft + u + h + f - c, (i > 0 || s(i) < d) && (t.left += u + h + f))
                            },
                            top: function (t, e) {
                                var n, i, o = e.within,
                                    a = o.offset.top + o.scrollTop,
                                    r = o.height,
                                    c = o.isWindow ? o.scrollTop : o.offset.top,
                                    l = t.top - e.collisionPosition.marginTop,
                                    p = l - c,
                                    d = l + e.collisionHeight - r - c,
                                    u = "top" === e.my[1],
                                    h = u ? -e.elemHeight : "bottom" === e.my[1] ? e.elemHeight : 0,
                                    f = "top" === e.at[1] ? e.targetHeight : "bottom" === e.at[1] ? -e.targetHeight : 0,
                                    g = -2 * e.offset[1];
                                0 > p ? (i = t.top + h + f + g + e.collisionHeight - r - a, t.top + h + f + g > p && (0 > i || i < s(p)) && (t.top += h + f + g)) : d > 0 && (n = t.top - e.collisionPosition.marginTop + h + f + g - c, t.top + h + f + g > d && (n > 0 || s(n) < d) && (t.top += h + f + g))
                            }
                        },
                        flipfit: {
                            left: function () {
                                t.ui.position.flip.left.apply(this, arguments), t.ui.position.fit.left.apply(this, arguments)
                            },
                            top: function () {
                                t.ui.position.flip.top.apply(this, arguments), t.ui.position.fit.top.apply(this, arguments)
                            }
                        }
                    },
                    function () {
                        var e, n, i, o, a, r = document.getElementsByTagName("body")[0],
                            s = document.createElement("div");
                        e = document.createElement(r ? "div" : "body"), i = {
                            visibility: "hidden",
                            width: 0,
                            height: 0,
                            border: 0,
                            margin: 0,
                            background: "none"
                        }, r && t.extend(i, {
                            position: "absolute",
                            left: "-1000px",
                            top: "-1000px"
                        });
                        for (a in i) e.style[a] = i[a];
                        e.appendChild(s), n = r || document.documentElement, n.insertBefore(e, n.firstChild), s.style.cssText = "position: absolute; left: 10.7432222px;", o = t(s).offset().left, t.support.offsetFractions = o > 10 && 11 > o, e.innerHTML = "", n.removeChild(e)
                    }()
                }(e), i.active_app = null, i.convert_name_to_description = function (t) {
                    return t === n || "string" != typeof t ? "" : s.map(t.split("_"), function (t) {
                        return t.substring(0, 1).toUpperCase() + t.substring(1)
                    }).join(" ")
                };
                var v = new Array;
                v.push(o({
                    name: "share",
                    description: "Share This Page",
                    draw_button: function () {
                        return '<img alt="Share This Page" class="ts_sprite_icons_share" src="//turnsocial.com/assets/blank-3eaf0f4686754462cbd6a495f152c130.png" /><div class="ts_share_text">Share</div>'
                    },
                    load_content: function (t) {
                        this.loaded = !0, this.display_div.html(function () {
                            var t = [];
                            return t.push(' <div class="ts_share_title"> Share via... </div> <div class="ts_share_links"> <a href="javascript:;" class="ts_share_link" data-url="//turnsocial.com/mail_share/new?mail_share[url]={url}&mail_share[title]={title}" data-name="email" > <img src="//turnsocial.com/assets/share/email-48f9f10a49dbdbc26e80a44434838b8d.png" /> email </a> <a href="javascript:;" class="ts_share_link" data-url="https://www.facebook.com/sharer.php?u={url}&t={title}" data-name="facebook" > <img src="//turnsocial.com/assets/share/facebook-d092a7a1586a9287a3413011d5c15913.png" /> facebook </a> <a href="javascript:;" class="ts_share_link" data-url="https://twitter.com/share?text={title}%20-%20{url}" data-name="twitter" > <img src="//turnsocial.com/assets/share/twitter-fbb6225de2ea4e68cc5d454fee4a5809.png" /> twitter </a> <a href="javascript:;" class="ts_share_link" data-url="http://reddit.com/submit?url={url}&title={title}" data-name="reddit" data-width="840" > <img src="//turnsocial.com/assets/share/reddit-e659e14a1b9dc101cc32fb5dc783bce7.png" /> reddit </a> <a href="javascript:;" class="ts_share_link" data-url="http://www.stumbleupon.com/submit?url={url}&title={title}" data-name="stumbleupon" data-width="800" > <img src="//turnsocial.com/assets/share/stumbleupon-5d6003f989ae7d4d2127072c47d1ea12.png" /> stumbleupon </a> </div>'), t.join("")
                        }()), t()
                    },
                    onload: function () {
                        s(".ts_share_link").click(function () {
                            var t = s('meta[itemprop^="name"]').attr("content") || s('meta[property^="og:title"]').attr("content") || document.title,
                                e = location.href,
                                n = s(this);
                            d.track("share", {
                                name: n.data("name")
                            });
                            var o = n.data("url").replace("{url}", encodeURIComponent(e)).replace("{title}", encodeURIComponent(t)),
                                a = n.data("width") || 635;
                            return h.new_window(o, {
                                width: a,
                                height: 700
                            }, function () {
                                i.active_app.deactivate()
                            }), !1
                        })
                    }
                })), p += "#ts #ts_share_link{font-size:10px;font-family:Verdana, Arial, Helvetica, sans-serif;margin-right:8px;border:1px solid #ddd;padding:0 2px;border-radius:4px;box-shadow:0, 1, 1, #aaaaaa;background-color:#dddddd;background-image:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #eee), color-stop(100%, #ddd));background-image:-webkit-linear-gradient(#eee, #ddd);background-image:linear-gradient(#eee, #ddd)}#ts #ts_share_link>*{margin:0 2px;display:inline-block;vertical-align:middle;line-height:18px}#ts #ts_share{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;width:770px;height:260px;left:50%;margin-left:-385px;top:50%;margin-top:-130px;border-width:5px;opacity:0.95;text-align:center}#ts #ts_share .ts_share_title{font-size:24px;font-weight:bold;padding:20px 0}#ts #ts_share .ts_share_links{display:inline-block;text-align:center}#ts #ts_share .ts_share_links .ts_share_link{cursor:pointer;display:inline-block;text-align:center;font-size:18px;margin:20px}#ts #ts_share .ts_share_links .ts_share_link img{cursor:pointer;width:100px;height:100px;display:block;padding-bottom:10px}\n", v.push(a({
                    name: "facebook_fan",
                    description: "Facebook Fan Page",
                    icon: "facebook",
                    src: "//www.facebook.com/plugins/likebox.php?id=123954514355408&width=500&height=560&colorscheme=light&show_faces=true&border_color&stream=true&header=false&connections=22&force_wall=true&appId=101244151430"
                })), v.push(i({
                    name: "facebook_like",
                    description: "Like this page",
                    draw_button: function () {
                        var t = "https://www.facebook.com/plugins/like.php?href=" + encodeURIComponent(location.href) + "&layout=button_count&show_faces=true&width=100&action=like&colorscheme=light&height=21";
                        return '<iframe src="' + t + '"' + 'scrolling="no" frameborder="0" ' + 'id="ts_facebook_like" ' + 'allowTransparency="true"></iframe>'
                    }
                })), v.push(i({
                    name: "google_plusone",
                    description: "Google +1",
                    draw_button: function () {
                        var t = "https://plusone.google.com/u/0/_/+1/fastbutton?url=" + encodeURIComponent(location.href) + "&size=medium&count=true&db=1&hl=en-US";
                        return '<iframe allowtransparency="true" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" src="' + t + '" ' + 'id="ts_google_plusone" ' + 'vspace="0" width="100%"></iframe>'
                    }
                })), u.bind("insert", function () {
                    y(m.visible !== !1);
                    var t = s("<img />", {
                        src: "//turnsocial.com/assets/background-8165eb0c9e2c5e0347a0a21e2a92efed.png"
                    }),
                        e = s("<img />", {
                            src: "//turnsocial.com/assets/icons-8aaaac0689f4a402152661e457e1e272.png"
                        }),
                        n = setInterval(function () {
                            t.get(0).complete && e.get(0).complete && (clearInterval(n), s("#ts .ts_bar").slideDown(), u.trigger("show"), d.track("social_bar"))
                        }, 20)
                });
                var x, y = function (t) {
                        var e = -139,
                            n = -317;
                        t ? (s("#ts_app_links").css({'display':'inline-block','margin-right':'-70px'}), s("#ts_hide_link img").css("background-position", "0 " + e + "px"), x.description = "Hide the toolbar") : (s("#ts_app_links").css("display", "none"), s("#ts_hide_link img").css("background-position", "0 " + n + "px"), x.description = "Show the toolbar"), s("#ts_toolbar_arrow").animate({
                            opacity: t
                        })
                    };
                x = i({
                    name: "hide",
                    "protected": !0,
                    click: function () {
                        i.current_app && current_app.deactivate(), s(".ts_tooltip").stop(!0, !1).fadeOut(100);
                        var t = s("#ts_app_links").is(":visible");
                        s(".ts_bar").slideUp(function () {
                            y(!t), u.trigger(t ? "hide" : "show"), s(".ts_bar").slideDown()
                        }), m.visible = !t, m.save()
                    }
                }), v.push(x), v.push(i({
                    name: "turnsocial",
                    description: "TurnSocial Toolbar",
                    "protected": !0,
                    click: function () {
                        window.open("http://turnsocial.com")
                    }
                })), s.each(v, function () {
                    var t = this,
                        e = s("<div />", {
                            "class": "ts_tooltip"
                        });
                    l.append(e), t.link.mouseenter(function () {
                        e.text(t.description), e.stop(!0, !0).fadeTo(100, 1), e.position({
                            of: s(this),
                            my: "center bottom-10",
                            at: "center top",
                            collision: "fit fit"
                        })
                    }), t.link.mouseleave(function () {
                        e.stop(!0, !1).fadeOut(100)
                    })
                }), d.track("load", {
                    site: window.location.href,
                    agent: navigator.userAgent,
                    referrer: document.referrer
                }), s(t.wrap(function () {
                    if ("Microsoft Internet Explorer" == navigator.appName) {
                        var t = navigator.userAgent,
                            e = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                        if (null != e.exec(t)) {
                            var n = parseFloat(RegExp.$1);
                            if (8 > n) return
                        }
                    }
                    var i = /(Android)|(webOS)|(iPad)|(iPhone)|(iPod)/i;
                    navigator.userAgent.match(i) || (s.support.boxModel || console.log("Warning - page is in quirks mode. TurnSocial may render incorrectly."), s("#ts").length > 0 || (s("body").append(l), s("head").append("<style>" + p + "</style>"), u.trigger("insert")))
                }))
            }
        }),
        n = "1.9",
        i = function (t, e) {
            return 0 === t.indexOf(e)
        }, o = function (t) {
            return "string" == typeof t && i(t, n)
        };
    if (window.jQuery && jQuery.fn && o(jQuery.fn.jquery)) e(jQuery);
    else if (window.$ && $.fn && o($.fn.jquery)) e($);
    else {
        var a = document.createElement("script");
        n += ".0", a.src = "//ajax.googleapis.com/ajax/libs/jquery/" + n + "/jquery.min.js";
        var r = document.getElementsByTagName("head")[0],
            s = !1;
        a.onload = a.onreadystatechange = function () {
            var t = !this.readyState || "loaded" == this.readyState || "complete" == this.readyState;
            !s && t && (s = !0, e(jQuery.noConflict(!0)), a.onload = a.onreadystatechange = null, r.removeChild(a))
        }, r.appendChild(a)
    }
}();