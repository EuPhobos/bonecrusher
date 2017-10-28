

function chatting(type){
	var chlen = chatting[type].length;
	return chatting[type][Math.floor(Math.random()*chlen)];
	
}

chatting['welcome'] = [
	'Hello everyone',
	'Hi there',
	'hi.. gl hf',
	'gl',
	'glhf',
	'gl hf',
	'Hi!! ))',
	'gl ;)',
	'gl hf )',
	'I kill you!!!',
	'Hello, good luck!',
	"i'm noob.. :|",
	'Hi all',
	'GLHF!',
	'have fun..',
	'yo',
	'hello',
	'=)',
	'yoyo, hi',
	'hi, how are you?',
	"приветы",
	"Здравствуйте",
	"Всем привет",
	"Dosvidaniya... no? %) Hi!"
];

chatting['loose'] = [
	'ohh.. you win, gg',
	'nice, gg',
	'wow.. gg',
	"gg i'm loose",
	'ggwp',
	'gg wp',
	'sorry im noob',
	'aaarrgghghh!! You are cheater!',
	'cheater? .. i loose..',
	'=( gg',
	'bye',
	'oh no! =( bye..',
	'How dare you!',
	'wtf?.. lol, gg',
	'nice cheat man.. bye'

];