import React, { ReactNode } from 'react';
import { Carousel } from 'antd';
import { Slider } from '../../../store/reducers/home';
import './index.less';
interface Props {
    children?: ReactNode,
    sliders?: Array<Slider>,
    getSliders: any
}
export default class HomeSliders extends React.Component<Props> {
    componentDidMount() {
        if (this.props.sliders.length == 0) {
            this.props.getSliders();
        }
    }
    render() {
        return (
            <Carousel>
                {
                    this.props.sliders.map((item: Slider, index: number) => (
                        <div key={index}>
                            <img src={item.url} />
                        </div>
                    ))
                }
            </Carousel>
        )
    }
}