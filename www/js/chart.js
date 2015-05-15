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
var Chart = (function() {

  var proto = Constructor.prototype;

  var Constructor = function(container, threshold, height) {

    if (! (this instanceof Constructor))
      return new Constructor(container, threshold, height);

    // apply args
    this.threshold = threshold || 0;
    this.height = height || '66%';

    // calculate height
    if(this.height.indexOf('%') != -1)
      this.height = parseInt(window.innerHeight * (parseInt(this.height) / 100));
    else
      this.height = parseInt(this.height);

    // init container
    this.container = d3.select(container);

    // init svg object
    this.svg = this.container
                   .append('svg')
                   .attr('id', 'bnochart')
                   .attr({
                     'width': '100%',
                     'height': height
                   });

    // add label
    this.container.append('<h1><span id="roll"></span>&deg; &nbsp;&nbsp;<span id="yaw"></span>&deg;</h1>')

    //init yaw line
    this.yaw = this.svg.append('line')
                 .attr('x1', '50%')
                 .attr('y1', '-200%')
                 .attr('x2', '50%')
                 .attr('y2', '200%')
                 .attr('stroke', 'black')
                 .attr('stroke-width', '4')
                 .attr('fill', 'none');

    //init roll line
    this.roll = this.svg.append('line')
                    .attr('x1', '-200%')
                    .attr('y1', '50%')
                    .attr('x2', '200%')
                    .attr('y2', '50%')
                    .attr('stroke', 'black')
                    .attr('stroke-width', '4')
                    .attr('fill', 'none');

  };

  proto.container = false;
  proto.svg = false;
  proto.yaw = false;
  proto.roll = false;
  proto.height = '66%';
  proto.threshold = 0;

  proto.update = function(roll, yaw) {

    this.svg.attr({
      'width': '100%',
      'height': this.height
    });

    var w = parseInt(app.chart.svg.style('width'), 10),
        h = parseInt(app.chart.svg.style('height'), 10),
        yawdiv = d3.select('#yaw'),
        rolldiv = d3.select('#roll');

    this.roll.attr('transform', 'rotate(' + parseInt(roll) + ',' + (w/2) + ',' + (h/2) + ')');
    this.yaw.attr('transform', 'rotate(' + parseInt(yaw) + ',' + (w/2) + ',' + (h/2) + ')');

    yawdiv.html(yaw.toFixed(2));
    rolldiv.html(roll.toFixed(2));

    if(Math.abs(yaw) >= this.threshold) {
      yawdiv.style({'color': 'red'});
      this.yaw.attr('stroke', 'red');
    } else {
      yawdiv.style({'color': 'black'});
      this.yaw.attr('stroke', 'black');
    }

    if(Math.abs(roll) >= this.threshold) {
      rolldiv.style({'color': 'red'});
      this.roll.attr('stroke', 'red');
    } else {
      rolldiv.style({'color': 'black'});
      this.roll.attr('stroke', 'black');
    }

  };

  proto.reset = function() {
    this.update(0, 0);
  };

  return Constructor;

})();

