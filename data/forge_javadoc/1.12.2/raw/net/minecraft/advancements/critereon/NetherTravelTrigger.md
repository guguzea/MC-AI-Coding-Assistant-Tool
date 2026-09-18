---
title: "NetherTravelTrigger"
description: "public class NetherTravelTrigger extends java.lang.Object implements ICriterionTrigger < NetherTravelTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/NetherTravelTrigger.html"
sourceType: javadoc
---

# NetherTravelTrigger

## Class signature

```java
public class NetherTravelTrigger extends java.lang.Object implements ICriterionTrigger < NetherTravelTrigger.Instance >
```

## Constructors

- `public NetherTravelTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < NetherTravelTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < NetherTravelTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public NetherTravelTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, Vec3d enteredNetherPosition)`
