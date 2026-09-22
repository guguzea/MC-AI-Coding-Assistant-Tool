---
title: "CombatTracker"
description: "public class CombatTracker extends java.lang.Object"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/CombatTracker.html"
sourceType: javadoc
---

# CombatTracker

**Inheritance:** java.lang.Object → net.minecraft.util.CombatTracker

## Class signature

```java
public class CombatTracker extends java.lang.Object
```

## Constructors

- `CombatTracker(EntityLivingBase fighterIn)`

## Methods

- `int func_180134_f()`
- `void func_94545_a()`
- `EntityLivingBase func_94550_c()`
- `IChatComponent getDeathMessage()`
- `EntityLivingBase getFighter()` — Returns EntityLivingBase assigned for this CombatTracker
- `void reset()` — Resets this trackers list of combat entries
- `void trackDamage(DamageSource damageSrc, float healthIn, float damageAmount)` — Adds an entry for the combat tracker
