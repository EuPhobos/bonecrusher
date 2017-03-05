const vernum    = "0.20";
const verdate   = "xx.xx.2017";
const vername   = "BoneCrusher!";
const shortname = "bc";

include("multiplay/skirmish/bc-v"+vernum+"/functions.js");
include("multiplay/skirmish/bc-v"+vernum+"/builders.js");
include("multiplay/skirmish/bc-v"+vernum+"/targeting.js");
include("multiplay/skirmish/bc-v"+vernum+"/events.js");
include("multiplay/skirmish/bc-v"+vernum+"/names.js");

//DEBUG: количество вывода, закоментить перед релизом
//var debugLevels = new Array("init", "builders", "army", "production", "base", "events", "stats", "research", "vtol");
var debugLevels = new Array('init', 'end', 'stats', 'temp', 'production', 'group', 'events', 'error', 'research', 'builders');

//Координаты всех ресурсов, свободных и занятых
var allResources;

//Координаты нашей базы
var base;

var base_range = 40; // В каких пределах работают основные строители (не охотники)

var buildersTimer = 25000;		//Триггер для заказа строителей (что бы не выходили пачкой сразу)
var fixersTimer = 50000;		//Триггер для заказа инженеров
var buildersTrigger = 0;
var fixersTrigger = 0;

var avail_research = [];	//Массив возможных исследований, заполняется в функции doResearch();

var running = false;	//Работаем?


var scavengerPlayer = -1;

var buildersMain = newGroup();
var buildersHunters = newGroup();

var maxConstructors = 15;

var armyPartisans = newGroup();
var armyRegular = newGroup();
var targRegular={x:0,y:0};
var armySupport = newGroup();
var armyCyborgs = newGroup();
var armyFixers = newGroup();
var VTOLAttacker = newGroup();

var maxPartisans = 30;
var maxRegular = 50;
var maxVTOL = 20;
var maxCyborgs = 20;
var maxFixers = 5;



var maxFactories, maxFactoriesCyb, maxFactoriesVTOL, maxLabs, maxPads;
var maxExtractors = 40;
var maxGenerators = 10;


var eventsRun=[];
eventsRun['targetCyborgs'] = 0;
eventsRun['buildersOrder'] = 0;

//Переменная мусора
//Всмысле мерзкие домики мешаются рядом с нефтяными вышками или бочками!
var nastyFeatures=[];
var nastyFeaturesLen;

//Переназначаются в функции prepeareProduce() что бы не читерить.
var light_bodies=["Body3MBT","Body2SUP","Body4ABT","Body1REC"];
var medium_bodies=["Body7ABT","Body6SUPP","Body8MBT","Body5REC"];
var heavy_bodies=["Body13SUP","Body10MBT","Body9REC","Body12SUP","Body11ABT"];

var avail_cyborgs=[];
var cyborgs=[
//	["R-Wpn-MG1Mk1", "CyborgChain1Ground", "CyborgChaingun"],			// легкий пулемёт
["R-Wpn-Flamer01Mk1", "CyborgFlamerGrd", "CyborgFlamer01"],			// лёгкий огнемёт
["R-Wpn-MG4", "CybRotMgGrd","CyborgRotMG"],							// тяжёлый пулемёт
["R-Wpn-Flame2", "Cyb-Bod-Thermite", "Cyb-Wpn-Thermite"],			// горячий напалм
["R-Wpn-Cannon1Mk1", "CyborgCannonGrd", "CyborgCannon"],			// лёгкая пушка
["R-Wpn-Mortar01Lt", "Cyb-Bod-Grenade", "Cyb-Wpn-Grenade"],			// гранатамёт
];

var bodies=[
//	===== Средняя броня (металическая)
["R-Vehicle-Body01", "Body1REC"],	//Стартовая броня лёгкой защиты "Вайпер" (уже есть)
["R-Vehicle-Body05", "Body5REC"],	//Средняя защита "Кобра"
["R-Vehicle-Body11", "Body11ABT"],	//Улучгенная защита "Питон"
//	===== Лёгкая броня (жёлтая)
["R-Vehicle-Body04", "Body4ABT"],	//bug
["R-Vehicle-Body08", "Body8MBT"],	//scorpion
["R-Vehicle-Body12", "Body12SUP"],	//mantis
//	===== Улучшенная броня (зелёная)
["R-Vehicle-Body02", "Body2SUP"],	//Легковестная защита "Leopard"
["R-Vehicle-Body06", "Body6SUPP"],	//Средняя защита "Panther"
["R-Vehicle-Body09", "Body9REC"],	//Улучшенная защита "Tiger"
//	===== Тяжёлая броня (чёрная)
["R-Vehicle-Body03", "Body3MBT"],	//retaliation
["R-Vehicle-Body07", "Body7ABT"],	//retribution
["R-Vehicle-Body10", "Body10MBT"],	//vengeance
//	===== Особая броня (красная)
["R-Vehicle-Body13", "Body13SUP"],	//Wyvern
["R-Vehicle-Body14", "Body14SUP"],	//Dragon (двухпушечная)
];
var propulsions=[
[true,"wheeled01"],								//Стартовые колёса (уже есть)
["R-Vehicle-Prop-Halftracks", "HalfTrack"],		//Полугусенецы
["R-Vehicle-Prop-Tracks", "tracked01"],			//Гусенецы
["R-Vehicle-Prop-Hover", "hover01"],			//Ховер
["R-Vehicle-Prop-VTOL", "V-Tol"]				//СВВП
];

//Плохая идея для 3.1, нет возможности узнать какое орудие несёт дроид.
//var partisanGuns=["Cannon4AUTOMk1","MG4ROTARYMk1","MG3Mk1","Cannon1Mk1","MG2Mk1","MG1Mk1"];
//var regularGuns=["PlasmiteFlamer","Rocket-MRL","Rocket-LtA-T","Flame2","MG4ROTARYMk1","Cannon4AUTOMk1","MG3Mk1","Flame1Mk1","Rocket","Cannon1Mk1","MG2Mk1","MG1Mk1"];
//var supportGuns=["Mortar1Mk1","Rocket-LtA-T","MG3Mk1"];

//Переназначаются в функции prepeareProduce() что бы не читерить.
var avail_vtols=["MG3-VTOL"];
var vtols=[
["R-Wpn-MG3Mk1","MG3-VTOL"],					//VTOL Heavy Machinegun
["R-Wpn-MG4","MG4ROTARY-VTOL"],					//VTOL Assault Gun
["R-Wpn-Cannon4AMk1","Cannon4AUTO-VTOL"],		//VTOL Hyper Velocity Cannon
["R-Wpn-Rocket01-LtAT","Rocket-VTOL-LtA-T"],	//VTOL Lancer
//["Bomb3-VTOL-LtINC","Bomb3-VTOL-LtINC"],		//VTOL Phosphor Bomb Bay
//["Bomb4-VTOL-HvyINC","Bomb4-VTOL-HvyINC"],		//VTOL Thermite Bomb Bay
];

var avail_guns=[];
var guns=[
//	===== Пулемёты
["R-Wpn-MG1Mk1", "MG1Mk1"],						//Лёгкий пулемёт
["R-Wpn-MG2Mk1", "MG2Mk1"],						//Лёгкий спаренный пулемёт
["R-Wpn-MG3Mk1", "MG3Mk1"],						//Тяжёлый пулемёт
["R-Wpn-MG4", "MG4ROTARYMk1"],					//Штурмовой пулемёт
["R-Wpn-MG5", "MG5TWINROTARY"],					//Спаренный штурмовой пулемёт
//	===== Пушки
["R-Wpn-Cannon1Mk1", "Cannon1Mk1"],				//Лёгкая пушка
["R-Wpn-Cannon2Mk1", "Cannon2A-TMk1"],			//Средняя пушка
["R-Wpn-Cannon5", "Cannon5VulcanMk1"],			//Штурмовая пушка
["R-Wpn-Cannon4AMk1", "Cannon4AUTOMk1"],		//Гипер скоростная штурмовая пушка
["R-Wpn-Cannon3Mk1", "Cannon375mmMk1"],			//Тяжёлая пушка
["R-Wpn-Cannon6TwinAslt", "Cannon6TwinAslt"],	//Спаренная штурмовая пушка
["R-Wpn-PlasmaCannon", "Laser4-PlasmaCannon"],	//Плазма-пушка
//	===== Огнемёты
["R-Wpn-Flamer01Mk1", "Flame1Mk1"],
["R-Wpn-Flame2", "Flame2"],
["R-Wpn-Plasmite-Flamer", "PlasmiteFlamer"],
//	===== Ракеты прямого наведения
["R-Wpn-Rocket05-MiniPod", "Rocket-Pod"],			//Скорострельная лёгкая ракета прямого наведения
["R-Wpn-Rocket03-HvAT", "Rocket-BB"],				//Медленная ракета против строений и танков (в общей армии не очень, только если против укреплений)
["R-Wpn-Rocket01-LtAT", "Rocket-LtA-T"],			//Противотанковая пара ракет прямого наведения "Лансер"
["R-Wpn-Rocket07-Tank-Killer", "Rocket-HvyA-T"],	//Улучшенная противотанковая пара ракет прямого наведения
["R-Wpn-Missile2A-T", "Missile-A-T"],				//Тяжолая противотанковая пара ракет прямого наведения
//	===== Ракеты артиллерии
["R-Wpn-Rocket02-MRL", "Rocket-MRL"],				//Лёгкая артиллерийская ракетная баттарея
//["R-Wpn-Rocket06-IDF", "Rocket-IDF"],				//Дальнобойная артиллерийская ракетная баттарея
["R-Wpn-MdArtMissile", "Missile-MdArt"],			//Улучшенная артиллерийская ракетная баттарея
["R-Wpn-HvArtMissile", "Missile-HvyArt"],			//Улучшенная дальнобойная артиллерийская ракетная баттарея
//	===== Мортиры
["R-Wpn-Mortar01Lt", "Mortar1Mk1"],
["R-Wpn-Mortar-Incenediary", "Mortar-Incenediary"],
["R-Wpn-Mortar02Hvy", "Mortar2Mk1"],
["R-Wpn-Mortar3", "Mortar3ROTARYMk1"],
];
var towers=[
['R-Defense-Tower01', 'GuardTower1'],						//Пулемётная вышка
['R-Defense-Pillbox01', 'PillBox1'],						//Пулемётный бункер
['R-Defense-Tower06', 'GuardTower6'],						//Вышка минирокет
['R-Defense-Pillbox06', 'GuardTower5'],						//Лансер
['R-Defense-WallTower-HPVcannon','WallTower-HPVcannon'],	//Гиперскоростная защита
['R-Defense-MRL', 'Emplacement-MRL-pit'],					//Окоп рокетных батарей
['R-Defense-IDFRocket','Emplacement-Rocket06-IDF'],			//Окоп дальнобойных рокетных батарей
];
//Старт
function letsRockThisFxxxingWorld(){
	//инфа
	debugMsg("ИИ "+vername+" v"+vernum+"("+verdate+")", "init");

	//Определяем мусорщиков
	scavengerPlayer = (scavengers) ? Math.max(7,maxPlayers) : -1;
	if(scavengers)debugMsg("На карте присудствуют гопники! {"+scavengerPlayer+"}", "init");
	else debugMsg("На карте отсутствуют гопники", "init");
	
	//Получаем свои координаты
	base = startPositions[me];
	debugMsg("Похоже это моя стартовая позиция: ("+base.x+","+base.y+")", 'init');
	
	//Получаем координаты всех ресурсов и занятых и свободных
	allResources = enumFeature(ALL_PLAYERS, "OilResource");
	var nearResources = allResources.filter(function(e){if(distBetweenTwoPoints(base.x,base.y,e.x,e.y) < base_range) return true; return false;});
	nearResources = nearResources.concat(enumStruct(me, "A0ResourceExtractor").filter(function(e){if(distBetweenTwoPoints(base.x,base.y,e.x,e.y) < base_range) return true; return false;}));
	debugMsg("На карте "+allResources.length+" свободных ресурсов", 'init');
	
	for ( var e = 0; e < maxPlayers; ++e ) allResources = allResources.concat(enumStruct(e,RESOURCE_EXTRACTOR));
	if(scavengers == true){
		allResources = allResources.concat(enumStruct(scavengerPlayer, "A0ResourceExtractor"));
	}
	debugMsg("На карте "+allResources.length+" всего ресурсов, рядом "+nearResources.length, 'init');
	
	if(nearResources.length > 30){
		//TODO
		debugMsg("Играем по тактике богатых карт.", 'init');
		//		include("multiplay/skirmish/bc-v"+vernum+"/strat-rich.js");
		include("multiplay/skirmish/bc-v"+vernum+"/strat-normal.js");
	}else{
		include("multiplay/skirmish/bc-v"+vernum+"/strat-normal.js");
	}
	
	//Лимиты:
	maxFactories = getStructureLimit("A0LightFactory", me);
	maxLabs = getStructureLimit("A0ResearchFacility", me);
	maxGenerators = getStructureLimit("A0PowerGenerator", me);
	maxFactoriesCyb = getStructureLimit("A0CyborgFactory", me);
	maxFactoriesVTOL = getStructureLimit("A0VTolFactory1", me);
	maxPads = getStructureLimit("A0VtolPad", me);
	
	//Лёгкий режим
	if(difficulty == EASY){
		debugMsg("Похоже я играю с нубами, будем поддаваться:", 'init');
		
		//Забываем все предустановленные исследования
		//Исследуем в полном рандоме.
		research_way=[["R-Wpn-MG1Mk1"]];
		
		//Уменьшаем размеры армий
		(maxPartisans > 7)?maxPartisans = 7:{};
		(maxRegular > 0)?maxRegular = 0:{};
		(maxVTOL > 5)?maxVTOL = 5:{};
		(maxCyborgs > 5)?maxCyborgs = 5:{};
		(maxFixers > 2)?maxFixers = 2:{};
		
		//Уменьшаем кол-во строителей
		(maxConstructors > 7)?maxConstructors = 7:{};
		
		//Уменьшаем размер базы
		(maxFactories > 2)?maxFactories = 2:{};
		(maxFactoriesCyb > 1)?maxFactoriesCyb = 1:{};
		(maxFactoriesVTOL > 1)?maxFactoriesVTOL = 1:{};
		(maxPads > 2)?maxPads = 2:{};
	}
	
	debugMsg("Лимиты базы: maxFactories="+maxFactories+"; maxFactoriesCyb="+maxFactoriesCyb+"; maxFactoriesVTOL="+maxFactoriesVTOL+"; maxPads="+maxPads+"; maxLabs="+maxLabs+"; maxGenerators="+maxGenerators+"; maxExtractors="+maxExtractors, 'init');
	debugMsg("Лимиты юнитов: maxPartisans="+maxPartisans+"; maxRegular="+maxRegular+"; maxCyborgs="+maxCyborgs+"; maxVTOL="+maxVTOL+"; maxFixers="+maxFixers+"; maxConstructors="+maxConstructors, 'init');
	

	
	debugMsg("Игроков на карте: "+maxPlayers,2);
	playerData.forEach( function(data, player) {
		var msg = "Игрок №"+player+" "+colors[data.colour];
		if (player == me) {msg+=" я сам ИИ";}
		else if(playerLoose(player)){msg+=" отсутствует";}
		else if(allianceExistsBetween(me,player)){msg+=" мой союзник";}
		else{msg+=" мой враг";}
		
		msg+=" ["+startPositions[player].x+"x"+startPositions[player].y+"]";
		
		debugMsg(msg,"init");
	});
	
	var _trash = enumFeature(ALL_PLAYERS, "").filter(function(e){if(e.damageable)return true;return false;});
	allResources.forEach(function(r){
		nastyFeatures = nastyFeatures.concat(_trash.filter(function(e){
			if(distBetweenTwoPoints(r.x,r.y,e.x,e.y) < 7)return true;
			return false;
		}));
	});
	nastyFeatures = removeDuplicates(nastyFeatures, 'id');
	if (nastyFeatures.length != 0 )debugMsg("Желательно уничтожить мусор на карте: "+nastyFeatures.length,'init');
	nastyFeaturesLen = nastyFeatures.length;
	//nastyFeatures.forEach(function(e){debugMsg(e.id+" "+e.x+"x"+e.y+" "+e.name+" "+e.damageable+" "+e.player, 'init');});

	
	//Первых строителей в группу
	enumDroid(me,DROID_CONSTRUCT).forEach(function(e){groupBuilders(e);});

	

	queue("prepeareProduce", 3000);
	queue("produceDroids", 3000);
	
	running = true;
	setTimer("buildersOrder", 2000);
	setTimer("targetCyborgs", 3000);
	setTimer("targetPartisan", 5000);
	setTimer("targetFixers", 8000);
	setTimer("defenceQueue", 11000);
	setTimer("doResearch", 15000);
//	setTimer("targetCyborgs", 28000);
	setTimer("produceDroids", 29000);
	setTimer("produceVTOL", 30000);
	setTimer("produceCyborgs", 31000);
	setTimer("targetRegular", 32000);
	setTimer("nastyFeaturesClean", 35000);
	setTimer("checkProcess", 40000);
	setTimer("stats", 10000); // Отключить в релизе
}

function debugMsg(msg,level){
	if (typeof level == 'undefined') return;
	if(debugLevels.indexOf(level) == -1) return;
	var timeMsg = Math.floor(gameTime / 1000);
	debug("bc["+me+"]{"+timeMsg+"}("+level+"): "+msg);
}

function eventStartLevel() {
	queue("letsRockThisFxxxingWorld", 1000);					// <-- Жжём плазмитом сцуко!
}