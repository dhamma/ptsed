const guide=`　
　 
Pāḷi Diacritics key
  aa=ā   ii=ī   uu=ū
  .n=ṇ   .m=ṃ   .t=ṭ .d=ḍ .l=ḷ
  ;n=ṅ   ;m=ṁ
  ,n=ñ

Abbreviations:
Viniya: mv Mahavagga, cv cūḷavagga , vb1 vb2 vibhaṅga, pvr Parivāra 
Nikaya: dn1~dn3, mn1~mn3, sn1~sn5 , an1~an5
kp Khuddakapāṭha, dhp Dhammapada, ud Udāna, iti Itivuttaka ,snp Sutta Nipāta
vv Vimānavatthu, pv Petavatthu, thag Theragātha (thig in same book)
ja1~ja6 Jātaka , mnd Mahāniddesa, cnd Cūḷaniddesa,
ps1~ps2 Paṭisambhidāmagga, ap Therāpadāna, bv Buddhavaṃsa, cp Cariyāpiṭaka       
mil Milindapañha, vism Visuddhimagga
ds Dhammasaṅgaṇī, vb Vibhaṅga, dt Dhātukathā ,
pp Puggalapaññatti, kv Kathāvatthu, ya1~ya2 Yamaka, pt1~pt2 Paṭṭhāna 

Data Source:
Pali English Dictionary, maintained by suttacentral
PTS  Tipitaka, input by Dhammakaya Foundation, 
All datafile included in the archieve are released under Creative Commons Zero.

Source code and issue report:
github.com/dhamma/ptsed/

Free for Offline use, Please let me know if you want to host it online.
`.split(/\n/)
Vue.component("UserGuide",{
	render(h){
		const children=guide.map(line=>h("div",line));
		return h("div",{},children);
	}
})