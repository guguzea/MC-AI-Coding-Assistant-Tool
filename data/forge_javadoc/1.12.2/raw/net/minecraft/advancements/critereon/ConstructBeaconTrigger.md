---
title: "ConstructBeaconTrigger"
description: "public class ConstructBeaconTrigger extends java.lang.Object implements ICriterionTrigger<ConstructBeaconTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ConstructBeaconTrigger.html"
sourceType: javadoc
---

# ConstructBeaconTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ConstructBeaconTrigger

## Class signature

```java
public class ConstructBeaconTrigger extends java.lang.Object implements ICriterionTrigger<ConstructBeaconTrigger.Instance>
```

## Constructors

- `ConstructBeaconTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConstructBeaconTrigger.Instance> listener)`
- `ConstructBeaconTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ConstructBeaconTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, TileEntityBeacon beacon)`
