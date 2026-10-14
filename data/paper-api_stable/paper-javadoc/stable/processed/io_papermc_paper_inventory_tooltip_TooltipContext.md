---
title: "io.papermc.paper.inventory.tooltip.TooltipContext"
package: "io.papermc.paper.inventory.tooltip"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/inventory/tooltip/TooltipContext.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TooltipContext**
`@NullMarked public interface TooltipContext`
- `@Contract("_, _ -> new") static TooltipContext create(boolean advanced, boolean creative)`
- `@Contract("-> new") static TooltipContext create()`
- `boolean isAdvanced()`
- `boolean isCreative()`
- `@Contract("-> new") TooltipContext asAdvanced()`
- `@Contract("-> new") TooltipContext asCreative()`
