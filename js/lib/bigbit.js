define([], function () {

	function BigBit (bytes, BYTE_SIZE) {
		this.bytes = bytes || { length: 0 };
		this._init(BYTE_SIZE || 8);
	}

	// JavaScript can't do unsigned 32-bit integer bitwise operations, we have to use 31-bit integers
	var BYTE_SIZE = 31;
	var BYTE_SIZE_FLOAT = 31.0;
	
	BigBit.prototype = {
		
		_init: function (_BYTE_SIZE) {
			BYTE_SIZE = _BYTE_SIZE;
			BYTE_SIZE_FLOAT = _BYTE_SIZE * 1.0;
		},
		
		_bitty: function (pos, callback, create) {

			var bitPosition,
				toggleByte,
				bitLength = this.length();

			if (bitLength <= pos) {
				
				// prepends sparse array elements and sets the target byte to 0
				if (create) {
					this.expand(pos, 0);
				}

			}
			// figure out what bit position in a byte this should be
			bitPosition = pos % BYTE_SIZE;
			// which byte to change, the bigger the position, the smaller the byte
			toggleByte = this.bytes.length - Math.floor(pos / BYTE_SIZE_FLOAT) - 1;

			return callback.call(this, pos, toggleByte, bitPosition);
		},

		expand: function (pos, value) {
			var length = this.bytes.length,
				size = Math.floor(pos / BYTE_SIZE_FLOAT) + 1;

			// prepend the necessary number of elements to the array-like object
			Array.prototype.splice.apply(this.bytes, [0, 0].concat(new Array(size - length)));
			this.bytes[0] = value;
		},
		
		length: function () {
			return (this.bytes.length || 0) * BYTE_SIZE;
		},
		
		toggle: function (pos) {
			return this._bitty(pos, function (pos, tB, bP) {
				// toggle the bit
				this.bytes[tB] = this.bytes[tB] ^ (1 << bP);
				// return the current state (same as read)
				return !!(this.bytes[tB] & (1 << bP) >> bP);
			}, true);
		},
		
		on: function (pos) {	
			return this._bitty(pos, function (pos, tB, bP) {
				// turn on the bit
				this.bytes[tB] = this.bytes[tB] | (1 << bP);
				// return state
				return !!(this.bytes[tB] & (1 << bP) >> bP);
			}, true);
		},
		
		off: function (pos) {
			return this._bitty(pos, function (pos, tB, bP) {
				// turn off the bit
				this.bytes[tB] = this.bytes[tB] & ~(1 << bP);
				// return state
				return !!((this.bytes[tB] & (1 << bP)) >> bP);
			});
		},
		
		read: function (pos) {
			return this._bitty(pos, function (pos, tB, bP) {			
				return !!(((this.bytes[tB] || 0) & (1 << bP)) >> bP);
			});
		},
		
		/**
		Operate on two big bit instances
		 */
		operate: function (bigBit, operator) {
			
			var operation;
			
			switch (operator.toLowerCase()) {
				case "or":
					operation = function (a,b) {
						return a | b;
					};
					break;
				case "and":
					operation = function (a,b) {
						return a & b;
					};
					break;
				case "xor":
					operation = function (a,b) {
						return a ^ b;
					};
					break;
			}
			
			var resultBytes = { length: 0 };
			for (var i = 0, l = this.bytes.length, bl = bigBit.bytes.length; i < l && i < bl; i++) {
				Array.prototype.push.call(resultBytes, operation(this.bytes[i], bytes[i]));
			}
			
			return new BigBit(resultBytes);	
		},
		
		and: function (bigBit) {
			return this.operate(bigBit,"and");
		},
		
		or: function (bigBit) {
			return this.operate(bigBit,"or");
		},
		
		xor: function (bigBit) {
			return this.operate(bigBit,"xor");
		},
		
		// for checklists, swap list of haves for list of wants
		complement: function () {
			var bytes = { length: 0 };
			Array.prototype.map.call(this.bytes, function (x, i, a) {
				bytes[i] = ~x;
			});
			return new BigBit(bytes);
		},

		_toString: function (func) {
			var value, encoded = [];

			for (var i = 0, n = 0, l = this.bytes.length; i < l; i++) {
				value = this.bytes[i];
				if (value !== undefined) {
					if (n < i - 1) {
						encoded.push('/' + i + '/');
					}
					n = i;
					encoded.push(func(value));
				}
			}
			return encoded.join("");
		},
		
		toString: function () {
			return this._toString(function (x) { return x.toString(2); });
		},

		toBase32Char: function () {
			return this._toString(function (x) { return String.fromCharCode(x); });
		},
		
		toBase64: function (str) {
			return btoa(this.toBase32Char());
		},
		
		fromString: function (str) {
			return this._fromString(str, function (arr, index) {
				return parseInt(arr.charCodeAt(index), 2);
			});
		},

		fromBase64: function (str) {
			return this._fromString(atob(str), function (arr, index) {
				return arr.charCodeAt(index);
			});
		},

		_fromString: function (str, func) {
			var BYTEMAP_REGEX = /\/[0-9]+\//g,
				bytepos = 0, bytemap, bytesegment, bytesegments,
				b, s, i, l;

			this.bytes = { length: 0 };
			if (str.length > 0) {
				bytemap = str.match(BYTEMAP_REGEX);
				bytesegments = str.split(BYTEMAP_REGEX);

				for (b = 0, s = bytesegments.length; b < s; b++) {
					bytesegment = bytesegments[b];
					for (i = 0, l = bytesegment.length; i < l; i++) {
						this.bytes[bytepos + i] = func(bytesegment, i);
						this.bytes.length++;
					}
					if (bytemap && bytemap.length > b) {
						bytepos = parseInt(bytemap[b].replace('/',''), 10);
						this.bytes.length = bytepos;
					}
				}
			}
			return this;
		}
	}
	
	return BigBit;
});