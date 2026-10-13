/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.runtime;

import com.google.common.base.Objects;

/**
 * Stores information about an SRG method mapping during AP runs
 */
public final class SrgMethod
{
    
    private final String name;
    private final String desc;
    
    public SrgMethod(String name, String desc)
    {
        this.name = name;
        this.desc = desc;
    }
    
    public SrgMethod(String owner, String simpleName, String desc)
    {
        this.name = SrgMethod.createName(owner, simpleName);
        this.desc = desc;
    }
    
    public String getName()
    {
        return this.name;
    }
    
    public String getSimpleName()
    {
        if (this.name == null)
        {
            return null;
        }
        int pos = this.name.lastIndexOf('/');
        return pos > -1 ? this.name.substring(pos + 1) : this.name;
    }
    
    public String getOwner()
    {
        if (this.name == null)
        {
            return null;
        }
        int pos = this.name.lastIndexOf('/');
        return pos > -1 ? this.name.substring(0, pos) : null;
    }
    
    public String getDesc()
    {
        return this.desc;
    }
    
    public SrgMethod move(String newOwner)
    {
        return new SrgMethod(newOwner, this.getSimpleName(), this.desc);
    }
    
    public SrgMethod copy()
    {
        return new SrgMethod(this.name, this.desc);
    }
    
    @Override
    public int hashCode()
    {
        return Objects.hashCode(this.name, this.desc);
    }
    
    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
        {
            return true;
        }
        if (obj instanceof SrgMethod)
        {
            return Objects.equal(this.name, ((SrgMethod)obj).name) && Objects.equal(this.desc, ((SrgMethod)obj).desc);
        }
        return false;
    }
    
    @Override
    public String toString()
    {
        return String.format("%s %s", this.name, this.desc);
    }
    
    private static String createName(String owner, String simpleName)
    {
        return (owner != null ? owner + "/" : "") + simpleName;
    }
    
}
