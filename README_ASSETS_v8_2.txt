V8.2 ASSET DOWNLOADER

The old V8.1 downloader guessed Fandom/Wiki filenames for LCB skill art.
Those filenames do not match the actual asset layout, so every LCB item showed MISS.

V8.2 downloads LCB skill art directly from EldritchTools' numeric asset paths.
For base LCB identity 10101 (Yi Sang), for example:
  Skill 1: assets/skills/1010101.webp
  Skill 2: assets/skills/1010102.webp
  Skill 3: assets/skills/1010103.webp
  Defense: assets/skills/1010104_4.webp

Run DOWNLOAD_ASSETS.cmd once, then VERIFY_ASSETS.cmd.
Expected counts:
  skill_frames  21
  sin_icons      7
  defense_icons  3
  lcb_skill_art 48
