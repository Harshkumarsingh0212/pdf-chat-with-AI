import { useState } from "react";
import api from '../api'
import Chat from "./Chat";
import send_icon from "../send_icon.png"

function Conversation(){
    const [loader, setLoader] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chats, setChats] = useState([{
        'question': "Hello bot!",
        'answer': "Hello human"
    },]);

    const handleInputChange = (event) => {
        // console.log(event.target)
        setUserInput(event.target.value)
    }
    
    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            console.log(userInput)
            console.log(chats)
            
            const item = {
                'chat_history' : chats,
                'question' : userInput
            }
            setLoader(true);
            const response = await api.post('/question/',item);
            setLoader(false);
            console.log('Question submitted', response);
            setUserInput('')
            setChats(response.data.chat_history)
        }
        catch(error){
            console.log(error);
        }
    }
    
    return(
        <div class="container" id="conversation">
            <div class="container" id="chats">
                {chats.map((chat,i)=>(
                    <Chat key={i} question={chat.question} answer={chat.answer} />
                ))}
            </div>
            <div className="container" id="user_input_div">
                <form onSubmit={handleSubmit} class="input-group mb-3 container" id="input_form">
                    <input type="text" class="form-control" aria-describedby="button-addon2" id="user_input" name="user_input" placeholder="Send a message..." onChange={handleInputChange} value={userInput}/>
                    <button class="btn btn-light" id="button-addon2" type="submit" onClick={handleSubmit}>
                    {!loader &&
                        // <i class="bi bi-arrow-right-circle" id="chat_send"></i>
                        <img src={send_icon}></img>
                    }
                    {loader &&
                        <div class="spinner-border" id="chat_spinner" role="status"></div>
                    }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Conversation;