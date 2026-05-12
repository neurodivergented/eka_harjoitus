const shuffleButton = document.querySelector('.shuffleButton');

shuffleButton.addEventListener('click', () => {
    const cardRows = document.querySelectorAll('.card-row');
    cardRows.forEach(row => {
        const cards = Array.from(row.children);
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        row.innerHTML = '';
        cards.forEach(card => row.appendChild(card));
    });
    
    // Reset selection and swap history, then reattach listeners
    selectedCard = null;
    lastSwappedCards = null;
    addCardClickListeners();
});

const moveCountElement = document.querySelector('.move-count');
let moveCount = 0;

// Card swap functionality
let selectedCard = null;
let lastSwappedCards = null; // Track the two cards from the previous swap

function getCardColor(cardSrc) {
    // Extract suit from src path and return 'black' or 'red'
    if (cardSrc.includes('Clubs') || cardSrc.includes('Spades')) {
        return 'black';
    } else if (cardSrc.includes('Diamonds') || cardSrc.includes('Hearts')) {
        return 'red';
    }
    return null;
}

function addCardClickListeners() {
    const allCards = document.querySelectorAll('.card-row img');
    allCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            if (!selectedCard) {
                // Check if this card was just used in the last swap
                if (lastSwappedCards && (card === lastSwappedCards[0] || card === lastSwappedCards[1])) {
                    return; // Prevent selecting a card that was just swapped
                }
                
                // First card clicked
                selectedCard = card;
                card.style.opacity = '0.5';
                card.style.border = '3px solid yellow';
                
                // Disable cards of the same color
                const selectedColor = getCardColor(card.src);
                allCards.forEach(c => {
                    const cardColor = getCardColor(c.src);
                    
                    // Disable same color cards
                    if (c !== card && cardColor === selectedColor) {
                        c.style.opacity = '0.3';
                        c.style.pointerEvents = 'none';
                    }
                });
            } else if (selectedCard === card) {
                // Same card clicked again, deselect
                card.style.opacity = '1';
                card.style.border = 'none';
                
                // Re-enable all cards
                allCards.forEach(c => {
                    c.style.opacity = '1';
                    c.style.pointerEvents = 'auto';
                });
                selectedCard = null;
            } else {
                // Check if second card is opposite color to first card
                const firstCardColor = getCardColor(selectedCard.src);
                const secondCardColor = getCardColor(card.src);
                
                if (firstCardColor === secondCardColor) {
                    // Same color, invalid move, deselect and show error
                    selectedCard.style.opacity = '1';
                    selectedCard.style.border = 'none';
                    
                    allCards.forEach(c => {
                        c.style.opacity = '1';
                        c.style.pointerEvents = 'auto';
                    });
                    
                    selectedCard = null;
                    return;
                }
                
                // Second card clicked and is valid, swap them
                const temp = selectedCard.src;
                selectedCard.src = card.src;
                card.src = temp;
                
                // Store these two cards as the last swapped pair
                lastSwappedCards = [selectedCard, card];
                
                // Reset styling
                selectedCard.style.opacity = '1';
                selectedCard.style.border = 'none';
                card.style.opacity = '1';
                
                // Re-enable all cards
                allCards.forEach(c => {
                    c.style.opacity = '1';
                    c.style.pointerEvents = 'auto';
                    c.style.border = 'none';
                });
                
                // Increment move counter
                moveCount++;
                moveCountElement.textContent = moveCount;
                
                selectedCard = null;
            }
        });
    });
}

// Initial setup
addCardClickListeners();
