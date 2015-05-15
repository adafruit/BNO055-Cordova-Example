var BNO055 = (function() {

  var proto = Constructor.prototype;

  var Constructor = function() {

    if (! (this instanceof Constructor))
      return new Constructor();

    d3.select(document).on('deviceready', this.reset.bind(this));
    d3.select('#disconnect').on('touchend', this.disconnect.bind(this));
    d3.select('#offset').on('touchend', this.saveOffset.bind(this));

    this.roll = Reading();
    this.yaw = Reading();
    this.beep = {
      roll: Beep(800, 1),
      yaw: Beep(533, 1)
    };
    this.chart = Chart('#chart', 1);

  };

  proto.connected = false;
  proto.roll = false;
  proto.yaw = false;
  proto.chart = false;
  proto.beep = {
    roll: false,
    yaw: false
  };

  proto.status = function(text) {
    d3.select('#status').html(text);
  };

  proto.update = function() {

    this.chart.update(this.roll.value(), this.yaw.value());

    this.beep.roll.update(this.roll.value());
    this.beep.yaw.update(this.yaw.value());

  };

  proto.reset = function() {

    this.status('');

    this.roll.reset();
    this.yaw.reset();
    this.chart.reset();
    this.beep.roll.reset();
    this.beep.yaw.reset();

    window.plugins.insomnia.keepAwake();
    navigator.splashscreen.show();
    this.connected = false;

    bluetoothSerial.isEnabled(this.findDevices.bind(this), function() {
      navigator.splashscreen.hide();
      app.status('Bluetooth is currently turned off. :(');
    });

  };

  proto.findDevices = function() {

    // search now
    bluetoothSerial.list(
      this.connect.bind(this),
      this.status
    );

    // keep searching
    this.search = setInterval(function() {

      bluetoothSerial.list(
        this.connect.bind(this),
        this.status
      );

    }, 10000);

  };

  proto.connect = function(results) {

    // make sure we have results
    if(! Array.isArray(results) || ! results.length)
      return;

    // loop through bluetooth devices
    results.forEach(function(r) {

      // return if already starting a connection
      // or if the name doesn't match
      if(this.connected || r.name != this.name)
        return;

      // mark as connected
      this.connected = true;

      // connect to the matching device
      bluetoothSerial.connect(
        r.uuid,
        this.subscribe.bind(this),
        this.onDisconnect.bind(this)
      );

    }.bind(this));

  };

  proto.disconnect = function() {

    this.status('Disconnecting...');

    bluetoothSerial.disconnect(
      this.onDisconnect.bind(this),
      this.status
    );

  };

  proto.subscribe = function() {

    // stop searching
    clearInterval(this.search);

    // show the actual app
    navigator.splashscreen.hide();

    // listen for data
    bluetoothSerial.subscribe('\n', this.processData.bind(this));

  };

  proto.onDisconnect = function() {

    this.status('Connection closed.');
    setTimeout(this.reset.bind(this), 1000);

  };

  proto.saveOffset = function() {

    this.yaw.saveOffset();
    this.roll.saveOffset();

  };

  proto.processData = function(data) {

    data = data.split(',');

    if(!Array.isArray(data) || data.length != 2)
      return;

    this.yaw.update(data[0]));
    this.roll.update(parseFloat(data[1]) + 180);

    this.update();

  };

  return Constructor;

})();
