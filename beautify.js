var beautify = require('js-beautify').js_beautify,
  glob = require('glob'),
  fs = require('fs');

glob('./+(brain|data|functions|helpers|timers)/**/*.js?(on)', function(err, files) {
  files.push('./azubot.js');

  for (var i = 0, len = files.length; i < len; i++) {
    console.log('Beautifying ' + files[i]);

    var content = fs.readFileSync(files[i], 'utf8'),
      newContent = beautify(content, {
        indent_size: 2
      });

    fs.writeFileSync(files[i], newContent, 'utf8');
  }
});
