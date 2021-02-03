import React, {useState, useEffect, useRef} from "react";
import Card from "./Card";
import axios from "axios";

const base_url = "http://deckofcardsapi.com/api/deck";

function Deck() {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [auto, setAuto] = useState(false);
    const timer = useRef();
  
    useEffect(() => {
      async function getDeck() {
        let deck = await axios.get(`${base_url}/new/shuffle/`);
        setDeck(deck.data);
      }
      getDeck();
    }, [setDeck]);
  
    useEffect(() => {
      // Draw a card from the API
      async function getCard() {
        let deckId = deck.deck_id;
  
        try {
          let res = await axios.get(`${base_url}/${deckId}/draw/`);
  
          if (res.data.remaining === 0) {
            setAuto(false);
            alert("No more cards :(");
            return
          }
  
          const card = res.data.cards[0];
  
          setCards(cards => [...cards,
            {
              id: card.code,
              image: card.image
            }
          ]);
        } catch (err){
          // API may respond with unneccessary errors,
          // but just in case load them in console
          console.log(err);
        }
      }
  
      // Get a card every second if auto is toggled on
      if (auto) {
        timer.current = setInterval(async () => {
          await getCard();
        }, 1000);
      }
  
      return () => clearInterval(timer.current);
    }, [setAuto, deck, auto]);
  
    const toggleAuto = () => {
      setAuto(auto => !auto);
    };
  
    let drawnCards = cards.map(c => (
      <Card key={c.id} image={c.image} />
    ));
  
    return (
      <div>
        <h1>Deck of Cards</h1>
        {deck ? (
          <button onClick={toggleAuto}>
            {auto ? "Stop drawing" : "Start drawing"}
          </button>
        ) : null}
        <div>{drawnCards}</div>
      </div>
    );
  }
  
  export default Deck;