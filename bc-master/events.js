function eventResearched(research, structure) {
	
	debugMsg("Новая технология \""+research_name[research.name]+"\" ["+research.name+"]", 'research');
	prepeareProduce();
	queue("doResearch", 1000);
}

// Обязательно использовать
function eventDroidIdle(droid) {
	
	switch (droid.droidType) {
		case DROID_CYBORG:
			if(gameTime > eventsRun['targetCyborgs']){
				debugMsg("targetCyborgs", 'events');
				eventsRun['targetCyborgs'] = gameTime + 5000;
				targetCyborgs();
//				queue("targetPartisan", 1500);
			}
		break;
		case DROID_WEAPON:
			
			if(gameTime > eventsRun['targetArmy']){
				debugMsg("targetArmy", 'events');
				eventsRun['targetArmy'] = gameTime + 9000;
				targetPartisan();
				queue("targetRegular", 1000);
//				queue("targetCyborgs", 2000);
			}
			
		break;
		case DROID_CONSTRUCT:
			if(gameTime > eventsRun['buildersOrder']){
				debugMsg("buildersOrder", 'events');
				eventsRun['buildersOrder'] = gameTime + 2000;
				buildersOrder();
			}
		break;
		case DROID_SENSOR:
			// Ищем чего бы подсветить/разведать
		break;
		case DROID_ECM:
			if(gameTime > eventsRun['targetJammers']){
				debugMsg("targetJammers", 'events');
				eventsRun['targetJammers'] = gameTime + 5000;
				targetJammers();
			}
		break;
		case DROID_REPAIR:
			if(gameTime > eventsRun['targetFixers']){
				debugMsg("targetFixers", 'events');
				eventsRun['targetFixers'] = gameTime + 6000;
				targetFixers();
			}
		break;
	}
}

function eventObjectSeen(sensor, gameObject) {
	switch (gameObject.type) {
		case STRUCTURE:
		if (!allianceExistsBetween(me,gameObject.player)) {
//			debugMsg("eventObjectSeen: "+ sensor.name+" обнаружил вражеское строение: "+gameObject.name, 'events');
//			getTarget();
		}
		break;
		case DROID:
		if (!allianceExistsBetween(me,gameObject.player)) {
//			debugMsg("eventObjectSeen: "+ sensor.name+" обнаружил вражескую еденицу: "+gameObject.name, 'events');
//			getTarget();
			if(gameObject.droidType == DROID_WEAPON
				&& isFixVTOL(gameObject)
				&& distBetweenTwoPoints(gameObject.x,gameObject.y,base.x,base.y) < base_range)
				AA_queue.push({x:gameObject.x,y:gameObject.y});
		}
		break;
		case FEATURE:
//			debugMsg("eventObjectSeen: "+ sensor.name+" обнаружил FEATURE: "+gameObject.name, 'events');
//			getTarget();
			buildersOrder();
		break;
	}
}

//Если произошла передача от игрока к игроку
function eventObjectTransfer(gameObject, from) {
	debugMsg("I="+me+"; object '"+gameObject.name+"' getting to "+gameObject.player+" from "+from, 'transfer');
	
	if (gameObject.player == me) { // Что то получили
		if (allianceExistsBetween(me,from)) { // От союзника
			switch (gameObject.droidType) {
				case DROID_WEAPON:
					if(isVTOL(gameObject))groupAddDroid(VTOLAttacker,gameObject);
					groupArmy(gameObject);
					break;
				case DROID_CONSTRUCT:
					groupBuilders(gameObject);
					buildersOrder();
					if(running == false) queue("letsRockThisFxxxingWorld", 1000);
					break;
				case DROID_CYBORG:
					groupArmy(gameObject);
					break;
			}
		} else { // От врага, возможно перевербовка
			groupArmy(gameObject);

		}
	} else { // Что-то передали
		if (allianceExistsBetween(gameObject.player,from)) { // Союзнику
			
		} else { // Похоже наших вербуют!!!
			
		}
	}
}

//Срабатывает при завершении строительства здания
function eventStructureBuilt(structure, droid){
	
	buildersOrder();
	
	
	switch (structure.stattype) {
		case RESEARCH_LAB:
			queue("doResearch", 1000);
			if(difficulty != EASY && gameTime < 300000){
				//Ротация строителей в начале игры, для более быстрого захвата ресурсов на карте
				//Отключено в лёгком режиме
				factory = enumStruct(me, FACTORY);
				research_lab = enumStruct(me, RESEARCH_LAB);
//				power_gen = enumStruct(me, POWER_GEN);
//				power_gen_ready = power_gen.filter(function(e){if(e.status == 1)return true; return false;});
				factory_ready = factory.filter(function(e){if(e.status == 1)return true; return false;});
				research_lab_ready = research_lab.filter(function(e){if(e.status == 1)return true; return false;});
//				if( (factory_ready.length == 1 && research_lab_ready.length == 1) || power_gen_ready.length == 1)
				if(factory_ready.length == 2 && research_lab_ready.length == 1) 
					enumDroid(me, DROID_CONSTRUCT).forEach(function(e,i){if(i!=0){groupAddDroid(buildersHunters, e);debugMsg("FORCE "+i+" Builder --> Hunter +1", 'group');}});
			}
			
		break;
		case FACTORY:
			base.x = structure.x;
			base.y = structure.y;
			produceDroids();
		break;
		case CYBORG_FACTORY:
			produceCyborgs();
		break;
		case VTOL_FACTORY:
			produceVTOL();
		break;
		case HQ:
			prepeareProduce();
		break;
	}
	
}

//этот триггер срабатывает при выходе из завода нового свежего юнита.
function eventDroidBuilt(droid, structure) {
	
	debugMsg("eventDroidBuilt: droidType="+droid.droidType+", name="+droid.name, 'eventDroidBuilt');
	
	if(produceTrigger[structure.id]){
		var rem = produceTrigger.splice(structure.id, 1);
		debugMsg('BUILT: removed from '+structure.id+' '+rem, 'triggers');
		groupArmy(droid, rem);
		return;
	}

	switch (droid.droidType) {
		case DROID_WEAPON:
			break;
		case DROID_CONSTRUCT:
			groupBuilders(droid);
			queue("buildersOrder", 5000);
			break;
	}
	
	switch (structure.stattype) {
		case FACTORY:
			if(droid.droidType == DROID_WEAPON) groupArmy(droid);
			if(droid.droidType == DROID_REPAIR) groupArmy(droid);
//			if(droid.droidType == DROID_ECM) groupArmy(droid);
			produceDroids();
//			targetRegular();
			break;
		case CYBORG_FACTORY:
			if(droid.droidType == DROID_CYBORG) groupArmy(droid);
			produceCyborgs();
//			targetCyborgs();
			break;
		case VTOL_FACTORY:
			orderDroidLoc_p(droid, 40, base.x, base.y);
			groupAddDroid(VTOLAttacker, droid);
			produceVTOL();
//			targetVTOL();
			break;
	}
	
}
/*			if(gameTime > eventsRun['buildersOrder']){
				debugMsg("buildersOrder",'events');
				eventsRun['buildersOrder'] = gameTime + 10000;
				buildersOrder();
			}
*/


function eventAttacked(victim, attacker) {
	if(allianceExistsBetween(me, attacker.player)) return;
	
	//Если атака с самолёта рядом с базой, строим ПВО
	if(isFixVTOL(attacker) && distBetweenTwoPoints(victim.x,victim.y,base.x,base.y) < base_range) AA_queue.push({x:victim.x,y:victim.y});
	
	//Если атака по стратегическим точкам, направляем основную армию
	if(((victim.type == DROID && victim.droidType == DROID_CONSTRUCT) || (victim.type == STRUCTURE)) && gameTime > eventsRun['targetRegular']){
		eventsRun['targetRegular'] = gameTime + 5000;
		targetRegular(attacker);
	}
	
	//Если атака по армии, отводим атакованного
	if(victim.type == DROID && victim.droidType == DROID_WEAPON && !isFixVTOL(victim)){
		
		if(version == "3.2"){
			var w = victim.weapons[0].name;
//			debugMsg("weapon name: "+w+", id="+victim.weapons[0].id, 'triggers');
			w = getWeaponInfo(w).impactClass;
//			for ( var prop in w)
//			debugMsg("Weapon: "+prop,'triggers');
			debugMsg("weapon class: "+w, 'triggers');
			if(w == "HEAT") return;
		}
		
		orderDroidLoc_p(victim, DORDER_MOVE, base.x, base.y);
	}
	
	//Если атака по киборгам, ответный огонь ближайшими киборгами
	if(victim.type == DROID && victim.droidType == DROID_CYBORG && !isFixVTOL(victim) && gameTime > eventsRun['victimCyborgs']) {
		eventsRun['victimCyborgs'] = gameTime + 10000;
		var cyborgs = enumGroup(armyCyborgs);
		cyborgs.forEach(function(e){
			if(distBetweenTwoPoints(e.x,e.y,attacker.x,attacker.y) < 10)
//			orderDroidLoc_p(e, DORDER_SCOUT, {x:attacker.x,y:attacker.y});
			orderDroidObj_p(e, DORDER_ATTACK, attacker);
		});
	}
	
}

function eventDestroyed(obj){
	if(obj.type == STRUCTURE && obj.stattype == FACTORY){
		if(produceTrigger[obj.id]){
			var rem = produceTrigger.splice(obj.id, 1);
			debugMsg('DESTROYED: removed from '+obj.id+' '+rem, 'triggers');
		}
	}
}

function eventChat(sender, to, message) {
	if(sender != me)
	if(allianceExistsBetween(me, sender))
	if(message.substr(0,3) == "bc ")
	switch (message.substr(3)){
		case "wgr":
			setResearchWay("Green");
			chat(sender, "Goind to Green way");
			break;
		case "wor":
			setResearchWay("Orange");
			chat(sender, "Goind to Orange way");
			break;
		case "wyl":
			setResearchWay("Yellow");
			chat(sender, "Goind to Yellow way");
			break;
		case "wrd":
			setResearchWay("Red");
			chat(sender, "Goind to Red way");
			break;
		case "btm":
			chat(sender, "My position base to you at "+startPositions[sender].x+"x"+startPositions[sender].y);
			base.x = startPositions[sender].x;
			base.y = startPositions[sender].y;
			break;
		case "gmn":
			chat(sender, "I have "+playerPower(me));
			if(playerPower(me)>500){
				donatePower(Math.floor(playerPower(me)/2), sender);
				chat(sender, "Remained "+playerPower(me)+" power");
			}
			else
				chat(sender, "My power is to low");
			break;
		case "gtn":
			if(groupSize(buildersMain) == 0)
				chat(sender, "I do not have free Trucks");
			else{
				chat(sender, "Here my new shiny Truck");
				var truck = enumGroup(buildersMain)[0];
				donateObject(truck, sender);
			}
			break;
	}
	else
	chat(sender, "You say: "+message+", what?");
	
}
