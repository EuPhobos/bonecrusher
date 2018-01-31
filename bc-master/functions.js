
//Функция проверяет объекты и возвращает значение
//Задача стоит в обработке тяжёлых данных, и работа данной функции
//в цикле, функция должна будет отработать один раз, и прокешировать
//результат, что бы быстро отдавать циклам нужную информация, не
//забивая процессор всякой повторяющейся хернёй
//Параметры:
//x,y - координаты
//command - что-то конкретное ищем, задание для функции
//range - передаём, если что-то нужно искать в радиусе (примичание, радиус так же кешируется, следующий запрос по таким же координатам и коммандой дадут результат с прошлого радиуса, пока не пройдёт время updateIn)
//time - сколько секунд хранить информацию
//obj - передаём, если нужно сравнить что-то с объектом(например propulsion is reach для droid)
//cheat - true(читерим, видя через туман войны), null/false/undefined(не читерим, возвращем только то, что можем видеть)
//inc - true(прибавляем value+1 и возвращаем), null/false/undefined(просто возвращаем value)

var _globalInfoNear = [];
function getInfoNear(x,y,command,range,time,obj,cheat,inc){
	/*
	if(command == 'buildRig'){
		debugMsg('DEBUG: '+x+','+y+','+command+','+time+','+inc, 'temp');
		if(typeof _globalInfoNear[x+'_'+y+'_'+command] !== 'undefined'){ 
			debugMsg((gameTime-_globalInfoNear[x+'_'+y+'_'+command].setTime)+' left', 'temp');
		}
	}*/
	
	if ( typeof _globalInfoNear[x+'_'+y+'_'+command] !== 'undefined'
	&& gameTime < (_globalInfoNear[x+'_'+y+'_'+command].setTime + _globalInfoNear[x+'_'+y+'_'+command].updateIn) ) {
		if(inc){
			_globalInfoNear[x+'_'+y+'_'+command].value++;
		}
		return _globalInfoNear[x+'_'+y+'_'+command];
	}else{
		if(typeof time === 'undefined') time = 30000;
		if(typeof range === 'undefined') range = 7;
		if(typeof cheat === 'undefined') var view = me;
		else if(cheat == true) var view = -1;
//		_globalInfoNear[x+'_'+y+'_'+command] = new Array();
		_globalInfoNear[x+'_'+y+'_'+command] = { setTime: gameTime, updateIn: time };
		
		if(command == 'safe'){
			var danger = new Array();
			for ( var e = 0; e < maxPlayers; ++e ) {
				if ( allianceExistsBetween(me,e) ) continue;
				danger = danger.concat(enumDroid(e, DROID_WEAPON, view));
				danger = danger.concat(enumDroid(e, DROID_CYBORG, view));
				danger = danger.concat(enumStruct(e, DEFENSE, view));
			}
			if ( scavengerPlayer != -1 ) {
				danger = danger.concat(enumDroid(scavengerPlayer, DROID_WEAPON, view));
				danger = danger.concat(enumDroid(scavengerPlayer, DROID_CYBORG, view));
				danger = danger.concat(enumStruct(scavengerPlayer, DEFENSE, view));
			}
			
			for ( var d in danger ) {
				if ( distBetweenTwoPoints_p(x,y,danger[d].x,danger[d].y) < range ) { 
					_globalInfoNear[x+'_'+y+'_'+command].value = false;
					return _globalInfoNear[x+'_'+y+'_'+command]; 
				}
			}
			_globalInfoNear[x+'_'+y+'_'+command].value = true;
			return _globalInfoNear[x+'_'+y+'_'+command];
		}else if(command == 'defended'){
			var defenses = new Array();
			defenses = enumStruct(me, DEFENSE).filter(function(e){if(e.status == BUILT) return true; return false;});
			for ( var d in defenses ) {
				if ( distBetweenTwoPoints_p(x,y,defenses[d].x,defenses[d].y) < range ) { 
					_globalInfoNear[x+'_'+y+'_'+command].value = true;
					return _globalInfoNear[x+'_'+y+'_'+command];
				}
			}
			_globalInfoNear[x+'_'+y+'_'+command].value = false;
			return _globalInfoNear[x+'_'+y+'_'+command];
			
		}else if(command == 'buildDef'){
			var _builders;
			_builder = enumGroup(buildersHunters);
			if(_builder.length == 0) _builder = enumDroid(me,DROID_CONSTRUCT);
			if(_builder.length == 0){ //Невозможно в данный момент проверить, запоминаем на 10 секунд
				_globalInfoNear[x+'_'+y+'_'+command].updateIn = 10000;
				_globalInfoNear[x+'_'+y+'_'+command].value = false;
				return _globalInfoNear[x+'_'+y+'_'+command];
			}
			var toBuild = defence[Math.floor(Math.random()*defence.length)];
			var pos = pickStructLocation(_builder[0],toBuild,x,y);
			if(!!pos && distBetweenTwoPoints_p(x,y,pos.x,pos.y) < range){
				_globalInfoNear[x+'_'+y+'_'+command].value = true;
			}else{
				_globalInfoNear[x+'_'+y+'_'+command].value = false;
			}
			return _globalInfoNear[x+'_'+y+'_'+command];
		}else if(command == 'buildRig'){
			if(typeof _globalInfoNear[x+'_'+y+'_'+command].value === 'undefined'){_globalInfoNear[x+'_'+y+'_'+command].value = 0;debugMsg('getInfoNear set 0','temp');}
			return _globalInfoNear[x+'_'+y+'_'+command];
		}
	}
}

function _getInfoNear(x,y,command,range,time,obj,cheat,inc){
	
	if(command == 'buildRig'){
		debugMsg('DEBUG: '+x+','+y+','+command+','+time+','+inc, 'temp');
		if(typeof _globalInfoNear[x] !== 'undefined'){ debugMsg('x', 'temp');
			if(typeof _globalInfoNear[x][y] !== 'undefined'){debugMsg('y', 'temp');
				if(typeof _globalInfoNear[x][y][command] !== 'undefined'){
					debugMsg('command', 'temp');
				}
			}
		}
	}

	if ( typeof _globalInfoNear[x] !== 'undefined'
		&& typeof _globalInfoNear[x][y] !== 'undefined' // <--
		&& typeof _globalInfoNear[x][y][command] !== 'undefined'
		&& gameTime < (_globalInfoNear[x][y][command].setTime + _globalInfoNear[x][y][command].updateIn) ) {
//		debugMsg("x="+x+"; y="+y+"; command="+command+"; fast return value="+_globalInfoNear[x][y][command].value+"; timeout="+(_globalInfoNear[x][y][command].setTime+_globalInfoNear[x][y][command].updateIn-gameTime), "getInfoNear");
		if(inc){
//			if(typeof _globalInfoNear[x][y][command].value === 'undefined'){
//				_globalInfoNear[x][y][command].value = 0;
//			}
			_globalInfoNear[x][y][command].value++;
			debugMsg('getInfoNear inc '+_globalInfoNear[x][y][command].value, 'temp');
			
		}
		debugMsg('getInfoNear fast '+command,'temp');
		return _globalInfoNear[x][y][command];
	}else{
		if(typeof time === 'undefined') time = 30000;
		if(typeof range === 'undefined') range = 7;
		if(typeof cheat === 'undefined') var view = me;
		else if(cheat == true) var view = -1;
		_globalInfoNear[x] = new Array();
		_globalInfoNear[x][y] = new Array();
		_globalInfoNear[x][y][command] = new Array();
		_globalInfoNear[x][y][command] = { setTime: gameTime, updateIn: time };

		if(command == 'safe'){
			var danger = new Array();
			for ( var e = 0; e < maxPlayers; ++e ) {
				if ( allianceExistsBetween(me,e) ) continue;
				danger = danger.concat(enumDroid(e, DROID_WEAPON, view));
				danger = danger.concat(enumDroid(e, DROID_CYBORG, view));
				danger = danger.concat(enumStruct(e, DEFENSE, view));
			}
			if ( scavengerPlayer != -1 ) {
				danger = danger.concat(enumDroid(scavengerPlayer, DROID_WEAPON, view));
				danger = danger.concat(enumDroid(scavengerPlayer, DROID_CYBORG, view));
				danger = danger.concat(enumStruct(scavengerPlayer, DEFENSE, view));
			}
			
			for ( var d in danger ) {
				if ( distBetweenTwoPoints_p(x,y,danger[d].x,danger[d].y) < range ) { 
					_globalInfoNear[x][y][command].value = false;
//					debugMsg("x="+x+"; y="+y+"; command="+command+"; setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value, "getInfoNear");
					return _globalInfoNear[x][y][command]; 
				}
			}
			_globalInfoNear[x][y][command].value = true;
//			debugMsg("x="+x+"; y="+y+"; command="+command+"; setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value, "getInfoNear");
			return _globalInfoNear[x][y][command];
		}else if(command == 'defended'){
			var defenses = new Array();
			defenses = enumStruct(me, DEFENSE).filter(function(e){if(e.status == BUILT) return true; return false;});
			for ( var d in defenses ) {
				if ( distBetweenTwoPoints_p(x,y,defenses[d].x,defenses[d].y) < range ) { 
					_globalInfoNear[x][y][command].value = true;
//					debugMsg("x="+x+"; y="+y+"; command="+command+"; setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value, "getInfoNear");
					return _globalInfoNear[x][y][command];
				}
			}
			_globalInfoNear[x][y][command].value = false;
//			debugMsg("x="+x+"; y="+y+"; command="+command+"; setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value, "getInfoNear");
			return _globalInfoNear[x][y][command];
			
		}else if(command == 'buildDef'){
			var _builders;
			_builder = enumGroup(buildersHunters);
			if(_builder.length == 0) _builder = enumDroid(me,DROID_CONSTRUCT);
			if(_builder.length == 0){ //Невозможно в данный момент проверить, запоминаем на 10 секунд
				_globalInfoNear[x][y][command].updateIn = 10000;
				_globalInfoNear[x][y][command].value = false;
//				debugMsg("x="+x+"; y="+y+"; command="+command+"; setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value, "getInfoNear");
				return _globalInfoNear[x][y][command];
			}
			var toBuild = defence[Math.floor(Math.random()*defence.length)];
			var pos = pickStructLocation(_builder[0],toBuild,x,y);
			if(!!pos && distBetweenTwoPoints_p(x,y,pos.x,pos.y) < range){
				_globalInfoNear[x][y][command].value = true;
			}else{
				_globalInfoNear[x][y][command].value = false;
			}
//			debugMsg("x="+x+"; y="+y+"; command="+command+"; setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value, "getInfoNear");
			return _globalInfoNear[x][y][command];
		}else if(command == 'buildRig'){
			if(typeof _globalInfoNear[x][y][command].value === 'undefined'){_globalInfoNear[x][y][command].value = 0;debugMsg('getInfoNear set 0','temp');}
			debugMsg('setTime '+_globalInfoNear[x][y][command].setTime, 'temp');
			debugMsg('updateIn '+_globalInfoNear[x][y][command].updateIn, 'temp');
			return _globalInfoNear[x][y][command];
		}
	}
}

//функция отфильтровывает недостежимые объекты
function filterInaccessible(obj){
	return obj.filter(function(e){
		//Если попыток постройки больше 3, отфильтровываем их
		if(getInfoNear(e.x,e.y,'buildRig',0,300000,false,false,false).value > 3)return false;return true;
	});
}

//Проверяем есть ли союзники, не спектаторы ли они
//Выбираем одного для поддержки 3.2+
function checkAlly(){
//	return;
	playerData.forEach( function(data, player) {
		debugMsg("#"+player+" name="+data.name+", human="+data.isHuman+", ai="+data.isAI
		+", ally="+allianceExistsBetween(me, player)+", dist="+distBetweenTwoPoints_p(base.x,base.y,startPositions[player].x,startPositions[player].y), "ally");
		
	});
//	playerSpectator();
}

function checkDonate(obj){
	if(version != '3.2') return false;
	if(!getInfoNear(base.x,base.y,'safe',base_range).value) return false;
//	if()
	debugMsg(obj.name+" to "+armyToPlayer, 'donate');
	if(obj.droidType == DROID_WEAPON && armyToPlayer !== false){
		debugMsg(obj.name+" -> "+armyToPlayer, 'donate');
		donateObject(obj, armyToPlayer);
		return true;
	}
	return false;
}

function groupArmy(droid, type){
	
	if ( typeof type === "undefined" ) type = false;
	
	if(type == 'jammer'){
		debugMsg("armyJammers +1", 'group');
		groupAddDroid(armyJammers, droid);
		return;
	}
	
	if(droid.droidType == DROID_REPAIR){
		debugMsg("armyFixers +1", 'group');
		groupAddDroid(armyFixers, droid);
		return;
	}
	
	//Забираем киборгов под общее коммандование
	if(version == '3.2' && droid.droidType == DROID_CYBORG && policy['build'] == 'rich' && (difficulty == HARD || difficulty == INSANE)){
		debugMsg("armyRegular +1", 'group');
		groupAddDroid(armyRegular, droid);
		return;
	}
	
	//Если армия партизан меньше 7 -ИЛИ- нет среднего Body -ИЛИ- основная армия достигла лимитов
//	if(groupSize(armyPartisans) < 7 || !getResearch("R-Vehicle-Body05").done || groupSize(armyRegular) >= maxRegular ){
	if(groupSize(armyPartisans) <= minPartisans || groupSize(armyRegular) >= maxRegular){
		debugMsg("armyPartisans +1", 'group');
		groupAddDroid(armyPartisans, droid);
	}else{
		
		if(droid.droidType == DROID_CYBORG || groupSize(armyCyborgs) == 0){
			debugMsg("armyCyborgs +1", 'group');
			groupAddDroid(armyCyborgs, droid);
			return;
		}
		
		debugMsg("armyRegular +1", 'group');
		groupAddDroid(armyRegular, droid);
	}
	
	//Перегрупировка
	if(groupSize(armyPartisans) < minPartisans && groupSize(armyRegular) > 1 && !(version == '3.2' && policy['build'] == 'rich' && (difficulty == HARD || difficulty == INSANE))){
		var regroup = enumGroup(armyRegular);
		regroup.forEach(function(e){
			debugMsg("armyRegular --> armyPartisans +1", 'group');
			groupAddDroid(armyPartisans, e);
		});
	}
	
}


function stats(){
	if(!running)return;
//	if(release) return;
	debugMsg("---===---", 'stats');
	debugMsg("Power: "+playerPower(me)+"; rigs="+enumStruct(me,RESOURCE_EXTRACTOR).length+"; free="+enumFeature(me, "OilResource").length+"; enemy="+getEnemyResources().length+"; unknown="+getUnknownResources().length, 'stats');
	debugMsg("Army: "+(groupSize(armyPartisans)+groupSize(armyRegular)+groupSize(armyCyborgs)+groupSize(VTOLAttacker))+"; Partisans="+groupSize(armyPartisans)+"; Regular="+groupSize(armyRegular)+"; Borgs="+groupSize(armyCyborgs)+"; VTOL="+groupSize(VTOLAttacker), 'stats');
	debugMsg("Units: Builders="+groupSize(buildersMain)+"; Hunters="+groupSize(buildersHunters)+"; Repair="+groupSize(armyFixers)+"; Jammers="+groupSize(armyJammers)+"; targets="+builder_targets.length, 'stats');
	debugMsg("Research: avail="+avail_research.length+"; Ways="+research_way.length, 'stats');
	debugMsg("Weapons: "+guns.length+"; known="+avail_guns.length+"; cyborgs="+avail_cyborgs.length+"; vtol="+avail_vtols.length, 'stats');
	debugMsg("Base: safe="+getInfoNear(base.x,base.y,'safe',base_range).value+"; defense="+enumStruct(me, DEFENSE).length+"; labs="+enumStruct(me, RESEARCH_LAB).length+"; factory="+enumStruct(me, FACTORY).length+"; cyb_factory="+enumStruct(me, CYBORG_FACTORY).length+"; vtol="+enumStruct(me, VTOL_FACTORY).length, 'stats');
	debugMsg("Bodies: light="+light_bodies.length+"; medium="+medium_bodies.length+"; heavy="+heavy_bodies.length, 'stats');
	debugMsg("Misc: nasty features="+nastyFeatures.length+"/"+nastyFeaturesLen+"; barrels="+enumFeature(ALL_PLAYERS, "").filter(function(e){if(e.player == 99)return true;return false;}).length
		+"; known defence="+defence.length+"; known AA="+AA_defence.length+"; AA_queue="+AA_queue.length, 'stats');
	debugMsg("Produce: "+produceTrigger.length, 'stats');

	debugMsg("_globalInfoNear level1 = "+Object.keys(_globalInfoNear).length, 'stats');
	
// 	var level1=_globalInfoNear.length;
// 	var level2=0;
// 	var level3=0;
// 	var level4=0;
// 	for (var x in _globalInfoNear){
// 	debugMsg("x = "+Object.keys(_globalInfoNear), 'stats');
// 		level2+=_globalInfoNear[x].length;
// 		debugMsg("y = "+Object.keys(_globalInfoNear[x]), 'stats');
// 		for (var y in _globalInfoNear[x]){
// 			level3+=1;
// 			debugMsg("z = "+Object.keys(_globalInfoNear[x][y]), 'stats');
// 			for (var z in _globalInfoNear[x][y]){
// 				level4+=3;
// 				debugMsg("keys = "+Object.keys(_globalInfoNear[x][y][z]), 'stats');
// 				
// 			}
// 		}
// 	}
// 	debugMsg("_globalInfoNear level1 = "+level1, 'stats');
// 	debugMsg("_globalInfoNear level2 = "+level2, 'stats');
// 	debugMsg("_globalInfoNear level3 = "+level3, 'stats');
// 	debugMsg("_globalInfoNear level4 = "+level4, 'stats');
	
//	enumFeature(ALL_PLAYERS, "").filter(function(e){if(e.armour == 5 && e.thermal == 5 && !e.damageable && e.health == 100 && e.player==12)return true;return false;})
//	.forEach(function(e){
//		debugMsg(e.name+' '+e.x+'x'+e.y+'; type='+e.type+'; id='+e.id+'; player='+e.player+'; selected='+e.selected+'; health='+e.health+'; armour='+e.armour+'; thermal='+e.thermal+'; damageable='+e.damageable, 'stats');
//	});
}


function nastyFeaturesClean(){
	if(!running)return;
	if(nfAlgorithm == false){
		removeTimer("nastyFeaturesClean");
		debugMsg("nastyFeaturesClean stop", "end");
		return;
	}
	if(nastyFeatures.length != 0) return;
	var _cyborgs = enumGroup(armyCyborgs);
	if(_cyborgs.length == 0) return;
	
	nastyFeatures=[];
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
	if(nastyFeatures.length != 0){
		nastyFeatures = removeDuplicates(nastyFeatures, 'id').filter(function(e){if(droidCanReach(_cyborgs[0], e.x, e.y))return true;return false;});
		nastyFeaturesLen = nastyFeatures.length;
	}else{
		// теперь чисто, выход от сюда навсегда
		nfAlgorithm = false;
	}
}



//Функция определяет подвергается ли ремонту наша цель
//Если да, возвращяем объект, кто ремонтирует нашу цель
function isBeingRepaired(who){
	if ( typeof who === "undefined" ) {
//		debugMsg("Атакующий неизвестен",5);
		return false;
	}

	if ( allianceExistsBetween(me, who.player) ) {
//		debugMsg("Атакующий мой союзник, прощаю",5);
		return false;
	}

	switch ( who.type ) {
		case DROID: {
//			debugMsg("Нас атаковал вражеский дроид ["+who.player+"]",5);
//TODO
//			Тут нужно доработать
			return false;
			break; 
		}
		case STRUCTURE: {
//			debugMsg("Нас атакует вражесая башня ["+who.player+"]",5);
			droids = enumDroid(who.player,DROID_CONSTRUCT,me);
			if ( droids.length != 0 ) {
				for ( var i in droids ) {
					if ( distBetweenTwoPoints_p(who.x,who.y,droids[i].x,droids[i].y) <= 3 ) {
//						debugMsg("Атакующая меня башня подвергается ремонту!",5);
						return droids[i];
					}
				}
			}	
			return false;
			break;
		}
		default: {
//			debugMsg("Нууу, не знаю, нас атакует Ктулху! ["+who.player+"]",5);
			return false;
			break;
		}
	}
	return false;
}

//Какой-то бардак в функциях движка
//enumResearch() - возвращает список ТОЛЬКО тех, которые можем стартануть
//getResearch() - возвращет объект любой запрошенной технологии
//объект содержит .done и .started которые отвечают за завершённую или запущенную технологию
//почему бы не сделать что бы enumResearch() возвращал объект ВСЕХ технологий
//в котором бы содержалась значения .done .started и конежно же .available
//вместо того что сделано сейчас, можно было бы легко использовать filter()
//В голову не идёт как это исправить своими силами, забил пока..
function _doResearch(){
	debugMsg("doResearch()", 'research');
	avail_research = enumResearch().filter(function(e){if(e.started)return false;return true;});
	var labs = enumStruct(me,RESEARCH_LAB).filter(function(e){if(e.status == BUILT && structureIdle(e))return true;return false;});;
	var way = false;
	
	if(labs.length == 0 ){
		debugMsg("Нет свободных лабораторий", 'research');
		return;
	}
	
	if ( avail_research.length == 0 ){
		debugMsg("Nothing research, "+labs.length+" labs idle..", 'research');
		return;
	}
	
	if ( research_way.length != 0 ) {
		way = research_way[0].filter(function(e){if(e.done||e.started)return false;return true;});
		if (way.length == 0){
			research_way.shift();
			debugMsg("Another way is complete, restart", 'research');
			queue("doResearch", 1000);
			return;
		}
	}
	
	if ( research_way.length == 0 ) {
		debugMsg("Empty research ways, going random..", 'research');
		//TODO random research here..
	}
	
	
}

//Функция предерживается приоритетов исследований
//и ровномерно распределяет по свободным лабораториям
//и должна вызыватся в 3-х случаях (не в цикле)
//1. При старте игры
//2. При постройке лабаротории
//3. При завершении исследования
function doResearch(){
	if(!running)return;
	debugMsg("doResearch()", 'research_advance');
	//	debugMsg(getInfoNear(base.x,base.y,'safe',base_range).value+" && "+playerPower(me)+"<300 && "+avail_guns.length+"!=0", 'research_advance');
	if(!getInfoNear(base.x,base.y,'safe',base_range).value && playerPower(me) < 300 && avail_guns.length != 0) return;

	
	avail_research = enumResearch().filter(function(e){
		//		debugMsg(e.name+' - '+e.started+' - '+e.done, 'research_advance');
		if(e.started)return false;return true;
	});
	
	if ( research_way.length < 5 ){
		var _research = avail_research[Math.floor(Math.random()*avail_research.length)].name;
//		debugMsg(_research, 'temp');
		research_way.push([_research]);
		debugMsg("doResearch: Исследовательские пути ("+research_way.length+") подходят к концу! Добавляем рандом. \""+research_name[_research]+"\" ["+_research+"]", 'research_advance');
	}
	
	if ( research_way.length == 0 ) {
		debugMsg("doResearch: Исследовательские пути завершены!!! Останов.", 'research_advance');
		return;
	}

	var labs = enumStruct(me,RESEARCH_LAB);
	if ( typeof _r === "undefined" ) _r = 0;
	var _busy = 0;

	var _last_r = research_way[_r][research_way[_r].length-1];
	var _way = getResearch(_last_r);

	if ( _way.done == true ) {
		//		debugMsg("doResearch: Путей "+research_way.length+", путь "+_r+" завершён", 'research_advance');
		research_way.splice(_r,1);
		//		debugMsg("doResearch: Осталось путей "+research_way.length, 'research_advance');
		_r=0;
		if ( research_way.length == 0 ) {
			debugMsg("doResearch: Исследовательские пути завершены! Останов.", 'research_advance');
			return;
		}
	}

	//Если меньше 8 нефтевышек, и меньше 1000 денег, и уже запущенны 3 лабы - выход
// 	if(countStruct('A0ResourceExtractor', me) < 8 && playerPower(me) < 1000 && enumStruct(me, RESEARCH_LAB).filter(function(e){if(!structureIdle(e)&&e.status==BUILT)return true;return false;}).length >= 3) return;
// 	if(countStruct('A0ResourceExtractor', me) < 5 && playerPower(me) < 500 && enumStruct(me, RESEARCH_LAB).filter(function(e){if(!structureIdle(e)&&e.status==BUILT)return true;return false;}).length >= 2) return;
// 	if(countStruct('A0ResourceExtractor', me) <= 3 && playerPower(me) < 300 && enumStruct(me, RESEARCH_LAB).filter(function(e){if(!structureIdle(e)&&e.status==BUILT)return true;return false;}).length >= 1) return;
	
	for ( var l in labs ){
		
		if(policy['build'] != 'rich'){
			if(countStruct('A0ResourceExtractor', me) < 8 && playerPower(me) < 1000 && _busy >= 3) break;
			if(countStruct('A0ResourceExtractor', me) < 5 && playerPower(me) < 500 && _busy >= 2) break;
			if(countStruct('A0ResourceExtractor', me) < 3 && playerPower(me) < 300 && _busy >= 1) break;
		}
		if( (labs[l].status == BUILT) && structureIdle(labs[l]) ){
			debugMsg("Лаборатория("+labs[l].id+")["+l+"] исследует путь "+_r, 'research_advance');
			pursueResearch(labs[l], research_way[_r]);
		}else{
			debugMsg("Лаборатория("+labs[l].id+")["+l+"] занята", 'research_advance');
			_busy++;
		}
	}

	if ( _r == research_way.length-1 ) {
		_r = 0;
		debugMsg("doResearch: Все исследования запущены, останов.", 'research_advance');
	} else if (_busy == labs.length ) {
		debugMsg("doResearch: Все все лаборатории заняты, останов.", 'research_advance');
		_r = 0;
	} else {
		_r++;
		debugMsg("doResearch: Планировка проверки занятости лабораторий...", 'research_advance');
		queue("doResearch", 1000);
	}
}



//Функция сортирует массив по дистанции от заданного массива
//передаются параметры:
//arr - сортируемый массив
//obj - игровой объект в отношении чего сортируем массив
//num - кол-во возвращённых ближайших объектов
//reach - если задано, и если obj не может добраться на своём propulsion до arr[n], то из массива arr будут изъяты эти результаты
//если num не передан, возвращает полный сортированный массив
//если num равен 1, то всё равно возвращается массив но с единственным объектом
function sortByDistance(arr, obj, num, reach){
	if ( typeof reach === "underfined" ) reach = false;
	if ( typeof num === "undefined" || num == null || num == false) num = 0;
	else if ( arr.length == 1 ) num = 1;

	if ( num == 1 ) {
		var a = Infinity;
		var b = Infinity;
		var c = new Array();
		for ( var i in arr ) {
			if(reach)if(!droidCanReach(obj, arr[i].x, arr[i].y))continue;
			a = distBetweenTwoPoints_p( obj.x, obj.y, arr[i].x, arr[i].y );
			if ( a < b ) {
				b = a;
				c[0] = arr[i];
			}
		}
		return c;
	}

	if ( num != 1 ) {
		arr.sort( function(a,b){
			if( distBetweenTwoPoints_p( obj.x, obj.y, a.x, a.y ) < distBetweenTwoPoints_p( obj.x, obj.y, b.x, b.y ) ) return -1;
			if( distBetweenTwoPoints_p( obj.x, obj.y, a.x, a.y ) > distBetweenTwoPoints_p( obj.x, obj.y, b.x, b.y ) ) return 1;
			return 0;
		});
	}

	if(reach){arr = arr.filter( function(e){
		if(!droidCanReach(obj,e.x,e.y)) return false;
		return true;
	});}
	
	if ( num == 0 ) return arr;

	if ( num >= arr.length ) num = (arr.length-1);
	
	return arr.slice(0,num);

}

//Сортировка объектов по проценту жизней
function sortByHealth(arr){
	if ( arr.length > 1 ) arr.sort( function (a,b) {
		if(a.health < b.health) return -1;
		if(a.health > b.health) return 1;
		return 0;
	});
	return arr;
}

function checkProcess(){
	if(!running)return;
	if(playerLoose(me)){
		debugMsg("I guess, i'm loose.. Give up", 'end');
		if(version == "3.2" && running){
			playerData.forEach( function(data, player) {
				chat(player, 'from '+debugName+': '+chatting('loose'));
			});
		}
		running = false;
	
		/* Пока есть баг: http://developer.wz2100.net/ticket/4663
		if(difficulty == EASY){
			removeTimer("produceDroids");
			removeTimer("produceVTOL");
			removeTimer("checkEventIdle");
			removeTimer("doResearch");
			removeTimer("defenceQueue");
			removeTimer("produceCyborgs");
			removeTimer("buildersOrder");
			removeTimer("targetVTOL");
		} else if(difficulty == MEDIUM){
			removeTimer("produceDroids");
			removeTimer("produceVTOL");
			removeTimer("produceCyborgs");
			removeTimer("buildersOrder");
			removeTimer("checkEventIdle");
			removeTimer("doResearch");
			removeTimer("defenceQueue");
			removeTimer("targetVTOL");
			if(nfAlgorithm)removeTimer("nastyFeaturesClean");
		} else if(difficulty == HARD){
			removeTimer("targetPartisan");
			removeTimer("buildersOrder");
			removeTimer("targetJammers");
			removeTimer("targetCyborgs");
			removeTimer("produceDroids");
			removeTimer("produceVTOL");
			removeTimer("targetFixers");
			removeTimer("produceCyborgs");
			removeTimer("doResearch");
			removeTimer("defenceQueue");
			removeTimer("targetRegular");
			removeTimer("targetVTOL");
			if(nfAlgorithm)removeTimer("nastyFeaturesClean");

		} else if(difficulty == INSANE){
			removeTimer("targetPartisan");
			removeTimer("buildersOrder");
			removeTimer("targetJammers");
			removeTimer("targetCyborgs");
			removeTimer("produceDroids");
			removeTimer("produceVTOL");
			removeTimer("targetFixers");
			removeTimer("produceCyborgs");
			removeTimer("doResearch");
			removeTimer("defenceQueue");
			removeTimer("targetRegular");
			removeTimer("targetVTOL");
			if(nfAlgorithm)removeTimer("nastyFeaturesClean");
		}
			

		if(!release)removeTimer("stats");
		removeTimer("perfMonitor");
		removeTimer("checkProcess");
		*/
		
	}
}

function playerLoose(player){
	var loose = false;
	if(enumStruct(player,"A0LightFactory").length == 0
		&& enumDroid(player, DROID_CONSTRUCT).length == 0
		&& enumStruct(player,"A0CyborgFactory").length == 0
		&& enumDroid(player, 10).length == 0) loose = true;
	return loose;
}

function playerSpectator(player){
	var loose = false;
	if(enumStruct(player,"A0LightFactory").length == 0
		&& enumStruct(player,"A0CyborgFactory").length == 0
		&& enumDroid(player, 10).length == 0) loose = true;
	return loose;
}

//функция отфильтровывает объекты, которые находяться близко
//к "живым" союзникам, полезно для отказа от захвата ресурсов союзника
function filterNearAlly(obj){
	for ( var p = 0; p < maxPlayers; ++p ){
		if ( p == me ) continue; //Выкидываем себя
		if ( !allianceExistsBetween(me,p) ) continue; //Выкидываем вражеские
//		if ( playerLoose(p) ) continue; //Пропускаем проигравших
		if ( playerSpectator(p) ) continue;
		if ( distBetweenTwoPoints_p(base.x,base.y,startPositions[p].x,startPositions[p].y) < base_range ) continue; //Если союзник внутри радиуса нашей базы, вышки забираем
		obj = obj.filter(function(e){if(distBetweenTwoPoints_p(e.x,e.y,startPositions[p].x,startPositions[p].y) < (base_range/2) )return false; return true;})
	}
	return obj;
}


//TODO need to fix logic, sometimes it's buggy
//it's triggered in middle of battlefield,
//and send help to random location.. don't known why..
function getEnemyNearAlly(){
//	return []; // <-- disable this funtion
	var targ = [];
	var enemy = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_WEAPON, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumDroid(scavengerPlayer, DROID_WEAPON, me));
	}
	
	for ( var p = 0; p < maxPlayers; ++p ) {
		if ( p == me ) continue;
		if ( !allianceExistsBetween(me,p) ) continue;
//		if ( playerLoose(p) ) continue; //Пропускаем проигравших
		if ( playerSpectator(p) ) continue;
		enemy = enemy.concat(targ.filter(function(e){if(distBetweenTwoPoints_p(e.x,e.y,startPositions[p].x,startPositions[p].y) < (base_range/2) ){
//			debugMsg("TRUE name="+e.name+"; id="+e.id+"; dist="+distBetweenTwoPoints_p(e.x,e.y,startPositions[p].x,startPositions[p].y)+"<"+(base_range/2)+"; player="+p,'temp');
			return true;
		}
//		debugMsg("FALSE name="+e.name+"; id="+e.id+"; dist="+distBetweenTwoPoints_p(e.x,e.y,startPositions[p].x,startPositions[p].y)+"<"+(base_range/2)+"; player="+p, 'temp');
		return false;}));
	}
	
	return enemy;
}

//Функция возвращяет вышки, о которых в данный момент не известно ничего
//Просто сравниваем два массива объектов и фильтруем в третий
function getUnknownResources(){
	notSee = new Array();
	iSee = getSeeResources();
	if ( iSee.length == 0 ) return allResources;
	notSee = allResources.filter(function (value) {
		for ( var i in iSee ) {
			if ( value.x == iSee[i].x && value.y == iSee[i].y ) return false;
		}
		return true;
	});
	return notSee;
}


//Функция возвращает все видимые ресурсы, свободные, свои и занятые кем либо
function getSeeResources(){
	iSee = new Array();
	iSee = iSee.concat(enumFeature(me, "OilResource"));
	for ( var e = 0; e < maxPlayers; ++e ){
//		if ( !allianceExistsBetween(me,e) ) continue; //Выкидываем вражеские
		iSee = iSee.concat(enumStruct(e, RESOURCE_EXTRACTOR, me));
	}

	return iSee;
	
}

function getProblemBuildings(){
	var targ=[];
	for ( var p = 0; p < maxPlayers; ++p ){
		if ( !allianceExistsBetween(me,p) ) continue; //Выкидываем вражеские
		if ( playerSpectator(p) ) continue; //Пропускаем неиграющих
		targ = targ.concat(enumStruct(p).filter(function(e){if(e.status == BEING_BUILT || e.health < 99)return true;return false;}));
	}
	return targ;
}

function getEnemyFactories(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumStruct(e, FACTORY, me));
		targ = targ.concat(enumStruct(e, CYBORG_FACTORY, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, FACTORY, me));
		targ = targ.concat(enumStruct(scavengerPlayer, CYBORG_FACTORY, me));
	}
	return targ;
}

function getEnemyFactoriesVTOL(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumStruct(e, VTOL_FACTORY, me));
	}
	return targ;
}

function getEnemyPads(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumStruct(e, REARM_PAD, me));
	}
	return targ;
}


function getEnemyNearBase(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_ANY, me));
		targ = targ.concat(enumStruct(e, DEFENSE, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, DROID_ANY, me));
		targ = targ.concat(enumStruct(scavengerPlayer, DEFENSE, me));
	}
	return targ.filter(function(e){if(distBetweenTwoPoints_p(e.x,e.y,base.x,base.y) < base_range && !isFixVTOL(e))return true; return false;});
}
function getEnemyCloseBase(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_ANY, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, DROID_ANY, me));
	}
	return targ.filter(function(e){if(distBetweenTwoPoints_p(e.x,e.y,base.x,base.y) < (base_range/2) && !isFixVTOL(e))return true; return false;});
}

function getEnemyBuilders(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_CONSTRUCT, me));
//		targ = targ.concat(enumDroid(e, 10, me)); // Киборг-строитель
	}
//	return targ.filter(function(e){if(distBetweenTwoPoints_p(e.x,e.y,base.x,base.y) < base_range)return true; return false;});
	return targ;
}

function getEnemyWarriors(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_WEAPON, me));
		targ = targ.concat(enumDroid(e, DROID_CYBORG, me));
	}
	return targ;
}

function getEnemyDefences(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumStruct(e, DEFENSE, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, DEFENSE, me));
		targ = targ.concat(enumStruct(scavengerPlayer, WALL, me));
	}
	return targ;
}

function getEnemyWalls(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumStruct(e, WALL, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, WALL, me));
	}
	return targ;
}

//Функция возвращает все видимые вражеские ресурсы
function getEnemyResources(){
	var enemyRigs = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		var tmp = enumStruct(e, RESOURCE_EXTRACTOR, me);
		enemyRigs = enemyRigs.concat(tmp);
	}
	if(scavengers == true) enemyRigs = enemyRigs.concat(enumStruct(scavengerPlayer, RESOURCE_EXTRACTOR, me));
/*
	playerData.forEach( function(player) {
		if ( !allianceExistsBetween(me, player) ) { // enemy player
			enemyRigs = enemyStructs.concat(enumStruct(player, RESOURCE_EXTRACTOR, me));
		}
	} );
*/
	return enemyRigs;
}

//Возвращает строителей, инженеров, заводы и киборг-заводы
function getEnemyProduction(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumStruct(e, RESOURCE_EXTRACTOR, me));
		targ = targ.concat(enumDroid(e, DROID_CONSTRUCT, me));
		targ = targ.concat(enumDroid(e, 10, me)); // Киборг-строитель
		targ = targ.concat(enumStruct(e, FACTORY, me));
		targ = targ.concat(enumStruct(e, CYBORG_FACTORY, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, RESOURCE_EXTRACTOR, me));
		targ = targ.concat(enumDroid(scavengerPlayer, DROID_CONSTRUCT, me));
		targ = targ.concat(enumDroid(scavengerPlayer, 10, me)); // Киборг-строитель
		targ = targ.concat(enumStruct(scavengerPlayer, FACTORY, me));
		targ = targ.concat(enumStruct(scavengerPlayer, CYBORG_FACTORY, me));
	}
	return targ;
}

function fixResearchWay(way){
	if ( typeof way === "undefined" ) return false;
	if(!(way instanceof Array)) return false;
//	debugMsg('Check tech '+way.length, 'research');
	var _out = [];
	
	for(i in way){
//		debugMsg('Check: '+way[i], 'research');
		var _res = getResearch(way[i]);
		if(_res == null){
			debugMsg('Unknown research "'+way[i]+'" - ignored', 'error');
			continue;
		}
		_out.push(way[i]);
	}
	
	debugMsg('Checked research way length='+way.length+', returned='+_out.length, 'research');
	return _out;
}

function addPrimaryWay(){
	if ( typeof research_primary === "undefined" ) return false;
	if(!(research_primary instanceof Array)) return false;
	if(researchStrategy == "Smudged"){
		research_primary.reverse();
		for(i in research_primary){
			research_way.unshift([research_primary[i]]);
		}
		debugMsg("research_primary smudged", 'research');
		return true;
	}
	if(researchStrategy == "Strict"){
		var _out=[];
		for(i in research_primary){
			_out.push(research_primary[i]);
		}
		research_way.unshift(_out);
		debugMsg("research_primary strict", 'research');
		return true;
	}
	if(researchStrategy == "Random"){
		shuffle(research_primary);
		for(i in research_primary){
			research_way.unshift([research_primary[i]]);
		}
		debugMsg("research_primary random", 'research');
		return true;
	}
	return false;
}

function removeDuplicates(originalArray, objKey) {
	var trimmedArray = [];
	var values = [];
	var value;
	
	for(var i = 0; i < originalArray.length; i++) {
		value = originalArray[i][objKey];
		
		if(values.indexOf(value) === -1) {
			trimmedArray.push(originalArray[i]);
			values.push(value);
		}
	}
	
	return trimmedArray;
	
}

//Возвращает кол-во производящихся на данный момент типов в заводах.
function inProduce(type){
	if(produceTrigger.length == 0) return 0;
	var _prod = 0;
	
	for ( var p in produceTrigger ){
		if (produceTrigger[p] == type) _prod++;
	}
	
	return _prod;
}


function unitIdle(obj){
//	debugMsg(obj.name+" "+obj.order+" "+obj.action, 'temp');
	if(obj.order == DORDER_NONE){
//		debugMsg(obj.name+" idle", 'temp');
		return true;
	}
	return false;
}

//Функция равномерного распределения войск на несколько целей
//targets - цель
//warriors - атакующая группа
//num - количество целей для распределения от 1 до 10
function attackObjects(targets, warriors, num, scouting){
	if ( targets.length == 0 || warriors.length == 0 ) return false;
	if ( typeof num === "undefined" || num == null || num == 0 ) num = 3;
	if ( num > 10 ) num = 10;
	if ( warriors.length < num ) num = warriors.length;

	targets = targets.slice(0,num);

	for ( i in targets ) {
		var target = isBeingRepaired(targets[i]);
		if ( target != false) {
			targets[i] = target;
		}
	}

	if ( targets.length >= warriors.length ) {
		for ( i = 0, len = warriors.length; i<len; ++i ) {
			if(scouting) orderDroidLoc_p(warriors[i], DORDER_SCOUT, targets[i].x, targets[i].y);
			else orderDroidObj_p( warriors[i], DORDER_ATTACK, targets[i] );
		}
		return true;
	}else{
		var a = Math.floor(warriors.length/targets.length);
		var i=0;
		var t=0;
		for ( var n in warriors ) { 
			t++;
			if ( i == targets.length ) return true;
			var busy = false;
			for ( var j in targets ) {
				if ( distBetweenTwoPoints ( targets[j].x,targets[j].y,warriors[n].x,warriors[n].y ) < 7 ) {
					if(scouting) orderDroidLoc_p(warriors[n], DORDER_SCOUT, targets[j].x, targets[j].y);
					else orderDroidObj_p( warriors[n], DORDER_ATTACK, targets[j] );
					busy = true;
				}
			}
			if ( busy ) continue;
			if(scouting) orderDroidLoc_p(warriors[n], DORDER_SCOUT, targets[i].x, targets[i].y);
			else orderDroidObj_p( warriors[n], DORDER_ATTACK, targets[i] );
			if ( t >= a ){
				debugMsg("getTarget: Атака на "+targets.length+" цели по "+a+" юнита ("+targets[i].x+","+targets[i].y+")",4);
				t=0;
				i++;
			}
		}
		return true;
	}
	return false;
	
}

//Неоптимизированно, нужно доделать.
function checkEventIdle(){
	if(!running)return;
	targetPartisan();
	queue('targetCyborgs', 200);
	queue('targetRegular', 400);
}

//для 3.2
function recycleBuilders(){
	factory = enumStruct(me, FACTORY);
	factory_ready = factory.filter(function(e){if(e.status == 1)return true; return false;});
	if(factory_ready.length != 0){
		_builders = enumDroid(me,DROID_CONSTRUCT);
		_builders.forEach(function(e){
			orderDroid(e, DORDER_RECYCLE);
		});
	}
}


//from: https://warzone.atlassian.net/wiki/pages/viewpage.action?pageId=360669
// More reliable way to identify VTOLs
var isFixVTOL = function(obj) {
	try {
		return ( (obj.type == DROID) && (("isVTOL" in obj && obj.isVTOL) || isVTOL(obj)) );
	} catch(e) {
		debugMsg("isFixVTOL(): "+e.message, 'error');
	}
}

//from: http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}
