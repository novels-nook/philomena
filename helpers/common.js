const request = require('request');
const fs = require('fs');
const moment = require('moment-timezone');

module.exports = function(bot) {
  return {
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    checkObject : function (object, template, callback) {
      var error = null;

      if (typeof object !== 'object' || object == null) {
        error = 'First parameter must be an object';
      }
      else {
        for (let param in template) {
          if (!object.hasOwnProperty(param)) {
            error = 'Missing required parameter `' + param + '`';
          }
          else if (typeof template[param] === 'object' && template[param] !== null) {
            this.checkObject(object[param], template[param], (err) => {
              if (err) {
                error = err;
              }
            });
          }

          if (error) {
            break;
          }
        }
      }

      callback(error);
    },

    timeString: function(dir, date) {
      var seconds;

      if (dir == "since") {
        seconds = Math.floor((new Date() - date) / 1000);
      } else {
        seconds = Math.floor((date - new Date()) / 1000);
      }

      var interval = Math.ceil(seconds / 31536000);
      if (interval > 1) {
        return interval + " years";
      }

      interval = Math.ceil(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }

      interval = Math.ceil(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }

      interval = Math.ceil(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }

      interval = Math.ceil(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }

      return Math.ceil(seconds) + " seconds";
    },

    unique: function(elem, pos, arr) {
      return arr.indexOf(elem) == pos;
    }
  }
}

if (!Date.now) {
  Date.now = function() {
    return new Date().getTime();
  }
}

moment.createFromInputFallback = function(config) {
  config._d = new Date(config._i);
};

String.prototype.lcFirst = function() {
  return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.ucFirst = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
