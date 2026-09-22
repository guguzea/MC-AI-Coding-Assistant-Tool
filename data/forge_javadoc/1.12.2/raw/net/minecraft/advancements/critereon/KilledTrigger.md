---
title: "KilledTrigger"
description: "public class KilledTrigger extends java.lang.Object implements ICriterionTrigger<KilledTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/KilledTrigger.html"
sourceType: javadoc
---

# KilledTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.KilledTrigger

## Class signature

```java
public class KilledTrigger extends java.lang.Object implements ICriterionTrigger<KilledTrigger.Instance>
```

## Constructors

- `KilledTrigger(ResourceLocation id)`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<KilledTrigger.Instance> listener)`
- `KilledTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<KilledTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Entity entity, DamageSource source)`
