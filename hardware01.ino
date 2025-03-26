const int button1Pin = 2;
const int button2Pin = 3;
const int led1Pin = 13;
const int led2Pin = 12;

void setup() {
  pinMode(button1Pin, INPUT);
  pinMode(button2Pin, INPUT);
  pinMode(led1Pin, OUTPUT);
  pinMode(led2Pin, OUTPUT);
}

void loop() {
  bool button1 = digitalRead(button1Pin);
  bool button2 = digitalRead(button2Pin);

  if (button1) {
    spookyBlink();
  } else if (button2) {
    chaoticFlicker();
  } else {
    digitalWrite(led1Pin, LOW);
    digitalWrite(led2Pin, LOW);
  }
}

void spookyBlink() {
  digitalWrite(led1Pin, HIGH);
  delay(500);
  digitalWrite(led1Pin, LOW);
  digitalWrite(led2Pin, HIGH);
  delay(500);
  digitalWrite(led2Pin, LOW);
}

void chaoticFlicker() {
  for (int i = 0; i < 10; i++) {
    digitalWrite(led1Pin, random(2));
    digitalWrite(led2Pin, random(2));
    delay(random(50, 200));
  }
}

