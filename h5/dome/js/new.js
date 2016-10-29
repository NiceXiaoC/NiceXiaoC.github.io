define("services/util", [],
function() {
    return {
        params: function(e) {
            var i, n, t, s, a, o, d, c = "";
            for (i in e) if (n = e[i], n instanceof Array) for (d = 0; d < n.length; ++d) a = n[d],
            t = i + "[" + d + "]",
            o = {},
            o[t] = a,
            c += param(o) + "&";
            else if (n instanceof Object) for (s in n) a = n[s],
            t = i + "[" + s + "]",
            o = {},
            o[t] = a,
            c += param(o) + "&";
            else void 0 !== n && null !== n && (c += encodeURIComponent(i) + "=" + encodeURIComponent(n) + "&");
            return c.length ? c.substr(0, c.length - 1) : c
        },
        GA: function(e, i) {
            this.gaSend(e, i, "click")
        },
        gaSend: function(e, i, n) {
            ga("send", "event", e, i, n)
        },
        gaTemp: function(e, i, n, t) {
            return _.template("<%= data.date %>|<%= data.time %>|<%= data.title %>|<%= data.id %>", {
                variable: "data"
            })({
                date: "无" | e,
                time: "无" | i,
                title: "无" | n,
                id: "无" | t
            })
        },
        gaType: function(e, i) {
            return _.template("<%= data.type %>|<%= data.video_mlen %>", {
                variable: "data"
            })({
                type: e,
                video_mlen: i
            })
        },
        getCookie: function(e) {
            for (var i = document.cookie.split("; "), n = 0; n < i.length; n++) {
                var t = i[n].split("=");
                if (t[0] == e) return unescape(t[1])
            }
            return ""
        },
        delCoolie: function(e) {
            var i = new Date;
            i.setTime(i.getTime() - 1);
            var n = this.getCookie(e);
            document.cookie = e + "=" + n + "/domain=.budejie.com;path=/;expires=" + i.toGMTString()
        },
        isWin: function() {
            return "Win32" == navigator.platform || "Windows" == navigator.platform
        },
        isPad: function() {
            return navigator.userAgent.match(/ipad/gi)
        },
        isWinClient: function() {
            if (this.isWin()) {
                var e = navigator.userAgent;
                if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(e)) {
                    if ("NT" != RegExp.$1) return ! 1;
                    switch (RegExp.$2) {
                    case "6.3":
                        return ! 0;
                    case "10.0":
                        return console.log("win 10"),
                        !0;
                    default:
                        return ! 1
                    }
                }
                return ! 1
            }
            return ! 1
        }
    }
}),
define("services/dialog", ["dialog", "services/util"],
function(e, i) {
    return {
        iSiPad: function() {
            return navigator.userAgent.match(/ipad/gi)
        },
        iSwIn10: function() {
            return navigator.userAgent.match(/Windows NT 10.0/i)
        },
        isMac: function() {
            return /macintosh|mac os x/i.test(navigator.userAgent)
        },
        openDialogQr: function() {
            var n;
            n = this.iSiPad() ? {
                innerHTML: this.getIpadTemp(),
                height: 190,
                width: 430
            }: i.isWinClient() ? {
                innerHTML: this.getWin10Temp(),
                height: 190,
                width: 430
            }: this.isMac() > 0 ? {
                innerHTML: this.getMacTemp(),
                height: 190,
                width: 430
            }: {
                content: this.getPcTemp(),
                height: 330,
                width: 312,
                title: "更多功能请下载百思不得姐客户端"
            };
            var t = new e(n);
            t.showModal(),
            $(".iPad-dialog-header").on("click",
            function() {
                t.close()
            }),
            this.iSiPad() && $("div.iPad-dialog i.icon-hd-download").on("click",
            function() {
                window.location.href = "http://www.budejie.com/budejie/guide.html?pc_hd_tanceng=&utm_source=pc_hd&utm_medium=tanceng&utm_campaign=hd"
            }),
            i.isWinClient() && $("div.win10-dialog i.icon-win10-download").on("click",
            function() {
                window.open("http://www.budejie.com/budejie/guide.html?pc_hd_tanceng=&utm_source=pc_win&utm_medium=tanceng&utm_campaign=win")
            }),
            this.isMac() && $("div.mac-dialog i.icon-mac-download").on("click",
            function() {
                window.open("http://www.budejie.com/budejie/guide.html?pc_hd_tanceng=&utm_source=pc_mac&utm_medium=tanceng&utm_campaign=mac")
            }),
            $(".ui-popup-backdrop").on("click",
            function() {
                t.close()
            })
        },
        getPcTemp: function() {
            return '<div class="d-c default" style="width: 310px; ">\n    <div class="d-c-qr">\n        <i class="icon-d-qr"></i>\n    </div>\n    <div class="d-c-txt">扫二维码&nbsp;&nbsp;用手机看百思</div>\n</div>'
        },
        getIpadTemp: function() {
            return '<div class="iPad-dialog" i="dialog">\n<div class="iPad-dialog-header"><i class="icon-hd-dialog-close"></i></div><div class="iPad-dialog-c"><i class="icon-hd-download" ></i></div></div>'
        },
        getWin10Temp: function() {
            return '<div class="iPad-dialog win10-dialog" i="dialog"><div class="iPad-dialog-header"><i class="icon-hd-dialog-close"></i></div><div class="iPad-dialog-c"><i class="icon-hd-download icon-win10-download" ></i></div></div>'
        },
        getMacTemp: function() {
            return '<div class="iPad-dialog mac-dialog" i="dialog"><div class="iPad-dialog-header"><i class="icon-hd-dialog-close"></i></div><div class="iPad-dialog-c"><i class="icon-hd-download icon-mac-download" ></i></div></div>'
        },
        openDiffDialogQr: function(i, n, t) {
            var s = e({
                title: i,
                content: this.getPcDiffTemp(n, t),
                height: 330,
                width: 312
            });
            s.showModal(),
            $(".ui-popup-backdrop").on("click",
            function() {
                s.close()
            })
        },
        getPcDiffTemp: function(e, i) {
            return '<div class="d-c default" style="width: 310px; ">\n    <div class="d-c-qr">\n        <i class="icon-d-qr ' + e + '"></i>\n    </div>\n    <div class="d-c-txt">' + i + "</div>\n</div>"
        },
        openVideoDialog: function() {
            var i = e({
                content: "用百思app下载视频，体验更流畅哦！"
            });
            i.show(),
            setTimeout(function() {
                i.close().remove()
            },
            3e3)
        }
    }
}),
define("services/player", ["jwplayer", "services/util", "store", "slide"],
function(e, i, n) {
    var t = function(e, i, n, t, s) {
        this.width = 566,
        this.height = 360,
        this.type = t,
        this.poster = n,
        this.mediaSrc = i,
        this.id = e,
        this.pid = s,
        this.playerInstance = null,
        !_.isUndefined(this.id) && this.id.length > 0 && this.init()
    };
    return t.prototype = {
        init: function() {
            var t = this,
            s = "audio" === this.type ? "skin/five-audio.xml": "skin/five-video.xml";
            this.playerInstance = e(this.id),
            this.playerInstance.setup({
                flashplayer: "http://wimg.spriteapp.cn/pc/jwplayer/jwplayer.flash.swf",
                file: this.mediaSrc,
                image: this.poster,
                skin: "http://wimg.spriteapp.cn/pc/jwplayer/" + s,
                width: this.width,
                height: this.height,
                events: {
                    onComplete: function() {
                        t.ended();
                        var e = $("#" + t.id).parents(".j-video-c"),
                        s = e.data("id"),
                        a = n.get("w3_ga_play_ended_" + s);
                        a || (i.gaSend("视频播放行为统计-按浏览器去重", "视频播放结束", i.gaTemp(e.data("date"), e.data("time"), e.data("title"), s) + "|" + e.data("videomlen")), n.set("w3_ga_play_ended_" + s, s)),
                        i.gaSend("pc官网-推荐内容显示", "视频播放完成后显示更多视频", i.gaTemp(e.data("date"), e.data("time"), e.data("title"), s) + "|" + e.data("videomlen"))
                    },
                    onVolume: function() {},
                    onReady: function() {
                        t.ready()
                    },
                    onPlay: function() {
                        t.play();
                        var e = $("#" + t.id).parents(".j-video-c"),
                        s = e.data("id"),
                        a = n.get("w3_ga_play_playing_" + s);
                        a || (i.gaSend("视频播放行为统计-按浏览器去重", "点击播放按钮", i.gaTemp(e.data("date"), e.data("time"), e.data("title"), s) + "|" + e.data("videomlen")), n.set("w3_ga_play_playing_" + s, s))
                    },
                    onPause: function() {},
                    onBufferChange: function() {},
                    onBufferFull: function() {},
                    onError: function(e) {
                        console.log(e.message);
                        var n = $("#" + t.id).parents(".j-video-c");
                        i.gaSend("视频播放错误", e.message, i.gaTemp(n.data("date"), n.data("time"), n.data("title"), n.data("id")) + "|" + n.data("videomlen"))
                    },
                    onFullscreen: function(e) {
                        e.fullscreen
                    },
                    onMute: function(e) {}
                }
            })
        },
        play: function() {
            var i = $(".j-video-c"),
            n = i.find(".jwplayer"),
            t = this;
            $.each(n,
            function() {
                var i = $(this).attr("id");
                t.id != i && e(i).stop()
            })
        },
        ended: function() {
            if ("video" === this.type) {
                var i = $("#" + this.id).parents(".j-video-c").find(".j-v-d-c"),
                n = this;
                i.length > 0 && (e("jDownloadVideo").play(), i.show(), i.find(".icon-replay").on("click",
                function() {
                    i.hide(),
                    e(n.id).play()
                }))
            }
        },
        ready: function() {
            if ("video" === this.type) {
                var e = $("#j-v-container-" + this.pid);
                if (e.length > 0) {
                    var i = e.find(".tempWrap");
                    i.length <= 0 && e.find(".slideBox").slide({
                        mainCell: ".bd > ul",
                        effect: "leftLoop",
                        autoPlay: !1,
                        trigger: "click",
                        easing: "swing",
                        delayTime: 1e3,
                        slideW: 566,
                        mouseOverStop: !0,
                        pnLoop: !1
                    })
                }
            }
        }
    },
    {
        init: function(e, i, n, s, a) {
            return new t(e, i, n, s, a)
        },
        setup: function() {
            if (! ($("#jDownloadVideo").length <= 0)) {
                e("jDownloadVideo").setup({
                    flashplayer: "http://wimg.spriteapp.cn/pc/jwplayer/jwplayer.flash.swf",
                    file: "http://wvideo.spriteapp.cn/voice1/download.mp3",
                    image: "http://mpic.spriteapp.cn/crop/152x93/picture/2015/0624/558a9dce3541d.jpg",
                    skin: "http://wimg.spriteapp.cn/pc/jwplayer/skin/five-audio.xml",
                    width: 1,
                    height: 1
                })
            }
        }
    }
}),
define("services/ajax", ["services/util"],
function(e) {
    return {
        url: "http://api.budejie.com/api/api_open.php",
        $post: function(e, i, n) {
            return this.$ajax(this.getConfig(e, i, n, "POST"))
        },
        $get: function(e, i, n) {
            return this.$ajax(this.getConfig(e, i, n, "GET"))
        },
        $jsonp: function(e, i, n) {
            var t = {
                data: this.getParams(e) + "&callback=?",
                dataType: "JSONP",
                url: i
            };
            return this.$ajax(_.isObject(n) && "[object File]" !== String(n) ? $.extend({},
            t, n) : t)
        },
        getParams: function(i) {
            return _.isObject(i) && "[object File]" !== String(i) ? e.params(i) : i
        },
        getConfig: function(e, i, n, t) {
            var s = _.isUndefined(i) || i.length <= 0 ? {
                data: this.getParams(e) + "&callback=?",
                dataType: "JSONP",
                xhrFields: {
                    withCredentials: !0
                }
            }: {
                data: this.getParams(e),
                url: i,
                type: t
            };
            return _.isObject(n) && "[object File]" !== String(n) ? $.extend({},
            s, n) : s
        },
        $ajax: function(e) {
            var i = $.Deferred();
            return $.ajax($.extend({},
            {
                type: "GET",
                url: this.url,
                dataType: "json"
            },
            e)).done(function(e) {
                i.resolve(e)
            }).fail(function(e) {
                i.reject(e)
            }),
            i.promise()
        }
    }
}),
define("services/toolbar", ["services/ajax", "store"],
function(e, i) {
    return {
        love: function(n, t) {
            var s = i.get("u_ding_cai_" + t);
            if (!s && !$(n).hasClass("active") && !$(n).hasClass("active")) {
                var a = $(n).children("span").text().trim();
                a = Number(a) + 1,
                $(n).addClass("active"),
                $(n).next("span").addClass("tlargen");
                var o = $('<div class="ding">+1</div>');
                o.appendTo($(n)),
                setTimeout(function() {
                    $(o).remove()
                },
                500),
                $(n).children("span").text(a),
                i.set("u_ding_cai_" + t, t);
                var d = e.$get({
                    c: "post",
                    a: "love",
                    cid: t
                });
                d.then(function(e) {
                    console.log(e)
                })
            }
        },
        nolove: function(n, t) {
            var s = i.get("u_ding_cai_" + t);
            if (!s && !$(n).hasClass("active") && !$(n).hasClass("active")) {
                var a = $(n).children("span").text().trim();
                a = Number(a) + 1,
                $(n).addClass("active"),
                $(n).next("span").addClass("tlargen"),
                $(n).children("span").text(a),
                i.set("u_ding_cai_" + t, t);
                var o = e.$get({
                    c: "post",
                    a: "cai",
                    id: t
                });
                o.then(function(e) {
                    console.log(e)
                })
            }
        },
        collect: function(e, n) {
            var t = i.get("u_collect_" + n);
            t || $(e).parent().hasClass("active") || ($(e).parent().addClass("active"), i.set("u_collect_" + n, n))
        },
        getPid: function() {
            return $(this).parents(".j-r-list-tool-l").data("id")
        }
    }
}),
define("module/list", ["services/toolbar", "services/dialog"],
function(e, i) {
    return {
        listEvent: function() {
            $(".j-r-list-tool-l-up").on("click",
            function() {
                e.love(this, e.getPid.call(this));
                var i = $(this).parents(".j-r-list-tool-l").data("id");
                try {
                    _BFD.Approval(0, i)
                } catch(n) {}
            }),
            $(".u-dian  .icon-up").on("click",
            function() {
                i.openDialogQr()
            }),
            $(".j-r-list-tool-l-down ").on("click",
            function() {
                e.nolove(this, e.getPid.call(this));
                var i = $(this).parents(".j-r-list-tool-l").data("id");
                try {
                    _BFD.Opposition(0, i)
                } catch(n) {}
            }),
            $(".icon-comment").on("click",
            function() {
                $(this).parent().hasClass("active") || $(this).parent().addClass("active")
            }),
            $(".icon-cc").on("click",
            function() {
                i.openDialogQr()
            }),
            navigator.userAgent.match(/ipad/gi) && ($(".j-down-hide").removeClass("ipad-hide"), $(".ipad-down-href").attr("href", "javascript:;"), $(".j-down-hide").on("click",
            function() {
                if (console.log("dian"), confirm("需前往迅雷下载视频，确定前往？")) {
                    var e = $("#ipad-downvideo-href").val();
                    $(this).children(".ipad-down-href").attr("href", e),
                    document.location.href = e
                }
            })),
            $(".ipad-hide").on("click",
            function() {
                i.openVideoDialog()
            })
        }
    }
}),
define("module/common", ["services/player", "module/list", "services/util", "scrollUp"],
function(player, list, util) {
    var common = {
        iSiwIn10: function() {
            return navigator.userAgent.match(/Windows NT 10.0/i)
        },
        isMac: function() {
            return /macintosh|mac os x/i.test(navigator.userAgent)
        },
        iSiPad: function() {
            return navigator.userAgent.match(/ipad/gi)
        },
        scrollInit: function() {
            $.scrollUp({
                animation: "slide"
            })
        },
        playerInit: function() {
            $.each($(".j-video"),
            function() {
                var e = $(this);
                player.init(e.attr("id"), e.data("mp4"), e.data("poster"), "video", e.data("id"))
            }),
            $.each($(".j-audio"),
            function() {
                var e = $(this);
                player.init(e.attr("id"), e.data("mp3"), e.data("poster"), "audio", e.data("id"))
            }),
            player.setup()
        },
        lazyLoad: function() {
            $("div.lazy,img.lazy").lazyload({
                effect: "fadeIn",
                event: "scrollstop",
                threshold: 1200
            }),
            $("img.lazy").lazyload({
                effect: "fadeIn",
                event: "scrollstop",
                threshold: 20,
                container: $(".g-sd")
            })
        },
        fixedRight: function() {
            /*$(document).on("scroll",
            function() {
                function e(e) {
                    n.hasClass("bd-fixed") && l != e + "px" && n.css({
                        top: e
                    }),
                    !n.hasClass("bd-fixed") && n.addClass("bd-fixed").css({
                        top: e
                    })
                }
                var i = $(window),
                n = $(".j-l-c"),
                t = n.outerHeight(),
                s = $(".j-footer"),
                a = s.offset().top,
                o = i.height(),
                d = t - o,
                c = a - o,
                r = parseInt(i.scrollTop()),
                l = n.css("top"),
                u = $(".g-mn").outerHeight();
                console.log(a);
                if (u > t && r > d) {
                    var p = t - o;
                    c > r && e( - [p + 5]),
                    r > c && e( - [p + 345])
                }
                u > t && d > r && n.hasClass("bd-fixed") && n.removeClass("bd-fixed ").css({
                    top: 0
                })
            })*/
        },
        showDownload: function() {
            util.isWinClient() && $(".j-win10-button").css("display", "block")
        },
        showDownloadMac: function() {
            this.isMac() && !this.iSiPad() && $(".j-mac-button").css("display", "block")
        },
        gaEvent: function() {
            /*$(".j-everyone .j-item").on("click",
            function() {
                var e = $(this).find("a");
                util.gaSend("pc官网-推荐内容点击", "右侧“大家都在看”推荐视频点击", util.gaTemp(e.data("date"), e.data("time"), e.data("title"), e.data("id")))
            }),
            $(".j-jq-hot .j-item").on("click",
            function() {
                var e = $(this).find("a");
                util.gaSend("pc官网-推荐内容点击", "右侧“近期热门”推荐视频点击", util.gaTemp("", "", e.data("title"), e.data("id")))
            }),
            $(".index-wrst .j-item").on("click",
            function() {
                var e = $(this).find("a");
                util.gaSend("pc官网-推荐内容点击", " 帖子流中推荐内容点击", util.gaTemp(e.data("date"), e.data("time"), e.data("title"), e.data("id")))
            }),
            $(".detail-wst .j-item").on("click",
            function() {
                var e = $(this).find("a");
                util.gaSend("pc官网-推荐内容点击", " 内容页正文下“往日神帖”推荐内容点击", util.gaTemp(e.data("date"), e.data("time"), e.data("title"), e.data("id")))
            }),
            $(".slideBox .m-list4 li").on("click",
            function() {
                var e = $(this).find("a");
                util.gaSend("pc官网-推荐内容点击", "视频播放完成后点击更多视频", util.gaTemp(e.data("date"), e.data("time"), e.data("title"), e.data("id")))
            }),
            $(".bdsharebuttonbox a").on("click",
            function() {
                SHAREID = $(this).parent().data("id")
            }),
            $(".bdsharebuttonbox a.bds_more").on("mouseover",
            function() {
                SHAREID = $(this).parent().data("id")
            }),
            $(".j-collect").on("click",
            function() {
                util.gaSend("pc官网-收藏帖子", "弹层提示安装App", "")
            }),
            $("a.j-list-comment").on("click",
            function() {
                var e = $(this).parents(".j-r-list-tool");
                util.gaSend("pc官网-查看评论", util.gaTemp(e.data("date"), e.data("time"), e.data("title"), e.data("id")), util.gaType(e.data("type"), e.data("video_mlen")))
            }),
            $(".icon-review").on("click",
            function() {
                util.gaSend("pc官网-点击审稿按钮", "弹层提示安装App", "")
            }),
            $(".c-next-btn-content .c-prev-btn").on("click",
            function() {
                var e = $(this);
                util.gaSend("pc官网-推荐内容点击", "上一条", util.gaTemp("", "", "", e.data("id")))
            }),
            $(".c-next-btn-content .c-next-btn").on("click",
            function() {
                var e = $(this);
                util.gaSend("pc官网-推荐内容点击", "下一条", util.gaTemp("", "", "", e.data("id")))
            }),
            $(".j-down-video a").on("click",
            function() {
                var e = $(this).parents(".j-r-list-tool");
                util.gaSend("pc官网-下载视频", util.gaTemp(e.data("date"), e.data("time"), e.data("title"), e.data("id")), "")
            }),
            $(".icon-win10-download").on("click",
            function() {
                util.gaSend("pc官网-下载win10", "下载弹层的下载button点击", "")
            }),
            $(".j-win10-button").on("click",
            function() {
                util.gaSend("pc官网-下载win10", "右侧二维码下的下载button点击", "")
            }),
            $(".icon-mac-download").on("click",
            function() {
                util.gaSend("pc官网-下载mac", "下载弹层的下载button点击", "")
            }),
            $(".j-mac-button").on("click",
            function() {
                util.gaSend("pc官网-下载mac", "右侧二维码下的下载button点击", "")
            })*/
        },
        initBDShare: function() {
            /*with(window._bd_share_config = {
                common: {
                    bdText: "{{topic.text|escapejs}}",
                    bdDesc: "{{topic.text|escapejs}}",
                    bdUrl: window.location.href,
                    bdPic: '{{topic.thumbnail_abs_uri|default:"http://img.spriteapp.cn/www/images/budejie-icon-180x180.jpg"}}',
                    onBeforeClick: function(e, i) {
                        var n = $(".fx-bd-" + SHAREID),
                        t = n.parents(".j-r-list-tool");
                        _BFD.Review(0, n.data("id")),
                        util.gaSend("pc官网-分享帖子", util.gaTemp(t.data("date"), t.data("time"), t.data("title"), t.data("id")), util.gaType(t.data("type"), t.data("video_mlen")));
                        try {
                            window._BFD = window._BFD || {},
                            _BFD.Share(0, t.data("id"), util.getCookie("tma"), util.getCookie("tmc"), util.getCookie("tmd"))
                        } catch(s) {}
                        return console.log(e),
                        $.extend({},
                        i, {
                            bdText: n.data("text"),
                            bdDesc: n.data("text"),
                            bdUrl: "http://www.budejie.com" + n.data("url"),
                            bdPic: n.data("pic")
                        })
                    },
                    onAfterClick: function(e) {}
                },
                share: [{
                    bdSize: 24,
                    bdStyle: "1"
                }]
            },
            document) 0[(getElementsByTagName("head")[0] || body).appendChild(createElement("script")).src = "http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=" + ~ ( - new Date / 36e5)]*/
        }
    };
    return {
        init: function() {
            common.initBDShare(),
            common.scrollInit(),
            common.playerInit(),
            common.lazyLoad(),
            common.fixedRight(),
            list.listEvent(),
            common.gaEvent(),
            common.showDownload(),
            common.showDownloadMac()
        }
    }
}),
define("services/message", ["dialog"],
function(e) {
    return {
        alert: function(i) {
            var n = e({
                title: "操作提示",
                content: i
            });
            n.show()
        },
        msg: function(i, n) {
            var t = n || 2e3,
            s = e({
                skin: "j-msg",
                title: "操作提示",
                content: i
            });
            s.show(),
            setTimeout(function() {
                s.close().remove()
            },
            t)
        }
    }
}),
define("module/index", ["services/dialog", "module/common", "services/util", "services/message"],
function(e, i, n, t) {
    var s = {
        dialogInit: function() {
            $(".n-title-down").on("click", "a",
            function() {
                e.openDialogQr()
            }),
            $(".btnSmXz1,.btnSmXz2").on("click",
            function(i) {
                i.preventDefault(),
                e.openDialogQr(),
                i.stopPropagation()
            }),
            $(".j-weixin").on("click",
            function() {
                e.openDiffDialogQr("请打开手机微信，扫描二维码", "icon-wx-qr", "微信扫二维码，关注百思不得姐")
            }),
            $(".j-qq").on("click",
            function() {
                e.openDiffDialogQr("请打开手机QQ，扫描二维码", "icon-qq-qr", "QQ扫二维码，关注百思不得姐")
            })
        },
        gaEvent: function() {
            $(".j-before-day").on("click",
            function() {
                var e = $(this).find("a");
                n.gaSend("pc官网-推荐内容点击", "右侧“去年今日”推荐内容点击", n.gaTemp("", "", e.data("title"), e.data("id")))
            })
        },
        pageRoute: function() {
            $("#btnPageRoute").on("click",
            function() {
                var e = $("#txtPageRouteVal").val();
                if (e.length <= 0) return t.alert("请输入需要跳转的页数！"),
                !1;
                if (console.log(!/^[1-9]+[0-9]*]*$/.test(e)), !/^[1-9]+[0-9]*]*$/.test(e)) return t.alert("请输入正确的跳转的页数,只能为整数！"),
                !1;
                var i = $("#txtBaiduhdTail").val();
                window.location.href = "./" + e + i
            })
        },
        checkbox: function() {
            var e = $(".remind-me");
            e.each(function() {
                $(this).click(function() {
                    $(this).find("span").toggleClass("icon-checkbox-click")
                })
            })
        },
        tab: function() {
            $(".j-tab-header li").click(function() {
                $(this).addClass("j-tab-current").siblings().removeClass("j-tab-current"),
                $(".j-tab-c .j-tab-c-hide").eq($(this).index()).addClass("j-tab-c-show").siblings().removeClass("j-tab-c-show")
            })
        },
        iSiPad: function() {
            return navigator.userAgent.match(/ipad/gi)
        },
        screen: function() {
            var e = this;
            if (e.iSiPad()) {
                var i = $(".j-add-screen");
                i.length <= 0 && (i = $($("#add2desktopTemp").html()), i.appendTo($("body"))),
                $(".j-a-s-del").click(function() {
                    i.css({
                        opacity: "0",
                        top: "-100px"
                    })
                }),
                setTimeout(function() {
                    i.css({
                        opacity: "1",
                        top: "15px"
                    })
                },
                1e3),
                setTimeout(function() {
                    i.css({
                        opacity: "0",
                        top: "-100px"
                    })
                },
                8e3)
            }
        }
    };
    $(function() {
        s.dialogInit(),
        s.gaEvent(),
        s.pageRoute(),
        s.checkbox(),
        s.tab(),
        s.screen(),
        i.init()
    })
}),
define("module/user/validate", [],
function() {
    return {
        common: function() {
            return {
                errorPlacement: function(e, i) {
                    i.parents(".j-u-c-input").addClass("j-v-error").after(e)
                },
                success: function(e) {
                    var i = e.prev();
                    i.hasClass("j-v-error") && i.removeClass("j-v-error"),
                    e.remove()
                }
            }
        }
    }
}),
define("services/user/user.service", ["services/ajax"],
function(e) {
    return {
        serviceStatic: "http://d.api.budejie.com",
        login: function(i, n) {
            return e.$jsonp({
                phonenum: i,
                password: md5(n)
            },
            this.serviceStatic + "/user/login")
        },
        register: function(i, n, t) {
            return e.$jsonp({
                username: i,
                password: md5(n),
                verify_code: t
            },
            this.serviceStatic + "/user/register")
        },
        restPwd: function(i, n) {
            return e.$jsonp({
                password: md5(i),
                re_password: md5(n)
            },
            this.serviceStatic + "/user/reset_password")
        },
        findPwd: function(i, n, t) {
            return e.$jsonp({
                username: i,
                password: md5(n),
                verify_code: t
            },
            this.serviceStatic + "/user/register")
        },
        sendCode: function(i, n) {
            return e.$jsonp({
                phonenum: i,
                verifytype: n
            },
            this.serviceStatic + "/user/getverifycode")
        },
        checkVerify: function(i, n) {
            return e.$jsonp({
                phonenum: i,
                verify_code: n,
                verifytype: "reset_password"
            },
            this.serviceStatic + "/user/checkverify")
        },
        loginOut: function() {
            return e.$jsonp({
                client: "pc"
            },
            this.serviceStatic + "/user/logout")
        },
        getInfo: function() {
            return e.$jsonp({},
            this.serviceStatic + "/user/profile")
        },
        getUserInfoById: function(i) {
            return e.$jsonp({
                a: "profile",
                c: "user",
                userid: i
            },
            "http://api.budejie.com/api/api_open.php")
        },
        getFansList: function(i, n) {
            return e.$jsonp({
                a: "fans_list",
                c: "user",
                follow_id: n,
                userid: i
            },
            "http://api.budejie.com/api/api_open.php")
        },
        getFollowList: function(i, n) {
            return e.$jsonp({
                a: "follow_list",
                c: "user",
                follow_id: n,
                userid: i
            },
            "http://api.budejie.com/api/api_open.php")
        },
        follow: function(i) {
            return e.$jsonp({
                a: "follow",
                c: "user",
                userid: i
            },
            "http://api.budejie.com/api/api_open.php")
        },
        unFollow: function(i) {
            return e.$jsonp({
                a: "unfollow",
                c: "user",
                userid: i
            },
            "http://api.budejie.com/api/api_open.php")
        },
        getNewsList: function(i, n, t, s) {
            return e.$jsonp({
                a: "msgcenter",
                c: "msg",
                appname: "baisishequ",
                from: "www",
                page: n,
                per: t,
                uid: i,
                max: s,
                ver: "4.0"
            },
            "http://api.budejie.com/api/api_open.php")
        }
    }
}),
define("module/user/user.info", ["services/user/user.service", "services/message", "dialog", "services/util"],
function(e, i, n, t) {
    function s() {
        this.getInfo(),
        this.$loginBar = $("#jLoginBar"),
        this.$jUserLoginBar = $("#jUserLoginBar"),
        this.$userInfo = $("#userInfo"),
        this.$userFollow = $("#userFollow"),
        this.$userFans = $("#userFans"),
        this.$userNewsIcon = $("#userNewsIcon"),
        this.$userNewsHtml = "",
        this.$jTitle = $("#jTitle"),
        this.location = window.location
    }
    function a(e) {
        var i = location.search.match(new RegExp("[?&]" + e + "=([^&]+)", "i"));
        return null == i || i.length < 1 ? null: i[1]
    }
    return s.prototype.getInfo = function() {
        var i = e.getUserInfoById(),
        n = this;
        i.then(function(e) {
            if (e && (n._rightUserInfo(e), n._rightUserFollow(e), n._rightUserFans(e), n._topUserNews(e), n.auth(e), 0 == e.code)) {
                var i = e.data.username;
                n.bind(i.length > 9 ? i.substring(0, 8) + "...": i, i)
            }
        })
    },
    s.prototype._len = function(e) {
        return e.replace(/[^\x00-\xff]/g, "**").length
    },
    s.prototype.bind = function(e, i) {
        console.log(e),
        this.$loginBar.hide(),
        this.$jUserLoginBar.find("#jUserLoginName").text(e).attr("title", i),
        this.$jUserLoginBar.show(),
        this._event()
    },
    s.prototype._event = function() {
        var t = $("#jLoginExit"),
        s = this;
        t.length > 0 && t.on("click",
        function() {
            var n = e.loginOut();
            n.then(function(e) {
                e && 0 == e.result && (i.msg(e.result_desc), s.$loginBar.show(), s.$jUserLoginBar.hide(), s.location.reload())
            })
        }),
        s.$userNewsIcon.length > 0 && s.$userNewsIcon.on("click",
        function() {
            var e = n({
                padding: 0,
                quickClose: !0,
                content: s.$userNewsHtml
            });
            e.show(document.getElementById("userNewsIcon"))
        })
    },
    s.prototype.auth = function(e) {
        var i = this;
        if (0 != e.code && "True" == jie.is_oauth_login && (i.location.href = "/user/login?r_url=" + encodeURI(i.location.href)), 0 == e.code && "True" == jie.is_login_page) {
            var n = a("r_url");
            i.location.href = null != n ? n: "http://www.budejie.com"
        }
    },
    s.prototype._rightUserInfo = function(i) {
        var n = this;
        if (n.$userInfo.length > 0) if (window.JIE = window.JIE || {},
        !_.isUndefined(JIE.userId) && JIE.userId.length > 0) e.getUserInfoById(JIE.userId).then(function(e) {
            if (e) {
                var i = _.template(n._rightOtherUserInfoTemp(), {
                    variable: "user"
                }),
                t = i(e.data);
                n.$userInfo.html(t),
                n._followEvent(),
                n._updateTitle(e.data.username)
            }
        });
        else if (0 == i.code) {
            var t = _.template(n._rightUserInfoTemp(), {
                variable: "user"
            }),
            s = t(i.data);
            n.$userInfo.html(s),
            n._updateTitle(i.data.username)
        }
    },
    s.prototype._rightUserFollow = function(i) {
        var n = this;
        if (n.$userFollow.length > 0) {
            window.JIE = window.JIE || {};
            var t = 0,
            s = !1; ! _.isUndefined(JIE.userId) && JIE.userId.length > 0 ? (t = JIE.userId, s = !0) : (t = i.id, s = !1);
            var a = e.getFollowList(t, 0);
            a.then(function(e) {
                if (e && 0 == e.code) {
                    var i = e.data;
                    i.list = $(i.list).slice(0, 5);
                    for (var t = 0; t < i.list.length; t++) i.list[t].username.length > 3 && (i.list[t].username = i.list[t].username.substring(0, 2) + "...");
                    i.isOthers = s;
                    var a = _.template(n._rightUserFollowTemp(), {
                        variable: "follow"
                    }),
                    o = a(i);
                    n.$userFollow.html(o)
                }
            })
        }
    },
    s.prototype._rightUserFans = function(i) {
        var n = this;
        if (n.$userFans.length > 0) {
            window.JIE = window.JIE || {};
            var t = 0,
            s = !1; ! _.isUndefined(JIE.userId) && JIE.userId.length > 0 ? (t = JIE.userId, s = !0) : (t = i.id, s = !1);
            var a = e.getFansList(t, 0);
            a.then(function(e) {
                if (e && 0 == e.code) {
                    var i = e.data;
                    i.list = $(i.list).slice(0, 5);
                    for (var t = 0; t < i.list.length; t++) i.list[t].username.length > 3 && (i.list[t].username = i.list[t].username.substring(0, 2) + "...");
                    i.isOthers = s;
                    var a = _.template(n._rightUserFansTemp(), {
                        variable: "fans"
                    }),
                    o = a(i);
                    n.$userFans.html(o)
                }
            })
        }
    },
    s.prototype._topUserNews = function(i) {
        var n = this;
        if (n.$userNewsIcon.length > 0) {
            var t = e.getNewsList(i.data.id, 1, 5, 0);
            t.then(function(e) {
                if (e) {
                    var i = _.template(n._topUserNewsTemp(), {
                        variable: "news"
                    }),
                    t = i(_.map(e.list,
                    function(e) {
                        var i = {};
                        return i.ctime = e.ctime,
                        "url_topic" == e.type || "system" == e.type ? i.title = "系统消息:" + e.body: i.title = e.title,
                        i.title.length > 14 && (i.title = i.title.substring(0, 14) + "..."),
                        e.pinfo && (i.id = e.pinfo.id),
                        i
                    }));
                    n.$userNewsHtml = t
                }
            })
        }
    },
    s.prototype._followEvent = function() {
        var n = this;
        n.$userInfo.find(".j-follow").on("click",
        function() {
            var s = $(this),
            a = s.data("userid");
            t.gaSend("pc官网-关注好友", "点击关注button", ""),
            n._isLogin(function() {
                e.follow(a).then(function(e) {
                    console.log(e),
                    s.hide(),
                    s.next().show(),
                    i.msg(e.msg)
                })
            })
        }),
        n.$userInfo.find(".j-un-follow").on("click",
        function() {
            var s = $(this),
            a = s.data("userid");
            t.gaSend("pc官网-取消关注好友", "点击取消关注button", ""),
            n._isLogin(function() {
                e.unFollow(a).then(function(e) {
                    console.log(e),
                    s.hide(),
                    s.prev().show(),
                    i.msg(e.msg)
                })
            })
        })
    },
    s.prototype._rightUserInfoTemp = function() {
        return '<div class="p-age-img">\n    <a href="">\n        <img class="p-logo" src="<%= user[\'profile_image\'] %>" alt=""/>\n    </a>\n</div>\n<div class="p-age-mess">\n    <div class="p-age-name">\n        <a href="/user/topic/" title="<%= user[\'username\'] %>" class="p-age-netname"><%= user[\'username\'].length > 5 ? user[\'username\'].substring(0,5)+\'...\' : user[\'username\'] %></a>\n        <i class="icon-rank"></i>\n    </div>\n    <div class="p-age-lein">\n        <span class="level">等级：<%= user[\'level\'] %></span>\n        <span class="integral">积分：<%= user[\'credit\'] %></span>\n    </div>\n    <div class="signature">简介：<%= user[\'introduction\'] || \'这家伙很懒，神马都木有写\' %></div>\n</div>'
    },
    s.prototype._rightOtherUserInfoTemp = function() {
        return '<div class="p-age-img">\n    <a href="">\n        <img class="p-logo" src="<%= user[\'profile_image\'] %>" alt=""/>\n    </a>\n</div>\n<div class="p-age-mess">\n    <div class="p-age-name">\n        <a href="/user/others-<%= user[\'id\'] %>.html"  title="<%= user[\'username\'] %>"  class="p-age-netname"><%= user[\'username\'].length > 5 ? user[\'username\'].substring(0,5)+\'...\' : user[\'username\'] %></a>\n        <i class="icon-rank"></i>\n        <%if (user.relationship == \'0\' || user.relationship == \'3\' ) { %>\n        <a href="javascript:void(0);" data-userid="<%= user[\'id\'] %>" class="focus j-follow">+ 关注</a>\n        <a href="javascript:void(0);" data-userid="<%= user[\'id\'] %>" class="focus cancel-focus j-un-follow" style="display: none;">取消关注</a>\n        <% } %>\n        <%if (user.relationship == \'2\' || user.relationship == \'4\') { %>\n         <a href="javascript:void(0);" data-userid="<%= user[\'id\'] %>" class="focus j-follow"  style="display: none;">+ 关注</a>\n         <a href="javascript:void(0);" data-userid="<%= user[\'id\'] %>" class="focus cancel-focus j-un-follow">取消关注</a>\n        <% } %>\n    </div>\n    <div class="p-age-lein">\n        <span class="level">等级：<%= user[\'level\'] %></span>\n        <span class="integral">积分：<%= user[\'credit\'] %></span>\n    </div>\n    <div class="signature">简介：<%= user[\'introduction\'] || \'这家伙很懒，神马都木有写\' %></div>\n</div>'
    },
    s.prototype._rightUserFollowTemp = function() {
        return '<div class="p-age-attente-title"><span>关注（<%= follow[\'info\'][\'count\']%>人）</span><a href="/user/follow/<%= follow.isOthers ? JIE.userId : \'\'%>" class="p-age-all">全部</a></div><ul class="p-age-attente-con"><% if (_.size(follow[\'list\']) > 0) { _.each(follow[\'list\'], function(item) { %><li><a href="/user/others-<%= item[\'id\']%>.html"><img class="follower-img" src="<%= item[\'profile_image\'] %>" onerror="this.src=\'http://wimg.spriteapp.cn/profile/\'" alt=""/></a><a href="/user/others-<%= item[\'id\']%>.html?topic_type=publish" class="follower-name"><%= item[\'username\'] %></a></li><% });} else { %><li class="p-age-attente-none">还没有关注人哦</li><% } %></ul>'
    },
    s.prototype._rightUserFansTemp = function() {
        return '<div class="p-age-attente-title"><span>粉丝（<%= fans[\'info\'][\'count\']%>人）</span><a href="/user/fans/<%= fans.isOthers ? JIE.userId : \'\'%>" class="p-age-all">全部</a></div><ul class="p-age-attente-con"><% if (_.size(fans[\'list\']) > 0) { _.each(fans[\'list\'], function(item) { %><li><a href="/user/others-<%= item[\'id\']%>.html"><img class="follower-img" src="<%= item[\'profile_image\'] %>" onerror="this.src=\'http://wimg.spriteapp.cn/profile/\'" alt=""/></a><a href="/user/others-<%= item[\'id\']%>.html?topic_type=publish" class="follower-name"><%= item[\'username\'] %></a></li><% });} else { %><li class="p-age-attente-none">还没有粉丝哦</li><% } %></ul>'
    },
    s.prototype._topUserNewsTemp = function() {
        return "<div class=\"j-new-box\"><ul><% if (_.size(news) > 0) { _.each(news, function(item) { %><li><a href=\"<%= item['id'] == undefined ? '/user/news' : '/detail-' + item['id'] + '.html' %>\"><%= item['title']%></a></li><% });} else { %><li class=\"j-new-none-msg\">没有消息提醒</li><% } %><li class=\"j-new-more\"><a href=\"/user/news\">查看更多</a></li></ul></div>"
    },
    s.prototype._isLogin = function(i) {
        e.getInfo().then(function(e) {
            1 == e.code ? (window.JIE = window.JIE || {},
            JIE.openLoginDialog()) : i && i.call()
        })
    },
    s.prototype._updateTitle = function(e) {
        this.$jTitle.length > 0 && (window.JIE = window.JIE || {},
        JIE.isUpdateTitle && this.$jTitle.text(this.$jTitle.text().replace("@userName@", e)))
    },
    s
}),
define("module/user/findpwd", ["dialog", "services/ajax", "module/user/validate", "services/user/user.service", "services/message", "module/user/user.info"],
function(e, i, n, t, s, a) {
    function o() {
        this.dlg = null,
        this.seconds = 60,
        this.codeIsSend = !1
    }
    return o.prototype.open = function() {
        var i = this,
        n = e.get("j-find");
        if (!_.isUndefined(n)) return void n.showModal();
        i.dlg = new e({
            id: "j-find",
            fixed: !0,
            innerHTML: this.temp(),
            height: 340,
            width: 594
        }),
        i.dlg.showModal(),
        i.event();
        var t = i.validate();
        i.sendCode(t),
        $("input, textarea").placeholder()
    },
    o.prototype.opens = function() {
        var i = this,
        n = e.get("j-finds");
        if (!_.isUndefined(n)) return void n.showModal();
        this.dlg = new e({
            id: "j-finds",
            fixed: !0,
            innerHTML: this.temps(),
            height: 340,
            width: 594
        }),
        i.dlg.showModal(),
        $("#jFindDCles").on("click",
        function() {
            i.dlg.close()
        });
        i.validates();
        $("input, textarea").placeholder()
    },
    o.prototype.temp = function() {
        return '<div class="j-ui-dialog j-pwd">\n    <div class="j-ui-dialog-header">\n        <div class="j-u-d-h-title">找回密码</div>\n        <span class="j-u-d-h-close" id="jFindDCle"></span>\n    </div>\n    <div class="j-ui-dialog-c">\n        <div class="j-u-d-c-l">\n            <form action="post" id="ffFind">\n                <div class="j-u-d-c-one  j-u-d-c-code">\n                    <div class="j-u-d-c-phone j-u-d-fl j-u-d-f-input">\n                        <span class="j-u-d-c-p-tit">手机号 |  </span>+86 <input type="text" placeholder="请输入手机号" name="username" class="j-u-d-c-p-con j-findpwd-telephone" id="findTxtUserName">\n                    </div>\n                    <div class="j-u-d-c-code" id="jGetCode">获取验证码</div>\n                </div>\n                <div class="j-u-d-c-one j-u-d-c-two j-u-d-c-code">\n                    <div class="j-u-d-c-phone j-u-d-f-input">\n                        <span class="j-u-d-c-p-tit">验证码 |  </span><input type="text" placeholder="请输入手机收到的验证码"  name="code" class="j-u-d-c-p-con" id="findCode">\n                    </div>\n                </div>\n                <a href="javascript:void(0);" id="btnFindSubmit" class="j-u-d-submit j-code-submit">提交</a>\n            </form>\n        </div>\n    </div>\n</div>\n'
    },
    o.prototype.temps = function() {
        return '<div class="j-ui-dialog j-pwd">\n    <div class="j-ui-dialog-header">\n        <div class="j-u-d-h-title">找回密码</div>\n        <span class="j-u-d-h-close" id="jFindDCles"></span>\n    </div>\n    <div class="j-ui-dialog-c">\n        <div class="j-u-d-c-l">\n            <form action="post" id="ffFinds">\n                <div class="j-u-d-c-one j-u-d-c-three">\n                    <div class="j-u-d-c-phone j-u-c-input">\n                        <span class="j-u-d-c-p-tit">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码 |  </span><input type="password" placeholder="请输入密码" class="j-u-d-c-p-con" name="password" id="password">\n                    </div>\n                </div>\n                <div class="j-u-d-c-one j-u-d-c-three">\n                    <div class="j-u-d-c-phone j-u-c-input">\n                        <span class="j-u-d-c-p-tit">确认密码 |  </span><input type="password" placeholder="请再次输入密码确认" class="j-u-d-c-p-con" name="apassword" id="apassword">\n                    </div>\n                </div>\n                <a href="javascript:void(0);" id="btnFindsSubmit" class="j-u-d-submit">确定</a>\n            </form>\n        </div>\n    </div>\n</div>\n'
    },
    o.prototype.event = function() {
        var e = this;
        $("#jFindDCle").on("click",
        function() {
            e.dlg.close()
        })
    },
    o.prototype.sendCode = function(e) {
        var i = this;
        $("#jGetCode").on("click",
        function() {
            var n = $.trim($("#findTxtUserName").val());
            if (n.length <= 0 || !/^1\d{10}$/.test(n)) return void e.element("#findTxtUserName");
            if (! (i.seconds > 0 && i.seconds < 60 || i.codeIsSend)) {
                var a = t.sendCode(n, "reset_password");
                a.then(function(e) {
                    e && (0 == e.code ? (s.msg("验证码发生成功！"), i.disabledSendBtn()) : s.msg("发生失败:" + e.msg))
                })
            }
        })
    },
    o.prototype.disabledSendBtn = function() {
        var e = $("#jGetCode"),
        i = this,
        n = setInterval(function() {
            i.seconds--,
            e.text(i.seconds + "秒后重试"),
            e.css({
                background: "#ccc",
                cursor: "default"
            }),
            0 == i.seconds && (clearInterval(n), i.seconds = 60, e.text("获取验证码"), e.css("background", "#e50541"), i.codeIsSend = !1)
        },
        1e3)
    },
    o.prototype.validate = function() {
        var e = this,
        i = $("#ffFind"),
        n = i.validate({
            rules: {
                username: {
                    required: !0,
                    minlength: 11,
                    maxlength: 11,
                    iphone: !0
                },
                code: {
                    required: !0
                }
            },
            messages: {
                username: {
                    required: "手机号不能为空",
                    minlength: "手机号长度需为11位",
                    maxlength: "手机号长度需为11位",
                    iphone: "手机号错误"
                },
                code: {
                    required: "验证码不能为空"
                }
            },
            errorPlacement: function(e, i) {
                i.parents(".j-u-d-f-input").addClass("j-v-error").parents(".j-u-d-c-code").after(e)
            },
            success: function(e) {
                var i = e.prev().find(".j-u-d-f-input");
                i.hasClass("j-v-error") && i.removeClass("j-v-error"),
                e.remove()
            }
        });
        return $("#btnFindSubmit").on("click",
        function() {
            if (i.valid()) {
                var a = $("#findTxtUserName"),
                o = $("#findCode");
                n.resetForm();
                var d = t.checkVerify(a.val(), o.val());
                d.then(function(i) {
                    i && (1e3 == i.code ? (e.dlg.close(), e.opens()) : s.msg(i.msg))
                },
                function() {
                    s.msg("网络超时,请稍后重试！")
                })
            }
        }),
        i.keydown(function(e) {
            13 == e.keyCode && $("#btnFindSubmit").trigger("click")
        }),
        n
    },
    o.prototype.validates = function() {
        var e = $("#ffFinds"),
        i = e.validate($.extend({},
        n.common(), {
            rules: {
                password: {
                    required: !0,
                    minlength: 6,
                    maxlength: 16
                },
                apassword: {
                    required: !0,
                    equalTo: "#password"
                }
            },
            messages: {
                password: {
                    required: "密码不能为空",
                    minlength: "密码仅支持6-16位数字、字母和符号",
                    maxlength: "密码仅支持6-16位数字、字母和符号"
                },
                apassword: {
                    required: "密码不能为空",
                    equalTo: "两次输入的密码不一致,请重新输入"
                }
            }
        }));
        return $("#btnFindsSubmit").on("click",
        function() {
            if (e.valid()) {
                var n = $("#password"),
                a = $("#apassword");
                i.resetForm();
                var o = t.restPwd(n.val(), a.val());
                o.then(function(e) {
                    e && (1e3 == e.code ? (s.msg("修改密码成功"), window.location.reload()) : s.msg(e.msg))
                },
                function() {
                    s.msg("网络超时,请稍后重试！")
                })
            }
        }),
        e.keydown(function(e) {
            13 == e.keyCode && $("#btnFindsSubmit").trigger("click")
        }),
        i
    },
    o
}),
define("module/user/login", ["dialog", "module/user/findpwd", "services/util", "module/user/validate", "module/user/user.info", "services/user/user.service", "services/message"],
function(e, i, n, t, s, a, o) {
    function d() {
        this.dlg = null
    }
    return d.prototype.open = function() {
        var i = this,
        n = e.get("j-Login");
        return _.isUndefined(n) ? (i.dlg = new e({
            id: "j-Login",
            fixed: !0,
            innerHTML: this.temp(),
            height: 393,
            width: 740
        }), i.dlg.showModal(), i.event(), $("input.j-u-d-c-p-con").placeholder(), i.remindMe(), i.findPwd(), void i.validate()) : void n.showModal()
    },
    d.prototype.close = function() {
        this.dlg.close()
    },
    d.prototype.temp = function() {
        return '<div class="j-ui-dialog j-regist j-login" >\n    <div class="j-ui-dialog-header">\n        <div class="j-u-d-h-title">登录</div>\n        <span class="j-u-d-h-close" id="jLoginDCle"></span>\n    </div>\n    <div class="j-ui-dialog-c">\n        <div class="j-u-d-c-l">\n            <form action="post" id="ffLogin">\n                <div class="j-u-d-c-one j-u-d-c-spe">\n                    <div class="j-u-d-c-phone j-u-c-input">\n                            <span class="j-u-d-c-p-tit">账&nbsp;&nbsp;&nbsp;&nbsp;号 |  </span>\n                            <input id="txtUserName" name="username" type="text" placeholder="手机号" class="j-u-d-c-p-con">\n                    </div>\n                </div>\n                <div class="j-u-d-c-one">\n                    <div class="j-u-d-c-phone j-u-c-input">\n                        <span class="j-u-d-c-p-tit">密&nbsp;&nbsp;&nbsp;&nbsp;码 |  </span><input id="txtUserPwd" name="userpwd" type="password"\n                                                                                                placeholder="请输入密码"\n                                                                                                class="j-u-d-c-p-con">\n                    </div>\n                </div>\n                <div class="j-u-d-agreement">\n                    <label class="remind-me" id="jRemindMe">\n                        <span class="icon-checkbox "></span>\n                        &nbsp;&nbsp;姐，记住我\n                    </label>\n                    <a class="forget-password" id="jForgetPwd">忘记密码</a>\n                </div>\n                <a href="javascript:void(0);" class="j-u-d-submit j-u-d-login">登录</a>\n            </form>\n        </div>\n        <div class="j-u-d-c-r">\n            <div class="joint-login">\n                <span class="j-u-d-icon-joint-login-des">合作账号登陆</span>\n                <ul>\n                    <li>\n                        <a href="http://d.api.budejie.com/user/weibo_login">\n                            <span class="joint-login-xinlang"></span>\n                            <span class="joint-login-tit">新浪微博</span>\n                        </a>\n                    </li>\n                    <li>\n                        <a href="http://d.api.budejie.com/user/qq_login">\n                            <span class="joint-login-xinlang joint-login-qq"></span>\n                            <span class="joint-login-tit">QQ</span>\n                        </a>\n                    </li>\n                </ul>\n            </div>\n            <div class="j-u-d-c-r-login">\n                <span class="j-u-d-icon-regist-des">还没有账号?</span>\n                <span class="j-u-d-c-icon-login" id="jR_L_Register">注册</span>\n            </div>\n        </div>\n    </div>\n</div>'
    },
    d.prototype.event = function() {
        var e = this;
        $("#jLoginDCle").on("click",
        function() {
            e.dlg.close()
        })
    },
    d.prototype.remindMe = function() {
        var e = $("#jRemindMe"),
        i = e.find("span.icon-checkbox"),
        n = $.cookie("bdj_username"),
        t = $("#txtUserName"),
        s = $("#txtUserPwd");
        void 0 != n && (!i.hasClass("icon-checkbox-click") && i.addClass("icon-checkbox-click"), t.val(n), s.val($.cookie("bdj_user_pwd"))),
        e.on("click",
        function() {
            i.hasClass("icon-checkbox-click") ? (i.removeClass("icon-checkbox-click"), $.removeCookie("bdj_username", {
                path: "/"
            }), $.removeCookie("bdj_user_pwd", {
                path: "/"
            })) : (i.addClass("icon-checkbox-click"), $.cookie("bdj_username", t.val(), {
                path: "/"
            }), $.cookie("bdj_user_pwd", s.val(), {
                path: "/"
            }))
        }),
        t.keyup(function() { ! /^1\d{10}$/.test($(this).val()) && i.hasClass("icon-checkbox-click") && (i.removeClass("icon-checkbox-click"), $.removeCookie("bdj_username", {
                path: "/"
            }), $.removeCookie("bdj_user_pwd", {
                path: "/"
            }))
        })
    },
    d.prototype.findPwd = function() {
        var e = this;
        $("#jForgetPwd").on("click",
        function() {
            e.dlg.close(),
            (new i).open(),
            n.gaSend("pc官网-点击忘记密码", "忘记密码", "")
        })
    },
    d.prototype.validate = function() {
        var e = $("#ffLogin"),
        i = $(".j-u-d-login"),
        s = e.validate($.extend({},
        t.common(), {
            rules: {
                username: {
                    required: !0,
                    minlength: 11,
                    maxlength: 11,
                    iphone: !0
                },
                userpwd: {
                    required: !0,
                    minlength: 6,
                    maxlength: 16
                }
            },
            messages: {
                username: {
                    required: "手机号不能为空",
                    minlength: "手机号长度需为11位",
                    maxlength: "手机号长度需为11位",
                    iphone: "手机号错误"
                },
                userpwd: {
                    required: "密码不能为空",
                    minlength: "密码仅支持6-16位数字、字母和符号",
                    maxlength: "密码仅支持6-16位数字、字母和符号"
                }
            }
        }));
        i.on("click",
        function() {
            if (e.valid()) {
                var i = $("#txtUserName"),
                t = $("#txtUserPwd");
                s.resetForm();
                var d = a.login(i.val(), t.val());
                d.then(function(e) {
                    e && (1e3 == e.code ? (o.msg("登录成功"), n.gaSend("pc官网-点击登录", "登录成功", ""), window.location.reload()) : o.msg(e.msg))
                },
                function() {
                    o.msg("网络超时,请稍后重试！")
                })
            }
        }),
        e.keydown(function(e) {
            13 == e.keyCode && i.trigger("click")
        })
    },
    d
}),
define("module/user/register", ["dialog", "module/user/user.info", "services/user/user.service", "services/message"],
function(e, i, n, t) {
    function s() {
        this.dlg = null,
        this.seconds = 60,
        this.codeIsSend = !1,
        this.isAgree = !0
    }
    return s.prototype.open = function() {
        var i = this,
        n = e.get("j-register");
        if (!_.isUndefined(n)) return void n.showModal();
        i.dlg = new e({
            id: "j-register",
            fixed: !0,
            innerHTML: this.temp(),
            height: 454,
            width: 740
        }),
        i.dlg.showModal(),
        i.event();
        var t = i.validate();
        i.sendCode(t)
    },
    s.prototype.close = function() {
        this.dlg.close()
    },
    s.prototype.temp = function() {
        return '<div class="j-ui-dialog j-regist">\n    <div class="j-ui-dialog-header">\n        <div class="j-u-d-h-title">注册 我要做姐粉</div>\n        <span class="j-u-d-h-close" id="jRegisterDCle"></span>\n    </div>\n    <div class="j-ui-dialog-c">\n        <div class="j-u-d-c-l">\n            <form action="post" id="ffRegister">\n                <div class="j-u-d-c-one j-u-d-c-spe j-u-d-c-register">\n                    <div class="j-u-d-c-phone j-u-c-input">\n                        <span class="j-u-d-c-p-tit">手机号 |  </span><input type="text" placeholder="请输入手机号"\n                                                                         class="j-u-d-c-p-con" name="username" id="txtUserRegistTelephone">\n                    </div>\n                </div>\n                <div class="j-u-d-c-one j-u-d-c-register">\n                    <div class="j-u-d-c-phone j-u-c-input">\n                        <span class="j-u-d-c-p-tit">密&nbsp;&nbsp;&nbsp;&nbsp;码 |  </span><input type="password"\n                                                                                                placeholder="请输入密码"\n                                                                                                class="j-u-d-c-p-con" name="userpwd"  id="txtUserRegistPwd" >\n                    </div>\n                </div>\n                <div class="j-u-d-c-one j-u-d-c-two j-u-d-c-register">\n                    <div class="j-u-d-c-phone j-u-d-fl j-u-c-input">\n                        <span class="j-u-d-c-p-tit">验证码 |  </span><input type="text" placeholder="请输入手机收到的验证码"\n                                                                         class="j-u-d-c-p-con"  name="code" id="txtUserRegistCode">\n                    </div>\n                    <div class="j-u-d-c-code" id="jRegistGetCode">获取验证码</div>\n                </div>\n                <div class="j-u-d-agreement">\n                    <label class="remind-me">\n                        <span class="icon-checkbox icon-checkbox-click"></span>\n                        &nbsp;&nbsp;签署姐的\n                    </label><a href="http://www.budejie.com/budejie/privacy.html" target="_block" class="j-u-d-privacy">注册协议</a>\n                </div>\n                <a href="javascript:void(0);" class="j-u-d-submit" id="btnRegister">注册</a>\n            </form>\n        </div>\n        <div class="j-u-d-c-r">\n            <div class="j-u-d-c-r-login">\n                <span class="j-u-d-icon-login-des">已有账号?</span>\n                <span class="j-u-d-c-icon-login" id="jR_R_Login">登录</span>\n            </div>\n            <div class="joint-login">\n                <span class="j-u-d-icon-joint-login-des">合作账号登陆</span>\n                <ul>\n                    <li>\n                        <a href="http://d.api.budejie.com/user/weibo_login">\n                            <span class="joint-login-xinlang"></span>\n                            <span class="joint-login-tit">新浪微博</span>\n                        </a>\n                    </li>\n                    <li>\n                        <a href="http://d.api.budejie.com/user/qq_login">\n                            <span class="joint-login-xinlang joint-login-qq"></span>\n                            <span class="joint-login-tit">QQ</span>\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n</div>\n'
    },
    s.prototype.event = function() {
        var e = this;
        $("#jRegisterDCle").on("click",
        function() {
            e.dlg.close()
        }),
        $("input, textarea").placeholder();
        var i = $("#btnRegister");
        $(".remind-me").click(function() {
            $(this).find("span").hasClass("icon-checkbox-click") ? ($(this).find("span").removeClass("icon-checkbox-click"), e.isAgree = !1, i.addClass("j-u-d-submit-disabled")) : ($(this).find("span").addClass("icon-checkbox-click"), e.isAgree = !0, i.removeClass("j-u-d-submit-disabled"))
        })
    },
    s.prototype.sendCode = function(e) {
        var i = this;
        $("#jRegistGetCode").on("click",
        function() {
            var s = $.trim($("#txtUserRegistTelephone").val());
            if (s.length <= 0 || !/^1\d{10}$/.test(s)) return void e.element("#txtUserRegistCode");
            if (! (i.seconds > 0 && i.seconds < 60 || i.codeIsSend)) {
                var a = n.sendCode(s, "register");
                a.then(function(e) {
                    e && (0 == e.code ? (t.msg("验证码发送成功！"), i.disabledSendBtn()) : t.msg("提示:" + e.msg))
                })
            }
        })
    },
    s.prototype.disabledSendBtn = function() {
        var e = $("#jRegistGetCode"),
        i = this,
        n = setInterval(function() {
            i.seconds--,
            e.text(i.seconds + "秒后重试"),
            e.css({
                background: "#ccc",
                cursor: "default"
            }),
            0 == i.seconds && (clearInterval(n), i.seconds = 60, e.text("获取验证码"), e.css("background", "#e50541"), i.codeIsSend = !1)
        },
        1e3)
    },
    s.prototype.validate = function() {
        var e = this,
        i = $("#ffRegister"),
        s = $("#btnRegister"),
        a = i.validate({
            rules: {
                username: {
                    required: !0,
                    minlength: 11,
                    maxlength: 11,
                    iphone: !0
                },
                userpwd: {
                    required: !0,
                    minlength: 6,
                    maxlength: 16
                },
                code: {
                    required: !0
                }
            },
            messages: {
                username: {
                    required: "手机号不能为空",
                    minlength: "手机号长度需为11位",
                    maxlength: "手机号长度需为11位",
                    iphone: "手机号错误"
                },
                userpwd: {
                    required: "密码不能为空",
                    minlength: "密码仅支持6-16位数字、字母和符号",
                    maxlength: "密码仅支持6-16位数字、字母和符号"
                },
                code: {
                    required: "验证码不能为空"
                }
            },
            errorPlacement: function(e, i) {
                i.parents(".j-u-c-input").addClass("j-v-error").parents(".j-u-d-c-register").after(e)
            },
            success: function(e) {
                var i = e.prev().find(".j-u-c-input");
                i.hasClass("j-v-error") && i.removeClass("j-v-error"),
                e.remove()
            }
        });
        return s.on("click",
        function() {
            if (e.isAgree && i.valid()) {
                var s = $("#txtUserRegistTelephone"),
                o = $("#txtUserRegistPwd"),
                d = $("#txtUserRegistCode");
                a.resetForm();
                var c = n.register(s.val(), o.val(), d.val());
                c.then(function(e) {
                    console.log(e),
                    e && (1e3 == e.code ? (t.msg("注册成功"), ga("send", "event", "pc官网-点击注册", "注册成功", ""), window.location.reload()) : t.msg(e.msg))
                })
            }
        }),
        i.keydown(function(i) {
            e.isAgree && 13 == i.keyCode && s.trigger("click")
        }),
        a
    },
    s
}),
define("user", ["dialog", "module/user/login", "module/user/register", "module/user/user.info", "services/util"],
function(e, i, n, t, s) {
    function a() {
        this.login = new i,
        this.register = new n
    }
    a.prototype._login = function() {
        var e = this;
        $("#jLogin").on("click",
        function() {
            e.login.open(),
            e._afterOpenLogin(),
            s.gaSend("pc官网-点击登录", "登录界面", "")
        })
    },
    a.prototype.openLogin = function() {
        var e = this;
        e.login.open(),
        e._afterOpenLogin()
    },
    a.prototype._afterOpenLogin = function() {
        var e = this;
        $("#jR_L_Register").unbind().on("click",
        function() {
            e.login.close(),
            e.register.open(),
            e._afterRegisterOpen(),
            s.gaSend("pc官网-点击注册", "注册界面", "")
        })
    },
    a.prototype._register = function() {
        var e = this;
        $("#jRegister").on("click",
        function() {
            e.register.open(),
            e._afterRegisterOpen(),
            s.gaSend("pc官网-点击注册", "注册界面", ""),
            console.log("注册注册")
        })
    },
    a.prototype._afterRegisterOpen = function() {
        var e = this;
        $("#jR_R_Login").unbind().on("click",
        function() {
            e.register.close(),
            e.login.open(),
            e._afterOpenLogin(),
            s.gaSend("pc官网-点击登录", "登录界面", "")
        })
    },
    window.JIE = window.JIE || {},
    JIE.openLoginDialog = function() {
        var e = new a;
        e.openLogin()
    },
    $(function() {
        $.validator.methods.iphone = function(e, i) {
            return this.optional(i) || /^1\d{10}$/.test(e)
        };
        var e = new a;
        e._login(),
        e._register(),
        new t
    })
}),
require.config({
    baseUrl: "/static/js",
    urlArgs: "ver=1.5",
    paths: {
        scrollUp: "http://wimg.spriteapp.cn/pc/common/jquery.scrollUp",
        dialog: "http://wimg.spriteapp.cn/pc/dialog/dialog",
        store: "http://wimg.spriteapp.cn/pc/common/store",
        jwplayer: "http://wimg.spriteapp.cn/pc/jwplayer/jwplayer",
        slide: "http://wimg.spriteapp.cn/pc/superslide/jquery.SuperSlide.2.1.1.source",
        lazyload: "http://wimg.spriteapp.cn/pc/lazyload/jquery.lazyload.min",
        user: "module/user"
    },
    shim: {
        scrollUp: {
            exports: ""
        },
        dialog: {
            exports: "dialog"
        },
        jwplayer: {
            exports: "jwplayer"
        },
        slide: {
            exports: ""
        },
        lazyload: {
            exports: ""
        }
    }
}),
require(["module/index", "user"]),
define("config",
function() {});