import React from "react"
import ReactDOM from 'react-dom'
import { Rnd } from "react-rnd"
import './index.less'

class Popover extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0,
            y: 0,
            width: 200,
            height: 200,
        }
    }
    static getDerivedStateFromProps(props) {
        return {
            // x: props.x,
            // y: props.y,
            visible: props.visible
        }
    }
    renderContent(props) {
        const { x, y, visible } = this.state
        ReactDOM.render(
            <Rnd
                bounds="window"
                className="rnd-popover"
                style={visible ? {display: 'block', transform: 'translateX(20px)', color: 'red'}  : {display: 'none'}}
                position={{x, y}}
                onDragStop={(e, d) => {
                    this.setState({ x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                    this.setState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position
                    });
                }}
            >
                {this.props.children}
                00000000000000000000000000001
            </Rnd>,
            this.bodyDom
        )
    }
    componentDidUpdate() {
        this.renderContent()
        document.querySelector('.rnd-popover').style.color = 'red'
        document.querySelector('.rnd-popover').style.transform = 'translate(10px, 20px)'
    }
    componentDidMount() {
        this.bodyDom = document.createElement('div')
        document.body.appendChild(this.bodyDom)
        this.renderContent()
    }
    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.bodyDom)
        document.body.removeChild(this.bodyDom)
    }

    render() {
        return null
    }
}

export default Popover

