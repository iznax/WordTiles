
function RND(list)
{
	return list[Math.floor(Math.random()*list.length)];
}

class BaseCard
{
	constructor(wild)
	{
		this.Wild = wild;
		let useBonus = wild.bonus || false;
		this.AddBonus = useBonus ? 1:0;
		this.Bonus = 0;
		this.Button = wild.button; // TODO: testing emoji?
		if (wild.mult)
		{
			console.log(`Card ${wild.name} please use multi vs mult`);
			console.assert(wild.multi === undefined);
		}
		let m = wild.multi || wild.mult;
		this.Multi = m || 0;
	}

	// Card in player hand vs shop
	OnEquip() {}
	OnUnequip() {}
	OnAction(event) { console.log('TODO: action?'); }
	
	// Add/Remove letter
	OnWordChanged(word) {}

	// Player just discarded specific letter
	OnDiscardLetter(letter) {}

	// Beginning for each turn
	OnTurn(index) {}

	// After 8-letters have been dealt
	OnHandReady() {}
	
	// Each card can contribute to reward
	// called when round score is reached
	OnReward(reward) {}

	// Allow cards to interact before/after score calculation
	BeginScore(eq) {}
	FinalizeScore(eq) {}
	EndScore(eq) {}
	
	// Event Sequence:
	//	OnLetterPlayed(ch)
	//	OnWordChanged(word)
	// BeginScore
	//	CalculateScore(word,eq) aka OnScoreWord?
	// EndScore
	//	OnWordPlayed(word,context)
	NewCalculateScore(c)
	{
		// Temp call old function?
		// TODO: this will not call OnWildcardUsed!
		this.OldCalculateScore(c.Word, c.EQ);
	}
	
	// Modify 'eq' is applicable
	// EQ = { total:0, multi:0, score:[], extra:0}
	OldCalculateScore(word,eq) {}

	GetEmojiElement()
	{
		let element = this.Element;
		return element ? element.querySelector('.big') : null;
	}

	// Wildcard has dynamic availability in shop.
	static IsAvailable(wild)  { return true; }
	static GetShopTooltip(wild) { return null; }
	// Allow cards to be bought directly by player w/o wildcards.
	static CanPlayerBuy(wild) { return false; }
	static OnPlayerBuy(wild)  {}
	// Return (true) if Modifer vs Wildcard equipped in hand.
	static IsModifier(wild)   { return false; }

	// Return (true) if wildcard can be bought in shop to upgrade or enhance hand
	CanUpgrade(wild) { return false; }
	UseUpgrade() {}
	
	StartPulse()
	{
		let elem = this.GetEmojiElement();
		elem.classList.add('anim');
		setTimeout(() => this.EndPulse(), 4000);
	}
	EndPulse()
	{
		let elem = this.GetEmojiElement();
		elem.classList.remove('anim');
	}

	// Utility function
	InWordList(word,list)
	{
		for (let i=0; i<list.length; i++)
		{
			if (word == list[i])
			{
				return true;
			}
		}		
		return false;
	}	
	
	IsMatchWord(word)
	{
		return false; // override with custom function
	}

	HighlightMatchWord(word)
	{
		const match = this.IsMatchWord(word);
		this.Power = match ? 1:0;
		//this.Highlight = match; // TODO: obsolete?
	}

	// Optional emoji for score log
	GetLogText()
	{
		let log = this.Wild.log;
		if (log)
		{
			if (log.disable)
			{
				return null;
			}
			if (log.emoji) // override for Blk/Wht example
			{
				return log.emoji;
			}
		}
		// TODO: allo this.Emoji override?
		return this.Wild.emoji;
	}
	
	GetBonusText()
	{
		if (this.BonusText !== undefined)
		{
			return this.BonusText;
		}
		if (this.Bonus > 0 && this.BonusLimit > 0)
		{
			return this.Bonus + '/' + this.BonusLimit;
		}
		if (this.Bonus > 0 && this.BonusLimit === this.Bonus)
		{
			// Highlight bonus limit
			return '('+this.Bonus+')';
		}
		return (this.Bonus > 0) ? (''+this.Bonus) : '';
	}

	UpdateName()
	{
		if (this.Element)
		{
			let id = this.Element.querySelector('#name');
			if (id)
			{
				id.innerHTML = this.Name;
			}
		}
	}
	
	// TODO: OnChangeDelegate.Broadcast() -- listen
	UpdateElement()
	{
		let elem = this.Element;
		if (elem)
		{
			if (this.Name)
			{
				let name = elem.querySelector('#name');
				name.innerHTML = this.Name;
			}

			if (this.Color)
			{
				this.Element.style.background = this.Color;
			}
			
			let b = elem.querySelector('.bonus');
			if (b)
			{
				b.innerHTML = this.GetBonusText();	
			}
			
			const power = this.Power; //GetWildcardPower(wild);
			// TODO: dirty flag?
			this.ShowPowerLevel(power);
			
			if (this.Emoji)
			{
				let q = elem.querySelector(".big");
				if (q)
				{
					q.innerHTML = this.Emoji;
				}
			}
			
			if (this.Tooltip)
			{
				let tip = elem.querySelector(".tooltip");
				if (tip)
				{
					tip.innerHTML = this.Tooltip;
				}
			}
			
			if (this.Button && !this.Wild.disable_action)
			{
				this.ShowAction();
			}
			else
			{
				this.HideAction();
			}
			
			let corner = this.Corner;
			if (corner)
			{
				let icon = elem.querySelector('.card-prize');
				icon.innerHTML = corner;
				icon.style.display = 'block';
			}
		}
	}

	OnLimitReached() {}
	
	IncrementBonus()
	{
		if (this.AddBonus)
		{
			let b = this.Bonus || 0;
			let limit = this.BonusLimit || 100;
			let newValue = Math.min(b + this.AddBonus, limit);
			if (b != newValue)
			{
				this.Bonus = newValue;
				this.UpdateElement();
				
				if (newValue == limit)
				{
					this.OnLimitReached();
				}
			}
		}
	}

	// Remove this card from hand and spawn replacement
	ExchangeGift(wild)
	{
		console.assert(wild.CLASS);
		PlayerWildcards.ReplaceCard(this, wild);
		OnWildcardsChanged();
		// Limit shop availability?
		Player.IncrementPrizeCount(this.Wild);
	}	

	GiftWildcard(wild)
	{
		console.assert(wild.CLASS);
		let card = PlayerWildcards.CreateInstance(wild);
		PlayerWildcards.Add(card);
	}

	TrySwap(word)
	{
		let result = false;
		let swap = this.Wild.swap;
		if (swap)
		{
			let A = this.Wild.action;
			let UI = this.Wild.ui;
			if ((A && A.icon) || (UI && UI.upgrade))
			{
				// Wait for user to acknowledge with button
				this.Button = true;
				this.UpdateElement();
			}
			else // Automatic
			{
				if (Array.isArray(swap))
				{
					this.OnUpgrade(swap);
				}
				else
				{
					this.ExchangeGift(swap);
				}
				result = true;
			}
		}
		
		if (this.Wild.expire)
		{
			PlayerWildcards.OnWildcardSold(this);
		}
		
		return true;
	}
	
	ApplyPrizes(prize)
	{
		let coins = prize.coin || prize.coins || 0;
		if (coins > 0)
		{
			Player.AddCoins(coins);
		}
		let disc = prize.discard || prize.discards || 0;
		if (disc > 0)
		{
			PlayerDiscards += disc; // Player.Discards?
			UpdateScoreUI();
		}
		if (prize.inject)
		{
			NewDeck.InjectLetter(prize.inject);
		}
		let q = prize.quarter || prize.quarters || 0;
		if (q > 0)
		{
			Player.AddQuarters(q);
		}
	}
	
	TryBonus(word)
	{
		if (this.AddBonus && this.IsMatchWord(word))
		{
			this.IncrementBonus();
		}		
	}
	
	// Events: CalculateScore() => OnWordPlayed()
	OnWordPlayed(word,context)
	{
		let prize = this.Wild.prize;
		let limit = this.Wild.limit;
		let check = this.AddBonus || prize || limit;
		if (check && this.IsMatchWord(word))
		{
			this.OnMatchRewards(word);
		}
	}
	
	OnMatchRewards(word)
	{
		if (this.AddBonus)
		{
			this.IncrementBonus();
		}		
		
		let prize = this.Wild.prize;
		if (prize)
		{
			this.ApplyPrizes(prize);	
		}		
	}
	
	GetSalePrice()
	{
		let cost = this.Wild ? (this.Wild.cost) || 1 : 0;
		if (this.AddBonus)
		{
			// Extra coins for powering up words
			cost += this.Bonus || 0;
		}		
		let sale = Math.max(1,Math.floor(cost/2));
		return sale;
	}
	
	HidePrice()
	{
		let widget = this.Element;
		if (widget !== null)
		{
			let P = widget.querySelector('#price');
			P.style.display = 'none';
		}
	}
	ShowSellPrice()
	{
		let widget = this.Element;
		if (widget !== null)
		{
			let coins = this.GetSalePrice();
			let P = widget.querySelector('#price');
			P.innerHTML = (coins > 0) ? `${coins}&#128192` : "???";
			P.classList.add('opaque');
			P.style.display = 'block';
		}
	}
	
	CanSell() {	return true; }
	
	HideSellButton()
	{
		let widget = this.Element;
		if (widget) // not sold and deleted
		{
			let button = widget.querySelector('.sellTag');
			button.style.opacity = 0;
			button.style.display = 'none';
		}
		this.OnSale = false;
	}
	ShowSellButton()
	{
		let widget = this.Element;
		if (widget)
		{
			let button = widget.querySelector('.sellTag');
			button.style.opacity = 1;
			button.style.display = 'block'; // aka visible
			this.OnSale = true;
		}
	}

	ShowAction()
	{
		let widget = this.Element;
		if (widget)
		{
			let act = widget.querySelector('.actionTag');
			act.style.opacity = 1;
			act.style.display = 'block'; // aka visible
		}
	}
	HideAction()
	{
		let widget = this.Element;
		if (widget)
		{
			let act = widget.querySelector('.actionTag');
			act.style.opacity = 0;
			act.style.display = 'none';
		}
	}	
	
	HideBuyButton(widget)
	{
		let buy = widget.querySelector('.buyTag');
		buy.style.opacity = 0;
		buy.style.visibility = 'none';
	}
	ShowBuyButton(widget)
	{
		if (widget !== null)
		{
			let buy = widget.querySelector('.buyTag');
			buy.style.opacity = 1;
			buy.style.visibility = 'block'; // aka visible
		}
	}
	
	OnClicked()
	{
		// Toggle SELL button on/off
		if (this.OnSale)
		{
			this.HidePrice();
			this.HideSellButton();
		}
		else if (this.CanSell())
		{
			this.ShowSellPrice();
			this.ShowSellButton();
		}		
	}
	
	PlaySound(tag)
	{
		TryPlaySound(this.Wild,tag);
	}
	
	OnSell()
	{
		let sale = this.GetSalePrice();
		this.Sold = true;
		Player.AddCoins(sale);
		console.log("SOLD = "+this.Wild.name);
		PlayerWildcards.OnWildcardSold(this);
		this.PlaySound('sell');
		OnWildcardsChanged();
	}
	
	// NOTE: this makes Word cards have different background colors!
	// Comn multi +0/+0
	// Unco multi +1/+2
	// Rara multi +3/+4
	// Epic multi +5/+6
	// Myth multi +7/+8
	UpdateRarity(wild)
	{
		let rarity = 0; // Common (White)
		let multi = wild.multi || 0;
		     if (multi >= 12) rarity = 4; // Mythic   (Orange)
		else if (multi >=  8) rarity = 3; // Epic     (Purple)
		else if (multi >=  5) rarity = 2; // Rare     (Blue)
		else if (multi >=  2) rarity = 1; // Uncommon (Green)
		this.Rarity = rarity;
		return rarity;
	}
	
	GetBackColor(wild)
	{
		this.UpdateRarity(wild);
		
		const Colors =
		[
			'#FFFFFF', // White
			'#7FBF7F', // Green
			'#6090FF', // Blue
			'#C060C0', // Red/Purple
			'#FFA060', // Yellow/Orange/Gold
		];
		
		return Colors[this.Rarity];
	}
	
	UpdateCornerIcon(wild, element)
	{
		if (wild.prize || wild.swap || wild.corner)
		{
			let icon = element.querySelector('.card-prize');
			if (wild.corner)
			{
				icon.innerHTML = wild.corner;
			}
			icon.style.display = 'block';
		}
	}

	/*
	ShopInit(wild)
	{
		// TODO: Shop uses BaseCard without correct constructor?
		if (!this.Score)
		{
			this.Score = wild.score || 0;
		}
		if (!this.Expo)
		{
			this.Expo = wild.expo || 0;
		}
	}
	*/
	
	GetScore() { return this.Score || this.Wild.score || 0; }
	GetMulti() { return this.Multi || this.Wild.multi || 0; }
	GetExpo()  { return this.Expo  || this.Wild.expo  || 0; }
	
	FormatDesc(desc)
	{
		//this.ShopInit(this.Wild);
		let text = desc;
		let multi = this.GetMulti();
		let score = this.GetScore();
		let expo = this.GetExpo();
		let letter = this.Wild.letter;
		if (letter)
		{
			text = text.replace(/{letter}/g, letter);
		}
		return text.replace(/{multi}/g, multi).replace(/{score}/g, score).replace(/{expo}/g, expo);
	}

	BuildName(wild)
	{
		let rawName = this.Name || wild.name;
		let name = this.FormatDesc(rawName);
		return name;
	}
	BuildDesc(wild)
	{
		let desc = this.FormatDesc(wild.desc);
		return desc;
	}
	
	CreateBase(wild,name,emoji,bonus,html)
	{
		let element = document.createElement('div');
		
		// TODO: BuildName with custom 'name' support?
		//this.Name = name;
		//this.BuildName(wild);
		if (!this.Score)
		{
			this.Score = wild.score || 0;
		}
		let title = this.FormatDesc(name);
		
		let desc = this.BuildDesc(wild)
		element.className = 'wild';
		element.innerHTML = `
			<div id="name">${title}</div>
			<div class="back"></div>
			<div class='big'>${emoji}</div>
			<div class='bonus'>${bonus}</div>
			<div class="tooltip">${desc}</div>
			${html}
			`;
		this.UpdateCornerIcon(wild, element);
		return element;
	}
	
	// Used by shop only?
	CreateRawElement(wild,name,emoji,bonus)
	{
		let html =
			`<button class="buyTag">BUY</button>
			<button class="sellTag">SELL</button>
			<div id="price" class="buyCost">5&#128192T</div>
			<div class="card-prize">&#x1F381</div>`;
			
		let element = this.CreateBase(wild,name,emoji,bonus,html);
		this.UpdateCornerIcon(wild, element);
		
		if (wild.color)
		{
			element.style.background = wild.color;
		}	
		else if (wild.bonus)
		{
			let bcolor = this.GetBackColor(wild);
			element.style.background = bcolor;
			let back = element.querySelector('.back');
			back.innerHTML = "+ + +<br>+ + + +<br>+ + +";
			back.style.color = '#55F';//'#4f6fFF';
		}
		return element;
	}
	
	// Returns a new HTML element aka widget
	CreateElement(wild)
	{
		let emoji = wild.emoji || '&#x1F451;';
		let bonus = this.GetBonusText();
		let name = this.BuildName(wild);
		const IconBell = '&#x1F514'; // default Bell icon
		const IconDiamond = '&#128310';
		let actIcon = IconDiamond;//Bell;
		let A = wild.action;
		if (A && A.icon)
		{
			actIcon = A.icon;
		}
		const IconFlame = '&#x1F525';
		const IconUp = '&#128316';
		let UI = wild.ui;
		if (UI && UI.upgrade)
		{
			actIcon = IconUp;//IconFlame;
		}
		let desc = this.BuildDesc(wild);
		const element = document.createElement('div');
		element.className = 'wild';
		element.innerHTML = `
			<div id="name">${name}</div>
			<div class="back"></div>
			<div class='big'>${emoji}</div>
			<div class='bonus'>${bonus}</div>
			<div class="tooltip">${desc}</div>
			<button class="buyTag">BUY</button>
			<button class="sellTag">SELL</button>
			<button class="actionTag">${actIcon}</button>
			<div id="price" class="buyCost">5&#128192T</div>
			<div class="card-prize">&#x1F381</div>
		`;
		
		this.UpdateCornerIcon(wild, element);
		
		if (wild.color)
		{
			element.style.background = wild.color;
		}
		else if (wild.bonus)
		{
			let bcolor = this.GetBackColor(wild);
			element.style.background = bcolor;
			let back = element.querySelector('.back');
			back.innerHTML = "+ + +<br>+ + + +<br>+ + +";
			back.style.color = '#55F';//'#4f6fFF';
		}
		
		element.addEventListener('click', ()=>{ this.OnClicked(); });
		let sell = element.querySelector('.sellTag');
		sell.addEventListener('click',()=>{ this.OnSell(); });
		let action = element.querySelector('.actionTag');
		action.addEventListener('click',(event)=>{ this.OnAction(event); event.stopPropagation(); });
		
		element.Card = this; // New
		element.Wild = wild; // Original
		this.Element = element;
		//this.ShowAction();
		return element;
	}
	
	ShowPowerLevel(power)
	{
		let card = this.Element;
		const color1 = '#d0d0f4';
		const color2 = '#00FF00';
		const color3 = '#0000FF';
		let color = color1;
		let border = '2px solid #c9a83f';
		if (power > 0.0)
		{
			const t1 =  power     *2;
			const t2 = (power-0.5)*2;
			color = (power < 0.5) ?
				lerpColor(t1, color1, color2) :
				lerpColor(t2, color2, color3);
			let style = 'double';
			let size = '4px'; // TODO: 4px was shifting BACK elem?
			let bcolor = '#00FFCF';//'#00AFFF';
			if (power < 0.33) bcolor = "#FFA000";
			if (power < 0.50) style='dashed';
			if (power > 0.77) style='solid';
			border = size+' '+style+' '+bcolor;
			// TODO: update frequency for sizzling colors?
		}
		//card.style.background = color;
		card.style.border = border;
	}

	GetKeys()
	{
		let S = this.Keys;
		if (S == null && this.Wild.dict)
		{
			const keys = this.Wild.dict.split('|');
			S = new Set(keys);
			if (this.Wild.include)
			{
				for (let g of this.Wild.include)
				{
					g.split('|').forEach(item => S.add(item));
				}
			}
			this.Keys = S;
		}
		return S;
	}	

	ApplyRewards(rewards)
	{
		const coins = rewards.coins || 0;
		const discards = rewards.discards || 0;
		if (discards > 0)
		{
			Player.AddDiscards(discards);
		}
		if (coins > 0)
		{
			Player.AddCoins(coins);
		}
	}
	
	GiveRewards(word)
	{
		const give = this.Wild.give;
		if (give)
		{
			let reward = {};
			if (give.coins)
			{
				reward.coins = SelectWordValue(this, give.coins, word);
			}
			if (give.discards)
			{
				reward.discards = SelectWordValue(this, give.discards, word);
			}
			this.ApplyRewards(reward);
		}
	}
}

	// TODO: new Card context?
	function GetLowChar(card, word)
	{
		let match = '';
		let lowScore = 9999;
		for (let i=0; i<word.length; i++)
		{
			let ch = word[i];
			if (card.IsMatchLetter(ch))
			{
				let score = getLetterScore(ch);
				if (score < lowScore)
				{
					lowScore = score;
					match = ch;
				}
			}
		}
		return match;
	}
	
	function GetHighChar(card, word)
	{
		let match = '';
		let highScore = 0;
		for (let i=0; i<word.length; i++)
		{
			let ch = word[i];
			if (card.IsMatchLetter(ch))
			{
				let score = getLetterScore(ch);
				if (score > highScore)
				{
					highScore = score;
					match = ch;
				}
			}
		}
		return match;
	}
	
	function SelectWordValue(card, select, word)
	{
		if (select == true)
		{
			return word.length;
		}
		if (select === 'LowTile')
		{
			let ch = GetLowChar(card, word);
			return getLetterScore(ch);
		}
		if (select === 'HighTile')
		{
			let ch = GetHighChar(card, word);
			return getLetterScore(ch);
		}
		return 0;
	}

// These cards have a "dict" property
// with a dictionary of valid words separated by | pipes
//		dict:"word1|word2|word3",
//		unique: true,
// TODO: Maybe playing an 8-letter word from category gives special gift?
class WordCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(this.Wild.dict);
		this.Used = new Set();
		let unique = this.Wild.unique || false;
		this.UniqueBonus = this.AddBonus && unique;
		this.Multi ||= 2;
		this.BonusLimit = this.Wild.limit || 100;
		this.Button = false;
		if (wild.randomize)
		{
			this.Randomize();
		}
	}
	
	Randomize()
	{
		// TODO: remove items for unique selection?
		let table = this.Wild.randomize;
		let keys = Object.keys(table);
		let randomKey = RND(keys);
		while (this.IsMatchWord(randomKey)) // prevent immediate duplicate
		{
			randomKey = RND(keys);
		}
		let emoji = table[randomKey];
		//this.Name = randomKey;
		this.Emoji = emoji;
		this.Keys = new Set([randomKey]);
		this.UpdateElement();
	}

	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			let extra = this.IsDuplicate(c.Word) ? 0 : this.Bonus;
			c.Apply(this, this.Multi, extra);
		}
	}

	OnUpgrade(list)
	{
		if (list.length == 0)
		{
			console.log("WordCard upgrade failed.");
			return;
		}
		let pick = RND(list);
		if (pick !== null)
		{
			this.ExchangeGift(pick);
		}
		let prize = this.Wild.upgrade;
		if (prize)
		{
			this.ApplyPrizes(prize);
		}
	}
	
	OnLimit(actions)
	{
		if (actions.prize)
		{
			this.ApplyPrizes(actions.prize);
		}
	}
	
	OnWordPlayed(word)
	{
		if (this.IsMatchWord(word))
		{
			if (this.AddBonus)
			{
				if (!this.UniqueBonus || !this.Used.has(word))
				{
					this.IncrementBonus();
				}
			}

			let prize = this.Wild.prize;
			if (prize)
			{
				this.ApplyPrizes(prize);
			}
			
			this.Used.add(word);

			if (this.Wild.randomize)
			{
				this.Randomize();
			}

			const UI = this.Wild.ui;
			if (UI && UI.show_words)
			{
				let text = this.FormatDesc(this.Wild.desc);
				let words = [...this.Used].join(', ');
				this.Tooltip = text+"<br>"+words;
				this.UpdateElement();
			}
	
			// Optional words that trigger destruction
			if (this.Wild.reject)
			{
				let words = this.Wild.reject.split('|');
				if (words.includes(word))
				{
					PlayerWildcards.OnWildcardSold(this);
					return;
				}
			}

			let limit = this.Wild.limit || 0;
			if (limit && this.Used.size >= limit)
			{
				Player.AddCompleted(this.Wild);
				
				let actions = this.Wild.OnLimit;
				if (actions)
				{
					this.OnLimit(actions);
				}
				
				let swap = this.Wild.swap;
				if (swap)
				{
					let A = this.Wild.action;
					let UI = this.Wild.ui;
					if ((A && A.icon) || (UI && UI.upgrade))
					{
						// Wait for user to acknowledge with button
						this.Button = true;
						this.UpdateElement();
					}
					else // Automatic
					{
						if (Array.isArray(swap))
						{
							this.OnUpgrade(swap);
						}
						else
						{
							this.ExchangeGift(swap);
						}
					}
				}
				
				if (this.Wild.expire)
				{
					PlayerWildcards.OnWildcardSold(this);
				}
			}
		}
	}
	
	// Override base function
	IsMatchWord(word)
	{
		const S = this.GetKeys();
		return S && S.has(word);
	}
	
	IsDuplicate(word)
	{
		return this.UniqueBonus ? this.Used.has(word) : false;
	}
	
	OnWordChanged(word)
	{
		const light = this.IsMatchWord(word);
		let power = light ? 1:0;
		if (light && this.IsDuplicate(word))
		{
			power = 0.25; // dotted line indicates no bonus
		}
		if (power != this.Power) // changed?
		{
			this.Power = power;
			this.UpdateElement();
		}
		this.Highlight = light;
	}
	
	OnlyFresh(list)
	{
		let result = [];
		for (let wild of list)
		{
			// Do not upgrade to Word-card you have or already completed.
			let finished = Player.HasCompleted(wild);
			let owned = PlayerWildcards.HasWild(wild);
			if (finished || owned)
			{
				continue; // skip
			}
			result.push(wild);
		}
		return result;
	}
	
	// Optional action button for upgrade
	OnAction(event)
	{
		// Assume upgrade/action
		let swap = this.Wild.swap;
		if (swap)
		{
			if (Array.isArray(swap))
			{
				let subset = this.OnlyFresh(swap);
				if (subset.length)
				{
					this.OnUpgrade(subset);	
				}
				else
				{
					// TODO: Expire vs default Replacement?
					PlayerWildcards.OnWildcardSold(this);
				}
			}
			else
			{
				this.ExchangeGift(swap);
			}
		}
	}
}

class WordTiers extends WordCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.tiers);
		this.Limit = wild.limit || 0;
		this.Multi = wild.multi || 0;
		this.Used = new Set();
		this.UniqueBonus = true;
		this.Tiers = wild.tiers;
		this.Tier = -1;
		this.SetTier(0);
	}
	
	SetTier(index) // aka SetLevel
	{
		if (index !== this.Tier)
		{
			// Only reset progress when upgrading since this is
			// also called when the set of wildcards is modified
			// so that buttons etc. can be updated
			this.Tier = index;
			// Used set carries over for entier life cycle
			let T = this.Tiers[index];
			if (T.name)
			{
				this.Name = T.name;
			}
			if (T.desc)
			{
				this.Tooltip = this.FormatDesc(T.desc);
			}
			if (T.emoji)
			{
				this.Emoji = T.emoji;
			}
			if (T.multi)
			{
				this.Multi = T.multi;
			}
			if (T.limit)
			{
				this.Limit += T.limit;
			}
			if (T.prize)
			{
				this.Prize = T.prize;
			}
		}
	}

	OnTierMax()
	{
		Player.AddCompleted(this.Wild);
		this.OnLimitReached();
	}
	
	OnLevelUp()
	{
		if (this.Tiers)
		{
			let t = this.Tier + 1;
			if (t < this.Tiers.length)
			{
				this.SetTier(t);
				this.UpdateElement();
				let prize = this.Wild.upgrade;
				if (prize)
				{
					this.ApplyPrizes(prize);
				}
			}
			else
			{
				this.OnTierlMax();
			}
		}
	}

	// Valid word played and bonus-limit reached
	OnLimitReached()
	{
		this.OnLevelUp();
	}
	
	ApplyLimit()
	{
		if (this.Used.size >= this.Limit)
		{
			this.OnLevelUp();
		}
		else
		{
			this.UpdateElement();
		}
	}
	
	OnWordPlayed(word)
	{
		super.OnWordPlayed(word);
		
		if (!this.IsMatchWord(word))
		{
			return;
		}
		
		// No restriction on word re-use
		this.Used.add(word);
		
		// Only give prize for level up
		//this.GiveRewards(word);
		
		const UI = this.Wild.ui || { show_words:true };
		if (UI && UI.show_words)
		{
			let text = this.FormatDesc(this.Wild.desc);
			let words = [...this.Used].join(', ');
			this.Tooltip = text+"<br>"+words;
			this.UpdateElement();
		}
		
		// May call OnLiitReached
		this.ApplyLimit();
	}	
	
	OnLimitReached()
	{
		let actions = this.Wild.OnLimit;
		if (actions)
		{
			this.OnLimit(actions);
		}
		
		let swap = this.Wild.swap;
		if (swap)
		{
			let A = this.Wild.action;
			let UI = this.Wild.ui;
			if ((A && A.icon) || (UI && UI.upgrade))
			{
				// Wait for user to acknowledge with button
				this.Button = true;
				this.UpdateElement();
			}
			else // Automatic
			{
				if (Array.isArray(swap))
				{
					this.OnUpgrade(swap);
				}
				else
				{
					this.ExchangeGift(swap);
				}
			}
		}
		
		if (this.Wild.expire)
		{
			PlayerWildcards.OnWildcardSold(this);
		}
	}
	
	GetBonusText()
	{
		// TODO: interval?
		let scale = this.Tiers[0].limit;
		let base = this.Tier*scale;
		let A = this.Used.size - base;
		let B = this.Limit - base;
		if (A > 0 && B > 0)
		{
			return A+'/'+B;
		}
		return '';
	}
}

class DualWordCard extends WordCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.one);
		console.assert(wild.two);
		this.One = { keys:null, emoji:wild.one.emoji, dict:wild.one.dict };
		this.Two = { keys:null, emoji:wild.two.emoji, dict:wild.two.dict };
		this.Mode = this.One;
		this.Emoji = this.Mode.emoji;
	}
	
	// Override base function
	IsMatchWord(word)
	{
		let M = this.Mode;
		if (M.keys == null)
		{
			const words = M.dict.split('|');
			M.keys = new Set(words);
		}
		return M.keys.has(word);
	}		
	
	SwapMode()
	{
		let M = (this.Mode === this.One) ? this.Two : this.One;
		this.Name = M.name ? M.name : this.Wild.name;
		this.Mode = M;
		this.Emoji = M.emoji;
		this.UpdateElement();
	}

	OnWordPlayed(word)
	{
		super.OnWordPlayed(word);

		if (this.DelaySwap)
		{
			this.DelaySwap = null;
			this.SwapMode();
		}
	}	

	// Event Sequence:
	//	OnLetterPlayed(ch)
	//	OnWordChanged(word)
	//	NewCalculateScore(calc)
	//	OnWordPlayed(word)
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			let extra = this.Bonus || 0;
			c.Apply(this, this.Multi, extra);

			// Wait until OnWordPlayed to swap or match will fail!
			this.DelaySwap = true;
			// TODO: side effect if just calculating -- BUG?
		}
	}
}

// questions: { A:[], B:[], C:[] };
// swap: Wild_01
class RiddleCard extends WordCard
{
	constructor(wild)
	{
		super(wild);
	}
	
	OnEquip()
	{
		// Only first time equipped
		if (!this.Tooltip)
		{
			// Card in hand vs shop
			let Qlist = this.Wild.questions;
			let keys = Object.keys(Qlist);
			let A = RND(keys);
			let Q = RND(Qlist[A]);
			this.Tooltip = Q;
			this.Answer = A;
			let S = new Set();
			S.add(A); // TODO: did this fix Riddle for Nerd card?
			this.Keys = S;
		}
		this.UpdateElement();
	}
	
	// Override base function
	IsMatchWord(word)
	{
		return (this.Answer == word);
	}		
	
	ReplaceCard()
	{
		let rewild = this.Wild.swap;
		if (rewild)
		{
			this.ExchangeGift(rewild);
		}
		else
		{
			PlayerWildcards.OnWildcardSold(this);
		}
	}

	OnWordPlayed(word)
	{
		super.OnWordPlayed(word);

		if (this.DelayReplace)
		{
			this.DelayReplace = null;
			this.ReplaceCard();
		}
	}	

	// Event Sequence:
	//	OnLetterPlayed(ch)
	//	OnWordChanged(word)
	//	NewCalculateScore(calc)
	//	OnWordPlayed(word)
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			const extra = this.Bonus || 0;
			c.Apply(this, this.Multi, extra);
			
			// Wait until OnWordPlayed to replace
			if (this.Wild.swap)
			{
				this.DelayReplace = true;	
			}
		}
	}
}

// Highlight words containing specific letters
//   letters: "AEIOU",
//   letters: "Q",
class LetterCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.letters);
		this.Multi ||= 2;
		this.GetRegex();
	}
	
	GetRegex()
	{
		let R = this.Regex;
		if (R == null && this.Wild.letters)
		{
			// Use global search to get letter count
			R = new RegExp(`[${this.Wild.letters}]`,'g');
			this.Regex = R;
		}
		return R;
	}
	
	IsMatchLetter(ch)
	{
		let R = this.Regex;
		return R ? ch.match(R) : false;
	}

	GetMatchCount(word)
	{
		let R = this.Regex;
		if (R == null)
		{
			return 0;
		}
		const matches = word.match(R);
		return matches ? matches.length : 0;			
	}
	
	OnWordPlayed(word)
	{
		// TODO: Bonus for any letter?
		//super.OnWordPlayed(word);

		// Earn prize for each matching letter
		let prize = this.Wild.prize;
		if (prize)
		{
			let count = this.GetMatchCount(word);
			for (let i=0; i<count; i++)
			{
				this.ApplyPrizes(prize);
			}
		}

		let swap = this.Wild.swap;
		if (swap)
		{
			if (Array.isArray(swap))
			{
				this.OnUpgrade(swap);
			}
			else
			{
				this.ExchangeGift(swap);
			}			
		}
	}
	
	NewCalculateScore(c)
	{
		let used = false;
		const word = c.Word;
		for (let i=0; i<word.length; i++)
		{
			if (this.IsMatchLetter(word[i]))
			{
				const eq = c.EQ;
				const rule = this.Wild.letter_score;
				if (rule)
				{
					let bValid = false;
					let letter = eq.score[i];
					if (rule.add)
					{
						// If you have Upgrade tile E=2
						// and E+ (4) they should combine
						// E=1+1+3 = 5
						letter += rule.add;
						bValid = true;
					}
					if (rule.clamp)
					{
						// If you have two overlapping rules
						// Like A+ and Vowels which affect A-tiles
						// A=5 vs AEIOU=3 ensures max(3,5) => 5
						letter = Math.max(letter, rule.clamp);
						bValid = true;
					}
					if (!bValid)
					{
						console.assert(false);
					}
					eq.score[i] = letter;
				}
				else
				{
					eq.score[i] *= this.Multi;	
				}
				used = true;
			}
		}
		if (used)
		{
			c.OnWildcardUsed(this);
		}
	}
	
	OnWordChanged(word)
	{
		let R = this.Regex;
		if (R != null)
		{
			const matches = word.match(R);
			const count = matches ? matches.length : 0;
			this.Power = (count > 0) ? Math.min(0.2+count*0.2, 1.0) : 0.0;		
		}
		else
		{
			this.Power = 0;
		}
		this.Highlight = this.Power > 0;
	}
}

// Highest letter special scoring
//   letters: "A..Z"
class HighCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		// No explicit letter matches all.
		if (!wild.letters)
		{
			wild.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		}
		console.assert(wild.letters);
		this.Used = [];
		this.Multi = this.Multi || 1;
	}
	
	IsMatchLetter(ch)
	{
		let R = this.Regex;
		if (R == null && this.Wild.letters)
		{
			R = new RegExp(`[${this.Wild.letters}]`);
			this.Regex = R;
		}
		if (R != null)
		{
			return ch.match(R);
		}
		return false;
	}
	
	NewCalculateScore(c)
	{
		let M = this.Wild.match;
		if (M)
		{
			if (this.IsMatchWord(c.Word))
			{
				c.Apply(this, this.Multi, 0);
			}
			return;
		}
		
		if (this.Multi <= 1)
		{
			return; // Skip
		}
		
		// Fallback
		let word = c.Word;
		let eq = c.EQ;
		let highIndex = -1;
		let highScore = 0;
		let match = '?';
		for (let i=0; i<word.length; i++)
		{
			let ch = word[i];
			if (this.IsMatchLetter(ch))
			{
				// Wildcard order of execution matters?
				let score = eq.score[i];
				//let score = getLetterScore(ch);
				if (score > highScore)
				{
					highIndex = i;
					highScore = score;
					match = ch;
				}
			}
		}
		// TODO: ApplyLetterScore(ch,score)
		for (let i=0; i<word.length; i++)
		{
			if (word[i] == match)
			{
				let NewScore = this.Multi * highScore;
				//eq.score[i] = Math.max(eq.score[i],NewScore);
				c.SetLetterScore(i,NewScore)
			}
		}
	}

	IsMatchWord(word)
	{
		if (word.length == 0)
		{
			return false;
		}
		let M = this.Wild.match;
		if (M)
		{
			if (M.first) // first letter highest tile?
			{
				// TODO: disqualify if two Different letters with same value?
				let ch = GetHighChar(this, word);
				if (word[0] == ch)
				{
					return true;
				}
			}
			return false;
		}
		if (!this.Regex)
		{
			// Verify regex
			this.IsMatchLetter('X');	
		}
		let R = this.Regex;
		let ok = false;
		if (R != null)
		{
			let Q = R.test(word);
			ok = word.match(R) ? true : false;
		}
		return ok;		
	}
	
	OnWordChanged(word)
	{
		let ok = this.IsMatchWord(word);
		this.Power = ok ? 1:0;
		let name = this.Wild.name;
		if (ok)
		{
			// By raw value does not include Wildcard modifiers
			let ch = GetHighChar(this, word);
			name += " ("+ch+")";
		}
		this.Name = name;
		this.UpdateElement();
	}
	
	ApplyLimit()
	{
		let limit = this.Wild.limit || 0;
		if (limit && this.Used.size >= limit)
		{
			Player.AddCompleted(this.Wild);
			
			this.OnLimitReached();
		}
	}
	
	OnWordPlayed(word)
	{
		super.OnWordPlayed(word);
		
		if (!this.IsMatchWord(word))
		{
			return;
		}
		
		// No restriction on word re-use
		this.Used.push(word);
		this.GiveRewards(word);
		
		// May call OnLiitReached
		this.ApplyLimit();
	}	
	
	OnLimitReached()
	{
		let actions = this.Wild.OnLimit;
		if (actions)
		{
			this.OnLimit(actions);
		}
		
		let swap = this.Wild.swap;
		if (swap)
		{
			let A = this.Wild.action;
			let UI = this.Wild.ui;
			if ((A && A.icon) || (UI && UI.upgrade))
			{
				// Wait for user to acknowledge with button
				this.Button = true;
				this.UpdateElement();
			}
			else // Automatic
			{
				if (Array.isArray(swap))
				{
					this.OnUpgrade(swap);
				}
				else
				{
					this.ExchangeGift(swap);
				}
			}
		}
		
		if (this.Wild.expire)
		{
			PlayerWildcards.OnWildcardSold(this);
		}
	}
}

// Lowest letter special scoring
//   letters: "A..Z"
class LowCard extends HighCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.letters);
		this.Min = wild.clamp || 2;
	}
	
	NewCalculateScore(c)
	{
		let word = c.Word;
		let eq = c.EQ;
		
		let index = -1;
		let score = 9999;
		let match = '?';
		for (let i=0; i<word.length; i++)
		{
			let ch = word[i];
			if (this.IsMatchLetter(ch))
			{
				let value = getLetterScore(ch);
				if (value < score)
				{
					index = i;
					score = value;
					match = ch;
				}
			}
		}
		for (let i=0; i<word.length; i++)
		{
			if (word[i] == match)
			{
				// All instances of lowest letter are raised
				eq.score[i] = Math.max(eq.score[i], this.Min);
			}
		}
	}
	
	OnWordChanged(word)
	{
		let ok = this.IsMatchWord(word);
		this.Power = ok ? 1:0;
		let name = this.Wild.name;
		if (ok)
		{
			// By raw value does not include Wildcard modifiers
			let ch = GetLowChar(this, word);
			name += " ("+ch+")";
		}
		this.Name = name;
		this.UpdateElement();
	}	
}

function OpCompare(a,op,b)
{
	if (op === 'greater') return a > b;
	if (op === 'greater-equal') return a >= b;
	if (op === 'less') return a < b;
	if (op === 'less-equal') return a <= b;
	if (op === 'not-equal') return a != b;
	// Default 'equal'
	return (a == b);
}

// Highlight words containing X letters
class SizeCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.size);
		this.Multi = wild.multi || 0;
		this.Levels = wild.levels;
		this.Level = wild.levels ? 1:0;
		this.Size = wild.size;
		this.BonusLimit = wild.limit || 99;
		this.Used = new Set();
		this.Op = wild.op || 'equal';
	}

	// Override base function
	IsMatchWord(word)
	{
		return OpCompare(word.length, this.Op, this.Size);
	}

	SlowCanSpell(word,letters)
	{
		// Convert letters to an array
		let availableLetters = letters.split('');

		// Check if each character in word is available in availableLetters
		for (let char of word)
		{
			let index = availableLetters.indexOf(char);
			if (index === -1)
			{
			  return false; // Character not available
			}
			// Remove the character from availableLetters
			availableLetters.splice(index, 1);
		}
		return true; // All characters are available		
	}

	CanSpell()
	{
		let letters = PlayerTiles.GetLetters();
		if (letters.length == 0)
		{
			return false;
		}
		if (this.Size == letters.length)
		{
			let sorted = this.SortLetters(letters);
			return this.MagicSort.has(sorted);
		}
		else // Scan dictionary for possible words
		{
			for (let word of this.Magic)
			{
				if (this.SlowCanSpell(word,letters))
				{
					return true;
				}
			}
		}
	}
	
	OnHandReady()
	{
		// TODO: delay to prevent multiple slow searches?
		if (this.Power == 0 && this.Magic)
		{
			if (this.CanSpell())
			{
				this.Power = 0.25; // dashed outline
				this.UpdateElement();
			}
		}
	}
	
	// TODO: replacing Blank tile with specific letter does not call this?
	OnWordChanged(word)
	{
		this.HighlightMatchWord(word);
		
		// Check for highlight?
		this.OnHandReady();
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.Apply(this, this.Multi, this.Bonus);
		}
	}

	// Valid word played and bonus-limit reached
	OnLimitReached()
	{
		this.OnLevelUp();
	}
	
	SetLevel(index)
	{
		let changed = false;
		if (index !== this.Level)
		{
			// Only reset progress when upgrading since this is
			// also called when the set of wildcards is modified
			// so that buttons etc. can be updated
			this.Level = index;
			this.Bonus = 0;
			this.Used = new Set();
			changed = true;
		}
		let L = this.Levels[index-1];
		if (L.name)
		{
			this.Name = L.name;
		}
		if (L.desc)
		{
			this.Tooltip = this.FormatDesc(L.desc);
		}
		if (L.emoji)
		{
			this.Emoji = L.emoji;
		}
		if (L.size)
		{
			this.Size = L.size;
		}
		if (L.multi)
		{
			this.Multi = L.multi;
		}
		if (L.limit)
		{
			this.BonusLimit = L.limit;
		}
	}
	
	OnLevelUp()
	{
		if (this.Levels)
		{
			let l = this.Level + 1;
			if (l <= this.Levels.length)
			{
				this.SetLevel(l);
				this.UpdateElement();
			}
			else
			{
				this.OnLevelMax();
			}
		}
	}

	OnLevelMax()
	{
		let rewild = this.Wild.swap;
		if (rewild)
		{
			this.ExchangeGift(rewild);
		}
		else // remove expired
		{
			PlayerWildcards.OnWildcardSold(this);
		}		
	}
	
	SortLetters(word)
	{
		let letters = word.split('');
		return letters.sort().join('');							
	}
	
	OnEquip()
	{
		if (this.Level != 0)
		{
			this.SetLevel(this.Level);
		}
		
		if (this.Wild.magic)
		{
			let dict = new Set();
			let sort = new Set();
			let size = this.Size;
			for (let w of Dictionary)
			{
				if (w.length == size)
				{
					dict.add(w);
					// Keep set of sorted letters needed for faster compare?
					let sorted = this.SortLetters(w);
					sort.add(sorted);
				}
			}
			this.Magic = dict;
			this.MagicSort = sort;
		}
	}
	
	OnWordPlayed(word)
	{
		if (!this.IsMatchWord(word))
		{
			return;
		}
		
		this.Used.add(word);

		// This can trigger Level Up/Max events
		super.OnWordPlayed(word);

		this.GiveRewards(word);

/* What wildcard used to want this?
		// TODO: OnLimitReached only called if AddBonus?
		if (this.AddBonus != 0)
		{
			return;
		}
*/
		
		// TODO: OnLevelMax vs this?
		// If limit is valid and reached?
		const limit = this.Wild.limit || 0;
		if (limit)
		{
			const count = this.Used.size;
			this.BonusText = count+"/"+limit;
			this.UpdateElement();
			
			if (count >= limit)
			{
				let rewild = this.Wild.swap;
				if (rewild)
				{
					this.ExchangeGift(rewild);
				}
				else
				{
					PlayerWildcards.OnWildcardSold(this);
				}
			}			
		}
	}
}

class PatternCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.pattern);
		this.Multi ||= 2;
		this.Limit = wild.limit || 0;
		this.Used = new Set();
	}
	
	GetRegex()
	{
		let R = this.Regex;
		if (R == null && this.Wild.pattern)
		{
			R = new RegExp(this.Wild.pattern);
			this.Regex = R;
		}
		return this.Regex;
	}
	
	IsMatchWord(word)
	{
		if (this.Wild.palindrome)
		{
			if (word.length < 2)
			{
				return false;
			}
			const rev = word.split('').reverse().join('');
			return word === rev;
		}
		// Test the word against the regular expression
		const R = this.GetRegex();
		return R ? R.test(word) : false;
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.Apply(this, this.Multi, this.Bonus);
		}
	}
	
	OnWordChanged(word)
	{
		this.HighlightMatchWord(word);
	}

	GetBonusText()
	{
		const count = this.Used.size;
		const limit = this.Limit;
		if (count > 0 && limit > 0)
		{
			return count+'/'+limit;
		}
		return '';
	}
	
	OnMatchRewards(word)
	{
		super.OnMatchRewards(word);

		this.Used.add(word);
		
		const limit = this.Limit;
		if (limit == 0)
		{
			return;
		}
		
		const count = this.Used.size;
		if (count < limit)
		{
			this.UpdateElement();
			return;
		}
		
		let swap = this.Wild.swap;
		if (swap)
		{
			let A = this.Wild.action;
			let UI = this.Wild.ui;
			if ((A && A.icon) || (UI && UI.upgrade))
			{
				// Wait for user to acknowledge with button
				this.Button = true;
				this.UpdateElement();
			}
			else // Automatic
			{
				if (Array.isArray(swap))
				{
					this.OnUpgrade(swap);
				}
				else
				{
					this.ExchangeGift(swap);
				}
			}
		}
		
		if (this.Wild.expire)
		{
			PlayerWildcards.OnWildcardSold(this);
		}
	}
}

class SwapCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.pattern);
	}

	// TODO: incomplete experiment?
	OnLetterDrawn(tile)
	{
		if (tile.Letter == this.Wild.A)
		{
			// TODO: allow on-the-fly replacement?
		}
	}
	
	OnWordChanged(word)
	{
		let R = this.Regex;
		if (R == null && this.Wild.pattern)
		{
			R = new RegExp(this.Wild.pattern);
			this.Regex = R;
		}
		if (R != null)
		{
			// Test the word against the regular expression
			this.Power = R.test(word) ? 1:0;
		}
		else
		{
			this.Power = 0;
		}
		this.Highlight = this.Power > 0;
	}
}

// Automatic: Gives player +1 Discards per win
//   stat:{Discards:1},
class StatCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.stat);
		this.Auto = true;
		this.Coins = wild.stat.coins ? wild.stat.coins:0;
		this.Discards = wild.stat.discards ? wild.stat.discards:0;
	}
	
	IsMatch(word)
	{
		return true;
	}

	OnWordChanged(word)
	{
		// ALWAYS!
		this.Power = 1;
		this.Highlight = true;
	}

	// TODO: this event is never called?
	OnRoundEnd()
	{
		let T = this.Wild.trigger;
		if (T && T.round)
		{
			//this.OnReward();
		}
	}
	
	OnWordPlayed(word)
	{
		let T = this.Wild.trigger;
		if (T && T.word)
		{
			this.OnReward();
		}
	}
	
	// Called automatically when round score reached
	OnReward(reward)
	{
		let T = this.Wild.trigger;
		if (T && T.round)
		{
			reward.Coins += this.Coins;
			reward.Discards += this.Discards;
		}
	}
}

class MergeCard extends BaseCard
{
	// Virtual Override!
	GetClass() { return MergeCard; }
	
	// TODO: Multiply and Add card?
	CanMerge() { return true; }

	FindMatch()
	{
		// Try to find matching cards to combine
		let list = PlayerWildcards.FindLeft(this.GetClass(),this);
		
		let prev = null;
		for (let card of list)
		{
			prev = card; // generous match any value
		}
		return prev;
	}
	
	OnEquip(event)
	{
		// If there is a duplicate card to the left?
		let target = this.CanMerge() ? this.FindMatch() : null;
		
		// Flag to determine ShowAction
		this.Button = target ? true : false;
		
		if (this.Element)
		{
			this.UpdateElement();
		}
	}	
	
	OnDiscardLetter(letter) { this.Discards += 1; }

	IsMatchWord(word)
	{
		let alpha = this.Req ? this.Req.alpha : null;
		if (alpha != null)
		{
			return word.includes(alpha);
		}
		return false;
	}

	CheckRequirements(word)
	{
		const req = this.Req;
		if (req)
		{
			if (req.turn)
			{
				if (Round.Turn != req.turn)
				{
					return false;
				}
			}
			if (req.discards != null) // allow zero
			{
				if (this.Discards != req.discards)
				{
					return false;
				}
			}
			if (req.alpha != null)
			{
				return this.IsMatchWord(word);
			}
		}
		return true;
	}
	
	OnWordChanged(word)
	{
		let ready = word.length != 0;
		if (ready && !this.CheckRequirements(word))
		{
			ready = false;
		}
		this.Power = ready ? 1:0;
		this.Highlight = ready;
	}
	
	// Handle visual update after word played
	// OnTurn can be delayed by round finish pop-up.
	OnAnimate()
	{
		let letter = this.Req.alpha;
		this.Emoji = '('+letter+')';
		this.UpdateElement();
	}
	
	// TODO: copied from wrong base type?
	OnTurn(index)
	{
		let req = this.Req;
		if (req && req.alpha)
		{
			this.Emoji = req.alpha;
			this.UpdateElement();
		}
		
		// Reset discard count each turn
		this.Discards = 0;
	}	
	
	CanUpgrade(wild) // aka Enhancement card modifier?
	{
		if (wild.CLASS === this.constructor)
		{
			let isUpgrade = (wild.buy ? wild.buy.upgrade : false) || false;
			if (!isUpgrade)
			{
				return false;
			}
			if (wild.disable_action || wild.disable_merge)
			{
				return false;
			}			
			return true;
		}
		return false;
	}
}

// Automatic: Multiplier applied to word score
//   multi: 2,
//   req: { turn:4 },
class MultiplyCard extends MergeCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.multi);
		this.Auto = true;
		this.Multi = wild.multi || 1;
		this.Discards = 0;
		// Clone so that Alpha increment is not permanent
		this.Req = wild.req ? Object.assign({}, wild.req) : {};	
		
		if (wild.limit)
		{
			this.Charges = wild.limit;
			this.MaxCharges = wild.limit;
		}		
	}

	FormatBonusText()
	{
		if (this.Charges)
		{
			const max = this.MaxCharges;
			const used = max - this.Charges;
			if (used > 0)
			{
				return used + '/' + max;	
			}
		}
		return '';
	}		
	
	// Support BUY direct from shop card w/o empty slot
	static IsModifier(wild)
	{
		return true;
	}
	static CanPlayerBuy(wild)
	{
		return PlayerWildcards.HasMatchOrSlot(MultiplyCard);
	}
	static OnPlayerBuy(wild)
	{
		let left = PlayerWildcards.FindLeft(MultiplyCard,null);
		if (left.length !== 0)
		{
			let card = left[0];
			this.IncreaseMultiply(card,wild.multi);
		}
		else if (PlayerWildcards.HasEmptySlot())
		{
			let card = PlayerWildcards.CreateInstance(wild);
			PlayerWildcards.Add(card);
		}
	}

	static GetColorByMulti(multi)
	{
		return (multi < 16) ? ColorMulti : ColorYellowRare;
	}
	
	static IncreaseMultiply(card, value)
	{
		if (card != null)
		{
			// Increase card multipler and expire
			card.Multi += value;
			card.Color = this.GetColorByMulti(card.Multi);
			card.Name = card.FormatDesc("Multi +{multi}");
			card.Tooltip = card.FormatDesc(card.Wild.desc);			
			card.UpdateElement();
		}		
	}
	
	CanMerge()
	{
		// Make sure the left/right card are not disabled
		let wild = this.Wild;
		console.assert(wild);
		return (wild.disable_action || wild.disable_merge) ? false : true;
	}

	UseUpgrade(wild) // aka UseEnhancement
	{
		if (wild.CLASS === this.constructor)
		{
			if (wild.disable_action || wild.disable_merge)
			{
				return;
			}
			
			let newMult = this.Multi + wild.multi;
			this.Multi = newMult;
			if (newMult >= 16)
			{
				this.Color = ColorYellowRare;
			}
			
			this.Name = this.FormatDesc("Multi +{multi}");
			this.Tooltip = this.FormatDesc(this.Wild.desc);
			this.UpdateElement();			
		}
	}
	
	FindMatch()
	{
		let left = PlayerWildcards.FindLeft(MultiplyCard,this);
		
		// Try to find matching MultiplyCard to combine
		let prev = null;
		for (let card of left)//PlayerWildcards.Hand)
		{
			if (card === this)
			{
				break;
			}
			if (card instanceof MultiplyCard)
			{
				// NEW: Generous matching
				// Only if the multipliers match
				//if (this.Multi == card.Multi)
				if (card.CanMerge())
				{
					prev = card;	
				}
			}
		}		
		return prev;
	}
	
	OnAction(event)
	{
		let target = this.FindMatch();
		if (target != null)
		{
			// Increase Target multipler and expire this card
			target.Multi += this.Multi;
			if (target.Multi >= 16)
			{
				target.Color = ColorYellowRare;
			}
			target.Name = target.FormatDesc("Multi +{multi}");
			target.Tooltip = target.FormatDesc(target.Wild.desc);
			target.UpdateElement();
			PlayerWildcards.OnWildcardSold(this);
			OnWildcardsChanged();
		}
		else
		{
			this.Button = false;
			this.UpdateElement();
		}
	}
	
	NewCalculateScore(c)
	{
		if (this.CheckRequirements(c.Word))
		{
			c.Apply(this, this.Multi, this.Bonus);
		}
	}
	
	OnLimitReached()
	{
		let actions = this.Wild.OnLimit;
		if (actions)
		{
			this.OnLimit(actions);
		}
		
		this.TrySwap();
	}
	
	OnWordPlayed(word)
	{
		super.OnWordPlayed(word);

		let req = this.Req;
		let alpha = req ? req.alpha : null;
		if (alpha != null && this.CheckRequirements(word))
		{
			if (this.Charges)
			{
				let ch = this.Charges - 1;
				if (ch > 0)
				{
					this.Charges = ch;
					this.BonusText = this.FormatBonusText();
					this.UpdateElement();					
				}
				else
				{
					this.Charges = 0;
					Player.AddCompleted(this.Wild);
					this.OnLimitReached();					
					return;
				}
			}
					
			// TODO: Allow ABC to be played in a word? (ex. C-R-A-B)
			if (alpha !== 'Z')
			{
				req.alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);					
			}
			else
			{
				req.alpha = 'A';
			}
			// Highlight letter changed if success delays next turn?
			this.OnAnimate();
		}
	}
}

// Automatic: Add applied to word score
//   score: 4,
//   req: { turn:4 },
class AddCard extends MergeCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.score);
		this.Auto = true;
		this.Score = wild.score || 0;
		this.Multi = wild.multi || 0;
		this.Discards = 0;
		this.Req = wild.req;
	}

	// Support BUY direct from shop card w/o empty slot
	static IsModifier(wild)
	{
		return true;
	}
	static CanPlayerBuy(wild)
	{
		return PlayerWildcards.HasMatchOrSlot(AddCard);
	}
	static OnPlayerBuy(wild)
	{
		let left = PlayerWildcards.FindLeft(AddCard,null);
		if (left.length !== 0)
		{
			let card = left[0];
			this.IncreaseScore(card,wild.score);
		}
		else if (PlayerWildcards.HasEmptySlot())
		{
			let card = PlayerWildcards.CreateInstance(wild);
			PlayerWildcards.Add(card);
		}
	}
	
	UseUpgrade(wild) // aka UseEnhancement
	{
		if (wild.CLASS === this.constructor)
		{
			let newScore = this.Score + wild.score;
			this.Score = newScore;
			this.Color = this.GetColorByScore(newScore);
			this.Name = this.FormatDesc("Score +{score}");
			this.Tooltip = this.FormatDesc(this.Wild.desc);
			this.UpdateElement();			
		}
	}

	GetClass() { return AddCard; }
	/*
	FindMatch()
	{
		// Try to find matching cards to combine
		let list = PlayerWildcards.FindLeft(AddCard,this);
		
		let prev = null;
		for (let card of list)
		{
			prev = card; // generous match any value
		}
		return prev;
	}
	*/
	
	static GetColorByScore(score)
	{
		if (score >= 48) return '#F0F0A0';
		if (score >= 32) return '#F0F090';
		if (score >= 24) return '#E0E080';
		if (score >= 20) return '#D0D078';
		if (score >= 16) return '#C0C070';
		if (score >= 12) return '#B0B068';
		if (score >=  8) return '#A0A060';
		return '#808040';
	}
	
	static IncreaseScore(card, value)
	{
		if (card != null)
		{
			// Increase card multipler and expire
			card.Score += value;
			card.Color = this.GetColorByScore(card.Score);
			card.Name = card.FormatDesc("Score +{score}");
			card.Tooltip = card.FormatDesc(card.Wild.desc);
			card.UpdateElement();
		}		
	}
	
	OnAction(event)
	{
		let target = this.FindMatch();
		if (target != null)
		{
			// Increase Target multipler and expire this card
			AddCard.IncreaseScore(target, this.Score);
			PlayerWildcards.OnWildcardSold(this);
			OnWildcardsChanged();
		}
		else
		{
			this.Button = false;
			this.UpdateElement();
		}
	}
	
	NewCalculateScore(c)
	{
		if (this.CheckRequirements(c.Word))
		{
			c.Apply(this, this.Multi, this.Score);
		}
	}
	
	OnWordPlayed(word)
	{
		super.OnWordPlayed(word);

		let req = this.Req;
		let alpha = req ? req.alpha : null;
		if (alpha != null && this.CheckRequirements(word))
		{
			// TODO: Allow ABC to be played in a word? (ex. C-R-A-B)
			if (alpha !== 'Z')
			{
				req.alpha = String.fromCharCode(alpha.charCodeAt(0) + 1);					
			}
			else
			{
				req.alpha = 'A';
			}
		}
	}
}

// TODO: don't require Wildcard slot for Exponent?
// Exponent adds to the equation
//   expo: 4,
class ExpoCard extends MergeCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.expo);
		this.Auto = true;
		this.Expo = wild.expo || 1;
	}
	
	GetClass() { return ExpoCard; }
	
	// Support BUY direct from shop card w/o empty slot
	static IsModifier(wild)
	{
		return true;
	}
	static CanPlayerBuy(wild)
	{
		// Only PlayerStae no Wildcard slot
		return Player.ScoreExponent < 10;
		//return PlayerWildcards.HasMatchOrSlot(this);
	}
	static OnPlayerBuy(wild)
	{
		/*
		let left = PlayerWildcards.FindLeft(this,null);
		if (left.length !== 0)
		{
			let card = left[0];
			this.ApplyWildcard(card,wild);
		}
		else if (PlayerWildcards.HasEmptySlot())
		{
			let card = PlayerWildcards.CreateInstance(wild);
			PlayerWildcards.Add(card);
			const expo = Player.ScoreExponent + wild.expo;
			Player.SetExponent(expo);
		}
		*/
		// Only PlayerStae no Wildcard slot
		const add = wild.expo || 1;
		const expo = Player.ScoreExponent + add;
		Player.SetExponent(expo);
		// OnExpire
		//PlayerWildcards.OnWildcardSold(this);
		//OnWildcardsChanged();
	}
	
	static ApplyWildcard(card, wild)
	{
		if (card != null && wild && wild.expo)
		{
			// Increase exponent on existing wildcard
			card.Expo += wild.expo;
			card.Name = card.FormatDesc(card.Wild.name);
			card.Tooltip = card.FormatDesc(card.Wild.desc);
			//card.Color = this.GetColorByScore(card.Expo);
			card.UpdateElement();
			const expo = Player.ScoreExponent + wild.expo;
			Player.SetExponent(expo);
		}		
	}
	
	OnEquip()
	{
		const show = true;
		const last = this.Button ? true:false;
		if (show != last)
		{
			// Wait for user to acknowledge with button
			this.Button = show;
			this.UpdateElement();			
		}		
	}
	
	OnAction(event)
	{
		// Increase Exponent
		const add = this.Expo;
		const expo = Player.ScoreExponent + add;
		Player.SetExponent(expo);
		// Expire removes card from hand
		PlayerWildcards.OnWildcardSold(this);
		OnWildcardsChanged();		
	}
}

const DigitCodes = "0123456789";
const DigitWords = ["ZERO","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE"];
//const DigitCodes = "1";
//const DigitWords = ["ONE"];

// Loot Box style allows player to unlock higher cards
//   digits: 4,
class VaultCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.digits);
		this.Used = [];
		this.Auto = true;
		this.Multi = wild.multi || 2;
		
		let name = "";
		let code = [];
		for (let i=0; i<wild.digits; i++)
		{
			const r = Math.floor(Math.random()*DigitWords.length);
			const word = DigitWords[r];
			code.push(word);
			name += DigitCodes[r];
		}
		this.Code = code;
		this.Solved = 0;
		
		// Override the default VAULT name
		this.Name = name;
	}

	IsMatchWord(word)
	{
		return this.InWordList(word,this.Code);
	}
	
	PickPrize()
	{
		let list = this.Wild.prizes;
		if (!list)
		{
			return Wild_P1; // default
		}
		let index = Math.floor(Math.random()*list.length);
		return list[index];
	}
	
	OnUnlocked()
	{
		// Swap the NEW card into same location
		let pick = this.PickPrize();
		this.ExchangeGift(pick);
	}
	
	ClearDigit(index)
	{
		let str = this.Name;
		this.Name = str.slice(0, index) + '-' + str.slice(index+1);
		//this.Name.[...str].splice(i, 1).join('');
	}

	NewCalculateScore(c)
	{
		if (this.FindCodeWord(c.Word) >= 0)
		{
			c.EQ.multi += this.Multi;
			c.OnWildcardUsed(this);
		}
	}

	FindCodeWord(word)
	{
		if (word.length != 0)
		{
			const code = this.Code;
			for (let i=0; i<code.length; i++)
			{
				if (word == code[i])
				{
					return i;
				}
			}			
		}
		return -1;		
	}
	
	IsMatchWord(word)
	{
		return this.FindCodeWord(word) >= 0;
	}
	
	OnWordChanged(word)
	{
		this.HighlightMatchWord(word);
	}

	OnWordPlayed(word)
	{
		let match = this.FindCodeWord(word);
		if (match >= 0)
		{
			this.Code[match] = ''; // Wipe to preserve index
			this.ClearDigit(match);
			this.Solved += 1;
			
			if (this.Solved == this.Code.length)
			{
				this.OnUnlocked();
			}
			else
			{
				this.UpdateName();
			}			
		}
	}
}

// Variation that shows '?' instead of digits
class HealthCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		
		console.assert(wild.digits);
		
		let health = "";
		for (let i=0; i<wild.digits; i++)
		{
			health += '?';
		}		
		this.Name = health;
		
		this.Code = this.Wild.dict.split('|');
	}

	IsMatchWord(word)
	{
		return this.InWordList(word,this.Code);
	}
	
	OnWordChanged(word)
	{
		this.HighlightMatchWord(word);
	}
	
	OnDestroy()
	{
		if (this.Wild.prizes)
		{
			// Replace with prize
			let pick = RND(this.Wild.prizes);
			this.ExchangeGift(pick);
		}
		else
		{
			PlayerWildcards.OnWildcardSold(this);			
		}
	}

	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.OnWildcardUsed(this);
		}
	}
	
	OnWordPlayed(word)
	{
		if (this.IsMatchWord(word))
		{
			let health = this.Name.length;
			if (health > 0)
			{
				if (health > 1)
				{
					this.Name = this.Name.substr(0,health-1);
					this.UpdateElement();	
				}
				else
				{
					this.OnDestroy();
				}
			}
		}
	}
}

// Transport blank tiles frrom round end to next round
class TransferCard extends BaseCard // aka GhostCard
{
	constructor(wild)
	{
		super(wild);
		this.Letter = ' ';
	}

	IsMatchWord(word)
	{
		false;
	}

	// Highlight if any Blank tiles in hand
	OnWordChanged(word)
	{
		// TODO: generic HasAny(' ')?
		const light = PlayerTiles.HasBlanks() != 0;
		this.Power = light ? 1:0;
		this.Highlight = light;
	}
	
	OnRoundWon()
	{
		let count = 0;
		for (let tile of PlayerTiles.Tiles)
		{
			if (tile.Letter === this.Letter)
			{
				count += 1;
			}
		}
		this.Count = count;
	}

	OnTurn(index)
	{
		if (index === 1)
		{
			// Inject blank tiles before draw!
			for (let i=0; i<this.Count; ++i)
			{
				NewDeck.InjectLetter(this.Letter);
			}
		}
	}

	OnWordPlayed(word)
	{
		if (Round.Result === 1)
		{
			this.OnRoundWon();
		}
	}
}

// Handle events like OnDiscard and perform response actions
//		action: { discard:'x' }
//		action: { discards:'xyz' }
//		action: { ..., add_coin:1, inject:'?' }
//		action: { word:'XYZ', blank:8 }
//		limit: 3
class ActionCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.action)
		if (wild.limit)
		{
			this.Charges = wild.limit;
			this.BonusLimit = wild.limit; // TEST: trying to get 1/5 text?
		}
	}

	GetSalePrice()
	{
		let sale = super.GetSalePrice();
		if (this.Charges && this.Wild.limit && this.Wild.action.discard)
		{
			const used = this.BonusLimit - this.Charges;
			sale += Math.floor(used/2);
		}
		return sale;
	}
	
	OnTileMoved()
	{
		// TODO: how to get this event called?
	}
	
	// TODO: BUG: if selected letter is moved to first it does not call this?
	IsDiscardPosition(disc)
	{
		let A = this.Wild.action;
		if (A && A.discard !== null && typeof A.discard === 'number')
		{
			let pos = A.discard; // TODO: IsNumeric?
			if (pos === 0)
			{
				return PlayerTiles.NumSelected()==1 &&
						PlayerTiles.GetPosition(0)==pos;
			}
		}
		return false;
	}

	IsMatchWord(word) // aka old MatchWord?
	{
		let A = this.Wild.action;
		if (A.word)
		{
			return (A.word == word);
		}
		if (A.words)
		{
			let W = A.words.split('|');
			return W.includes(word);
		}
		return false;
	}
	
	// Highlight if any Blank tiles in hand
	OnWordChanged(word)
	{
		let light = false;
		let A = this.Wild.action;
		if (A)
		{
			if (word && word.length)
			{
				if ('discard' in A) // handle 0 or falsy value?
				{
					if (this.IsDiscardPosition())
					{
						light = true;
					}
					else
					{
						light = (word === A.discard);	
					}
				}
				if (A.discards)
				{
					light = A.discards.includes(word);
				}
				else if (this.IsMatchWord(word))
				{
					light = true;
				}
				else if (A.preserve || A.any)
				{
					light = word.length != 0;
				}				
			}
			if (A.turn)
			{
				light = (A.turn === Round.Turn);
			}
		}
		this.Power = light ? 1:0;
	}

	IsMatchLetter(letter)
	{
		let Act = this.Wild.action;
		if ('discard' in Act) // handle 0 or falsy value?
		{
			if (typeof Act.discard === 'number')
			{
				// Unable to call IsDiscardPosition() tile already removed?
				return (this.Power === 1);
			}
			return letter === Act.discard;
		}
		else if (Act.discards)
		{
			return Act.discards.includes(letter);
		}
		return false;
	}
	
	OnReset()
	{
		const blanks = this.Wild.action.blank || 0;
		let count = 0;
		for (let tile of PlayerTiles.Tiles)
		{
			tile.Letter = ' ';
			count += 1;
		}
		for (; count < blanks; ++count)
		{
			NewDeck.InjectLetter(' ');
		}
		RebuildWord();
		UpdateWordDisplay();
		NewRenderTiles();	
	}
	
	TriggerAction(context)
	{
		let Act = this.Action || this.Wild.action;
		let coin = Act.add_coin || Act.add_coins;
		let disc = Act.add_discard || Act.add_discards;
		if (coin || disc)
		{
			let prize = { coin:coin, discard:disc };
			this.ApplyPrizes(prize);
		}

		// Use Wild.action.sound or Wild.audio.Action
		let sfx = Act.sound || 'Action';
		if (sfx !== '')
		{
			this.PlaySound(sfx);
		}
		
		const letter = (typeof context === 'string' && context.length === 1) ? context : null;
		if (letter && Act.score_to_coins)
		{
			let coin = getLetterScore(letter);
			let prize = { coin:coin };
			this.ApplyPrizes(prize);
		}
		
		const blanks = Act.blank || 0;
		if (blanks > 0)
		{
			// Detect end of round and reset Next deck
			if (Round.Result != 0)
			{
				this.DelayReset = true;
			}
			else
			{
				this.OnReset();
			}
		}
		
		// Used by cards that prevent a card from being consumed? Sticky
		if (Act.preserve)
		{
			const word = context;
			if (word.length != 0)
			{
				// TODO: preserve order of letter tiles vs inject/draw on right?
				const first = word[0];
				// Act.inject = first;
				
				/* TOOD: cleanup now Locked flag on tile handles this?
				NewDeck.InjectLetter(first);
				*/
			}
		}

		// TODO: move to CalculateScore function?
		// Extra points vs opponent?
		if (Act.damage)
		{
			PlayerScore += Act.damage;
			OnScoreChanged();
		}
		
		// Push new tile letter into the bag drawn next
		if (Act.inject)
		{
			// Next tile drawn will be injected tile
			let ch = Act.inject;
			if (ch.length > 1)
			{
				let index = 0;
				const key = this.Wild.action.discards;
				const word = context;
				if (key && word.length == 1)
				{
					index = key.indexOf(word);
				}
				else
				{
					index = Math.floor(Math.random()*ch.length);
				}
				ch = ch[index]; 
			}
			NewDeck.InjectLetter(ch);
		}
		
		let slots = Act.add_slot || Act.add_slots || 0;
		if (slots > 0)
		{
			Stats.IncrementWildcards(slots);
		}
		
		// TODO: separate limit count from display?
		// 1.2.3.4.5 vs. 5.4.3.2.1 vs 1/5.2/5.3/5.etc
		// vs XXXXX.-XXXX.--XXX.---XX.----X.-----
		if (this.Charges)
		{
			let ch = this.Charges - 1;
			// TODO: show Progress bar for clarity?
			this.Bonus = ch;
			if (this.BonusLimit > 0)
			{
				let limit = this.BonusLimit;
				let index = limit - ch;
				this.BonusText = index+"/"+limit;
			}
			
			this.Charges = ch;
			
			if (ch > 0)
			{
				this.UpdateElement();
			}
			else
			{
				this.OnExpire();
			}
		}
	}
	
	OnExpire()
	{
		this.Expired = true;
		if (this.Wild.swap)
		{
			this.ExchangeGift(this.Wild.swap);
		}
		else
		{
			PlayerWildcards.OnWildcardSold(this);
			OnWildcardsChanged();
		}
	}
	
	CanTrigger()
	{
		if (this.Charges)
		{
			return (this.Charges > 0);
		}
		return true;
	}
	
	OnTurn(index)
	{
		let A = this.Wild.action;
		if (A && A.turn == index)
		{
			if (this.CanTrigger())
			{
				this.TriggerAction(index);
			}			
		}
		if (this.DelayReset)
		{
			this.OnReset();
			this.DelayReset = false;
		}
	}
	
	OnDiscardLetter(letter)
	{
		if (this.CanTrigger())
		{
			if (this.IsMatchLetter(letter))
			{
				this.TriggerAction(letter);
			}
		}
	}
	
	OnBeginWord(context)
	{
		let A = this.Wild.action;
		if (A && A.preserve)
		{
			// Lock first letter before discard
			let first = PlayerTiles.Used[0];
			if (first)
			{
				first.Locked = true;
			}
		}
	}
	OnEndWord(context)
	{
		let A = this.Wild.action;
		if (A && A.preserve)
		{
			// Unlock any letters
			for (let tile of PlayerTiles.Tiles)
			{
				if (tile.Locked)
				{
					tile.Locked = null;
				}
			}
		}
	}
	
	OnWordPlayed(word)
	{
		let A = this.Wild.action;
		if (A)
		{
			// TODO: CanTrigger?
			if (this.IsMatchWord(word))
			{
				this.TriggerAction(word);
			}
			else if (A.preserve != null)
			{
				this.TriggerAction(word);
			}
			else if (A.unused)
			{
				if (Round.Result == 1) // Won?
				{
					for (let tile of PlayerTiles.Tiles)
					{
						if (tile.Letter === A.unused)
						{
							this.TriggerAction(tile);
							
							if (this.Expired)
							{
								break;
							}
						}
					}
				}
			}
		}
	}
	
	NewCalculateScore(c)
	{
		if (this.Wild.multi)
		{
			console.log('ERROR: ActionCard does not support multi = '+this.Wild.multi);
		}
		let S = this.Wild.score;
		if (S)
		{
			let mul = 0;
			let add = 0;
			if (S.all)
			{
				let alpha = PlayerTiles.GetUnusedLetters();
				for (let ch of alpha)
				{
					let value = getLetterScore(ch);
					add += value;
				}
			}
			else if (S.high_card)
			{
				let alpha = PlayerTiles.GetUnusedLetters();
				for (let ch of alpha)
				{
					if (ch != ' ')
					{
						let value = getLetterScore(ch);
						add = Math.max(value, add);
					}
				}
			}
			else // default score
			{
				add = S.default || 1;
			}
			if (mul > 0 || add > 0)
			{
				c.Apply(this, mul, add);
			}
		}
	}
}

function IsValidTileCharacter(ch)
{
	return (ch >= 'A' && ch <= 'Z') || ch === ' ';
}

class ClickCard extends ActionCard
{
	constructor(wild)
	{
		super(wild);

		// Clone to prevent changing original
		let A = wild.action ? Object.assign({}, wild.action) : {};
		A.icon = IconWipe;
		this.Action = A; // override triggered action
		this.Letter = A.discard;
		
		// TODO: update old wildcards that used to inject?
		if (A.inject)
		{
			this.Target = A.inject;
			// Replace old inject behavior without breaking second purchase
			A.inject = undefined;
		}
		else if (A.replace)
		{
			console.assert(IsValidTileCharacter(A.replace));
			this.Target = A.replace;
		}
		
		if (wild.Swap)
		{
			let W = wild.Swap;
			// FYI - If card has Templates but is not present in AllWildcards
			// then it will not be Finalized and some properties may be missing?
			console.assert(W.name && W.desc);
		}
	}
	
	OnWordChanged(word)
	{
		super.OnWordChanged(word);
		
		const power = this.Power;
		if (this.Button != power)
		{
			this.Button = power;
			this.UpdateElement();
		}
	}
	
	// Triggered by Action button
	OnAction(event)
	{
		let context = PlayerTiles.Used[0];
		if (context) // TODO: discard/inject?
		{
			// ie. X-change QZ for space via action.replace='?'
			// Done before ClearWord since TriggerAction is too late
			if (this.Target)
			{
				// Replace letter tile in-place
				context.Letter = this.Target;
			}
			else if (this.Action.discards) // Action.replace invalidates this!
			{
				// Discard w/o spending points
				Consume1();
			}
			ClearWord();
			NewRenderTiles();			
			// Increment limit
			this.TriggerAction(context);
		}
	}
}

// If single tile selected show an Action button on the wildcard
class LetterActionCard extends ActionCard //BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.action)
		if (wild.limit)
		{
			this.Charges = wild.limit;
			this.BonusLimit = wild.limit;
			this.MaxCharges = wild.limit;
		}
	}

	IsMatchWord(word)
	{
		return word.length == 1;
	}
	
	OnWordChanged(word)
	{
		const light = this.IsMatchWord(word);
		this.Power = light ? 1:0;
		const last = this.Button ? 1:0;
		if (light != last)
		{
			// Wait for user to acknowledge with button
			this.Button = light ? true:false;
			this.UpdateElement();			
		}
	}
	
	TryCondition(T,word)
	{
		const condition = T.Condition;
		if (condition)
		{
			if (word === condition.OnWordPlayed || '')
			{
				return true;
			}
		}
		return false;
	}
	
	FormatBonusText()
	{
		if (this.Charges)
		{
			const max = this.MaxCharges;
			const used = max - this.Charges;
			if (used > 0)
			{
				return used + '/' + max;	
			}
		}
		return '';
	}
	
	TryAction(T)
	{
		const action = T.Action;
		if (action)
		{
			if (action.SetCharges !== undefined)
			{
				let newValue = this.MaxCharges - action.SetCharges;
				this.Charges = newValue;
				this.BonusText = this.FormatBonusText();
				this.UpdateElement();
			}
		}
	}
	
	OnWordPlayed(word)
	{
		if (this.Wild.triggers)
		{
			for (let T of this.Wild.triggers)
			{
				if (this.TryCondition(T,word))
				{
					this.TryAction(T);
				}
			}
		}
		
		super.OnWordPlayed(word);
	}
	
	// Triggered by Action button
	OnAction(event)
	{
		let context = PlayerTiles.Used[0];
		if (context) // TODO: discard/inject?
		{
			// Replace letter tile in-place
			context.Letter = ' ';
			ClearWord();
			NewRenderTiles();			
			// Increment limit
			this.TriggerAction(context);
		}
	}	
}
	
// TEMPORARY vs dynamic search?
let BibleHints="LOVE|PEACE|GOD|HOLY";
let SportHints="BALL|GLOVE|FIELD|GAME";
let FishHints="BASS|COD|CARP|SALMON|TUNA";
let FruitHints="APPLE|BANANA|CHERRY|DATE|FIG|FRUIT|GRAPE|MANGO|PEAR|PLUM";
let Categories = { Bible:BibleHints, Sport:SportHints, Fish:FishHints, Fruit:FruitHints };

// Tooltip shows hints?
class HintCard extends BaseCard
{
	IsMatchWord(word)
	{
		const K = this.GetKeys();
		return K && K.has(word);
	}
	
	OnWordChanged(word)
	{
		this.HighlightMatchWord(word);
	}

	PickWildcard()
	{
		let options = [];
		// Check if the player has a card in their hand with potential hints?
		for (let card of PlayerWildcards.Hand)
		{
			if (card !== this && card.GetKeys())
			{
				options.push(card);
			}
		}
		return options.length ? RND(options) : null;
	}
	
	GetHint()
	{
		// Scan Wildcards in hand for keywords?
		let card = this.PickWildcard();
		if (card)
		{
			let set = card.GetKeys();
			let list = Array.from(set);
			if (list)
			{
				let pick = RND(list);
				this.Corner = card.Emoji || card.Wild.emoji;
				this.UpdateElement();
				return card.Wild.name + ' = ' + pick;
			}
		}
		return null;
	}
	
	GetFallback()
	{
		// Fallback to generic hints
		let keys = Object.keys(Categories);
		let pick = RND(keys);
		let CAT = Categories[pick];
		let list = CAT.split('|');
		let word = RND(list);
		return `${pick} = ${word}`;
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			let extra = this.wild.score || 0;
			c.Apply(this, this.Multi, extra);
		}
	}
	
	OnWordPlayed(word)
	{
		// Maybe show multiple hints if power word?
		let power = this.IsMatchWord(word) ? 1:0;
		let text = this.GetHint();
		if (power)
		{
			if (text === null)
			{
				text = this.GetFallback();	
			}
			else
			{
				text += "<br>" + this.GetHint();
			}
		}
		if (text)
		{
			this.Tooltip = text;
			this.UpdateElement();
			this.StartPulse();
			// TODO: word bubble highlight or is animation enough?			
		}
	}
}


// Black&White tle flip/reverse/othello mini-game
class FlipCard extends WordCard
{
	constructor(wild)
	{
		super(wild);
		// Cursor
		this.X = 1;
		this.Y = 1;
		this.Palette = ['&#x26AB;','&#x26AA;','&#x2B1B;','&#x2B1C'];
		let T1 = Math.floor(Math.random()*4);
		let T2 = Math.floor(Math.random()*4);
		let T3 = Math.floor(Math.random()*4);
		let T4 = Math.floor(Math.random()*4);
		let m = [T1,T2,T3,T4];
		let B = this.Test(m) || 8|16|32|4;
		let bits = (1<<9)-1-B;
		// 0 1 2 | 1,2,4
		// 3 4 5 | 8,16,32
		// 6 7 8 | 64,128,256
		this.Bits = bits;
		this.UpdateMaze();
	}

	Test(moves)
	{
		let X=1;
		let Y=1;
		let bits = 0;
		for (let z of moves)
		{
			switch (z)
			{
				case 0: Y=(Y+2)%3; break;
				case 1: X=(X+1)%3; break;
				case 2: Y=(Y+1)%3; break;
				case 3: X=(X+2)%3; break;
			}
			let b = X+Y*3;
			bits ^= (1 << b);
		}
		return bits;
	}
	
	Row(M,i)
	{
		let P = this.Palette;
		return P[M[i]]+P[M[i+1]]+P[M[i+2]];
	}	
	
	UpdateMaze()
	{
		let text = '<div class="maze">';
		let M = [0,0,0,0,0,0,0,0,0];
		for (let i=0; i<9; i++)
		{
			M[i] = (this.Bits >> i) & 1;
		}
		let cursor = this.X + this.Y*3;
		M[cursor] += 2; // 0|1 vs 2|3
		text += this.Row(M,0)+'<br>'+this.Row(M,3)+'<br>'+this.Row(M,6);
		text += '</div>';
		this.Emoji = text;
	}

	IsSolved()
	{
		return this.Bits == (1<<9)-1;
	}
	
	OnWordPlayed(word)
	{
		let ch = word[0];
		let x = this.X;
		let y = this.Y;
		switch (ch)
		{
			case 'L': // left/west
			case 'W':
				x += 2;
				break;
			case 'R': // right/east
			case 'E':
				x += 1;
				break;
			case 'U': // up/north
			case 'N':
				y += 2;
				break;
			case 'D': // down/south
			case 'S':
				y += 1;
				break;
			default:
				return;
		}
		
		x = x % 3;
		y = y % 3;
		let b = x + y*3;
		this.X = x;
		this.Y = y;
		this.Bits ^= (1 << b);
		console.log('Cursor @ '+x+','+y+' = '+(1<<b));
		
		this.UpdateMaze();
		this.UpdateElement();
		
		if (this.IsSolved())
		{
			this.Bits = 0;
			this.OnPrize();
		}
	}
	
	OnPrize()
	{
		let swap = this.Wild.swap;
		if (swap)
		{
			this.ExchangeGift(swap);
		}
	}	
	
	OnWordChanged(word)
	{
		this.HighlightMatchWord(word);
	}

	IsMatchWord(word)
	{
		const first = word.length ? word[0] : '!';
		return "UDLRNSWE".includes(first);
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.Apply(this, this.Multi, this.Bonus);
		}
	}
}

// Play X- words in alphabetical sequence
//   first: 'A',
//   pattern: '[A-Z]{4}',
//   multi: 2,
//   bonus: false,
//   limit: 5,
//   reset: false,
//   sequence: 'HORSE',
class StraightCard extends BaseCard // TODO: was MultiplyCard?
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.first || wild.sequence);
		this.Multi = wild.multi || 1;
		if (wild.sequence)
		{
			let seq = wild.sequence.split('');
			this.Next = seq.shift();
			this.Sequence = seq;
		}
		else
		{
			if (wild.first != '[A-Z]')
			{
				// TODO: generate sequence by limit?
				// this.Sequence = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			}
			this.Next = wild.first;					
		}
		this.Regex = wild.pattern ? new RegExp(wild.pattern) : null;
		this.Bonus = 0;
		let limit = wild.limit || 0;
		if (limit > 0)
		{
			this.Charges = limit;
			this.Bonus = limit;
		}
	}

	GetBonusText()
	{
		return this.Charges ? this.Charges : '';
	}
	
	IsMatchWord(word)
	{
		if (word.length == 0)
		{
			return false;
		}
		let R = this.Regex;
		if (R && R.test(word) == false)
		{
			return false;
		}
		if (this.Next == '[A-Z]')
		{
			return true;
		}
		return (word[0] == this.Next);
	}

	OnWordChanged(word)
	{
		const match = this.IsMatchWord(word);
		this.Power = match ? 1:0;
		this.Highlight = match;
	}

	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.Apply(this, this.Multi, this.Bonus);
		}
	}	
	
	OnTurn(index)
	{
		let letter = (this.Next == '[A-Z]') ? '?' : this.Next;
		this.Emoji = letter;
		this.UpdateElement();
	}

	// Handle visual update after word played
	// OnTurn can be delayed by round finish pop-up.
	OnAnimate()
	{
		let letter = (this.Next == '[A-Z]') ? '?' : this.Next;
		this.Emoji = '('+letter+')';
		this.UpdateElement();
	}
	
	OnWordPlayed(word)
	{
		if (this.IsMatchWord(word))
		{
			// Skip the MultiplyCard super function
			this.TryBonus(word);

			let seq = this.Sequence;
			let alpha = this.Next;
			if (alpha === '[A-Z]')
			{
				alpha = word[0];
			}
			
			let next = alpha;
			if (seq)
			{
				next = seq.shift();
			}
			else // alphabetical
			{
				next = String.fromCharCode(alpha.charCodeAt(0) + 1);
				// TODO: Allow multiple ABC to be played in a word? (ex. C-R-A-B)
				if (alpha === 'Z')
				{
					next = 'A';
				}
			}

			this.Next = next;
			this.OnAnimate();
			
			if (this.Charges)
			{
				if (--this.Charges === 0)
				{
					this.OnPrize();
				}
			}
		}
	}
	
	OnPrize()
	{
		let swap = this.Wild.swap;
		if (swap)
		{
			this.ExchangeGift(swap);
		}
	}
}

// Wildcard that modifies the affects of other cards
//   mod: { rarity:1, multi:2 },
class ModCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		console.assert(wild.mod);
		this.Mod = wild.mod;
	}
	
	IsMatchWord(word)
	{
		return true;
	}

	OnWordChanged(word)
	{
		// TODO: Any matching Color cards?
		this.Power = 1;
		this.Highlight = true;
	}

	BeginScore(c)
	{
		let rarity = this.Mod.rarity;
		if (rarity)
		{
			c.SetMod( rarity, this.Mod.multi || 0 );
		}
	}
}

// info: { letter:5 };
class InfoCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Info = wild.info;
		this.Tooltip = '?';
		this.Count = wild.info.letter || 1;
	}

	SetTooltip(future)
	{
		if (future.length == 0)
		{
			this.Tooltip = 'The future is unclear.';
		}
		else
		{
			future = future.replace(' ','?').split('').join(' ');
			this.Tooltip = 'You see hazy letters...<br>'+future;	
		}
		
		this.UpdateElement();
	}
	
	UpdateTooltip()
	{
		let future = TheShop.Active ? "" : NewDeck.Peek(this.Count);
		this.SetTooltip(future);
	}
	
	OnEquip()
	{
		this.UpdateTooltip();
	}
	
	OnHandReady()
	{
		this.UpdateTooltip();
	}
	
	NewCalculateScore(c)
	{
		c.Apply(this, this.Multi || 2, 0);
	}
}

// Allows tiles to be stored and retrieved with a button
// storage: 3
class StorageCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Count = wild.storage || 1;
		this.Button = false;
		this.Blank = '?';
		this.Stack = [];
	}

	SetName(name)
	{
		let str = name || '';
		if (str < this.Count)
		{
			for (let i=0; i<this.Count; ++i)
			{
				str += this.Blank;
			}
		}
		else if (str.length > this.Count)
		{
			str = str.substring(0,this.Count);
		}
		this.Name = str;
		this.UpdateElement();
	}
	
	OnEquip()
	{
		this.StackToName();
		//this.SetName('');
	}
	
	OnHandReady()
	{
		//this.UpdateTooltip();
	}

	StoreTiles()
	{
		while (true)
		{
			let first = PlayerTiles.First();
			if (first == null)
			{
				break;
			}
			PlayerTiles.TryRemoveUsed(first);
			PlayerTiles.TryRemoveTile(first);
		}
		RebuildWord();
		UpdateWordDisplay();
		NewRenderTiles();
	}
	
	SwapTiles(word)
	{
		for (let i=0; i<word.length; ++i)
		{
			let tile = PlayerTiles.Used[i];
			tile.Letter = word[i];
			// TODO: letter score = tile.Value?
		}
		RebuildWord();
		UpdateWordDisplay();
		NewRenderTiles();
		UpdateBag();
	}
	
	OnWordChanged(word)
	{
		let light = false;
		let button = this.Button;
		if (word.length == 0)
		{
			//this.Power = 0;
			button = false;//this.Stack.length != 0;
			// TODO: if letters in storage -- show SWAP buttom?
		}
		else if (word.length <= this.Count)
		{
			let stored = this.Stack.length;
			light = stored ? (word.length == stored) : true;
			button = light;
		}
		else
		{
			//this.Power = 0;
			button = false;
		}
		this.Power = light ? 1:0;
		//this.Highlight = light;
		if (button != this.Button)
		{
			this.Button = button;
			this.UpdateElement();
		}
	}

	StackToName()
	{
		let name = this.Stack.join('');
		if (name.length == 0)
		{
			while (name.length < this.Count)
			{
				name = this.Blank + name;
			}			
		}
		this.Name = name;
		this.UpdateElement();
	}
	
	Push(letter)
	{
		let S = this.Stack;
		S.unshift(letter);
		while (S.length > this.Count)
		{
			S.pop();
		}
		this.StackToName();
	}
	
	Pop()
	{
		let S = this.Stack;
		let ch = S.pop();
		this.StackToName();
		return ch;
	}
	
	OnAction(event)
	{
		let S = this.Stack;
		let used = PlayerTiles.Used;
		if (S.length ==0)
		{
			// STORAGE
			for (let tile of used)
			{
				S.push( tile.Letter );
			}
			this.StackToName();
			// Remove letters from hand
			this.StoreTiles();
			// Fill in from deck
			OnTileConsumed();
		}
		else // swap
		{
			let name = "";
			for (let tile of used)
			{
				name += tile.Letter;
			}

			let str = this.Stack.join('');
			this.SwapTiles(str);
			
			// UN-STORAGE
			S.length = 0;
			for (let ch of name)
			{
				S.push( ch );
			}			
			this.StackToName();
		}
		event.stopPropagation();
	}
}

// These cards look for a sequence of letters
//		letters: 3,
class AlphaCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Multi = wild.multi || 2;
		this.Bonus = 0;
		const count = wild.letters || 3;
		this.Letters = count;
		this.Pattern = 'x'.repeat(count);
		this.Used = new Set();
	}

	// Requiring 3 in-a-row and consecutive is too complex?
	OLD_FindSeq(word)
	{
		let best = '';
		let run = '';
		let abc = word.split('').sort();
		let last = 0;
		for (let i=0; i<abc.length; ++i)
		{
			const letter = abc[i];
			const ascii = letter.charCodeAt(0);
			if ((ascii - last) == 1)
			{
				run += letter;
				if (run.length > best.length)
				{
					best = run;
				}
			}
			else
			{
				run = letter;
			}
			last = ascii;
		}		
		return best;
	}
	
	FindSeq(word)
	{
		if (word.length < this.Letters)
		{
			return '';
		}
		
		// A character slot for each letter in alphabet
		const sequence = Array(26).fill('-');
		
		for (const ch of word)
		{
			const code = ch.charCodeAt(0);
			const index = code - 65; // 'A'=0, 'B'=1, etc.
			sequence[index] = 'x';
		}
		
		const joined = sequence.join('');
		const pos = joined.indexOf(this.Pattern);
		if (pos === -1)
		{
			return '';
		}
		
		let result = '';
		for (let i=pos; i < joined.length; ++i)
		{
			if (joined[i] !== 'x')
			{
				break;
			}
			result += String.fromCharCode(65 + i);
		}
		return result;
	}		
		
	IsMatchWord(word) // override
	{
		let str = this.FindSeq(word,this.Letters);
		return str.length >= this.Letters;
	}
	
	OnWordChanged(word)
	{
		const seq = this.FindSeq(word);
		const match = seq.length >= this.Letters;
		let power = match ? 1:0;
		if (power != this.Power) // changed?
		{
			if (power)
			{
				this.Name = seq;
			}
			else
			{
				this.Name = "Alphacube";
			}
			this.Power = power;
			this.UpdateElement();
		}
		//this.Highlight = match;
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.Apply(this, this.Multi, this.Bonus);
		}
	}
	
	OnWordPlayed(word)
	{
		if (!this.IsMatchWord(word))
		{
			return;
		}
			
		this.Used.add(word);

		let limit = this.Wild.limit || 0;
		if (limit == 0)
		{
			return;
		}
		
		let count = this.Used.size;
		if (count < limit)
		{
			this.BonusText = count+"/"+limit;
			this.UpdateElement();
			return;
		}	
		
		this.TrySwap();
	}
}

// Monitor words played that match other wildcards for potential bonus
class BonusCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Multi ||= 2;
	}

	IsMatchWord(word)
	{
		// Check other wildcards here so Highlight works
		if (word.length != 0)
		{
			for (let card of PlayerWildcards.Hand)
			{
				if (card !== this && card.Wild.dict)
				{
					if (card.IsMatchWord(word))
					{
						return true;
					}
				}
			}
		}		
		return false;
	}

	OnWordChanged(word)
	{
		let light = this.IsMatchWord(word);
		let power = light ? 1:0;
		if (power != this.Power) // changed?
		{
			this.Power = power;
			this.UpdateElement();
		}
		this.Highlight = light;
	}	
	
	IsFromDictionary(c)
	{
		if (!this.Wild.any_dict)
		{
			return false;
		}
		let word = c.Word;
		// Check other wildcards for specific Word match
		for (let card of c.Used)
		{
			if (card.Wild.dict)
			{
				if (card.IsMatchWord(word))
				{
					return true;
				}
			}
		}
		return false;
	}

	// After wildcards get a change to calculate score
	FinalizeScore(c)
	{
		if (this.IsMatchWord(c.Word))// || this.IsFromDictionary(c))
		{
			c.Apply(this, this.Multi, 0);
		}
	}
}

// Monitor words played to accumulate a target score.
class ScoreCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Multi ||= 2;
		this.Score = 0;
		let target = 500;
		if (wild.action)
		{
			target = wild.action.accum || 500;
		}
		this.ScoreTarget = target;
		let N = wild.name;
		if (wild.pattern && N[1] == '-') // "A-xyz"
		{
			this.Prefix = N.slice(0,2);
		}
	}

	GetRegex()
	{
		let R = this.Regex;
		if (R == null && this.Wild.pattern)
		{
			R = new RegExp(this.Wild.pattern);
			this.Regex = R;
		}
		return this.Regex;
	}
	
	IsMatchWord(word)
	{
		if (this.Wild.pattern)
		{
			let R = this.GetRegex();
			return R ? R.test(word) : false;
		}
		return false;
	}

	OnWordChanged(word)
	{
		let ok = this.IsMatchWord(word);
		this.Power = ok ? 1:0;
		this.Highlight = ok;		
	}
	
	IsFromDictionary(c)
	{
		if (!this.Wild.any_dict)
		{
			return false;
		}
		let word = c.Word;
		// Check other wildcards for specific Word match
		for (let card of c.Used)
		{
			if (card.Wild.dict)
			{
				if (card.IsMatchWord(word))
				{
					return true;
				}
			}
		}
		return false;
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.OnWildcardUsed(this);
		}
	}
	
	EndScore(c)
	{
		if (c.Debug)
		{
			return; // only calculating not applying
		}
		
		if (this.IsMatchWord(c.Word) || this.IsFromDictionary(c))
		{
			// Score tally is not word score
			this.Score += c.Score;
			
			if (this.Prefix)
			{
				this.Name = this.Prefix + (this.ScoreTarget - this.Score);
			}
			else
			{
				this.Name = this.Score + " / " + this.ScoreTarget;
			}
			
			this.UpdateElement();
			
			if (this.Score > this.ScoreTarget)
			{
				this.OnScoreReached();
			}
		}
	}
	
	OnScoreReached()
	{
		let swap = this.Wild.swap;
		if (swap)
		{
			this.ExchangeGift(swap);
		}
	}
}

// TESTING card that adds silver coins to you status bar -- unique currency for special shop?
//   previously full up 1/4 of wildcard slot
// Buy -- 1=Blank, 5=Wild, 10=Slot?
class QuarterCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Quarters = 1;
		//this.UpdateEmoji();
	}

	static IsModifier(wild) { return true; }
	
	static CanPlayerBuy(wild)
	{
		if (typeof Player === 'undefined')
		{
			console.log("Player is not defined yet.")
			return false;
		}
		return true;
	}
	static OnPlayerBuy()
	{
		Player.AddQuarters(1);
	}
	
	deprecate_UpdateEmoji()
	{
		let Q = this.Quarters || 0;
		this.Name = Q + "/4";
		let text = '<svg width="58" height="58" viewBox="0 0 200 200"';
		text += ' style="position: absolute; left: 25%; top: 36%; pointer-events: none;">';
		if (Q>=1) text += '<path d="M 0 95 L 95 95 L 95 0 A 100 100 0 0 0 0 95 Z" fill="#48f"/>';
		if (Q>=2) text += '<path d="M 105 0 L 105 95 L 200 95 A 100 100 0 0 0 95 0 Z" fill="#f84"/>';
		if (Q>=3) text += '<path d="M 200 110 L 110 110 L 110 200 A 100 100 0 0 0 200 110 Z" fill="#ff4"/>';
		if (Q>=4) text += '<path d="M 90 200 L 90 110 L 0 110 A 100 100 0 0 0 90 200 Z" fill="#4f4"/>';
		text += '</svg>';
		this.Emoji = '&#x1F311;'+text;
		this.UpdateElement();
	}

	OnAction()
	{
		Player.AddQuarters(this.Quarters);
		PlayerWildcards.OnWildcardSold(this);
	}
	
	// OBSOLETE
	OnFull()
	{
		let prize = this.Wild.prize;
		if (prize)
		{
			let slots = prize.add_slot || prize.add_slots || 0;
			if (slots > 0)
			{
				Stats.IncrementWildcards(slots);
			}
		}
		let swap = this.Wild.swap;
		if (swap)
		{
			this.ExchangeGift(swap);
		}
	}
	
	OnEquip()
	{
		console.assert(this.Quarters == 1);
		
		// NEW!
		this.Button = true;
		
		/*
		for (let card of PlayerWildcards.Hand)
		{
			if (card !== this && card instanceof QuarterCard)
			{
				let add = this.Quarters;
				let total = card.Quarters + add;
				if (total <= 4)
				{
					for (let i=0; i<add; ++i)
					{
						card.AddQuarter();
					}
					PlayerWildcards.OnWildcardSold(this);
					//OnWildcardsChanged();
					PlayerWildcards.OnChanged();
					return;
				}
			}
		}
		*/
	}
}

// Record a played word and detect when same word is replayed
class ReplayCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Size = wild.size || 3;
		this.Key = '???';
	}
	
	IsMatchWord(word)
	{
		// Optional specific words
		const S = this.GetKeys();
		if (S)
		{
			if (S.has(word))
			{
				return true;
			}
		}
		return (this.Key == word);
	}

	OnWordChanged(word)
	{
		const power = this.IsMatchWord(word) ? 1:0;
		if (power != this.Power) // changed?
		{
			this.Power = power;
			this.UpdateElement();
		}
	}
	
	OnWordPlayed(word)
	{
		if (this.IsMatchWord(word))
		{
			let prize = this.Wild.prize;
			if (prize)
			{
				this.ApplyPrizes(prize);	
			}
		}
		// Track last played word
		const valid = (word.length >= this.Size);
		this.Key = valid ? word : '???';
		this.Name = valid ? word : this.Wild.name;
		this.UpdateElement();
	}
	
	NewCalculateScore(c)
	{
		if (this.IsMatchWord(c.Word))
		{
			c.Apply(this, this.Multi, 0);
		}
	}
}

// TODO: if player has A=4 and +A+ the score is (4) but maybe should be (5)
// so how to fix LetterScore() and the way consecutive Wildcards interact?

// TODO: Allow players to select the Character before/after buying vs many random?

// Index by Upgrade score to get next score
const NextUpgradeTable = [1,3,0,7,0,0,0,9,0];

// Increase the point score of a letter tile for the rest of game
//   letter: 'A',
//   score: 1,
class UpgradeCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
	}

	static GetShopTooltip(wild)
	{
		if (Player.Badges.size == 0)
		{
			return null;
		}
		let result = Array.from(Player.Badges.entries())
			.map(([key, value]) => `${key}:${value+1}`)
			.join(', ');
		return result;
	}
	
	// Shopping Modifier vs Wildcard?
	static IsModifier(wild) { return true; }

	// Filter cards available in the shop
	static IsAvailable(wild)
	{
		// Only if you have bought previous version.
		let current = Player.GetBadge(wild.letter);
		let next = NextUpgradeTable[current];
		return (wild.score == next);
	}
	
	// Allow cards to be bought directly by player w/o wildcards.
	static CanPlayerBuy(wild)
	{
		if (!this.IsAvailable(wild))
		{
			console.log("WARNING: Upgrade ("+wild.letter+") is too low..");
			return false;
		}
		return true; // TODO: if E2/E4 are both in Cart and you by E4 then E2 should invalidate?
	}
	static OnPlayerBuy(wild) 
	{
		const ch = wild.letter;
		Player.UpgradeTile(ch,wild.score);
	}
}

// Add rewards based on matching tiles played
class PayoutCard extends BaseCard
{
	constructor(wild)
	{
		super(wild);
		this.Match = wild.match;
		this.Payout = wild.payout;
	}
	
	IsMatchWord(word)
	{
		for (let t of PlayerTiles.Used)
		{
			if (this.Match.upgrade && t.Badge)
			{
				return true;
			}
		}
		return false;
	}
	
	OnWordChanged(word)
	{
		const power = this.IsMatchWord(word) ? 1:0;
		if (power != this.Power) // changed?
		{
			this.Power = power;
			this.UpdateElement();
		}
	}

	IsMatchTile(tile)
	{
		const M = this.Match;
		if (M.upgrade && tile.Badge)
		{
			return true;
		}
		return false;
	}
	
	NewCalculateScore(c)
	{
		let mul = this.Payout.multi || 0;
		if (mul <= 0)
		{
			return;
		}
		// TODO: cache result of IsMatchWord already called?
		let score = c.EQ.score;
		for (let i=0; i<PlayerTiles.Used.length; ++i)
		{
			let tile = PlayerTiles.Used[i];
			if (this.IsMatchTile(tile))
			{
				score[i] *= mul;
			}
		}
	}
	
	OnReward(rewards)
	{
		const coins = rewards.coins || 0;
		const discards = rewards.discards || 0;
		if (discards > 0)
		{
			Player.AddDiscards(discards);
		}
		if (coins > 0)
		{
			Player.AddCoins(coins);
		}
	}
	
	OnWordPlayed(word, context)
	{
		let pay = this.Payout;
		if (!pay)
		{
			return;
		}
		let count = 0;
		for (let t of context.Tiles) // aka PlayerTiles.Used prior to reset
		{
			if (this.Match.upgrade && t.Badge)
			{
				count += 1;
			}
		}
		if (count == 0)
		{
			return;
		}
		let reward = {};
		if (pay.discards > 0)
		{
			reward.discards = count * pay.discards;
		}
		if (pay.coins > 0)
		{
			reward.coins = count * pay.coins;
		}
		// TODO: quarters?
		this.OnReward(reward);
	}	
}
