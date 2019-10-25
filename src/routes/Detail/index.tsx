import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { Card } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import NavHeader from '../../components/NavHeader';
import { Lesson } from '../../store/reducers/home';
import { getLesson } from '../../api/detail';
import './index.less';
interface State {
    lesson: Lesson
}
interface IParams {
    id: string
}
type RouteProps = RouteComponentProps<IParams>;
type Props = RouteProps & {
    children?: ReactNode
}
class Detail extends React.Component<Props, State> {
    state = { lesson: { video: '', title: '', price: '' } }
    async componentDidMount() {
        let lesson = this.props.location.state;
        if (!lesson) {
            let id = this.props.match.params.id;
            let result: any = await getLesson(id);
            lesson = result.data;
        }
        this.setState({ lesson });
    }
    render() {
        let { lesson } = this.state;
        return (
            <>
                <NavHeader history={this.props.history}>课程详情</NavHeader>
                <Card
                    hoverable
                    style={{ width: '100%' }}
                    cover={<video src={lesson.video} controls autoPlay={false} />}
                >
                    <Card.Meta title={lesson.title} description={<span>价格:${lesson.price}</span>} />
                </Card>
            </>
        )
    }
}

export default connect(

)(Detail);