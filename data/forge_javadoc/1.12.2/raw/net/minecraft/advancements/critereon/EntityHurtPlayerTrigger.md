---
title: "EntityHurtPlayerTrigger"
description: "public class EntityHurtPlayerTrigger extends java.lang.Object implements ICriterionTrigger < EntityHurtPlayerTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EntityHurtPlayerTrigger.html"
sourceType: javadoc
---

# EntityHurtPlayerTrigger

## Class signature

```java
public class EntityHurtPlayerTrigger extends java.lang.Object implements ICriterionTrigger < EntityHurtPlayerTrigger.Instance >
```

## Constructors

- `public EntityHurtPlayerTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EntityHurtPlayerTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EntityHurtPlayerTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EntityHurtPlayerTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, DamageSource source, float amountDealt, float amountTaken, boolean wasBlocked)`
