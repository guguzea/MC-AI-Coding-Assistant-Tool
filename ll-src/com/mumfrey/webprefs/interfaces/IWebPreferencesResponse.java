package com.mumfrey.webprefs.interfaces;

import java.io.Serializable;
import java.util.Map;
import java.util.Set;

public interface IWebPreferencesResponse extends Serializable
{
    public abstract String getResponse();

    public abstract String getMessage();
    
    public abstract Throwable getThrowable();

    public abstract String getUUID();
    
    public abstract String getServerId();
    
    public abstract boolean hasSetters();

    public abstract Set<String> getSetters();

    public abstract boolean hasValues();

    public abstract Map<String, String> getValues();
}
