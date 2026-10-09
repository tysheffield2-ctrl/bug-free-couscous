/* ENCORE 0.9.2 compatibility fixes discovered by the full regression suite. */
const V092_reviewArtistOfferDeadline=reviewArtistOffer;
reviewArtistOffer=function(id){
 const o=s.labelBusiness?.offers?.find(x=>x.id===id&&!x.used&&x.expires>=s.week);
 if(o&&typeof V080_markReviewed==='function')V080_markReviewed(o);
 return V092_reviewArtistOfferDeadline(id);
};
