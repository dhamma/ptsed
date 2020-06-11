const {dictstore}=require("../store");
const {bsearch,parseCAP}=require("dengine");
const inputpali=require("./inputpali");
require("./citation");

let headword='';
const renderline=(h,item,headword)=>{
	const x0=item[0],text=item[1];
	const children=[];
	let lastidx=0;
	const title=dictstore.getters.cap.stringify();
	if (text[0]=="㊔") {
		return h("div",{class:"entry",attrs:{title}},text.substr(2));
	}

	text.replace(/[@\^]\[(.+?)\]/g,(m,m1,idx)=>{
		const s=text.substring(lastidx,idx);
		if (s) children.push( h("span",s));
		lastidx=idx+m.length;
		if (m[0]=="^") {
			children.push(h("a",{attrs:{href:"#"}},m1));
		} else {
			children.push(h("citation",{props:{label:m1}}));			
		}
	})
	children.push( h("span", text.substr(lastidx)));

	const capx0=dictstore.getters.cap.x0;

	return h("div",{class:x0==capx0?"highlightx0":""},children);
}

const listcandidate=(dictdb,prefix)=>{
	if (!prefix.trim()){
		return [];
	}
	const headwords=dictdb.payload;
	const headwordx0=dictdb.extra.headwordx0;
	let at=bsearch(headwords,prefix,true);
	const MAXITEM=15;
	const candidates=[];
	while (at>0){
		if (headwords[at-1].substr(0,prefix.length)==prefix) at--;
		else break;
	}
	while (at<headwords.length) {
		if (headwords[at].substr(0,prefix.length)==prefix) {
			candidates.push({headword:headwords[at], x0:headwordx0[at]});
			if (candidates.length>=MAXITEM) break;
			at++;
		} else {
			break;
		}
	}
	return candidates;
}
let searchtimer=0,blurtimer;
const DictionaryPanel=Vue.extend({
	methods:{
		oninput(event){
			inputpali(event.target)
			const self=this;
			this.prefix=event.target.value;
			clearTimeout(searchtimer);
			searchtimer=setTimeout(function(){
				this.showcandidate=true;

				this.candidates=listcandidate(dictstore.getters.cap.db,event.target.value);
			}.bind(this),250);
		},
		selectcandidate(){
			const x0=parseInt(event.target.attributes.x0.value);
			const newcap=parseCAP(x0 ,dictstore.getters.cap.db);
			dictstore.dispatch("setCap", newcap);
			this.capstr=newcap.stringify();
			this.$refs.hw.focus();
		},
		onblur(){
			blurtimer=setTimeout( function (){
				this.showcandidate=false
			}.bind(this),500);
		},
		onfocus(){
			clearTimeout(blurtimer);
			this.showcandidate=true;
		}
	},
	data(){
		return {prefix:"", capstr:'', candidates:[],showcandidate:false}
	},
	//
	template:`
	<div class="dictpanel floatright">
		<input ref="hw" class="headword" v-bind:value="prefix" 
			@blur="onblur" @focus="onfocus"
			@keyup="oninput"></input>
		<div v-if="showcandidate" class="candidates">
		<div v-for="item in candidates">
		    <div :x0="item.x0" @click="selectcandidate">{{item.headword}}</div> 
		</div>
		</div>
	</div>
	`
})
Vue.component("DictionaryContainer",{
  functional:true,
  data(){
  	return {headword:''}
  },
  render(h) { //eslint-disable-line
  		const children=dictstore.getters.texts.map(item=>renderline(h,item));
 		return  h("div",{},
 				[h(DictionaryPanel),
 				h("div",children)]
 			)
	}
});