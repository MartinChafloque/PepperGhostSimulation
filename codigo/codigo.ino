int percent = 0;
int prevPercent = 0;
int percent2 = 0;
int prevPercent2 = 0;
int percent3 = 0;
int prevPercent3 = 0;

void setup() {

  Serial.begin(9600);

}

void loop() {
  percent = round(analogRead(2) / 1024.00 * 100);

  if(percent != prevPercent){
    Serial.print("x: ");
    Serial.print(percent);
    Serial.println();
    prevPercent = percent;
  }
  delay(100);

  percent2 = round(analogRead(3) / 1024.00 * 100);

  if(percent2 != prevPercent2){
    Serial.print("y: ");
    Serial.print(percent2);
    Serial.println();
    prevPercent2 = percent2;
  }
  delay(100);

  percent3 = round(analogRead(5) / 1024.00 * 100);

  if(percent3 != prevPercent3){
    Serial.print("z: ");
    Serial.print(percent3);
    Serial.println();
    prevPercent3 = percent3;
  }
  delay(100);
}