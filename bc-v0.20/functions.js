


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

var _globalInfoNear = [];
function getInfoNear(x,y,command,range,time,obj,cheat){

	if ( typeof _globalInfoNear[x] !== 'undefined'
		&& typeof _globalInfoNear[x][y] !== 'undefined' // <--
		&& typeof _globalInfoNear[x][y][command] !== 'undefined'
		&& gameTime < (_globalInfoNear[x][y][command].setTime + _globalInfoNear[x][y][command].updateIn) ) {
		debugMsg("getInfoNear("+x+","+y+","+command+"): fast return value="+_globalInfoNear[x][y][command].value+"; timeout="+(_globalInfoNear[x][y][command].setTime+_globalInfoNear[x][y][command].updateIn-gameTime));
//		debugMsg("getInfoNear(): fast return gameTime="+gameTime+", setTime="+_globalInfoNear[x][y][command].setTime+", updateIn="+_globalInfoNear[x][y][command].updateIn);
		return _globalInfoNear[x][y][command];
	}else{
		if(typeof time === 'undefined') time = 30000;
		if(typeof range === 'undefined') range = 7;
		if(typeof cheat === 'undefined') var view = me;
		else if(cheat == true) var view = -1;
		_globalInfoNear[x] = [];
		_globalInfoNear[x][y] = [];
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

//Подготавливаем технологии для производства
//на самом деле лишняя функция, однако необходимая
//для того, что бы не читерить. Мы не можем производить
//войска по исследованным технологиям без HQ, так этой функцией запретим
//это делать и ИИ
function prepeareProduce(){
	
	//Если есть HQ
	var hq = enumStruct(me, HQ).filter(function (e){if(e.status == BUILT)return true;return false;});
	if (hq.length != 0){
		
		//Составляем корпуса
		light_bodies=[];
		medium_bodies=[];
		heavy_bodies=[];
		bodies.forEach(function(e){
//			debugMsg("Body: "+e[1]+" "+getResearch(e[0]).done, 'production');
			switch (e[1]){
				case "Body1REC":
				case "Body4ABT":
				case "Body2SUP":
				case "Body3MBT":
					if(getResearch(e[0]).done) light_bodies.unshift(e[1]);
				break;
				case "Body5REC":
				case "Body8MBT":
				case "Body6SUPP":
				case "Body7ABT":
					if(getResearch(e[0]).done) medium_bodies.unshift(e[1]);
				break;
				case "Body11ABT":
				case "Body12SUP":
				case "Body9REC":
				case "Body10MBT":
				case "Body13SUP":
				case "Body14SUP":
					if(getResearch(e[0]).done) heavy_bodies.unshift(e[1]);
				break;
				
			}
		});
		
		
		//Сортируем пушки по "крутизне", базируясь на research.points
		var _guns=guns.filter(function(e){if(getResearch(e[0]).done)return true;return false;}).sort(function (a,b){
			if(getResearch(a[0]).points < getResearch(b[0]).points ) return -1;
			if(getResearch(a[0]).points > getResearch(b[0]).points ) return 1;
			return 0;
		});
		avail_guns=[];
		for (var i in _guns){
			avail_guns.push(_guns[i][1]);
//			debugMsg(getResearch(_guns[i][0]).points+" "+_guns[i][0]+"->"+_guns[i][1], 'production');
		}
		if(avail_guns.length > 1) avail_guns.shift(); //Выкидываем первый пулемётик
		if(avail_guns.length > 1) avail_guns.shift(); //Выкидываем спаренный пулемётик
		avail_guns.reverse();
		
		//Сайборги заполонили!
		avail_cyborgs=[];
		var _cyb=cyborgs.filter(function(e){if(getResearch(e[0]).done)return true;return false;}).sort(function (a,b){
			if(getResearch(a[0]).points < getResearch(b[0]).points ) return -1;
			if(getResearch(a[0]).points > getResearch(b[0]).points ) return 1;
			return 0;
		});
		for (var i in _cyb){
			avail_cyborgs.push([_cyb[i][1],_cyb[i][2]]);
		}
		avail_cyborgs.reverse();
		
		//В.В.иП.
		avail_vtols=[];
		var _vtols=vtols.filter(function(e){if(getResearch(e[0]).done)return true;return false;}).sort(function (a,b){
			if(getResearch(a[0]).points < getResearch(b[0]).points ) return -1;
			if(getResearch(a[0]).points > getResearch(b[0]).points ) return 1;
			return 0;
		});
		for (var i in _vtols){
			avail_vtols.push(_vtols[i][1]);
		}
		avail_vtols.reverse();
		avail_vtols.unshift("Bomb3-VTOL-LtINC");	// <-- *facepalm*
		avail_vtols.unshift("Bomb4-VTOL-HvyINC");	// <-- *facepalm*
	}
	
	defence=[];
	towers.forEach(function(e){if(getResearch(e[0]).done)defence.unshift(e[1]);});
}

function groupArmy(droid){
	
	if(droid.droidType == DROID_CYBORG){
		debugMsg("armyCyborgs +1", 'group');
		groupAddDroid(armyCyborgs, droid);
		return;
	}
	
	if(droid.droidType == DROID_REPAIR){
		debugMsg("armyFixers +1", 'group');
		groupAddDroid(armyFixers, droid);
		return;
	}
	
	
	//Если армия партизан меньше 7 или нет среднего Body
	if(groupSize(armyPartisans) < 7 || !getResearch("R-Vehicle-Body05").done){
//	if(groupSize(armyPartisans) < 5){
		debugMsg("armyPartisans +1", 'group');
		groupAddDroid(armyPartisans, droid);
	}else{
		debugMsg("armyRegular +1", 'group');
		groupAddDroid(armyRegular, droid);
	}
	
}

function produceDroids(){
	var droid_factories = enumStruct(me,FACTORY).filter(function(e){if(e.status == BUILT && structureIdle(e))return true;return false;});
	
	var builders_limit = getDroidLimit(me, DROID_CONSTRUCT);
	var builders = enumDroid(me, DROID_CONSTRUCT);
//	debugMsg("Have builders: "+builders.length+"; limits: "+builders_limit, 'production');
//	debugMsg("Have warriors="+groupSize(armyRegular)+" partisan="+groupSize(armyPartisans), 'production');
	if(droid_factories.length != 0){
		
		//Строители
		//Если строители не в лимите -И- база не подвергается нападению
		//Если целей для охотников более 7 -И- денег более 700 -ИЛИ- строитель всего один а денег более 300 -ИЛИ- вообще нет строителей
		//ТО заказуаэм!
		debugMsg("buildersTrigger="+buildersTrigger+"; fixersTrigger="+fixersTrigger+"; gameTime="+gameTime, 'production');
		if( (builders.length < (builders_limit-3) && getInfoNear(base.x,base.y,'safe',base_range,10000))
			&& ( (playerPower(me) > 700 && builder_targets.length > 7 && buildersTrigger < gameTime) || (groupSize(buildersMain) == 1 && playerPower(me) > 300) || builders.length == 0 ) ){
			buildDroid(droid_factories[0], "Truck", ['Body2SUP','Body4ABT','Body1REC'], ['hover01','wheeled01'], "", DROID_CONSTRUCT, "Spade1Mk1");
			buildersTrigger = gameTime + buildersTimer;
			return;
		}
		
		if (getInfoNear(base.x,base.y,'safe',base_range,10000) && groupSize(armyFixers) < 5 && fixersTrigger < gameTime && getResearch("R-Sys-MobileRepairTurret01").done){
			fixersTrigger = gameTime + fixersTimer;
			var _repair = "LightRepair1";
			if(getResearch("R-Sys-MobileRepairTurretHvy").done) _repair = "HeavyRepair";
			buildDroid(droid_factories[0], "Fixer", ['Body2SUP','Body4ABT','Body1REC'], ['hover01','wheeled01'], "", DROID_REPAIR, _repair);
			return;
		}
		
		//Армия
		if(light_bodies.length != 0 && avail_guns.length != 0){
			if( (groupSize(armyPartisans) < 7 || playerPower(me) > 250)){
				var _body=light_bodies;
				if(playerPower(me)>300 && playerPower(me)<500 && medium_bodies.length != 0) _body = medium_bodies;
				if(playerPower(me)>800 && heavy_bodies.length != 0) _body = heavy_bodies;
				var _weapon = avail_guns[Math.floor(Math.random()*Math.min(avail_guns.length, 5))]; //Случайная из 5 последних крутых пушек
				buildDroid(droid_factories[0], "Army", _body, ['HalfTrack','wheeled01'], "", DROID_WEAPON, _weapon);
			}
		}
	}
}
function produceCyborgs(){
	if(playerPower(me) < 200 && groupSize(armyCyborgs) > 2) return;
	var cyborg_factories = enumStruct(me,CYBORG_FACTORY).filter(function(e){if(e.status == BUILT && structureIdle(e))return true;return false;});
	debugMsg("Cyborg: fact="+cyborg_factories.length+"; cyb="+avail_cyborgs.length, 'production');
	if(cyborg_factories.length != 0 && avail_cyborgs.length != 0 && groupSize(armyCyborgs) < 20){
		var _cyb = avail_cyborgs[Math.floor(Math.random()*Math.min(avail_cyborgs.length, 3))]; //Случайный киборг из 3 полседних крутых
		debugMsg("Cyborg: body="+_cyb[0]+"; weapon="+_cyb[1] ,'production');
		buildDroid(cyborg_factories[0], "Terminator", _cyb[0], "CyborgLegs", "", DROID_CYBORG, _cyb[1]);
	}
}

function produceVTOL(){
	if(playerPower(me) < 300 && groupSize(VTOLAttacker) > 3) return;
	/*
	 * Missile-VTOL-AT			_("VTOL Scourge Missile")
	 * Rocket-VTOL-BB			_("VTOL Bunker Buster")
	 * Rocket-VTOL-Pod			_("VTOL Mini-Rocket")
	 * Rocket-VTOL-LtA-T			_("VTOL Lancer")
	 * Rocket-VTOL-HvyA-T		_("VTOL Tank Killer")
	 * AAGun2Mk1-VTOL				_("VTOL Flak Cannon")
	 * Cannon1-VTOL				_("VTOL Cannon")
	 * Cannon4AUTO-VTOL				_("VTOL Hyper Velocity Cannon")
	 * Cannon5Vulcan-VTOL			_("VTOL Assault Cannon")
	 * Laser2PULSE-VTOL				_("VTOL Pulse Laser")
	 * MG1-VTOL					_("VTOL Machinegun")
	 * MG2-VTOL					_("VTOL Twin Machinegun")
	 * MG3-VTOL					_("VTOL Heavy Machinegun")
	 * MG4ROTARY-VTOL				_("VTOL Assault Gun")
	 * RailGun1-VTOL				_("VTOL Needle Gun")
	 * RailGun2-VTOL				_("VTOL Rail Gun")
	 * Bomb1-VTOL-LtHE				_("VTOL Cluster Bomb Bay")
	 * Bomb2-VTOL-HvHE				_("VTOL Heap Bomb Bay")
	 * Bomb3-VTOL-LtINC				_("VTOL Phosphor Bomb Bay")
	 * Bomb4-VTOL-HvyINC				_("VTOL Thermite Bomb Bay")
	 * 
	 * Cannon1-VTOL                            _("VTOL Cannon")
	 * Cannon4AUTO-VTOL                                _("VTOL Hyper Velocity Cannon")
	 * Cannon5Vulcan-VTOL                      _("VTOL Assault Cannon")
	 * Laser2PULSE-VTOL                                _("VTOL Pulse Laser")
	 * 
	 * MG1-VTOL                                        _("VTOL Machinegun")
	 * MG2-VTOL                                        _("VTOL Twin Machinegun")
	 * MG3-VTOL                                        _("VTOL Heavy Machinegun")
	 * MG4ROTARY-VTOL                          _("VTOL Assault Gun")
	 * RailGun1-VTOL                           _("VTOL Needle Gun")
	 * RailGun2-VTOL                           _("VTOL Rail Gun")
	 * 
	 * PBomb                                           _("Proximity Bomb Turret")
	 * SPBomb                                  _("Proximity Superbomb Turret")
	 * 
	 * Bomb1-VTOL-LtHE                         _("VTOL Cluster Bomb Bay")
	 * Bomb2-VTOL-HvHE                         _("VTOL Heap Bomb Bay")
	 * Bomb3-VTOL-LtINC                                _("VTOL Phosphor Bomb Bay")
	 * Bomb4-VTOL-HvyINC                               _("VTOL Thermite Bomb Bay")
	 * Bomb5-VTOL-Plasmite			_("VTOL Plasmite Bomb Bay")
	 * 
	 * 
	 * */
	
	if(groupSize(VTOLAttacker) > 20) return;
	vtol_factory = enumStruct(me, VTOL_FACTORY);
	var vtol_factories = vtol_factory.filter(function(e){if(e.status == BUILT && structureIdle(e))return true;return false;});
	if(vtol_factories.length != 0 ){
		var _body=light_bodies;
		if(playerPower(me)>300 && playerPower(me)<500 && medium_bodies.length != 0) _body = medium_bodies;
		if(playerPower(me)>800 && heavy_bodies.length != 0) _body = heavy_bodies;
		var _weapon = avail_vtols[Math.floor(Math.random()*Math.min(avail_vtols.length, 5))]; //Случайная из 5 последних крутых пушек
		buildDroid(vtol_factories[0], "Bomber", _body, "V-Tol", "", DROID_WEAPON, _weapon);
	}
}

function stats(){
	debugMsg("Power: "+playerPower(me)+"; rigs="+enumStruct(me,RESOURCE_EXTRACTOR).length+"; free="+enumFeature(me, "OilResource").length+"; enemy="+getEnemyResources().length+"; unknown="+getUnknownResources().length, 'stats');
	debugMsg("Army: "+enumDroid(me, DROID_WEAPON).length+"; Partisans="+groupSize(armyPartisans)+"; Regular="+groupSize(armyRegular)+"; Borgs="+groupSize(armyCyborgs)+"; VTOL="+groupSize(VTOLAttacker), 'stats');
	debugMsg("Builders: "+enumDroid(me, DROID_CONSTRUCT).length+"; Main="+groupSize(buildersMain)+"; Hunters="+groupSize(buildersHunters), 'stats');
	debugMsg("Weapons: "+guns.length+"; known="+avail_guns.length+"; cyborgs="+avail_cyborgs.length+"; vtol="+avail_vtols.length, 'stats');
	debugMsg("Base: defense="+enumStruct(me, DEFENSE).length+"; labs="+enumStruct(me, RESEARCH_LAB).length+"; factory="+enumStruct(me, FACTORY).length+"; cyb_factory="+enumStruct(me, CYBORG_FACTORY).length+"; vtol="+enumStruct(me, VTOL_FACTORY).length, 'stats');
	debugMsg("Bodies: light="+light_bodies.length+"; medium="+medium_bodies.length+"; heavy="+heavy_bodies.length, 'stats');
	debugMsg("Misc: nasty features="+nastyFeatures.length+"/"+nastyFeaturesLen,'stats');
}


function nastyFeaturesClean(){
	if(nastyFeatures.length != 0) return;
	var _cyborgs = enumGroup(armyCyborgs);
	if(_cyborgs.length == 0) return;
	
	nastyFeatures=[];
	var _trash = enumFeature(ALL_PLAYERS, "").filter(function(e){if(e.damageable)return true;return false;});
	allResources.forEach(function(r){
		nastyFeatures = nastyFeatures.concat(_trash.filter(function(e){
			if(distBetweenTwoPoints(r.x,r.y,e.x,e.y) < 7)return true;
			return false;
		}));
	});
	if(nastyFeatures.length != 0){
		nastyFeatures = removeDuplicates(nastyFeatures, 'id').filter(function(e){if(droidCanReach(_cyborgs[0], e.x, e.y))return true;return false;});
		nastyFeaturesLen = nastyFeatures.length;
	}else{
		removeTimer("nastyFeaturesClean"); // теперь чисто, выход от сюда навсегда
		debugMsg("nastyFeaturesClean complete", "stats");
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
	
	//var research = research_way;
	
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
	if ( typeof num === "undefined" || num == null || num == false) num = 0;
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

function factoryReady(what){
	return ( (what.status == BUILT) && structureIdle(what) );
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

function getEnemyNearBase(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_ANY, me));
	}
	if(scavengers == true) {
		targ = targ.concat(enumStruct(scavengerPlayer, DROID_ANY, me));
	}
	return targ.filter(function(e){if(distBetweenTwoPoints(e.x,e.y,base.x,base.y) < base_range)return true; return false;});
}

function getEnemyBuilders(){
	var targ = [];
	for ( var e = 0; e < maxPlayers; ++e ) {
		if ( allianceExistsBetween(me,e) ) continue;
		targ = targ.concat(enumDroid(e, DROID_CONSTRUCT, me));
		targ = targ.concat(enumDroid(e, 10, me)); // Киборг-строитель
	}
	return targ.filter(function(e){if(distBetweenTwoPoints(e.x,e.y,base.x,base.y) < base_range)return true; return false;});
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
