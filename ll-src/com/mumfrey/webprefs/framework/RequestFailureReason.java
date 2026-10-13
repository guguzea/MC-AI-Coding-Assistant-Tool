package com.mumfrey.webprefs.framework;

public enum RequestFailureReason
{
    UNKNOWN(1),
    BAD_PARAMS(1),
    NO_SESSION(100),
    SERVER_ERROR(3),
    UNAUTHORISED(5),
    THROTTLED(2),
    UUID_MISMATCH(10),
    BAD_DATA(1);

    private final int severity;

    private RequestFailureReason(int severity)
    {
        this.severity = severity;
    }

    public int getSeverity()
    {
        return this.severity;
    }

    public boolean isPermanent()
    {
        return this.severity > 99;
    }
}
