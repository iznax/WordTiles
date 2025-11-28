
function IsTileClass(e)
{
	return e.classList.contains('tile');
}

// API
function DeckSize()
{
	return NewDeck.Count();
	//return TheDeck.length;
}
function DeckGet(index)
{
	//let t1 = TheDeck[index];
	let t = NewDeck.Get(index);
	// TODO: Seed?
	//console.assert(t.Letter == t2.Letter);
	return t;
}
function DeckPop()
{
	return NewDeck.Pop();
}
function DeckRemove(index)
{
	//removeDeckByIndex(index);
	NewDeck.RemoveAtIndex(index);
	//console.assert(TheDeck.length == NewDeck.List.length);
}

// replacement for let PlayerTiles = [];
class HandTiles
{
	constructor(size)
	{
		this.Size = size;
		this.Tiles = [];
		this.Used = [];
	}

	Reset()
	{
		this.Tiles.length = 0;
		this.Used.length = 0;
	}

	HasBlanks()
	{
		let count = 0;
		for (let tile of this.Tiles)
		{
			if (tile.letter == ' ')
			{
				count += 1;
			}
		}			
		return count;
	}
	
	// Returns a string of All the current letters
	GetLetters()
	{
		let str = "";
		for (let tile of this.Tiles)
		{
			str += tile.Letter;
		}
		return str;
	}
	
	GetUnusedLetters()
	{
		let subset = this.Tiles.filter(it => !this.Used.includes(it));
		let str = "";
		for (let tile of subset)
		{
			str += tile.Letter;
		}		
		return str;
	}
	
	NumSelected()
	{
		return this.Used.length;
	}
	
	GetPosition(index)
	{
		if (index < this.Used.length)
		{
			let tile = this.Used[index];
			return this.Tiles.indexOf(tile);
		}
		return -1;
	}
	
	// Try to pick a random tile from deck and add to list of Tiles
	TryPickFromDeck(deck)
	{
		const max = DeckSize();
		if (max != 0)
		{
			//let index = Math.floor(Math.random()*max);
			//let t = DeckGet(index);
			let t = DeckPop();
			this.Tiles.push(t);
			//DeckRemove(index);
		}
	}
	
	PickTiles(deck, count)
	{
		this.Tiles.length = 0;
		
		for (let i=0; i<count; ++i)
		{
			this.TryPickFromDeck(deck);
		}
	}
	
	// A letter tile in the player hand
	CreateTileElement(tile)
	{
		const tileElement = document.createElement('div');
		tile.element = tileElement;
		tileElement.className = 'tile';
		let score = tile.Score;
		if (tile.Letter == ' ') // Wild?
		{
			tileElement.classList.toggle('wild-tile');
			score = '?';
		}
		let inner = '';
		// TODO: multiple badge types?
		let badge = Player.GetBadge(tile.Letter);
		if (badge > 0)
		{
			// TODO: Shape vs Color for the color-blind?
			//let red = '&#x1F537'; // diamond
			//let blue = '&#x1F535;'; // circle
			//let flag = '&#x1F6A9;';
			const tri = '&#9700;';
			switch (badge)
			{
				case 1: inner += '<div class="tile-badge" style="color: green;">'+tri+'</div>'; break;
				case 3: inner += '<div class="tile-badge" style="color: blue;">'+tri+'</div>'; break;
				case 7: inner += '<div class="tile-badge" style="color: red;">'+tri+'</div>'; break;
				case 9: inner += '<div class="tile-badge" style="color: white;">'+tri+'</div>'; break;
			}
			tile.Badge = badge;
		}
		inner += `<div class="tile-letter">${tile.Letter}</div>`;
		if (score > 1)
		{
			inner += `<div class="tile-highlight">${tile.Letter}</div>`;	
		}
		inner += `<span class="tile-score">${score}</span>`;
		tileElement.innerHTML = inner;
		if (score > 1)
		{
			let glow = '#EE7';
			if (score == 2) glow = '#CC7';
			if (score == 3) glow = '#DD7';
			if (score >  5) glow = '#fff';
			let child = tileElement.querySelector('.tile-highlight');
			child.style.setProperty('--glow',glow);
		}
		tileElement.Index = 5;
		tileElement.addEventListener('click', () => {
			useLetter(tile);
		});
		
		// Shortcut to reset word = RMB (right mouse button)
		tileElement.addEventListener('contextmenu', function(event) {
			event.preventDefault(); // Prevent the default context menu from appearing
			ClearWord();
		});
	
		let b = tileElement;
		b.addEventListener('mousedown', (event) => {
			StartHold(drag, event.clientX, event.clientY);
			drag.source = tileElement;
		});
	
		return tileElement;
	}
	
	// Add the HTML elements for current letter tiles
	Render(container)
	{
		container.innerHTML = '';
		this.Tiles.forEach(tile => {
			let button = this.CreateTileElement(tile);
			if (GamePaused)
			{
				button.style.background = "#3f3f3f";
				button.style.border = '2px solid #272727';
			}
			container.appendChild(button);
			//button.classList.add('highlight');
		});
	}

	TryRemoveTile(tile)
	{
		for (let i=0; i<this.Tiles.length; ++i)
		{
			if (this.Tiles[i] === tile)
			{
				this.Tiles.splice(i,1);
				return true;
			}
		}
		return false;
	}
	
	// Return (true) if tile successfully removed from Used list
	TryRemoveUsed(tile)
	{
		if (tile !== null)
		{
			for (let i=0; i<this.Used.length; ++i)
			{
				if (this.Used[i] === tile)
				{
					this.Used.splice(i,1);
					return true;
				}
			}
		}
		return false;
	}
	
	// After dragging letter tiles (html) make sure the local
	// player list of tiles (instances) is in the same order
	FixupTiles(container)
	{
		let order = [];
		for (let i=0; i<container.children.length; i++)
		{
			let node = container.children[i];
			console.assert(IsTileClass(node));
			for (let it of this.Tiles)
			{
				if (it.element === node)
				{
					order.push(it);
					break;
				}
			}
		}
		this.Tiles = order;
	}
	
	// aka RebuildWord() original function
	GetWord()
	{
		let word = '';
		for (let tile of this.Used)
		{
			word += tile.Letter;
		}
		return word;
	}

	IsUsed(tile)
	{
		if (tile !== null)
		{
			for (let i=0; i<this.Used.length; ++i)
			{
				if (this.Used[i] === tile)
				{
					return true;
				}
			}
		}
		return false;
	}
	
	ClearUsed()
	{
		for (let tile of this.Used)
		{
			OnTileUnused(tile);
		}
		this.Used.length = 0;					
	}

	AddUsed(tile)
	{
		if (tile === null)
		{
			return false;
		}
		for (let i=0; i<this.Used.length; ++i)
		{
			if (this.Used[i] === tile)
			{
				return false;
			}
		}
		this.Used.push(tile);
		return true;
	}

	RemoveUsed(tile)
	{
		if (tile !== null)
		{
			for (let i=0; i<this.Used.length; ++i)
			{
				if (this.Used[i] === tile)
				{
					this.Used.splice(i,1);
					return true;
				}
			}
		}
		return false;
	}
	
	First()
	{
		return this.Used.length ? this.Used[0] : null;
	}

	// Wildcards can lock certain letters to prevent discard
	FirstUnlocked()
	{
		for (let It of this.Used)
		{
			if (It.Locked)
			{
				continue;
			}
			return It;
		}
		return null;
	}	
}

	function OnTileUsed(tile)
	{
		let RGB = '#AA4';
		tile.element.style.color = RGB;
		let shadow = tile.element.querySelector('.tile-letter');
		if (shadow)
		{
			shadow.style.color = RGB;	
		}
		
	}
	
	function OnTileUnused(tile)
	{
		tile.element.style.color = 'black';
		let shadow = tile.element.querySelector('.tile-letter');
		if (shadow)
		{
			shadow.style.color = 'black';	
		}
	}
	
	function NewClearUsed()
	{
		PlayerTiles.ClearUsed();
	}

	function IsUsed(tile)
	{
		return PlayerTiles.IsUsed(tile);
	}
	
	function AddUsed(tile)
	{
		return PlayerTiles.AddUsed(tile);
	}
	
	function RemoveUsed(tile)
	{
		return PlayerTiles.RemoveUsed(tile);
	}
	
	function tryRemoveUsed(tile)
	{
		if (tile !== null)
		{
			for (let i=0; i<currentUsed.length; ++i)
			{
				if (currentUsed[i] === tile)
				{
					currentUsed.splice(i,1);
					return true;
				}
			}
		}
		return false;
	}

	function NewFixupTiles()
	{
		PlayerTiles.FixupTiles(tilesContainer);
	}

	function NewGetWord()
	{
		return PlayerTiles.GetWord();
	}

	let RefillCount = 0;
	let RefillTimer = null;
	
	function OnTileConsumed()
	{
		// TODO: we should defer this to check if MatchResult?
		let anim = true;
		if (anim)
		{
			setTimeout(()=>AnimateDeal(),150);
		}
		else // original
		{
			PlayerTiles.TryPickFromDeck(deck);
		}
	}
	
	function Consume1()
	{
		let first = PlayerTiles.First();
		if (first && first.Locked)
		{
			first = PlayerTiles.FirstUnlocked();
		}
		if (first !== null)
		{
			PlayerTiles.TryRemoveUsed(first);
			PlayerTiles.TryRemoveTile(first);
			OnTileConsumed();
		}
		return first;
	}

	function NewRenderTiles()
	{
		PlayerTiles.Render(tilesContainer);
	}
	
	function NewPickTiles(size)
	{
		PlayerTiles.PickTiles(deck,size);
	}

	const swapElement = document.createElement('div');
	
	function swapLetters(a,b)
	{
		console.assert(IsTileClass(a));
		console.assert(IsTileClass(b));
		tilesContainer.replaceChild(swapElement,a);
		tilesContainer.replaceChild(a,b);
		tilesContainer.replaceChild(b,swapElement);
		NewFixupTiles();
	}	
	
// List of active Letter tiles on the play field
let PlayerTiles = new HandTiles(8);
