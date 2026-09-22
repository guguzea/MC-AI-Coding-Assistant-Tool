> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockeditor/editorchunkmanagement?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:27.654Z
> 警告：此文档可能滞后于当前正式版

# Chunk Management

Chunk Management lets you generate or delete chunks in your world to reset terrain to its original seed-generated state, clear out unwanted areas, or selectively rebuild specific regions.

## Operation modes

Chunk Management supports two operation modes which you can toggle between at the top of the panel.

### Regeneration mode

This mode regenerates chunks back to the original world seed terrain using one of two target modes:

- List : Only regenerates the chunks that overlap with regions you define in the region list. You can also enable Exclude Bounds to regenerate everything except the listed regions.

- World : Regenerates all chunks in the current dimension. When combined with a region list and Exclude Bounds enabled, the listed regions are protected from regeneration.

### Delete mode

Completely removes chunk data for the regions you define.

Deleted chunks will be regenerated when a player next visits the area.

## Using the chunk manager

- Open Chunk Management from the action bar.

- Select an Operation Mode .

- Define one or more regions using the region list: Enter Min and Max coordinates (X and Z) manually, then click Add Region .

- Click Add from Selection to use the current Editor selection bounds.

Regions are snapped to chunk boundaries (multiples of 16 blocks). A bounding box visualization appears in the viewport for each defined region.

- Click the region list entry to teleport to that area for verification.

- Click Regenerate or Delete to begin the operation. A confirmation dialog will appear before processing starts.

- A progress modal displays while chunks are being processed and reloaded. Important Chunk regeneration and deletion are irreversible operations that cannot be undone. Always verify your region bounds before confirming.

## Keyboard shortcuts

For the full list of Editor shortcuts, see Editor Hotkeys .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
