// The MIT License (MIT)
//
// Author: Todd Treece <todd@uniontownlabs.org>
// Copyright (c) 2015 Adafruit Industries
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
var Reading = (function() {

  var proto = Constructor.prototype;

  var Constructor = function() {

    if (! (this instanceof Constructor))
      return new Constructor();

  };

  proto.last = 0;
  proto.offset = false;
  proto.corrected = false;

  proto.value = function() {

    if(this.offset === false)
      return this.last;

    return this.corrected;

  };

  proto.update = function(value) {

    this.last = parseFloat(value);

    if(this.offset === false)
      return;

    this.corrected = (this.offset + this.last) % 360;

  };

  proto.saveOffset = function() {

    this.offset = this.last * -1;
    this.corrected = (this.offset + this.last) % 360;

  };

  proto.reset = function() {

    this.last = 0;
    this.offset = false;
    this.corrected = false;

  };

  return Constructor;

})();
