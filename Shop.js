
let LastShop = 0;
let shopWidget = null;

// If a subset is desired it can be specified or default to AllWildcards
const ShopItems = [];


// TODO: Add a Lay-Away feature for (1) coin to add shop wildcard to 1-2 slots?
class ShopCard
{
	constructor(wild,element)
	{
		this.Wild = wild;
		this.Element = element;
		this.UpdateElement();
	}

	UpdateElement()
	{
		const wild = this.Wild;
		let tooltip = wild.CLASS.GetShopTooltip(wild);
		if (tooltip)
		{
			let elem = this.Element;
			let tip = elem.querySelector(".tooltip");
			if (tip)
			{
				tip.innerHTML += "<br>" + tooltip;
			}
		}
	}
};

function SafeGet(list,index)
{
	const last = list.length-1;
	const pick = index < last ? index : last;
	return list[pick];
}

class Shop
{
	constructor()
	{
		this.Active = false;
		// Cart has 3 rows
		//  0=Upgrade items
		//  1=Mid-tier items
		//  2=High-tier items
		this.Cart = [ [],[],[] ];
		this.Cards = []; // cards on display
		this.Widget = null;
		//this.LastLevel = -1;
		this.Viewed = new Set();
		this.Bought = new Set(); // distinct from Wildcards for mod cards
		this.Reset();
	}

	Reset()
	{
		// When game restarts forget
		this.Viewed.clear();
		this.Bought.clear();
	}
	
	AddToCart(row,wild)
	{
		let cart = this.Cart[row];
		cart.push(wild);
		// Track all the cards that have appeared in shop
		this.Viewed.add(wild);
	}

	OnBought(wild)
	{
		// Remove wildcard from cart in unknown row
		for (let row=0; row<3; ++row)
		{
			let cart = this.Cart[row];
			this.Cart[row] = cart.filter(it => it !== wild);
		}
		// Track purchased card for shop limits
		this.Bought.add(wild);
	}
	
	EmptyCart()
	{
		this.Cart[0].length = 0;
		this.Cart[1].length = 0;
		this.Cart[2].length = 0;
	}
	
	// The shop has 3
	GetRow(row)
	{
		return this.Cart[row];
	}
	
	GetRowSize(row)
	{
		let data = [0];
		switch (row)
		{
			case 0: data=[2,2,2,2,3,3,4,4]; break;
			case 1: data=[2,2,3,3,3,3,4,4]; break;
			case 2: data=[0,0,0,0,1,2,2,3]; break;
		}
		// Level vs Turn bonus?
		return SafeGet(data,Round.Level);
	}
	
	xGetCartLength()
	{
		let A = this.Cart[0];
		let B = this.Cart[1];
		let C = this.Cart[2];
		return A.length+B.length+C.length;
	}
	
	xIsCartFull(row)
	{
		let cart = this.GetRow(row);
		let size = this.GetRowSize(row);
		return cart.length == size;
	}
	
	// What is the highest price item to show in the shop?
	GetHighestPrice()
	{
		let A = Player.Coins+3;
		let B = 2+Round.Level*2;
		return Math.max(5, A, B);
	}

	CheckReqs(wild, reqs)
	{
		// TODO: options for Exclusive, Rariy, Limits, etc?
		if (reqs.check)
		{
			if (!wild.CLASS.IsAvailable(wild))
			{
				return false;
			}
		}
		if (!reqs.duplicates)
		{
			if (PlayerWildcards.HasWild(wild))
			{
				return false; // skip duplicates
			}
		}
		if (reqs.coin)
		{
			if (Player.Coins < reqs.coin)
			{
				return false; // insufficient funds
			}
		}
		if (reqs.level)
		{
			if (Round.Level < reqs.level)
			{
				return false; // too early in the game
			}
		}
		if (reqs.once)
		{
			if (this.Bought.has(wild) || PlayerWildcards.HadOnce(wild))
			{
				return false; // not allowed to have this again
			}
		}
		if (reqs.view)
		{
			const list = Array.isArray(reqs.view) ? reqs.view : [reqs.view];
			for (let w of list)
			{
				if (this.Viewed.has(w) == false)
				{
					return false; // not viewed specific card
				}				
			}
		}
		if (reqs.buy)
		{
			const list = Array.isArray(reqs.buy) ? reqs.buy : [reqs.buy];
			for (let w of list)
			{			
				if (!this.Bought.has(w))
				{
					return false; // have to buy this first
				}
			}
		}		
		if (reqs.hand)
		{
			const list = Array.isArray(reqs.hand) ? reqs.hand : [reqs.hand];
			for (let w of list)
			{
				if (PlayerWildcards.HasWild(w) == false)
				{
					return false; // not holding specific wildcard
				}				
			}
		}
		if (reqs.block)
		{
			const list = Array.isArray(reqs.block) ? reqs.block : [reqs.block];
			for (let w of list)
			{
				if (PlayerWildcards.HasWild(w))
				{
					return false; // blocked by specific wildcards
				}
			}
		}
		if (reqs.prize_limit)
		{
			// Limit earning prizes from completing wildcard
			// you can buy/sell multiple times, but only win once!
			// ie. WordCard reaching limit and Swap = win prize
			let count = Player.GetPrizeCount(wild);
			if (count >= reqs.prize_limit)
			{
				return false; // blocked
			}
		}
		return true;
	}
	
	FilterShoppable()
	{
		let options = [];
		
		const high = this.GetHighestPrice();
		let list = ShopItems.length ? ShopItems : AllWildcards;

		// Only check each card once if duplicates for weight
		//let checked = new Set();
		
		for (let wild of list)
		{
			if (!wild.CLASS || wild.cost > high)// || checked.has(wild))
			{
				continue; // disqualify
			}
			
			if (Player.HasCompleted(wild))
			{
				continue; // only once?
			}
			
			//checked.add(wild);
			
			if (wild.shop && wild.shop.reqs)
			{
				if (this.CheckReqs(wild, wild.shop.reqs) == false)
				{
					continue; // disqualify
				}
			}
			else if (PlayerWildcards.HasWild(wild))
			{
				continue; // skip duplicates by default
			}
			
			options.push(wild);
		}
		return options;
	}
};

let TheShop = new Shop();
let ShopCards = TheShop.Cards;

function PlayerHas(item)
{
	// Try to avoid duplicates?
	for (let has of PlayerWildcards.Hand)
	{
		if (has === item)
		{
			return true;
		}
	}
	return false;
}

function Clamp(value,min,max)
{
	return Math.min(Math.max(min,value),max);
}

class Options
{
	constructor(list)
	{
		let total = 0;
		let opts = [];
		for (let wild of list)
		{
			let weight = this.GetWeight(wild);
			if (weight > 0)
			{
				// TODO: { weight:0, wild:null };
				opts.push([ wild, weight ]);
				total += weight;
			}
		}
		this.List = opts;
		this.Total = total;
	}

	GetWeight(wild)
	{
		let w = wild.weight || 1;
		// TODO: dynamic for items that start low-prob then increase with level?
		let list = wild.weights;
		if (list !== undefined)
		{
			let index = Clamp(Round.Level,0,list.length-1);
			w = list[index];
		}
		return w;
	}
	
	GetTotal(options)
	{
		let total = 0;
		for (let opt of options)
		{
			total += opt[1]; // weight
		}
		return total;
	}
	
	SetupHiLo(mid,filter)
	{
		let rows = [ null,[],[],[] ]; // up, low, high
		for (let opt of this.List)
		{
			let wild = opt[0];
			let row = wild.shop ? wild.shop.row : undefined;
			if (row === undefined)
			{
				if (filter(wild))
				{
					row = 1;
				}
				else
				{
					row = (wild.cost <= mid) ? 2:3;
				}
			}
			rows[row].push(opt);
		}
		this.Up = rows[1]; // Upgrades
		this.Low = rows[2]; // Low-value
		this.High = rows[3]; // High-value
	}
	
	TryPick(options)
	{
		let total = this.GetTotal(options);
		if (total <= 0)
		{
			return null;
		}
		let roll = Math.floor(Math.random() * total);
		let pos = 0;
		for (let k=0; k < options.length; k++)
		{
			const opt = options[k];
			const wild = opt[0];
			const weight = opt[1];
			pos += weight;
			if (roll < pos)
			{
				// Remove to prevent duplicates
				options.splice(k,1);
				return wild;
			}
		}
		return null;
	}
	
	Pick(row)
	{
		let X = null;
		if (row==0) X=this.Up;
		if (row==1) X=this.Low;
		if (row==2) X=this.High;
		let pick = this.TryPick(X);
		return pick;
	}
	
	// Pick random upgrade
	xPickFiltered()
	{
		return this.TryPick(this.Up);
	}
}

function GetShopCounts(shop)
{
	let data = {};
	data.Row1 = shop.GetRowSize(0);
	data.Row2 = shop.GetRowSize(1);
	data.Row3 = shop.GetRowSize(2);
	return data;
}

// TODO: sometimes returns not Upgrades?
//       sometimes returns U2 when player has U8?
function PickShopItems()
{
	let shop = TheShop;
	shop.EmptyCart();

	let list = shop.FilterShoppable();
	let options = new Options(list);
	let mid = Math.max(4,Player.Coins/2);
	options.SetupHiLo(mid,FilterUpgrades);

	let stat = "";
	
	// Rows = Upgrades, Mids, Highs
	for (let row=0; row<3; ++row)
	{
		let cart = shop.GetRow(row);
		let size = shop.GetRowSize(row);
		for (let i=0; i<2*size; ++i)
		{
			let wild = options.Pick(row);
			if (wild !== null)
			{
				shop.AddToCart(row,wild);
				if (cart.length >= size) // IsRowFull?
				{
					break;
				}
			}
		}
		if (cart.length)
		{
			stat += " R"+row+"="+cart.length+"/"+size;	
		}
	}
	
	/*
	for (let i=0; i<2*MaxItems; i++)
	{
		// TODO: if Cart=0  prefer=Cheap
		// TODO: if Cart=1  prefer=Midrange
		// TODO: if Cart=2+ prefer=High
		let hi = shop.GetCartLength() >= 2;
		let wild = options.Pick(hi);
		if (wild !== null)
		{
			shop.AddToCart(wild);

			if (shop.IsCartFull())
			{
				break;
			}
		}
	}

	// Level vs Turn bonus?
	const count = [2,2,2,2,3,3,4];
	const index = (Round.Level<7) ? Round.Level:6;
	const numUpgrades = count[index];
	
	let stat = "num="+numUpgrades;
	stat += " up="+options.Up.length;
	stat += " hi="+options.High.length;
	stat += " lo="+options.Low.length;
	
	for (let i=0; i<numUpgrades; ++i)
	{
		let wild = options.PickFiltered();
		if (wild !== null)
		{
			stat += " u";
			shop.AddToCart(wild);
		}
	}
	*/
	
	//let stat = "num="+numUpgrades;
	//stat += " up="+options.Up.length;
	//stat += " hi="+options.High.length;
	//stat += " lo="+options.Low.length;
	console.log(stat);
}

function FilterUpgrades(wild)
{
	return wild.CLASS === UpgradeCard;
}

function BuildShop(doc)
{
	let stat = "SHOP:";
	
	UI.ShopTiles.innerHTML =
		'<br><div id="shop1" class="shop-line"></div>'
		+'<br><div id="shop2" class="shop-line"></div>'
		+'<br><div id="shop3" class="shop-line"></div>';
	let line1 = document.getElementById('shop1');
	let line2 = document.getElementById('shop2');
	let line3 = document.getElementById('shop3');
	
	stat += " lvl="+Round.Level;
	
	// Already cached?
	let N = Round.Level*10 + Round.Phase;
	if (N != LastShop)
	{
		stat += " pick";
		PickShopItems();
		LastShop = N;
	}
	else
	{
		stat += " WAIT";
	}

	// Clear display elements
	ShopCards.length = 0;
	
	stat += " cart="+TheShop.Cart.length;
	
	const lines = [line1,line2,line3];
	
	for (let row=0; row<3; ++row)
	{
		let cart = TheShop.Cart[row];
		for (let item of cart)
		{
			if (PlayerHas(item))
			{
				continue;
			}
			
			let widget = CreateWildcardElement(item,null);
			ShowPrice(widget);
			let buy = widget.querySelector('.buyTag');
			buy.addEventListener('click',()=>
			{
				BuyWildcard(item);
			});
			widget.addEventListener('click',()=>
			{
				toggleBuyButton(widget);
			});
			let line = lines[row];
			line.appendChild(widget);
			let card = new ShopCard(item,widget);
			ShopCards.push(card);
			stat += top ? " U" : " w";			
		}
	}
	
	/*
	for (let item of TheShop.Cart)
	{
		if (PlayerHas(item))
		{
			continue;
		}
		let widget = CreateWildcardElement(item,null);
		ShowPrice(widget);
		let buy = widget.querySelector('.buyTag');
			buy.addEventListener('click',()=>
			{
				BuyWildcard(item);
			});
		widget.addEventListener('click',()=>
		{
			toggleBuyButton(widget);
		});
		let top = item.CLASS === UpgradeCard;
		let line = top ? line1 : line2;
		if (item.cost >= 20)
		{
			line = line3;
		}
		line.appendChild(widget);
		let card = new ShopCard(item,widget);
		ShopCards.push(card);
		stat += top ? " U" : " w";
	}
	*/
	
	console.log(stat);
}

function setShopFocus(widget)
{
	if (widget !== shopWidget)
	{
		if (shopWidget !== null)
		{
			HideBuyButton(shopWidget);
			shopWidget = null;
		}
		if (widget !== null)
		{
			ShowBuyButton(widget);
			shopWidget = widget;
		}
	}
}

function toggleBuyButton(widget)
{
	let buy = widget.querySelector('.buyTag');
	if (buy.style.opacity > 0)
	{
		buy.style.opacity = 0;
		buy.style.visibility = 'none';
		setShopFocus(null);
	}
	else
	{
		setShopFocus(widget);
	}
}

function HideBuyButton(widget)
{
	let buy = widget.querySelector('.buyTag');
	buy.style.opacity = 0;
	buy.style.display = 'none';
}
function ShowBuyButton(widget)
{
	if (widget !== null)
	{
		let buy = widget.querySelector('.buyTag');
		buy.style.opacity = 1;
		buy.style.display = 'block'; // aka visible
	}
}
function ShowPrice(widget)
{
	if (widget !== null)
	{
		let cost = widget.Wild ? (widget.Wild.cost) || 1 : 0;
		let P = widget.querySelector('#price');
		P.innerHTML = (cost > 0) ? `${cost}&#128192` : "???";
		P.classList.add('opaque');
		if (cost > Player.Coins)
		{
			// TODO: darken prices that are too much!
			P.classList.add('darken');
		}
	}
}

function FindUpgradeTarget(wild)
{
	let isUpgrade = wild.buy ? wild.buy.upgrade : false || false;
	if (isUpgrade)
	{
		for (let card of PlayerWildcards.Hand)
		{
			if (card.CanUpgrade(wild))
			{
				return card;
			}
		}		
	}	
	return null;
}

function CanAfford(wild)
{
	return (Player.Coins >= wild.cost);
}

function TryPlaySound(wild,tag)
{
	if (wild && wild.audio)
	{
		let sfx = wild.audio[tag];
		if (sfx)
		{
			PlayAudio(sfx);
			return;
		}
	}
	switch (tag)
	{
		case 'buy': tag='Buy'; break;
		case 'sell': tag='Sell'; break;
	}
	PlayAudio(tag);
}

function FinalizeBuy(wild)
{
	TryPlaySound(wild,'buy')	
	TheShop.OnBought(wild);
	SpendCoins(wild.cost);
	RebuildWildcards();
	BuildShop(document);
}

function TryBuyUpgrade(wild)
{
	if (!wild.CLASS.IsModifier(wild))
	{
		return false;
	}
	if (!CanAfford(wild))
	{
		return false;
	}
	const C = wild.CLASS;
	if (C.CanPlayerBuy(wild))
	{
		C.OnPlayerBuy(wild);
		FinalizeBuy(wild);
		return true;
	}
	// Check if the card can upgrade the player without taking a slot?
	let card = FindUpgradeTarget(wild);
	if (card != null)
	{
		card.UseUpgrade(wild);
		FinalizeBuy(wild);
		return true;
	}
	return false;
}

function CanBuyWildcard(wild)
{
	if (wild.CLASS.IsModifier(wild))
	{
		return false;
	}
	if (PlayerWildcards.Hand.length < Player.MaxWildcards)
	{
		return (Player.Coins >= wild.cost);
	}
	// Does not check for upgrade/enhancements
	return false;
}

function SpendCoins(cost)
{
	Player.RemoveCoins(cost);
}

function BuyWildcard(wild)
{
	if (!CanAfford(wild))
	{
		return;
	}
	if (TryBuyUpgrade(wild))
	{
		//TheShop.Bought.add(wild);
		return;
	}
	if (CanBuyWildcard(wild))
	{
		let card = PlayerWildcards.CreateInstance(wild);
		PlayerWildcards.Add(card);
		// aka FinalizeBuy?
		TryPlaySound(wild,'buy');
		TheShop.OnBought(wild);
		SpendCoins(wild.cost);
		RebuildWildcards();
		BuildShop(document);
	}
}

// Called when PlayerCoins changes
function UpdateShopPrices()
{
	if (TheShop.Active)
	{
		for (let card of TheShop.Cards)
		{
			if (card.Element)
			{
				card.UpdateElement();
			}
		}
		
		BuildShop(document);
	}
}

function IsShopping()
{
	return TheShop.Active;
}

//
// MINI QUARTERS SHOP
//  (bottom left corner)
//  silver coins indicate bank
//  1/2/3/4/5 Line with quick purchase options
//

const QuarterItems =
[
	{ Text:"Blank",    Cost:1, Rewards:{blanks:1} },
	{ Text:"Discards", Cost:2, Rewards:{discards:10} },
	{ Text:"Coin +10", Cost:2, Rewards:{coins:10} },
	{ Text:"Shuffle",  Cost:3, Rewards:{shuffle:1} },
	// TODO: wild not working? Bought=undefined
	{ Text:"Score +8", Cost:4, Rewards:{wild:Wild_SCORE_8} },
	// TODO: Buy once and replace?
	{ Text:"Slot",     Cost:5, Rewards:{slot:1} },
	//{ Text:"Reset",    Cost:5, Rewards:{blanks:8} },
];

function BuyQ(index)
{
	let opt = QuarterItems[index];
	if (Player.Quarters < opt.Cost)
	{
		PlayAudioFail();
		return;
	}
	Player.RemoveQuarters(opt.Cost);

	let action = new GiveRewardContext(opt.Rewards);
	action.Perform();
	
	console.log("Bought = "+opt.Name);
	PlayAudioPurchase(); //PlayAudioDing();
	ToggleQuarters();
}

//function BuyQ1() { BuyQ(0); }
//function BuyQ2() { BuyQ(1); }
//function BuyQ3() { BuyQ(2); }
//function BuyQ4() { BuyQ(3); }

function QButton(index, canBuy)
{
	let TAG = canBuy ? "BtnGreen" : "BtnDark"
	let CLASS = "class='"+TAG+"'";
	return "<button "+CLASS+" onclick='BuyQ(" + index + ")'>Buy</button>";
}
