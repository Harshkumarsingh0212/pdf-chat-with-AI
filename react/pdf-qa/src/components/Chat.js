function Chat({ key, question, answer }) {
    return (
      <div className="chat-container" key={key}>
        <div className="chat">
          <div className="user-section">
            <img id="user_img" src="https://t3.ftcdn.net/jpg/05/53/79/60/360_F_553796090_XHrE6R9jwmBJUMo9HKl41hyHJ5gqt9oz.jpg" alt="User" />
            <p id="user_chat">{question}</p>
          </div>
          <div className="bot-section">
            <img id="bot_img" src="https://miro.medium.com/v2/da:true/resize:fit:250/1*fQwcjgnO9WTvRyKALhHJWg.gif" alt="Bot" />
            <p id="bot_chat">{answer}</p>
          </div>
        </div>
      </div>
    );
  }
  
  export default Chat;
  