function Chat({ question, answer }) {
    return (
      <div className="chat-container">
        <div className="chat">
          <div className="user-section">
            <div id="user_img" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#4a90d9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'}}>🧑</div>
            <p id="user_chat">{question}</p>
          </div>
          <div className="bot-section">
            <div id="bot_img" style={{width: '40px', height: '40px', borderRadius: '50%', background: '#666', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'}}>🤖</div>
            <p id="bot_chat">{answer}</p>
          </div>
        </div>
      </div>
    );
  }

  export default Chat;