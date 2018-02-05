const vernum    = "master";
const verdate   = "xx.10.2017";
const vername   = "BoneCrusher!";
const shortname = "bc";
const release	= false;

//var forceResearch = "Yellow";

///////\\\\\\\
//master changes
//		При нехватке денег, строит 3-й модуль на завод (нашёл и исправил косяк)
//		При низком приросте доходов не запускать более 3-х лабораторий
//		Исправлено: Не строил нефтевышки, если союзники на карте были очень близко к базе
//		Переписана главная функция заполнения кэша-переменной (оптимизация)
//		Теперь строитель определяет, если нефтевышка или бочка застроена хламом, и не тупит возле неё
//		Отказаться от тяжёлого огнемёта, он слишком медленен (готово)
//		Сделал что бы основная армия при сборе половины войск, начинала действовать.
//		Добивание вражеских строителей
//		Новый buildorder для NTW-типа карт
//		Hunter-ы не помогают в строительстве базы, бездельничают в большом кол-ве внутри базы (исправлено)
//		После выноса восстанавливает базу не верно (вроде исправил)
//		Новая функция, убирающие одномерный массив исследований из многомерного массива исследований excludeTech()
//		Исправлена редкая ошибка в events.js, попытка переместить в группу hunters из пустой группы buildersMain
//		Исправлена редкая ошибка в builders.js, попытка отсортировать незанятые нефтевышки, при полностью захваченной карты
//		На уровне сложности выше среднего:
//			HARD+ не использовать слабые пути исследований
//			HARD+ не использовать медленные билдордеры
//			HARD+ дополнительная логика и микроконтроль для армии и строителей
//			HARD+ строители строят больше защитных башен
//		Игра на островных картах:
//			Армия компонуется из ховеров.
//			На островной карте не строит много колёсных строителей
//			Не строит много лабораторий, если под контролем мало нефтевышек
//			На островной карте другая логика перерспределения групп строителей
//			Убираем все исследования связанные с киборгами через excludeTech()
//		Особенности только для версии 3.2+
//			v3.2+ замена строителей на ховеры
//			v3.2+ Теперь может шарить юнитов с напарником по комманде
//			v3.2+ Собирает бочки строителями, если их видно
//		Особенности только для карт типа NTW
//			Группа партизан имеет другую логику атаки и разведки
//			HARD+ Оптимизированная логика строительства нефтевышек
//			v3.2+ HARD+ Новая экспериментальная функция управления основной армией (кучкует, отступает, ожидает)
//			Строители строят защитные башни в местах стычек армий
//			Не сразу отстраивал заводы, при битве на своей базе и потере заводов.


// NTW Глушилки к основной группе (готово)
// NTW Ремонтники - отключить (готово)
// NTW Убрать принудительное исследование гусениц (готово)
// NTW Сделать что б армия видела угрозу во вражеских защитных башнях (готово)
// 3.1.5 починить ошибки, добиться совместимости (готово)


// после релиза:
// Не умеет играть на Т3, строит весь мусор что есть. Как-то исправить эту ситуацию.
// Разложить оружия по категориям, что б не строил весь мусор который есть.
// Ставить в приоритет категории оружий по кол-ву их улучшений.
// Динамические альянсы
// Очередной раз переписать функцию строителей, или оптимизировать.
// Отстраивать базу киборгом-строителем
// Не нарываться на тюрельки за забором.
// 3.2+ Поработать над чатом
// 3.2+ Отдавать приказ военным, очистить загаженный ресурс от дереьев и мусора
// 3.2+ поработать над улучшенной передачей юнитов союзнику
// NTW В командной игре армии кучкует по отдельности, сделать что бы сообща играли

///////\\\\\\\
//v2.1 Changes
//		Новый билдордер
//		Дополнительные пушки
//		Тяжёлые супер-киборги
//		Uplink Satellite
//		Переработал старовые функции
//		Отделил строительную функцию от исследований
//		Вынес настройки в шапку
//		Исправил баг с двойным удалением таймера nastyFeaturesClean
//		Возможность быстро отключить функцию nastyFeatures
//		Новая функция проверки research_way и отсеивания неизвестных технологий
//		Функция и настройка стратегии исследования research_primary
//		Если база под атакой, не запускает новые исследования, производит военных (полная хрень, только ухудшает ситуацию, разрешил исследования если денег больше 300 под атакой)
//		Не помогает в строительстве основной группой строителей, при возведении нефтекачалок
//		Исправление, теперь строит тяжелого инженера с "краном", минуя лёгкий "паяльник", если исследование идёт таким путём
//		Группе киборгов реагированние на нападение
//		v3.2+ Управление глушилками
//		Оптимизация и мониторингfunc
//		Замечено зацикленное поведение гл. строителей, скорее всего они пересекают границу базы и срабатывает возврат на базу
//		v3.2+ Огнемётные танки не отступают перед атакой
//		Если мало ресурсов, не застраивать множеством оборонки вражеские нефтекачалки
//		v3.2+ Работа в комманде, передача лишних денег игроку-союзнику, передача строителей
//		Исправлена ошибка на поздней стадии игры приводящая к простою строителей
//		Подсчёт общей армии в статистике был не верен
//		Отдельная логика для игры на богатых картах "NTW"
//		Строители стали тупить на базе, не захватывают вышки, разобрался
//		строители застревают на базе, бьются в здания, исправить
//		Создать несоклько путей развития


//FIXME/TODO//
//		Вроде исправил баг со строительством мега радара (проверить)
// +++ имеются ошибки в коде, посмотреть лог и исправить.
// --- eventDroidIdle глючный, иногда вообще не вызывается, сделать функцию слежки за этим
// --- Собирать бочки с нефтью и артефакты
// -++ Использовать поздние технологии, лазеры, рельсаганы и т.д.
// --- Не правильно переносит базу! Переносит на передовую и проигрывает, исправить!
// --  хилерам, не собираться слишком далеко от базы, к дальней пушке
// -+  Если на базе уничтожены главные строители, но есть строитель-охотник, охотника в главные базу на строителя
// --  Если база под атакой, и нет военных - сменить местоположение базы
// --  Если нет готовых заводов и все строители уничтожены, создать киборга-строителя
// --  Переделать функцию переезда базы, на самое крайнее здание от имеющейся базы
// --  Если путь к ресурсу заблокирован, строители стоят и тупят
// -   Определять ближайшего врага и ближайшего союзника, для атаки/подмоги по приоритету
// -   Отдельный путь развития для игры в команде
// -   Больше использовать getInfoNear() для прироста производительности
// -   Сделать более подробную статистику, например очки исследований и затраты на них, кол-во произведённых едениц техники и т.д.

//DEBUG: количество вывода, закоментить перед релизом
//var debugLevels = new Array("init", "builders", "army", "production", "base", "events", "stats", "research", "vtol");
//var debugLevels = new Array('init', 'end', 'stats', 'temp', 'production', 'group', 'events', 'error', 'research', 'builders', 'targeting');
//var debugLevels = new Array('error', 'init', 'end', 'stats', 'temp', 'targeting', 'vtol', 'builders', 'getInfoNear');
//var debugLevels = new Array('error', 'init', 'end', 'stats', 'group', 'temp', 'builders', 'research', 'transfer', 'triggers', 'eventDroidBuilt');
//var debugLevels = new Array('init', 'end', 'research', 'triggers', 'group', 'performance', 'events', 'stats', 'targeting', 'chat');
//var debugLevels = new Array('init', 'end', 'error', 'triggers');
//var debugLevels = new Array('init', 'end', 'error', 'chat', 'stats', 'research', 'group', 'production', 'performance', 'donate');
var debugLevels = new Array('error', 'init', 'stats', 'performance', 'ally', 'army', 'research', 'mark', 'defence');
//var debugLevels = new Array('error', 'init');
var debugName;








//Массив конкретных технологий (tech.js)
var tech = [];

include("multiplay/skirmish/bc-"+vernum+"/functions.js");
include("multiplay/skirmish/bc-"+vernum+"/builders.js");
include("multiplay/skirmish/bc-"+vernum+"/targeting.js");
include("multiplay/skirmish/bc-"+vernum+"/events.js");
include("multiplay/skirmish/bc-"+vernum+"/names.js");
include("multiplay/skirmish/bc-"+vernum+"/produce.js");
include("multiplay/skirmish/bc-"+vernum+"/performance.js");
include("multiplay/skirmish/bc-"+vernum+"/chatting.js");
include("multiplay/skirmish/bc-"+vernum+"/tech.js");


/*
 * 
 * НАСТРОЙКИ
 * 
 */


//Алгоритм "nastyFeatures" - очистки деревьев, домов и прочего мусора рядом с ресурсами и базой (тяжёлый, не совсем корректный, но пусть будет, т.к. самоотключающийся)
var nfAlgorithm = false;

//Стратегия исследования пути
//"Strict" - строгая, primary_way исcледуется один за другим
//"Smudged" - не строгая, по мере возможности забегает вперёд, но доисследует весь primary_way
//"Random" - случайная, выборочно по заданному пути, но доиследует весь primary_way
//"RoundRobin" - пока не реализована..
var researchStrategy = 'Strict'; //По умолчанию, можно изменить в файле настроек вынесенный за предел мода

var base_range = 40; // В каких пределах работают основные строители (не охотники)

var buildersTimer = 25000;		//Триггер для заказа строителей (что бы не выходили пачкой сразу)
var fixersTimer = 50000;		//Триггер для заказа рем.инженеров
var checkRegularArmyTimer = 10000;
var reactRegularArmyTimer = 10000;
var reactWarriorsTimer = 5000;
var fullBaseTimer = 60000;

var minBuilders = 5;

var builderPts = 750;

var maxConstructors = 15;

var minPartisans = 7;
var maxPartisans = 15;
var minRegular = 10;
var maxRegular = 50;
var maxVTOL = 40;
var maxCyborgs = 30;
var maxFixers = 5;
var maxJammers = 2;
var maxScouts = 2;

var maxExtractors = 40;
var maxGenerators = 10;

var fullBase = false;
/*
 * 
 * -=-=-=-
 * 
 */

//Отсутствующие переменные
var DORDER_NONE = 0;
var DORDER_RECOVER = 33;

//Координаты всех ресурсов, свободных и занятых
var allResources;

//Координаты нашей базы
var base		= {x:0,y:0};
var startPos	= {x:0,y:0};

//Массив для поддерживаемого союзника
var ally=[];

//Массив всех приказов юнитам
var _globalOrders = [];


var avail_research = [];	//Массив возможных исследований, заполняется в функции doResearch();

var running = false;	//Работаем?

var scavengerPlayer = -1;

var buildersMain = newGroup();
var buildersHunters = newGroup();

var policy = [];
policy['build'] = 'standart';

//Фитчи, не совместимые с 3.1.5
var nf = [];
nf['policy'] = false;

var armyPartisans = newGroup();
var armyRegular = newGroup();
var targRegular={x:0,y:0};
var lastImpact=false;
var pointRegular=false;
var lastEnemiesSeen = 0;
var armySupport = newGroup();
var armyCyborgs = newGroup();
var armyFixers = newGroup();
var armyJammers = newGroup();
var armyScouts = newGroup();
var partJammers = newGroup();
var VTOLAttacker = newGroup();

var maxFactories, maxFactoriesCyb, maxFactoriesVTOL, maxLabs, maxPads;

//Triggers
var buildersTrigger = 0;
var fixersTrigger = 0;
var checkRegularArmyTrigger = 0;
var reactRegularArmyTrigger = 0;
var reactWarriorsTrigger = 0;
var fullBaseTrigger = 0;

var eventsRun=[];
eventsRun['targetCyborgs'] = 0;
eventsRun['targetArmy'] = 0;
eventsRun['targetRegular'] = 0;
eventsRun['targetJammers'] = 0;
eventsRun['targetFixers'] = 0;
eventsRun['buildersOrder'] = 0;
eventsRun['victimCyborgs'] = 0;

var produceTrigger=[];

var armyToPlayer = false;	//Передавать всю новую армию игроку №№
var vtolToPlayer = false;

//Предустановки на исследование
var research_way = []; //Главный путь развития, компануется далее, в функциях, в зависимости от уровня сложности и др. настроек
var research_primary = []; //Первичный, один из главных под-путей развития, к которому задаётся режим его исследований(строгий, размазанный или случайный)
//Предустановки, на случай researchCustom
var researchCustom = false; //Задаётся в файле настроек, вынесенный за пределы мода
const research_synapse = ["R-Struc-Research-Upgrade09"];
const research_power = ["R-Struc-Power-Upgrade03a"];
const research_armor = ["R-Vehicle-Metals09"];
const research_sensor = ["R-Sys-Sensor-UpLink"];

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
["R-Wpn-Rocket01-LtAT", "CyborgRkt1Ground", "CyborgRocket"],		//Lancer
["R-Wpn-Missile2A-T", "Cyb-Bod-Atmiss", "Cyb-Wpn-Atmiss"],			//scourge
["R-Cyborg-Hvywpn-A-T", "Cyb-Hvybod-A-T", "Cyb-Hvywpn-A-T"],			//super scourge
["R-Cyborg-Hvywpn-HPV", "Cyb-Hvybod-HPV", "Cyb-Hvywpn-HPV"],			//Super Hyper velocity
["R-Cyborg-Hvywpn-Acannon", "Cyb-Hvybod-Acannon", "Cyb-Hvywpn-Acannon"],	//Super autocannon
["R-Cyborg-Hvywpn-PulseLsr", "Cyb-Hvybod-PulseLsr","Cyb-Hvywpn-PulseLsr"],	//super pulse laser
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
//["R-Wpn-Flame2", "Flame2"],						//Heavy Flamer - Inferno
["R-Wpn-Plasmite-Flamer", "PlasmiteFlamer"],
//	===== Ракеты прямого наведения
["R-Wpn-Rocket05-MiniPod", "Rocket-Pod"],			//Скорострельная лёгкая ракета прямого наведения
["R-Wpn-Rocket03-HvAT", "Rocket-BB"],				//Медленная ракета против строений и танков (в общей армии не очень, только если против укреплений)
["R-Wpn-Rocket01-LtAT", "Rocket-LtA-T"],			//Противотанковая пара ракет прямого наведения "Лансер"
["R-Wpn-Rocket07-Tank-Killer", "Rocket-HvyA-T"],	//Улучшенная противотанковая пара ракет прямого наведения
["R-Wpn-Missile2A-T", "Missile-A-T"],				//Тяжолая противотанковая пара ракет прямого наведения "scourge"
//	===== Ракеты артиллерии
["R-Wpn-Rocket02-MRL", "Rocket-MRL"],				//Лёгкая артиллерийская ракетная баттарея
["R-Wpn-Rocket06-IDF", "Rocket-IDF"],				//Дальнобойная артиллерийская ракетная баттарея Ripple
["R-Wpn-MdArtMissile", "Missile-MdArt"],			//Улучшенная артиллерийская ракетная баттарея Seraph
["R-Wpn-HvArtMissile", "Missile-HvyArt"],			//Улучшенная дальнобойная артиллерийская ракетная баттарея Archangel
//	===== Мортиры
["R-Wpn-Mortar01Lt", "Mortar1Mk1"],					//Mortar
["R-Wpn-Mortar-Incenediary", "Mortar-Incenediary"],	//Incendiary Mortar
["R-Wpn-Mortar02Hvy", "Mortar2Mk1"],				//Heavy Mortar - Bombard
["R-Wpn-Mortar3", "Mortar3ROTARYMk1"],				//Rotary Mortar - Pepperpot
//	===== Гаубицы
["R-Wpn-HowitzerMk1", "Howitzer105Mk1"],				//Howitzer
["R-Wpn-HvyHowitzer", "Howitzer150Mk1"],				//Heavy Howitzer - Ground Shaker
["R-Wpn-Howitzer03-Rot", "Howitzer03-Rot"],				//Rotary Howitzer - Hellstorm
["R-Wpn-Howitzer-Incenediary", "Howitzer-Incenediary"],	//Incendiary Howitzer
//	===== Лазеры
["R-Wpn-HvyLaser", "HeavyLaser"],					//Heavy Laser
["R-Wpn-Laser02", "Laser2PULSEMk1"],				//Pulse Laser
["R-Wpn-Laser01", "Laser3BEAMMk1"],					//Laser - Flashlight
//	===== Rails
["R-Wpn-RailGun01", "RailGun1Mk1"],					//Needle Gun
["R-Wpn-RailGun02", "RailGun2Mk1"],					//Rail Gun
["R-Wpn-RailGun03", "RailGun3Mk1"],					//Gauss Cannon

];

var defence = [];
var towers=[
['R-Defense-Tower01', 'GuardTower1'],									//Пулемётная вышка
['R-Defense-Pillbox01', 'PillBox1'],									//Пулемётный бункер
['R-Defense-WallTower01', 'WallTower01'],								//Укреплённый пулемёт
['R-Defense-WallTower02','WallTower02'],								//Укреплённая лёгкая пушка
['R-Defense-Tower06', 'GuardTower6'],									//Вышка минирокет
['R-Defense-Pillbox06', 'GuardTower5'],									//Лансер
['R-Defense-WallTower-HPVcannon','WallTower-HPVcannon'],				//Гиперскоростная защита
['R-Defense-Emplacement-HPVcannon', 'Emplacement-HPVcannon'],			//Гиперскоростная защита окоп
['R-Defense-MRL', 'Emplacement-MRL-pit'],								//Окоп рокетных батарей
['R-Defense-IDFRocket','Emplacement-Rocket06-IDF'],							//Окоп дальнобойных рокетных батарей
['R-Defense-MortarPit', 'Emplacement-MortarPit01'], 						//Мортира
['R-Defense-RotMor', 'Emplacement-RotMor'],									//Пепперпот
['R-Defense-WallTower-TwinAGun', 'WallTower-TwinAssaultGun'],				//Спаренный пулемёт
['R-Defense-MortarPit-Incenediary' , 'Emplacement-MortarPit-Incenediary'],	//Адская мортира
];

var AA_defence = [];
var AA_queue = [];
var AA_towers=[
['R-Defense-AASite-QuadMg1', 'AASite-QuadMg1'],					//Hurricane AA Site
['R-Defense-AASite-QuadBof', 'AASite-QuadBof'],					//AA Flak Cannon Emplacement
['R-Defense-WallTower-DoubleAAgun', 'WallTower-DoubleAAGun'],	//AA Flak Cannon Hardpoint
['R-Defense-Sunburst', 'P0-AASite-Sunburst'],					//Sunburst AA Site
['R-Defense-SamSite1', 'P0-AASite-SAM1'],						//Avenger SAM Site
['R-Defense-SamSite2', 'P0-AASite-SAM2'],						//Vindicator SAM Site
['R-Defense-WallTower-QuadRotAA', 'WallTower-QuadRotAAGun'],	//Whirlwind Hardpoint
['R-Defense-AA-Laser', 'P0-AASite-Laser'],						//Stormbringer Emplacement
];

//Инициализация
function init(){
	//инфа
	debugName = colors[playerData[me].colour];
	
	debugMsg("ИИ №"+me+" "+vername+" "+vernum+"("+verdate+") difficulty="+difficulty, "init");
	debugMsg("WarZone2100 "+version, "init");
	
	//Определяем мусорщиков
	scavengerPlayer = (scavengers) ? Math.max(7,maxPlayers) : -1;
	if(scavengers)debugMsg("На карте присудствуют гопники! {"+scavengerPlayer+"}", "init");
	else debugMsg("На карте отсутствуют гопники", "init");
	
	base = startPositions[me];
	startPos = base;
	
	//Получаем координаты всех ресурсов и занятых и свободных
	allResources = enumFeature(ALL_PLAYERS, "OilResource");
	var nearResources = allResources.filter(function(e){if(distBetweenTwoPoints_p(base.x,base.y,e.x,e.y) < base_range) return true; return false;});
	nearResources = nearResources.concat(enumStruct(me, "A0ResourceExtractor").filter(function(e){if(distBetweenTwoPoints_p(base.x,base.y,e.x,e.y) < base_range) return true; return false;}));
	debugMsg("На карте "+allResources.length+" свободных ресурсов", 'init');
	
	for ( var e = 0; e < maxPlayers; ++e ) allResources = allResources.concat(enumStruct(e,RESOURCE_EXTRACTOR));
	if(scavengers == true){
		allResources = allResources.concat(enumStruct(scavengerPlayer, "A0ResourceExtractor"));
	}
	debugMsg("На карте "+allResources.length+" всего ресурсов, рядом "+nearResources.length, 'init');
	

	//Research way
	if(Math.round(Math.random()*5) != 0)
	researchCustom = true;
	if(researchCustom){
		researchStrategy = 'Smudged';
		debugMsg("initializing custom research_primary", 'init');
		include("multiplay/skirmish/bc-"+vernum+"/research-test.js");
	
		//fixResearchWay(research_rocket_mg);
		//fixResearchWay(research_vtol_laser_flamer);
		//fixResearchWay(research_cannon_mg);
		//fixResearchWay(research_mortar_flamer);
		var _primary = fixResearchWay(research_primary);
		if(_primary == false){
			debugMsg('Внимание, не удалось проверить путь исследований!', 'error');
			debugMsg("initializing standart research_primary", 'init');
			include("multiplay/skirmish/bc-"+vernum+"/research-normal.js");
			researchCustom = false;
			researchStrategy = 'Strict';
		}
		else{
			research_primary = _primary;
			//Переменная приоритетов путей исследований
			research_way = [
				research_synapse,
				research_power,
				research_armor,
				research_sensor
			];
		}
	}else{
		debugMsg("initializing standart research_primary", 'init');
		include("multiplay/skirmish/bc-"+vernum+"/research-normal.js");
	}
	
	if(!addPrimaryWay()){debugMsg("research_primary не добавлен в research_way!", 'error');}
	
	if(nearResources.length > 30){
		//TODO
		//		debugMsg("Играем по тактике богатых карт.", 'init');
		//include("multiplay/skirmish/bc-"+vernum+"/build-rich.js");
		include("multiplay/skirmish/bc-"+vernum+"/build-normal.js");
		policy['build'] = 'rich';
	}else{
		include("multiplay/skirmish/bc-"+vernum+"/build-normal.js");
	}
	
	if(policy['build'] == 'rich'){

		research_way.unshift(
			["R-Sys-Engineering01"],
			["R-Struc-Research-Module"],
			["R-Struc-Factory-Cyborg"],
			["R-Vehicle-Prop-Halftracks"],
			["R-Struc-Factory-Module"],
			["R-Struc-PowerModuleMk1"],
			["R-Vehicle-Body11"]
//			["R-Vehicle-Prop-Tracks"]
		);
		
		cyborgs.unshift(["R-Wpn-MG1Mk1", "CyborgChain1Ground", "CyborgChaingun"]);
		
		buildersTimer = 7000;
		minBuilders = 10;
		minPartisans = 1;
		maxPartisans = 2;
		builderPts = 150;
		maxRegular = 100;
	}
	
//	if(policy['build'] == 'cyborgs') cyborgs.unshift(["R-Wpn-MG1Mk1", "CyborgChain1Ground", "CyborgChaingun"]);
	
	debugMsg("Policy build order = "+policy['build'], 'init');
	
	
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
		//Исследуем оружия и защиту в полном рандоме.
		research_way=[["R-Wpn-MG1Mk1"],["R-Struc-Research-Upgrade09"],["R-Struc-Power-Upgrade03a"]];
		
		//Уменьшаем размеры армий
		(maxPartisans > 7)?maxPartisans = 7:{};
		maxRegular = 0;
		(maxVTOL > 5)?maxVTOL = 5:{};
		(maxCyborgs > 5)?maxCyborgs = 5:{};
		(maxFixers > 2)?maxFixers = 2:{};
		
		//Уменьшаем кол-во строителей
		(maxConstructors > 7)?maxConstructors = 7:{};
		(minBuilders > 3)?minBuilders = 3:{};
		
		//Уменьшаем размер базы
		(maxFactories > 2)?maxFactories = 2:{};
		(maxFactoriesCyb > 1)?maxFactoriesCyb = 1:{};
		(maxFactoriesVTOL > 1)?maxFactoriesVTOL = 1:{};
		(maxPads > 2)?maxPads = 2:{};
		
		maxJammers = 0;
		
		//Производим строителя раз в минуту, не раньше
		buildersTimer = 60000;
	}else if(difficulty == MEDIUM){
		buildersTimer = buildersTimer + Math.floor(Math.random()*5000 - 2000);
		minBuilders = minBuilders + Math.floor(Math.random() * 5 - 2 );
		builderPts = builderPts + Math.floor(Math.random() * 200 - 150);
		minPartisans = minPartisans + Math.floor(Math.random() * 6 - 4);
	}
	debugMsg("minPartisans="+minPartisans+", minBuilders="+minBuilders+", builderPts="+builderPts+", buildersTimer="+buildersTimer, "init");
	debugMsg("Лимиты базы: maxFactories="+maxFactories+"; maxFactoriesCyb="+maxFactoriesCyb+"; maxFactoriesVTOL="+maxFactoriesVTOL+"; maxPads="+maxPads+"; maxLabs="+maxLabs+"; maxGenerators="+maxGenerators+"; maxExtractors="+maxExtractors, 'init');
	debugMsg("Лимиты юнитов: maxPartisans="+maxPartisans+"; maxRegular="+maxRegular+"; maxCyborgs="+maxCyborgs+"; maxVTOL="+maxVTOL+"; maxFixers="+maxFixers+"; maxConstructors="+maxConstructors, 'init');
	
	_builders = enumDroid(me,DROID_CONSTRUCT);
	
	debugMsg("Игроков на карте: "+maxPlayers,2);
	playerData.forEach( function(data, player) {
		var msg = "Игрок №"+player+" "+colors[data.colour];
		if (player == me) {
			msg+=" я сам ИИ";
			//			debugName = colors[data.colour];
		}
		else if(playerLoose(player)){msg+=" отсутствует";}
		else if(allianceExistsBetween(me,player)){msg+=" мой союзник";}
		else{
			msg+=" мой враг";
			if(_builders.length != 0){
				
				//Знаю, в 3.2 можно тщательнее всё проверить, но у нас совместимость с 3.1.5
				//поэтому логика аналогична
				//Надеемся, что строитель №0 не ховер, проверяем может ли он добраться до врага
				//Если нет, надеемся, что враг недоступен по земле, но доступен по воде
				if(!droidCanReach(_builders[0], startPositions[player].x, startPositions[player].y)){
					if(!nf['policy']){nf['policy'] = 'island';}
					else if(nf['policy'] == 'land'){ nf['policy'] = 'land';}
				}else{
					if(!nf['policy']){nf['policy'] = 'land';}
					else if(nf['policy'] == 'island'){ nf['policy'] = 'land';}
				}
			}
		}
		
		msg+=" ["+startPositions[player].x+"x"+startPositions[player].y+"]";
		msg+=" дист. "+distBetweenTwoPoints_p(base.x,base.y,startPositions[player].x,startPositions[player].y);
		
		debugMsg(msg,"init");
	});
	
	delete _builders;
	
	if(!release)research_way.forEach(function(e){debugMsg(e, 'research');});
	
	
	if(nf['policy'] == 'island'){
		debugMsg("Тактика игры: "+nf['policy'], 'init');
		_msg='Change policy form: '+policy['build'];
		if(policy['build'] != 'rich') policy['build'] = 'island';
		debugMsg(_msg+' to '+policy['build'], 'init');
		debugMsg('Change maxCyborgs='+maxCyborgs+' to 0', 'init');
		maxCyborgs = 0;
		debugMsg('Change minBuilders='+minBuilders+' to 3', 'init');
		minBuilders = 3;
		buildersTimer = 35000;
		minPartisans = 2;
		
		research_way.unshift(
			["R-Vehicle-Prop-Hover"],
			["R-Struc-PowerModuleMk1"],
			["R-Struc-Research-Module"],
			["R-Struc-Factory-Module"]
		);
		
		debugMsg("Убираем все исследования связанные с киборгами", 'init');
		
		research_way = excludeTech(research_way, tech['cyborgs']);
		
		if(!release)research_way.forEach(function(e){debugMsg(e, 'research');});
		
	}
	
	if(!release) for ( var p = 0; p < maxPlayers; ++p ) {debugMsg("startPositions["+p+"] "+startPositions[p].x+"x"+startPositions[p].y, 'temp');}
	
	var _trash = enumFeature(ALL_PLAYERS, "").filter(function(e){if(e.damageable)return true;return false;});
	nastyFeatures = nastyFeatures.concat(_trash.filter(function(e){
		if(distBetweenTwoPoints_p(base.x,base.y,e.x,e.y) < (base_range/2))return true;
													   return false;
	}));
	allResources.forEach(function(r){
		nastyFeatures = nastyFeatures.concat(_trash.filter(function(e){
			if(distBetweenTwoPoints_p(r.x,r.y,e.x,e.y) < 7)return true;
														   return false;
		}));
	});
	nastyFeatures = removeDuplicates(nastyFeatures, 'id');
	if (nastyFeatures.length != 0 )debugMsg("Желательно уничтожить мусор на карте: "+nastyFeatures.length,'init');
	nastyFeaturesLen = nastyFeatures.length;
	nastyFeatures = []; // Сброс, потому что без проверки по propulsionCanReach, переинициализируется в nastyFeaturesClean();
	//nastyFeatures.forEach(function(e){debugMsg(e.id+" "+e.x+"x"+e.y+" "+e.name+" "+e.damageable+" "+e.player, 'init');});
	
	//Просто дебаг информация
	var oilDrums = enumFeature(ALL_PLAYERS, "OilDrum");
	debugMsg("На карте "+oilDrums.length+" бочек с нефтью", 'init');
	
	queue("welcome", 3000+me*(Math.floor(Math.random()*2000)+1500) );
	if(version == "3.2") queue("checkAlly", 2000);
	
	letsRockThisFxxxingWorld(true); // <-- Жжём плазмитом сцуко!	
}

function welcome(){
	
	if(version == "3.2"){
		
		playerData.forEach( function(data, player) {
			chat(player, 'from '+debugName+': '+chatting('welcome'));
		});
	}
	
}

//Старт
function letsRockThisFxxxingWorld(init){
	debugMsg("Старт/Run", 'init');

	//Первых строителей в группу
	_builders = enumDroid(me,DROID_CONSTRUCT);
	_builders.forEach(function(e){groupBuilders(e);});
	
	if(policy['build'] == 'rich' && _builders.length > 4){
		groupAddDroid(buildersHunters, _builders[0]);
		debugMsg('Builder --> Hunter +1', 'group');
	}
	
	//Получаем свои координаты
	if(_builders.length != 0) base = {x:_builders[0].x, y:_builders[0].y};
	
	delete _builders;
	
	debugMsg("Тут будет моя база: ("+base.x+","+base.y+")", 'init');
	
	
	//Первых военных в группу
	enumDroid(me,DROID_CYBORG).forEach(function(e){groupAddDroid(armyCyborgs, e);});
	enumDroid(me,DROID_WEAPON).forEach(function(e){groupAddDroid(armyCyborgs, e);}); // <-- Это не ошибка, первых бесплатных определяем как киборгов (работа у них будет киборгская)

	queue("buildersOrder", 1000);
	queue("prepeareProduce", 2000);
	queue("produceDroids", 3000);
	queue("doResearch", 3000);
	
	running = true;
	if(init){
		if(difficulty == EASY){
	
			setTimer("produceDroids", 10000+me*100);
			setTimer("produceVTOL", 12000+me*100);
			setTimer("checkEventIdle", 60000+me*100);	//т.к. eventDroidIdle глючит, будем дополнительно отслежвать.
			setTimer("doResearch", 60000+me*100);
			setTimer("defenceQueue", 60000+me*100);
			setTimer("produceCyborgs", 25000+me*100);
			setTimer("buildersOrder", 120000+me*100);
			setTimer("targetVTOL", 120000+me*100); //Не раньше 30 сек.
		
	
		} else if(difficulty == MEDIUM){

			setTimer("produceDroids", 7000+me*100);
			setTimer("produceVTOL", 8000+me*100);
			setTimer("produceCyborgs", 9000+me*100);
			if(policy['build'] == 'rich') setTimer("buildersOrder", 5000+me*100);
			else setTimer("buildersOrder", 120000+me*100);
			setTimer("checkEventIdle", 30000+me*100);	//т.к. eventDroidIdle глючит, будем дополнительно отслежвать.
			setTimer("doResearch", 30000+me*100);
			if(nfAlgorithm)setTimer("nastyFeaturesClean", 35000+me*100);
			setTimer("defenceQueue", 60000+me*100);
			setTimer("targetVTOL", 56000+me*100); //Не раньше 30 сек.
	
		} else if(difficulty == HARD){
		
			setTimer("targetPartisan", 5000+me*100);
			setTimer("buildersOrder", 5000+me*100);
			setTimer("targetJammers", 5500+me*100);
			setTimer("targetCyborgs", 7000+me*100);
			setTimer("produceDroids", 7000+me*100);
			setTimer("produceVTOL", 8000+me*100);
			setTimer("targetFixers", 8000+me*100);
			setTimer("produceCyborgs", 9000+me*100);
			setTimer("doResearch", 30000+me*100);
			setTimer("defenceQueue", 60000+me*100);
			setTimer("targetRegular", 32000+me*100);
			setTimer("targetVTOL", 56000+me*100); //Не раньше 30 сек.
			if(nfAlgorithm)setTimer("nastyFeaturesClean", 35000+me*100);
		
		} else if(difficulty == INSANE){
		
			setTimer("targetPartisan", 5000+me*100);
			setTimer("buildersOrder", 5000+me*100);
			setTimer("targetJammers", 5500+me*100);
			setTimer("produceDroids", 6000+me*100);
			setTimer("produceVTOL", 6500+me*100);
			setTimer("produceCyborgs", 7000+me*100);
			setTimer("targetCyborgs", 7000+me*100);
			setTimer("targetFixers", 8000+me*100);
			setTimer("targetRegular", 10000+me*100);
			setTimer("doResearch", 12000+me*100);
			setTimer("defenceQueue", 30000+me*100);
			setTimer("targetVTOL", 56000+me*100); //Не раньше 30 сек.
			if(nfAlgorithm)setTimer("nastyFeaturesClean", 35000+me*100);
		
		}
	
		if(!release){
			setTimer("stats", 10000); // Отключить в релизе
			setTimer("perfMonitor", 100000);
		}
		setTimer("checkProcess", 60000+me*100);
	}
}

function debugMsg(msg,level){
	if (typeof level == 'undefined') return;
//	if (debugName == "Grey" ) return; //Временно
	if(debugLevels.indexOf(level) == -1) return;
	var timeMsg = Math.floor(gameTime / 1000);
	debug("bc["+timeMsg+"]{"+debugName+"}("+level+"): "+msg);
}

function eventStartLevel() {
	queue("init", 1000);
}
