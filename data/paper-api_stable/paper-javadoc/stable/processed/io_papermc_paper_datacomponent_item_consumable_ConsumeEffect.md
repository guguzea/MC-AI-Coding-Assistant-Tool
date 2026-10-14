---
title: "io.papermc.paper.datacomponent.item.consumable.ConsumeEffect"
package: "io.papermc.paper.datacomponent.item.consumable"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/consumable/ConsumeEffect.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ConsumeEffect**
`@NonExtendable public interface ConsumeEffect`
- `@Contract(value="_ -> new", pure=true) static ConsumeEffect.TeleportRandomly teleportRandomlyEffect(float diameter)`
- `@Contract(value="_, _ -> new", pure=true) static ConsumeEffect.TeleportRandomly teleportRandomlyEffect(float diameter, boolean directionalParticles)`
- `@Contract(value="_ -> new", pure=true) static ConsumeEffect.RemoveStatusEffects removeEffects(RegistryKeySet<PotionEffectType> effects)`
- `@Contract(value="_ -> new", pure=true) static ConsumeEffect.PlaySound playSoundConsumeEffect(Key key)`
- `@Contract(value="-> new", pure=true) static ConsumeEffect.ClearAllStatusEffects clearAllStatusEffects()`
- `@Contract(value="_, _ -> new", pure=true) static ConsumeEffect.ApplyStatusEffects applyStatusEffects(List<PotionEffect> effects, float probability)`
