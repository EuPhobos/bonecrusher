function targetVTOL(){
	var target = [];
	target = sortByDistance(getEnemyDefences(), base);
	if(target.length == 0){
		target = target.concat(getEnemyResources());
		target = target.concat(getEnemyBuilders());
		target = sortByDistance(target, base, 1);
	}
	if(target.length == 0) target = sortByDistance(getEnemyFactories(), base);
	var group = enumGroup(VTOLAttacker).filter(function(e){if(e.action == 32 || e.action == 33 || e.action == 34 || e.action == 35 || e.action == 36 || e.action == 37)return false;return true});
	debugMsg("VTOLs: "+groupSize(VTOLAttacker)+"; ready: "+group.length+"; targets: "+target.length, "vtol");
	if(group.length >= 2 && target.length > 0) {
		debugMsg("Attack!", "vtol");
//		group.forEach(function(e){var attack = orderDroidObj(e, DORDER_ATTACK, target[0]); debugMsg("Attacking: "+target[0].name+"-"+attack, 'vtol');});
		group.forEach(function(e){var attack = orderDroidLoc(e, DORDER_SCOUT, target[0].x, target[0].y); debugMsg("Attacking: "+target[0].name+"-"+attack, 'vtol');});
		
	}
}

function targetFixers(){
	var fixers = enumGroup(armyFixers);
	var partisans = enumGroup(armyPartisans);
	
	
	if(fixers.length == 0 || partisans.length == 0) return;
	partisans.reverse();
	
	var target = partisans[0];
	debugMsg("Move all repairs to "+target.x+"x"+target.y, 'targeting');
	fixers.forEach(function(e){orderDroidLoc(e, DORDER_MOVE, target.x, target.y);})
	
}

function targetPartisan(){

	var partisans = enumGroup(armyPartisans);
	if(partisans.length == 0) return false;
	var target=[];
	target = target.concat(getEnemyNearBase());


	//Если слишком мало партизан, то кучкуем армию у ближайших ресурсов за пределами базы
	if(partisans.length < 5 && target.length==0){
		target = target.concat(getUnknownResources());
		target = target.concat(getSeeResources());
		target = sortByDistance(target, base).filter(function(e){
			if(distBetweenTwoPoints(e.x,e.y,base.x,base.y) < base_range && droidCanReach(partisans[0], e.x,e.y) )return true;return false;
		});
		
		if(target.length != 0){
			if(target.length > 4) target = target.slice(4);
			target = target[Math.floor(Math.random()*target.length)];
//			debugMsg("Мало партизан "+partisans.length+", собираю всех у "+target[0].name+" недалеко от базы "+distBetweenTwoPoints(base.x,base.y,target[0].x,target[0].y), 'targeting');
			partisans.forEach(function(e){orderDroidLoc(e, DORDER_SCOUT, target.x, target.y);});
		}
		return false;
	}


	//Атакую партизанами ближайшую нефтевышку
	if(target.length == 0){
		target = getEnemyResources();
		target = target.concat(getEnemyWalls());
		target = sortByDistance(target, partisans[0], 1, true);
	}
	if(target.length == 0) target = sortByDistance(getUnknownResources(), partisans[0], 1, true);
	if(target.length == 0) target = sortByDistance(getEnemyFactories(), partisans[0], 1, true);
	if(target.length != 0){
//		debugMsg("Партизан="+partisans.length+", атакую "+target[0].name+" расстояние от партизан="+distBetweenTwoPoints(partisans[0].x,partisans[0].y,target[0].x,target[0].y)+", от базы="+distBetweenTwoPoints(base.x,base.y,target[0].x,target[0].y), 'targeting');
		partisans.forEach(function(e){
			if( (target[0].type == STRUCTURE && target[0].stattype == WALL) || (target[0].type == DROID && target[0].droidType == DROID_CONSTRUCT) ){
				orderDroidObj(e, DORDER_ATTACK, target[0]);
				debugMsg("ATTACK "+target[0].name, 'targeting');
			}
			else{
				orderDroidLoc(e, DORDER_SCOUT, target[0].x, target[0].y);
				debugMsg("SCOUT to "+target[0].x+"x"+target[0].y, 'targeting');
			}
		});
		return true;
	}
}

function targetCyborgs(){
	var _cyborgs = enumGroup(armyCyborgs).filter(function(e){if(e.order == DORDER_ATTACK)return false;return true;});
	if(_cyborgs.length == 0) return;

	var target = [];
	target = target.concat(getEnemyDefences());
	target = target.concat(getEnemyResources());
	var enemy = getEnemyNearBase();
	
	if(enemy.length != 0) target = enemy; //Заменяем
	
	if(target.length != 0 || nastyFeatures.length != 0){
		if(nastyFeatures.length == 0) target = sortByDistance(target, _cyborgs[0], 1);
		_cyborgs.forEach(function(e){
			if(nastyFeatures.length != 0 && enemy.length == 0){ //Так сразу тут не понять, вообщем так:
				var _target = target; //Копируем общую переменную целей
				nastyFeatures = sortByDistance(nastyFeatures, e); //Сортируем глобальный мусор в отношении данного киборга
				target = target.concat(nastyFeatures); //Примешиваем к общим целям
				target = sortByDistance(target, e, 1); //Пересортировываем ещё раз быстро с одним выводом в отношении данного киборга
			}
			
			var feature = false;
			try {if(target[0].type == FEATURE)feature = true;}
			catch(e) {debugMsg("!! "+e.message+' !!', 'error');}
			
			if(feature){ //Если всё таки мусор ближе, атакуем
//				debugMsg("Cyborgs purge trash #"+target[0].id+" "+target[0].name+" at "+target[0].x+"x"+target[0].y, 'targeting');
				try {orderDroidObj(e, DORDER_ATTACK, target[0]);}
				catch(e) {debugMsg("!!! "+e.message+' !!!', 'error');}
				var _deleted = nastyFeatures.shift(); // удаляем из глобальной переменной мусора (даже если атака будет неуспешной - не страшно, у нас есть nastyFeaturesClean();)
//				debugMsg(nastyFeatures.length+"/"+nastyFeaturesLen+' Delete trash '+_deleted.name+' at '+_deleted.x+'x'+_deleted.y, 'targeting');
				target = _target; // и возвращаем переменную целей
			}else{
//				debugMsg("Cyborgs attack "+target[0].name+" at "+target[0].x+"x"+target[0].y, 'targeting');
				orderDroidLoc(e, DORDER_SCOUT, target[0].x, target[0].y);
				if(nastyFeatures.length != 0 && enemy.length == 0) target = _target;
			}
		});
		return;
	}
	
}

function targetRegular(target){
	var regular = enumGroup(armyRegular);
	if(regular.length == 0) return false;
	if(typeof target === 'undefined') target = false;
	if(target) debugMsg("regular: event от армии "+distBetweenTwoPoints(target.x,target.y,regular[0].x,regular[0].y), 'targeting');
	if(target && !droidCanReach(regular[0],target.x,target.y )){
		debugMsg("regular: event не достежим", 'targeting');
		target = false;
	}
	if(targRegular.x == 0 && targRegular.y == 0 && !target){
		debugMsg("regular: Стандартный сбор у базы", 'targeting');
		targRegular = base;
	}
	
	var _reach = regular.filter(function(e){if(distBetweenTwoPoints(e.x,e.y,targRegular.x,targRegular.y) <= 7)return true;return false;});
	
	//Если армии более 40% на точке
	if( (_reach.length * 100 / regular.length) > 40 ){
		debugMsg("regular: Армия готова: сбор "+Math.floor(_reach.length * 100 / regular.length)+"%", 'targeting');
		if(target){
			debugMsg("regular: меняем цель на event "+distBetweenTwoPoints(target.x,target.y,regular[0].x,regular[0].y), 'targeting');
			targRegular = target;
//			targRegular.x = target.x;
//			targRegular.y = target.y;
		}
		else{
			target = getEnemyFactories();
			if(target.length != 0){
				debugMsg("regular: меняем цель на вражеский завод "+distBetweenTwoPoints(target[0].x,target[0].y,regular[0].x,regular[0].y), 'targeting');
				targRegular = target[0];
//				targRegular.x = target[0].x;
//				targRegular.y = target[0].y;
			}
		}
	}
	else{
		debugMsg("regular: Армия далеко от цели, собрано: "+Math.floor(_reach.length * 100 / regular.length)+"%", 'targeting');
		if(regular.length > 10){
			debugMsg("regular: Атака "+distBetweenTwoPoints(targRegular.x,targRegular.y,regular[0].x,regular[0].y), 'targeting');
			regular.forEach(function(e){orderDroidLoc(e, DORDER_SCOUT, targRegular.x, targRegular.y);});
		}else{
			debugMsg("regular: Сбор "+distBetweenTwoPoints(targRegular.x,targRegular.y,regular[0].x,regular[0].y), 'targeting');
			regular.forEach(function(e){orderDroidLoc(e, DORDER_SCOUT, regular[0].x,regular[0].y);});
		}
	}
	
}