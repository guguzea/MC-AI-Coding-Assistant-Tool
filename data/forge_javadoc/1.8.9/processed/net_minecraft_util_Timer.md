# Timer

**Inheritance:** java.lang.Object → net.minecraft.util.Timer

## Class signature

```java
public class Timer extends java.lang.Object
```

## Constructors

- `Timer(float p_i1018_1_)`

## Methods

- `void updateTimer()` — Updates all fields of the Timer using the current time

## Fields

- `float elapsedPartialTicks` — How much time has elapsed since the last tick, in ticks (range: 0.0 - 1.0).
- `int elapsedTicks` — How many full ticks have turned over since the last call to updateTimer(), capped at 10.
- `float renderPartialTicks` — How much time has elapsed since the last tick, in ticks, for use by display rendering routines (range: 0.0 - 1.0).
- `float timerSpeed` — A multiplier to make the timer (and therefore the game) go faster or slower. 0.5 makes the game run at half- speed.