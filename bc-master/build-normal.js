

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
			if(playerPower(me) > 100 && policy['build'] == 'standart' || (policy['build'] == 'cyborgs' && cyborg_factory_ready.length > 3)){
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
				if(distBetweenTwoPoints(base.x,base.y,myBase[b].x,myBase[b].y) > (base_range/2))continue;
				if(myBase[b].status == BEING_BUILT && myBase[b].stattype == RESOURCE_EXTRACTOR){continue;}
				if(myBase[b].status == BEING_BUILT) {orderDroidObj(obj, DORDER_HELPBUILD, myBase[b]); helped++; return;}
				if(myBase[b].health < 100) {orderDroidObj(obj, DORDER_REPAIR, myBase[b]); helped++; return;}
			}
		}
		
		if(policy['build'] == 'cyborgs'){
			if(research_lab_ready.length < 1) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
			if(factory_ready.length == 0) { if(builderBuild(obj, "A0LightFactory", rotation)) return; }
			if(power_gen_ready.length == 0) { if(builderBuild(obj, "A0PowerGenerator", rotation)) return; }
			if(research_lab_ready.length < 3 && playerPower(me) > 400) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
			if(hq_ready.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)) return; }
			if( (power_gen_ready.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation))return;}
			if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 4 && playerPower(me) > 150) { if(builderBuild(obj, "A0CyborgFactory", rotation)) return; }
			if(research_lab_ready.length < 4 && playerPower(me) > 300) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
			if(power_gen.length < 4) { if(builderBuild(obj, "A0PowerGenerator", rotation)) return; }
			if(factory_ready.length < 2 && playerPower(me) > 400) { if(builderBuild(obj, "A0LightFactory", rotation)) return; }
			
		}else{
			//Завод, лаборатория,генератор,ком-центр! - вот залог хорошего пионера!
			if(factory_ready.length <= 1) { if(builderBuild(obj, "A0LightFactory", rotation)) return; }
			if(research_lab_ready.length < 1) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
			//Ком центр
			if(hq_ready.length == 0) { if(builderBuild(obj, "A0CommandCentre", rotation)) return; }
			//Генератор энергии
			if(power_gen_ready.length <= 1) { if(builderBuild(obj, "A0PowerGenerator", rotation)) return; }
			if(research_lab_ready.length < 3) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
			if(factory_ready.length <= 4 && playerPower(me) > 500) { if(builderBuild(obj, "A0LightFactory", rotation)) return; }
			if(research_lab_ready.length < 4 && playerPower(me) > 400) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
			if(isStructureAvailable("A0CyborgFactory") && cyborg_factory_ready.length < 4 && playerPower(me) > 300) { if(builderBuild(obj, "A0CyborgFactory", rotation)) return; }
			if( (power_gen_ready.length * 4) <= resource_extractor.length && (power_gen.length < getStructureLimit("A0PowerGenerator")) ) { if(builderBuild(obj, "A0PowerGenerator", rotation))return;}
		}
		if(research_lab.length < 5 && playerPower(me) > 500) { if(builderBuild(obj, "A0ResearchFacility", rotation)) return; }
		if(factory.length < 5 && playerPower(me) > 1500){ if(builderBuild(obj, "A0LightFactory", rotation)) return; }
		if(isStructureAvailable("A0CyborgFactory") && cyborg_factory.length < 5 && playerPower(me) > 800) { if(builderBuild(obj, "A0CyborgFactory", rotation)) return; }
		
		if(isStructureAvailable("A0Sat-linkCentre") && uplink_center.length == 0) { if(builderBuild(obj, "A0Sat-linkCentre", rotation)) return;  }
		
//		debugMsg(isStructureAvailable("A0VTolFactory1")+' '+vtol_factory_ready.length, "temp");
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory_ready.length < 1){
//			debugMsg('Build VTOL factory', "temp");
			if(builderBuild(obj, "A0VTolFactory1", rotation)) return; 
		}
		if(isStructureAvailable("A0VtolPad") && rearm_pad_ready.length < Math.ceil(enumGroup(VTOLAttacker).length/2) && rearm_pad.length <= (maxPads-1)){ if(builderBuild(obj, "A0VtolPad", rotation)) return; }
		
		if(AA_build(obj, true)) return;
									
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory_ready.length < 2 && playerPower(me) > 500){ if(builderBuild(obj, "A0VTolFactory1", rotation)) return; }
		if(isStructureAvailable("A0VtolPad") && playerPower(me) > 2000 && rearm_pad.length < enumGroup(VTOLAttacker).length && rearm_pad.length <= maxPads){ if(builderBuild(obj, "A0VtolPad", rotation)) return; }
		if(isStructureAvailable("A0VTolFactory1") && vtol_factory.length < 5 && playerPower(me) > 1000){ if(builderBuild(obj, "A0VTolFactory1", rotation)) return; }
		
//		debugMsg("Строителям нечего строить "+iter, 'builders');
		

		
		if(oilHunt(obj, true)) return;
		if(rigDefence(obj)) return;

		//Если свободны, и далеко от базы - отправляем домой
//		if(distBetweenTwoPoints(base.x,base.y,obj.x,obj.y) > 10 && !builderBusy(obj)) { orderDroidLoc(obj,DORDER_MOVE,base.x,base.y); return; }
//		debugMsg("Строители бездельничают "+iter, 'builders');
		if(iter != 0 && distBetweenTwoPoints(base.x,base.y,obj.x,obj.y) <= 2 && groupSize(buildersHunters) < 5 && getInfoNear(base.x,base.y,'safe',base_range).value 
			&& ( (policy['build'] == 'cyborgs' && cyborg_factory_ready.length > 3) || policy['build'] != 'cyborgs') ){
			groupAddDroid(buildersHunters, obj);
			debugMsg('Builder --> Hunter +1', 'group');
		}else if(distBetweenTwoPoints(base.x,base.y,obj.x,obj.y) > 2 && unitIdle(obj)){
			orderDroidLoc(obj,DORDER_MOVE,base.x,base.y);
			return;
		}
		
		
	});
}
