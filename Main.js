// Main.js for Word Tiles Game

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('game-container');
    container.innerHTML = '<p>Welcome to Word Tiles! Game logic coming soon.</p>';
});

let SoundBank =
{
	Blank	:{ File:'Audio/PlayBlank.wav',Sound:null,Volume:0.8 },
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

function TestSound()
{
    PlayAudio('Blank');
}
