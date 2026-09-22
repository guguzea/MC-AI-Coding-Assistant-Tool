---
title: "LevitationTrigger"
description: "public class LevitationTrigger extends java.lang.Object implements ICriterionTrigger<LevitationTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/LevitationTrigger.html"
sourceType: javadoc
---

# LevitationTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.LevitationTrigger

## Class signature

```java
public class LevitationTrigger extends java.lang.Object implements ICriterionTrigger<LevitationTrigger.Instance>
```

## Constructors

- `LevitationTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<LevitationTrigger.Instance> listener)`
- `LevitationTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<LevitationTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Vec3d startPos, int duration)`
