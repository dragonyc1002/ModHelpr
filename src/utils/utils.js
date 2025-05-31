/**
 * Useful utilities for the bot
 *  - generateCaseId: used to create mod case ID after the prefix i.e. 1e58dee
 *  - [function name]: [purpose of function] (for future references in case new utlities are added)
 * **/

function generateCaseId(length) {
  let result = '';
  const characters = 'abcdef0123456789'; // B, W, P and T are taken for the prefix of the case ID e.g. MOD-Bxxxxx
  const charactersLength = characters.length;
  let counter = 0;
    
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
  }
    
  return result;
}

module.exports = {
  generateCaseId
}