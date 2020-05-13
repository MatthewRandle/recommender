const ConfirmAlert = ({ onSuccess, message }) => {
    document.body.firstChild.classList.add("recommender_blur");

    let popup = document.createElement("div");
    popup.classList.add("confirmAlert");

    let text = document.createElement("h2");
    text.innerHTML = message;

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("confirmAlert_buttons");

    let confirmButton = document.createElement("button");
    confirmButton.innerHTML = "Confirm";
    confirmButton.onclick = () => {
        document.body.removeChild(popup);
        onSuccess();
        document.body.firstChild.classList.remove("recommender_blur");
    };

    let cancelButton = document.createElement("button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.onclick = () => {
        document.body.removeChild(popup);
        document.body.firstChild.classList.remove("recommender_blur");
    };

    popup.appendChild(text);
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(buttonContainer);
    document.body.appendChild(popup);
};

export default ConfirmAlert;