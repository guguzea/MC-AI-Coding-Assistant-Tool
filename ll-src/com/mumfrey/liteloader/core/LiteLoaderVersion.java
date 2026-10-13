/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core;

import java.util.HashSet;
import java.util.Set;

/**
 * LiteLoader version table
 *
 * @author Adam Mummery-Smith
 * @version 1.11.2_00
 */
public enum LiteLoaderVersion
{
    LEGACY(0, 0, "-", "Unknown", "-"),
    FUTURE(Integer.MAX_VALUE, Long.MAX_VALUE, "-", "Future", "-"),

    MC_1_5_2_R1(9,   0,          "1.5.2",  "1.5.2",     "1.5.2"          ),
    MC_1_6_1_R0(11,  0,          "1.6.1",  "1.6.1",     "1.6.1", "1.6.r1"),
    MC_1_6_1_R1(11,  0,          "1.6.1",  "1.6.1",     "1.6.1", "1.6.r1"),
    MC_1_6_2_R0(12,  0,          "1.6.2",  "1.6.2",     "1.6.2", "1.6.r2"),
    MC_1_6_2_R1(12,  1374025480, "1.6.2",  "1.6.2_01",  "1.6.2", "1.6.r2"),
    MC_1_6_2_R2(13,  1374709543, "1.6.2",  "1.6.2_02",  "1.6.2", "1.6.r2"),
    MC_1_6_2_R3(14,  1375228794, "1.6.2",  "1.6.2_03",  "1.6.2", "1.6.r2"),
    MC_1_6_2_R4(15,  1375662298, "1.6.2",  "1.6.2_04",  "1.6.2", "1.6.r2"),
    MC_1_6_3_R0(16,  1375662298, "1.6.3",  "1.6.3",     "1.6.3", "1.6.r3"),
    MC_1_6_4_R0(17,  1380279938, "1.6.4",  "1.6.4",     "1.6.4", "1.6.r4"),
    MC_1_6_4_R1(18,  1380796916, "1.6.4",  "1.6.4_01",  "1.6.4", "1.6.r4"),
    MC_1_6_4_R2(19,  1380796916, "1.6.4",  "1.6.4_02",  "1.6.4", "1.6.r4"),
    MC_1_7_2_R0(20,  1386027226, "1.7.2",  "1.7.2",     "1.7.2", "1.7.r1"),
    MC_1_7_2_R1(21,  1388455995, "1.7.2",  "1.7.2_01",  "1.7.2_01"),
    MC_1_7_2_R2(22,  1391815963, "1.7.2",  "1.7.2_02",  "1.7.2_02"),
    MC_1_7_2_R3(23,  1391890695, "1.7.2",  "1.7.2_03",  "1.7.2_02", "1.7.2_03"),
    MC_1_7_2_R4(24,  1392487926, "1.7.2",  "1.7.2_04",  "1.7.2_02", "1.7.2_03", "1.7.2_04"),
    MC_1_7_2_R5(25,  0,          "1.7.2",  "1.7.2_05",  "1.7.2_02", "1.7.2_03", "1.7.2_04", "1.7.2_05"),
    MC_1_7_2_R6(26,  0,          "1.7.2",  "1.7.2_06",  "1.7.2_06"),
    MC_1_7_10_R0(27, 1404330030, "1.7.10", "1.7.10",    "1.7.10"),
    MC_1_7_10_R1(28, 1404673785, "1.7.10", "1.7.10_01", "1.7.10"),
    MC_1_7_10_R2(29, 1405369406, "1.7.10", "1.7.10_02", "1.7.10"),
    MC_1_7_10_R3(30, 1407687918, "1.7.10", "1.7.10_03", "1.7.10", "1.7.10_03"),
    MC_1_7_10_R4(31, 1414368553, "1.7.10", "1.7.10_04", "1.7.10", "1.7.10_03", "1.7.10_04"),
    MC_1_8_0_R0(32, 1463585254,  "1.8",    "1.8.0",     "1.8", "1.8.0"),
    MC_1_8_9_R0(34, 0,           "1.8.9",  "1.8.9",     "1.8.9"),
    MC_1_9_0_R0(35, 0,           "1.9",    "1.9.0",     "1.9", "1.9.0"),
    MC_1_9_4_R0(36, 1479472002,  "1.9.4",  "1.9.4",     "1.9.4"),
    MC_1_10_R0(37,  0,           "1.10",   "1.10",      "1.10", "1.10.0", "1.10.r1"),
    MC_1_10_2_R0(38, 1479473570, "1.10.2", "1.10.2",    "1.10.2", "1.10.r1"),
    MC_1_11_0_R0(39, 0,          "1.11",   "1.11",      "1.11", "1.11.0", "1.11.r1"),
    MC_1_11_2_R0(40, 0,          "1.11.2", "1.11.2",    "1.11.2", "1.11.r2"),
    MC_1_12_0_R0(41, 0,          "1.12",   "1.12",      "1.12", "1.12.0", "1.12.r1"),
    MC_1_12_1_R0(41, 0,          "1.12.1", "1.12.1",    "1.12.1", "1.12.r2"),
    MC_1_12_2_R0(42, 0,          "1.12.2", "1.12.2",    "1.12.2", "1.12.r2", "1.12.r3");

    /**
     * Current loader version
     */
    public static final LiteLoaderVersion CURRENT = LiteLoaderVersion.MC_1_12_2_R0;

    private static final LiteLoaderUpdateSite updateSite = new LiteLoaderUpdateSite(LiteLoaderVersion.CURRENT.getMinecraftVersion(),
                                                                                    LiteLoaderVersion.CURRENT.getReleaseTimestamp());

    private final int revision;

    private final long timestamp;

    private final String minecraftVersion;

    private final String loaderVersion;

    private final Set<String> supportedVersions = new HashSet<String>();

    private LiteLoaderVersion(int revision, long timestamp, String minecraftVersion, String loaderVersion, String... supportedVersions)
    {
        this.revision = revision;
        this.timestamp = timestamp;
        this.minecraftVersion = minecraftVersion;
        this.loaderVersion = loaderVersion;

        for (String supportedVersion : supportedVersions)
        {
            this.supportedVersions.add(supportedVersion);
        }
    }

    public int getLoaderRevision()
    {
        return this.revision;
    }

    public long getReleaseTimestamp()
    {
        return this.timestamp;
    }

    public String getMinecraftVersion()
    {
        return this.minecraftVersion;
    }

    public String getLoaderVersion()
    {
        return this.loaderVersion;
    }

    public static LiteLoaderVersion getVersionFromRevision(int revision)
    {
        if (revision > LiteLoaderVersion.CURRENT.revision)
        {
            return LiteLoaderVersion.FUTURE;
        }

        for (LiteLoaderVersion version : LiteLoaderVersion.values())
        {
            if (version.getLoaderRevision() == revision)
            {
                return version;
            }
        }

        return LiteLoaderVersion.LEGACY;
    }

    public static int getRevisionFromVersion(String versionString)
    {
        for (LiteLoaderVersion version : LiteLoaderVersion.values())
        {
            if (version.getLoaderVersion().equals(versionString))
            {
                return version.getLoaderRevision();
            }
        }

        return LiteLoaderVersion.LEGACY.getLoaderRevision();
    }

    public boolean isVersionSupported(String version)
    {
        return this.supportedVersions.contains(version);
    }

    @Override
    public String toString()
    {
        return this.loaderVersion;
    }

    public static LiteLoaderUpdateSite getUpdateSite()
    {
        return LiteLoaderVersion.updateSite;
    }
}
