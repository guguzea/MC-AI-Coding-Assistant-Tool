---
title: "io.papermc.paper.ServerBuildInfo"
package: "io.papermc.paper"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/ServerBuildInfo.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ServerBuildInfo**
`@NonExtendable public interface ServerBuildInfo`
- `static final Key BRAND_PAPER_ID`
- `static ServerBuildInfo buildInfo()`
- `Key brandId()`
- `boolean isBrandCompatible(Key brandId)`
- `String brandName()`
- `String minecraftVersionId()`
- `String minecraftVersionName()`
- `OptionalInt buildNumber()`
- `Instant buildTime()`
- `Optional<String> gitBranch()`
- `Optional<String> gitCommit()`
- `String asString(ServerBuildInfo.StringRepresentation representation)`
