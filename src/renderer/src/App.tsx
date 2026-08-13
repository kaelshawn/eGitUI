import { useHomeStore } from './stores'
import {
  Accordion,
  Button,
  Col,
  Divider,
  Grid,
  Input,
  InputGroup,
  Modal,
  Row,
  VStack
} from 'rsuite'
import CreateNewRepository from './views/CreateNewRepository'
import { DecorativeBox } from './components/DecorativeBox'
import SearchIcon from '@rsuite/icons/Search'

function App(): React.JSX.Element {
  const { createRepDlg, toggleCreateRepDlg } = useHomeStore()

  return (
    <Grid fluid className="w-full">
      <Row className="w-full">
        <Col span={8}>
          <VStack>
            <Button appearance="primary" onClick={toggleCreateRepDlg}>
              Create New Repository
            </Button>
            <Button appearance="primary">Open Repository</Button>
            <Button appearance="primary">Clone Repository</Button>
            <Button appearance="primary">Clone Github Repository</Button>
          </VStack>
        </Col>
        <Col span={16}>
          <DecorativeBox>
            <VStack divider={<Divider />}>
              <InputGroup inside>
                <Input />
                <InputGroup.Button>
                  <SearchIcon />
                </InputGroup.Button>
              </InputGroup>
              <Accordion>
                <Accordion.Panel header="Recent Repositories" defaultExpanded></Accordion.Panel>
              </Accordion>
            </VStack>
          </DecorativeBox>
        </Col>
      </Row>

      <Modal open={createRepDlg} onClose={toggleCreateRepDlg} size="lg" backdrop="static">
        <Modal.Header>
          <Modal.Title>Create new repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateNewRepository />
        </Modal.Body>
      </Modal>
    </Grid>
  )
}

export default App
