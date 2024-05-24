function toggleChatButtons(button){
    // Remove "selected-button" class from all buttons
    var buttons = document.querySelectorAll('.btn');
    buttons.forEach(function(btn) {
        btn.classList.remove('selected-button');
    });

    // Add "selected-button" class to the clicked button
    button.classList.add('selected-button');

    button.blur();
}

// function toggleMicrophone(button){
//     if(button.classList.contains("selected-button")){
//         console.log("remove selected button")
//         button.classList.remove("selected-button");
//     }
//     else{
//         console.log("add selected button")
//         button.classList.add("selected-button");
//     }

//     button.blur();
// }

document.addEventListener("DOMContentLoaded", function() {
    const textModeButton = document.getElementById("text-chat-button");
    const audioModeButton = document.getElementById("audio-chat-button");

    const textMode = document.getElementById("text-mode");
    const audioMode = document.getElementById("talk-mode");

    const textModeForm = document.getElementById("text-mode-form");
    const audioModeForm = document.getElementById("talk-mode-form");

    textModeButton.addEventListener("click", function() {
        textMode.classList.add("active");
        textModeForm.classList.add("active");

        audioMode.classList.remove("active");
        audioModeForm.classList.remove("active");
    });

    audioModeButton.addEventListener("click", function() {
        audioMode.classList.add("active");
        audioModeForm.classList.add("active");

        textMode.classList.remove("active");
        textModeForm.classList.remove("active");
    });
});