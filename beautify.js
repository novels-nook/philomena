const beautify = require('js-beautify').js_beautify;
const glob = require('glob');
const fs = require('fs');

glob('./+(data|functions|helpers|soul|timers)/**/*.js?(on)', function(err, files) {
  files.push('./app.js');
  files.push('./bot.js');

  for (let i = 0, len = files.length; i < len; i++) {
    console.log('Beautifying ' + files[i]);

    try {
      let content = fs.readFileSync(files[i], 'utf8'),
        newContent = beautify(content, {
          indent_size: 2
        });

      fs.writeFileSync(files[i], newContent, 'utf8');
  	} catch (e) { console.error(e); }
  }
});
