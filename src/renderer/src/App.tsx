import Button from '@mui/material/Button'
import { useHomeStore } from './stores'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
function App(): React.JSX.Element {
  const { createRepDlg, toggleCreateRepDlg } = useHomeStore()
  return (
    <div>
      <div>
        <Button
          onClick={() => {
            toggleCreateRepDlg()
          }}
        >
          Create New Repository
        </Button>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div></div>
      <Dialog onClose={toggleCreateRepDlg} open={createRepDlg}>
        <DialogTitle>Create New Repository</DialogTitle>
        <DialogContent>
          <form>
            
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
