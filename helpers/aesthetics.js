module.exports = function(bot) {
  return {
    numbersToEmoji: function(numbers, maxLength = 1) {
	  numbers = String(numbers).padStart(maxLength, 0).split('');

	  for (var i = 0, len = numbers.length; i < len; i++) {
        switch (numbers[i]) {
          case '0':
		    numbers[i] = ':zero:';
			break;
		  case '1':
			numbers[i] = ':one:';
			break;
			case '2':
			numbers[i] = ':two:';
			break;
			case '3':
			numbers[i] = ':three:';
			break;
			case '4':
			numbers[i] = ':four:';
			break;
			case '5':
			numbers[i] = ':five:';
			break;
			case '6':
			numbers[i] = ':six:';
			break;
			case '7':
			numbers[i] = ':seven:';
			break;
			case '8':
			numbers[i] = ':eight:';
			break;
			case '9':
			numbers[i] = ':nine:';
			break;
			default:
			numbers[i] = "**" + numbers[i] + "**";
		}
	  }

	  return numbers.join('');
	},

	toCommaList: function (input) {
	  if (!Array.isArray(input) || input.length == 0) {
        return "";
	  }
	  else if (input.length == 1) {
	    return input[0];
	  }
	  else {
	    input[input.length - 1] = "and " + input[input.length - 1];

		if (input.length > 2) {
          return input.join(' ');
		}
		else {
		  return input.join(', ');
		}
      }
	}
  }
}
