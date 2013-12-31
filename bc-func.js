
function isBeingRepaired(who){
	if ( typeof who === "undefined" ) {
		debugMsg("Атакующий неизвестен",5);
		return false;
	}

	if ( allianceExistsBetween(me, who.player) ) {
		debugMsg("Атакующий мой союзник, прощаю",5);
		return false;
	}

	switch ( who.type ) {
		case DROID: {
			debugMsg("Нас атаковал вражеский дроид ["+who.player+"]",5);
			return false;
			break; 
		}
		case STRUCTURE: {
			debugMsg("Нас атакует вражесая башня ["+who.player+"]",5);
			droids = enumDroid(who.player,DROID_CONSTRUCT,me);
			if ( droids.length != 0 ) {
				for ( var i in droids ) {
					if ( distBetweenTwoPoints(who.x,who.y,droids[i].x,droids[i].y) < 2 ) {
						debugMsg("Атакующая меня башня подвергается ремонту!",5);
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
