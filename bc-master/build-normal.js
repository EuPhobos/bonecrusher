

function mainBuilders(rotation){
	debugMsg('mainBuilders()', 'builders');
	
	var helped=0;
	var module=0;
	var build =0;
	var iter=0;
	var _b = enumGroup(buildersMain);
	//enumGroup(buildersMain).forEach( function(obj, iter){
	for (var i=0;i<_b.length;++i){
		var obj = _b[i];
		
		if(builderBusy(obj) == true) {
//			debugMsg(" Строитель занят "+i, 'builders');
//			return;
			continue;
		}
		
		if(resource_extractor_ready.length == 0 && power_gen_ready.length != 0){oilHunt(obj, true);continue;}
		
		//Модули на здания
		var safe = getInfoNear(base.x,base.y,'safe',(base_range/2)).value;
		if(safe && module < 1){
			if(playerPower(me) > 100 && (policy['build'] == 'standart' || (policy['build'] == 'cyborgs' && cyborg_factory_ready.length > 3) || policy['build'] == 'rich' || policy['build'] == 'island')){
				if(getResearch("R-Struc-Research-Module").done) { research_lab.forEach( function(e){ if(e.modules < 1){ orderDroidBuild_p(obj, DORDER_BUILD, "A0ResearchModule1", e.x, e.y);module++;}});}
				if(getResearch("R-Struc-Factory-Module").done) { factory.forEach( function(e){ if(e.modules < 1){ orderDroidBuild_p(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);module++;}});}
				if(getResearch("R-Struc-Factory-Module").done) { vtol_factory.forEach( function(e){ if(e.modules < 2){ orderDroidBuild_p(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);module++;}});}
				if(getResearch("R-Struc-Factory-Module").done && ( getResearch("R-Vehicle-Metals02").done && playerPower(me) > 700 )) { factory.forEach( function(e){ if(e.modules < 2){ orderDroidBuild_p(obj, DORDER_BUILD, "A0FacMod1", e.x, e.y);module++;}});}
			}
			
			if(getResearch("R-Struc-PowerModuleMk1").done) { power_gen.forEach( function(e){ if(e.modules < 1){ orderDroidBuild_p(obj, DORDER_BUILD, "A0PowMod1", e.x, e.y);module++;}});}
		}
		
		//ищем чего-бы достроить или починить
		if(helped < 1){
			var myBase = enumStruct(me);
			var _h=false;
			for ( var b in myBase ){
				if(distBetweenTwoPoints_p(base.x,base.y,myBase[b].x,myBase[b].y) > (base_range/2))continue;
				if(myBase[b].status == BEING_BUILT && myBase[b].stattype == RESOURCE_EXTRACTOR){continue;}
				if(myBase[b].status == BEING_BUILT) {orderDroidObj_p(obj, DORDER_HELPBUILD, myBase[b]); helped++; _h=true; break;}
				if(myBase[b].health < 100) {orderDroidObj_p(obj, DORDER_REPAIR, myBase[b]); helped++; _h=true; break;}
			}
			if(_h)continue;
		}

//		if( policy['build'] == 'rich' && (i-helped-module) > (_b.length/2)) {
		if( policy['build'] == 'rich' && build > 1 && groupSize(buildersMain) > Math.ceil(minBuilders/2)) {
			debugMsg('break iter='+i+', i-h-m='+(i-helped-module)+', l/2='+(_b.length/2)+', gs='+groupSize(buildersMain)+', minB='+Math.ceil(minBuilders/2), 'builders');
//			queue("buildersOrder", 1000);
			break;
		}
		
//		debugMsg('1 rigDefence', 'buildersbug');
		if(!safe)if(rigDefence(obj))continue;
		
//		debugMsg('policy build', 'buildersbug');
		if(policy['build'] == 'cyborgs'){
			if(research_lab_ready.length < 1) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(factory_ready.length == 0) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(power_gen_ready.length == 0) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(research_lab_ready.length < 3 && playerPower(me) > 400) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(hq_ready.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)){build++; continue;} }
			if( (power_gen_ready.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++;continue;} }
			if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 4 && playerPower(me) > 150) { if(builderBuild(obj, "A0CyborgFactory", rotation)){build++; continue;} }
			if(research_lab_ready.length < 4 && playerPower(me) > 300) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(power_gen.length < 4) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(factory_ready.length < 2 && playerPower(me) > 400) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			
		}else if(policy['build'] == 'rich'){
			if(research_lab.length < 2) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(factory.length < 1) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(factory.length < 2) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(power_gen.length == 0) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(research_lab.length < 3) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(power_gen.length < 3) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(research_lab.length < 4) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(power_gen.length < 4) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(hq.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)){build++; continue;} }
			if(power_gen.length < 5) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(factory.length < 3) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(research_lab.length < 5) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if( (power_gen.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++;continue;} }
		}else if(policy['build'] == 'island'){
			if(research_lab_ready.length < 3 && !getResearch("R-Vehicle-Prop-Hover").done) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(power_gen.length == 0) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(hq.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)){build++; continue;} }
			if(factory.length < 1) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if( (power_gen.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++;continue;} }
			if(factory.length < 2) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(research_lab.length < 5 && getResearch("R-Vehicle-Prop-Hover").done && playerPower(me) > 500) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
		}else {
			//Завод, лаборатория,генератор,ком-центр! - вот залог хорошего пионера!
			if(factory_ready.length < 1) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(factory.length == 1 && research_lab.length == 0){
				if(Math.round(Math.random())){ if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
				else {if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			}
			if(factory.length == 1){ if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }

			if(research_lab_ready.length < 1) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }

			//Ком центр
			if(hq_ready.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)){build++; continue;} }
			//Генератор энергии
			if(power_gen_ready.length <= 1) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++; continue;} }
			if(research_lab_ready.length < 3) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(factory_ready.length <= 4 && playerPower(me) > 500) { if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
			if(research_lab_ready.length < 4 && playerPower(me) > 400) { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
			if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 4 && playerPower(me) > 300) { if(builderBuild(obj, "A0CyborgFactory", rotation)){build++; continue;} }
			if( (power_gen_ready.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation)){build++;continue;} }
		}

//		debugMsg('other build', 'buildersbug');
		if(research_lab.length < 5 && playerPower(me) > 500 && policy['build'] != 'island') { if(builderBuild(obj, "A0ResearchFacility", rotation)){build++; continue;} }
		if(factory.length < 5 && playerPower(me) > 1200){ if(builderBuild(obj, "A0LightFactory", rotation)){build++; continue;} }
		if(isStructureAvailable("A0CyborgFactory") && cyborg_factory.length < 5 && playerPower(me) > 800 && nf['policy'] != 'island') { if(builderBuild(obj, "A0CyborgFactory", rotation)){build++; continue;} }
		
//		debugMsg('uplink build', 'buildersbug');
		if(isStructureAvailable("A0Sat-linkCentre") && uplink_center.length == 0) { if(builderBuild(obj, "A0Sat-linkCentre", rotation)){build++; continue;}  }
		
//		debugMsg(isStructureAvailable("A0VTolFactory1")+' '+vtol_factory_ready.length, "temp");
//		debugMsg('vtol build', 'buildersbug');
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory_ready.length < 1){
//			debugMsg('Build VTOL factory', "temp");
			if(builderBuild(obj, "A0VTolFactory1", rotation)){build++; continue;} 
		}
		if(isStructureAvailable("A0VtolPad") && rearm_pad_ready.length < Math.ceil(enumGroup(VTOLAttacker).length/2) && rearm_pad.length <= (maxPads-1)){ if(builderBuild(obj, "A0VtolPad", rotation)){build++; continue;} }
		
//		debugMsg('aa build', 'buildersbug');
		if(AA_build(obj, true)){build++; continue;}
						
//		debugMsg('other vtol build', 'buildersbug');
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory_ready.length < 2 && playerPower(me) > 500){ if(builderBuild(obj, "A0VTolFactory1", rotation)){build++; continue;} }
		if(isStructureAvailable("A0VtolPad") && playerPower(me) > 2000 && rearm_pad.length < enumGroup(VTOLAttacker).length && rearm_pad.length <= maxPads){ if(builderBuild(obj, "A0VtolPad", rotation)){build++; continue;} }
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory.length < 5 && playerPower(me) > 1000){ if(builderBuild(obj, "A0VTolFactory1", rotation)){build++; continue;} }
		
//		debugMsg("Строителям нечего строить "+iter, 'builders');
		
		
//		debugMsg('2 rigDefence', 'buildersbug');
		if(rigDefence(obj)) continue;
		
//		debugMsg('oilHunt', 'buildersbug');
		if(oilHunt(obj, true)) continue;

		//Если свободны, и далеко от базы - отправляем домой
//		if(distBetweenTwoPoints_p(base.x,base.y,obj.x,obj.y) > 10 && !builderBusy(obj)) { orderDroidLoc_p(obj,DORDER_MOVE,base.x,base.y); continue; }
//		debugMsg("Строители бездельничают "+iter, 'builders');
//		debugMsg(distBetweenTwoPoints_p(base.x,base.y,obj.x,obj.y)+'<=2 && '+groupSize(buildersHunters)+'<5 && '+getInfoNear(base.x,base.y,'safe',base_range).value+' && ( ( '+policy['build']+'==cyborgs && '+cyborg_factory_ready.length+'>2 ) || '+policy['build']+'!=cyborgs ) && '+policy['build']+'!=rich','buildersbug');
//		debugMsg(distBetweenTwoPoints_p(base.x,base.y,obj.x,obj.y)+'>2 && '+unitIdle(obj),'buildersbug');
		if(distBetweenTwoPoints_p(base.x,base.y,obj.x,obj.y) <= 2 && groupSize(buildersHunters) < 5 && groupSize(buildersMain) > 1 && getInfoNear(base.x,base.y,'safe',base_range).value 
			&& ( 
			( ( (policy['build'] == 'cyborgs' && cyborg_factory_ready.length > 2) || policy['build'] != 'cyborgs') && policy['build'] != 'rich' && policy['build'] != 'island' )
				|| ( (policy['build'] == 'island' && getResearch("R-Vehicle-Prop-Hover").done) || groupSize(buildersHunters) == 0) ) ){
			groupAddDroid(buildersHunters, obj);
			debugMsg('Builder --> Hunter +1', 'group');
		}else if(distBetweenTwoPoints_p(base.x,base.y,obj.x,obj.y) > 2 && unitIdle(obj)){
			orderDroidLoc_p(obj,DORDER_MOVE,base.x,base.y);
			continue;
		}
		

	}
}
