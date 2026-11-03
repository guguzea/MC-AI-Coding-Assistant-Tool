param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("state", "launch", "show", "minimize", "focus", "shot", "screens", "key", "hold", "type", "chat", "command", "click", "close")]
  [string]$Action,
  [string]$Out = "",
  [string]$WorldId = "",
  [string]$Text = "",
  [int]$Vk = 0,
  [int]$Ms = 100,
  [int]$X = 0,
  [int]$Y = 0,
  [switch]$DismissPause,
  [switch]$Minimize
)

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class McSkillClientDrive {
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern IntPtr SetActiveWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
  [DllImport("user32.dll")] public static extern void SwitchToThisWindow(IntPtr h, bool alt);
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool f);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint p);
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr h, IntPtr hdc, uint flags);
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint dx, uint dy, uint d, IntPtr e);
  [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L, T, R, B; }
}
"@

$SW_SHOWNOACTIVATE = 4
$SW_MINIMIZE = 6
$SW_RESTORE = 9

function Get-GameProcess {
  return Get-Process Minecraft.Windows -ErrorAction SilentlyContinue
}

function Get-GameHandle {
  $p = Get-GameProcess
  if (-not $p) { return [IntPtr]::Zero }
  return $p.MainWindowHandle
}

function Get-GameRect([IntPtr]$h) {
  $r = New-Object McSkillClientDrive+RECT
  [McSkillClientDrive]::GetWindowRect($h, [ref]$r) | Out-Null
  return $r
}

function Focus-Game([IntPtr]$h) {
  if ($h -eq [IntPtr]::Zero) { return $false }
  if ([McSkillClientDrive]::GetForegroundWindow() -eq $h) { return $true }
  [McSkillClientDrive]::ShowWindow($h, $SW_RESTORE) | Out-Null
  [McSkillClientDrive]::keybd_event(0x12, 0, 0, [UIntPtr]::Zero)
  [McSkillClientDrive]::keybd_event(0x12, 0, 2, [UIntPtr]::Zero)
  [McSkillClientDrive]::SwitchToThisWindow($h, $true)
  [McSkillClientDrive]::BringWindowToTop($h) | Out-Null
  [McSkillClientDrive]::SetForegroundWindow($h) | Out-Null
  Start-Sleep -Milliseconds 250
  if ([McSkillClientDrive]::GetForegroundWindow() -ne $h) {
    $fg = [McSkillClientDrive]::GetForegroundWindow()
    $fgPid = 0
    $fgThread = [McSkillClientDrive]::GetWindowThreadProcessId($fg, [ref]$fgPid)
    $cur = [McSkillClientDrive]::GetCurrentThreadId()
    [McSkillClientDrive]::AttachThreadInput($cur, $fgThread, $true) | Out-Null
    [McSkillClientDrive]::SetForegroundWindow($h) | Out-Null
    [McSkillClientDrive]::AttachThreadInput($cur, $fgThread, $false) | Out-Null
    Start-Sleep -Milliseconds 250
  }
  return ([McSkillClientDrive]::GetForegroundWindow() -eq $h)
}

function Send-Key([int]$code) {
  [McSkillClientDrive]::keybd_event([byte]$code, 0, 0, [UIntPtr]::Zero)
  Start-Sleep -Milliseconds 25
  [McSkillClientDrive]::keybd_event([byte]$code, 0, 2, [UIntPtr]::Zero)
}

function Send-Text([string]$value) {
  foreach ($ch in $value.ToCharArray()) {
    $c = [int][char]$ch
    $code = 0
    $shift = $false
    if ($c -ge 97 -and $c -le 122) { $code = $c - 32 }
    elseif ($c -ge 65 -and $c -le 90) { $code = $c }
    elseif ($c -ge 48 -and $c -le 57) { $code = $c }
    elseif ($c -eq 32) { $code = 32 }
    elseif ($c -eq 45) { $code = 189 }
    elseif ($c -eq 46) { $code = 190 }
    elseif ($c -eq 44) { $code = 188 }
    elseif ($c -eq 47) { $code = 191 }
    elseif ($c -eq 58) { $code = 186; $shift = $true }
    elseif ($c -eq 95) { $code = 189; $shift = $true }
    if ($code -eq 0) { continue }
    if ($shift) { [McSkillClientDrive]::keybd_event(0x10, 0, 0, [UIntPtr]::Zero) }
    [McSkillClientDrive]::keybd_event([byte]$code, 0, 0, [UIntPtr]::Zero)
    Start-Sleep -Milliseconds 25
    [McSkillClientDrive]::keybd_event([byte]$code, 0, 2, [UIntPtr]::Zero)
    if ($shift) { [McSkillClientDrive]::keybd_event(0x10, 0, 2, [UIntPtr]::Zero) }
    Start-Sleep -Milliseconds 55
  }
}

function Save-Shot([IntPtr]$h, [string]$path) {
  $r = Get-GameRect $h
  $w = $r.R - $r.L
  $ht = $r.B - $r.T
  if ($w -le 0 -or $ht -le 0) { return $false }
  Add-Type -AssemblyName System.Drawing
  $bmp = New-Object System.Drawing.Bitmap($w, $ht)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $hdc = $g.GetHdc()
  $ok = [McSkillClientDrive]::PrintWindow($h, $hdc, 2)
  $g.ReleaseHdc($hdc)
  $g.Dispose()
  $dir = Split-Path -Parent $path
  if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
  $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  return $ok
}

$h = Get-GameHandle
if ($Action -eq "command") { $Action = "chat" }

switch ($Action) {
  "state" {
    $p = Get-GameProcess
    if (-not $p) { Write-Output "running=false"; break }
    $r = Get-GameRect $h
    Write-Output ("running=true pid=" + $p.Id + " mb=" + [int]($p.WorkingSet64 / 1MB) + " hwnd=" + $h + " rect=" + $r.L + "," + $r.T + "," + $r.R + "," + $r.B)
    Write-Output ("foreground_is_game=" + ([McSkillClientDrive]::GetForegroundWindow() -eq $h))
  }
  "launch" {
    if ($WorldId -eq "") { Write-Output "error=WorldId-required"; exit 2 }
    $uri = "minecraft://?load=" + [uri]::EscapeDataString($WorldId)
    Start-Process $uri
    $deadline = (Get-Date).AddSeconds(40)
    do {
      Start-Sleep -Milliseconds 800
      $p = Get-GameProcess
    } while (-not $p -and (Get-Date) -lt $deadline)
    if (-not $p) { Write-Output "error=launch-timeout"; exit 1 }
    if ($Minimize) { [McSkillClientDrive]::ShowWindow($p.MainWindowHandle, $SW_MINIMIZE) | Out-Null }
    Write-Output ("launched pid=" + $p.Id + " uri=" + $uri + " minimized=" + [bool]$Minimize)
  }
  "show" {
    if ($h -eq [IntPtr]::Zero) { Write-Output "error=no-window"; exit 1 }
    [McSkillClientDrive]::ShowWindow($h, $SW_SHOWNOACTIVATE) | Out-Null
    Write-Output ("show=noactivate hwnd=" + $h)
  }
  "minimize" {
    if ($h -eq [IntPtr]::Zero) { Write-Output "error=no-window"; exit 1 }
    [McSkillClientDrive]::ShowWindow($h, $SW_MINIMIZE) | Out-Null
    Write-Output ("minimized hwnd=" + $h)
  }
  "focus" {
    if ($h -eq [IntPtr]::Zero) { Write-Output "error=no-window"; exit 1 }
    $ok = Focus-Game $h
    Write-Output ("focus=" + $ok)
    if (-not $ok) { exit 1 }
  }
  "shot" {
    if ($h -eq [IntPtr]::Zero) { Write-Output "error=no-window"; exit 1 }
    if ($Out -eq "") { Write-Output "error=Out-required"; exit 2 }
    $ok = Save-Shot $h $Out
    Write-Output ("shot=" + $Out + " printwindow=" + $ok + " foreground_is_game=" + ([McSkillClientDrive]::GetForegroundWindow() -eq $h))
  }
  "screens" {
    if ($Out -eq "") { Write-Output "error=Out-required"; exit 2 }
    Add-Type -AssemblyName System.Windows.Forms, System.Drawing
    $b = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bmp = New-Object System.Drawing.Bitmap($b.Width, $b.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CopyFromScreen($b.X, $b.Y, 0, 0, $bmp.Size)
    $g.Dispose()
    $dir = Split-Path -Parent $Out
    if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
    $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output ("screens=" + $Out + " size=" + $b.Width + "x" + $b.Height + " foreground_is_game=" + ([McSkillClientDrive]::GetForegroundWindow() -eq $h))
  }
  "key" {
    if ($Vk -eq 0) { Write-Output "error=Vk-required"; exit 2 }
    $ok = Focus-Game $h
    if (-not $ok) { Write-Output "error=focus-failed"; exit 1 }
    Send-Key $Vk
    Write-Output ("key=" + $Vk)
  }
  "hold" {
    if ($Vk -eq 0) { Write-Output "error=Vk-required"; exit 2 }
    $ok = Focus-Game $h
    if (-not $ok) { Write-Output "error=focus-failed"; exit 1 }
    [McSkillClientDrive]::keybd_event([byte]$Vk, 0, 0, [UIntPtr]::Zero)
    Start-Sleep -Milliseconds $Ms
    [McSkillClientDrive]::keybd_event([byte]$Vk, 0, 2, [UIntPtr]::Zero)
    Write-Output ("hold vk=" + $Vk + " ms=" + $Ms)
  }
  "type" {
    if ($Text -eq "") { Write-Output "error=Text-required"; exit 2 }
    $ok = Focus-Game $h
    if (-not $ok) { Write-Output "error=focus-failed"; exit 1 }
    Send-Text $Text
    Write-Output ("typed=" + $Text)
  }
  "chat" {
    if ($Text -eq "") { Write-Output "error=Text-required"; exit 2 }
    $ok = Focus-Game $h
    if (-not $ok) { Write-Output "error=focus-failed"; exit 1 }
    if ($DismissPause) {
      Send-Key 27
      Start-Sleep -Milliseconds 1200
      Focus-Game $h | Out-Null
    }
    Send-Key 0x54
    Start-Sleep -Milliseconds 900
    Send-Text $Text
    Start-Sleep -Milliseconds 200
    Send-Key 0x0D
    Start-Sleep -Milliseconds 1200
    if ($Out -ne "") {
      Focus-Game $h | Out-Null
      $shot = Save-Shot $h $Out
      Write-Output ("chat=" + $Text + " shot=" + $Out + " printwindow=" + $shot)
    } else {
      Write-Output ("chat=" + $Text)
    }
  }
  "click" {
    $ok = Focus-Game $h
    if (-not $ok) { Write-Output "error=focus-failed"; exit 1 }
    $r = Get-GameRect $h
    [McSkillClientDrive]::SetCursorPos($r.L + $X, $r.T + $Y) | Out-Null
    Start-Sleep -Milliseconds 120
    [McSkillClientDrive]::mouse_event(0x0002, 0, 0, 0, [IntPtr]::Zero)
    [McSkillClientDrive]::mouse_event(0x0004, 0, 0, 0, [IntPtr]::Zero)
    Write-Output ("click=" + $X + "," + $Y + " note=bedrock-ignores-injected-mouse")
  }
  "close" {
    $p = Get-GameProcess
    if (-not $p) { Write-Output "already-exited=true"; break }
    $closed = $p.CloseMainWindow()
    Start-Sleep -Seconds 20
    $q = Get-GameProcess
    if ($q) { Write-Output ("close=requested still_running=true pid=" + $q.Id) } else { Write-Output ("close=requested still_running=false closed=" + $closed) }
  }
}
