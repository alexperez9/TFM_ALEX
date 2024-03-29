if (!navigator.bluetooth) {
  alert('Sorry, your browser doesn\'t support Bluetooth API');
}

const SEND_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';   //vale const o tendría que ser var
const SEND_SERVICE_CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const SEND_SERVICE_WRITE = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

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
        { name: MY_BLUETOOTH_NAME },
        { services: [SEND_SERVICE] },
      ]
  })
    .then(device => {
      myDevice = device;

      return device.gatt.connect();
    })
    .then(server => server.getPrimaryService(SEND_SERVICE))
    .then(service => service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC))
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
