import React, { ReactNode } from 'react';
import { Icon, Card, Button, Alert, Skeleton } from 'antd';
import { Lessons, Lesson } from '../../../store/reducers/home';
import { Link } from 'react-router-dom';
import './index.less';
interface Props {
    children?: ReactNode;
    lessons: Lessons;
    getLessons: any;
    homeContainerRef: any;
    currentCategory: string
}
export default class LessonList extends React.Component<Props> {
    componentDidMount() {
        if (this.props.lessons.list.length == 0) {
            this.props.getLessons();
        }
    }
    render() {
        //核心要计算出起始的渲染的元素的索引 ，之前的不有渲染，只渲染起始+一页的数据，一页的数据之后也不渲染
        let start = 0;//起始的索引
        let rem = parseInt(document.documentElement.style.fontSize);//50
        //如果说current有值，则说明DOM元素已经挂载完成了
        if (this.props.homeContainerRef.current) {
            let scrollTop = this.props.homeContainerRef.current.scrollTop;
            if (scrollTop - 4.2 * rem > 0) {
                start = Math.floor((scrollTop - 4.2 * rem) / (6.5 * rem));
                console.log('start', start);

            }
        }
        return (
            <section className="lesson-list">
                <h2><Icon type="menu" />{this.props.currentCategory == 'all' ? '全部' : this.props.currentCategory}课程</h2>
                <Skeleton loading={this.props.lessons.loading && this.props.lessons.list.length == 0} active paragraph={{ rows: 8 }}>
                    {
                        this.props.lessons.list.map((lesson: Lesson, index: number) => (
                            index >= start ? <Link key={index} to={{ pathname: `/detail/${lesson._id}`, state: lesson }}>
                                <Card
                                    hoverable={true}
                                    style={{ width: '100%' }}
                                    cover={<img src={lesson.poster} />}
                                >
                                    <Card.Meta title={lesson.title}
                                        description={<span>价格:{lesson.price}</span>} />
                                </Card>
                            </Link> : <div key={index} style={{ height: `${6.5 * rem}px` }}></div>
                        ))
                    }
                </Skeleton>

                {
                    this.props.lessons.hasMore ? <Button
                        loading={this.props.lessons.loading}
                        onClick={this.props.getLessons}
                        type="dashed" style={{ width: "100%" }}>
                        {!this.props.lessons.loading && '加载更多'}
                    </Button> : <Alert style={{ textAlign: "center" }} type="warning" message="我是有底线的" />
                }

            </section>
        )
    }
}