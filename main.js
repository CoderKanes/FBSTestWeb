// LottoBall Web Component
class LottoBall extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const number = this.getAttribute('number') || '0';
    const color = this.getBallColor(parseInt(number));
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${color};
          color: white;
          font-weight: 700;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            inset -5px -5px 15px rgba(0,0,0,0.2),
            0 10px 20px rgba(0,0,0,0.1);
          animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          user-select: none;
        }

        @keyframes pop-in {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      </style>
      <span>${number}</span>
    `;
  }

  getBallColor(num) {
    if (num <= 10) return 'oklch(70% 0.2 60)'; // Yellow/Orange
    if (num <= 20) return 'oklch(60% 0.2 240)'; // Blue
    if (num <= 30) return 'oklch(60% 0.2 20)';  // Red
    if (num <= 40) return 'oklch(60% 0.1 200)'; // Gray/Indigo
    return 'oklch(65% 0.2 140)';               // Green
  }
}

customElements.define('lotto-ball', LottoBall);

// App Logic
const ballContainer = document.getElementById('ball-container');
const generateBtn = document.getElementById('generate-btn');

function generateLottoNumbers() {
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNum = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNum);
  }
  return Array.from(numbers).sort((a, b) => a - b);
}

function updateUI() {
  if (generateBtn.disabled) return;
  
  const numbers = generateLottoNumbers();
  
  // Disable button during animation
  generateBtn.disabled = true;
  generateBtn.style.opacity = '0.5';
  generateBtn.style.cursor = 'not-allowed';
  
  // Clear container
  ballContainer.innerHTML = '';
  
  // Add new balls with a slight delay for effect
  numbers.forEach((num, index) => {
    setTimeout(() => {
      const ball = document.createElement('lotto-ball');
      ball.setAttribute('number', num);
      ballContainer.appendChild(ball);
      
      // Re-enable button after last ball is added
      if (index === numbers.length - 1) {
        setTimeout(() => {
          generateBtn.disabled = false;
          generateBtn.style.opacity = '1';
          generateBtn.style.cursor = 'pointer';
        }, 300); // Wait for the last ball's pop-in animation
      }
    }, index * 100);
  });
}

generateBtn.addEventListener('click', updateUI);
