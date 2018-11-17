/**
 * pintuer.com
 * 大火兔
 * 1979788761@qq.com
 * 1、兼容UC竖屏转横屏出现的BUG
 * 2、designWidth 自定义设计稿的宽度
 * 3、maxWidth 最大宽度
 */
;
(function(designWidth, maxWidth) {
	var doc = document,
		win = window,
		docEl = doc.documentElement,
		remStyle = document.createElement("style"),
		tid;

	function refreshRem() {
		var width = docEl.getBoundingClientRect().width;
		maxWidth = maxWidth || 540;
		width > maxWidth && (width = maxWidth);
		var rem = width * 100 / designWidth;
		remStyle.innerHTML = 'html{font-size:' + rem + 'px;}';
	}
	if(docEl.firstElementChild) {
		docEl.firstElementChild.appendChild(remStyle);
	} else {
		var wrap = doc.createElement("div");
		wrap.appendChild(remStyle);
		doc.write(wrap.innerHTML);
		wrap = null;
	}
	//要等 wiewport 设置好后才能执行 refreshRem，不然 refreshRem 会执行2次；
	refreshRem();
	win.addEventListener("resize", function() {
		clearTimeout(tid); //防止执行两次
		tid = setTimeout(refreshRem, 300);
	}, false);
	win.addEventListener("pageshow", function(e) {
		if(e.persisted) { // 浏览器后退的时候重新计算
			clearTimeout(tid);
			tid = setTimeout(refreshRem, 300);
		}
	}, false);
	if(doc.readyState === "complete") {
		doc.body.style.fontSize = "16px";
	} else {
		doc.addEventListener("DOMContentLoaded", function(e) {
			doc.body.style.fontSize = "16px";
		}, false);
	}
})(750, 750);

var pintuer = {
	"id": "",
	"skin": "msg",
	"show": "",
	"time": "1000",
	"msg": "",
	"baseHtml": "",
	dialogMsg: function(text) {
		if(pintuer.isJson(text) == false) {
			pintuer.msg = text;
		} else {
			pintuer.skin = text.skin;
			pintuer.msg = text.msg;
			pintuer.time = text.time;
		}
		var baseHtml = "";
		baseHtml += "<div class=\"pintuer-layer\">";
		baseHtml += "    <div class=\"mask\" onclick=\"pintuer.dialogHide()\"></div>";
		baseHtml += "    <div class=\"layer layer-msg\" onclick=\"pintuer.dialogHide()\">";
		if(pintuer.skin == "small") {
			baseHtml += "        <div class=\"msg small\">" + pintuer.msg + "</div>";
		} else {
			baseHtml += "        <div class=\"msg\">" + pintuer.msg + "</div>";
		}
		baseHtml += "    </div>";
		baseHtml += "</div>";

		$("body").append(baseHtml);
		if(pintuer.time != "") {
			pintuer.animateShow();
		} else {
			pintuer.animateShow();
		}
	},
	dialogShow: function() {
		$(".pintuer-layer .mask,.pintuer-layer .layer").addClass("show");
	},
	dialogHide: function() {
		$(".pintuer-layer .mask,.pintuer-layer .layer").removeClass("show");
		$(".pintuer-layer").remove();
	},
	animateShow: function() {
		pintuer.dialogShow();
		setTimeout(function() {
			pintuer.dialogHide();
			$(".pintuer-layer").remove();
		}, pintuer.time);
	},
	dialogLoading: function(text) {
		var baseHtml = "";

		if(pintuer.isJson(text) == false || text == undefined) {
			baseHtml += "<div class=\"pintuer-layer\">";
			baseHtml += "    <div class=\"mask\"></div>";
			baseHtml += "    <div class=\"layer layer-loading\">";
			baseHtml += "        <div class=\"loading\">";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "        </div>";
			baseHtml += "    </div>";
			baseHtml += "</div>";
			$("body").append(baseHtml);
		} else {
			baseHtml += "<div class=\"pintuer-layer\">";
			baseHtml += "    <div class=\"layer layer-loading\" style=\"position: relative;width: 100%;height: 6.4rem;\">";
			baseHtml += "        <div class=\"loading\">";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "            <span></span>";
			baseHtml += "        </div>";
			baseHtml += "    </div>";
			baseHtml += "</div>";
			pintuer.id = text.id;
			$(pintuer.id).html(baseHtml);
		}
		pintuer.dialogShow();

	},
	isJson: function(str) {
		if(typeof str == 'string') {
			try {
				var obj = JSON.parse(str);
				if(typeof obj == 'object' && obj) {
					return true;
				} else {
					return false;
				}

			} catch(e) {
				console.log('error：' + str + '!!!' + e);
				return false;
			}
		}
	}
}