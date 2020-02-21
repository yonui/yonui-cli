module.exports = `
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tag from 'bee-tag';
import 'bee-tag/build/Tag.css'
import Radio from 'bee-radio';
import 'bee-radio/build/Radio.css';
import Icon from 'bee-icon';
import 'bee-icon/build/Icon.css';
import Popover from 'bee-popover';
import 'bee-popover/build/Popover.css';
import QRCode from 'qrcode.react';
import manifest from '../../../manifest.json';
import resources from '../../demo/resources.json';
import marded from 'marked';
import Highlight from 'react-highlight';
import 'highlight.js/styles/github.css';
import './index.less';
// import cb from '@mdf/cube/lib/cube';
export default class IndexView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: '',
            previewCode: '',
            showPreview: false,
            showCode: false,
            selectedValue: 'demo',
            openHashMap: {},
            selectedComp: {},
            loadScript: false,
            resources: []
        }
    }

    componentDidMount(){
        this.setState({
            resources
        })
        this.onSelectComp(resources[0]);
    }

    onSelectComp = (item) => {
        this.loadScriptAndCss(item.path);
        this.setState({
            selected: item.component,
            selectedComp: item,
            selectedValue: "demo"
        })
    }

    openModal = ( content ) => {
        this.setState({
            showPreview: true,
            previewCode: content
        })
    }

    renderNav = (resources) => {
        const { selected } = this.state;
        return resources.map(item => {
            const cls = selected === item.component ? 'left-nav-item left-nav-item-selected' : 'left-nav-item';
            return (
                <div className={cls} onClick={() => { this.onSelectComp(item) }}>
                    {item.component}
                </div>
            )
        })
    }

    renderKeywords = ( keyword ) => {
        const source = keyword.split(/\\s+/);
        return source.map( item => {
            return <Tag colors='info' className='viewer-title-keyword'>{item}</Tag>
        })
    }

    handleChangeType= ( value ) => {
        if(value === 'demo'){
            const { selectedComp } = this.state;
            this.loadScriptAndCss(selectedComp.path)
        }
        this.setState({
            selectedValue: value
        })
    }

    // 动态加载组件中的demo文件
    loadScriptAndCss = ( dir) => {
        let script = document.createElement('script');
            script.setAttribute('id','_demoJs');
            script.setAttribute('type','text/javascript');
            script.setAttribute('async',true);
            script.setAttribute('src',\`\${dir}/index.js\`);
            document.body.appendChild(script);

            let link = document.createElement('link');
            link.setAttribute('id','_demoCss');
            link.setAttribute('type','text/css');
            link.setAttribute('rel','stylesheet');
            link.setAttribute('href',\`\${dir}/index.css\`);
            document.head.appendChild(link);
    }

    onOpenCodePreview = ( index, bool ) => {
        this.setState({
            openHashMap: {...this.state.openHashMap,[index]: bool}
        })
    }

    viewSingleDemp = (compId) => () => {
      window.open(\`/demo-view/#/\${compId}\`)
    }

    renderDemos = () => {
        // if(
        const { selected, selectedComp, openHashMap, loadScript } = this.state;
        const { demos } = selectedComp;
        if (demos && demos.length > 0){

            return demos.map( (item,index) => {
                return (
                    <div className='content-item'>
                    <div className='content-title' onClick={this.viewSingleDemp(item.id)}>
                      <Popover placement="rightTop" content={<QRCode
                        value={\`http://\${IP}:\${PORT}/demo-view/#/\${item.id}\`}
                      />}
                      >
                        <span>{item.name}</span>
                      </Popover>
                    </div>
                    <div className='content-desc'>
                        {item.description}
                    </div>
                    <div className='content-demo'>
                        <div id={item.id}></div>
                    </div>
                    <div className='content-extra-icon' onClick={()=>{this.onOpenCodePreview(index, !openHashMap[index])}}>{openHashMap[index] ? <Icon type='uf-2arrow-up' /> : <Icon type='uf-2arrow-down' />}</div>
                    {openHashMap[index] && <Highlight className='javascript'>
                        {item.code}
                    </Highlight>}
                </div>
                )
            })
        }


    }

    renderApi = ( ) => {
        const { selectedComp } = this.state;
        return <div dangerouslySetInnerHTML = {{__html:marded(selectedComp.readme)}}  className='content-item'></div>
    }

    render() {
        const { selected, showPreview, previewCode, showCode, selectedValue, resources } = this.state;
        const sty = showCode ? {} : { display: 'none' };
        return (
            <div className='demo-viewer'>
                <div className='viewer-title'>
                    <div className='viewer-title-name'>
                        {manifest.name}
                        <Tag className='viewer-title-version' colors='light' bordered>{manifest.version}</Tag>
                    </div>
                    <div className='viewer-title-keyword-area'>
                        {this.renderKeywords(manifest.keyword)}
                    </div>
                    <div className='viewer-title-desc'>
                        {manifest.description}
                    </div>
                </div>
                <div className='left-nav'>
                    {this.renderNav(resources)}
                </div>
                <div className='right-content'>
                    <div className='right-content-type'>
                        <Radio.RadioGroup
                        name='type'
                        selectedValue={selectedValue}
                        onChange={this.handleChangeType}>
                            <Radio.RadioButton value='demo'>示例</Radio.RadioButton>
                            <Radio.RadioButton value='api'>文档</Radio.RadioButton>
                        </Radio.RadioGroup>
                    </div>
                    { selectedValue === 'demo' ? this.renderDemos(resources, selected):this.renderApi(resources, selected)}
                </div>
            </div>
        )
    }
}
ReactDOM.render(<IndexView />, document.getElementById('app'));`
