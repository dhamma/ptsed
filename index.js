require("./ui/main");
require("./ui/nav");
require("./ui/dictionary");

const {ptsstore,dictstore}=require("./store");
const {open,parseCAP}=require("dengine");
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
			const cap=parseCAP("A_p1",db);
			dictstore.dispatch("setCap",cap);					
		})
	}
});
