const fs=require("fs")
const {createbuilder}=require("dengine");
const arr=fs.readFileSync("ped-raw.txt","utf8").split(/\r?\n/);

build=()=>{
	const name="ped";
	const builder=createbuilder({name});
	let prevbk='',prevpage=0;
	const MAXLINE=500;//arr.length
	for (var i=0;i<MAXLINE;i++) {
		const line=arr[i];
		if (line[0]==":") {
			if (line[1]==":") {
				if (prevbk) {
					builder.addbook(prevbk);
				}
				prevbk=line.substr(2);
			} else {
				builder.addpage(prevpage);
				prevpage=parseInt(line.substr(1));
			}
			continue
		}
		builder.addline(line);
	}
	builder.addpage();
	builder.addbook(prevbk);
	builder.done();
	console.log("done")
}

build();