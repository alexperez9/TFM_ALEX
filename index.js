   
  if (!navigator.bluetooth) {
  alert('Sorry, your browser doesn\'t support Bluetooth API');
}

const controlButtonsListElements = document.querySelectorAll('.control-buttons > li');
const connectButton = document.getElementById('connectButton');
const disconnectButton = document.getElementById('disconnectButton');
const lightOffButton = document.getElementById('lightOff');
const toggleRedLightButton = document.getElementById('toggleRedLight');
const toggleBlueLightButton = document.getElementById('toggleBlueLight');
const toggleGreenLightButton = document.getElementById('toggleGreenLight');
const runBlinkLightButton = document.getElementById('runBlinkLight');

let toggleLigthCharacteristic;
let myDevice;
connectButton.addEventListener('pointerup', connectButtonPointerUpHandler);
  function connectButtonPointerUpHandler() {
    navigator.bluetooth.requestDevice({
      filters:
        [
          { services: "6e400001-b5a3-f393-e0a9-e50e24dcca9e" },
        ]
          })
       .then(device => {
        myDevice = device;
       return device.gatt.connect();
          })
       .then(server => server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e"))
        .then(service => service.getCharacteristic("6e400001-b5a3-f393-e0a9-e50e24dcca9e"))
        .then(characteristic => {
         toggleLigthCharacteristic = characteristic;
        toggleButtonsVisible();
        toggleItemsEventListeners('addEventListener');
         })
       .catch(error => {
         console.error(error);
          });
}
