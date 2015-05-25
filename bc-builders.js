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
