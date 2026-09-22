---
title: "CooldownTracker"
description: "public class CooldownTracker extends java.lang.Object"
package: "net/minecraft/util"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/CooldownTracker.html"
sourceType: javadoc
---

# CooldownTracker

**Inheritance:** java.lang.Object → net.minecraft.util.CooldownTracker

## Class signature

```java
public class CooldownTracker extends java.lang.Object
```

## Constructors

- `CooldownTracker()`

## Methods

- `float getCooldown(Item itemIn, float partialTicks)`
- `boolean hasCooldown(Item itemIn)`
- `protected void notifyOnRemove(Item itemIn)`
- `protected void notifyOnSet(Item itemIn, int ticksIn)`
- `void removeCooldown(Item itemIn)`
- `void setCooldown(Item itemIn, int ticksIn)`
- `void tick()`
