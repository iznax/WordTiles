const LetterScore =
	{
		'A':1,'E':1,'I':1,'L':1,'N':1,'O':1,'R':1,'S':1,'T':1,'U':1,
		'D':2,'G':2,
		'B':2,'C':2,'M':3,'P':3,
		'F':4,'H':4,'V':4,'W':4,'Y':4,
		'K':5,
		'J':8,'X':8,
		'Q':10, 'Z':10,
	};

function getLetterScore(text)
{
	let L = text.toUpperCase();
	const raw = LetterScore[L] || 0;
	let upgrade = Player.GetBadge(L);
	return raw + upgrade;
}

// Balatro 300,450,600
//         800,1200,1600
//         XXX,4200,?

// First round should be doable with 2 average hands
// NEW: 100 150 200(B)
//      150 200 250(B)
//      200 250 300(B)
//      250 300 350(B)
// 100 125
// 150 175
// 200 200 Boss
// 150 225
// 200 200
// 250 250 Boss
// 200
// etc.
function GetLevelScore(level,phase)
{
	const L = level; // = 1,2,3
	const P = phase;
	const A = Math.pow(2,L-1);
	const B = Math.pow(2,L+0);
	const I = B-A;
	const D = 50;
	// 100, 150, 250, 450 etc.
	return 50 + A*D + (P-1)*(B-A)*D/2;
}

function CalculateWinScore()
{
	//console.assert(Round.Level == xLevel);
	return GetLevelScore(Round.Level,Round.Phase);
}

let DebugScore = false;
	
if (DebugScore)
{
	for (let z=1; z<=8*3; z++)
	{
		let sco = GetLevelScore(z/3,z%3);
		console.log("Win #"+z+" = "+sco);
	}		
}
	
function getBaseScore(word)
{
	let score = 0;
	for (var i=0; i<word.length; ++i)
	{
		score += getLetterScore(word[i]);
	}
	return score;
}

//const MultiByLength = [ 0,5,6,7,10,12,14,16,20 ];
const MultiByLength = [ 0,2,3,4,6,10,15,22,30 ]; // approx 1.5x

function getBaseMulti(word)
{
	const index = Math.min(word.length, 8);
	return MultiByLength[index];
	//return Math.min((word.length+1)/2,5);	
}

// TODO: Animation for individual score elements is critical
// to understanding the game, the strategies and the Jokers!
function obsolete_getScore(word)
{
	let context = { score:0, multi:1 };
	context.score = getBaseScore(word);
	context.multi = getBaseMulti(word);
	context.expo = Player.Expo || 1;
	// TESTING!
	//Joker1_Eval(context,word);
	//Joker2_Eval(context,word);
	const score = Math.ceil(context.score * context.multi);
	return Math.pow(score, context.expo);
}

// Basic score without any modifiers
function obsolete_EstimateScore(word)
{
	return getScore(word);
}

const RarityCommon   = 0; // White
const RarityUncommon = 1; // Green
const RarityRare     = 2; // Blue
const RarityEpic     = 3; // Purple
const RarityMythic   = 4; // Yellow

// Fully modified score from cards
class ScoreCalculator
{
	constructor(word, apply)
	{
		const Multi = getBaseMulti(word);
		
		const Exponent = Player.ScoreExponent || 1;
		
		// Equation
		let eq = { score:[], multi:Multi, extra:0, expo:Exponent };
		
		this.Word =  word;
		this.EQ = eq;

		// Debug mode is used to calculate with no other affects
		this.Debug = !apply;
		
		// The default score for each letter can be modified by cards
		for (let i=0; i<word.length; i++)
		{
			let ch = word[i];
			eq.score[i] = getLetterScore(ch);
		}
		
		// Rarity (0-4) = Common, Uncommon, Rare, Epic, Mythic
		this.Mods = [1,1,1,1,1];
		
		// Which wildcards modified the score
		this.Used = [];
		
		let wildcards = PlayerWildcards.Hand;
		this.BeginScore(wildcards);
		for (let card of wildcards)
		{
			card.NewCalculateScore(this);
		}
		
		for (let card of wildcards)
		{
			card.FinalizeScore(this);
		}		
		
		// Score Function Options:
		//  Original (2+1+3+2)^1 * 10   =  8*10  = 80
		//  Score    (2+1+3+2)^2 * 10   = 64*10  = 640
		//  Both     (2+1+3+2)^2 * 10^2 = 64*100 = 6400
		// *Tile  2^2 + 1^2 + 3^2 + 2^2 = 4+1+9+4
		//           (4+1+9+4)   * 10   = 18*10  = 180
		
		eq.total = this.GetTotal(Exponent);
		this.Score = eq.total * eq.multi;
		const A = eq.total;
		const B = eq.multi;
		const E = eq.expo;
		// TODO: show A^2+B^2+Z^2 vs (A+B+Z)^2 which is incorrect?
		console.log(`Score: ${A}^${E} * ${B} = `+this.Score);
		this.Final = true;
		
		this.EndScore(wildcards);

		// TODO: ensure that EndScore does not change things?
		let T = this.GetTotal(Exponent);
		console.assert(T == eq.total);
	}
	
	BeginScore(wildcards)
	{
		for (let card of wildcards)
		{
			card.BeginScore(this);
		}
	}
	
	EndScore(wildcards)
	{
		for (let card of wildcards)
		{
			card.EndScore(this);
		}
	}
	
	OnWildcardUsed(card)
	{
		if (this.Final) // don't allow changes in EndScore phase
		{
			console.assert(false); // already finalized
			return;
		}
		this.Used.push(card);
	}
	
	Apply(card, multi, extra)
	{
		if (this.Final) // don't allow changes in EndScore phase
		{
			console.assert(false); // already finalized
			return;
		}
		const R = card.Rarity || 0;
		const mod = this.Mods[R];
		this.EQ.multi += multi * mod;
		this.EQ.extra += extra;
		this.Used.push(card);
	}
	
	SetMod( rarity, multi )
	{
		// Whatever mod is highest wins?
		let old = this.Mods[rarity];
		this.Mods[rarity] = Math.max(old,multi);
	}
	
	SetLetterScore(index, score)
	{
		let eq = this.EQ;
		if (index >= 0 && index < eq.score.length)
		{
			eq.score[index] = score;
		}
	}
	
	GetTotal(exponent)
	{
		const e = exponent || 1;
		let eq = this.EQ;
		let total = eq.extra;
		for (let i=0; i<eq.score.length; i++)
		{
			total += Math.pow(eq.score[i],e);
		}
		return total;
	}
}

// Returns the reward for winning a match
function GetWinCoins(round)
{
	let turns = round.Turn;
	// Default coin reward
	let coins = 2;
	// If you beat the opponent with fewer than (4) turns
	// or word scores you get bonus coins
	if (turns == 1) coins += 3;
	if (turns == 2) coins += 2;
	if (turns == 3) coins += 1;
	return coins;
}

// Reward extra discards for quicker wins
// added to (Stat.AddDiscards) so you always get something
const DiscByTurns = [3,2,1,0];

function GetWinRewards(round)
{
	let reward = {};
	reward.Coins = GetWinCoins(round);
	reward.Discards = Stats.AddDiscards;
	
	// TODO: Wildcard bonus?
	for (let card of PlayerWildcards.Hand)
	{
		card.OnReward(reward);
	}
	
	// More discards for winning the round in fewer turns.
	reward.Discards += DiscByTurns[round.Turn-1];

	// TODO: Boss bonus?
	if (round.Opponent.Boss)
	{
		reward.Discards += Stats.BossDicards;
	}
	return reward;
}

// Returns any bonus points for a letter tile being played
// Evaluates active wildcards for per-letter score changes
function LetterBonus(letter, value, wildcards)
{
	let bonus = 0;
	for (let wild of wildcards)
	{
		const proc = wild.letter_score;
		if (proc == null)
		{
			continue;
		}
		if (TestPattern(wild, letter))
		{
			if (proc.add) // added to letter score
			{
				bonus += proc.add;
			}
			else if (proc.clamp) // replaces letter score
			{
				// Score 10
				//  A(1)  Bonus=9
				//  M(3)  Bonus=7
				//  Q(10) Bonus=0
				// Score 5
				//  J(10) Bonus=-5
				bonus += (proc.clamp - value);
			}
		}
	}
	return bonus;
}

function GetScoreScript(word)
{
	let total = 0;
	let multi = getBaseMulti(word);
	let script = [];
	let wildcards = PlayerWildcards.Hand;
	for (let i=0; i<word.length; i++)
	{
		const ch = word[i];
		let s = getLetterScore(ch);
		if (s != 0)
		{
			const bonus = LetterBonus(ch,s,wildcards);
			const add = (s+bonus);
			total += add;
			let it = { add:total, mul:multi, tile:i, show:"+"+add, color:'white' };
			script.push(it);
		}
	}
	for (let wild of wildcards)
	{
		let proc = wild.word_score;
		if (proc == null)
		{
			continue;
		}
		if (proc.always)
		{
			if (proc.add != null)
			{
				total += proc.add;
				let it = { add:total, mul:multi, wildcard:wild, show:"+"+proc.add, color:'white' };
				script.push(it);
			}
			if (proc.multi != null)
			{
				multi += proc.multi;
				let it = { add:total, mul:multi, wildcard:wild, show:"x"+proc.multi, color:'white' };
				script.push(it);
			}
		}
	}
	let end = total * multi;
	let it = { add:total, mul:multi, score:end };
	script.push(it);
	return script;
}
