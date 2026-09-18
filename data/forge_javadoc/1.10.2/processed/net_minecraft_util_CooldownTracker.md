# CooldownTracker

## Class signature

```java
public class CooldownTracker extends java.lang.Object
```

## Constructors

- `public CooldownTracker()`

## Methods

- `public boolean hasCooldown( Item itemIn)`
- `public float getCooldown( Item itemIn, float partialTicks)`
- `public void tick()`
- `public void setCooldown( Item itemIn, int ticksIn)`
- `public void removeCooldown( Item itemIn)`
- `protected void notifyOnSet( Item itemIn, int ticksIn)`
- `protected void notifyOnRemove( Item itemIn)`