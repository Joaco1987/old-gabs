import React, { useState } from "react"; // build 2026-05-22 23:14

// ─── TEMA ─────────────────────────────────────────────────────────────────────
const T={bg:"#0d0f14",surf:"#111520",surf2:"#161b28",border:"#1e2535",border2:"#2a3550",
  text:"#e8eaf0",muted:"#4a5470",muted2:"#6a7490",
  blue:"#4a90e8",green:"#3ecf7a",amber:"#e09020",red:"#e05555",
  purple:"#8b6fe8",cyan:"#2ab8d4",maroon:"#8B1A2D"};

// ══════════════════════════════════════════════════════════════════════════════
// DATOS — EXTRAÍDOS DIRECTAMENTE DEL DRIVE "Old Gabs 1era"
// Promedio >21 copiado de fila Promedio del sheet (exacto)
// h15 = zona 15-18 = AI(>15) - AI(>18) - spr (calculado cuando hay sub-tabla)
// ══════════════════════════════════════════════════════════════════════════════

// ─── GPS DATA — leído en vivo desde Drive ─────────────────────────────────────
const APPS_URL="https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec";

function parseMin(s){
  if(s===null||s===undefined||s==="")return 0;
  if(typeof s==="number"){
    // Fraction of day (Excel/Sheets time format)
    if(s>0&&s<1) return Math.round(s*24*60);
    // Already minutes
    if(s>1&&s<1440) return Math.round(s);
    return 0;
  }
  if(s instanceof Date) return s.getHours()*60+s.getMinutes()+Math.round(s.getSeconds()/60);
  const str=String(s).trim();
  // ISO date string like "2026-04-06T04:00:00.000Z" — not a time, skip
  if(str.includes("T")&&str.includes("Z")) return 0;
  const p=str.split(":");
  try{
    if(p.length===3)return Math.round(parseInt(p[0])*60+parseInt(p[1])+parseInt(p[2])/60);
    if(p.length===2)return Math.round(parseInt(p[0])*60+parseInt(p[1]));
  }catch(e){}
  return 0;
}

function parseNum(s){
  if(s===null||s===undefined||s==="")return null;
  if(typeof s==="number"&&!isNaN(s)) return s;
  try{
    const s2=String(s).trim().replace(/\s/g,"");
    if(!s2)return null;
    // "1.245" with 3 decimal digits = thousands separator = 1245
    if(s2.includes(".")&&s2.split(".").pop().length===3&&!s2.includes(","))
      return parseFloat(s2.replace(/\./g,""));
    return parseFloat(s2.replace(",","."));
  }catch(e){return null;}
}

function fmtDate(s){
  // Convert any date representation to readable label
  if(!s) return "";
  const str=String(s).trim();
  // ISO: "2026-04-06T04:00:00.000Z" -> "6-abr"
  const MESES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  if(str.includes("T")){
    try{
      const d=new Date(str);
      return `${d.getUTCDate()}-${MESES[d.getUTCMonth()]}`;
    }catch(e){}
  }
  return str;
}

const GPS_SKIP=new Set(["Promedio","Max","Min","JUGADORA","PROMEDIOS",""]);

function parseGPSSheet(rows, tipo){
  const sessions=[];
  const processed=new Set();

  // Detectar offset: si col[0] está vacía y col[1] tiene datos → offset=1, si col[0] tiene datos → offset=0
  let dataOffset=1;
  for(const r of rows){
    const c0=String(r?.[0]||"").trim();
    const c1=String(r?.[1]||"").trim();
    if(c1==="JUGADORA"||c1.startsWith("PARTIDO VS ")||c1.startsWith("AMISTOSO VS ")){dataOffset=1;break;}
    if(c0==="JUGADORA"||c0.startsWith("PARTIDO VS ")||c0.startsWith("AMISTOSO VS ")){dataOffset=0;break;}
  }

  // Recolectar todas las filas JUGADORA
  const headerRows=[];
  for(let i=0;i<rows.length;i++){
    if(String(rows[i]?.[dataOffset]||"").trim()==="JUGADORA") headerRows.push(i);
  }

  for(const hRow of headerRows){
    let label="";
    let sessionTipo=tipo;
    for(let k=hRow-1;k>=Math.max(0,hRow-4);k--){
      const cell=String(rows[k]?.[dataOffset]||"").trim();
      if(!cell) continue;
      if(cell.startsWith("PARTIDO VS ")){label=cell.replace("PARTIDO VS ","").trim();sessionTipo="partido";break;}
      if(cell.startsWith("AMISTOSO VS ")){label=cell.replace("AMISTOSO VS ","").trim();sessionTipo="amistoso";break;}
      if(!GPS_SKIP.has(cell)&&cell!=="JUGADORA"){label=fmtDate(cell);sessionTipo=tipo;break;}
    }
    if(!label) label=`Sesión ${sessions.length+1}`;

    const key=`${sessionTipo}-${label}-${hRow}`;
    if(processed.has(key)) continue;
    processed.add(key);

    const o=dataOffset;
    const jugadoras=[];
    for(let k=hRow+1;k<rows.length;k++){
      const r=rows[k]||[];
      const name=String(r[o]||"").trim();
      if(!name) break;
      if(GPS_SKIP.has(name)) continue;
      const mins=parseMin(r[o+1]);
      const dist_raw=parseNum(r[o+2]);
      if(mins<=0||!dist_raw||dist_raw<=0) continue;
      const g=(i)=>parseNum(r[o+i]);
      const rnd=(v)=>v!=null?Math.round(v):null;
      const rnd1=(v)=>v!=null?Math.round(v*10)/10:null;
      jugadoras.push({
        n:name,min:mins,dist:Math.round(dist_raw),
        mxm:rnd1(g(3)),hsr:rnd(g(4)),ai18:rnd(g(5)),
        spr:rnd(g(6)),acc:rnd(g(7)),dsc:rnd(g(8)),
        ns:rnd(g(9)),vmax:rnd1(g(10))
      });
    }

    if(jugadoras.length>0){
      const id=(sessionTipo==="partido"?"p":sessionTipo==="amistoso"?"a":"e")+label.replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,"").toLowerCase()+"_"+hRow;
      sessions.push({id,label:`vs ${label}`,fecha:label,tipo:sessionTipo,jugadoras});
    }
  }
  return sessions;
}

function useGPSData(){
  const [data,setData]=useState({
    partidos:PARTIDOS_FB,
    amistosos:AMISTOSOS_FB,
    entrenos:ENTRENOS_FB,
    loading:false,
    error:null
  });
  React.useEffect(()=>{
    const fetchSheet=(hoja)=>
      fetch(`${APPS_URL}?accion=gps&hoja=${encodeURIComponent(hoja)}`)
        .then(r=>r.json())
        .catch(()=>null);

    Promise.all([
      fetchSheet("Partidos"),
      fetchSheet("Entrenamientos"),
      fetchSheet("Amistosos")
    ]).then(([pRows,eRows,aRows])=>{
      try{
        const partidos=pRows&&pRows.length>1?parseGPSSheet(pRows,"partido"):[];
        const entrenos=eRows&&eRows.length>1?parseGPSSheet(eRows,"entreno"):[];
        const amistosos=aRows&&aRows.length>1?parseGPSSheet(aRows,"amistoso"):[];
        setData({
          partidos:partidos.length?partidos:PARTIDOS_FB,
          amistosos:amistosos.length?amistosos:AMISTOSOS_FB,
          entrenos:entrenos.length?entrenos:ENTRENOS_FB,
          loading:false,error:null
        });
      }catch(err){
        console.error("GPS parse error:",err);
      }
    }).catch(err=>console.error("GPS fetch error:",err));
  },[]);
  return data;
}

// Contexto global de GPS
const GPSContext=React.createContext(null);
function GPSProvider({children}){
  const gps=useGPSData();
  return React.createElement(GPSContext.Provider,{value:gps},children);
}
function useGPS(){return React.useContext(GPSContext)||{};}

// Fallbacks hardcodeados (usados si Drive falla)
const PARTIDOS_FB=[
  {id:"pcogs",label:"vs COGS",fecha:"COGS",tipo:"partido",jugadoras:[
    {n:"Gomez Camila",min:48,dist:4630,mxm:96.0,hsr:317,ai18:16,spr:0,acc:5,dsc:10,ns:0,vmax:20.2},
    {n:"Alfaro Javiera",min:45,dist:4961,mxm:109.0,hsr:351,ai18:42,spr:0,acc:6,dsc:15,ns:0,vmax:20.8},
    {n:"Gacitua Emilia",min:52,dist:5578,mxm:107.0,hsr:840,ai18:235,spr:137,acc:32,dsc:40,ns:10,vmax:25.2},
    {n:"Pareja Camila",min:64,dist:5617,mxm:87.0,hsr:255,ai18:57,spr:0,acc:5,dsc:10,ns:0,vmax:23.0},
    {n:"Muñoz Constanza",min:62,dist:5702,mxm:93.0,hsr:575,ai18:198,spr:0,acc:7,dsc:20,ns:0,vmax:23.9},
    {n:"Pollmann Marianne",min:60,dist:6162,mxm:103.0,hsr:677,ai18:179,spr:0,acc:12,dsc:17,ns:0,vmax:22.4},
    {n:"Errazu Sofia",min:57,dist:6298,mxm:111.0,hsr:434,ai18:69,spr:0,acc:24,dsc:21,ns:0,vmax:20.7},
    {n:"Sierra Julieta",min:59,dist:6558,mxm:112.0,hsr:871,ai18:275,spr:0,acc:13,dsc:30,ns:0,vmax:23.9},
    {n:"Silva Victoria",min:57,dist:6681,mxm:117.0,hsr:1191,ai18:310,spr:108,acc:25,dsc:45,ns:6,vmax:23.4},
    {n:"Gutierrez Renata",min:63,dist:6808,mxm:107.0,hsr:582,ai18:106,spr:0,acc:9,dsc:17,ns:0,vmax:20.1}
  ]},
  {id:"ppwcc",label:"vs PWCC",fecha:"PWCC",tipo:"partido",jugadoras:[
    {n:"Gomez Camila",min:42,dist:3996,mxm:95.0,hsr:569,ai18:130,spr:2,acc:9,dsc:13,ns:0,vmax:21.0},
    {n:"Pareja Camila",min:66,dist:5308,mxm:80.0,hsr:339,ai18:73,spr:0,acc:6,dsc:9,ns:0,vmax:22.7},
    {n:"Muñoz Constanza",min:66,dist:5406,mxm:82.0,hsr:462,ai18:224,spr:0,acc:19,dsc:18,ns:0,vmax:22.5},
    {n:"Errazu Sofia",min:51,dist:5528,mxm:109.0,hsr:622,ai18:159,spr:0,acc:22,dsc:17,ns:0,vmax:21.8},
    {n:"Carrasco Sofia",min:46,dist:5631,mxm:122.0,hsr:1121,ai18:378,spr:0,acc:17,dsc:22,ns:0,vmax:22.9},
    {n:"Silva Victoria",min:50,dist:5805,mxm:117.0,hsr:1418,ai18:381,spr:215,acc:31,dsc:36,ns:12,vmax:24.8},
    {n:"Pollmann Marianne",min:58,dist:5945,mxm:103.0,hsr:487,ai18:90,spr:0,acc:15,dsc:14,ns:0,vmax:20.3},
    {n:"Sierra Julieta",min:62,dist:6632,mxm:107.0,hsr:1061,ai18:357,spr:0,acc:28,dsc:39,ns:0,vmax:22.6},
    {n:"Gutierrez Renata",min:66,dist:6754,mxm:102.0,hsr:603,ai18:113,spr:0,acc:8,dsc:15,ns:0,vmax:21.3},
    {n:"Gacitua Emilia",min:66,dist:6960,mxm:105.0,hsr:1055,ai18:263,spr:157,acc:28,dsc:31,ns:8,vmax:24.1}
  ]},
  {id:"pmanquehue",label:"vs MANQUEHUE",fecha:"MANQUEHUE",tipo:"partido",jugadoras:[
    {n:"Alfaro Javiera",min:28,dist:3190,mxm:112.0,hsr:449,ai18:159,spr:0,acc:9,dsc:16,ns:0,vmax:22.8},
    {n:"Carrasco Sofia",min:32,dist:3964,mxm:124.0,hsr:929,ai18:289,spr:0,acc:26,dsc:42,ns:0,vmax:22.9},
    {n:"Gomez Camila",min:49,dist:4744,mxm:96.0,hsr:484,ai18:63,spr:0,acc:5,dsc:18,ns:0,vmax:20.3},
    {n:"Muñoz Constanza",min:63,dist:5384,mxm:85.0,hsr:397,ai18:82,spr:0,acc:12,dsc:17,ns:0,vmax:21.6},
    {n:"Liu Macarena",min:48,dist:5532,mxm:116.0,hsr:883,ai18:266,spr:0,acc:22,dsc:26,ns:0,vmax:22.5},
    {n:"Pareja Camila",min:71,dist:6123,mxm:86.0,hsr:281,ai18:62,spr:0,acc:11,dsc:20,ns:0,vmax:21.2},
    {n:"Gutierrez Renata",min:71,dist:6822,mxm:96.0,hsr:715,ai18:280,spr:0,acc:14,dsc:24,ns:0,vmax:22.9},
    {n:"Pollmann Marianne",min:71,dist:6952,mxm:98.0,hsr:653,ai18:123,spr:0,acc:27,dsc:14,ns:0,vmax:21.9},
    {n:"Gacitua Emilia",min:71,dist:7854,mxm:111.0,hsr:1137,ai18:319,spr:0,acc:38,dsc:48,ns:0,vmax:23.4},
    {n:"Sierra Julieta",min:71,dist:7929,mxm:112.0,hsr:1086,ai18:318,spr:11,acc:39,dsc:61,ns:1,vmax:24.6},
    {n:"Silva Victoria",min:71,dist:8142,mxm:115.0,hsr:1469,ai18:570,spr:16,acc:45,dsc:52,ns:1,vmax:24.7}
  ]},
  {id:"pcatlicab",label:"vs CATÓLICA B",fecha:"CATÓLICA B",tipo:"partido",jugadoras:[
    {n:"Alfaro Javiera",min:27,dist:2917,mxm:108.0,hsr:296,ai18:73,spr:0,acc:4,dsc:15,ns:0,vmax:21.6},
    {n:"Carrasco Sofia",min:26,dist:3006,mxm:116.0,hsr:610,ai18:220,spr:0,acc:20,dsc:40,ns:0,vmax:22.7},
    {n:"Gomez Camila",min:40,dist:3879,mxm:98.0,hsr:372,ai18:82,spr:0,acc:6,dsc:13,ns:0,vmax:20.8},
    {n:"Errazu Sofia",min:44,dist:5031,mxm:114.0,hsr:935,ai18:345,spr:5,acc:23,dsc:18,ns:0,vmax:24.3},
    {n:"Pollmann Marianne",min:64,dist:5874,mxm:92.0,hsr:567,ai18:169,spr:0,acc:17,dsc:19,ns:0,vmax:22.9},
    {n:"Pareja Camila",min:65,dist:6121,mxm:94.0,hsr:355,ai18:87,spr:0,acc:15,dsc:16,ns:0,vmax:22.4},
    {n:"Muñoz Constanza",min:65,dist:6258,mxm:96.0,hsr:390,ai18:125,spr:0,acc:6,dsc:12,ns:0,vmax:22.6},
    {n:"Sierra Julieta",min:65,dist:6676,mxm:102.0,hsr:594,ai18:225,spr:0,acc:27,dsc:40,ns:0,vmax:23.1},
    {n:"Gutierrez Renata",min:65,dist:6806,mxm:104.0,hsr:551,ai18:112,spr:0,acc:19,dsc:18,ns:0,vmax:21.1},
    {n:"Gacitua Emilia",min:65,dist:7339,mxm:112.0,hsr:958,ai18:364,spr:9,acc:29,dsc:35,ns:0,vmax:25.1},
    {n:"Silva Victoria",min:65,dist:7723,mxm:118.0,hsr:1096,ai18:419,spr:7,acc:31,dsc:44,ns:1,vmax:24.8}
  ]},
  {id:"poldreds",label:"vs OLD REDS",fecha:"OLD REDS",tipo:"partido",jugadoras:[
    {n:"Alfaro Javiera",min:19,dist:2277,mxm:119.0,hsr:367,ai18:76,spr:0,acc:8,dsc:10,ns:0,vmax:20.3},
    {n:"Carrasco Sofia",min:61,dist:6656,mxm:108.0,hsr:1241,ai18:404,spr:83,acc:36,dsc:52,ns:6,vmax:22.8},
    {n:"Gomez Camila",min:36,dist:3292,mxm:91.0,hsr:251,ai18:46,spr:43,acc:7,dsc:13,ns:2,vmax:23.4},
    {n:"Liu Macarena",min:64,dist:6993,mxm:109.0,hsr:1341,ai18:352,spr:89,acc:26,dsc:26,ns:4,vmax:24.1},
    {n:"Pollmann Marianne",min:62,dist:6078,mxm:98.0,hsr:655,ai18:129,spr:22,acc:16,dsc:23,ns:2,vmax:22.5},
    {n:"Pareja Camila",min:68,dist:6376,mxm:93.0,hsr:532,ai18:113,spr:6,acc:13,dsc:22,ns:1,vmax:22.0},
    {n:"Muñoz Constanza",min:68,dist:6420,mxm:94.0,hsr:588,ai18:161,spr:41,acc:7,dsc:16,ns:4,vmax:25.7},
    {n:"Sierra Julieta",min:68,dist:7271,mxm:107.0,hsr:992,ai18:265,spr:45,acc:25,dsc:49,ns:4,vmax:22.9},
    {n:"Gutierrez Renata",min:68,dist:7141,mxm:105.0,hsr:896,ai18:155,spr:74,acc:16,dsc:26,ns:4,vmax:24.1},
    {n:"Gacitua Emilia",min:68,dist:7463,mxm:109.0,hsr:1216,ai18:365,spr:191,acc:28,dsc:43,ns:12,vmax:24.3},
    {n:"Silva Victoria",min:68,dist:7802,mxm:114.0,hsr:1478,ai18:469,spr:222,acc:31,dsc:58,ns:15,vmax:25.8}
  ]},
  {id:"poldgirls",label:"vs OLD GIRLS",fecha:"OLD GIRLS",tipo:"partido",jugadoras:[
    {n:"Errazu Sofia",min:41,dist:4876,mxm:118.0,hsr:652,ai18:115,spr:0,acc:29,dsc:26,ns:0,vmax:21.3},
    {n:"Pareja Camila",min:65,dist:5471,mxm:85.0,hsr:245,ai18:76,spr:0,acc:5,dsc:17,ns:0,vmax:21.3},
    {n:"Pollmann Marianne",min:55,dist:5664,mxm:104.0,hsr:537,ai18:127,spr:0,acc:21,dsc:20,ns:0,vmax:23.5},
    {n:"Liu Macarena",min:50,dist:5812,mxm:116.0,hsr:1170,ai18:353,spr:0,acc:35,dsc:21,ns:0,vmax:23.0},
    {n:"Muñoz Constanza",min:65,dist:5982,mxm:93.0,hsr:282,ai18:40,spr:0,acc:12,dsc:21,ns:0,vmax:20.9},
    {n:"Gacitua Emilia",min:56,dist:6059,mxm:109.0,hsr:954,ai18:507,spr:13,acc:36,dsc:41,ns:1,vmax:25.3},
    {n:"Gutierrez Renata",min:65,dist:6478,mxm:100.0,hsr:430,ai18:154,spr:0,acc:14,dsc:24,ns:0,vmax:22.8},
    {n:"Silva Victoria",min:60,dist:7275,mxm:122.0,hsr:1563,ai18:716,spr:0,acc:39,dsc:58,ns:0,vmax:24.0},
    {n:"Mateluna Florencia",min:65,dist:7441,mxm:115.0,hsr:1080,ai18:454,spr:0,acc:24,dsc:31,ns:0,vmax:23.3},
    {n:"Sierra Julieta",min:63,dist:7505,mxm:119.0,hsr:1189,ai18:373,spr:0,acc:37,dsc:60,ns:0,vmax:23.1}
  ]},
  {id:"pucatolicaa",label:"vs U CATOLICA A",fecha:"U CATOLICA A",tipo:"partido",jugadoras:[
    {n:"Gacitua Emilia",min:67,dist:6750,mxm:100.0,hsr:931,ai18:385,spr:0,acc:24,dsc:38,ns:0,vmax:23.6},
    {n:"Silva Victoria",min:67,dist:6963,mxm:103.0,hsr:1004,ai18:434,spr:0,acc:30,dsc:52,ns:0,vmax:23.3},
    {n:"Pollmann Marianne",min:66,dist:6766,mxm:102.0,hsr:488,ai18:125,spr:0,acc:10,dsc:6,ns:0,vmax:23.1},
    {n:"Carrasco Sofia",min:24,dist:2601,mxm:107.0,hsr:617,ai18:215,spr:0,acc:15,dsc:31,ns:0,vmax:22.8},
    {n:"Sierra Julieta",min:57,dist:6742,mxm:118.0,hsr:1024,ai18:221,spr:0,acc:22,dsc:51,ns:0,vmax:22.6},
    {n:"Errazu Sofia",min:32,dist:3879,mxm:122.0,hsr:606,ai18:190,spr:0,acc:16,dsc:23,ns:0,vmax:22.6},
    {n:"Mateluna Florencia",min:62,dist:6081,mxm:98.0,hsr:645,ai18:234,spr:0,acc:20,dsc:28,ns:0,vmax:22.6},
    {n:"Liu Macarena",min:34,dist:4377,mxm:128.0,hsr:835,ai18:336,spr:0,acc:13,dsc:26,ns:0,vmax:22.5},
    {n:"Alfaro Javiera",min:32,dist:3448,mxm:108.0,hsr:386,ai18:98,spr:0,acc:10,dsc:17,ns:0,vmax:22.4},
    {n:"Gutierrez Renata",min:67,dist:7022,mxm:104.0,hsr:581,ai18:152,spr:0,acc:11,dsc:26,ns:0,vmax:22.2},
    {n:"Pareja Camila",min:67,dist:5183,mxm:77.0,hsr:155,ai18:54,spr:0,acc:10,dsc:9,ns:0,vmax:21.2}
  ]},
];
const AMISTOSOS_FB=[
  {id:"apwccb",label:"vs PWCC B",fecha:"PWCC B",tipo:"amistoso",jugadoras:[
    {n:"Gomez Camila",min:32,dist:2898,mxm:90.0,hsr:190,ai18:32,spr:0,acc:2,dsc:6,ns:0,vmax:20.1},
    {n:"Carrasco Sofia",min:37,dist:4031,mxm:109.0,hsr:604,ai18:268,spr:0,acc:14,dsc:22,ns:0,vmax:22.5},
    {n:"Alfaro Javiera",min:37,dist:4085,mxm:110.0,hsr:433,ai18:71,spr:0,acc:2,dsc:15,ns:0,vmax:20.4},
    {n:"Mateluna Florencia",min:42,dist:4454,mxm:106.0,hsr:423,ai18:68,spr:18,acc:8,dsc:17,ns:1,vmax:21.9},
    {n:"Pareja Camila",min:53,dist:4886,mxm:93.0,hsr:271,ai18:39,spr:0,acc:5,dsc:8,ns:0,vmax:21.5},
    {n:"Gutierrez Renata",min:53,dist:5048,mxm:96.0,hsr:376,ai18:96,spr:0,acc:7,dsc:6,ns:0,vmax:21.1},
    {n:"Pollmann Marianne",min:50,dist:5133,mxm:102.0,hsr:511,ai18:113,spr:0,acc:9,dsc:28,ns:0,vmax:23.0},
    {n:"Errazu Sofia",min:53,dist:5337,mxm:101.0,hsr:705,ai18:245,spr:0,acc:10,dsc:8,ns:0,vmax:22.5},
    {n:"Gacitua Emilia",min:53,dist:5344,mxm:101.0,hsr:650,ai18:200,spr:63,acc:22,dsc:29,ns:4,vmax:24.5},
    {n:"Sierra Julieta",min:53,dist:5566,mxm:106.0,hsr:514,ai18:142,spr:0,acc:24,dsc:31,ns:0,vmax:22.7}
  ]},
  {id:"aucatlicaab",label:"vs U. CATÓLICA A - B",fecha:"U. CATÓLICA A - B",tipo:"amistoso",jugadoras:[
    {n:"Gomez Camila",min:35,dist:2999,mxm:85.0,hsr:223,ai18:21,spr:0,acc:6,dsc:11,ns:0,vmax:19.2},
    {n:"Alfaro Javiera",min:42,dist:3607,mxm:87.0,hsr:288,ai18:50,spr:0,acc:3,dsc:19,ns:0,vmax:21.6},
    {n:"Carrasco Sofia",min:42,dist:4011,mxm:96.0,hsr:765,ai18:356,spr:0,acc:16,dsc:28,ns:0,vmax:23.6},
    {n:"Errazu Sofia",min:42,dist:4368,mxm:105.0,hsr:704,ai18:280,spr:0,acc:11,dsc:12,ns:0,vmax:21.6},
    {n:"Pareja Camila",min:63,dist:5219,mxm:82.0,hsr:143,ai18:27,spr:0,acc:6,dsc:5,ns:0,vmax:19.2},
    {n:"Gutierrez Renata",min:63,dist:5667,mxm:90.0,hsr:364,ai18:78,spr:0,acc:8,dsc:13,ns:0,vmax:21.9},
    {n:"Sierra Julieta",min:63,dist:5815,mxm:92.0,hsr:432,ai18:111,spr:0,acc:18,dsc:26,ns:0,vmax:21.5},
    {n:"Silva Victoria",min:57,dist:5830,mxm:102.0,hsr:672,ai18:144,spr:83,acc:19,dsc:34,ns:6,vmax:25.3},
    {n:"Pollmann Marianne",min:63,dist:6143,mxm:97.0,hsr:683,ai18:95,spr:0,acc:7,dsc:34,ns:0,vmax:20.7},
    {n:"Gacitua Emilia",min:63,dist:6185,mxm:98.0,hsr:729,ai18:191,spr:127,acc:25,dsc:33,ns:8,vmax:24.8}
  ]},
  {id:"apwccb",label:"vs PWCC B",fecha:"PWCC B",tipo:"amistoso",jugadoras:[
    {n:"Errazu Sofia",min:10,dist:1245,mxm:124.0,hsr:210,ai18:52,spr:0,acc:2,dsc:3,ns:0,vmax:20.9},
    {n:"Gomez Camila",min:35,dist:3566,mxm:103.0,hsr:260,ai18:45,spr:0,acc:3,dsc:15,ns:0,vmax:21.4},
    {n:"Sierra Julieta",min:32,dist:3793,mxm:117.0,hsr:408,ai18:112,spr:0,acc:8,dsc:14,ns:0,vmax:21.9},
    {n:"Pollmann Marianne",min:49,dist:4954,mxm:102.0,hsr:443,ai18:92,spr:0,acc:5,dsc:14,ns:0,vmax:21.3},
    {n:"Alfaro Javiera",min:53,dist:5272,mxm:100.0,hsr:205,ai18:29,spr:5,acc:3,dsc:14,ns:0,vmax:25.4},
    {n:"Muñoz Constanza",min:59,dist:5391,mxm:91.0,hsr:309,ai18:44,spr:0,acc:4,dsc:9,ns:0,vmax:21.0},
    {n:"Carrasco Sofia",min:48,dist:5464,mxm:113.0,hsr:940,ai18:338,spr:0,acc:18,dsc:43,ns:0,vmax:23.3},
    {n:"Pareja Camila",min:61,dist:6,mxm:91.0,hsr:346,ai18:104,spr:0,acc:9,dsc:15,ns:0,vmax:21.1},
    {n:"Silva Victoria",min:51,dist:6,mxm:114.0,hsr:813,ai18:207,spr:0,acc:25,dsc:30,ns:0,vmax:22.8},
    {n:"Gutierrez Renata",min:61,dist:6082,mxm:99.0,hsr:527,ai18:123,spr:0,acc:8,dsc:11,ns:0,vmax:21.9},
    {n:"Gacitua Emilia",min:57,dist:6,mxm:109.0,hsr:976,ai18:391,spr:13,acc:22,dsc:30,ns:0,vmax:26.0}
  ]},
];
const ENTRENOS_FB=[
  {id:"e6abr",label:"vs 6-abr",fecha:"6-abr",tipo:"entreno",jugadoras:[
    {n:"Gomez Camila",min:51,dist:5161,mxm:100.0,hsr:782,ai18:70,spr:0,acc:2,dsc:9,ns:0,vmax:20.1},
    {n:"Sierra Julieta",min:53,dist:5566,mxm:106.0,hsr:514,ai18:142,spr:0,acc:24,dsc:31,ns:0,vmax:22.7},
    {n:"Alfaro Javiera",min:55,dist:6144,mxm:113.0,hsr:1592,ai18:215,spr:0,acc:6,dsc:16,ns:0,vmax:20.6},
    {n:"Carrasco Sofia",min:56,dist:6204,mxm:111.0,hsr:1910,ai18:839,spr:0,acc:22,dsc:22,ns:0,vmax:22.6},
    {n:"Mateluna Florencia",min:61,dist:6831,mxm:112.0,hsr:1863,ai18:386,spr:18,acc:27,dsc:18,ns:1,vmax:21.9},
    {n:"Pareja Camila",min:66,dist:6945,mxm:105.0,hsr:1381,ai18:61,spr:0,acc:7,dsc:8,ns:0,vmax:21.5},
    {n:"Pollmann Marianne",min:66,dist:7322,mxm:111.0,hsr:1938,ai18:454,spr:0,acc:11,dsc:29,ns:0,vmax:23.0},
    {n:"Gutierrez Renata",min:70,dist:7359,mxm:105.0,hsr:1927,ai18:302,spr:0,acc:17,dsc:6,ns:0,vmax:21.1},
    {n:"Errazu Sofia",min:71,dist:7608,mxm:106.0,hsr:2151,ai18:952,spr:0,acc:37,dsc:9,ns:0,vmax:22.5},
    {n:"Gacitua Emilia",min:72,dist:7916,mxm:110.0,hsr:2253,ai18:922,spr:95,acc:29,dsc:33,ns:6,vmax:24.5}
  ]},
  {id:"e8abr",label:"vs 8-abr",fecha:"8-abr",tipo:"entreno",jugadoras:[
    {n:"Pareja Camila",min:21,dist:1365,mxm:64.0,hsr:635,ai18:195,spr:0,acc:44,dsc:23,ns:0,vmax:20.6},
    {n:"Carrasco Sofia",min:21,dist:1428,mxm:67.0,hsr:858,ai18:614,spr:0,acc:47,dsc:40,ns:0,vmax:23.5},
    {n:"Gomez Camila",min:21,dist:1433,mxm:67.0,hsr:685,ai18:120,spr:2,acc:35,dsc:25,ns:0,vmax:21.0},
    {n:"Alfaro Javiera",min:21,dist:1464,mxm:69.0,hsr:772,ai18:300,spr:0,acc:42,dsc:28,ns:0,vmax:21.1},
    {n:"Pollmann Marianne",min:21,dist:1487,mxm:70.0,hsr:694,ai18:213,spr:0,acc:38,dsc:21,ns:0,vmax:20.6},
    {n:"Gutierrez Renata",min:21,dist:1545,mxm:72.0,hsr:823,ai18:421,spr:0,acc:44,dsc:30,ns:0,vmax:21.6},
    {n:"Mateluna Florencia",min:21,dist:1582,mxm:74.0,hsr:816,ai18:364,spr:3,acc:50,dsc:25,ns:0,vmax:21.1},
    {n:"Gacitua Emilia",min:21,dist:1594,mxm:75.0,hsr:856,ai18:503,spr:67,acc:46,dsc:27,ns:4,vmax:22.9}
  ]},
  {id:"e10abr",label:"vs 10-abr",fecha:"10-abr",tipo:"entreno",jugadoras:[
    {n:"Gomez Camila",min:20,dist:1161,mxm:58.0,hsr:312,ai18:109,spr:52,acc:30,dsc:7,ns:3,vmax:23.2},
    {n:"Gutierrez Renata",min:20,dist:1221,mxm:61.0,hsr:351,ai18:187,spr:37,acc:30,dsc:7,ns:3,vmax:26.9},
    {n:"Pollmann Marianne",min:20,dist:1275,mxm:64.0,hsr:346,ai18:213,spr:0,acc:30,dsc:2,ns:0,vmax:24.7},
    {n:"Carrasco Sofia",min:20,dist:1310,mxm:66.0,hsr:434,ai18:304,spr:30,acc:30,dsc:17,ns:2,vmax:26.5},
    {n:"Alfaro Javiera",min:20,dist:1322,mxm:66.0,hsr:357,ai18:211,spr:4,acc:30,dsc:0,ns:0,vmax:25.3},
    {n:"Gacitua Emilia",min:20,dist:1408,mxm:71.0,hsr:410,ai18:138,spr:187,acc:31,dsc:17,ns:13,vmax:28.5},
    {n:"Mateluna Florencia",min:20,dist:1412,mxm:71.0,hsr:392,ai18:157,spr:101,acc:30,dsc:1,ns:4,vmax:26.2}
  ]},
  {id:"e13abr",label:"vs 13-abr",fecha:"13-abr",tipo:"entreno",jugadoras:[
    {n:"Errazu Sofia",min:13,dist:1123,mxm:88.0,hsr:639,ai18:332,spr:3,acc:12,dsc:8,ns:0,vmax:24.5},
    {n:"Pollmann Marianne",min:15,dist:1349,mxm:110.0,hsr:646,ai18:232,spr:0,acc:9,dsc:4,ns:0,vmax:23.1},
    {n:"Gutierrez Renata",min:15,dist:1477,mxm:95.0,hsr:709,ai18:54,spr:0,acc:4,dsc:0,ns:0,vmax:19.6},
    {n:"Gomez Camila",min:16,dist:1536,mxm:97.0,hsr:511,ai18:52,spr:0,acc:5,dsc:3,ns:0,vmax:20.9},
    {n:"Pastenes Nicole",min:16,dist:1582,mxm:100.0,hsr:418,ai18:101,spr:0,acc:3,dsc:1,ns:0,vmax:21.7},
    {n:"Carrasco Sofia",min:15,dist:1638,mxm:106.0,hsr:961,ai18:525,spr:0,acc:20,dsc:11,ns:0,vmax:23.8},
    {n:"Mateluna Florencia",min:15,dist:1666,mxm:108.0,hsr:1002,ai18:297,spr:0,acc:27,dsc:8,ns:0,vmax:21.0},
    {n:"Gacitua Emilia",min:15,dist:1693,mxm:109.0,hsr:895,ai18:501,spr:0,acc:16,dsc:9,ns:0,vmax:23.7},
    {n:"Sepulveda Eileen",min:15,dist:1714,mxm:115.0,hsr:947,ai18:564,spr:0,acc:23,dsc:11,ns:0,vmax:23.6}
  ]},
  {id:"e15abr",label:"vs 15-abr",fecha:"15-abr",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:58,dist:1413,mxm:24.0,hsr:39,ai18:0,spr:0,acc:7,dsc:1,ns:0,vmax:17.0},
    {n:"Pollmann Marianne",min:47,dist:3472,mxm:74.0,hsr:441,ai18:52,spr:0,acc:35,dsc:20,ns:0,vmax:19.9},
    {n:"Gomez Camila",min:47,dist:3557,mxm:75.0,hsr:325,ai18:8,spr:0,acc:20,dsc:32,ns:0,vmax:18.9},
    {n:"Pareja Camila",min:47,dist:3807,mxm:80.0,hsr:452,ai18:22,spr:0,acc:44,dsc:32,ns:0,vmax:21.4},
    {n:"Alfaro Javiera",min:47,dist:4,mxm:84.0,hsr:417,ai18:24,spr:0,acc:20,dsc:22,ns:0,vmax:21.0},
    {n:"Retamal Antonia",min:47,dist:4183,mxm:88.0,hsr:622,ai18:43,spr:0,acc:45,dsc:26,ns:0,vmax:20.8},
    {n:"Gacitua Emilia",min:53,dist:4407,mxm:83.0,hsr:904,ai18:112,spr:0,acc:66,dsc:57,ns:0,vmax:22.3},
    {n:"Carrasco Sofia",min:53,dist:4906,mxm:93.0,hsr:1221,ai18:238,spr:0,acc:64,dsc:71,ns:0,vmax:22.7},
    {n:"Sepulveda Eileen",min:53,dist:5087,mxm:96.0,hsr:833,ai18:86,spr:0,acc:47,dsc:46,ns:0,vmax:20.2}
  ]},
  {id:"e17abr",label:"vs 17-abr",fecha:"17-abr",tipo:"entreno",jugadoras:[
    {n:"Sepulveda Eileen",min:6,dist:396,mxm:71.0,hsr:82,ai18:47,spr:5,acc:5,dsc:0,ns:0,vmax:24.5},
    {n:"Alfaro Javiera",min:7,dist:720,mxm:98.0,hsr:366,ai18:244,spr:22,acc:15,dsc:3,ns:0,vmax:25.5},
    {n:"Retamal Antonia",min:12,dist:1288,mxm:111.0,hsr:839,ai18:603,spr:29,acc:29,dsc:28,ns:0,vmax:25.4},
    {n:"Pareja Camila",min:16,dist:1828,mxm:111.0,hsr:915,ai18:348,spr:1,acc:35,dsc:5,ns:0,vmax:24.1},
    {n:"Gutierrez Renata",min:16,dist:1883,mxm:114.0,hsr:1076,ai18:400,spr:38,acc:31,dsc:19,ns:0,vmax:25.4},
    {n:"Carrasco Sofia",min:16,dist:1902,mxm:116.0,hsr:1215,ai18:818,spr:59,acc:44,dsc:15,ns:0,vmax:25.5},
    {n:"Mateluna Florencia",min:16,dist:1956,mxm:119.0,hsr:1160,ai18:638,spr:26,acc:47,dsc:11,ns:4,vmax:25.1},
    {n:"Gacitua Emilia",min:16,dist:1976,mxm:120.0,hsr:1207,ai18:763,spr:138,acc:40,dsc:14,ns:7,vmax:27.1}
  ]},
  {id:"e20abr",label:"vs 20-abr",fecha:"20-abr",tipo:"entreno",jugadoras:[
    {n:"Errazu Sofia",min:16,dist:1558,mxm:95.0,hsr:258,ai18:66,spr:0,acc:9,dsc:7,ns:0,vmax:20.9},
    {n:"Sierra Julieta",min:32,dist:3793,mxm:117.0,hsr:408,ai18:112,spr:0,acc:8,dsc:14,ns:0,vmax:21.9},
    {n:"Gomez Camila",min:41,dist:3979,mxm:97.0,hsr:320,ai18:65,spr:0,acc:14,dsc:16,ns:0,vmax:21.4},
    {n:"Pollmann Marianne",min:55,dist:4954,mxm:102.0,hsr:443,ai18:92,spr:0,acc:5,dsc:14,ns:0,vmax:21.3},
    {n:"Alfaro Javiera",min:59,dist:5627,mxm:95.0,hsr:236,ai18:35,spr:5,acc:10,dsc:16,ns:0,vmax:25.4},
    {n:"Muñoz Constanza",min:65,dist:5780,mxm:88.0,hsr:351,ai18:46,spr:0,acc:13,dsc:9,ns:0,vmax:21.0},
    {n:"Silva Victoria",min:51,dist:6,mxm:114.0,hsr:813,ai18:207,spr:0,acc:25,dsc:30,ns:0,vmax:22.8},
    {n:"Carrasco Sofia",min:55,dist:5897,mxm:108.0,hsr:1019,ai18:382,spr:0,acc:31,dsc:50,ns:0,vmax:23.3},
    {n:"Pareja Camila",min:68,dist:6049,mxm:89.0,hsr:396,ai18:112,spr:0,acc:19,dsc:15,ns:0,vmax:21.1},
    {n:"Gutierrez Renata",min:68,dist:6505,mxm:96.0,hsr:596,ai18:146,spr:0,acc:21,dsc:18,ns:0,vmax:21.9},
    {n:"Gacitua Emilia",min:63,dist:6694,mxm:106.0,hsr:1064,ai18:434,spr:13,acc:36,dsc:33,ns:0,vmax:26.0}
  ]},
  {id:"e22abr",label:"vs 22-abr",fecha:"22-abr",tipo:"entreno",jugadoras:[
    {n:"Muñoz Constanza",min:34,dist:2667,mxm:82.0,hsr:1772,ai18:913,spr:0,acc:8,dsc:1,ns:0,vmax:20.9}
  ]},
  {id:"e29abr",label:"vs 29-abr",fecha:"29-abr",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:68,dist:1710,mxm:25.0,hsr:23,ai18:4,spr:0,acc:9,dsc:0,ns:0,vmax:18.6},
    {n:"Gomez Camila",min:72,dist:3574,mxm:50.0,hsr:290,ai18:10,spr:0,acc:3,dsc:17,ns:0,vmax:18.5},
    {n:"Gacitua Emilia",min:72,dist:5052,mxm:70.0,hsr:1374,ai18:725,spr:124,acc:45,dsc:27,ns:7,vmax:27.7},
    {n:"Pareja Camila",min:72,dist:5118,mxm:71.0,hsr:954,ai18:265,spr:15,acc:29,dsc:16,ns:2,vmax:24.6},
    {n:"Alfaro Javiera",min:72,dist:5318,mxm:74.0,hsr:1168,ai18:506,spr:42,acc:29,dsc:28,ns:0,vmax:25.3},
    {n:"Retamal Antonia",min:72,dist:5507,mxm:76.0,hsr:1364,ai18:474,spr:82,acc:42,dsc:35,ns:7,vmax:25.4},
    {n:"Gutierrez Renata",min:72,dist:5525,mxm:77.0,hsr:998,ai18:331,spr:9,acc:27,dsc:23,ns:0,vmax:24.5},
    {n:"Carrasco Sofia",min:72,dist:5552,mxm:77.0,hsr:1502,ai18:841,spr:119,acc:51,dsc:58,ns:2,vmax:26.4},
    {n:"Mateluna Florencia",min:72,dist:5944,mxm:82.0,hsr:1196,ai18:434,spr:71,acc:48,dsc:37,ns:6,vmax:25.9},
    {n:"Sepulveda Eileen",min:72,dist:6197,mxm:86.0,hsr:1409,ai18:768,spr:35,acc:47,dsc:44,ns:4,vmax:25.1}
  ]},
  {id:"e4may",label:"vs 4-may",fecha:"4-may",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:9,dist:384,mxm:42.0,hsr:3,ai18:0,spr:0,acc:7,dsc:2,ns:0,vmax:15.6},
    {n:"Gomez Camila",min:25,dist:987,mxm:39.0,hsr:113,ai18:14,spr:0,acc:27,dsc:8,ns:0,vmax:18.5},
    {n:"Alfaro Javiera",min:25,dist:993,mxm:39.0,hsr:145,ai18:68,spr:0,acc:28,dsc:10,ns:0,vmax:21.1},
    {n:"Gutierrez Renata",min:25,dist:994,mxm:40.0,hsr:139,ai18:59,spr:0,acc:30,dsc:9,ns:0,vmax:20.4},
    {n:"Pareja Camila",min:25,dist:1028,mxm:41.0,hsr:116,ai18:40,spr:0,acc:26,dsc:7,ns:0,vmax:19.4},
    {n:"Carrasco Sofia",min:25,dist:1035,mxm:41.0,hsr:189,ai18:98,spr:0,acc:33,dsc:13,ns:0,vmax:21.0},
    {n:"Gacitua Emilia",min:25,dist:1095,mxm:44.0,hsr:201,ai18:120,spr:0,acc:29,dsc:8,ns:0,vmax:22.0},
    {n:"Errazu Sofia",min:25,dist:1133,mxm:45.0,hsr:188,ai18:105,spr:0,acc:30,dsc:10,ns:0,vmax:20.7},
    {n:"Mateluna Florencia",min:25,dist:1146,mxm:46.0,hsr:185,ai18:89,spr:0,acc:37,dsc:6,ns:0,vmax:20.8}
  ]},
  {id:"e11may",label:"vs 11-may",fecha:"11-may",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:65,dist:1935,mxm:30.0,hsr:32,ai18:0,spr:0,acc:8,dsc:6,ns:0,vmax:17.4},
    {n:"Gomez Camila",min:65,dist:3262,mxm:50.0,hsr:139,ai18:17,spr:0,acc:16,dsc:22,ns:0,vmax:19.3},
    {n:"Gutierrez Renata",min:65,dist:3604,mxm:55.0,hsr:231,ai18:51,spr:0,acc:33,dsc:24,ns:0,vmax:21.1},
    {n:"Carrasco Sofia",min:65,dist:3628,mxm:56.0,hsr:411,ai18:84,spr:0,acc:46,dsc:66,ns:0,vmax:20.4},
    {n:"Mateluna Florencia",min:65,dist:3660,mxm:56.0,hsr:209,ai18:34,spr:0,acc:39,dsc:31,ns:0,vmax:21.0},
    {n:"Pareja Camila",min:65,dist:3773,mxm:58.0,hsr:286,ai18:26,spr:0,acc:29,dsc:22,ns:0,vmax:21.8},
    {n:"Alfaro Javiera",min:65,dist:3820,mxm:59.0,hsr:207,ai18:46,spr:0,acc:26,dsc:33,ns:0,vmax:20.6},
    {n:"Hevia Valentina",min:65,dist:3892,mxm:60.0,hsr:216,ai18:26,spr:0,acc:30,dsc:28,ns:0,vmax:19.4},
    {n:"Gacitua Emilia",min:65,dist:4008,mxm:62.0,hsr:390,ai18:184,spr:0,acc:41,dsc:45,ns:0,vmax:23.3},
    {n:"Errazu Sofia",min:65,dist:4020,mxm:62.0,hsr:352,ai18:68,spr:0,acc:39,dsc:38,ns:0,vmax:21.7},
    {n:"Retamal Antonia",min:65,dist:4083,mxm:63.0,hsr:305,ai18:62,spr:0,acc:36,dsc:50,ns:0,vmax:20.7}
  ]},
  {id:"e13may",label:"vs 13-may",fecha:"13-may",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:54,dist:1514,mxm:28.0,hsr:26,ai18:0,spr:0,acc:16,dsc:2,ns:0,vmax:17.0},
    {n:"Pollmann Marianne",min:52,dist:3107,mxm:60.0,hsr:506,ai18:210,spr:8,acc:15,dsc:8,ns:1,vmax:24.9},
    {n:"Pareja Camila",min:50,dist:3666,mxm:73.0,hsr:695,ai18:411,spr:4,acc:35,dsc:16,ns:0,vmax:24.5},
    {n:"Gutierrez Renata",min:51,dist:3736,mxm:74.0,hsr:841,ai18:530,spr:14,acc:27,dsc:21,ns:1,vmax:25.8},
    {n:"Gacitua Emilia",min:52,dist:4106,mxm:79.0,hsr:1058,ai18:632,spr:125,acc:48,dsc:33,ns:9,vmax:28.0},
    {n:"Retamal Antonia",min:51,dist:4194,mxm:83.0,hsr:901,ai18:416,spr:86,acc:28,dsc:23,ns:7,vmax:25.4},
    {n:"Mateluna Florencia",min:51,dist:4293,mxm:85.0,hsr:980,ai18:508,spr:120,acc:51,dsc:37,ns:9,vmax:25.9},
    {n:"Silva Victoria",min:52,dist:4311,mxm:83.0,hsr:1084,ai18:585,spr:117,acc:49,dsc:46,ns:10,vmax:26.4},
    {n:"Carrasco Sofia",min:52,dist:4341,mxm:84.0,hsr:1092,ai18:689,spr:13,acc:45,dsc:53,ns:1,vmax:26.1},
    {n:"Sierra Julieta",min:51,dist:4359,mxm:86.0,hsr:993,ai18:538,spr:168,acc:47,dsc:49,ns:10,vmax:26.7}
  ]},
  {id:"e18may",label:"vs 18-may",fecha:"18-may",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:75,dist:1521,mxm:20.0,hsr:0,ai18:0,spr:0,acc:4,dsc:0,ns:0,vmax:14.4},
    {n:"Gutierrez Renata",min:75,dist:3281,mxm:44.0,hsr:134,ai18:22,spr:0,acc:23,dsc:24,ns:0,vmax:20.1},
    {n:"Alfaro Javiera",min:75,dist:3314,mxm:44.0,hsr:118,ai18:19,spr:0,acc:31,dsc:22,ns:0,vmax:20.6},
    {n:"Mateluna Florencia",min:75,dist:3356,mxm:45.0,hsr:298,ai18:77,spr:4,acc:43,dsc:34,ns:0,vmax:21.4},
    {n:"Gacitua Emilia",min:75,dist:3367,mxm:45.0,hsr:414,ai18:150,spr:46,acc:56,dsc:40,ns:5,vmax:23.1},
    {n:"Carrasco Sofia",min:75,dist:3425,mxm:46.0,hsr:304,ai18:67,spr:4,acc:42,dsc:47,ns:0,vmax:21.6},
    {n:"Gomez Camila",min:75,dist:3614,mxm:48.0,hsr:115,ai18:13,spr:0,acc:24,dsc:22,ns:0,vmax:18.9},
    {n:"Pollmann Marianne",min:75,dist:3707,mxm:50.0,hsr:195,ai18:30,spr:2,acc:39,dsc:39,ns:0,vmax:21.3},
    {n:"Hevia Valentina",min:75,dist:3726,mxm:50.0,hsr:217,ai18:42,spr:0,acc:31,dsc:25,ns:0,vmax:20.0},
    {n:"Pareja Camila",min:75,dist:3951,mxm:53.0,hsr:178,ai18:25,spr:9,acc:33,dsc:30,ns:1,vmax:21.7},
    {n:"Retamal Antonia",min:75,dist:4082,mxm:55.0,hsr:281,ai18:90,spr:7,acc:52,dsc:54,ns:0,vmax:21.4}
  ]},
  {id:"e20may",label:"vs 20-may",fecha:"20-may",tipo:"entreno",jugadoras:[
    {n:"Arau Maria",min:67,dist:1919,mxm:29.0,hsr:39,ai18:7,spr:0,acc:13,dsc:5,ns:0,vmax:19.2},
    {n:"Pollmann Marianne",min:34,dist:1958,mxm:58.0,hsr:213,ai18:32,spr:40,acc:4,dsc:3,ns:3,vmax:23.4},
    {n:"Gacitua Emilia",min:30,dist:2548,mxm:84.0,hsr:718,ai18:152,spr:413,acc:31,dsc:23,ns:17,vmax:28.0},
    {n:"Silva Victoria",min:42,dist:3787,mxm:91.0,hsr:507,ai18:188,spr:21,acc:23,dsc:51,ns:2,vmax:22.3},
    {n:"Gomez Camila",min:55,dist:4291,mxm:78.0,hsr:972,ai18:324,spr:171,acc:26,dsc:19,ns:12,vmax:23.2},
    {n:"Gutierrez Renata",min:52,dist:4475,mxm:86.0,hsr:930,ai18:254,spr:275,acc:31,dsc:33,ns:15,vmax:24.7},
    {n:"Alfaro Javiera",min:58,dist:4647,mxm:81.0,hsr:1142,ai18:312,spr:262,acc:31,dsc:34,ns:12,vmax:26.0},
    {n:"Pareja Camila",min:55,dist:4893,mxm:89.0,hsr:1000,ai18:282,spr:249,acc:45,dsc:23,ns:12,vmax:25.0},
    {n:"Sierra Julieta",min:54,dist:5040,mxm:94.0,hsr:1168,ai18:574,spr:151,acc:67,dsc:77,ns:9,vmax:23.4},
    {n:"Carrasco Sofia",min:60,dist:5114,mxm:85.0,hsr:1353,ai18:491,spr:439,acc:49,dsc:62,ns:20,vmax:25.6},
    {n:"Mateluna Florencia",min:56,dist:5308,mxm:94.0,hsr:1285,ai18:427,spr:443,acc:55,dsc:53,ns:19,vmax:26.6}
  ]},
  {id:"e27may",label:"vs 27-may",fecha:"27-may",tipo:"entreno",jugadoras:[
    {n:"Gutierrez Renata",min:50,dist:3448,mxm:69.0,hsr:517,ai18:238,spr:0,acc:21,dsc:20,ns:0,vmax:23.9},
    {n:"Gomez Camila",min:50,dist:3791,mxm:76.0,hsr:446,ai18:282,spr:0,acc:15,dsc:25,ns:0,vmax:23.4},
    {n:"Silva Victoria",min:46,dist:3805,mxm:83.0,hsr:523,ai18:175,spr:0,acc:26,dsc:45,ns:0,vmax:23.7},
    {n:"SIerra Julieta",min:52,dist:3994,mxm:77.0,hsr:606,ai18:199,spr:139,acc:28,dsc:37,ns:7,vmax:26.5},
    {n:"Alfaro Javiera",min:52,dist:4134,mxm:80.0,hsr:565,ai18:305,spr:7,acc:23,dsc:24,ns:1,vmax:25.3},
    {n:"Pollmann Marianne",min:52,dist:4141,mxm:80.0,hsr:554,ai18:293,spr:10,acc:25,dsc:23,ns:1,vmax:24.4},
    {n:"Gacitua Emilia",min:52,dist:4362,mxm:84.0,hsr:940,ai18:436,spr:186,acc:42,dsc:38,ns:9,vmax:28.3},
    {n:"Errazu Sofia",min:50,dist:4384,mxm:87.0,hsr:623,ai18:304,spr:8,acc:30,dsc:24,ns:0,vmax:24.5},
    {n:"Retamal Antonia",min:50,dist:4444,mxm:89.0,hsr:772,ai18:340,spr:113,acc:26,dsc:34,ns:8,vmax:25.1},
    {n:"Mateluna Florencia",min:50,dist:4634,mxm:92.0,hsr:766,ai18:396,spr:37,acc:30,dsc:36,ns:2,vmax:25.9},
    {n:"Carrasco Sofia",min:52,dist:4696,mxm:91.0,hsr:858,ai18:388,spr:85,acc:45,dsc:59,ns:5,vmax:26.1}
  ]},
  {id:"e3jun",label:"vs 3-jun",fecha:"3-jun",tipo:"entreno",jugadoras:[
    {n:"Pareja Camila",min:1,dist:77,mxm:61.0,hsr:19,ai18:10,spr:0,acc:0,dsc:0,ns:0,vmax:19.5},
    {n:"Hevia Valentina",min:7,dist:536,mxm:81.0,hsr:255,ai18:210,spr:0,acc:6,dsc:0,ns:0,vmax:23.8},
    {n:"Arau Maria",min:11,dist:546,mxm:50.0,hsr:20,ai18:0,spr:0,acc:14,dsc:0,ns:0,vmax:17.4},
    {n:"Gomez Camila",min:7,dist:680,mxm:92.0,hsr:410,ai18:330,spr:0,acc:11,dsc:1,ns:0,vmax:22.6},
    {n:"Alfaro Javiera",min:7,dist:715,mxm:96.0,hsr:442,ai18:317,spr:66,acc:12,dsc:1,ns:6,vmax:25.6},
    {n:"Gutierrez Renata",min:7,dist:738,mxm:100.0,hsr:465,ai18:377,spr:31,acc:10,dsc:4,ns:2,vmax:25.0},
    {n:"Mateluna Florencia",min:7,dist:758,mxm:102.0,hsr:472,ai18:284,spr:136,acc:11,dsc:3,ns:10,vmax:25.6}
  ]},
  {id:"e10jun",label:"vs 10-jun",fecha:"10-jun",tipo:"entreno",jugadoras:[
    {n:"Silva Victoria",min:45,dist:4434,mxm:99.0,hsr:1100,ai18:593,spr:34,acc:35,dsc:49,ns:2,vmax:25.3},
    {n:"Sierra Julieta",min:50,dist:4639,mxm:93.0,hsr:984,ai18:440,spr:42,acc:65,dsc:64,ns:3,vmax:25.3},
    {n:"Carrasco Sofia",min:75,dist:4727,mxm:66.0,hsr:1120,ai18:646,spr:14,acc:46,dsc:46,ns:1,vmax:25.1},
    {n:"Retamal Antonia",min:45,dist:4227,mxm:95.0,hsr:1006,ai18:476,spr:0,acc:34,dsc:37,ns:0,vmax:23.8},
    {n:"Pollmann Marianne",min:80,dist:4933,mxm:71.0,hsr:743,ai18:298,spr:0,acc:32,dsc:19,ns:0,vmax:23.1},
    {n:"Mateluna Florencia",min:80,dist:6007,mxm:78.0,hsr:1280,ai18:624,spr:0,acc:55,dsc:62,ns:0,vmax:22.4},
    {n:"Errazu Sofia",min:48,dist:3939,mxm:85.0,hsr:801,ai18:328,spr:0,acc:39,dsc:29,ns:0,vmax:22.3},
    {n:"Pareja Camila",min:75,dist:4601,mxm:63.0,hsr:685,ai18:246,spr:0,acc:28,dsc:17,ns:0,vmax:21.5},
    {n:"Gomez Camila",min:80,dist:4576,mxm:59.0,hsr:653,ai18:196,spr:0,acc:26,dsc:36,ns:0,vmax:21.0},
    {n:"Arau Maria",min:73,dist:1715,mxm:24.0,hsr:11,ai18:0,spr:0,acc:13,dsc:7,ns:0,vmax:17.0}
  ]},
  {id:"e15jun",label:"vs 15-jun",fecha:"15-jun",tipo:"entreno",jugadoras:[
    {n:"Gacitua Emilia",min:63,dist:4268,mxm:68.0,hsr:851,ai18:533,spr:74,acc:42,dsc:21,ns:4,vmax:26.8},
    {n:"Sierra Julieta",min:32,dist:2883,mxm:91.0,hsr:489,ai18:317,spr:35,acc:22,dsc:28,ns:1,vmax:25.9},
    {n:"Carrasco Sofia",min:62,dist:4818,mxm:78.0,hsr:639,ai18:356,spr:3,acc:31,dsc:45,ns:0,vmax:24.4},
    {n:"Errazu Sofia",min:63,dist:5027,mxm:80.0,hsr:806,ai18:519,spr:0,acc:40,dsc:22,ns:0,vmax:23.3},
    {n:"Retamal Antonia",min:61,dist:4904,mxm:81.0,hsr:787,ai18:548,spr:0,acc:31,dsc:40,ns:0,vmax:23.0},
    {n:"Silva Victoria",min:62,dist:4740,mxm:78.0,hsr:958,ai18:607,spr:0,acc:47,dsc:54,ns:0,vmax:23.0},
    {n:"Mateluna Florencia",min:63,dist:5489,mxm:88.0,hsr:1000,ai18:577,spr:0,acc:40,dsc:33,ns:0,vmax:22.4},
    {n:"Alfaro Javiera",min:62,dist:4594,mxm:74.0,hsr:640,ai18:389,spr:0,acc:24,dsc:27,ns:0,vmax:21.8},
    {n:"Pareja Camila",min:62,dist:4638,mxm:75.0,hsr:752,ai18:371,spr:0,acc:29,dsc:20,ns:0,vmax:21.0},
    {n:"Gutierrez Renata",min:62,dist:4176,mxm:68.0,hsr:481,ai18:100,spr:0,acc:14,dsc:21,ns:0,vmax:21.0}
  ]},
];


// ─── MINUTOS DE JUEGO — hoja Minutos Juego del Drive ───────────────────────
const MINUTOS=[
  {n:"Alfaro Javiera",cogs:null,pwcc:null,manq:22,catb:23,reds:16,tot:61,prom:20.3},
  {n:"Arau María Paz",cogs:60,pwcc:60,manq:60,catb:60,reds:60,tot:300,prom:60.0},
  {n:"Carrasco Sofia",cogs:null,pwcc:null,manq:35,catb:21,reds:52,tot:108,prom:36.0},
  {n:"Errazu Sofia",cogs:null,pwcc:null,manq:35,catb:38,reds:null,tot:73,prom:36.5},
  {n:"Gacitua Emilia",cogs:null,pwcc:null,manq:60,catb:60,reds:57,tot:177,prom:59.0},
  {n:"Gomez Camila",cogs:null,pwcc:null,manq:40,catb:41,reds:29,tot:110,prom:36.7},
  {n:"Gutierrez Renata",cogs:60,pwcc:60,manq:60,catb:60,reds:60,tot:300,prom:60.0},
  {n:"Hevia Valentina",cogs:null,pwcc:null,manq:null,catb:null,reds:null,tot:0,prom:0},
  {n:"Liu Macarena",cogs:null,pwcc:null,manq:43,catb:34,reds:53,tot:130,prom:43.3},
  {n:"Manriquez Fernanda",cogs:null,pwcc:null,manq:null,catb:null,reds:null,tot:0,prom:0},
  {n:"Martinez Amanda",cogs:null,pwcc:null,manq:null,catb:null,reds:null,tot:0,prom:0},
  {n:"Mateluna Florencia",cogs:null,pwcc:null,manq:21,catb:18,reds:29,tot:68,prom:22.7},
  {n:"Muñoz Constanza",cogs:60,pwcc:60,manq:53,catb:60,reds:60,tot:293,prom:58.6},
  {n:"Pareja Camila",cogs:60,pwcc:60,manq:60,catb:60,reds:60,tot:300,prom:60.0},
  {n:"Pollmann Marianne",cogs:null,pwcc:null,manq:60,catb:58,reds:55,tot:173,prom:57.7},
  {n:"Retamal Antonia",cogs:null,pwcc:null,manq:null,catb:null,reds:null,tot:0,prom:0},
  {n:"Sepulveda Eileen",cogs:null,pwcc:null,manq:null,catb:null,reds:null,tot:0,prom:0},
  {n:"Sierra Julieta",cogs:null,pwcc:null,manq:60,catb:60,reds:60,tot:180,prom:60.0},
  {n:"Silva Victoria",cogs:null,pwcc:null,manq:60,catb:60,reds:60,tot:180,prom:60.0},
];

// ─── YO-YO — hoja YOYO RIN1 del Drive "Old Gabs 1era" ────────────────────────
// Bloque 1era: 5 jugadoras registradas
// Clasificación: >16.5 verde | 14.6-16.4 amarillo | <14.6 rojo
// Podio por NIVEL ALCANZADO
const YOYO=[
  {n:"Alfaro Javiera",   puesto:"WG", nivel:15.1,dist:800, vel:15.0,vo2:43.1,vam:3.4},
  {n:"Carrasco Sofia",   puesto:"VL", nivel:17.1,dist:1440,vel:16.0,vo2:48.5,vam:3.8},
  {n:"Errazu Sofia",     puesto:"WG", nivel:null,dist:null,vel:null, vo2:null, vam:null},
  {n:"Gacitua Emilia",   puesto:"VL", nivel:16.7,dist:1360,vel:15.5,vo2:47.8,vam:3.8},
  {n:"Gomez Camila",     puesto:"LT", nivel:15.2,dist:840, vel:15.0,vo2:43.5,vam:3.4},
  {n:"Gutierrez Renata", puesto:"LT", nivel:null,dist:null,vel:null, vo2:null, vam:null},
  {n:"Hevia Valentina",  puesto:"LT", nivel:null,dist:null,vel:null, vo2:null, vam:null},
  {n:"Liu Macarena",     puesto:"WG", nivel:15.7,dist:1040,vel:15.0,vo2:45.1,vam:3.6},
  {n:"Mateluna Florencia",puesto:"LT",nivel:null,dist:null,vel:null, vo2:null, vam:null},
  {n:"Muñoz Constanza",  puesto:"DC", nivel:null,dist:null,vel:null, vo2:null, vam:null},
  {n:"Pareja Camila",    puesto:"DC", nivel:15.1,dist:800, vel:15.0,vo2:43.1,vam:3.4},
  {n:"Pollmann Marianne",puesto:"DL", nivel:15.1,dist:800, vel:15.0,vo2:43.1,vam:3.4},
  {n:"Retamal Antonia",  puesto:"LT", nivel:15.1,dist:800, vel:15.0,vo2:43.1,vam:3.4},
  {n:"Sepulveda Eileen", puesto:"DL", nivel:16.7,dist:1360,vel:15.5,vo2:47.8,vam:3.8},
  {n:"Sierra Julieta",   puesto:"MC", nivel:null,dist:null,vel:null, vo2:null, vam:null},
  {n:"Silva Victoria",   puesto:"VL", nivel:null,dist:null,vel:null, vo2:null, vam:null},
];

// ─── PUESTOS — promedio partidos oficiales, jugadoras ≥48 min ────────────────
// Actualizado: VS COGS, VS PWCC, VS MANQUEHUE, VS CATÓLICA B, VS OLD REDS, VS OLD GIRLS
const PUESTOS=[
  {p:"DC",n:"Def. Central", jugadoras:["Muñoz Constanza","Pareja Camila"],
   dist:5796,mxm:88.1,hsr:374,ai18:104,spr:4,ns:0,acc:10,dsc:16,vmax:22.4},
  {p:"LT",n:"Lateral",      jugadoras:["Gomez Camila","Gutierrez Renata","Hevia Valentina","Mateluna Florencia","Retamal Antonia"],
   dist:6430,mxm:102.1,hsr:626,ai18:167,spr:7,ns:0,acc:13,dsc:22,vmax:21.9},
  {p:"MC",n:"Med. Central", jugadoras:["Sierra Julieta","Manriquez Fernanda"],
   dist:7045,mxm:111.0,hsr:974,ai18:291,spr:8,ns:1,acc:27,dsc:47,vmax:23.3},
  {p:"VL",n:"Volante",      jugadoras:["Carrasco Sofia","Gacitua Emilia","Silva Victoria"],
   dist:7003,mxm:111.1,hsr:1170,ai18:409,spr:77,ns:5,acc:32,dsc:45,vmax:24.3},
  {p:"WG",n:"Wing",         jugadoras:["Alfaro Javiera","Errazu Sofia","Liu Macarena","Arau María Paz"],
   dist:6033,mxm:112.2,hsr:890,ai18:240,spr:18,ns:1,acc:26,dsc:22,vmax:22.4},
  {p:"DL",n:"Del. Central", jugadoras:["Pollmann Marianne","Sepulveda Eileen"],
   dist:6206,mxm:100.0,hsr:581,ai18:135,spr:3,ns:0,acc:17,dsc:16,vmax:22.4},
  {p:"PROM",n:"Promedio",   jugadoras:[],
   dist:6449,mxm:103.0,hsr:769,ai18:233,spr:25,ns:2,acc:21,dsc:29,vmax:22.9},
];

// ─── ASISTENCIA — hoja PF Old Gabs (datos previos del Drive) ─────────────────
const ATT_FECHAS=["4/3", "6/3", "9/3", "11/3", "13/3", "16/3", "18/3", "20/3", "23/3", "25/3", "27/3", "30/3", "8/4", "10/4", "13/4", "15/4", "17/4", "20/4", "22/4", "24/4", "27/4", "29/4", "6/5", "8/5", "11/5", "13/5", "15/5", "18/5", "20/5", "22/5", "25/5", "27/5", "29/5"];
const ASISTENCIA={
  "Alfaro Javiera":{
    mar:"100%",abr:"88%",may:"75%",tot:"88%",
    dias:[0,null,1,1,1,1,1,1,null,null,null,null,1,1,0,null,null,1,0,1,1,null,0,1,1,0,0,1,1,1,0,null,null]},
  "Arau María Paz":{
    mar:"83%",abr:"88%",may:"88%",tot:"86%",
    dias:[1,null,1,1,1,0,1,1,null,null,null,null,1,0,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1,1,1,null,null]},
  "Carrasco Sofia":{
    mar:"67%",abr:"100%",may:"100%",tot:"89%",
    dias:[1,null,1,1,1,1,1,1,null,null,null,null,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1,0,1,null,null]},
  "Errazu Sofia":{
    mar:"83%",abr:"50%",may:"50%",tot:"61%",
    dias:[0,null,1,0,0,0,1,1,null,null,null,null,0,0,1,null,null,1,0,0,1,null,1,0,1,1,0,0,0,0,1,null,null]},
  "Gacitua Emilia":{
    mar:"33%",abr:"63%",may:"100%",tot:"65%",
    dias:[1,null,0,1,0,0,1,1,null,null,null,null,1,1,1,null,null,1,1,1,1,null,1,1,1,1,0,1,1,1,1,null,null]},
  "Gomez Camila":{
    mar:"100%",abr:"100%",may:"100%",tot:"100%",
    dias:[1,null,1,1,1,1,1,1,null,null,null,null,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1,1,1,null,null]},
  "Gutierrez Renata":{
    mar:"100%",abr:"75%",may:"100%",tot:"92%",
    dias:[0,null,1,1,0,1,1,1,null,null,null,null,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1,1,1,null,null]},
  "Hevia Valentina":{
    mar:"50%",abr:"88%",may:"38%",tot:"59%",
    dias:[1,null,1,1,1,0,1,1,null,null,null,null,1,1,0,null,null,0,1,0,0,null,1,1,1,1,1,1,0,1,0,null,null]},
  "Liu Macarena":{
    mar:"0%",abr:"13%",may:"0%",tot:"13%",
    dias:[0,null,0,0,1,0,0,0,null,null,null,null,0,0,0,null,null,0,0,0,0,null,0,0,0,1,0,0,0,0,0,null,null]},
  "Manriquez Fernanda":{
    mar:"83%",abr:"100%",may:"38%",tot:"74%",
    dias:[1,null,1,1,1,1,1,1,null,null,null,null,1,0,0,null,null,0,0,1,0,null,0,1,0,0,1,0,0,0,0,null,null]},
  "Martinez Amanda":{
    mar:"0%",abr:"0%",may:"13%",tot:"13%",
    dias:[0,null,0,0,0,0,0,0,null,null,null,null,0,0,0,null,null,0,0,0,0,null,0,0,0,0,0,0,0,0,0,null,null]},
  "Mateluna Florencia":{
    mar:"0%",abr:"0%",may:"100%",tot:"100%",
    dias:[null,null,null,null,null,null,null,null,null,null,null,null,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1,1,1,null,null]},
  "Muñoz Constanza":{
    mar:"0%",abr:"50%",may:"38%",tot:"44%",
    dias:[0,null,0,1,0,1,1,1,null,null,null,null,0,0,0,null,null,1,1,1,0,null,1,1,0,0,1,0,0,0,0,null,null]},
  "Pareja Camila":{
    mar:"83%",abr:"75%",may:"88%",tot:"82%",
    dias:[1,null,1,1,0,0,1,1,null,null,null,null,1,0,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1,1,1,null,null]},
  "Pollmann Marianne":{
    mar:"100%",abr:"63%",may:"88%",tot:"84%",
    dias:[1,null,0,0,0,1,1,1,null,null,null,null,1,1,1,null,null,1,0,1,1,null,1,0,0,1,0,1,1,0,1,null,null]},
  "Retamal Antonia":{
    mar:"50%",abr:"75%",may:"50%",tot:"58%",
    dias:[1,null,1,1,1,1,0,0,null,null,null,null,1,0,0,null,null,0,1,1,1,null,0,1,1,1,1,1,1,0,1,null,null]},
  "Sepulveda Eileen":{
    mar:"83%",abr:"88%",may:"63%",tot:"78%",
    dias:[1,null,1,1,1,1,0,1,null,null,null,null,1,1,1,null,null,0,1,0,1,null,0,0,0,0,0,0,0,0,0,null,null]},
  "Sierra Julieta":{
    mar:"0%",abr:"38%",may:"0%",tot:"38%",
    dias:[1,null,0,1,1,0,0,0,null,null,null,null,0,0,0,null,null,0,0,0,0,null,1,0,0,1,0,0,0,0,0,null,null]},
  "Silva Victoria":{
    mar:"50%",abr:"0%",may:"0%",tot:"50%",
    dias:[0,null,0,0,0,0,0,0,null,null,null,null,0,0,0,null,null,0,0,0,0,null,1,0,0,1,0,0,0,0,0,null,null]},
};// ─── WELLNESS & RPE (formulario — mantener de versión anterior) ───────────────
const WELLNESS={
  "Alfaro Javiera":    {horas:"6hs",calidad:4,fatiga:3,dolor:4,estres:2,animo:3,nota:"Periostitis"},
  "Gomez Camila":      {horas:"7hs",calidad:5,fatiga:4,dolor:4,estres:2,animo:4,nota:"Lumbar"},
  "Pollmann Marianne": {horas:"8hs",calidad:4,fatiga:3,dolor:4,estres:2,animo:4,nota:"Gemelo/Sóleo"},
  "Errazu Sofia":      {horas:"6hs",calidad:4,fatiga:5,dolor:5,estres:3,animo:4,nota:"Sin dolor"},
  "Gutierrez Renata":  {horas:"7hs",calidad:4,fatiga:3,dolor:4,estres:3,animo:4,nota:"Lumbar"},
  "Silva Victoria":    {horas:"6hs",calidad:4,fatiga:3,dolor:5,estres:3,animo:5,nota:"Sin dolor"},
  "Mateluna Florencia":{horas:"6hs",calidad:4,fatiga:3,dolor:4,estres:2,animo:4,nota:"Gemelo/Sóleo"},
  "Sierra Julieta":    {horas:"5hs",calidad:5,fatiga:5,dolor:5,estres:4,animo:5,nota:"Sin dolor"},
  "Gacitua Emilia":    {horas:"8hs",calidad:4,fatiga:4,dolor:4,estres:4,animo:3,nota:"Gemelo/Sóleo"},
  "Carrasco Sofia":    {horas:"7hs",calidad:3,fatiga:4,dolor:4,estres:1,animo:4,nota:"Resfrío"},
  "Pareja Camila":     {horas:"6hs",calidad:4,fatiga:3,dolor:4,estres:2,animo:3,nota:"Rodilla/Lumbar"},
  "Muñoz Constanza":   {horas:"4hs",calidad:2,fatiga:2,dolor:4,estres:4,animo:2,nota:"Cuello/Rodilla"},
};
const RPE_DATA={
  "Alfaro Javiera":6,"Gomez Camila":9,"Pollmann Marianne":6,
  "Errazu Sofia":9,"Gutierrez Renata":6,"Silva Victoria":7,
  "Mateluna Florencia":7,"Sierra Julieta":7,"Gacitua Emilia":8,
  "Carrasco Sofia":9,"Pareja Camila":8,"Muñoz Constanza":6,
};
const WELLNESS_DATA={};  // se llena con los formularios de cada jugadora

const ZONAS_DOLOR=["Gemelo/Sóleo","Cuádriceps","Isquiotibial","Rodilla","Aductor","Flexor cadera","Glúteo","Lumbar","Cuello"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const avg=arr=>{const v=arr.filter(x=>x!=null&&x>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0;};
const allSess=(partidos=[],amistosos=[],entrenos=[])=>[...partidos,...amistosos,...entrenos];
const allNames=(pool)=>{const s=new Set();(pool||[]).forEach(ss=>ss.jugadoras.forEach(j=>s.add(j.n)));return Array.from(s).sort();};
const mySess=(n,pool)=>pool.map(s=>({...s,data:s.jugadoras.find(j=>j.n===n)})).filter(s=>s.data);
const wColor=n=>["","#e05555","#e07020","#f5c518","#5cb85c","#1a7a2a"][n]||"#4a5470";
const wBg=n=>["","#2d0a0a","#2d1a0a","#2d2500","#0a2d0a","#051a05"][n]||"#1e2535";
const sIcon=t=>t==="partido"?"🏑":t==="amistoso"?"⚡":"🏃";

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
const Chip=({text,color=T.blue})=><span style={{background:color+"22",color,padding:"1px 7px",borderRadius:3,fontSize:10,fontWeight:500}}>{text}</span>;
const MR=({children})=><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8,marginBottom:14}}>{children}</div>;
const MetCard=({label,value,sub,sc=T.green})=>(
  <div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:8,padding:"10px 12px",minWidth:0}}>
    <div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".5px",marginBottom:4}}>{label}</div>
    <div style={{fontSize:19,fontWeight:500,color:T.text,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:10,marginTop:3,color:sc}}>{sub}</div>}
  </div>
);
const Card=({children,style={}})=><div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:8,padding:12,...style}}>{children}</div>;
const CT=({text})=><div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".5px",marginBottom:10}}>{text}</div>;
const TH=({cols})=><thead><tr>{cols.map((c,i)=><th key={i} style={{textAlign:"left",fontWeight:500,fontSize:10,color:T.muted,padding:"5px 6px",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:".4px",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>;
const fbtn=(val,set,opts)=>(
  <div style={{display:"flex",gap:2,background:T.surf2,borderRadius:6,padding:2,width:"fit-content",marginBottom:12,flexWrap:"wrap"}}>
    {opts.map(([v,l])=><button key={v} onClick={()=>set(v)} style={{padding:"4px 10px",borderRadius:5,border:"none",fontSize:10,fontWeight:500,cursor:"pointer",background:val===v?T.blue+"33":"transparent",color:val===v?T.blue:T.muted,fontFamily:"inherit"}}>{l}</button>)}
  </div>
);
const WCircle=({val,size=32})=>(
  <div style={{width:size,height:size,borderRadius:"50%",background:wBg(val),border:`2px solid ${wColor(val)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.44,fontWeight:700,color:wColor(val),flexShrink:0}}>{val}</div>
);

// HSR bar zonas: verde=15-18, naranja=18-21, rojo=>21
function HsrBar({h15=0,h18=0,spr=0,mx=2000}){
  const p15=Math.max(h15>0?2:0,Math.round(h15/mx*100));
  const p18=Math.max(h18>0?2:0,Math.round(h18/mx*100));
  const ps=Math.max(spr>0?1:0,Math.round(spr/mx*100));
  return(
    <div style={{display:"flex",height:9,borderRadius:3,overflow:"hidden",gap:1,background:"#1e2535"}}>
      <div style={{width:`${p15}%`,background:T.green,minWidth:h15>0?2:0}}/>
      <div style={{width:`${p18}%`,background:T.amber,minWidth:h18>0?2:0}}/>
      <div style={{width:`${ps}%`,background:T.red,minWidth:spr>0?1:0}}/>
    </div>
  );
}
const hsrLegend=(
  <div style={{display:"flex",gap:12,marginBottom:8,fontSize:11,color:T.muted}}>
    <span><span style={{color:T.green}}>■</span> 15-18 km/h</span>
    <span><span style={{color:T.amber}}>■</span> 18-21 km/h</span>
    <span><span style={{color:T.red}}>■</span> {">"}21 km/h</span>
  </div>
);

// ─── GRÁFICO HSR POR ZONAS — PROMEDIO EQUIPO ──────────────────────────────────
function GraficoHSR({sesiones,titulo}){
  if(!sesiones.length)return null;
  const getTot=s=>{
    if(s.zonas&&s.zonas.length){
      const h15=Math.round(s.zonas.reduce((a,z)=>a+(z.h15||0),0)/s.zonas.length);
      const h18=Math.round(s.zonas.reduce((a,z)=>a+(z.h18||0),0)/s.zonas.length);
      const spr=Math.round(s.zonas.reduce((a,z)=>a+(z.spr||0),0)/s.zonas.length);
      return h15+h18+spr;
    }
    if(s.jugadoras&&s.jugadoras.length){
      const tots=s.jugadoras.map(j=>calcZonas(j,s));
      return Math.round(tots.reduce((a,z)=>a+z.h15+z.h18+z.sp,0)/tots.length);
    }
    if(s.prom)return(s.prom.hsr||0);
    return 0;
  };
  const maxVal=Math.max(...sesiones.map(getTot),1);

  return(
    <Card style={{marginBottom:10}}>
      <CT text={titulo}/>
      {hsrLegend}
      {sesiones.map(s=>{
        let h15=0,h18=0,spr=0;
        if(s.zonas&&s.zonas.length){
          h15=Math.round(s.zonas.reduce((a,z)=>a+z.h15,0)/s.zonas.length);
          h18=Math.round(s.zonas.reduce((a,z)=>a+z.h18,0)/s.zonas.length);
          spr=s.prom_spr!==undefined?s.prom_spr:Math.round(s.zonas.reduce((a,z)=>a+z.spr,0)/s.zonas.length);
        } else if(s.jugadoras&&s.jugadoras.length){
          const tots=s.jugadoras.map(j=>calcZonas(j,s));
          h15=Math.round(tots.reduce((a,z)=>a+z.h15,0)/tots.length);
          h18=Math.round(tots.reduce((a,z)=>a+z.h18,0)/tots.length);
          spr=Math.round(tots.reduce((a,z)=>a+z.sp,0)/tots.length);
        } else if(s.prom){
          // Para partidos: h18 viene del prom, spr viene del prom
          h18=s.prom.h18||0;
          spr=s.prom.spr||0;
          h15=(s.prom.hsr||0)-h18-spr;
        }
        const total=h15+h18+spr;
        return(
          <div key={s.id} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:11}}>
              <span style={{color:T.muted2}}>{sIcon(s.tipo)} {s.label}</span>
              <div style={{display:"flex",gap:8}}>
                <span style={{color:T.green,fontSize:10}}>{h15}m</span>
                <span style={{color:T.amber,fontSize:10}}>{h18}m</span>
                <span style={{color:spr>0?T.red:T.muted,fontSize:10,fontWeight:spr>0?700:400}}>{spr}m</span>
                <span style={{color:T.muted,fontSize:10}}>{total}m</span>
              </div>
            </div>
            <HsrBar h15={h15} h18={h18} spr={spr} mx={maxVal}/>
          </div>
        );
      })}
    </Card>
  );
}

// ─── HELPER: calcula zonas HSR para una jugadora en una sesión ────────────────
function calcZonas(j, sess){
  // Prioridad 1: sub-tabla zonas hardcodeada (entrenos principalmente)
  if(sess.zonas){
    const z=sess.zonas.find(z=>z.n===j.n);
    if(z) return {h15:z.h15||0, h18:z.h18||0, sp:z.spr||0};
  }
  const h18=j.ai18||0;
  const sp=j.spr||0;
  // Siempre: h15 = AI>15 - AI18 - Spr
  // partidos/entrenos: AI>15 = hsr
  // amistosos: AI>15 = ai15
  const total=j.hsr||j.ai15||0;
  return {h15:Math.max(0,total-h18-sp), h18, sp};
}

// ─── STAFF GPS ────────────────────────────────────────────────────────────────
function StaffGPS(){
  const {partidos:P=[],amistosos:A=[],entrenos:E=[],loading:gpsLoading}=useGPS();
  const PARTIDOS=P.length?P:PARTIDOS_FB;
  const AMISTOSOS=A;
  const ENTRENOS=E;
  const [tipo,setTipo]=useState("partidos");
  const [sesion,setSesion]=useState(null);
  const [jugSel,setJugSel]=useState(null);
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess(PARTIDOS,AMISTOSOS,ENTRENOS);
  const sess=sesion?pool.find(s=>s.id===sesion)||null:null;

  React.useEffect(()=>{if(sesion&&!pool.find(s=>s.id===sesion)){setSesion(null);setJugSel(null);}},[tipo,pool.length]);

  return(
    <>
      {fbtn(tipo,setTipo,[["partidos","🏑 Partidos"],["amistosos","⚡ Amistosos"],["entrenos","🏃 Entrenos"],["todos","Todo"]])}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
        <button onClick={()=>setSesion(null)} style={{padding:"3px 8px",borderRadius:4,border:!sesion?`1px solid ${T.blue}`:`1px solid ${T.border}`,background:!sesion?T.blue+"22":"transparent",color:!sesion?T.blue:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Resumen</button>
        {pool.map(s=><button key={s.id} onClick={()=>setSesion(s.id)} style={{padding:"3px 8px",borderRadius:4,border:sesion===s.id?`1px solid ${T.blue}`:`1px solid ${T.border}`,background:sesion===s.id?T.blue+"22":"transparent",color:sesion===s.id?T.blue:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{sIcon(s.tipo)} {s.label}{s.fecha&&s.fecha!==s.label&&!s.label.includes(s.fecha)?" "+s.fecha:""}</button>)}
      </div>

      {sess?(
        <>
          <div style={{marginBottom:10,fontSize:12,color:T.muted2}}>
            {sIcon(sess.tipo)} <strong style={{color:T.text}}>{sess.label}</strong> — {sess.fecha} · {sess.jugadoras.length} jugadoras
          </div>
          {/* Promedio HSR por zonas de esta sesión */}
          {(sess.prom||sess.zonas)&&<GraficoHSR sesiones={[sess]} titulo="HSR por zonas — promedio equipo"/>}
          {/* Tabla individual */}
          <Card style={{marginBottom:10}}>
            <CT text="Datos individuales"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead><tr>{["Jugadora","Min","Dist.","m/min","15-18km/h","18-21km/h",">21km/h","ACC","DSC","Nº Spr","V.máx"].map((c,i)=><th key={i} style={{textAlign:i===0?"left":"center",fontWeight:500,fontSize:10,color:T.muted,padding:"5px 6px",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:".4px",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
                <tbody>{[...sess.jugadoras].sort((a,b)=>b.dist-a.dist).map(j=>{
                const {h15,h18,sp}=calcZonas(j,sess);
                  return(
                    <tr key={j.n}>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{j.n}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted,textAlign:"center"}}>{j.min}'</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500,textAlign:"center"}}>{j.dist.toLocaleString()}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2,textAlign:"center"}}>{j.mxm}</td>
                      
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green,textAlign:"center"}}>{h15!=null?`${Math.max(0,h15)}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,textAlign:"center"}}>{h18!=null?`${Math.max(0,h18)}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400,textAlign:"center"}}>{sp!=null?`${sp}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple,textAlign:"center"}}>{j.acc}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan,textAlign:"center"}}>{j.dsc}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:(j.ns||0)>0?T.text:T.muted,fontWeight:(j.ns||0)>0?600:400,textAlign:"center"}}>{j.ns||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500,textAlign:"center"}}>{j.vmax}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </Card>
          {/* Promedio equipo — calculado desde datos individuales */}
          {sess.jugadoras&&sess.jugadoras.length>0&&(()=>{
            const jugs=sess.jugadoras;
            const n=jugs.length;
            const avg=k=>Math.round(jugs.reduce((a,j)=>a+(j[k]||0),0)/n);
            const avgf=k=>Math.round(jugs.reduce((a,j)=>a+(j[k]||0),0)/n*10)/10;
            const dist=avg("dist");
            const mxm=dist&&avgf("min")>0?Math.round(dist/avgf("min")*10)/10:avgf("mxm");
            const isEntreno=sess.tipo==="entreno";
            const h15=Math.round(jugs.reduce((a,j)=>a+calcZonas(j,sess).h15,0)/n);
            const h18=Math.round(jugs.reduce((a,j)=>a+calcZonas(j,sess).h18,0)/n);
            const spr=Math.round(jugs.reduce((a,j)=>a+calcZonas(j,sess).sp,0)/n);
            const acc=avg("acc");
            const dsc=avg("dsc");
            const ns=avg("ns");
            const vmax=avgf("vmax");
            return(
              <Card style={{border:`1px solid ${T.border2}`,background:"#0d1020"}}>
                <CT text="Promedio equipo"/>
                <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:12}}>
                  {[
                    ["Dist.",`${dist.toLocaleString()}m`,T.blue],
                    ["m/min",mxm,T.muted2],
                    ["15-18",`${h15}m`,T.green],
                    ["18-21",`${h18}m`,T.amber],
                    [">21",`${spr}m`,T.red],
                    ["ACC",acc,T.purple],
                    ["DSC",dsc,T.cyan],
                    ["N Spr",ns,"#06b6d4"],
                    ["Vmáx",`${vmax}km/h`,"#e879f9"]
                  ].map(([l,v,c])=>(
                    <div key={l} style={{textAlign:"center",minWidth:55}}>
                      <div style={{fontSize:9,color:T.muted,marginBottom:2}}>{l}</div>
                      <div style={{fontSize:14,fontWeight:600,color:c}}>{v}</div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })()}
        </>
      ):(
        <>
          <MR>
            <MetCard label="Sesiones" value={pool.length}/>
            <MetCard label="Total tipos" value={`${PARTIDOS.length}P+${AMISTOSOS.length}A+${ENTRENOS.length}E`}/>
          </MR>
          {/* Gráfico resumen por tipo */}
          {(tipo==="partidos"||tipo==="todos")&&<GraficoHSR sesiones={PARTIDOS} titulo="HSR por zonas — Partidos (prom. equipo)"/>}
          {(tipo==="amistosos"||tipo==="todos")&&<GraficoHSR sesiones={AMISTOSOS} titulo="HSR por zonas — Amistosos (prom. equipo)"/>}
          {(tipo==="entrenos"||tipo==="todos")&&<GraficoHSR sesiones={ENTRENOS} titulo="HSR por zonas — Entrenamientos (prom. equipo)"/>}
        </>
      )}
      {/* Radar: staff selecciona jugadora para comparar */}
      {sess&&sess.jugadoras&&(
        <Card style={{marginBottom:10}}>
          <CT text="Radar comparativo"/>
          <select value={jugSel||""} onChange={e=>setJugSel(e.target.value)} style={{background:T.surf,border:`1px solid ${T.border2}`,borderRadius:6,color:jugSel?T.text:T.muted,fontSize:12,padding:"5px 10px",outline:"none",marginBottom:10,width:"100%"}}>
            <option value="">Seleccioná una jugadora para ver radar...</option>
            {sess.jugadoras.map(j=><option key={j.n} value={j.n}>{j.n}</option>)}
          </select>
          {jugSel&&<RadarChart player={jugSel} sesion={sess}/>}
        </Card>
      )}
    </>
  );
}

// ─── STAFF PUESTOS ────────────────────────────────────────────────────────────
// ─── PUESTOS CONTEXT — carga desde Drive, disponible globalmente ──────────────
const PuestosCtx=React.createContext(PUESTOS);
function usePuestos(){return React.useContext(PuestosCtx);}

function PuestosProvider({children}){
  const [puestos,setPuestos]=useState(PUESTOS);
  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Perfil Puestos"]||[];
        if(sheet.length<2)return;
        const headers=sheet[0].map(h=>String(h).trim());
        const idx=k=>headers.indexOf(k);
        const parsed=sheet.slice(1).map(r=>({
          p:  String(r[idx("Puesto")]||"").trim(),
          n:  String(r[idx("Nombre")]||"").trim(),
          jugadoras: String(r[idx("Jugadoras")]||"").split(",").map(x=>x.trim()).filter(Boolean),
          dist: +r[idx("Dist")]||0,
          mxm:  +r[idx("Mxm")]||0,
          hsr:  +r[idx("HSR")]||0,
          ai18: +r[idx("AI18")]||0,
          spr:  +r[idx("AI21")]||0,
          ns:   +r[idx("NºSpr")]||0,
          acc:  +r[idx("Acc")]||0,
          dsc:  +r[idx("Dsc")]||0,
          vmax: +r[idx("Vmax")]||0,
        })).filter(r=>r.p);
        if(parsed.length)setPuestos(parsed);
      })
      .catch(()=>{});
  },[]);
  return React.createElement(PuestosCtx.Provider,{value:puestos},children);
}

function StaffPuestos(){
  const puestos=usePuestos();
  const prom=puestos.find(p=>p.p==="PROM")||{dist:0,hsr:0,vmax:0};
  return(
    <>
      <MR>
        <MetCard label="Dist. prom." value={`${prom.dist.toLocaleString()}m`} sub="Partidos oficiales ≥48min"/>
        <MetCard label="HSR prom." value={`${prom.hsr.toLocaleString()}m`}/>
        <MetCard label="Vel. máx prom." value={`${prom.vmax} km/h`} sc={T.amber}/>
      </MR>
      <Card>
        <CT text="Por puesto — partidos oficiales (≥48 min) — en vivo desde Drive"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["Puesto","Nombre","Dist.","M/min","HSR","AI 18-21","AI >21","Nº Spr","ACC","DSC","V.máx"]}/>
            <tbody>{puestos.map(p=>(
              <tr key={p.p} style={{background:p.p==="PROM"?"#0d1020":"transparent"}}>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:p.p==="PROM"?T.muted:T.blue,fontWeight:600}}>{p.p}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{p.n}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:p.p==="PROM"?700:400}}>{p.dist.toLocaleString()}m</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{p.mxm}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.green}}>{p.hsr.toLocaleString()}m</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{p.ai18}m</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.red}}>{p.spr}m</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{p.ns}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{p.acc}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{p.dsc}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{p.vmax}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        <div style={{color:T.muted,fontSize:10,marginTop:8}}>Actualizar: modificá la hoja "Perfil Puestos" en Drive y recargá la app</div>
      </Card>
    </>
  );
}

// ─── STAFF YO-YO ──────────────────────────────────────────────────────────────

// ─── STAFF EVOLUCIÓN GPS ─────────────────────────────────────────────────────
function StaffEvoGPS(){
  const {partidos:P=[],amistosos:A=[],entrenos:E=[]}=useGPS();
  const PARTIDOS=P.length?P:PARTIDOS_FB;
  const AMISTOSOS=A;
  const ENTRENOS=E;
  const [tipo,setTipo]=useState("partidos");
  const [metric,setMetric]=useState("dist");
  const [vista,setVista]=useState("equipo");
  const [jugSel,setJugSel]=useState(null);
  React.useEffect(()=>{if(!jugSel&&PARTIDOS.length)setJugSel(allNames(allSess(PARTIDOS,AMISTOSOS,ENTRENOS))[0]);},[PARTIDOS.length]);

  const METRICS=[
    {k:"dist",  label:"Dist. Total",  unit:"m",    color:T.blue},
    {k:"mxm",   label:"m/min",        unit:"",     color:T.cyan},
    {k:"hsr",   label:"HSR >15",      unit:"m",    color:T.green},
    {k:"h18",   label:"18-21 km/h",   unit:"m",    color:T.amber},
    {k:"spr",   label:"Sprint >21",   unit:"m",    color:T.red},
    {k:"acc",   label:"ACC",          unit:"",     color:T.purple},
    {k:"vmax",  label:"Vel. Máx",     unit:"km/h", color:T.pink||"#e879f9"},
    {k:"ns",    label:"Nº Sprint",    unit:"",     color:"#e09020"},
  ];
  const getSessions=()=>{
    const p=PARTIDOS.map(s=>({...s,tipo:"partido"}));
    const a=AMISTOSOS.map(s=>({...s,tipo:"amistoso"}));
    const e=ENTRENOS.map(s=>({...s,tipo:"entreno"}));
    if(tipo==="partidos")return p;
    if(tipo==="amistosos")return a;
    if(tipo==="entrenos")return e;
    return[...p,...a,...e];
  };
  const sessions=getSessions();
  const getVal=(s,k)=>{
    const jArr=s.jugadoras||[];
    const jAvg=field=>jArr.length?Math.round(jArr.reduce((a,j)=>a+(j[field]||0),0)/jArr.length):0;
    const jAvgF=field=>jArr.length?Math.round(jArr.reduce((a,j)=>a+(j[field]||0),0)/jArr.length*10)/10:0;
    if(s.prom){
      if(k==="dist")return s.prom.dist||0;
      if(k==="mxm")return s.prom.mxm||0;
      if(k==="hsr")return s.prom.hsr||0;
      if(k==="h18")return s.prom.h18||0;
      if(k==="spr")return s.prom.spr||0;
      if(k==="acc")return s.prom.acc||0;
      if(k==="vmax")return s.prom.vmax||0;
      if(k==="ns")return jAvg("ns");
    }
    // Entrenos: calcular promedio de jugadoras
    if(k==="dist")return jAvg("dist");
    if(k==="mxm")return jAvg("mxm");
    if(k==="hsr")return jAvg("hsr")||jAvg("ai15");
    if(k==="h18")return jAvg("ai18");
    if(k==="spr")return jAvg("spr");
    if(k==="acc")return jAvg("acc");
    if(k==="vmax")return jAvgF("vmax");
    if(k==="ns")return jAvg("ns");
    if(false&&s.prom_hsr!==undefined){
      if(k==="vmax"){
        const vmaxArr=s.jugadoras?.map(j=>j.vmax||0)||[];
        return vmaxArr.length?Math.round(vmaxArr.reduce((a,b)=>a+b,0)/vmaxArr.length*10)/10:0;
      }
      if(k==="hsr")return s.prom_hsr||0;
      if(k==="h18")return s.prom_h18||0;
      if(k==="spr")return s.prom_spr||0;
    }
    return 0;
  };
  const getJugVal=(s,k)=>{
    const j=s.jugadoras?.find(x=>x.n===jugSel);
    if(!j)return 0;
    if(k==="dist")return j.dist||0;
    if(k==="mxm")return j.mxm||0;
    if(k==="hsr")return j.hsr||j.ai15||0;
    if(k==="h18")return j.ai18||0;
    if(k==="spr")return j.spr||0;
    if(k==="acc")return j.acc||0;
    if(k==="vmax")return j.vmax||0;
    if(k==="ns")return j.ns||0;
    return 0;
  };
  const curMetric=METRICS.find(m=>m.k===metric);
  const vals=sessions.map(s=>vista==="equipo"?getVal(s,metric):getJugVal(s,metric));
  const maxVal=Math.max(...vals,1);

  return(
    <>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
        {["partidos","amistosos","entrenos","todo"].map(t=>(
          <button key={t} onClick={()=>setTipo(t)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${tipo===t?T.blue:T.border}`,background:tipo===t?"#1e3a5f":"transparent",color:tipo===t?T.blue:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{t}</button>
        ))}
        <div style={{display:"flex",gap:4,marginLeft:"auto"}}>
          {["equipo","jugadora"].map(v=>(
            <button key={v} onClick={()=>setVista(v)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${vista===v?T.green:T.border}`,background:vista===v?"#0f2d1f":"transparent",color:vista===v?T.green:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{v}</button>
          ))}
        </div>
      </div>
      {vista==="jugadora"&&(
        <select value={jugSel} onChange={e=>setJugSel(e.target.value)} style={{background:T.surf,border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,fontSize:12,padding:"5px 10px",outline:"none",marginBottom:10,width:"100%"}}>
          {ALL_JUGADORAS.map(n=><option key={n}>{n}</option>)}
        </select>
      )}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
        {METRICS.map(m=>(
          <button key={m.k} onClick={()=>setMetric(m.k)} style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${metric===m.k?m.color:T.border}`,background:metric===m.k?m.color+"22":"transparent",color:metric===m.k?m.color:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{m.label}</button>
        ))}
      </div>
      <Card>
        <CT text={`${curMetric?.label} — ${vista==="equipo"?"Promedio equipo":jugSel.split(" ")[0]}`}/>
        {vals.length>0&&(()=>{
          const maxIdx=vals.indexOf(Math.max(...vals));
          const maxS=sessions[maxIdx];
          const maxV=vals[maxIdx];
          const unit=curMetric?.unit||"";
          return maxS?(
            <div style={{display:"flex",alignItems:"center",gap:10,background:"#0d1f35",borderRadius:8,padding:"8px 14px",marginBottom:10,border:"1px solid #1e3a5f"}}>
              <div style={{textAlign:"center",minWidth:40}}>
                <div style={{fontSize:22,fontWeight:800,color:curMetric?.color||T.blue}}>{maxV}{unit}</div>
                <div style={{fontSize:9,color:T.muted,marginTop:1}}>MÁX</div>
              </div>
              <div style={{width:1,height:36,background:T.border}}/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:T.text}}>{sIcon(maxS.tipo)} {maxS.label}</div>
              </div>
            </div>
          ):null;
        })()}
        {sessions.map((s,i)=>{
          const v=vals[i];
          const pct=(v/maxVal)*100;
          return(
            <div key={s.id} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:T.muted2}}>{sIcon(s.tipo)} {s.label}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:11,color:curMetric?.color,fontWeight:600}}>{v}{curMetric?.unit}</span>
                {i>0&&vals[i-1]>0&&(()=>{const chg=Math.round(((v-vals[i-1])/vals[i-1])*100);return chg!==0?<span style={{fontSize:10,color:chg>0?T.green:T.red,fontWeight:600}}>{chg>0?"+":""}{chg}%</span>:null;})()}
              </div>
              </div>
              <div style={{background:"#1a1e2a",borderRadius:3,height:8}}>
                <div style={{width:`${pct}%`,height:8,borderRadius:3,background:curMetric?.color}}/>
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}

// ─── PLAYER EVOLUCIÓN GPS ─────────────────────────────────────────────────────
const yoyoGrupoColor=g=>g===1?"#3ecf7a":g===2?"#4a90e8":"#e09020";
const yoyoNivelColor=n=>n>=16.5?"#3ecf7a":n>=14.6?"#f5c518":"#e05555";
const yoyoGrupoLabel=g=>`Grupo ${g}`;
const yoyoDist={
  13.1:200,13.2:240,13.3:280,13.4:320,13.5:360,13.6:400,13.7:440,13.8:480,13.9:520,
  14.0:560,14.1:600,14.2:640,14.3:680,14.4:720,14.5:760,14.6:800,14.7:840,14.8:880,14.9:920,
  15.0:960,15.1:1000,15.2:1040,15.3:1080,15.4:1120,15.5:1160,15.6:1200,15.7:1240,15.8:1280,15.9:1320,
  16.0:1360,16.1:1400,16.2:1440,16.3:1480,16.4:1520,16.5:1560,16.6:1600,16.7:1640,16.8:1680,16.9:1720,
  17.0:1760,17.1:1800,17.2:1840,17.3:1880,17.4:1920,17.5:1960,
};

function PlayerEvoGPS({player}){
  const {partidos:P=[],amistosos:A=[],entrenos:E=[]}=useGPS();
  const PARTIDOS=P.length?P:PARTIDOS_FB;
  const AMISTOSOS=A;
  const ENTRENOS=E;
  const [tipo,setTipo]=useState("partidos");
  const [metric,setMetric]=useState("dist");
  const METRICS=[
    {k:"dist",label:"Dist. Total",unit:"m",color:T.blue},
    {k:"mxm", label:"m/min",     unit:"", color:T.cyan},
    {k:"hsr", label:"HSR >15",   unit:"m",color:T.green},
    {k:"h18", label:"18-21 km/h",unit:"m",color:T.amber},
    {k:"spr", label:"Sprint >21",unit:"m",color:T.red},
    {k:"acc", label:"ACC",       unit:"", color:T.purple},
    {k:"vmax",label:"Vel. Máx",  unit:"km/h",color:T.pink||"#e879f9"},
    {k:"ns",  label:"Nº Sprint",  unit:"",    color:"#e09020"},
  ];
  const getSessions=()=>{
    const p=PARTIDOS.map(s=>({...s,tipo:"partido"}));
    const a=AMISTOSOS.map(s=>({...s,tipo:"amistoso"}));
    const e=ENTRENOS.map(s=>({...s,tipo:"entreno"}));
    if(tipo==="partidos")return p;
    if(tipo==="amistosos")return a;
    if(tipo==="entrenos")return e;
    return[...p,...a,...e];
  };
  const sessions=getSessions().filter(s=>s.jugadoras?.some(j=>j.n===player));
  const getVal=(s,k)=>{
    const j=s.jugadoras?.find(x=>x.n===player);
    if(!j)return 0;
    if(k==="dist")return j.dist||0;
    if(k==="mxm")return j.mxm||0;
    if(k==="hsr")return j.hsr||j.ai15||0;
    if(k==="h18")return j.ai18||0;
    if(k==="spr")return j.spr||0;
    if(k==="acc")return j.acc||0;
    if(k==="vmax")return j.vmax||0;
    if(k==="ns")return j.ns||0;
    return 0;
  };
  const curMetric=METRICS.find(m=>m.k===metric);
  const vals=sessions.map(s=>getVal(s,metric));
  const maxVal=Math.max(...vals,1);
  return(
    <>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
        {["partidos","amistosos","entrenos","todo"].map(t=>(
          <button key={t} onClick={()=>setTipo(t)} style={{padding:"4px 10px",borderRadius:6,border:`1px solid ${tipo===t?T.blue:T.border}`,background:tipo===t?"#1e3a5f":"transparent",color:tipo===t?T.blue:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{t}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
        {METRICS.map(m=>(
          <button key={m.k} onClick={()=>setMetric(m.k)} style={{padding:"4px 9px",borderRadius:6,border:`1px solid ${metric===m.k?m.color:T.border}`,background:metric===m.k?m.color+"22":"transparent",color:metric===m.k?m.color:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{m.label}</button>
        ))}
      </div>
      <Card>
        <CT text={`${curMetric?.label} — ${player.split(" ")[0]}`}/>
        {sessions.length===0&&<div style={{color:T.muted,textAlign:"center",padding:16,fontSize:12}}>Sin datos para {player.split(" ")[0]} en {tipo}</div>}
        {vals.length>0&&(()=>{
          const maxIdx=vals.indexOf(Math.max(...vals));
          const maxS=sessions[maxIdx];
          const maxV=vals[maxIdx];
          const unit=curMetric?.unit||"";
          return maxS?(
            <div style={{display:"flex",alignItems:"center",gap:10,background:"#0d1f35",borderRadius:8,padding:"8px 14px",marginBottom:10,border:"1px solid #1e3a5f"}}>
              <div style={{textAlign:"center",minWidth:40}}>
                <div style={{fontSize:22,fontWeight:800,color:curMetric?.color||T.blue}}>{maxV}{unit}</div>
                <div style={{fontSize:9,color:T.muted,marginTop:1}}>MÁX</div>
              </div>
              <div style={{width:1,height:36,background:T.border}}/>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:T.text}}>{sIcon(maxS.tipo)} {maxS.label}</div>
              </div>
            </div>
          ):null;
        })()}
        {sessions.map((s,i)=>{
          const v=vals[i];
          const pct=(v/maxVal)*100;
          return(
            <div key={s.id} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:11,color:T.muted2}}>{sIcon(s.tipo)} {s.label}</span>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:11,color:curMetric?.color,fontWeight:600}}>{v}{curMetric?.unit}</span>
                {i>0&&vals[i-1]>0&&(()=>{const chg=Math.round(((v-vals[i-1])/vals[i-1])*100);return chg!==0?<span style={{fontSize:10,color:chg>0?T.green:T.red,fontWeight:600}}>{chg>0?"+":""}{chg}%</span>:null;})()}
              </div>
              </div>
              <div style={{background:"#1a1e2a",borderRadius:3,height:8}}>
                <div style={{width:`${pct}%`,height:8,borderRadius:3,background:curMetric?.color}}/>
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}

// ─── YOYO HELPERS ─────────────────────────────────────────────────────────────
// Color y label del NIVEL según referencias por nivel
const yoyoColor=nivel=>nivel>16.5?"#3ecf7a":nivel>=14.6?"#e09020":"#e05555";
const yoyoLabel=nivel=>nivel>16.5?"Grupo 1":nivel>=14.6?"Grupo 2":"Grupo 3";
// Grupos en tabla por VAM
const yoyoGrupo=vam=>vam>=4.3?1:vam>=4.0?2:3;

// Niveles válidos IRT1
const NIVELES_VALIDOS=["5.1","8.1","11.1","11.2","12.1","12.2","12.3","13.1","13.2","13.3","13.4","14.1","14.2","14.3","14.4","14.5","14.6","14.7","14.8","15.1","15.2","15.3","15.4","15.5","15.6","15.7","15.8","16.1","16.2","16.3","16.4","16.5","16.6","16.7","16.8","17.1","17.2","17.3","17.4","17.5","17.6","17.7","17.8","18.1","18.2","18.3","18.4","18.5","18.6","18.7","18.8","19.1","19.2","19.3","19.4","19.5","19.6","19.7","19.8","20.1","20.2","20.3","20.4","20.5","20.6","20.7","20.8","21.1","21.2","21.3","21.4","21.5","21.6","21.7","21.8","22.1","22.2","22.3","22.4","22.5","22.6","22.7","22.8","23.1","23.2","23.3","23.4","23.5","23.6","23.7","23.8"];

// ─── EVALUACIONES HELPERS ────────────────────────────────────────────────────
const EJERCICIOS=["Sentadilla","Peso Muerto","Press Plano","Dominadas","Cargada","2do Tiempo"];

// Yo-Yo IRT1: nivel.subnivel → distancia y VAM (fórmula Bangsbo 2008)
function calcYoyo(nivelStr){
  const tabla={
    "5.1":40,"8.1":80,
    "11.1":120,"11.2":160,
    "12.1":200,"12.2":240,"12.3":280,
    "13.1":320,"13.2":360,"13.3":400,"13.4":440,
    "14.1":480,"14.2":520,"14.3":560,"14.4":600,"14.5":640,"14.6":680,"14.7":720,"14.8":760,
    "15.1":800,"15.2":840,"15.3":880,"15.4":920,"15.5":960,"15.6":1000,"15.7":1040,"15.8":1080,
    "16.1":1120,"16.2":1160,"16.3":1200,"16.4":1240,"16.5":1280,"16.6":1320,"16.7":1360,"16.8":1400,
    "17.1":1440,"17.2":1480,"17.3":1520,"17.4":1560,"17.5":1600,"17.6":1640,"17.7":1680,"17.8":1720,
    "18.1":1760,"18.2":1800,"18.3":1840,"18.4":1880,"18.5":1920,"18.6":1960,"18.7":2000,"18.8":2040,
    "19.1":2080,"19.2":2120,"19.3":2160,"19.4":2200,"19.5":2240,"19.6":2280,"19.7":2320,"19.8":2360,
    "20.1":2400,"20.2":2440,"20.3":2480,"20.4":2520,"20.5":2560,"20.6":2600,"20.7":2640,"20.8":2680,
    "21.1":2720,"21.2":2760,"21.3":2800,"21.4":2840,"21.5":2880,"21.6":2920,"21.7":2960,"21.8":3000,
    "22.1":3040,"22.2":3080,"22.3":3120,"22.4":3160,"22.5":3200,"22.6":3240,"22.7":3280,"22.8":3320,
    "23.1":3360,"23.2":3400,"23.3":3440,"23.4":3480,"23.5":3520,"23.6":3560,"23.7":3600,"23.8":3640,
  };
  const key=String(parseFloat(nivelStr).toFixed(1));
  const dist=tabla[key]||0;
  // VAM fórmula Bangsbo 2008, 1 decimal
  const vam=dist>0?Math.round(((dist*0.0024)+10.4)/3.6*10)/10:0;
  return{dist,vam};
}

function StaffEvaluaciones(){
  const [subTab,setSubTab]=useState("yoyo");// yoyo | cargas
  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={()=>setSubTab("yoyo")} style={{padding:"7px 16px",borderRadius:6,border:`1px solid ${subTab==="yoyo"?T.blue:T.border}`,background:subTab==="yoyo"?"#1e3a5f":"transparent",color:subTab==="yoyo"?T.blue:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🏃 Yo-Yo</button>
        <button onClick={()=>setSubTab("cargas")} style={{padding:"7px 16px",borderRadius:6,border:`1px solid ${subTab==="cargas"?T.amber:T.border}`,background:subTab==="cargas"?"#2d2a0f":"transparent",color:subTab==="cargas"?T.amber:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🏋️ Cargas</button>
      </div>
      {subTab==="yoyo"?<StaffYoyo/>:<StaffCargas/>}
    </>
  );
}

function StaffYoyo(){
  const [vista,setVista]=useState("reporte");
  const [loading,setLoading]=useState(true);
  const [driveData,setDriveData]=useState([]);

  React.useEffect(()=>{
    if(vista!=="reporte")return;
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Yoyo App"]||d["YOYO App"]||[];
        if(sheet.length<2){setDriveData([]);return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iF=headers.indexOf("Fecha"),iJ=headers.indexOf("Jugadora"),iN=headers.indexOf("Nivel"),iD=headers.indexOf("Distancia"),iV=headers.indexOf("VAM");
        const last={};
        sheet.slice(1).forEach(r=>{
          const fecha=String(r[iF]||"").slice(0,10);
          const jug=String(r[iJ]||"").trim();
          const nivel=parseFloat(r[iN])||0;
          const dist=Number(r[iD])||0;
          const rawVam=parseFloat(r[iV])||0;
          if(!jug||!nivel)return;
          // Recalcular VAM con Bangsbo para asegurar 1 decimal
          const vam=dist>0?Math.round(((dist*0.0024)+10.4)/3.6*10)/10:Math.round(rawVam*10)/10;
          if(!last[jug]||fecha>last[jug].fecha) last[jug]={n:jug,fecha,nivel,dist,vam};
        });
        setDriveData(Object.values(last).sort((a,b)=>b.nivel-a.nivel));
      })
      .catch(()=>setDriveData([]))
      .finally(()=>setLoading(false));
  },[vista]);

  if(vista==="tomar")return<StaffTomarYoyo onVolver={()=>setVista("reporte")}/>;

  const sorted=driveData;
  const medals=["🥇","🥈","🥉"];

  const PALETTE=["#64B5F6","#f472b6","#a78bfa","#06b6d4","#e879f9","#38bdf8","#818cf8","#c084fc"];
  const vams=[...new Set(sorted.map(p=>p.vam).filter(Boolean))].sort((a,b)=>b-a);
  const vamGrupo={};
  vams.forEach((v,i)=>{vamGrupo[v]={num:i+1,color:PALETTE[i%PALETTE.length]};});

  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.blue}`,background:"#1e3a5f",color:T.blue,fontSize:12,fontWeight:600,cursor:"default",fontFamily:"inherit"}}>📊 Reporte</button>
        <button onClick={()=>setVista("tomar")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📝 Tomar Test</button>
      </div>
      {loading?<Card><div style={{color:T.muted,textAlign:"center",padding:20}}>Cargando desde Drive...</div></Card>:<>
      <MR>
        <MetCard label="Nivel prom." value={sorted.length?avg(sorted.map(p=>p.nivel)).toFixed(1):"—"} sub="Yo-Yo IRT1"/>
        <MetCard label="Nivel más alto" value={sorted[0]?.nivel||"—"} sub={sorted[0]?.n.split(" ")[0]} sc={T.amber}/>
        <MetCard label="VAM prom." value={sorted.length?`${avg(sorted.map(p=>p.vam)).toFixed(1)} m/s`:"—"}/>
        <MetCard label="Evaluadas" value={sorted.length}/>
      </MR>
      <Card style={{marginBottom:10}}>
        <CT text="Referencias por Nivel"/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{label:"Grupo 1 — >16.5",c:T.green},{label:"Grupo 2 — 14.6 a 16.4",c:T.amber},{label:"Grupo 3 — <14.6",c:T.red}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"#0d1020",padding:"7px 12px",borderRadius:8,border:`1px solid ${r.c}44`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:r.c}}/><span style={{fontSize:11,color:r.c,fontWeight:500}}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CT text="Ranking Yo-Yo IRT1 — grupos por VAM"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>
              {["#","Jugadora","Nivel","Distancia","VAM","Grupo"].map((c,i)=>(
                <th key={i} style={{textAlign:i===5?"center":"left",fontWeight:500,fontSize:10,color:T.muted,padding:"5px 6px",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:".4px",whiteSpace:"nowrap"}}>{c}</th>
              ))}
            </tr></thead>
            <tbody>{sorted.map((p,i)=>{
              const nivelCol=yoyoColor(p.nivel);
              const gInfo=p.vam?vamGrupo[p.vam]:null;
              const col=gInfo?gInfo.color:T.muted;
              return(
                <tr key={p.n}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{i<3?medals[i]:i+1}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,fontWeight:500,whiteSpace:"nowrap"}}>{p.n}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:nivelCol,fontWeight:700,fontSize:14}}>{p.nivel}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{p.dist?`${p.dist}m`:"—"}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:600}}>{p.vam||"—"}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",textAlign:"center"}}>
                    {gInfo&&<span style={{background:col,color:"#111",padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700,display:"inline-block"}}>G{gInfo.num}</span>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </Card>
      </>}
    </>
  );
}

function StaffTomarYoyo({onVolver}){
  const hoy=(()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})();
  const [fecha,setFecha]=useState(hoy);
  const [niveles,setNiveles]=useState({});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);

  const setNivel=(j,v)=>setNiveles(prev=>({...prev,[j]:v}));

  const guardar=async()=>{
    setSaving(true);
    const datos=ALL_JUGADORAS.filter(j=>niveles[j]).map(j=>{
      const n=parseFloat(niveles[j]);
      const{dist,vam}=calcYoyo(n);
      return{jugadora:j,nivel:n,dist,vam};
    });
    const params=new URLSearchParams({accion:"yoyo",fecha,datos:JSON.stringify(datos)});
    await fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec?"+params.toString(),{method:"GET",mode:"no-cors"}).catch(()=>{});
    setSaving(false);setSaved(true);
  };

  // Preview de resultados
  const preview=ALL_JUGADORAS.filter(j=>niveles[j]&&parseFloat(niveles[j])>0).map(j=>{
    const n=parseFloat(niveles[j]);
    const{dist,vam}=calcYoyo(n);
    return{j,n,dist,vam};
  }).sort((a,b)=>b.vam-a.vam);

  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={onVolver} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>📊 Reporte</button>
        <button style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"default",fontFamily:"inherit"}}>📝 Tomar Test</button>
      </div>
      <Card style={{marginBottom:8}}>
        <CT text="Yo-Yo IRT1 — Ingresá nivel por jugadora"/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Fecha del test</div>
          <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
            style={{background:"#1a2035",border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:"inherit",colorScheme:"dark"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {ALL_JUGADORAS.map(j=>{
            const n=niveles[j]||"";
            const preview_=n&&parseFloat(n)>0?calcYoyo(parseFloat(n)):null;
            const nivelNum=parseFloat(n)||0;
            const nivelCol=n?yoyoColor(nivelNum):T.muted;
            return(
              <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:12,color:T.text,flex:1,minWidth:120}}>{j}</span>
                <select value={n} onChange={e=>setNivel(j,e.target.value)}
                  style={{width:80,background:"#1a2035",border:`1px solid ${n?nivelCol:T.border2}`,borderRadius:6,color:n?nivelCol:T.muted,padding:"5px 6px",fontSize:13,fontFamily:"inherit",textAlign:"center",fontWeight:n?"700":"400"}}>
                  <option value="">—</option>
                  {NIVELES_VALIDOS.map(nv=><option key={nv} value={nv}>{nv}</option>)}
                </select>
                {preview_&&(
                  <span style={{fontSize:11,color:nivelCol,minWidth:100,textAlign:"right"}}>{preview_.dist}m · {preview_.vam} m/s</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      {preview.length>0&&(
        <Card style={{marginBottom:8}}>
          <CT text="Vista previa — grupos por Nivel"/>
          {[{label:"Grupo 1",c:T.green,filter:p=>parseFloat(p.nivel)>16.5},{label:"Grupo 2",c:T.amber,filter:p=>parseFloat(p.nivel)>=14.6&&parseFloat(p.nivel)<=16.5},{label:"Grupo 3",c:T.red,filter:p=>parseFloat(p.nivel)<14.6}].map(g=>{
            const filtradas=preview.filter(g.filter);
            if(!filtradas.length)return null;
            return(
              <div key={g.label} style={{marginBottom:10}}>
                <div style={{fontSize:11,color:g.c,fontWeight:600,marginBottom:5}}>{g.label}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {filtradas.map(p=>(
                    <div key={p.j} style={{background:g.c+"15",border:`1px solid ${g.c}44`,borderRadius:6,padding:"4px 10px",fontSize:11}}>
                      <span style={{color:T.text}}>{p.j.split(" ")[0]}</span>
                      <span style={{color:g.c,marginLeft:6,fontWeight:600}}>Niv.{p.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Card>
      )}
      <button onClick={guardar} disabled={saving||preview.length===0}
        style={{width:"100%",padding:13,background:saved?T.green:T.blue,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
        {saving?"Guardando...":saved?"✓ Guardado en Drive":"Guardar Test en Drive"}
      </button>
    </>
  );
}

function StaffCargas(){
  const [vista,setVista]=useState("reporte");
  const [loading,setLoading]=useState(true);
  const [data,setData]=useState(null);

  React.useEffect(()=>{
    if(vista!=="reporte")return;
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Cargas App"]||[];
        if(sheet.length<2){setData({});return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iF=headers.indexOf("Fecha"),iE=headers.indexOf("Ejercicio"),iJ=headers.indexOf("Jugadora"),iP=headers.indexOf("Peso"),iV=headers.indexOf("Vel (m/s)"),iR=headers.indexOf("RM");
        const acc={};
        sheet.slice(1).forEach(r=>{
          const fecha=String(r[iF]||"").slice(0,10);
          const ej=String(r[iE]||"").trim();
          const jug=String(r[iJ]||"").trim();
          const peso=Number(r[iP])||0;
          const vel=iV>=0?Number(r[iV])||null:null;
          const rm=iR>=0?Number(r[iR])||null:null;
          if(!ej||!jug||!peso)return;
          if(!acc[ej])acc[ej]={};
          if(!acc[ej][jug])acc[ej][jug]=[];
          acc[ej][jug].push({fecha,peso,vel,rm});
        });
        setData(acc);
      })
      .catch(()=>setData({}))
      .finally(()=>setLoading(false));
  },[vista]);

  if(vista==="cargar")return<StaffCargarPesos onVolver={()=>setVista("reporte")}/>;

  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.amber}`,background:"#2d2a0f",color:T.amber,fontSize:12,fontWeight:600,cursor:"default",fontFamily:"inherit"}}>📊 Reporte</button>
        <button onClick={()=>setVista("cargar")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>➕ Cargar Pesos</button>
      </div>
      {loading?<Card><div style={{color:T.muted,textAlign:"center",padding:20}}>Cargando desde Drive...</div></Card>:
      !data||!Object.keys(data).length?<Card><div style={{color:T.muted,textAlign:"center",padding:20}}>Sin datos de cargas todavía</div></Card>:
      EJERCICIOS.filter(ej=>data[ej]).map(ej=>(
        <Card key={ej} style={{marginBottom:10}}>
          <CT text={ej}/>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={ej==="Dominadas"?["Jugadora","Reps","Fecha"]:["Jugadora","Kg","VMP","RM","Fecha"]}/>
            <tbody>{Object.entries(data[ej]||{}).sort((a,b)=>{
              const pa=Math.max(...a[1].map(x=>x.peso));
              const pb=Math.max(...b[1].map(x=>x.peso));
              return pb-pa;
            }).map(([jug,registros])=>{
              const last=registros[registros.length-1];
              const max=Math.max(...registros.map(x=>x.peso));
              return(
                <tr key={jug}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{jug.split(" ")[0]}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:600}}>{ej==="Dominadas"?`${last.peso}`:`${last.peso} kg`}{last.peso===max&&<span style={{color:T.green,fontSize:10}}> ↑</span>}</td>
                  {ej!=="Dominadas"&&<td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:last.vel?T.blue:T.muted}}>{last.vel?`${last.vel} m/s`:"—"}</td>}
                  {ej!=="Dominadas"&&<td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:last.rm?T.green:T.muted}}>{last.rm?`${last.rm} kg`:"—"}</td>}
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{last.fecha}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </Card>
      ))}
    </>
  );
}

function StaffCargarPesos({onVolver}){
  const hoy=(()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})();
  const [fecha,setFecha]=useState(hoy);
  const [ejercicio,setEjercicio]=useState(EJERCICIOS[0]);
  const [pesos,setPesos]=useState({});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);

  const guardar=async()=>{
    setSaving(true);
    const datos=ALL_JUGADORAS.filter(j=>pesos[j]?.kg&&parseFloat(pesos[j].kg)>0).map(j=>({
      jugadora:j,
      peso:parseFloat(pesos[j].kg),
      vel:pesos[j]?.vel?parseFloat(pesos[j].vel):null,
      rm:pesos[j]?.rm?parseFloat(pesos[j].rm):null
    }));
    const params=new URLSearchParams({accion:"cargas",fecha,ejercicio,datos:JSON.stringify(datos)});
    await fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec?"+params.toString(),{method:"GET",mode:"no-cors"}).catch(()=>{});
    setSaving(false);setSaved(true);setPesos({});
  };

  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={onVolver} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>📊 Reporte</button>
        <button style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"default",fontFamily:"inherit"}}>➕ Cargar Pesos</button>
      </div>
      <Card style={{marginBottom:8}}>
        <CT text="Cargar pesos"/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Fecha</div>
            <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)}
              style={{background:"#1a2035",border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:"inherit",colorScheme:"dark"}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Ejercicio</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {EJERCICIOS.map(ej=>(
                <button key={ej} onClick={()=>{setEjercicio(ej);setPesos({});setSaved(false);}}
                  style={{padding:"5px 10px",borderRadius:5,border:`1px solid ${ejercicio===ej?T.amber:T.border}`,background:ejercicio===ej?"#2d2a0f":"transparent",color:ejercicio===ej?T.amber:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{ej}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {ALL_JUGADORAS.map(j=>(
            <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontSize:12,color:T.text,flex:1}}>{j}</span>
              {ejercicio==="Dominadas"?(
                <input type="number" value={pesos[j]?.kg||""} onChange={e=>setPesos(prev=>({...prev,[j]:{...prev[j],kg:e.target.value}}))}
                  placeholder="reps" step="1" min="0"
                  style={{width:65,background:"#1a2035",border:`1px solid ${pesos[j]?.kg?T.amber:T.border2}`,borderRadius:6,color:T.text,padding:"5px 8px",fontSize:13,fontFamily:"inherit",textAlign:"center"}}/>
              ):(
                <>
                  <input type="number" value={pesos[j]?.kg||""} onChange={e=>setPesos(prev=>({...prev,[j]:{...prev[j],kg:e.target.value}}))}
                    placeholder="kg" step="0.5" min="0"
                    style={{width:52,background:"#1a2035",border:`1px solid ${pesos[j]?.kg?T.amber:T.border2}`,borderRadius:6,color:T.text,padding:"5px 4px",fontSize:12,fontFamily:"inherit",textAlign:"center"}}/>
                  <input type="number" value={pesos[j]?.vel||""} onChange={e=>setPesos(prev=>({...prev,[j]:{...prev[j],vel:e.target.value}}))}
                    placeholder="m/s" step="0.01" min="0"
                    style={{width:52,background:"#1a2035",border:`1px solid ${pesos[j]?.vel?T.blue:T.border2}`,borderRadius:6,color:T.text,padding:"5px 4px",fontSize:12,fontFamily:"inherit",textAlign:"center"}}/>
                  <input type="number" value={pesos[j]?.rm||""} onChange={e=>setPesos(prev=>({...prev,[j]:{...prev[j],rm:e.target.value}}))}
                    placeholder="RM" step="0.5" min="0"
                    style={{width:52,background:"#1a2035",border:`1px solid ${pesos[j]?.rm?T.green:T.border2}`,borderRadius:6,color:T.text,padding:"5px 4px",fontSize:12,fontFamily:"inherit",textAlign:"center"}}/>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
      <button onClick={guardar} disabled={saving||Object.keys(pesos).filter(j=>pesos[j]?.kg>0).length===0}
        style={{width:"100%",padding:13,background:saved?T.green:T.amber,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
        {saving?"Guardando...":saved?"✓ Guardado en Drive":"Guardar Cargas en Drive"}
      </button>
    </>
  );
}

// ─── STAFF MINUTOS ────────────────────────────────────────────────────────────
const SISTEMAS={
  // x=izq-der (0-100), y=arriba-abajo (0=arr/del, 100=abajo/GK)
  "4-3-3":  [{rol:"GK",x:50,y:92},{rol:"LD",x:10,y:74},{rol:"DC",x:33,y:74},{rol:"DC",x:67,y:74},{rol:"LI",x:90,y:74},{rol:"MC",x:20,y:52},{rol:"MC",x:50,y:52},{rol:"MC",x:80,y:52},{rol:"EX",x:12,y:22},{rol:"DC",x:50,y:16},{rol:"EX",x:88,y:22}],
  "4-4-2":  [{rol:"GK",x:50,y:92},{rol:"LD",x:10,y:74},{rol:"DC",x:33,y:74},{rol:"DC",x:67,y:74},{rol:"LI",x:90,y:74},{rol:"MC",x:12,y:50},{rol:"MC",x:37,y:50},{rol:"MC",x:63,y:50},{rol:"MC",x:88,y:50},{rol:"DC",x:32,y:20},{rol:"DC",x:68,y:20}],
  "4-2-3-1":[{rol:"GK",x:50,y:92},{rol:"LD",x:10,y:74},{rol:"DC",x:33,y:74},{rol:"DC",x:67,y:74},{rol:"LI",x:90,y:74},{rol:"MC",x:33,y:58},{rol:"MC",x:67,y:58},{rol:"EX",x:10,y:38},{rol:"MC",x:50,y:35},{rol:"EX",x:90,y:38},{rol:"DC",x:50,y:15}],
  "3-5-2":  [{rol:"GK",x:50,y:92},{rol:"DC",x:25,y:74},{rol:"DC",x:50,y:74},{rol:"DC",x:75,y:74},{rol:"MO",x:8,y:52},{rol:"MC",x:28,y:50},{rol:"MC",x:50,y:50},{rol:"MC",x:72,y:50},{rol:"MO",x:92,y:52},{rol:"DC",x:30,y:18},{rol:"DC",x:70,y:18}],
  "3-4-3":  [{rol:"GK",x:50,y:92},{rol:"DC",x:25,y:74},{rol:"DC",x:50,y:74},{rol:"DC",x:75,y:74},{rol:"MC",x:12,y:52},{rol:"MC",x:37,y:52},{rol:"MC",x:63,y:52},{rol:"MC",x:88,y:52},{rol:"EX",x:12,y:20},{rol:"DC",x:50,y:15},{rol:"EX",x:88,y:20}],
  "5-3-2":  [{rol:"GK",x:50,y:92},{rol:"MO",x:6,y:70},{rol:"DC",x:24,y:76},{rol:"DC",x:50,y:76},{rol:"DC",x:76,y:76},{rol:"MO",x:94,y:70},{rol:"MC",x:22,y:50},{rol:"MC",x:50,y:50},{rol:"MC",x:78,y:50},{rol:"DC",x:32,y:18},{rol:"DC",x:68,y:18}],
  "4-5-1":  [{rol:"GK",x:50,y:92},{rol:"LD",x:10,y:74},{rol:"DC",x:33,y:74},{rol:"DC",x:67,y:74},{rol:"LI",x:90,y:74},{rol:"EX",x:8,y:50},{rol:"MC",x:28,y:50},{rol:"MC",x:50,y:50},{rol:"MC",x:72,y:50},{rol:"EX",x:92,y:50},{rol:"DC",x:50,y:15}],
};

const ALL_JUGADORAS=["Alfaro Javiera","Arau María Paz","Carrasco Sofia","Errazu Sofia","Gacitua Emilia","Gomez Camila","Gutierrez Renata","Hevia Valentina","Liu Macarena","Manriquez Fernanda","Martinez Amanda","Mateluna Florencia","Muñoz Constanza","Pareja Camila","Pollmann Marianne","Retamal Antonia","Sepulveda Eileen","Sierra Julieta","Silva Victoria"];

function TiempoDisplay({seg}){
  const m=Math.floor(seg/60).toString().padStart(2,"0");
  const s=(seg%60).toString().padStart(2,"0");
  return<span>{m}:{s}</span>;
}

// SVG Cancha Hockey — 3/4 del campo: portería propia abajo, mitad arriba
function CanchaHockeySVG({posiciones,acum,corriendo,onClickJug,seleccionada,modoSetup,jugPendiente,onClickSlot,tarjetas={},onPressStart,onPressEnd}){
  const W=300,H=460;
  const pad=12;
  const fw=W-pad*2, fh=H-pad*2;
  const fx=pad, fy=pad;
  const cx=fx+fw/2;
  // En 3/4 cancha: abajo=portería propia, arriba=mitad de cancha
  // Línea de mitad: top del SVG (y=fy)
  // Línea 25y rival: 33% desde arriba
  // Línea 25y propia: 66% desde arriba
  // Portería y área: en el fondo (abajo)
  const y25rival=fy+fh*0.28;
  const y25propia=fy+fh*0.62;
  const arcR=fw*0.28;  // semicírculo área sólida
  const arcR2=fw*0.42; // semicírculo punteado exterior

  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",maxWidth:340,display:"block",margin:"0 auto",borderRadius:8}}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="fieldClip"><rect x={fx} y={fy} width={fw} height={fh}/></clipPath>
      </defs>
      {/* Fondo verde */}
      <rect width={W} height={H} fill="#1a3a6e" rx="6"/>
      <rect x={fx} y={fy} width={fw} height={fh} fill="#1565C0"/>
      {/* Borde campo */}
      <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke="white" strokeWidth="1.8"/>

      {/* Línea de mitad (arriba del SVG) — solo la línea horizontal */}
      <line x1={fx} y1={fy} x2={fx+fw} y2={fy} stroke="white" strokeWidth="1.8"/>

      {/* Línea 25y rival */}
      <line x1={fx} y1={y25rival} x2={fx+fw} y2={y25rival} stroke="white" strokeWidth="1.2"/>
      {/* Marcas laterales 25y rival */}
      <line x1={fx-3} y1={y25rival} x2={fx+3} y2={y25rival} stroke="white" strokeWidth="1.5"/>
      <line x1={fx+fw-3} y1={y25rival} x2={fx+fw+3} y2={y25rival} stroke="white" strokeWidth="1.5"/>

      {/* Línea 25y propia */}
      <line x1={fx} y1={y25propia} x2={fx+fw} y2={y25propia} stroke="white" strokeWidth="1.2"/>
      {/* Marcas laterales 25y propia */}
      <line x1={fx-3} y1={y25propia} x2={fx+3} y2={y25propia} stroke="white" strokeWidth="1.5"/>
      <line x1={fx+fw-3} y1={y25propia} x2={fx+fw+3} y2={y25propia} stroke="white" strokeWidth="1.5"/>

      {/* Área propia — semicírculo centrado, se eleva desde el fondo hacia arriba */}
      <circle cx={cx} cy={fy+fh} r={arcR} fill="none" stroke="white" strokeWidth="1.8" clipPath="url(#fieldClip)"/>
      {/* Área punteada exterior */}
      <circle cx={cx} cy={fy+fh} r={arcR2} fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="6 4" clipPath="url(#fieldClip)"/>
      {/* Punto penal */}
      <circle cx={cx} cy={fy+fh-arcR*0.55} r={2.5} fill="white"/>

      {/* Portería propia */}
      <rect x={cx-fw*0.14} y={fy+fh-1} width={fw*0.28} height={7} fill="none" stroke="white" strokeWidth="2"/>

      {/* Corners inferiores */}
      <path d={`M ${fx+10} ${fy+fh} Q ${fx} ${fy+fh} ${fx} ${fy+fh-10}`} fill="none" stroke="white" strokeWidth="1.2"/>
      <path d={`M ${fx+fw-10} ${fy+fh} Q ${fx+fw} ${fy+fh} ${fx+fw} ${fy+fh-10}`} fill="none" stroke="white" strokeWidth="1.2"/>

      {/* Jugadoras */}
      {posiciones.map((pos,i)=>{
        const px=pos.x/100*fw+fx;
        const py=pos.y/100*fh+fy;
        const tieneJug=!!pos.nombre;
        const esSel=seleccionada===pos.nombre&&tieneJug;
        const esPend=jugPendiente&&!tieneJug;
        const mins=acum&&tieneJug?Math.floor((acum[pos.nombre]||0)/60):0;
        return(
          <g key={i} style={{cursor:"pointer"}}
            onClick={()=>tieneJug&&onClickJug?onClickJug(pos.nombre):!tieneJug&&onClickSlot&&onClickSlot(i)}
            onMouseDown={()=>tieneJug&&onPressStart&&onPressStart(pos.nombre)}
            onMouseUp={()=>tieneJug&&onPressEnd&&onPressEnd(pos.nombre)}
            onMouseLeave={()=>tieneJug&&onPressEnd&&onPressEnd(pos.nombre)}
            onTouchStart={()=>tieneJug&&onPressStart&&onPressStart(pos.nombre)}
            onTouchEnd={()=>tieneJug&&onPressEnd&&onPressEnd(pos.nombre)}>
            <circle cx={px} cy={py} r={19}
              fill={esSel?"#0D47A1":tieneJug?"rgba(0,0,0,0.55)":esPend?"rgba(100,181,246,0.2)":"rgba(255,255,255,0.08)"}
              stroke={esSel?"#64B5F6":tieneJug?"white":esPend?"#64B5F6":"rgba(255,255,255,0.35)"}
              strokeWidth={esSel?2.5:1.5} strokeDasharray={tieneJug?"":"3 2"}/>
            {tieneJug?(
              <>
                <text x={px} y={py-3} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="system-ui">{pos.nombre.split(" ")[0].slice(0,7)}</text>
                <text x={px} y={py+6} textAnchor="middle" dominantBaseline="middle"
                  fill={modoSetup?"rgba(255,255,255,0.6)":corriendo?"#81C784":"#FFB74D"}
                  fontSize="7" fontFamily="system-ui">{modoSetup?pos.rol:`${mins}'`}</text>
                {/* Indicador tarjeta */}
                {!modoSetup&&tarjetas[pos.nombre]?.length>0&&(()=>{
                  const last=tarjetas[pos.nombre][tarjetas[pos.nombre].length-1];
                  return<rect x={px+10} y={py-24} width={9} height={12} rx={1.5}
                    fill={last.tipo==="amarilla"?"#eab308":"#22c55e"} stroke="white" strokeWidth="0.5"/>;
                })()}
              </>
            ):(
              <text x={px} y={py} textAnchor="middle" dominantBaseline="middle"
                fill={esPend?"#64B5F6":"rgba(255,255,255,0.35)"} fontSize="7.5" fontFamily="system-ui">{pos.rol}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}


function StaffMinutosTracker({onVolver,rival,sistema,posicionesIniciales,banco:bancoInicial,onGuardar}){
  const CUARTOS=4;
  const DURACION=15*60;
  const [cuarto,setCuarto]=useState(1);
  const [corriendo,setCorriendo]=useState(false);
  const [segCuarto,setSegCuarto]=useState(0);
  const [posiciones,setPosiciones]=useState(posicionesIniciales);// [{nombre,x,y,rol}]
  const [banco,setBanco]=useState(bancoInicial);
  const [acum,setAcum]=useState(()=>{const a={};[...posicionesIniciales.map(p=>p.nombre),...bancoInicial].forEach(j=>j&&(a[j]=0));return a;});
  const [historial,setHistorial]=useState([]);
  const [selCancha,setSelCancha]=useState(null);// nombre jugadora seleccionada en cancha
  const [cuartosData,setCuartosData]=useState({});
  const [finalizado,setFinalizado]=useState(false);
  const [confirmFin,setConfirmFin]=useState(false);
  const [saving,setSaving]=useState(false);

  const enCanchaNames=posiciones.map(p=>p.nombre).filter(Boolean);
  const lastVisibleRef=React.useRef(null);

  // Mantener cronómetro corriendo aunque la app quede en segundo plano
  React.useEffect(()=>{
    const handleVisibility=()=>{
      if(document.hidden){
        lastVisibleRef.current=corriendo?Date.now():null;
      } else {
        if(corriendo&&lastVisibleRef.current){
          const elapsed=Math.floor((Date.now()-lastVisibleRef.current)/1000);
          if(elapsed>0){
            setSegCuarto(s=>s+elapsed);
            setAcum(prev=>{
              const n={...prev};
              enCanchaNames.forEach(j=>{n[j]=(n[j]||0)+elapsed;});
              return n;
            });
            setAcumCuarto(prev=>{
              const n={...prev};
              enCanchaNames.forEach(j=>{n[j]=(n[j]||0)+elapsed;});
              return n;
            });
          }
          lastVisibleRef.current=null;
        }
      }
    };
    document.addEventListener("visibilitychange",handleVisibility);
    return()=>document.removeEventListener("visibilitychange",handleVisibility);
  },[corriendo,enCanchaNames.join(",")]);

  const [acumCuarto,setAcumCuarto]=useState(()=>{const a={};[...posicionesIniciales.map(p=>p.nombre),...bancoInicial].forEach(j=>j&&(a[j]=0));return a;});

  React.useEffect(()=>{
    if(!corriendo||finalizado)return;
    const t=setInterval(()=>{
      setSegCuarto(s=>s+1);
      setAcum(prev=>{const n={...prev};enCanchaNames.forEach(j=>{n[j]=(n[j]||0)+1;});return n;});
      setAcumCuarto(prev=>{const n={...prev};enCanchaNames.forEach(j=>{n[j]=(n[j]||0)+1;});return n;});
    },1000);
    return()=>clearInterval(t);
  },[corriendo,enCanchaNames.join(","),finalizado]);

  const finCuarto=()=>{
    setCorriendo(false);
    // Guardar minutos de ESTE cuarto desde acumulador del cuarto
    const mins={};
    posiciones.map(p=>p.nombre).filter(Boolean).forEach(j=>{
      mins[j]=Math.round((acumCuarto[j]||0)/60);
    });
    // También incluir jugadoras del banco que jugaron este cuarto
    banco.forEach(j=>{
      if(acumCuarto[j]>0) mins[j]=Math.round((acumCuarto[j]||0)/60);
    });
    setCuartosData(prev=>({...prev,[cuarto]:mins}));
    if(cuarto<CUARTOS){
      setCuarto(c=>c+1);
      setSegCuarto(0);
      // Resetear acumulador del cuarto
      setAcumCuarto(()=>{const a={};[...posiciones.map(p=>p.nombre),...banco].forEach(j=>j&&(a[j]=0));return a;});
    } else setConfirmFin(true);
  };

  const clickBanco=(jugBanco)=>{
    if(!selCancha)return;
    setPosiciones(prev=>prev.map(p=>p.nombre===selCancha?{...p,nombre:jugBanco}:p));
    setBanco(prev=>prev.map(j=>j===jugBanco?selCancha:j));
    setHistorial(prev=>[...prev,{cuarto,min:Math.floor(segCuarto/60),sale:selCancha,entra:jugBanco}]);
    // La jugadora que entra empieza a acumular desde donde está el cuarto
    setAcumCuarto(prev=>({...prev,[jugBanco]:prev[jugBanco]||0}));
    setSelCancha(null);
  };

  const [menuJug,setMenuJug]=useState(null);
  const [tarjetas,setTarjetas]=useState({});
  const pressTimer=React.useRef(null);

  const aplicarTarjeta=(j,tipo)=>{
    const pen=tipo==="amarilla"?5:2;
    setAcum(prev=>({...prev,[j]:Math.max(0,(prev[j]||0)-pen*60)}));
    setTarjetas(prev=>({...prev,[j]:[...(prev[j]||[]),{tipo,min:Math.floor(segCuarto/60),pen}]}));
    setHistorial(prev=>[...prev,{cuarto,min:Math.floor(segCuarto/60),tarjeta:tipo,jugadora:j}]);
    setMenuJug(null);setSelCancha(null);
  };

  const handlePressStart=(j)=>{
    pressTimer.current=setTimeout(()=>{
      setMenuJug(j);setSelCancha(null);
    },600);
  };
  const handlePressEnd=(j)=>{
    if(pressTimer.current)clearTimeout(pressTimer.current);
  };
  const handleTap=(j)=>{
    if(menuJug){setMenuJug(null);return;}
    // Si hay una seleccionada y se toca otra de cancha → intercambiar posiciones
    if(selCancha&&selCancha!==j&&posiciones.find(p=>p.nombre===j)){
      setPosiciones(prev=>{
        const posA=prev.findIndex(p=>p.nombre===selCancha);
        const posB=prev.findIndex(p=>p.nombre===j);
        if(posA<0||posB<0)return prev;
        const n=[...prev];
        const tmp=n[posA].nombre;
        n[posA]={...n[posA],nombre:n[posB].nombre};
        n[posB]={...n[posB],nombre:tmp};
        return n;
      });
      setHistorial(prev=>[...prev,{cuarto,min:Math.floor(segCuarto/60),cambioPosicion:true,jugA:selCancha,jugB:j}]);
      setSelCancha(null);
      return;
    }
    setSelCancha(selCancha===j?null:j);
  };

  // Reporte editable
  const [reporteEdit,setReporteEdit]=useState(null);// se inicializa al entrar a confirmFin

  // Cuando se activa confirmFin, inicializar reporteEdit con los datos actuales
  React.useEffect(()=>{
    if(confirmFin){
      const r={};
      ALL_JUGADORAS.forEach(j=>{
        const d={c1:cuartosData[1]?.[j]||0,c2:cuartosData[2]?.[j]||0,c3:cuartosData[3]?.[j]||0,c4:cuartosData[4]?.[j]||0};
        d.tot=d.c1+d.c2+d.c3+d.c4;
        r[j]=d;
      });
      setReporteEdit(r);
    }
  },[confirmFin]);

  const updateCell=(j,campo,val)=>{
    setReporteEdit(prev=>{
      const n={...prev,[j]:{...prev[j],[campo]:Number(val)||0}};
      n[j].tot=n[j].c1+n[j].c2+n[j].c3+n[j].c4;
      return n;
    });
  };

  const confirmarFin=async()=>{
    setSaving(true);
    const reporte=reporteEdit||{};
    const params=new URLSearchParams({accion:"minutos",rival,datos:JSON.stringify(reporte)});
    await fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec?"+params.toString(),{method:"GET",mode:"no-cors"}).catch(()=>{});
    setSaving(false);setFinalizado(true);setConfirmFin(false);
    onGuardar(reporte,rival);
  };

  // Reporte preview para pantalla final
  const reportePreview=React.useMemo(()=>{
    const r={};
    ALL_JUGADORAS.forEach(j=>{
      const d={c1:cuartosData[1]?.[j]||0,c2:cuartosData[2]?.[j]||0,c3:cuartosData[3]?.[j]||0,c4:cuartosData[4]?.[j]||0};
      d.tot=d.c1+d.c2+d.c3+d.c4;
      r[j]=d;
    });
    return r;
  },[cuartosData]);

  const pct=Math.min(100,Math.round(segCuarto/DURACION*100));

  if(confirmFin&&reporteEdit){
    const jugConMin=ALL_JUGADORAS.filter(j=>reporteEdit[j]?.tot>0);
    const inputStyle={width:32,background:"#1a2035",border:`1px solid ${T.border2}`,borderRadius:4,color:T.text,fontSize:12,textAlign:"center",padding:"2px 0",fontFamily:"inherit"};
    return(
      <>
        <div style={{textAlign:"center",padding:"12px 0 8px"}}>
          <div style={{fontSize:22,marginBottom:4}}>🏁</div>
          <div style={{color:T.text,fontWeight:700,fontSize:15}}>Revisá y editá antes de guardar</div>
          <div style={{color:T.muted,fontSize:11,marginTop:2}}>vs {rival} · Tocá un valor para editarlo</div>
        </div>
        <Card style={{marginBottom:10}}>
          <CT text="Minutos por cuarto"/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:300}}>
              <TH cols={["Jugadora","C1","C2","C3","C4","Total"]}/>
              <tbody>{jugConMin.map(j=>{
                const d=reporteEdit[j];
                return(<tr key={j}>
                  <td style={{padding:"5px 4px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap",fontSize:11}}>{j.split(" ")[0]}</td>
                  {["c1","c2","c3","c4"].map(k=>(
                    <td key={k} style={{padding:"3px 2px",borderBottom:"1px solid #141824",textAlign:"center"}}>
                      <input type="number" value={d[k]} min={0} max={20}
                        onChange={e=>updateCell(j,k,e.target.value)}
                        style={inputStyle}/>
                    </td>
                  ))}
                  <td style={{padding:"5px 4px",borderBottom:"1px solid #141824",color:T.green,fontWeight:700,textAlign:"center"}}>{d.tot}'</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </Card>
        <button onClick={confirmarFin} disabled={saving} style={{width:"100%",padding:12,background:T.green,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{saving?"Guardando...":"✓ Guardar en Drive"}</button>
      </>
    );
  }

  if(finalizado){
    return(
      <>
        <div style={{textAlign:"center",padding:"20px 0 10px"}}>
          <div style={{fontSize:28,marginBottom:6}}>🏆</div>
          <div style={{color:T.green,fontWeight:700,fontSize:16}}>Partido finalizado</div>
          <div style={{color:T.muted,fontSize:12,marginTop:4}}>vs {rival} — datos guardados en Drive</div>
        </div>
        <Card style={{marginBottom:8}}>
          <CT text="Reporte final — minutos por jugadora"/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:300}}>
              <TH cols={["Jugadora","C1","C2","C3","C4","Total"]}/>
              <tbody>{ALL_JUGADORAS.map(j=>{
                const d=reportePreview[j];
                if(!d||!d.tot)return null;
                return(<tr key={j}>
                  <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap",fontSize:11}}>{j}</td>
                  {[d.c1,d.c2,d.c3,d.c4].map((v,i)=><td key={i} style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:v?T.text:T.muted,textAlign:"center"}}>{v?`${v}'`:"—"}</td>)}
                  <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green,fontWeight:700,textAlign:"center"}}>{d.tot}'</td>
                </tr>);
              })}</tbody>
            </table>
          </div>
        </Card>
        {historial.length>0&&<Card style={{marginBottom:8}}>
          <CT text="Cambios y tarjetas"/>
          {historial.map((h,i)=><div key={i} style={{fontSize:11,color:T.text,padding:"3px 0",borderBottom:"1px solid #141824"}}>
            <span style={{color:T.muted}}>C{h.cuarto} {h.min}'</span>
            {h.tarjeta
              ? <> — <span style={{color:h.tarjeta==="amarilla"?"#eab308":"#22c55e"}}>{h.tarjeta==="amarilla"?"🟡":"🟢"} {h.jugadora?.split(" ")[0]} (-{h.tarjeta==="amarilla"?5:2} min)</span></>
              : h.cambioPosicion
                ? <> — <span style={{color:T.blue}}>↔ {h.jugA?.split(" ")[0]} / {h.jugB?.split(" ")[0]}</span></>
                : <> — <span style={{color:T.red}}>↓{h.sale?.split(" ")[0]}</span> / <span style={{color:T.green}}>↑{h.entra?.split(" ")[0]}</span></>
            }
          </div>)}
        </Card>}
        <button onClick={onVolver} style={{width:"100%",padding:12,background:T.blue,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Volver a Minutos</button>
      </>
    );
  }

  return(
    <>
      {/* Cronómetro */}
      <Card style={{marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div>
            <div style={{fontSize:10,color:T.muted}}>vs {rival} · {sistema}</div>
            <div style={{fontSize:30,fontWeight:700,color:corriendo?T.green:T.amber,fontVariantNumeric:"tabular-nums"}}><TiempoDisplay seg={segCuarto}/></div>
            <div style={{fontSize:11,color:T.muted}}>Q{cuarto}/{CUARTOS} · Restante: <TiempoDisplay seg={Math.max(0,DURACION-segCuarto)}/></div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <div style={{display:"flex",gap:4}}>
              {[1,2,3,4].map(q=><div key={q} style={{width:26,height:26,borderRadius:5,background:q<cuarto?T.green:q===cuarto?"#1a3a5f":"#1e2535",border:`1px solid ${q===cuarto?T.blue:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:q<cuarto?T.green:q===cuarto?T.blue:T.muted,fontWeight:600}}>Q{q}</div>)}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setCorriendo(v=>!v)} style={{padding:"8px 14px",borderRadius:8,border:"none",background:corriendo?T.amber:T.green,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{corriendo?"⏸ Pausa":"▶ Play"}</button>
              <button onClick={finCuarto} style={{padding:"8px 14px",borderRadius:8,border:`1px solid ${T.border}`,background:"transparent",color:T.text,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{cuarto<CUARTOS?`Fin Q${cuarto}`:"🏁 Final"}</button>
            </div>
          </div>
        </div>
        <div style={{marginTop:8,background:"#1e2535",borderRadius:4,height:5}}>
          <div style={{width:`${pct}%`,height:5,borderRadius:4,background:corriendo?T.green:T.amber,transition:"width 1s linear"}}/>
        </div>
      </Card>

      {menuJug&&(
        <div style={{background:"#1a1f2e",border:`1px solid ${T.border2}`,borderRadius:10,padding:12,marginBottom:8,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:12,color:T.text,fontWeight:600,flex:1}}>Tarjeta — {menuJug.split(" ")[0]}</span>
          <button onClick={()=>aplicarTarjeta(menuJug,"verde")} style={{padding:"7px 14px",borderRadius:6,border:"1px solid #22c55e",background:"#0f2d1f",color:"#22c55e",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🟢 -2 min</button>
          <button onClick={()=>aplicarTarjeta(menuJug,"amarilla")} style={{padding:"7px 14px",borderRadius:6,border:"1px solid #eab308",background:"#2d2a0f",color:"#eab308",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🟡 -5 min</button>
          <button onClick={()=>setMenuJug(null)} style={{padding:"7px 10px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
        </div>
      )}

      {/* Cancha */}
      <div style={{marginBottom:8}}>
        {selCancha&&!menuJug&&<div style={{background:"#1a3a5f",border:`1px solid ${T.blue}`,borderRadius:8,padding:"7px 12px",marginBottom:6,fontSize:12,color:T.blue,textAlign:"center"}}>
          <strong>{selCancha.split(" ")[0]}</strong> — tocá otra de <strong>cancha</strong> para cambiar posición, o una del <strong>banco</strong> para sustituir
        </div>}
        <CanchaHockeySVG posiciones={posiciones} acum={acum} corriendo={corriendo}
          seleccionada={selCancha} onClickJug={handleTap}
          onPressStart={handlePressStart} onPressEnd={handlePressEnd}
          tarjetas={tarjetas}/>
      </div>

      {/* Banco */}
      <Card>
        <CT text="Banco"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {banco.map(j=>{
            const mins=Math.floor((acum[j]||0)/60);
            return(
              <div key={j} onClick={()=>selCancha&&clickBanco(j)}
                style={{background:selCancha?"#1a2a1a":"#0d1020",border:`1px solid ${selCancha?T.green:T.border}`,borderRadius:8,padding:"6px 10px",cursor:selCancha?"pointer":"default",textAlign:"center",minWidth:72}}>
                <div style={{fontSize:11,color:T.text,fontWeight:500}}>{j.split(" ")[0]}</div>
                <div style={{fontSize:10,color:T.amber}}>{mins}'</div>
              </div>
            );
          })}
          {banco.length===0&&<div style={{color:T.muted,fontSize:12}}>Sin jugadoras en banco</div>}
        </div>
      </Card>
    </>
  );
}

function StaffMinutos(){
  const [vista,setVista]=useState("reporte");
  const [rival,setRival]=useState("");
  const [sistema,setSistema]=useState("4-4-2");
  const [seleccion,setSeleccion]=useState([]);
  const [posiciones,setPosiciones]=useState([]);
  const [enTracker,setEnTracker]=useState(false);
  const [jugPendiente,setJugPendiente]=useState(null);
  // Hooks del reporte — siempre al inicio
  const [driveData,setDriveData]=useState(null);
  const [loadingDrive,setLoadingDrive]=useState(true);

  React.useEffect(()=>{
    if(vista!=="reporte")return;
    setLoadingDrive(true);
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Minutos App"]||[];
        if(sheet.length<2){setDriveData({partidos:[],jugMap:{}});return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iR=headers.indexOf("Rival"),iJ=headers.indexOf("Jugadora"),iT=headers.indexOf("Total");
        const partidos=[],partSet=new Set();
        const jugMap={};
        sheet.slice(1).forEach(r=>{
          const rival=String(r[iR]||"").trim();
          const jug=String(r[iJ]||"").trim();
          const tot=Number(r[iT])||0;
          if(!rival||!jug||!tot)return;
          if(!partSet.has(rival)){partSet.add(rival);partidos.push(rival);}
          if(!jugMap[jug])jugMap[jug]={};
          jugMap[jug][rival]=(jugMap[jug][rival]||0)+tot;
        });
        setDriveData({partidos,jugMap});
      })
      .catch(()=>setDriveData({partidos:[],jugMap:{}}))
      .finally(()=>setLoadingDrive(false));
  },[vista]);

  const toggleJugadora=j=>{
    setSeleccion(prev=>prev.includes(j)?prev.filter(x=>x!==j):[...prev,j]);
  };

  // Cuando cambia sistema, reiniciar posiciones
  React.useEffect(()=>{
    setPosiciones(SISTEMAS[sistema].map(p=>({...p,nombre:""})));
    setSeleccion([]);
    setJugPendiente(null);
  },[sistema]);

  const clickSlot=(idx)=>{
    const pos=posiciones[idx];
    if(pos.nombre){
      // Deseleccionar jugadora → vuelve al banco
      setSeleccion(prev=>prev.filter(x=>x!==pos.nombre));
      setPosiciones(prev=>prev.map((p,i)=>i===idx?{...p,nombre:""}:p));
    } else if(jugPendiente){
      // Asignar jugadora pendiente al slot
      setPosiciones(prev=>prev.map((p,i)=>i===idx?{...p,nombre:jugPendiente}:p));
      setJugPendiente(null);
    }
  };

  const clickJugadora=(j)=>{
    // Si ya está en cancha, quitarla
    const enCancha=posiciones.find(p=>p.nombre===j);
    if(enCancha){
      setPosiciones(prev=>prev.map(p=>p.nombre===j?{...p,nombre:""}:p));
      setSeleccion(prev=>prev.filter(x=>x!==j));
      setJugPendiente(null);
      return;
    }
    // Si hay slot libre, asignar automáticamente al primer slot libre
    const primerLibre=posiciones.findIndex(p=>!p.nombre);
    if(primerLibre>=0){
      setPosiciones(prev=>prev.map((p,i)=>i===primerLibre?{...p,nombre:j}:p));
      if(!seleccion.includes(j))setSeleccion(prev=>[...prev,j]);
      setJugPendiente(null);
    } else {
      setJugPendiente(jugPendiente===j?null:j);
    }
  };

  const enCanchaCount=posiciones.filter(p=>p.nombre).length;
  const enCanchaNames=posiciones.map(p=>p.nombre).filter(Boolean);
  const banco=seleccion.filter(j=>!enCanchaNames.includes(j));

  if(vista==="tomar"){
    if(enTracker){
      return<StaffMinutosTracker
        onVolver={()=>{setVista("reporte");setEnTracker(false);setSeleccion([]);setRival("");}}
        rival={rival} sistema={sistema}
        posicionesIniciales={posiciones}
        banco={banco}
        onGuardar={()=>{setVista("reporte");setEnTracker(false);setSeleccion([]);setRival("");}}
      />;
    }
    return(
      <>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <button onClick={()=>setVista("reporte")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📊 Reporte</button>
          <button style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"default",fontFamily:"inherit"}}>⏱ Tomar Minutos</button>
        </div>

        {/* Rival + Sistema */}
        <Card style={{marginBottom:8}}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
            <div style={{flex:1,minWidth:120}}>
              <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Rival</div>
              <input value={rival} onChange={e=>setRival(e.target.value)} placeholder="ej: COGS..." style={{background:"#1a2035",border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,padding:"7px 10px",fontSize:13,width:"100%",boxSizing:"border-box",fontFamily:"inherit"}}/>
            </div>
            <div>
              <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Sistema</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {Object.keys(SISTEMAS).map(s=>(
                  <button key={s} onClick={()=>setSistema(s)} style={{padding:"5px 10px",borderRadius:5,border:`1px solid ${sistema===s?T.blue:T.border}`,background:sistema===s?"#1a3a5f":"transparent",color:sistema===s?T.blue:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Cancha interactiva setup */}
        <Card style={{marginBottom:8,padding:8}}>
          <div style={{fontSize:11,color:T.muted,marginBottom:6,textAlign:"center"}}>
            {jugPendiente?<span style={{color:T.blue}}>Tocá un slot en la cancha para ubicar a <strong>{jugPendiente.split(" ")[0]}</strong></span>
            :`Cancha — ${enCanchaCount}/11 ubicadas · Tocá una jugadora del plantel para colocarla`}
          </div>
          <CanchaHockeySVG posiciones={posiciones} modoSetup={true} jugPendiente={jugPendiente}
            onClickSlot={clickSlot} onClickJug={clickJugadora}/>
        </Card>

        {/* Plantel */}
        <Card style={{marginBottom:8}}>
          <CT text="Plantel — tocá para agregar a la cancha o al banco"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {ALL_JUGADORAS.map(j=>{
              const enC=enCanchaNames.includes(j);
              const enB=banco.includes(j);
              const esPend=jugPendiente===j;
              return(
                <button key={j} onClick={()=>{
                  if(enC){clickJugadora(j);}
                  else if(enB){setSeleccion(prev=>prev.filter(x=>x!==j));setJugPendiente(null);}
                  else if(enCanchaCount<11){clickJugadora(j);}
                  else{// cancha llena → agregar al banco
                    if(!seleccion.includes(j))setSeleccion(prev=>[...prev,j]);
                  }
                }}
                  style={{padding:"5px 9px",borderRadius:5,border:`1px solid ${enC?T.green:enB?T.amber:esPend?T.blue:T.border}`,background:enC?"#0f2d1f":enB?"#2d1f0f":esPend?"#1a3a5f":"transparent",color:enC?T.green:enB?T.amber:esPend?T.blue:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                  {j.split(" ")[0]}
                  {enC?" ✓":enB?" B":""}
                </button>
              );
            })}
          </div>
          <div style={{fontSize:10,color:T.muted,marginTop:6}}>Verde ✓ = en cancha · Naranja B = banco · Las 11 primeras van a cancha automáticamente</div>
        </Card>

        <button onClick={()=>{
          if(!rival.trim()){alert("Ingresá el rival");return;}
          if(enCanchaCount<11){alert(`Faltan ${11-enCanchaCount} jugadoras en cancha`);return;}
          setEnTracker(true);
        }} style={{width:"100%",padding:13,background:T.green,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          ▶ Iniciar partido
        </button>
      </>
    );
  }


  const partidos=driveData?.partidos||[];
  const jugMap=driveData?.jugMap||{};
  const jugadoras=Object.keys(jugMap).sort((a,b)=>{
    const totA=Object.values(jugMap[a]).reduce((s,v)=>s+v,0);
    const totB=Object.values(jugMap[b]).reduce((s,v)=>s+v,0);
    return totB-totA;
  });
  const getTot=j=>Object.values(jugMap[j]||{}).reduce((s,v)=>s+v,0);
  const maxTot=jugadoras.length?Math.max(...jugadoras.map(getTot),1):1;

  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.blue}`,background:"#1e3a5f",color:T.blue,fontSize:12,fontWeight:600,cursor:"default",fontFamily:"inherit"}}>📊 Reporte</button>
        <button onClick={()=>setVista("tomar")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>⏱ Tomar Minutos</button>
      </div>
      {loadingDrive?(
        <Card><div style={{color:T.muted,textAlign:"center",padding:20,fontSize:13}}>Cargando minutos desde Drive...</div></Card>
      ):(
        <>
          <MR>
            <MetCard label="Jugadoras" value={jugadoras.length}/>
            <MetCard label="Máx. minutos" value={jugadoras.length?`${maxTot} min`:"—"} sc={T.green}/>
            <MetCard label="Prom. equipo" value={jugadoras.length?`${Math.round(jugadoras.reduce((s,j)=>s+getTot(j),0)/jugadoras.length)} min`:"—"} sub="Total temporada"/>
            <MetCard label="Partidos" value={partidos.length}/>
          </MR>
          <Card>
            <CT text="Minutos de juego por jugadora — en vivo desde Drive"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <TH cols={["Jugadora",...partidos,"Total","Prom."]}/>
                <tbody>{jugadoras.map(j=>{
                  const tot=getTot(j);
                  const col=tot>=200?T.green:tot>=100?T.amber:T.muted;
                  const np=partidos.filter(p=>jugMap[j][p]).length;
                  return(<tr key={j}>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{j}</td>
                    {partidos.map(p=>{
                      const v=jugMap[j][p];
                      return<td key={p} style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:v?T.text:T.muted,textAlign:"center"}}>{v?`${v}'`:"—"}</td>;
                    })}
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:700}}>{tot}'</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{np?`${Math.round(tot/np*10)/10}'`:"—"}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
            <div style={{marginTop:12}}>
              <CT text="Minutos totales — barra"/>
              {jugadoras.map(j=>{
                const tot=getTot(j);
                const col=tot>=200?T.green:tot>=100?T.amber:T.muted;
                return(<div key={j} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                  <span style={{fontSize:11,color:T.text,width:130,flexShrink:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{j.split(" ")[0]}</span>
                  <div style={{flex:1,background:"#1e2535",borderRadius:3,height:8}}><div style={{width:`${Math.round(tot/maxTot*100)}%`,height:8,borderRadius:3,background:col}}/></div>
                  <span style={{fontSize:11,color:col,width:40,textAlign:"right",fontWeight:500}}>{tot}'</span>
                </div>);
              })}
            </div>
          </Card>
        </>
      )}
    </>
  );
}

// ─── STAFF ASISTENCIA ──────────────────────────────────────────────────────────
function StaffAsistencia(){
  const [vista,setVista]=useState("reporte");
  if(vista==="tomar")return <StaffTomarAsistencia onVolver={()=>setVista("reporte")}/>;
  return <StaffAsistenciaReporte onTomar={()=>setVista("tomar")} onFechas={()=>{}}/>;
}
function StaffAsistenciaReporte({onTomar,onFechas}){
  const [rows,setRows]=useState(null);
  const [loading,setLoading]=useState(true);
  const [rawData,setRawData]=useState({});
  const [modal,setModal]=useState(null);

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Asistencias App"]||[];
        if(!sheet.length){setRows([]);setLoading(false);return;}
        const headers=sheet[0].map(h=>String(h));
        const fechaIdx=headers.indexOf("Fecha");
        const jugIdx=headers.indexOf("Jugadora");
        const estIdx=headers.indexOf("Estado");
        const data={};
        sheet.slice(1).forEach(r=>{
          const fecha=String(r[fechaIdx]||"").trim();
          const jug=String(r[jugIdx]||"").trim();
          const est=String(r[estIdx]||"").trim();
          if(!fecha||!jug||!est)return;
          const mes=fecha.slice(0,7);
          if(!data[jug])data[jug]={};
          if(!data[jug][mes])data[jug][mes]={total:0,pres:0,dias:[]};
          data[jug][mes].total++;
          if(est==="P")data[jug][mes].pres++;
          data[jug][mes].dias.push({fecha,est});
        });
        // ordenar días dentro de cada mes
        Object.values(data).forEach(mdata=>Object.values(mdata).forEach(m=>m.dias.sort((a,b)=>a.fecha.localeCompare(b.fecha))));
        setRawData(data);
        // Extraer todas las fechas registradas y pasarlas al padre
        const todasFechas=new Set();
        Object.values(data).forEach(mdata=>Object.values(mdata).forEach(m=>m.dias.forEach(d=>todasFechas.add(d.fecha))));
        if(onFechas)onFechas(todasFechas);
        const result=Object.entries(data).map(([n,mdata])=>{
          const pctMes=m=>{const d=mdata[m];return d&&d.total>0?Math.round(d.pres/d.total*100):null;};
          const mar=pctMes("2026-03");
          const abr=pctMes("2026-04");
          const may=pctMes("2026-05");
          const jun=pctMes("2026-06");
          const vals=[mar,abr,may,jun].filter(v=>v!==null);
          const tot=vals.length?Math.round(vals.reduce((a,v)=>a+v,0)/vals.length):0;
          return {n,mar:mar!==null?mar+"%":"—",abr:abr!==null?abr+"%":"—",may:may!==null?may+"%":"—",jun:jun!==null?jun+"%":"—",tot:tot+"%",pct:tot};
        }).sort((a,b)=>b.pct-a.pct);
        setRows(result);
      })
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[]);

  const MESES=[
    {key:"2026-03",label:"Mar",color:T.green},
    {key:"2026-04",label:"Abr",color:T.amber},
    {key:"2026-05",label:"May",color:T.blue},
    {key:"2026-06",label:"Jun",color:T.cyan||"#06b6d4"},
  ];

  const openModal=(jugadora,mesKey)=>{
    const m=MESES.find(x=>x.key===mesKey);
    if(!m)return;
    const dias=(rawData[jugadora]&&rawData[jugadora][mesKey]&&rawData[jugadora][mesKey].dias)||[];
    if(!dias.length)return;
    setModal({jugadora,mes:mesKey,label:m.label,color:m.color,dias});
  };

  const fmtFecha=f=>{
    // "2026-03-04" → "4 Mar"
    const mnames=["","Ene","Feb","Mar","Apr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const parts=f.split("-");
    return parseInt(parts[2],10)+" "+mnames[parseInt(parts[1],10)];
  };

  return(
    <>
      {/* Modal detalle días */}
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setModal(null)}>
          <div style={{background:"#1a1f2e",border:`1px solid ${modal.color}`,borderRadius:10,padding:20,minWidth:260,maxWidth:340,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div style={{color:modal.color,fontWeight:700,fontSize:13}}>{modal.label}</div>
                <div style={{color:T.text,fontSize:12,marginTop:2}}>{modal.jugadora}</div>
              </div>
              <button onClick={()=>setModal(null)} style={{background:"none",border:"none",color:T.muted,fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {modal.dias.map((d,i)=>{
                const isP=d.est==="P";
                return(
                  <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 10px",borderRadius:6,background:isP?"#0f2d1f":"#2d0f0f",border:`1px solid ${isP?"#1a4a2a":"#4a1a1a"}`}}>
                    <span style={{color:T.text,fontSize:12}}>{fmtFecha(d.fecha)}</span>
                    <span style={{color:isP?T.green:T.red,fontWeight:700,fontSize:12}}>{isP?"✓ Presente":"✗ Ausente"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button onClick={()=>{}} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.blue}`,background:"#1e3a5f",color:T.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📊 Reporte</button>
        <button onClick={onTomar} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.green}`,background:"#0f2d1f",color:T.green,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✓ Tomar Asistencia</button>
      </div>
      {loading&&<Card><div style={{color:T.muted,textAlign:"center",padding:20,fontSize:13}}>Cargando asistencias desde Drive...</div></Card>}
      {!loading&&rows!==null&&(
        <>
          <MR>
            <MetCard label="Prom. asistencia" value={rows.length?Math.round(rows.reduce((a,r)=>a+r.pct,0)/rows.length)+"%":"—"} sub="Total"/>
            <MetCard label="≥80%" value={rows.filter(r=>r.pct>=80).length} sub="Jugadoras"/>
            <MetCard label="<60%" value={rows.filter(r=>r.pct<60).length} sub="Alertas" sc={T.red}/>
          </MR>
          <Card>
            <CT text="REPORTE ASISTENCIA — EN VIVO DESDE DRIVE"/>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr>
                  <th style={{padding:"5px 6px",textAlign:"left",color:T.muted,fontWeight:600,borderBottom:`1px solid ${T.border}`,fontSize:11}}>Jugadora</th>
                  {MESES.map(m=>(
                    <th key={m.key} style={{padding:"5px 6px",textAlign:"center",color:m.color,fontWeight:600,borderBottom:`1px solid ${T.border}`,fontSize:11}}>{m.label}</th>
                  ))}
                  <th style={{padding:"5px 6px",textAlign:"center",color:T.muted,fontWeight:600,borderBottom:`1px solid ${T.border}`,fontSize:11}}>Total</th>
                </tr>
              </thead>
              <tbody>{rows.map((r,i)=>{
                const col=r.pct>=80?T.green:r.pct>=60?T.amber:T.red;
                const mesVals={
                  "2026-03":{val:r.mar,color:T.green},
                  "2026-04":{val:r.abr,color:T.amber},
                  "2026-05":{val:r.may,color:T.blue},
                  "2026-06":{val:r.jun,color:T.cyan||"#06b6d4"},
                };
                return(
                  <tr key={i}>
                    <td style={{padding:"6px 6px",borderBottom:"1px solid #141824",color:T.text,fontWeight:500}}>{r.n}</td>
                    {MESES.map(m=>{
                      const {val,color}=mesVals[m.key];
                      const clickable=val!=="—"&&rawData[r.n]&&rawData[r.n][m.key];
                      return(
                        <td key={m.key} style={{padding:"6px 6px",borderBottom:"1px solid #141824",textAlign:"center"}}>
                          <span
                            onClick={clickable?()=>openModal(r.n,m.key):undefined}
                            style={{color,fontWeight:500,cursor:clickable?"pointer":"default",padding:"2px 6px",borderRadius:4,display:"inline-block",transition:"background 0.15s",background:clickable?"rgba(255,255,255,0.03)":"transparent"}}
                            onMouseEnter={e=>{if(clickable)e.target.style.background="rgba(255,255,255,0.08)";}}
                            onMouseLeave={e=>{if(clickable)e.target.style.background="rgba(255,255,255,0.03)";}}
                          >{val}</span>
                        </td>
                      );
                    })}
                    <td style={{padding:"6px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:700,textAlign:"center"}}>{r.tot}</td>
                  </tr>
                );
              })}</tbody>
            </table>
            <div style={{color:T.muted,fontSize:10,marginTop:8,textAlign:"center"}}>Toca el % de un mes para ver el detalle de días</div>
          </Card>
        </>
      )}
    </>
  );
}


function StaffTomarAsistencia({onVolver}){
  const JUGADORAS=["Alfaro Javiera","Arau María Paz","Carrasco Sofia","Errazu Sofia","Gacitua Emilia","Gomez Camila","Gutierrez Renata","Hevia Valentina","Liu Macarena","Manriquez Fernanda","Martinez Amanda","Mateluna Florencia","Muñoz Constanza","Pareja Camila","Pollmann Marianne","Retamal Antonia","Sepulveda Eileen","Sierra Julieta","Silva Victoria"];
  const [fecha,setFecha]=useState("");
  const [pres,setPres]=useState({});
  const [saving,setSaving]=useState(false);
  const [fechasCargadas,setFechasCargadas]=useState(null);// null=cargando, Set=listo

  // Cargar fechas registradas al montar
  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Asistencias App"]||[];
        const headers=(sheet[0]||[]).map(h=>String(h));
        const fechaIdx=headers.indexOf("Fecha");
        const fechas=new Set();
        sheet.slice(1).forEach(r=>{
          const f=String(r[fechaIdx]||"").trim().slice(0,10);
          if(f)fechas.add(f);
        });
        setFechasCargadas(fechas);
        console.log("Fechas en Drive:", [...fechas].slice(0,5));
        console.log("Total fechas:", fechas.size);
      })
      .catch(()=>setFechasCargadas(new Set()));
  },[]);

  const cargando=fechasCargadas===null;
  const yaRegistrada=fecha&&fechasCargadas&&fechasCargadas.has(fecha);
  const listaVisible=!cargando&&fecha&&!yaRegistrada;

  const toggle=j=>setPres(p=>{const n={...p};n[j]=n[j]===1?0:n[j]===0?null:1;return n;});
  const marcarTodas=v=>{const n={};JUGADORAS.forEach(j=>n[j]=v);setPres(n);};
  const col=j=>pres[j]===1?"#3ecf7a":pres[j]===0?"#e05555":T.muted;
  const lbl=j=>pres[j]===1?"P":pres[j]===0?"A":"—";
  const guardar=async()=>{
    setSaving(true);
    const datos=JSON.stringify(JUGADORAS.map(j=>({jugadora:j,estado:pres[j]===1?"P":pres[j]===0?"A":""})));
    const params=new URLSearchParams({accion:"asistencia",fecha,datos});
    await fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec?"+params.toString(),{method:"GET",mode:"no-cors"}).catch(()=>{});
    setSaving(false);
    setFechasCargadas(prev=>new Set([...(prev||[]),fecha]));
  };

  return(
    <>
      <button onClick={onVolver} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>← Volver al Reporte</button>
      <Card style={{marginBottom:10}}>
        <CT text="TOMAR ASISTENCIA"/>
        <div style={{display:"flex",gap:8,alignItems:"flex-end",marginBottom:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Fecha</div>
            <input type="date" value={fecha} onChange={e=>{setFecha(e.target.value);setPres({});}}
              style={{background:"#1a2035",border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:"inherit",colorScheme:"dark"}}/>
          </div>
          {listaVisible&&<>
            <button onClick={()=>marcarTodas(1)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid #3ecf7a",background:"#0f2d1f",color:"#3ecf7a",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓ Todas P</button>
            <button onClick={()=>marcarTodas(0)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid #e05555",background:"#2d0f0f",color:"#e05555",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✗ Todas A</button>
            <button onClick={()=>setPres({})} style={{padding:"6px 10px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reset</button>
          </>}
        </div>
        {cargando?(
          <div style={{color:T.muted,textAlign:"center",padding:24,fontSize:13}}>Cargando...</div>
        ):!fecha?(
          <div style={{color:T.muted,textAlign:"center",padding:24,fontSize:13}}>Seleccioná una fecha para continuar</div>
        ):yaRegistrada?(
          <div style={{background:"#0f2d1f",border:"1px solid #1a4a2a",borderRadius:8,padding:"16px 20px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:6}}>✓</div>
            <div style={{color:T.green,fontWeight:600,fontSize:14}}>Asistencia ya registrada</div>
            <div style={{color:T.muted,fontSize:12,marginTop:4}}>La asistencia del {fecha} ya fue cargada en Drive.</div>
          </div>
        ):(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <tbody>{JUGADORAS.map((j,i)=>(
              <tr key={i} onClick={()=>toggle(j)} style={{cursor:"pointer",background:pres[j]===1?"#0f2d1f33":pres[j]===0?"#2d0f0f33":"transparent"}}>
                <td style={{padding:"9px 8px",borderBottom:`1px solid ${T.border}`,color:T.text,fontWeight:500,fontSize:13}}>{j}</td>
                <td style={{padding:"9px 8px",borderBottom:`1px solid ${T.border}`,textAlign:"right"}}>
                  <span style={{fontSize:18,fontWeight:800,color:col(j)}}>{lbl(j)}</span>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
      {listaVisible&&(
        <button onClick={guardar} disabled={saving}
          style={{width:"100%",padding:"13px",background:saving?"#1a3a5f":T.blue,border:"none",borderRadius:8,
            color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          {saving?"Guardando...":"Guardar Asistencia"}
        </button>
      )}
    </>
  );
}

function StaffRPE(){
  const [rows,setRows]=React.useState([]);
  const [loading,setLoading]=React.useState(true);
  const [openDate,setOpenDate]=React.useState(null);
  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["RPE y Wellness"]||[];
        const headers=sheet[0]||[];
        const rpeRows=sheet.slice(1)
          .filter(r=>{const ti=headers.indexOf("Tipo");return r[ti]==="RPE";})
          .map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]])))
          .sort((a,b)=>new Date(b.Timestamp)-new Date(a.Timestamp));
        setRows(rpeRows);
      })
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[]);

  const rpeCol=n=>n>=8?"#e05555":n>=5?"#e09020":n>=1?"#3ecf7a":"#aaa";

  const fmtF=f=>{
    const s=String(f||"").split("T")[0];
    const p=s.split("-");
    if(p.length<3)return s||"";
    return p[0].length===4
      ? p[2].padStart(2,"0")+"/"+p[1].padStart(2,"0")
      : p[0].padStart(2,"0")+"/"+p[1].padStart(2,"0");
  };

  const hoy=(()=>{const d=new Date();return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0");})();

  const groupBy=arr=>{
    const map={};
    arr.forEach(r=>{const k=fmtF(r.Fecha);if(!map[k])map[k]=[];map[k].push(r);});
    return map;
  };

  const allByDate=groupBy(rows);
  const todayRows=allByDate[hoy]||[];
  const pastDates=Object.keys(allByDate).filter(d=>d!==hoy);
  const alertsHoy=todayRows.filter(r=>+r.RPE>=8);

  const RPETable=({recs})=>(
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <TH cols={["Jugadora","RPE"]}/>
      <tbody>{recs.map((r,i)=>(
        <tr key={i}>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{r.Jugadora}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:rpeCol(+r.RPE),fontWeight:700,textAlign:"center",fontSize:14}}>{r.RPE}</td>
        </tr>
      ))}</tbody>
    </table>
  );

  return(
    <>
      {/* ALERTAS HOY */}
      {alertsHoy.length>0&&(
        <Card style={{marginBottom:10,border:"1px solid #5a1f1f",background:"#1a0a0a"}}>
          <CT text={"⚠ ALERTAS RPE — "+hoy}/>
          {alertsHoy.map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0"}}>
              <span style={{color:T.text,fontSize:12,fontWeight:500}}>{r.Jugadora}</span>
              <span style={{color:T.red,fontSize:12,fontWeight:700}}>RPE {r.RPE}</span>
            </div>
          ))}
        </Card>
      )}

      {/* HOY */}
      <Card style={{marginBottom:10}}>
        <CT text={loading?"Cargando...":"REGISTROS RPE HOY — "+hoy}/>
        {loading&&<div style={{color:T.muted,fontSize:12,textAlign:"center",padding:10}}>Cargando...</div>}
        {!loading&&todayRows.length===0&&<div style={{color:T.muted,fontSize:12,textAlign:"center",padding:10}}>Sin registros hoy</div>}
        {!loading&&todayRows.length>0&&<RPETable recs={todayRows}/>}
      </Card>

      {/* FECHAS ANTERIORES */}
      {!loading&&pastDates.length>0&&(
        <Card>
          <CT text="FECHAS ANTERIORES"/>
          {pastDates.map(fecha=>(
            <div key={fecha} style={{borderBottom:"1px solid #1e2535"}}>
              <div onClick={()=>setOpenDate(openDate===fecha?null:fecha)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 4px",cursor:"pointer"}}>
                <span style={{color:T.blue,fontSize:13,fontWeight:600}}>{fecha}</span>
                <span style={{color:T.muted,fontSize:12}}>{openDate===fecha?"▲":"▼"}</span>
              </div>
              {openDate===fecha&&(
                <div style={{paddingBottom:8}}>
                  {allByDate[fecha].some(r=>+r.RPE>=8)&&(
                    <div style={{background:"#1a0a0a",borderRadius:6,padding:"6px 8px",marginBottom:6}}>
                      <div style={{fontSize:10,color:T.red,fontWeight:700,marginBottom:4}}>⚠ ALERTAS RPE ≥ 8</div>
                      {allByDate[fecha].filter(r=>+r.RPE>=8).map((r,i)=>(
                        <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"2px 0"}}>
                          <span style={{color:T.text,fontSize:12}}>{r.Jugadora}</span>
                          <span style={{color:T.red,fontSize:12,fontWeight:700}}>RPE {r.RPE}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <RPETable recs={allByDate[fecha]}/>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

function StaffWellness(){
  const [rows,setRows]=React.useState([]);
  const [loading,setLoading]=React.useState(true);
  const [openDate,setOpenDate]=React.useState(null);
  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["RPE y Wellness"]||[];
        const headers=sheet[0]||[];
        const wRows=sheet.slice(1)
          .filter(r=>{const ti=headers.indexOf("Tipo");return r[ti]==="Wellness";})
          .map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]])))
          .sort((a,b)=>new Date(b.Timestamp)-new Date(a.Timestamp));
        setRows(wRows);
      })
      .catch(()=>setRows([]))
      .finally(()=>setLoading(false));
  },[]);

  const wColor=v=>+v<=2?"#e05555":+v===3?"#e09020":"#3ecf7a";

  // Fecha "2026-05-25" o "25-05-2026" → "25/05"
  const fmtF=f=>{
    const s=String(f||"").split("T")[0]; // quita la hora si hay
    const p=s.split("-");
    if(p.length<3)return s||"";
    return p[0].length===4
      ? p[2].padStart(2,"0")+"/"+p[1].padStart(2,"0")
      : p[0].padStart(2,"0")+"/"+p[1].padStart(2,"0");
  };

  // Fecha hoy en formato "dd/mm"
  const hoy=(()=>{const d=new Date();return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0");})();

  // Agrupar por fecha formateada
  const groupBy=arr=>{
    const map={};
    arr.forEach(r=>{const k=fmtF(r.Fecha);if(!map[k])map[k]=[];map[k].push(r);});
    return map;
  };

  const allByDate=groupBy(rows);
  const todayRows=allByDate[hoy]||[];
  const pastDates=Object.keys(allByDate).filter(d=>d!==hoy);

  const alertsHoy=todayRows.filter(r=>+r["Calidad Sueño"]<=2||+r.Fatiga<=2||+r["Dolor Muscular"]<=2||+r["Estrés"]<=2||+r["Ánimo"]<=2);

  const AlertRow=({r})=>{
    const al=[];
    if(+r["Calidad Sueño"]<=2)al.push("Sueño↓");
    if(+r.Fatiga<=2)al.push("Fatiga↓");
    if(+r["Dolor Muscular"]<=2)al.push("Dolor↓");
    if(+r["Estrés"]<=2)al.push("Estrés↑");
    if(+r["Ánimo"]<=2)al.push("Ánimo↓");
    if(!al.length)return null;
    return(
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0"}}>
        <span style={{color:T.text,fontSize:12,fontWeight:500}}>{r.Jugadora}</span>
        <div style={{display:"flex",gap:6}}>
          {al.map((a,j)=><span key={j} style={{color:T.red,fontSize:11,fontWeight:600}}>{a}</span>)}
        </div>
      </div>
    );
  };

  const WellnessCard=({r})=>null;// unused
  const WellnessTable=({recs})=>(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,minWidth:480}}>
        <thead><tr>
          {["Jugadora","Sueño","Horas","Fatiga","Dolor","Zona","Estrés","Ánimo"].map((c,i)=>(
            <th key={i} style={{textAlign:i===0?"left":"center",fontWeight:500,fontSize:10,color:T.muted,padding:"5px 6px",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:".4px",whiteSpace:"nowrap",...(i===0?{position:"sticky",left:0,background:T.surf,zIndex:2}:{})}}>{c}</th>
          ))}
        </tr></thead>
        <tbody>{recs.map((r,i)=>(
          <tr key={i}>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap",position:"sticky",left:0,background:T.surf,zIndex:1}}>{r.Jugadora}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Calidad Sueño"]),fontWeight:600,textAlign:"center"}}>{r["Calidad Sueño"]}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted,textAlign:"center"}}>{r["Horas Sueño"]}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r.Fatiga),fontWeight:600,textAlign:"center"}}>{r.Fatiga}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Dolor Muscular"]),fontWeight:600,textAlign:"center"}}>{r["Dolor Muscular"]}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted,fontSize:11,whiteSpace:"nowrap"}}>{r["Zonas Dolor"]||"—"}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Estrés"]),fontWeight:600,textAlign:"center"}}>{r["Estrés"]}</td>
            <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Ánimo"]),fontWeight:600,textAlign:"center"}}>{r["Ánimo"]}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );

  return(
    <>
      {/* ALERTAS HOY */}
      {alertsHoy.length>0&&(
        <Card style={{marginBottom:10,border:"1px solid #5a1f1f",background:"#1a0a0a"}}>
          <CT text={"⚠ ALERTAS WELLNESS — "+hoy}/>
          {alertsHoy.map((r,i)=><AlertRow key={i} r={r}/>)}
        </Card>
      )}

      {/* REGISTROS HOY */}
      <Card style={{marginBottom:10}}>
        <CT text={loading?"Cargando...":"REGISTROS HOY — "+hoy}/>
        {loading&&<div style={{color:T.muted,fontSize:12,textAlign:"center",padding:10}}>Cargando...</div>}
        {!loading&&todayRows.length===0&&<div style={{color:T.muted,fontSize:12,textAlign:"center",padding:10}}>Sin registros hoy</div>}
        {!loading&&todayRows.length>0&&<WellnessTable recs={todayRows}/>}
      </Card>

      {/* FECHAS ANTERIORES — acordeón */}
      {!loading&&pastDates.length>0&&(
        <Card>
          <CT text="FECHAS ANTERIORES"/>
          {pastDates.map(fecha=>(
            <div key={fecha} style={{borderBottom:"1px solid #1e2535"}}>
              <div
                onClick={()=>setOpenDate(openDate===fecha?null:fecha)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 4px",cursor:"pointer"}}
              >
                <span style={{color:T.blue,fontSize:13,fontWeight:600}}>{fecha}</span>
                <span style={{color:T.muted,fontSize:12}}>{openDate===fecha?"▲":"▼"}</span>
              </div>
              {openDate===fecha&&(
                <div style={{paddingBottom:8}}>
                  {/* Alertas de esa fecha */}
                  {allByDate[fecha].some(r=>+r["Calidad Sueño"]<=2||+r.Fatiga<=2||+r["Estrés"]<=2||+r["Ánimo"]<=2)&&(
                    <div style={{background:"#1a0a0a",borderRadius:6,padding:"6px 8px",marginBottom:6}}>
                      <div style={{fontSize:10,color:T.red,fontWeight:700,marginBottom:4}}>⚠ ALERTAS</div>
                      {allByDate[fecha].map((r,i)=><AlertRow key={i} r={r}/>)}
                    </div>
                  )}
                  <WellnessTable recs={allByDate[fecha]}/>
                </div>
              )}
            </div>
          ))}
        </Card>
      )}
    </>
  );
}

function RadarChart({player,sesion}){
  const puestos=usePuestos();
  if(!sesion||sesion.jugadoras.length<2)return null;
  const jd=sesion.jugadoras.find(j=>j.n===player);
  if(!jd)return null;
  const labs=["Dist","m/min","HSR","ACC","N Spr"];
  const jV=[jd.dist||0,jd.mxm||0,jd.hsr||jd.ai15||0,jd.acc||0,jd.ns||0];
  const gA=k=>sesion.jugadoras.reduce((s,j)=>s+(j[k]||0),0)/sesion.jugadoras.length;
  const tV=[gA("dist"),gA("mxm"),gA("hsr")||gA("ai15")||0,gA("acc"),gA("ns")||0];
  const yoyoData=YOYO.find(y=>y.n===player);
  const puestoRow=yoyoData?puestos.find(p=>p.p===yoyoData.puesto):null;
  const pV=puestoRow?[puestoRow.dist,puestoRow.mxm||0,puestoRow.hsr,puestoRow.acc,puestoRow.ns||0]:null;
  const mx=jV.map((v,i)=>Math.max(v,tV[i],pV?pV[i]:0,0.1));
  const nr=arr=>arr.map((v,i)=>Math.min(v/mx[i],1.4));
  const jN=nr(jV);const tN=nr(tV);const pN=pV?nr(pV):null;
  const cx=110,cy=110,r=85,n=5;
  const ag=i=>(Math.PI*2*i/n)-Math.PI/2;
  const pt=(v,i)=>`${cx+v*r*Math.cos(ag(i))},${cy+v*r*Math.sin(ag(i))}`;
  const poly=(nm,col)=>`<polygon points="${nm.map((v,i)=>pt(v,i)).join(" ")}" fill="${col}33" stroke="${col}" stroke-width="2"/>`;
  const spokes=Array.from({length:n},(_,i)=>`<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(ag(i))}" y2="${cy+r*Math.sin(ag(i))}" stroke="#2a3550" stroke-width="1"/>`).join("");
  const rings=[.33,.67,1].map(v=>`<polygon points="${Array.from({length:n},(_,i)=>pt(v,i)).join(" ")}" fill="none" stroke="#1e2535" stroke-width="1"/>`).join("");
  const lbl=labs.map((l,i)=>{const x=cx+(r+16)*Math.cos(ag(i));const y=cy+(r+16)*Math.sin(ag(i));return`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="${jN[i]>=tN[i]?"#3ecf7a":"#6a7490"}">${l}</text>`;}).join("");
  const dots=jN.map((v,i)=>`<circle cx="${cx+v*r*Math.cos(ag(i))}" cy="${cy+v*r*Math.sin(ag(i))}" r="4" fill="#3ecf7a"/>`).join("");
  const svg=`<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">${rings}${spokes}${pN?poly(pN,"#e09020"):""}${poly(tN,"#4a90e8")}${poly(jN,"#3ecf7a")}${dots}${lbl}</svg>`;
  return(
    <Card style={{marginBottom:12}}>
      <CT text={`Radar — ${player.split(" ")[0]} vs equipo${puestoRow?" vs "+puestoRow.p:""}`}/>
      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{width:200,flexShrink:0}} dangerouslySetInnerHTML={{__html:svg}}/>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}><div style={{width:14,height:3,background:"#3ecf7a",borderRadius:2}}/><span style={{color:T.muted2,fontSize:11}}>{player.split(" ")[0]}</span></div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}><div style={{width:14,height:3,background:T.blue,borderRadius:2}}/><span style={{color:T.muted2,fontSize:11}}>Prom. equipo</span></div>
          {puestoRow&&<div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><div style={{width:14,height:3,background:T.amber,borderRadius:2}}/><span style={{color:T.muted2,fontSize:11}}>Prom. {puestoRow.p}</span></div>}
          {labs.map((l,i)=>{const d=Math.round((jN[i]-tN[i])*100);return(<div key={l} style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:3}}><span style={{color:T.muted,fontSize:11}}>{l}</span><span style={{color:d>0?T.green:d<0?T.red:T.muted,fontSize:11,fontWeight:600}}>{d>0?"+":""}{d}%</span></div>);})}
        </div>
      </div>
    </Card>
  );
}

function PlayerGPS({player}){
  const {partidos:P=[],amistosos:A=[],entrenos:E=[]}=useGPS();
  const PARTIDOS=P.length?P:PARTIDOS_FB;
  const AMISTOSOS=A;
  const ENTRENOS=E;
  const initTipo=(()=>{
    if(PARTIDOS.some(s=>s.jugadoras.find(j=>j.n===player)))return"partidos";
    if(AMISTOSOS.some(s=>s.jugadoras.find(j=>j.n===player)))return"amistosos";
    if(ENTRENOS.some(s=>s.jugadoras.find(j=>j.n===player)))return"entrenos";
    return"partidos";
  })();
  const [tipo,setTipo]=useState("partidos");
  const [selId,setSelId]=useState(null);
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess(PARTIDOS,AMISTOSOS,ENTRENOS);
  const sess=mySess(player,pool);
  if(!sess.length)return<div style={{color:T.muted,padding:20,textAlign:"center"}}>Sin datos GPS en esta selección</div>;
  return(
    <>
      {fbtn(tipo,(t)=>{setTipo(t);setSelId(null);},[["partidos","🏑 Partidos"],["amistosos","⚡ Amistosos"],["entrenos","🏃 Entrenos"],["todos","Todo"]])}
      <MR>
        <MetCard label="Dist. prom." value={`${Math.round(avg(sess.map(s=>s.data.dist))).toLocaleString()}m`}/>
        <MetCard label="Sesiones" value={sess.length}/>
        <MetCard label="Vel. máx" value={`${Math.max(...sess.map(s=>s.data.vmax))} km/h`} sc={T.amber}/>
      </MR>
      
      {/* Gráfico HSR por zonas — todas las sesiones */}
      {/* Selector de sesión — igual que Staff */}
      {sess.length>0&&(
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          <button onClick={()=>setSelId(null)} style={{padding:"3px 10px",borderRadius:5,border:`1px solid ${!selId?T.green:T.border}`,background:!selId?"#0f2d1f":"transparent",color:!selId?T.green:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Todas</button>
          {sess.map(s=>(
            <button key={s.id} onClick={()=>setSelId(s.id)} style={{padding:"3px 10px",borderRadius:5,border:`1px solid ${selId===s.id?T.green:T.border}`,background:selId===s.id?"#0f2d1f":"transparent",color:selId===s.id?T.green:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{s.label}</button>
          ))}
        </div>
      )}
      {sess.length>0&&(()=>{
        const sessConDatos=(selId?sess.filter(s=>s.id===selId):sess).filter(s=>s.jugadoras?.find(j=>j.n===player));
        if(!sessConDatos.length)return null;
        const vals=sessConDatos.map(s=>{
          const jd=s.jugadoras.find(j=>j.n===player);
          if(!jd)return{h15:0,h18:0,spr:0};
          const {h15,h18,sp}=calcZonas(jd,s);
          return{h15,h18,spr:sp};
        });
        const mx=Math.max(...vals.map(v=>v.h15+v.h18+v.spr),1);
        return(
          <Card style={{marginBottom:10}}>
            <CT text={`HSR por zonas — ${player.split(" ")[0]}`}/>
            {hsrLegend}
            {sessConDatos.map((s,i)=>{
              const {h15,h18,spr}=vals[i];
              const tot=h15+h18+spr;
              return(
                <div key={s.id} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:11,color:T.muted2}}>{sIcon(s.tipo)} {s.label}</span>
                    <div style={{display:"flex",gap:8}}>
                      <span style={{color:T.green,fontSize:10}}>{h15}m</span>
                      <span style={{color:T.amber,fontSize:10}}>{h18}m</span>
                      <span style={{color:spr>0?T.red:T.muted,fontSize:10,fontWeight:spr>0?700:400}}>{spr}m</span>
                      <span style={{color:T.muted,fontSize:10}}>{tot}m</span>
                    </div>
                  </div>
                  <HsrBar h15={h15} h18={h18} spr={spr} mx={mx}/>
                </div>
              );
            })}
          </Card>
        );
      })()}
      <Card style={{marginBottom:10}}>
        <CT text="Detalle por sesión"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead><tr>{(selId?["Jugadora","Min","Dist.","m/min","15-18","18-21",">21","ACC","DSC","N Spr","V.máx"]:["Sesión","Min","Dist.","m/min","15-18","18-21",">21","ACC","DSC","N Spr","V.máx"]).map((c,i)=><th key={i} style={{textAlign:i===0?"left":"center",fontWeight:500,fontSize:10,color:T.muted,padding:"5px 6px",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:".4px",whiteSpace:"nowrap"}}>{c}</th>)}</tr></thead>
            <tbody>{selId?(
              (()=>{
                const selSess=sess.find(s=>s.id===selId);
                if(!selSess)return null;
                return [...selSess.jugadoras].sort((a,b)=>b.dist-a.dist).map(j=>{
                  const isMe=j.n===player;
                  const selSessData=selSess;
                  const {h15,h18,sp}=calcZonas(j,selSessData);
                  return(
                    <tr key={j.n} style={{background:isMe?"#0d1f35":"transparent"}}>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:isMe?T.blue:T.text,fontWeight:isMe?700:400,whiteSpace:"nowrap"}}>{isMe?"▶ ":""}{j.n.split(" ")[0]}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted,textAlign:"center"}}>{j.min}'</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:isMe?T.blue:T.text,fontWeight:isMe?600:400,textAlign:"center"}}>{j.dist.toLocaleString()}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2,textAlign:"center"}}>{j.mxm}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green,textAlign:"center"}}>{h15}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,textAlign:"center"}}>{h18}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400,textAlign:"center"}}>{sp}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple,textAlign:"center"}}>{j.acc||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan,textAlign:"center"}}>{j.dsc||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:(j.ns||0)>0?T.text:T.muted,fontWeight:(j.ns||0)>0?600:400,textAlign:"center"}}>{j.ns||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500,textAlign:"center"}}>{j.vmax}</td>
                    </tr>
                  );
                });
              })()
            ):(
              sess.map(s=>{
                const jd=s.jugadoras?.find(j=>j.n===player);
                if(!jd) return null;
                const {h15,h18,sp}=calcZonas(jd,s);
                return(
                  <tr key={s.id}>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{sIcon(s.tipo)} {s.label}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted,textAlign:"center"}}>{s.data.min}'</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500,textAlign:"center"}}>{s.data.dist.toLocaleString()}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2,textAlign:"center"}}>{s.data.mxm}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green,textAlign:"center"}}>{h15}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,textAlign:"center"}}>{h18}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400,textAlign:"center"}}>{sp}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple,textAlign:"center"}}>{s.data.acc||0}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan,textAlign:"center"}}>{s.data.dsc||0}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:(s.data.ns||0)>0?T.text:T.muted,fontWeight:(s.data.ns||0)>0?600:400,textAlign:"center"}}>{s.data.ns||0}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500,textAlign:"center"}}>{s.data.vmax}</td>
                  </tr>
                );
              })
            )}</tbody>
          </table>
        </div>
      </Card>
      {/* Promedio equipo de la sesión seleccionada */}
      {selId&&(()=>{
        const selSessObj=sess.find(s=>s.id===selId);
        if(!selSessObj||!selSessObj.jugadoras||!selSessObj.jugadoras.length)return null;
        const jugs=selSessObj.jugadoras;
        const n=jugs.length;
        const avg=k=>Math.round(jugs.reduce((a,j)=>a+(j[k]||0),0)/n);
        const avgf=k=>Math.round(jugs.reduce((a,j)=>a+(j[k]||0),0)/n*10)/10;
        const dist=avg("dist");
        const mxm=dist&&avgf("min")>0?Math.round(dist/avgf("min")*10)/10:avgf("mxm");
        const tots=jugs.map(j=>calcZonas(j,selSessObj));
        const h15=Math.round(tots.reduce((a,z)=>a+z.h15,0)/n);
        const h18=Math.round(tots.reduce((a,z)=>a+z.h18,0)/n);
        const spr=Math.round(tots.reduce((a,z)=>a+z.sp,0)/n);
        const acc=avg("acc");
        const dsc=avg("dsc");
        const ns=avg("ns");
        const vmax=avgf("vmax");
        return(
          <Card style={{border:`1px solid ${T.border2}`,background:"#0d1020",marginBottom:10}}>
            <CT text="Promedio equipo"/>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:12}}>
              {[
                ["Dist.",`${dist.toLocaleString()}m`,T.blue],
                ["m/min",mxm,T.muted2],
                ["15-18",`${h15}m`,T.green],
                ["18-21",`${h18}m`,T.amber],
                [">21",`${spr}m`,T.red],
                ["ACC",acc,T.purple],
                ["DSC",dsc,T.cyan],
                ["N Spr",ns,"#06b6d4"],
                ["Vmáx",`${vmax}km/h`,"#e879f9"]
              ].map(([l,v,c])=>(
                <div key={l} style={{textAlign:"center",minWidth:55}}>
                  <div style={{fontSize:9,color:T.muted,marginBottom:2}}>{l}</div>
                  <div style={{fontSize:14,fontWeight:600,color:c}}>{v}</div>
                </div>
              ))}
            </div>
          </Card>
        );
      })()}
      {/* Radar */}
      {sess.length>0&&(
        <RadarChart player={player} sesion={selId?sess.find(s=>s.id===selId)||sess[0]:sess[0]}/>
      )}
    </>
  );
}

// ─── PLAYER YO-YO ─────────────────────────────────────────────────────────────
function PlayerEvaluaciones({player}){
  const [subTab,setSubTab]=useState("yoyo");
  return(
    <>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={()=>setSubTab("yoyo")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${subTab==="yoyo"?T.blue:T.border}`,background:subTab==="yoyo"?"#1a3a5f":"transparent",color:subTab==="yoyo"?T.blue:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🏃 Yo-Yo</button>
        <button onClick={()=>setSubTab("cargas")} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${subTab==="cargas"?T.amber:T.border}`,background:subTab==="cargas"?"#2d2a0f":"transparent",color:subTab==="cargas"?T.amber:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🏋️ Cargas</button>
      </div>
      {subTab==="yoyo"?<PlayerYoyo player={player}/>:<PlayerCargas player={player}/>}
    </>
  );
}

function PlayerYoyo({player}){
  const [loading,setLoading]=useState(true);
  const [myData,setMyData]=useState(null);// último resultado
  const [allData,setAllData]=useState([]);// todos los jugadores (último test)
  const [historial,setHistorial]=useState([]);// historial de tests de este jugador

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["YOYO App"]||d["Yoyo App"]||[];
        if(sheet.length<2){setLoading(false);return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iF=headers.indexOf("Fecha"),iJ=headers.indexOf("Jugadora"),iN=headers.indexOf("Nivel"),iD=headers.indexOf("Distancia"),iV=headers.indexOf("VAM");
        // Agrupar por jugadora → último test
        const lastByJug={};
        const histByJug={};
        sheet.slice(1).forEach(r=>{
          const fecha=String(r[iF]||"").slice(0,10);
          const jug=String(r[iJ]||"").trim();
          const nivel=parseFloat(r[iN])||0;
          const dist=Number(r[iD])||0;
          const rawVam=parseFloat(r[iV])||0;
          const vam=dist>0?Math.round(((dist*0.0024)+10.4)/3.6*10)/10:Math.round(rawVam*10)/10;
          if(!jug||!nivel)return;
          if(!histByJug[jug])histByJug[jug]=[];
          histByJug[jug].push({fecha,nivel,dist,vam});
          if(!lastByJug[jug]||fecha>lastByJug[jug].fecha)
            lastByJug[jug]={fecha,nivel,dist,vam};
        });
        // Recalcular VAM con Bangsbo por si acaso
        const jugadoras=Object.entries(lastByJug).map(([n,d])=>({n,...d}))
          .sort((a,b)=>b.nivel-a.nivel);
        setAllData(jugadoras);
        setMyData(lastByJug[player]||null);
        setHistorial((histByJug[player]||[]).sort((a,b)=>a.fecha.localeCompare(b.fecha)));
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[player]);

  if(loading)return<Card><div style={{color:T.muted,textAlign:"center",padding:20}}>Cargando datos Yo-Yo...</div></Card>;
  if(!myData)return<div style={{color:T.muted,padding:20,textAlign:"center",fontSize:12}}>Sin datos Yo-Yo para {player}</div>;

  const PALETTE=["#64B5F6","#f472b6","#a78bfa","#06b6d4","#e879f9","#38bdf8","#818cf8","#c084fc"];
  const vams=[...new Set(allData.map(p=>p.vam).filter(Boolean))].sort((a,b)=>b-a);
  const vamGrupo={};
  vams.forEach((v,i)=>{vamGrupo[v]={num:i+1,color:PALETTE[i%PALETTE.length]};});

  const myRank=allData.findIndex(p=>p.n===player)+1;
  const nivelCol=yoyoColor(myData.nivel);
  const gInfo=myData.vam?vamGrupo[myData.vam]:null;
  const gCol=gInfo?gInfo.color:T.muted;

  // Evolución
  const evol=historial.length>1?(((historial[historial.length-1].nivel-historial[0].nivel)/historial[0].nivel)*100).toFixed(1):null;

  return(
    <>
      <MR>
        <MetCard label="Nivel alcanzado" value={myData.nivel} sc={nivelCol}/>
        <MetCard label="Distancia" value={`${myData.dist}m`}/>
        <MetCard label="VAM" value={`${myData.vam} m/s`} sc={gCol}/>
        <MetCard label="Ranking" value={`${myRank}° / ${allData.length}`}/>
      </MR>
      <Card style={{marginBottom:10}}>
        <CT text="Mi resultado Yo-Yo IRT1"/>
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:48,fontWeight:700,color:nivelCol,marginBottom:8}}>{myData.nivel}</div>
          <div style={{fontSize:14,color:T.muted2,marginBottom:8}}>Nivel alcanzado · {myData.fecha}</div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            {gInfo&&<span style={{background:gCol,color:"#111",padding:"4px 14px",borderRadius:6,fontSize:13,fontWeight:700}}>G{gInfo.num}</span>}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-around",marginTop:16}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:T.blue}}>{myData.dist}m</div><div style={{fontSize:11,color:T.muted}}>Distancia</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:gCol}}>{myData.vam} m/s</div><div style={{fontSize:11,color:T.muted}}>VAM</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:T.amber}}>{myRank}°</div><div style={{fontSize:11,color:T.muted}}>Ranking</div></div>
        </div>
      </Card>
      {historial.length>1&&(
        <Card style={{marginBottom:10}}>
          <CT text="Evolución Yo-Yo"/>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <div style={{fontSize:13,color:T.muted}}>Primer test → Último test</div>
            <div style={{fontSize:16,fontWeight:700,color:parseFloat(evol)>=0?T.green:T.red}}>
              {parseFloat(evol)>=0?"+":""}{evol}%
            </div>
          </div>
          {historial.map((h,i)=>{
            const prev=historial[i-1];
            const delta=prev?((h.nivel-prev.nivel)/prev.nivel*100).toFixed(1):null;
            const nc=yoyoColor(h.nivel);
            return(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,padding:"6px 8px",borderRadius:6,background:i===historial.length-1?"#1e3a5f":"transparent"}}>
                <span style={{fontSize:11,color:T.muted,width:80}}>{h.fecha}</span>
                <span style={{fontSize:13,fontWeight:700,color:nc}}>{h.nivel}</span>
                <span style={{fontSize:11,color:T.muted}}>{h.dist}m · {h.vam} m/s</span>
                {delta&&<span style={{fontSize:11,fontWeight:600,color:parseFloat(delta)>=0?T.green:T.red,marginLeft:"auto"}}>{parseFloat(delta)>=0?"+":""}{delta}%</span>}
              </div>
            );
          })}
        </Card>
      )}
      <Card style={{marginBottom:10}}>
        <CT text="Referencias por Nivel"/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{label:"Grupo 1 — >16.5",c:T.green},{label:"Grupo 2 — 14.6 a 16.4",c:T.amber},{label:"Grupo 3 — <14.6",c:T.red}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"#0d1020",padding:"7px 12px",borderRadius:8,border:`1px solid ${r.c}44`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:r.c}}/><span style={{fontSize:11,color:r.c,fontWeight:500}}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CT text="Comparación con el equipo"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr>
              {["#","Jugadora","Nivel","Dist","VAM","Grupo"].map((c,i)=>(
                <th key={i} style={{textAlign:i===5?"center":"left",fontWeight:500,fontSize:10,color:T.muted,padding:"5px 6px",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:".4px",whiteSpace:"nowrap"}}>{c}</th>
              ))}
            </tr></thead>
            <tbody>{allData.map((p,i)=>{
              const isMe=p.n===player;
              const nCol=yoyoColor(p.nivel);
              const pg=p.vam?vamGrupo[p.vam]:null;
              const pgCol=pg?pg.color:T.muted;
              const medals=["🥇","🥈","🥉"];
              return(
                <tr key={p.n} style={{background:isMe?"#1e3a5f":"transparent"}}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{i<3?medals[i]:i+1}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:isMe?T.blue:T.text,fontWeight:isMe?700:400,whiteSpace:"nowrap"}}>{p.n.split(" ")[0]}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:nCol,fontWeight:700,fontSize:14}}>{p.nivel}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{p.dist?`${p.dist}m`:"—"}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:pgCol,fontWeight:600}}>{p.vam||"—"}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",textAlign:"center"}}>
                    {pg&&<span style={{background:pgCol,color:"#111",padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700,display:"inline-block"}}>G{pg.num}</span>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function PlayerCargas({player}){
  const [loading,setLoading]=useState(true);
  const [data,setData]=useState(null);

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Cargas App"]||[];
        if(sheet.length<2){setData({});return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iF=headers.indexOf("Fecha"),iE=headers.indexOf("Ejercicio"),iJ=headers.indexOf("Jugadora"),iP=headers.indexOf("Peso"),iV=headers.indexOf("Vel (m/s)"),iR=headers.indexOf("RM");
        const acc={};
        sheet.slice(1).forEach(r=>{
          const jug=String(r[iJ]||"").trim();
          if(jug!==player)return;
          const fecha=String(r[iF]||"").slice(0,10);
          const ej=String(r[iE]||"").trim();
          const peso=Number(r[iP])||0;
          const vel=iV>=0?Number(r[iV])||null:null;
          const rm=iR>=0?Number(r[iR])||null:null;
          if(!ej||!peso)return;
          if(!acc[ej])acc[ej]=[];
          acc[ej].push({fecha,peso,vel,rm});
        });
        setData(acc);
      })
      .catch(()=>setData({}))
      .finally(()=>setLoading(false));
  },[player]);

  if(loading)return<Card><div style={{color:T.muted,textAlign:"center",padding:20}}>Cargando cargas...</div></Card>;
  if(!data||!Object.keys(data).length)return<Card><div style={{color:T.muted,textAlign:"center",padding:20}}>Sin datos de cargas todavía</div></Card>;

  return(
    <>
      {EJERCICIOS.filter(ej=>data[ej]).map(ej=>(
        <Card key={ej} style={{marginBottom:10}}>
          <CT text={ej}/>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={ej==="Dominadas"?["Fecha","Reps"]:["Fecha","Kg","VMP","RM"]}/>
            <tbody>{[...data[ej]].reverse().map((r,i)=>(
              <tr key={i}>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{r.fecha}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:600}}>{ej==="Dominadas"?`${r.peso} reps`:`${r.peso} kg`}</td>
                {ej!=="Dominadas"&&<td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:r.vel?T.blue:T.muted}}>{r.vel?`${r.vel} m/s`:"—"}</td>}
                {ej!=="Dominadas"&&<td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:r.rm?T.green:T.muted}}>{r.rm?`${r.rm} kg`:"—"}</td>}
              </tr>
            ))}</tbody>
          </table>
        </Card>
      ))}
    </>
  );
}

function PlayerMinutos({player}){
  const [loading,setLoading]=useState(true);
  const [jugMap,setJugMap]=useState(null);// {rival: total}
  const [partidos,setPartidos]=useState([]);
  const [ranking,setRanking]=useState([]);// [{n, tot}]

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Minutos App"]||[];
        if(sheet.length<2){setJugMap({});setPartidos([]);setRanking([]);return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iR=headers.indexOf("Rival"),iJ=headers.indexOf("Jugadora"),iT=headers.indexOf("Total");
        const partSet=new Set(), parts=[];
        const allMap={};// {jugadora:{rival:tot}}
        sheet.slice(1).forEach(r=>{
          const rival=String(r[iR]||"").trim();
          const jug=String(r[iJ]||"").trim();
          const tot=Number(r[iT])||0;
          if(!rival||!jug||!tot)return;
          if(!partSet.has(rival)){partSet.add(rival);parts.push(rival);}
          if(!allMap[jug])allMap[jug]={};
          allMap[jug][rival]=(allMap[jug][rival]||0)+tot;
        });
        setPartidos(parts);
        setJugMap(allMap[player]||{});
        // Ranking
        const rank=Object.entries(allMap).map(([n,m])=>({n,tot:Object.values(m).reduce((s,v)=>s+v,0)}))
          .filter(r=>r.tot>0).sort((a,b)=>b.tot-a.tot);
        setRanking(rank);
      })
      .catch(()=>{setJugMap({});setRanking([]);})
      .finally(()=>setLoading(false));
  },[player]);

  if(loading)return<Card><div style={{color:T.muted,textAlign:"center",padding:20,fontSize:13}}>Cargando minutos...</div></Card>;

  const tot=Object.values(jugMap||{}).reduce((s,v)=>s+v,0);
  const jugados=partidos.filter(p=>jugMap[p]);
  const prom=jugados.length?Math.round(tot/jugados.length*10)/10:0;
  const colors=[T.blue,T.green,T.amber,T.red,T.purple,T.cyan,"#e879f9","#fb923c"];
  const mx=ranking[0]?.tot||1;

  return(
    <>
      <MR>
        <MetCard label="Total minutos" value={`${tot} min`} sc={T.blue}/>
        <MetCard label="Prom. x partido" value={`${prom} min`}/>
        <MetCard label="Partidos jugados" value={jugados.length}/>
      </MR>
      <Card>
        <CT text="Mis minutos por partido"/>
        {jugados.length===0?<div style={{color:T.muted,textAlign:"center",padding:12}}>Sin minutos registrados</div>:
        jugados.map((p,i)=>{
          const v=jugMap[p];
          const c=colors[i%colors.length];
          return(
            <div key={p} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:T.text,fontWeight:500}}>{p}</span>
                <span style={{fontSize:12,color:c,fontWeight:600}}>{v} min</span>
              </div>
              <div style={{background:"#1a1e2a",borderRadius:4,height:10}}>
                <div style={{width:`${Math.min((v/70)*100,100)}%`,height:10,borderRadius:4,background:c}}/>
              </div>
            </div>
          );
        })}
      </Card>
      {ranking.length>0&&<Card>
        <CT text="Ranking minutos — equipo"/>
        {ranking.map((r,i)=>(
          <div key={r.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:10,color:T.muted,width:16,textAlign:"right"}}>{i+1}</span>
            <span style={{fontSize:11,color:r.n===player?T.blue:T.text,fontWeight:r.n===player?700:400,width:130}}>{r.n.split(" ")[0]}</span>
            <div style={{flex:1,height:8,borderRadius:3,background:"#1e2535"}}>
              <div style={{width:`${(r.tot/mx)*100}%`,height:"100%",borderRadius:3,background:r.n===player?T.blue:T.muted2}}/>
            </div>
            <span style={{fontSize:10,color:r.n===player?T.blue:T.muted,width:32,textAlign:"right"}}>{r.tot}'</span>
          </div>
        ))}
      </Card>}
    </>
  );
}

function PlayerAsistencia({player}){
  const [loading,setLoading]=useState(true);
  const [diasData,setDiasData]=useState(null);// [{fecha:"2026-03-04",est:"P"|"A"}]

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["Asistencias App"]||[];
        if(!sheet.length){setDiasData([]);return;}
        const headers=sheet[0].map(h=>String(h));
        const fechaIdx=headers.indexOf("Fecha");
        const jugIdx=headers.indexOf("Jugadora");
        const estIdx=headers.indexOf("Estado");
        const dias=[];
        sheet.slice(1).forEach(r=>{
          const fecha=String(r[fechaIdx]||"").trim();
          const jug=String(r[jugIdx]||"").trim();
          const est=String(r[estIdx]||"").trim();
          if(jug===player&&fecha&&est)dias.push({fecha,est});
        });
        dias.sort((a,b)=>a.fecha.localeCompare(b.fecha));
        setDiasData(dias);
      })
      .catch(()=>setDiasData([]))
      .finally(()=>setLoading(false));
  },[player]);

  if(loading)return<Card><div style={{color:T.muted,textAlign:"center",padding:20,fontSize:13}}>Cargando asistencias...</div></Card>;
  if(!diasData||!diasData.length)return<div style={{color:T.muted,padding:20,textAlign:"center"}}>Sin datos de asistencia</div>;

  // Agrupar por mes
  const byMes={};
  diasData.forEach(({fecha,est})=>{
    const mes=fecha.slice(0,7);
    if(!byMes[mes])byMes[mes]=[];
    byMes[mes].push({fecha,est});
  });

  const pctMes=mes=>{
    const arr=byMes[mes]||[];
    if(!arr.length)return null;
    const pres=arr.filter(x=>x.est==="P").length;
    return Math.round(pres/arr.length*100);
  };

  const totalPres=diasData.filter(x=>x.est==="P").length;
  const totalAus=diasData.filter(x=>x.est==="A").length;
  const totalVal=diasData.length;
  const pct=totalVal>0?Math.round(totalPres/totalVal*100):0;

  const feb=pctMes("2026-02");
  const mar=pctMes("2026-03");
  const abr=pctMes("2026-04");
  const may=pctMes("2026-05");
  const jun=pctMes("2026-06");
  const vals=[feb,mar,abr,may,jun].filter(v=>v!==null);
  const tot=vals.length?Math.round(vals.reduce((a,v)=>a+v,0)/vals.length):pct;

  // Construir filas del calendario: todas las fechas únicas en orden
  const MESES_CAL=[
    {key:"2026-02",label:"FEBRERO",color:T.purple||"#a78bfa"},
    {key:"2026-03",label:"MARZO",color:T.green},
    {key:"2026-04",label:"ABRIL",color:T.blue},
    {key:"2026-05",label:"MAYO",color:T.amber},
    {key:"2026-06",label:"JUNIO",color:T.cyan||"#06b6d4"},
    {key:"2026-07",label:"JULIO",color:T.red||"#e05555"},
    {key:"2026-08",label:"AGOSTO",color:"#a78bfa"},
    {key:"2026-09",label:"SEPTIEMBRE",color:T.green},
    {key:"2026-10",label:"OCTUBRE",color:T.blue},
    {key:"2026-11",label:"NOVIEMBRE",color:T.amber},
    {key:"2026-12",label:"DICIEMBRE",color:T.cyan||"#06b6d4"},
  ];

  // Formato fecha columna: "4/3"
  const fmtCol=fecha=>{
    const p=fecha.split("-");
    return parseInt(p[2])+"/"+parseInt(p[1]);
  };

  return(
    <>
      <MR>
        <MetCard label="Mi asistencia" value={`${pct}%`} sub={`${totalPres}/${totalVal} sesiones`} sc={pct>=80?T.green:pct>=60?T.amber:T.red}/>
        <MetCard label="Presencias" value={totalPres} sc={T.green}/>
        <MetCard label="Ausencias" value={totalAus} sc={T.red}/>
      </MR>
      {pct<60&&<div style={{background:"#2d0f0f",border:"1px solid #5a1f1f",borderRadius:6,padding:"7px 12px",marginBottom:10,fontSize:12,color:T.red}}>⚠ Asistencia menor al 60%</div>}
      <Card style={{marginBottom:10}}>
        <CT text="Mi calendario"/>
        <div style={{overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr>
                {diasData.map((d,i)=>{
                  // Solo poner header de mes en la primera fecha de ese mes
                  const mes=d.fecha.slice(0,7);
                  const m=MESES_CAL.find(x=>x.key===mes);
                  const isFirst=i===0||diasData[i-1].fecha.slice(0,7)!==mes;
                  const cols=(byMes[mes]||[]).length;
                  if(!isFirst)return null;
                  return<th key={i} colSpan={cols} style={{textAlign:"center",color:m?m.color:T.muted,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,border:`1px solid ${T.border2}`}}>{m?m.label:mes}</th>;
                })}
              </tr>
              <tr>
                {diasData.map((d,i)=>(
                  <th key={i} style={{textAlign:"center",color:T.muted,padding:"2px 2px",borderBottom:`1px solid ${T.border}`,fontSize:7,minWidth:18}}>{fmtCol(d.fecha)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {diasData.map((d,i)=>{
                  const isP=d.est==="P";
                  return(
                    <td key={i} style={{padding:"3px 2px",textAlign:"center"}}>
                      <div style={{borderRadius:4,background:isP?"#0f2d1f":"#2d0f0f",display:"flex",alignItems:"center",justifyContent:"center",color:isP?T.green:T.red,fontSize:12,padding:"5px 2px"}}>{isP?"✓":"✗"}</div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
          {[
            {l:"Febrero",v:feb!==null?feb+"%":"—",c:T.purple||"#a78bfa"},
            {l:"Marzo",v:mar!==null?mar+"%":"—",c:T.green},
            {l:"Abril",v:abr!==null?abr+"%":"—",c:T.blue},
            {l:"Mayo",v:may!==null?may+"%":"—",c:T.amber},
            {l:"Junio",v:jun!==null?jun+"%":"—",c:T.cyan||"#06b6d4"},
            {l:"Total",v:tot+"%",c:pct>=80?T.green:pct>=60?T.amber:T.red}
          ].map((m,i)=>(
            <div key={i} style={{background:"#0d1020",borderRadius:8,padding:"8px 14px",border:`1px solid ${m.c}33`}}>
              <div style={{fontSize:9,color:T.muted,marginBottom:2}}>{m.l}</div>
              <div style={{fontSize:20,fontWeight:600,color:m.c}}>{m.v}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

// ─── PLAYER RPE ───────────────────────────────────────────────────────────────

// ─── GUARDAR RPE/WELLNESS EN GOOGLE SHEETS ────────────────────────────────────
const SHEET_ID="1yvYdo8HyJoBPtEne0eIPWBZ80L8kjFOk0iBEvi4bDCs";
const SCRIPT_URL="https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec";
const saveToSheet=(jugadora,tipo,datos)=>{
  const params=new URLSearchParams({jugadora,tipo,...Object.fromEntries(Object.entries(datos).map(([k,v])=>[k,v===null||v===undefined?"":String(v)]))});
  return fetch(`${SCRIPT_URL}?${params.toString()}`,{method:"GET",mode:"no-cors"})
    .then(()=>true)
    .catch(()=>true);
};
function PlayerRPE({player}){
  const [yaDone,setYaDone]=useState(false);
  const [checking,setChecking]=useState(true);
  const [rpe,setRpe]=useState(RPE_DATA[player]||5);
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);

  const hoyISO=(()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})();

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["RPE y Wellness"]||[];
        if(sheet.length<2){setChecking(false);return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iF=headers.indexOf("Fecha"),iJ=headers.indexOf("Jugadora"),iT=headers.indexOf("Tipo");
        const yaRegistro=sheet.slice(1).some(r=>{
          const fecha=String(r[iF]||"").slice(0,10);
          const jug=String(r[iJ]||"").trim();
          const tipo=String(r[iT]||"").trim();
          return jug===player&&tipo==="RPE"&&fecha===hoyISO;
        });
        setYaDone(yaRegistro);
      })
      .catch(()=>{})
      .finally(()=>setChecking(false));
  },[player]);

  if(checking)return<Card><div style={{color:T.muted,textAlign:"center",padding:20,fontSize:12}}>Verificando...</div></Card>;
  if(yaDone)return(
    <Card>
      <div style={{textAlign:"center",padding:"30px 10px"}}>
        <div style={{fontSize:28,marginBottom:8}}>✅</div>
        <div style={{color:"#3ecf7a",fontSize:15,fontWeight:700,marginBottom:6}}>RPE registrado hoy</div>
        <div style={{color:T.muted,fontSize:12}}>Ya cargaste tu RPE de hoy. Volvé mañana.</div>
      </div>
    </Card>
  );
  return(
    <>
      {rpe>=8&&<div style={{background:"#2d0f0f",border:"1px solid #5a1f1f",borderRadius:6,padding:"7px 12px",marginBottom:10,fontSize:12,color:T.red}}>⚠ RPE ≥8 — el cuerpo técnico recibirá alerta.</div>}
      <Card>
        <CT text="Mi RPE post-sesión (1-10)"/>
        {rpe>0&&(()=>{
          const RD={1:["Muy muy suave","#3ecf7a"],2:["Muy suave","#3ecf7a"],3:["Suave","#3ecf7a"],4:["Moderado","#3ecf7a"],5:["Algo duro","#f5c518"],6:["Duro","#f5c518"],7:["Muy duro","#e09020"],8:["Muy muy duro","#e09020"],9:["Extremadamente duro","#e05555"],10:["Máximo esfuerzo","#e05555"]};
          const [desc,col]=RD[rpe]||["","#aaa"];
          return(<div style={{textAlign:"center",marginBottom:12}}>
            <span style={{fontSize:36,fontWeight:800,color:col}}>{rpe}</span>
            <div style={{fontSize:13,color:col,fontWeight:600,marginTop:2}}>{desc}</div>
          </div>);
        })()}
        <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
          {[1,2,3,4,5,6,7,8,9,10].map(n=>{
            const RPE_DESC={1:["Muy muy suave","#3ecf7a"],2:["Muy suave","#3ecf7a"],3:["Suave","#3ecf7a"],4:["Moderado","#3ecf7a"],5:["Algo duro","#f5c518"],6:["Duro","#f5c518"],7:["Muy duro","#e09020"],8:["Muy muy duro","#e09020"],9:["Extremadamente duro","#e05555"],10:["Máximo esfuerzo","#e05555"]};
            const [desc,col]=RPE_DESC[n];
            const sel=rpe===n;
            return(
              <button key={n} onClick={()=>{setRpe(n);setSaved(false);}} style={{width:34,height:34,borderRadius:6,border:sel?`2px solid ${col}`:`1px solid ${T.border}`,background:sel?col+"33":"transparent",color:sel?col:T.muted,fontSize:14,fontWeight:sel?700:400,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>
            );
          })}
        </div>
        <button onClick={async()=>{
          setSaving(true);
          const today=new Date().toLocaleDateString("es-CL");
          await saveToSheet(player,"RPE",{fecha:today,rpe:rpe});
          setSaving(false);setSaved(true);localStorage.setItem(todayKey(player),'1');setYaDone(true);localStorage.setItem(todayKey(player),'1');setYaDone(true);
        }} style={{width:"100%",padding:10,background:T.blue,border:"none",borderRadius:6,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{saving?"Guardando...":"Guardar RPE"}</button>
        {saved&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:T.green}}>✓ RPE guardado</div>}
      </Card>
    </>
  );
}

// ─── PLAYER WELLNESS ──────────────────────────────────────────────────────────
function PlayerWellness({player}){
  const base=WELLNESS[player]||{horas:"7hs",calidad:3,fatiga:3,dolor:3,estres:3,animo:3};
  const [yaDone,setYaDone]=useState(false);
  const [checking,setChecking]=useState(true);
  const [form,setForm]=useState({horas:base.horas,calidad:base.calidad,fatiga:base.fatiga,dolor:base.dolor,estres:base.estres,animo:base.animo,zonasDolor:[],otroZona:""});
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);

  const hoyISO=(()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})();

  React.useEffect(()=>{
    fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec")
      .then(r=>r.json())
      .then(d=>{
        const sheet=d["RPE y Wellness"]||[];
        if(sheet.length<2){setChecking(false);return;}
        const headers=sheet[0].map(h=>String(h).trim());
        const iF=headers.indexOf("Fecha"),iJ=headers.indexOf("Jugadora"),iT=headers.indexOf("Tipo");
        const yaRegistro=sheet.slice(1).some(r=>{
          const fecha=String(r[iF]||"").slice(0,10);
          const jug=String(r[iJ]||"").trim();
          const tipo=String(r[iT]||"").trim();
          return jug===player&&tipo==="Wellness"&&fecha===hoyISO;
        });
        setYaDone(yaRegistro);
      })
      .catch(()=>{})
      .finally(()=>setChecking(false));
  },[player]);
  const upd=(k,v)=>{setForm(p=>({...p,[k]:v}));setSaved(false);};
  const toggleZona=z=>{setForm(p=>({...p,zonasDolor:p.zonasDolor.includes(z)?p.zonasDolor.filter(x=>x!==z):[...p.zonasDolor,z]}));setSaved(false);};
  const WRow=({field,label})=>(
    <div style={{marginBottom:12}}>
      <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".4px",marginBottom:6}}>{label}</div>
      <div style={{display:"flex",gap:6}}>
        {[1,2,3,4,5].map(n=>(
          <button key={n} onClick={()=>upd(field,n)} style={{flex:1,padding:"8px 0",borderRadius:8,border:form[field]===n?`2px solid ${wColor(n)}`:`1px solid ${T.border}`,background:form[field]===n?wBg(n):"transparent",cursor:"pointer",fontFamily:"inherit",display:"flex",justifyContent:"center"}}>
            <WCircle val={n} size={26}/>
          </button>
        ))}
      </div>
    </div>
  );
  if(checking)return<Card><div style={{color:T.muted,textAlign:"center",padding:20,fontSize:12}}>Verificando...</div></Card>;
  if(yaDone)return(
    <Card>
      <div style={{textAlign:"center",padding:"30px 10px"}}>
        <div style={{fontSize:28,marginBottom:8}}>✅</div>
        <div style={{color:"#3ecf7a",fontSize:15,fontWeight:700,marginBottom:6}}>Wellness registrado hoy</div>
        <div style={{color:T.muted,fontSize:12}}>Ya cargaste tu Wellness de hoy. Volvé mañana.</div>
      </div>
    </Card>
  );
  return(
    <>
      <Card style={{marginBottom:10}}>
        <CT text="Horas de sueño"/>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {["4hs","5hs","6hs","7hs","8hs","9hs"].map(h=>(
            <button key={h} onClick={()=>upd("horas",h)} style={{padding:"6px 12px",borderRadius:6,border:form.horas===h?`2px solid ${T.blue}`:`1px solid ${T.border}`,background:form.horas===h?T.blue+"22":"transparent",color:form.horas===h?T.blue:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{h}</button>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:10}}>
        <CT text="Wellness diario (1=malo · 5=excelente)"/>
        <WRow field="calidad" label="Calidad del sueño"/>
        <WRow field="fatiga" label="Energía / Fatiga"/>
        <div style={{marginBottom:12}}>
          <div style={{fontSize:11,color:T.muted,textTransform:"uppercase",letterSpacing:".4px",marginBottom:6}}>Dolor muscular</div>
          <div style={{display:"flex",gap:6,marginBottom:8}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>upd("dolor",n)} style={{flex:1,padding:"8px 0",borderRadius:8,border:form.dolor===n?`2px solid ${wColor(n)}`:`1px solid ${T.border}`,background:form.dolor===n?wBg(n):"transparent",cursor:"pointer",fontFamily:"inherit",display:"flex",justifyContent:"center"}}>
                <WCircle val={n} size={26}/>
              </button>
            ))}
          </div>
          {form.dolor<=4&&(
            <div style={{background:"#0d1020",borderRadius:8,padding:10,border:`1px solid ${T.border2}`}}>
              <div style={{fontSize:11,color:T.muted2,marginBottom:7}}>Zona con molestia:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                {ZONAS_DOLOR.map(z=>(
                  <button key={z} onClick={()=>toggleZona(z)} style={{padding:"4px 9px",borderRadius:20,border:form.zonasDolor.includes(z)?`2px solid ${T.red}`:`1px solid ${T.border}`,background:form.zonasDolor.includes(z)?T.red+"22":"transparent",color:form.zonasDolor.includes(z)?T.red:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{z}</button>
                ))}
                <button onClick={()=>toggleZona("Otro")} style={{padding:"4px 9px",borderRadius:20,border:form.zonasDolor.includes("Otro")?`2px solid ${T.amber}`:`1px solid ${T.border}`,background:form.zonasDolor.includes("Otro")?T.amber+"22":"transparent",color:form.zonasDolor.includes("Otro")?T.amber:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+ Otro</button>
              </div>
              {form.zonasDolor.includes("Otro")&&<input placeholder="Describí la zona..." value={form.otroZona} onChange={e=>{setForm(p=>({...p,otroZona:e.target.value}));setSaved(false);}} style={{width:"100%",background:"#1e2535",border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,fontSize:12,padding:"7px 10px",outline:"none",boxSizing:"border-box"}}/>}
            </div>
          )}
        </div>
        <WRow field="estres" label="Nivel de estrés"/>
        <WRow field="animo" label="Estado anímico"/>
        <button onClick={async()=>{
          setSaving(true);
          const today=new Date().toLocaleDateString("es-CL");
          await saveToSheet(player,"Wellness",{
            fecha:today,
            calidad_sueno:form.calidad,
            horas_sueno:form.horas,
            fatiga:form.fatiga,
            dolor_muscular:form.dolor,
            zonas:form.zonasDolor.join("|"),
            estres:form.estres,
            animo:form.animo
          });
          WELLNESS_DATA[player]=form;
          setSaving(false);setSaved(true);localStorage.setItem(todayKeyW(player),'1');setYaDone(true);
        }} style={{width:"100%",padding:10,background:T.maroon,border:"none",borderRadius:6,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>{saving?"Guardando...":"Guardar Wellness"}</button>
        {saved&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:T.green}}>✓ Wellness guardado</div>}
      </Card>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
// tabs defined inside App()


// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [tipo,setTipo]=useState(null);
  const [pass,setPass]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [player,setPlayer]=useState("");
  const [error,setError]=useState("");
  const [recordar,setRecordar]=useState(false);

  // Auto-login si hay sesión guardada
  React.useEffect(()=>{
    try{
      const saved=localStorage.getItem("oldgabs_session");
      if(saved){const s=JSON.parse(saved);if(s.tipo&&(s.tipo==="staff"||(s.tipo==="jugadora"&&s.player)))onLogin(s.tipo,s.player||null);}
    }catch(e){}
  },[]);

  const handleLogin=()=>{
    if(tipo==="staff"){
      if(pass==="Staffoldgabs"){
        if(recordar)localStorage.setItem("oldgabs_session",JSON.stringify({tipo:"staff"}));
        onLogin("staff",null);
      }else{setError("Contraseña incorrecta");setPass("");}
    }else{
      if(pass==="1eraoldgabs"){
        if(!player){setError("Seleccioná tu nombre");return;}
        if(recordar)localStorage.setItem("oldgabs_session",JSON.stringify({tipo:"jugadora",player}));
        onLogin("jugadora",player);
      }else{setError("Contraseña incorrecta");setPass("");}
    }
  };
  return(
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <img src="data:image/jpeg;base64,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" alt="Old Gabs" style={{width:90,height:90,borderRadius:"50%",objectFit:"cover",margin:"0 auto 12px",display:"block",border:"3px solid #8B1A2A"}}/>
        <div style={{fontSize:20,fontWeight:700,color:T.text,letterSpacing:1}}>OLD GABS 1ERA</div>
        <div style={{fontSize:12,color:T.muted,marginTop:4}}>Dashboard Rendimiento Físico</div>
        <div style={{fontSize:11,color:T.muted,marginTop:2}}>Temporada 2026</div>
      </div>
      {!tipo?(
        <div style={{width:"100%",maxWidth:320}}>
          <div style={{fontSize:12,color:T.muted,textAlign:"center",marginBottom:16}}>¿Quién sos?</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>{setTipo("staff");setError("");}} style={{padding:16,borderRadius:10,border:`1px solid ${T.border2}`,background:T.surf,color:T.text,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>👤</span><div style={{textAlign:"left"}}><div>Staff Técnico</div><div style={{fontSize:11,color:T.muted,fontWeight:400}}>Acceso completo</div></div>
            </button>
            <button onClick={()=>{setTipo("jugadora");setError("");}} style={{padding:16,borderRadius:10,border:`1px solid ${T.border2}`,background:T.surf,color:T.text,fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:24}}>🏑</span><div style={{textAlign:"left"}}><div>Jugadora</div><div style={{fontSize:11,color:T.muted,fontWeight:400}}>Mis datos personales</div></div>
            </button>
          </div>
        </div>
      ):(
        <div style={{width:"100%",maxWidth:320}}>
          <button onClick={()=>{setTipo(null);setPass("");setPlayer("");setError("");}} style={{background:"transparent",border:"none",color:T.muted,fontSize:12,cursor:"pointer",marginBottom:20,padding:0,fontFamily:"inherit"}}>← Volver</button>
          <div style={{background:T.surf,borderRadius:12,padding:24,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:16}}>{tipo==="staff"?"Staff Técnico 👤":"Jugadora 🏑"}</div>
            {tipo==="jugadora"&&(
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Tu nombre</div>
                <select value={player} onChange={e=>setPlayer(e.target.value)} style={{width:"100%",background:"#0d1020",border:`1px solid ${T.border2}`,borderRadius:8,color:player?T.text:T.muted,fontSize:13,padding:"10px 12px",outline:"none",boxSizing:"border-box"}}>
                  <option value="">Seleccioná tu nombre...</option>
                  {ALL_JUGADORAS.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Contraseña</div>
              <div style={{position:"relative"}}>
                <input {...{type:showPass?"text":"password"}} value={pass} onChange={e=>{setPass(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" style={{width:"100%",background:"#0d1020",border:`1px solid ${error?T.red:T.border2}`,borderRadius:8,boxSizing:"border-box",paddingRight:38,color:T.text,fontSize:14,padding:"10px 12px",outline:"none",fontFamily:"inherit"}}/>
                <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:16,padding:0,lineHeight:1}}>
                  {showPass?"👁":"👁‍🗨"}
                </button>
              </div>
              {error&&<div style={{fontSize:11,color:T.red,marginTop:6}}>{error}</div>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,cursor:"pointer"}} onClick={()=>setRecordar(v=>!v)}>
              <div style={{width:18,height:18,borderRadius:4,border:`1px solid ${T.border2}`,background:recordar?T.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",flexShrink:0}}>{recordar?"✓":""}</div>
              <span style={{fontSize:12,color:T.muted}}>Recordar sesión en este dispositivo</span>
            </div>
            <button onClick={handleLogin} style={{width:"100%",padding:12,background:tipo==="staff"?T.blue:T.green,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ingresar</button>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── ERROR BOUNDARY ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={error:null};}
  static getDerivedStateFromError(e){return{error:e};}
  render(){
    if(this.state.error){
      return(
        <div style={{padding:20,color:"#ff6b6b",fontFamily:"monospace",fontSize:12,background:"#1a0a0a",margin:10,borderRadius:8,border:"1px solid #ff6b6b33"}}>
          <div style={{fontWeight:700,marginBottom:8}}>⚠ Error en componente:</div>
          <div style={{color:"#ffaaaa"}}>{this.state.error.message}</div>
          <div style={{marginTop:8,color:"#888",fontSize:10}}>{this.state.error.stack?.split("\n").slice(0,5).join("\n")}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App(){
  return <GPSProvider><AppInner/></GPSProvider>;
}

function AppInner(){
  const {partidos:P=[],amistosos:A=[],entrenos:E=[]}=useGPS();
  const PARTIDOS=P.length?P:PARTIDOS_FB;
  const [session,setSession]=useState(null);
  const [tab,setTab]=useState(0);
  const [player,setPlayer]=useState(()=>ALL_JUGADORAS[0]);
  const handleLogin=(tipo,playerName)=>{setSession({tipo,player:playerName});setTab(0);if(playerName)setPlayer(playerName);};
  const handleLogout=()=>{localStorage.removeItem("oldgabs_session");setSession(null);setTab(0);};
  if(!session)return<LoginScreen onLogin={handleLogin}/>;
  const mode=session.tipo==="staff"?"staff":"player";
  const STAFF_TABS=["GPS","Evolución GPS","Perfil Puestos","Evaluaciones","Minutos","Asistencia","RPE","Wellness"];
  const PLAYER_TABS=["Mi GPS","Evolución GPS","Evaluaciones","Minutos","Asistencia","Mi RPE","Mi Wellness"];
  const tabs=mode==="staff"?STAFF_TABS:PLAYER_TABS;
  return(
    <PuestosProvider>
    <div style={{background:T.bg,color:T.text,minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:"#080a0f",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px",height:46,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src="data:image/jpeg;base64,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" alt="Old Gabs" style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",border:"2px solid #8B1A2A"}}/>
          <div>
            <div style={{fontSize:11,fontWeight:700,color:T.text,letterSpacing:"1px",textTransform:"uppercase"}}>Old Gabs 1era</div>
            <div style={{fontSize:9,color:T.muted}}>{mode==="staff"?"Staff Técnico":"Jugadora"}</div>
          </div>
        </div>
        <button onClick={handleLogout} style={{padding:"4px 10px",borderRadius:5,border:`1px solid ${T.border}`,fontSize:10,cursor:"pointer",background:"transparent",color:T.muted,fontFamily:"inherit"}}>Salir</button>
      </div>
      {/* Tabs debajo del título */}
      <div style={{background:T.surf,borderBottom:`1px solid ${T.border}`,overflowX:"auto",position:"sticky",top:46,zIndex:99}}>
        <div style={{display:"flex",padding:"0 4px"}}>
          {tabs.map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} style={{padding:"10px 10px",fontSize:10,fontWeight:500,cursor:"pointer",border:"none",background:"transparent",color:tab===i?T.blue:T.muted,textTransform:"uppercase",letterSpacing:".5px",borderBottom:`2px solid ${tab===i?T.blue:"transparent"}`,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{padding:12}}>
        {mode==="player"&&session.player&&(
          <div style={{background:T.surf,border:`1px solid ${T.border}`,borderRadius:8,padding:"8px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <span>🏑</span>
            <div><div style={{fontSize:12,fontWeight:600,color:T.text}}>{session.player}</div><div style={{fontSize:10,color:T.muted}}>Tus datos personales</div></div>
          </div>
        )}
        {mode==="staff"?(
          <ErrorBoundary><>{tab===0&&<StaffGPS/>}{tab===1&&<StaffEvoGPS/>}{tab===2&&<StaffPuestos/>}{tab===3&&<StaffEvaluaciones/>}{tab===4&&<StaffMinutos/>}{tab===5&&<StaffAsistencia/>}{tab===6&&<StaffRPE/>}{tab===7&&<StaffWellness/>}</></ErrorBoundary>
        ):(
          <ErrorBoundary><>{tab===0&&<PlayerGPS player={session.player||player}/>}{tab===1&&<PlayerEvoGPS player={session.player||player}/>}{tab===2&&<PlayerEvaluaciones player={session.player||player}/>}{tab===3&&<PlayerMinutos player={session.player||player}/>}{tab===4&&<PlayerAsistencia player={session.player||player}/>}{tab===5&&<PlayerRPE player={session.player||player}/>}{tab===6&&<PlayerWellness player={session.player||player}/>}</></ErrorBoundary>
        )}
      </div>
    </div>
    </PuestosProvider>
  );
// Asistencias — datos exactos del Drive hoja "Asistencias"
// MAR: 2,4,6,9,11,13,16,18,20,23,25,27,30 (13 fechas)
// ABR: 6,8,10,13,15,17,20,22,24,27,29 (11 fechas)
// MAY: 4,6,8,11,13,15,18 (7 fechas)
// null=blanco (no registrado, no cuenta para el %)
const ATT_MESES=[
  {label:"MAR", color:"#3ecf7a", fechas:["2/3","4/3","6/3","9/3","11/3","13/3","16/3","18/3","20/3","23/3","25/3","27/3","30/3"]},
  {label:"ABR", color:"#e09020", fechas:["6/4","8/4","10/4","13/4","15/4","17/4","20/4","22/4","24/4","27/4","29/4"]},
  {label:"MAY", color:"#8b6fe8", fechas:["4/5","6/5","8/5","11/5","13/5","15/5","18/5"]},
];
const ATT_FECHAS=ATT_MESES.flatMap(m=>m.fechas);
// MAR(13) + ABR(11) + MAY(7) = 31 fechas
// % calculados ignorando nulls
const ASISTENCIA={
  "Alfaro Javiera":
    {mar:"88%",abr:"75%",may:"67%",tot:"77%",
     dias:[1,0,null,1,1,1,1,1,1,null,null,null,null,1,1,1,0,null,null,1,0,1,1,null,1,0,1,1,0,null,1]},
  "Arau María Paz":
    {mar:"88%",abr:"89%",may:"100%",tot:"92%",
     dias:[1,1,null,1,1,1,0,1,1,null,null,null,null,1,1,0,1,1,null,1,1,1,1,null,1,1,1,1,1,1,1]},
  "Carrasco Sofia":
    {mar:"100%",abr:"100%",may:"100%",tot:"100%",
     dias:[1,1,null,1,1,1,1,1,1,null,null,null,null,1,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1]},
  "Errazu Sofia":
    {mar:"50%",abr:"38%",may:"50%",tot:"45%",
     dias:[1,0,null,1,0,0,0,1,1,null,null,null,null,1,0,0,1,null,null,0,1,0,0,null,1,0,1,1,0,null,0]},
  "Gacitua Emilia":
    {mar:"62%",abr:"100%",may:"86%",tot:"83%",
     dias:[1,1,null,0,1,0,0,1,1,null,null,null,null,1,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,0,1]},
  "Gomez Camila":
    {mar:"100%",abr:"100%",may:"100%",tot:"100%",
     dias:[1,1,null,1,1,1,1,1,1,null,null,null,null,1,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1]},
  "Gutierrez Renata":
    {mar:"75%",abr:"100%",may:"100%",tot:"91%",
     dias:[1,0,null,1,1,0,1,1,1,null,null,null,null,1,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1]},
  "Hevia Valentina":
    {mar:"88%",abr:"38%",may:"100%",tot:"74%",
     dias:[1,1,null,1,1,1,0,1,1,null,null,null,null,0,1,1,0,null,null,0,1,0,0,null,1,1,1,1,1,1,1]},
  "Liu Macarena":
    {mar:"12%",abr:"0%",may:"14%",tot:"9%",
     dias:[0,0,null,0,0,1,0,0,0,null,null,null,null,0,0,0,0,null,null,0,0,0,0,null,0,0,0,0,1,0,0]},
  "Mateluna Florencia":
    {mar:"—",abr:"100%",may:"100%",tot:"100%",
     dias:[null,null,null,null,null,null,null,null,null,null,null,null,null,1,1,1,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1]},
  "Muñoz Constanza":
    {mar:"38%",abr:"38%",may:"43%",tot:"39%",
     dias:[0,0,null,0,1,0,1,1,0,null,null,null,null,0,0,0,0,null,null,1,1,1,0,null,0,1,1,0,0,1,0]},
  "Pareja Camila":
    {mar:"75%",abr:"88%",may:"100%",tot:"87%",
     dias:[1,1,null,1,1,0,0,1,1,null,null,null,null,1,1,0,1,null,null,1,1,1,1,null,1,1,1,1,1,1,1]},
  "Pollmann Marianne":
    {mar:"62%",abr:"88%",may:"57%",tot:"70%",
     dias:[1,1,null,0,0,0,1,1,1,null,null,null,null,1,1,1,1,null,null,1,0,1,1,null,1,1,0,0,1,0,1]},
  "Retamal Antonia":
    {mar:"75%",abr:"50%",may:"86%",tot:"70%",
     dias:[1,1,null,1,1,1,1,0,0,null,null,null,null,0,1,0,0,null,null,1,1,1,0,null,1,0,1,1,1,1,1]},
  "Sepulveda Eileen":
    {mar:"88%",abr:"62%",may:"0%",tot:"52%",
     dias:[1,1,null,1,1,1,1,0,1,null,null,null,null,0,1,1,1,null,null,0,1,0,1,null,0,0,0,0,0,0,0]},
  "Sierra Julieta":
    {mar:"38%",abr:"0%",may:"29%",tot:"22%",
     dias:[0,1,null,0,1,1,0,0,0,null,null,null,null,0,0,0,0,null,null,0,0,0,0,null,0,1,0,0,1,0,0]},
  "Silva Victoria":
    {mar:"12%",abr:"0%",may:"43%",tot:"17%",
     dias:[0,0,null,0,0,0,0,0,1,null,null,null,null,0,0,0,0,null,null,0,0,0,0,null,0,1,1,0,1,0,0]},
};




}
