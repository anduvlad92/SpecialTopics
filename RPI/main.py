import serial
import requests
import time
import socketio
from threading import Thread

arduino = serial.Serial('/dev/ttyACM0', 115200, timeout=.1)
sio = socketio.Client()


@sio.on('connect')
def on_connect():
    print('Im connected!')


@sio.on('light')
def on_message(data):
    changeLightState(data['state'])
    print(data['state'])


def start_server():
    sio.connect('http://192.168.1.129:8080')
    sio.wait()


def sendSensorValue(value):
    timestamp = int(time.time())
    requests.post('http://192.168.1.129:3000/sensor', data={'timestamp': timestamp, 'value': value}, timeout=5)

def changeLightState(state):
    if(state):
        arduino.write('t'.encode())
    else:
        arduino.write('f'.encode())

def startArduino():
    while True:
        data = arduino.readline()[:-2]  # the last bit gets rid of the new-line chars

        if data:
            value = 0
            try:
                value = int(data.decode())
            except:
                value = 0
            finally:
                sendSensorValue(value)

# startArduino()
if __name__ == '__main__':
    print("Program started")
    print("SocketIo started")
    Thread(target = start_server).start()
    print("Arduino started")
    Thread(target = startArduino).start()
