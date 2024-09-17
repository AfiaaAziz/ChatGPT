const typingForm = document.querySelector(".typing-form");
const chatList = document.querySelector(".chat-list");
const toggleThemeBtn =  document.querySelector("#toggle-theme-btn");


let userMessage = null;
const API_key = "AIzaSyCHI1QOm-8FA1IFEIqCfM7RDoLTOEx6IUs";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_key}`;


const loadLocalstorageData  = () => {
    const  savedChats = localStorage.getItem("savedChats");

   const isLightmode = (localStorage.getItem("themeColor")  === "light_mode");

    document.body.classList.toggle("light_mode", isLightmode );
    toggleThemeBtn.innerText = isLightmode  ? "dark_mode" : "light_mode";
     chatList.innerHTML = savedChats || "";
}

loadLocalstorageData();

const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

const showTypingEffect = (text, textElement) => {
    const words = text.split(" ");
    let currectwordIndex = 0;

    const typingInterval = setInterval(() => {
       
        if (currectwordIndex === 0) {
            textElement.innerText += words[currectwordIndex++];
        } else {
            textElement.innerText += ' ' + words[currectwordIndex++];
        }

       
        if (currectwordIndex === words.length) {
            clearInterval(typingInterval);
            localStorage.setItem("savedChats" , chatList.innerHTML)
        }
    }, 75);
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
        const apiResponse = data?.candidates[0].content.parts[0].text;
      showTypingEffect(apiResponse,  textElement );


    } catch (error) {
        console.log("Error:", error);

    } finally {
        incomingMessageDiv.classList.remove("loading");
    }
}; `1`



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
            <span onClick= "copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");

    chatList.appendChild(incomingMessageDiv);

    generateAPIResponse(incomingMessageDiv);
};


const copyMessage  = (copyIcon) => {
    const messageText  = copyIcon.parentElement.querySelector(".text").innerText;

navigator.clipboard.writeText(messageText );
copyIcon.innerHTML = "done";
setTimeout(() => copyIcon.innerText = "content_copy" , 1000);
}

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


toggleThemeBtn.addEventListener("click" , () =>
    {
       const isLightmode =  document.body.classList.toggle("light_mode");
       localStorage.setItem("themeColor", isLightmode  ? "light_mode" : "darkmode")
        toggleThemeBtn.innerText = isLightmode  ? "dark_mode" : "light_mode";
    
    })

typingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    handleOutgoingChat();
});
