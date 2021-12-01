import logo from './logo.svg';
import TOC from './components/TOC.js.js.js.js'
import Content from './components/Content.js.js.js.js'
import Subject from './components/Subject.js.js.js.js'
import './App.css';
import React, { Component } from 'react'

class App extends Component {
  // 컴포넌트 초기화
  constructor(props) {
    super(props);
    this.state = {
      mode:'welcome',
      subject:{title:'WEB', sub:'World Wide Web!'},
      welcome:{title:'Welcome', desc:'Hello React. '},
      contents:[
        {id:1, title:'HTML', desc:'HTML is HyperText...'},
        {id:2, title:'CSS', desc:'CSS is for design.'},
        {id:3, title:'JavaScript', desc:'JavaScript is for interaction'},
        {id:4, title:'TEST', desc:'TEST'},
      ]
    }
  }

  render() {
    console.log('App Render');
    var _title, _desc = null;
    if(this.state.mode === "welcome") {
      _title = this.state.welcome.title;
      _desc = this.state.welcome.desc;
    } else if (this.state.mode === 'read') {
      _title = this.state.contents[0].title;
      _desc = this.state.contents[0].desc;
    }
    return (
      <div className="App">
        <Subject 
        title={this.state.subject.title} 
        sub={this.state.subject.sub}>
        </Subject>
        <TOC data={this.state.contents}></TOC>
        <Content title={_title} desc={_desc}></Content>
      </div>
    );
  }
} 

export default App;
