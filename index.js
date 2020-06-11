require("./ui/main");
require("./ui/nav");
require("./ui/dictionary");

const {ptsstore,dictstore}=require("./store");
const {open,parseCAP,packintarr}=require("dengine");
const Component=require('./component');
new Vue({
	//store,
	el:"#app",
	state:Vuex.mapState(['cap'])
	,mounted(){
		open("pts",db=>{
			const cap=parseCAP("mv_p1",db);
			ptsstore.dispatch("setCap",cap);
		});
		open("ped",db=>{
			db.payload=db.payload.split("\n");
			db.extra.headwordx0=packintarr.unpack3(db.extra.headwordx0);
			const cap=parseCAP("K_p437",db);
			dictstore.dispatch("setCap",cap);					
		})
	}
});
