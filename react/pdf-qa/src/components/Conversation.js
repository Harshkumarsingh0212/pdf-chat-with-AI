import { useState } from "react";
import api from '../api'
import Chat from "./Chat";
import send_icon from "../send_icon.png"

function Conversation(){
    const [loader, setLoader] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [chats, setChats] = useState([]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value)
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!userInput.trim()) return;
        try{
            const item = {
                'chat_history' : chats,
                'question' : userInput
            }
            setLoader(true);
            const response = await api.post('/question/',item);
            setLoader(false);
            setUserInput('')
            setChats(response.data.chat_history)
        }
        catch(error){
            setLoader(false);
            console.log(error);
            alert("Failed to get a response. Please make sure the backend server is running and try again.");
        }
    }

    return(
        <div className="container" id="conversation">
            <div className="container" id="chats">
                {chats.map((chat,i)=>(
                    <Chat key={i} question={chat.question} answer={chat.answer} />
                ))}
            </div>
            <div className="container" id="user_input_div">
                <form onSubmit={handleSubmit} className="input-group mb-3 container" id="input_form">
                    <input type="text" className="form-control" aria-describedby="button-addon2" id="user_input" name="user_input" placeholder="Send a message..." onChange={handleInputChange} value={userInput}/>
                    <button className="btn btn-light" id="button-addon2" type="submit">
                    {!loader &&
                        <img src={send_icon} alt="send"/>
                    }
                    {loader &&
                        <div className="spinner-border" id="chat_spinner" role="status"></div>
                    }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Conversation;