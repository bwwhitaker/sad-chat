import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'; 
import Card from 'react-bootstrap/Card';
import './Chat.css';



class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        happy : false,
        youSad : "hide",
        meSad : "hide",
        welcome : "show",
        welcomemodal: "modal-height",
        message : "",
        nextMessage: "human-bubble hide",
        messageForm: "mb-3",
        happychat: false,
        messages: []
        }
        this.setHappy = this.setHappy.bind(this);
        this.setmeSad = this.setmeSad.bind(this);
        this.setyouSad = this.setyouSad.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
    }

    componentDidMount() {
        const json = localStorage.getItem("messages");
        const messages = JSON.parse(json);
        if (messages) {
          this.setState(() => ({ messages }));
        }
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length !== this.state.messages.length) {
          const json = JSON.stringify(this.state.messages);
          localStorage.setItem("messages", json);
        }
      }

    setHappy(event){
        this.setState({happy : true})
        this.setState({welcome : "hide"})
        let messages = [...this.state.messages]
        let initialMessage = [{"name": "sad", "source": "computer", "bg":"primary", "message": "Well, isn't it so great that you're happy. Why should I be happy for you?"},{"name": "sad", "source": "human", "bg":"light", "message": "Well, isn't it so great that you're happy. Why should I be happy for you?"}]
        this.setState({messages : initialMessage })
        this.setState({welcomemodal: "hide"})
        this.setState({happychat:true})
        }
    
    setyouSad(event){
        this.setState({youSad : "show"})
        this.setState({welcome : "hide"})
        this.clearMessages()
        }

    setmeSad(event){
        this.setState({meSad : "show"})
        this.setState({welcome : "hide"})
        }

    updateMessage(event){
        this.setState({message : event.target.value})
        }   
        
    clearMessages = () => {
        let messages = [...this.state.messages]
        this.setState({messages : []})
    }

    
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
      }

    responseMessage = () => {
        let messages = [...this.state.messages]
        messages.push({"name":"sad","source": "computer", "bg":"primary", "message":"Oh, really now?"})
        this.setState({messages})
        this.scrollToBottom()
    }
    

        sendMessage = (e) => {
            let message = [...this.state.message]
            if (this.state.message === "") {
            } else {
            let messages = [...this.state.messages];
            messages.push({"name":this.props.FriendData,"source": "human", "bg":"light", "message":this.state.message});
            this.setState({ messages, message: "" });
            this.mainInput.value = "";
            this.scrollToBottom()
            }
          };

    render() 
    {
        var FriendName = this.props.FriendData;
        var ChatReady = this.props.ChatReady;
        
        return(
            <div>
           
            <Modal animation={false} show={ChatReady} scrollable={true} dialogClassName={this.state.welcomemodal}>
                <Modal.Header>
                    Welcome to SadChat!
                </Modal.Header>

                <Modal.Body >
                    <div>
                   <p>
                    Hi {FriendName}!
                   </p>
                   <p>
                   What can I do for you today?
                   </p>
                   </div>
                        
                    
                        
                    
                    <Button variant="outline-secondary" className="Button-width" onClick={this.setHappy}>Talk About How Happy You Are?</Button>
                    <Button variant="outline-secondary" className="Button-width" onClick={this.setyouSad}>Talk About How Sad You Are?</Button>
                    <Button variant="outline-secondary" className="Button-width" onClick={this.setmeSad}>Ignore The Fact That I'm Sad?</Button>
                    

                    </Modal.Body>
             </Modal>
             
             
            
                
                <Modal animation={false} show={this.state.happy} scrollable={true} dialogClassName="modal-height">
                    <Modal.Header>
                    Welcome to SadChat!
                    </Modal.Header>
                    <Modal.Body>

                
                    <div>
                        {this.state.messages.map((message, index) => (<Card bg={message.bg} className={message.source}>{message.message}</Card>))}
                    </div> 
                    <br/>
                    <br/>
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}></div>
                    </Modal.Body>
                    <Modal.Footer>                          
                        <div>
                    <InputGroup className="mb-3">
                    <FormControl
                        ref={(ref) => this.mainInput= ref}
                        aria-describedby="basic-addon2"
                        onChange={this.updateMessage}
                        onFocus={event => {
                            if (this.state.message !== "") {
                            } else {this.setState({message: ""})}
                        }

                        }
                        onKeyPress={event => {
                        if (event.key === 'Enter') {
                        this.sendMessage()}}
                        }
                    />
                    <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={this.sendMessage}>SendChat</Button>
                    </InputGroup.Append>
                    </InputGroup>
                    
                    </div>
                    </Modal.Footer>  
             </Modal>
            
             </div>
    )
       
    }
}

export default Chat;