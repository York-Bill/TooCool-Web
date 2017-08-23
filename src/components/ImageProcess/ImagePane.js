/**
 * Created by yangbingxun on 2017/8/14.
 */

import React from 'react'
import touch from 'touchjs'

export default class ImagePane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            img: null,
            width: 0,
            height: 0,
            max_height: 0,
            max_width: 0
        }
    }


    resize(img, max_width = screen.width, max_height = screen.height) {
        const imgWidth = img.width;
        const imgHeight = img.height;
        let newWidth = 0;
        let newHeight = 0;
        let scale = imgWidth/max_width;
        if(imgHeight / scale > max_height) {
            scale = imgHeight / max_height;
            newWidth = (imgWidth/scale).toFixed(0);
            newHeight = max_height;
        } else {
            newWidth = max_width;
            newHeight = (imgHeight/scale).toFixed(0);
        }

        return {width: newWidth, height: newHeight}
    }

    componentWillReceiveProps(nextProps) {
        const img = document.createElement('img');
        img.src = nextProps.img;
        img.onload = e => {
            const wh = this.resize(img, this.state.max_width, this.state.max_height);
            this.setState({
                img: this.props.img,
                width: wh.width,
                height: wh.height
            })
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        for(let key in this.props.events) {
            touch.on(this.refs['img_label'], key, this.props.events[key])
        }
        const contentPane = this.refs["content-pane"];
        let mw = contentPane.offsetWidth,
            mh = contentPane.offsetHeight;
        if(mw == 0 || mh ==0) {
            mh = contentPane.parentElement.offsetHeight
            mw = contentPane.parentElement.offsetWidth
        }
        this.setState({
            max_width: mw,
            max_height: mh
        });

        const img = document.createElement('img');
        img.src = this.props.img;
        img.onload = e => {
            const wh = this.resize(img, this.state.max_width, this.state.max_height);
            this.setState({
                img: this.props.img,
                width: wh.width,
                height: wh.height
            })
        }
        if(this.props.postScale) {
            if (this.refs['img'].complete) {
                setTimeout(() => {
                    this.props.postScale(this.refs['img'].offsetWidth / this.refs['img'].naturalWidth);
                    this.props.postImgNode && this.props.postImgNode(this.refs['img']);
                },0)
            } else {
                this.refs['img'].onload = e => {
                    setTimeout(() => {
                        this.props.postScale(this.refs['img'].offsetWidth / this.refs['img'].naturalWidth);
                        this.props.postImgNode && this.props.postImgNode(this.refs['img']);
                    },0)
                }
            }
        }

    }

    render() {
        const styles = this.props.styles || {};

        return (
            <div ref={"content-pane"} style={styles} className={this.props.className || "content-pane"}>
                <div
                    ref="img_label"
                    style={{
                        width: `${this.state.width}px`,
                        height: `${this.state.height}px`
                    }}
                >
                    <img
                        ref="img"
                        src={this.props.img}
                    />
                    { this.props.children || '' }
                </div>
            </div>
        )
    }
}