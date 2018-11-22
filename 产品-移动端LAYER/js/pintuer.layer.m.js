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
	"skin": "layer-base", //皮肤 基础样式
	"mask": "show", //显示遮罩层样式
	"html": "test", //内容
	"endgo": "", //结束后执行
	"msg": {
		"msg": "",
		"class": "",
		"time": "",
	},
	"not": {
		"id": "",
		"msg": "",
		"class": "",
	},
	base: function(val) {
		var baseHtml = "";
		if(val != undefined) {
			if(pintuer.isjson(val) != false) {
				//参数赋值
				pintuer.skin = val.skin.length > 0 ? val.skin : pintuer.skin;
				pintuer.mask = val.mask.length > 0 ? val.mask : pintuer.mask;
				pintuer.html = val.html.length > 0 ? val.html : pintuer.html;
			} else {
				console.log('error:不正确的调用参数json(' + val + ')');
			}
		}
		baseHtml += "<div class=\"pintuer-layer\" onclick=\"pintuer.hide()\">";
		baseHtml += "    <div class=\"mask " + pintuer.mask + "\"></div>";
		baseHtml += "    <div class=\"layer " + pintuer.skin + "\">" + pintuer.html + "</div>";
		baseHtml += "</div>";

		pintuer.append('', baseHtml);
	},
	msg: function(val) {
		if(val != undefined) {
			if(pintuer.isjson(val) != false) {
				//参数赋值
				pintuer.msg.class = val.class.length > 0 ? val.class : pintuer.msg.class;
				pintuer.msg.msg = val.msg.length > 0 ? val.msg : pintuer.msg.msg;
				pintuer.msg.time = val.time.length > 0 ? val.time : pintuer.msg.time;
				pintuer.endgo = typeof val.end === 'function' ? val.end : pintuer.endgo;
			} else {
				pintuer.msg.class = "";
				pintuer.msg.msg = val;
				pintuer.msg.time = "2000";
				pintuer.endgo = "";
			}
		}

		var html = "<div class=\"msg " + pintuer.msg.class + "\">" + pintuer.msg.msg + "</div>";

		pintuer.base({
			"mask": "hide", //是否显示遮罩层及配置遮罩层效果
			"skin": "layer-msg", //设置皮肤
			"html": html, //设置内容
		});
		pintuer.animate(pintuer.msg.time, pintuer.endgo);
	},
	not: function(val) {
		//无数据提示
		if(val != undefined) {
			if(pintuer.isjson(val) != false) {
				//参数赋值
				if(val.id == undefined) {
					pintuer.not.id = "";
					pintuer.not.class = val.class.length > 0 ? val.class : pintuer.not.class;
					pintuer.not.msg = val.msg.length > 0 ? val.msg : pintuer.not.msg;
				} else {
					pintuer.not.id = val.id.length > 0 ? val.id : pintuer.not.id;
					pintuer.not.class = val.class.length > 0 ? val.class : pintuer.not.class;
					pintuer.not.msg = val.msg.length > 0 ? val.msg : pintuer.not.msg;
				}
			} else {
				pintuer.not.id = "";
				pintuer.not.class = "notdata";
				pintuer.not.msg = val;
			}
		}
		var html = "";
		html += "<div class=\"" + pintuer.not.class + "\">";
		html += "	<div class=\"pic\"></div>";
		html += "	<div class=\"msg\">" + pintuer.not.msg + "</div>";
		html += "</div>";

		if(pintuer.not.id.length <= 0) {
			pintuer.base({
				"mask": "show", //是否显示遮罩层及配置遮罩层效果
				"skin": "layer-not", //设置皮肤
				"html": html, //设置内容
			});
		} else {
			var shtml = "    <div class=\"layer layer-not\">" + html + "</div>";
			$(pintuer.not.id).html(shtml);
		}
		pintuer.show();
	},
	loading: function(val) {
		/*
		var baseHtml = "";
		if(pintuer.isjson(val) == false || val == undefined) {
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
			pintuer.id = val.id;
			$(pintuer.id).html(baseHtml);
		}
		pintuer.show();
		*/
	},
	end: function(fn) {
		if(typeof fn === 'function') {
			fn();
		}
	},
	animate: function(time, endgo) {
		pintuer.show();
		setTimeout(function() {
			pintuer.hide();
			pintuer.end(endgo);
		}, time);
	},
	show: function() {
		//显示层
		$(".pintuer-layer .mask,.pintuer-layer .layer").addClass("show");
	},
	hide: function() {
		//隐藏层
		$(".pintuer-layer .mask,.pintuer-layer .layer").removeClass("show");
		pintuer.remove('');
	},
	append: function(val, htm) {
		var ap = val.length > 0 ? val : '';
		$("body " + val).append(htm);
	},
	remove: function(val) {
		var re = val.length > 0 ? val : '';
		$(".pintuer-layer " + re).remove();
	},
	isjson: function(str) {
		if(typeof str == 'string') {
			try {
				var obj = JSON.parse(str);
				if(typeof obj == 'object' && obj) {
					return true;
				} else {
					return false;
				}

			} catch(e) {
				console.log('error：' + str + ',' + e);
				return false;
			}
		}
	}
}