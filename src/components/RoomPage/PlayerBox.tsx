import styled from 'styled-components'
import _ from 'lodash'
import { Typography, Button } from '@material-ui/core'
import { Player } from '../../types'

const Style = styled.div`
  border: solid #ccc;
  border-radius: 4px;
  margin-top: 8px;
  .cards-box {
    display: grid;
    position: relative;
    margin: 0 8px;
    gap: 2px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .card {
    border: black solid 1px;
    background: gray;
    color: white;
    height: 2rem;
    text-align: center;
    border-radius: 4px;
    padding-top: 1rem;
    &[data-open='true'] {
      background: white;
      color: black;
    }
  }
  &[data-owner] {
    .cards-box {
      grid-template-columns: repeat(8, 1fr);
    }
    .card {
      height: 4rem;
      padding-top: 2rem;
      font-size: 2rem;
    }
  }
`

type Props = {
  player: Player
}
function PlayerBox({ player }: Props) {
  return (
    <Style>
      <Typography>{player.name}</Typography>
      <div className="cards-box">
        {_.map(player.cards, (card) => (
          <div className="card" data-open={card.open}>
            {card.open ? card.text : '?'}
          </div>
        ))}
      </div>
    </Style>
  )
}

export function MyPlayerBox({
  player,
  openCard,
}: Props & { openCard: (cardId: string) => void }) {
  return (
    <Style data-owner>
      <Typography>{player.name}</Typography>
      <div className="cards-box">
        {_.map(player.cards, (card, cardId) => (
          <div>
            <div className="card" data-open>
              {card.text}
            </div>
            {!card.open && (
              <Button onClick={() => openCard(cardId)}>見せる</Button>
            )}
          </div>
        ))}
      </div>
    </Style>
  )
}

export default PlayerBox
