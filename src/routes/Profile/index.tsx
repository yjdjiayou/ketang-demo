import React from 'react';
import { connect } from 'react-redux';
import { TypeRootState } from '../../store/reducers';
import { TypeProfile } from '../../store/reducers/profile';
import actions from '../../store/actions/profile';
import { RouteComponentProps } from 'react-router';
import { Descriptions, Button, Alert, Upload, Icon, message } from 'antd';
import NavHeader from '../../components/NavHeader';
import LOGIN_TYPES from '../../typings/login-types';
import './index.less';
interface State {

}
//当前的组件有三个属性来源 
//1.mapStateToProps的返回值 2.actions对象类型 3. 来自路由 4.用户传入进来的其它属性
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof actions;
interface IParams { }
type RouteProps = RouteComponentProps<IParams>;
type Props = StateProps & DispatchProps & RouteProps & {
    children?: any
}
class Profile extends React.Component<Props, State> {
    state = { loading: false, imageUrl: '' }
    async componentDidMount() {//组件挂载完成
        await this.props.validate();
    }
    handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
        } else if (info.file.status === 'done') {
            let { code, data, error } = info.file.response;//获取到接口的响应体
            if (code === 0) {
                this.setState({
                    loading: false,
                    imageUrl: data
                }, () => this.props.changeAvatar(data));
            } else {
                message.error(error);
            }
        }
    }
    render() {
        let { user } = this.props;
        let content;//里存放着要渲染的内容 
        if (this.props.loginState === LOGIN_TYPES.UN_VALIDATE) {
            return null;
        } else if (this.props.loginState === LOGIN_TYPES.LOGINED) {
            let imageUrl = this.state.imageUrl || user.avatar;
            content = (
                <div className="user-info">
                    <Descriptions>
                        <Descriptions.Item label="头像">
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                withCredentials={true}
                                action="http://localhost:9000/uploadAvatar"
                                beforeUpload={beforeUpload}
                                data={{ userId: user._id }}
                                onChange={this.handleChange}
                            >
                                {
                                    this.state.loading ? <Icon type="loading" /> : <img src={imageUrl} />
                                }
                            </Upload>
                        </Descriptions.Item>
                        <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
                    </Descriptions>
                    <Button type="danger"
                        onClick={async (event: any) => {
                            await this.props.logout();
                            this.props.history.push('/login');
                        }}
                    >退出登录</Button>
                </div>
            )
        } else {/*如果说当前的用户未登录*/
            content = (
                <>
                    <Alert type="warning" message="当前未登录" description="亲爱的用户你好，你当前尚未登录，请你选择注册或者登录" />
                    <div style={{ textAlign: 'center', padding: '.5rem' }}>
                        <Button type="dashed" onClick={() => this.props.history.push('/login')}>登录</Button>
                        <Button type="dashed" style={{ marginLeft: '.5rem' }} onClick={() => this.props.history.push('/register')}>注册</Button>
                    </div>
                </>
            )
        }
        return (
            (
                <section>
                    <NavHeader history={this.props.history}>个人中心</NavHeader>
                    {content}
                </section>
            )
        )
    }
}
let mapStateToProps = (state: TypeRootState): TypeProfile => state.profile
export default connect(
    mapStateToProps,
    actions
)(Profile);

function beforeUpload(file: any) {
    const isJpgOrPng = file.type == 'image/jpg' || file.type == 'image/png';
    if (!isJpgOrPng)
        message.error('你只能上传JPG或PNG格式的图片!');
    const isLessThan2M = file.size / 1024 / 1024 < 2;
    if (!isLessThan2M)
        message.error('图片的大小不能大于2M!');
    return isJpgOrPng && isLessThan2M;
}