 #include "Time.h"
//#include "Time.cpp"
#include <LiquidCrystal.h>
#include <SoftwareSerial.h>
#include "HX711.h"
#include "config.h"
#include "functions.h"

#define PUBLISH_INTERVAL 10*(1000)

HX711 scale;
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);
String project = "Fitchen";
float unit = 0.00;
void setup() {
  initialize();
  lcd.begin(16, 2);
  Serial.begin(9600);
  Serial.println("HX711 Demo");

  Serial.println("Initializing the scale");
  // parameter "gain" is ommited; the default value 128 is used by the library
  // HX711.DOUT  - pin #A1
  // HX711.PD_SCK - pin #A0
  scale.begin(A1, A0);

  Serial.println("Before setting up the scale:");
  Serial.print("read: \t\t");
  Serial.println(scale.read());     // print a raw reading from the ADC

  Serial.print("read average: \t\t");
  Serial.println(scale.read_average(20));   // print the average of 20 readings from the ADC

  Serial.print("get value: \t\t");
  Serial.println(scale.get_value(5));   // print the average of 5 readings from the ADC minus the tare weight (not set yet)

  Serial.print("get units: \t\t");
  Serial.println(scale.get_units(5), 1);  // print the average of 5 readings from the ADC minus tare weight (not set) divided
            // by the SCALE parameter (not set yet)

  scale.set_scale(50.f);                      // this value is obtained by calibrating the scale with known weights; see the README for details
  scale.tare();               // reset the scale to 0

  Serial.println("After setting up the scale:");

  Serial.print("read: \t\t");
  Serial.println(scale.read());                 // print a raw reading from the ADC

  Serial.print("read average: \t\t");
  Serial.println(scale.read_average(20));       // print the average of 20 readings from the ADC

  Serial.print("get value: \t\t");
  Serial.println(scale.get_value(5));   // print the average of 5 readings from the ADC minus the tare weight, set with tare()

  Serial.print("get units: \t\t");
  unit = scale.get_units(5) * 6.0/4000;
  Serial.println(unit, 1);        // print the average of 5 readings from the ADC minus tare weight, divided
            // by the SCALE parameter set with set_scale

  Serial.println("Readings:");
}

void loop() {
  lcd.clear();
  lcd.print("Reading...");
  Serial.print("one reading:\t");
  Serial.print(scale.get_units(), 1);
  Serial.print("\t| average:\t");
  Serial.println(scale.get_units(10), 1);
  float value = scale.get_units(10) * 6.0/4000;

  lcd.clear();
  
  if(value > unit) {
      if(millis() - old_time > PUBLISH_INTERVAL){
    
    double values[] = {0,0,value}; // Max 3 numbered items
    sendToIFTTT(values, sizeof(values)/sizeof(double));

    old_time = millis();
  }
    lcd.print(String(project) + " " + String(value));
  }
  else
  lcd.print(String(project) + " 0.00");
  
  lcd.display();
  scale.power_down();             // put the ADC in sleep mode
  delay(1000);
  scale.power_up();
}
