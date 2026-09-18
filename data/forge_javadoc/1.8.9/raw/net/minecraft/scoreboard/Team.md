---
title: "Team"
description: "Retrieve the name by which this team is registered in the scoreboard"
package: "net/minecraft/scoreboard"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/Team.html"
sourceType: javadoc
---

# Team

## Class signature

```java
public abstract class Team extends java.lang.Object
```

## Constructors

- `public Team()`

## Methods

- `public boolean isSameTeam( Team other)`
- `public abstract java.lang.String getRegisteredName()`
- `public abstract java.lang.String formatString(java.lang.String input)`
- `public abstract boolean getSeeFriendlyInvisiblesEnabled()`
- `public abstract boolean getAllowFriendlyFire()`
- `public abstract Team.EnumVisible getNameTagVisibility()`
- `public abstract java.util.Collection<java.lang.String> getMembershipCollection()`
- `public abstract Team.EnumVisible getDeathMessageVisibility()`

## Description

Retrieve the name by which this team is registered in the scoreboard
