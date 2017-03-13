function eventResearched(research, structure) {
	
	debugMsg("Новая технология \""+research_name[research.name]+"\" ["+research.name+"]", 'research');
	prepeareProduce();
	queue("doResearch", 1000);
}

// Обязательно использовать
function eventDroidIdle(droid) {
	
	switch (droid.droidType) {
		case DROID_CYBORG:
//			if(gameTime > eventsRun['targetCyborgs']){
//				debugMsg("targetCyborgs",'events');
//				eventsRun['targetCyborgs'] = gameTime + 1000;
				targetCyborgs();
//			}
		break;
		case DROID_WEAPON:
//			getTarget();
		break;
		case DROID_CONSTRUCT:
			if(gameTime > eventsRun['buildersOrder']){
				debugMsg("buildersOrder",'events');
				eventsRun['buildersOrder'] = gameTime + 1000;
				buildersOrder();
			}
		break;
		case DROID_SENSOR:
			// Ищем чего бы подсветить/разведать
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
			debugMsg("eventObjectSeen: "+ sensor.name+" обнаружил FEATURE: "+gameObject.name, 'events');
//			getTarget();
			buildersOrder();
		break;
	}
}

//Если произошла передача от игрока к игроку
function eventObjectTransfer(gameObject, from) {
	
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
		break;
		case FACTORY:
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
			produceDroids();
			targetRegular();
			break;
		case CYBORG_FACTORY:
			if(droid.droidType == DROID_CYBORG) groupArmy(droid);
			produceCyborgs();
			targetCyborgs();
			break;
		case VTOL_FACTORY:
			orderDroidLoc(droid, 40, base.x, base.y);
			groupAddDroid(VTOLAttacker, droid);
			produceVTOL();
//			targetVTOL();
			break;
	}
	
}

function eventAttacked(victim, attacker) {
	if(isFixVTOL(attacker) && distBetweenTwoPoints(victim.x,victim.y,base.x,base.y) < base_range) AA_queue.push({x:victim.x,y:victim.y});
	if((victim.type == DROID && victim.droidType == DROID_CONSTRUCT) || (victim.type == STRUCTURE) ) targetRegular(attacker);
	if(victim.type == DROID && victim.droidType == DROID_WEAPON && !isFixVTOL(victim)) orderDroidLoc(victim, DORDER_MOVE, base.x, base.y);
}