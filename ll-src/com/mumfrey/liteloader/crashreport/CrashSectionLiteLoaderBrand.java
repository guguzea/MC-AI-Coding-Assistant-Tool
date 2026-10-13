/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.crashreport;

import com.mumfrey.liteloader.core.LiteLoader;

import net.minecraft.crash.CrashReport;

public class CrashSectionLiteLoaderBrand
{
    final CrashReport crashReport;

    public CrashSectionLiteLoaderBrand(CrashReport report)
    {
        this.crashReport = report;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
        String brand = null;
        try
        {
            brand = LiteLoader.getBranding();
        }
        catch (Exception ex)
        {
            brand = "LiteLoader startup incomplete";
        }
        return brand == null ? "Unknown / None" : brand;
    }
}
