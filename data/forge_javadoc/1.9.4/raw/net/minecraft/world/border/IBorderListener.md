---
title: "IBorderListener"
description: "public interface IBorderListener"
package: "net/minecraft/world/border"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/border/IBorderListener.html"
sourceType: javadoc
---

# IBorderListener

## Class signature

```java
public interface IBorderListener
```

## Methods

- `void onSizeChanged( WorldBorder border, double newSize)`
- `void onTransitionStarted( WorldBorder border, double oldSize, double newSize, long time)`
- `void onCenterChanged( WorldBorder border, double x, double z)`
- `void onWarningTimeChanged( WorldBorder border, int newTime)`
- `void onWarningDistanceChanged( WorldBorder border, int newDistance)`
- `void onDamageAmountChanged( WorldBorder border, double newAmount)`
- `void onDamageBufferChanged( WorldBorder border, double newSize)`
