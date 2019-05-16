export const costream = {
    // Difficulty: "Easy"
// Language definition for Java
	defaultToken: '',
	tokenPostfix: '.java',

	 keywords: [
        'abstract', 'continue', 'for', 'new', 'switch', 'assert', 'goto', 'do',
        'if', 'private', 'this', 'break', 'protected', 'throw', 'else', 'public',
        'enum', 'return', 'catch', 'try', 'interface', 'static', 'class',
        'finally', 'const', 'super', 'while', 'true', 'false',
        //'param','init','work','window','matrix'
      ],
    
      typeKeywords: [
        'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float',
        //'composite','input','output','stream',
        //'tumbling','sliding',
        //'split','join',
      ],

      costreamtypeKeywords:[
        'composite',, 'stream',
        'tumbling','sliding',
        'roundrobin','duplicate',
        'FileReader','FileWriter',
      ],
      costreamKeywords:[
        'param','init','work','window','matrix',
        'input','output',
        'split','join',
        ],


	operators: [
		'=', '>', '<', '!', '~', '?', ':',
		'==', '<=', '>=', '!=', '&&', '||', '++', '--',
		'+', '-', '*', '/', '&', '|', '^', '%', '<<',
		'>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
		'^=', '%=', '<<=', '>>=', '>>>='
	],

	// we include these common regular expressions
	symbols: /[=><!~?:&|+\-*\/\^%]+/,
	escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
	digits: /\d+(_+\d+)*/,
	octaldigits: /[0-7]+(_+[0-7]+)*/,
	binarydigits: /[0-1]+(_+[0-1]+)*/,
	hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

	// The main tokenizer for our languages
	tokenizer: {
		root: [
			// identifiers and keywords
			[/[a-zA-Z_$][\w$]*(?= *\()/, {
				cases: {
                    '@keywords':  {token : 'keyword'},
                    '@typeKeywords': { token: 'typekeyword' },
                    '@costreamtypeKeywords':{token:'costreamtypeKeyword'},
                    '@costreamKeywords':{token:'costreamKeyword'},
                    '@default': { token: 'function' }
				}
			}],
			[/[a-zA-Z_$][\w$]*/, {
				cases: {
                    
					'@keywords': { token: 'keyword' },
                    '@typeKeywords': { token: 'typekeyword' },
                    '@costreamtypeKeywords':{token:'costreamtypeKeyword'},
                    '@costreamKeywords':{token:'costreamKeyword'},
					'@default': 'identifier'
				}
			}],
			

			// whitespace
			{ include: '@whitespace' },

			// delimiters and operators
			[/[{}()\[\]]/, '@brackets'],
			[/[<>](?!@symbols)/, '@brackets'],
			[/@symbols/, {
				cases: {
					'@operators': 'delimiter',
					'@default': ''
				}
			}],

			// @ annotations.
			[/@\s*[a-zA-Z_\$][\w\$]*/, 'annotation'],

			// numbers
			[/(@digits)[eE]([\-+]?(@digits))?[fFdD]?/, 'number.float'],
			[/(@digits)\.(@digits)([eE][\-+]?(@digits))?[fFdD]?/, 'number.float'],
			[/0[xX](@hexdigits)[Ll]?/, 'number.hex'],
			[/0(@octaldigits)[Ll]?/, 'number.octal'],
			[/0[bB](@binarydigits)[Ll]?/, 'number.binary'],
			[/(@digits)[fFdD]/, 'number.float'],
			[/(@digits)[lL]?/, 'number'],

			// delimiter: after number because of .\d floats
			[/[;,.]/, 'delimiter'],

			// strings
			[/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
			[/"/, 'string', '@string'],

			// characters
			[/'[^\\']'/, 'string'],
			[/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
			[/'/, 'string.invalid']
		],

		whitespace: [
			[/[ \t\r\n]+/, ''],
			[/\/\*\*(?!\/)/, 'comment.doc', '@javadoc'],
			[/\/\*/, 'comment', '@comment'],
			[/\/\/.*$/, 'comment'],
		],

		comment: [
			[/[^\/*]+/, 'comment'],
			// [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
			// [/\/\*/,    'comment.invalid' ],    // this breaks block comments in the shape of /* //*/
			[/\*\//, 'comment', '@pop'],
			[/[\/*]/, 'comment']
		],
		//Identical copy of comment above, except for the addition of .doc
		javadoc: [
			[/[^\/*]+/, 'comment.doc'],
			// [/\/\*/, 'comment.doc', '@push' ],    // nested comment not allowed :-(
			[/\/\*/, 'comment.doc.invalid'],
			[/\*\//, 'comment.doc', '@pop'],
			[/[\/*]/, 'comment.doc']
		],

		string: [
			[/[^\\"]+/, 'string'],
			[/@escapes/, 'string.escape'],
			[/\\./, 'string.escape.invalid'],
			[/"/, 'string', '@pop']
		],
	},


}


/*
composite   { return COMPOSITE; }
input       { return INPUT; }
output      { return OUTPUT; }
stream      { return STREAM; }
/FileReader  { return FILEREADER; }
/FileWriter  { return FILEWRITER; }
/add         { return ADD; }

param        { return PARAM; }
init         { return INIT; }
work         { return WORK; }
window       { return WINDOW; }
tumbling     { return TUMBLING; }
sliding      { return SLIDING; }

/splitjoin    { return SPLITJOIN; }
/pipeline     { return PIPELINE; }
split        { return SPLIT; }
join         { return JOIN; }
/duplicate    { return DUPLICATE; }
/roundrobin   { return ROUNDROBIN; }

matrix       {  return MATRIX;}
*/