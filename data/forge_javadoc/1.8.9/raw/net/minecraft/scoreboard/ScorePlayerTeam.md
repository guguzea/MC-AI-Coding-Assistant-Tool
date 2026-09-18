---
title: "ScorePlayerTeam"
description: "Returns the player name including the color prefixes and suffixes"
package: "net/minecraft/scoreboard"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/ScorePlayerTeam.html"
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
- `public static java.lang.String formatPlayerName( Team p_96667_0_, java.lang.String p_96667_1_)`
- `public boolean getAllowFriendlyFire()`
- `public void setAllowFriendlyFire(boolean friendlyFire)`
- `public boolean getSeeFriendlyInvisiblesEnabled()`
- `public void setSeeFriendlyInvisiblesEnabled(boolean friendlyInvisibles)`
- `public Team.EnumVisible getNameTagVisibility()`
- `public Team.EnumVisible getDeathMessageVisibility()`
- `public void setNameTagVisibility( Team.EnumVisible p_178772_1_)`
- `public void setDeathMessageVisibility( Team.EnumVisible p_178773_1_)`
- `public int func_98299_i()`
- `public void func_98298_a(int p_98298_1_)`
- `public void setChatFormat( EnumChatFormatting p_178774_1_)`
- `public EnumChatFormatting getChatFormat()`

## Description

Returns the player name including the color prefixes and suffixes
