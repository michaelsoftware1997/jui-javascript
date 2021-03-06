window.jui = {};

(function (tools, window) {
	var textWidthElement;

	tools.empty = function(value) {
		if(typeof value === "undefined" || value === undefined) {
            return true;
        }

		if(value === null) {
			return true;
		}

		if(value === '') {
            return true;
        }

		if(Array.isArray(value) && value.length <= 0) {
			return true;
		}

		if(value === 'null') {
			return true;
		}

		if(value === 'undefined') {
            return true;
        }

        return false;
	};

	tools.isFunction = function(obj) {
		return !!(obj && obj.constructor && obj.call && obj.apply); // Thanks to: http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
	};

	tools.isArray = function(obj) {
		if(!Array.isArray) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		} else {
			return Array.isArray(obj);
		}
	}

	tools.inArray = function (needle, haystack) {
		if(!tools.isArray(haystack)) {
			return false;
		}

		if(haystack.indexOf(needle) > -1) {
			return true;
		}

		return false;
	}

	tools.isString = function(obj) {
		return typeof obj === 'string' || obj instanceof String;
	}

	tools.isBoolean = function(obj) {
		return typeof obj === 'boolean' || 
          (typeof obj === 'object' && typeof obj.valueOf() === 'boolean');  // Thanks to: http://stackoverflow.com/questions/28814585/how-to-check-if-type-is-boolean
	}

	tools.getDaysInMonth = function(year, month) {
		return [31, (tools.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	}

	tools.isLeapYear = function(year) {
		return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	}

	tools.getMonthName = function(month) {
		return window.jui.lang.get('month_names')[month];
	}

	tools.parseJSON = function(data) {
		try {
			return JSON.parse(data);
		} catch(error) {
			console.warn('Error while parsing JSON', error);
			return null;
		}
	}

	tools.parseJuiJSON = function(data) {
		var json = tools.parseJSON(data);

		if(json != null) {
			return json;
		} else {
			return [{
					type: 'heading',
					value: 'Error while parsing JSON'
				},{
					type: 'text',
					value: error.message,
					color: '#FF0000'
				},{
					type: 'text',
					value: content
				}
			];
		}
	}

	tools.requestSite = function(url, postData, headers, callback) {
		var xhr = new XMLHttpRequest();

		if(!tools.empty(postData)) {
			xhr.open('POST', url, true);
		} else {
			xhr.open('GET', url, true);
		}

		if(tools.empty(headers)) {
			headers = window.jui.getHeaders();
		}

		if(!tools.empty(headers) && tools.isArray(headers))
		for(var i = 0, x = headers.length; i < x; i++) {
			var header = headers[i];

			if(!tools.empty(header.name) && !tools.empty(header.value)) {
				var name = header.name;
				var value = header.value;

				xhr.setRequestHeader(name, value);
			}
		}

		xhr.onload = function(e) {
			if(!tools.empty(callback) && tools.isFunction(callback)) {
				callback.call(window, this.response, this.status);
			}
		};

		if(!tools.empty(postData)) {
			xhr.send(postData);
		} else {
			xhr.send();
		}
	}

	tools.convertHex = function (hex){
		var length = hex.length;

		if(hex.indexOf('#') == 0) {
			if(length == 4 || length == 7) {
				return hex;
			} else if(length == 8 || length == 9) {
				hex = hex.replace('#','');
				opacity = parseInt(hex.substring(0,2), 16);
				r = parseInt(hex.substring(2,4), 16);
				g = parseInt(hex.substring(4,6), 16);
				b = parseInt(hex.substring(6,8), 16);

				return 'rgba('+r+','+g+','+b+','+opacity/255+')';
			}
		} else if(length == 3 || length == 6) {
			return '#' + hex;
		}

		return '#000000';
	}

	tools.getTextWidth = function(element, text, font, fontSize, fontWeight) {
		if(textWidthElement == null) {
			textWidthElement = document.createElement('span');
			textWidthElement.style.display = 'none';
			document.querySelector('body').appendChild(textWidthElement);
		}

		textWidthElement.innerHTML = (text || element.value || element.innerHTML);
		textWidthElement.style.font = (font || element.style.font);
		textWidthElement.style.fontSize = (element.style.fontSize || fontSize);
		textWidthElement.style.fontWeight = (fontWeight || element.style.fontWeight);

		textWidthElement.style.display = 'inline';
		var width = textWidthElement.getBoundingClientRect().width;
		textWidthElement.style.display = 'none';


		return width;

		/* Thanks to http://jsfiddle.net/philfreo/MqM76/ */
		/*$.fn.textWidth = function(text, font) {
			if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
			$.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));

			return $.fn.textWidth.fakeEl.width();
		};*/
	}
})(window.jui.tools = {}, window);