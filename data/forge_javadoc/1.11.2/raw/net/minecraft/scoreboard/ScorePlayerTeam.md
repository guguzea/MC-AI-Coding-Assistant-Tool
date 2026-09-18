---
title: "ScorePlayerTeam"
description: "public class ScorePlayerTeam extends Team"
package: "net/minecraft/scoreboard"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/scoreboard/ScorePlayerTeam.html"
sourceType: javadoc
---

# ScorePlayerTeam

## Class signature

```java
public class ScorePlayerTeam extends Team
```

## Constructors

- `public ScorePlayerTeam( Scoreboard theScoreboardIn, java.lang.String name)`

## Methods

- `public java.lang.String getRegisteredName()`
- `public java.lang.String getTeamName()`
- `public void setTeamName(java.lang.String name)`
- `public java.util.Collection<java.lang.String> getMembershipCollection()`
- `public java.lang.String getColorPrefix()`
- `public void setNamePrefix(java.lang.String prefix)`
- `public java.lang.String getColorSuffix()`
- `public void setNameSuffix(java.lang.String suffix)`
- `public java.lang.String formatString(java.lang.String input)`
- `public static java.lang.String formatPlayerName(@Nullable Team teamIn, java.lang.String string)`
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
- `public void setChatFormat( TextFormatting format)`
- `public TextFormatting getChatFormat()`
