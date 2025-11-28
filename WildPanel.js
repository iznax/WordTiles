
let UseNewWildcards = true;

// TODO: Stats.variable?
//let MaxWildcards = 5;

class xWildPanel
{
	constructor()
	{
	}
}

const wildsContainer = document.querySelector('.jokers');

	function CreateWildcardElement(wild, card)
	{
		console.assert(card == null);
		/*
		if (card)
		{
			return card.CreateElement(wild);
		}
		*/

		// Used by TheShop with no card?
		let name = wild.name;
		let emoji = wild.emoji || '&#x1F451;';
		let bonus = '';
		
		let dummy = new BaseCard(wild);
		const element = dummy.CreateRawElement(wild,name,emoji,bonus);
		/*
		const element = document.createElement('div');
		element.className = 'wild';
		element.innerHTML = `
			${wild.name}
			<div class='big'>${emoji}</div>
			<div class='bonus'>${bonus}</div>
			<div class="tooltip">${wild.desc}</div>
			<button class="sellTag">SELL</button>
			<button class="buyTag">BUY</button>
			<div id="price" class="buyCost">5&#128192T</div>
		`;
		*/
		element.Card = card;
		element.Wild = wild;
		return element;
	}
	
	function CreateEmptyWildcard()
	{
		const tileElement = document.createElement('div');
		tileElement.className = 'wild';
		tileElement.classList.add('clear');
		tileElement.innerHTML = '+';
		return tileElement;
	}
	
	// Adds wildcard tile to visible list
	function ShowWildcard(wild, card)
	{
		const elem = card.CreateElement(wild);//CreateWildcardElement(wild, card);
		wildsContainer.appendChild(elem);
		if (card)
		{
			//card.Element = elem;
			card.UpdateElement();
		}
		else // OBSOLETE?
		{
			/*
			const power = GetWildcardPower(wild);
			if (power > 0)
			{
				ShowPowerLevel(elem, power);
			}
			*/
		}
	}

	function ShowEmptyWildcard()
	{
		const elem = CreateEmptyWildcard();
		wildsContainer.appendChild(elem);
		// TODO: create an object to persist and update each card?
	}

	// TODO: PlayerWildcards.Update();
	function UpdateWildcards()
	{
		PlayerWildcards.Update();
		
		for (let i=0; i<wildsContainer.children.length; i++)
		{
			let elem = wildsContainer.children[i];
			let card = elem.Card;
			if (card)
			{
				const power = card.Power;
				card.ShowPowerLevel(power);
			}
		}
	}

	// TODO: PlayerWildcards.Rebuild();
	function RebuildWildcards()
	{
		wildsContainer.innerHTML = '';
		let count = 0;
		for (let card of PlayerWildcards.Hand)
		{
			ShowWildcard(card.Wild, card);
			count++;
		}

		let empty = Player.MaxWildcards - count;
		for (let i=0; i<empty; i++)
		{
			ShowEmptyWildcard();
		}
	}
