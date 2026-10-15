/* ENCORE shared Chart Ledger Engine.
   Renderer-independent ownership of chart issue history, movement, peaks and #1 streaks.
   Candidate ranking/competition is supplied by the weekly simulation. */
(function(global){
'use strict';
function initial(sinceWeek=1){return {version:1,sinceWeek,issuedWeek:null,songs:{current:[],previous:[],records:{}},albums:{current:[],previous:[],records:{}}}}
function ensure(state){if(!state.chartBook||state.chartBook.version!==1)state.chartBook=initial(state.week||1);for(const kind of ['songs','albums']){state.chartBook[kind]??={current:[],previous:[],records:{}};state.chartBook[kind].current=Array.isArray(state.chartBook[kind].current)?state.chartBook[kind].current:[];state.chartBook[kind].previous=Array.isArray(state.chartBook[kind].previous)?state.chartBook[kind].previous:[];state.chartBook[kind].records=state.chartBook[kind].records&&typeof state.chartBook[kind].records==='object'?state.chartBook[kind].records:{}}return state.chartBook}
function defaultOwner(state,kind,id){return (kind==='songs'?state.songs:state.albums)?.find(x=>String(x.id)===String(id))||null}
function track(state,kind,list,{baseline=false,owner=defaultOwner}={}){
 const book=ensure(state),board=book[kind];if(!board)throw Error('Unknown chart kind: '+kind);const week=state.chartWeek??state.week??1;board.previous=baseline?[]:board.current;const prior=new Map(board.previous.map((x,i)=>[x.key,i+1]));const present=new Set(list.map(x=>x.key));
 board.current=list.map((x,i)=>{const rank=i+1,item=x.you?owner(state,kind,x.id):null;let record=board.records[x.key];const existed=!!record,earlier=baseline||(!existed&&x.releaseWeek<book.sinceWeek);if(!record){record=board.records[x.key]={title:x.title,artist:x.artist,you:!!x.you,id:x.id??null,peak:item?.peak??rank,weeks:baseline?(item?.chartWeeks||0):item?.chartWeeks||0,numberOneWeeks:item?.numberOneWeeks||0,streak:item?.numberOneStreak||0,longest:item?.longestNumberOne||0,debutRank:earlier?null:rank,debutWeek:earlier?null:week,partial:earlier,history:[]}}
 record.title=x.title;record.artist=x.artist;record.peak=Math.min(record.peak||rank,rank);record.lastSeen=week;record.lastRank=rank;if(!baseline){record.weeks++;record.streak=rank===1?record.streak+1:0;if(rank===1)record.numberOneWeeks++;record.longest=Math.max(record.longest,record.streak)}else record.weeks=Math.max(1,record.weeks);record.history.push({week,rank});record.history=record.history.slice(-104);if(item){item.peak=record.peak;item.chartWeeks=record.weeks;item.numberOneWeeks=record.numberOneWeeks;item.numberOneStreak=record.streak;item.longestNumberOne=record.longest}
 const last=prior.get(x.key)??null;return {key:x.key,id:x.id??null,title:x.title,artist:x.artist,you:!!x.you,streams:x.streams,units:x.units??null,rank,last,peak:record.peak,weeks:record.weeks,debutRank:record.debutRank,debutWeek:record.debutWeek,partial:record.partial,movement:baseline?'BASE':last?(last===rank?'HOLD':last>rank?'UP':'DOWN'):existed?'RE':earlier?'ENTRY':'NEW'}
 });
 for(const [key,record] of Object.entries(board.records)){if(present.has(key))continue;if(record.lastRank!==null){record.history.push({week,rank:null});record.history=record.history.slice(-104)}record.lastRank=null;record.streak=0;const item=record.you?owner(state,kind,record.id):null;if(item)item.numberOneStreak=0;if(!record.you&&week-(record.lastSeen??week)>104)delete board.records[key]}
 return board.current
}
function publish(state,{songs=[],albums=[],owner=defaultOwner}={}){const book=ensure(state),week=state.chartWeek??state.week??1;if(book.issuedWeek===week)return {published:false,songs:book.songs.current,albums:book.albums.current};const songIssue=track(state,'songs',songs,{owner}),albumIssue=track(state,'albums',albums,{owner});book.issuedWeek=week;return {published:true,songs:songIssue,albums:albumIssue}}
function record(state,kind,key){return state.chartBook?.[kind]?.records?.[key]??null}
global.ENCORE_CHARTS={version:1,initial,ensure,track,publish,record};
})(globalThis);
