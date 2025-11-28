class MessageSystem
{
	Register(id, func)
	{
		this[x] = func; // Use x as the key
	}
	Broadcast(id,context)
	{
		if (this[id])
		{
			this[id](context);
		}
	}
}

let MSG = new MessageSystem();

class PlayerState
{
	constructor()
	{
		this.Ready = false;
		this.Reset();
		this.Ready = true;
	}
	
	Reset()
	{
		this.Coins = 0;
		this.Discards = 0;
		this.Score = 0;
		this.Total = 0;
		this.Quarters = 0;
		this.Completed = new Set(); // container of wildcards
		this.History = [];
		// Map of wildcard to prize count
		this.Prizes = new Map();
		// Allow player to manipulate Tiles in deck with colored badges
		this.Badges = new Map();
		// Exponent for score calculation accumulated by ExpoCard wildcards
		this.ScoreExponent = 1; // aka Expo

		if (this.Wildcards === undefined)
		{
			this.Wildcards = new WildHand();	
		}
		else
		{
			this.Wildcards.Reset();
			RebuildWildcards();
		}
		
		// Reset if WILD expanded the number of slots
		//Stats.ResetWildcards();	
		this.SetMaxWildcards(5);
	}

	AddCompleted(wild)
	{
		this.Completed.add(wild);
	}
	HasCompleted(wild)
	{
		return this.Completed.has(wild);
	}
	
	GetPrizeKey(wild)
	{
		// Key has to be unique, CLASS is used by multiple cards
		return wild.name;
	}
	GetPrizeCount(wild)
	{
		// TODO: key = wild.CLASS so that debug "Object -> 1" looks better?
		let key = this.GetPrizeKey(wild);
		return this.Prizes.get(key) || 0;
	}
	IncrementPrizeCount(wild)
	{
		let key = this.GetPrizeKey(wild);
		let count = this.Prizes.get(key) || 0;
		this.Prizes.set(key, count + 1);
	}	
	
	SetExponent(e)
	{
		let expo = (e > 1) ? e : 1;
		if (expo != this.ScoreExponent)
		{
			this.ScoreExponent = expo;
			OnExponentChanged();
		}
	}
	
	SetMaxWildcards(max)
	{
		this.MaxWildcards = max;
		
		// TODO: replace global!
		//MaxWildcards = max;
		
		if (this.Ready)
		{
			MSG.Broadcast("OnWildcardsChanged");
			OnWildcardsChanged();
		}
		// TODO: UI.wildcards?
		let gap = 16;
		if (max >= 5) switch (max)
		{
			case 5: gap = 16; break;
			case 6: gap = 11; break;
			case 7: gap =  7; break;
			case 8: gap =  4; break;
		}

		wildsContainer.style.gap = gap + 'px';
	}
	
	UpgradeTile(ch,score)
	{
		if (!ch || ch == ' ' || score <= 0)
		{
			return;
		}
		// Show red/blue corner icon
		this.Badges.set(ch,score);
	}
	
	OnRoundStart()
	{
		// aka Round Score	
		this.Score = 0;
		PlayerScore = 0;
		//OnScoreChanged();
	}
			
	HasBadge(letter)
	{
		return this.Badges.has(letter);
	}
	GetBadge(letter)
	{
		return this.Badges.get(letter) || 0;
	}	
	
	AddCoins(count)
	{
		console.assert(count >= 0);
		if (count > 0)
		{
			this.Coins += count;
			// Temporary cache
			PlayerCoins = this.Coins;
			OnCoinsChanged();			
		}
	}
	RemoveCoins(count)
	{
		console.assert(count >= 0);
		const coins = Math.max(this.Coins - count, 0);
		if (coins != this.Coins)
		{
			this.Coins = coins;
			// Temporary cache
			PlayerCoins = coins;
			OnCoinsChanged();
		}
	}	
	AddDiscards(count)
	{
		console.assert(count > 0);
		this.Discards += count;
		// Temporary cache
		PlayerDiscards = this.Discards;
		//OnDiscardsChanged();
	}
	RemoveDiscards(count)
	{
		console.assert(count > 0);
		this.Discards -= count;
		// Temporary cache
		PlayerDiscards = this.Discards;
		//OnDiscardsChanged();
	}	
	AddScore(score)
	{
		this.Score += score;
		this.Total += score;
		// Temporary cache
		PlayerScore = this.Score;
		PlayerTotal = this.Total;
	}
	AddQuarters(count)
	{
		this.Quarters = Math.min(8,this.Quarters+count);
		console.log("Quarters = "+this.Quarters);
		OnQuartersChanged();
	}
	RemoveQuarters(count)
	{
		this.Quarters = Math.max(0,this.Quarters-count);
		console.log("Quarters = "+this.Quarters);
		OnQuartersChanged();
	}	
	
	CanUpgrade(wild)
	{
		if (wild.CLASS === QuarterCard)
		{
			return true;
		}
		return false;
	}
	UseUpgrade(wild)
	{
		if (wild.CLASS === QuarterCard)
		{
			this.AddQuarters(1);
		}
	}
}

class GameStats
{
	constructor() { this.Reset(); }
	
	Reset()
	{
		// TODO: Allow jokers or Boss to affect stats?
		this.InitTiles = 8;
		this.InitDiscards = 8;
		this.AddDiscards = 1; // Normal reward
		this.BossDicards = 1; // extra is added to normal
		this.MaxDiscards = 99;
	}
	
	OnGameStart()
	{
		Reset();
	}
	
	OnRoundStart()
	{
	}
	
	IncrementWildcards(add)
	{
		if (add > 0)
		{
			let max = Math.min(Player.MaxWildcards + add, 8);
			Player.SetMaxWildcards(max);
			PlayAudio('Slot');
		}
	}
}

// Give arbitrary list of rewards to player
// Handle whatever it takes, time, delay, fx
class GiveRewardContext
{
	constructor(rewards)
	{
		this.Rewards = rewards;
	}
	OnBegin()
	{
	}
	OnEnd()
	{
	}
	Perform()
	{
		this.OnBegin();
		
		let R = this.Rewards;
		if (R.discards > 0)
		{
			Player.AddDiscards(R.discards);
			OnDiscardChanged();
		}
		if (R.shuffle)
		{
			DiscardAll();
			BuildDeck();
			OnRoundStart(); // hand is clear and deck is ready
			UpdateBag();
			AnimateDeal();
		}
		if (R.blanks)
		{
			const blanks = R.blanks || 1;
			let count = 0;
			for (let tile of PlayerTiles.Tiles)
			{
				if (tile.Letter === ' ')
				{
					continue;
				}
				tile.Letter = ' ';
				if (++count >= blanks)
				{
					break;
				}
			}
			for (; count < blanks; ++count)
			{
				NewDeck.InjectLetter(' ');
			}
			ClearWord();
			RebuildWord();
			UpdateWordDisplay();
			NewRenderTiles();
		}
		if (R.slot)
		{
			Stats.IncrementWildcards(1);
		}

		this.OnEnd();
	}
}
