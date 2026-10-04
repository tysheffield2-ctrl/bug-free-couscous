/* ENCORE Empire expansion: social influence, catalog value, wealth, staff, offers and multi-artist features. */
const empirePlatforms=[
 {id:'pulse',name:'Pulse',icon:'P',focus:'conversation',base:1.00},
 {id:'loop',name:'Loop',icon:'L',focus:'short video',base:1.25},
 {id:'scene',name:'Scene',icon:'S',focus:'photos & lifestyle',base:.90},
 {id:'livewire',name:'LiveWire',icon:'W',focus:'fans & livestreams',base:1.10}
];
const empireAssetCatalog=[
 {id:'car-apex',category:'Cars',name:'Apex R12',price:428000,trend:-.08,tax:.0625,carry:.012,prestige:12,detail:'Hand-built V12 grand tourer. Fast, loud and expensive to keep perfect.'},
 {id:'car-velour',category:'Cars',name:'Velour LX8',price:186000,trend:-.06,tax:.0625,carry:.010,prestige:7,detail:'Executive luxury sedan with a long-wheelbase rear cabin.'},
 {id:'car-heritage',category:'Cars',name:'Heritage 88 Coupe',price:740000,trend:.035,tax:.0625,carry:.018,prestige:18,detail:'Numbered collector coupe. Scarcity can make the resale market move up or down.'},
 {id:'jewel-crown',category:'Jewelry',name:'Crownline Tennis Set',price:95000,trend:.015,tax:.0825,carry:.003,prestige:8,detail:'Diamond tennis chain and bracelet set with insured storage costs.'},
 {id:'jewel-royal',category:'Jewelry',name:'Royal Ice Chronograph',price:240000,trend:.025,tax:.0825,carry:.004,prestige:11,detail:'Limited high-jewelry chronograph. Collectability matters more than utility.'},
 {id:'home-ocean',category:'Homes',name:'Pacific Glass Estate',price:14800000,trend:.045,tax:.018,carry:.016,prestige:22,detail:'Oceanfront modern estate with high property tax, insurance and maintenance.'},
 {id:'home-sky',category:'Homes',name:'Skyline Penthouse',price:7200000,trend:.035,tax:.015,carry:.012,prestige:16,detail:'Full-floor city penthouse with private elevator and large annual carrying costs.'},
 {id:'art-no17',category:'Art',name:'Untitled No. 17',price:860000,trend:.055,tax:.0825,carry:.006,prestige:10,detail:'Blue-chip contemporary work. Illiquid, subjective and capable of sharp repricing.'},
 {id:'art-afterlight',category:'Art',name:'Afterlight I',price:225000,trend:.04,tax:.0825,carry:.005,prestige:6,detail:'Emerging-artist canvas with more upside and more uncertainty.'},
 {id:'stock-index',category:'Stocks',name:'Broad Market Fund',price:10000,trend:.075,tax:0,carry:0,prestige:0,detail:'Diversified public equities. Liquid, volatile and taxed when gains are realized.'},
 {id:'stock-growth',category:'Stocks',name:'Innovation Basket',price:10000,trend:.12,tax:0,carry:0,prestige:0,detail:'Higher-growth equities with wider weekly swings.'},
 {id:'bond-treasury',category:'Bonds',name:'Treasury Ladder',price:10000,trend:.042,tax:0,carry:0,prestige:0,detail:'Lower-volatility fixed-income allocation with modest recurring yield.'},
 {id:'crypto-orbit',category:'Crypto',name:'Orbit Token Basket',price:10000,trend:.18,tax:0,carry:0,prestige:0,detail:'Highly volatile digital-asset basket. Large gains and losses are both possible.'},
 {id:'re-midtown',category:'Real Estate',name:'Midtown Retail Block',price:4200000,trend:.05,tax:.021,carry:.018,prestige:8,detail:'Income-producing retail property with taxes, maintenance and vacancy risk.'},
 {id:'re-multi',category:'Real Estate',name:'Cedar Multifamily',price:2850000,trend:.047,tax:.019,carry:.015,prestige:5,detail:'Apartment investment producing rent while market value changes over time.'}
];
const empireStaffPool=[
 {id:'mgr-davis',role:'Manager',name:'Jordan Davis',skill:91,loyalty:76,ethics:74,monthly:18000,commission:.12,detail:'Aggressive dealmaker with strong label relationships.'},
 {id:'mgr-morgan',role:'Manager',name:'Avery Morgan',skill:84,loyalty:96,ethics:95,monthly:12000,commission:.10,detail:'Steady career builder with unusually high loyalty.'},
 {id:'acct-chen',role:'Accountant',name:'Maya Chen',skill:94,loyalty:88,ethics:98,monthly:9000,commission:0,detail:'Tax-focused CPA who improves reporting and catches leakage.'},
 {id:'acct-cross',role:'Accountant',name:'Dean Cross',skill:89,loyalty:42,ethics:28,monthly:6500,commission:0,detail:'Talented but risky accountant with weak internal controls.'},
 {id:'fin-alvarez',role:'Financial Manager',name:'Elena Alvarez',skill:92,loyalty:84,ethics:91,monthly:14000,commission:.01,detail:'Portfolio manager focused on diversification and liquidity.'},
 {id:'fin-knox',role:'Financial Manager',name:'Mason Knox',skill:97,loyalty:35,ethics:31,monthly:11000,commission:.02,detail:'Excellent returns on paper, but governance risk is high.'},
 {id:'social-reed',role:'Social Manager',name:'Nia Reed',skill:93,loyalty:87,ethics:90,monthly:8000,commission:0,detail:'Optimizes fan conversion, posting cadence and brand voice.'},
 {id:'social-lane',role:'Social Manager',name:'Kai Lane',skill:78,loyalty:65,ethics:61,monthly:5000,commission:0,detail:'Cheap growth specialist who leans heavily into trends.'},
 {id:'law-hart',role:'Entertainment Lawyer',name:'Simone Hart',skill:96,loyalty:92,ethics:97,monthly:15000,commission:0,detail:'Contract specialist who improves counters and exit negotiations.'},
 {id:'pr-wells',role:'Publicist',name:'Cameron Wells',skill:88,loyalty:81,ethics:86,monthly:9000,commission:0,detail:'Press strategist who helps sentiment recover after bad news.'}
];
const empireMerch=[
 {id:'tee',name:'Tour Tee',price:45,cost:13,energy:10,conversion:.0018,detail:'Accessible fan staple with strong volume.'},
 {id:'hoodie',name:'Heavyweight Hoodie',price:110,cost:38,energy:12,conversion:.0011,detail:'Higher margin premium apparel.'},
 {id:'vinyl',name:'Signed Vinyl Bundle',price:85,cost:29,energy:12,conversion:.00075,detail:'Limited physical music bundle for core fans.'},
