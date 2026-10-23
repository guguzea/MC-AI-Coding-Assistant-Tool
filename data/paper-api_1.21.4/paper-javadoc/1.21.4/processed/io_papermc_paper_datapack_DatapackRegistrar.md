---
title: "io.papermc.paper.datapack.DatapackRegistrar"
package: "io.papermc.paper.datapack"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datapack/DatapackRegistrar.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(pure=true) boolean hasPackDiscovered(String name)`
- `@Contract(pure=true) DiscoveredDatapack getDiscoveredPack(String name)`
- `@Contract(mutates="this") boolean removeDiscoveredPack(String name)`
- `@Contract(pure=true) @Unmodifiable Map<String,DiscoveredDatapack> getDiscoveredPacks()`
- `default @Nullable DiscoveredDatapack discoverPack(URI uri, String id) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(URI uri, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
- `default @Nullable DiscoveredDatapack discoverPack(Path path, String id) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(Path path, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(PluginMeta pluginMeta, URI uri, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(PluginMeta pluginMeta, Path path, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
