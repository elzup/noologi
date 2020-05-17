import { Button, Typography } from '@material-ui/core'
import React from 'react'
import styled from 'styled-components'
import { drawCard, resetMountCards } from '../../service/firebase'
import { Room, CardTool } from '../../types'
import CreateToolForm from './CreateToolForm'

const Style = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  width: 100%;
  overflow: hidden;
  > div {
    img {
      width: 100%;
    }
  }
`

type Props = {
  roomId: string
  room: Room
  playerId: string
}

function CardArea({
  room,
  roomId,
  playerId,
  tool,
  toolId,
}: Props & { tool: CardTool; toolId: string }) {
  return (
    <div>
      <Typography variant="subtitle1">
        山札: {Object.values(tool.mountCards).length}枚
      </Typography>
      <img src="/img/card.svg" />
      <div>
        <Button
          disabled={Object.values(tool.mountCards).length === 0}
          onClick={() => drawCard(room, roomId, playerId, toolId)}
        >
          カードを引く
        </Button>
        <Button onClick={() => resetMountCards(roomId, Number(toolId))}>
          カードを集める
        </Button>
      </div>
    </div>
  )
}

function StageArea(props: Props) {
  const { room, roomId } = props

  return (
    <Style>
      {Object.entries(room.tools).map(([toolId, tool]) => {
        switch (tool.tooltype) {
          case 'card': {
            return (
              <CardArea key={toolId} {...props} tool={tool} toolId={toolId} />
            )
          }
          default: {
            return <p>実装中</p>
          }
        }
      })}
      <CreateToolForm roomId={roomId} />
    </Style>
  )
}
export default StageArea
