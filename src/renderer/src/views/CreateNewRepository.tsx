import { useCreateRepStore } from '@renderer/stores/createRepStore'
import React from 'react'
import {
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormInstance,
  Input,
  InputPicker,
  Message,
  Panel,
  Radio,
  RadioGroup,
  Tag
} from 'rsuite'
import { useShallow } from 'zustand/react/shallow'

export default function CreateNewRepository(): React.JSX.Element {
  const {
    hasGit,
    selectedPath,
    createReadme,
    repoType,
    initialCommitMessage,
    creating,
    status,
    recentDirs,
    onBrowse,
    onCreate,
    checkDirectory
  } = useCreateRepStore(
    useShallow((state) => ({
      ...state
    }))
  )
  const formRef = React.useRef<FormInstance>(null)

  function resetForm(): void {
    useCreateRepStore.setState(useCreateRepStore.getInitialState())
    formRef.current?.reset()
  }

  const statusType =
    status.includes('Failed') || status.includes('Error') ? 'error' : hasGit ? 'success' : 'info'
  const pickerData = recentDirs.map((dir) => ({ label: dir, value: dir }))

  return (
    <Panel bordered>
      <h3>Create new repository</h3>
      <span>{selectedPath}</span>
      <Form
        fluid
        formValue={{ selectedPath, createReadme, repoType, initialCommitMessage }}
        ref={formRef}
      >
        <FormGroup style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Form.Label style={{ minWidth: 90 }}>Directory</Form.Label>
          <Form.Control
            name="selectedPath"
            accepter={() => (
              <InputPicker
                style={{ flex: 1 }}
                placeholder="Choose recent or browse"
                data={pickerData}
                onChange={(value) => {
                  const path = value as string
                  useCreateRepStore.setState({ selectedPath: path })
                  checkDirectory(path)
                }}
                searchable
                cleanable={false}
                value={selectedPath}
              />
            )}
            style={{ flex: 1 }}
            readOnly
          ></Form.Control>

          <Button onClick={onBrowse} appearance="default">
            Browse...
          </Button>
        </FormGroup>

        <FormGroup>
          <Form.Label>Repository type</Form.Label>
          <RadioGroup
            name="repoType"
            value={repoType}
            onChange={(value) =>
              useCreateRepStore.setState({ repoType: value as 'personal' | 'central' })
            }
            inline
          >
            <Radio value="personal">Personal repository</Radio>
            <Radio value="central">Central repository (bare)</Radio>
          </RadioGroup>
        </FormGroup>

        <FormGroup>
          <Checkbox
            checked={createReadme}
            onChange={(_, checked) => useCreateRepStore.setState({ createReadme: checked })}
          >
            Create README and initial commit
          </Checkbox>
        </FormGroup>

        {createReadme && (
          <FormGroup>
            <Form.Label>Initial commit message</Form.Label>
            <Input
              value={initialCommitMessage}
              onChange={(value) =>
                useCreateRepStore.setState({ initialCommitMessage: value as string })
              }
              placeholder="Initial commit"
            />
          </FormGroup>
        )}

        <FormGroup style={{ display: 'flex', gap: 8 }}>
          <Button appearance="primary" onClick={onCreate} disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
          <Button appearance="subtle" onClick={resetForm}>
            Reset
          </Button>
        </FormGroup>

        <FormGroup>
          <Form.Label>Status</Form.Label>
          <div style={{ marginTop: 8 }}>
            {status ? (
              <Message type={statusType} showIcon>
                {status}
              </Message>
            ) : (
              <Tag color="blue">No actions yet</Tag>
            )}
          </div>
        </FormGroup>

        {hasGit !== null && (
          <FormGroup>
            <strong>Has git:</strong> {hasGit ? 'Yes' : 'No'}
          </FormGroup>
        )}
      </Form>
    </Panel>
  )
}
