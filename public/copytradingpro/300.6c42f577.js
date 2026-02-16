"use strict";
(self.webpackChunkbot = self.webpackChunkbot || []).push([
    ["300"], {
        34932: function(e, t, s) {
            s.r(t), s.d(t, {
                default: () => A
            });
            var a = s(85893),
                r = s(67294),
                n = s(12558),
                i = s(10438),
                o = s(46560),
                l = s(14945),
                d = s(18470),
                c = s(96877),
                g = s(1599),
                u = s(67850),
                m = s(51001);
            let p = (0, g.ZF)({
                    apiKey: "AIzaSyBSvoI9s0EJNXAYiSj0aiLZJxr-JAxa7q8",
                    authDomain: "bot-analysis-tool-belex.firebaseapp.com",
                    projectId: "bot-analysis-tool-belex",
                    storageBucket: "bot-analysis-tool-belex.appspot.com",
                    messagingSenderId: "1088891054402",
                    appId: "1:1088891054402:web:b28fde06f1f060fd1000db"
                }),
                h = (0, u.ad)(p),
                x = async e => {
                    let t = (0, u.JU)(h, "accountTokens", e),
                        s = await (0, u.QT)(t);
                    return s.exists() ? s.data().tokens : []
                },
                N = async (e, t) => {
                    let s = (0, u.JU)(h, "accountTokens", e);
                    await (0, u.pl)(s, {
                        tokens: t
                    }, {
                        merge: !0
                    })
                },
                y = async (e, t, s) => {
                    let a = (await x(e)).map(e => e.token === t ? { ...e,
                        status: s
                    } : e);
                    await N(e, a)
                },
                j = (0, c.Pi)(() => {
                    let [e, t] = (0, r.useState)(null), [s, n] = (0, r.useState)([]), [i, o] = (0, r.useState)(""), [l, c] = (0, r.useState)({
                        text: "",
                        className: ""
                    }), [g, u] = (0, r.useState)(!1), [p, h] = (0, r.useState)(!1), [j, v] = (0, r.useState)(""), [b, f] = (0, r.useState)(""), [S, k] = (0, r.useState)("acct1"), [_, E] = (0, r.useState)(null), [w, T] = (0, r.useState)(localStorage.getItem("authToken") || ""), [A, I] = (0, r.useState)(""), [C, O] = (0, r.useState)(""), [L, J] = (0, r.useState)("trader-list"), [q, $] = (0, r.useState)([]), [z, P] = (0, r.useState)({}), D = (0, r.useRef)(null), R = async () => {
                        if (e) try {
                            let t = await x(e);
                            n(t), t.forEach(t => {
                                if ("pending" === t.status) {
                                    let s = Date.now();
                                    null == _ || _.send(JSON.stringify({
                                        authorize: t.token,
                                        req_id: s
                                    }));
                                    let a = r => {
                                        let n = JSON.parse(r.data);
                                        if ("authorize" === n.msg_type && n.req_id === s) {
                                            null == _ || _.removeEventListener("message", a);
                                            let s = n.error ? "error" : "verified";
                                            y(e, t.token, s).then(() => R())
                                        }
                                    };
                                    null == _ || _.addEventListener("message", a)
                                }
                            })
                        } catch (e) {
                            console.error("Error loading tokens:", e)
                        }
                    }, U = e => {
                        let t = "string" == typeof e ? e : e.token;
                        return "string" != typeof t ? (console.error("Invalid token format:", e), "Invalid Token") : t.length <= 8 ? t : t.substring(0, 4) + "..." + t.substring(t.length - 4)
                    }, W = async () => {
                        if (!e || !_) {
                            alert("Please authorize your main account first");
                            return
                        }
                        let t = i.trim();
                        if (t) try {
                            await new Promise((e, t) => {
                                let s = Date.now();
                                _.send(JSON.stringify({
                                    authorize: w,
                                    req_id: s
                                }));
                                let a = r => {
                                    let n = JSON.parse(r.data);
                                    if ("authorize" === n.msg_type && n.req_id === s) {
                                        if (_.removeEventListener("message", a), n.error) {
                                            t(Error("Authorization failed: " + n.error.message));
                                            return
                                        }
                                        _.send(JSON.stringify({
                                            set_settings: 1,
                                            allow_copiers: 1,
                                            req_id: s + 1
                                        }));
                                        let r = a => {
                                            let n = JSON.parse(a.data);
                                            "set_settings" === n.msg_type && n.req_id === s + 1 && (_.removeEventListener("message", r), n.error ? t(Error("Failed to allow copy trading: " + n.error.message)) : e())
                                        };
                                        _.addEventListener("message", r)
                                    }
                                };
                                _.addEventListener("message", a)
                            });
                            let s = await x(e);
                            if (s.some(e => e.token === t)) {
                                alert("This token is already added");
                                return
                            }
                            let a = [...s, {
                                token: t,
                                status: "pending"
                            }];
                            await N(e, a), n(a), o(""), c({
                                text: "Starting copy trading...",
                                className: "pending"
                            });
                            let r = Date.now();
                            _.send(JSON.stringify({
                                authorize: t,
                                req_id: r
                            })), await new Promise((e, t) => {
                                let s = a => {
                                    let n = JSON.parse(a.data);
                                    if ("authorize" === n.msg_type && n.req_id === r) {
                                        if (_.removeEventListener("message", s), n.error) {
                                            t(Error("Token verification failed: " + n.error.message));
                                            return
                                        }
                                        e()
                                    }
                                };
                                _.addEventListener("message", s)
                            });
                            let i = r + 1,
                                l = {
                                    copy_start: w,
                                    req_id: i
                                };
                            A && (l.max_trade_stake = Number(A)), C && (l.min_trade_stake = Number(C)), _.send(JSON.stringify(l)), await new Promise((e, t) => {
                                let s = a => {
                                    let r = JSON.parse(a.data);
                                    "copy_start" === r.msg_type && r.req_id === i && (_.removeEventListener("message", s), r.error ? t(Error("Copy start failed: " + r.error.message)) : e())
                                };
                                _.addEventListener("message", s)
                            }), await y(e, t, "success"), R(), c({
                                text: "Copy trading started successfully!",
                                className: "success"
                            })
                        } catch (s) {
                            console.error("Error in add token process:", s), await y(e, t, "error"), c({
                                text: `Error: ${s instanceof Error?s.message:"Failed to start copy trading"}`,
                                className: "error"
                            }), R()
                        }
                    }, Z = e => {
                        let t;
                        let s = () => {
                                t = setInterval(() => {
                                    e.readyState === WebSocket.OPEN && e.send(JSON.stringify({
                                        ping: 1
                                    }))
                                }, 3e4)
                            },
                            a = e => {
                                "pong" === JSON.parse(e.data).msg_type && console.log("Pong received - connection healthy")
                            };
                        return e.addEventListener("open", s), e.addEventListener("message", a), () => {
                            clearInterval(t), e.removeEventListener("message", a), e.removeEventListener("open", s)
                        }
                    }, B = async t => {
                        let a = s[t];
                        if (a && _ && e) {
                            c({
                                text: `Stopping copy trading for ${U(a)}...`,
                                className: "pending"
                            });
                            try {
                                let r = Date.now();
                                _.send(JSON.stringify({
                                    authorize: a.token,
                                    req_id: r
                                })), await new Promise((e, t) => {
                                    let s = setTimeout(() => t(Error("Authorization timeout")), 5e3),
                                        a = n => {
                                            let i = JSON.parse(n.data);
                                            "authorize" === i.msg_type && i.req_id === r && (clearTimeout(s), null == _ || _.removeEventListener("message", a), i.error ? t(i.error) : e(null))
                                        };
                                    _.addEventListener("message", a)
                                });
                                let i = Date.now() + 1;
                                _.send(JSON.stringify({
                                    copy_stop: w,
                                    req_id: i
                                })), await new Promise((e, t) => {
                                    let s = setTimeout(() => t(Error("Copy stop timeout")), 5e3),
                                        a = r => {
                                            let n = JSON.parse(r.data);
                                            "copy_stop" === n.msg_type && n.req_id === i && (clearTimeout(s), null == _ || _.removeEventListener("message", a), n.error ? t(n.error) : e(null))
                                        };
                                    _.addEventListener("message", a)
                                });
                                let o = s.filter((e, s) => s !== t);
                                await N(e, o), n(o), c({
                                    text: `Successfully stopped copy trading for ${U(a)}`,
                                    className: "success"
                                })
                            } catch (e) {
                                console.error("Error stopping copy trading:", e), c({
                                    text: `Failed to stop copy trading: ${e.message}`,
                                    className: "error"
                                })
                            }
                        }
                    }, M = async () => {
                        c({
                            text: "Starting copy trading...",
                            className: "pending"
                        });
                        let e = 0,
                            t = 0,
                            a = [];
                        for (let r = 0; r < s.length; r++) {
                            let i = s[r];
                            try {
                                let t = {
                                    authorize: i.token,
                                    req_id: 1e3 + r
                                };
                                null == _ || _.send(JSON.stringify(t)), await new Promise((e, t) => {
                                    let s = setTimeout(() => {
                                            t(Error("Authorization timeout"))
                                        }, 5e3),
                                        a = n => {
                                            let i = JSON.parse(n.data);
                                            "authorize" === i.msg_type && i.req_id === 1e3 + r && (clearTimeout(s), null == _ || _.removeEventListener("message", a), i.error ? t(Error(i.error.message)) : e(null))
                                        };
                                    null == _ || _.addEventListener("message", a)
                                });
                                let a = {
                                    copy_start: w,
                                    req_id: 2e3 + r
                                };
                                A && (a.max_trade_stake = Number(A)), C && (a.min_trade_stake = Number(C)), await new Promise((e, t) => {
                                    let s = setTimeout(() => {
                                            t(Error("Copy start timeout"))
                                        }, 5e3),
                                        n = a => {
                                            let i = JSON.parse(a.data);
                                            "copy_start" === i.msg_type && i.req_id === 2e3 + r && (clearTimeout(s), null == _ || _.removeEventListener("message", n), i.error ? t(Error(i.error.message)) : e(null))
                                        };
                                    null == _ || _.addEventListener("message", n), null == _ || _.send(JSON.stringify(a))
                                });
                                let o = [...s];
                                o[r] = { ...o[r],
                                    status: "success"
                                }, n(o), e++
                            } catch (i) {
                                console.error(`Error starting copy trading for token ${r}:`, i);
                                let e = [...s];
                                e[r] = { ...e[r],
                                    status: "error"
                                }, n(e), t++, a.push(`Token ${r}: ${i instanceof Error?i.message:String(i)}`)
                            }
                        }
                        0 === t ? c({
                            text: `Copy trading started successfully for all ${e} tokens!`,
                            className: "success"
                        }) : c({
                            text: `Copy trading failed for ${t} tokens. Successful: ${e}. Errors: ${a.join("; ")}`,
                            className: "error"
                        }), null == _ || _.send(JSON.stringify({
                            copytrading_list: 1,
                            req_id: 100
                        }))
                    }, Y = async () => {
                        c({
                            text: "Stopping copy trading...",
                            className: "pending"
                        });
                        let e = 0,
                            t = 0,
                            a = [];
                        for (let r = 0; r < s.length; r++) {
                            let i = s[r];
                            try {
                                let t = {
                                    authorize: i.token,
                                    req_id: 1e3 + r
                                };
                                null == _ || _.send(JSON.stringify(t)), await new Promise((e, t) => {
                                    let s = setTimeout(() => {
                                            t(Error("Authorization timeout"))
                                        }, 5e3),
                                        a = n => {
                                            let i = JSON.parse(n.data);
                                            "authorize" === i.msg_type && i.req_id === 1e3 + r && (clearTimeout(s), null == _ || _.removeEventListener("message", a), i.error ? t(Error(i.error.message)) : e(null))
                                        };
                                    null == _ || _.addEventListener("message", a)
                                });
                                let a = {
                                    copy_stop: w,
                                    req_id: 3e3 + r
                                };
                                await new Promise((e, t) => {
                                    let s = setTimeout(() => {
                                            t(Error("Copy stop timeout"))
                                        }, 5e3),
                                        n = a => {
                                            let i = JSON.parse(a.data);
                                            "copy_stop" === i.msg_type && i.req_id === 3e3 + r && (clearTimeout(s), null == _ || _.removeEventListener("message", n), i.error ? t(Error(i.error.message)) : e(null))
                                        };
                                    null == _ || _.addEventListener("message", n), null == _ || _.send(JSON.stringify(a))
                                });
                                let o = [...s];
                                o[r] = { ...o[r],
                                    status: "pending"
                                }, n(o), e++
                            } catch (i) {
                                console.error(`Error stopping copy trading for token ${r}:`, i);
                                let e = [...s];
                                e[r] = { ...e[r],
                                    status: "error"
                                }, n(e), t++, a.push(`Token ${r}: ${i instanceof Error?i.message:String(i)}`)
                            }
                        }
                        0 === t ? c({
                            text: `Copy trading stopped successfully for all ${e} tokens!`,
                            className: "success"
                        }) : c({
                            text: `Copy trading stop failed for ${t} tokens. Successful: ${e}. Errors: ${a.join("; ")}`,
                            className: "error"
                        }), null == _ || _.send(JSON.stringify({
                            copytrading_list: 1,
                            req_id: 100
                        }))
                    }, F = e => {
                        k(e), sessionStorage.setItem("selectedAccount", e), _ && _.close(), T("acct1" === e ? sessionStorage.getItem("token1") || "" : sessionStorage.getItem("token2") || "");
                        let a = (0, d.rh)(),
                            r = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${a}`),
                            i = Z(r);
                        r.addEventListener("open", e => {
                            console.log("Websocket connection established:", e), u(!0);
                            let t = localStorage.getItem("authToken") || "";
                            if (T(t), !t) {
                                console.error("WebSocket connection failed: No auth token");
                                return
                            }
                            let s = JSON.stringify({
                                authorize: t,
                                req_id: 9999
                            });
                            r.send(s)
                        }), r.addEventListener("message", a => {
                            let i = JSON.parse(a.data),
                                o = JSON.parse(a.data);
                            if ("authorize" === o.msg_type && 9999 === o.req_id) {
                                console.log("Main account authorization successful:", i), h(!0), t(o.authorize.loginid), console.log("Loading tokens for loginId:", o.authorize.loginid), setTimeout(() => R(), 0), r.send(JSON.stringify({
                                    copytrading_list: 1,
                                    req_id: 1
                                })), r.send(JSON.stringify({
                                    copytrading_statistics: 1,
                                    trader_id: "VRTC8609996",
                                    req_id: 2
                                }));
                                let s = JSON.stringify({
                                    balance: 1,
                                    account: "current",
                                    subscribe: 1,
                                    passthrough: {},
                                    req_id: 1
                                });
                                r.send(s), "acct1" === e ? f(sessionStorage.getItem("acct1") || "") : "acct2" === e && f(sessionStorage.getItem("acct2") || "")
                            } else if ("authorize" === o.msg_type && o.req_id >= 1e3 && o.req_id < 2e3) {
                                let e = o.req_id - 1e3,
                                    t = [...s];
                                o.error ? (console.error(`Trader authorization failed for token ${e}:`, o.error), t[e] = { ...t[e],
                                    status: "error"
                                }) : (console.log(`Trader authorization successful for token ${e}`), t[e] = { ...t[e],
                                    status: "pending"
                                }), n(t)
                            }
                            if ("copy_start" === o.msg_type && o.req_id >= 2e3 && o.req_id < 3e3) {
                                let e = o.req_id - 2e3,
                                    t = [...s];
                                o.error ? (console.error(`Copy start failed for token ${e}:`, o.error), t[e] = { ...t[e],
                                    status: "error"
                                }) : (console.log(`Copy trading started successfully for token ${e}`), t[e] = { ...t[e],
                                    status: "success"
                                }), n(t)
                            }
                            if ("copy_stop" === o.msg_type && o.req_id >= 3e3 && o.req_id < 4e3) {
                                let e = o.req_id - 3e3,
                                    t = [...s];
                                o.error ? (console.error(`Copy stop failed for token ${e}:`, o.error), t[e] = { ...t[e],
                                    status: "error"
                                }) : (console.log(`Copy trading stopped successfully for token ${e}`), t[e] = { ...t[e],
                                    status: "pending"
                                }), n(t)
                            }
                            if ("copytrading_list" === o.msg_type && 100 === o.req_id && $(o.copytrading_list.traders || []), "copytrading_statistics" === o.msg_type) P(o.copytrading_statistics || {});
                            else if ("balance" === i.msg_type) {
                                if (i.error) {
                                    if (console.error("Balance request error:", i.error), v(""), "acct1" === e) {
                                        let e = sessionStorage.getItem("acct1"),
                                            t = sessionStorage.getItem("cur1");
                                        f(e ? `${e}${t}` : "create or/switch to demo")
                                    } else if ("acct2" === e) {
                                        let e = sessionStorage.getItem("acct2"),
                                            t = sessionStorage.getItem("cur2");
                                        f(e ? `${e}${t}` : "Demo Acct - No Account")
                                    }
                                } else if ("acct1" === e) {
                                    let e = sessionStorage.getItem("acct1");
                                    sessionStorage.getItem("cur1"), f(e || ""), v(`Balance: ${i.balance.balance} USD`)
                                } else if ("acct2" === e) {
                                    let e = sessionStorage.getItem("acct2");
                                    sessionStorage.getItem("cur2"), f(e || ""), v(`Balance: ${i.balance.balance} USD`)
                                }
                            } else console.log("received message: ", i)
                        }), r.addEventListener("close", e => {
                            i(), console.log("websocket connection closed: ", e), h(!1), u(!1)
                        }), r.addEventListener("error", e => {
                            console.log("an error happened in our websocket connection", e)
                        }), E(r)
                    };
                    return (0, r.useEffect)(() => {
                        (async () => {
                            let e = sessionStorage.getItem("selectedAccount") || "acct1";
                            k(e);
                            let t = localStorage.getItem("authToken");
                            t ? (T(t), F(e)) : console.error("No auth token found")
                        })()
                    }, []), (0, r.useEffect)(() => {
                        e && p && R()
                    }, [e, p]), (0, r.useEffect)(() => {
                        if (!w) {
                            let e = localStorage.getItem("authToken");
                            e ? T(e) : console.error("User not authenticated")
                        }
                    }, [w]), (0, r.useEffect)(() => {
                        let e = e => {
                            "authToken" === e.key && T(e.newValue || "")
                        };
                        return window.addEventListener("storage", e), () => window.removeEventListener("storage", e)
                    }, []), (0, r.useEffect)(() => {
                        let e = () => {
                                let e = new Date;
                                e.getHours(), e.getMinutes(), e.getMonth(), e.getDate(), e.getFullYear()
                            },
                            t = setInterval(e, 6e4);
                        return e(), () => clearInterval(t)
                    }, []), (0, a.jsx)("div", {
                        className: "copy-trading",
                        children: (0, a.jsxs)("div", {
                            className: "copy-trading__content",
                            children: [(0, a.jsx)("div", {
                                className: "top-navbar",
                                children: (0, a.jsxs)("div", {
                                    className: "inner-nav",
                                    children: [(0, a.jsx)("div", {
                                        className: "row"
                                    }), (0, a.jsxs)("div", {
                                        className: "balance",
                                        children: [(0, a.jsx)("p", {
                                            children: b
                                        }), (0, a.jsx)("p", {
                                            children: j
                                        })]
                                    }), (0, a.jsx)("div", {
                                        className: "status",
                                        children: (0, a.jsxs)("div", {
                                            className: "status-item",
                                            children: [(0, a.jsx)("span", {
                                                children: "Status"
                                            }), (0, a.jsx)("div", {
                                                id: "websocket-status-indicator",
                                                className: `status-indicator ${g?"online":"offline"}`
                                            })]
                                        })
                                    })]
                                })
                            }), (0, a.jsx)("div", {
                                className: "tab-container",
                                children: (0, a.jsx)("div", {
                                    className: "tab-content",
                                    children: (0, a.jsx)("div", {
                                        className: "trading-hub",
                                        children: (0, a.jsxs)("div", {
                                            className: "hub-content",
                                            children: [(0, a.jsxs)("div", {
                                                className: "cards-grid",
                                                children: [(0, a.jsxs)("div", {
                                                    id: "trading-options",
                                                    className: "hub-card config-card",
                                                    children: [(0, a.jsx)("div", {
                                                        className: "card-shine"
                                                    }), (0, a.jsxs)("div", {
                                                        className: "hub-card-header",
                                                        children: [(0, a.jsx)("div", {
                                                            className: "card-title",
                                                            children: "TRADING SETUP"
                                                        }), (0, a.jsxs)("div", {
                                                            className: "card-controls",
                                                            children: [(0, a.jsx)("div", {
                                                                className: "control-dot"
                                                            }), (0, a.jsx)("div", {
                                                                className: "control-dot"
                                                            }), (0, a.jsx)("div", {
                                                                className: "control-dot"
                                                            })]
                                                        })]
                                                    }), (0, a.jsxs)("div", {
                                                        id: "copy-trading-settings",
                                                        className: "hub-card-content",
                                                        children: [(0, a.jsxs)("div", {
                                                            className: "trader-selection",
                                                            children: [(0, a.jsx)("label", {
                                                                className: "neon-label",
                                                                children: "MANAGE TRADER TOKENS"
                                                            }), (0, a.jsxs)("div", {
                                                                className: "token-input-group",
                                                                children: [(0, a.jsx)("input", {
                                                                    type: "text",
                                                                    id: "tokenInput",
                                                                    className: "futuristic-input",
                                                                    placeholder: "Enter trader auth token",
                                                                    value: i,
                                                                    onChange: e => o(e.target.value)
                                                                }), (0, a.jsx)("button", {
                                                                    id: "addTokenBtn",
                                                                    className: "token-action-btn",
                                                                    onClick: W,
                                                                    children: "Add"
                                                                }), (0, a.jsxs)("button", {
                                                                    id: "syncBtn",
                                                                    className: "token-action-btn sync-btn",
                                                                    onClick: () => {
                                                                        window.location.reload()
                                                                    },
                                                                    children: ["Reload ", (0, a.jsx)(m.Z, {
                                                                        style: {
                                                                            fontSize: "1.2rem"
                                                                        }
                                                                    })]
                                                                })]
                                                            }), l.text && (0, a.jsx)("p", {
                                                                id: "copy-trading-status",
                                                                className: `copy-trading-status ${l.className}`,
                                                                children: l.text
                                                            }), (0, a.jsx)("div", {
                                                                id: "tokenListContainer",
                                                                className: "token-list-container",
                                                                ref: D,
                                                                children: 0 === s.length ? (0, a.jsx)("div", {
                                                                    className: "empty-list-message",
                                                                    children: "No tokens added yet"
                                                                }) : s.map((e, t) => (0, a.jsxs)("div", {
                                                                    className: "token-item",
                                                                    children: [(0, a.jsxs)("div", {
                                                                        children: [(0, a.jsx)("span", {
                                                                            className: "token-text",
                                                                            children: U(e)
                                                                        }), (0, a.jsx)("span", {
                                                                            className: `token-status ${e.status}`,
                                                                            children: "success" === e.status ? (0, a.jsx)("span", {
                                                                                style: {
                                                                                    color: "#212121",
                                                                                    backgroundColor: "rgba(0, 255, 157, 0.7)",
                                                                                    padding: "2px 6px",
                                                                                    borderRadius: "3px",
                                                                                    fontWeight: 500
                                                                                },
                                                                                children: "Trader Active ✓"
                                                                            }) : "error" === e.status ? (0, a.jsx)("span", {
                                                                                style: {
                                                                                    color: "#212121",
                                                                                    backgroundColor: "rgba(255, 58, 58, 0.7)",
                                                                                    padding: "2px 6px",
                                                                                    borderRadius: "3px",
                                                                                    fontWeight: 500
                                                                                },
                                                                                children: "Configuration Error ⚠️"
                                                                            }) : (0, a.jsx)("span", {
                                                                                style: {
                                                                                    color: "#212121",
                                                                                    backgroundColor: "rgba(255, 204, 0, 0.7)",
                                                                                    padding: "2px 6px",
                                                                                    borderRadius: "3px",
                                                                                    fontWeight: 500
                                                                                },
                                                                                children: "Awaiting Activation"
                                                                            })
                                                                        })]
                                                                    }), (0, a.jsx)("span", {
                                                                        className: "remove-token",
                                                                        title: "Stop Copy Trading",
                                                                        onClick: () => B(t),
                                                                        children: "\xd7"
                                                                    })]
                                                                }, t))
                                                            })]
                                                        }), (0, a.jsxs)("div", {
                                                            className: "button-container",
                                                            style: {
                                                                display: "none"
                                                            },
                                                            children: [(0, a.jsxs)("button", {
                                                                id: "start-copy-trading",
                                                                className: "cyber-button activate",
                                                                onClick: M,
                                                                children: [(0, a.jsx)("span", {
                                                                    className: "button-text",
                                                                    children: "START COPY TRADING"
                                                                }), (0, a.jsx)("span", {
                                                                    className: "button-glitch"
                                                                })]
                                                            }), (0, a.jsxs)("button", {
                                                                id: "stop-copy-trading",
                                                                className: "cyber-button deactivate",
                                                                onClick: Y,
                                                                children: [(0, a.jsx)("span", {
                                                                    className: "button-text",
                                                                    children: "STOP COPY TRADING"
                                                                }), (0, a.jsx)("span", {
                                                                    className: "button-glitch"
                                                                })]
                                                            }), (0, a.jsxs)("button", {
                                                                id: "allow-copy",
                                                                className: "cyber-button",
                                                                onClick: () => {
                                                                    console.log("Allow Copy Clicked"), null == _ || _.send(JSON.stringify({
                                                                        authorize: w,
                                                                        req_id: 9998
                                                                    }));
                                                                    let e = t => {
                                                                        let s = JSON.parse(t.data);
                                                                        "authorize" === s.msg_type && 9998 === s.req_id && (s.error ? console.error("Authorization failed:", s.error) : null == _ || _.send(JSON.stringify({
                                                                            set_settings: 1,
                                                                            allow_copiers: 1
                                                                        })), null == _ || _.removeEventListener("message", e))
                                                                    };
                                                                    null == _ || _.addEventListener("message", e)
                                                                },
                                                                children: [(0, a.jsx)("span", {
                                                                    className: "button-text",
                                                                    children: "ALLOW COPY"
                                                                }), (0, a.jsx)("span", {
                                                                    className: "button-glitch"
                                                                })]
                                                            }), (0, a.jsxs)("button", {
                                                                id: "disallow-copy",
                                                                className: "cyber-button secondary",
                                                                onClick: () => {
                                                                    console.log("Disallow Copy Clicked"), null == _ || _.send(JSON.stringify({
                                                                        authorize: w,
                                                                        req_id: 9997
                                                                    }));
                                                                    let e = t => {
                                                                        let s = JSON.parse(t.data);
                                                                        "authorize" === s.msg_type && 9997 === s.req_id && (s.error ? console.error("Authorization failed:", s.error) : null == _ || _.send(JSON.stringify({
                                                                            set_settings: 1,
                                                                            allow_copiers: 0
                                                                        })), null == _ || _.removeEventListener("message", e))
                                                                    };
                                                                    null == _ || _.addEventListener("message", e)
                                                                },
                                                                children: [(0, a.jsx)("span", {
                                                                    className: "button-text",
                                                                    children: "DIS-ALLOW COPY"
                                                                }), (0, a.jsx)("span", {
                                                                    className: "button-glitch"
                                                                })]
                                                            })]
                                                        })]
                                                    })]
                                                }), (0, a.jsxs)("div", {
                                                    id: "copy-trading-list",
                                                    className: "hub-card results-card",
                                                    children: [(0, a.jsx)("div", {
                                                        className: "card-shine"
                                                    }), (0, a.jsxs)("div", {
                                                        className: "hub-card-header",
                                                        children: [(0, a.jsx)("div", {
                                                            className: "card-title",
                                                            children: "TRADE ANALYTICS"
                                                        }), (0, a.jsx)("div", {
                                                            className: "card-status",
                                                            children: "LIVE"
                                                        })]
                                                    }), (0, a.jsxs)("div", {
                                                        className: "hub-card-content",
                                                        children: [(0, a.jsxs)("div", {
                                                            className: "data-tabs",
                                                            children: [(0, a.jsx)("div", {
                                                                className: `data-tab ${"trader-list"===L?"active":""}`,
                                                                "data-target": "trader-list",
                                                                onClick: () => J("trader-list"),
                                                                children: "Trader Data"
                                                            }), (0, a.jsx)("div", {
                                                                className: `data-tab ${"trading-stats"===L?"active":""}`,
                                                                "data-target": "trading-stats",
                                                                onClick: () => J("trading-stats"),
                                                                children: "Statistics"
                                                            })]
                                                        }), (0, a.jsxs)("div", {
                                                            className: "data-content-wrapper",
                                                            children: [(0, a.jsx)("div", {
                                                                id: "copy-trading-list-container",
                                                                className: `data-container ${"trader-list"===L?"active":""}`,
                                                                children: 0 === q.length ? (0, a.jsx)("div", {
                                                                    className: "placeholder-text",
                                                                    children: "Awaiting trader data..."
                                                                }) : (0, a.jsx)("ul", {
                                                                    style: {
                                                                        listStyleType: "none",
                                                                        padding: 0
                                                                    },
                                                                    children: q.map((e, t) => {
                                                                        var s;
                                                                        return (0, a.jsxs)("li", {
                                                                            style: {
                                                                                marginBottom: "10px"
                                                                            },
                                                                            children: [(0, a.jsx)("strong", {
                                                                                children: "Linked Copy Trader:"
                                                                            }), " ", "VRTC8609996" === e.loginid ? "ELITESCOPE TRADERS" : e.loginid, " ", (0, a.jsx)("br", {}), (0, a.jsx)("strong", {
                                                                                children: "Assets:"
                                                                            }), " ", (null === (s = e.assets) || void 0 === s ? void 0 : s.map(e => "*" === e ? "ALL ASSETS" : e).join(", ")) || "N/A", " ", (0, a.jsx)("br", {}), (0, a.jsx)("strong", {
                                                                                children: "Max Trade Stake:"
                                                                            }), " ", e.max_trade_stake || "N/A", " ", (0, a.jsx)("br", {}), (0, a.jsx)("strong", {
                                                                                children: "Min Trade Stake:"
                                                                            }), " ", e.min_trade_stake || "N/A", " ", (0, a.jsx)("br", {})]
                                                                        }, t)
                                                                    })
                                                                })
                                                            }), (0, a.jsx)("div", {
                                                                id: "copy-trading-stats-container",
                                                                className: `data-container stats-container ${"trading-stats"===L?"active":""}`,
                                                                children: 0 === Object.keys(z).length ? (0, a.jsx)("div", {
                                                                    className: "placeholder-text",
                                                                    children: "Calculating statistics..."
                                                                }) : (0, a.jsxs)("table", {
                                                                    style: {
                                                                        width: "100%",
                                                                        borderCollapse: "collapse"
                                                                    },
                                                                    children: [(0, a.jsx)("thead", {
                                                                        children: (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("th", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: "Statistic"
                                                                            }), (0, a.jsx)("th", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: "Value"
                                                                            })]
                                                                        })
                                                                    }), (0, a.jsxs)("tbody", {
                                                                        children: [z.active_since && (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Active Since"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: new Date(1e3 * z.active_since).toLocaleDateString()
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Average Duration"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.avg_duration || "N/A"
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Average Loss"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.avg_loss || "N/A"
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Average Profit"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.avg_profit || "N/A"
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Number of Copiers"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.copiers || "N/A"
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Total Trades"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.total_trades || "N/A"
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Trades Profitable"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.trades_profitable || "N/A"
                                                                            })]
                                                                        }), (0, a.jsxs)("tr", {
                                                                            children: [(0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: (0, a.jsx)("strong", {
                                                                                    children: "Performance Probability"
                                                                                })
                                                                            }), (0, a.jsx)("td", {
                                                                                style: {
                                                                                    border: "1px solid #ddd",
                                                                                    padding: "8px"
                                                                                },
                                                                                children: z.performance_probability || "N/A"
                                                                            })]
                                                                        }), z.monthly_profitable_trades && Object.entries(z.monthly_profitable_trades).map(e => {
                                                                            let [t, s] = e;
                                                                            return (0, a.jsxs)("tr", {
                                                                                children: [(0, a.jsx)("td", {
                                                                                    style: {
                                                                                        border: "1px solid #ddd",
                                                                                        padding: "8px"
                                                                                    },
                                                                                    children: (0, a.jsxs)("strong", {
                                                                                        children: ["Monthly Profit - ", t]
                                                                                    })
                                                                                }), (0, a.jsx)("td", {
                                                                                    style: {
                                                                                        border: "1px solid #ddd",
                                                                                        padding: "8px"
                                                                                    },
                                                                                    children: String(s)
                                                                                })]
                                                                            }, `month-${t}`)
                                                                        }), z.yearly_profitable_trades && Object.entries(z.yearly_profitable_trades).map(e => {
                                                                            let [t, s] = e;
                                                                            return (0, a.jsxs)("tr", {
                                                                                children: [(0, a.jsx)("td", {
                                                                                    style: {
                                                                                        border: "1px solid #ddd",
                                                                                        padding: "8px"
                                                                                    },
                                                                                    children: (0, a.jsxs)("strong", {
                                                                                        children: ["Yearly Profit - ", t]
                                                                                    })
                                                                                }), (0, a.jsx)("td", {
                                                                                    style: {
                                                                                        border: "1px solid #ddd",
                                                                                        padding: "8px"
                                                                                    },
                                                                                    children: String(s)
                                                                                })]
                                                                            }, `year-${t}`)
                                                                        })]
                                                                    })]
                                                                })
                                                            })]
                                                        })]
                                                    })]
                                                })]
                                            }), (0, a.jsxs)("div", {
                                                className: "status-bar",
                                                children: [(0, a.jsxs)("div", {
                                                    className: "status-item",
                                                    children: [(0, a.jsx)("span", {
                                                        className: "status-label",
                                                        children: "CONNECTION:"
                                                    }), (0, a.jsx)("span", {
                                                        className: "status-value good",
                                                        children: "SECURE"
                                                    })]
                                                }), (0, a.jsxs)("div", {
                                                    className: "status-item",
                                                    children: [(0, a.jsx)("span", {
                                                        className: "status-label",
                                                        children: "LATENCY:"
                                                    }), (0, a.jsx)("span", {
                                                        className: "status-value good",
                                                        children: "23ms"
                                                    })]
                                                }), (0, a.jsxs)("div", {
                                                    className: "status-item",
                                                    children: [(0, a.jsx)("span", {
                                                        className: "status-label",
                                                        children: "LAST UPDATE:"
                                                    }), (0, a.jsx)("span", {
                                                        className: "status-value",
                                                        children: "JUST NOW"
                                                    })]
                                                })]
                                            })]
                                        })
                                    })
                                })
                            })]
                        })
                    })
                }),
                v = (0, g.ZF)({
                    apiKey: "AIzaSyBSvoI9s0EJNXAYiSj0aiLZJxr-JAxa7q8",
                    authDomain: "bot-analysis-tool-belex.firebaseapp.com",
                    projectId: "bot-analysis-tool-belex",
                    storageBucket: "bot-analysis-tool-belex.appspot.com",
                    messagingSenderId: "1088891054402",
                    appId: "1:1088891054402:web:b28fde06f1f060fd1000db"
                }),
                b = (0, u.ad)(v),
                f = async e => {
                    let t = (0, u.JU)(b, "authTokens", e),
                        s = await (0, u.QT)(t);
                    return s.exists() ? s.data().tokens : []
                },
                S = async (e, t) => {
                    let s = (0, u.JU)(b, "authTokens", e);
                    await (0, u.pl)(s, {
                        tokens: t
                    }, {
                        merge: !0
                    })
                },
                k = (0, c.Pi)(() => {
                    let [e, t] = (0, r.useState)(null), [s, n] = (0, r.useState)("real" === localStorage.getItem("tradingMode")), [i, o] = (0, r.useState)([]), [l, c] = (0, r.useState)(""), [g, u] = (0, r.useState)(!1), [p, h] = (0, r.useState)(!1), [x, N] = (0, r.useState)(""), [y, j] = (0, r.useState)(""), [v, b] = (0, r.useState)("acct1"), [k, _] = (0, r.useState)(null), [E, w] = (0, r.useState)(localStorage.getItem("authToken") || ""), T = (0, r.useRef)(null), A = async () => {
                        if (e) try {
                            let t = await f(e);
                            o(t)
                        } catch (e) {
                            console.error("Error loading tokens:", e)
                        }
                    }, I = e => "string" != typeof e ? "Invalid Token" : e.length <= 8 ? e : e.substring(0, 4) + "..." + e.substring(e.length - 4), C = async () => {
                        if (!e) {
                            alert("Please authorize your main account first");
                            return
                        }
                        let t = l.trim();
                        if (t) try {
                            let s = await f(e);
                            if (s.some(e => e === t)) {
                                alert("This token is already added");
                                return
                            }
                            let a = [...s, t];
                            await S(e, a), o(a), c("")
                        } catch (e) {
                            console.error("Error adding token:", e), alert("Failed to add token")
                        }
                    }, O = async t => {
                        if (e) try {
                            let s = i.filter((e, s) => s !== t);
                            await S(e, s), o(s)
                        } catch (e) {
                            console.error("Error removing token:", e), alert("Failed to remove token")
                        }
                    }, L = e => {
                        b(e), sessionStorage.setItem("selectedAccount", e), k && k.close(), w("acct1" === e ? sessionStorage.getItem("token1") || "" : sessionStorage.getItem("token2") || "");
                        let s = (0, d.rh)(),
                            a = new WebSocket(`wss://ws.derivws.com/websockets/v3?app_id=${s}`);
                        a.addEventListener("open", e => {
                            console.log("Websocket connection established:", e), u(!0);
                            let t = localStorage.getItem("authToken") || "";
                            if (w(t), !t) {
                                console.error("WebSocket connection failed: No auth token");
                                return
                            }
                            let s = JSON.stringify({
                                authorize: t,
                                req_id: 9999
                            });
                            a.send(s)
                        }), a.addEventListener("message", s => {
                            let r = JSON.parse(s.data);
                            if ("authorize" === r.msg_type && 9999 === r.req_id) {
                                console.log("Main account authorization successful:", r), h(!0), t(r.authorize.loginid), A();
                                let s = JSON.stringify({
                                    balance: 1,
                                    account: "current",
                                    subscribe: 1,
                                    passthrough: {},
                                    req_id: 1
                                });
                                a.send(s), "acct1" === e ? j(sessionStorage.getItem("acct1") || "") : "acct2" === e && j(sessionStorage.getItem("acct2") || "")
                            } else if ("balance" === r.msg_type) {
                                if (r.error) {
                                    if (console.error("Balance request error:", r.error), N(""), "acct1" === e) {
                                        let e = sessionStorage.getItem("acct1"),
                                            t = sessionStorage.getItem("cur1");
                                        j(e ? `${e}${t}` : "create or/switch to demo")
                                    } else if ("acct2" === e) {
                                        let e = sessionStorage.getItem("acct2"),
                                            t = sessionStorage.getItem("cur2");
                                        j(e ? `${e}${t}` : "Demo Acct - No Account")
                                    }
                                } else if ("acct1" === e) {
                                    let e = sessionStorage.getItem("acct1");
                                    sessionStorage.getItem("cur1"), j(e || ""), N(`Balance: ${r.balance.balance} USD`)
                                } else if ("acct2" === e) {
                                    let e = sessionStorage.getItem("acct2");
                                    sessionStorage.getItem("cur2"), j(e || ""), N(`Balance: ${r.balance.balance} USD`)
                                }
                            }
                        }), a.addEventListener("close", e => {
                            console.log("websocket connection closed: ", e), h(!1), u(!1)
                        }), a.addEventListener("error", e => {
                            console.log("an error happened in our websocket connection", e)
                        }), _(a)
                    };
                    return (0, r.useEffect)(() => {
                        (async () => {
                            let e = sessionStorage.getItem("selectedAccount") || "acct1";
                            b(e);
                            let t = localStorage.getItem("authToken");
                            t ? (w(t), L(e)) : console.error("No auth token found")
                        })()
                    }, []), (0, r.useEffect)(() => {
                        e && p && A()
                    }, [e, p]), (0, r.useEffect)(() => {
                        localStorage.setItem("tradingMode", s ? "real" : "demo")
                    }, [s]), (0, a.jsx)("div", {
                        className: "copy-trading",
                        children: (0, a.jsxs)("div", {
                            className: "copy-trading__content",
                            children: [(0, a.jsx)("div", {
                                className: "top-navbar",
                                children: (0, a.jsxs)("div", {
                                    className: "inner-nav",
                                    children: [(0, a.jsx)("div", {
                                        className: "row"
                                    }), (0, a.jsxs)("div", {
                                        className: "balance",
                                        children: [(0, a.jsx)("p", {
                                            children: y
                                        }), (0, a.jsx)("p", {
                                            children: x
                                        })]
                                    }), (0, a.jsx)("div", {
                                        className: "status",
                                        children: (0, a.jsxs)("div", {
                                            className: "status-item",
                                            children: [(0, a.jsx)("span", {
                                                children: "Status"
                                            }), (0, a.jsx)("div", {
                                                id: "websocket-status-indicator",
                                                className: `status-indicator ${g?"online":"offline"}`
                                            })]
                                        })
                                    })]
                                })
                            }), (0, a.jsx)("div", {
                                className: "tab-container",
                                children: (0, a.jsx)("div", {
                                    className: "tab-content",
                                    children: (0, a.jsx)("div", {
                                        className: "trading-hub",
                                        children: (0, a.jsxs)("div", {
                                            className: "hub-content",
                                            children: [(0, a.jsx)("div", {
                                                className: "cards-grid",
                                                children: (0, a.jsxs)("div", {
                                                    className: "hub-card config-card",
                                                    children: [(0, a.jsx)("div", {
                                                        className: "card-shine"
                                                    }), (0, a.jsxs)("div", {
                                                        className: "hub-card-header",
                                                        children: [(0, a.jsx)("div", {
                                                            className: "card-title",
                                                            children: "TRADING SETUP"
                                                        }), (0, a.jsxs)("div", {
                                                            className: "trading-mode-switch",
                                                            children: [(0, a.jsx)("span", {
                                                                className: "mode-label",
                                                                children: "OFF"
                                                            }), (0, a.jsxs)("label", {
                                                                className: "switch",
                                                                children: [(0, a.jsx)("input", {
                                                                    type: "checkbox",
                                                                    checked: s,
                                                                    onChange: () => n(!s)
                                                                }), (0, a.jsx)("span", {
                                                                    className: "slider round"
                                                                })]
                                                            }), (0, a.jsx)("span", {
                                                                className: "mode-label",
                                                                children: "ON"
                                                            })]
                                                        }), (0, a.jsxs)("div", {
                                                            className: "card-controls",
                                                            children: [(0, a.jsx)("div", {
                                                                className: "control-dot"
                                                            }), (0, a.jsx)("div", {
                                                                className: "control-dot"
                                                            }), (0, a.jsx)("div", {
                                                                className: "control-dot"
                                                            })]
                                                        })]
                                                    }), (0, a.jsx)("div", {
                                                        className: "hub-card-content",
                                                        children: (0, a.jsxs)("div", {
                                                            className: "trader-selection",
                                                            children: [(0, a.jsx)("label", {
                                                                className: "neon-label",
                                                                children: "MANAGE TRADER TOKENS"
                                                            }), (0, a.jsxs)("div", {
                                                                className: "token-input-group",
                                                                children: [(0, a.jsx)("input", {
                                                                    type: "text",
                                                                    className: "futuristic-input",
                                                                    placeholder: "Enter trader auth token",
                                                                    value: l,
                                                                    onChange: e => c(e.target.value)
                                                                }), (0, a.jsx)("button", {
                                                                    className: "token-action-btn",
                                                                    onClick: C,
                                                                    children: "Add"
                                                                }), (0, a.jsxs)("button", {
                                                                    className: "token-action-btn sync-btn",
                                                                    onClick: () => A(),
                                                                    children: ["Refresh ", (0, a.jsx)(m.Z, {
                                                                        style: {
                                                                            fontSize: "1.2rem"
                                                                        }
                                                                    })]
                                                                })]
                                                            }), (0, a.jsx)("div", {
                                                                className: "token-list-container",
                                                                ref: T,
                                                                children: 0 === i.length ? (0, a.jsx)("div", {
                                                                    className: "empty-list-message",
                                                                    children: "No tokens added yet"
                                                                }) : i.map((e, t) => (0, a.jsxs)("div", {
                                                                    className: "token-item",
                                                                    children: [(0, a.jsx)("div", {
                                                                        children: (0, a.jsx)("span", {
                                                                            className: "token-text",
                                                                            children: I(e)
                                                                        })
                                                                    }), (0, a.jsx)("span", {
                                                                        className: "remove-token",
                                                                        title: "Remove Token",
                                                                        onClick: () => O(t),
                                                                        children: "\xd7"
                                                                    })]
                                                                }, t))
                                                            })]
                                                        })
                                                    })]
                                                })
                                            }), (0, a.jsxs)("div", {
                                                className: "status-bar",
                                                children: [(0, a.jsxs)("div", {
                                                    className: "status-item",
                                                    children: [(0, a.jsx)("span", {
                                                        className: "status-label",
                                                        children: "CONNECTION:"
                                                    }), (0, a.jsx)("span", {
                                                        className: "status-value good",
                                                        children: "SECURE"
                                                    })]
                                                }), (0, a.jsxs)("div", {
                                                    className: "status-item",
                                                    children: [(0, a.jsx)("span", {
                                                        className: "status-label",
                                                        children: "LATENCY:"
                                                    }), (0, a.jsx)("span", {
                                                        className: "status-value good",
                                                        children: "23ms"
                                                    })]
                                                }), (0, a.jsxs)("div", {
                                                    className: "status-item",
                                                    children: [(0, a.jsx)("span", {
                                                        className: "status-label",
                                                        children: "LAST UPDATE:"
                                                    }), (0, a.jsx)("span", {
                                                        className: "status-value",
                                                        children: "JUST NOW"
                                                    })]
                                                })]
                                            })]
                                        })
                                    })
                                })
                            })]
                        })
                    })
                }),
                _ = (0, n.ZP)("div")({
                    width: "100%",
                    maxWidth: "100%",
                    margin: 0,
                    padding: 0,
                    overflowX: "hidden"
                }),
                E = (0, n.ZP)(i.Z)({
                    "& .MuiTabs-indicator": {
                        backgroundColor: "#00ff9d",
                        height: 3
                    },
                    width: "100%"
                }),
                w = (0, n.ZP)(o.Z)({
                    color: "#aaa",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    "&.Mui-selected": {
                        color: "#00ff9d"
                    }
                });

            function T(e) {
                let {
                    children: t,
                    value: s,
                    index: r,
                    ...n
                } = e;
                return (0, a.jsx)("div", {
                    role: "tabpanel",
                    hidden: s !== r,
                    id: `copy-trading-tabpanel-${r}`,
                    "aria-labelledby": `copy-trading-tab-${r}`,
                    style: {
                        width: "100%"
                    },
                    ...n,
                    children: s === r && (0, a.jsx)(l.Z, {
                        sx: {
                            p: 0,
                            width: "100%"
                        },
                        children: t
                    })
                })
            }
            let A = () => {
                let [e, t] = (0, r.useState)(0);
                return (0, a.jsxs)(_, {
                    children: [" ", (0, a.jsx)(l.Z, {
                        sx: {
                            borderBottom: 1,
                            borderColor: "divider",
                            mb: 3,
                            width: "100%"
                        },
                        children: (0, a.jsxs)(E, {
                            value: e,
                            onChange: (e, s) => {
                                t(s)
                            },
                            children: [(0, a.jsx)(w, {
                                label: "Normal Copy Trading"
                            }), (0, a.jsx)(w, {
                                label: "Demo to Real"
                            })]
                        })
                    }), (0, a.jsx)(T, {
                        value: e,
                        index: 0,
                        children: (0, a.jsx)(l.Z, {
                            sx: {
                                width: "100%"
                            },
                            children: (0, a.jsx)(j, {})
                        })
                    }), (0, a.jsx)(T, {
                        value: e,
                        index: 1,
                        children: (0, a.jsx)(l.Z, {
                            sx: {
                                width: "100%"
                            },
                            children: (0, a.jsx)(k, {})
                        })
                    })]
                })
            }
        }
    }
]);