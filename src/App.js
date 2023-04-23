import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';
import axios from 'axios';
import GameOver from './img/ryu-ending.gif';

function App() {

  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState({});
  const [secondCard, setSecondCard] = useState({});

  /**Almacenará los IDs de las cards que deben volver a darse vuelta */
  const [unflippedCards, setUnflippedCards] = useState([]);

  /**Almacenará los IDs de las cards que tras hacer match, ya no podrán ser clickeadas */
  const [disabledCards, setDisabledCards] = useState([]);

  const [playerOne, setPlayerOne] = useState(
    window.localStorage.getItem('playerOne')
  );

  const [points, setPoints] = useState(0);
  const [bads, setBads] = useState(0);
  const [endGame, setEndGame] = useState(false);

  /**Function patrocinada por stackoverflow :D */
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
  }

  /**Al iniciar consumo la API y extraigo sólo la data que necesito */
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=9',
      );

      const animals = result.data['entries'].map( data  => (
        {
          src:  data.fields.image.url,
          name: data.meta.name
        }
      ));

      /**Agrego 2 veces el array y lo revuelvo */
      return setCards(shuffleArray([...animals, ...animals]));
    };

    fetchData();
  }, []);

  /**Al tener 2 cards dadas vueltas, ejecuto el useEffect que verifica si hay match */
  useEffect(() => {
    isMatch();
  }, [secondCard]);

  const flipCard = (name, id) => {
    /**No permito que se voltee la misma carta 2 veces */
    if(firstCard.name === name && firstCard.id === id){
      return 0;
    }

    /**Si mi primera carta está vacía, la seteo. Lo mismo para la segunda card */
    if(!firstCard.name){
      setFirstCard({name, id});
    } else if (!secondCard.name){
      setSecondCard({name, id});
    }

    return 1;
  };

  const isMatch = () => {
    /**Valido si se seleccionaron 2 cards */
    if(firstCard.name && secondCard.name){
      /**Si hacen match, las deshabilito, sino las volteo */
      if(firstCard.name === secondCard.name){
        setPoints(points + 1);
        disableCards();
      } else {
        setBads(bads + 1);
        unflipCards();
      }
    }

    /**El juego se termina al obtener 9 puntos */
    if (points === 9) setEndGame(true);
  };

  const disableCards = () => {
    setDisabledCards([firstCard.id, secondCard.id]);
    resetCards();
  };

  const unflipCards = () => {
    setUnflippedCards([firstCard.id, secondCard.id]);
    resetCards();
  };

  const resetCards = () => {
    setFirstCard({});
    setSecondCard({});
  };

  const sendPlayerName = (e) => {
    e.preventDefault();

    setPlayerOne(e.target.playerOne.value);
    window.localStorage.setItem('playerOne', e.target.playerOne.value);
  };

  return (
    <div className='app container mt-5'>
      <form className={`form-register-name row d-flex justify-content-center  ${playerOne ? 'd-none' : ''}`} onSubmit={sendPlayerName}>
        <h1 className='text-center'>¿Primera vez por aquí? Dime tu nombre</h1>
        <div className="col-md-4">
          <input 
            type="text" 
            placeholder="Ingresa tu nombre por favor" 
            className="form-control" 
            name="playerOne"></input>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary form-register-name__btn-start--purple">¡Comenzar!</button>
        </div>
      </form>
      <div className={`score p-5 row text-center ${!playerOne ? 'd-none' : ''}`}>
        <h2>Bienvenido: {playerOne}</h2>
        <h2>Puntaje</h2>
        <div className="col-md-6">
          <h3>Buenas: {points}</h3>
        </div>
        <div className="col-md-6">
          <h3>Malas: {bads}</h3>
        </div>
        <div className={`game-over text-center ${!endGame ? 'd-none' : ''}`}>
          <h2>GAME OVER</h2>
          <img 
            className='img-fluid' 
            src={GameOver} 
            alt='Game Over' />
        </div>
      </div>
      <div className={`board row d-flex justify-content-center ${!playerOne ? 'd-none' : ''} ${endGame ? 'd-none' : ''}` }>
        {
          cards.map((card, index) => (
            <Card 
              key={index}
              name={card.name} 
              id={index} 
              image={card.src}
              flipCard={flipCard}
              unflippedCards={unflippedCards}
              disabledCards={disabledCards} />
          ))
        }
      </div>
    </div>
  );
}

export default App;
