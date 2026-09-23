@echo off
cd /d "%~dp0"
setlocal enabledelayedexpansion
set FRAMES=0
for %%f in (assets\skill_frames\*.webp) do set /a FRAMES+=1
set SINS=0
for %%f in (assets\sin_icons\*.webp) do set /a SINS+=1
set DEF=0
for %%f in (assets\defense_icons\*.webp) do set /a DEF+=1
set LCB=0
for %%f in (assets\skill_icons\lcb\*.webp) do set /a LCB+=1
echo skill_frames : !FRAMES! / 21
echo sin_icons    : !SINS! / 7
echo defense_icons: !DEF! / 3
echo lcb_skill_art: !LCB! / 48
if exist assets\skill_icons\manifest.json (
  echo manifest     : OK
) else (
  echo manifest     : MISSING
)
pause
