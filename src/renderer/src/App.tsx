import { useHomeStore } from './stores'
import { Button, ModalDialog } from 'rsuite'

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
    </div>
  )
}

export default App
