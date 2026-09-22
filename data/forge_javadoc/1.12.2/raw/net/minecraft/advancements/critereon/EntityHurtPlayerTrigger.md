---
title: "EntityHurtPlayerTrigger"
description: "public class EntityHurtPlayerTrigger extends java.lang.Object implements ICriterionTrigger<EntityHurtPlayerTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EntityHurtPlayerTrigger.html"
sourceType: javadoc
---

# EntityHurtPlayerTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EntityHurtPlayerTrigger

## Class signature

```java
public class EntityHurtPlayerTrigger extends java.lang.Object implements ICriterionTrigger<EntityHurtPlayerTrigger.Instance>
```

## Constructors

- `EntityHurtPlayerTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EntityHurtPlayerTrigger.Instance> listener)`
- `EntityHurtPlayerTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EntityHurtPlayerTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, DamageSource source, float amountDealt, float amountTaken, boolean wasBlocked)`
