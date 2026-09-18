---
title: "AchievementPage"
description: "Will return an achievement page by its index on the list."
package: "net/minecraftforge/common"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/common/AchievementPage.html"
sourceType: javadoc
---

# AchievementPage

## Class signature

```java
public class AchievementPage extends java.lang.Object
```

## Constructors

- `public AchievementPage(java.lang.String name, Achievement ... achievements)`

## Methods

- `public java.lang.String getName()`
- `public java.util.List< Achievement > getAchievements()`
- `public static void registerAchievementPage( AchievementPage page)`
- `public static AchievementPage getAchievementPage(int index)`
- `@Nullable public static AchievementPage getAchievementPage(java.lang.String name)`
- `public static java.util.Set< AchievementPage > getAchievementPages()`
- `public static boolean isAchievementInPages( Achievement achievement)`
- `public static java.lang.String getTitle(int index)`

## Description

Will return an achievement page by its index on the list.
