

function groupBuilders(droid){
	if ( typeof order === "undefined" ) order = false;
	var buildersMainLen = groupSize(buildersMain);
	var buildersHuntersLen = groupSize(buildersHunters);
	
	//распределяем строителей по группам
	if ( droid ) {
		//Если основных строителей меньше двух, то добавляем новичка в группу основных строителей
		if ( buildersMainLen < 2 ) { groupAddDroid(buildersMain, droid); debugMsg("groupBuilders(): +1 buildersMain"); } 
		//Если нет строителей-охотников, то добавляем к ним новичка
		else if (buildersHuntersLen < 1) { groupAddDroid(buildersHunters, droid);  debugMsg("groupBuilders(): +1 buildersHunters");}
		//Держим такой баланс в группе: строителей на 1 больше чем строителей-охотников
		else if (buildersMainLen < (buildersHuntersLen+1)) { groupAddDroid(buildersMain, droid); debugMsg("groupBuilders(): +1 buildersMain"); } 
		else { groupAddDroid(buildersHunters, droid); debugMsg("groupBuilders(): +1 buildersHunters"); }
	}
}


//Подсчитываем постройки на базе
var factory, power_gen, resource_extractor, research_lab, hq, cyborg_factory, vtol_factory;
function checkBase(){
	factory = enumStruct(me, FACTORY);
	power_gen = enumStruct(me, POWER_GEN);
	resource_extractor = enumStruct(me, RESOURCE_EXTRACTOR);
	research_lab = enumStruct(me, RESEARCH_LAB);
	hq = enumStruct(me, HQ);
	cyborg_factory = enumStruct(me, CYBORG_FACTORY);
	vtol_factory = enumStruct(me, VTOL_FACTORY);
	
	factory_ready = factory.filter(function(e){if(e.status == 1)return true; return false;});
	power_gen_ready = power_gen.filter(function(e){if(e.status == 1)return true; return false;});
	resource_extractor_ready = resource_extractor.filter(function(e){if(e.status == 1)return true; return false;});
	research_lab_ready = research_lab.filter(function(e){if(e.status == 1)return true; return false;});
	hq_ready = hq.filter(function(e){if(e.status == 1)return true; return false;});
	cyborg_factory_ready = cyborg_factory.filter(function(e){if(e.status == 1)return true; return false;});
	vtol_factory_ready = vtol_factory.filter(function(e){if(e.status == 1)return true; return false;});
	
	
	debugMsg("checkBase(): factory="+factory_ready.length+"/"+factory.length
	+"; power_gen="+power_gen_ready.length+"/"+power_gen.length
	+"; resource_extractor="+resource_extractor_ready.length+"/"+resource_extractor.length
	+"; research_lab="+research_lab_ready.length+"/"+research_lab.length
	+"; cyborg_factory="+cyborg_factory_ready.length+"/"+cyborg_factory.length
	+"; hq="+hq_ready.length+"/"+hq.length
	+"; vtol_factory="+vtol_factory_ready.length+"/"+vtol_factory.length
	);
/*
	research_lab.forEach( function(e,i){
		debugMsg("checkBase(): lab["+i+"] status:"+e.status );
	});
*/
}

//Строим базу
function builderBuild(droid, structure, rotation){
	var struct;
	switch(structure){
		case "A0LightFactory":struct = factory; break;
		case "A0ResearchFacility":struct = research_lab; break;
		case "A0PowerGenerator":struct = power_gen; break;
		case "A0CommandCentre":struct = hq; break;
		case "A0CyborgFactory":struct = cyborg_factory; break;
//		case "A0ResourceExtractor":struct = resource_extractor; break;
//		default: return false;
	}
	var stop=false;
	//Проверяем, если заданное здание уже кем-либо заложено и строится, просто едем помочь достроить
	if ( struct.length != 0 ){struct.forEach( function (obj){
		debugMsg("builderBuild(): name="+obj.name+"; status="+obj.status);
		if(obj.status == 0) { orderDroidObj(droid, DORDER_HELPBUILD, obj); stop=true; return true;}
	});}
	if ( stop ) return true;
	
	//Строим новое здание
	if (isStructureAvailable(structure, me)){
		var pos = pickStructLocation(droid,structure,p_start.x,p_start.y);
		if (!!pos) {
			debugMsg("Строю: ("+pos.x+","+pos.y+") ["+structure+"]",3);
			orderDroidBuild(droid, DORDER_BUILD, structure, pos.x, pos.y, rotation);
			return true;
		}else{
			debugMsg("WARNING: Не найдено подходящей площадки для постройки",1);
			return false;
		}
	}else{
			debugMsg("WARNING: ["+structure+"] - строение не доступно",1);
			return false;
	}
}

/*
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
*/

//Главная функция строителей
var defence = [];
function buildersOrder(order) {
	if ( typeof order === "undefined" ) order = false;
	var rnd = Math.round(Math.random());
	var rotation = 90;
	if (rnd == 1)rotation = 180; // ...аа для прикола.
	checkBase(); // <-- подсчитываем количество строений на базе
	var buildersMainLen = groupSize(buildersMain);
	var buildersHuntersLen = groupSize(buildersHunters);
	debugMsg("buildersOrder(): buildersMainLen="+buildersMainLen+"; buildersHuntersLen="+buildersHuntersLen+"; rnd="+rnd+"; rotation="+rotation+"; order="+order);
	if ( buildersHuntersLen < 2 ) need_builder = true;
	
	oil_targets = enumFeature(me, "OilResource");
	var oil_free = oil_targets; //для дебага
	var oil_unknown = getUnknownResources();
	oil_targets = oil_targets.concat(oil_unknown);
	oil_enemy = getEnemyResources();
	debugMsg("buildersOrder: видимых свободных ресурсов="+oil_free.length+", неизвестных="+oil_unknown.length+", вражеских="+oil_enemy.length+", цели="+oil_targets.length);
//	oil_targets.forEach( function(e,i) { debugMsg("#"+i+" "+e.id+" "+e.name+" "+e.type+" "+e.player+" "+e.x+"x"+e.y); } );
	
	//назначаем задания основным строителям
	if(buildersMainLen != 0){enumGroup(buildersMain).forEach( function(obj, iter){
		if(builderBusy(obj) == true) {debugMsg("buildersOrder(): Строитель занят "+iter);return;}

		
		//Модули на здания
		if(getResearch("R-Struc-Factory-Module").done && iter <=3) { factory.forEach( function(e){ if(e.modules < 1) orderDroidBuild(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);});}
		if(getResearch("R-Struc-Factory-Module").done && getResearch("R-Vehicle-Metals02").done && iter <=3) { factory.forEach( function(e){ if(e.modules < 2) orderDroidBuild(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);});}
		if(getResearch("R-Struc-PowerModuleMk1").done && iter <= 2) { power_gen.forEach( function(e){ if(e.modules < 1) orderDroidBuild(obj, DORDER_BUILD, "A0PowMod1", e.x, e.y);});}
		if(getResearch("R-Struc-Research-Module").done && iter <= 1) { research_lab.forEach( function(e){ if(e.modules < 1) orderDroidBuild(obj, DORDER_BUILD, "A0ResearchModule1", e.x, e.y);});}

		//Если строители свободны, ищем чего-бы достроить или починить
		var myBase = enumStruct(me);
		for ( var b in myBase ){
			if(getDistance(myBase[b]) > base_range)continue;
			if(myBase[b].status == BEING_BUILT) {orderDroidObj(obj, DORDER_HELPBUILD, myBase[b]); return;}
			if(myBase[b].health < 100) {orderDroidObj(obj, DORDER_REPAIR, myBase[b]); return;}
		}
		
		//Завод, лаборатория,генератор,ком-центр! - вот залог хорошего пионера!
		if(factory_ready.length == 0) { builderBuild(obj, "A0LightFactory", rotation); return; }
		else if(research_lab_ready.length < 1) { builderBuild(obj, "A0ResearchFacility", rotation); return; }
		//Генератор энергии
		else if(power_gen_ready.length == 0) { builderBuild(obj, "A0PowerGenerator", rotation); return; }
		//Ком центр
		else if(hq_ready.length == 0) { builderBuild(obj, "A0CommandCentre", rotation); return; }
		else if(research_lab_ready.length < 2) { builderBuild(obj, "A0ResearchFacility", rotation); return; }
		else if( (power_gen_ready.length * 4) <= resource_extractor.length && (power_gen.length < max_power) ) { builderBuild(obj, "A0PowerGenerator", rotation); return; }
		else if(factory_ready.length < 2 && my_money > 300) { builderBuild(obj, "A0LightFactory", rotation); return; }
		else if(research_lab_ready.length < 3 && my_money > 300) { builderBuild(obj, "A0ResearchFacility", rotation); return; }
		else if(factory_ready.length < 3 && my_money > 800) { builderBuild(obj, "A0LightFactory", rotation); return; }
		else if(research_lab_ready.length < 4 && my_money > 500) { builderBuild(obj, "A0ResearchFacility", rotation); return; }
		else if(research_lab_ready.length < 5 && my_money > 1000) { builderBuild(obj, "A0ResearchFacility", rotation); return; }
		else if(factory_ready.length < 5 && my_money > 1000){ builderBuild(obj, "A0LightFactory", rotation); return; }
		else if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length == 0 && my_money > 300) { builderBuild(obj, "A0CyborgFactory", rotation); return; }
		else if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 5 && my_money > 1000) { builderBuild(obj, "A0CyborgFactory", rotation); return; }
//		else { debugMsg("buildersOrder: Строителям нефиг делать"); }
		
		

		
		if(oilHunt(obj, true)) return;
		
		//Если свободны, и далеко от базы - отправляем домой
		if(getDistance(obj) > base_range) { orderDroidLoc(obj,DORDER_MOVE,p_start.x,p_start.y); return; }
		
//		if(rigDefence(obj, true)) return;

		debugMsg("buildersOrder(): Строители бездельничают "+iter);
		
		
	});}else{
		debugMsg("Нет строителей в группе buildersMain");
	}
	
	//Назначаем работу строителям-охотникам
	if(buildersHuntersLen != 0){
		/*
		if ( oil_targets.length == 0 ) { // Если нет целей для разведки или захвата ресурсов
			for ( var h in hunters) {if(!builderBusy(hunters[h])){
				if(rigDefence(hunters[h])) continue;
				orderDroidLoc(hunters[h],DORDER_MOVE,p_start.x,p_start.y);
			}}
			return;
		}
		*/
		var hunters = enumGroup(buildersHunters);
		for ( var h in hunters) {
			var huntOnDuty = oilHunt(hunters[h]);
			debugMsg("buildersOrder: Строитель-охотник №"+hunters[h].id+" на службе? "+huntOnDuty);
			if(huntOnDuty === false) huntOnDuty = rigDefence(hunters[h]);
			if(huntOnDuty === false) if(!builderBusy(hunters[h])) orderDroidLoc(hunters[h],DORDER_MOVE,p_start.x,p_start.y);
		}
	}
}

//Функция постройка защиты у ресурса
function rigDefence(obj){
	debugMsg("rigDefence(): "+defQueue.length);
	if(defQueue.length == 0) return false; //Очередь для постройки защиты
	if(defence.length == 0) return false; //Количество возможных защитных башен исследовано
	var toBuild = defence[Math.floor(Math.random()*defence.length)];
	defQueue = sortByDistance(defQueue,obj,0);
	debugMsg("rigDefence(): Строителем №"+obj.id+" строим "+toBuild+" "+defQueue[0].x+"x"+defQueue[0].y);
	var pos = pickStructLocation(obj,toBuild,defQueue[0].x+Math.round(Math.random()*2-1), defQueue[0].y+Math.round(Math.random()*2-1));
	if(!!pos && !builderBusy(obj)){
		orderDroidBuild(obj, DORDER_BUILD, toBuild, pos.x, pos.y, 0);
		defQueue = defQueue.slice(1)
		return true;
	}
	debugMsg("rigDefence(): Отмена");
}

//Составляем очередь на постройку защитный сооружений
var defQueue = [];
function defenceQueue(){
	var myDefence = enumStruct(me,DEFENSE);
	var myFarRigs = enumStruct(me,RESOURCE_EXTRACTOR).filter(function(e){if(getDistance(e) > 20) return true; return false;});
	var enemyRigs = getEnemyResources();
	var enQueue = [];
	//Добавляем в очередь все координаты, где наши качалки без защитных сооружений
	if (myFarRigs.length >= 3) {
		defQueue = myFarRigs.filter(
			function(e){
				if(myDefence.length==0) return true; //Если защитных сооружений вообще нет, добавляем все координаты всех наших качалок
				for (var i in myDefence){
					if (distBetweenTwoPoints(e.x,e.y,myDefence[i].x,myDefence[i].y) < 7) return false; //Если к качалке есть близко на 7 тайлов защита, пропускаем
				}
				return true; //Добавляем координаты к очереди
			}
		);
		
		var enQueue = enemyRigs.filter(
			function(e){
				if(myDefence.length==0) return true; //Если защитных сооружений вообще нет, добавляем все координаты всех наших качалок
				for (var i in myDefence){
					if (distBetweenTwoPoints(e.x,e.y,myDefence[i].x,myDefence[i].y) < 7) return false; //Если к качалке есть близко защита, пропускаем
				}
				return true; //Добавляем координаты к очереди
			}
		);
		//Тут можно ещё накидать
		//if(enQueue.length != 0) Object.assign(defQueue,enQueue); //Похоже Object.assign не работает тут.
	}
	debugMsg("defenceQueue(): Защитных башен="+myDefence.length+", отдалённых качалок="+myFarRigs.length+", типы башен="+defence.length+", к постройке="+defQueue.length);
	defQueue=defQueue.concat(enQueue);
	debugMsg("defenceQueue(): вражеских="+enQueue.length+", итого="+defQueue.length);
}

var oil_targets, oil_enemy;
function oilHunt(obj, nearbase){
	if ( typeof nearbase === "undefined" ) nearbase = false;
	if(oil_targets.length == 0) { debugMsg("oilHunt(): Цели закончились, возврат на базу"); orderDroidLoc(obj,DORDER_MOVE,p_start.x,p_start.y); return false; }
	if (builderBusy(obj)) return false;
	var myDefence = enumStruct(me,DEFENSE);

	//Если строитель рядом с вражеским ресурсом
	if(defQueue.length != 0 && defence.length != 0) {
	for ( var i in oil_enemy ) {if(distBetweenTwoPoints(oil_enemy[i].x,oil_enemy[i].y,obj.x,obj.y) <= 15){
		var toBuild = defence[Math.floor(Math.random()*defence.length)];
		var pos = pickStructLocation(obj,toBuild,oil_enemy[i].x+Math.round(Math.random()*2-1), oil_enemy[i].y+Math.round(Math.random()*2-1));
		if(!!pos && !builderBusy(obj)){
			orderDroidBuild(obj, DORDER_BUILD, toBuild, pos.x, pos.y, 0);
			debugMsg("oilHunt(): Строим вышку у вражеского ресурса");
			return true;
		}
	}}}
	
	//Если строитель рядом с ресурсом
	for(var i in oil_targets){if(distBetweenTwoPoints(oil_targets[i].x,oil_targets[i].y,obj.x,obj.y) <= 15){
		if ( typeof oil_targets[i] === "undefined" ) { debugMsg("ERROR in oilHunt(): Выход за пределы массива, исправить!"); break;}
		if(oil_targets[i].type == FEATURE){
			orderDroidBuild(obj,DORDER_BUILD,"A0ResourceExtractor",oil_targets[i].x,oil_targets[i].y);
			debugMsg("oilHunt(): Захват ресурса строителем №"+obj.id);
			oil_targets.splice(i,1);
			return true;
		}else{
			debugMsg("oilHunt(): Разведка строителем #"+obj.id+" на ближайшую неизвестную "+oil_targets[i].x+"x"+oil_targets[i].y+" "+i+"/"+oil_targets.length+" "
			+oil_targets[i].name+","+oil_targets[i].type+","+oil_targets[i].player);
			orderDroidLoc(obj,DORDER_MOVE,oil_targets[i].x,oil_targets[i].y);
			oil_targets.splice(i,1);
			return true;
		}
	}}

	
	oil_targets = sortByDistance(oil_targets,obj,0,true);
	if(nearbase) if ( getDistance(oil_targets[0]) > base_range ) return false; //Запрещаем основным строителям далеко отходить от базы
	orderDroidLoc(obj,DORDER_MOVE,oil_targets[0].x,oil_targets[0].y); //"A0ResourceExtractor"
	debugMsg("oilHunt() двигаем строителем #"+obj.id+" к "+oil_targets[0].name+","+oil_targets[0].type+","+oil_targets[0].player+", поз.: "+oil_targets[0].x+"x"+oil_targets[0].y+" "+oil_targets.length);
//	if(oil_targets.length > 1) 
	oil_targets = oil_targets.slice(1);
	return true;
}










/*

function findRig() {
	var myBuilders = new Array();
	var myMainBuilders = new Array();
	var myHelpBuilders = new Array();

	myMainBuilders = enumDroid(me, DROID_CONSTRUCT);
	myHelpBuilders = enumDroid(me, 10);

	var seeResources = getSeeResources();
//	var unkResources = getUnknownResources();

	seeResources = sortByDistance(seeResources,base,null);


	for ( var m = 0, len = myMainBuilders.length; m < len; ++m ) {
		if ( m >= seeResources.length ) break;
		if ( !builderBusy(myMainBuilders[m]) ){
//			if ( ) 
		}
	}
}
*/