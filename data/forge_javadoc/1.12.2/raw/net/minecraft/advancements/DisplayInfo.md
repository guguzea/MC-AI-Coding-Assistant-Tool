---
title: "DisplayInfo"
description: "public class DisplayInfo extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/DisplayInfo.html"
sourceType: javadoc
---

# DisplayInfo

**Inheritance:** java.lang.Object → net.minecraft.advancements.DisplayInfo

## Class signature

```java
public class DisplayInfo extends java.lang.Object
```

## Constructors

- `DisplayInfo(ItemStack icon, ITextComponent title, ITextComponent description, ResourceLocation background, FrameType frame, boolean showToast, boolean announceToChat, boolean hidden)`

## Methods

- `static DisplayInfo deserialize(JsonObject object, JsonDeserializationContext context)`
- `ResourceLocation getBackground()`
- `ITextComponent getDescription()`
- `FrameType getFrame()`
- `ItemStack getIcon()`
- `ITextComponent getTitle()`
- `float getX()`
- `float getY()`
- `boolean isHidden()`
- `static DisplayInfo read(PacketBuffer buf)`
- `void setPosition(float x, float y)`
- `boolean shouldAnnounceToChat()`
- `boolean shouldShowToast()`
- `void write(PacketBuffer buf)`
