const typingForm =  document.querySelector('.typing-form');
const chatList =  document.querySelector('.chat-list');



let userMessage = null;
const createMessageElement = (content , className) => {
    const div = document.createElement('div');
    div.classList.add("message" , className);
    div.innerHTML =  content;
    return div;
}

const handleOutgoingChat = () =>{
    userMessage = typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage) return;

   const html = ` <div class="message-content">
                <img src="images/user.png" alt="User Image" class="avatar">
                <p class="text"></p>
            </div>`;

          const outgoingMessageDiv =   createMessageElement(html, "outgoing");
          outgoingMessageDiv.querySelector(".text").innerText =  userMessage;

          chatList.appendChild( outgoingMessageDiv);
}


typingForm.addEventListener("submit", (e) =>{
  e.preventDefault();

  handleOutgoingChat();
});

