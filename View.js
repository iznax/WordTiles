
let viewWidget = null;
let LastDictionaryTab = 'B';

const viewContainer = document.querySelector('.dict-list');

let CacheWords = new Map();

function GetDictionaryWords(letter)
{
	let list = CacheWords.get(letter);
	if (list == undefined)
	{
		list = [];
		for (var it of Dictionary)
		{
			if (it[0] == letter)
			{
				list.push(it);
			}
		}
		list.sort();
		CacheWords.set(letter, list);
		let count = list.length;
		console.log("Dictionary "+letter+"-words ("+count+")");
	}
	return list;
}

class ViewDict
{
	constructor()
	{
		this.Active = false;
		this.Letter = 'Z';
		this.Container = document.querySelector('.dict-panel');
		this.Tab = document.querySelector('.dict-tab');
		this.Widget = document.querySelector('.dict-list');
	}
	NextLetter()
	{
		let ch = this.Letter;
		ch = (ch == 'Z') ? 'A' : String.fromCharCode(ch.charCodeAt(0) + 1);
		this.Letter = ch;		
	}
	Show()
	{
		this.Active = true;
		this.NextLetter();
		this.Build();
	}
	Hide()
	{
		this.Active = false;
	}
	Clear()
	{
		this.Widget.innerHTML = "";
	}
	Build()
	{
		this.Clear();
		
		let words = GetDictionaryWords(this.Letter);

		this.Tab.innerHTML = this.Letter + " ("+words.length+")";

		const popup = this.Widget;
		
		let count = words.length;
		for (let i=0; i<count; i+=4)
		{
			const row = document.createElement("div");
			row.className = "wordRow";
			for (let k=0; k<4; ++k)
			{
				if (i+k < count)
				{
					const item = document.createElement("div");
					item.className = "wordItem";
					item.textContent = words[i+k];
					row.appendChild(item);					
				}
			}
			popup.appendChild(row);
		}
	}
};

let ViewDictionary = new ViewDict();

let AZ = { Ready:false };
AZ.Panel = document.getElementById("AzPanel");
AZ.Buttons = document.getElementById("AzButtons");
AZ.WordCount = document.getElementById("AzWordCount");
AZ.Words = document.getElementById("AzWordList");

function AzShowWords(letter)
{
	AZ.Words.innerHTML = "";
	
	const words = GetDictionaryWords(letter);
	words.forEach(word => {
		const item = document.createElement("div");
		item.className = "AzWordItem";
		item.textContent = word;
		AZ.Words.appendChild(item);
		});

	AZ.WordCount.innerHTML = "Words ("+words.length+")";
		
	// Remove highlight from all buttons
	let list = AZ.Buttons.querySelectorAll('button');
	list.forEach(btn => { btn.classList.remove("AzSelected"); });

	// Highlight the selected button
	const selectedBtn = Array.from(AZ.Buttons.children).find(btn => btn.textContent === letter);
	if (selectedBtn) selectedBtn.classList.add("AzSelected");
}

function AzBuild()
{
	// Create A–Z buttons
	for (let i = 1; i <= 26; i++)
	{
	  const letter = String.fromCharCode(64+i);
	  const btn = document.createElement("button");
	  btn.textContent = letter;
	  btn.onclick = () => AzShowWords(letter);
	  AZ.Buttons.appendChild(btn);
	}
	// TODO: Create 1–8 word-size filter buttons?
}

document.getElementById("AzCloseBtn").addEventListener("click", () => {
  AZ.Panel.style.display = "none";
});

// Top-right button to toggle dictionary
function AzToggle()
{
	if (!AZ.Ready)
	{
		AZ.Ready = true;
		AzBuild();
		AzShowWords('A');
	}
	let S = AZ.Panel.style;
	S.display = (S.display === "block") ? "none" : "block";
}
