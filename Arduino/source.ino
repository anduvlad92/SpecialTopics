#include <simpleRPC.h>

int sensorPin = A5;
int ledPin = 10;
boolean state = false;
void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(115200); // use the same baud-rate as the python side
}
void loop() {
  Serial.println(analogRead(sensorPin)); // write a string
  readState();
//    interface(
//    inc, "inc: Increment a value. @a: Value. @return: a + 1.",
//    setLed, "set_led: Set LED brightness. @brightness: Brightness.");
  delay(50);
}

void readState(){
  if(Serial.available() > 0){
    char state = Serial.read();
    if(state == 't'){
      changeState(true);
    }else{
      changeState(false);
    }
  }
}

void changeState(boolean state){
  if(state){
    digitalWrite(ledPin,HIGH);
  }else{
    digitalWrite(ledPin,LOW);
  }
}
