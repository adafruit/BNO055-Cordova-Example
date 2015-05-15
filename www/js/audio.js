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
var Beep = (function() {

  var Constructor = function(frequency, threshold) {

    if (! (this instanceof Constructor))
      return new Constructor(frequency, threshold);

    // apply args
    this.frequency = frequency || 440;
    this.threshold = threshold || 0;

    // init context
    this.context = new webkitAudioContext();

    // init vco
    this.vco = this.context.createOscillator();
    this.vco.frequency.value = this.frequency;
    this.vco.start(0);

    // init vca
    this.vca = this.context.createGain();
    this.vca.gain.value = 0;

    // connect vco to vca
    this.vco.connect(this.vca);

    // connect vca to context
    this.vca.connect(this.context.destination);

  };

  var proto = Constructor.prototype;

  proto.context = false;
  proto.vco = false;
  proto.vca = false;
  proto.timer = false;
  proto.frequency = 440;
  proto.threshold = 0;
  proto.range = [20, 1000];
  proto.domain = [0, 180];
  proto.scale = false;

  proto.update = function(value) {

    // stop any current sounds
    this.reset();

    if(Math.abs(value) >= this.threshold) {

      this.timer = setInterval(function() {
        this.vca.gain.value ^= 1;
      }.bind(this), this.getInterval(value));

    }

  };

  proto.reset = function() {

    // clear timer
    if(this.timer) {
      clearInterval(this.timer);
      this.timer = false;
    }

    // shut off vca
    this.vca.gain.value = 0;

  };

  proto.getInterval = function(value) {

    if(! this.scale)
      this.scale = d3.scale.linear().domain(this.domain).range(this.range);

    return parseInt( this.scale( Math.abs(value) ) );

  };

  return Constructor;

})();
