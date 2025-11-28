
let currentWord = '';
const wordDisplay = document.querySelector('.word-display');
const tilesContainer = document.querySelector('.tiles');
const wordsList = document.getElementById('words');

// Handle the space between the letter tiles
tilesContainer.addEventListener('contextmenu', function(event) {
	event.preventDefault(); // Prevent the default context menu from appearing
	ClearWord();
});

const Dict = document.getElementById('dict');
const WordCount = Dictionary.size;
Dict.innerHTML = 'Dictionary ('+WordCount+')';

function RebuildWord()
{
	currentWord = NewGetWord();
}

function DetectLost()
{
	// Slowly go through all letter combinations?
	// If no possible words are left...
	// Show SURRENDER button
	let lost = false;
	for (let i=0; i<26; i++)
	{
		let first = 'A'; // first letter
		// Sort by frequency
		// SetTimeout();
		// GetAllWords(A...)
		// Check if possible
	}
	if (lost)
	{
		// Show SURRENDER button
	}
}

// Event when letter add/remove or word cleared
function UpdateWordDisplay()
{
	RebuildWord();
	
	DetectLost();
	
	wordDisplay.textContent = currentWord;
	const isValid = Dictionary.has(currentWord);
	if (GamePaused || currentWord.length == 0)
	{
		wordDisplay.style.border = '3px solid #0f0f0f';
	}
	else if (isValid)
	{
		wordDisplay.style.border = '3px solid #00FF00';
	}
	else
	{
		wordDisplay.style.border = '3px solid #FF0000';
	}
	
	OnWordChanged(currentWord);
	
	UpdateScorebox(currentWord,isValid);
	TryUpdateWildcards();
}

function TryUpdateWildcards()
{
	// TODO: traverse active cards instead of rebuild?
	if (UseNewWildcards)
	{
		UpdateWildcards();
	}
	else
	{
		RebuildWildcards();
	}
}

function ClearWord()
{
	currentWord = '';
	NewClearUsed();
	UpdateWordDisplay();
}

// The alphabet shown for letter bag details.
function BuildAlphabet(container)
{
	container.innerHTML = '';
	for (let ch of "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	{
		let e = document.createElement('div');
		e.className = "alpha-tile";
		e.innerHTML = ch;
		e.addEventListener('click', () => {	HideAlpha(); ForgeWildTile(ch); PlayAudioBlank(); });
		container.appendChild(e);
	}		
}

// Show the Alphabet selector for resolving Blank tiles
function ToggleAlphabet()
{
	let alpha = UI.Alphabet;
	let vis = alpha.style.opacity > 0;
	alpha.style.opacity = vis ? 0:1;
	alpha.style.display = vis ? 'none':'flex';
	if (!vis)
	{
		BuildAlphabet(alpha);
	}		
}

function IsAlphabetVisible()
{
	return (UI.Alphabet.style.opacity > 0);
}