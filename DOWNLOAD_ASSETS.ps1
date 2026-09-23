$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$framesDir = Join-Path $root 'assets\skill_frames'
$sinDir = Join-Path $root 'assets\sin_icons'
$defDir = Join-Path $root 'assets\defense_icons'
$skillIconRoot = Join-Path $root 'assets\skill_icons'
$lcbDir = Join-Path $skillIconRoot 'lcb'
$manifestPath = Join-Path $skillIconRoot 'manifest.json'

$base = 'https://limbus-assets.eldritchtools.com/assets'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LimbusDIY/8.2'

New-Item -ItemType Directory -Force -Path $framesDir,$sinDir,$defDir,$skillIconRoot,$lcbDir | Out-Null

function Download-File([string]$Url,[string]$OutFile){
  try {
    Invoke-WebRequest -Uri $Url -OutFile $OutFile -Headers @{ 'User-Agent'=$ua; 'Referer'='https://limbus.eldritchtools.com/' } | Out-Null
    $item = Get-Item $OutFile -ErrorAction Stop
    if($item.Length -lt 512){ throw "Downloaded file is too small: $($item.Length) bytes" }
    return $true
  } catch {
    if(Test-Path $OutFile){ Remove-Item $OutFile -Force -ErrorAction SilentlyContinue }
    Write-Warning "MISS $Url"
    return $false
  }
}

Write-Host '== Skill frames ==' -ForegroundColor Cyan
$sins = 'wrath','lust','sloth','gluttony','gloom','pride','envy'
foreach($s in $sins){
  foreach($tier in 1..3){
    $file = "$s-$tier.webp"
    if(Download-File "$base/skill_frames/$file" (Join-Path $framesDir $file)){
      Write-Host "  OK frame $file"
    }
  }
}

Write-Host '== Sin icons ==' -ForegroundColor Cyan
foreach($s in $sins){
  $file = "$s.webp"
  if(Download-File "$base/icons/$file" (Join-Path $sinDir $file)){
    Write-Host "  OK sin $file"
  }
}

Write-Host '== Generic defense icons ==' -ForegroundColor Cyan
foreach($name in 'Guard','Evade','Counter'){
  $file = "$name.webp"
  if(Download-File "$base/icons/$file" (Join-Path $defDir $file)){
    Write-Host "  OK defense $file"
  }
}

# LCB base identity IDs. EldritchTools skill art uses deterministic numeric paths:
# {identityId}01.webp, {identityId}02.webp, {identityId}03.webp, {identityId}04_4.webp
$lcb = @(
  @{ Id='10101'; Sinner='Yi Sang'; DefenseType='Guard' },
  @{ Id='10201'; Sinner='Faust'; DefenseType='Evade' },
  @{ Id='10301'; Sinner='Don Quixote'; DefenseType='Evade' },
  @{ Id='10401'; Sinner='Ryoshu'; DefenseType='Evade' },
  @{ Id='10501'; Sinner='Meursault'; DefenseType='Guard' },
  @{ Id='10601'; Sinner='Hong Lu'; DefenseType='Evade' },
  @{ Id='10701'; Sinner='Heathcliff'; DefenseType='Counter' },
  @{ Id='10801'; Sinner='Ishmael'; DefenseType='Guard' },
  @{ Id='10901'; Sinner='Rodion'; DefenseType='Counter' },
  @{ Id='11001'; Sinner='Sinclair'; DefenseType='Counter' },
  @{ Id='11101'; Sinner='Outis'; DefenseType='Evade' },
  @{ Id='11201'; Sinner='Gregor'; DefenseType='Guard' }
)

Write-Host '== LCB Sinner skill art ==' -ForegroundColor Cyan
Write-Host '  ID pattern check: 1010101 / 1010102 / 1010103 / 1010104_4' -ForegroundColor DarkGray
$manifest = New-Object System.Collections.Generic.List[object]
foreach($entry in $lcb){
  $id = $entry.Id
  $sinner = $entry.Sinner
  foreach($slot in 1..3){
    $assetId = "$($id)0$slot"
    $relative = "lcb/$id-s$slot.webp"
    $dest = Join-Path $skillIconRoot $relative
    $url = "$base/skills/$assetId.webp"
    if(Download-File $url $dest){
      $manifest.Add([ordered]@{
        file = $relative
        label = "LCB $sinner - Skill $slot"
        group = "LCB - $sinner"
        identity = 'LCB Sinner'
        sinner = $sinner
        slot = "Skill $slot"
        defense = $false
        source = $url
      }) | Out-Null
      Write-Host "  OK $sinner Skill $slot"
    }
  }

  $defType = $entry.DefenseType
  $defAssetId = "$($id)04_4"
  $relative = "lcb/$id-defense.webp"
  $dest = Join-Path $skillIconRoot $relative
  $url = "$base/skills/$defAssetId.webp"
  $sourceLabel = $url
  $fallbackUsed = $false
  if(-not (Download-File $url $dest)) {
    $fallbackSrc = Join-Path $defDir ("$defType.webp")
    if(Test-Path $fallbackSrc){
      Copy-Item $fallbackSrc $dest -Force
      $sourceLabel = "generic-defense:$defType"
      $fallbackUsed = $true
      Write-Warning "FALLBACK $sinner Defense -> generic $defType icon"
    }
  }
  if(Test-Path $dest){
    $manifest.Add([ordered]@{
      file = $relative
      label = "LCB $sinner - Defense"
      group = "LCB - $sinner"
      identity = 'LCB Sinner'
      sinner = $sinner
      slot = 'Defense'
      defense = $true
      defenseType = $defType.ToLower()
      fallback = $fallbackUsed
      source = $sourceLabel
    }) | Out-Null
    if($fallbackUsed){ Write-Host "  OK $sinner Defense (generic $defType fallback)" } else { Write-Host "  OK $sinner Defense" }
  }
}

$manifest | ConvertTo-Json -Depth 6 | Set-Content -Path $manifestPath -Encoding UTF8
Write-Host ''
Write-Host "Manifest: $manifestPath" -ForegroundColor Green
Write-Host "LCB entries: $($manifest.Count) / 48" -ForegroundColor Green
Write-Host 'Done.' -ForegroundColor Green
