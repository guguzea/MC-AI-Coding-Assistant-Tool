---
title: "PlayerHurtEntityTrigger"
description: "public class PlayerHurtEntityTrigger extends java.lang.Object implements ICriterionTrigger < PlayerHurtEntityTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/PlayerHurtEntityTrigger.html"
sourceType: javadoc
---

# PlayerHurtEntityTrigger

## Class signature

```java
public class PlayerHurtEntityTrigger extends java.lang.Object implements ICriterionTrigger < PlayerHurtEntityTrigger.Instance >
```

## Constructors

- `public PlayerHurtEntityTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PlayerHurtEntityTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PlayerHurtEntityTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public PlayerHurtEntityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, Entity entityIn, DamageSource source, float amountDealt, float amountTaken, boolean blocked)`
