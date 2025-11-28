
function SelectOpponent(who)
{
	// TODO: class instance for dynamic behavior?
	// let opp = new who.CLASS;
	
	// Current Opponent
	Round.Opponent = who;
	// 1,2,[3],4,5,[6],etc.
	Round.Opponent.Boss = (Round.Level%3)==0;
	
	let list = document.querySelector('.master');
	list.innerHTML = '';		
	let big = createBigOpponent(who,'opponent big-op');
	list.appendChild(big);			
}

function createBigOpponent(tag,iClass)
{
	let name = tag.name;
	let Tip = "Future restrictions for multiplier or some penalty.<br>ALPHA|BRAVO<br>&#x1F9CA;&#x1F4A7;"
	let emoji = tag.emoji + `<div class="emoji-tip">${Tip}</div>`;
	let item = document.createElement('div');
	item.className = iClass;
	item.innerHTML = `
		<div class="big-emoji">${emoji}</div>
		<div class="big-name">${name}</div>
	`;
	// Update the reference to new element
	UI.BigEmoji = item.querySelector('.big-emoji');
	return item;
}

function createOpponent(tag,iClass)
{
	let name = tag.name;
	let emoji = tag.emoji;	
	let item = document.createElement('div');
	item.className = iClass;
	item.innerHTML = `
		<div class="clear-button">Select</div>
		<div class="score-text">Score: 32</div>
		<div class="large-emoji">${emoji}</div>
	`;
	
	// TODO: SelectOpponent();
	item.addEventListener('click', () => { SelectOpponent(tag); });
	
	const list = document.querySelector('.opponent-list');
	list.appendChild(item);
	
	return item;
}
		
let Faces =
[
	"&#128118;", // Baby
	"&#129299;", // Nerd
	"&#129312;", // Cowboy
	"&#128104;", // Man
	"&#128105;", // Woman
	"&#128570;", // Cat
	"&#128105;&#8205;&#9877;&#65039;", // Nurse
	"&#128104;&#8205;&#128187;", // Tech
	"&#129501;", // Elf
	"&#128110;", // Police
	"&#128115;", // Turban
	"&#128373;", // Detective
	"&#129332;", // Prince
	"&#129333;", // Tuxedo
	"&#129492;", // Beard
	"&#129497;", // Wizard
	"&#128113;", // Blonde
	//"&#129503;", // Zombie
];

let Bosses =
[
	"&#128125;", // Alien
	"&#128520;", // Demon
	"&#128123;", // Ghost
	"&#x1F916;", // Robot
	"&#128121;", // Goblin
	"&#129313;", // Clown
	"&#129499;", // Vampire
	"&#129465;", // Villain
	"&#128128;", // Skull
	"&#127183;", // Joker
];

// i.e. Small Blind
let Mini_01 = { score:12, name:"Baby",	emoji:"&#128118;" };
let Mini_02 = { score:12, name:"Panda",	emoji:"&#128060;" };
let Mini_03 = { score:12, name:"Kitty", emoji:"&#128570;" };
let Mini_04 = { score:12, name:"Doggy",	emoji:"&#128054;" };
let Mini_05 = { score:12, name:"Fox",   emoji:"&#129418;" };
let Mini_06 = { score:12, name:"Rabbit",emoji:"&#128048;" };
let Mini_07 = { score:12, name:"Monkey",emoji:"&#128053;" };
let Mini_08 = { score:12, name:"Mouse", emoji:"&#128045;" };

// i.e. Big Blind
let Opp_01 = { score:20, name:"Wizard", emoji:"&#129497;" };
let Opp_02 = { score:20, name:"Elf",    emoji:"&#129501;" };
let Opp_03 = { score:20, name:"Nerd",   emoji:"&#129299;" };
let Opp_04 = { score:20, name:"Cowboy", emoji:"&#129312;" };
let Opp_05 = { score:20, name:"Man",    emoji:"&#128104;" };
let Opp_06 = { score:20, name:"Woman",  emoji:"&#128105;" };
let Opp_07 = { score:20, name:"Beard",  emoji:"&#129492;" };
let Opp_08 = { score:20, name:"Blonde", emoji:"&#128113;" };
let Opp_09 = { score:20, name:"Police", emoji:"&#128110;" };
let Opp_10 = { score:20, name:"Turban", emoji:"&#128115;" };
let Opp_11 = { score:20, name:"Prince", emoji:"&#129332;" };
let Opp_12 = { score:20, name:"Tuxedo", emoji:"&#129333;" };
let Opp_13 = { score:20, name:"Detective", emoji:"&#128373;" };
let Opp_14 = { score:20, name:"Nurse",  emoji:"&#128105;&#8205;&#9877;&#65039;" };
let Opp_15 = { score:20, name:"Tech",   emoji:"&#128104;&#8205;&#128187;" };

// i.e Boss Blind
let Boss_01 = { score:40, name:"Alien Boss",  emoji:"&#128125;" };
let Boss_02 = { score:40, name:"Demon Boss",  emoji:"&#128520;" };
let Boss_03 = { score:40, name:"Ghost Boss",  emoji:"&#128123;" };
let Boss_04 = { score:40, name:"Robot Boss",  emoji:"&#x1F916;" };
let Boss_05 = { score:40, name:"Goblin Boss", emoji:"&#128121;" };
let Boss_06 = { score:40, name:"Clown Boss",  emoji:"&#129313;" };
let Boss_07 = { score:40, name:"Vampire Boss",emoji:"&#129499;" };
let Boss_08 = { score:40, name:"Villain Boss",emoji:"&#129465;" };
let Boss_09 = { score:40, name:"Skull Boss",  emoji:"&#128128;" };
let Boss_10 = { score:40, name:"Joker Boss",  emoji:"&#127183;" };

let NewSmall =
[
	Mini_01, Mini_02, Mini_03, Mini_04,
	Mini_05, Mini_06, Mini_07, Mini_08,
];

let NewFaces =
[
	Opp_01,	Opp_02,	Opp_03,	Opp_04,
	Opp_05,	Opp_06,	Opp_07,	Opp_08,
	Opp_09,	Opp_10,	Opp_11,	Opp_12,
];

let LevelFaces =
[
	Mini_01, // Level 1.1,1.2 = Baby
	Mini_02, // Level 2.1,2.2 = Panda
	Mini_05, // Level 3.1,3.2 = Fox
	Opp_03,  // Level 4.1,4.2 = Nerd
	Opp_07,  // Level 5.1,5.2 = Beard
	Opp_04,  // Level 6.1,6.2 = Cowboy
	Opp_09,  // Level 7.1,7.2 = Police
	Opp_12,  // Level 8.1,8.2 = Tuxedo
	Opp_01,  // Level 9.1,9.2 = Wizard
	Opp_11,  // Level 10.1,10.2 = Prince
	Boss_04, // Level 11.1,11.2 = Robot
];

let NewBosses =
[
	Boss_01, Boss_02, Boss_03, Boss_04, Boss_05,
	Boss_06, Boss_07, Boss_08, Boss_09, Boss_10,
];

let Wizard = Opp_01;
	
	for (let i=0; i<3; ++i)
	{
		let Who = (i==0) ? NewSmall : (i<2 ? NewFaces : NewBosses);
		let opp = Math.floor(Math.random()*Who.length);
		createOpponent(Who[opp],'opponent');
		Who.splice(opp,1);
	}

function NextOpponent()
{
	const boss = Round.IsLastPhase();
	Who = boss ? NewBosses : LevelFaces;
	//let e = Math.floor(Math.random()*Who.length);
	let e = Math.min(Round.Level-1, Who.length-1);
	SelectOpponent(Who[e]);
}