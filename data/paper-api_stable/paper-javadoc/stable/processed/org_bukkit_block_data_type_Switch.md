---
title: "org.bukkit.block.data.type.Switch"
package: "org.bukkit.block.data.type"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/data/type/Switch.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Switch**
`public interface Switch extends Directional, FaceAttachable, Powerable`
- `@NotNull @NotNull FaceAttachable.AttachedFace getAttachedFace()`
- `void setAttachedFace(@NotNull @NotNull FaceAttachable.AttachedFace face)`
- `@NotNull @Deprecated(since="1.15.2") default @NotNull Switch.Face getFace()`
- `@Deprecated(since="1.15.2") default void setFace(@NotNull @NotNull Switch.Face face)`
