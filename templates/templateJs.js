module.exports = `import React, { Component } from 'react';
import ReactDOM from 'react-dom';
@importDemos
@temp
import './temp.less';
export default class IndexView extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            selected: ''
        }
    }

    onSelectComp = (component) => {
        this.setState({
            selected: component
        })
    }

    renderNav = (temp) => {
        const { selected } = this.state;
        return Object.keys(temp).map( item => {
            const cls = selected === item ? 'left-nav-item left-nav-item-selected' : 'left-nav-item';
            return (
                <div className={cls} onClick={ () => {this.onSelectComp(item)}}>
                    {item}
                </div>
            )
        })
    }

    renderContent = (temp, selected) => {
        const demos = selected ? temp[selected] : temp[Object.keys(temp)[0]];
        return demos.map( Item => {
            return (
                <div className='content-item'>
                    <Item />
                </div>
            )
        })
    }

    render() {
        const { selected } = this.state;
        return (
            
            <div className='demo-viewer'>
                <div className='viewer-title'>
                    组件开发预览
                </div>
                <div className='left-nav'>
                    {this.renderNav(temp)}
                </div>
                <div className='right-content'>
                    {this.renderContent(temp,selected)}
                </div>
            </div>
            )
        }
    }
ReactDOM.render(<IndexView />, document.getElementById('app'));`