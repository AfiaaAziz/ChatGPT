const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");

let userMessage = null;
const API_key = "AIzaSyCHI1QOm-8FA1IFEIqCfM7RDoLTOEx6IUs";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_key}`;

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};


const generateAPIResponse = async (incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: userMessage }]
                    }
                ]
            })
        });

      const data = await response.json();
      const apiResponse =  data?.candidates[0].content.parts[0].text;
      textElement.innerHTML = apiResponse;


    } catch (error) {
        console.log("Error:", error);
       
    }finally{
        incomingMessageDiv.classList.remove("loading");
    }
};`1`



    const showLoadingAnimation = () => {
        const html = ` <div class="message-content">
                <img src="images/Gemini icon.png" alt="Gemini Image" class="avatar">
                <p class="text"></p>
                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
            </div>
            <span class="icon material-symbols-rounded">content_copy</span>`;

        const incomingMessageDiv = createMessageElement(html, "incoming", "loading");

        chatList.appendChild(incomingMessageDiv);

        generateAPIResponse(incomingMessageDiv);
    };

    const handleOutgoingChat = () => {
        userMessage = typingForm.querySelector(".typing-input").value.trim();
        if (!userMessage) return;

        const html = ` <div class="message-content">
                <img src="images/user.png" alt="User Image" class="avatar">
                <p class="text"></p>
            </div>`;

        const outgoingMessageDiv = createMessageElement(html, "outgoing");
        outgoingMessageDiv.querySelector(".text").innerText = userMessage;

        chatList.appendChild(outgoingMessageDiv);
        typingForm.reset();
        setTimeout(showLoadingAnimation, 500);
    };

    typingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        handleOutgoingChat();
    });
