// This code converts boolean queries in NGC3 to C1.
// Define global arrays to store tokens and processed results
// NGC_list will have the input in a tokenised form
// C1_list will have the output. 
// Error_list will have the list of errors.
//
let NGC3_list = [];
let C1_list = [];
let Error_list = [];

// Initialize stack. This will be used to check queries.
  let stack = [];

function preload() {
// Load each file and assign it to a variable
// Each of these loaded files have the boolean queries for
// tk_filter/filter and tk_custom filters. Source of these queries:
// GU-SUBJECT EXCLUSIONS for C1-250524-020203
//
    masterExclusiveContent = loadStrings('master_exclusive.txt');
    dealsCouponsContent = loadStrings('deals_coupons.txt');
    earningsStockNewsContent = loadStrings('earnings_stock_news.txt');
    jobPostingsContent = loadStrings('job_postings.txt');
    pressReleaseContent = loadStrings('press_release.txt');
    obituariesContent = loadStrings('Obituaries.txt');
    sportsContent = loadStrings('Sports.txt');

}	

function setup() {
  noCanvas();
  
// Create a heading for the page and define the color,
// alignment and width.
//
   let pageHeading = createElement('h1', 'NGC3 to C1 Conversion');
   pageHeading.style('color', '#000080'); // Example of setting the style
   pageHeading.style('text-align', 'center'); // CSS to center the text horizontally
   pageHeading.style('width', '100%'); // Set the width to 100% of its container
  
// Create a heading for the input box and define the color,
// alignment, left margin and width.
//
   let inputHeading = createElement('h3', 'Enter the NGC3 Query Here');
   inputHeading.style('color', '#000080'); // Example of setting the style
   inputHeading.style('text-align', 'left'); // CSS to center the text horizontally
   inputHeading.style('width', '100%'); // Set the width to 100% of its container
   inputHeading.style('margin-left', '20px');
  
// Create a textarea HTML element for the input, define
// the size of the box and the left margin.
//
  userInput = createElement('textarea');
  userInput.attribute('rows', '10');  // Sets the number of lines
  userInput.attribute('cols', '50');  // Sets the number of characters per line
  userInput.style('width', '550px');  // Width of the textarea
  userInput.style('height', '100px'); // Height of the textarea
  userInput.style('resize', 'none');  // Optional: Disables resizing
  userInput.style('margin-left', '20px');
  
// Apply additional CSS for padding for the input textarea.
// Define the border
//
  userInput.style('padding', '10px');       // Adds padding inside the textarea
  userInput.style('border', '1px solid #ccc');  // Adds a border
  userInput.style('box-sizing', 'border-box');  // Includes padding and border in the width and height
  
// wrap-text.
  userInput.style('white-space', 'pre-wrap');  // Ensures whitespace is preserved and lines wrap
  
// Get user input
//
  userInput.input(() => {

  });

// Create a "submit" button for the users and define the
// left margin.
//
  const submitButton = createButton('Submit Query');
  submitButton.style('margin-left', '20px');
  
// Action to be taken when the submit button is clicked.
// Call a set of functions to tokenise the input, store it 
// in NGG3_list, parse it, display the converted query and
// the corrections needed in the appropriate textareas.
//
  submitButton.mousePressed(() => {
    NGC3_list = tokenize(userInput.value());  // Tokenize input and store in NGC3_list
// Proceed only if there was any input.
    if (userInput.value() !== "") {
       parseNGC3toC1();  // Parse the token list to C1 format
       displayOutputList();  // Display the results
    }
    else {
      Error_list.push("No input found");
    }
    
    displayErrorList();  // Display the errors
  });
 
// Create a "Check" button for the users and define the
// left margin.
//
  const checkButton = createButton('Check Query');
  checkButton.style('margin-left', '50px');
  
// Action to be taken when the check button is clicked.
// Call a set of functions to tokenise the input, store it 
// in NGG3_list, check the syntax, display corrections
// needed in the appropriate textareas.
//
  checkButton.mousePressed(() => {
    NGC3_list = tokenize(userInput.value());  // Tokenize input and store in NGC3_list
// Proceed only if there was any input.
    if (userInput.value() !== "") {
       checkSyntax();  // Parse the token list to C1 format
    }
    else {
      Error_list.push("No input found");
    }
    displayErrorList();  // Display the errors
  });
  
// Create a heading for the error box and define the color,
// alignment, left margin and width.
//
  let errorHeading = createElement('h3', 'Corrections Needed');
  errorHeading.style('color', '#000080'); // Example of setting the style
  errorHeading.style('text-align', 'left'); // CSS to center the text horizontally
  errorHeading.style('width', '100%'); // Set the width to 100% of its container
  errorHeading.style('margin-left', '20px');
  
// Create a HTML textarea for error, define the size 
// of the box and the left margin.
//
  let errorArea = createElement('textarea');
  errorArea.id('errorArea');
  errorArea.attribute('rows', '10');  // Sets the number of lines
  errorArea.attribute('cols', '50');  // Sets the number of characters per line
  errorArea.style('width', '550px');  // Width of the textarea
  errorArea.style('height', '100px'); // Height of the textarea
  errorArea.style('resize', 'none');  // Optional: Disables resizing
  errorArea.style('margin-left', '20px');
  
// Apply additional CSS for error area. Define the border.
//
  errorArea.style('border', '1px solid #ccc');  // Adds a border
  errorArea.style('box-sizing', 'border-box');  // Includes padding and border in the width and height
  
// Create a heading for the output box and define the 
// color, alignment, left margin and width.
//
  let outputHeading = createElement('h3', 'Converted C1 Query');
  outputHeading.style('color', '#000080'); // Example of setting the style
  outputHeading.style('text-align', 'left'); // CSS to center the text horizontally
  outputHeading.style('width', '100%'); // Set the width to 100% of its container
  outputHeading.style('margin-left', '20px');
  
// Create a textarea for output define the size 
// of the box and the left margin.
//
  let outputArea = createElement('textarea');
  outputArea.id('outputArea');
  outputArea.attribute('rows', '10');  // Sets the number of lines
  outputArea.attribute('cols', '50');  // Sets the number of characters per line
  outputArea.style('width', '550px');  // Width of the textarea
  outputArea.style('height', '100px'); // Height of the textarea
  outputArea.style('resize', 'none');  // Optional: Disables resizing
  outputArea.style('margin-left', '20px');
  
// Apply additional CSS for output area. Define the border.
//
  outputArea.style('border', '1px solid #ccc');  // Adds a border
  outputArea.style('box-sizing', 'border-box');  // Includes padding and border in the width and height

// Create a button for copying text. Users can press this
// to copy the converted query in the C1 format.
//
  let copyButton = createButton('Copy to Clipboard');
  copyButton.style('margin-left', '20px');

// Sepcify the action to be taken when the button is 
// pressed.
//
  copyButton.mousePressed(() => {
      select('#outputArea').elt.select();
      document.execCommand('copy');
  });
  
}

//
// Individual functions start here. 
//

// Tokenizes input based on specified token types
// At the end of this function, input will be converted
// to tokens and loaded into NGC3_list[]
//
function tokenize(input) {
// This regex will:
// - Capture text enclosed in double quotes
// - Capture individual parentheses and tilde
// - Capture sequences of digits (numbers)
// - Capture words that end with a colon
// - Capture words not enclosed by quotes
// - Text enclosed in single quotes
// Does not consider a . in a quoted word as a delimiter
// Captures + and - as separate tokens

    return input.match(/(?:[()[\]~+\-])|(?:"[^"]*"|'[^']*')|\w+(:?\.\w+)*|\d*\.?\d+/g);

}

// Parse tokens from NGC3 format to C1 format. Depending
// on the encountered token, take suitable action for
// conversion.
// 
function parseNGC3toC1() {
// Loop thru all the tokens loaded into NGC3_list[]
//
  let NGC3_counter = 0;
  while (NGC3_counter < NGC3_list.length) {

// token has the current token being processed.
//
    const token = NGC3_list[NGC3_counter];

// For checkTokenStream
    let valueCount = 0;
    
// For TK_Custom_Processing
    let valCount = 0;
    
// For checkTildeStorm
    let moveIndex = 0;
    
// Handling tokens that are words enclosed in double quotes 
// when the next token is not a ~.
// In NGC3, 2 words in double quotes followed by a ~ and a
// number will be translated as the NEAR token. But if a
// phrase between double quotes doesn't have a ~ next to
// it, no processing is needed. That's the code in this
// nested IF.
//
    
    if (token.startsWith('"') && token.endsWith('"')) {
      if (NGC3_list[NGC3_counter+1] !== '~') {
      wordTokenProcessing(NGC3_counter);
      }
      NGC3_counter++;
      continue; // Skip to the next token
    }
    
// Some tokens may have 1 or more - (hyphens), but may not
// be enclosed in single or double quotes. String these 
// tokens together as a single word. No processing needed.
// - (hyphen) should be treated carefully: because when it
// appears between numbers, it represents a range.
// Check for a hypen first,
//

    if (NGC3_list[NGC3_counter+1] === '-') {
// If the current token and the token after the hyphen are
// not numbers, string these 3 as a word, then skip the
// processing of all 3 tokens.
//
// The variable numericOrString will be set to String if
// the function hyphenWordProcessing find a hyphenated 
// word. Otherwise, the function will set it to "Numeric".
// This function has 2 modes: Parse and Check. In the 
// Parse mode, it will also write to the output list.
//
        numericOrString = hyphenWordProcessing(token, NGC3_counter, "Parse");
        if (numericOrString === "String") {
        NGC3_counter+=3;
        continue;
        }
      }
 
    switch (token) {
      case '(':
      case ')':
      case 'OR':
      case 'AND':
      case 'NOT':
// No processing needed for parenthesis, AND, NOT, OR.
// Just add them to C1_list[]
        C1_list.push(token);
        NGC3_counter++;
        break;
     case 'or':
     case 'and':  
     case 'not':
// Syntax errors. Convert these to uppercase and push it
// in without flagging as errors.
        C1_list.push(token.toUpperCase(0));
        NGC3_counter++;
        break;
     case '+':
// This should be treated as AND. Make an information
// statement.
        C1_list.push('AND');
        NGC3_counter++;
        Error_list.push(`Converted to AND token: ${token}`);
        break;
     case '~':
// If you encounter a ~, proceed with NEAR conversion.
// moveIndex is the value returned by the function 
// checkTildestorm. It indicates how many tokens have already
// been processed. The +2 indicates the current token ~ and the
// number that comes after that.
//
        let moveIndex = nearProcessing(NGC3_counter);
        if (moveIndex !== 0) {
          NGC3_counter = moveIndex+2;
        }
        else {
          NGC3_counter+=2;
        }
        break;
        
      case 'site_urls_ll:':
      case 'site_urls_ll':
      case 'url':
      case 'url:':
// This will be converted to url:
// Sometimes the NGC3 query has url instead of site_urls_ll
// Letting it pass thru without displaying an error.
        C1_list.push('url:');
        NGC3_counter++;
        break;
      case 'tk_language':
      case 'tk_language:':
// Convert languages to C1 codes/
        languageProcessing(NGC3_counter);
        NGC3_counter += 2;  // Skip next token already processed
        break;
      case  'frequent_terms:':
      case  'frequent_terms':
// With or without :, convert frequent_terms to ATLEAST.
         frequentProcessing(NGC3_counter);
         NGC3_counter+=2;
         break;
      case 'tk_location':
      case 'country':
      case 'city':
      case 'state':
      case 'sourcelocationcountry':
      case 'sourcelocationstate':
      case 'tk_location:':
      case 'country:':
      case 'city:':
      case 'state:':
      case 'sourcelocationcountry:':
      case 'sourcelocationstate:':
// All these will be converted to location: in C1.
	     locationProcessing(NGC3_counter);
         NGC3_counter+=2;
         break;
       case 'text':
       case 'text.case_sensitive':
       case 'text:':
       case 'text.case_sensitive:':
// Convert text: to text.case_sensitive: in C1.
// Sometimes the input NGC3 query has errors and it has
// text.case_sensitive instead of text. Just letting it
// pass thru.
        C1_list.push('text.case_sensitive:');
        NGC3_counter++;
        break;
// author will be retained as such
//
       case 'author':
       case 'author:':
        C1_list.push('author:');
        C1_list.push(NGC3_list[NGC3_counter+1]);
        NGC3_counter+=2;
        break;
       case 'mediatype:':
       case 'mediatype':
       case 'medium':
       case 'medium:':
       case 'broadcast_mediatype_l:':
       case 'broadcast_mediatype_l':
// mediatype and broadcast_mediatype become medium in C1.
// Sometimes the input NGC3 query has medium instead of
// mediatype. Letting it pass thru without flagging an
// error.
// broadcast_mediatype_l will also be converted to medium
// but it has an additional token of 1 or 2.
//
        C1_list.push('medium:');
        Media_Type_Processing(NGC3_counter);
        NGC3_counter+=2;
        break;
      case 'sentiment':
      case 'sentiment:':
// As of now, no changes will be made to this keyword or
// its values.
        C1_list.push('sentiment:');
// the sentiment value will also be pushed without changes
        C1_list.push(NGC3_list[NGC3_counter]);
        NGC3_counter+=2;
        break;
      case 'impact:':
      case 'impact':
// GU-CisionOne vs. NGC3 BOOLEAN Comparison-250524-015152
// With that as reference, impact will be converted to
// impact_score_grade.
// 
        C1_list.push('impact_score_grade:');
// the impact value will also be pushed without changes
        C1_list.push(NGC3_list[NGC3_counter]);
        NGC3_counter+=2;
        break;
      case 'seo:':
      case 'seo':
// preliminary analysis indicates seo is the same in
// C1 as in NGC3. To be checked during testing.
        C1_list.push('seo:');
// the seo value will also be pushed without changes
        C1_list.push(NGC3_list[NGC3_counter]);
        NGC3_counter+=2;
        break;
      case 'title:':
      case 'title':
      case 'headline:':
      case 'headline':
// Both these will be translated as title
        C1_list.push('title:');
// the title/headline will also be pushed without changes
        C1_list.push(NGC3_list[NGC3_counter]);
        NGC3_counter+=2;
        break;
      case 'tk_filter':
      case 'tk_filter:':
      case 'filter':
      case 'filter:':
// Elaborate processing for tk_filter.
// filter considered a synonym of tk_filter
        TK_Filter_Processing(NGC3_counter);
        NGC3_counter += 2;  // Assuming the filter type is also handled
        break;
      case 'tk_custom':
      case 'tk_custom:':
// Elaborate processing for tk_custom.
// Usually, valCount = 2. 1 for tk_custom and 1 for the
// filter after that. But if tk_custom:"Keywords" is
// encountered, valCount will be 4.
//
        valCount = TK_Custom_Processing(NGC3_counter);
        NGC3_counter = NGC3_counter + valCount;  
        break;
      case 'tk_company:':
      case 'tk_company':
      case 'tk_competitor':
      case 'tk_competitor:':
      case 'publisher':
      case 'publisher:':
      case 'search_id:':
      case 'search_id':
      case 'seq_id':
      case 'seq_id:':
      case 'article_id:':
      case 'article_id':
      case 'data_source_s':
      case 'data_source_s:':
      case 'tag:':
      case 'tag':
// Details of how to process these keywords has not yet
// been shared for all the above keywords. 
//
        Error_list.push(`Conversion method not shared for token: ${token}`);
// There maybe more than 1 value, maybe a stream of tokens
        valueCount = checkTokenStream(token,NGC3_counter);
// Adding + 1 for the currentToken also
        NGC3_counter = NGC3_counter+valueCount+1;
        break;
      case 'seo_impact:':
      case 'seo_impact':
      case 'tk_readership:':
      case 'tk_readership':
// Details of how to process these keywords has not yet
// been shared for all the above keywords.These 2 have a
// range specified in square brackets.
//
        Error_list.push(`Conversion method not shared for token: ${token}`);
// At NGC3_counter: seo_impact or tk_readership
// NGC3_counter+1: [ (opening square bracket)
// NGC3_counter+ 2: low number for the range
// NGC3_counter+3: - (hyphen)
// NGC3_counter+4: high number of the range
// NGC3_counter+5: ] (closing square bracket)
//
        NGC3_counter+=6;
        break;
      default:
// This is not a known token. This could still be valid,
// since websites and single word searches may not be
// enclosed in quotes. Check if this is such a case. 
// Otherwise, its an error.
        singleWordProcessing(NGC3_counter);
        NGC3_counter++;
        break;
    }
  }
}

// Near processing. In NGC3, 2 or more words in double quotes 
// followed by a ~ and a number is converted to NEAR in C1.
// - 2 words in doubles quotes "First Second"~n will be converted
// to (First" NEAR/n "Second")
//
// - If there are 3-4 words before a ~, the query will  be checked 
// for a tilde stream. A tilde stream is a query like this:
// "Common Phrase Word1 Word2"~n OR "Common Phrase Word3"~n OR 
// "Common Phrase Word4 Word5 Word6"~n
// To be a tilde stream, query segments with ~ should be unbroken
// and continuous, have same number "n" after the ~ and all of them
// must have the same "Common Phrase". The "Common Phrase" can be
// of any length, from 1. 
// - A tilde stream will be converted as: ("Commomon Phrase" NEAR/n // ("Word1 Word2" OR "Word3" OR ("Word4 Word5"))
// - If a phrase is 3-4 characters long and it is not part of a 
// tilde stream, it will be converted differently.
//

function nearProcessing(index) {
// At the position "index" = tilde.
// Position index-1 = Phrase before the ~
// Position index+1 = Number after the ~
// Position index+ 2 = possibly OR, ( or )
  
  const wordToken = NGC3_list[index - 1];
  const currentToken = NGC3_list[index];
  const numberToken = NGC3_list[index + 1];
  
// This will be the value returned from the function
// checkTildeStorm
  let moveIndex =0;
  console.log("in near processing, index");
// Find the number of words in the wordToken 
// Split the string at each space and find the number of words
  let words = wordToken.split(' ');  
  let wordCount = words.length;

  if (wordCount === 2) {
// This means there were exactly 2 words before the ~
  let firstWord = words[0];  // Assign the first word
  let secondWord = words[1];  // Assign the second word

// Construct the NEAR query and push it into C1_list[]
  let nearString = firstWord + " NEAR/" + numberToken + ' ' + secondWord
  C1_list.push(nearString);
  }
  
  else if (wordCount < 2) {
// This means there were  < 2 words before the ~
     Error_list.push("At least 2 words expected before ~");
  }
  
// If there are more than 2 words, check if there's a tilde
// stream.
 else if (wordCount > 2) {
// moveIndex is the number of tokens already processed by the
// function checkTildeStorm.
   console.log(wordToken, "about to go to checkTildeStorm");
   moveIndex = checkTildeStorm(index, wordToken, numberToken);
   console.log("after checktildestorm value of moveindex:", moveIndex);
 }
 
 return(moveIndex);
}


function checkTildeStorm(index, wordToken, numberToken) {
// Here is where the presence of a tilde storm is detected and
// processed
// commonPhrase will contain the common words that query segments
// in a tilde storm have in common.
// 
  let commonPhrase = "";

// Initialize the flag to true. Only when this flag is set will
// the common phrase and NEAR/n be displayed. It will be skipped
// after the start of the tilde storm.
//
  let firstTime = true;
  
// Note down the index value at entry. This is important because
// we will return the difference between the final value of the
// index and the entry value. 
  const entryIndex = index;
  
// Loop till you encounter a left or right parenthesis. If you do,
// some other segment has started. Make sure the tilde and the 
// same number are in place. If not, loop ends.
  console.log("before while in checkTildeStorm");
  while (NGC3_list[index + 2] !== ')' && NGC3_list[index + 2] !== '(' && NGC3_list[index + 4] === '~' && NGC3_list[index + 5] === numberToken) {
    
// The next phrase after this wordToken that is followed by a ~
// and the numberToken
    let nextWordToken = NGC3_list[index + 3];

// Look if there's a common phrase between the current phrase and
// the next phrase
    
    if (!commonPhrase) {
// If commonPhrase = "", we are looking for a new tilde storm
       commonPhrase = findCommonWords(wordToken, nextWordToken);
// Check again if commonPhrase is not ""
       if (!commonPhrase) {
// No tilde storm
// Parse longer tilde words that are not part of the tilde storm
         parseLongPhrases(index, wordToken, numberToken);
         break;
       }
    } 
    
// Tilde storm found.
// Find the remaining words 
    let wordTokenRemaining = removeCommonWords(wordToken, commonPhrase);
    let nextWordTokenRemaining = removeCommonWords(nextWordToken, commonPhrase);
    
// Push the necessary values to the output 
    if (firstTime) {
       C1_list.push(`("${commonPhrase}" NEAR/${numberToken} ("${wordTokenRemaining}"`);
      
       C1_list.push(`${NGC3_list[index + 2]} "${nextWordTokenRemaining}"`);
        
       firstTime = false;
    }
    else {
       C1_list.push(`${NGC3_list[index + 2]} "${nextWordTokenRemaining}"`);
    }
    
  index += 4;
  }
// End of possible tilde storm. 
// Add the ending parenthesis only if there was a tilde storm.
// This is indicated only when index > entryIndex.
// entryIndex is the value of the index at the beginning of this
// function.
  if (index !== entryIndex) {
    C1_list.push('))');
  }

// Return the difference between the final value of the index and
// the entry value. This will be non-zero only if there had been
// a tilde storm.
 console.log("exiting checkTildeStorm");
 return(index - entryIndex+1);
}

function parseLongPhrases(index, wordToken, numberToken) {
// This is to parse phrases with a ~ and 3 or 4 words in the
// phrase. At this point:
// - index points to the ~
// 

// Split the phrase at blanks and find the number of words.
  let words = wordToken.split(" ");
  let wordCount = words.length;

// When the number of words is 3:
// firstPart will have the 1st word.
// secondPart will have the next 2 words.
// 
// When the number of words is 4:
// firstPart will have the 1st 2 words.
// secondPart will have the next 2 words.
  let firstPart, secondPart;
  
  if (wordCount === 3) {
    firstPart = words[0]; 
    secondPart = words[1] + " " + words[2]; 
// Push the output to C1_list
    C1_list.push(`(${firstPart} NEAR/${numberToken} ${secondPart})`);
  } 
  
  else if (wordCount === 4) {
    firstPart = words[0] + " " + words[1]; 
    secondPart = words[2] + " " + words[3]; 
    C1_list.push(`(${firstPart} NEAR/${numberToken} ${secondPart})`);
  } 
  
  else {
    Error_list.push("Too many words before ~");
  }
  
}

function findCommonWords(phrase1, phrase2) {
// Remove quotes for proper comparison
  phrase1NoQuotes = phrase1.replace(/"/g, '');
  phrase2NoQuotes = phrase2.replace(/"/g, '');
  
  let words1 = phrase1NoQuotes.split(" ");
  let words2 = phrase2NoQuotes.split(" ");
  let common = words1.filter(word => words2.includes(word));
  return common.join(" ");
}

function removeCommonWords(original, common) {
// Remove Quotes for proper string handling
  originalNoQuotes = original.replace(/"/g, '');
  commonNoQuotes = common.replace(/"/g, '');
  
  let words = originalNoQuotes.split(" ");
  let commonWords = commonNoQuotes.split(" ");
  let remainingWords = words.filter(word => !commonWords.includes(word));
  return remainingWords.join(" ");
}


// Load and process language settings. The translation code
// for languages was picked up from the PDF: 
// GU-CisionOne vs. NGC3 BOOLEAN Comparison-250524-015152
//
function languageProcessing(index) {
// index points to the token tk_language. 
// index+ 1 points to the NGC3 language.
  const languageToken = NGC3_list[index + 1];
  const languageTokenNoQuotes = languageToken.replace(/"/g, "");

//tk_language will will be converted to language_codes:
//
switch (languageTokenNoQuotes) {
  case 'English':
     C1_list.push('language_codes:', '(en)');
     break;
  case 'Spanish':
     C1_list.push('language_codes:', '(es)');
     break;
   case 'French':
     C1_list.push('language_codes:', '(fr)');
     break;
   case 'German':
     C1_list.push('language_codes:', '(de)');
     break;
   case 'Italian':
     C1_list.push('language_codes:', '(it)');
     break;
   case 'Greek':
     C1_list.push('language_codes:', '(el)');
     break;
  case 'Portuguese':
     C1_list.push('language_codes:', '(pt)');
     break;
  case 'Japanese':
     C1_list.push('language_codes:', '(ja)');
     break;
  case 'Korean':
     C1_list.push('language_codes:', '(ko)');
     break;
  case 'Danish':
    C1_list.push('language_codes:', '(da)');
    break;
  case 'Chinese':
    C1_list.push('language_codes:', '(zh)');
    break;
  default:
// Not a supported language. Issue an error message.
//
    Error_list.push(`Unsupported language: ${languageToken}`);
    break;

  }
}

// Load and process frequent settings
function frequentProcessing(index) {
  const termToken = NGC3_list[index + 1];
  C1_list.push('(', termToken, 'ATLEAST/X');
  
// Indicate to the user that they should change the X in
// ATLEAST
  Error_list.push(`Please change the X in ATLEAST/X`)
}

// Load and process location settings
function locationProcessing(index) {
  const locationToken = NGC3_list[index + 1];
  C1_list.push('location:', locationToken);
}

// Load and process mediatype settings
function Media_Type_Processing(index) {
  const mediaTypeToken = NGC3_list[index + 1];
  
// We need to strip quotes from the input
  const mediaTypeNoQuotes = mediaTypeToken.replace(/"/g, '');
  
      switch (mediaTypeNoQuotes) {
      case 'News':
          mediumToken = "Online"
          C1_list.push(mediumToken);
          break;
      case 'Blog':
      case 'blog':
          mediumToken = "Social"
          C1_list.push(mediumToken);
          break;
      case 'Podcast':
      case 'Podcast:':
          mediumToken = "Podcast"
          C1_list.push(mediumToken);
          break;
      case 'broadcast':
      case 'Broadcast':
          mediumToken = "[TV OR Radio]"
          C1_list.push(mediumToken);
          break;
      case 'Print':
          mediumToken = "Print"
          C1_list.push(mediumToken);
          break;
      case '1':
// This means the previous token was broadcast_mediatype
          mediumToken = "TV"
          C1_list.push(mediumToken);
          break;
      case '2':
// This means the previous token was broadcast_mediatype
          mediumToken = "Radio"
          C1_list.push(mediumToken);
          break;
      case 'NewsLicensed':
      case 'BlogLicensed':
      case 'PrintLicensed':
          Error_list.push(`No known equivalents for LexisNexis content ${mediaTypeToken} in C1`);
          break;
      default:
          Error_list.push(`Unknown mediatype: ${mediaTypeToken}`);
          break;
  }
}

// Process filters based on the type
function TK_Filter_Processing(index) {
  
  const filterType = NGC3_list[index + 1];
// This replace isn't working. We need to strip quotes from
// the input.
// const filterTypeNoQuotes = filterType.replace(/'/g, "");
const filterTypeNoQuotes = filterType.replace(/"/g, '');
  
  switch (filterTypeNoQuotes) {
    case 'Master Exclusive':
      C1_list.push(masterExclusiveContent.join(' '));  
      break;
    case 'Deals & Coupons':
      C1_list.push(dealsCouponsContent.join(' '));
      break;
    case 'Earnings & Stock News':
      C1_list.push(earningsStockNewsContent.join(' ')); 
      break;
    case 'Job Postings':
      C1_list.push(jobPostingsContent.join(' ')); 
      break;
    case 'Press Release':
      C1_list.push(pressReleaseContent.join(' '));  
      break;
    default:
      Error_list.push(`Unknown filter for tk_filter: ${filterTypeNoQuotes}`);
      break;
  }
}

// Process custom filters based on the type
function TK_Custom_Processing(index) {
  const filterType = NGC3_list[index + 1];
// This replace isn't working. We need to strip quotes from
// the input.
// const filterTypeNoQuotes = filterType.replace(/'/g, "");
    const filterTypeNoQuotes = filterType.replace(/"/g, '');
  
// Initialize the value of the return variable.
// This will usually be 2. 1 for tk_custom and 1 for the
// filter. But if the filter is "Keywords", there are 2
// extra values that appear after that. None of these can
// be processed into C1.
  let valCount = 2;
  
  switch (filterTypeNoQuotes) {
    case 'Obituaries Filter':
      C1_list.push(obituariesContent.join(' ')); 
      break;
    case 'Sports Filter':
      C1_list.push(sportsContent.join(' '));  
      break;
    case 'Keywords:':
    case 'Keywords':
// There are parts of the query in the format:
// (tk_custom:'Keywords' OR "3655606 = Keywords")
// This cannot be converted into C1. Flag an error.
//
      const errorString = NGC3_list[index] + ':' + filterType+ " " + NGC3_list[index+2] + " " + NGC3_list[index+3]; 
      Error_list.push(`Can not be converted: ${errorString}`);
// The return value this time will be 4.
      valCount = 4;
      break;
    default:
      Error_list.push(`Unknown filter for tk_custom: ${filterTypeNoQuotes}`);
      break;
  }
  return (valCount);
}

// Display the final output list of processed items.
// At this point, C1_list[] has the converted query.
//
function displayOutputList() {
// Join the list's contents into a single string with a
// space as separator.
    const c1String = C1_list.join(' ');  // Join with space for readability
//Display output in the designated window
    select('#outputArea').value(c1String);
}

// Display the final error list. At this point, Error_list
// has a list of all corrections needed.
//
function displayErrorList() {
// At this point, check if there's any parenthesis left in 
// the stack
  if (stack.length !== 0) {
    Error_list.push("Mismatched parenthesis in the query");
  }
  
// Join the list's contents into a single string with a 
// space as separator.
    const errorString = Error_list.join(', ');  // Join with a comma for clear separation
  
// Display the current date and time in the error window
  let now = new Date();  // Create a new Date object that represents the current time
  let dateString = now.toLocaleDateString();  // Format the date
  let timeString = now.toLocaleTimeString();  // Format the time
  let dateTimeString = "Current Date and Time:" + dateString + timeString

  select('#errorArea').value(dateTimeString);

// Display the current version of the program
  let programName = "Program Version: NGC3_to_C1_Converter_V1";
  select('#errorArea').value(programName);

// See if there were any errors
  if (errorString === "") {
    let noErrors = "No errors encountered";
    select('#errorArea').value(noErrors);
  } 
  else {
    select('#errorArea').value(errorString);
  }

}

// Example of processing word tokens
function wordTokenProcessing(index) {
// Directly add word tokens to C1 list
  C1_list.push(NGC3_list[index]);
}

function hyphenWordProcessing(token, index, mode) {
// If the current token and the token after the hyphen are
// not numbers, string these 3 as a word, then skip the
// processing of all 3 tokens.
//
  const hyphenToken = NGC3_list[index+1];
  const nextNextToken = NGC3_list[index+2];
  
// Initialize return result. This will initially be set to
// "Numeric". This indicates that it is bt default a 
// numeric range as seen intk_readership. If we find 
// that it is indeed a hyphenated string, result will be
// set to "String".
//
  let result = "Numeric";
  
  if (isNaN(parseInt(token)) && isNaN(parseInt(nextNextToken))) {
// Check if we're parsing. If yes, we should construct
// the string and populate the oitput list. If we're
// merely checking, we don't have to populate C1_list.

    if (mode === 'Parse') {
// String the 3 tokens together and embed it in double
// quotes
    const consolidatedToken = '"' + token + hyphenToken + nextNextToken + '"';
// Push it into the output list, increment the counter
// and skip further processing.
    C1_list.push(consolidatedToken);
    }
// In any case, return result to "String" to indicate that
// a hyphenated word was found, not a numeric range.
//
    result = "String";
    return(result);
  }

}

function checkSyntax() {
// Loop for all the elements in the list NGC3_list.
  let NGC3_counter = 0

// To hold the return value from the function 
// checkTokenStream
  let valueCount = 0;
// For checkTKCustom
    let valCount = 0;
  
  while (NGC3_counter < NGC3_list.length) {
    const currentToken = NGC3_list[NGC3_counter];
    const nextToken = NGC3_list[NGC3_counter+1];
 
// Handling tokens that are words enclosed in double quotes 
// Skip all words enclosed in double quotes. No checking
// needed.
//
    if (currentToken.startsWith('"') && currentToken.endsWith('"')) {
      NGC3_counter++;
      continue; // Skip to the next token
    }
    
    if (NGC3_list[NGC3_counter+1] === '-') {
// If the current token and the token after the hyphen are
// not numbers, string these 3 as a word, then skip the
// processing of all 3 tokens.
//
// The variable numericOrString will be set to String if
// the function hyphenWordProcessing find a hyphenated 
// word. Otherwise, the function will set it to "Numeric".
// This function has 2 modes: Parse and Check. In the 
// Parse mode, it will also write to the output list.
//
        numericOrString = hyphenWordProcessing(currentToken, NGC3_counter, "Check");
        if (numericOrString === "String") {
        NGC3_counter+=2;
        continue;
        }
    }

    switch (currentToken) {
      case '(':
      case ')':
// Check if the parenthesis match
        checkParenthesis(currentToken,NGC3_counter);
        break;
      case 'or':
      case 'and':
      case 'not':
      case 'OR':
      case 'AND':
      case 'NOT':
        if (['or','and','not'].includes(currentToken)) {
// These should be in uppercase
          Error_list.push(`Boolean operator ${currentToken} should be uppercase at position: ${NGC3_counter}`);
        }
// Check if there's a valid token after these. Otherwise
// its an error.
        checkNextToken(currentToken, NGC3_counter);
// Not adding 1 to NGC3_counter here, since we need tp
// parse the next token
        break;
      case '~':
        checkTilde(NGC3_counter);
        NGC3_counter++;
        break;
      case 'tk_filter':
      case 'tk_filter:':
      case 'filter:':
      case 'filter':
// Check if the next token is valid
// tk_filter and filter are considered synonyms.
        checkTKFilter(nextToken);
        NGC3_counter++;
        break;
      case 'tk_custom':
      case 'tk_custom:':
// Check if the next token is valid. 
// valCount is usually 1. if tk_custom:"Keywords" is
// encountered, it will be 3.
        valCount = checkTKCustom(nextToken, NGC3_counter);
        NGC3_counter=NGC3_counter+valCount;
        break;
      case 'mediatype':
      case 'mediatype:':
      case 'medium':
      case 'medium:':
      case 'broadcast_mediatype_l':
      case 'broadcast_mediatype_l:':
// broadcast_mediatype_l will also be converted to medium
// but it has an additional token of 1 or 2.
// Even though medium: is an error in NGC3, let us process
// the values after that in the input stream.The keyword
// will be flagged as an error first.
        if (currentToken === 'medium') {
// mediatype is the correct keyword for NGC3
          Error_list.push(`medium used instead of mediatype at position: ${NGC3_counter}`);
        }
// Check if the next token is valid
        checkMediatype(nextToken);
        NGC3_counter++;
        break;
      case 'tk_language':
      case 'tk_language:':
        checkTKLanguage(nextToken);
        NGC3_counter++;
        break;
      case 'tk_location':
      case 'country':
      case 'state':
      case 'city':
      case 'sourcelocationcountry':
      case 'sourcelocationstate':
      case 'tk_location:':
      case 'country:':
      case 'state:':
      case 'city:':
      case 'sourcelocationcountry:':
      case 'sourcelocationstate:':
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
      case 'impact':
      case 'impact:':
        checkImpact(nextToken);
        NGC3_counter++;
        break;
      case 'seo':
      case 'seo:':
        checkSEO(nextToken);
        NGC3_counter++;
        break;
      case 'sentiment':
      case 'sentiment:':
        checkSentiment(nextToken);
        NGC3_counter++;
        break;
      case 'seo_impact':
      case 'seo_impact:':
      case 'tk_readership':
      case 'tk_readership:':
// At NGC3_counter: seo_impact or tk_readership
// NGC3_counter+1: [ (opening square bracket)
// NGC3_counter+ 2: low number for the range
// NGC3_counter+3: - (hyphen)
// NGC3_counter+4: high number of the range
// NGC3_counter+5: ] (closing square bracket)
//
        checkRange(currentToken, NGC3_counter);
        NGC3_counter+=5;
        break;
      case 'title:':
      case 'title':
      case 'headline':
      case 'headline:':
      case 'seq_id':
      case 'seq_id:':
      case 'article_id:':
      case 'article_id':
      case 'data_source_s:':
      case 'data_source_s':
      case 'tag:':
      case 'tag':
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
      case 'publisher':
      case 'publisher:':
      case 'author':
      case 'author:':
      case 'tk_company':
      case 'tk_company:':
        checkNextToken(currentToken, NGC3_counter);
        NGC3_counter++;
        break;
      case 'text':
      case 'text:':
      case 'text.case_sensitive':
      case 'text.case_sensitive:':
// Even though text.case_sensitive: is an error in NGC3,
// let us process the values after that in the input 
// stream. The keyword will be flagged as an error first.
// 
        if (currentToken === 'text.case_sensitive') {
// text is the correct keyword for NGC3
          Error_list.push(`text.case_sensitive used instead of text at position: ${NGC3_counter}`);
        }
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
      case 'frequent_terms':
      case 'frequent_terms:':
// Expecting 1 or several values in parenthesis after
// these tokens
        valueCount = checkTokenStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
      case 'search_id':
      case 'search_id:':
        checkNextToken(currentToken, NGC3_counter);
        NGC3_counter++;
        break;
      case 'url_direct':
      case 'url_direct:':
// Check if this is a valid URL
        checkURL(currentToken, NGC3_counter);
        NGC3_counter++;
        break;
      case 'site_urls_ll':
      case 'site_urls_ll:':
      case 'url':
      case 'url:':
// Even though url: is an error in NGC3, let us process
// the values after that in the input stream.The keyword
// will be flagged as an error first.
        if (currentToken === 'url') {
// site_urls_ll is the correct keyword for NGC3
          Error_list.push(`url used instead of site_urls_ll at position: ${NGC3_counter}`);
        }
// Check if this is a valid URL, but add https:// first.
// Expecting 1 URL - or more URLs enclosed in parenthesis.
        valueCount = checkDomainStream(currentToken, NGC3_counter);
        NGC3_counter = NGC3_counter +valueCount;
        break;
      default:
// This is not a known token. This could still be valid,
// since websites and single word searches may not be
// enclosed in quotes. Check if this is such a case. 
// Otherwise, its an error.
        checkSingleWord(NGC3_counter);
        break;
    }
// Go to the next token
    NGC3_counter++
  }
}

function checkParenthesis(token, index) {
// Push the position of every '(' into the stack.Whenever 
// a ')' is encountered, pop from the stack.
//  If the stack is empty
// at the end of processing, all the parenthesis are 
// matched.
//
    if (token === '(') {
      stack.push(index);
    } 
    else if (token === ')') {
// If a ')' is encountered when the stack length is 0,
// its an error.
      if (stack.length === 0) {
        Error_list.push(`Unmatched right parenthesis at position: ${index}`);
      } 
      else {
        stack.pop();
      }
    }
}

function checkNextToken(token, index) {
// Check if there's a valid token after these. Otherwise
// its an error.
  const nextToken = NGC3_list[index+1];
  
  if (!nextToken) {
    Error_list.push("missing value after "+ token +  " at position " + index+1);
  }
}

function checkTokenStream(token, index) {
// Check if there's a valid token after these. Otherwise
// its an error.
// Also, instead of a single value, there could be 
// multiple values separated by NOT AND or OR,
// provided within parenthesis.
//
  let nextToken = NGC3_list[index+1];
  let valueCount = 0;
  
  if (!nextToken) {
    Error_list.push("missing value after "+ token +  " at position " + index+1);
  }
  
// If the next token is a parenthesis, see how many values
// are provided.
  
  if (nextToken === '(') {
// Push the position in the stack
    stack.push(index);
    
    while (nextToken !== ')') {
      valueCount++;
      index++;
      nextToken = NGC3_list[index];
    }
// Check if a right parenthesis was found. If yes, pop
// the stack.
    if (nextToken === ')') {
      stack.pop();
    }
  }
  else {
// At least 1 value was found
    valueCount++;
  }
//
// These many values were found after the keyword
//
  return(valueCount);
}

function checkTilde(index) {
// At the position index is the ~
// Before the tilde, there should be a phrase in double
// quotes with exactly 2 words. After the tilde should be 
// a positive whole number.
//
  const wordToken = NGC3_list[index-1];
  const numberToken = parseInt(NGC3_list[index+1]);
  
// Split the string at each space
  let words = wordToken.split(' ');  

  if (words.length >= 2) {
// No action needed
    }
  
  else {
// This means there were < 2 words before the ~
     Error_list.push("At least 2 words expected before ~");
  }
  
  if (!Number.isInteger(numberToken)) {
// This means there wasn't a whole number after the ~
// Flag an error.
     Error_list.push("Whole number expected after ~");
  }
  
}

function checkTKFilter(token) {
// This function checks if approved filters are used
// Strip all quotes from the token
// Treating tk_filter and filter as synonyms.
//
let strippedToken = token.replace(/["']/g, '');
  
if (!['Master Exclusive','Deals & Coupons', 'Earnings & Stock News', 'Job Postings', 'Market Research Reports', 'TV Shows', 'Press Release', 'Top Tier Readership'].includes(strippedToken)) {
    Error_list.push(`Unknown filter used for tk_filter: ${token}`);
  }
}

function checkTKCustom(token, index) {
// This function checks if approved filters are used
// Strip all quotes from the token
let strippedToken = token.replace(/["']/g, '');
  
// This is the default number of tokens after tk_custom.
// This differs when tk_custom:"Keywords" is encountered.
let valueCount = 1;
  
if (!["Sports Filter","Real Estate Listings","Obituaries Filter", "Keywords"].includes(strippedToken)) {
    Error_list.push(`Unknown filter used for tk_custom: ${token}`);
}

  if (strippedToken === 'Keywords') {
// There are parts of the query in the format:
// (tk_custom:'Keywords' OR "3655606 = Keywords")
// This cannot be converted into C1. Flag an error.
//
      const errorString = NGC3_list[index] + ':' + token+ " " + NGC3_list[index+2] + " " + NGC3_list[index+3]; 
      Error_list.push(`Can not be converted: ${errorString}`);
    valueCount = 3;
  }
  
// Return the numer of tokens found after tk_custom.
  return(valueCount);
}

function checkMediatype(token) {
// This function checks if approved mediatypes are used
// Strip all quotes from the token
let strippedToken = token.replace(/["']/g, '');

// 1 and 2 are values used by broadcast_mediatype_l.
//
if (!["News","Blog", "Podcast", "Broadcast", "1", "2","NewsLicensed", "BlogLicensed", "Print"].includes(strippedToken)) {
    Error_list.push(`Unknown mediatype used: ${token}`);
  }
}

function checkTKLanguage(token) {
// This function check if approved languages are used
// Strip all quotes from the token
  let strippedToken = token.replace(/["']/g, '');
  
  if (!["English",'French',"Spanish", "Greek", "Korean", "Chinese", "Japanese", "German", "Italian", "Danish", "Portuguese"].includes(strippedToken)) {
    Error_list.push(`Unknown language used for tk_language: ${token}`);
  }
}

function checkImpact(token) {
// This function check if correct impact codes are used
// Strip all quotes from the token
  let strippedToken = token.replace(/["']/g, '');
  
  if (!["high","medium", "low"].includes(strippedToken)) {
    Error_list.push("Unknown code used for impact " + token);
  }
 }
  
function checkSEO(token) {
// This function check if correct SEO codes are used
// Strip all quotes from the token
  let strippedToken = token.replace(/["']/g, '');
  
  if (!["excellent","strong", "good", "average", "low"].includes(strippedToken)) {
    Error_list.push("Unknown code used for SEO " + token);
  }
 }
  
function checkSentiment(token) {
// This function check if correct sentiment codes are used
// Strip all quotes from the token
  let strippedToken = token.replace(/["']/g, '');
  
  if (!["positive","neutral", "negative"].includes(strippedToken)) {
    Error_list.push("Unknown code used for sentiment " + token);
  }
 }
  
function checkRange(token, index) {
// This function will check if a range is given for 
// seo_impact and readership. Ar position index+2 will be 
// the - (hyphen) symbol.
// At index: seo_impact or tk_readership
// index+1: [ (opening square bracket)
// index+ 2: low number for the range
// index+3: - (hyphen)
// index+4: high number of the range
// index+5: ] (closing square bracket)
//
  const lowNumber = NGC3_list[index+2];
  const highNumber = NGC3_list[index+4];

// Check if both are integers. Otherwise, issue an error.
  if (/^\d+$/.test(lowNumber.trim()) && /^\d+$/.test(highNumber.trim())) {
// Do nothing. Both are integers.
  }
  else {
    Error_list.push("Range should be numeric for " + token);
  }
 }

function checkURL(token, index) {
// This function checks if valid URLs have been provided for
// url_dorect and site_urls_ll.
  const urlString = NGC3_list[index+1];
// Strip quotes
//
  let strippedToken = urlString.replace(/["']/g, '');
  
  try {
    result = new URL(strippedToken);
  } 
  catch(e) {
    result = false;
  }
    
  
  if (!result) {
    Error_list.push("Invalid URL used for " + token + " " + urlString);
  }
}

function checkDomainStream(token, index) {
// Check if there's a valid token after these. Otherwise
// its an error.
// Also, instead of a single value, there could be 
// multiple values separated by NOT AND or OR,
// provided within parenthesis.
//
  let nextToken = NGC3_list[index+1];
  let valueCount = 0;
  
  if (!nextToken) {
    Error_list.push("missing value after "+ token +  " at position " + index+1);
  }
  
// If the next token is a parenthesis, see how many values
// are provided.
  
  if (nextToken === '(') {
// Push the position in the stack
    stack.push(index);
    
    while (nextToken !== ')') {
      valueCount++;
      index++;
      nextToken = NGC3_list[index];
      checkDomain(nextToken);
    }
// Check if a right parenthesis was found. If yes, pop
// the stack.
    if (nextToken === ')') {
      stack.pop();
    }
  }
  else {
// At least 1 value was found
    checkDomain(nextToken);
    valueCount++;
  }
//
// These many values were found after the keyword
//
  return(valueCount);
}

function checkDomain(token) {
// Check if the domain exists. But first, prefix it with
// https:// and stripping the quotes
  const urlString = token;
  let strippedToken = urlString.replace(/["']/g, '');
  
  const secureURL = "https://".concat(strippedToken);
  
  try {
    result = new URL(secureURL);
  } 
  catch(e) {
    result = false;
  }
    
  
  if (!result) {
    Error_list.push("Invalid URL used for " + token + " " + urlString);
  }
}

function singleWordProcessing(index) {
// This function is called when a word not enclosed in 
// quotes is encountered. This word is not one of the
// NGC3 keywords either. This is either an error or a 
// word that should be enlosed in couble quotes and 
// pushed into the output list.
  
  currentToken = NGC3_list[index];
// Let us check if the previous token and the next token
// are boolean keywords; Or they can be an opening or a 
// closing parenthesis; Or this is the last word in the
// query. In all these cases, declare this a valid word,
// enclose it in double quotes and push it to C1_list.
//
  prevToken = NGC3_list[index-1];
// If this is the first word, prevToken will be undefined.
// Assign null to it.
//
  if (prevToken === undefined) {
    prevToken = "";
  }
  
  nextToken = NGC3_list[index+1];
// If this is the last word, nextToken will be undefined.
// Assign null to it.
//
  if (nextToken === undefined) {
    nextToken = "";
  }
  
  switch (prevToken, nextToken) {
    case '(', ')':
    case '(', 'NOT':
    case '(', 'AND':
    case '(', 'OR':
    case 'NOT', ')':
    case 'AND', ')':
    case 'OR', ')':
    case "", "":
    case "", 'NOT':
    case "", 'AND':
    case "", 'OR':
    case 'NOT', "":
    case 'AND', "":
    case 'OR', "":
      let quotedToken = "\"" + currentToken + "\"";  // Escaping double quotes
      C1_list.push(quotedToken);
      break;
    default:
      Error_list.push(`Unknown token: ${currentToken}`);
      break;
  }
}

function checkSingleWord(index) {
// This function is called when a word not enclosed in 
// quotes is encountered. This word is not one of the
// NGC3 keywords either. This is either an error or an 
// acceptable word.
  
  currentToken = NGC3_list[index];
// Let us check if the previous token and the next token
// are boolean keywords; Or they can be an opening or a 
// closing parenthesis; Or this is the last word in the
// query. In all these cases, declare this a valid word.
//
  prevToken = NGC3_list[index-1];
// If this is the first word, prevToken will be undefined.
// Assign null to it.
//
  if (prevToken === undefined) {
    prevToken = "";
  }
  
  nextToken = NGC3_list[index+1];
// If this is the last word, nextToken will be undefined.
// Assign null to it.
//
  if (nextToken === undefined) {
    nextToken = "";
  }
  
  switch (prevToken, nextToken) {
    case '(', ')':
    case '(', 'NOT':
    case '(', 'AND':
    case '(', 'OR':
    case 'NOT', ')':
    case 'AND', ')':
    case 'OR', ')':
    case "", "":
    case "", 'NOT':
    case "", 'AND':
    case "", 'OR':
    case 'NOT', "":
    case 'AND', "":
    case 'OR', "":
// Do nothing
      break;
    default:
      Error_list.push(`Unknown keyword encountered: ${currentToken}`);
      break;
  }
}

// This function is for debugging. Mainly for string
// comparisons. 
// How to use this function:
// let diff = compareStrings(str1, str2);
// console.log("Differences: ", diff);
//
function compareStrings(a, b) {
  let maxLength = max(a.length, b.length);
  let differences = [];
  
  for (let i = 0; i < maxLength; i++) {
    if (a[i] !== b[i]) {
      differences.push(`Difference at position ${i}: ${a[i]} vs ${b[i]}`);
    }
  }
  
  return differences;
}


