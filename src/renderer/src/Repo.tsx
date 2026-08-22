import { Col, Grid, Input, InputGroup, Row, Stack, Tree } from 'rsuite'
import CollaspedArrowIcon from '@rsuite/icons/CollaspedArrow'
import BranchIcon from '@rsuite/icons/Branch'
import GlobalIcon from '@rsuite/icons/Global'
import SearchIcon from '@rsuite/icons/Search'
import classes from './styles/repo.module.scss'
import classNames from 'classnames'

const TreeNode = ({ children, ...rest }: { children: React.ReactNode }): React.ReactNode => {
  return (
    <div {...rest} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {children}
    </div>
  )
}

function Repo(): React.JSX.Element {
  const data = [
    {
      label: 'Branches',
      value: 'Branches',
      icon: <BranchIcon />,
      children: [
        {
          label: 'master',
          value: 'master',
          icon: <BranchIcon />
        }
      ]
    }
  ]
  return (
    <Grid fluid className="w-full min-w-400 h-lvh p-2">
      <Row className="w-full" alignItems="start">
        <Col span={4}>
          <Stack spacing={2}>
            <CollaspedArrowIcon />
            <BranchIcon></BranchIcon>
            <GlobalIcon></GlobalIcon>
          </Stack>
          <InputGroup>
            <Input />
            <InputGroup.Addon>
              <SearchIcon />
            </InputGroup.Addon>
          </InputGroup>
          <Tree
            data={data}
            defaultExpandAll
            renderTreeNode={(treeNode) => {
              return (
                <TreeNode>
                  {treeNode.icon ? treeNode.icon : <GlobalIcon />}
                  {treeNode.label}
                </TreeNode>
              )
            }}
            renderTreeIcon={(treeNode, expanded) => {
              if (treeNode.children) {
                return expanded ? <CollaspedArrowIcon /> : <CollaspedArrowIcon />
              }
              return null
            }}
          />
        </Col>
        <Col span={20}>
          <div className="flex items-center gap-2 mb-2">
            <div>
              <div className={classNames(classes['commit-dot'])}></div>
            </div>
            <div>
              <span className="commit-message">Initial commit</span>
              <span className="commit-author">John Doe</span>
              <span className="commit-date">2023-06-01</span>
              <span className="commit-hash">a1b2c3d</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div>
              <div className={classNames(classes['commit-dot'])}></div>
            </div>
            <div>
              <span className="commit-message">Initial commit</span>
              <span className="commit-author">John Doe</span>
              <span className="commit-date">2023-06-01</span>
              <span className="commit-hash">a1b2c3d</span>
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  )
}

export default Repo
