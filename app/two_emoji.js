const jsonfile = require('jsonfile'),
      _ = require('lodash'),
      fileLinesToArray = require('./utils').fileLinesToArray,
      path = require('path');

// load the emojis from the emoji one data, 
// filter out the things we don't want to include:
//   - flags, skin tone varieties, regional indicators, 
//   -  and things in the excluded.json list: bizarre symbols, letters, numbers, some clocks  
const EXCLUDED = fileLinesToArray( path.resolve(__dirname, './data/excluded.txt') ),
      emojis = _.filter( require('emojione/emoji.json'), (e) => {
        return (e.category != 'flags') && (e.diversity === null) && EXCLUDED.indexOf(e.name) == -1 && e.name.indexOf('regional indicator') == -1
      });

// load the positive intros from the json file
// we'll store a history of last used intros so they aren't repeated too
// much on the facebook post, if the randomly selected intro is in the history
// file then we'll regenerate so that a fresh statement is used
const INTROS = fileLinesToArray( path.resolve(__dirname, './data/intros.txt') ),
      INTROS_HISTORY_FILE = './.data/intros-history.json',
      INTROS_HISTORY_SIZE = INTROS.length - 1;

let PAST_INTROS = [];
const writePastIntros = () => { 
  jsonfile.writeFileSync(INTROS_HISTORY_FILE, PAST_INTROS);
};

try {
  PAST_INTROS = jsonfile.readFileSync(INTROS_HISTORY_FILE);
} catch(e) {  
  if (e.code == 'ENOENT'){ // start the file if not exist yet
    writePastIntros();
  }
}

// converts the emoji code point to the utf8 character
const convertCodePoint = require('emojione').convert,
      convert = (e) => { return convertCodePoint(e.code_points.output.toUpperCase()) }

// makes the "be the ..." statement with two emoji
function makeBeStatement() {
  let first, second, sample, wish, punc;
  
  sample = _.sampleSize(emojis, 2);
  first  = convert(sample[0]);
  second = convert(sample[1]);
  wish = _.sample(['wish','wish','wish','want',"would like"]);
  punc = _.sample(['','','','','...','!', '!']);
  
  return `Be the ${first} that you ${wish} to see in the ${second} ${punc}`;
}

// gets a random emoji from our list
const randomEmoji = () => _.sample(emojis),
      randomChar = _.flow( [ randomEmoji , convert] );


function getIntro() {
  // get an intro that is not in the PAST_INTROS array, write to the array storage when done
  let intro = _.sample( _.difference(INTROS, PAST_INTROS) ); 
  PAST_INTROS.push(intro);
  if (PAST_INTROS.length > INTROS_HISTORY_SIZE) {
    // reshift if bigger than INTROS_HISTORY_SIZE, so purging the thing at the begining of the array
    PAST_INTROS = _.drop(PAST_INTROS,PAST_INTROS.length-INTROS_HISTORY_SIZE);
  }
  writePastIntros();
  return intro;
}

// get the full statement to be used as the Facebook update 
function getStatement(){
  let be_the = makeBeStatement(),
      intro = getIntro();
  return `${intro}\n\n${be_the}`;
}

module.exports = {
  getStatement: getStatement,
  randomChar: randomChar
};
