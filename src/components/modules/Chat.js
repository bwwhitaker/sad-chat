import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl'; 
import Card from 'react-bootstrap/Card';
import Sentiment from 'sentiment';
import './Chat.css';
import ReactTimeout from 'react-timeout';
import responseJSON from './responses.json';
import responseArray from './responseArray.json';
import _ from 'lodash';


const sentiment = new Sentiment()


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
        tokens: [],
        responseMessage: {"name": "sad", "source": "computer", "bg":"primary", "text": "Well,"},
        messageForm: "mb-3",
        responseToUser: "It's makes me sad when I can't uderstand you. I'm just a little robot. Can you be more clear?",
        advancedResponseToUser: "It's makes me sad when I can't uderstand you. I'm just a little robot. Why can't you be more clear?",
        happychat: false,
        messages: []
        }
        this.setHappy = this.setHappy.bind(this);
        this.setmeSad = this.setmeSad.bind(this);
        this.setyouSad = this.setyouSad.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.findSentiment = this.findSentiment.bind(this);
        this.getTokens = this.getTokens.bind(this);
    }

    componentDidMount() {
        const json_messages = localStorage.getItem("messages");
        const messages = JSON.parse(json_messages);
        if (messages) {
            this.setState(() => ({ messages }));
            }
        }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length !== this.state.messages.length) {
            const json_messages = JSON.stringify(this.state.messages);
            localStorage.setItem("messages", json_messages);
            }
        } 




    handleCloseClick = () => {}
    

    setHappy(event){
        this.setState({happy : true})
        this.setState({welcome : "hide"})
        let initialMessage = [{"name": "sad", "source": "computer", "bg":"primary", "text": `Well, ${this.props.FriendData}, isn't it so great that you're happy. Why should I be happy for you?`}]
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
        this.setState({messages : []})
        }

    
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
        }

    handleClick = (e) => {
        this.mainInput.value = "";
        setTimeout(this.sendMessage, 100)
        setTimeout(this.getTokens, 200)
        setTimeout(this.getAdvancedResponse, 200)
        setTimeout(this.sendResponse, 400)
    }


    sendMessage = _ => {
        if (this.state.message === "") {                
        } else {
        let messages = [...this.state.messages];
        messages.push({"name":this.props.FriendData,"source": "human", "bg":"light", "text":this.state.message})
        this.findSentiment()
        this.setState({ messages });
        this.scrollToBottom()
        }
        };

    findSentiment () {
        const result = sentiment.analyze(this.state.message)
        console.log(result)
        }


    getTokens () {
        if (this.state.message === "") {            
        } else {
        const tokens = [...this.state.tokens]
        const tokenized = this.state.message
                .toLowerCase()
                .replace(/\n/g, ' ')
                .replace(/[.,/#!?$%^&*;:{}=_"~()@]/g, ' ')
                .replace(/@/g, ' ')
                .replace(/\\/g, ' ')
                .replace(/\s\s+/g, ' ')
                .trim()
                .split(' ');
        tokens.push(tokenized)
        this.setState({tokens})
        }
    }

    getResponse = _ => {
        if (this.state.message === "") {            
        } else { 
            let tokenforresponse = [...this.state.tokens[0]]
            let messagegetterkey = tokenforresponse
            if (messagegetterkey in responseJSON) {
            this.setState({responseToUser : responseJSON[messagegetterkey], tokens:[]})
            }
        }
    }
    
    getAdvancedResponse = () => {
        let gatherResponses = [ ]
        let cleanUpResponses = [ ]
        if (this.state.message === "") {            
        } else {
            const tokens = [...this.state.tokens]
            console.log(tokens)
            _.forEach(responseArray, function(response) {
                        _.forEach(tokens, function(token) {
                            _.forEach(token, function(i){
                                console.log(i)
                                if (_.includes(response.Keywords, i)) {
                                    console.log("yup")
                                    const additionalResponse = {"ResponseID": response.ResponseID, "Response": response.Response, "response.Keymatches": 1};
                                    console.log(additionalResponse)
                                    gatherResponses.push(additionalResponse.ResponseID)
                                    }
                                })
                        })      
                    })
            }

            var result = _.head(_(gatherResponses)
                            .countBy()
                            .entries()
                            .maxBy(_.last))

            console.log(gatherResponses)
            console.log(typeof Number(result))
            
            var foundResult = _.find(responseArray, {"ResponseID": Number(result)})
            if (typeof foundResult !== "undefined") {
                this.setState({advancedResponseToUser : foundResult.Response})
            }
            console.log(this.state.advancedResponseToUser)
    }
               

        
    

    sendResponse = _ => {
        if (this.state.message === "") {            
        } else { 
            let messages = [...this.state.messages];       
            messages.push({"name": "sad", "source": "computer", "bg":"primary", "text": this.state.advancedResponseToUser})
            this.setState({ messages, message: "", tokens: [], responseToUser: "It's makes me sad when I can't uderstand you. I'm just a little robot. Whay can't you be more clear?", advancedResponseToUser: "It's makes me sad when I can't uderstand you. I'm just a little robot. Can you be more clear?"});
            this.scrollToBottom()
    }}
    
    readJSON = _ => {
        fetch('./responses.json')
        .then(function(resp) {
            return resp.json()
        })
        .then(function(data){
            console.log(data)
        })
    }

    render() 
    {
        var FriendName = this.props.FriendData;
        var ChatReady = this.props.ChatReady;
        
        return(
            <div>
           
            <Modal animation={false} show={ChatReady} scrollable={true} dialogClassName={this.state.welcomemodal} backdrop="static"
    keyboard={false}  onHide={this.handleCloseClick}>
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
                    
                    

                    </Modal.Body>
             </Modal>
             
             
            
                
                <Modal animation={false} show={this.state.happy} scrollable={true} dialogClassName="modal-height" backdrop="static" keyboard={false} onHide={this.state.handleCloseClick}>
                    <Modal.Header>
                    Welcome to SadChat!
                    </Modal.Header>
                    <Modal.Body>

                
                    <div key="chatboard">
                        {this.state.messages.map((message, index) => (<Card key={index} bg={message.bg} className={message.source}>{message.text}</Card>))}
                    </div> 
                    <br/>
                    <br/>
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}></div>
                    </Modal.Body>
                    <Modal.Footer>                          
                        <div>
                    <InputGroup className="mb-3 lg" >
                    <FormControl
                        autoFocus={true}
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
                        this.handleClick()}}
                        }
                    />
                    <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={this.handleClick}>Send Chat</Button>
                    </InputGroup.Append>
                    </InputGroup>
                    </div>
                    </Modal.Footer>  
             </Modal>
             </div>
    )
       
    }
}

export default ReactTimeout(Chat);