V8.1 FIX

DOWNLOAD_ASSETS.ps1 is now ASCII-only so Windows PowerShell 5.1 will not misread UTF-8 Chinese strings and produce parser errors.

Run:
  DOWNLOAD_ASSETS.cmd

Then run:
  VERIFY_ASSETS.cmd
