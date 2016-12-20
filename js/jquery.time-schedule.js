//闭包限定命名空间
(function($) {
	//定义全局变量，设置初始日期
	var mydate = new Date();
	var nowYear = mydate.getFullYear();
	var nowMonth = mydate.getMonth() + 1;
	//var dayNumber = 0;
	$.fn.extend({
		"timeSchedule": function(options) {
			//检测用户传进来的参数是否合法
			if(!isValid(options))
				return this;
			var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数
			return this.each(function() { //这里的this 就是 jQuery对象。这里return 为了支持链式调用
				//遍历所有的要高亮的dom,当调用 highLight()插件的是一个集合的时候。
				var $this = $(this); //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
				//获取标题字符串
				var strTitle = $.fn.timeSchedule.setTitle("上一月", "下一月");
				var dayNumber = DayNumOfMonth(opts.defaultYear, opts.defaultMonth-1);
				var strNum = "";
				for(i = 1; i < dayNumber + 1; i++) {
					strNum = strNum + "<span>" + i + "</span>";
				}
				if(opts.isTitle) {
					$("#" + opts.titleDom).html(strTitle);
					$("#" + opts.numItemsDom).html(strNum);
				} else {
					$this.append("<div class='titleNum' id='" + opts.titleDom + "'>" + strTitle + "</div>");
					$this.append("<div class='numItems' id='" + opts.numItemsDom + "'>" + strNum + "</div>");
				}
				//添加标题
				$("#monthNUm").text(opts.defaultYear+" "+opts.defaultMonth);
				var strItemsUl = "<ul class='spanItems'></ul>";
				$this.append(strItemsUl);

				//初始化数据
				setInit($this.find(".spanItems"), opts.data, dayNumber);
				//是否高亮显示周末
				if(opts.isWeek) {
					setWeek($this, opts.weekColor, opts.defaultYear, opts.defaultMonth, dayNumber);
				}
				setNumInit($this, opts.data, opts.defaultYear, opts.defaultMonth, opts.applyColor, dayNumber);
				$("#lastMonth").on("click", function() {
					opts.defaultMonth = opts.defaultMonth - 1;
					if(opts.defaultMonth == 0) {
						opts.defaultMonth = 12;
						opts.defaultYear = opts.defaultYear - 1;
					}
					dayNumber = DayNumOfMonth(opts.defaultYear, opts.defaultMonth-1);
					$("#monthNUm").text(opts.defaultYear+" "+opts.defaultMonth);
					strNum = "";
					for(i = 1; i < dayNumber + 1; i++) {
						strNum = strNum + "<span>" + i + "</span>";
					}
					$("#" + opts.numItemsDom).html(strNum);
					//初始化数据
					setInit($this.find(".spanItems"), opts.data, dayNumber);
					//是否高亮显示周末
					if(opts.isWeek) {
						setWeek($this, opts.weekColor, opts.defaultYear, opts.defaultMonth, dayNumber);
					}
					setNumInit($this, opts.data, opts.defaultYear, opts.defaultMonth, opts.applyColor, dayNumber);
				});
				$("#nextMonth").on("click", function() {
					opts.defaultMonth = opts.defaultMonth + 1;
					if(opts.defaultMonth == 13) {
						opts.defaultMonth = 1;
						opts.defaultYear = opts.defaultYear + 1;
					}
					dayNumber = DayNumOfMonth(opts.defaultYear, opts.defaultMonth-1);
					$("#monthNUm").text(opts.defaultYear+" "+opts.defaultMonth);
					strNum = "";
					for(i = 1; i < dayNumber + 1; i++) {
						strNum = strNum + "<span>" + i + "</span>";
					}
					$("#" + opts.numItemsDom).html(strNum);
					//初始化数据
					setInit($this.find(".spanItems"), opts.data, dayNumber);
					//是否高亮显示周末
					if(opts.isWeek) {
						setWeek($this, opts.weekColor, opts.defaultYear, opts.defaultMonth, dayNumber);
					}
					setNumInit($this, opts.data, opts.defaultYear, opts.defaultMonth, opts.applyColor, dayNumber);
				});
			});

		}
	});
	//默认参数
	var defaluts = {
		data: [], //每一条的数据
		isTitle: false, //是否自定义标题
		isWeek: true, //是否高亮周末
		weekColor: '#b1fef8', //高亮周末的颜色
		waitColor: "yello", //等待颜色
		applyColor: "red", //申请颜色
		defaultYear: nowYear, //设置默认年份
		defaultMonth: nowMonth, //设置默认月份
		titleDom: "titleNum", //设置默认显示月份的DOM
		numItemsDom: "numItems" //设置默认天数的Dom
	};
	//公共的格式化 方法. 默认是加粗，用户可以通过覆盖该方法达到不同的格式化效果。
	$.fn.timeSchedule.format = function(str) {
			return "<strong>" + str + "</strong>";
		}
		//私有方法，检测参数是否合法
	function isValid(options) {
		return !options || (options && typeof options === "object") ? true : false;
	}

	function setWeek(object, weekColor, Year, Month, dayNumber) {
		for(i = 1; i < dayNumber + 1; i++) {
			var weekDate = new Date(Year, Month, i);
			if(weekDate.getDay() == 0 || weekDate.getDay() == 6) {
				object.find(".spanItems > li span:nth-child(" + i + ")").css("background", weekColor);
			}
		}

	}
	//有几条数据绘制几行，参数分别是dom,数据，和天数
	function setInit(object, data, dayNumber) {
		console.log(object);
		var strItems = "";
		for(i = 0; i < data.length; i++) {
			strItems += "<li>";
			for(j = 0; j < dayNumber; j++) {
				strItems += "<span></span>";
			}
			strItems += "</li>";
		}
		object.html(strItems);
	}
	//数据中已经确认的日期变颜色
	function setNumInit(object, data, Year, Month, applyColor, dayNumber) {
		//console.log(data[0].cfmd);
		for(i = 0; i < data.length; i++) {
			for(j = 0; j < data[i].cfmd.length; j++) {
				for(z = 1; z < dayNumber+1; z++) {
					var biDate = Year + "-" + Month + "-" + z;
					var isDateC = compareDay(biDate, data[i].cfmd[j].startTime, data[i].cfmd[j].endTime);
					//console.log(isDateC);
					if(isDateC) {
						object.find(".spanItems").children("li").eq(i).children("span").eq(z-1).css("background", applyColor);
					}
				}
			}
		}
	}
	//获取该月有多少天
	function DayNumOfMonth(Year, Month) {
		return 32 - new Date(Year, Month, 32).getDate();
	}
	//公共的格式化 方法. 默认是加粗，用户可以通过覆盖该方法达到不同的格式化效果。
	$.fn.timeSchedule.setTitle = function(lastStr, nextStr, titleDom) {
			return "<a id='lastMonth'>" + lastStr + "</a><span id='monthNUm'></span><a id='nextMonth'>" + nextStr + "</a>";
		}
		//a , b ,c格式为 yyyy-MM-dd  a为中间值，b ,c为区间值，判断日期a是否在日期b和c之间
	function  compareDay(a, b, c) {     
		var  a1  =  a.split("-");       
		var  b1  =  b.split("-");  
		var  c1  =  c.split("-");     
		var  d1  =  new  Date(a1[0], a1[1], a1[2]);       
		var  d2  =  new  Date(b1[0], b1[1], b1[2]);
		var  d3  =  new  Date(c1[0], c1[1], c1[2]);
		if(Date.parse(d1) - Date.parse(d2) >= 0 && Date.parse(d1) - Date.parse(d3) <= 0) {
			return true;
		} else {
			return false;
		}
	}
})(window.jQuery);