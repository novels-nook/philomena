Functions are stored here.  Structure:

```javascript
module.exports = {
  command: {
    "name": /* A name for display purposes only, such as in the commands list */
    "desc": /* A short description of what the function does */
    "prompts": /* An array of one or more string or regex prompts to trigger this function */
    "role": /* A string or an array of one or more roles that can use this function (@everyone for anyone) */
    "channels": /* An array of one or more channel names where this function can be used ("All" for any, "Private" for private messages) */
  },
  execute: function(bot, args, message) {
    /* The actual meat of this function! */
  }
}
```
