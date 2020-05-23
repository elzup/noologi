import {
  Box,
  Button,
  Modal,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import React, { useState } from 'react'
import { addMemoTool } from '../../service/memoService'
import CreateCardForm from './CreateCardForm'

type TabPanelProps = {
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

type Props = { roomId: string }
function CreateToolForm({ roomId }: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [tab, setTab] = useState<number>(0)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>ツール追加</Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Paper>
          <Typography variant="h4">ツールの追加</Typography>
          <Tabs value={tab} onChange={(e, nv: number) => setTab(nv)}>
            <Tab label="カード" />
            <Tab label="メモ" />
            <Tab label="ダイス" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <CreateCardForm roomId={roomId} finishForm={() => setOpen(false)} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Button onClick={() => addMemoTool()} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            comming soon
          </TabPanel>
        </Paper>
      </Modal>
    </div>
  )
}
export default CreateToolForm
