
	const UI = {};
	UI.Add = document.querySelector('.score-value');
	UI.Mul = document.querySelector('.score-multi');
	UI.Exp = document.querySelector('.score-expo');
	UI.RoundScore = document.querySelector('.score-big');
	UI.Coins = document.querySelector('.coin-text');
	UI.Level = document.querySelector('.level-text');
	UI.Hand = document.getElementById('hand-text');
	UI.Discard = document.getElementById('discard-text');
	UI.BagDetails = document.querySelector('.deck-popup');
	UI.ScoreToWin = document.querySelector('.score');
	UI.MatchResult = document.querySelector('.match-result');
	UI.Bag = document.querySelector('.bag');
	UI.Alphabet = document.querySelector('.alphabet');
	UI.Quarters = document.querySelector('.quarter-button');
	UI.QuarterShop = document.querySelector('.quarter-popup');
	UI.Alpha = document.querySelector('.alpha-box');
	UI.Audio = document.getElementById('Audio');
	UI.Opponents = document.getElementById('Opponents');
	UI.PageGame = document.querySelector('.page-game');
	UI.PageShop = document.querySelector('.page-shop');
	UI.ShopTiles = document.querySelector('.shop-tiles');
	
//const MultiByLength = [ 0,5,6,7,10,12,14,16,20 ];
	
	function MakeTip()
	{
		let text = "";
		for (let i=1; i<=8; ++i)
		{
			let V = MultiByLength[i];
			text += `${i}A = ${V}x<br>`;
		}
		return text;//"1A = 2x<br>2A = 3x<br>3A = 4x<br>4A = 5x<br>5A = 8x <br>6A = 10x <br>7A = 12x<br>8A = 15x";
	}
	
	const Tip=MakeTip();//"1A = 2x<br>2A = 3x<br>3A = 4x<br>4A = 5x<br>5A = 8x <br>6A = 10x <br>7A = 12x<br>8A = 15x";

function ShowMultiplier(score, multi)
{
	UI.Add.innerHTML = "+" + score;
	UI.Mul.innerHTML = `x${multi}<div class="scoretip">${Tip}</div>`;
	const expo = Player.ScoreExponent;
	if (expo > 1)
	{
		UI.Exp.innerHTML = expo;
		UI.Exp.style.display = 'flex';
	}
	else
	{
		UI.Exp.style.display = 'none';
	}
}

// Show any point Upgrades for Alphabet tiles
function ShowAlpha()
{
	let Abc = "No upgrades";
	if (Player.Badges.size != 0)
	{
		Abc = Array.from(Player.Badges.entries())
			.map(([key, value]) => `${key}:${value+1}`)
			.join(', ');
	}
	UI.Alpha.innerHTML = `abc<div class="alpha-tip">${Abc}</div>`;
}

function ToDecimalString(x)
{
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function FormatThousands(x) { return ToDecimalString(x); }

function UpdateScorebox(word,isValid)
{
	let score = isValid ? getBaseScore(word) : 0;
	let multi = isValid ? getBaseMulti(word) : 0;
	ShowMultiplier(score,multi);
	UI.RoundScore.innerHTML = FormatThousands(Player.Score);
	UI.Coins.innerHTML = Player.Coins;
	const turn = Round.Turn;
	UI.Hand.innerHTML = turn;
	UI.Discard.innerHTML = Player.Discards;
	//const level = Round.Level;
	const L = Round.Level;//Math.floor((level+2)/3);
	const R = Round.Phase;//((level-1)%3)+1;
	UI.Level.innerHTML = "Level "+L+"."+R;
	UpdateQuartersUI();
	ShowAlpha();
}

	function updateProgress()
	{
		let progress = document.querySelector('.progress');
		let pct = Math.floor(PlayerScore * 100 / Round.WinScore);
		pct = pct < 100 ? pct : 100;
		progress.style.backgroundImage = `linear-gradient(to right, #caf7ca ${pct}%, transparent ${pct}%)`
	}

	function UpdateBag()
	{
		UI.Bag.innerHTML = "Bag ("+DeckSize()+")";
		UpdateBagDetails();
	}
	
// EXPERIMENT: on screen clock ticking
// might only be visible when a Time Joker is in play
// ticks down and turns red=expired green=success
	
	let ClockSeconds = 0;
	let Ticks =
	[
		'&#128336', '&#128337', '&#128338', '&#128339', '&#128340', '&#128341',
		'&#128342', '&#128343', '&#128344', '&#128345', '&#128346', '&#128347',
	];
	
	function startClock()
	{
		setInterval(() => {
			ClockSeconds += 1;
			const Clock = document.querySelector('.clock');
			let sec = ClockSeconds % 12;
			Clock.innerHTML = Ticks[sec];
		},1000);
	}
	
	function OnHandChanged()
	{
		UpdateBag();
		NewRenderTiles();
	}
	
	function AnimateDeal()
	{
		if (Round.Result != 0)
		{
			return; // Stop dealing cards after match ends
		}
		if (UI.animTimer == null)
		{
			let P = PlayerTiles;
			if (P.Tiles.length < 8)
			{
				let delay = (9 - P.Tiles.length) * 30;
				UI.animTimer = setTimeout(DealTick, delay);	
			}
		}
	}
	
	function DealTick()
	{
		UI.animTimer = null;
		let P = PlayerTiles;
		if (P.Tiles.length < 8)
		{
			P.TryPickFromDeck(null);//TheDeck);
			OnHandChanged();
			
			if (P.Tiles.length < 8)
			{
				AnimateDeal();
				return;
			}
		}
		OnHandReady();
	}
	
function GetBagDetails()
{
	let text = '';
	const tiles = GetTileCounts();
	let empty = '&#9673;'; //10007, 10060;'; // 'x';
	for (let i=0; i<26; ++i)
	{
		let num = tiles[i];
		let N = (num > 0) ? '&#' + (10111+num) +";" : empty;
		let ch = String.fromCharCode(65 + i);
		text += ch + N + ' ';
		if (i % 6 == 5)
		{
			text += '<br>';
		}
	}
	return text;
}

// Return (true) if bag details are visible
function HasBagDetails()
{
	if (UI.BagDetails)
	{
		return UI.BagDetails.style.display === 'block';
	}
	return false;
}

function UpdateBagDetails()
{
	if (HasBagDetails())
	{
		UI.BagDetails.innerHTML = GetBagDetails();
	}
}

function ToggleBag()
{
	const popup = document.querySelector('.deck-popup');
	if (popup)
	{
		const current = HasBagDetails();
		popup.style.display = current ? 'none' : 'block';
		UpdateBagDetails();
	}
}

function ToggleQuarters()
{
	const popup = UI.QuarterShop;
	if (popup)
	{
		let current = true; // Player.Quarters > 0;
		current &&= popup.style.display === 'block';
		popup.style.display = current ? 'none' : 'block';
		UpdateQuarterShop();
	}
}

function UpdateQuarterShop()
{
	let txt = "";
	for (let i=0; i<QuarterItems.length; ++i)
	{
		let opt = QuarterItems[i];
		let price = IconSilver+"x"+opt.Cost;
		let line = "<div class='mini-row'>";
		line += "<span>"+price+" "+opt.Text+"</span>";
		let canBuy = (Player.Quarters >= opt.Cost);
		line += QButton(i,canBuy);
		line += "</div>";
		txt += line;
	}
	UI.QuarterShop.innerHTML = txt;
}

function animateEmoji()
{
	const emoji = document.getElementById('emoji');
	emoji.style.transition = 'none';
	emoji.classList.remove('move','fade');
	emoji.style.bottom = '65%';
	emoji.style.left = '60%';
	emoji.style.opacity = '1';
	
	// Force reflow
	void emoji.offsetWidth;
	
	emoji.style.transition = 'all 0.8s ease-out';
	emoji.classList.add('move');
	
	// Wait for movement to finish before fading
	setTimeout(() => {
		emoji.classList.add('fade');
	}, 600);			
}

function UpdateHistoryUI()
{
	let text = "";
	for (let w of Player.History)
	{
		text += w + "<br>";
	}
	let e = document.querySelector(".level-tip");
	e.innerHTML = text;

}

function UpdateScoreUI()
{
	let isValid = false; // TODO?
	UpdateScorebox(currentWord,isValid);
}

function UpdateQuartersUI()
{
	let text = '';
	for (let i=0; i<Player.Quarters; ++i)
	{
		text += IconSilver; // '&#x1F4BF;'
	}
	UI.Quarters.innerHTML = text;
}

function ToggleDisplay(widget)
{
	let Style = widget.style;
	Style.display = (Style.display === 'none') ? 'block' : 'none';
}

function OnNewLayout()
{
	ToggleDisplay(UI.Opponents);
	ToggleDisplay(UI.Audio);
}

OnNewLayout();

// TODO: preload sound bank?
let SoundBank =
{
	Action  :{ File:'Audio/PlayAction.wav',Sound:null,Volume:1.0 },
	Blank	:{ File:'Audio/PlayBlank.wav',Sound:null,Volume:0.8 },
	//Discard	:{ File:'Audio/DiscardTile.wav',Sound:null },
	Buy		:{ File:'Audio/PlaySell.wav',Sound:null,Volume:0.3 },
	Sell	:{ File:'Audio/PlaySell.wav',Sound:null,Volume:0.3 },
	Upgrade	:{ File:'Audio/PlayUpgrade.wav',Sound:null,Volume:0.5 },
	Upgrade1:{ File:'Audio/PlayUpgrade.wav',Sound:null,Volume:0.5 },
	Upgrade2:{ File:'Audio/PlayUpgrade.wav',Sound:null,Volume:0.7 },
	Upgrade3:{ File:'Audio/PlayUpgrade.wav',Sound:null,Volume:1.0 },
	Discard	:{ File:'Audio/PlaySwish.wav',Sound:null,Volume:0.5 },
	Ding	:{ File:'AudioShopDing.wav',Sound:null,Volume:0.25 },
	Fail	:{ File:'AudioFail.wav',Sound:null,Fast:true },
	Play1	:{ File:'Audio/PlayWord1.wav',Sound:null,Volume:0.2 },
	Play2	:{ File:'Audio/PlayWord2.wav',Sound:null,Volume:0.2 },
	Play3	:{ File:'Audio/PlayWord3.wav',Sound:null,Volume:0.3 },
	Play4	:{ File:'Audio/PlayWord4.wav',Sound:null,Volume:0.3 },
	Play5	:{ File:'Audio/PlayWord5.wav',Sound:null,Volume:0.4 },
	Play6	:{ File:'Audio/PlayWord6.wav',Sound:null,Volume:0.6 },
	Play7	:{ File:'Audio/PlayWord7.wav',Sound:null,Volume:0.9 },
	Play8	:{ File:'Audio/PlayWord8.wav',Sound:null,Volume:1.0 },
	PlayX	:{ File:'Audio/PlayWordX.wav',Sound:null },
	Purchase:{ File:'Audio/PlayCelebrate.mp3',Sound:null,Fast:true },
	Slot	:{ File:'Audio/PlaySlot.wav',Sound:null },
	Thunk	:{ File:'Audio/Thunk2.wav',Sound:null,Fast:true },
	WinRound:{ File:'Audio/RoundWin.wav',Sound:null },
	LostRound:{ File:'Audio/RoundLost.wav',Sound:null },
};

function PlayAudio(tag)
{
	let row = SoundBank[tag];
	if (row !== undefined)
	{
		let sfx = row.Sound;
		if (sfx === null || sfx === undefined || row.Fast)
		{
			sfx = new Audio(row.File);
			sfx.volume = row.Volume || 1.0;
			row.Sound = sfx;
		}
		sfx.play();
	}
}

function PlayAudioBlank() { PlayAudio('Blank'); }
function PlayAudioFail() { PlayAudio('Fail'); }
function PlayAudioThunk() { PlayAudio('Thunk'); }

function PlayAudioWord(length) 
{
	let tag = 'PlayX';
	switch (currentWord.length)
	{
		case 1: tag='Play1'; break;
		case 2: tag='Play2'; break;
		case 3: tag='Play3'; break;
		case 4: tag='Play4'; break;
		case 5: tag='Play5'; break;
		case 6: tag='Play6'; break;
		case 7: tag='Play7'; break;
		case 8: tag='Play8'; break;
	}
	PlayAudio(tag);
}

function PlayAudioDiscard()		{ PlayAudio('Discard'); }
function PlayAudioDing()		{ PlayAudio('Ding'); }
function PlayAudioPurchase()	{ PlayAudio('Purchase'); }
function PlayAudioSell()		{ PlayAudio('Sell'); }
function PlayAudioBuy()			{ PlayAudio('Buy'); }
function PlayAudioUpgrade()		{ PlayAudio('Upgrade'); }

function DebugWild(w)
{
	const sheet = document.getElementById('dynamicStyles').sheet;
	if (sheet)
	{
		let width = (120-w)+"px";
		for (let rule of sheet.cssRules)
		{
			if (rule.selectorText === '.wild')
			{
				rule.style.width = width;
			}
		}
	}
	
	//RebuildWildcards();
}
