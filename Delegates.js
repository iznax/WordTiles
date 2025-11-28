
function OnCoinsChanged()
{
	UpdateScoreUI();
	
	// TODO: update shop for Black/Yellow text on which Items you can afford?
	UpdateShopPrices();
}

function OnQuartersChanged()
{
	UpdateQuartersUI();
}

function OnWildcardsChanged()
{
	// Not full rebuild -- preserves content of existing cards.
	let PW = Player.Wildcards;
	//PlayerWildcards.OnChanged();
	PW.OnChanged();
}

function OnExponentChanged()
{
	// TODO: UI?
	UpdateScoreUI()
}

function OnScoreChanged()
{
	updateProgress();
	UpdateScoreUI()
}

function OnDiscardChanged()
{
	// TODO: UI?
	UpdateScoreUI()
}

function OnBeginTurn(index)
{
	if (PlayerWildcards)
	{
		for (let card of PlayerWildcards.Hand)
		{
			card.OnTurn(index);
		}
	}
}

function OnHandReady()
{
	if (PlayerWildcards)
	{
		for (let card of PlayerWildcards.Hand)
		{
			card.OnHandReady();
		}
	}
}

/*
let Delegates = {};

class Callbacks
{
	constructor(key)
	{
		this.Name = key;
		this.List = [];
	}
	Broadcast()
	{
		for (let it of this.List)
		{
			it.Broadcast();
		}
	}
	Add(d)
	{
		this.List.push(d);
	}
	Remove(d)
	{
		let index = 0;
		this.List.slice(index,1);
	}
};

function RegisterDelegate(key)
{
	Delegates[key] = new Callbacks(key);
}

RegisterDelegate("OnDiscardLetter");

class Delegate
{
	constructor(key,card)
	{
		this.Key = key;
		this.DB = Delegates[key];
		this.Card = card;
	}
	Add()
	{
		this.DB.Add(this);
	}
	Remove()
	{
		//this.DB.Remove(this);
		this.Card = null;
		this.DB = null;
	}
	Broadcast()
	{
		if (this.Card)
		{
			console.log("broadcast = "+this.Key);
			this.Card[this.Key]();
		}
	}
};

let D1 = new Delegate("OnDiscardLetter");
D1.Add();
Delegates.OnDiscardLetter.Broadcast();
D1.Remove();
Delegates.OnDiscardLetter.Broadcast();
*/

function OnDiscardLetter(letter)
{
	for (let card of PlayerWildcards.Hand)
	{
		card.OnDiscardLetter(letter);
	}
}

class PlayWordContext
{
	constructor(word)
	{
		this.Word = word;
		this.Tiles = Array.from(PlayerTiles.Used);
	}
	Perform()
	{
		this.OnBegin();
		PlayLetters(); // aka ConsumeLetters
		// TODO: PlayerTiles.Used is already cleared?
		//let used = Array.from(PlayerTiles.Used);
		//let context = { word:this.Word, tiles:used };
		//PlayerWildcards.Played = context;
		PlayerWildcards.OnWordPlayed(this.Word, this);
		//PlayerWildcards.Played = null;
		ClearWord();
		this.OnEnd();
	}
	OnBegin()
	{
		// IsValid?
		PlayAudioWord();
		PlayerWildcards.OnBeginWord(this);
	}
	OnEnd()
	{
		PlayerWildcards.OnEndWord(this);
	}
}
