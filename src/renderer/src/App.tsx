import { useHomeStore } from './stores'
import { Button, Modal } from 'rsuite'
import CreateNewRepository from './views/CreateNewRepository'

function App(): React.JSX.Element {
  const { createRepDlg, toggleCreateRepDlg } = useHomeStore()

  return (
    <div style={{ padding: 24 }}>
      <Button appearance="primary" onClick={toggleCreateRepDlg}>
        Create New Repository
      </Button>

      <Modal open={createRepDlg} onClose={toggleCreateRepDlg} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title>Create new repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateNewRepository />
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default App
