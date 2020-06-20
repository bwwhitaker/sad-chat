import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'; 
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './components/modules/Chat';
import Modal from 'react-bootstrap/Modal';



class App extends React.Component {
  constructor(props){
    super(props);
    this.state= {
      friend : "",
      introVisible : true,
      chatVisible : false
    }
    this.updateFriend = this.updateFriend.bind(this);
  }

  updateFriend(event){
    this.setState({friend : event.target.value})
    }
  sendName = () => {
      if (this.state.friend === "") {
      } else {
      this.setState({ introVisible: false })
      this.setState({ chatVisible: true});
    }}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>
            <Modal animation={false} show={this.state.introVisible}>
              <Modal.Header>
                Welcome to SadChat!
              </Modal.Header>
              <Modal.Body>
                <InputGroup show ={this.state.introVisible} className="mb-3">
                  <FormControl
                    placeholder="Who's there?"
                    aria-label="Who's there?"
                    aria-describedby="basic-addon2"
                    onChange={this.updateFriend}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        this.sendName()}}
                    }
                  />
                <InputGroup.Append>
                  <Button variant="outline-secondary" onClick={this.sendName}>SendChat</Button>
                </InputGroup.Append>
                </InputGroup>

              </Modal.Body>
            </Modal>

            
        
        <Chat FriendData={this.state.friend} ChatReady={this.state.chatVisible}/>
        </div>
        </header>
        
  
        
      </div>
    );
  }

  
}

export default App;
