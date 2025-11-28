const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas()
{
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function animate()
{
	// Example animation: moving dots
	ctx.fillStyle = 'rgba(120, 64, 120, 0.1)';
	//ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	if (Math.random() < 0.75)
	{
		// Draw something here
		const x = Math.random() * canvas.width;
		const y = Math.random() * canvas.height;
		const r = Math.floor(Math.random() * 64);
		const g = 32;
		const b = 64;
		ctx.fillStyle = `rgba(${r},${g},${b},0.33)`;
		ctx.beginPath();
		ctx.arc(x, y, 48, 0, Math.PI * 2);
		ctx.fill();
	}
	
	requestAnimationFrame(animate);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animate();
