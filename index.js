 // Estas ID de 128 bits corresponden al servicio BLE 'UART' de semiconductores nórdicos que utiliza Adafruit y otros.
    var  UART_SERVICE_UUID  =  ' 6e400001-b5a3-f393-e0a9-e50e24dcca9e ' ;
    var  UART_CHAR_RX_UUID  =  ' 6e400003-b5a3-f393-e0a9-e50e24dcca9e ' ;
    var  UART_CHAR_TX_UUID  =  ' 6e400002-b5a3-f393-e0a9-e50e24dcca9e ' ;
    var conectado =  falso ;
    var gattServer =  null ;
    var uartService =  null ;
    var writeCharacteristic =  null ;
    var readCharacteristic =  null ;
    función  handleError ( error ) {
        log ( " ERROR: "  + error);
    }
    función de  configuración de Bluetooth () {
        if ( navegador . bluetooth  ==  indefinido ) {
            registro ( ' ERROR: no se encontró la compatibilidad con Web Bluetooth, consulte: https://goo.gl/5p4zNM ' );
            volver ;
        }
        if (gattServer ! =  nulo  &&  gattServer . conectado ) {
            // desconectar ();
        } else {
            log ( ' Conectando ... ' );
            if (readCharacteristic ==  null ) {
                Navigator . bluetooth . requestDevice ({
                            filtros : [{
                                servicios : [ UART_SERVICE_UUID ]
                            }]
                        })
                        . entonces ( función ( dispositivo ) {
                            log ( ' > DeviceNAme = '  +  device . name );
                            log ( ' Conectando al servidor GATT ... ' );
                            regresar  dispositivo . connectGATT (); // Esto está desaprovechado, pero aún es necesario en algunas versiones "más antiguas" del navegador.
                        }). entonces ( función ( servidor ) {
                    log ( ' > Encontrado servidor GATT ' );
                    gattServer = servidor;
                    // Obtener servicio UART
                    devuelve  gattServer . getPrimaryService ( UART_SERVICE_UUID );
                }). entonces ( función ( servicio ) {
                    log ( ' > Servicio de evento encontrado ' );
                    uartService = servicio;
                    // Consigue caracteristicas de escritura
                    volver  uartService . getCharacteristic ( UART_CHAR_TX_UUID );
                }). entonces ( función ( característica ) {
                    log ( ' > Característica de escritura encontrada ' );
                    writeCharacteristic = caracteristica;
                    // Obtener característica de lectura
                    volver  uartService . getCharacteristic ( UART_CHAR_RX_UUID );
                }). entonces ( función ( característica ) {
                    conectado =  verdadero ;
                    log ( ' > Característica de lectura encontrada ' );
                    readCharacteristic = característico;
                    deviceReady ();
                    // Escucha las notificaciones del dispositivo
                    volver  readCharacteristic . startNotifications (). entonces ( función () {
                        readCharacteristic . addEventListener ( ' characteristicvaluechanged ' , la función ( evento ) {
                            log ( ' > featurevaluechanged = '  +  event . target . value  +  ' [ '  +  event . target . value . byteLength  +  ' ] ' );
                            si ( evento . objetivo . valor . ByteLength  >  0 ) {
                                var data =  new  Uint8Array ( event . target . value );
                                log ( " Recv data: "  + data);
                            }
                        });
                    });
                }). catch (handleError);
            }
        }
    }
    función  enviar ( datos ) {
        log ( " Enviando: "  + datos);
        devuelve  writeCharacteristic . writeValue ( nuevo  Uint8Array (datos));
    }
    // Estos números hexadecimales mágicos a continuación se ajustan al estándar Firmata, en una aplicación real que usarías
    // A las bibliotecas de JavaScript Firmata para ocultar estos detalles.
    // Un ejemplo del cual será publicado en www.thebubbleworks.com
    var  FIRMATA_PIN13_DIGITAL_OUT_MESSAGE  = [ 0xf4 , 0x0d , 0x01 ];
    var  FIRMATA_PIN13_DIGITAL_LOW_MESSAGE  = [ 0x91 , 0x00 , 0x00 ];
    var  FIRMATA_PIN13_DIGITAL_HIGH_MESSAGE  = [ 0x91 , 0x20 , 0x00 ];
    función  deviceReady () {
        enviar ( FIRMATA_PIN13_DIGITAL_OUT_MESSAGE ). entonces ( función () {
            enviar ( FIRMATA_PIN13_DIGITAL_LOW_MESSAGE );
    })
        ;
    }
    función  ledOnPressed () {
        enviar ( FIRMATA_PIN13_DIGITAL_HIGH_MESSAGE );
    }
    función  ledOffPressed () {
        enviar ( FIRMATA_PIN13_DIGITAL_LOW_MESSAGE );
    }

     registro de función ( línea ) {
        consola . log (línea);
        previous_text =  documento . getElementById ( ' consoleTextArea ' ). innerHTML ;
        documento . getElementById ( ' consoleTextArea ' ). innerHTML  = previous_text + line +  " \ n " ;
    }
