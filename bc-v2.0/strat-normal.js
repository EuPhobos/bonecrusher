const research_test = ["R-Wpn-MG1Mk1"];

const research_primary = [
"R-Wpn-MG1Mk1",					//Лёгкий пулемёт (старт)
"R-Wpn-MG-Damage02",			//APDSB MG Bullets
"R-Defense-Tower01",			//Оборонная вышка / пулемётная башня (старт)
"R-Wpn-MG2Mk1",					//Спаренный лёгкий пулемёт
"R-Vehicle-Engine01",			//Fuel Injection Engine
"R-Sys-Sensor-Turret01",		//Сенсор
"R-Struc-CommandRelay",
"R-Struc-PowerModuleMk1",		//Модуль на генератор
"R-Struc-Research-Module",		//Модуль для лаборотории
"R-Wpn-MG-Damage03",			//APDSB MG Bullets Mk2
"R-Wpn-MG3Mk1",					//Heavy Machinegun
"R-Struc-Power-Upgrade01",
"R-Struc-Power-Upgrade01b",
"R-Struc-Power-Upgrade01c",
"R-Struc-Power-Upgrade02",
"R-Struc-Power-Upgrade03",
"R-Struc-Power-Upgrade03a",
//"R-Struc-VTOLFactory",			//Авиазавод
//"R-Struc-VTOLPad-Upgrade06",	//Заправка авиации A0VtolPad
];


const research_way_1 = [
"R-Sys-Engineering01",			//Инженерия
"R-Struc-PowerModuleMk1",
"R-Vehicle-Prop-Halftracks",	//Полугусенецы
"R-Sys-MobileRepairTurret01",	//Паяльник
"R-Wpn-Cannon1Mk1",				//Лёгкая пушка
"R-Struc-Factory-Cyborg",		//Завод киборгов
"R-Wpn-Flamer01Mk1",
"R-Wpn-Rocket05-MiniPod",
"R-Defense-WallTower02",
"R-Vehicle-Body05",				//Средняя начальная броня
"R-Vehicle-Body04",				//Лёгкая броня Bug
//	"R-Wpn-MG-Damage03",
"R-Wpn-MG-Damage04",			//APDSB MG Bullets Mk3
//	"R-Sys-Engineering01",			//Инженерия (старт)
//	"R-Sys-Sensor-Turret01",		//Сенсорная башня (для лидера)
"R-Wpn-MG3Mk1",					//Тяжолопулемётная башня
"R-Vehicle-Prop-Hover",			//Ховер для строителей
"R-Sys-MobileRepairTurretHvy",	//Тяжёлый паяльник
"R-Vehicle-Body08",				//Medium Body - Scorpion
"R-Struc-VTOLFactory",			//Авиазавод
"R-Struc-VTOLPad",				//Заправка авиации A0VtolPad
"R-Defense-AASite-QuadMg1",		//Hurricane AA Site
"R-Wpn-Rocket01-LtAT",			//Лансер
"R-Sys-Autorepair-General",		//Автопочинка
"R-Wpn-Bomb03",					//Фосфорные бомбы
"R-Vehicle-Body12",				//Heavy Body - Mantis
"R-Wpn-Rocket05-MiniPod",		//Скорострельная ракетница
"R-Wpn-Cannon1Mk1",				//Пушечная башня
"R-Wpn-Flamer01Mk1",			//Огнемётная башня
"R-Wpn-Mortar01Lt",				//Гранатное орудие
"R-Wpn-Rocket02-MRL",			//Ракетная батарея
"R-Wpn-MG4",					//Штурмовой пулемёт
"R-Vehicle-Body11",				//Тяжёлая начальная броня
"R-Defense-WallTower-QuadRotAA",//Whirlwind Hardpoint
"R-Struc-VTOLPad-Upgrade06",	//Заправка авиации A0VtolPad
"R-Vehicle-Prop-Tracks",		//Гусенецы
"R-Wpn-Flame2",					//Горячий напалм
"R-Vehicle-Body09",				//Броня "Tiger"
"R-Wpn-Mortar3",				//Скорострельная мортира "Pepperpot"
"R-Wpn-Flamer-Damage09",		//Самый последний огнемёт (финал)
//	"Emplacement-RotHow",			//Самая последняя артиллерия (финал)
"R-Sys-Sensor-UpLink",			//Открыть всю карту
];

const research_way_2 = [
//"R-Struc-Factory-Cyborg",		//Казармы
"R-Struc-PowerModuleMk1",		//Модуль на генератор
"R-Sys-MobileRepairTurret01",	//Паяльник
"R-Struc-Research-Upgrade09",
"R-Vehicle-Engine09",
"R-Cyborg-Metals09",			//Кинетическая броня киборгов (финал)
];

const research_way_armor = [
"R-Vehicle-Metals09",			//Superdense Composite Alloys Mk3 (финал) 
"R-Vehicle-Armor-Heat09"		//Vehicle Superdense Thermal Armor Mk3
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

const research_way_power = [
"R-Struc-Power-Upgrade03a",
];

const research_way_defence = [
//"R-Defense-Pillbox01",
"R-Defense-Tower06",
"R-Defense-WallTower01",
"R-Defense-WallTower-HPVcannon",
"R-Defense-Emplacement-HPVcannon",
"R-Defense-MRL",
"R-Defense-MortarPit",
"R-Defense-RotMor",
"R-Defense-IDFRocket",
"R-Defense-MortarPit-Incenediary",
"R-Defense-Pillbox06",
"R-Defense-WallTower-TwinAGun",
"R-Defense-HvyHowitzer",
];

const research_way_mg = [
"R-Wpn-MG-ROF03",				//Hyper Fire Chaingun Upgrade
"R-Wpn-MG5",					//Twin Assault Gun
"R-Wpn-MG-Damage08",			//Depleted Uranium MG Bullets
"R-Defense-WallTower-QuadRotAA",//Whirlwind Hardpoint
"R-Wpn-AAGun-Damage06",
"R-Wpn-AAGun-ROF06",
];

const research_way_cannon = [
"R-Wpn-Cannon4AMk1",			//Hyper Velocity Cannon
"R-Wpn-Cannon-ROF01",			//Cannon auto loader
"R-Wpn-Cannon6TwinAslt",		//Twin Assault Cannon
"R-Wpn-Cannon-ROF06",			//Cannon Rapid Loader Mk3
"R-Wpn-Cannon-Accuracy02",		//Cannon Laser Designator
"R-Wpn-Cannon-Damage09"		//HVAPFSDS Cannon Rounds Mk3
];


const research_way_5 = [
"R-Cyborg-Armor-Heat09",		//Термостойкая броня киборгов (финал)
"R-Defense-MassDriver",
"R-Vehicle-Body14",
];

//Переменная приоритетов путей исследований
var research_way = [
research_primary,
research_way_1,
research_way_mg,
research_way_power,
research_way_2,
research_way_defence,
research_way_armor,
research_way_cannon,
research_rockets,
research_way_5
];


function mainBuilders(rotation){
	var helped=0;
	enumGroup(buildersMain).forEach( function(obj, iter){
		if(builderBusy(obj) == true) {
//			debugMsg("buildersOrder(): Строитель занят "+iter);
			return;
		}
		
		if(resource_extractor_ready.length == 0 && power_gen_ready.length != 0){oilHunt(obj, true);return;}
		
		//Модули на здания
		var safe = getInfoNear(base.x,base.y,'safe',(base_range/2)).value;
		if(safe){
			if(playerPower(me) > 100){
				if(getResearch("R-Struc-Factory-Module").done && iter <=3) { factory.forEach( function(e){ if(e.modules < 1) orderDroidBuild(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);});}
				if(getResearch("R-Struc-Factory-Module").done && iter <=3) { vtol_factory.forEach( function(e){ if(e.modules < 2) orderDroidBuild(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);});}
				if(getResearch("R-Struc-Factory-Module").done && getResearch("R-Vehicle-Metals02").done && iter <=3) { factory.forEach( function(e){ if(e.modules < 2) orderDroidBuild(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);});}
				if(getResearch("R-Struc-Research-Module").done && iter <= 1) { research_lab.forEach( function(e){ if(e.modules < 1) orderDroidBuild(obj, DORDER_BUILD, "A0ResearchModule1", e.x, e.y);});}
			}
			if(getResearch("R-Struc-PowerModuleMk1").done && iter <= 2) { power_gen.forEach( function(e){ if(e.modules < 1) orderDroidBuild(obj, DORDER_BUILD, "A0PowMod1", e.x, e.y);});}
		}
		//Если строители свободны, ищем чего-бы достроить или починить
		if(helped < 1){
			var myBase = enumStruct(me);
			for ( var b in myBase ){
				if(distBetweenTwoPoints(base.x,base.y,myBase[b].x,myBase[b].y) > base_range)continue;
				if(myBase[b].status == BEING_BUILT) {orderDroidObj(obj, DORDER_HELPBUILD, myBase[b]); helped++; return;}
				if(myBase[b].health < 100) {orderDroidObj(obj, DORDER_REPAIR, myBase[b]); helped++; return;}
			}
		}
		
		//Завод, лаборатория,генератор,ком-центр! - вот залог хорошего пионера!
		if(factory_ready.length == 0) { if(builderBuild(obj, "A0LightFactory", rotation)) return; }
		if(research_lab_ready.length < 1) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
		//Ком центр
		if(hq_ready.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)) return; }
		//Генератор энергии
		if(power_gen_ready.length == 0) { if(builderBuild(obj, "A0PowerGenerator", rotation)) return; }
		if(research_lab_ready.length < 2) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
		if(factory_ready.length < 2 && playerPower(me) > 300) { if(builderBuild(obj, "A0LightFactory", rotation)) return; }
		if(research_lab_ready.length < 4 && playerPower(me) > 400) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
		if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 2 && playerPower(me) > 300) { if(builderBuild(obj, "A0CyborgFactory", rotation)) return; }
		if( (power_gen_ready.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation))return;}
		if(research_lab_ready.length < 5 && playerPower(me) > 500) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
		if(factory_ready.length < 5 && playerPower(me) > 1000){ if(builderBuild(obj, "A0LightFactory", rotation)) return; }
		if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 5 && playerPower(me) > 1000) { if(builderBuild(obj, "A0CyborgFactory", rotation)) return; }
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory_ready.length < 1){ if(builderBuild(obj, "A0VTolFactory1", rotation)) return; }
		if(isStructureAvailable("A0VtolPad") && rearm_pad_ready.length < Math.ceil(enumGroup(VTOLAttacker).length/2) && rearm_pad.length <= (maxPads-1)){ if(builderBuild(obj, "A0VtolPad", rotation)) return; }
		
		if(AA_build(obj, true)) return;
									
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory_ready.length < 2 && playerPower(me) > 500){ if(builderBuild(obj, "A0VTolFactory1", rotation)) return; }
		if(isStructureAvailable("A0VtolPad") && playerPower(me) > 2000 && rearm_pad.length < enumGroup(VTOLAttacker).length && rearm_pad.length <= maxPads){ if(builderBuild(obj, "A0VtolPad", rotation)) return; }
		
//		debugMsg("Строителям нечего строить "+iter, 'builders');
		

		
		if(oilHunt(obj, true)) return;
		if(rigDefence(obj)) return;

		//Если свободны, и далеко от базы - отправляем домой
//		if(distBetweenTwoPoints(base.x,base.y,obj.x,obj.y) > 10 && !builderBusy(obj)) { orderDroidLoc(obj,DORDER_MOVE,base.x,base.y); return; }
//		debugMsg("Строители бездельничают "+iter, 'builders');
		if(iter != 0 && distBetweenTwoPoints(base.x,base.y,obj.x,obj.y) <= 2 && groupSize(buildersHunters) < 5 && getInfoNear(base.x,base.y,'safe',base_range).value){
			groupAddDroid(buildersHunters, obj);
			debugMsg('Builder --> Hunter +1', 'group');
		}else if(distBetweenTwoPoints(base.x,base.y,obj.x,obj.y) > 2 && !builderBusy(obj)){
			orderDroidLoc(obj,DORDER_MOVE,base.x,base.y);
			return;
		}
		
		
	});
}