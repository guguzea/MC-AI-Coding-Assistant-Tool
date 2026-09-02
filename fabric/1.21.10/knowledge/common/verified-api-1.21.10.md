# Fabric 1.21.10 已核实 API

来源：search_fabric_docs version=1.21.10（仅 github_raw_versioned）。禁止把 1.21.11 wiki 当本档。

| 名称 | 出处文档 id |
|------|-------------|
| PayloadTypeRegistry.playS2C / playC2S | 1.21.10/develop_networking |
| CustomPayload.Id / PacketCodec | 1.21.10/develop_networking |
| ServerPlayNetworking.send / registerGlobalReceiver | 1.21.10/develop_networking |
| ClientPlayNetworking.send / registerGlobalReceiver | 1.21.10/develop_networking |
| ItemGroupEvents.modifyEntriesEvent | 1.21.10/develop_items_first-item |
| CompostableItemRegistry | 1.21.10/develop_items_first-item |
| FuelRegistryEvents.BUILD | 1.21.10/develop_items_first-item |
| BlockEntity / BlockEntityType | 1.21.10/develop_blocks_block-entities |
| FabricBlockEntityTypeBuilder.Factory | 1.21.10/develop_blocks_block-entities |
| DataGeneratorEntrypoint#onInitializeDataGenerator | 1.21.10/develop_data-generation_setup |
| Item.Properties | 1.21.10/develop_items_first-item |
| loom / fabric-loom | 1.21.10/develop_loom_index |
| AttachmentRegistry.create / createPersistent / createDefaulted | 1.21.10/develop_data-attachments |
| AttachmentSyncPredicate.all / targetOnly / allButTarget | 1.21.10/develop_data-attachments |
| hasAttached / getAttached / getAttachedOrThrow / getAttachedOrSet / getAttachedOrElse | 1.21.10/develop_data-attachments |
| setAttached / modifyAttached / removeAttached | 1.21.10/develop_data-attachments |
| 注入目标 Entity / BlockEntity / ServerLevel / ChunkAccess | 1.21.10/develop_data-attachments |

Attachment 只登记到简名：该页正文只写简名，示例代码是 `@[code](@/reference/1.21.10/…)` include，仓库内没有 `reference/` 目录。所以 `net.fabricmc.fabric.api.attachment.v1.*` FQCN 与 `fabric-attachment-api-v1` 模块 id 在本档 **未核实**（该版也没有 fabric-api 摘要可查），禁止当已核实依赖坐标输出。

核不到的类名写成「以该版文档为准，禁止默写」。
