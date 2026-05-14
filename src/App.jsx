import { useState } from "react";

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

// ─── PARTIDOS OFICIALES ───────────────────────────────────────────────────────
// Las filas de promedio vienen del CSV del Drive (fila 14/30/47)
const PARTIDOS=[
  {id:"cogs",label:"vs COGS",fecha:"22/03",tipo:"partido",
   // Sin sub-tabla zonas en el sheet → h18 calculado: AI(>18) - sprint por jugadora
   prom:{dist:5900,mxm:104.2,hsr:609,h18:149,spr:25,acc:14,dsc:23,vmax:22.36},
   jugadoras:[
    {n:"Gomez Camila",     min:48,dist:4630,mxm:96, ai15:317, ai18:16,  spr:0,  acc:5, dsc:10,vmax:20.2},
    {n:"Alfaro Javiera",   min:45,dist:4961,mxm:109,ai15:351, ai18:42,  spr:0,  acc:6, dsc:15,vmax:20.8},
    {n:"Gacitua Emilia",   min:52,dist:5578,mxm:107,ai15:840, ai18:235, spr:137,acc:32,dsc:40,vmax:25.2},
    {n:"Pareja Camila",    min:64,dist:5617,mxm:87, ai15:255, ai18:57,  spr:0,  acc:5, dsc:10,vmax:23.0},
    {n:"Muñoz Constanza",  min:61,dist:5702,mxm:93, ai15:575, ai18:198, spr:0,  acc:7, dsc:20,vmax:23.9},
    {n:"Pollmann Marianne",min:60,dist:6162,mxm:103,ai15:677, ai18:179, spr:0,  acc:12,dsc:17,vmax:22.4},
    {n:"Errazu Sofia",     min:56,dist:6298,mxm:111,ai15:434, ai18:69,  spr:0,  acc:24,dsc:21,vmax:20.7},
    {n:"Sierra Julieta",   min:58,dist:6558,mxm:112,ai15:871, ai18:275, spr:0,  acc:13,dsc:30,vmax:23.9},
    {n:"Silva Victoria",   min:57,dist:6681,mxm:117,ai15:1191,ai18:310, spr:108,acc:25,dsc:45,vmax:23.4},
    {n:"Gutierrez Renata", min:63,dist:6808,mxm:107,ai15:582, ai18:106, spr:0,  acc:9, dsc:17,vmax:20.1},
  ]},
  {id:"pwcc",label:"vs PWCC",fecha:"05/04",tipo:"partido",
   // Sin sub-tabla zonas en el sheet → h18 calculado: AI(>18) - sprint por jugadora
   prom:{dist:5797,mxm:102.2,hsr:774,h18:217,spr:37,acc:18,dsc:21,vmax:22.4},
   jugadoras:[
    {n:"Gomez Camila",     min:41,dist:3996,mxm:95, ai15:569, ai18:130, spr:2,  acc:9, dsc:13,vmax:21.0},
    {n:"Pareja Camila",    min:66,dist:5308,mxm:80, ai15:339, ai18:73,  spr:0,  acc:6, dsc:9, vmax:22.7},
    {n:"Muñoz Constanza",  min:66,dist:5406,mxm:82, ai15:462, ai18:224, spr:0,  acc:19,dsc:18,vmax:22.5},
    {n:"Errazu Sofia",     min:50,dist:5528,mxm:109,ai15:622, ai18:159, spr:0,  acc:22,dsc:17,vmax:21.8},
    {n:"Carrasco Sofia",   min:46,dist:5631,mxm:122,ai15:1121,ai18:378, spr:0,  acc:17,dsc:22,vmax:22.9},
    {n:"Silva Victoria",   min:49,dist:5805,mxm:117,ai15:1418,ai18:381, spr:215,acc:31,dsc:36,vmax:24.8},
    {n:"Pollmann Marianne",min:57,dist:5945,mxm:103,ai15:487, ai18:90,  spr:0,  acc:15,dsc:14,vmax:20.3},
    {n:"Sierra Julieta",   min:61,dist:6632,mxm:107,ai15:1061,ai18:357, spr:0,  acc:28,dsc:39,vmax:22.6},
    {n:"Gutierrez Renata", min:66,dist:6754,mxm:102,ai15:603, ai18:113, spr:0,  acc:8, dsc:15,vmax:21.3},
    {n:"Gacitua Emilia",   min:66,dist:6960,mxm:105,ai15:1055,ai18:263, spr:157,acc:28,dsc:31,vmax:24.1},
  ]},
  {id:"manq",label:"vs MANQ",fecha:"25/04",tipo:"partido",
   prom:{dist:6058,mxm:105,hsr:771,h18:230,spr:3,acc:23,dsc:31,vmax:22.6},
   jugadoras:[
    {n:"Alfaro Javiera",   min:28,dist:3190,mxm:112,ai15:449, ai18:159, spr:0,  acc:9, dsc:16,vmax:22.8},
    {n:"Carrasco Sofia",   min:32,dist:3964,mxm:124,ai15:929, ai18:289, spr:0,  acc:26,dsc:42,vmax:22.9},
    {n:"Gomez Camila",     min:49,dist:4744,mxm:96, ai15:484, ai18:63,  spr:0,  acc:5, dsc:18,vmax:20.3},
    {n:"Muñoz Constanza",  min:63,dist:5384,mxm:85, ai15:397, ai18:82,  spr:0,  acc:12,dsc:17,vmax:21.6},
    {n:"Liu Macarena",     min:47,dist:5532,mxm:116,ai15:883, ai18:266, spr:0,  acc:22,dsc:26,vmax:22.5},
    {n:"Pareja Camila",    min:71,dist:6123,mxm:86, ai15:281, ai18:62,  spr:0,  acc:11,dsc:20,vmax:21.2},
    {n:"Gutierrez Renata", min:71,dist:6822,mxm:96, ai15:715, ai18:280, spr:0,  acc:14,dsc:24,vmax:22.9},
    {n:"Pollmann Marianne",min:71,dist:6952,mxm:98, ai15:653, ai18:123, spr:0,  acc:27,dsc:14,vmax:21.9},
    {n:"Gacitua Emilia",   min:71,dist:7854,mxm:111,ai15:1137,ai18:319, spr:0,  acc:38,dsc:48,vmax:23.4},
    {n:"Sierra Julieta",   min:71,dist:7929,mxm:112,ai15:1086,ai18:318, spr:11, acc:39,dsc:61,vmax:24.6},
    {n:"Silva Victoria",   min:71,dist:8142,mxm:115,ai15:1469,ai18:570, spr:16, acc:45,dsc:52,vmax:24.7},
  ]},
  {id:"catb",label:"vs CAT B",fecha:"10/05",tipo:"partido",
   prom:{dist:5603,mxm:105,hsr:611,h18:202,spr:2,acc:18,dsc:25,vmax:22.9},
   jugadoras:[
    {n:"Alfaro Javiera",   min:27,dist:2917,mxm:108,ai15:296, ai18:73,  spr:0,  acc:4, dsc:15,vmax:21.6},
    {n:"Carrasco Sofia",   min:26,dist:3006,mxm:116,ai15:610, ai18:220, spr:0,  acc:20,dsc:40,vmax:22.7},
    {n:"Gomez Camila",     min:40,dist:3879,mxm:98, ai15:372, ai18:82,  spr:0,  acc:6, dsc:13,vmax:20.8},
    {n:"Errazu Sofia",     min:44,dist:5031,mxm:114,ai15:935, ai18:345, spr:5,  acc:23,dsc:18,vmax:24.3},
    {n:"Pollmann Marianne",min:64,dist:5874,mxm:92, ai15:567, ai18:169, spr:0,  acc:17,dsc:19,vmax:22.9},
    {n:"Pareja Camila",    min:65,dist:6121,mxm:94, ai15:355, ai18:87,  spr:0,  acc:15,dsc:16,vmax:22.4},
    {n:"Muñoz Constanza",  min:65,dist:6258,mxm:96, ai15:390, ai18:125, spr:0,  acc:6, dsc:12,vmax:22.6},
    {n:"Sierra Julieta",   min:65,dist:6676,mxm:102,ai15:594, ai18:225, spr:0,  acc:27,dsc:40,vmax:23.1},
    {n:"Gutierrez Renata", min:65,dist:6806,mxm:104,ai15:551, ai18:112, spr:0,  acc:19,dsc:18,vmax:21.1},
    {n:"Gacitua Emilia",   min:65,dist:7339,mxm:112,ai15:958, ai18:364, spr:9,  acc:29,dsc:35,vmax:25.1},
    {n:"Silva Victoria",   min:65,dist:7723,mxm:118,ai15:1096,ai18:419, spr:7,  acc:31,dsc:44,vmax:24.8},
   ]},
];

// ─── AMISTOSOS ────────────────────────────────────────────────────────────────
const AMISTOSOS=[
  {id:"pwccb1",label:"vs PWCC B",fecha:"22/03",tipo:"amistoso",
   prom:{dist:4678,mxm:101.4,hsr:468,h18:127,spr:8,acc:10,dsc:17,vmax:22.02},
   jugadoras:[
    {n:"Gomez Camila",     min:32,dist:2898,mxm:90, ai15:190, ai18:32,  spr:0,  acc:2, dsc:6, vmax:20.1},
    {n:"Carrasco Sofia",   min:37,dist:4031,mxm:109,ai15:604, ai18:268, spr:0,  acc:14,dsc:22,vmax:22.5},
    {n:"Alfaro Javiera",   min:37,dist:4085,mxm:110,ai15:433, ai18:71,  spr:0,  acc:2, dsc:15,vmax:20.4},
    {n:"Mateluna Florencia",min:41,dist:4454,mxm:106,ai15:423,ai18:68,  spr:18, acc:8, dsc:17,vmax:21.9},
    {n:"Pareja Camila",    min:52,dist:4886,mxm:93, ai15:271, ai18:39,  spr:0,  acc:5, dsc:8, vmax:21.5},
    {n:"Gutierrez Renata", min:52,dist:5048,mxm:96, ai15:376, ai18:96,  spr:0,  acc:7, dsc:6, vmax:21.1},
    {n:"Pollmann Marianne",min:50,dist:5133,mxm:102,ai15:511, ai18:113, spr:0,  acc:9, dsc:28,vmax:23.0},
    {n:"Errazu Sofia",     min:52,dist:5337,mxm:101,ai15:705, ai18:245, spr:0,  acc:10,dsc:8, vmax:22.5},
    {n:"Gacitua Emilia",   min:52,dist:5344,mxm:101,ai15:650, ai18:200, spr:63, acc:22,dsc:29,vmax:24.5},
    {n:"Sierra Julieta",   min:52,dist:5566,mxm:106,ai15:514, ai18:142, spr:0,  acc:24,dsc:31,vmax:22.7},
  ]},
  {id:"uca",label:"vs UC A-B",fecha:"05/04",tipo:"amistoso",
   prom:{dist:4984,mxm:93.4,hsr:500,h18:135,spr:21,acc:12,dsc:22,vmax:21.94},
   jugadoras:[
    {n:"Gomez Camila",     min:35,dist:2999,mxm:85, ai15:223, ai18:21,  spr:0,  acc:6, dsc:11,vmax:19.2},
    {n:"Alfaro Javiera",   min:41,dist:3607,mxm:87, ai15:288, ai18:50,  spr:0,  acc:3, dsc:19,vmax:21.6},
    {n:"Carrasco Sofia",   min:41,dist:4011,mxm:96, ai15:765, ai18:356, spr:0,  acc:16,dsc:28,vmax:23.6},
    {n:"Errazu Sofia",     min:41,dist:4368,mxm:105,ai15:704, ai18:280, spr:0,  acc:11,dsc:12,vmax:21.6},
    {n:"Pareja Camila",    min:63,dist:5219,mxm:82, ai15:143, ai18:27,  spr:0,  acc:6, dsc:5, vmax:19.2},
    {n:"Gutierrez Renata", min:63,dist:5667,mxm:90, ai15:364, ai18:78,  spr:0,  acc:8, dsc:13,vmax:21.9},
    {n:"Sierra Julieta",   min:63,dist:5815,mxm:92, ai15:432, ai18:111, spr:0,  acc:18,dsc:26,vmax:21.5},
    {n:"Silva Victoria",   min:56,dist:5830,mxm:102,ai15:672, ai18:144, spr:83, acc:19,dsc:34,vmax:25.3},
    {n:"Pollmann Marianne",min:63,dist:6143,mxm:97, ai15:683, ai18:95,  spr:0,  acc:7, dsc:34,vmax:20.7},
    {n:"Gacitua Emilia",   min:63,dist:6185,mxm:98, ai15:729, ai18:191, spr:127,acc:25,dsc:33,vmax:24.8},
  ]},
  {id:"pwccb2",label:"vs PWCC B",fecha:"25/04",tipo:"amistoso",
   prom:{dist:4858,mxm:106,hsr:494,h18:140,spr:2,acc:10,dsc:18,vmax:22.0},
   jugadoras:[
    {n:"Errazu Sofia",     min:10,dist:1245,mxm:124,ai15:210, ai18:52,  spr:0,  acc:2, dsc:3, vmax:20.9},
    {n:"Gomez Camila",     min:34,dist:3566,mxm:103,ai15:260, ai18:45,  spr:0,  acc:3, dsc:15,vmax:21.4},
    {n:"Sierra Julieta",   min:32,dist:3793,mxm:117,ai15:408, ai18:112, spr:0,  acc:8, dsc:14,vmax:21.9},
    {n:"Pollmann Marianne",min:48,dist:4954,mxm:102,ai15:443, ai18:92,  spr:0,  acc:5, dsc:14,vmax:21.3},
    {n:"Alfaro Javiera",   min:52,dist:5272,mxm:100,ai15:205, ai18:29,  spr:5,  acc:3, dsc:14,vmax:25.4},
    {n:"Muñoz Constanza",  min:58,dist:5391,mxm:91, ai15:309, ai18:44,  spr:0,  acc:4, dsc:9, vmax:21.0},
    {n:"Carrasco Sofia",   min:48,dist:5464,mxm:113,ai15:940, ai18:338, spr:0,  acc:18,dsc:43,vmax:23.3},
    {n:"Pareja Camila",    min:61,dist:5600,mxm:91, ai15:346, ai18:104, spr:0,  acc:9, dsc:15,vmax:21.1},
    {n:"Silva Victoria",   min:51,dist:5860,mxm:114,ai15:813, ai18:207, spr:0,  acc:25,dsc:30,vmax:22.8},
    {n:"Gutierrez Renata", min:61,dist:6082,mxm:99, ai15:527, ai18:123, spr:0,  acc:8, dsc:11,vmax:21.9},
    {n:"Gacitua Emilia",   min:56,dist:6210,mxm:109,ai15:976, ai18:391, spr:13, acc:22,dsc:30,vmax:26.0},
  ]},
];

// ─── ENTRENAMIENTOS — hoja Entrenamientos del Drive ───────────────────────────
// Columnas del Drive: HSR(>15) | Distancia AI(18-21) | Distancia Sprint(>21)
// h15 = HSR(>15) - h18 - spr (calculado)
// h18 = Distancia AI(18-21) DIRECTO del Drive
// spr = Distancia Sprint(>21) DIRECTO del Drive
// prom_h18 y prom_spr = promedio fila del Drive cuando existe

const ENTRENOS=[
  // ── 6-abr ─────────────────────────────────────────────────────────────────
  // Drive: Gomez/Sierra/Alfaro/Carrasco/Mateluna/Pareja/Pollmann/Gutierrez/Errazu/Gacitua
  // Prom del Drive: hsr=1631, h18=434, spr=11
  {id:"e01",label:"6/04",fecha:"6/04",tipo:"entreno",
   prom_hsr:1631,prom_h18:434,prom_spr:11,
   zonas:[
    {n:"Gomez Camila",      h15:782-70-0,   h18:70,  spr:0},
    {n:"Sierra Julieta",    h15:514-142-0,  h18:142, spr:0},
    {n:"Alfaro Javiera",    h15:1592-215-0, h18:215, spr:0},
    {n:"Carrasco Sofia",    h15:1910-839-0, h18:839, spr:0},
    {n:"Mateluna Florencia",h15:1863-386-18,h18:386, spr:18},
    {n:"Pareja Camila",     h15:1381-61-0,  h18:61,  spr:0},
    {n:"Pollmann Marianne", h15:1938-454-0, h18:454, spr:0},
    {n:"Gutierrez Renata",  h15:1927-302-0, h18:302, spr:0},
    {n:"Errazu Sofia",      h15:2151-952-0, h18:952, spr:0},
    {n:"Gacitua Emilia",    h15:2253-922-95,h18:922, spr:95},
   ],
   jugadoras:[
    {n:"Gomez Camila",      min:51,dist:5161,mxm:100,hsr:782, acc:2, dsc:9, vmax:20.1},
    {n:"Sierra Julieta",    min:52,dist:5566,mxm:106,hsr:514, acc:24,dsc:31,vmax:22.7},
    {n:"Alfaro Javiera",    min:54,dist:6144,mxm:113,hsr:1592,acc:6, dsc:16,vmax:20.6},
    {n:"Carrasco Sofia",    min:55,dist:6204,mxm:111,hsr:1910,acc:22,dsc:22,vmax:22.6},
    {n:"Mateluna Florencia",min:61,dist:6831,mxm:112,hsr:1863,acc:27,dsc:18,vmax:21.9},
    {n:"Pareja Camila",     min:66,dist:6945,mxm:105,hsr:1381,acc:7, dsc:8, vmax:21.5},
    {n:"Pollmann Marianne", min:65,dist:7322,mxm:111,hsr:1938,acc:11,dsc:29,vmax:23.0},
    {n:"Gutierrez Renata",  min:69,dist:7359,mxm:105,hsr:1927,acc:17,dsc:6, vmax:21.1},
    {n:"Errazu Sofia",      min:71,dist:7608,mxm:106,hsr:2151,acc:37,dsc:9, vmax:22.5},
    {n:"Gacitua Emilia",    min:71,dist:7916,mxm:110,hsr:2253,acc:29,dsc:33,vmax:24.5},
   ]},

  // ── 8-abr ─────────────────────────────────────────────────────────────────
  // Drive: Pareja/Carrasco/Gomez/Alfaro/Pollmann/Gutierrez/Mateluna/Gacitua (21min)
  // Prom del Drive: hsr=731, h18=386, spr=9 (calculado de jugadoras)
  {id:"e02",label:"8/04",fecha:"8/04",tipo:"entreno",
   prom_hsr:731,prom_h18:386,prom_spr:9,
   zonas:[
    {n:"Pareja Camila",     h15:635-195-0,  h18:195, spr:0},
    {n:"Carrasco Sofia",    h15:858-614-0,  h18:614, spr:0},
    {n:"Gomez Camila",      h15:685-120-2,  h18:120, spr:2},
    {n:"Alfaro Javiera",    h15:772-300-0,  h18:300, spr:0},
    {n:"Pollmann Marianne", h15:694-213-0,  h18:213, spr:0},
    {n:"Gutierrez Renata",  h15:823-421-0,  h18:421, spr:0},
    {n:"Mateluna Florencia",h15:816-364-3,  h18:364, spr:3},
    {n:"Gacitua Emilia",    h15:856-503-67, h18:503, spr:67},
   ],
   jugadoras:[
    {n:"Pareja Camila",     min:21,dist:1365,mxm:64, hsr:635, acc:44,dsc:23,vmax:20.6},
    {n:"Carrasco Sofia",    min:21,dist:1428,mxm:67, hsr:858, acc:47,dsc:40,vmax:23.5},
    {n:"Gomez Camila",      min:21,dist:1433,mxm:67, hsr:685, acc:35,dsc:25,vmax:21.0},
    {n:"Alfaro Javiera",    min:21,dist:1464,mxm:69, hsr:772, acc:42,dsc:28,vmax:21.1},
    {n:"Pollmann Marianne", min:21,dist:1487,mxm:70, hsr:694, acc:38,dsc:21,vmax:20.6},
    {n:"Gutierrez Renata",  min:21,dist:1545,mxm:72, hsr:823, acc:44,dsc:30,vmax:21.6},
    {n:"Mateluna Florencia",min:21,dist:1582,mxm:74, hsr:816, acc:50,dsc:25,vmax:21.1},
    {n:"Gacitua Emilia",    min:21,dist:1594,mxm:75, hsr:856, acc:46,dsc:27,vmax:22.9},
   ]},

  // ── 10-abr ─────────────────────────────────────────────────────────────────
  // Drive: solo Muñoz. Prom: hsr=1772, h18=913, spr=0
  {id:"e03",label:"10/04",fecha:"10/04",tipo:"entreno",
   prom_hsr:1772,prom_h18:913,prom_spr:0,
   zonas:[
    {n:"Muñoz Constanza",h15:1772-913-0,h18:913,spr:0},
   ],
   jugadoras:[
    {n:"Muñoz Constanza",min:33,dist:2667,mxm:82,hsr:1772,acc:8,dsc:1,vmax:20.9},
   ]},

  // ── 13-abr ─────────────────────────────────────────────────────────────────
  // Drive: Arau/Gomez/Gacitua/Pareja/Alfaro/Retamal/Gutierrez/Carrasco/Mateluna/Sepulveda
  {id:"e04",label:"13/04",fecha:"13/04",tipo:"entreno",
   prom_hsr:1029,prom_h18:538,prom_spr:50,
   zonas:[
    {n:"Arau Maria",        h15:23-4-0,    h18:4,   spr:0},
    {n:"Gomez Camila",      h15:290-10-0,  h18:10,  spr:0},
    {n:"Gacitua Emilia",    h15:1374-725-124,h18:725,spr:124},
    {n:"Pareja Camila",     h15:954-265-15,h18:265, spr:15},
    {n:"Alfaro Javiera",    h15:1168-506-42,h18:506,spr:42},
    {n:"Retamal Antonia",   h15:1364-474-82,h18:474,spr:82},
    {n:"Gutierrez Renata",  h15:998-331-9, h18:331, spr:9},
    {n:"Carrasco Sofia",    h15:1502-841-119,h18:841,spr:119},
    {n:"Mateluna Florencia",h15:1196-434-71,h18:434,spr:71},
    {n:"Sepulveda Eileen",  h15:1409-768-35,h18:768,spr:35},
   ],
   jugadoras:[
    {n:"Arau Maria",        min:68,dist:1710,mxm:25, hsr:23,  acc:9, dsc:0, vmax:18.6},
    {n:"Gomez Camila",      min:72,dist:3574,mxm:50, hsr:290, acc:3, dsc:17,vmax:18.5},
    {n:"Gacitua Emilia",    min:72,dist:5052,mxm:70, hsr:1374,acc:45,dsc:27,vmax:27.7},
    {n:"Pareja Camila",     min:72,dist:5118,mxm:71, hsr:954, acc:29,dsc:16,vmax:24.6},
    {n:"Alfaro Javiera",    min:72,dist:5318,mxm:74, hsr:1168,acc:29,dsc:28,vmax:25.3},
    {n:"Retamal Antonia",   min:72,dist:5507,mxm:76, hsr:1364,acc:42,dsc:35,vmax:25.4},
    {n:"Gutierrez Renata",  min:72,dist:5525,mxm:77, hsr:998, acc:27,dsc:23,vmax:24.5},
    {n:"Carrasco Sofia",    min:72,dist:5552,mxm:77, hsr:1502,acc:51,dsc:58,vmax:26.4},
    {n:"Mateluna Florencia",min:72,dist:5944,mxm:82, hsr:1196,acc:48,dsc:37,vmax:25.9},
    {n:"Sepulveda Eileen",  min:72,dist:6197,mxm:86, hsr:1409,acc:47,dsc:44,vmax:25.1},
   ]},

  // ── 15-abr ─────────────────────────────────────────────────────────────────
  {id:"e05",label:"15/04",fecha:"15/04",tipo:"entreno",
   prom_hsr:553,prom_h18:145,prom_spr:2,
   zonas:[
    {n:"Errazu Sofia",     h15:258-66-0,  h18:66,  spr:0},
    {n:"Sierra Julieta",   h15:408-112-0, h18:112, spr:0},
    {n:"Gomez Camila",     h15:320-65-0,  h18:65,  spr:0},
    {n:"Pollmann Marianne",h15:443-92-0,  h18:92,  spr:0},
    {n:"Alfaro Javiera",   h15:236-35-5,  h18:35,  spr:5},
    {n:"Muñoz Constanza",  h15:351-46-0,  h18:46,  spr:0},
    {n:"Silva Victoria",   h15:813-207-0, h18:207, spr:0},
    {n:"Carrasco Sofia",   h15:1019-382-0,h18:382, spr:0},
    {n:"Pareja Camila",    h15:396-112-0, h18:112, spr:0},
    {n:"Gutierrez Renata", h15:596-146-0, h18:146, spr:0},
    {n:"Gacitua Emilia",   h15:1064-434-13,h18:434,spr:13},
   ],
   jugadoras:[
    {n:"Errazu Sofia",     min:16,dist:1558,mxm:95, hsr:258, acc:9, dsc:7, vmax:20.9},
    {n:"Sierra Julieta",   min:32,dist:3793,mxm:117,hsr:408, acc:8, dsc:14,vmax:21.9},
    {n:"Gomez Camila",     min:41,dist:3979,mxm:97, hsr:320, acc:14,dsc:16,vmax:21.4},
    {n:"Pollmann Marianne",min:55,dist:4954,mxm:102,hsr:443, acc:5, dsc:14,vmax:21.3},
    {n:"Alfaro Javiera",   min:59,dist:5627,mxm:95, hsr:236, acc:10,dsc:16,vmax:25.4},
    {n:"Muñoz Constanza",  min:65,dist:5780,mxm:88, hsr:351, acc:13,dsc:9, vmax:21.0},
    {n:"Silva Victoria",   min:51,dist:5860,mxm:114,hsr:813, acc:25,dsc:30,vmax:22.8},
    {n:"Carrasco Sofia",   min:54,dist:5897,mxm:108,hsr:1019,acc:31,dsc:50,vmax:23.3},
    {n:"Pareja Camila",    min:67,dist:6049,mxm:89, hsr:396, acc:19,dsc:15,vmax:21.1},
    {n:"Gutierrez Renata", min:67,dist:6505,mxm:96, hsr:596, acc:21,dsc:18,vmax:21.9},
    {n:"Gacitua Emilia",   min:63,dist:6694,mxm:106,hsr:1064,acc:36,dsc:33,vmax:26.0},
   ]},

  // ── 17-abr ─────────────────────────────────────────────────────────────────
  // Prom fila Drive: hsr=139, h18=66, spr=0
  {id:"e06",label:"17/04",fecha:"17/04",tipo:"entreno",
   prom_hsr:139,prom_h18:66,prom_spr:0,
   zonas:[
    {n:"Arau Maria",        h15:3-0-0,    h18:0,  spr:0},
    {n:"Gomez Camila",      h15:113-14-0, h18:14, spr:0},
    {n:"Alfaro Javiera",    h15:145-68-0, h18:68, spr:0},
    {n:"Gutierrez Renata",  h15:139-59-0, h18:59, spr:0},
    {n:"Pareja Camila",     h15:116-40-0, h18:40, spr:0},
    {n:"Carrasco Sofia",    h15:189-98-0, h18:98, spr:0},
    {n:"Gacitua Emilia",    h15:201-120-0,h18:120,spr:0},
    {n:"Errazu Sofia",      h15:188-105-0,h18:105,spr:0},
    {n:"Mateluna Florencia",h15:185-89-0, h18:89, spr:0},
   ],
   jugadoras:[
    {n:"Arau Maria",        min:9, dist:384, mxm:42,hsr:3,  acc:7, dsc:2, vmax:15.6},
    {n:"Gomez Camila",      min:25,dist:987, mxm:39,hsr:113,acc:27,dsc:8, vmax:18.5},
    {n:"Alfaro Javiera",    min:25,dist:993, mxm:39,hsr:145,acc:28,dsc:10,vmax:21.1},
    {n:"Gutierrez Renata",  min:25,dist:994, mxm:40,hsr:139,acc:30,dsc:9, vmax:20.4},
    {n:"Pareja Camila",     min:25,dist:1028,mxm:41,hsr:116,acc:26,dsc:7, vmax:19.4},
    {n:"Carrasco Sofia",    min:25,dist:1035,mxm:41,hsr:189,acc:33,dsc:13,vmax:21.0},
    {n:"Gacitua Emilia",    min:25,dist:1095,mxm:44,hsr:201,acc:29,dsc:8, vmax:22.0},
    {n:"Errazu Sofia",      min:25,dist:1133,mxm:45,hsr:188,acc:30,dsc:10,vmax:20.7},
    {n:"Mateluna Florencia",min:25,dist:1146,mxm:46,hsr:185,acc:37,dsc:6, vmax:20.8},
   ]},

  // ── 20-abr ─────────────────────────────────────────────────────────────────
  {id:"e07",label:"20/04",fecha:"20/04",tipo:"entreno",
   prom_hsr:1163,prom_h18:354,prom_spr:9,
   zonas:[
    {n:"Pareja Camila",     h15:1381-61-0,  h18:61,  spr:0},
    {n:"Carrasco Sofia",    h15:1910-839-0, h18:839, spr:0},
    {n:"Gomez Camila",      h15:685-120-2,  h18:120, spr:2},
    {n:"Alfaro Javiera",    h15:772-300-0,  h18:300, spr:0},
    {n:"Pollmann Marianne", h15:694-213-0,  h18:213, spr:0},
    {n:"Gutierrez Renata",  h15:823-421-0,  h18:421, spr:0},
    {n:"Mateluna Florencia",h15:816-364-3,  h18:364, spr:3},
    {n:"Gacitua Emilia",    h15:856-503-67, h18:503, spr:67},
   ],
   jugadoras:[
    {n:"Pareja Camila",     min:13,dist:2059,mxm:152,hsr:1110,acc:2, dsc:0, vmax:19.9},
    {n:"Alfaro Javiera",    min:17,dist:2060,mxm:118,hsr:1159,acc:4, dsc:1, vmax:20.6},
    {n:"Carrasco Sofia",    min:18,dist:2173,mxm:115,hsr:1306,acc:8, dsc:0, vmax:22.6},
    {n:"Pollmann Marianne", min:15,dist:2189,mxm:141,hsr:1428,acc:2, dsc:1, vmax:20.9},
    {n:"Gomez Camila",      min:19,dist:2263,mxm:118,hsr:591, acc:0, dsc:3, vmax:19.1},
    {n:"Errazu Sofia",      min:18,dist:2271,mxm:121,hsr:1446,acc:27,dsc:1, vmax:21.7},
    {n:"Gutierrez Renata",  min:17,dist:2311,mxm:134,hsr:1551,acc:10,dsc:0, vmax:20.2},
    {n:"Mateluna Florencia",min:19,dist:2377,mxm:124,hsr:1440,acc:19,dsc:1, vmax:20.6},
    {n:"Gacitua Emilia",    min:19,dist:2571,mxm:135,hsr:1604,acc:7, dsc:4, vmax:21.4},
   ]},

  // ── 22-abr ─────────────────────────────────────────────────────────────────
  {id:"e08",label:"22/04",fecha:"22/04",tipo:"entreno",
   prom_hsr:983,prom_h18:508,prom_spr:40,
   zonas:[
    {n:"Sepulveda Eileen",  h15:82-47-5,    h18:47,  spr:5},
    {n:"Alfaro Javiera",    h15:366-244-22, h18:244, spr:22},
    {n:"Retamal Antonia",   h15:839-603-29, h18:603, spr:29},
    {n:"Pareja Camila",     h15:915-348-1,  h18:348, spr:1},
    {n:"Gutierrez Renata",  h15:1076-400-38,h18:400, spr:38},
    {n:"Carrasco Sofia",    h15:1215-818-59,h18:818, spr:59},
    {n:"Mateluna Florencia",h15:1160-638-26,h18:638, spr:26},
    {n:"Gacitua Emilia",    h15:1207-763-138,h18:763,spr:138},
   ],
   jugadoras:[
    {n:"Sepulveda Eileen",  min:5, dist:396, mxm:71, hsr:82,  acc:5, dsc:0, vmax:24.5},
    {n:"Alfaro Javiera",    min:7, dist:720, mxm:98, hsr:366, acc:15,dsc:3, vmax:25.5},
    {n:"Retamal Antonia",   min:11,dist:1288,mxm:111,hsr:839, acc:29,dsc:28,vmax:25.4},
    {n:"Pareja Camila",     min:16,dist:1828,mxm:111,hsr:915, acc:35,dsc:5, vmax:24.1},
    {n:"Gutierrez Renata",  min:16,dist:1883,mxm:114,hsr:1076,acc:31,dsc:19,vmax:25.4},
    {n:"Carrasco Sofia",    min:16,dist:1902,mxm:116,hsr:1215,acc:44,dsc:15,vmax:25.5},
    {n:"Mateluna Florencia",min:16,dist:1956,mxm:119,hsr:1160,acc:47,dsc:11,vmax:25.1},
    {n:"Gacitua Emilia",    min:16,dist:1976,mxm:120,hsr:1207,acc:40,dsc:14,vmax:27.1},
   ]},

  // ── 29-abr ─────────────────────────────────────────────────────────────────
  {id:"e09",label:"29/04",fecha:"29/04",tipo:"entreno",
   prom_hsr:589,prom_h18:62,prom_spr:0,
   zonas:[
    {n:"Arau Maria",       h15:39-0-0,    h18:0,   spr:0},
    {n:"Pollmann Marianne",h15:441-52-0,  h18:52,  spr:0},
    {n:"Gomez Camila",     h15:325-8-0,   h18:8,   spr:0},
    {n:"Pareja Camila",    h15:452-22-0,  h18:22,  spr:0},
    {n:"Alfaro Javiera",   h15:417-24-0,  h18:24,  spr:0},
    {n:"Retamal Antonia",  h15:622-43-0,  h18:43,  spr:0},
    {n:"Gacitua Emilia",   h15:904-112-0, h18:112, spr:0},
    {n:"Carrasco Sofia",   h15:1221-238-0,h18:238, spr:0},
    {n:"Sepulveda Eileen", h15:833-86-0,  h18:86,  spr:0},
   ],
   jugadoras:[
    {n:"Arau Maria",       min:57,dist:1413,mxm:24,hsr:39,  acc:7, dsc:1, vmax:17.0},
    {n:"Pollmann Marianne",min:47,dist:3472,mxm:74,hsr:441, acc:35,dsc:20,vmax:19.9},
    {n:"Gomez Camila",     min:47,dist:3557,mxm:75,hsr:325, acc:20,dsc:32,vmax:18.9},
    {n:"Pareja Camila",    min:47,dist:3807,mxm:80,hsr:452, acc:44,dsc:32,vmax:21.4},
    {n:"Alfaro Javiera",   min:47,dist:3960,mxm:84,hsr:417, acc:20,dsc:22,vmax:21.0},
    {n:"Retamal Antonia",  min:47,dist:4183,mxm:88,hsr:622, acc:45,dsc:26,vmax:20.8},
    {n:"Gacitua Emilia",   min:52,dist:4407,mxm:83,hsr:904, acc:66,dsc:57,vmax:22.3},
    {n:"Carrasco Sofia",   min:52,dist:4906,mxm:93,hsr:1221,acc:64,dsc:71,vmax:22.7},
    {n:"Sepulveda Eileen", min:52,dist:5087,mxm:96,hsr:833, acc:47,dsc:46,vmax:20.2},
   ]},

  // ── 4-may ──────────────────────────────────────────────────────────────────
  {id:"e10",label:"4/05",fecha:"4/05",tipo:"entreno",
   prom_hsr:757,prom_h18:402,prom_spr:0,
   zonas:[
    {n:"Errazu Sofia",     h15:639-332-3,  h18:332, spr:3},
    {n:"Pollmann Marianne",h15:646-232-0,  h18:232, spr:0},
    {n:"Gutierrez Renata", h15:709-54-0,   h18:54,  spr:0},
    {n:"Gomez Camila",     h15:511-52-0,   h18:52,  spr:0},
    {n:"Pastenes Nicole",  h15:418-101-0,  h18:101, spr:0},
    {n:"Carrasco Sofia",   h15:961-525-0,  h18:525, spr:0},
    {n:"Mateluna Florencia",h15:1002-297-0,h18:297, spr:0},
    {n:"Gacitua Emilia",   h15:895-501-0,  h18:501, spr:0},
    {n:"Sepulveda Eileen", h15:947-564-0,  h18:564, spr:0},
   ],
   jugadoras:[
    {n:"Errazu Sofia",     min:12,dist:1123,mxm:88, hsr:639, acc:12,dsc:8, vmax:24.5},
    {n:"Pollmann Marianne",min:15,dist:1349,mxm:110,hsr:646, acc:9, dsc:4, vmax:23.1},
    {n:"Gutierrez Renata", min:15,dist:1477,mxm:95, hsr:709, acc:4, dsc:0, vmax:19.6},
    {n:"Gomez Camila",     min:15,dist:1536,mxm:97, hsr:511, acc:5, dsc:3, vmax:20.9},
    {n:"Pastenes Nicole",  min:15,dist:1582,mxm:100,hsr:418, acc:3, dsc:1, vmax:21.7},
    {n:"Carrasco Sofia",   min:15,dist:1638,mxm:106,hsr:961, acc:20,dsc:11,vmax:23.8},
    {n:"Mateluna Florencia",min:15,dist:1666,mxm:108,hsr:1002,acc:27,dsc:8,vmax:21.0},
    {n:"Gacitua Emilia",   min:15,dist:1693,mxm:109,hsr:895, acc:16,dsc:9, vmax:23.7},
    {n:"Sepulveda Eileen", min:15,dist:1714,mxm:115,hsr:947, acc:23,dsc:11,vmax:23.6},
   ]},
  // ── Nuevo entreno (post 4/05) ─────────────────────────────────────────────
  {id:"e11",label:"11/05",fecha:"11/05",tipo:"entreno",
   prom_hsr:252,prom_h18:47,prom_spr:0,
   zonas:[
    {n:"Arau Maria",        h15:32,  h18:0,   spr:0},
    {n:"Gomez Camila",      h15:122, h18:17,  spr:0},
    {n:"Gutierrez Renata",  h15:180, h18:51,  spr:0},
    {n:"Carrasco Sofia",    h15:327, h18:84,  spr:0},
    {n:"Mateluna Florencia",h15:175, h18:34,  spr:0},
    {n:"Pareja Camila",     h15:260, h18:26,  spr:0},
    {n:"Alfaro Javiera",    h15:161, h18:46,  spr:0},
    {n:"Hevia Valentina",   h15:190, h18:26,  spr:0},
    {n:"Gacitua Emilia",    h15:206, h18:184, spr:0},
    {n:"Errazu Sofia",      h15:284, h18:68,  spr:0},
    {n:"Retamal Antonia",   h15:243, h18:62,  spr:0},
   ],
   jugadoras:[
    {n:"Arau Maria",        min:65,dist:1935,mxm:30, hsr:32,  acc:8, dsc:6, vmax:17.4},
    {n:"Gomez Camila",      min:65,dist:3262,mxm:50, hsr:139, acc:16,dsc:22,vmax:19.3},
    {n:"Gutierrez Renata",  min:65,dist:3604,mxm:55, hsr:231, acc:33,dsc:24,vmax:21.1},
    {n:"Carrasco Sofia",    min:65,dist:3628,mxm:56, hsr:411, acc:46,dsc:66,vmax:20.4},
    {n:"Mateluna Florencia",min:65,dist:3660,mxm:56, hsr:209, acc:39,dsc:31,vmax:21.0},
    {n:"Pareja Camila",     min:65,dist:3773,mxm:58, hsr:286, acc:29,dsc:22,vmax:21.8},
    {n:"Alfaro Javiera",    min:65,dist:3820,mxm:59, hsr:207, acc:26,dsc:33,vmax:20.6},
    {n:"Hevia Valentina",   min:65,dist:3892,mxm:60, hsr:216, acc:30,dsc:28,vmax:19.4},
    {n:"Gacitua Emilia",    min:65,dist:4008,mxm:62, hsr:390, acc:41,dsc:45,vmax:23.3},
    {n:"Errazu Sofia",      min:65,dist:4020,mxm:62, hsr:352, acc:39,dsc:38,vmax:21.7},
    {n:"Retamal Antonia",   min:65,dist:4083,mxm:63, hsr:305, acc:36,dsc:50,vmax:20.7},
   ]},
];

  // ── 11-may

// ─── MINUTOS DE JUEGO — hoja "Minutos de Juego" del Drive ────────────────────
// Columnas: JUGADORA | DIV | COGS | PWCC | MANQ A | CAT B | TOT | PROM
const MINUTOS=[
  {n:"Alfaro Javiera",   div:"1era",cogs:null,pwcc:null,manq:22,  catb:27,  tot:49,  prom:24.5},
  {n:"Arau María Paz",   div:"1era",cogs:60,  pwcc:60,  manq:60,  catb:null,tot:180, prom:60.0},
  {n:"Carrasco Sofia",   div:"1era",cogs:null,pwcc:null,manq:35,  catb:26,  tot:61,  prom:30.5},
  {n:"Gacitua Emilia",   div:"1era",cogs:null,pwcc:null,manq:60,  catb:65,  tot:125, prom:62.5},
  {n:"Gomez Camila",     div:"1era",cogs:null,pwcc:null,manq:40,  catb:40,  tot:80,  prom:40.0},
  {n:"Gutierrez Renata", div:"1era",cogs:60,  pwcc:60,  manq:60,  catb:65,  tot:245, prom:61.3},
  {n:"Liu Macarena",     div:"1era",cogs:null,pwcc:null,manq:43,  catb:null,tot:43,  prom:43.0},
  {n:"Mateluna Florencia",div:"1era",cogs:null,pwcc:null,manq:21, catb:null,tot:21,  prom:21.0},
  {n:"Muñoz Constanza",  div:"1era",cogs:60,  pwcc:60,  manq:53,  catb:65,  tot:238, prom:59.5},
  {n:"Pareja Camila",    div:"1era",cogs:60,  pwcc:60,  manq:60,  catb:65,  tot:245, prom:61.3},
  {n:"Pollmann Marianne",div:"1era",cogs:null,pwcc:null,manq:60,  catb:64,  tot:124, prom:62.0},
  {n:"Errazu Sofia",     div:"S16", cogs:null,pwcc:null,manq:35,  catb:44,  tot:79,  prom:39.5},
  {n:"Sierra Julieta",   div:"S16", cogs:null,pwcc:null,manq:60,  catb:65,  tot:125, prom:62.5},
  {n:"Silva Victoria",   div:"S16", cogs:null,pwcc:null,manq:60,  catb:65,  tot:125, prom:62.5},
];

// ─── YO-YO — hoja YOYO RIN1 del Drive "Old Gabs 1era" ────────────────────────
// Bloque 1era: 5 jugadoras registradas
// Clasificación: >16.5 verde | 14.6-16.4 amarillo | <14.6 rojo
// Podio por NIVEL ALCANZADO
// ─── YO-YO — hoja YOYO RIN1, 15/4/26 ────────────────────────────────────────
// Columnas: Nº | JUGADORA | PUESTO | Nivel-Subnivel | Distancia Alcanzada |
//   Vel. Alcanzada km/h | Vel. Alcanzada m/s | VO2 Máx (ml/kg/min) | VAM
// Clasificación nivel: >17 verde | 15.5-17 amarillo | <15.5 rojo
// Podio por NIVEL ALCANZADO
const YOYO=[
  {n:"Alfaro Javiera",  puesto:"WG",nivel:15.1,dist:800, kmh:15.0,ms:4.2,vo2:43.1,vam:3.4},
  {n:"Carrasco Sofia",  puesto:"VL",nivel:17.1,dist:1440,kmh:16.0,ms:4.4,vo2:48.5,vam:3.8},
  {n:"Gacitua Emilia",  puesto:"VL",nivel:16.7,dist:1360,kmh:15.5,ms:4.3,vo2:47.8,vam:3.8},
  {n:"Gomez Camila",    puesto:"LT",nivel:15.2,dist:840, kmh:15.0,ms:4.2,vo2:43.5,vam:3.4},
  {n:"Liu Macarena",    puesto:"WG",nivel:15.7,dist:1040,kmh:15.0,ms:4.2,vo2:45.1,vam:3.6},
  {n:"Pareja Camila",   puesto:"DC",nivel:15.1,dist:800, kmh:15.0,ms:4.2,vo2:43.1,vam:3.4},
  {n:"Pollmann Marianne",puesto:"DL",nivel:15.1,dist:800,kmh:15.0,ms:4.2,vo2:43.1,vam:3.4},
  {n:"Retamal Antonia", puesto:"LT",nivel:15.1,dist:800, kmh:15.0,ms:4.2,vo2:43.1,vam:3.4},
  {n:"Sepulveda Eileen",puesto:"DL",nivel:16.7,dist:1360,kmh:15.5,ms:4.3,vo2:47.8,vam:3.8},
];
// Promedio/Máx/Mín del sheet: prom=15.8/1027/15.2/4.2/41.9/3.6 max=17.1/1440/16.0/4.4/48.5/3.8
const yoyoColor=v=>v>=17?"#3ecf7a":v>=15.5?"#e09020":"#e05555";
const yoyoLabel=v=>v>=17?"Verde (≥17)":v>=15.5?"Amarillo (15.5–16.9)":"Rojo (<15.5)";
const yoyoGrupo=ms=>ms>=4.3?"Grupo 1 ≥4.3 m/s":ms>=4.2?"Grupo 2 — 4.2 m/s":"Grupo 3 <4.2 m/s";

// ─── PERFIL PUESTOS — solo partidos oficiales, solo ≥45 minutos ──────────────
// Calculado desde datos individuales de PARTIDOS (COGS + PWCC + MANQ + CAT B)
// Solo filas con min ≥ 45

const PERFIL_PUESTOS=[
  {
    p:"DC", nombre:"Def. Central",
    jugadoras:["Pareja Camila","Muñoz Constanza"],
    // Pareja: COGS(64),PWCC(66),MANQ(71),CATB(65) | Muñoz: COGS(61),PWCC(66),MANQ(63),CATB(65)
    filas:[
      {n:"Pareja Camila", min:64,dist:5617,hsr:255,h18:57,spr:0,acc:5,dsc:10,vmax:23.0},
      {n:"Pareja Camila", min:66,dist:5308,hsr:339,h18:73,spr:0,acc:6,dsc:9, vmax:22.7},
      {n:"Pareja Camila", min:71,dist:6123,hsr:281,h18:62,spr:0,acc:11,dsc:20,vmax:21.2},
      {n:"Pareja Camila", min:65,dist:6121,hsr:355,h18:87,spr:0,acc:15,dsc:16,vmax:22.4},
      {n:"Muñoz Constanza",min:61,dist:5702,hsr:575,h18:198,spr:0,acc:7,dsc:20,vmax:23.9},
      {n:"Muñoz Constanza",min:66,dist:5406,hsr:462,h18:224,spr:0,acc:19,dsc:18,vmax:22.5},
      {n:"Muñoz Constanza",min:63,dist:5384,hsr:397,h18:82,spr:0,acc:12,dsc:17,vmax:21.6},
      {n:"Muñoz Constanza",min:65,dist:6258,hsr:390,h18:125,spr:0,acc:6,dsc:12,vmax:22.6},
    ]
  },
  {
    p:"LT", nombre:"Lateral",
    jugadoras:["Gomez Camila","Gutierrez Renata"],
    // Gomez: COGS(48),PWCC(41<45→excl),MANQ(49),CATB(40<45→excl)
    // Gutierrez: COGS(63),PWCC(66),MANQ(71),CATB(65)
    filas:[
      {n:"Gomez Camila",    min:48,dist:4630,hsr:317,h18:16,spr:0,acc:5,dsc:10,vmax:20.2},
      {n:"Gomez Camila",    min:49,dist:4744,hsr:484,h18:63,spr:0,acc:5,dsc:18,vmax:20.3},
      {n:"Gutierrez Renata",min:63,dist:6808,hsr:582,h18:106,spr:0,acc:9,dsc:17,vmax:20.1},
      {n:"Gutierrez Renata",min:66,dist:6754,hsr:603,h18:113,spr:0,acc:8,dsc:15,vmax:21.3},
      {n:"Gutierrez Renata",min:71,dist:6822,hsr:715,h18:280,spr:0,acc:14,dsc:24,vmax:22.9},
      {n:"Gutierrez Renata",min:65,dist:6806,hsr:551,h18:112,spr:0,acc:19,dsc:18,vmax:21.1},
    ]
  },
  {
    p:"MC", nombre:"Med. Central",
    jugadoras:["Sierra Julieta"],
    // Sierra: COGS(58),PWCC(61),MANQ(71),CATB(65)
    filas:[
      {n:"Sierra Julieta",min:58,dist:6558,hsr:871,h18:275,spr:0, acc:13,dsc:30,vmax:23.9},
      {n:"Sierra Julieta",min:61,dist:6632,hsr:1061,h18:357,spr:0,acc:28,dsc:39,vmax:22.6},
      {n:"Sierra Julieta",min:71,dist:7929,hsr:1086,h18:318,spr:11,acc:39,dsc:61,vmax:24.6},
      {n:"Sierra Julieta",min:65,dist:6676,hsr:594,h18:225,spr:0, acc:27,dsc:40,vmax:23.1},
    ]
  },
  {
    p:"VL", nombre:"Volante",
    jugadoras:["Silva Victoria","Gacitua Emilia","Carrasco Sofia"],
    // Silva: COGS(57),PWCC(49→excl),MANQ(71),CATB(65) | Gacitua: COGS(52),PWCC(66),MANQ(71),CATB(65)
    // Carrasco: COGS(excl<45),PWCC(46),MANQ(32→excl),CATB(26→excl)
    filas:[
      {n:"Silva Victoria", min:57,dist:6681,hsr:1191,h18:310,spr:108,acc:25,dsc:45,vmax:23.4},
      {n:"Silva Victoria", min:71,dist:8142,hsr:1469,h18:570,spr:16, acc:45,dsc:52,vmax:24.7},
      {n:"Silva Victoria", min:65,dist:7723,hsr:1096,h18:419,spr:7,  acc:31,dsc:44,vmax:24.8},
      {n:"Gacitua Emilia", min:52,dist:5578,hsr:840, h18:235,spr:137,acc:32,dsc:40,vmax:25.2},
      {n:"Gacitua Emilia", min:66,dist:6960,hsr:1055,h18:263,spr:157,acc:28,dsc:31,vmax:24.1},
      {n:"Gacitua Emilia", min:71,dist:7854,hsr:1137,h18:319,spr:0,  acc:38,dsc:48,vmax:23.4},
      {n:"Gacitua Emilia", min:65,dist:7339,hsr:958, h18:364,spr:9,  acc:29,dsc:35,vmax:25.1},
      {n:"Carrasco Sofia", min:46,dist:5631,hsr:1121,h18:378,spr:0,  acc:17,dsc:22,vmax:22.9},
    ]
  },
  {
    p:"WG", nombre:"Wing",
    jugadoras:["Alfaro Javiera","Errazu Sofia","Liu Macarena"],
    // Alfaro: COGS(45),PWCC(excl),MANQ(28<45→excl),CATB(27<45→excl)
    // Errazu: COGS(56),PWCC(50),MANQ(excl),CATB(44<45→excl)
    // Liu: MANQ(47<45→excl)
    filas:[
      {n:"Alfaro Javiera",min:45,dist:4961,hsr:351,h18:42,spr:0,acc:6,dsc:15,vmax:20.8},
      {n:"Errazu Sofia",  min:56,dist:6298,hsr:434,h18:69,spr:0,acc:24,dsc:21,vmax:20.7},
      {n:"Errazu Sofia",  min:50,dist:5528,hsr:622,h18:159,spr:0,acc:22,dsc:17,vmax:21.8},
    ]
  },
  {
    p:"DL", nombre:"Del. Central",
    jugadoras:["Pollmann Marianne"],
    // Pollmann: COGS(60),PWCC(57),MANQ(71),CATB(64)
    filas:[
      {n:"Pollmann Marianne",min:60,dist:6162,hsr:677,h18:179,spr:0,acc:12,dsc:17,vmax:22.4},
      {n:"Pollmann Marianne",min:57,dist:5945,hsr:487,h18:90, spr:0,acc:15,dsc:14,vmax:20.3},
      {n:"Pollmann Marianne",min:71,dist:6952,hsr:653,h18:123,spr:0,acc:27,dsc:14,vmax:21.9},
      {n:"Pollmann Marianne",min:64,dist:5874,hsr:567,h18:169,spr:0,acc:17,dsc:19,vmax:22.9},
    ]
  },
];

// Helper para calcular promedio de un campo en filas
const pProm=(p,k)=>{const v=p.filas.map(f=>f[k]).filter(x=>x!=null&&x>=0);return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0;};
const pPromF=(p,k)=>{const v=p.filas.map(f=>f[k]).filter(x=>x!=null&&x>=0);return v.length?parseFloat((v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)):0;};

// ─── PERFIL PUESTOS — calculado de partidos oficiales, solo ≥45 min ──────────
// Datos del Drive (tabla Demandas Físicas), recalculado con nuevo partido UC B
// h15 = hsr - ai18 - spr | h18 = ai18 directo del Drive
const PUESTOS=[
  // DC: Pareja (4P) + Muñoz (4P) — todos ≥45 min
  {p:"DC",n:"Def. Central",
   jugadoras:[
     {n:"Pareja Camila",   partidos:4, dist:5792,hsr:307,ai18:70, spr:0,acc:9, dsc:14,vmax:23.0},
     {n:"Muñoz Constanza", partidos:4, dist:5688,hsr:456,ai18:157,spr:0,acc:11,dsc:17,vmax:23.9},
   ],
   dist:5740,hsr:382,ai18:114,spr:0,acc:10,dsc:16,vmax:23.5},

  // LT: Gomez (3P ≥45) + Gutierrez (4P ≥45)
  {p:"LT",n:"Lateral",
   jugadoras:[
     {n:"Gomez Camila",    partidos:3, dist:4457,hsr:457,ai18:70, spr:1,acc:6, dsc:14,vmax:21.0},
     {n:"Gutierrez Renata",partidos:4, dist:6798,hsr:613,ai18:153,spr:0,acc:13,dsc:19,vmax:22.9},
   ],
   dist:5628,hsr:535,ai18:112,spr:0,acc:10,dsc:17,vmax:22.0},

  // MC: Sierra (4P ≥45)
  {p:"MC",n:"Med. Central",
   jugadoras:[
     {n:"Sierra Julieta",  partidos:4, dist:6949,hsr:903,ai18:294,spr:3,acc:27,dsc:43,vmax:24.6},
   ],
   dist:6949,hsr:903,ai18:294,spr:3,acc:27,dsc:43,vmax:24.6},

  // VL: Silva (4P) + Carrasco (1P ≥45) + Gacitua (4P)
  {p:"VL",n:"Volante",
   jugadoras:[
     {n:"Silva Victoria",  partidos:4, dist:7088,hsr:1294,ai18:420,spr:84,acc:33,dsc:44,vmax:24.8},
     {n:"Carrasco Sofia",  partidos:1, dist:5631,hsr:1121,ai18:378,spr:0, acc:17,dsc:22,vmax:22.9},
     {n:"Gacitua Emilia",  partidos:4, dist:6933,hsr:998, ai18:295,spr:42,acc:32,dsc:39,vmax:25.2},
   ],
   dist:6551,hsr:1138,ai18:364,spr:42,acc:27,dsc:35,vmax:25.2},

  // WG: Alfaro (1P ≥45) + Errazu (2P ≥45) + Liu (1P ≥45)
  {p:"WG",n:"Wing",
   jugadoras:[
     {n:"Alfaro Javiera",  partidos:1, dist:4961,hsr:351,ai18:42, spr:0,acc:6, dsc:15,vmax:20.8},
     {n:"Errazu Sofia",    partidos:2, dist:5913,hsr:528,ai18:114,spr:0,acc:23,dsc:19,vmax:21.3},
     {n:"Liu Macarena",    partidos:1, dist:5532,hsr:883,ai18:266,spr:0,acc:22,dsc:26,vmax:22.5},
   ],
   dist:5469,hsr:587,ai18:141,spr:0,acc:17,dsc:20,vmax:22.5},

  // DL: Pollmann (4P ≥45)
  {p:"DL",n:"Del. Central",
   jugadoras:[
     {n:"Pollmann Marianne",partidos:4,dist:6233,hsr:596,ai18:140,spr:0,acc:18,dsc:16,vmax:22.4},
   ],
   dist:6233,hsr:596,ai18:140,spr:0,acc:18,dsc:16,vmax:22.4},
];
// Promedio general (todos los puestos)
const PROM_PUESTO={
  dist:Math.round([5740,5628,6949,6551,5469,6233].reduce((a,b)=>a+b,0)/6),
  hsr: Math.round([382,535,903,1138,587,596].reduce((a,b)=>a+b,0)/6),
  ai18:Math.round([114,112,294,364,141,140].reduce((a,b)=>a+b,0)/6),
  acc: Math.round([10,10,27,27,17,18].reduce((a,b)=>a+b,0)/6),
  dsc: Math.round([16,17,43,35,20,16].reduce((a,b)=>a+b,0)/6),
  vmax:((23.5+22.0+24.6+25.2+22.5+22.4)/6).toFixed(1),
};

// ─── ASISTENCIA — hoja PF Old Gabs (datos previos del Drive) ─────────────────
const ATT_FECHAS=["10/3","12/3","17/3","19/3","21/3","24/3","26/3","28/3","31/3","16/4","21/4","23/4","25/4","28/4","30/4","2/5"];
const ASISTENCIA={
  "Alfaro Javiera":    {mar:"89%",abr:"83%",may:"—",tot:"85%",dias:[1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1]},
  "Arau María Paz":    {mar:"100%",abr:"100%",may:"—",tot:"100%",dias:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0]},
  "Carrasco Sofia":    {mar:"—",abr:"100%",may:"—",tot:"100%",dias:[0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1]},
  "Gacitua Emilia":    {mar:"44%",abr:"67%",may:"—",tot:"58%",dias:[1,1,1,0,1,0,0,0,0,1,0,1,0,1,1,1]},
  "Gomez Camila":      {mar:"100%",abr:"83%",may:"—",tot:"94%",dias:[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1]},
  "Gutierrez Renata":  {mar:"100%",abr:"83%",may:"—",tot:"94%",dias:[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1]},
  "Mateluna Florencia":{mar:"—",abr:"100%",may:"—",tot:"100%",dias:[0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0]},
  "Muñoz Constanza":   {mar:"44%",abr:"0%",may:"—",tot:"25%",dias:[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0]},
  "Pareja Camila":     {mar:"89%",abr:"50%",may:"—",tot:"75%",dias:[1,0,1,1,1,1,1,1,1,0,0,1,0,1,1,1]},
  "Pollmann Marianne": {mar:"67%",abr:"50%",may:"—",tot:"60%",dias:[0,0,1,1,1,1,1,0,1,1,0,1,0,1,0,0]},
  "Retamal Antonia":   {mar:"—",abr:"—",may:"—",tot:"—",dias:[0,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1]},
  "Sepulveda Eileen":  {mar:"44%",abr:"0%",may:"—",tot:"25%",dias:[0,0,1,0,1,1,1,0,0,0,0,0,0,0,0,0]},
  "Sierra Julieta":    {mar:"100%",abr:"0%",may:"—",tot:"56%",dias:[1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0]},
  "Silva Victoria":    {mar:"67%",abr:"50%",may:"—",tot:"60%",dias:[1,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0]},
  "Liu Macarena":      {mar:"56%",abr:"33%",may:"—",tot:"44%",dias:[1,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0]},
  "Errazu Sofia":      {mar:"—",abr:"—",may:"—",tot:"—",dias:[0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0]},
};

// ─── WELLNESS & RPE (formulario — mantener de versión anterior) ───────────────
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
const ZONAS_DOLOR=["Gemelo/Sóleo","Lumbar","Cuello","Rodilla","Periostitis","Bíceps","Espalda Alta","Trapecio","Hombro","Cuádriceps"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const avg=arr=>{const v=arr.filter(x=>x!=null&&x>0);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0;};
const allSess=[...PARTIDOS,...AMISTOSOS,...ENTRENOS];
const allNames=()=>{const s=new Set();allSess.forEach(ss=>ss.jugadoras.forEach(j=>s.add(j.n)));return Array.from(s).sort();};
const mySess=(n,pool)=>pool.map(s=>({...s,data:s.jugadoras.find(j=>j.n===n)})).filter(s=>s.data);
const wColor=n=>["","#e05555","#e07020","#d4b000","#5cb85c","#1a7a2a"][n]||"#4a5470";
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
  const maxVal=Math.max(...sesiones.map(s=>{
    if(s.prom)return(s.prom.hsr||0);
    if(s.zonas)return Math.max(...s.zonas.map(z=>z.h15+z.h18+z.spr));
    return 0;
  }),1);

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
              <span style={{color:T.muted2}}>{sIcon(s.tipo)} {s.label} <span style={{fontSize:10,color:T.muted}}>{s.fecha}</span></span>
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

// ─── STAFF GPS ────────────────────────────────────────────────────────────────
function StaffGPS(){
  const [tipo,setTipo]=useState("partidos");
  const [sesion,setSesion]=useState(null);
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess;
  const sess=sesion?pool.find(s=>s.id===sesion):null;

  return(
    <>
      {fbtn(tipo,setTipo,[["partidos","🏑 Partidos"],["amistosos","⚡ Amistosos"],["entrenos","🏃 Entrenos"],["todos","Todo"]])}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12}}>
        <button onClick={()=>setSesion(null)} style={{padding:"3px 8px",borderRadius:4,border:!sesion?`1px solid ${T.blue}`:`1px solid ${T.border}`,background:!sesion?T.blue+"22":"transparent",color:!sesion?T.blue:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>Resumen</button>
        {pool.map(s=><button key={s.id} onClick={()=>setSesion(s.id)} style={{padding:"3px 8px",borderRadius:4,border:sesion===s.id?`1px solid ${T.blue}`:`1px solid ${T.border}`,background:sesion===s.id?T.blue+"22":"transparent",color:sesion===s.id?T.blue:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{sIcon(s.tipo)} {s.label} {s.fecha}</button>)}
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
                <TH cols={["Jugadora","Min","Dist.","m/min","HSR/AI>15","AI>18","Spr>21","ACC","DSC","V.máx"]}/>
                <tbody>{[...sess.jugadoras].sort((a,b)=>b.dist-a.dist).map(j=>{
                  const h15=sess.zonas?sess.zonas.find(z=>z.n===j.n)?.h15:j.ai15!=null?j.ai15-j.ai18-j.spr:null;
                  const h18=sess.zonas?sess.zonas.find(z=>z.n===j.n)?.h18:j.ai18!=null?j.ai18-j.spr:null;
                  const sp=sess.zonas?sess.zonas.find(z=>z.n===j.n)?.spr:j.spr!=null?j.spr:null;
                  const hsr=j.hsr!=null?j.hsr:j.ai15!=null?j.ai15:null;
                  return(
                    <tr key={j.n}>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{j.n}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{j.min}'</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{j.dist.toLocaleString()}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{j.mxm}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text}}>{hsr!=null?`${hsr}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green}}>{h15!=null?`${Math.max(0,h15)}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{h18!=null?`${Math.max(0,h18)}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400}}>{sp!=null?`${sp}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{j.acc}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{j.dsc}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{j.vmax}</td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </Card>
          {/* Promedio del sheet si existe */}
          {sess.prom&&(
            <Card style={{border:`1px solid ${T.border2}`,background:"#0d1020"}}>
              <CT text="Promedio equipo (fila Promedio del sheet)"/>
              <div style={{display:"flex",gap:10,flexWrap:"wrap",fontSize:12}}>
                {[["Dist.",`${sess.prom.dist?.toLocaleString()}m`,T.blue],["m/min",sess.prom.mxm,T.muted2],["HSR",`${sess.prom.hsr}m`,T.text],["18-21",`${sess.prom.h18}m`,T.amber],["Spr>21",`${sess.prom.spr}m`,T.red],["ACC",sess.prom.acc,T.purple],["DSC",sess.prom.dsc,T.cyan],["Vmáx",`${sess.prom.vmax}km/h`,T.amber]].map(([l,v,c])=>(
                  <div key={l} style={{textAlign:"center",minWidth:55}}>
                    <div style={{fontSize:9,color:T.muted,marginBottom:2}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:600,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
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
    </>
  );
}

// ─── STAFF EVOLUCIÓN GPS ───────────────────────────────────────────────────────
function StaffEvoGPS(){
  const [metric,setMetric]=useState("dist");
  const [tipo,setTipo]=useState("partidos");
  const [vista,setVista]=useState("equipo"); // "equipo" | nombre jugadora
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess;
  const METRICS=[
    {k:"dist", label:"Distancia Total (m)",  unit:"m",    color:T.blue},
    {k:"h15",  label:"HSR 15-18 km/h (m)",   unit:"m",    color:T.green},
    {k:"h18",  label:"HSR 18-21 km/h (m)",   unit:"m",    color:T.amber},
    {k:"spr",  label:"Sprint >21 km/h (m)",  unit:"m",    color:T.red},
    {k:"acc",  label:"Nº ACC (+2.5)",         unit:"",     color:T.purple},
    {k:"vmax", label:"Vel. Máx (km/h)",       unit:"km/h", color:T.cyan},
  ];

  // getVal equipo (promedio)
  const getValEquipo=(s,mk)=>{
    if(mk==="dist")return Math.round(avg(s.jugadoras.map(j=>j.dist)));
    if(mk==="h15"){
      if(s.zonas)return Math.round(avg(s.zonas.map(z=>z.h15)));
      if(s.prom_hsr!=null)return s.prom_hsr-(s.prom_h18||0)-(s.prom_spr||0);
      if(s.prom)return Math.round((s.prom.hsr||0)-(s.prom.h18||0)-(s.prom.spr||0));
      return Math.round(avg(s.jugadoras.map(j=>(j.ai15||0)-(j.ai18||0)-(j.spr||0))));
    }
    if(mk==="h18"){
      if(s.zonas)return Math.round(avg(s.zonas.map(z=>z.h18)));
      if(s.prom_h18!=null)return s.prom_h18;
      if(s.prom)return s.prom.h18||0;
      return Math.round(avg(s.jugadoras.map(j=>j.ai18||0)));
    }
    if(mk==="spr"){
      if(s.prom_spr!=null)return s.prom_spr;
      if(s.prom)return s.prom.spr||0;
      if(s.zonas)return Math.round(avg(s.zonas.map(z=>z.spr)));
      return 0;
    }
    if(mk==="acc")return Math.round(avg(s.jugadoras.map(j=>j.acc||0)));
    if(mk==="vmax")return parseFloat(avg(s.jugadoras.map(j=>j.vmax)).toFixed(1));
    return 0;
  };

  // getVal jugadora individual
  const getValJugadora=(s,player,mk)=>{
    const jd=s.jugadoras.find(j=>j.n===player);
    if(!jd)return null;
    if(mk==="dist")return jd.dist||0;
    if(mk==="h15"){
      if(s.zonas){const z=s.zonas.find(z=>z.n===player);return z?z.h15:null;}
      return(jd.hsr||jd.ai15||0)-(jd.ai18||0)-(jd.spr||0);
    }
    if(mk==="h18"){
      if(s.zonas){const z=s.zonas.find(z=>z.n===player);return z?z.h18:null;}
      return jd.ai18||0;
    }
    if(mk==="spr"){
      if(s.zonas){const z=s.zonas.find(z=>z.n===player);return z?z.spr:null;}
      return jd.spr||0;
    }
    if(mk==="acc")return jd.acc||0;
    if(mk==="vmax")return jd.vmax||0;
    return 0;
  };

  const jugadoras=allNames();
  const esEquipo=vista==="equipo";
  const getVal=(s,mk)=>esEquipo?getValEquipo(s,mk):getValJugadora(s,vista,mk);

  const valsRaw=pool.map(s=>getVal(s,metric));
  const vals=valsRaw.map(v=>v??0);
  const maxVal=Math.max(...vals,1);
  const firstVal=vals.find(v=>v>0)||0;
  const lastVal=vals[vals.length-1]||0;
  const mejora=firstVal>0?Math.round((lastVal-firstVal)/firstVal*100):0;
  const mejoraColor=mejora>0?T.green:mejora<0?T.red:T.muted;
  const curMet=METRICS.find(m=>m.k===metric)||METRICS[0];

  return(
    <>
      {fbtn(tipo,setTipo,[["partidos","🏑 Partidos"],["amistosos","⚡ Amistosos"],["entrenos","🏃 Entrenos"],["todos","Todo"]])}
      <div style={{display:"flex",gap:2,background:T.surf2,borderRadius:6,padding:2,marginBottom:12,flexWrap:"wrap"}}>
        {METRICS.map(m=><button key={m.k} onClick={()=>setMetric(m.k)} style={{padding:"4px 9px",borderRadius:5,border:"none",fontSize:10,fontWeight:500,cursor:"pointer",background:metric===m.k?m.color+"33":"transparent",color:metric===m.k?m.color:T.muted,fontFamily:"inherit"}}>{m.label.split(" (")[0]}</button>)}
      </div>
      {/* Selector equipo / jugadora */}
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:12,alignItems:"center"}}>
        <button onClick={()=>setVista("equipo")} style={{padding:"4px 10px",borderRadius:5,border:vista==="equipo"?`1px solid ${T.blue}`:`1px solid ${T.border}`,background:vista==="equipo"?T.blue+"22":"transparent",color:vista==="equipo"?T.blue:T.muted,fontSize:10,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>📊 Equipo</button>
        {jugadoras.map(n=><button key={n} onClick={()=>setVista(n)} style={{padding:"4px 10px",borderRadius:5,border:vista===n?`1px solid ${T.amber}`:`1px solid ${T.border}`,background:vista===n?T.amber+"22":"transparent",color:vista===n?T.amber:T.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{n.split(" ")[0]}</button>)}
      </div>
      <MR>
        <MetCard label="Mejor sesión" value={`${Math.max(...vals).toLocaleString()}${curMet.unit}`} sc={curMet.color}/>
        <MetCard label="Promedio" value={`${metric==="vmax"?avg(vals.filter(v=>v>0)).toFixed(1):Math.round(avg(vals.filter(v=>v>0))).toLocaleString()}${curMet.unit}`}/>
        <MetCard label="Evolución" value={`${mejora>0?"+":""}${mejora}%`} sub="vs primera sesión" sc={mejoraColor}/>
        <MetCard label={esEquipo?"Vista":"Jugadora"} value={esEquipo?"Equipo":vista.split(" ")[0]} sc={esEquipo?T.blue:T.amber}/>
      </MR>
      <Card>
        <CT text={`Evolución ${esEquipo?"equipo (promedio)":vista} — ${curMet.label}`}/>
        {pool.map((s,i)=>{
          const v=getVal(s,metric);
          if(v===null)return null; // jugadora no participó
          const pct=Math.round((v||0)/maxVal*100);
          const col=s.tipo==="partido"?T.blue:s.tipo==="amistoso"?T.purple:T.green;
          const barCol=esEquipo?col:curMet.color;
          const prev=i>0?(()=>{for(let k=i-1;k>=0;k--){const pv=getVal(pool[k],metric);if(pv!==null&&pv>0)return pv;}return null;})():null;
          const delta=prev!=null&&prev>0?Math.round(((v||0)-prev)/prev*100):null;
          return(
            <div key={s.id} style={{marginBottom:8,opacity:v===0&&!esEquipo?0.4:1}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2,fontSize:11}}>
                <span style={{color:T.muted2}}>{sIcon(s.tipo)} {s.label} <span style={{fontSize:10,color:T.muted}}>{s.fecha}</span></span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {delta!=null&&<span style={{fontSize:10,color:delta>0?T.green:delta<0?T.red:T.muted,fontWeight:500}}>{delta>0?"+":""}{delta}%</span>}
                  <span style={{color:curMet.color,fontWeight:600}}>{(v||0).toLocaleString()}{curMet.unit}</span>
                </div>
              </div>
              <div style={{background:"#1e2535",borderRadius:3,height:10}}>
                <div style={{width:`${pct}%`,height:10,borderRadius:3,background:barCol}}/>
              </div>
            </div>
          );
        })}
        <div style={{marginTop:10,display:"flex",gap:10,fontSize:11,color:T.muted,flexWrap:"wrap"}}>
          {esEquipo?[{c:T.blue,l:"🏑 Partido"},{c:T.purple,l:"⚡ Amistoso"},{c:T.green,l:"🏃 Entreno"}].map((x,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:10,height:10,borderRadius:2,background:x.c,display:"inline-block"}}/>
              {x.l}
            </span>
          )):<span style={{color:T.muted2}}>Sesiones donde la jugadora no participó aparecen atenuadas</span>}
        </div>
      </Card>
    </>
  );
}

// ─── STAFF PERFIL PUESTOS ─────────────────────────────────────────────────────
function StaffPuestos(){
  const [puesto,setPuesto]=useState(null);
  const sel=puesto?PERFIL_PUESTOS.find(p=>p.p===puesto):null;
  const colors={DC:T.blue,LT:T.green,MC:T.amber,VL:T.red,WG:T.cyan,DL:T.purple};
  return(
    <>
      <div style={{fontSize:10,color:T.muted2,marginBottom:8}}>Solo partidos oficiales · Solo jugadoras ≥45 min · {PARTIDOS.length} partidos</div>
      <MR>
        {PERFIL_PUESTOS.map(p=>{
          const col=colors[p.p]||T.blue;
          return(
            <div key={p.p} onClick={()=>setPuesto(puesto===p.p?null:p.p)} style={{background:T.surf,border:`1px solid ${puesto===p.p?col:T.border}`,borderRadius:8,padding:"10px 12px",cursor:"pointer",transition:"border-color .15s"}}>
              <div style={{fontSize:12,fontWeight:700,color:col}}>{p.p}</div>
              <div style={{fontSize:10,color:T.muted,marginBottom:6}}>{p.nombre}</div>
              <div style={{fontSize:16,fontWeight:600,color:T.text}}>{pProm(p,"dist").toLocaleString()}m</div>
              <div style={{fontSize:10,color:T.muted2}}>Dist. prom.</div>
              <div style={{marginTop:4,fontSize:11,color:T.green}}>{pProm(p,"hsr")}m HSR</div>
              <div style={{fontSize:10,color:T.muted}}>{p.filas.length} obs · {p.jugadoras.length} jug.</div>
            </div>
          );
        })}
      </MR>
      {sel&&(
        <Card style={{marginBottom:10,border:`1px solid ${colors[sel.p]||T.blue}44`}}>
          <CT text={`${sel.p} — ${sel.nombre} · detalle`}/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <TH cols={["Jugadora","Min","Dist.","HSR","18-21","Spr>21","ACC","DSC","V.máx"]}/>
              <tbody>
                {sel.filas.map((f,i)=>(
                  <tr key={i} style={{background:i%2===0?"transparent":"#0d1020"}}>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{f.n}</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{f.min}'</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{f.dist.toLocaleString()}m</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{f.hsr}m</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{f.h18}m</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:f.spr>0?T.red:T.muted,fontWeight:f.spr>0?700:400}}>{f.spr}m</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{f.acc}</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{f.dsc}</td>
                    <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{f.vmax}</td>
                  </tr>
                ))}
                <tr style={{background:"#111520"}}>
                  <td style={{padding:"5px 6px",color:T.muted,fontWeight:600,fontSize:10}} colSpan={2}>PROMEDIO</td>
                  <td style={{padding:"5px 6px",color:T.blue,fontWeight:700}}>{pProm(sel,"dist").toLocaleString()}m</td>
                  <td style={{padding:"5px 6px",color:T.text,fontWeight:600}}>{pProm(sel,"hsr")}m</td>
                  <td style={{padding:"5px 6px",color:T.amber}}>{pProm(sel,"h18")}m</td>
                  <td style={{padding:"5px 6px",color:T.red}}>{pProm(sel,"spr")}m</td>
                  <td style={{padding:"5px 6px",color:T.purple}}>{pProm(sel,"acc")}</td>
                  <td style={{padding:"5px 6px",color:T.cyan}}>{pProm(sel,"dsc")}</td>
                  <td style={{padding:"5px 6px",color:T.amber}}>{pPromF(sel,"vmax")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {/* Tabla resumen comparativa */}
      <Card>
        <CT text="Comparativa por puesto (promedios)"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <TH cols={["Puesto","Jugadoras","Obs.","Dist.","HSR","18-21","Spr>21","ACC","DSC","V.máx"]}/>
            <tbody>{PERFIL_PUESTOS.map(p=>{
              const col=colors[p.p]||T.blue;
              return(
                <tr key={p.p} onClick={()=>setPuesto(puesto===p.p?null:p.p)} style={{cursor:"pointer",background:puesto===p.p?col+"11":"transparent"}}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:700}}>{p.p}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted2,fontSize:10}}>{p.jugadoras.map(n=>n.split(" ")[0]).join(", ")}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{p.filas.length}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{pProm(p,"dist").toLocaleString()}m</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{pProm(p,"hsr")}m</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{pProm(p,"h18")}m</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.red,fontWeight:pProm(p,"spr")>0?700:400}}>{pProm(p,"spr")}m</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{pProm(p,"acc")}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{pProm(p,"dsc")}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{pPromF(p,"vmax")}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ─── STAFF YO-YO ──────────────────────────────────────────────────────────────
function StaffYoyo(){
  const sorted=[...YOYO].sort((a,b)=>b.nivel-a.nivel);
  const medals=["🥇","🥈","🥉"];
  // Grupos por VAM m/s
  const grupos=[
    {label:"Grupo 1 — VAM ≥4.3 m/s",color:T.green,   items:sorted.filter(p=>p.ms>=4.3)},
    {label:"Grupo 2 — VAM 4.2 m/s",  color:T.amber,   items:sorted.filter(p=>p.ms>=4.2&&p.ms<4.3)},
    {label:"Grupo 3 — VAM <4.2 m/s", color:T.muted2,  items:sorted.filter(p=>p.ms<4.2)},
  ].filter(g=>g.items.length>0);
  return(
    <>
      <MR>
        <MetCard label="Nivel prom." value="15.8" sub="Yo-Yo IRT1 · 15/4/26"/>
        <MetCard label="Nivel más alto" value={sorted[0].nivel} sub={sorted[0].n.split(" ")[0]} sc={T.amber}/>
        <MetCard label="VO2 Máx prom." value="41.9" sub="ml/kg/min" sc={T.purple}/>
        <MetCard label="Evaluadas" value={YOYO.length} sub="9 jugadoras"/>
      </MR>
      {/* Referencias */}
      <Card style={{marginBottom:10}}>
        <CT text="Clasificación por Nivel Alcanzado"/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{label:"≥17 — Verde",c:"#3ecf7a"},{label:"15.5–16.9 — Amarillo",c:"#e09020"},{label:"<15.5 — Rojo",c:"#e05555"}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"#0d1020",padding:"7px 12px",borderRadius:8,border:`1px solid ${r.c}44`}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:r.c}}/>
              <span style={{fontSize:11,color:r.c,fontWeight:500}}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>
      {/* PODIO — por Nivel Alcanzado */}
      <div style={{marginBottom:6,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".5px"}}>Podio — Nivel Alcanzado</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {sorted.slice(0,3).map((p,i)=>{
          const col=yoyoColor(p.nivel);
          return(
            <div key={p.n} style={{background:T.surf,border:`2px solid ${col}`,borderRadius:8,padding:12,textAlign:"center"}}>
              <div style={{fontSize:24,marginBottom:4}}>{medals[i]}</div>
              <div style={{fontSize:12,fontWeight:600,color:T.text,marginBottom:2}}>{p.n.split(" ")[0]}</div>
              <div style={{fontSize:22,fontWeight:700,color:col,margin:"4px 0"}}>Niv. {p.nivel}</div>
              <div style={{fontSize:12,color:T.muted2,marginBottom:2}}>{p.dist}m</div>
              <div style={{fontSize:13,color:col,fontWeight:600}}>{p.ms} m/s</div>
              <div style={{marginTop:6,background:col+"22",borderRadius:6,padding:"3px 0",color:col,fontSize:10,fontWeight:500}}>{yoyoLabel(p.nivel)}</div>
            </div>
          );
        })}
      </div>
      {/* TABLA completa */}
      <Card style={{marginBottom:10}}>
        <CT text="Tabla completa — Nivel | Distancia | VAM m/s"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["#","Jugadora","Nivel Alcanzado","Distancia (m)","VAM m/s","Grupo","Clasificación"]}/>
            <tbody>{sorted.map((p,i)=>{
              const col=yoyoColor(p.nivel);
              const gc=p.ms>=4.3?"#3ecf7a":p.ms>=4.2?"#e09020":"#6a7490";
              return(
                <tr key={p.n} style={{background:i%2===0?"transparent":"#0d1020"}}>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.muted}}>{i+1}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.text,fontWeight:600,whiteSpace:"nowrap"}}>{p.n}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:col,fontWeight:700,fontSize:15,fontFamily:"monospace"}}>{p.nivel}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.text,fontWeight:500}}>{p.dist}m</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:col,fontWeight:700,fontSize:14}}>{p.ms}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824"}}>
                    <span style={{background:gc+"22",color:gc,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:500,whiteSpace:"nowrap"}}>{yoyoGrupo(p.ms)}</span>
                  </td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824"}}>
                    <span style={{background:col+"22",color:col,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:500}}>{yoyoLabel(p.nivel)}</span>
                  </td>
                </tr>
              );
            })}</tbody>
            <tfoot>
              <tr style={{background:"#111520"}}>
                <td colSpan={3} style={{padding:"6px 8px",color:T.muted,fontWeight:600,fontSize:10}}>PROMEDIO</td>
                <td style={{padding:"6px 8px",color:T.amber,fontWeight:700}}>15.8</td>
                <td style={{padding:"6px 8px",color:T.text,fontWeight:500}}>1027m</td>
                <td style={{padding:"6px 8px",color:T.amber,fontWeight:700}}>4.2</td>
                <td/><td/>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
      {/* GRUPOS por VAM */}
      {grupos.map(g=>(
        <Card key={g.label} style={{marginBottom:8,border:`1px solid ${g.color}44`}}>
          <CT text={g.label}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {g.items.map(p=>(
              <div key={p.n} style={{background:g.color+"11",border:`1px solid ${g.color}55`,borderRadius:8,padding:"8px 12px",textAlign:"center",minWidth:90}}>
                <div style={{fontSize:11,color:T.muted2,marginBottom:2}}>{p.n.split(" ")[0]}</div>
                <div style={{fontSize:15,fontWeight:700,color:g.color}}>Niv. {p.nivel}</div>
                <div style={{fontSize:12,color:T.text}}>{p.dist}m</div>
                <div style={{fontSize:13,fontWeight:600,color:g.color}}>{p.ms} m/s</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}


function StaffMinutos(){
  const partidos=["COGS","PWCC","MANQ A","UC B","CAT B"];
  const maxTot=Math.max(...MINUTOS.map(m=>m.tot),1);
  return(
    <>
      <MR>
        <MetCard label="Jugadoras" value={MINUTOS.length}/>
        <MetCard label="Máx. minutos" value={`${Math.max(...MINUTOS.map(m=>m.tot))} min`} sub="Arau/Gutierrez/Pareja" sc={T.green}/>
        <MetCard label="Prom. equipo" value={`${Math.round(avg(MINUTOS.map(m=>m.tot)))} min`} sub="Total temporada"/>
        <MetCard label="Partidos" value={4} sub="COGS · PWCC · MANQ · UC B"/>
      </MR>
      <Card>
        <CT text="Minutos de juego por jugadora — hoja Minutos de Juego"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["Jugadora","Div","COGS","PWCC","MANQ A","CAT B","Total","Prom."]}/>
            <tbody>{[...MINUTOS].sort((a,b)=>b.tot-a.tot).map(m=>{
              const col=m.tot>=200?T.green:m.tot>=100?T.amber:T.muted;
              return(
                <tr key={m.n}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{m.n}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824"}}><Chip text={m.div} color={m.div==="S16"?T.purple:T.blue}/></td>
                  {[m.cogs,m.pwcc,m.manq,m.catb].map((v,i)=>(
                    <td key={i} style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:v?T.text:T.muted,textAlign:"center"}}>{v!=null?`${v}'`:"—"}</td>
                  ))}
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:700}}>{m.tot}'</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{m.prom.toFixed(1)}'</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
        <div style={{marginTop:12}}>
          <CT text="Minutos totales — barra"/>
          {[...MINUTOS].sort((a,b)=>b.tot-a.tot).map(m=>{
            const col=m.tot>=200?T.green:m.tot>=100?T.amber:T.muted;
            return(
              <div key={m.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                <span style={{fontSize:11,color:T.text,width:130,flexShrink:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.n.split(" ")[0]}</span>
                <div style={{flex:1,background:"#1e2535",borderRadius:3,height:8}}><div style={{width:`${Math.round(m.tot/maxTot*100)}%`,height:8,borderRadius:3,background:col}}/></div>
                <span style={{fontSize:11,color:col,width:40,textAlign:"right",fontWeight:500}}>{m.tot}'</span>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

// ─── STAFF ASISTENCIA ──────────────────────────────────────────────────────────
function StaffAsistencia(){
  const rows=Object.entries(ASISTENCIA).map(([n,d])=>({
    n,mar:d.mar,abr:d.abr,may:d.may,tot:d.tot,dias:d.dias,
    pct:Math.round(d.dias.filter(x=>x===1).length/d.dias.length*100)
  })).sort((a,b)=>b.pct-a.pct);
  const marF=ATT_FECHAS.filter(f=>f.includes("/3"));
  const abrF=ATT_FECHAS.filter(f=>f.includes("/4"));
  const mayF=ATT_FECHAS.filter(f=>f.includes("/5"));
  return(
    <>
      <MR>
        <MetCard label="Prom. asistencia" value={`${Math.round(avg(rows.map(r=>r.pct)))}%`} sub="Total Mar-May"/>
        <MetCard label="≥80%" value={rows.filter(r=>r.pct>=80).length} sub="Jugadoras"/>
        <MetCard label="<60%" value={rows.filter(r=>r.pct<60).length} sub="Alertas" sc={T.red}/>
      </MR>
      <Card>
        <CT text="Calendario — % mensual"/>
        <div style={{overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",fontSize:11,width:"100%"}}>
            <thead>
              <tr>
                <th style={{textAlign:"left",color:T.muted,padding:"3px 6px",borderBottom:`1px solid ${T.border}`,fontSize:10}}>Jugadora</th>
                <th colSpan={marF.length} style={{textAlign:"center",color:T.green,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,borderLeft:`1px solid ${T.border2}`}}>MARZO</th>
                <th colSpan={abrF.length} style={{textAlign:"center",color:T.blue,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,borderLeft:`1px solid ${T.border2}`}}>ABRIL</th>
                <th colSpan={mayF.length} style={{textAlign:"center",color:T.amber,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,borderLeft:`1px solid ${T.border2}`}}>MAYO</th>
                <th style={{textAlign:"center",color:T.green,padding:"3px 5px",borderBottom:`1px solid ${T.border}`,fontSize:9,borderLeft:`1px solid ${T.border2}`}}>%MAR</th>
                <th style={{textAlign:"center",color:T.blue,padding:"3px 5px",borderBottom:`1px solid ${T.border}`,fontSize:9}}>%ABR</th>
                <th style={{textAlign:"center",color:T.amber,padding:"3px 5px",borderBottom:`1px solid ${T.border}`,fontSize:9}}>%MAY</th>
                <th style={{textAlign:"center",color:T.muted,padding:"3px 5px",borderBottom:`1px solid ${T.border}`,fontSize:9}}>%TOT</th>
              </tr>
              <tr>
                <th/>
                {ATT_FECHAS.map((f,i)=><th key={i} style={{textAlign:"center",color:T.muted,padding:"2px 2px",borderBottom:`1px solid ${T.border}`,fontSize:7,minWidth:18,borderLeft:i===0||i===marF.length||i===marF.length+abrF.length?`1px solid ${T.border2}`:"none"}}>{f}</th>)}
                <th/><th/><th/><th/>
              </tr>
            </thead>
            <tbody>{rows.map(r=>{
              const col=r.pct>=80?T.green:r.pct>=60?T.amber:T.red;
              return(
                <tr key={r.n}>
                  <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,fontSize:11,whiteSpace:"nowrap"}}>{r.n.split(" ")[0]}</td>
                  {r.dias.map((d,i)=>(
                    <td key={i} style={{padding:"2px 1px",borderBottom:"1px solid #141824",textAlign:"center",borderLeft:i===0||i===marF.length||i===marF.length+abrF.length?`1px solid ${T.border2}`:"none"}}>
                      <span style={{display:"inline-block",width:14,height:14,borderRadius:2,background:d===1?"#0f2d1f":"#2d0f0f",color:d===1?T.green:T.red,fontSize:8,lineHeight:"14px",textAlign:"center"}}>{d===1?"✓":"✗"}</span>
                    </td>
                  ))}
                  <td style={{padding:"4px 4px",borderBottom:"1px solid #141824",textAlign:"center",fontSize:10,color:T.green,fontWeight:500,borderLeft:`1px solid ${T.border2}`}}>{r.mar}</td>
                  <td style={{padding:"4px 4px",borderBottom:"1px solid #141824",textAlign:"center",fontSize:10,color:T.blue,fontWeight:500}}>{r.abr}</td>
                  <td style={{padding:"4px 4px",borderBottom:"1px solid #141824",textAlign:"center",fontSize:10,color:T.amber,fontWeight:500}}>{r.may}</td>
                  <td style={{padding:"4px 5px",borderBottom:"1px solid #141824",textAlign:"center",fontSize:10,color:col,fontWeight:600}}>{r.pct}%</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ─── STAFF RPE ─────────────────────────────────────────────────────────────────
function StaffRPE(){
  const entries=Object.entries(RPE_DATA).sort((a,b)=>b[1]-a[1]);
  const alerts=entries.filter(([,v])=>v>=8);
  return(
    <>
      <MR>
        <MetCard label="RPE prom." value={Math.round(avg(entries.map(([,v])=>v)))} sub="Última sesión (1-10)"/>
        <MetCard label="RPE ≥8" value={alerts.length} sub="Alertas" sc={T.red}/>
        <MetCard label="RPE ≤6" value={entries.filter(([,v])=>v<=6).length} sub="Normal" sc={T.green}/>
      </MR>
      {alerts.length>0&&<div style={{background:"#2d0f0f",border:"1px solid #5a1f1f",borderRadius:6,padding:"8px 12px",marginBottom:10,fontSize:12,color:T.red}}>⚠ RPE ≥8: {alerts.map(([n])=>n.split(" ")[0]).join(", ")}</div>}
      <Card>
        <CT text="RPE individual — última sesión"/>
        {entries.map(([n,v])=>{const col=v>=8?T.red:v>=7?T.amber:T.green;return(
          <div key={n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <span style={{fontSize:11,color:T.text,width:140,flexShrink:0}}>{n}</span>
            <div style={{flex:1,background:"#1e2535",borderRadius:3,height:8}}><div style={{width:`${v/10*100}%`,height:8,borderRadius:3,background:col}}/></div>
            <span style={{fontSize:14,fontWeight:700,color:col,width:18,textAlign:"right"}}>{v}</span>
          </div>
        );})}
      </Card>
    </>
  );
}

// ─── STAFF WELLNESS ────────────────────────────────────────────────────────────
function StaffWellness(){
  const entries=Object.entries(WELLNESS);
  const alerts=entries.filter(([,w])=>w.calidad<=2||w.fatiga<=2||w.estres<=2||w.animo<=2);
  return(
    <>
      <MR>
        <MetCard label="Alertas" value={alerts.length} sub="Valor bajo" sc={alerts.length>1?T.red:T.amber}/>
        <MetCard label="Calidad sueño" value={`${avg(entries.map(([,w])=>w.calidad)).toFixed(1)}/5`}/>
        <MetCard label="Energía prom." value={`${avg(entries.map(([,w])=>w.fatiga)).toFixed(1)}/5`}/>
        <MetCard label="Ánimo prom." value={`${avg(entries.map(([,w])=>w.animo)).toFixed(1)}/5`}/>
      </MR>
      {alerts.map(([n,w])=>(
        <div key={n} style={{background:"#2d0f0f",border:"1px solid #5a1f1f",borderRadius:6,padding:"7px 12px",marginBottom:6,fontSize:12,color:T.red}}>
          ⚠ <strong>{n}</strong> — {[w.calidad<=2?`Cal:${w.calidad}`:"",w.fatiga<=2?`Ene:${w.fatiga}`:"",w.estres<=2?`Est:${w.estres}`:"",w.animo<=2?`Áni:${w.animo}`:""].filter(Boolean).join(" | ")}
        </div>
      ))}
      <Card>
        <CT text="Wellness plantel (1=rojo · 5=verde)"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <TH cols={["Jugadora","Hs Sueño","Calidad","Energía","Dolor","Estrés","Ánimo","Zona"]}/>
            <tbody>{entries.map(([n,w])=>(
              <tr key={n}>
                <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.text,fontSize:11,whiteSpace:"nowrap"}}>{n}</td>
                <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",textAlign:"center",color:T.muted,fontSize:11}}>{w.horas}</td>
                {["calidad","fatiga","dolor","estres","animo"].map(k=>(
                  <td key={k} style={{padding:"6px 8px",borderBottom:"1px solid #141824",textAlign:"center"}}>
                    <WCircle val={w[k]}/>
                  </td>
                ))}
                <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.muted,fontSize:11}}>{w.nota}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

// ─── PLAYER GPS ────────────────────────────────────────────────────────────────
function PlayerGPS({player}){
  const [tipo,setTipo]=useState("todos");
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess;
  const sess=mySess(player,pool);
  if(!sess.length)return<div style={{color:T.muted,padding:20,textAlign:"center"}}>Sin datos GPS en esta selección</div>;
  return(
    <>
      {fbtn(tipo,setTipo,[["partidos","🏑 Partidos"],["amistosos","⚡ Amistosos"],["entrenos","🏃 Entrenos"],["todos","Todo"]])}
      <MR>
        <MetCard label="Dist. prom." value={`${Math.round(avg(sess.map(s=>s.data.dist))).toLocaleString()}m`}/>
        <MetCard label="Sesiones" value={sess.length}/>
        <MetCard label="Vel. máx" value={`${Math.max(...sess.map(s=>s.data.vmax))} km/h`} sc={T.amber}/>
      </MR>
      <Card style={{marginBottom:10}}>
        <CT text="Detalle por sesión"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <TH cols={["Sesión","Fecha","Min","Dist.","m/min","HSR","V.máx"]}/>
            <tbody>{sess.map(s=>(
              <tr key={s.id}>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{sIcon(s.tipo)} {s.label}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{s.fecha}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{s.data.min}'</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{s.data.dist.toLocaleString()}m</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{s.data.mxm}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text}}>{(s.data.hsr||s.data.ai15||0)}m</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{s.data.vmax}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      {/* Gráfico HSR por zonas — igual al de Staff */}
      <Card>
        <CT text="HSR por zonas — mis sesiones"/>
        {hsrLegend}
        {sess.map(s=>{
          let h15=0,h18=0,spr=0;
          if(s.zonas){
            const zd=s.zonas.find(z=>z.n===player);
            if(zd){h15=zd.h15;h18=zd.h18;spr=zd.spr;}
          } else if(s.data.ai15!=null){
            h18=s.data.ai18||0; spr=s.data.spr||0; h15=s.data.ai15-h18-spr;
          }
          const total=h15+h18+spr;
          const mx=Math.max(...sess.map(s2=>{
            if(s2.zonas){const z=s2.zonas.find(z=>z.n===player);return z?z.h15+z.h18+z.spr:0;}
            return s2.data.ai15||0;
          }),1);
          return(
            <div key={s.id} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:11}}>
                <span style={{color:T.muted2}}>{sIcon(s.tipo)} {s.label} <span style={{fontSize:10,color:T.muted}}>{s.fecha}</span></span>
                <div style={{display:"flex",gap:8}}>
                  <span style={{color:T.green,fontSize:10}}>{h15}m</span>
                  <span style={{color:T.amber,fontSize:10}}>{h18}m</span>
                  <span style={{color:spr>0?T.red:T.muted,fontSize:10,fontWeight:spr>0?700:400}}>{spr}m</span>
                  <span style={{color:T.muted,fontSize:10}}>{total}m</span>
                </div>
              </div>
              <HsrBar h15={h15} h18={h18} spr={spr} mx={mx}/>
            </div>
          );
        })}
      </Card>
    </>
  );
}

// ─── PLAYER YO-YO ─────────────────────────────────────────────────────────────
function PlayerYoyo({player}){
  const d=YOYO.find(p=>p.n===player);
  const sorted=[...YOYO].sort((a,b)=>b.nivel-a.nivel);
  const myRank=d?sorted.findIndex(p=>p.n===player)+1:null;
  if(!d)return(
    <div style={{textAlign:"center",padding:30}}>
      <div style={{fontSize:36,marginBottom:10}}>🏑</div>
      <div style={{color:T.muted,fontSize:14}}>Sin registro Yo-Yo</div>
    </div>
  );
  const col=yoyoColor(d.nivel);
  return(
    <>
      <div style={{background:T.surf,border:`2px solid ${col}`,borderRadius:8,padding:"16px",marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Yo-Yo IRT1 · 15/4/26</div>
        <div style={{fontSize:32,fontWeight:700,color:col,marginBottom:4}}>Nivel {d.nivel}</div>
        <div style={{fontSize:22,fontWeight:700,color:col,marginBottom:6}}>{d.ms} m/s</div>
        <div style={{fontSize:14,color:T.text,marginBottom:4}}>{d.dist}m alcanzados</div>
        <div style={{fontSize:11,color:T.muted2,marginBottom:10}}>VO2 Máx: {d.vo2} ml/kg/min · Vel: {d.kmh} km/h</div>
        <span style={{background:col+"22",color:col,padding:"4px 16px",borderRadius:6,fontSize:12,fontWeight:600}}>{yoyoLabel(d.nivel)}</span>
      </div>
      <MR>
        <MetCard label="Mi nivel" value={d.nivel} sc={col}/>
        <MetCard label="VAM" value={`${d.ms} m/s`} sc={col}/>
        <MetCard label="Distancia" value={`${d.dist}m`}/>
        <MetCard label="Ranking" value={`#${myRank}`} sub={`de ${sorted.length}`}/>
      </MR>
      <Card>
        <CT text="Mi posición en el ranking (por Nivel)"/>
        {sorted.map((p,i)=>{const isMe=p.n===player;const gc=yoyoColor(p.nivel);return(
          <div key={p.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,background:isMe?T.amber+"11":"transparent",borderRadius:4,padding:isMe?"2px 4px":0}}>
            {isMe&&<span style={{color:T.amber,fontSize:9}}>▶</span>}
            <span style={{fontSize:11,color:isMe?T.amber:T.text,width:130,flexShrink:0,fontWeight:isMe?500:400}}>{i+1}. {p.n.split(" ")[0]}</span>
            <div style={{flex:1,background:"#1e2535",borderRadius:3,height:7}}><div style={{width:`${Math.round((p.nivel-12)/(17-12)*100)}%`,height:7,borderRadius:3,background:isMe?T.amber:gc}}/></div>
            <span style={{fontSize:11,color:isMe?T.amber:gc,width:60,textAlign:"right"}}>{p.nivel} ({p.ms})</span>
          </div>
        );})}
      </Card>
    </>
  );
}

// ─── PLAYER ASISTENCIA ─────────────────────────────────────────────────────────
function PlayerAsistencia({player}){
  const d=ASISTENCIA[player];
  if(!d)return<div style={{color:T.muted,padding:20,textAlign:"center"}}>Sin datos de asistencia</div>;
  const p=d.dias.filter(x=>x===1).length;
  const pct=Math.round(p/d.dias.length*100);
  const marF=ATT_FECHAS.filter(f=>f.includes("/3"));
  const abrF=ATT_FECHAS.filter(f=>f.includes("/4"));
  const mayF=ATT_FECHAS.filter(f=>f.includes("/5"));
  return(
    <>
      <MR>
        <MetCard label="Mi asistencia" value={`${pct}%`} sub={`${p}/${d.dias.length} sesiones`} sc={pct>=80?T.green:pct>=60?T.amber:T.red}/>
        <MetCard label="Presencias" value={p} sc={T.green}/>
        <MetCard label="Ausencias" value={d.dias.length-p} sc={T.red}/>
      </MR>
      {pct<60&&<div style={{background:"#2d0f0f",border:"1px solid #5a1f1f",borderRadius:6,padding:"7px 12px",marginBottom:10,fontSize:12,color:T.red}}>⚠ Asistencia menor al 60%</div>}
      <Card style={{marginBottom:10}}>
        <CT text="Mi calendario"/>
        <div style={{overflowX:"auto"}}>
          <table style={{borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr>
                <th colSpan={marF.length} style={{textAlign:"center",color:T.green,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,border:`1px solid ${T.border2}`}}>MARZO</th>
                <th colSpan={abrF.length} style={{textAlign:"center",color:T.blue,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,border:`1px solid ${T.border2}`}}>ABRIL</th>
                <th colSpan={mayF.length} style={{textAlign:"center",color:T.amber,padding:"3px 4px",borderBottom:`1px solid ${T.border}`,fontSize:9,border:`1px solid ${T.border2}`}}>MAYO</th>
              </tr>
              <tr>{ATT_FECHAS.map((f,i)=><th key={i} style={{textAlign:"center",color:T.muted,padding:"2px 2px",borderBottom:`1px solid ${T.border}`,fontSize:7,minWidth:18}}>{f}</th>)}</tr>
            </thead>
            <tbody><tr>{d.dias.map((dia,i)=>(
              <td key={i} style={{padding:"3px 2px",textAlign:"center"}}>
                <div style={{borderRadius:4,background:dia===1?"#0f2d1f":"#2d0f0f",display:"flex",alignItems:"center",justifyContent:"center",color:dia===1?T.green:T.red,fontSize:12,padding:"5px 2px"}}>{dia===1?"✓":"✗"}</div>
              </td>
            ))}</tr></tbody>
          </table>
        </div>
        <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
          {[{l:"Marzo",v:d.mar,c:T.green},{l:"Abril",v:d.abr,c:T.blue},{l:"Mayo",v:d.may,c:T.amber},{l:"Total",v:d.tot,c:pct>=80?T.green:pct>=60?T.amber:T.red}].map((m,i)=>(
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
function PlayerRPE({player}){
  const [rpe,setRpe]=useState(RPE_DATA[player]||5);
  const [saved,setSaved]=useState(false);
  return(
    <>
      {rpe>=8&&<div style={{background:"#2d0f0f",border:"1px solid #5a1f1f",borderRadius:6,padding:"7px 12px",marginBottom:10,fontSize:12,color:T.red}}>⚠ RPE ≥8 — el cuerpo técnico recibirá alerta.</div>}
      <Card>
        <CT text="Mi RPE post-sesión (1-10)"/>
        <div style={{textAlign:"center",fontSize:32,fontWeight:700,color:rpe>=8?T.red:rpe>=7?T.amber:T.green,marginBottom:10}}>{rpe}</div>
        <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:12}}>
          {[1,2,3,4,5,6,7,8,9,10].map(n=>(
            <button key={n} onClick={()=>{setRpe(n);setSaved(false);}} style={{width:34,height:34,borderRadius:6,border:rpe===n?`2px solid ${T.blue}`:`1px solid ${T.border}`,background:rpe===n?T.blue+"33":"transparent",color:rpe===n?T.blue:T.muted,fontSize:14,fontWeight:rpe===n?700:400,cursor:"pointer",fontFamily:"inherit"}}>{n}</button>
          ))}
        </div>
        <button onClick={()=>setSaved(true)} style={{width:"100%",padding:10,background:T.blue,border:"none",borderRadius:6,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Guardar RPE</button>
        {saved&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:T.green}}>✓ RPE guardado</div>}
      </Card>
    </>
  );
}

// ─── PLAYER WELLNESS ──────────────────────────────────────────────────────────
function PlayerWellness({player}){
  const base=WELLNESS[player]||{horas:"7hs",calidad:3,fatiga:3,dolor:3,estres:3,animo:3};
  const [form,setForm]=useState({horas:base.horas,calidad:base.calidad,fatiga:base.fatiga,dolor:base.dolor,estres:base.estres,animo:base.animo,zonasDolor:[],otroZona:""});
  const [saved,setSaved]=useState(false);
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
          {form.dolor<=3&&(
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
        <button onClick={()=>setSaved(true)} style={{width:"100%",padding:10,background:T.maroon,border:"none",borderRadius:6,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>Guardar Wellness</button>
        {saved&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:T.green}}>✓ Wellness guardado</div>}
      </Card>
    </>
  );
}

// ─── PLAYER EVOLUCIÓN GPS ─────────────────────────────────────────────────────
function PlayerEvoGPS({player}){
  const [metric,setMetric]=useState("dist");
  const [tipo,setTipo]=useState("todos");
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess;
  const sess=mySess(player,pool);
  if(!mySess(player,allSess).length)return<div style={{color:T.muted,padding:20,textAlign:"center"}}>Sin datos GPS</div>;
  const METRICS=[
    {k:"dist",label:"Distancia Total (m)", unit:"m",    color:T.blue},
    {k:"h15", label:"HSR 15-18 km/h (m)",  unit:"m",    color:T.green},
    {k:"h18", label:"HSR 18-21 km/h (m)",  unit:"m",    color:T.amber},
    {k:"spr", label:"Sprint >21 km/h (m)", unit:"m",    color:T.red},
    {k:"acc", label:"Nº ACC (+2.5)",        unit:"",     color:T.purple},
    {k:"vmax",label:"Vel. Máx (km/h)",      unit:"km/h", color:T.cyan},
  ];
  const getVal=(s,mk)=>{
    if(mk==="dist")return s.data.dist||0;
    if(mk==="h15"){
      if(s.zonas){const z=s.zonas.find(z=>z.n===player);return z?z.h15:0;}
      return(s.data.hsr||s.data.ai15||0)-(s.data.ai18||0)-(s.data.spr||0);
    }
    if(mk==="h18"){
      if(s.zonas){const z=s.zonas.find(z=>z.n===player);return z?z.h18:0;}
      return s.data.ai18||0;
    }
    if(mk==="spr"){
      if(s.zonas){const z=s.zonas.find(z=>z.n===player);return z?z.spr:0;}
      return s.data.spr||0;
    }
    if(mk==="acc")return s.data.acc||0;
    if(mk==="vmax")return s.data.vmax||0;
    return 0;
  };
  const curMet=METRICS.find(m=>m.k===metric)||METRICS[0];
  const vals=sess.map(s=>getVal(s,metric));
  const maxVal=Math.max(...vals,1);
  const firstVal=vals.find(v=>v>0)||0;
  const lastVal=vals[vals.length-1]||0;
  const mejora=firstVal>0?Math.round((lastVal-firstVal)/firstVal*100):0;
  const mejoraColor=mejora>0?T.green:mejora<0?T.red:T.muted;
  return(
    <>
      {fbtn(tipo,setTipo,[["partidos","🏑 Partidos"],["amistosos","⚡ Amistosos"],["entrenos","🏃 Entrenos"],["todos","Todo"]])}
      <div style={{display:"flex",gap:2,background:T.surf2,borderRadius:6,padding:2,marginBottom:12,flexWrap:"wrap"}}>
        {METRICS.map(m=><button key={m.k} onClick={()=>setMetric(m.k)} style={{padding:"4px 9px",borderRadius:5,border:"none",fontSize:10,fontWeight:500,cursor:"pointer",background:metric===m.k?m.color+"33":"transparent",color:metric===m.k?m.color:T.muted,fontFamily:"inherit"}}>{m.label.split(" (")[0]}</button>)}
      </div>
      {!sess.length?<div style={{color:T.muted,padding:16,textAlign:"center",fontSize:12}}>Sin sesiones en esta selección</div>:(
      <><MR>
        <MetCard label="Mejor sesión" value={`${Math.max(...vals).toLocaleString()}${curMet.unit}`} sc={curMet.color}/>
        <MetCard label="Promedio" value={`${metric==="vmax"?avg(vals.filter(v=>v>0)).toFixed(1):Math.round(avg(vals.filter(v=>v>0))).toLocaleString()}${curMet.unit}`}/>
        <MetCard label="Evolución" value={`${mejora>0?"+":""}${mejora}%`} sub="vs primera sesión" sc={mejoraColor}/>
        <MetCard label="Sesiones" value={sess.length}/>
      </MR>
      <Card>
        <CT text={`Mi evolución — ${curMet.label}`}/>
        {sess.map((s,i)=>{
          const v=getVal(s,metric);
          const pct=Math.round(v/maxVal*100);
          const col=s.tipo==="partido"?T.blue:s.tipo==="amistoso"?T.purple:T.green;
          const prev=i>0?getVal(sess[i-1],metric):null;
          const delta=prev!=null&&prev>0?Math.round((v-prev)/prev*100):null;
          return(
            <div key={s.id} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:2,fontSize:11}}>
                <span style={{color:T.muted2}}>{sIcon(s.tipo)} {s.label} <span style={{fontSize:10,color:T.muted}}>{s.fecha}</span></span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {delta!=null&&<span style={{fontSize:10,color:delta>0?T.green:delta<0?T.red:T.muted,fontWeight:500}}>{delta>0?"+":""}{delta}%</span>}
                  <span style={{color:curMet.color,fontWeight:600}}>{v.toLocaleString()}{curMet.unit}</span>
                </div>
              </div>
              <div style={{background:"#1e2535",borderRadius:3,height:10}}>
                <div style={{width:`${pct}%`,height:10,borderRadius:3,background:curMet.color}}/>
              </div>
            </div>
          );
        })}
        <div style={{marginTop:10,display:"flex",gap:10,fontSize:11,color:T.muted,flexWrap:"wrap"}}>
          {[{c:T.blue,l:"🏑 Partido"},{c:T.purple,l:"⚡ Amistoso"},{c:T.green,l:"🏃 Entreno"}].map((x,i)=>(
            <span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:10,height:10,borderRadius:2,background:x.c,display:"inline-block"}}/>
              {x.l}
            </span>
          ))}
        </div>
      </Card>
      </>)}
    </>
  );
}

// ─── PLAYER MINUTOS DE JUEGO ───────────────────────────────────────────────────
function PlayerMinutos({player}){
  const d=MINUTOS.find(m=>m.n===player);
  if(!d)return<div style={{color:T.muted,padding:20,textAlign:"center"}}>Sin registro de minutos de juego</div>;
  const partidos=[
    {label:"vs COGS",fecha:"22/03",min:d.cogs},
    {label:"vs PWCC",fecha:"05/04",min:d.pwcc},
    {label:"vs MANQ A",fecha:"25/04",min:d.manq},
    {label:"vs CAT B",fecha:"10/05",min:d.catb},
    {label:"vs CAT B",fecha:"10/05",min:d.catb},
  ];
  const maxMin=70;
  return(
    <>
      <MR>
        <MetCard label="Minutos totales" value={`${d.tot}'`} sub="Temporada" sc={d.tot>=200?T.green:d.tot>=100?T.amber:T.muted}/>
        <MetCard label="Prom. por partido" value={`${d.prom.toFixed(1)}'`} sub="Partidos jugados"/>
        <MetCard label="Partidos" value={partidos.filter(p=>p.min!=null).length} sub="Con minutos"/>
      </MR>
      <Card>
        <CT text="Minutos de juego por partido"/>
        {partidos.map((p,i)=>{
          const col=p.min!=null?T.blue:T.muted;
          const pct=p.min!=null?Math.round(p.min/maxMin*100):0;
          return(
            <div key={i} style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontSize:12}}>
                <span style={{color:p.min!=null?T.text:T.muted}}>🏑 {p.label} <span style={{fontSize:10,color:T.muted}}>{p.fecha}</span></span>
                <span style={{color:col,fontWeight:600}}>{p.min!=null?`${p.min}'`:"No jugó"}</span>
              </div>
              <div style={{background:"#1e2535",borderRadius:3,height:10}}>
                {p.min!=null&&<div style={{width:`${pct}%`,height:10,borderRadius:3,background:col}}/>}
              </div>
            </div>
          );
        })}
        <div style={{marginTop:10,padding:"8px 12px",background:"#0d1020",borderRadius:6,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:T.muted}}>Total temporada</span>
          <span style={{fontSize:14,fontWeight:700,color:d.tot>=200?T.green:d.tot>=100?T.amber:T.muted}}>{d.tot} min</span>
        </div>
      </Card>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const STAFF_TABS=["GPS","Evolución GPS","Perfil Puestos","Yo-Yo","Minutos","Asistencia","RPE","Wellness"];
const PLAYER_TABS=["Mi GPS","Evolución GPS","Yo-Yo","Minutos","Asistencia","Mi RPE","Mi Wellness"];

export default function App(){
  const [mode,setMode]=useState("staff");
  const [tab,setTab]=useState(0);
  const [player,setPlayer]=useState(allNames()[0]);
  const tabs=mode==="staff"?STAFF_TABS:PLAYER_TABS;
  const sw=m=>{setMode(m);setTab(0);};
  return(
    <div style={{background:T.bg,color:T.text,minHeight:600,borderRadius:12,overflow:"hidden",fontFamily:"system-ui,sans-serif"}}>
      <div style={{background:"#080a0f",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",padding:"0 10px",height:46,gap:0,overflowX:"auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginRight:8,flexShrink:0}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:T.maroon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🏑</div>
          <span style={{fontSize:10,fontWeight:500,color:"#a0b0c8",letterSpacing:"1px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Old Gabs 1era</span>
        </div>
        <div style={{display:"flex",gap:0,flex:1,overflowX:"auto"}}>
          {tabs.map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} style={{padding:"0 9px",height:46,display:"flex",alignItems:"center",fontSize:10,fontWeight:500,cursor:"pointer",border:"none",background:"transparent",color:tab===i?T.blue:T.muted,textTransform:"uppercase",letterSpacing:".5px",borderBottom:`2px solid ${tab===i?T.blue:"transparent"}`,fontFamily:"inherit",whiteSpace:"nowrap"}}>{t}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:1,background:"#1a1e2a",borderRadius:6,padding:2,marginLeft:6,flexShrink:0}}>
          {["staff","player"].map(m=><button key={m} onClick={()=>sw(m)} style={{padding:"4px 9px",borderRadius:5,border:"none",fontSize:9,fontWeight:500,cursor:"pointer",background:mode===m?"#1e3a5f":"transparent",color:mode===m?T.blue:T.muted,fontFamily:"inherit",textTransform:"uppercase"}}>{m==="staff"?"Staff":"Jugadora"}</button>)}
        </div>
      </div>
      <div style={{padding:12}}>
        {mode==="player"&&(
          <select value={player} onChange={e=>setPlayer(e.target.value)} style={{background:T.surf,border:`1px solid ${T.border2}`,borderRadius:6,color:T.text,fontSize:12,padding:"5px 10px",outline:"none",marginBottom:12,width:"100%"}}>
            {allNames().map(n=><option key={n}>{n}</option>)}
          </select>
        )}
        {mode==="staff"?(
          <>{tab===0&&<StaffGPS/>}{tab===1&&<StaffEvoGPS/>}{tab===2&&<StaffPuestos/>}{tab===3&&<StaffYoyo/>}{tab===4&&<StaffMinutos/>}{tab===5&&<StaffAsistencia/>}{tab===6&&<StaffRPE/>}{tab===7&&<StaffWellness/>}</>
        ):(
          <>{tab===0&&<PlayerGPS player={player}/>}{tab===1&&<PlayerEvoGPS player={player}/>}{tab===2&&<PlayerYoyo player={player}/>}{tab===3&&<PlayerMinutos player={player}/>}{tab===4&&<PlayerAsistencia player={player}/>}{tab===5&&<PlayerRPE player={player}/>}{tab===6&&<PlayerWellness player={player}/>}</>
        )}
      </div>
    </div>
  );
}
