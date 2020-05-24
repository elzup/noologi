import { Button, TextField, Typography } from '@material-ui/core'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { updateMemo } from '../../service/memoService'
import { CardTool, MemoTool, Room } from '../../types'
import { drawCard, resetMountCards } from '../../service/cardService'
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
  const mountCards = _.filter(tool.mountCards, (v) => !v.removed)

  return (
    <div>
      <Typography variant="subtitle1">
        山札: {Object.values(mountCards).length}枚
      </Typography>
      <img src="/img/card.svg" />
      <div>
        <Button
          disabled={Object.values(mountCards).length === 0}
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

function MemoArea({
  roomId,
  tool,
  toolId,
}: Props & { tool: MemoTool; toolId: string }) {
  const [draft, setDraft] = useState<string>(tool.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(tool.text)
    if (inputRef.current) inputRef.current.value = tool.text
  }, [tool.text])

  return (
    <div>
      <TextField
        ref={inputRef}
        rows={draft.split('\n').length}
        multiline
        defaultValue={tool.text}
        onChange={(e) => {
          setDraft(e.target.value)
        }}
      />
      <Button
        disabled={tool.text === draft}
        onClick={() => {
          updateMemo(roomId, toolId, draft)
        }}
      >
        保存する
      </Button>
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
          case 'memo': {
            return (
              <MemoArea key={toolId} {...props} tool={tool} toolId={toolId} />
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
