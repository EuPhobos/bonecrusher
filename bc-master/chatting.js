

function chatting(type){
	var chlen = chatting[type].length;		// Забавно, спустя некотое время я только осознал, что за имя я дал этой переменной xDDD
	return chatting[type][Math.floor(Math.random()*chlen)];
	
}

chatting['army'] = [
	"If u want, i may support you with my army. Just say \"yes\"",
	"I can share some units, say \"yes\" if u want.",
	"I can sometimes give you my warriors, just say \"yes\""
];

chatting['confirm'] = [
	"Ok then! Let's kill them all together!!",
	"Yeah! That's my boy! >:)",
	"Allright! Got it!",
	"Well, ok then ;)",
	"Ok, got it",
	"Ok"
]

chatting['kick'] = [
	"I was kicked out, for what?",
	"Lol, just kicked..",
	"Well, bye, i leave.",
	"Loosers, you're just afraid of me."
];

chatting['tutorial'] = [
	"By the way, i can ask me for money, just say \"bc give money\"",
	"If you die, just say \"bc give truck\", and i resurrect u ;)",
	"Btw, you can ask me, \"bc give money\" or \"bc give truck\" remember that",
	"If u don't known, team chat binding on Ctrl+Enter keys %)",
	"btw, u can fast rotate camera by pressing Ctrl+arrows ;)",
	"Always help the team, or we will all die"
];

chatting['ally'] = [
	"Hellow my friend! Let's kill them!",
];

chatting['threat'] = [
	'I kill you!!!',
	'Nice try! But i will destroy you!',
	'Do not expect mercy'
];

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

chatting['dev'] = ['This is dev version, dont use it! Данная версия бота не является релизом и может содержать баги! Не используйте её!']