const int JOYX_PIN    = A0;
const int SW_PIN      = 2;

const int SPEED_LED1  = 11;
const int SPEED_LED2  = 10;
const int SPEED_LED3  =  9;
const int CRASH_LED   = 13;


const int NUM_READINGS = 1;

struct AxisReadings {
  int readIndex = 0;
  int readings[NUM_READINGS];
  long total = 0;
  int average = 0;
  int zeroed = 0;
};

AxisReadings xAxis;
int lastSwValue = 0;
int speedLevel   = 1;
bool crashState  = false;

void setup() {
  Serial.begin(9600);
  pinMode(SW_PIN, INPUT_PULLUP);
  pinMode(SPEED_LED1, OUTPUT);
  pinMode(SPEED_LED2, OUTPUT);
  pinMode(SPEED_LED3, OUTPUT);
  pinMode(CRASH_LED,  OUTPUT);

  int v = analogRead(JOYX_PIN);
  xAxis.readings[0] = v;
  xAxis.total       = v;
  xAxis.average     = v;
  xAxis.zeroed      = v;

  updateSpeedLEDs();
}

void loop() {
  handleSerialCommands();

  if (!crashState) {
    int rawX = analogRead(JOYX_PIN);
    smoothAxis(&xAxis, rawX);

    int sw = !digitalRead(SW_PIN);
    if (sw == 1 && lastSwValue == 0) {
      speedLevel = (speedLevel % 3) + 1;
      updateSpeedLEDs();
    }
    lastSwValue = sw;
  }

  int xDelta = xAxis.average - xAxis.zeroed;
  Serial.print(xDelta);
  Serial.print(',');
  Serial.println(speedLevel);


  delay(5);
}

void handleSerialCommands() {
  while (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "crash") {
      crashState = true;
      digitalWrite(CRASH_LED, HIGH);
      digitalWrite(SPEED_LED1, LOW);
      digitalWrite(SPEED_LED2, LOW);
      digitalWrite(SPEED_LED3, LOW);
    }
    else if (cmd == "retry") {
      crashState = false;
      speedLevel = 1;
      digitalWrite(CRASH_LED, LOW);
      updateSpeedLEDs();
    }
  }
}

void updateSpeedLEDs() {
  digitalWrite(CRASH_LED, LOW);
  digitalWrite(SPEED_LED1, speedLevel >= 1);
  digitalWrite(SPEED_LED2, speedLevel >= 2);
  digitalWrite(SPEED_LED3, speedLevel >= 3);
}

void smoothAxis(AxisReadings *ar, int newValue) {
  ar->total -= ar->readings[ar->readIndex];
  ar->readings[ar->readIndex] = newValue;
  ar->total += newValue;
  ar->readIndex = (ar->readIndex + 1) % NUM_READINGS;
  ar->average = ar->total / NUM_READINGS;
}


