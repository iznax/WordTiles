
const StandardLetterFreq =
{
	'A':9, 'B':2, 'C':2, 'D':4, 'E':12, 'F':2, 'G':3,
	'H':2, 'I':9, 'J':1, 'K':1, 'L':4,  'M':2, 'N':6,
	'O':8, 'P':2, 'Q':1, 'R':6, 'S':4,  'T':6, 'U':4,
	'V':2, 'W':2, 'X':1, 'Y':2, 'Z':1,	' ':4,
};

class RandomGenerator
{
	// Example of a seeded random number generator
	Seed(seed)
	{
		// LCG parameters
		this.a = 1664525;
		this.c = 1013904223;
		this.m = 2**32;
		this.state = seed ? seed % m : Math.floor(Math.random() * m);
    }
	
	Get()
	{
		this.state = (this.a * this.state + this.c) % this.m;
	}
	
	// Return random index in range (0 <= R <= size-1)
	Index(size)
	{
		return Math.floor(Math.random() * (size));		
	}
}

let Random = new RandomGenerator(0);

function ShuffleArray(deck)
{
	// Shuffle the array randomly
	for (let i=deck.length-1; i > 0; i--)
	{
		const j = Random.Index(i + 1);
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
}

function ShuffleString(str)
{
	let deck = str.split('');
	return ShuffleArray(deck).join('');
}

class Deck
{
	constructor(freq)
	{
		this.FrequencyTable = freq;
		this.List = [];
	}
	
	NewTile(alpha,id)
	{
		const value = getLetterScore(alpha);
		return { Letter:alpha, Score:value, Guid:id };		
	}

	Count()
	{
		return this.List.length;
	}
	
	Get(index)
	{
		return this.List[index];
	}

	// Parts(6) <= 102/6=17
	ShuffleBalance(str,parts)
	{
		let vow = [];
		let con = [];
		let blanks = 0;
		for (let i=0; i<str.length; i++)
		{
			let letter = str[i];
			if (letter === ' ')
			{
				blanks += 1;
				continue;
			}
			let list = "AEIOU".includes(letter) ? vow : con;
			list.push(letter);
		}
		
		vow = ShuffleArray(vow);
		con = ShuffleArray(con);
		const vn = Math.floor(vow.length/parts);
		const cn = Math.floor(con.length/parts);
		
		let pools = [];
		for (let i=0; i<parts; i++)
		{
			let block = "";
			for (let v=0; v<vn; v++)
			{
				block += vow.pop();
			}
			for (let c=0; c<cn; c++)
			{
				block += con.pop();
			}
			pools.push(block);
		}
		
		let extra = ShuffleString(vow.join('')+con.join(''));
		for (let i=0; i<extra.length; i++)
		{
			let g = i % pools.length;
			pools[g] += extra[i];
		}
		let result = "";
		for (let i=0; i<pools.length; i++)
		{
			result += ShuffleString(pools[i]);
		}
		
		let space = Math.floor(result.length/blanks);
		for (let i=0; i<blanks; i++)
		{
			// Insert the character at the random index
			let pos = i*space + Math.floor(Math.random()*space);
			let left = result.slice(0,pos);
			let right = result.slice(pos);
			result = left + ' ' + right;
		}
		return result;
	}

	ShuffleBalance4(str)
	{
		let vow = [];
		let con = [];
		let blanks = 0;
		for (let i=0; i<str.length; i++)
		{
			let letter = str[i];
			if (letter === ' ')
			{
				blanks += 1;
				continue;
			}
			let list = "AEIOU".includes(letter) ? vow : con;
			list.push(letter);
		}

		let g = Math.floor((str.length-blanks)/4);

		// TODO: check for more than 2 in-a-row?
		vow = ShuffleArray(vow);
		con = ShuffleArray(con);
		
		let dv = (vow.length/g);
		let dc = (con.length/g);
		let max = Math.max(dv,dc);
		dv = dv/max;
		dc = dc/max;
		
		let vpos = 0;
		let cpos = 0;
		
		let result = "";
		while (vow.length || con.length)
		{
			let tries = 0;
			let str = "";
			//while (str.length<4 && ++tries < 8)
			{
				if (vow.length != 0)
				{
					vpos += dv;
					if (vpos >= 1)
					{
						str += vow.pop();
						vpos -= 1;
					}
				}
				if (con.length != 0 && str.length<4)
				{
					cpos += dc;
					if (cpos >= 1)
					{
						str += con.pop();
						cpos -= 1;
					}
				}
			}
			result += ShuffleString(str);
		}
		
		let space = Math.floor(result.length/blanks);
		for (let i=0; i<blanks; i++)
		{
			// Insert the character at the random index
			let pos = i*space + Math.floor(Math.random()*space);
			let left = result.slice(0,pos);
			let right = result.slice(pos);
			result = left + ' ' + right;
		}
		return result;
	}
	
	GetDeckString(freq)
	{
		let str = "";
		for (let letter in freq)
		{
			for (let i = 0; i < freq[letter]; i++)
			{
				str += letter;
			}
		}
		return str;
	}
	
	Rebuild()
	{
		// Each tile gets a unique index
		let guid = 1;
		
		const deck = this.List;
		const freq = this.FrequencyTable;
		
		deck.length = 0;

		let str = this.GetDeckString(freq);
		//str = this.ShuffleRandom(str);
		//str = this.ShuffleBalance(str,6);
		str = this.ShuffleBalance4(str);
		
		// Populate the letter array based on frequencies
		for (let i = 0; i < str.length; i++)
		{
			let letter = str[i];
			let T = this.NewTile(letter,guid);
			deck.push(T);
			guid += 1;
		}

		this.AnalyzeDeck4(deck);
	}
	
	AnalyzeDeck(deck)
	{
		console.log("AnalyzeDeck("+deck.length+")");
		let parts = 6;
		let size = Math.floor(deck.length/parts);
		const vowels = /[aeiouAEIOU]/g;
		for (let g=0; g<parts; g++)
		{
			let str = "";
			let start = g*size;
			for (let i=0; i<size; i++)
			{
				str += deck[start+i].Letter;
			}
			const vcount = str.match(vowels).length; 
			console.log("Q"+g+" vowels="+vcount+"/"+size+" -- "+str);
		}
	}
	
	AnalyzeDeck4(deck)
	{
		console.log("AnalyzeDeck("+deck.length+")");
		let G = 4;
		let per = 5;
		let row_size = G*per;
		let rows = Math.ceil(deck.length/row_size);
		const vowels = /[aeiouAEIOU]/g;
		let quads = [];
		for (let i=0; i+G<=deck.length; i+=G)
		{
			let str = "";
			str += deck[i+0].Letter;
			str += deck[i+1].Letter;
			str += deck[i+2].Letter;
			str += deck[i+3].Letter;
			quads.push(str)
		}
		let line = "";
		let stat = "";
		for (let str of quads)
		{
			line += str + " ";
			const matches = str.match(vowels);
			const vcount = matches ? matches.length : 0; 
			stat += stat.length ? "|":"";
			stat += vcount;
			if (line.length == per*(G+1))
			{
				console.log(line+"v="+stat);
				line = "";
				stat = "";
			}
		}
		if (line.length != 0)
		{
			console.log(line+stat);
		}
	}	
	
	RemoveAtIndex(index)
	{
		console.assert(index < this.List.length);
		this.List.splice(index,1);
	}

	Pop()
	{
		// TODO: keep this.Head and do not modify the size of the array!
		let L = this.List;
		if (L.length == 0)
		{
			return null;
		}
		let tile = L.pop();
		//L.splice(0,1);
		return tile;
	}

	Peek(count)
	{
		let str = "";
		let last = this.List.length-1;
		for (let i=0; i<count; i++)
		{
			if (i > last)
			{
				break;
			}
			str += this.List[last-i].Letter;
		}
		return str;
	}
	
	InjectLetter(letter)
	{
		let t = this.NewTile(letter,1234);
		this.List.push(t);
	}
	
	GetTileCounts()
	{
		let counts = [];
		for (let i=0; i<26; i++)
		{
			counts[i] = 0;
		}
		const alpha = 'A'.charCodeAt(0);
		for (let tile of this.List)
		{
			let char = tile.Letter;
			let index = char.charCodeAt(0)-alpha;
			counts[index] += 1;
		}
		let BagDebug = true;
		if (BagDebug)
		{
			// Show end of deck due to pop order
			let str = "";
			let last = this.List.length-1;
			for (let i=0; i<12; ++i)
			{
				if (i < this.List.length)
				{
					str += (i != 0) ? "," : "";
					str += this.List[last-i].Letter;
				}
			}
			console.log("Future letters = '"+str+"'");
		}
		return counts;
	}	
}

let NewDeck = new Deck(StandardLetterFreq);

// TODO: support multiple decks or User modifiers from Star cards?
function BuildDeck()
{
	NewDeck.Rebuild();
}

function removeDeckByIndex(index)
{
	TheDeck.splice(index,1);
}

function GetTileCounts()
{
	return NewDeck.GetTileCounts();
}