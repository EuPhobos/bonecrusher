
var perfOrder=[];
var perfCommands=0;
/*
function orderDroidObj_p(who, order, obj){
	var result = orderDroidObj(who, order, obj);
	if (typeof perfOrder[droidTypes[who.droidType]+'_'+droidOrders[order]] != 'number'){
		debugMsg(perfOrder[droidTypes[who.droidType]+'->'+droidOrders[order]], 'performance');
		perfOrder[droidTypes[who.droidType]+'->'+droidOrders[order]]=1;
		debugMsg(droidTypes[who.droidType]+'->'+droidOrders[order]+'->'+obj.type+'('+obj.x+'x'+obj.y+')', 'performance');
	}
	else {
		debugMsg('Obj-else', 'performance');
		perfOrder[droidTypes[who.droidType]+'->'+droidOrders[order]]++;
	}
	return result;
}
*/

function orderDroidObj_p(who, order, obj){
	var type_order = droidTypes[who.droidType]+'_'+droidOrders[order];
	var orders = perfOrder[type_order];
	
	if (typeof orders != 'number'){
		orders = 1;
	}
	else {
//		debugMsg('Obj-else', 'performance');
		orders++;
	}
	
	if(!release)perfOrder[type_order] = orders;
	var result = orderDroidObj(who, order, obj);
	return result;
}

function orderDroidLoc_p(who, order, x, y){
	var type_order = droidTypes[who.droidType]+'_'+droidOrders[order];
	var orders = perfOrder[type_order];
	
	if (typeof orders != 'number'){
		orders = 1;
	}
	else {
//		debugMsg('Loc-else', 'performance');
		orders++;
	}
	
	if(!release)perfOrder[type_order] = orders;
	var result = orderDroidLoc(who, order, x, y);
	return result;
}

function orderDroidBuild_p(who, order, building, x, y, rotation){
	var type_order = droidTypes[who.droidType]+'_'+droidOrders[order];
	var orders = perfOrder[type_order];

	if (typeof orders != 'number'){
		orders = 1;
	}
	else {
		orders++;
	}
	
	if(!release)perfOrder[type_order] = orders;
	var result = orderDroidBuild(who, order, building, x, y, rotation);
	return result;

}

function perfMonitor(){
	if(!running)return;
	if(Object.keys(perfOrder).length != 0){
		var pout=[];
		Object.keys(perfOrder).map(function(k, i) {
			pout += "\n"+i+": "+k+"="+perfOrder[k];
		});
		debugMsg(pout, 'performance');
		perfOrder=[];
	}
}
