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

    var UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    var UART_CHAR_RX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    var UART_CHAR_TX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

let toggleLigthCharacteristic;
let myDevice;

connectButton.addEventListener('pointerup', connectButtonPointerUpHandler);

function connectButtonPointerUpHandler() {
  navigator.bluetooth.requestDevice();
    .then(device => {
      myDevice = device;

      return device.gatt.connect();
    })
    .then(server => server.getPrimaryService();
    .then(service => service.getCharacteristic();
    .then(characteristic => {
      toggleLigthCharacteristic = characteristic;

      toggleButtonsVisible();
      toggleItemsEventListeners('addEventListener');
    })
    .catch(error => {
      console.error(error);
    });
}

function lightOffButtonClickHandler() {
  return toggleLigthCharacteristic.writeValue(Uint8Array.of(0));
}

function toggleLightButtonClickHandler(event) {
  const code = Number(event.target.dataset.code);

  if (code === 1) {
    toggleLigthCharacteristic.writeValue(Uint8Array.of(code));

    return;
  }

  toggleLigthCharacteristic.readValue()
    .then(currentCode => {
      const convertedCode = currentCode.getUint8(0);

      toggleLigthCharacteristic.writeValue(Uint8Array.of(convertedCode === code ? 0 : code));
    });
}

function toggleButtonsVisible() {
  Array.prototype.forEach.call(controlButtonsListElements, listElement => {
    listElement.classList.toggle('visible');
  });
}

function disconnectButtonClickHandler() {
  lightOffButtonClickHandler()
    .then( () => {
      myDevice.gatt.disconnect();

      toggleItemsEventListeners('removeEventListener');
      toggleButtonsVisible();

      toggleLigthCharacteristic = undefined;
      myDevice = undefined;
    });
}

function toggleItemsEventListeners(action) {
  disconnectButton[action]('click', disconnectButtonClickHandler);
  lightOffButton[action]('click', lightOffButtonClickHandler);
  runBlinkLightButton[action]('click', toggleLightButtonClickHandler);
  toggleGreenLightButton[action]('click', toggleLightButtonClickHandler);
  toggleRedLightButton[action]('click', toggleLightButtonClickHandler);
  toggleBlueLightButton[action]('click', toggleLightButtonClickHandler);
}
