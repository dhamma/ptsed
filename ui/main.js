const {ptsstore}=require("../store");

Vue.component("Cards",{
  functional:true,
  render(h) { //eslint-disable-line
  	const children=ptsstore.getters.texts.map(itm=>h("div",itm[1]));
 	return  h("div",{class:"maintext"},children)
	}
});