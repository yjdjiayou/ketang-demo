import React from 'react';
import { connect } from 'react-redux';
import { TypeRootState } from '../../store/reducers';
import { TypeHome } from '../../store/reducers/home';
import actions from '../../store/actions/home';
import { RouteComponentProps } from 'react-router';
import HomeHeader from './HomeHeader';
import HomeSliders from './HomeSliders';
import LessonLists from './LessonLists';
import { loadMore, downRefresh } from '../../utils';
import './index.less';

interface State {

}
// 组件可能有四个属性来源
// 1.mapStateToProps 的返回值
// 2.actions 对象类型
// 3.来自路由
// 4.用户传入进来的其它属性
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof actions;
interface IParams { }
type RouteProps = RouteComponentProps<IParams>;
type Props = StateProps & DispatchProps & RouteProps & {
    children?: any
}
class Home extends React.Component<Props, State> {
    homeContainerRef: any;
    lessonListRef: any;
    constructor(props: Props) {
        super(props);
        this.homeContainerRef = React.createRef();
        this.lessonListRef = React.createRef();
    }
    componentDidMount() {
        loadMore(this.homeContainerRef.current, this.props.getLessons);
        downRefresh(this.homeContainerRef.current, this.props.refreshLessons);
        //this.homeContainerRef.current.addEventListener('scroll', () => this.lessonListRef.current.forceUpdate());
    }
    render() {
        return (
            <>
                <HomeHeader
                    refreshLessons={this.props.refreshLessons}
                    setCurrentCategory={this.props.setCurrentCategory}
                    currentCategory={this.props.currentCategory} />
                <div className="home-container" ref={this.homeContainerRef}>
                    <HomeSliders
                        sliders={this.props.sliders}
                        getSliders={this.props.getSliders}
                    />
                    <LessonLists
                        currentCategory={this.props.currentCategory}
                        ref={this.lessonListRef}
                        homeContainerRef={this.homeContainerRef}
                        lessons={this.props.lessons}
                        getLessons={this.props.getLessons}
                    />
                </div>
            </>
        )
    }
}
let mapStateToProps = (state: TypeRootState): TypeHome => state.home;
export default connect(
    mapStateToProps,
    actions
)(Home);