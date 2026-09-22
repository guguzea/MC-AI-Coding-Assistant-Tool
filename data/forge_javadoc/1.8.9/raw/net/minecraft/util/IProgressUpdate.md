---
title: "IProgressUpdate"
description: "public interface IProgressUpdate"
package: "net/minecraft/util"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/util/IProgressUpdate.html"
sourceType: javadoc
---

# IProgressUpdate

## Class signature

```java
public interface IProgressUpdate
```

## Methods

- `void displayLoadingString(java.lang.String message)` — Displays a string on the loading screen supposed to indicate what is being done currently.
- `void displaySavingString(java.lang.String message)` — Shows the 'Saving level' string.
- `void resetProgressAndMessage(java.lang.String message)` — this string, followed by "working..." and then the "% complete" are the 3 lines shown.
- `void setDoneWorking()`
- `void setLoadingProgress(int progress)` — Updates the progress bar on the loading screen to the specified amount.
