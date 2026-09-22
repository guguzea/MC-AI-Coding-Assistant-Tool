---
title: "PlayerHurtEntityTrigger"
description: "public class PlayerHurtEntityTrigger extends java.lang.Object implements ICriterionTrigger<PlayerHurtEntityTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/PlayerHurtEntityTrigger.html"
sourceType: javadoc
---

# PlayerHurtEntityTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.PlayerHurtEntityTrigger

## Class signature

```java
public class PlayerHurtEntityTrigger extends java.lang.Object implements ICriterionTrigger<PlayerHurtEntityTrigger.Instance>
```

## Constructors

- `PlayerHurtEntityTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlayerHurtEntityTrigger.Instance> listener)`
- `PlayerHurtEntityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PlayerHurtEntityTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Entity entityIn, DamageSource source, float amountDealt, float amountTaken, boolean blocked)`
