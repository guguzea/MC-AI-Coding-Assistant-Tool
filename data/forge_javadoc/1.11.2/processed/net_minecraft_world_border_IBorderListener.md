# IBorderListener

## Class signature

```java
public interface IBorderListener
```

## Methods

- `void onCenterChanged(WorldBorder border, double x, double z)`
- `void onDamageAmountChanged(WorldBorder border, double newAmount)`
- `void onDamageBufferChanged(WorldBorder border, double newSize)`
- `void onSizeChanged(WorldBorder border, double newSize)`
- `void onTransitionStarted(WorldBorder border, double oldSize, double newSize, long time)`
- `void onWarningDistanceChanged(WorldBorder border, int newDistance)`
- `void onWarningTimeChanged(WorldBorder border, int newTime)`