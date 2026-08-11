const btn = document.getElementById("baton");
const input = document.getElementById("content");
const chatWindow = document.getElementById("chat-window");

// Helper: adds a chat bubble to the chat window.
function addMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = sender === "user" ? "chat-bubble user-bubble" : "chat-bubble ai-bubble";

    if (sender === "ai" && typeof marked !== "undefined") {
        bubble.innerHTML = marked.parse(text);
    } else {
        bubble.textContent = text;
    }

    chatWindow.appendChild(bubble);
    chatWindow.scrollTop = chatWindow.scrollHeight; 
    // auto-scroll to newest message
}

// AI chat send button
btn.addEventListener('click', function(){
    const userText = input.value;
    if (!userText.trim()) {
        return;
    }

    addMessage(userText, "user");
    input.value = '';

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: userText
                }]
            }]
        })
    }).then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
        if (json.candidates && json.candidates[0]) {
            const resText = json.candidates[0].content.parts[0].text;
            addMessage(resText, "ai");
        } else if (json.error) {
            addMessage(`Error: ${json.error.message}`, "ai");
        }
    }).catch((err) => {
        console.error("Fetch error:", err);
        addMessage("Failed to connect to the API.", "ai");
    });
});


// Counter
let count = 0;
const countDisplay = document.getElementById("count-display");
const plusBtn = document.getElementById("plus-btn");
const minusBtn = document.getElementById("minus-btn");
const resetBtn = document.getElementById("reset-btn");

plusBtn.addEventListener('click', function() {
    count = count + 1;
    countDisplay.textContent = count;
});

minusBtn.addEventListener('click', function() {
    count = count - 1;
    countDisplay.textContent = count;
});

resetBtn.addEventListener('click', function() {
    count = 0;
    countDisplay.textContent = count;
});

// Color Changer
const bgBtn = document.getElementById("bg-btn");

bgBtn.addEventListener('click', function() {
    if (document.body.style.backgroundColor === "rgb(196, 145, 244)") {
        document.body.style.backgroundColor = "rgb(243, 232, 255)";
    } else {
        document.body.style.backgroundColor = "rgb(196, 145, 244)";
    }
});

// Show/Hide Paragraph
const toggleBtn = document.getElementById("toggle-btn");
const toggleText = document.getElementById("toggle-text");

toggleBtn.addEventListener('click', function() {
    if (toggleText.style.display === "none") {
        toggleText.style.display = "block";
        toggleBtn.textContent = "Hide Paragraph";
    } else {
        toggleText.style.display = "none";
        toggleBtn.textContent = "Show Paragraph";
    }
});