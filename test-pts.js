const {openSync,readlines,parseCAP}=require("dengine");

let failed=0,passed=0;
const assert=(a,b,testname)=>{
	if (a!==b) {
		testname&&console.log('test:',testname);
		console.log('expecting',a);
		console.log('got',b);
		failed++;		
	} else passed++
}

const pts=openSync("pts");
//s=readlines(pts,13141,10);
//console.log(s)
const parsedata=[
	[6 , "mv_p1x6"],
	[13140,"mv_p360x13"],
	[13141,"cv_p1"],
	[13142,"cv_p1x1"],

	["mv_x24","mv_p1x24"],
	["mv_x25","mv_p2"],
	["mv_x13140","mv_p360x13"],
	["cv_x1","cv_p1x1"]
]

const fetchtest=[
	["cv_p1x1","                             CULLAVAGGA."]
]

parsedata.forEach(item=>{
	assert(item[1],parseCAP(item[0],pts).stringify(), 'parse');
})

fetchtest.forEach(item=>{
	assert(item[1],
		readlines(pts, parseCAP(item[0],pts).x0,1)[0][1], 
	'fetch');
})
//
//do not rely on seq2id id2seq
console.log("passed",passed,"failed",failed)