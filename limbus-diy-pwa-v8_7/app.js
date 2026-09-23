// v8：真实技能边框 + 七罪图标本地化 + LCB 技能图标选择器。
// 攻击 / 守备技能都支持本地真实框；每个技能都能单独指定框。
// 额外支持读取 assets/skill_icons/manifest.json 里的本地图标清单。
const sins={Wrath:['暴怒','Wrath'],Lust:['色欲','Lust'],Sloth:['怠惰','Sloth'],Gluttony:['暴食','Gluttony'],Gloom:['忧郁','Gloom'],Pride:['傲慢','Pride'],Envy:['嫉妒','Envy']};
const affClass={Wrath:'aff-wrath',Lust:'aff-lust',Sloth:'aff-sloth',Gluttony:'aff-glut',Gloom:'aff-gloom',Pride:'aff-pride',Envy:'aff-envy'};
const SIN_FILE={Wrath:'wrath',Lust:'lust',Sloth:'sloth',Gluttony:'gluttony',Gloom:'gloom',Pride:'pride',Envy:'envy'};
const FILE_TO_SIN=Object.fromEntries(Object.entries(SIN_FILE).map(([k,v])=>[v,k]));
const DIRECT_CDN='https://limbus-assets.eldritchtools.com/assets';
const DEFENSE_TYPE_TEXT={guard:'守备',evade:'闪避',counter:'反击'};
const DEFENSE_TYPE_EN={guard:'GUARD',evade:'EVADE',counter:'COUNTER'};
const FRAME_OPTIONS=[{value:'auto',label:'自动（普通技能按编号，守备默认 1 阶）'}].concat(
  Object.entries(sins).flatMap(([key,val])=>[1,2,3].map(t=>({value:`${SIN_FILE[key]}-${t}`,label:`${val[0]} ${t}阶框`})))
);
const BUILTIN_LCB_ICONS=[{"file":"lcb/10101-s1.webp","label":"LCB Yi Sang - Skill 1","group":"LCB - Yi Sang","identity":"LCB Sinner","sinner":"Yi Sang","slot":"Skill 1","defense":false},{"file":"lcb/10101-s2.webp","label":"LCB Yi Sang - Skill 2","group":"LCB - Yi Sang","identity":"LCB Sinner","sinner":"Yi Sang","slot":"Skill 2","defense":false},{"file":"lcb/10101-s3.webp","label":"LCB Yi Sang - Skill 3","group":"LCB - Yi Sang","identity":"LCB Sinner","sinner":"Yi Sang","slot":"Skill 3","defense":false},{"file":"lcb/10101-defense.webp","label":"LCB Yi Sang - Defense","group":"LCB - Yi Sang","identity":"LCB Sinner","sinner":"Yi Sang","slot":"Defense","defense":true,"defenseType":"guard"},{"file":"lcb/10201-s1.webp","label":"LCB Faust - Skill 1","group":"LCB - Faust","identity":"LCB Sinner","sinner":"Faust","slot":"Skill 1","defense":false},{"file":"lcb/10201-s2.webp","label":"LCB Faust - Skill 2","group":"LCB - Faust","identity":"LCB Sinner","sinner":"Faust","slot":"Skill 2","defense":false},{"file":"lcb/10201-s3.webp","label":"LCB Faust - Skill 3","group":"LCB - Faust","identity":"LCB Sinner","sinner":"Faust","slot":"Skill 3","defense":false},{"file":"lcb/10201-defense.webp","label":"LCB Faust - Defense","group":"LCB - Faust","identity":"LCB Sinner","sinner":"Faust","slot":"Defense","defense":true,"defenseType":"evade"},{"file":"lcb/10301-s1.webp","label":"LCB Don Quixote - Skill 1","group":"LCB - Don Quixote","identity":"LCB Sinner","sinner":"Don Quixote","slot":"Skill 1","defense":false},{"file":"lcb/10301-s2.webp","label":"LCB Don Quixote - Skill 2","group":"LCB - Don Quixote","identity":"LCB Sinner","sinner":"Don Quixote","slot":"Skill 2","defense":false},{"file":"lcb/10301-s3.webp","label":"LCB Don Quixote - Skill 3","group":"LCB - Don Quixote","identity":"LCB Sinner","sinner":"Don Quixote","slot":"Skill 3","defense":false},{"file":"lcb/10301-defense.webp","label":"LCB Don Quixote - Defense","group":"LCB - Don Quixote","identity":"LCB Sinner","sinner":"Don Quixote","slot":"Defense","defense":true,"defenseType":"evade"},{"file":"lcb/10401-s1.webp","label":"LCB Ryoshu - Skill 1","group":"LCB - Ryoshu","identity":"LCB Sinner","sinner":"Ryoshu","slot":"Skill 1","defense":false},{"file":"lcb/10401-s2.webp","label":"LCB Ryoshu - Skill 2","group":"LCB - Ryoshu","identity":"LCB Sinner","sinner":"Ryoshu","slot":"Skill 2","defense":false},{"file":"lcb/10401-s3.webp","label":"LCB Ryoshu - Skill 3","group":"LCB - Ryoshu","identity":"LCB Sinner","sinner":"Ryoshu","slot":"Skill 3","defense":false},{"file":"lcb/10401-defense.webp","label":"LCB Ryoshu - Defense","group":"LCB - Ryoshu","identity":"LCB Sinner","sinner":"Ryoshu","slot":"Defense","defense":true,"defenseType":"evade"},{"file":"lcb/10501-s1.webp","label":"LCB Meursault - Skill 1","group":"LCB - Meursault","identity":"LCB Sinner","sinner":"Meursault","slot":"Skill 1","defense":false},{"file":"lcb/10501-s2.webp","label":"LCB Meursault - Skill 2","group":"LCB - Meursault","identity":"LCB Sinner","sinner":"Meursault","slot":"Skill 2","defense":false},{"file":"lcb/10501-s3.webp","label":"LCB Meursault - Skill 3","group":"LCB - Meursault","identity":"LCB Sinner","sinner":"Meursault","slot":"Skill 3","defense":false},{"file":"lcb/10501-defense.webp","label":"LCB Meursault - Defense","group":"LCB - Meursault","identity":"LCB Sinner","sinner":"Meursault","slot":"Defense","defense":true,"defenseType":"guard"},{"file":"lcb/10601-s1.webp","label":"LCB Hong Lu - Skill 1","group":"LCB - Hong Lu","identity":"LCB Sinner","sinner":"Hong Lu","slot":"Skill 1","defense":false},{"file":"lcb/10601-s2.webp","label":"LCB Hong Lu - Skill 2","group":"LCB - Hong Lu","identity":"LCB Sinner","sinner":"Hong Lu","slot":"Skill 2","defense":false},{"file":"lcb/10601-s3.webp","label":"LCB Hong Lu - Skill 3","group":"LCB - Hong Lu","identity":"LCB Sinner","sinner":"Hong Lu","slot":"Skill 3","defense":false},{"file":"lcb/10601-defense.webp","label":"LCB Hong Lu - Defense","group":"LCB - Hong Lu","identity":"LCB Sinner","sinner":"Hong Lu","slot":"Defense","defense":true,"defenseType":"evade"},{"file":"lcb/10701-s1.webp","label":"LCB Heathcliff - Skill 1","group":"LCB - Heathcliff","identity":"LCB Sinner","sinner":"Heathcliff","slot":"Skill 1","defense":false},{"file":"lcb/10701-s2.webp","label":"LCB Heathcliff - Skill 2","group":"LCB - Heathcliff","identity":"LCB Sinner","sinner":"Heathcliff","slot":"Skill 2","defense":false},{"file":"lcb/10701-s3.webp","label":"LCB Heathcliff - Skill 3","group":"LCB - Heathcliff","identity":"LCB Sinner","sinner":"Heathcliff","slot":"Skill 3","defense":false},{"file":"lcb/10701-defense.webp","label":"LCB Heathcliff - Defense","group":"LCB - Heathcliff","identity":"LCB Sinner","sinner":"Heathcliff","slot":"Defense","defense":true,"defenseType":"counter"},{"file":"lcb/10801-s1.webp","label":"LCB Ishmael - Skill 1","group":"LCB - Ishmael","identity":"LCB Sinner","sinner":"Ishmael","slot":"Skill 1","defense":false},{"file":"lcb/10801-s2.webp","label":"LCB Ishmael - Skill 2","group":"LCB - Ishmael","identity":"LCB Sinner","sinner":"Ishmael","slot":"Skill 2","defense":false},{"file":"lcb/10801-s3.webp","label":"LCB Ishmael - Skill 3","group":"LCB - Ishmael","identity":"LCB Sinner","sinner":"Ishmael","slot":"Skill 3","defense":false},{"file":"lcb/10801-defense.webp","label":"LCB Ishmael - Defense","group":"LCB - Ishmael","identity":"LCB Sinner","sinner":"Ishmael","slot":"Defense","defense":true,"defenseType":"guard"},{"file":"lcb/10901-s1.webp","label":"LCB Rodion - Skill 1","group":"LCB - Rodion","identity":"LCB Sinner","sinner":"Rodion","slot":"Skill 1","defense":false},{"file":"lcb/10901-s2.webp","label":"LCB Rodion - Skill 2","group":"LCB - Rodion","identity":"LCB Sinner","sinner":"Rodion","slot":"Skill 2","defense":false},{"file":"lcb/10901-s3.webp","label":"LCB Rodion - Skill 3","group":"LCB - Rodion","identity":"LCB Sinner","sinner":"Rodion","slot":"Skill 3","defense":false},{"file":"lcb/10901-defense.webp","label":"LCB Rodion - Defense","group":"LCB - Rodion","identity":"LCB Sinner","sinner":"Rodion","slot":"Defense","defense":true,"defenseType":"counter"},{"file":"lcb/11001-s1.webp","label":"LCB Sinclair - Skill 1","group":"LCB - Sinclair","identity":"LCB Sinner","sinner":"Sinclair","slot":"Skill 1","defense":false},{"file":"lcb/11001-s2.webp","label":"LCB Sinclair - Skill 2","group":"LCB - Sinclair","identity":"LCB Sinner","sinner":"Sinclair","slot":"Skill 2","defense":false},{"file":"lcb/11001-s3.webp","label":"LCB Sinclair - Skill 3","group":"LCB - Sinclair","identity":"LCB Sinner","sinner":"Sinclair","slot":"Skill 3","defense":false},{"file":"lcb/11001-defense.webp","label":"LCB Sinclair - Defense","group":"LCB - Sinclair","identity":"LCB Sinner","sinner":"Sinclair","slot":"Defense","defense":true,"defenseType":"counter"},{"file":"lcb/11101-s1.webp","label":"LCB Outis - Skill 1","group":"LCB - Outis","identity":"LCB Sinner","sinner":"Outis","slot":"Skill 1","defense":false},{"file":"lcb/11101-s2.webp","label":"LCB Outis - Skill 2","group":"LCB - Outis","identity":"LCB Sinner","sinner":"Outis","slot":"Skill 2","defense":false},{"file":"lcb/11101-s3.webp","label":"LCB Outis - Skill 3","group":"LCB - Outis","identity":"LCB Sinner","sinner":"Outis","slot":"Skill 3","defense":false},{"file":"lcb/11101-defense.webp","label":"LCB Outis - Defense","group":"LCB - Outis","identity":"LCB Sinner","sinner":"Outis","slot":"Defense","defense":true,"defenseType":"evade"},{"file":"lcb/11201-s1.webp","label":"LCB Gregor - Skill 1","group":"LCB - Gregor","identity":"LCB Sinner","sinner":"Gregor","slot":"Skill 1","defense":false},{"file":"lcb/11201-s2.webp","label":"LCB Gregor - Skill 2","group":"LCB - Gregor","identity":"LCB Sinner","sinner":"Gregor","slot":"Skill 2","defense":false},{"file":"lcb/11201-s3.webp","label":"LCB Gregor - Skill 3","group":"LCB - Gregor","identity":"LCB Sinner","sinner":"Gregor","slot":"Skill 3","defense":false},{"file":"lcb/11201-defense.webp","label":"LCB Gregor - Defense","group":"LCB - Gregor","identity":"LCB Sinner","sinner":"Gregor","slot":"Defense","defense":true,"defenseType":"guard"}];
let SKILL_ICON_MANIFEST=[...BUILTIN_LCB_ICONS];
let SKILL_ICON_OPTIONS_HTML='<option value="">无 / 留空</option>';
let data={identity:{org:'LCE E.G.O · 浸染',name:'奥提斯',subtitle:'三灯人格 · 流血 / 沉沦 / 共鸣',stars:'◈◈◈',hp:'265',speed:'3–5',def:'+2',resists:'斩击 2.0 / 突刺 1.0 / 打击 0.5 / 混乱阈值 50% / 10%',role:'复合状态主C',sins:'暴食 / 色欲',systems:'流血 / 沉沦',cycle:'纠缠 → 凋零 → 红染 → 再生纠缠'},skills:[],passives:[],statuses:[],related:[['Bleed.png','流血'],['Sinking.png','沉沦'],['Bind.png','束缚']]};
function seed(){
 data.skills=[
 {section:'SKILL 1',name:'种植棉花',sin:'Lust',type:'突刺',offense:'+2',capacity:'1',base:'4',coins:['+3','+3'],size:'compact',defense:false,effects:'[使用时] 目标每有6级流血强度，硬币威力+1（最多+2）\n[战斗开始时] 自身获得5层纠缠的棉花\n① [命中时] 施加3级流血强度\n② [命中时] 施加2层沉沦',frame:'auto',icon:'',defenseType:''},
 {section:'SKILL 2',name:'揭开伤口',sin:'Gluttony',type:'突刺',offense:'+3',capacity:'1',base:'6',coins:['+6','+6'],size:'medium',defense:false,effects:'[使用时] 目标有6级流血与沉沦强度之和，硬币威力+1，拼点威力+1\n[使用时] 施加3层束缚\n① [命中时] 施加2级流血强度\n② [命中时] 施加5层棉花纤维',frame:'auto',icon:'',defenseType:''},
 {section:'SKILL 3',name:'散落各处，无法归乡之棉花',sin:'Gluttony',type:'突刺',offense:'+4',capacity:'1',base:'6',coins:['+8','+8'],size:'tall',defense:false,effects:'[战斗开始时] 若自身拥有30层纠缠的棉花，改为使用强化技能三\n[战斗开始时] 自身获得2层易损，除自身外友方获得2层守护\n[使用时] 每拥有15层凋零的棉花，拼点威力+2（最多+4）\n② [命中时] 触发目标的流血和沉沦各1次',frame:'auto',icon:'',defenseType:''},
 {section:'DEFENSE',name:'吹散棉籽',sin:'Gloom',type:'闪避',offense:'',capacity:'',base:'4',coins:['+10'],size:'compact',defense:true,effects:'[战斗开始时] 获得1层红染棉花\n[使用时] 目标获得1层沉沦\n[闪避成功时] 目标获得1层流血',frame:'auto',icon:'',defenseType:'evade'}];
 data.passives=[{title:'PASSIVE 1',name:'盛开的棉花',cost:'',support:false,effects:'回合结束时，自身获得“纠缠的棉花”/10 层攻击等级提升和迅捷。\n自身进入战斗时，获得1层红染棉花，并对所有敌方单位施加1层束缚。'},{title:'PASSIVE 2',name:'白棉花，红棉花',cost:'持有：1色欲 2暴食 1忧郁',support:false,effects:'根据场上最大共鸣数，自身造成伤害+（最大共鸣数×10）%（最多+30%）。\n根据自身与目标的速度差，造成追加打击伤害。'},{title:'SUPPORT PASSIVE',name:'以血浸染',cost:'2色欲共鸣',support:true,effects:'我方速度最快的流血单位使用基础技能攻击时，对目标施加流血强度和防御等级降低。'}];
 data.statuses=[{name:'纠缠的棉花',cap:'最大层数 30',icon:'✿',effects:'每有15层本效果，自身获得1层色欲伤害强化；每有20层获得1层易损。'},{name:'凋零的棉花',cap:'最大层数 30',icon:'❀',effects:'每有15层获得1层攻击等级提升；每有20层获得1层忍耐。'}];
}
seed();
function normalizeSkill(x={}){
  const out={section:'SKILL 1',name:'新技能',sin:'Lust',type:'斩击',offense:'+0',capacity:'1',base:'4',coins:['+4'],size:'compact',defense:false,effects:'',frame:'auto',icon:'',defenseType:'',...x};
  if(!Array.isArray(out.coins)) out.coins=[String(out.coins||'+4')];
  if(!out.frame) out.frame='auto';
  if(out.icon==null) out.icon='';
  if(out.defenseType==null) out.defenseType='';
  return out;
}
function normalizeData(){
  data.identity=data.identity||{};
  data.skills=(Array.isArray(data.skills)?data.skills:[]).map(normalizeSkill);
  data.passives=Array.isArray(data.passives)?data.passives:[];
  data.statuses=Array.isArray(data.statuses)?data.statuses:[];
  data.related=Array.isArray(data.related)?data.related:[];
}
normalizeData();
function showTab(id,btn){document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.getElementById('tab-'+id).classList.add('active');btn.classList.add('active')}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function regexEsc(s=''){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function keywordMap(){
  const map={
    '暴怒':'kw-sin-wrath','色欲':'kw-sin-lust','怠惰':'kw-sin-sloth','暴食':'kw-sin-glut','忧郁':'kw-sin-gloom','傲慢':'kw-sin-pride','嫉妒':'kw-sin-envy',
    '烧伤强度':'kw-burn','烧伤次数':'kw-burn','烧伤':'kw-burn',
    '流血强度':'kw-bleed','流血次数':'kw-bleed','流血':'kw-bleed',
    '震颤强度':'kw-tremor','震颤次数':'kw-tremor','震颤爆发':'kw-tremor','震颤':'kw-tremor',
    '破裂强度':'kw-rupture','破裂次数':'kw-rupture','破裂':'kw-rupture',
    '沉沦强度':'kw-sink','沉沦次数':'kw-sink','沉沦':'kw-sink',
    '呼吸层数':'kw-poise','呼吸次数':'kw-poise','呼吸':'kw-poise',
    '充能层数':'kw-charge','充能次数':'kw-charge','充能':'kw-charge',
    '攻击等级提升':'kw-buff','防御等级提升':'kw-buff','硬币威力强化':'kw-buff','拼点威力强化':'kw-buff','基础威力强化':'kw-buff',
    '伤害强化':'kw-buff','斩击伤害强化':'kw-buff','突刺伤害强化':'kw-buff','打击伤害强化':'kw-buff',
    '迅捷':'kw-buff','守护':'kw-buff','忍耐':'kw-buff','强壮':'kw-buff','保护':'kw-buff','威力提升':'kw-buff',
    '攻击等级降低':'kw-debuff','防御等级降低':'kw-debuff','加算硬币弱化':'kw-debuff','减算硬币弱化':'kw-debuff',
    '硬币威力弱化':'kw-debuff','拼点威力弱化':'kw-debuff','基础威力弱化':'kw-debuff','易损':'kw-debuff','脆弱':'kw-debuff','麻痹':'kw-debuff','束缚':'kw-bind',
    '斩击易损':'kw-debuff','突刺易损':'kw-debuff','打击易损':'kw-debuff','暴怒易损':'kw-debuff','色欲易损':'kw-debuff','怠惰易损':'kw-debuff','暴食易损':'kw-debuff','忧郁易损':'kw-debuff','傲慢易损':'kw-debuff','嫉妒易损':'kw-debuff',
    '绝对共鸣':'kw-mech','最大共鸣':'kw-mech','共鸣':'kw-mech','攻击容量':'kw-mech','攻击加权值':'kw-mech','攻击等级':'kw-mech','防御等级':'kw-mech',
    '硬币威力':'kw-clash','拼点威力':'kw-clash','基础威力':'kw-clash','最终威力':'kw-clash','硬币':'kw-clash','拼点':'kw-clash',
    '精神力':'kw-sp','精神':'kw-sp','混乱阈值':'kw-stagger','混乱强度':'kw-stagger','混乱区间':'kw-stagger','混乱':'kw-stagger',
    'E.G.O':'kw-ego','EGO':'kw-ego','罪孽资源':'kw-mech','罪孽属性':'kw-mech',
    '速度差':'kw-mech','速度':'kw-mech','体力值':'kw-mech','生命值':'kw-mech','血量':'kw-mech',
    '单方面攻击':'kw-mech','防御技能':'kw-mech','守备技能':'kw-mech','反击':'kw-mech','闪避':'kw-mech','防御':'kw-mech',
    '纠缠的棉花':'kw-special','凋零的棉花':'kw-special','红染棉花':'kw-special','棉花纤维':'kw-special'
  };
  if(typeof data!=='undefined' && Array.isArray(data.statuses)){
    for(const st of data.statuses){
      const name=String(st?.name||'').trim();
      if(name) map[name]='kw-special';
    }
  }
  return map;
}
function fmt(s=''){
  let x=esc(s);
  const tags={
    '战斗开始时':'event','回合开始时':'event','回合结束时':'event','战斗结束时':'event',
    '使用时':'use','使用前':'use','使用后':'use','拼点前':'event','拼点时':'event','拼点胜利':'headhit','拼点失败':'danger',
    '命中时':'hit','正面命中时':'headhit','反面命中时':'headhit','未命中时':'headhit','暴击时':'headhit',
    '闪避成功时':'hit','防御成功时':'hit','单方面攻击-命中时':'oneway','重复投掷-命中时':'hit','重复使用-命中时':'hit','击杀时':'hit'
  };
  x=x.replace(/\[([^\]]+)\]/g,(m,t)=>`<span class="${tags[t]||'event'}">[${t}]</span>`);
  const km=keywordMap();
  const keys=Object.keys(km).filter(Boolean).sort((a,b)=>b.length-a.length);
  if(keys.length){
    const re=new RegExp(keys.map(regexEsc).join('|'),'g');
    x=x.replace(re,m=>`<span class="${km[m]}">${m}</span>`);
  }
  return x;
}
function splitLines(s=''){return s.split(/\n+/).filter(Boolean).map(x=>`<p>${fmt(x)}</p>`).join('')}
function syncBasic(){['org','name','subtitle','hp','speed','def','resists','role','sins','systems','cycle'].forEach(k=>data.identity[k]=document.getElementById(k).value);data.identity.stars=document.getElementById('stars').value;render()}
function syncRelated(){data.related=document.getElementById('related').value.split(/\n+/).filter(Boolean).map(x=>{let [f,l]=x.split('|');return [f?.trim()||'',l?.trim()||'']});render()}
function bindBasic(){for(const k of ['org','name','subtitle','hp','speed','def','resists','role','sins','systems','cycle'])document.getElementById(k).value=data.identity[k]||'';document.getElementById('stars').value=data.identity.stars||'◈◈◈';document.getElementById('related').value=data.related.map(x=>x.join('|')).join('\n')}
function sinOpts(sel){return Object.entries(sins).map(([k,v])=>`<option value="${k}" ${sel===k?'selected':''}>${v[0]}</option>`).join('')}
function frameOpts(sel='auto'){return FRAME_OPTIONS.map(opt=>`<option value="${opt.value}" ${sel===opt.value?'selected':''}>${opt.label}</option>`).join('')}
function defenseTypeOpts(sel=''){const opts=[['','自动'],['guard','Guard / 守备'],['evade','Evade / 闪避'],['counter','Counter / 反击']];return opts.map(([v,l])=>`<option value="${v}" ${sel===v?'selected':''}>${l}</option>`).join('')}
function rebuildSkillIconOptions(){
  const options=['<option value="">无 / 留空</option>'];
  let currentGroup='';
  for(const item of SKILL_ICON_MANIFEST){
    const group=item.group||item.identity||'本地图标';
    if(group!==currentGroup){
      if(currentGroup) options.push('</optgroup>');
      currentGroup=group;
      options.push(`<optgroup label="${esc(group)}">`);
    }
    const label=item.label||item.name||item.file;
    options.push(`<option value="${esc(item.file||'')}">${esc(label)}</option>`);
  }
  if(currentGroup) options.push('</optgroup>');
  SKILL_ICON_OPTIONS_HTML=options.join('');
}
function iconOpts(sel=''){
  const marked=SKILL_ICON_OPTIONS_HTML.replace(new RegExp(`value="${regexEsc(sel)}"`,'g'),`value="${esc(sel)}" selected`);
  if(sel && !marked.includes(`value="${esc(sel)}" selected`)) return `<option value="${esc(sel)}" selected>${esc(sel)}</option>`+SKILL_ICON_OPTIONS_HTML;
  return marked;
}
async function loadSkillIconManifest(){
  try{
    const res=await fetch(`./assets/skill_icons/manifest.json?v=${Date.now()}`,{cache:'no-store'});
    if(!res.ok) throw new Error('manifest missing');
    const json=await res.json();
    if(Array.isArray(json) && json.length){
      const merged=new Map(BUILTIN_LCB_ICONS.map(x=>[x.file,x]));
      for(const item of json){ if(item && item.file) merged.set(item.file,{...merged.get(item.file),...item}); }
      SKILL_ICON_MANIFEST=[...merged.values()];
      rebuildSkillIconOptions();
      renderEditors();
      render();
    }
  }catch(e){
    SKILL_ICON_MANIFEST=[...BUILTIN_LCB_ICONS];
    rebuildSkillIconOptions();
    renderEditors();
    render();
    console.warn('manifest 未加载，继续使用内置 48 项 LCB 图标清单：',e);
  }
}
function renderEditors(){
 const s=document.getElementById('skillsEditor');
 const iconHint=SKILL_ICON_MANIFEST.length
   ? `<div class="hint editor-hint">已载入 ${SKILL_ICON_MANIFEST.length} 个 LCB 技能图标选项。图片文件需要存在于 assets/skill_icons/lcb/；GitHub Pages 使用时记得把下载后的 assets 一起 Commit + Push。</div>`
   : `<div class="hint editor-hint">图标选项初始化失败。</div>`;
 s.innerHTML=iconHint+data.skills.map((raw,i)=>{const x=normalizeSkill(raw);return `<div class="card-editor"><div class="card-head"><b>${esc(x.section)} · ${esc(x.name)}</b><button class="btn small danger" onclick="delSkill(${i})">删除</button></div><div class="row"><div class="field"><label>区块标题</label><input value="${esc(x.section)}" oninput="setSkill(${i},'section',this.value)"></div><div class="field"><label>技能名</label><input value="${esc(x.name)}" oninput="setSkill(${i},'name',this.value)"></div></div><div class="row"><div class="field"><label>罪孽</label><select onchange="setSkill(${i},'sin',this.value)">${sinOpts(x.sin)}</select></div><div class="field"><label>伤害类型 / 守备描述</label><input value="${esc(x.type)}" oninput="setSkill(${i},'type',this.value)"></div></div><div class="row"><div class="field"><label>技能框</label><select onchange="setSkill(${i},'frame',this.value)">${frameOpts(x.frame)}</select></div><div class="field"><label>技能图标（本地清单）</label><select onchange="setSkill(${i},'icon',this.value)">${iconOpts(x.icon)}</select></div></div><div class="row"><div class="field"><label>守备类型</label><select onchange="setSkill(${i},'defenseType',this.value)">${defenseTypeOpts(x.defenseType)}</select><div class="hint">守备技能可选 Guard / Evade / Counter；普通技能保持“自动”就行。</div></div><div class="field"><label>版式</label><select onchange="setSkill(${i},'size',this.value)"><option ${x.size==='compact'?'selected':''} value="compact">短</option><option ${x.size==='medium'?'selected':''} value="medium">中</option><option ${x.size==='tall'?'selected':''} value="tall">长</option></select></div></div><div class="row"><div class="field"><label>攻击等级修正</label><input value="${esc(x.offense)}" oninput="setSkill(${i},'offense',this.value)"></div><div class="field"><label>攻击容量</label><input value="${esc(x.capacity)}" oninput="setSkill(${i},'capacity',this.value)"></div></div><div class="row"><div class="field"><label>基础值</label><input value="${esc(x.base)}" oninput="setSkill(${i},'base',this.value)"></div><div class="field"><label><input type="checkbox" ${x.defense?'checked':''} onchange="setSkill(${i},'defense',this.checked)"> 这是守备技能</label></div></div><div class="field"><label>硬币</label><div class="coin-list">${x.coins.map((c,j)=>`<span class="coin-chip"><input value="${esc(c)}" oninput="setCoin(${i},${j},this.value)"><button class="btn small danger" onclick="delCoin(${i},${j})">×</button></span>`).join('')}<button class="btn small" onclick="addCoin(${i})">+硬币</button></div></div><div class="field"><label>效果（一行一条）</label><textarea oninput="setSkill(${i},'effects',this.value)">${esc(x.effects)}</textarea></div></div>`}).join('');
 const p=document.getElementById('passivesEditor');p.innerHTML=data.passives.map((x,i)=>`<div class="card-editor"><div class="card-head"><b>${esc(x.title)} · ${esc(x.name)}</b><button class="btn small danger" onclick="delPassive(${i})">删除</button></div><div class="row"><div class="field"><label>大标题</label><input value="${esc(x.title)}" oninput="setPassive(${i},'title',this.value)"></div><div class="field"><label>被动名</label><input value="${esc(x.name)}" oninput="setPassive(${i},'name',this.value)"></div></div><div class="field"><label>触发条件 / 消耗</label><input value="${esc(x.cost)}" oninput="setPassive(${i},'cost',this.value)"></div><div class="field"><label>效果</label><textarea oninput="setPassive(${i},'effects',this.value)">${esc(x.effects)}</textarea></div><div class="field"><label><input type="checkbox" ${x.support?'checked':''} onchange="setPassive(${i},'support',this.checked)"> 支援被动样式</label></div></div>`).join('');
 const t=document.getElementById('statusesEditor');t.innerHTML=data.statuses.map((x,i)=>`<div class="card-editor"><div class="card-head"><b>${esc(x.name)}</b><button class="btn small danger" onclick="delStatus(${i})">删除</button></div><div class="row"><div class="field"><label>状态名</label><input value="${esc(x.name)}" oninput="setStatus(${i},'name',this.value)"></div><div class="field"><label>最大层数说明</label><input value="${esc(x.cap)}" oninput="setStatus(${i},'cap',this.value)"></div></div><div class="field"><label>图标字符（也可填✿❀✹）</label><input value="${esc(x.icon)}" oninput="setStatus(${i},'icon',this.value)"></div><div class="field"><label>效果</label><textarea oninput="setStatus(${i},'effects',this.value)">${esc(x.effects)}</textarea></div></div>`).join('')
}
function setSkill(i,k,v){data.skills[i]=normalizeSkill(data.skills[i]);data.skills[i][k]=v;renderEditors();render()};
function setCoin(i,j,v){data.skills[i]=normalizeSkill(data.skills[i]);data.skills[i].coins[j]=v;render()};
function addCoin(i){data.skills[i]=normalizeSkill(data.skills[i]);data.skills[i].coins.push('+1');renderEditors();render()};
function delCoin(i,j){data.skills[i]=normalizeSkill(data.skills[i]);data.skills[i].coins.splice(j,1);renderEditors();render()};
function addSkill(){data.skills.push(normalizeSkill({section:'SKILL '+(data.skills.length+1),name:'新技能',sin:'Lust',type:'斩击',offense:'+0',capacity:'1',base:'4',coins:['+4'],size:'compact',defense:false,effects:'[使用时] 在这里写效果'}));renderEditors();render()};
function delSkill(i){data.skills.splice(i,1);renderEditors();render()}
function setPassive(i,k,v){data.passives[i][k]=v;render()};function addPassive(){data.passives.push({title:'PASSIVE',name:'新被动',cost:'',support:false,effects:'在这里写效果'});renderEditors();render()};function delPassive(i){data.passives.splice(i,1);renderEditors();render()}
function setStatus(i,k,v){data.statuses[i][k]=v;render()};function addStatus(){data.statuses.push({name:'新状态',cap:'最大层数 10',icon:'✿',effects:'在这里写效果'});renderEditors();render()};function delStatus(i){data.statuses.splice(i,1);renderEditors();render()}
function resolveDefenseType(x={}){
  const raw=String(x.defenseType||'').trim().toLowerCase();
  if(raw==='guard'||raw==='evade'||raw==='counter') return raw;
  const type=String(x.type||'').toLowerCase();
  if(type.includes('反击')||type.includes('counter')) return 'counter';
  if(type.includes('闪避')||type.includes('evade')) return 'evade';
  return 'guard';
}
function displayType(x={}){if(!x.defense) return x.type||''; const def=resolveDefenseType(x); return x.type||DEFENSE_TYPE_TEXT[def]||'守备';}
function frameChoiceToMeta(choice,key,tier){
  if(choice && choice!=='auto'){
    const [slug,level]=String(choice).split('-');
    return {file:`${choice}.webp`,key:FILE_TO_SIN[slug]||key,tier:Number(level)||tier};
  }
  const actualTier=Math.max(1,Math.min(3,Number(tier)||1));
  const slug=SIN_FILE[key]||'lust';
  return {file:`${slug}-${actualTier}.webp`,key,tier:actualTier};
}
function findSkillIconMeta(file=''){return SKILL_ICON_MANIFEST.find(x=>String(x.file||'')===String(file||''))||null}
function buildSkillIconPath(file=''){if(!file) return ''; if(/^https?:\/\//i.test(file) || file.startsWith('./') || file.startsWith('../') || file.startsWith('/')) return file; return `./assets/skill_icons/${file}`}
function skillAssetImg(kind,key,tier=1,choice=''){
  const slug=SIN_FILE[key]||'lust';
  let local, remote, cls;
  if(kind==='frame'){
    const meta=frameChoiceToMeta(choice,key,tier);
    local=`./assets/skill_frames/${meta.file}`;
    remote=`${DIRECT_CDN}/skill_frames/${meta.file}`;
    cls='frame real-frame';
  }else if(kind==='sin'){
    const file=`${slug}.webp`;
    local=`./assets/sin_icons/${file}`;
    remote=`${DIRECT_CDN}/icons/${file}`;
    cls='sin real-sin';
  }else return '';
  return `<img class="${cls}" src="${local}" data-remote="${remote}" alt="" onerror="fallbackSkillAsset(this)">`;
}
function fallbackSkillAsset(img){
  const remote=img.dataset.remote;
  if(remote && img.dataset.remoteTried!=='1'){
    img.dataset.remoteTried='1';
    img.src=remote;
    return;
  }
  img.style.display='none';
  const p=img.closest('.sigil');
  if(p) p.classList.add('asset-missing');
}
function fallbackSkillIcon(img){img.style.display='none'}
function skillIconImg(x){
  if(!x.icon) return '';
  const meta=findSkillIconMeta(x.icon);
  const label=meta?.label||x.name||'skill';
  return `<img class="skill-art" src="${esc(buildSkillIconPath(x.icon))}" alt="${esc(label)}" onerror="fallbackSkillIcon(this)">`;
}
function defenseBadge(x){const def=resolveDefenseType(x); return `<span class="def-type-badge def-${def}">${DEFENSE_TYPE_EN[def]||def.toUpperCase()}</span>`}
function statusGlyph(file='',label=''){
  const key=String(file||label).replace(/\.png$|\.webp$/i,'').trim().toLowerCase();
  const map={
    bleed:['血','#ef3f3f'],sinking:['沉','#3498ff'],bind:['缚','#49d4df'],haste:['速','#70d875'],
    fragile:['易','#ee7770'],protection:['护','#73d174'],paralyze:['麻','#b482e5'],burn:['烧','#ff6650'],
    tremor:['震','#e5a22a'],rupture:['裂','#62c89a'],poise:['呼','#77c3b8'],charge:['充','#54d9e8'],
    'offense level up':['攻','#77d574'],'offense level down':['攻↓','#e27b73'],
    'defense level up':['防','#77d574'],'defense level down':['防↓','#e27b73'],
    'plus coin drop':['币↓','#b789ff']
  };
  const hit=map[key]||[String(label||key||'?').trim().slice(0,1)||'?', '#b8aa8b'];
  return `<span class="mini-glyph" style="--glyph-color:${hit[1]}">${esc(hit[0])}</span>`;
}
function sigil(raw,tier){
  const x=normalizeSkill(raw);
  const key=x.sin||'Lust';
  const t=x.defense?1:Math.max(1,Math.min(3,Number(tier)||1));
  const slug=SIN_FILE[key]||'lust';
  const badge=x.defense?defenseBadge(x):'';
  return `<div class="sigil sin-${slug} tier-${t} ${x.defense?'defense-sigil':''}">${skillIconImg(x)}${skillAssetImg('frame',key,t,x.frame)}${skillAssetImg('sin',key,t)}${badge}<span class="asset-fallback">${esc((sins[key]||sins.Lust)[0])}</span></div>`;
}
function skillCard(raw){
  const x=normalizeSkill(raw);
  let max=parseFloat(x.base)||0;for(const c of x.coins)max+=parseFloat(String(c).replace('+',''))||0;
  const artMeta=findSkillIconMeta(x.icon);
  const iconLine=artMeta?`<div class="skill-icon-caption">图标：${esc(artMeta.label||x.icon)}</div>`:'';
  if(x.defense)return `<div><div class="section-label">${esc(x.section)}</div><article class="defense-card">${sigil(x,1)}<h3 class="${affClass[x.sin]||''}">${esc(x.name)}</h3><div class="power">${esc((sins[x.sin]||sins.Lust)[0])} · ${esc(displayType(x))}　基础值 ${esc(x.base)}　${x.coins.map(esc).join(' ')}　·　裸最大 ${max}</div>${iconLine}<div class="tags">${splitLines(x.effects)}</div></article></div>`;
  const tier=Math.min(3,Math.max(1,parseInt((x.section.match(/\d+/)||['1'])[0])));
  return `<div><div class="section-label">${esc(x.section)}</div><article class="skill ${esc(x.size)}">${sigil(x,tier)}<div class="skill-head"><div><div class="skill-name ${affClass[x.sin]||''}">${esc(x.name)}</div><div class="coin-row">基础 ${esc(x.base)} ${x.coins.map(c=>`<span class="coin-dot"><span>${esc(c)}</span></span>`).join('')}</div>${iconLine}</div><div class="skill-meta">${esc((sins[x.sin]||sins.Lust)[0])} · ${esc(displayType(x))}<br><b>攻击等级 ${esc(x.offense)}</b><br>裸最大 ${max}<br>攻击容量 ${esc(x.capacity||'1')}</div></div><div class="tags">${splitLines(x.effects)}</div></article></div>`
}
function header(sub,passive=false){let i=data.identity;return `<div class="noise"></div><div class="big-ghost">${passive?'PASSIVE / STATUS':'IDENTITY SKILL'}</div><header class="header"><div class="brand">LIMBUS<br>COMPANY<small>IDENTITY</small></div><div class="identity-title"><div class="org">${esc(i.org)}</div><h1>${esc(i.name)}</h1><div class="sub">${fmt(sub)}</div></div><div class="stats">${passive?`<div class="stat"><b>定位</b><span style="font-size:19px">${fmt(i.role)}</span></div><div class="stat"><b>主罪孽</b><span style="font-size:19px">${fmt(i.sins)}</span></div><div class="stat"><b>副体系</b><span style="font-size:19px">${fmt(i.systems)}</span></div><div class="stat"><b>循环</b><span style="font-size:16px">${fmt(i.cycle)}</span></div><div class="resists"><strong>核心循环</strong><span>${fmt(i.cycle)}</span></div>`:`<div class="stat"><b>生命值</b><span>${esc(i.hp)}</span></div><div class="stat"><b>速度</b><span>${esc(i.speed)}</span></div><div class="stat"><b>防御等级</b><span>${esc(i.def)}</span></div><div class="stat"><b>星级</b><span>${esc(i.stars)}</span></div><div class="resists"><strong>抗性 / 混乱</strong><span>${fmt(i.resists)}</span></div>`}</div><div class="stars">${esc(i.stars)}</div></header>`}
function render(){let left=[],right=[];data.skills.forEach((s,i)=>(i%2?right:left).push(normalizeSkill(s)));document.getElementById('preview').innerHTML=`<div class="sheet-wrap"><section class="sheet" id="skillsPage">${header(data.identity.subtitle,false)}<main class="skills-grid"><div class="column">${left.map(skillCard).join('')}</div><div class="column">${right.map(skillCard).join('')}</div></main><div class="footer-note">DIY IDENTITY WEB EDITOR · 1767×2048</div></section><section class="sheet" id="passivePage">${header('战斗被动 / 支援被动 / 独有状态',true)}<main class="passive-grid"><div class="passive-col">${data.passives.map(p=>`<section class="block"><h2>${esc(p.title)}</h2><br><h3 style="background:${p.support?'#31574d':'#6e482d'}">${esc(p.name)}</h3>${p.cost?`<div class="cost">${fmt(p.cost)}</div>`:''}${splitLines(p.effects)}</section>`).join('')}</div><div class="passive-col"><div class="section-label">UNIQUE STATUS</div><div class="status-list">${data.statuses.map(s=>`<article class="status"><div class="status-icon">${esc(s.icon)}</div><div><h4>${esc(s.name)}</h4><div class="cap">${esc(s.cap)}</div>${splitLines(s.effects)}</div></article>`).join('')}</div><section class="block"><h2>RELATED EFFECTS</h2><div class="mini-icons">${data.related.map(r=>`<span class="mini">${statusGlyph(r[0],r[1])}${esc(r[1])}</span>`).join('')}</div></section></div></main><div class="footer-note">DIY IDENTITY WEB EDITOR · PASSIVE / STATUS · AUTO KEYWORDS</div></section></div>`}
function saveLocal(){localStorage.setItem('limbus_diy_project',JSON.stringify(data));alert('已经保存到这个浏览器里。')};function loadLocal(){let x=localStorage.getItem('limbus_diy_project');if(!x)return alert('这里还没有保存过项目。');data=JSON.parse(x);normalizeData();bindBasic();renderEditors();render()}
function downloadJson(){let a=document.createElement('a');a.download=(data.identity.name||'人格')+'_DIY项目.json';a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function importJson(file){if(!file)return;let r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);normalizeData();bindBasic();renderEditors();render()}catch(e){alert('项目文件格式不对：'+e.message)}};r.readAsText(file)}

function setExportStatus(msg, bad=false){
  const el=document.getElementById('exportStatus');
  if(!el) return;
  el.style.display='block';
  el.style.borderColor=bad?'#713737':'#31524d';
  el.style.background=bad?'#241111':'#0f1d1b';
  el.style.color=bad?'#ffc4c4':'#bfe9e1';
  el.textContent=msg;
}
function blobFromCanvas(canvas){
  return new Promise((resolve,reject)=>{
    if(!canvas.toBlob){
      try{
        const data=canvas.toDataURL('image/png');
        const arr=data.split(','), mime=arr[0].match(/:(.*?);/)[1];
        const bin=atob(arr[1]); const u8=new Uint8Array(bin.length);
        for(let i=0;i<bin.length;i++)u8[i]=bin.charCodeAt(i);
        resolve(new Blob([u8],{type:mime}));
      }catch(e){reject(e)}
      return;
    }
    canvas.toBlob(b=>b?resolve(b):reject(new Error('Canvas 转 PNG 失败')),'image/png',1);
  });
}
async function saveBlobMobile(blob, filename, title){
  const file = new File([blob], filename, {type: blob.type || 'application/octet-stream'});
  if(navigator.share && navigator.canShare){
    try{
      if(navigator.canShare({files:[file]})){
        await navigator.share({title, files:[file]});
        setExportStatus('已调起手机系统分享/保存面板。');
        return true;
      }
    }catch(e){
      if(e && e.name === 'AbortError'){
        setExportStatus('你取消了系统分享面板。');
        return true;
      }
    }
  }

  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=filename; a.rel='noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(()=>{
    try{
      const w=window.open(url,'_blank');
      if(!w) setExportStatus('已请求下载；如果浏览器没有弹出保存，请用右上角菜单选择“在浏览器中打开”后再保存。');
    }catch(e){}
  },120);

  setTimeout(()=>URL.revokeObjectURL(url),60000);
  return true;
}
function makeSheetSvgBlob(id){
  const el=document.getElementById(id);
  if(!el) throw new Error('找不到要保存的页面');
  const clone=el.cloneNode(true);

  const srcImgs=[...el.querySelectorAll('img')];
  const dstImgs=[...clone.querySelectorAll('img')];
  dstImgs.forEach((img,i)=>{
    if(srcImgs[i] && srcImgs[i].src) img.setAttribute('src',srcImgs[i].src);
    img.removeAttribute('crossorigin');
  });

  const css=[...document.querySelectorAll('style')].map(x=>x.textContent).join('\n');
  const xhtml=`<div xmlns="http://www.w3.org/1999/xhtml"><style>${css.replace(/<\/style>/g,'<\\/style>')}</style>${clone.outerHTML}</div>`;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1767" height="2048" viewBox="0 0 1767 2048"><foreignObject width="1767" height="2048">${xhtml}</foreignObject></svg>`;
  return new Blob([svg],{type:'image/svg+xml;charset=utf-8'});
}
async function svgBlobToPng(svgBlob){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(svgBlob);
    const img=new Image();
    img.onload=async()=>{
      try{
        const canvas=document.createElement('canvas');
        canvas.width=1767; canvas.height=2048;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle='#050707'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0,1767,2048);
        const png=await blobFromCanvas(canvas);
        URL.revokeObjectURL(url);
        resolve(png);
      }catch(e){URL.revokeObjectURL(url);reject(e)}
    };
    img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('浏览器无法把 SVG 转成 PNG'))};
    img.src=url;
  });
}

async function waitForExportImages(root){
  const imgs=[...root.querySelectorAll('img')];
  await Promise.all(imgs.map(img=>new Promise(resolve=>{
    if(img.complete){ resolve(); return; }
    const done=()=>resolve();
    img.addEventListener('load',done,{once:true});
    img.addEventListener('error',done,{once:true});
    setTimeout(done,6000);
  })));
}
async function makeUnscaledExportClone(id){
  const source=document.getElementById(id);
  if(!source) throw new Error('找不到要导出的页面');

  const host=document.createElement('div');
  host.id='__export_host__';
  Object.assign(host.style,{
    position:'fixed',
    left:'-10000px',
    top:'0',
    width:'1767px',
    height:'2048px',
    margin:'0',
    padding:'0',
    overflow:'hidden',
    transform:'none',
    transformOrigin:'top left',
    background:'#050707',
    zIndex:'-2147483647',
    pointerEvents:'none'
  });

  const clone=source.cloneNode(true);
  clone.removeAttribute('id');
  clone.id='__export_sheet__';
  clone.style.setProperty('width','1767px','important');
  clone.style.setProperty('height','2048px','important');
  clone.style.setProperty('min-width','1767px','important');
  clone.style.setProperty('max-width','1767px','important');
  clone.style.setProperty('transform','none','important');
  clone.style.setProperty('transform-origin','top left','important');
  clone.style.setProperty('margin','0','important');
  clone.style.setProperty('box-shadow','none','important');

  const srcImgs=[...source.querySelectorAll('img')];
  const dstImgs=[...clone.querySelectorAll('img')];
  dstImgs.forEach((img,i)=>{
    if(srcImgs[i] && srcImgs[i].src) img.src=srcImgs[i].src;
    img.crossOrigin='anonymous';
    img.referrerPolicy='no-referrer';
  });

  host.appendChild(clone);
  document.body.appendChild(host);

  if(document.fonts && document.fonts.ready){
    try{ await document.fonts.ready; }catch(e){}
  }
  await waitForExportImages(clone);
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));

  return {host, clone};
}

async function savePage(id,label){
  setExportStatus('正在生成 '+label+'，手机上可能需要几秒……');
  const filename=(data.identity.name||'人格')+'_'+label+'.png';
  const el=document.getElementById(id);
  if(!el){setExportStatus('保存失败：找不到页面。',true);return}

  if(window.html2canvas){
    let exportCopy=null;
    try{
      exportCopy=await makeUnscaledExportClone(id);
      const canvas=await html2canvas(exportCopy.clone,{
        backgroundColor:'#050707',
        scale:1,
        useCORS:true,
        allowTaint:false,
        width:1767,
        height:2048,
        windowWidth:1767,
        windowHeight:2048,
        scrollX:0,
        scrollY:0,
        logging:false,
        imageTimeout:12000
      });
      const blob=await blobFromCanvas(canvas);
      exportCopy.host.remove();
      await saveBlobMobile(blob,filename,label);
      return;
    }catch(e){
      try{exportCopy?.host?.remove()}catch(_){}
      console.warn('html2canvas export failed, fallback to SVG:',e);
    }
  }

  try{
    const exportCopy=await makeUnscaledExportClone(id);
    const cloneId='__svg_export_'+Date.now();
    exportCopy.clone.id=cloneId;
    const svgBlob=makeSheetSvgBlob(cloneId);
    exportCopy.host.remove();
    try{
      const pngBlob=await svgBlobToPng(svgBlob);
      await saveBlobMobile(pngBlob,filename,label);
      return;
    }catch(e){
      const svgName=(data.identity.name||'人格')+'_'+label+'.svg';
      setExportStatus('当前浏览器不允许直接转 PNG，已经改用 SVG 保存；SVG 仍是完整 1767×2048 页面。');
      await saveBlobMobile(svgBlob,svgName,label+' SVG');
      return;
    }
  }catch(e){
    console.error(e);
    setExportStatus('保存失败：'+(e.message||e),true);
    alert('保存失败：'+(e.message||e));
  }
}

bindBasic();rebuildSkillIconOptions();renderEditors();render();loadSkillIconManifest();

let __deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  __deferredInstallPrompt = event;
});

async function installPwa(){
  if(__deferredInstallPrompt){
    __deferredInstallPrompt.prompt();
    try{ await __deferredInstallPrompt.userChoice; }catch(_e){}
    __deferredInstallPrompt = null;
    return;
  }
  const ua = navigator.userAgent || '';
  if(/iphone|ipad|ipod/i.test(ua)){
    alert('iPhone / iPad：请使用 Safari 打开本页，点“分享”→“添加到主屏幕”。');
  }else{
    alert('如果浏览器没有直接弹出安装：打开浏览器菜单，选择“安装应用”“添加到主屏幕”或类似选项。PWA 需要通过 HTTPS（例如 GitHub Pages）或 localhost 打开，直接 file:// 打开时无法安装。');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const btn=document.getElementById('installPwaBtn');
  if(btn) btn.addEventListener('click', installPwa);
});

window.addEventListener('appinstalled', ()=>{
  __deferredInstallPrompt = null;
});

if('serviceWorker' in navigator && location.protocol !== 'file:'){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Service Worker 注册失败：',err));
  });
}
