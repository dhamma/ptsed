const {ptsstore}=require("../store");
Vue.component("CapNav",{
	methods:{
		prevp:()=>ptsstore.dispatch("prevp"),
		nextp:()=>ptsstore.dispatch("nextp"),
		onenter:(event)=>{
			ptsstore.dispatch("setCap",event.target.value)
		}
	},
	computed:{
		cap:()=>ptsstore.getters.capstr
	},
	template:`
	<div class="cardnav">
	<div class="floatright">
		<button @click="prevp">‹</button>
		<input  class="cap" v-bind:value="cap" @keyup.enter="onenter"></input>
		<button @click="nextp">›</button>
	</div>
	</div>
	`
})