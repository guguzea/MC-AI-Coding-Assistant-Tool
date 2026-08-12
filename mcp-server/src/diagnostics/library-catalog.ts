// 由 scripts/build-library-catalog-from-authored.mjs 自动生成，勿手改（D 波次只 patch verifiedApi）
export interface LibraryCatalogEntry { id: string; modIds: string[]; loaders: string[]; modrinthSlug: string; role: "api" | "author_shared" | "trap"; communityDocId: string; skillId?: string; officialUrls: string[]; notes: string; verifiedApi: Record<string, unknown>; }
export const LIBRARY_CATALOG: LibraryCatalogEntry[] = [
  {
    id: "authored/lib-architectury",
    modIds: ["architectury"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "architectury-api",
    role: "api",
    communityDocId: "authored/lib-architectury",
    skillId: "mc-architectury",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury"
        ],
        "entrypoints": [
          "dev.architectury.utils.fabric.GameInstanceImpl::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.compat.fabric.ModMenuCompatibility"
        ],
        "notes": "以官方文档为准"
      },
      "1.16.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.architectury.compat.fabric.ModMenuCompatibility",
          "me.shedaniel.architectury.init.fabric.ArchitecturyClient::init",
          "me.shedaniel.architectury.init.fabric.ArchitecturyServer::init",
          "me.shedaniel.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2-pre2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "22w43a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "22w43a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w13a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w13a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w31a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w31a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w35a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w35a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "24w09a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "24w14potato/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "22w44a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "22w44a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w13a_or_b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w13a_or_b/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w32a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w32a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w40a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w40a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "24w12a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "24w40a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3-pre2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "22w42a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "22w42a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w03a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w03a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w18a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w18a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w33a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w33a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w41a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "23w41a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "24w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [
          "dev.architectury.compat.fabric.ModMenuCompatibility",
          "dev.architectury.init.fabric.ArchitecturyClient::init",
          "dev.architectury.init.fabric.ArchitecturyServer::init",
          "dev.architectury.utils.fabric.GameInstanceImpl::init"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.architectury.annotations"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-balm",
    modIds: ["balm"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "balm",
    role: "api",
    communityDocId: "authored/lib-balm",
    skillId: "mc-balm",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "26.1.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.client.internal.FabricBalmClient",
          "net.blay09.mods.balm.fabric.internal.FabricBalm",
          "net.blay09.mods.balm.fabric.platform.compatibility.modmenu.internal.ModMenuIntegration",
          "net.blay09.mods.balm.platform.compatibility.hudinfo.internal.JadeModIntegration",
          "net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat",
          "net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.client.internal.FabricBalmClient",
          "net.blay09.mods.balm.fabric.internal.FabricBalm",
          "net.blay09.mods.balm.fabric.platform.compatibility.hudinfo.internal.FabricJadeModCompat",
          "net.blay09.mods.balm.fabric.platform.compatibility.modmenu.internal.ModMenuIntegration",
          "net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.FabricBalm",
          "net.blay09.mods.balm.fabric.client.FabricBalmClient",
          "net.blay09.mods.balm.fabric.compat.ModMenuIntegration",
          "net.blay09.mods.balm.fabric.compat.hudinfo.FabricJadeModCompat"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.client.internal.FabricBalmClient",
          "net.blay09.mods.balm.fabric.internal.FabricBalm",
          "net.blay09.mods.balm.fabric.platform.compatibility.modmenu.internal.ModMenuIntegration",
          "net.blay09.mods.balm.platform.compatibility.hudinfo.internal.JadeModIntegration",
          "net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.client.internal.FabricBalmClient",
          "net.blay09.mods.balm.fabric.internal.FabricBalm",
          "net.blay09.mods.balm.fabric.platform.compatibility.modmenu.internal.ModMenuIntegration",
          "net.blay09.mods.balm.platform.compatibility.hudinfo.internal.JadeModIntegration",
          "net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.blay09.mods"
        ],
        "entrypoints": [
          "net.blay09.mods.balm.fabric.client.internal.FabricBalmClient",
          "net.blay09.mods.balm.fabric.internal.FabricBalm",
          "net.blay09.mods.balm.fabric.platform.compatibility.modmenu.internal.ModMenuIntegration",
          "net.blay09.mods.balm.platform.compatibility.hudinfo.internal.JadeModIntegration",
          "net.blay09.mods.balm.platform.compatibility.recipeviewer.internal.jei.CommonJeiPlugin"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-bookshelf",
    modIds: ["bookshelf"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "bookshelf-lib",
    role: "author_shared",
    communityDocId: "authored/lib-bookshelf",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.11.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.13.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.12/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabricClient",
          "net.darkhax.bookshelf.BookshelfFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabricClient",
          "net.darkhax.bookshelf.BookshelfFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.fabric.impl.FabricMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.fabric.impl.FabricMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.fabric.impl.FabricMod",
          "net.darkhax.bookshelf.fabric.impl.FabricModClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.fabric.impl.FabricMod",
          "net.darkhax.bookshelf.fabric.impl.FabricModClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.7.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.9.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.fabric.BookshelfFabric",
          "net.darkhax.bookshelf.fabric.BookshelfFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.10.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.BookshelfFabric",
          "net.darkhax.bookshelf.impl.gametest.BookshelfGameTests"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.8.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [
          "net.darkhax.bookshelf.common.impl.addons.jei.BookshelfJeiPlugin",
          "net.darkhax.bookshelf.fabric.BookshelfFabric",
          "net.darkhax.bookshelf.fabric.BookshelfFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-caelus",
    modIds: ["caelus"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "caelus",
    role: "api",
    communityDocId: "authored/lib-caelus",
    skillId: "mc-caelus",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.13.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [
          "top.theillusivec4.caelus.loader.common.CaelusMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.illusivesoulworks.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.illusivesoulworks.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [
          "top.theillusivec4.caelus.CaelusMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.illusivesoulworks.caelus"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-cca",
    modIds: ["cardinal-components"],
    loaders: ["fabric","quilt"],
    modrinthSlug: "cardinal-components-api",
    role: "api",
    communityDocId: "authored/lib-cca",
    skillId: "mc-cca",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-pre-2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-pre-2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-rc-2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-rc-2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-cloth-config",
    modIds: ["cloth-config"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "cloth-config",
    role: "api",
    communityDocId: "authored/lib-cloth-config",
    skillId: "mc-config",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel.clothconfig2",
          "me.shedaniel.autoconfig"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "以官方文档为准"
      },
      "1.14/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.clothconfig2.ClothConfigInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.15/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "23w13a_or_b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "24w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.clothconfig2.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "23w31a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "24w14potato/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.clothconfig2.ClothConfigInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.16/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "22w43a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "24w09a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "24w36a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.shedaniel"
        ],
        "entrypoints": [
          "me.shedaniel.autoconfig.example.ExampleInits::exampleCommonInit",
          "me.shedaniel.clothconfig2.fabric.ClothConfigModMenuDemo"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-collective",
    modIds: ["collective"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "collective",
    role: "author_shared",
    communityDocId: "authored/lib-collective",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective_fabric"
        ],
        "entrypoints": [
          "com.natamus.collective_fabric.CollectiveFabric",
          "com.natamus.collective_fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.CollectiveModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.natamus.collective"
        ],
        "entrypoints": [
          "com.natamus.collective.CollectiveFabric",
          "com.natamus.collective.CollectiveFabricClient",
          "com.natamus.collective.fabric.config.FabricCollectiveConfigScreen"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-config-legacy",
    modIds: ["config-legacy"],
    loaders: ["fabric"],
    modrinthSlug: "",
    role: "api",
    communityDocId: "authored/lib-config-legacy",
    skillId: "mc-config",
    officialUrls: [],
    notes: "",
    verifiedApi: {},
  },
  {
    id: "authored/lib-corgilib",
    modIds: ["corgilib"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "corgilib",
    role: "author_shared",
    communityDocId: "authored/lib-corgilib",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.CorgiLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib",
          "dev.corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib",
          "dev.corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib",
          "dev.corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib",
          "dev.corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.CorgiLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.CorgiLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [
          "corgitaco.corgilib.fabric.CorgiLibFabric",
          "corgitaco.corgilib.fabric.client.CorgiLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "corgitaco.corgilib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-creativecore",
    modIds: ["creativecore"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "creativecore",
    role: "author_shared",
    communityDocId: "authored/lib-creativecore",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.client",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.client",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.client",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.client",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.api",
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.client",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.neoforged.api",
          "team.creative"
        ],
        "entrypoints": [
          "team.creative.creativecore.CreativeCore",
          "team.creative.creativecore.client.CreativeCoreClient",
          "team.creative.creativecore.client.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "team.creative"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-curios",
    modIds: ["curios"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "curios",
    role: "api",
    communityDocId: "authored/lib-curios",
    skillId: "mc-curios",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "以官方文档为准"
      },
      "1.14.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [
          "top.theillusivec4.curios.client.CuriosClient",
          "top.theillusivec4.curios.common.CuriosCommon",
          "top.theillusivec4.curios.integration.CuriosReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.13.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "licenses",
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "top.theillusivec4.curios"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-fabric-language-kotlin",
    modIds: ["fabric-language-kotlin"],
    loaders: ["fabric"],
    modrinthSlug: "fabric-language-kotlin",
    role: "api",
    communityDocId: "authored/lib-fabric-language-kotlin",
    skillId: "mc-kotlin",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.14/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.language"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.fabricmc.language"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-forge-config-api-port",
    modIds: ["forgeconfigapiport"],
    loaders: ["fabric"],
    modrinthSlug: "forge-config-api-port",
    role: "api",
    communityDocId: "authored/lib-forge-config-api-port",
    skillId: "mc-config",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.16/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api"
        ],
        "entrypoints": [
          "net.minecraftforge.ForgeConfigAPIPort",
          "net.minecraftforge.client.ForgeConfigAPIPortClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api"
        ],
        "entrypoints": [
          "net.minecraftforge.ForgeConfigAPIPort",
          "net.minecraftforge.client.ForgeConfigAPIPortClient",
          "net.minecraftforge.modmenu.ConfigFactoryHandler"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.electronwill.nightconfig",
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.neoforged.fml"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api"
        ],
        "entrypoints": [
          "net.minecraftforge.ForgeConfigAPIPort",
          "net.minecraftforge.client.ForgeConfigAPIPortClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.api"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.electronwill.nightconfig",
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.minecraftforge.api"
        ],
        "entrypoints": [
          "net.minecraftforge.ForgeConfigAPIPort",
          "net.minecraftforge.client.ForgeConfigAPIPortClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.api"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.forgeconfigapiport",
          "net.minecraftforge.common"
        ],
        "entrypoints": [
          "fuzs.forgeconfigapiport.fabric.impl.ForgeConfigAPIPortFabric",
          "fuzs.forgeconfigapiport.fabric.impl.client.ForgeConfigAPIPortFabricClient",
          "fuzs.forgeconfigapiport.fabric.impl.integration.modmenu.ModMenuApiImpl"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-fzzy-config",
    modIds: ["fzzy-config"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "fzzy-config",
    role: "api",
    communityDocId: "authored/lib-fzzy-config",
    skillId: "mc-config",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "24w34a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "24w34a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "24w40a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "24w40a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "24w18a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "24w18a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "me.fzzyhmstrs"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-geckolib",
    modIds: ["geckolib"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "geckolib",
    role: "api",
    communityDocId: "authored/lib-geckolib",
    skillId: "mc-geckolib",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie.geckolib"
        ],
        "entrypoints": [
          "software.bernie.example.GeckoLibMod",
          "software.bernie.example.ClientListener"
        ],
        "notes": "以官方文档为准"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod",
          "software.bernie.geckolib3.network.ClientPackets"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod",
          "software.bernie.geckolib3.network.ClientPackets"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [
          "com.geckolib.GeckoLib",
          "com.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fabric.mod.json",
          "geckolib-fabric-1.19-refmap.json",
          "geckolib.aw",
          "geckolib.png"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod",
          "software.bernie.geckolib3.network.ClientPackets"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.intellij.lang",
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod",
          "software.bernie.geckolib3.network.ClientPackets"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.geckolib.GeckoLib",
          "software.bernie.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w42a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.apache.commons",
          "software.bernie"
        ],
        "entrypoints": [
          "software.bernie.example.ClientListener",
          "software.bernie.example.GeckoLibMod",
          "software.bernie.geckolib3.network.ClientPackets"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [
          "com.geckolib.GeckoLib",
          "com.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.geckolib.animatable"
        ],
        "entrypoints": [
          "com.geckolib.GeckoLib",
          "com.geckolib.GeckoLibClient"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-glitchcore",
    modIds: ["glitchcore"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "glitchcore",
    role: "author_shared",
    communityDocId: "authored/lib-glitchcore",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.10.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "glitchcore.config"
        ],
        "entrypoints": [
          "glitchcore.fabric.core.GlitchCoreFabric",
          "glitchcore.fabric.core.GlitchCoreFabricClient"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-iceberg",
    modIds: ["iceberg"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "iceberg",
    role: "author_shared",
    communityDocId: "authored/lib-iceberg",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.fabric.client.IcebergFabricClient",
          "com.anthonyhilyard.iceberg.fabric.server.IcebergFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [
          "com.anthonyhilyard.iceberg.IcebergClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.anthonyhilyard.iceberg"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-impersonate",
    modIds: ["impersonate"],
    loaders: ["fabric","quilt"],
    modrinthSlug: "impersonate",
    role: "api",
    communityDocId: "authored/lib-impersonate",
    skillId: "mc-impersonate",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.impersonate.Impersonate",
          "io.github.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.impersonate"
        ],
        "entrypoints": [
          "org.ladysnake.impersonate.Impersonate",
          "org.ladysnake.impersonate.impl.ImpersonateClient"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-kiwi",
    modIds: ["kiwi"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "kiwi",
    role: "author_shared",
    communityDocId: "authored/lib-kiwi",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.customization.compat.jade.JadeCompat",
          "snownee.kiwi.customization.compat.jei.JEICompat",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientPlatform",
          "snownee.kiwi.loader.Platform"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.customization.compat.jade.JadeCompat",
          "snownee.kiwi.customization.compat.jei.JEICompat",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientPlatform",
          "snownee.kiwi.loader.Platform"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "24w11a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.customization.compat.emi.EMICompat",
          "snownee.kiwi.customization.compat.jade.JadeCompat",
          "snownee.kiwi.customization.compat.jei.JEICompat",
          "snownee.kiwi.customization.compat.rei.REICompat",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.customization.compat.emi.EMICompat",
          "snownee.kiwi.customization.compat.jade.JadeCompat",
          "snownee.kiwi.customization.compat.jei.JEICompat",
          "snownee.kiwi.customization.compat.rei.REICompat",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.Initializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.customization.compat.emi.EMICompat",
          "snownee.kiwi.customization.compat.jade.JadeCompat",
          "snownee.kiwi.customization.compat.jei.JEICompat",
          "snownee.kiwi.customization.compat.rei.REICompat",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.customization.compat.emi.EMICompat",
          "snownee.kiwi.customization.compat.jade.JadeCompat",
          "snownee.kiwi.customization.compat.jei.JEICompat",
          "snownee.kiwi.customization.compat.rei.REICompat",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "24w12a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "snownee.kiwi"
        ],
        "entrypoints": [
          "snownee.kiwi.Kiwi",
          "snownee.kiwi.config.ModMenuIntegration",
          "snownee.kiwi.datagen.KiwiDataGen",
          "snownee.kiwi.loader.ClientInitializer"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-kotlin-for-forge",
    modIds: ["kotlinforforge"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "kotlin-for-forge",
    role: "api",
    communityDocId: "authored/lib-kotlin-for-forge",
    skillId: "mc-kotlin",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "kotlin.annotation",
          "kotlinx.coroutines",
          "net.minecraftforge.fml",
          "org.intellij.lang",
          "thedarkcolour.kotlinforforge"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-kubejs",
    modIds: ["kubejs"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "kubejs",
    role: "api",
    communityDocId: "authored/lib-kubejs",
    skillId: "mc-kubejs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [
          "dev.latvian.mods.kubejs.fabric.KubeJSFabric",
          "dev.latvian.mods.kubejs.integration.rei.KubeJSREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.latvian.mods"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-libgui",
    modIds: ["libgui"],
    loaders: ["fabric"],
    modrinthSlug: "",
    role: "api",
    communityDocId: "authored/lib-libgui",
    skillId: "mc-libgui",
    officialUrls: [],
    notes: "",
    verifiedApi: {},
  },
  {
    id: "authored/lib-libx",
    modIds: ["libx"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "libx",
    role: "author_shared",
    communityDocId: "authored/lib-libx",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "io.github.noeppi_noeppi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "io.github.noeppi_noeppi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "io.github.noeppi_noeppi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.noeppi_noeppi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "io.github.noeppi_noeppi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "coremods",
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.moddingx.libx"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-libz",
    modIds: ["libz"],
    loaders: ["fabric"],
    modrinthSlug: "libz",
    role: "author_shared",
    communityDocId: "authored/lib-libz",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.libz.api"
        ],
        "entrypoints": [
          "net.libz.LibzClient",
          "net.libz.LibzMain",
          "net.libz.config.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.libz.access"
        ],
        "entrypoints": [
          "net.libz.LibzClient",
          "net.libz.LibzMain",
          "net.libz.compat.LibzEmiPlugin",
          "net.libz.compat.LibzReiPlugin",
          "net.libz.config.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.libz.api"
        ],
        "entrypoints": [
          "net.libz.LibzClient",
          "net.libz.LibzMain",
          "net.libz.config.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.libz.access"
        ],
        "entrypoints": [
          "net.libz.LibzClient",
          "net.libz.LibzMain",
          "net.libz.compat.LibzEmiPlugin",
          "net.libz.compat.LibzReiPlugin",
          "net.libz.config.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.libz.access"
        ],
        "entrypoints": [
          "net.libz.LibzClient",
          "net.libz.LibzMain",
          "net.libz.compat.LibzEmiPlugin",
          "net.libz.compat.LibzReiPlugin",
          "net.libz.config.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-malilib",
    modIds: ["malilib"],
    loaders: ["fabric","forge"],
    modrinthSlug: "malilib",
    role: "author_shared",
    communityDocId: "authored/lib-malilib",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.12/ornithe": {
        "verifiedAt": "2026-08",
        "packages": [
          "malilib.action"
        ],
        "entrypoints": [
          "malilib.MaLiLib",
          "malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.12.2/liteloader": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.14.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.15.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl",
          "fi.dy.masa.malilib.datagen.MaLiLibDataGen"
        ],
        "notes": "自动反编译提取"
      },
      "19w36a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "19w39a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "19w44a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "20w09a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w12a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w15a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w18a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w21a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w48a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "21w05a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "21w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.12.1/liteloader": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.13.2/rift": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.15/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.15-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.15.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.17-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl",
          "fi.dy.masa.malilib.datagen.MaLiLibDataGen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl",
          "fi.dy.masa.malilib.datagen.MaLiLibDataGen"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl",
          "fi.dy.masa.malilib.datagen.MaLiLibDataGen"
        ],
        "notes": "自动反编译提取"
      },
      "19w37a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "19w40a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "19w46b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "20w10a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w13a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w16a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w19a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w22a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w49a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "21w08b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "21w18a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.12/liteloader": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.14.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.15-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.15-pre6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl",
          "fi.dy.masa.malilib.datagen.MaLiLibDataGen"
        ],
        "notes": "自动反编译提取"
      },
      "19w03c/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "19w38b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "19w41a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib"
        ],
        "notes": "自动反编译提取"
      },
      "20w06a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w11a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w17a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w20b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w45a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "20w51a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "21w13a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      },
      "23w43b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fi.dy"
        ],
        "entrypoints": [
          "fi.dy.masa.malilib.MaLiLib",
          "fi.dy.masa.malilib.compat.modmenu.ModMenuImpl"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-mantle",
    modIds: ["mantle"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "mantle",
    role: "author_shared",
    communityDocId: "authored/lib-mantle",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "slimeknights.mantle"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "slimeknights.mantle"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "slimeknights.mantle"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "slimeknights.mantle"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.7.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "slimeknights.mantle"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-midnightlib",
    modIds: ["midnightlib"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "midnightlib",
    role: "api",
    communityDocId: "authored/lib-midnightlib",
    skillId: "mc-config",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.hats.config.ModMenuIntegration"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "22w43a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "22w43a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2-pre-3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "26.2-pre-3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "21w37a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "23w06a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibClientFabric",
          "eu.midnightdust.fabric.core.MidnightLibServerFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.18-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.fabric.core.MidnightLibFabric",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "22w42a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "22w42a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLibClient",
          "eu.midnightdust.core.MidnightLibServer",
          "eu.midnightdust.lib.config.AutoModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [
          "eu.midnightdust.core.MidnightLib",
          "eu.midnightdust.core.MidnightLib$ModMenuInit",
          "eu.midnightdust.lib.config.AutoCommand"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.midnightdust"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-modern-ui",
    modIds: ["modernui"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "modern-ui",
    role: "api",
    communityDocId: "authored/lib-modern-ui",
    skillId: "mc-modern-ui",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [
          "icyllis.modernui.mc.fabric.ModernUIFabric",
          "icyllis.modernui.mc.fabric.ModernUIFabricClient",
          "icyllis.modernui.mc.fabric.MuiModMenuApi"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "icyllis.arc3d"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-moonlight",
    modIds: ["moonlight"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "moonlight",
    role: "api",
    communityDocId: "authored/lib-moonlight",
    skillId: "mc-moonlight-lib",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.api.integration.mod_menu.ModMenuCompat",
          "net.mehvahdjukaar.moonlight.platform.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.platform.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.api.integration.mod_menu.ModMenuCompat",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.api.integration.mod_menu.ModMenuCompat",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [
          "net.mehvahdjukaar.moonlight.api.integration.mod_menu.ModMenuCompat",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabric",
          "net.mehvahdjukaar.moonlight.fabric.MoonlightFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.mehvahdjukaar.moonlight"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-necronomicon",
    modIds: ["necronomicon"],
    loaders: ["forge","neoforge","fabric"],
    modrinthSlug: "necronomicon",
    role: "author_shared",
    communityDocId: "authored/lib-necronomicon",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "elocindev.necronomicon"
        ],
        "entrypoints": [
          "elocindev.necronomicon.CommonInitializer"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-owo",
    modIds: ["owo-lib"],
    loaders: ["fabric","neoforge","quilt"],
    modrinthSlug: "owo-lib",
    role: "api",
    communityDocId: "authored/lib-owo",
    skillId: "mc-owo",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "21w43a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.glisco.owo"
        ],
        "entrypoints": [
          "com.glisco.owo.Owo",
          "com.glisco.owo.client.OwoClient",
          "com.glisco.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.18-pre8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.glisco.owo"
        ],
        "entrypoints": [
          "com.glisco.owo.Owo",
          "com.glisco.owo.client.OwoClient",
          "com.glisco.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [
          "io.wispforest.owo.Owo",
          "io.wispforest.owo.client.OwoClient",
          "io.wispforest.owo.compat.emi.OwoEmiPlugin",
          "io.wispforest.owo.compat.modmenu.OwoModMenuPlugin",
          "io.wispforest.owo.compat.rei.OwoReiPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.wispforest.owo"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-patchouli",
    modIds: ["patchouli"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "patchouli",
    role: "api",
    communityDocId: "authored/lib-patchouli",
    skillId: "mc-patchouli",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.14.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "asm",
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.client.base.ClientInitializer",
          "vazkii.patchouli.common.base.Patchouli",
          "vazkii.patchouli.common.base.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.client.base.ClientProxy",
          "vazkii.patchouli.common.base.CommonProxy"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.client.base.ClientInitializer",
          "vazkii.patchouli.common.base.Patchouli"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [
          "vazkii.patchouli.fabric.client.FabricClientInitializer",
          "vazkii.patchouli.fabric.common.FabricModInitializer",
          "vazkii.patchouli.fabric.common.PatchouliSmokeTest"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "vazkii.patchouli"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-pehkui",
    modIds: ["pehkui"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "pehkui",
    role: "api",
    communityDocId: "authored/lib-pehkui",
    skillId: "mc-pehkui",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.14.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.14.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "21w08b/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "21w18a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "21w42a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w43a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w43a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.mixinextras"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "21w10a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "21w20a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w11a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w17a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w17a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "23w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "23w14a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.mixinextras"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.mixinextras"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.mixinextras"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.mixinextras"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20-pre6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.util.FabricEntrypoint::onInitialize"
        ],
        "notes": "自动反编译提取"
      },
      "21w03a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "21w14a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "21w41a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w12a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w19a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      },
      "22w19a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "virtuoel.pehkui"
        ],
        "entrypoints": [
          "virtuoel.pehkui.Pehkui",
          "virtuoel.pehkui.PehkuiClient"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-placebo",
    modIds: ["placebo"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "placebo",
    role: "author_shared",
    communityDocId: "authored/lib-placebo",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-player-ability-lib",
    modIds: ["playerabilitylib"],
    loaders: ["fabric","quilt"],
    modrinthSlug: "pal",
    role: "api",
    communityDocId: "authored/lib-player-ability-lib",
    skillId: "mc-player-ability-lib",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "io.github.ladysnake"
        ],
        "entrypoints": [
          "io.github.ladysnake.pal.Pal"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-playeranimator",
    modIds: ["player-animator"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "playeranimator",
    role: "api",
    communityDocId: "authored/lib-playeranimator",
    skillId: "mc-playeranimator",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.16.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.16.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [
          "dev.kosmx.playerAnim.fabric.client.FabricClientInitializer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.kosmx.playerAnim"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-polymer",
    modIds: ["polymer"],
    loaders: ["fabric","quilt"],
    modrinthSlug: "polymer",
    role: "api",
    communityDocId: "authored/lib-polymer",
    skillId: "mc-polymer",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "26.1-rc-2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-rc2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [
          "eu.pb4.polymer.impl.PolymerMod",
          "eu.pb4.polymer.impl.client.compat.AppleSkinCompatibility",
          "eu.pb4.polymer.impl.client.compat.ReiCompatibility"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-pre5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19-pre5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3-rc3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6-pre2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/quilt": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      },
      "26.2-rc-2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [],
        "entrypoints": [
          "eu.pb4.polymer.common.impl.client.ModMenuConfig"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-puzzles-lib",
    modIds: ["puzzleslib"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "puzzles-lib",
    role: "author_shared",
    communityDocId: "authored/lib-puzzles-lib",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.capability.CapabilityController",
          "fuzs.puzzleslib.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.capability.FabricCapabilityController",
          "fuzs.puzzleslib.impl.PuzzlesLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.impl.PuzzlesLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.capability.FabricCapabilityController",
          "fuzs.puzzleslib.impl.PuzzlesLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.impl.PuzzlesLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.capability.FabricCapabilityController"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.impl.PuzzlesLibFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [
          "fuzs.puzzleslib.fabric.impl.PuzzlesLibFabric",
          "fuzs.puzzleslib.fabric.impl.client.PuzzlesLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "fuzs.puzzleslib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-resourceful",
    modIds: ["resourcefullib"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "resourceful-lib",
    role: "api",
    communityDocId: "authored/lib-resourceful",
    skillId: "mc-resourceful-lib",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [
          "com.teamresourceful.resourcefullib.ResourcefulLib::init",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricClient",
          "com.teamresourceful.resourcefullib.fabric.ResourcefulLibFabricServer"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.teamresourceful.resourcefullib"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-satin",
    modIds: ["satin"],
    loaders: ["fabric"],
    modrinthSlug: "satin-api",
    role: "api",
    communityDocId: "authored/lib-satin",
    skillId: "mc-satin",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.satin"
        ],
        "entrypoints": [
          "org.ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.satin"
        ],
        "entrypoints": [
          "org.ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "ladysnake.satin"
        ],
        "entrypoints": [
          "ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.satin"
        ],
        "entrypoints": [
          "org.ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "org.ladysnake.satin"
        ],
        "entrypoints": [
          "org.ladysnake.satin.Satin"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-server-translations",
    modIds: ["server_translations_api"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "",
    role: "api",
    communityDocId: "authored/lib-server-translations",
    skillId: "mc-server-translations",
    officialUrls: [],
    notes: "",
    verifiedApi: {},
  },
  {
    id: "authored/lib-sophisticated-core",
    modIds: ["sophisticatedcore"],
    loaders: ["forge","neoforge"],
    modrinthSlug: "sophisticated-core",
    role: "author_shared",
    communityDocId: "authored/lib-sophisticated-core",
    skillId: "mc-author-shared-libs",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.p3pp3rf1y.sophisticatedcore"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-spruceui-obsidianui",
    modIds: ["spruceui","obsidianui"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "",
    role: "api",
    communityDocId: "authored/lib-spruceui-obsidianui",
    skillId: "mc-spruceui",
    officialUrls: [],
    notes: "",
    verifiedApi: {},
  },
  {
    id: "authored/lib-terrablender",
    modIds: ["terrablender"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "terrablender",
    role: "api",
    communityDocId: "authored/lib-terrablender",
    skillId: "mc-terrablender",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.18.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.8/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.9/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "26.1.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "terrablender.api"
        ],
        "entrypoints": [
          "terrablender.core.TerraBlenderFabric"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-text-placeholder-api",
    modIds: ["text_placeholder_api"],
    loaders: ["fabric","quilt"],
    modrinthSlug: "placeholder-api",
    role: "api",
    communityDocId: "authored/lib-text-placeholder-api",
    skillId: "mc-text-placeholder",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-pre-3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6-pre2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "25w14craftmine/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "25w14craftmine/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-snapshot-7/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1-snapshot-7/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [
          "eu.pb4.placeholders.PlaceholderAPIMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.17/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [
          "eu.pb4.placeholders.PlaceholderAPIMod"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21-pre2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-rc1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "eu.pb4"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-traps-2026",
    modIds: ["traps-2026"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "",
    role: "trap",
    communityDocId: "authored/lib-traps-2026",
    officialUrls: [],
    notes: "",
    verifiedApi: {},
  },
  {
    id: "authored/lib-trinkets",
    modIds: ["trinkets"],
    loaders: ["fabric","quilt"],
    modrinthSlug: "trinkets",
    role: "api",
    communityDocId: "authored/lib-trinkets",
    skillId: "mc-trinkets",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.17.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain",
          "dev.emi.trinkets.compat.TrinketsEmiPlugin",
          "dev.emi.trinkets.compat.TrinketsREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.18/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain",
          "dev.emi.trinkets.compat.TrinketsEmiPlugin",
          "dev.emi.trinkets.compat.TrinketsREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain",
          "dev.emi.trinkets.compat.TrinketsEmiPlugin",
          "dev.emi.trinkets.compat.TrinketsREIPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.17-rc2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.trinkets"
        ],
        "entrypoints": [
          "dev.emi.trinkets.TrinketsClient",
          "dev.emi.trinkets.TrinketsMain",
          "dev.emi.trinkets.compat.TrinketsEmiPlugin",
          "dev.emi.trinkets.compat.TrinketsREIPlugin"
        ],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/lib-yacl",
    modIds: ["yacl"],
    loaders: ["fabric","forge","neoforge","quilt"],
    modrinthSlug: "yacl",
    role: "api",
    communityDocId: "authored/lib-yacl",
    skillId: "mc-yacl",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.fabric.YACLFabricEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.fabric.YACLFabricEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "com.twelvemonkeys.image",
          "dev.isxander.yacl3",
          "profiles"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "22w42a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "22w42a/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "25w33a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "26.1-snapshot-2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "26.2-snapshot-2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.3/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.5/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "23w05a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "26.3-snapshot-1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20-pre2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "25w31a/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.3-snapshot-4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [
          "dev.isxander.yacl3.platform.PlatformEntrypoint"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.isxander.yacl3"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
  {
    id: "authored/library-integration",
    modIds: [],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "",
    role: "api",
    communityDocId: "authored/library-integration",
    officialUrls: [],
    notes: "",
    verifiedApi: {},
  },
  {
    id: "authored/library-integration-jei-emi",
    modIds: ["jei","emi","roughlyenoughitems"],
    loaders: ["fabric","forge","neoforge"],
    modrinthSlug: "jei, emi, roughly-enough-items",
    role: "api",
    communityDocId: "authored/library-integration-jei-emi",
    skillId: "mc-compat-jei",
    officialUrls: [],
    notes: "",
    verifiedApi: {
      "1.10/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.11.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.13.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.common.plugins.debug.JeiDebugPlugin",
          "mezz.jei.common.plugins.jei.JeiInternalPlugin",
          "mezz.jei.common.plugins.vanilla.VanillaPlugin",
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.debug.JeiDebugPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.debug.JeiDebugPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.10/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.8/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.8.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.9.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.EmiClient",
          "dev.emi.emi.EmiMain",
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.EmiClient",
          "dev.emi.emi.EmiMain",
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.6/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.10.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.12/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.5/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.6/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.11/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.5/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.9/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.8.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "26.2/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.19.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.20.4/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.11/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.12.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.14.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.15.2/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.16.3/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.17.1/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.common.plugins.debug.JeiDebugPlugin",
          "mezz.jei.common.plugins.jei.JeiInternalPlugin",
          "mezz.jei.common.plugins.vanilla.VanillaPlugin",
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient"
        ],
        "notes": "自动反编译提取"
      },
      "1.19/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.10/fabric": {
        "verifiedAt": "2026-08",
        "packages": [
          "mezz.jei",
          "net.mezzdev.suffixtree"
        ],
        "entrypoints": [
          "mezz.jei.fabric.JustEnoughItems",
          "mezz.jei.fabric.JustEnoughItemsClient",
          "mezz.jei.fabric.plugins.fabric.FabricGuiPlugin",
          "mezz.jei.gui.plugins.JeiGuiPlugin",
          "mezz.jei.library.plugins.debug.JeiDebugPlugin",
          "mezz.jei.library.plugins.jei.JeiInternalPlugin",
          "mezz.jei.library.plugins.vanilla.VanillaPlugin"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.11/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.21.7/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.8/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.9/forge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "26.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "net.darkhax.bookshelf"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      },
      "1.18.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.EmiClient",
          "dev.emi.emi.EmiMain",
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu"
        ],
        "notes": "自动反编译提取"
      },
      "1.19.4/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.20.2/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21/quilt": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [
          "dev.emi.emi.VanillaPlugin",
          "dev.emi.emi.compat.EmiModMenu",
          "dev.emi.emi.jemi.JemiPlugin",
          "dev.emi.emi.platform.fabric.EmiClientFabric",
          "dev.emi.emi.platform.fabric.EmiMainFabric"
        ],
        "notes": "自动反编译提取"
      },
      "1.21.1/neoforge": {
        "verifiedAt": "2026-08",
        "packages": [
          "dev.emi.emi"
        ],
        "entrypoints": [],
        "notes": "自动反编译提取"
      }
    },
  },
];
