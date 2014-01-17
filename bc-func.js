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
//и ровномерно распределяет по свободным лаборатория
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
//если num не передан, возвращает полный сортированный массив
//если num равен 1, то всё равно возвращается массив но с единственным объектом
function sortByDistance(arr, obj, num){

	if ( typeof num === "undefined" || num == null ) num = 0;
	else if ( arr.length == 1 ) num = 1;

	if ( num == 1 ) {
		var a = Infinity;
		var b = Infinity;
		var c = new Array();
		for ( var i in arr ) {
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

// Здесь будет сложная функция определяющая цель для атаки (без читерства)
// изначально будет неоптимизированная но продуманная
// должна полностью заменить старую функцию myEyes()
function getTarget(){

	var targResource = new Array();			//Общая цель ресурсов и строителей
	var targExtractors = new Array();		//Только качалки для дальнейшего разбора
	var targDroid = new Array();			//Все вражеские юниты
	var targStruct = new Array();	//не использую пока
	var targFactory = new Array();
	var targBuilding = new Array();
	var targDefence = new Array();
	var targPrioriy = new Array();
	//Цикл для вражеских игроков(ботов)
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;

		var tmp = enumStruct(e, RESOURCE_EXTRACTOR, me);
		targExtractors = targExtractors.concat(tmp);
		targResource = targResource.concat(tmp);
		targResource = targResource.concat(enumDroid(e, DROID_CONSTRUCT, me));
		targDroid = targDroid.concat(enumDroid(e, DROID_WEAPON, me));
		targDroid = targDroid.concat(enumDroid(e, DROID_CYBORG, me));
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
		targDefence = targDefence.concat(enumStruct(scavengerPlayer,DEFENSE,me));
	}
	
//	if ( targResource.length > 1 ) targResource = sortByDistance(targResource, base, 1);

	myArmy = new Array();
	myArmy = myArmy.concat(enumDroid(me,DROID_WEAPON));
	myArmy = myArmy.concat(enumDroid(me,DROID_CYBORG));
	myArmy.reverse();
	var armyLen = myArmy.length;

	if ( armyLen == 0 ) {
		debugMsg("getTarget: Опасно! Нет войск!", 4);
//TODO	Может возможно доработать тут
		return;
	}

	if ( targDroid.length > 0 ) {
		targDroid = sortByHealth(targDroid);
		attackObjects(targDroid, myArmy, 2);
		return;
	}

	var factLen = targFactory.length;
	var defLen = targDefence.length;
	var buildLen = targBuilding.length;
	if ( (factLen != 0 || defLen != 0 || buildLen != 0) && armyLen > 15 ){
		if ( defLen != 0 && armyLen < 20 ) {
			targDefence = sortByDistance(targDefence,base,1);
			attackObjects(targDefence,myArmy,1);
			return;
		}else if ( defLen != 0 ){
			targDefence = sortByDistance(targDefence,base,null);
			attackObjects(targDefence,myArmy,2);
			return;
		}

		if ( factLen != 0 ){
			targFactory = sortByDistance(targFactory,base,null);
			attackObjects(targFactory,myArmy,2);
			return;
		}

		if ( buildLen != 0 ){
			targBuilding = sortByDistance(targBuilding,base,null);
			attackObjects(targBuilding,myArmy,null);
			return;
		}
//		return;
	}

	if ( targResource.length == 0 ) {
		unknownRigs = getUnknownResources();
		unknownRigs = sortByDistance(unknownRigs,base,null)
//		if ( unknownRigs.length >= myArmy.length ) {
			for ( var i = 0, len = myArmy.length; i < len; ++i ) {
				if ( i >= unknownRigs.length ) break;
				if (myArmy[i].order != DORDER_MOVE) {
					orderDroidLoc( myArmy[i], DORDER_MOVE, unknownRigs[i].x+1,unknownRigs[i].y+1 );
					debugMsg("getTarget: Разведка на ("+unknownRigs[i].x+","+unknownRigs[i].y+") неразведанно "+unknownRigs.length,4);
				}
			}
			return;
/*		}else{
			var a = Math.floor(myArmy.length/unknownRigs.length);
			var i=0;
			var t=0;
			for ( var n in myArmy ) {
				t++;
				if(i==unknownRigs.length) break;
				orderDroidLoc( myArmy[n], DORDER_MOVE, unknownRigs[i].x+1,unknownRigs[i].y+1 );
				
				if(t>=a){
					debugMsg("getTarget: Разведка по "+a+" юнита на ("+unknownRigs[i].x+","+unknownRigs[i].y+") неразведанно "+unknownRigs.length,4);
					t=0;
					i++;
				}
			}
			return;
		}
*/
		debugMsg("getTarget: "+myArmy.length+" юнитов бездельничают", 4);
		return;
	}
//	debugMsg("getTarget: Вижу "+targResource.length+" безобидные цели",4);

	if (attackObjects(targResource, myArmy, 3)) return;
	
/*
	//Targeting...
	var target = new Object();
	target = targResource[0];

	for ( var i in myArmy ) {

		//Проверяем, рядом ли находится воин с вражеской вышкой
		var busy = false;
		for ( var n in targExtractors ) {
			if ( distBetweenTwoPoints(targExtractors[n].x,targExtractors[n].y,myArmy[i].x,myArmy[i].y) < 5 ){
				orderDroidObj(myArmy[i], DORDER_ATTACK, targExtractors[n]);
				busy = true;
			}
		}
		if ( busy ) continue;
		orderDroidObj(myArmy[i], DORDER_ATTACK, target);
	} 
*/
	debugMsg("getTarget: "+myArmy.length+" войск, атакуют строителя/ресурс на позиции ("+target.x+","+target.y+") ["+target.player+"]", 4);
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

	targets = targets.slice(0,num);

	for ( i in targets ) {
		var target = isBeingRepaired(targets[i]);
		if ( target != false) {
			targets[i] = target;
		}
	}

	if ( targets.length >= warriors.length ) {
		for ( i = 0, len = warriors.length; i<len; ++i ) {
			orderDroidObj( warriors[i], DORDER_ATTACK, targets[i] );
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
					orderDroidObj( warriors[n], DORDER_ATTACK, targets[j] );
					busy = true;
				}
			}
			if ( busy ) continue;	
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
		if ( !allianceExistsBetween(me,e) ) continue;
		iSee = iSee.concat(enumStruct(e, RESOURCE_EXTRACTOR, me));
	}

	return iSee;
	
}
