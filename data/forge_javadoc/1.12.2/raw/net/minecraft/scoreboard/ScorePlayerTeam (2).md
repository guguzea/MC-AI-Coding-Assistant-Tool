---
title: "ScorePlayerTeam"
description: "public class ScorePlayerTeam extends Team"
package: "net/minecraft/scoreboard"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/scoreboard/ScorePlayerTeam.html"
sourceType: javadoc
---

# ScorePlayerTeam

## Class signature

```java
public class ScorePlayerTeam extends Team
```

## Constructors

- `public ScorePlayerTeam( Scoreboard scoreboardIn, java.lang.String name)`

## Methods

- `public java.lang.String getName()`
- `public java.lang.String getDisplayName()`
- `public void setDisplayName(java.lang.String name)`
- `public java.util.Collection<java.lang.String> getMembershipCollection()`
- `public java.lang.String getPrefix()`
- `public void setPrefix(java.lang.String prefix)`
- `public java.lang.String getSuffix()`
- `public void setSuffix(java.lang.String suffix)`
- `public java.lang.String formatString(java.lang.String input)`
- `public static java.lang.String formatPlayerName( Team teamIn, java.lang.String string)`
- `public boolean getAllowFriendlyFire()`
- `public void setAllowFriendlyFire(boolean friendlyFire)`
- `public boolean getSeeFriendlyInvisiblesEnabled()`
- `public void setSeeFriendlyInvisiblesEnabled(boolean friendlyInvisibles)`
- `public Team.EnumVisible getNameTagVisibility()`
- `public Team.EnumVisible getDeathMessageVisibility()`
- `public void setNameTagVisibility( Team.EnumVisible visibility)`
- `public void setDeathMessageVisibility( Team.EnumVisible visibility)`
- `public Team.CollisionRule getCollisionRule()`
- `public void setCollisionRule( Team.CollisionRule rule)`
- `public int getFriendlyFlags()`
- `public void setFriendlyFlags(int flags)`
- `public void setColor( TextFormatting color)`
- `public TextFormatting getColor()`
