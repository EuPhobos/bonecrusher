


//Функция проверяет объекты и возвращает значение
//Задача стоит в обработке тяжёлых данных, и работа данной функции
//в цикле, функция должна будет отработать один раз, и прокешировать
//результат, что бы быстро отдавать циклам нужную информация, не
//забивая процессор всякой повторяющейся хернёй
//Параметры:
//x,y - координаты
//command - что-то конкретное ищем, задание для функции
//range - передаём, если что-то нужно искать в радиусе (примичание, радиус так же кешируется, следующий запрос по таким же координатам и коммандой дадут результат с прошлого радиуса, пока не пройдёт время updateIn)
//obj - передаём, если нужно сравнить что-то с объектом(например propulsion is reach для droid)
//cheat - true(читерим, видя через туман войны), null/false/undefined(не читерим, возвращем только то, что можем видеть)

var _globalInfoNear = [];
function getInfoNear(x,y,command,range,obj,cheat){

	if ( typeof _globalInfoNear[x] !== 'undefined'
		&& typeof _globalInfoNear[x][y] !== 'undefined' // <--
		&& typeof _globalInfoNear[x][y][command] !== 'undefined'
		&& gameTime < (_globalInfoNear[x][y][command].setTime + _globalInfoNear[x][y][command].updateIn) ) {
		debugMsg("getInfoNear("+x+","+y+","+command+"): fast return value="+_globalInfoNear[x][y][command].value+"; timeout="+(_globalInfoNear[x][y][command].setTime+_globalInfoNear[x][y][command].updateIn-gameTime));
//		debugMsg("getInfoNear(): fast return gameTime="+gameTime+", setTime="+_globalInfoNear[x][y][command].setTime+", updateIn="+_globalInfoNear[x][y][command].updateIn);
		return _globalInfoNear[x][y][command];
	}else{
		
		if(typeof range === 'undefined') range = 7;
		if(typeof cheat === 'undefined') var view = me;
		else if(cheat == true) var view = -1;
		_globalInfoNear[x] = [];
		_globalInfoNear[x][y] = [];
		_globalInfoNear[x][y][command] = { setTime: gameTime, updateIn: 30000 };
//		debugMsg("getInfoNear(): gameTime="+gameTime+", setTime="+_globalInfoNear[x][y][command].setTime+", updateIn="+_globalInfoNear[x][y][command].updateIn);
//		_globalInfoNear[x][y][command].setTime = gameTime;
//		_globalInfoNear[x][y][command].updateIn = 10000; // <-- запомнить эти значения на 10 секунд игрового времени

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
				if ( distBetweenTwoPoints(x,y,danger[d].x,danger[d].y) < range ) { 
					_globalInfoNear[x][y][command].value = false;
					debugMsg("getInfoNear("+x+","+y+","+command+"): setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value);
					return _globalInfoNear[x][y][command]; 
				}
			}
			_globalInfoNear[x][y][command].value = true;
			debugMsg("getInfoNear("+x+","+y+","+command+"): setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value);
			return _globalInfoNear[x][y][command];
		}else if(command == 'defended'){
			var defenses = new Array();
			defenses = enumStruct(me, DEFENSE).filter(function(e){if(e.status == BUILT) return true; return false;});
			for ( var d in defenses ) {
				if ( distBetweenTwoPoints(x,y,defenses[d].x,defenses[d].y) < range ) { 
					_globalInfoNear[x][y][command].value = true;
					debugMsg("getInfoNear("+x+","+y+","+command+"): setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value);
					return _globalInfoNear[x][y][command];
				}
			}
			_globalInfoNear[x][y][command].value = false;
			debugMsg("getInfoNear("+x+","+y+","+command+"): setTime="+_globalInfoNear[x][y][command].setTime+"; updateIn="+_globalInfoNear[x][y][command].updateIn+"; value="+_globalInfoNear[x][y][command].value);
			return _globalInfoNear[x][y][command];
			
		}
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
					if ( distBetweenTwoPoints(who.x,who.y,droids[i].x,droids[i].y) <= 3 ) {
//						debugMsg("Атакующая меня башня подвергается ремонту!",5);
						return droids[i];
					}
				}
			}	
			return false;
			break;
		}
		default: {
			debugMsg("Нууу, не знаю, нас атакует Ктулху! ["+who.player+"]",5);
			return false;
			break;
		}
	}
	return false;
}

//Функция предерживается приоритетов исследований
//и ровномерно распределяет по свободным лабораториям
//и должна вызыватся в 3-х случаях (не в цикле)
//1. При старте игры
//2. При постройке лабаротории
//3. При завершении исследования
function doResearch(){
	
	if ( research_way.length == 0 ) {
		debugMsg("doResearch: Исследовательские пути завершены! Останов.",3);
		return;
	}

	var labs = enumStruct(me,RESEARCH_LAB);
	if ( typeof _r === "undefined" ) _r = 0;
	var _busy = 0;

	var _last_r = research_way[_r][research_way[_r].length-1];
	var _way = getResearch(_last_r);

	if ( _way.done == true ) {
		debugMsg("doResearch: Путей "+research_way.length+", путь "+_r+" завершён",4);
		research_way.splice(_r,1);
		debugMsg("doResearch: Осталось путей "+research_way.length,4);
		_r=0;
		if ( research_way.length == 0 ) {
			debugMsg("doResearch: Исследовательские пути завершены! Останов.",3);
			return;
		}
	}

	for ( var l in labs ){
		if( factoryReady(labs[l]) ){
			debugMsg("Лаборатория("+labs[l].id+")["+l+"] исследует путь "+_r,4);
			pursueResearch(labs[l], research_way[_r]);
		}else{
			debugMsg("Лаборатория("+labs[l].id+")["+l+"] занята", 3);
			_busy++;
		}
	}

	if ( _r == research_way.length-1 ) {
		_r = 0;
		debugMsg("doResearch: Все исследования запущены, останов.",4);
	} else if (_busy == labs.length ) {
		debugMsg("doResearch: Все все лаборатории заняты, останов.",4);
		_r = 0;
	} else {
		_r++;
		debugMsg("doResearch: Планировка проверки занятости лабораторий...",4);
		queue("doResearch", 2000);
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
	if ( typeof num === "undefined" || num == null ) num = 0;
	else if ( arr.length == 1 ) num = 1;

	if ( num == 1 ) {
		var a = Infinity;
		var b = Infinity;
		var c = new Array();
		for ( var i in arr ) {
			if(reach)if(!droidCanReach(obj, arr[i].x, arr[i].y))continue;
			a = distBetweenTwoPoints( obj.x, obj.y, arr[i].x, arr[i].y );
			if ( a < b ) {
				b = a;
				c[0] = arr[i];
			}
		}
		return c;
	}

	if ( num != 1 ) {
		arr.sort( function(a,b){
			if( distBetweenTwoPoints( obj.x, obj.y, a.x, a.y ) < distBetweenTwoPoints( obj.x, obj.y, b.x, b.y ) ) return -1;
			if( distBetweenTwoPoints( obj.x, obj.y, a.x, a.y ) > distBetweenTwoPoints( obj.x, obj.y, b.x, b.y ) ) return 1;
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

var targResource, targConstruct, targExtractors, targDroid, targStruct, targFactory, targBuilding, targDefence, targPriority;
var myArmy, armyLen;

function enumTargets(){
	//Цикл для вражеских игроков(ботов)
//	debugMsg("enumTargets()");
	
	targResource = new Array();			//цель ресурсов
	targConstruct = new Array();		//цель строители
	targExtractors = new Array();		//Только качалки для дальнейшего разбора
	targDroid = new Array();			//Все вражеские юниты
	targStruct = new Array();			//не использую пока
	targFactory = new Array();			//Производственные сооружения
	targBuilding = new Array();			//Прочие строения
	targDefence = new Array();			//Защитные вышки и сканеры
	targPriority = new Array();			//не используется
	
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;

		var tmp = enumStruct(e, RESOURCE_EXTRACTOR, me);
		targExtractors = targExtractors.concat(tmp);
		targResource = targResource.concat(tmp);
//		targResource = targResource.concat(enumDroid(e, DROID_CONSTRUCT, me));
//		targResource = targResource.concat(enumDroid(e, 10, me));
		targConstruct = targConstruct.concat(enumDroid(e, DROID_CONSTRUCT, me));
		targConstruct = targConstruct.concat(enumDroid(e, 10, me));
		targDroid = targDroid.concat(enumDroid(e, DROID_WEAPON, me));
		targDroid = targDroid.concat(enumDroid(e, DROID_CYBORG, me));
		targDroid = targDroid.concat(enumDroid(e, DROID_REPAIR, me));
		targDroid = targDroid.concat(enumDroid(e, 11, me));
		targFactory = targFactory.concat(enumStruct(e,FACTORY,me));
		targFactory = targFactory.concat(enumStruct(e,CYBORG_FACTORY,me));
		targFactory = targFactory.concat(enumStruct(e,REARM_PAD,me));
		targFactory = targFactory.concat(enumStruct(e,VTOL_FACTORY,me));
		targDefence = targDefence.concat(enumStruct(e,DEFENSE,me));
		targDefence = targDefence.concat(enumStruct(e,REPAIR_FACILITY,me));
		targBuilding = targBuilding.concat(enumStruct(e,WALL,me));
		targBuilding = targBuilding.concat(enumStruct(e,POWER_GEN,me));
		targBuilding = targBuilding.concat(enumStruct(e,RESEARCH_LAB,me));

		
	}
	// и плюс Scavengers если есть
	if ( scavengerPlayer != -1 ) {
		targResource = targResource.concat(enumStruct(scavengerPlayer, RESOURCE_EXTRACTOR, me));
		targDroid = targDroid.concat(enumDroid(scavengerPlayer, DROID_WEAPON, me));
		targDroid = targDroid.concat(enumDroid(scavengerPlayer, DROID_PERSON, me));
		targDefence = targDefence.concat(enumStruct(scavengerPlayer,DEFENSE,me));
	}
	
//	if ( targResource.length > 1 ) targResource = sortByDistance(targResource, base, 1);

	myArmy = new Array();
	myArmy = myArmy.concat(enumDroid(me,DROID_WEAPON));
	myArmy = myArmy.concat(enumDroid(me,DROID_CYBORG));

/*	
	for ( w in myArmy ){
		if (myArmy[w].order == DORDER_ATTACK ) myArmy.splice(w,1); //Выкидываем того, кто уже атакует что либо.
	}
*/
	armyLen = myArmy.length;
	
	if ( armyLen == 0 ) {
		debugMsg("getTarget: Опасно! Нет войск!", 4);
//TODO	Может возможно доработать тут
		return false;
	}
	return true;
}

// Здесь будет сложная функция определяющая цель для атаки (без читерства)
// изначально будет неоптимизированная но продуманная
// должна полностью заменить старую функцию myEyes()
function getTarget(target, num){
//	debugMsg("getTarget()");
	if(!enumTargets()) return false;
/*
	if (target){
		debugMsg("getTarget: Смена цели");
		myArmy = sortByDistance(myArmy,target);
		if (num) attackObjects([target], myArmy, num);
		attackObjects([target], myArmy, 1);
		return;
	}
	else 
*/
	myArmy.reverse();


	var targets = new Array();
	
	targets = targets.concat(targDefence);
	targets = targets.concat(targResource);
	if(targDroid.length != 0) targets = targets.concat(targDroid.filter(function(e){if(getDistance(e) < base_range) return true; return false;}));
	targets = sortByDistance(targets,base,null);
	
	if ( targets.length > 0 ){
		if ( armyLen >= 2 ){
			if(attackObjects(targets, myArmy, 1)) return true;
		}
		if ( armyLen >= 20 ){
			if(attackObjects(targets, myArmy, 2)) return true;
		}
	}
	

	if ( targDroid.length > 1 && armyLen >= targDroid.length) {
		targDroid = sortByHealth(targDroid);
		if(armyLen > 20) {
			if(attackObjects(targDroid, myArmy, 2)) return true;
		}
		else {
			if(attackObjects(targDroid, myArmy, 1)) return true;
		}
	}

	var factLen = targFactory.length;
	var buildLen = targBuilding.length;
	if ( buildLen != 0 && armyLen > 15 ){
		targBuilding = sortByDistance(targBuilding,base,null);
		if(attackObjects(targBuilding,myArmy,2)) return true;
	}
	if( armyLen > 30 && factLen != 0) {
		targFactory = sortByDistance(targFactory,base,null);
		targFactory = targets.concat(targResource); //После уничтожения всех заводов ищем строителей
		if(attackObjects(targFactory,myArmy,4)) return true;
	}


	unknownRigs = getUnknownResources();
	unknownRigs = sortByDistance(unknownRigs,base,null)
	units = 2; //По 2 танка на точку
	for ( var i = 0, len = myArmy.length; i < len; ++i ) {
		if ( i >= unknownRigs.length ) break;
		if (myArmy[i].order != DORDER_MOVE) {
			orderDroidLoc( myArmy[i], DORDER_MOVE, unknownRigs[Math.floor(i/units)].x+1,unknownRigs[Math.floor(i/units)].y+1 );
			debugMsg("getTarget: Разведка на ("+unknownRigs[Math.floor(i/units)].x+","+unknownRigs[Math.floor(i/units)].y+") неразведанно "+unknownRigs.length,4);
		}
	}

	debugMsg("enumTargets: Армия бездельничает");
	
	return false;
}

//Функция равномерного распределения войск на несколько целей
//targets - цель
//warriors - атакующая группа
//num - количество целей для распределения от 1 до 10
function attackObjects(targets, warriors, num){
	if ( targets.length == 0 || warriors.length == 0 ) return false;
	if ( typeof num === "undefined" || num == null || num == 0 ) num = 3;
	if ( num > 10 ) num = 10;
	if ( warriors.length < num ) num = warriors.length;

//	debugMsg("attackObjects(): targets.length="+targets.length);
	
	targets = targets.slice(0, num);

	for ( var i in targets ) {
		var target = isBeingRepaired(targets[i]);
		if ( target != false) {
			targets[i] = target;
		}
	}

	if ( targets.length >= warriors.length ) {
		for ( var z = 0, len = warriors.length; z<len; ++z ) {
//			debugMsg("attackObjects: 337");
			orderDroidObj( warriors[z], DORDER_ATTACK, targets[z] );
		}
		return true;
	}else{
		var a = Math.floor(warriors.length/targets.length);
		var i=0; // Порядковый номер цели в массиве
		var t=0; // Циклическая переменная
		for ( var n in warriors ) { // Для каждого моего бойца
			var found = false;
			t++;
			if ( i == targets.length ) return true;
			var busy = false;
			for ( var j in targets ) { // Для каждой вражеской цели
				if ( distBetweenTwoPoints ( targets[j].x,targets[j].y,warriors[n].x,warriors[n].y ) < 7 ) { //Опеределяем дистанцию цели для бойца
/*					debugMsg("attackObjects: 351");
					debugMsg("j="+j+"; id="+warriors[n].id+"; t.id="+targets[j].id+"; t.pl="+targets[j].player+"; tname="+targets[j].name+"; ttype="+targets[j].type);
					try { found = objFromId(targets[j]); } catch(e) { found = false; }
					if(!found) debugMsg("Error incoming!");
					else debugMsg("t.id="+found.id+"; t.pl="+found.player+"; tname="+found.name+"; ttype="+found.type);
*/
					orderDroidObj( warriors[n], DORDER_ATTACK, targets[j] ); //Атакуем ближайшего, игнорируя приказ
					busy = true;
					break;
				}
			}
			if ( busy ) continue; //Конкретный боец атакует ближайшего, он занят для приказа
/*			debugMsg("attackObjects: 357");
			debugMsg("i="+i+"; id="+warriors[n].id+"; t.id="+targets[i].id+"; t.pl="+targets[i].player+"; tname="+targets[i].name+"; ttype="+targets[i].type);
			try { found = objFromId(targets[i]); } catch(e) { found = false; }
			if(!found) debugMsg("Error incoming!");
			else debugMsg("t.id="+found.id+"; t.pl="+found.player+"; tname="+found.name+"; ttype="+found.type);
*/
			orderDroidObj( warriors[n], DORDER_ATTACK, targets[i] );
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


//Функция возвращает все видимые ресурсы, свободные, свои и союзников
function getSeeResources(){
	iSee = new Array();
	iSee = iSee.concat(enumFeature(me, "OilResource"));
	for ( var e = 0; e < maxPlayers; ++e ){
//		if ( !allianceExistsBetween(me,e) ) continue; //Выкидываем вражеские
		iSee = iSee.concat(enumStruct(e, RESOURCE_EXTRACTOR, me));
	}

	return iSee;
	
}

//Функция возвращает все видимые вражеские ресурсы
function getEnemyResources(){
	var enemyRigs = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		var tmp = enumStruct(e, RESOURCE_EXTRACTOR, me);
		enemyRigs = enemyRigs.concat(tmp);
	}
/*
	playerData.forEach( function(player) {
		if ( !allianceExistsBetween(me, player) ) { // enemy player
			enemyRigs = enemyStructs.concat(enumStruct(player, RESOURCE_EXTRACTOR, me));
		}
	} );
*/
	return enemyRigs;
}
