'use strict';
require("./ui/main");
require("./ui/nav");
require("./ui/dictionary");

const {ptsstore,dictstore}=require("./store");
const {open,parseCAP,packintarr}=require("pengine");
new Vue({
	//store,
	el:"#app",
	state:Vuex.mapState(['cap'])
	,mounted(){
		open("pts",db=>{
			const cap=parseCAP("mv_1",db);
			ptsstore.dispatch("setCap",cap);
		});
			
		open("sc0ped",db=>{
			db.payload=db.payload.split("\n");
			db.extra.headwordx0=packintarr.unpack3(db.extra.headwordx0);
			const cap=parseCAP("C_136",db);
			dictstore.commit("updateCap",cap); //no display, for user guide
			//dictstore.commit("setCap",cap);  //display 	
		})
	}
});
