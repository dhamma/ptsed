'use strict';
const {readlines,parseCAP}=require("pengine")
const _state = {
  cap:null,
  texts:[]
} 
const _state2={
	cap:null,
	texts:[]
}
const mutations = {
 updateCap: (state, newcap) => state.cap=newcap
 ,updateTexts: (state,texts) =>state.texts=texts
}

const getters = {
 cap: state => state.cap
 ,capstr:state=> state.cap?state.cap.stringify():''
 ,texts: state=>state.texts
}
const actions = {
 setCap: ({commit,state},cap)=>{
 	if (typeof cap=="string" || typeof cap=="number") {
 		cap=parseCAP(cap,state.cap.db);
 	}
 	if (!cap) return;
 	readlines(cap.db,cap.x0-cap.x,cap._w,(texts)=>{
 		commit("updateCap",cap)
 		commit("updateTexts",texts)
 	})
 }
 ,nextp: ({dispatch,state}) => {
 	const newcap=state.cap.nextp();
 	dispatch("setCap",newcap);
 }
 ,prevp: ({dispatch,state}) => {
 	const newcap=state.cap.prevp();
 	dispatch("setCap",newcap);
 }
}
const ptsstore = new Vuex.Store({
 state:_state,
 getters, mutations, actions
})

const dictstore = new Vuex.Store({
 state:_state2,
 getters, mutations, actions
})
module.exports={ptsstore,dictstore}