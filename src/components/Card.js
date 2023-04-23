import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import './Card.css';

const Card = ({ name, id, image, flipCard, unflippedCards, disabledCards  }) => {

  const [isFlipped, setIsFlipped] = useState(false);
  const [clickable, setClickable] = useState(true);

  /**Cada vez que se modifique unflippedCards, entrará al useEffect */
  useEffect(() => {
    if(unflippedCards.includes(id)){
      /**Doy 1 seg para que se den vuelta en caso de que no haya match */
      setTimeout(() => {
        setIsFlipped(false);
      }, "700");
      
    }
  }, [unflippedCards, id])

  useEffect(() =>{
    if(disabledCards.includes(id)){
      setClickable(false)
    }
  }, [disabledCards, id])

  const handleClick = e => {
    const valueFlipCard = flipCard(name, id);

    /**Evito que se clickee 2 veces la misma card */
    if(valueFlipCard !== 0){
      setIsFlipped(!isFlipped);
    }
    
  }

  return (
    <div className='game-card col-2 mt-4'>
      <ReactCardFlip isFlipped={isFlipped} >
        <div className='game-card__back' onClick={clickable ? handleClick: null}>?</div>
        <div className='game-card__front overflow-hidden' onClick={clickable ? handleClick : null}>
          <img
            className='game-card__img--cover' 
            alt={name}
            src={image} />
        </div>
      </ReactCardFlip>
    </div>
  )
}

export default Card
