---
title: "NetherTravelTrigger"
description: "public class NetherTravelTrigger extends java.lang.Object implements ICriterionTrigger<NetherTravelTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/NetherTravelTrigger.html"
sourceType: javadoc
---

# NetherTravelTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.NetherTravelTrigger

## Class signature

```java
public class NetherTravelTrigger extends java.lang.Object implements ICriterionTrigger<NetherTravelTrigger.Instance>
```

## Constructors

- `NetherTravelTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<NetherTravelTrigger.Instance> listener)`
- `NetherTravelTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<NetherTravelTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Vec3d enteredNetherPosition)`
