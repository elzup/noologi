import { Button, Typography } from '@material-ui/core'
import _ from 'lodash'
import styled from 'styled-components'
import { Player } from '../../types'

const Style = styled.div`
  border: solid #ccc;
  border-radius: 4px;
  margin-top: 8px;
  padding: 4px;
  .cards-box {
    display: grid;
    position: relative;
    margin: 0 8px;
    gap: 2px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .card {
    border: blue solid 2px;
    background: gray;
    color: white;
    height: 2rem;
    text-align: center;
    border-radius: 4px;
    padding-top: 1rem;
    box-shadow: 0 0 0 4px white inset;

    &[data-open='true'] {
      border-color: green;
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
      box-shadow: none;
    }
    @media screen and (max-width: 600px) {
      .cards-box {
        grid-template-columns: repeat(4, 1fr);
      }
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
        {_.map(player.tools, (playerTool) => {
          switch (playerTool.tooltype) {
            case 'card':
              return _.map(playerTool.cards, (card) => (
                <div className="card" data-open={card.open}>
                  {card.open ? card.text : '?'}
                </div>
              ))

            default:
              return null
          }
        })}
      </div>
    </Style>
  )
}

export function MyPlayerBox({
  player,
  openCard,
}: Props & { openCard: (cardId: string, toolId: string) => void }) {
  return (
    <Style data-owner>
      <Typography>{player.name}</Typography>
      <div className="cards-box">
        {_.map(player.tools, (playerTool, toolId) => {
          switch (playerTool.tooltype) {
            case 'card':
              return _.map(playerTool.cards, (card, cardId) => (
                <div>
                  <div className="card" data-open={card.open}>
                    {card.text}
                  </div>
                  {!card.open && (
                    <Button onClick={() => openCard(cardId, toolId)}>
                      見せる
                    </Button>
                  )}
                </div>
              ))

            default:
              return null
          }
        })}
      </div>
    </Style>
  )
}

export default PlayerBox
