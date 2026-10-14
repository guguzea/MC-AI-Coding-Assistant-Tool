---
title: "io.papermc.paper.registry.data.client.ClientTextureAsset"
package: "io.papermc.paper.registry.data.client"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/client/ClientTextureAsset.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ClientTextureAsset**
`@NonExtendable public interface ClientTextureAsset`
- `Key identifier()`
- `Key texturePath()`
- `@Contract("_,_ -> new") static ClientTextureAsset clientTextureAsset(Key identifier, Key texturePath)`
- `@Contract("_ -> new") static ClientTextureAsset clientTextureAsset(Key identifier)`
- `@Contract("_ -> new") static ClientTextureAsset clientTextureAsset(@KeyPattern String identifier)`
