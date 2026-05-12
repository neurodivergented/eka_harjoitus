const shuffleButton = document.querySelector('.shuffleButton');

const suitOrder = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];
let selectedCard = null;
let requiredFirstSuit = null;
let previousFirstSuit = null;
let isFirstSwap = true;

const moveCountElement = document.querySelector('.move-count');
let moveCount = 0;

shuffleButton.addEventListener('click', () => {
    const allCards = getGridCards();
    for (let i = allCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempSrc = allCards[i].src;
        allCards[i].src = allCards[j].src;
        allCards[j].src = tempSrc;
    }

    selectedCard = null;
    requiredFirstSuit = null;
    previousFirstSuit = null;
    isFirstSwap = true;
    moveCount = 0;
    moveCountElement.textContent = moveCount;
    updateCardAvailability();
});

function getCardColor(cardSrc) {
    if (cardSrc.includes('Clubs') || cardSrc.includes('Spades')) {
        return 'black';
    } else if (cardSrc.includes('Diamonds') || cardSrc.includes('Hearts')) {
        return 'red';
    }
    return null;
}

function getCardSuit(cardSrc) {
    if (cardSrc.includes('Clubs')) return 'Clubs';
    if (cardSrc.includes('Spades')) return 'Spades';
    if (cardSrc.includes('Diamonds')) return 'Diamonds';
    if (cardSrc.includes('Hearts')) return 'Hearts';
    return null;
}

function getColorForSuit(suit) {
    return suit === 'Clubs' || suit === 'Spades' ? 'black' : 'red';
}

function getAllowedSecondSuits(firstSuit) {
    const firstColor = getColorForSuit(firstSuit);
    return suitOrder.filter(suit => getColorForSuit(suit) !== firstColor && (isFirstSwap || suit !== previousFirstSuit));
}

function getGridCards() {
    return Array.from(document.querySelectorAll('.clean-cards img'));
}

function getCardGridIndex(card) {
    const gridCards = getGridCards();
    return gridCards.indexOf(card);
}

function isAdjacent(cardA, cardB) {
    const indexA = getCardGridIndex(cardA);
    const indexB = getCardGridIndex(cardB);
    if (indexA < 0 || indexB < 0) {
        return false;
    }

    if (Math.abs(indexA - indexB) === 1 && Math.floor(indexA / 6) === Math.floor(indexB / 6)) {
        return true;
    }

    if (Math.abs(indexA - indexB) === 6) {
        return true;
    }

    return false;
}

function updateCardAvailability() {
    const allCards = getGridCards();
    allCards.forEach(card => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
    });

    if (!selectedCard && requiredFirstSuit) {
        allCards.forEach(card => {
            if (getCardSuit(card.src) !== requiredFirstSuit) {
                card.style.opacity = '0.3';
                card.style.pointerEvents = 'none';
            }
        });
    }

    if (selectedCard) {
        const firstSuit = getCardSuit(selectedCard.src);
        const allowedSuits = getAllowedSecondSuits(firstSuit);
        const needsAdjacency = !isFirstSwap;

        allCards.forEach(card => {
            if (card === selectedCard) {
                return;
            }
            const cardSuit = getCardSuit(card.src);
            if (
                getCardColor(card.src) !== getCardColor(selectedCard.src) ||
                !allowedSuits.includes(cardSuit) ||
                (needsAdjacency && !isAdjacent(selectedCard, card))
            ) {
                card.style.opacity = '0.3';
                card.style.pointerEvents = 'none';
            }
        });
    }
}

function addCardClickListeners() {
    const allCards = getGridCards();
    allCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const cardSuit = getCardSuit(card.src);

            if (!selectedCard) {
                if (requiredFirstSuit && cardSuit !== requiredFirstSuit) {
                    return;
                }

                selectedCard = card;
                card.style.opacity = '0.5';
                card.style.border = '3px solid yellow';
                updateCardAvailability();
            } else if (selectedCard === card) {
                card.style.opacity = '1';
                card.style.border = 'none';
                selectedCard = null;
                updateCardAvailability();
            } else {
                const firstCardSuit = getCardSuit(selectedCard.src);
                const secondCardSuit = getCardSuit(card.src);
                const firstCardColor = getCardColor(selectedCard.src);
                const secondCardColor = getCardColor(card.src);
                const allowedSuits = getAllowedSecondSuits(firstCardSuit);

                const needsAdjacency = !isFirstSwap;
                if (
                    firstCardSuit === secondCardSuit ||
                    firstCardColor === secondCardColor ||
                    !allowedSuits.includes(secondCardSuit) ||
                    (needsAdjacency && !isAdjacent(selectedCard, card))
                ) {
                    selectedCard.style.opacity = '1';
                    selectedCard.style.border = 'none';
                    selectedCard = null;
                    updateCardAvailability();
                    return;
                }

                const temp = selectedCard.src;
                selectedCard.src = card.src;
                card.src = temp;

                previousFirstSuit = firstCardSuit;
                requiredFirstSuit = secondCardSuit;
                isFirstSwap = false;

                selectedCard.style.opacity = '1';
                selectedCard.style.border = 'none';
                card.style.opacity = '1';

                allCards.forEach(c => {
                    c.style.border = 'none';
                });

                moveCount++;
                moveCountElement.textContent = moveCount;

                selectedCard = null;
                updateCardAvailability();
            }
        });
    });

    updateCardAvailability();
}

addCardClickListeners();
