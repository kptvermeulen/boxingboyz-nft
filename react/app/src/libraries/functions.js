import axios from "axios";
import closeIcon from "assets/img/close_111152.svg";

export const Request = (config) => {
  return new Promise((resolve, reject) => {
    axios
      .request({
        url: config.url,
        method: config.method || "get",
        data: config.data,
        headers: config.headers || "",
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response);
      });
  });
};

export const Popup = (title, message, color, location) => {
  if (typeof message === "string") {
    try {
      try {
        document.getElementById("popup").remove();
      } catch {}

      var div = document.createElement("div");
      div.id = "popup";

      let displayMessage = message;
      displayMessage = displayMessage
        .replace(
          "~",
          "<a href='" + location + "' target='_blank' rel='noreferrer'>"
        )
        .replace("~", "</a>");
      div.innerHTML =
        `
  <div class="popup">
  <div class="popup-inner">
  <div style="background-color:` +
        color +
        `" class="popupAccent"></div>
    <div class="close-btn" onClick='document.getElementById("popup").parentNode.removeChild(document.getElementById("popup"));'>
      <img src="` +
        closeIcon +
        `">
    </div>
    <div class="popupTitle">` +
        title +
        `</div>
    <div class="popupMessage">` +
        displayMessage +
        `</div>
  </div>
</div>`;
      document.body.appendChild(div);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log(message);
  }
};

export function Ripple(e) {
  e.target.style.position = "relative";
  e.target.style.overflow = "hidden";

  let x = e.clientX - e.target.offsetLeft;
  let y = e.clientY - e.target.offsetTop;

  let ripples = document.createElement("div");
  ripples.id = "rippleEffectBubble";
  ripples.style.left = x + "px";
  ripples.style.top = y - 35 + "px";
  e.target.appendChild(ripples);

  setTimeout(() => {
    ripples.remove();
  }, 1000);
}

export function Confirmation(data) {
  return new Promise((resolve, reject) => {
    try {
      document
        .getElementById("confirmationPopup")
        .parentNode.removeChild(document.getElementById("confirmationPopup"));
    } catch {}

    let e = data.event;
    var div = document.createElement("div");
    div.id = "confirmationPopup";
    div.innerHTML =
      `
  <div class="confirmationPopup" style="grid-template-columns: 1fr ` +
      (e.offsetWidth - 8).toString() +
      `px;">
  <div class="cPSide">
  <div style="display: flex; gap: 5px;">
  <div id="SConfirmBtn">` +
      data.confirmButton +
      `</div>
  <div id="SCancelConfirmBtn">` +
      data.cancelButton +
      `</div>
  </div>
  </div>
</div>`;
    e.parentNode.appendChild(div);

    document
      .getElementById("SConfirmBtn")
      .addEventListener("click", (event) => {
        resolve(true);
      });
    document
      .getElementById("SCancelConfirmBtn")
      .addEventListener("click", (event) => {
        resolve(false);
      });
  });
}
