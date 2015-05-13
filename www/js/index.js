var app = {

  initialize: function() {

    this.bindEvents();
    chartDiv.hidden = true;

    this.audioInit();

  },

  last: {
    dir: 0,
    tilt: 0
  },

  offsets: {
    tilt: false,
    dir: false
  },

  corrected: {
    tilt: false,
    dir: false
  },

  timers: {
    audio: {
      tilt: false,
      dir: false
    }
  },

  audioInit: function() {

    var audio = new webkitAudioContext();

    var dir_tone = audio.createOscillator();
    dir_tone.frequency.value = 800;
    dir_tone.start(0);

    var tilt_tone = audio.createOscillator();
    tilt_tone.frequency.value = 568.889;
    tilt_tone.start(0);

    app.sounds = {
      dir: audio.createGain(),
      tilt: audio.createGain()
    };

    app.sounds.dir.gain.value = 0;
    app.sounds.tilt.gain.value = 0;

    tilt_tone.connect(app.sounds.tilt);
    app.sounds.tilt.connect(audio.destination);

    dir_tone.connect(app.sounds.dir);
    app.sounds.dir.connect(audio.destination);

  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.ready, false);
    disconnectButton.addEventListener('touchend', app.disconnect, false);
    offsetButton.addEventListener('touchend', app.saveOffset, false);
  },

  status: function(text) {
    d3.select('#status').html(text);
  },

  updateDisplay: function() {

    if(app.offsets.dir === false) {
      d3.select('#tiltDisplay').html(app.last.tilt.toFixed(2));
      d3.select('#dirDisplay').html(app.last.dir.toFixed(2));
      return;
    }

    d3.select('#tiltDisplay').html(app.corrected.tilt.toFixed(2));
    d3.select('#dirDisplay').html(app.corrected.dir.toFixed(2));

    clearInterval(app.timers.audio.tilt);
    clearInterval(app.timers.audio.dir);

    app.sounds.dir.gain.value = 0;
    app.sounds.tilt.gain.value = 0;

    var change = d3.scale.linear()
                    .domain([0, 180])
                    .range([20, 1000]);

    if(Math.abs(app.corrected.tilt) >= 1) {

      app.timers.audio.tilt = setInterval(function() {
        app.sounds.tilt.gain.value ^= 1;
      }, parseInt(change( Math.abs(app.corrected.tilt))));

    }

    if(Math.abs(app.corrected.dir) >= 1) {

      app.timers.audio.dir = setInterval(function() {
        app.sounds.dir.gain.value ^= 1;
      }, parseInt(change( Math.abs(app.corrected.dir))));

    }

  },

  ready: function() {

    d3.select('#devices ul').html('');

    devices.hidden = false;
    chartDiv.hidden = true;

    app.sounds.dir.gain.value = 0;
    app.sounds.tilt.gain.value = 0;

    clearInterval(app.timers.audio.tilt);
    clearInterval(app.timers.audio.dir);

    bluetoothSerial.isEnabled(app.findDevices, function() {
      app.status('Bluetooth is not enabled.');
    });

  },

  findDevices: function() {

    app.status('Searching...');

    bluetoothSerial.list(
      app.displayList,
      app.status
    );

    app.refresh = setInterval(function() {

      app.status('Searching...');

      bluetoothSerial.list(
        app.displayList,
        app.status
      );

    }, 10000);

  },

  displayList: function(results) {

    if(results.length)
      app.status('');

    d3.select('#devices ul')
      .selectAll('li')
      .data(results)
      .enter()
      .append('li')
      .text(function(d) { return d.name; })
      .on('click', app.connect);

  },

  connect: function(device) {

    app.status('Connecting to ' + device.name + '...');

    devices.hidden = true;

    bluetoothSerial.connect(
      device.uuid,
      app.subscribe,
      app.onDisconnect
    );

  },

  disconnect: function() {

    app.status('Disconnecting...');

    bluetoothSerial.disconnect(
      app.onDisconnect,
      app.status
    );

  },

  subscribe: function() {

    app.status('');

    clearInterval(app.refresh);

    setTimeout(function() {
      chartDiv.hidden = false;
    }, 1000);

    bluetoothSerial.subscribe('\n', app.processData);

  },

  onDisconnect: function() {

    app.status('Connection closed.');
    chartDiv.hidden = true;
    setTimeout(app.ready, 1000);

  },

  saveOffset: function() {

    app.offsets.dir = app.last.dir * -1;
    app.offsets.tilt = app.last.tilt * -1;

  },

  processData: function(data) {

    data = data.split(',');

    app.last.dir = parseFloat(data[0]);
    app.last.tilt = parseFloat(data[1]) + 180;


    if(app.offsets.dir !== false) {

      app.corrected.tilt = (app.offsets.tilt + app.last.tilt) % 360;
      app.corrected.dir = (app.offsets.dir + app.last.dir) % 360;

    }

    app.updateDisplay();

  }

};

app.initialize();
