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
- `public static AchievementPage getAchievementPage(java.lang.String name)`
- `public static java.util.Set< AchievementPage > getAchievementPages()`
- `public static boolean isAchievementInPages( Achievement achievement)`
- `public static java.lang.String getTitle(int index)`

## Description

Will return an achievement page by its index on the list.