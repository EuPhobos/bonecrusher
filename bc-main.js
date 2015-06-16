const vernum    = "0.17";
const verdate   = "16.06.2015";
const vername   = "BoneCrusher!";
const shortname = "bc";

include("multiplay/skirmish/bc-func.js");
include("multiplay/skirmish/bc-builders.js");

// Предустановленная тактика игры
// 1 - AI vs AI (1x1)
// 2 - AI vs AI (2x2)
// 3 - AI vs Human
const cb_tactics      = 1; 

const d_truck_min	  = 1;
const d_truck_normal  = 4;
const d_truck_max	  = 8;

const searchOil_range = 40; // Как далеко мы ищем ресурсы
const rigDefenceRange = 10; // С какого расстояния начинать строить защиту ресурсам
const max_power = 10; //Максимально возможное кол-во построек электростанций


const u_warriors_min   = 20;
const u_warcyborgs_min = 15;

// Небольшой хак для "гопников"
const scavengerPlayer = -1;
if(scavengers == true){
	switch(maxPlayers){
		case 2:
			scavengerPlayer = 7;
			break;
		case 3:
			scavengerPlayer = 7;
			break;
		case 4:
			scavengerPlayer = 7;
			break;
		case 5:
			scavengerPlayer = 7;
			break;
		case 6:
			scavengerPlayer = 7;
			break;
		case 7:
			scavengerPlayer = 7;
			break;
		case 8:
			scavengerPlayer = 8;
			break;
		case 9:
			scavengerPlayer = 9;
			break;
		case 10:
			scavengerPlayer = 10;
			break;
	}
}


// Базовые постройки
const b_factory			= "A0LightFactory";
const b_power			= "A0PowerGenerator";
const b_cc				= "A0CommandCentre";
const b_lab 			= "A0ResearchFacility";
const b_rig				= "A0ResourceExtractor";
const b_cyborg			= "A0CyborgFactory";
const b_oil				= "OilResource";
const b_vtol			= "A0VTolFactory1";
const b_light_defence	= "GuardTower1";

const m_power 			= "A0PowMod1";
const m_factory 		= "A0FacMod1";
const m_lab				= "A0ResearchModule1";

const mr_power 			= "R-Struc-PowerModuleMk1";
const mr_factory 		= "R-Struc-Factory-Module";
const mr_lab			= "R-Struc-Research-Module";

const research_primary = [
	"R-Wpn-MG1Mk1",					//Лёгкий пулемёт (старт)
	"R-Wpn-MG-Damage02",
	"R-Defense-Tower01",			//Оборонная вышка / пулемётная башня (старт)
];

const research_rockets = [
	"R-Wpn-Rocket-Damage02",		//HE Rockets Mk2
	"R-Wpn-Rocket02-MRL",			//Mini-Rocket Array
	"R-Wpn-Rocket-Accuracy01",
	"R-Wpn-Rocket-ROF03",
	"R-Wpn-Rocket-Damage09",
	"R-Wpn-Rocket-Accuracy02",
	"R-Cyborg-Hvywpn-TK",
	"R-Cyborg-Hvywpn-A-T",
	"R-Wpn-HvArtMissile",
	"R-Wpn-Missile-ROF03",
	"R-Wpn-Missile-Damage03",
];

const research_way_1 = [
	"R-Wpn-MG2Mk1",
//	"R-Wpn-MG-Damage03",
	"R-Wpn-Flamer01Mk1",			//Огнемётная башня
	"R-Struc-Factory-Cyborg",		//Завод киборгов
	"R-Wpn-MG-Damage04",			//APDSB MG Bullets Mk3
//	"R-Sys-Engineering01",			//Инженерия (старт)
//	"R-Sys-Sensor-Turret01",		//Сенсорная башня (для лидера)
//	"R-Wpn-MG2Mk1",					//Спаренный лёгкий пулемёт
	"R-Struc-Research-Module",		//Модуль для лаборотории
	"R-Wpn-Rocket05-MiniPod",		//Скорострельная ракетница
	"R-Vehicle-Prop-Halftracks",	//Полугусенецы
	"R-Wpn-Cannon1Mk1",				//Пушечная башня
	"R-Vehicle-Body05",				//Средняя начальная броня
	"R-Vehicle-Prop-Hover",			//Ховер для строителей
	"R-Wpn-Mortar01Lt",				//Гранатное орудие
	"R-Wpn-Rocket02-MRL",			//Ракетная батарея
//	"R-Wpn-MG3Mk1",					//Тяжолопулемётная башня
	"R-Wpn-MG4",					//Штурмовой пулемёт
	"R-Vehicle-Body11",				//Тяжёлая начальная броня
	"R-Vehicle-Prop-Tracks",		//Гусенецы
	"R-Wpn-Flame2",					//Горячий напалм
	"R-Vehicle-Body09",				//Броня "Tiger"
	"R-Wpn-Mortar3",				//Скорострельная мортира "Pepperpot"
	"R-Wpn-Flamer-Damage09",		//Самый последний огнемёт (финал)
//	"Emplacement-RotHow",			//Самая последняя артиллерия (финал)
	"R-Sys-Sensor-UpLink",			//Открыть всю карту
];

const research_way_power = [
	"R-Struc-Power-Upgrade03a",
]

const research_way_2 = [
	"R-Struc-Research-Upgrade09",
	"R-Cyborg-Metals09",			//Кинетическая броня киборгов (финал)
	"R-Vehicle-Engine09",
]
const research_way_3 = [
	"R-Sys-Autorepair-General",		//Автопочинка
//	"R-Defense-Wall-RotMg",
];

const research_way_4 = [
	"R-Wpn-MG-Damage08",
	"R-Wpn-MG5",
];

const research_way_5 = [
	"R-Cyborg-Armor-Heat09",		//Термостойкая броня киборгов (финал)
	"R-Defense-MassDriver",
	"R-Vehicle-Body14",
];

//Переменная приоритетов путей исследований
var research_way = [
research_primary,
research_rockets,
research_way_1,
research_way_power,
research_way_2,
research_way_3,
research_way_4,
research_way_5,
];

//for ( var r in research_way ){
//	debugMsg(research_way[r],2);
//}

//Список киборгов
//"Технология", "Тело", "Орудие"
var bd_cyborgs=[];
const d_cyborgs=[
	["R-Wpn-MG1Mk1", "CyborgChain1Ground", "CyborgChaingun"],			// легкий пулемёт
	["R-Wpn-MG4", "CybRotMgGrd","CyborgRotMG"],							// тяжёлый пулемёт
	
	["R-Wpn-Flamer01Mk1", "CyborgFlamerGrd", "CyborgFlamer01"],			// лёгкий огнемёт
	["R-Wpn-Flame2", "Cyb-Bod-Thermite", "Cyb-Wpn-Thermite"],			// горячий напалм

	["R-Wpn-Cannon1Mk1", "CyborgCannonGrd", "CyborgCannon"],			// лёгкая пушка
	
	["R-Wpn-Mortar01Lt", "Cyb-Bod-Grenade", "Cyb-Wpn-Grenade"],			// гранатамёт
];

var bd_machine_bodys=[];
const d_machine_bodys=[
//	===== Средняя броня (металическая)
	[true, "Body1REC"],					//Стартовая броня лёгкой защиты "Вайпер" (уже есть)
	["R-Vehicle-Body05", "Body5REC"],	//Средняя защита "Кобра"
	["R-Vehicle-Body11", "Body11ABT"],	//Улучгенная защита "Питон"
//	===== Лёгкая броня (жёлтая)
//	["", ""],
//	["", ""],
//	["", ""],
//	===== Улучшенная броня (зелёная)
//	["", ""],	//Легковестная защита "Leopard"
//	["", ""],	//Средняя защита "Panther"
	["R-Vehicle-Body09", "Body9REC"],	//Улучшенная защита "Tiger"
//	===== Тяжёлая броня (чёрная)
//	["", ""],
//	["", ""],
//	["", ""],
//	===== Особая броня (красная)
//	["", ""],
//	["", ""],
];
var bd_machine_propulsions=[];
const d_machine_propulsions=[
	[true,"wheeled01"],								//Стартовые колёса (уже есть)
	["R-Vehicle-Prop-Halftracks", "HalfTrack"],		//Полугусенецы
	["R-Vehicle-Prop-Tracks", "tracked01"],			//Гусенецы
//	=====
	["R-Vehicle-Prop-Hover", "hover01"],			//Ховер
];

var bd_machine_turrets=[];
const d_machine_turrets=[
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
	["R-Wpn-Rocket01-LtAT", "Rocket-LtA-T"],			//Противотанковая пара ракет прямого наведения
	["R-Wpn-Rocket07-Tank-Killer", "Rocket-HvyA-T"],	//Улучшенная противотанковая пара ракет прямого наведения
	["R-Wpn-Missile2A-T", "Missile-A-T"],				//Тяжолая противотанковая пара ракет прямого наведения
//	===== Ракеты артиллерии
	["R-Wpn-Rocket02-MRL", "Rocket-MRL"],				//Лёгкая артиллерийская ракетная баттарея
	["R-Wpn-Rocket06-IDF", "Rocket-IDF"],				//Дальнобойная артиллерийская ракетная баттарея
	["R-Wpn-MdArtMissile", "Missile-MdArt"],			//Улучшенная артиллерийская ракетная баттарея
	["R-Wpn-HvArtMissile", "Missile-HvyArt"],			//Улучшенная дальнобойная артиллерийская ракетная баттарея
//	===== Мортиры
	["R-Wpn-Mortar01Lt", "Mortar1Mk1"],
	["R-Wpn-Mortar-Incenediary", "Mortar-Incenediary"],
	["R-Wpn-Mortar02Hvy", "Mortar2Mk1"],
	["R-Wpn-Mortar3", "Mortar3ROTARYMk1"],
];




// Установка глобальных переменных
//var p_start = "";
var base_x = false;
var base_y = false;
var base = new Object();

var bc_factory = "";
var bc_factory_c = "";
var bc_factory_r = "";

var bc_power = "";
var bc_power_c = "";
var bc_power_r = "";

var bc_rig = "";
var bc_rig_c = "";
var bc_rig_r = "";

var bc_oil = "";
var bc_oil_c = "";
var bc_oil_r = "";
var bc_oil_glob = "";
var bc_oil_all = "";

var bc_lab = "";
var bc_lab_c = "";
var bc_lab_r = "";

var bc_cyborg = "";
var bc_cyborg_c = "";
var bc_cyborg_r = "";

var bc_cc = "";
var bc_cc_c = "";
var bc_cc_r = "";

var bc_cyborg = "";
var bc_cyborg_c = "";
var bc_cyborg_r = "";

var bc_vtol = "";
var bc_vtol_c = "";
var bc_vtol_r = "";

var u_builders = "";
var u_builders_c = "";

var u_warriors   = [];
var u_warriors_c = "";

var u_warcyborgs   = [];
var u_warcyborgs_c = "";

var my_money = 0;

//Предустановленные доступные запчасти для машин
var d_body = "Body1REC";
var d_wheel = "wheeled01";
var d_turret = false;

var e_lastattack_b = false;
var e_lastattack_u = false;

var need_builder = false;

//var player_exist = [];
//var player_enemy = [];

var forced_builders = 2; //В начале игры, в первом заводе полюбому строим 2 строителя

//Группы дроидов
var resHunters = newGroup();
var resDefenders = newGroup();
var enemyAttackers = newGroup();
var enemyAttackersLeader = newGroup();
var baseDefenders = newGroup();
var baseBuilders = newGroup();

var g_resHunters = 0;
var g_resDefenders = 0;
var g_enemyAttackers = 0;
var g_enemyAttackersLeader = 0;
var g_baseDefenders = 0;
var g_baseBuilders = 0;

var builder_scout = true;

//Первая стартовая одноразовая функция
function lets_go() {

    debugMsg("ИИ "+vername+" v"+vernum+"("+verdate+")",1);

	//Кол-во точек ресурсов (разок читернули, что бы получить полный список ресурсов)
	//За чит не считается, т.к. при старте игры, все точки нанесены на карту, и игрок о них знает.
    bc_oil_all	= enumFeature(ALL_PLAYERS, b_oil);

	for ( var e = 0; e < maxPlayers; ++e ) bc_oil_all = bc_oil_all.concat(enumStruct(e,RESOURCE_EXTRACTOR));
	if(scavengers == true){
		bc_oil_all   = bc_oil_all.concat(enumStruct(scavengerPlayer, b_rig));
	}
	// Получаем свою стартовую позицию
	p_start = startPositions[me];
//	p_start = startPositions[playerData[me].position];
//	p_start = enumDroid(me, DROID_CONSTRUCT)[0];

	debugMsg("Похоже это моя стартовая позиция: ("+p_start.x+","+p_start.y+")",2);
	
	debugMsg("Игроков на карте: "+maxPlayers,2);
	
	for(var e = 0; e < maxPlayers; ++e){
		var msg = "Игрок ["+e+"] мой ";
		if(allianceExistsBetween(me,e)){msg += "союзник";}
		else{msg += "враг";}
		debugMsg(msg,2);
	}

	if(scavengers == true){
		debugMsg("На карте присудствуют гопники! {"+scavengerPlayer+"}", 2);
	}else{
		debugMsg("На карте отсутствуют гопники", 2);
	}


	//Координируем постройку базы на центр ближайшего ресурса
	bc_oil = enumFeature(me, b_oil); //Вместо читерской функции
	var tmp_range = Infinity;
	var tmp_range_oil = Infinity;
	var num = false;
	for( var r in bc_oil){
		tmp_range_oil = distBetweenTwoPoints(bc_oil[r].x,bc_oil[r].y,p_start.x,p_start.y);
		if(tmp_range_oil < tmp_range){
			tmp_range = tmp_range_oil;
			num = r;
		}
	}
	var tmp_builders = enumDroid(me,DROID_CONSTRUCT);
	base = tmp_builders[0];
	//Немножко добавлю случайности в постройку базы, для разнообразия на частых картах
	if(num){
		if(tmp_builders.length <= 4){
			var tmp_rnd = Math.round(Math.random()*1);
			debugMsg("Случайность? Выпало "+tmp_rnd,2);
/*			if(tmp_rnd == 0){
				debugMsg("Значит база возле ближайшей вышки",2);
				base_x = bc_oil[num].x;
				base_y = bc_oil[num].y;
				base = bc_oil[num];
			}
*/
			if (tmp_rnd == 0){
				debugMsg("Значит база у первого строителя",2);
				base_x = tmp_builders[0].x;
				base_y = tmp_builders[0].y;
				base = tmp_builders[0];
			}
			else if (tmp_rnd == 1){
				debugMsg("Значит база на случайной локации",2);
//				base_x = tmp_builders[0].x+Math.round(Math.random()*4);
//				base_y = tmp_builders[0].y+Math.round(Math.random()*4);
				base_x = p_start.x+Math.round(Math.random()*4);
				base_y = p_start.y+Math.round(Math.random()*4);
			}
			else if (tmp_rnd == 2){
				debugMsg("Значит база на стартовой локации",2);
				base_x = p_start.x;
				base_y = p_start.y;
			}
		}
		else{
			debugMsg("Очень странный старт, у меня уже больше 4-х строителей 0_о",1);
			debugMsg("...нууу.. ладно. Так поиграем, строю базу основываясь на стартовой позиции",1);
			base_x = p_start.x;
			base_y = p_start.y;
		}
	}
	else{
		debugMsg("Внимание! Не видно ближайших ресурсов!",1);
		base_x = p_start.x;
		base_y = p_start.y;
	}
    debugMsg("На карте имеется "+bc_oil_all.length+" ресурсов",2);

//	bc_oil_all = sortByDistance( bc_oil_all, p_start, null );
//	bc_oil_all = sortByDistance( bc_oil_all, p_start, 1 );

	allResources = new Array();

    for (var o=0; o<bc_oil_all.length; ++o){
//		allResources[o] = new Object();
//		allResources[o].x = bc_oil_all[o].x;
//		allResources[o].y = bc_oil_all[o].y;
		var obj = {
			x: bc_oil_all[o].x,
			y: bc_oil_all[o].y,
			sortable: true,
			resizeable: true
		};
		var tmp_reach = droidCanReach(tmp_builders[0], bc_oil_all[o].x, bc_oil_all[o].y);
		if ( tmp_reach ) allResources.push(obj);
//		allResources.push(obj);
        var tmp_range = distBetweenTwoPoints(bc_oil_all[o].x, bc_oil_all[o].y, base_x, base_y);
        debugMsg("Ресурс ("+bc_oil_all[o].x+","+bc_oil_all[o].y+") ["+tmp_range+"] {"+bc_oil_all[o].player+"} _"+tmp_reach,2);
    }

	debugMsg("Основной логике переданы только координаты их "+allResources.length+" точек ресурсов", 2);

	allResources = sortByDistance( allResources, base, null );

	for ( var i in allResources ){
		debugMsg("Передан ресурс ("+allResources[i].x+","+allResources[i].y+") ["+distBetweenTwoPoints(allResources[i].x,allResources[i].y,base.x,base.y)+"]",2);
	}

	iSee = getSeeResources();

	debugMsg("В поле зрения "+iSee.length+" ресурсов",2);

	for ( var i in iSee ) {
		debugMsg("Вижу ресурс ("+iSee[i].x+","+iSee[i].y+")",2);
	}

	notSee = getUnknownResources();

	debugMsg("А так же не видно "+notSee.length+" ресурсов",2);

	for ( var i in notSee ) {
		debugMsg("Не вижу ресурс ("+notSee[i].x+","+notSee[i].y+")",2);
	}

	// Ну здесь мы просто обязаны разок "читернуть" при старте игры... =(
	// Функция проверяющая есть ли игрок на карте вообще:
	// Тут мы только проверяем присутствие чужик войск и строений, и никаким другим образом эту информацию
	//не обрабатываем основной логикой бота в дальнейшем, только для проверки
	//существования игрока при старте игры..
	// Т.к. "не читерская" функция появится только для 3.2+ версии игры
//	for (var i = 0; i < maxPlayers; i++) {
//		var droids = enumDroid(i);
//		var struct = enumStruct(i);
//		if(droids.length||struct.length){player_exist[i] = true;debugMsg("Игрок ["+i+"] существует",2);}
//		else {player_exist[i] = false;debugMsg("Игрок ["+i+"] отсутсвует",2);}
//	}
	
	//Получаем информацию о игроках
//	playerData.forEach( function get(data, player) {
//		debugMsg("player_id:"+player+"; team:"+data.team+"; position:"+startPositions[data.position].x+","+startPositions[data.position].y+"; difficulty:"+data.difficulty+"; exist:"+player_exist[player],2);
		
		//Устанавливаем врага
//		if(player_exist[player] && !allianceExistsBetween(me,player)){player_enemy.unshift(player);}
//	});

//	for(var i in player_enemy){
//		debugMsg("Игрок ["+player_enemy[i]+"] - мой враг!");
//	}
	
	debugMsg("Буду строить тут: ("+base_x+","+base_y+")",2);

	someDebug();

	setEnv();
	
	bd_machine_propulsions[0] = d_machine_propulsions[0][1];
	bd_machine_bodys[0] = d_machine_bodys[0][1]; //Первая броня доступна сразу
	
	for(var b in u_builders){
		groupAddDroid(baseBuilders, u_builders[b]);
	}
	
	buildSome();
//	doResearch();
	queue("doResearch", 2000);
//	setTimer("moveToAlly", 5000)
//	removeTimer("lets_go");
	setTimer("getTarget",1000);				//Функция наблюдения и атаки(основная, не читерская, новая)
}

//Функция распределения войск и групп
function longCycle(){
	listCyborgs(); //Составляем список для производства киборгов
	listMachine(); //Составляем список для производства машин

	//Отправляем разведку и проверяем изменения альянса
	setWarEnv();
//	player_enemy = [];
	var p=0;
	for( var w in u_warcyborgs){
		if( p >= maxPlayers) break;
		if (u_warcyborgs[w].order == DORDER_ATTACK || u_warcyborgs[w].order == DORDER_MOVE) continue;
		var targetXY = startPositions[playerData[p].position];
		if (getDistance(targetXY) < 3 ) continue;
		orderDroidLoc(u_warcyborgs[w],DORDER_MOVE,targetXY.x,targetXY.y);
		debugMsg("Отправляю разведку на точку игрока ["+p+"] ("+targetXY.x+","+targetXY.y+")",1);
		p=p+1;
	}


/*
	for(var i = 0; i < maxPlayers; i++){
		if(!allianceExistsBetween(me,i)){
//			player_enemy.unshift(i);
			if(u_warcyborgs_c >= 7){
				for(var w in u_warcyborgs){
					if (u_warcyborgs[w].order != DORDER_ATTACK && u_warcyborgs[w].order != DORDER_MOVE) {
						var targetXY = startPositions[playerData[i].position];
						orderDroidLoc(u_warcyborgs[w],DORDER_MOVE,targetXY.x,targetXY.y);
						debugMsg("Отправляю разведку на точку игрока ["+i+"] ("+targetXY.x+","+targetXY.y+")",1);
						break;
					}
				}
			}
		}
		else{continue;}
	}
*/
/*
    setWarEnv();
    //Отправляю разведку на любую точку ресурса, не пренадлежащаю "мне"
    if(u_warriors.length >= u_warriors_min && u_warcyborgs.length >= 5){
        var bc_oil_all_c = bc_oil_all.length;
        if(bc_rig_c < bc_oil_all_c){
            debugMsg("Занято мною ресурсов "+bc_rig_c+"/"+bc_oil_all_c, 2);
            var w = 0;
            for ( var o in bc_oil_all){
                var o_found = false;
                for ( var r in bc_rig){
                    if(bc_oil_all[o].x == bc_rig[r].x && bc_oil_all[o].y == bc_rig[r].y){
                        o_found = true;
                        break;
                    }
                }
                if(o_found){continue;}
                else{
//                    debugMsg("Похоже имеется незанятая мной вышка ("+bc_oil_all[o].x+","+bc_oil_all[o].y+")",2);
//                    if (u_warriors[w].order != DORDER_ATTACK && u_warriors[w].order != DORDER_MOVE) {
                    orderDroidLoc(u_warriors[w],DORDER_MOVE,bc_oil_all[o].x,bc_oil_all[o].y);
                    debugMsg("Отправляю дроида ("+u_warriors[w].x+","+u_warriors[w].y+") на разветку ресурса ("+bc_oil_all[o].x+","+bc_oil_all[o].y+")",2);
                    if(w>=u_warriors.length){break;}
                    else {w++;}
//                    }
                }
            }
        }
    }
*/
}

function listMachine(){
	bd_machine_propulsions = [];
	bd_machine_bodys = [];
	bd_machine_turrets = [];
	
	bd_machine_propulsions[0] = d_machine_propulsions[0][1]; //Первая технология "колёса" известна со старта
	for(var r in d_machine_propulsions){
		if(r == 0)continue; //Первая технология "колёса" известна со старта, пропускаем
		var tmp_research = getResearch(d_machine_propulsions[r][0]);
		if(d_machine_propulsions[r][0] == "R-Vehicle-Prop-Halftracks" && tmp_research.done){
			bd_machine_propulsions[0] = d_machine_propulsions[r][1];
		}
		if(d_machine_propulsions[r][0] == "R-Vehicle-Prop-Tracks" && tmp_research.done){
			bd_machine_propulsions[0] = d_machine_propulsions[r][1];
		}
		if(d_machine_propulsions[r][0] == "R-Vehicle-Prop-Hover" && tmp_research.done){
			bd_machine_propulsions[1] = d_machine_propulsions[r][1];
		}
	}
	
	bd_machine_bodys[0] = d_machine_bodys[0][1]; //Первая броня доступна сразу
	var tmp_body = "";
	for(var r in d_machine_bodys){
		if(r == 0)continue; //Первая броня доступна сразу, пропускаем
		var tmp_research = getResearch(d_machine_bodys[r][0]);
		if(d_machine_bodys[r][0] == "R-Vehicle-Body05" && tmp_research.done){
			tmp_body = d_machine_bodys[r][1];
		}
		else if(d_machine_bodys[r][0] == "R-Vehicle-Body11" && tmp_research.done){
			tmp_body = d_machine_bodys[r][1];
		}
		else if(d_machine_bodys[r][0] == "R-Vehicle-Body09" && tmp_research.done){
			tmp_body = d_machine_bodys[r][1];
		}
		
		if(tmp_body != ""){bd_machine_bodys.unshift(tmp_body);tmp_body="";}
	}
	
	var tmp_turret = [];
	for(var r in d_machine_turrets){
		var tmp_research = getResearch(d_machine_turrets[r][0]);
		
		if(d_machine_turrets[r][0] == "R-Wpn-MG1Mk1" && tmp_research.done){
			tmp_turret[0] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-MG2Mk1" && tmp_research.done){
			tmp_turret[0] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-MG3Mk1" && tmp_research.done){
			tmp_turret[0] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-MG4" && tmp_research.done){
			tmp_turret[0] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-MG5" && tmp_research.done){
			tmp_turret[0] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Cannon1Mk1" && tmp_research.done){
			tmp_turret[1] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Cannon2Mk1" && tmp_research.done){
			tmp_turret[1] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Cannon5" && tmp_research.done){
			tmp_turret[1] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Cannon4AMk1" && tmp_research.done){
			tmp_turret[1] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Cannon3Mk1" && tmp_research.done){
			tmp_turret[1] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Cannon6TwinAslt" && tmp_research.done){
			tmp_turret[1] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-PlasmaCannon" && tmp_research.done){
			tmp_turret[2] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Rocket05-MiniPod" && tmp_research.done){
			tmp_turret[3] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Rocket03-HvAT" && tmp_research.done){
			tmp_turret[4] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Rocket01-LtAT" && tmp_research.done){
			tmp_turret[4] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Rocket07-Tank-Killer" && tmp_research.done){
			tmp_turret[4] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Missile2A-T" && tmp_research.done){
			tmp_turret[4] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Rocket02-MRL" && tmp_research.done){
			tmp_turret[5] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Rocket06-IDF" && tmp_research.done){
			tmp_turret[5] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-MdArtMissile" && tmp_research.done){
			tmp_turret[5] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-HvArtMissile" && tmp_research.done){
			tmp_turret[6] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Mortar01Lt" && tmp_research.done){
			tmp_turret[7] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Mortar-Incenediary" && tmp_research.done){
			tmp_turret[7] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Mortar02Hvy" && tmp_research.done){
			tmp_turret[7] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Mortar3" && tmp_research.done){
			tmp_turret[7] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Flamer01Mk1" && tmp_research.done){
			tmp_turret[8] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Flame2" && tmp_research.done){
			tmp_turret[8] = d_machine_turrets[r][1];
		}
		if(d_machine_turrets[r][0] == "R-Wpn-Plasmite-Flamer" && tmp_research.done){
			tmp_turret[8] = d_machine_turrets[r][1];
		}
	}
	for (var t in tmp_turret){
		if(tmp_turret[t])bd_machine_turrets.unshift(tmp_turret[t])
	}

}

//Составляем список для производства киборгов
function listCyborgs(){
	var d = 0;
	for(var c in d_cyborgs){
		var tmp_research = getResearch(d_cyborgs[c][0]);
		if (d_cyborgs[c][0] == "R-Wpn-MG1Mk1" && tmp_research.done){
			bd_cyborgs[d] = d_cyborgs[c];
			d++;
			continue;
		}
		if (d_cyborgs[c][0] == "R-Wpn-MG4" && tmp_research.done){
			d--; //Заменяем предыдущую единицу с лёгким пулемётом
			bd_cyborgs[d] = d_cyborgs[c];
			d++;
			continue;
		}
		if (d_cyborgs[c][0] == "R-Wpn-Flamer01Mk1" && tmp_research.done){
			bd_cyborgs[d] = d_cyborgs[c];
			d++;
			continue;
		}
		if (d_cyborgs[c][0] == "R-Wpn-Flame2" && tmp_research.done){
			d--; //Заменяем предыдущую единицу с простым огнемётом на напалм
			bd_cyborgs[d] = d_cyborgs[c];
			d++;
			continue;
		}
		if (d_cyborgs[c][0] == "R-Wpn-Cannon1Mk1" && tmp_research.done){
			bd_cyborgs[d] = d_cyborgs[c];
			d++;
			continue;
		}
		if (d_cyborgs[c][0] == "R-Wpn-Mortar01Lt" && tmp_research.done){
			bd_cyborgs[d] = d_cyborgs[c];
			d++;
			continue;
		}
	}
}


function setEnv(){
	//Опрашиваем только 1 раз кол-во энергии
	my_money = playerPower(me);
	
	//Получаем список своих строений
	//Кол-во заводов
	bc_factory   = enumStruct(me,FACTORY);
	bc_factory_c = countStruct(b_factory,me);
	bc_factory_r = countReadyBuildings(bc_factory);

	//Кол-во генераторов
	bc_power   = enumStruct(me,POWER_GEN);
	bc_power_c = countStruct(b_power,me);
	bc_power_r = countReadyBuildings(bc_power);

	//Кол-во вышек
    bc_rig      = enumStruct(me,RESOURCE_EXTRACTOR);
    bc_rig_c    = countStruct(b_rig,me);
	
	//Кол-во свободных ресурсов
//	bc_oil   = enumFeature(ALL_PLAYERS, b_oil); // - Это чит
	bc_oil   = enumFeature(me, b_oil); // - Это НЕ чит
	bc_oil_c = bc_oil.length;
	
	//Кол-во лабов
	bc_lab   = enumStruct(me,RESEARCH_LAB);
	bc_lab_c = countStruct(b_lab,me);
	bc_lab_r = countReadyBuildings(bc_lab);

	//Кол-во КЦ
    bc_cc   = enumStruct(me,HQ);
	bc_cc_c = countStruct(b_cc,me);
    bc_cc_r = countReadyBuildings(bc_cc);

	//Кол-во казарм
	bc_cyborg   = enumStruct(me,CYBORG_FACTORY);
	bc_cyborg_c = countStruct(b_cyborg,me);
	
	//Кол-во воздушных заводов
	bc_vtol_c = countStruct(b_vtol,me);
	
	u_builders   = enumDroid(me,DROID_CONSTRUCT);
	u_builders_c = u_builders.length;
	
}

function setGroupEnv(){
	g_resHunters = enumGroup(resHunters);
	g_resDefenders = enumGroup(resDefenders);
	g_enemyAttackers = enumGroup(enemyAttackers);
	g_enemyAttackersLeader = enumGroup(enemyAttackersLeader);
	g_baseDefenders = enumGroup(baseDefenders);
	g_baseBuilders = enumGroup(baseBuilders);
}

function setWarEnv(){
	u_warriors   = enumDroid(me,DROID_WEAPON);
	if(u_warriors.length)u_warriors_c = u_warriors.length;
	else u_warriors_c = 0;
	
	u_warcyborgs   = enumDroid(me,DROID_CYBORG);
	if(u_warcyborgs.length)u_warcyborgs_c = u_warcyborgs.length;
	else u_warcyborgs_c = 0;
}


// Занять работой свободных гастробайтеров
function buildSome(){

	setEnv();
	
	//Функции развития
//	checkDroidBody();
//	checkDroidWheel();
//	checkDroidTurret();
//	researchSome();
	
	
	//Приоритет завод, если нет РАБОЧЕГО завода, строим свободными холопами
	if(bc_factory_r.length == 0){
		// Если завод есть, но не готов, отправляем на помощь в постройке
		if(bc_factory_c != 0){
			helpBuild();
		}
		// Если заводов нет, и не начинали строить - строим
		else{
			//Строим завод на стартовой точке
			if(buildBuilding(b_factory,base_x,base_y)) return;
		}
//		return
	}
    //Приоритет вышки, если их меньше 2, строим вышки!
//	else if (bc_rig_c < 4 && bc_oil_c >= 4){
//    else if (bc_rig_c < 1 ){
//        buildRig();
//        return;
//    }
    //Приоритет лабаротории, хотя бы 1 должна быть однозначно!
    if (bc_lab_r.length == 0){
        if(bc_lab_c != 0){
            helpBuild();
        }else{
            if(buildBuilding(b_lab,base_x,base_y)) return;
        }
//        return;
    }
	//И так же необходим коммандный центр
	if (bc_cc_c == 0){
		if(buildBuilding(b_cc,base_x,base_y)) return;
//		return;
	}
    //Если вышек больше(или ровно) чем генераторов, строим по приоритету дополнительный генератор
    if ((bc_power_c*4) <  bc_rig_c && (bc_power_c < max_power)){
        if(buildBuilding(b_power,base_x,base_y)) return
//      return;
    }
/*
    else if (bc_rig_c < 3 && bc_oil_c >= 3){
        buildRig();
        return;
    }
*/
    if (bc_factory_c < 2 && my_money > 300){
        if(buildBuilding(b_factory,base_x,base_y)) return;
    }
    if (bc_lab_c < 3 && my_money > 200){
        if(buildBuilding(b_lab,base_x,base_y)) return;
    }
    if (bc_factory_c < 3 && my_money > 800){
        if(buildBuilding(b_factory,base_x,base_y)) return;
    }
    if (bc_lab_c < 4 && my_money > 500){
        if(buildBuilding(b_lab,base_x,base_y)) return;
    }
    if (bc_lab_c < 5 && my_money > 1000){
        if(buildBuilding(b_lab,base_x,base_y)) return;
//        return;
    }

	if (isStructureAvailable(b_cyborg,me) && bc_cyborg_c < 2 && my_money > 600){
		if(buildBuilding(b_cyborg,base_x,base_y)) return;
//		return;
	}
	if (bc_rig_c < 4 && bc_oil_c >= 4){
		buildRig();
		return;
	}
/*
    else if (bc_lab_c < 2){
		buildBuilding(b_lab,base_x,base_y);
		return;
	}
//	else if (bc_factory_c < 2){
//		buildBuilding(b_factory,base_x,base_y);
//		return;
//	}
*/

    if (getResearch(mr_power).done){
		for(var p in bc_power){
			if(bc_power[p].modules < 1){
				installModule(bc_power[p],m_power);
				return;
			}
		}
    }
	
    if (getResearch(mr_factory).done){
		for(var f in bc_factory){
			if(bc_factory[f].modules < 2){
				installModule(bc_factory[f],m_factory);
				return;
			}
		}
    }

    if (getResearch(mr_lab).done){
		for(var l in bc_lab){
			if(bc_lab[l].modules < 1){
				installModule(bc_lab[l],m_lab);
				return;
			}
		}
    }
/*
    else if (getResearch(mr_factory).done){
        countModules(m_factory);
        return;
    }
    else if (getResearch(mr_lab).done){
        countModules(m_lab);
        return;
    }
    else if (isStructureAvailable(b_light_defence,me) && my_money > 2000){
        buildBuilding(b_light_defence,base_x,base_y);
    }
*/

	//Немножко рандома:
	if(my_money > 1500){
		var random_builds = [];
		if (bc_lab_c < 5)			random_builds.unshift(b_lab);
        if (bc_factory_c < 5)		random_builds.unshift(b_factory);
//		if (bc_oil_c > 2)			random_builds.unshift(b_oil);
		if (bc_cyborg_c < 5 && isStructureAvailable(b_cyborg,me) )		random_builds.unshift(b_cyborg);
//		if (bc_vtol_c < 5 && isStructureAvailable(b_vtol,me) )			random_builds.unshift(b_vtol);

		if(random_builds.length != 0){
			var rand = rnd(random_builds.length);
			random_building = random_builds[rand];
			debugMsg("Ткнув пальцем в небо, хочу построить ["+random_building+"] rnd("+rand+") len("+random_builds.length+")",2);
			if(buildBuilding(random_building,base_x,base_y)) return;
//			return;
		}
	}
	
	if ( bc_oil_c != 0 ) {
		if(buildRig()){return;}
	}
	
	//Если нет работы, может нужна помощь в постройке?
	if(helpBuild())return;
	else{
//		countModules();

		//Если триггер builder_scout активен, отправляем строить пушку на вражескую базу
		if(builder_scout && isStructureAvailable(b_light_defence,me)){builderScout();}
		else{
			if(huntRig()){return;}
			debugMsg("Строители бездельничают!",3);
		}
	}
	//setTimer("helpBuild", 3000);
}

//Функция (не читерская) наблюдает за видимым полем боя
//Принимает решение, если в полезрения попал противник
function myEyes(){
	setWarEnv();	
	debugMsg("Моих войск: Киборги-"+u_warcyborgs_c+", Машины-"+u_warriors_c,3);
	var enemyRigs = new Array();
	var enemyBuiders = new Array();
	var enemyUnits = new Array();
	var enemyFactory = [];
	var enemyCyborgFactory = new Array();
	var enemyPower = new Array();
	var enemyLab = new Array();

	for(var e = 0; e < maxPlayers; ++e){
		if(allianceExistsBetween(me,e)){continue;}
//		debugMsg("Сканирую вражеского игрока ["+e+"/"+maxPlayers+"] "+enemyBuiders.length, 5);
		//Атакуем вражеские вышки (ибо нех тут качать!)
		enemyRigs = enemyRigs.concat(enumStruct(e,b_rig,me));
		enemyBuiders = enemyBuiders.concat(enumDroid(e,DROID_CONSTRUCT,me)); // Создаём массив вражеских строителей (только тех, которых честно видим)
		enemyUnits = enemyUnits.concat(enumDroid(e,DROID_ANY,me));
//		var tmp = [];
//		tmp = enumStruct(e,FACTORY,me);
//		if(tmp.length!=0)enemyFactory.push(tmp);
//		if(tmp.length!=0){
//			debugMsg("enemyFactory: "+tmp.player+", ("+tmp.x+","+tmp.y+")",5);
		enemyFactory = enemyFactory.concat(enumStruct(e,FACTORY,me));
		enemyFactory = enemyFactory.concat(enumStruct(e,CYBORG_FACTORY,me));
//		}
//		tmp = enumStruct(e,CYBORG_FACTORY,me);
//		if(tmp.length!=0)enemyFactory.push(tmp);
//		enemyCyborgFactory = enemyCyborgFactory.concat(enumStruct(e,CYBORG_FACTORY,me));
//		enemyFactory = enemyFactory.concat(enemyCyborgFactory);
		enemyPower = enemyPower.concat(enumStruct(e,POWER_GEN,me));
		enemyLab = enemyLab.concat(enumStruct(e,RESEARCH_LAB,me));
	}	
	var en_builder = Infinity;
	var num_b = Infinity;
	var en_rig = Infinity;
	var num_r = Infinity;

	if(enemyFactory.length != 0 && (u_warcyborgs_c + u_warriors_c) >= 35){
		var fact  = Infinity;
		var tmp   = Infinity;
		debugMsg("Обнаружено вражеских заводов: "+enemyFactory.length,5);
		for(var ef in enemyFactory){
			tmp = getDistance(enemyFactory[ef]);
//			debugMsg("Вражеские заводы: #"+ef+", id "+enemyFactory[ef].id+", "+enemyFactory[ef].stattype+"("+enemyFactory[ef].x+","+enemyFactory[ef].y+")["+tmp+"]{"+enemyFactory[ef].player+"}", 3);
			if(fact > tmp){
				fact = tmp;
				target_f = new Array();
				target_f = enemyFactory[ef];
//				debugMsg("tmp:"+tmp,5);
//				debugMsg("target_f:"+target_f.x+","+target_f.y,5);
//				debugMsg("enemyFactory::"+enemyFactory[ef].x+","+enemyFactory[ef].y,5);
			}
		}
//		debugMsg("Атакую ближайший вражеский завод ("+target_f.x+","+target_f.y+"){"+target_f.player+"}",2);
		attackNowMachine(target_f,false);
		attackNowCyborg(target_f,false);
		return;
	}
	if(enemyRigs.length != 0){
		for(var er in enemyRigs){
			var resource_near = distBetweenTwoPoints(base_x,base_y,enemyRigs[er].x,enemyRigs[er].y);
			if(resource_near < en_rig){
				en_rig = resource_near;
				num_r = er;
			}
		}
	}
	if(enemyBuiders.length != 0){
		for(var eb in enemyBuiders){
			var builder_near = distBetweenTwoPoints(base_x,base_y,enemyBuiders[eb].x,enemyBuiders[eb].y);
			if(builder_near < en_builder){
				en_builder = builder_near;
				num_b = eb;
			}
		}
	}
		
	if (enemyUnits.length-enemyBuiders.length > 0){
		for(var eu in enemyUnits){
			if(getDistance(enemyUnits[eu]) < searchOil_range && enemyUnits[eu].droidType != DROID_CONSTRUCT){ // 3 = DROID_CONSTRUCT
				debugMsg("Вражеский юнит слишком близко к базе! ("+enemyUnits[eu].droidType+")["+getDistance(enemyUnits[eu])+"]", 2);
				attackNowMachine(enemyUnits[eu],true);
				attackNowCyborg(enemyUnits[eu],true);
				return;
			}
		}
	}
	if (num_b > num_r && (u_warcyborgs_c + u_warriors_c) >= 4 ){
		debugMsg("Атакую вражескую качалку ("+enemyRigs[num_r].x+","+enemyRigs[num_r].y+"){"+enemyRigs[num_r].player+"}",2);
		attackNowMachine(enemyRigs[num_r],true);
		attackNowCyborg(enemyRigs[num_r],true);
		return;
	}
	else if(num_b <= num_r && num_b != Infinity && (u_warcyborgs_c + u_warriors_c) >= 1){
		debugMsg("Атака на вражеского строителя ("+enemyBuiders[num_b].x+","+enemyBuiders[num_b].y+"){"+enemyBuiders[num_b].player+"}",2);
		attackNowMachine(enemyBuiders[num_b],true);
		attackNowCyborg(enemyBuiders[num_b],true);
		return;
	}
	else if( (u_warcyborgs_c + u_warriors_c) >= 10 ){
		if(enemyUnits.length != 0){
			for(var eu in enemyUnits){
				debugMsg("Вражеский юнит ("+enemyUnits[eu].x+","+enemyUnits[eu].y+"){"+enemyUnits[eu].player+"}",2);
				attackNowMachine(enemyUnits[eu],false);
				attackNowCyborg(enemyUnits[eu],false);
				return;
			}
		}
		else {
//			setWarEnv();
//			var enemyStruct = enumStruct(e,BUILDING,me); // 3.2+ only
//			var enemyStruct = enumStruct(e); // Получается что чит? Т.к. видит все строения, значит пока так и ждем версию 3.2
/*
			else if (enemyCyborgFactory.length != 0) {
				for(var ec in enemyCyborgFactory){
					debugMsg("Вражеский завод киборгов ("+enemyCyborgFactory[ec].x+","+enemyCyborgFactory[ec].y+"){"+e+"}",2);
					attackNowMachine(enemyCyborgFactory[ec],false);
					attackNowCyborg(enemyCyborgFactory[ec],false);
				}
				return;
			}
*/
			if (enemyPower.length != 0) {
				for(var ep in enemyPower){
					debugMsg("Вражеская подстанция ("+enemyPower[ep].x+","+enemyPower[ep].y+"){"+enemyPower[ep].player+"}",2);
					attackNowMachine(enemyPower[ep],false);
					attackNowCyborg(enemyPower[ep],false);
					return;
				}
			}
			else if (enemyLab.length != 0) {
				for(var el in enemyLab){
					debugMsg("Вражеская лаборатория ("+enemyLab[el].x+","+enemyLab[el].y+"){"+enemyLab[el].player+"}",2);
					attackNowMachine(enemyLab[el],false);
					attackNowCyborg(enemyLab[el],false);
					return;
				}
			}
/* 3.2+ only
			else if (enemyStruct.length != 0) {
				for(var es in enemyStruct){
					debugMsg("Вражеское строение ("+enemyStruct[es].x+","+enemyStruct[es].y+"){"+e+"}",2);
					attackNowMachine(enemyStruct[es],false);
					attackNowCyborg(enemyStruct[es],false);
				}
				return;
			}
*/
		}
	}
//	}

	if(scavengerPlayer!=-1){
		e=scavengerPlayer;
		var enemyRigs = enumStruct(e,b_rig,me);
		var en_rig = Infinity;
		var num_r = Infinity;
		if(enemyRigs.length != 0){
			for(var er in enemyRigs){
				var resource_near = distBetweenTwoPoints(base_x,base_y,enemyRigs[er].x,enemyRigs[er].y);
				if(resource_near < en_rig){
					en_rig = resource_near;
					num_r = er;
				}
			}
		}
		if (num_b > num_r && (u_warcyborgs_c + u_warriors_c) >= 4 ){
			debugMsg("Атакую качалку гопников ("+enemyRigs[num_r].x+","+enemyRigs[num_r].y+"){"+enemyRigs[num_r].player+"}",2);
			attackNowMachine(enemyRigs[num_r],true);
			attackNowCyborg(enemyRigs[num_r],true);
			return;
		}
	}
	if((u_warcyborgs_c + u_warriors_c)>20){
		debugMsg((u_warcyborgs_c + u_warriors_c)+" кол-во войск бездельничают",2);
	}

}


//Функция для работы заводов
function buildSomeMachine(){
	setEnv();
	setWarEnv();
	for (var f in bc_factory){
		if( factoryReady(bc_factory[f]) ){
			d_wheel = Math.round(Math.random()*(bd_machine_propulsions.length-1));
			d_body = Math.round(Math.random()*(bd_machine_bodys.length-1));
			d_turret = Math.round(Math.random()*(bd_machine_turrets.length-1));
//			debugMsg("Части машин: "+bd_machine_propulsions.length+"/"+d_machine_propulsions.length+"-колёс, "+bd_machine_bodys.length+"/"+d_machine_bodys.length+"-брони, "+bd_machine_turrets.length+"/"+d_machine_turrets.length+"-башен: Собираю ["+d_wheel+"|"+d_body+"|"+d_turret+"]",3);
//			var u_builders_c = countDroid(DROID_CONSTRUCT, me);
//            debugMsg("bc_cc.length="+bc_cc.length+"; bc_cc_c="+bc_cc_c+"; bc_cc_r.length="+bc_cc_r.length,2);
			if ( d_truck_min > u_builders_c || need_builder == true || forced_builders != 0){
				if(forced_builders > 0)forced_builders--;
				var _wheel = bd_machine_propulsions[d_wheel];
				if ( getResearch("R-Vehicle-Prop-Hover").done ) _wheel = "hover01";
				debugMsg("Кол-во строителей: "+u_builders_c+"/"+d_truck_normal+" нужда в строителях: "+need_builder,2);
				buildDroid(bc_factory[f], "Truck Builder", bd_machine_bodys[d_body], _wheel, "", DROID_CONSTRUCT, "Spade1Mk1");
				need_builder = false;
			}
            else if( (my_money > 1000 || u_warriors_min > u_warriors_c) && bd_machine_turrets.length != 0 && bc_cc_r.length != 0){
				debugMsg("Части машин: "+bd_machine_propulsions.length+"/"+d_machine_propulsions.length+"-ходовых, "+bd_machine_bodys.length+"/"+d_machine_bodys.length+"-брони, "+bd_machine_turrets.length+"/"+d_machine_turrets.length+"-башен: Собираю ["+(d_wheel+1)+"|"+(d_body+1)+"|"+(d_turret+1)+"]",2);
				for (var r in bd_machine_propulsions){
					debugMsg("Ходовая: ["+bd_machine_propulsions[r]+"]",3);
				}
				for (var r in bd_machine_bodys){
					debugMsg("Броня: ["+bd_machine_bodys[r]+"]",3);
				}
				for (var r in bd_machine_turrets){
					debugMsg("Башня: ["+bd_machine_turrets[r]+"]",3);
				}
				
				if(!buildDroid(bc_factory[f], "Droid Warrior", bd_machine_bodys[d_body], bd_machine_propulsions[d_wheel], "", DROID_WEAPON, bd_machine_turrets[d_turret])){debugMsg("Завод бастует, не строит машины!");}
			}
			return;
		}
	}
}

//Функция для работы казарм
function buildSomeCyborg(){
	setEnv();
	setWarEnv();
    listCyborgs();
	for (var c in bc_cyborg){
        if( factoryReady(bc_cyborg[c]) && bd_cyborgs.length != 0 && (my_money > 1000 || u_warcyborgs_min > u_warcyborgs_c) ) {
			var rand = Math.round(Math.random()*(bd_cyborgs.length-1));
			debugMsg("Список киборгов: "+bd_cyborgs.length+", строю: "+(rand+1)+" ["+bd_cyborgs[rand][1]+", "+bd_cyborgs[rand][2]+"]",2);
			buildDroid(bc_cyborg[c], "Cyborg["+bd_cyborgs[rand][2]+"]", bd_cyborgs[rand][1], "CyborgLegs", "", DROID_CYBORG, bd_cyborgs[rand][2]);
		}
	}
}

//Функция для исследованний и следований по пути выбранных технологий
var res_=0;
function researchSome(){
	if ( my_money < 200 ) { return; }
	if( res_ == research_way.length ) res_ = 0;
/*		if( bc_lab_c == l && factoryReady(bc_lab[l]) ){
			pursueResearch(bc_lab[l], second_research_way);
			break;
		}
*/
	var labs = enumStruct( me, RESEARCH_LAB );
/*
	var r=0;
	for ( var l in labs ) {
		if ( research_way.length <= r ){
			debugMsg("Лабораторий больше, чем задач исследования ("+r+")", 2);
			break;
		}
		if ( factoryReady(labs[l]) ){
			debugMsg("Лаборатория["+l+"] исследует путь "+r, 3);
			pursueResearch(labs[l], research_way[r]);
			r++;
			continue;
		}
	}
*/

//	research_way.reverse();
//	for ( var r in research_way ){
		if( labs.length < 1){
			debugMsg("Нет свободных лабораторий",3);
//			break;
		} else {
			debugMsg("Кол-во лабораторий "+labs.length, 3);
			for ( var l in labs ){
				if( factoryReady(labs[l]) ){
					debugMsg("Лаборатория("+labs[l].id+")["+l+"] исследует путь "+res_, 3);
					pursueResearch(labs[l], research_way[res_]);
//				labs.splice(l,1);
//				break;
				}else{
					debugMsg("Лаборатория("+labs[l].id+")["+l+"] занята", 3);
//				labs.splice(l,1);
//				break;
				}
			}
		}
//	}

//    queue("research_1", 2000);
//    queue("research_2", 4000);
//    queue("research_3", 6000);
//    queue("research_4", 8000);
//    queue("research_5", 2000);
	res_++;
}
function research_1(){
	var labs = enumStruct( me, RESEARCH_LAB );
	for (var l in labs) {
		if( factoryReady(labs[l]) ){
			debugMsg("Лаборатория["+l+"] готова для исследования_1", 2);
			pursueResearch(labs[l], research_way_1);
			break;
		}
	}
}
function research_2(){
	var labs = enumStruct( me, RESEARCH_LAB );
	for (var l in labs) {
		if( factoryReady(labs[l]) ){
			debugMsg("Лаборатория["+l+"] готова для исследования_2", 2);
			pursueResearch(labs[l], research_way_2);
			break;
		}
	}
}
function research_3(){
	var labs = enumStruct( me, RESEARCH_LAB );
	for (var l in labs) {
		if( factoryReady(labs[l]) ){
			debugMsg("Лаборатория["+l+"] готова для исследования_3", 2);
			pursueResearch(labs[l], research_way_3);
			break;
		}
	}
}
function research_4(){
	var labs = enumStruct( me, RESEARCH_LAB );
	for (var l in labs) {
		if( factoryReady(labs[l]) ){
			debugMsg("Лаборатория["+l+"] готова для исследования_4", 2);
			pursueResearch(labs[l], research_way_4);
			break;
		}
	}
}

// Функция считает количество переданых объектов, определяет статус постройки, считает и возвращает завершённые
function countReadyBuildings(what){
	var what_r=[];
	for (var t in what){
		if(what[t].status == BUILT) what_r[t] = what[t];
	}
	return what_r;
}

// Функция поиска ближайших ресурсов и постройки на них вышек
function buildRig(){
//	debugMsg("План: Строим вышку",4);
	//Получаем одного свободного строителя
	
	builder = getBuilder();
	if(!builder){
		debugMsg("Нет свободных строителей для постройки ресурсов",1);
		return false;
	}
//	else{debugMsg("Найден свободный строитель ("+builder.x+","+builder.y+") для постройки ресурсов",2);}
	
	var resource = Infinity;
	var num = -1;

	//Получаем список ресурсов
	for (var r in bc_oil) {
		//получаем дистанцию от строителя до свободного ресурса
//		if(propulsionCanReach("wheeled01",builder.x,builder.y,bc_oil[r].x,bc_oil[r].y)){
			resource_near = distBetweenTwoPoints(builder.x,builder.y,bc_oil[r].x,bc_oil[r].y); //Ищем ближайший ресурс от выбранного строителя
			if (!droidCanReach(builder, bc_oil[r].x, bc_oil[r].y)) continue;
			//сравниваем все дистанции оставляя наименьшию
			if(resource_near < resource){
				resource = resource_near;
				num = r;
			}
//		}else{
//			if(propulsionCanReach("hover01",base_x,base_y,bc_oil[r].x,bc_oil[r].y)){
//				debugMsg("Имеется ресурс окружённый водой, нужны строители-ховеры",2);
//			}else{
//				debugMsg("Имеется недосягаемый ресурс, как до него добраться - неизвестно",2);
//			}
//		}
	}
//	if(num != -1 && getDistance(bc_oil[num]) < 20){
	if(num != -1){
		orderDroidBuild(builder,DORDER_BUILD,b_rig,bc_oil[num].x,bc_oil[num].y,0);
		debugMsg("Отправил строителя ("+builder.x+","+builder.y+") на захват ресурса ("+bc_oil[num].x+","+bc_oil[num].y+") {"+getDistance(bc_oil[num])+"}",2);
		return true;
	}
	return false;
}

// Функция поиска удалённых ресурсов и/или захват их силой
function huntRig(){

	debugMsg("Поиск нефтевышек", 2);


	builder = getBuilder();
	if(!builder){
		debugMsg("Нет свободных строителей для отхвата ресурсов",1);
		return false;
	}


	var bc_oil_all_c = bc_oil_all.length;
	var bc_oil_target_dist = Infinity;
	var bc_oil_target = false;

	if(bc_rig_c < bc_oil_all_c){
		debugMsg("Занято мною ресурсов "+bc_rig_c+"/"+bc_oil_all_c, 2);
        var w = 0;
        for ( var o in bc_oil_all){
			var o_found = false;
            for ( var r in bc_rig){
				if(bc_oil_all[o].x == bc_rig[r].x && bc_oil_all[o].y == bc_rig[r].y){
					o_found = true;
                    break;
                }
            }
			// Пропускаем если вышка числится как наша, если радиус слишком далёк или если вышка пренадлежит союзнику
            if(o_found || getDistance(bc_oil_all[o]) > searchOil_range ){continue;}
            else{
//				if(allianceExistsBetween(bc_oil_target.player, me)){continue;}
				if( getDistance(bc_oil_all[o]) < bc_oil_target_dist){
					bc_oil_target = bc_oil_all[o]
					bc_oil_target_dist = getDistance(bc_oil_target);
				}
            }
        }

		if(!bc_oil_target){return false;}
		debugMsg("Проверяем вышку ("+bc_oil_target.x+","+bc_oil_target.y+") ["+getDistance(bc_oil_target)+"] {"+bc_oil_target.player+"}", 3);
		if(bc_oil_target.player < maxPlayers){
			if(allianceExistsBetween(me, bc_oil_target.player)){return false;}
		}

		debugMsg("Похоже имеется незанятая мной вышка ("+bc_oil_target.x+","+bc_oil_target.y+") ["+getDistance(bc_oil_target)+"]",2);
		//Если вышка с пушкой доступны, то строим пушку рядом с ресурсом
		if(isStructureAvailable(b_light_defence,me)){
			var pos = pickStructLocation(builder,b_light_defence,bc_oil_target.x,bc_oil_target.y);
			if (!!pos) {
				orderDroidBuild(builder,DORDER_BUILD,b_light_defence,pos.x,pos.y,0);
			}else{
				orderDroidLoc(builder,DORDER_MOVE,bc_oil_target.x,bc_oil_target.y);
			}
		}else{ //Просто поедем посмотрим
			orderDroidLoc(builder,DORDER_MOVE,bc_oil_target.x,bc_oil_target.y);
		}
		return true;
	}
	//Если не нашли чем занять строителя то возвращаем false
	return false;

/*
    setWarEnv();
    //Отправляю разведку на любую точку ресурса, не пренадлежащаю "мне"
    if(u_warriors.length >= u_warriors_min && u_warcyborgs.length >= 5){
        var bc_oil_all_c = bc_oil_all.length;
        if(bc_rig_c < bc_oil_all_c){
            debugMsg("Занято мною ресурсов "+bc_rig_c+"/"+bc_oil_all_c, 2);
            var w = 0;
            for ( var o in bc_oil_all){
                var o_found = false;
                for ( var r in bc_rig){
                    if(bc_oil_all[o].x == bc_rig[r].x && bc_oil_all[o].y == bc_rig[r].y){
                        o_found = true;
                        break;
                    }
                }
                if(o_found){continue;}
                else{
//                    debugMsg("Похоже имеется незанятая мной вышка ("+bc_oil_all[o].x+","+bc_oil_all[o].y+")",2);
//                    if (u_warriors[w].order != DORDER_ATTACK && u_warriors[w].order != DORDER_MOVE) {
                    orderDroidLoc(u_warriors[w],DORDER_MOVE,bc_oil_all[o].x,bc_oil_all[o].y);
                    debugMsg("Отправляю дроида ("+u_warriors[w].x+","+u_warriors[w].y+") на разветку ресурса ("+bc_oil_all[o].x+","+bc_oil_all[o].y+")",2);
                    if(w>=u_warriors.length){break;}
                    else {w++;}
//                    }
                }
            }
        }
    }
*/
	
}

function builderScout(){
	builder_scout = false;
    u_builders   = enumDroid(me,DROID_CONSTRUCT);
	for(var i = 0; i < maxPlayers; i++){
		if(i == u_builders.length) break;
//		if(!allianceExistsBetween(me,i)){
			scout = u_builders[i];
			var targetXY = startPositions[playerData[i].position];
			if (getDistance(targetXY) < 10 ) {
				debugMsg("Разведку на самого себя пропускаю ["+i+"] {"+targetXY.x+","+targetXY.y+"} ("+getDistance(targetXY.x,targetXY.y)+")",2);
				continue;
			}
//			orderDroidLoc(scout,DORDER_MOVE,targetXY.x,targetXY.y);
			var pos = pickStructLocation(scout,b_light_defence,targetXY.x,targetXY.y);
			if (!!pos) {
				orderDroidBuild(scout,DORDER_BUILD,b_light_defence,pos.x,pos.y,0);
			}else{
				orderDroidLoc(scout,DORDER_MOVE,targetXY.x,targetXY.y);
			}
			debugMsg("Отправляю разведку строителями на точку игрока ["+i+"] ("+targetXY.x+","+targetXY.y+")",1);
//		}
	}
}

// Функция призывающая одного свободного строителя к любому(или указанному) строящемуся или нуждающемуся в ремонте зданию в помощь
// Возвращает булево значение: показатель занятости строителей
// true - работа для строителя найдена или нет свободных строиелей
// false - работы нет, строитель есть и бездельничает
function helpBuild(){

//	if(!where){
//		debug("bc: Ищу кого ни будь, помочь построить что ни будь");
//	}
	//	else{debug("bc: Ищу кого ни будь, помочь построить ("+where.x+","+where.y+") ["+where+"]");}
	
//	removeTimer("helpBuild");

	//Получаем одного свободного строителя
	debugMsg("План: Ремонт/Помощь в постройке",4);
	builder = getBuilder();
	if(!builder){
		debugMsg("Не могу выбрать свободного строителя для подмоги",1); 
		return true; // true потому что занятость строителей полная (или их нет)
	}
//	else{debug("bc: Найден свободный строитель для подмоги ("+builder.x+","+builder.y+")");}

	var buildings = enumStruct(me);
	for (var b in buildings){
		if(buildings[b].status == BEING_BUILT){
			debugMsg("Строитель ("+builder.x+","+builder.y+") отправлен на достройку здания ("+buildings[b].x+","+buildings[b].y+") ["+buildings[b].stattype+"]",2);
			orderDroidObj(builder, DORDER_HELPBUILD, buildings[b]);
			return true;
		}
		else if(buildings[b].health < 100 && getDistance(buildings[b]) <= 25){
//			debug("bc: Найдено здание нуждающееся в допостройке");
			debugMsg("bc: Строитель ("+builder.x+","+builder.y+") отправлен на ремонт здания ("+buildings[b].x+","+buildings[b].y+") ["+buildings[b].stattype+"]",2);
			orderDroidObj(builder, DORDER_REPAIR, buildings[b]);
			return true;
		}
	}
//	debug("bc: Здания нуждающееся в допостройке не найдены");
	return false; //false потому что строители бездельничают
}
// Функция постройки конкретного здания, на приблизительном месте
function buildBuilding(what, x, y){
	//Получаем одного свободного строителя
	debugMsg("План: Строю ["+what+"]",4);
	builder = getBuilder();
	if(!builder){debugMsg("Не могу выбрать свободного строителя",1);return;}
	else{debugMsg("Найден свободный строитель ("+builder.x+","+builder.y+")",3);}

	// Проверяем, можем ли мы построить здание
	if (isStructureAvailable(what,me)) {
		// Передаём координаты постройки и получаем проверенные и одобренные
//		var pos = pickStructLocation(builder,what,(base_x+rnd(7)),(base_y+rnd(7)));
		var pos = pickStructLocation(builder,what,(base_x),(base_y));
		if (!!pos) {
			// Строим
			debugMsg("Строю: ("+pos.x+","+pos.y+") ["+what+"]",3);
			orderDroidBuild(builder,DORDER_BUILD,what,pos.x,pos.y,0);
			return true;
		} else {
			// Облом
			debugMsg("Не найдено подходящей площадки для постройки",1);
			return false;
		}
	}else{
			debugMsg("["+what+"] - строение не доступно",1);
			return false;
	}
	return false;
}

// Проверяем занятость строителей
function builderBusy(builder) {
	if (builder.order == DORDER_BUILD)
		return true;
	if (builder.order == DORDER_HELPBUILD)
		return true;
	if (builder.order == DORDER_LINEBUILD)
		return true;
	if (builder.order == DORDER_DEMOLISH)
		return true;
	if (builder.order == DORDER_MOVE && getDistance(builder) > 3 )
		return true;
	return false;
	
}


function getBuilder(){
	// Выбираем всех строителей
	setGroupEnv();
	var builders = g_baseBuilders; // Для грузовичков
//	builders += enumDroid(me, 10); // Для киборгов-инженеров (почему-то выбирает все объекты на карте, пока убрал)
	
	debugMsg("Ищу строителей, найдено: "+builders.length,2);

	var tmp_set = true;
	var tmp_found = false;
	for (var i in builders){
		if (!builderBusy(builders[i])) {
			setEnv();
			if(tmp_set && bc_factory_r != 0){
				for(var r in bc_oil){
					//Если строитель очень близко со свободным ресурсов - принудительный захват
					if(distBetweenTwoPoints(bc_oil[r].x,bc_oil[r].y,builders[i].x,builders[i].y) <= 10){
						orderDroidBuild(builders[i],DORDER_BUILD,b_rig,bc_oil[r].x,bc_oil[r].y,0);
						debugMsg("Принудительный захват ресурса строителем",2);
						tmp_set = false;
						tmp_found = true;
						break;
					}
				}
			}
			if(tmp_found){
				tmp_found = false;
				continue;
			}
			else{
				return builders[i];
			}
		}
	}
	//Если нет свободных строителей
	if((my_money > 1800 || u_builders_c < d_truck_normal) && u_builders_c < d_truck_max ){
		debugMsg("Моя энергия: "+my_money+"; Грузовичков:"+u_builders_c+"<"+d_truck_normal+" заказываю дополнительных строителей");
		need_builder = true;
	}
	return false;
}



// Тупо тестовая функция, удалить нахер
function moveToAlly(){
	builder = getBuilder();
	if(!builder){debugMsg("Не могу выбрать свободного строителя",1);}
	else{debugMsg("Найден свободный строитель ("+builder.x+","+builder.y+")",2);}
	debugMsg("bc: Отсылаю холопа к первому игроку(тест)",3);
	orderDroidLoc(builder,DORDER_MOVE,startPositions[playerData[0].position].x,startPositions[playerData[0].position].y);
	removeTimer("moveToAlly");
}

function changeAttackTarget(target){
	setWarEnv();
	for ( var w in u_warriors){
		if(distBetweenTwoPoints(u_warriors[w].x,u_warriors[w].y,target.x,target.y) <= 20){
			orderDroidObj(u_warriors[w],DORDER_ATTACK,target);
			debugMsg("Смена цели на ("+target.x+","+target.y+")",2);
		}
	}
	for ( var w in u_warcyborgs){
		if(distBetweenTwoPoints(u_warcyborgs[w].x,u_warcyborgs[w].y,target.x,target.y) <= 20){
			orderDroidObj(u_warcyborgs[w],DORDER_ATTACK,target);
			debugMsg("Смена цели на ("+target.x+","+target.y+")",2);
		}
	}
}

//Атакуем цель машинами
function attackNowMachine(target, force){

//	if (u_warriors.length == 0){debug("bc warn: Нет войск, что бы отбится от атаки!");return;}
//	else {
//		debug("bc: Собрано "+u_warriors.length+" машин для защиты");
//		for( w in u_warriors ){debug("bc: "+u_warriors[w].player+" "+u_warriors[w].droidType);}
//	}
	setWarEnv();
	if ((u_warriors.length > 5 || force) && u_warriors.length != 0){
		for ( var w in u_warriors){
			if (u_warriors[w].order != DORDER_ATTACK && u_warriors[w].order != DORDER_MOVE) {
				debugMsg("Отправляю машину ("+u_warriors[w].x+","+u_warriors[w].y+") {"+getDistance(u_warriors[w])+"} атаковать цель ("+target.x+","+target.y+") {"+getDistance(target)+"}",2);
				orderDroidObj(u_warriors[w],DORDER_ATTACK,target);
			}
		}
	}
}
//Атакуем цель киборгами
function attackNowCyborg(target, force){

//	if (u_warriors.length == 0){debug("bc warn: Нет войск, что бы отбится от атаки!");return;}
//	else {
//		debug("bc: Собрано "+u_warriors.length+" машин для защиты");
//		for( w in u_warriors ){debug("bc: "+u_warriors[w].player+" "+u_warriors[w].droidType);}
//	}
	setWarEnv();
	if ((u_warcyborgs.length > 5 || force) && u_warcyborgs.length != 0){
		for ( var w in u_warcyborgs){
			if (u_warcyborgs[w].order != DORDER_ATTACK && u_warcyborgs[w].order != DORDER_MOVE) {
				debugMsg("Отправляю киборга ("+u_warcyborgs[w].x+","+u_warcyborgs[w].y+") {"+getDistance(u_warcyborgs[w])+"} атаковать цель ("+target.x+","+target.y+") {"+getDistance(target)+"}",2);
				orderDroidObj(u_warcyborgs[w],DORDER_ATTACK,target);
			}
		}
	}
}

//Проверяем кол-во модулей у зданий
function countModules(module){
//	if(module == m_power){
		for ( m in bc_power ){
			if (bc_power[m].modules < 1){
				installModule(bc_power[m], module);
			}
		}
//	}
//	else if(module == m_lab){
		for ( m in bc_lab ){
			if (bc_lab[m].modules < 1){
				installModule(bc_lab[m], module);
			}
		}
//	}
//	else if(module == m_factory){
		for ( m in bc_factory ){
			if (bc_factory[m].modules < 2){
				installModule(bc_factory[m], module);
			}
		}
//	}
}

//Устанавливаем модуль
function installModule(building,module){
	debugMsg("План: Установка модуля ("+building.x+","+building.y+") ["+module+"]",4);
	var builder = getBuilder();
	if(!builder){
		debugMsg("Нет свободных строителей для установки модуля",1);
		return false;
	}
	orderDroidBuild(builder, DORDER_BUILD, module, building.x, building.y)
}


//Функция должна решить где безопасное место (пока отправляет тупо "домой")
function goToSafe(who){
	if(who.droidType == DROID_CONSTRUCT){
		orderDroidLoc(who,DORDER_MOVE,base_x,base_y);
	}
}

//Функция возвращает дистанцию от базы до передаваемого объекта
function getDistance(what){
	return distBetweenTwoPoints(base_x,base_y,what.x,what.y);
}

function factoryReady(what){
	return ( (what.status == BUILT) && structureIdle(what) );
}

function rnd(max){
	return Math.floor(Math.random() * max);
}

function someDebug(){
	debugMsg("Количество точек ресурсов: "+bc_oil_glob.length,1);
	for (var i in bc_oil_glob){
		debugMsg(i+" ("+bc_oil_glob[i].x+","+bc_oil_glob[i].y+") {"+distBetweenTwoPoints(base_x,base_y,bc_oil_glob[i].x,bc_oil_glob[i].y)+"} ["+bc_oil_glob[i].player+"]",1);
	}

	debugMsg("Карта \""+mapName+"\", width*height: "+mapWidth+"*"+mapHeight,1);
//	debug("bc: Строителей: "+u_builders_c+" - "+countDroid(DROID_CONSTRUCT,me));
	
//	warriors = enumDroid(me,DROID_WEAPON);
//	debug("bc: Воинов: "+warriors.length);
	
}

function debugMsg(msg,level){
	var timeMsg = Math.floor(gameTime / 1000);
	debug("bc["+me+"]{"+timeMsg+"}: "+msg);
}


// ############# \\
// ***СОБЫТИЯ*** \\
// ############# \\

//Нихрена не работает, а должно было срабатывать при начале постройки здания
//А вот нифига, этот триггер срабатывает при выходе из завода нового юнита.
function eventDroidBuilt(droid, structure) {
//	debug("bc: Новый юнит вышел на свет");
	switch (droid.droidType) {
		case DROID_WEAPON: {
			
			//Сбор войск возле атакованного здания
			if(e_lastattack_b){
				debugMsg("Отправляю подмогу к атакованному зданию ("+e_lastattack_b.x+","+e_lastattack_b.y+")",2);
				orderDroidLoc(droid, DORDER_MOVE, e_lastattack_b.x, e_lastattack_b.y);
			}
			// Ищем кого бы убить
			break;
		}
		case DROID_CONSTRUCT: {
			
			groupAddDroid(baseBuilders, droid);
			need_builder = false;
			// Строим что ни будь
			buildSome();
			break;
		}
	}
}

//Срабатывает при завершении строительства здания
function eventStructureBuilt(structure, droid){

	if ( structure.stattype == RESEARCH_LAB ) queue("doResearch", 2000);

	buildSome();
}


// Обязательно использовать
function eventDroidIdle(droid) {
//	debug("bc: Имеются халявщики");
	switch (droid.droidType) {
		case DROID_WEAPON: {
			// Ищем кого бы убить
			break;
		}
		case DROID_CONSTRUCT: {
			//Если строитель бездельничает в дали от базы
			setEnv();
			debugMsg("Имеется холоп ("+droid.x+","+droid.y+")",4);
			if(distBetweenTwoPoints(droid.x,droid.y,base_x,base_y)>10 && my_money > 500){
				debugMsg("Холоп далеко от базы ("+droid.x+","+droid.y+")",3);
				for (var r in bc_oil){
					if( distBetweenTwoPoints(droid.x,droid.y,bc_oil[r].x,bc_oil[r].y) < rigDefenceRange ){
						debugMsg("Холоп ("+droid.x+","+droid.y+") рядом с ресурсом ("+bc_oil[r].x+","+bc_oil[r].y+")",2);
						if (isStructureAvailable(b_light_defence,me)){ //В дальнейшем заменить пушку на переменную
							var pos = pickStructLocation(droid,b_light_defence,bc_oil[r].x,bc_oil[r].y);
							if (!!pos) {
								debugMsg("Строю защиту вышки: ("+pos.x+","+pos.y+") ["+b_light_defence+"]",2);
								orderDroidBuild(droid,DORDER_BUILD,b_light_defence,pos.x,pos.y,0);
								break;
							}
							else {
								debugMsg("Не найдено место для защиты вышки",1);
							}
						}else{
							debugMsg("Защита недоступна",1);
						}
					}
				}
			}
			//Иначе вернуться домой
			else if( getDistance(droid) > 20 )goToSafe(droid);
			break;
		}
		case DROID_SENSOR: {
			// Ищем чего бы подсветить/разведать
			break;
		}
	}
//	debug("bc warn: Не знаю что с халявщиком делать");
}

function eventResearched(research, structure) {
	
    debugMsg("Новая технология ["+research.name+"]",2);
	
	//Установка пушек для постройки машин
//	if(research.name == "R-Wpn-MG1Mk1") {
//		debugMsg("Ура! У нас новый лёгкий пулемёт для машин, создаю армию",2);
	listMachine();
	listCyborgs();
		//d_turret = "MG1Mk1";debugMsg("Ура! У нас новый лёгкий пулемёт для машин",2);
//	}
//	if(research.name == "R-Wpn-Flamer01Mk1") {d_turret = "Flame1Mk1";debugMsg("bc: Ура! У нас новый лёгкий напалм для машин",2);}
//	if(research.name == "R-Wpn-MG3Mk1") {d_turret = "MG3Mk1";debugMsg("bc: Ура! У нас тяжёлый пулемёт для машин",2);}
	
	//Установка брони для постройки машин
//	if(research.name == "R-Vehicle-Body05") {d_body = "Body5REC";debugMsg("bc: Ура! Теперь наши танчики одеты!",2);}

	//Установка колёс для постройки машин
//	if(research.name == "R-Vehicle-Prop-Halftracks") {d_wheel = "HalfTrack";debugMsg("bc: Ура! Теперь наши танчики обуты!",2);}
				
//	researchSome();

//	doResearch();
	queue("doResearch", 2000);
}

function eventAttacked(victim, attacker) {

	return;

    if(allianceExistsBetween(attacker.player, me)){
		//Не отвечаем огнём по союзнику
		return;
	}

	target = isBeingRepaired(attacker);	
	if ( target != false ){
		debugMsg("Должен убить сначала ремонтника ("+target.x+","+target.y+") ["+target.player+"]",3);
		attacker = target;
	}

	if (victim.type == DROID) {
		if (victim.droidType == DROID_CONSTRUCT){
			debugMsg("Наши строители атакованы!",2);
			goToSafe(victim);
			attackNowMachine(attacker,true);
			attackNowCyborg(attacker,true);
		}
		else if(victim.type == DROID_WEAPON || victim.type == DROID_CYBORG){
			changeAttackTarget(attacker);
		}
		else if(getDistance(attacker) < 20){
			attackNowMachine(attacker,true);
			attackNowCyborg(attacker,true);

		}
		else{
			attackNowMachine(attacker,false);
			attackNowCyborg(attacker,false);
		}
	}else{
		
		e_lastattack_b = victim; //Запоминаем последнее атакованное строение
		
		debugMsg("Наши строения атакованы!",2);
		if(getDistance(attacker) < 20){
			//Если атакующий очень близко с базой, атаковать всем что есть
			attackNowCyborg(attacker,true);
			attackNowMachine(attacker,true);

		}
		else{
			//Если атакующий далеко от базы, атаковать по возможности группой
			attackNowCyborg(attacker,false);
			attackNowMachine(attacker,false);

		}
	}
}

function eventStartLevel() {
	setTimer("buildSome", 2000);			//Основная функция для развития
	setTimer("buildSomeMachine",4000);		//Функция постройки армии машин
	setTimer("buildSomeCyborg",3000);		//Функция постройки армии киборгов
//	setTimer("myEyes",2000);				//Функция наблюдения и атаки(основная, не читерская, основываясь на тумане войны)
	queue("lets_go", 1000);					//Функция инициализации
//	setTimer("longCycle", 30000);			//Функция балансировки армии/строителей и реинициализации переменных
//	setTimer("someDebug", 30000);			//Дебаг
}
