const {dictstore}=require("../store");

Vue.component("DictionaryContainer",{
  functional:true,
  render(h) { //eslint-disable-line
  	const children=dictstore.getters.texts.map(item=>h("div",item[1]));
 	return  h("div",{class:"maintext"},children)
	}
});