---
title: "ModList"
description: "public class ModList extends java.lang.Object"
package: "net/minecraftforge/fml/relauncher/libraries"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/libraries/ModList.html"
sourceType: javadoc
---

# ModList

## Class signature

```java
public class ModList extends java.lang.Object
```

## Constructors

- `protected ModList( Repository repo)`

## Methods

- `public static ModList create(java.io.File json, java.io.File mcdir)`
- `public static java.util.List< ModList > getKnownLists(java.io.File mcdir)`
- `public static java.util.List< ModList > getBasicLists(java.io.File mcdir)`
- `public Repository getRepository()`
- `public void add( Artifact artifact)`
- `public java.util.List< Artifact > getArtifacts()`
- `public boolean changed()`
- `public void save() throws java.io.IOException`
- `public java.util.List< Artifact > flatten()`
- `public java.lang.Object getName()`
