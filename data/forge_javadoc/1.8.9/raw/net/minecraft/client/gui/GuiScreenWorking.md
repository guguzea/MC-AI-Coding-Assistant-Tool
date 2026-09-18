---
title: "GuiScreenWorking"
description: "Displays a string on the loading screen supposed to indicate what is being done currently."
package: "net/minecraft/client/gui"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/gui/GuiScreenWorking.html"
sourceType: javadoc
---

# GuiScreenWorking

## Class signature

```java
public class GuiScreenWorking extends GuiScreen implements IProgressUpdate
```

## Constructors

- `public GuiScreenWorking()`

## Methods

- `public void displaySavingString(java.lang.String message)`
- `public void resetProgressAndMessage(java.lang.String message)`
- `public void displayLoadingString(java.lang.String message)`
- `public void setLoadingProgress(int progress)`
- `public void setDoneWorking()`
- `public void drawScreen(int mouseX, int mouseY, float partialTicks)`

## Description

Displays a string on the loading screen supposed to indicate what is being done currently.
