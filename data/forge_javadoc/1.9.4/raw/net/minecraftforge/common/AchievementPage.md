---
title: "AchievementPage"
description: "public class AchievementPage extends java.lang.Object"
package: "net/minecraftforge/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/common/AchievementPage.html"
sourceType: javadoc
---

# AchievementPage

**Inheritance:** java.lang.Object → net.minecraftforge.common.AchievementPage

## Class signature

```java
public class AchievementPage extends java.lang.Object
```

## Constructors

- `AchievementPage(java.lang.String name, Achievement ... achievements)`

## Methods

- `static AchievementPage getAchievementPage(int index)` — Will return an achievement page by its index on the list.
- `static AchievementPage getAchievementPage(java.lang.String name)` — Will return an achievement page by its name.
- `static java.util.Set<AchievementPage> getAchievementPages()` — Will return the list of achievement pages.
- `java.util.List<Achievement> getAchievements()`
- `java.lang.String getName()`
- `static java.lang.String getTitle(int index)`
- `static boolean isAchievementInPages(Achievement achievement)` — Will return whether an achievement is in any page or not.
- `static void registerAchievementPage(AchievementPage page)` — Registers an achievement page.
