const body = document.querySelector("body");

const orientationAlert = function () {
  let isLandScape = window.innerHeight < window.innerWidth;
  console.log(navigator.userAgentData)
  if (navigator.userAgentData.mobile) {
    const rotateAlertScreen = document.querySelector("#rotation-alert-screen");
    if (isLandScape && !rotateAlertScreen) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div id="rotation-alert-screen" class=" loading-screen w-full h-screen bg-blueBackground absolute z-50 flex items-center justify-center text-white text-2xl">Please rotate your screen</div>`
      );
    }
    if (!isLandScape && rotateAlertScreen) rotateAlertScreen.remove();
  }
};

window.addEventListener("load", orientationAlert);
window.addEventListener("resize", orientationAlert);
