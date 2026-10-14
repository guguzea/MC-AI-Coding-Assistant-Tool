---
title: "io.papermc.paper.datapack.DatapackRegistrar"
package: "io.papermc.paper.datapack"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datapack/DatapackRegistrar.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DatapackRegistrar**
`@NonExtendable @Experimental @NullMarked public interface DatapackRegistrar extends Registrar`
- `@Contract(pure=true) boolean hasPackDiscovered(String name)`
- `@Contract(pure=true) DiscoveredDatapack getDiscoveredPack(String name)`
- `@Contract(mutates="this") boolean removeDiscoveredPack(String name)`
- `@Contract(pure=true) @Unmodifiable Map<String, DiscoveredDatapack> getDiscoveredPacks()`
- `default @Nullable DiscoveredDatapack discoverPack(URI uri, String id) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(URI uri, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
- `default @Nullable DiscoveredDatapack discoverPack(Path path, String id) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(Path path, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(PluginMeta pluginMeta, URI uri, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
- `@Nullable DiscoveredDatapack discoverPack(PluginMeta pluginMeta, Path path, String id, Consumer<DatapackRegistrar.Configurer> configurer) throws IOException`
