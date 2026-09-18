---
title: "ConstructBeaconTrigger"
description: "public class ConstructBeaconTrigger extends java.lang.Object implements ICriterionTrigger < ConstructBeaconTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ConstructBeaconTrigger.html"
sourceType: javadoc
---

# ConstructBeaconTrigger

## Class signature

```java
public class ConstructBeaconTrigger extends java.lang.Object implements ICriterionTrigger < ConstructBeaconTrigger.Instance >
```

## Constructors

- `public ConstructBeaconTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ConstructBeaconTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ConstructBeaconTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public ConstructBeaconTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, TileEntityBeacon beacon)`
