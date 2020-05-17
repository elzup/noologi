import React, { useState } from 'react'
import {
  Modal,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Container,
  Paper,
} from '@material-ui/core'

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
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

type Props = {}
function CreateToolForm(props: Props) {
  const [open, setOpen] = useState<boolean>(false)
  const [tab, setTab] = useState<number>(1)

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
            Item One
          </TabPanel>
          <TabPanel value={tab} index={1}>
            TODO
          </TabPanel>
          <TabPanel value={tab} index={1}>
            TODO
          </TabPanel>
        </Paper>
      </Modal>
    </div>
  )
}
export default CreateToolForm
