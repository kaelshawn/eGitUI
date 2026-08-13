import { Col, Grid, Row } from 'rsuite'

function Repo(): React.JSX.Element {
  return (
    <Grid fluid className="w-full">
      <Row className="w-full">
        <Col span={4}>test</Col>
        <Col span={20}>aa</Col>
      </Row>
    </Grid>
  )
}

export default Repo
