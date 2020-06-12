const {dictstore}=require("../store");
const {bsearch,parseCAP,readlines}=require("dengine");
const inputpali=require("./inputpali");
require("./citation");


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
const NestedCard=Vue.extend({
	props:{
		texts:{type:Array},
		depth:{type:Number},
		close:{type:Function}
	},
	render(h){
		const children=this.texts.map(item=>renderline(h,item));
		return h("div",{class:this.depth?"card":""},
			[
			 this.close?h("button",{class:"floatright",on:{click:this.close}},"✖"):null,
			 h("div",{},	children)
			]
		);
	}
})
const CardButton=Vue.extend({
	props:{
		word:{type:String}

	},
	methods:{
		close(){
			this.showcard=false;
		},
		opencard(event){
			const db=dictstore.getters.cap.db;
			const headwords=db.payload;
			const w=event.target.innerText.replace(/[\*˚\-]/,'');
			let at=bsearch(headwords,w);
			if (at<0)return;

			while (at>0) {
				if (headwords[at-1]==w) at--;
				else break;
			}

			const headwordx0=db.extra.headwordx0;
			const cap=parseCAP(headwordx0[at],db);

			const self=this;
		 	readlines(cap.db,cap.x0-cap.x,cap._w,(texts)=>{
		 		self.texts=texts;
		 		self.showcard=true;
		 	})
		}
	},
	data(){
		return {texts:[],showcard:false}
	},
	render(h){
		if (this.showcard) {
			return h(NestedCard,{props:{depth:1,texts:this.texts,close:this.close}})
		} else {
			const words=this.word.split(/([ ,])/);
			const children=words.map(w=>{
				return w.match(/[ ,]/)?h("span",w):
			    h("a",{attrs:{href:"#"},on:{click:this.opencard}},w)
			})
			return h("span",children);
		}
	}
})
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
			children.push(h(CardButton,{props:{word:m1}}));
		} else {
			children.push(h("citation",{props:{label:m1}}));			
		}
	})
	children.push( h("span", text.substr(lastidx)));

	const capx0=dictstore.getters.cap.x0;

	return h("div",{class:x0==capx0?"highlightx0":""},children);
}

const DictionaryPanel=Vue.extend({
	methods:{
		oninput(event){
			inputpali(event.target)
			this.prefix=event.target.value;
			this.candidates=listcandidate(dictstore.getters.cap.db,this.prefix);
			if (event.key=="Enter" &&this.candidates.length) {
				this.goto(this.candidates[0].x0);
				this.showcandidate=false;
				this.$refs.hw.blur();
			} else {
				this.showcandidate=true;
			}
		},
		onblur(){
			blurtimer=setTimeout( function (){
				this.showcandidate=false
			}.bind(this),500);
		},
		onfocus(){
			clearTimeout(blurtimer);
			this.showcandidate=true;
		},
		goto(x0){
			const newcap=parseCAP(x0 ,dictstore.getters.cap.db);
			dictstore.dispatch("setCap", newcap);
			this.capstr=newcap.stringify();
		},
		selectCandidate(event){
			const x0=parseInt(event.target.attributes.x0.value);
			this.goto(x0);
			this.$refs.hw.focus();
		},
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
			    <div :x0="item.x0" @click="selectCandidate">{{item.headword}}</div> 
			</div>
		</div>
	</div>
	`
})
Vue.component("DictionaryContainer",{
  functional:true,
  render(h) { //eslint-disable-line
  		return  h("div",{},
 				[h(DictionaryPanel),
 				h(NestedCard,{props:{texts:dictstore.getters.texts}})]
 			)
	}
});