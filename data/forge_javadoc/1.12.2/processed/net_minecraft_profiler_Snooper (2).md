# Snooper

## Class signature

```java
public class Snooper extends java.lang.Object
```

## Constructors

- `public Snooper(java.lang.String side, ISnooperInfo playerStatCollector, long startTime)`

## Methods

- `public void startSnooper()`
- `public void addMemoryStatsToSnooper()`
- `public void addClientStat(java.lang.String statName, java.lang.Object statValue)`
- `public void addStatToSnooper(java.lang.String statName, java.lang.Object statValue)`
- `public java.util.Map<java.lang.String,java.lang.String> getCurrentStats()`
- `public boolean isSnooperRunning()`
- `public void stopSnooper()`
- `public java.lang.String getUniqueID()`
- `public long getMinecraftStartTimeMillis()`