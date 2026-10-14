---
title: "org.bukkit.entity.Llama"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Llama.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Llama**
`public interface Llama extends ChestedHorse, RangedEntity`
- `@NotNull @NotNull Llama.Color getColor()`
- `void setColor(@NotNull @NotNull Llama.Color color)`
- `int getStrength()`
- `void setStrength(int strength)`
- `@NotNull @NotNull LlamaInventory getInventory()`
- `boolean inCaravan()`
- `void joinCaravan(@NotNull @NotNull Llama llama)`
- `void leaveCaravan()`
- `@Nullable @Nullable Llama getCaravanHead()`
- `boolean hasCaravanTail()`
- `@Nullable @Nullable Llama getCaravanTail()`
