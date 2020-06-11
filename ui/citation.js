const {ptsstore}=require("../store");
const Latin={
	i:1,ii:2,iii:3,iv:4,v:5,vi:6,vii:7,viii:8,ix:9,x:10
}
const patterns=[
	[/Vin\.i\.(\d+)/, (m,p)=> "mv_p"+p],
	[/Vin\.ii\.(\d+)/, (m,p)=> "cv_p"+p],
	[/Vin\.iii\.(\d+)/, (m,p)=> "vb1_p"+p],
	[/Vin\.iv\.(\d+)/, (m,p)=> "vb2_p"+p],
	[/Vin\.v\.(\d+)/, (m,p)=> "pvr_p"+p],
	[/([DMSA]N)\.([iv]{1,3})\.(\d+)/,
	 (m,nky,vol,p)=> nky.toLowerCase()+Latin[vol]+"_p"+p],
	[/Ja\.([iv]{1,3})\.(\d+)/, (m,vol,p)=> "ja"+Latin[vol]+"_p"+p],
	[/(Iti|Mnd|Dhp|Ud)\.(\d+)/, (m,bk,p)=> bk.toLowerCase()+"_p"+p],
	//[/Dhs\.(\d+)/, (m,p)=> "ds_p"+p],  not page number
]
const transpos=pts=>{
	const cites=pts.split(/[ ;]/);
	const out=[];
	let knownbk='';

	cites.forEach((cite,idx)=>{
		let ok=false;
		for (pat of patterns){
			const after=cite.replace(pat[0],pat[1]);
			if (after!==cite) {
				knownbk=after.substr(0,after.indexOf("_")-1);
				out.push(after);
				ok=true;
				break;
			} else if (knownbk&&idx) {
				cite.replace(/([iv]{1,3})\.(\d+)/,(m,vol,p)=>{
					out.push( knownbk+Latin[vol]+"_p"+p);
					ok=true;
				});
			}
		}
		if (!ok) out.push(cite);
	});

	return out;
}

Vue.component("citation",{
	props:{
		label:{type:String}
	},
	methods:{
		gopts(){
			ptsstore.dispatch("setCap",event.target.innerText);
		}
	},
	render(h){
		const oricites=this.label.split(/[ ;]/);
		const ptscites=transpos(this.label);

		const children=ptscites.map((cite,idx)=>{
			if (oricites[idx]!==cite){
				return h("span",{class:"citation",on:{click:this.gopts}},cite+" ")
			} else {
				return h("span",{},cite);
			}
		});
		return h("span",children);
	}
})
