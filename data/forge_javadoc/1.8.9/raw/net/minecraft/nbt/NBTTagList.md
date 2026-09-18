---
title: "NBTTagList"
description: "Adds the provided tag to the end of the list."
package: "net/minecraft/nbt"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/nbt/NBTTagList.html"
sourceType: javadoc
---

# NBTTagList

## Class signature

```java
public class NBTTagList extends NBTBase
```

## Constructors

- `public NBTTagList()`

## Methods

- `public byte getId()`
- `public java.lang.String toString()`
- `public void appendTag( NBTBase nbt)`
- `public void set(int idx, NBTBase nbt)`
- `public NBTBase removeTag(int i)`
- `public boolean hasNoTags()`
- `public NBTTagCompound getCompoundTagAt(int i)`
- `public int[] getIntArrayAt(int i)`
- `public double getDoubleAt(int i)`
- `public float getFloatAt(int i)`
- `public java.lang.String getStringTagAt(int i)`
- `public NBTBase get(int idx)`
- `public int tagCount()`
- `public NBTBase copy()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public int getTagType()`

## Description

Adds the provided tag to the end of the list.
