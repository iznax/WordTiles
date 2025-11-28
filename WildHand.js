
class WildHand // aka PlayerWildcards
{
	constructor()
	{
		// List of joker tiles
		this.Hand = [];
		// List of playable items
		this.Scrolls = [];
		this.Once = new Set();
	}

	Reset()
	{
		this.Hand.length = 0;
		this.Once.clear();
	}

	FindLeft(Type,ignore)
	{
		let list = [];
		for (let card of this.Hand)
		{
			if (card === ignore)
			{
				break; // Only cards to left of us
			}
			if (card instanceof Type)
			{
				list.push(card);
			}
		}		
		return list;
	}
	
	HasMatchOrSlot(CLASS)
	{
		// If player has room to add a new card to hand
		if (this.HasEmptySlot())
		{
			return true;
		}
		// If player already has an MultiplyCard to increment
		let left = this.FindLeft(CLASS,null);
		return (left.length !== 0);
	}
	
	CreateInstance(wild)
	{
		let inst = new wild.CLASS(wild);
		// Bonus = accumulator in corner for certain cards
		inst.Bonus = 0;
		// Power = highlight status for outline hint
		inst.Power = 0;
		inst.Highlight = false;
		return inst;
	}

	Add(card)
	{
		if (card)
		{
			this.Hand.push(card);
			this.Once.add(card.Wild);
			card.OnEquip();
			//OnWildcardsChanged();
			this.OnChanged();
		}
	}
	
	InsertAt(card,index)
	{
		if (card)
		{
			if (index < 0)
			{
				this.Hand.shift(card);	
			}
			else if (index >= this.Hand.length)
			{
				this.Hand.push(card);
			}
			else
			{
				this.Hand.splice(index,0,card);
			}
			this.Once.add(card.Wild);
			card.OnEquip();
			//OnWildcardsChanged();
			this.OnChanged();
		}
	}
	
	HasEmptySlot()
	{
		return this.Hand.length < Player.MaxWildcards;
	}
	
	HasWild(wild)
	{
		for (let inst of this.Hand)
		{
			if (inst.Wild === wild)
			{
				return true;
			}
		}
		return false;
	}

	HadOnce(wild)
	{
		for (let inst of this.Hand)
		{
			this.Once.add(inst.Wild);
		}
		return this.Once.has(wild);
	}
	
	GetInitialOptions()
	{
		let wilds = [];
		for (let w of AllWildcards)
		{
			if (w.CLASS && w.cost == 1)
			{
				wilds.push(w);
			}
		}
		return wilds;
	}
	
	PickInitialWildcards(count)
	{
		let list = this.Hand;
		list.length = 0;
		let options = this.GetInitialOptions();
		for (var i=0; i<count && options.length > 0; ++i)
		{
			let pick = Math.floor(Math.random()*options.length);
			let wild = options[pick];
			let inst = this.CreateInstance(wild);
			list.push(inst);
			options.splice(pick,1); // extract from temp list
		}
		this.Hand = list;
		return list;
	}
	
	GetWild(index)
	{
		return this.Hand[index];
	}
	
	OnWordChanged(word)
	{
		for (let inst of this.Hand)
		{
			inst.OnWordChanged(word);
		}
	}

	OnBeginWord(context)
	{
		for (let inst of this.Hand)
		{
			if (inst.OnBeginWord)
			{
				inst.OnBeginWord(context);
			}
		}
	}
	OnWordPlayed(word,context)
	{
		for (let inst of this.Hand)
		{
			inst.OnWordPlayed(word,context);
		}
	}
	OnEndWord(context)
	{
		for (let inst of this.Hand)
		{
			if (inst.OnEndWord)
			{
				inst.OnEndWord(context);
			}
		}
	}
	
	Update()
	{
		let word = currentWord;
		for (let inst of this.Hand)
		{
			inst.OnWordChanged(word);
		}		
	}
	
	OnWildcardSold(card)
	{
		let index = this.Hand.indexOf(card);
		if (index > -1)
		{
			this.Hand.splice(index, 1);
			
			if (card.Element)
			{
				let container = wildsContainer;
				console.assert(container === card.Element.parentNode)
				container.removeChild(card.Element);
				card.Element = null;				
				// Replace with an empty slot.
				ShowEmptyWildcard();
			}
			
			card.OnUnequip();
		}
	}

	// aka OnWildcardsChanged
	// When a card is modified significantly go through all and FixupWildcards
	OnChanged()
	{
		wildsContainer.innerHTML = '';
		let count = 0;
		for (let card of this.Hand)
		{
			let wild = card.Wild;
			if (card.Element)
			{
				const elem = card.Element;
				wildsContainer.appendChild(elem);
				card.OnEquip(); // TESTING?
				card.UpdateElement();
			}
			else
			{
				ShowWildcard(wild, card);	
			}
			count++;
		}

		let empty = Player.MaxWildcards - count;
		for (let i=0; i<empty; i++)
		{
			ShowEmptyWildcard();
		}
	}
	
	xxxOnScoreLetter(word,ch,eq)
	{
		for (let inst of this.Hand)
		{
			inst.OnScoreLetter(word,ch,eq);	
		}
	}
	
	xxOnScoreWord(word,eq)
	{
		for (let inst of this.Hand)
		{
			inst.OnScoreWord(word,eq);
		}
	}
	
	ReplaceCard(card,wild)
	{
		let index = this.Hand.indexOf(card);
		if (index < 0)
		{
			return false;
		}
		
		this.OnWildcardSold(card);
		
		let NewCard = this.CreateInstance(wild);
		if (NewCard)
		{
			PlayerWildcards.InsertAt(NewCard, index);
			return true;
		}
		
		return false;
	}
}

function OnWordChanged(word)
{
	PlayerWildcards.OnWordChanged(word);
}

// Event when each letter tile drawn from the bag and enters player hand
function OnLetterPicked(tile)
{
	// TODO: PlayerWildcards.OnWordPlayed(word);
}

function PickWildcards(count)
{
	let list = [];
	const Copy = AllWildcards.slice();
	for (var i=0; i<count; ++i)
	{
		let max = Copy.length;
		if (max == 0)
		{
			break;
		}
		let j = Math.floor(Math.random()*max);
		let card = Copy[j];
		list.push(card);
		Copy.splice(j,1);
	}
	return list;
}

function IsAlways(w)
{
	if (w)
	{
		if (w.stat)
		{
			return true;
		}
		if (w.letter_score && w.letter_score.always == 1)
		{
			return true;
		}
		if (w.word_score && w.word_score.always == 1)
		{
			return true;
		}		
	}
	return false;
}

function xxGetWildcardPower(wild)
{
	let word = currentWord;
	if (IsAlways(wild))
	{
		return 0.33;
	}
	else if (wild.letters != null)
	{
		let regex = new RegExp(`[${wild.letters}]`);
		let matches = word.match(regex);
		const count = matches ? matches.length : 0;
		const power = (count > 0) ? Math.min(0.2+count*0.2, 1.0) : 0.0;		
		return power;
	}
	else if (wild.dict != null)
	{
		const str = wild.dict;
		const keys = str.split('|');
		let S = new Set(keys);
		let power = S.has(word) ? 1.0 : 0.0;		
		return power;//EvaluateByWords(currentWord, keys);
	}
	else if (wild.pattern != null)
	{
		// Create a regular expression from the pattern
		let regex = new RegExp(wild.pattern);
		// Test the word against the regular expression
		let power = regex.test(word) ? 1:0;
		return power;
	}
	else if (wild.highlight != null)
	{
		if (wild.highlight.size != null)
		{
			return wild.highlight.size == word.length ? 1:0;
		}
	}
	else if (wild.name == 'Vowels')
	{
		return EvaluateByVowels(word);
	}	
	return 0;
}

function lerpColor(ratio, color1, color2)
{
	// Convert hex to RGB
	let c1 = parseInt(color1.slice(1), 16);
	let c2 = parseInt(color2.slice(1), 16);

	let r1 = (c1 >> 16) & 0xff;
	let g1 = (c1 >> 8) & 0xff;
	let b1 = c1 & 0xff;

	let r2 = (c2 >> 16) & 0xff;
	let g2 = (c2 >> 8) & 0xff;
	let b2 = c2 & 0xff;

	// Linear interpolation
	let r = Math.round(r1 + ratio * (r2 - r1));
	let g = Math.round(g1 + ratio * (g2 - g1));
	let b = Math.round(b1 + ratio * (b2 - b1));

	// Convert RGB back to hex
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Return float 0..1 for strength
function EvaluateByVowels(word)
{
	const raw = word.match(/[aeiouAEIOU]/g);
	const count = raw && raw.length;
	const power = (count > 0) ? Math.min(0.2+count*0.2, 1.0) : 0.0;
	return power;
}

function EvaluateByWords(card,list)
{
	let S = new Set(list);
	let power = S.has(currentWord) ? 1.0 : 0.0;
	return power;
}

/*
function xShowPowerLevel(card, power)
{
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
		let bcolor = '#00AFFF';
		if (power < 0.50) style='dashed';
		if (power > 0.77) style='solid';
		border = '4px '+style+' '+bcolor;
		// TODO: update frequency for sizzling colors?
	}
	//card.style.background = color;
	card.style.border = border;
}
*/