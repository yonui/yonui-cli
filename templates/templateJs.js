module.exports = `import React, { Component } from 'react';
import ReactDOM from 'react-dom';
@importDemos
@temp
import './temp.less';
import resources from './resources.json';
import Modal from 'bee-modal';
import 'bee-modal/build/Modal.css';
import Button from 'bee-button';
import 'bee-button/build/Button.css';
export default class IndexView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: Object.keys(temp)[0] || '',
            previewCode: '',
            showPreview: false,
            showCode: false,
        }
    }

    highlightCode = () => {
        const nodes = this.refs.hightlight.querySelectorAll('pre code');
        for (let i = 0; i < nodes.length; i++) {
            hljs.highlightBlock(nodes[i])
        }
        this.setState({
            showCode: true
        })
    }

    onSelectComp = (component) => {
        this.setState({
            selected: component
        })
    }

    openModal = ( content ) => {
        this.setState({
            showPreview: true,
            previewCode: content
        })
    }
    closeModal = ( ) => {
        this.setState({
            showPreview: false,
            showCode: false,
        })
    }

    renderNav = (temp) => {
        const { selected } = this.state;
        return Object.keys(temp).map(item => {
            const cls = selected === item ? 'left-nav-item left-nav-item-selected' : 'left-nav-item';
            return (
                <div className={cls} onClick={() => { this.onSelectComp(item) }}>
                    {item}
                </div>
            )
        })
    }

    renderContent = (temp, selected) => {
        if(!selected) return null;
        const demos = selected ? temp[selected] : temp[Object.keys(temp)[0]];
        return demos.map(item => {
            return (
                <div className='content-item'>
                    <div className='content-title'>
                        {item.title}
                        <Button className='content-title-btn' onClick={() => {this.openModal(resources[selected][item.fileName])}} colors='primary' size='sm'>
                            查看源码
                        </Button>
                    </div>
                    <div className='content-desc'>
                        {item.desc}
                    </div>
                    <div className='content-demo'>
                        <item.content />                        
                    </div>
                </div>
            )
        })
    }

    render() {
        const { selected, showPreview, previewCode, showCode } = this.state;
        const sty = showCode ? {} : { display: 'none' };
        return (

            <div className='demo-viewer'>
                <div className='viewer-title'>
                    组件开发预览
                </div>
                <div className='left-nav'>
                    {this.renderNav(temp)}
                </div>
                <div className='right-content'>
                    {this.renderContent(temp, selected)}
                </div>
                <Modal  show={showPreview} onHide = { this.closeModal } onEntered={this.highlightCode} style={sty} >
                    <Modal.Header closeButton>
                    <Modal.Title>代码预览</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <pre ref='hightlight' >
                            <code className='javascript'>
                                {previewCode}
                            </code>
                        </pre>
                        
                    </Modal.Body>                    
                </Modal>
            </div>
        )
    }
}
ReactDOM.render(<IndexView />, document.getElementById('app'));`