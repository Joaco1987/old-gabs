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

  // ── vs OLD REDS ──────────────────────────────────────────────────────────────
  {id:"oldreds",label:"vs OLD REDS",fecha:"OLD REDS",tipo:"partido",
   prom:{dist:6258,mxm:105,hsr:778,h18:218,spr:5,acc:19,dsc:27,vmax:23.4},
   jugadoras:[
    {n:"Alfaro Javiera",   min:28,dist:3190,mxm:112,hsr:449,ai18:159,spr:0, acc:9, dsc:16,vmax:22.8},
    {n:"Carrasco Sofia",   min:32,dist:3964,mxm:124,hsr:929,ai18:289,spr:0, acc:26,dsc:42,vmax:22.9},
    {n:"Gomez Camila",     min:49,dist:4744,mxm:96, hsr:484,ai18:63, spr:0, acc:5, dsc:18,vmax:20.3},
    {n:"Muñoz Constanza",  min:63,dist:5384,mxm:85, hsr:397,ai18:82, spr:0, acc:12,dsc:17,vmax:21.6},
    {n:"Liu Macarena",     min:48,dist:5532,mxm:116,hsr:883,ai18:266,spr:0, acc:22,dsc:26,vmax:22.5},
    {n:"Pareja Camila",    min:71,dist:6123,mxm:86, hsr:281,ai18:62, spr:0, acc:11,dsc:20,vmax:21.2},
    {n:"Gutierrez Renata", min:71,dist:6822,mxm:96, hsr:715,ai18:280,spr:0, acc:14,dsc:24,vmax:22.9},
    {n:"Pollmann Marianne",min:71,dist:6952,mxm:98, hsr:653,ai18:123,spr:0, acc:27,dsc:14,vmax:21.9},
    {n:"Gacitua Emilia",   min:71,dist:7854,mxm:111,hsr:1137,ai18:319,spr:0,acc:38,dsc:48,vmax:23.4},
    {n:"Sierra Julieta",   min:71,dist:7929,mxm:112,hsr:1086,ai18:318,spr:11,acc:39,dsc:61,vmax:24.6},
    {n:"Silva Victoria",   min:71,dist:8142,mxm:115,hsr:1469,ai18:570,spr:16,acc:45,dsc:52,vmax:24.7},
   ]},
];

// ─── AMISTOSOS ────────────────────────────────────────────────────────────────
// Promedios de las filas del CSV (mismas filas 14/30/47 pero columnas de la derecha)
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
// Orden del sheet: 6-abr (tabla GRAL + sub-tabla zonas al lado), luego 8-abr...
// La sub-tabla de zonas da: 15-18 / 18-21 / >21
// h15 = zona 15-18 (de sub-tabla), h18 = zona 18-21, spr = >21
// 10-abr: NO hay sub-tabla zonas (la única sin ella)
// Promedio >21: de fila Promedio si existe, sino calculado

const ENTRENOS=[
  // ── 6-abr ──────────────────────────────────────────────────────────────────
  // Tabla GRAL: Gomez/Sierra/Alfaro/Carrasco/Mateluna/Pareja/Pollmann/Gutierrez/Errazu/Gacitua
  // Fila Promedio del sheet: dist=6706, mxm=108, HSR=1631, spr=0.7 ≈ promedio=1
  // Sub-tabla zonas del sheet (al lado de la tabla GRAL):
  {id:"e01",label:"6/04",fecha:"6/04",tipo:"entreno",
   prom_spr:1, // fila promedio del sheet redondeada
   zonas:[
    {n:"Pareja Camila",    h15:1088,h18:22, spr:0},
    {n:"Alfaro Javiera",   h15:1015,h18:144,spr:0},
    {n:"Carrasco Sofia",   h15:735, h18:571,spr:0},
    {n:"Pollmann Marianne",h15:1087,h18:341,spr:0},
    {n:"Gomez Camila",     h15:553, h18:38, spr:0},
    {n:"Errazu Sofia",     h15:739, h18:707,spr:0},
    {n:"Gutierrez Renata", h15:1345,h18:206,spr:0},
    {n:"Mateluna Florencia",h15:1222,h18:318,spr:0},
    {n:"Gacitua Emilia",   h15:849, h18:722,spr:32},
   ],
   jugadoras:[
    {n:"Gomez Camila",     min:51,dist:5161,mxm:100,hsr:782, acc:2, dsc:9, vmax:20.1},
    {n:"Sierra Julieta",   min:52,dist:5566,mxm:106,hsr:514, acc:24,dsc:31,vmax:22.7},
    {n:"Alfaro Javiera",   min:54,dist:6144,mxm:113,hsr:1592,acc:6, dsc:16,vmax:20.6},
    {n:"Carrasco Sofia",   min:55,dist:6204,mxm:111,hsr:1910,acc:22,dsc:22,vmax:22.6},
    {n:"Mateluna Florencia",min:61,dist:6831,mxm:112,hsr:1863,acc:27,dsc:18,vmax:21.9},
    {n:"Pareja Camila",    min:66,dist:6945,mxm:105,hsr:1381,acc:7, dsc:8, vmax:21.5},
    {n:"Pollmann Marianne",min:65,dist:7322,mxm:111,hsr:1938,acc:11,dsc:29,vmax:23.0},
    {n:"Gutierrez Renata", min:69,dist:7359,mxm:105,hsr:1927,acc:17,dsc:6, vmax:21.1},
    {n:"Errazu Sofia",     min:71,dist:7608,mxm:106,hsr:2151,acc:37,dsc:9, vmax:22.5},
    {n:"Gacitua Emilia",   min:71,dist:7916,mxm:110,hsr:2253,acc:29,dsc:33,vmax:24.5},
   ]},

  // ── 8-abr ──────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del sheet:
  {id:"e02",label:"8/04",fecha:"8/04",tipo:"entreno",
   prom_spr:0,
   zonas:[
    {n:"Arau Maria",       h15:19, h18:4,  spr:0},
    {n:"Gomez Camila",     h15:281,h18:10, spr:0},
    {n:"Gacitua Emilia",   h15:565,h18:725,spr:124},
    {n:"Pareja Camila",    h15:674,h18:265,spr:15},
    {n:"Alfaro Javiera",   h15:661,h18:506,spr:42},
    {n:"Retamal Antonia",  h15:807,h18:474,spr:82},
    {n:"Gutierrez Renata", h15:668,h18:331,spr:9},
    {n:"Carrasco Sofia",   h15:631,h18:841,spr:119},
    {n:"Mateluna Florencia",h15:691,h18:434,spr:71},
    {n:"Sepulveda Eileen", h15:606,h18:768,spr:35},
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

  // ── 10-abr ─────────────────────────────────────────────────────────────────
  // SIN sub-tabla de zonas (la única sin ella)
  // Solo Muñoz Constanza tiene GPS. Fila promedio dist=2.667, mxm=82, HSR=1772, spr=0
  {id:"e03",label:"10/04",fecha:"10/04",tipo:"entreno",
   prom_spr:0,
   zonas:null, // no hay sub-tabla de zonas
   jugadoras:[
    {n:"Muñoz Constanza",min:33,dist:2667,mxm:82,hsr:1772,acc:8,dsc:1,vmax:20.9},
   ]},

  // ── 13-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del sheet:
  {id:"e04",label:"13/04",fecha:"13/04",tipo:"entreno",
   prom_spr:Math.round((0+0+0+0+0+0+0+0+0)/9),
   zonas:[
    {n:"Arau Maria",       h15:0,  h18:0,  spr:0},
    {n:"Gomez Camila",     h15:99, h18:14, spr:0},
    {n:"Alfaro Javiera",   h15:77, h18:68, spr:0},
    {n:"Gutierrez Renata", h15:80, h18:59, spr:0},
    {n:"Pareja Camila",    h15:76, h18:40, spr:0},
    {n:"Carrasco Sofia",   h15:91, h18:98, spr:0},
    {n:"Gacitua Emilia",   h15:81, h18:120,spr:0},
    {n:"Errazu Sofia",     h15:83, h18:105,spr:0},
    {n:"Mateluna Florencia",h15:96,h18:89, spr:0},
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

  // ── 15-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del sheet:
  {id:"e05",label:"15/04",fecha:"15/04",tipo:"entreno",
   prom_spr:Math.round((0+0+0+0+5+0+0+0+0+0+13)/11),
   zonas:[
    {n:"Errazu Sofia",     h15:192,h18:66, spr:0},
    {n:"Sierra Julieta",   h15:296,h18:112,spr:0},
    {n:"Gomez Camila",     h15:256,h18:65, spr:0},
    {n:"Pollmann Marianne",h15:351,h18:92, spr:0},
    {n:"Alfaro Javiera",   h15:197,h18:35, spr:5},
    {n:"Muñoz Constanza",  h15:305,h18:46, spr:0},
    {n:"Silva Victoria",   h15:606,h18:207,spr:0},
    {n:"Carrasco Sofia",   h15:637,h18:382,spr:0},
    {n:"Pareja Camila",    h15:284,h18:112,spr:0},
    {n:"Gutierrez Renata", h15:450,h18:146,spr:0},
    {n:"Gacitua Emilia",   h15:618,h18:434,spr:13},
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
  // Sub-tabla zonas del sheet. Fila Promedio: h15=76, h18=66, spr=0
  {id:"e06",label:"17/04",fecha:"17/04",tipo:"entreno",
   prom_spr:0,
   zonas:[
    {n:"Pareja Camila",    h15:440,h18:195,spr:0},
    {n:"Carrasco Sofia",   h15:244,h18:614,spr:0},
    {n:"Gomez Camila",     h15:563,h18:120,spr:2},
    {n:"Alfaro Javiera",   h15:472,h18:300,spr:0},
    {n:"Pollmann Marianne",h15:481,h18:213,spr:0},
    {n:"Gutierrez Renata", h15:401,h18:421,spr:0},
    {n:"Mateluna Florencia",h15:450,h18:364,spr:3},
    {n:"Gacitua Emilia",   h15:285,h18:503,spr:67},
   ],
   jugadoras:[
    {n:"Pareja Camila",    min:13,dist:2059,mxm:152,hsr:1110,acc:2, dsc:0, vmax:19.9},
    {n:"Alfaro Javiera",   min:17,dist:2060,mxm:118,hsr:1159,acc:4, dsc:1, vmax:20.6},
    {n:"Carrasco Sofia",   min:18,dist:2173,mxm:115,hsr:1306,acc:8, dsc:0, vmax:22.6},
    {n:"Pollmann Marianne",min:15,dist:2189,mxm:141,hsr:1428,acc:2, dsc:1, vmax:20.9},
    {n:"Gomez Camila",     min:19,dist:2263,mxm:118,hsr:591, acc:0, dsc:3, vmax:19.1},
    {n:"Errazu Sofia",     min:18,dist:2271,mxm:121,hsr:1446,acc:27,dsc:1, vmax:21.7},
    {n:"Gutierrez Renata", min:17,dist:2311,mxm:134,hsr:1551,acc:10,dsc:0, vmax:20.2},
    {n:"Mateluna Florencia",min:19,dist:2377,mxm:124,hsr:1440,acc:19,dsc:1, vmax:20.6},
    {n:"Gacitua Emilia",   min:19,dist:2571,mxm:135,hsr:1604,acc:7, dsc:4, vmax:21.4},
   ]},

  // ── 20-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del sheet:
  {id:"e07",label:"20/04",fecha:"20/04",tipo:"entreno",
   prom_spr:0,
   zonas:[
    {n:"Pollmann Marianne",h15:237,h18:32, spr:0},
    {n:"Pareja Camila",    h15:328,h18:5,  spr:0},
    {n:"Alfaro Javiera",   h15:298,h18:2,  spr:0},
    {n:"Retamal Antonia",  h15:446,h18:7,  spr:0},
    {n:"Gomez Camila",     h15:268,h18:0,  spr:0},
    {n:"Gacitua Emilia",   h15:637,h18:20, spr:0},
    {n:"Sepulveda Eileen", h15:621,h18:69, spr:0},
    {n:"Carrasco Sofia",   h15:747,h18:118,spr:0},
   ],
   jugadoras:[
    {n:"Pollmann Marianne",min:7, dist:863, mxm:120,hsr:268,acc:26,dsc:2, vmax:19.9},
    {n:"Pareja Camila",    min:7, dist:993, mxm:131,hsr:333,acc:28,dsc:15,vmax:18.6},
    {n:"Alfaro Javiera",   min:7, dist:994, mxm:132,hsr:301,acc:12,dsc:14,vmax:18.4},
    {n:"Retamal Antonia",  min:7, dist:1012,mxm:134,hsr:453,acc:35,dsc:12,vmax:18.2},
    {n:"Gomez Camila",     min:7, dist:1033,mxm:136,hsr:268,acc:15,dsc:18,vmax:17.3},
    {n:"Gacitua Emilia",   min:13,dist:1727,mxm:133,hsr:657,acc:46,dsc:28,vmax:18.7},
    {n:"Sepulveda Eileen", min:13,dist:1737,mxm:133,hsr:690,acc:44,dsc:28,vmax:19.2},
    {n:"Carrasco Sofia",   min:13,dist:1844,mxm:142,hsr:866,acc:52,dsc:37,vmax:21.1},
   ]},

  // ── 22-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del sheet:
  {id:"e08",label:"22/04",fecha:"22/04",tipo:"entreno",
   prom_spr:Math.round((5+22+29+1+38+59+26+138)/8),
   zonas:[
    {n:"Sepulveda Eileen", h15:29, h18:47, spr:5},
    {n:"Alfaro Javiera",   h15:100,h18:244,spr:22},
    {n:"Retamal Antonia",  h15:207,h18:603,spr:29},
    {n:"Pareja Camila",    h15:566,h18:348,spr:1},
    {n:"Gutierrez Renata", h15:637,h18:400,spr:38},
    {n:"Carrasco Sofia",   h15:337,h18:818,spr:59},
    {n:"Mateluna Florencia",h15:496,h18:638,spr:26},
    {n:"Gacitua Emilia",   h15:307,h18:763,spr:138},
   ],
   jugadoras:[
    {n:"Sepulveda Eileen", min:5, dist:396, mxm:71, hsr:82,  acc:5, dsc:0, vmax:24.5},
    {n:"Alfaro Javiera",   min:7, dist:720, mxm:98, hsr:366, acc:15,dsc:3, vmax:25.5},
    {n:"Retamal Antonia",  min:11,dist:1288,mxm:111,hsr:839, acc:29,dsc:28,vmax:25.4},
    {n:"Pareja Camila",    min:16,dist:1828,mxm:111,hsr:915, acc:35,dsc:5, vmax:24.1},
    {n:"Gutierrez Renata", min:16,dist:1883,mxm:114,hsr:1076,acc:31,dsc:19,vmax:25.4},
    {n:"Carrasco Sofia",   min:16,dist:1902,mxm:116,hsr:1215,acc:44,dsc:15,vmax:25.5},
    {n:"Mateluna Florencia",min:16,dist:1956,mxm:119,hsr:1160,acc:47,dsc:11,vmax:25.1},
    {n:"Gacitua Emilia",   min:16,dist:1976,mxm:120,hsr:1207,acc:40,dsc:14,vmax:27.1},
   ]},

  // ── 29-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del sheet:
  {id:"e09",label:"29/04",fecha:"29/04",tipo:"entreno",
   prom_spr:0,
   zonas:[
    {n:"Arau Maria",       h15:39, h18:0,  spr:0},
    {n:"Pollmann Marianne",h15:389,h18:52, spr:0},
    {n:"Gomez Camila",     h15:317,h18:8,  spr:0},
    {n:"Pareja Camila",    h15:430,h18:22, spr:0},
    {n:"Alfaro Javiera",   h15:393,h18:24, spr:0},
    {n:"Retamal Antonia",  h15:579,h18:43, spr:0},
    {n:"Gacitua Emilia",   h15:792,h18:112,spr:0},
    {n:"Carrasco Sofia",   h15:983,h18:238,spr:0},
    {n:"Sepulveda Eileen", h15:747,h18:86, spr:0},
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
  // Sub-tabla zonas del sheet:
  {id:"e10",label:"4/05",fecha:"4/05",tipo:"entreno",
   prom_spr:Math.round(3/9),
   zonas:[
    {n:"Errazu Sofia",     h15:307,h18:332,spr:3},
    {n:"Pollmann Marianne",h15:414,h18:232,spr:0},
    {n:"Gutierrez Renata", h15:655,h18:54, spr:0},
    {n:"Gomez Camila",     h15:459,h18:52, spr:0},
    {n:"Pastenes Nicole",  h15:317,h18:101,spr:0},
    {n:"Carrasco Sofia",   h15:437,h18:525,spr:0},
    {n:"Mateluna Florencia",h15:705,h18:297,spr:0},
    {n:"Gacitua Emilia",   h15:394,h18:501,spr:0},
    {n:"Sepulveda Eileen", h15:383,h18:564,spr:0},
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
];

// ─── MINUTOS DE JUEGO — hoja "Minutos Juego" del Drive ──────────────────────
// Partidos: COGS(22/3) | PWCC(5/4) | MANQ A(25/4) | UC B=CAT B(10/5) | OLD REDS
const MINUTOS=[
  {n:"Alfaro Javiera",    div:"1era",cogs:45,  pwcc:null,manq:22,  catb:27,  reds:28,  tot:122, prom:30.5},
  {n:"Arau María Paz",    div:"1era",cogs:60,  pwcc:60,  manq:60,  catb:60,  reds:null,tot:240, prom:60.0},
  {n:"Carrasco Sofia",    div:"1era",cogs:null,pwcc:46,  manq:32,  catb:26,  reds:32,  tot:136, prom:34.0},
  {n:"Gacitua Emilia",    div:"1era",cogs:52,  pwcc:63,  manq:71,  catb:65,  reds:71,  tot:322, prom:64.4},
  {n:"Gomez Camila",      div:"1era",cogs:48,  pwcc:42,  manq:49,  catb:40,  reds:49,  tot:228, prom:45.6},
  {n:"Gutierrez Renata",  div:"1era",cogs:63,  pwcc:63,  manq:71,  catb:65,  reds:71,  tot:333, prom:66.6},
  {n:"Liu Macarena",      div:"1era",cogs:null,pwcc:null,manq:48,  catb:null,reds:48,  tot:96,  prom:48.0},
  {n:"Mateluna Florencia",div:"1era",cogs:null,pwcc:42,  manq:null,catb:null,reds:null,tot:42,  prom:42.0},
  {n:"Muñoz Constanza",   div:"1era",cogs:62,  pwcc:66,  manq:63,  catb:65,  reds:63,  tot:319, prom:63.8},
  {n:"Pareja Camila",     div:"1era",cogs:64,  pwcc:63,  manq:71,  catb:65,  reds:71,  tot:334, prom:66.8},
  {n:"Pollmann Marianne", div:"1era",cogs:60,  pwcc:58,  manq:71,  catb:64,  reds:71,  tot:324, prom:64.8},
  {n:"Errazu Sofia",      div:"1era",cogs:57,  pwcc:51,  manq:null,catb:44,  reds:null,tot:152, prom:50.7},
  {n:"Sierra Julieta",    div:"1era",cogs:59,  pwcc:62,  manq:71,  catb:65,  reds:71,  tot:328, prom:65.6},
  {n:"Silva Victoria",    div:"1era",cogs:57,  pwcc:50,  manq:71,  catb:65,  reds:71,  tot:314, prom:62.8},
];

// ─── YO-YO — hoja YOYO RIN1 del Drive "Old Gabs 1era" ────────────────────────
// Bloque 1era: 5 jugadoras registradas
// Clasificación: >16.5 verde | 14.6-16.4 amarillo | <14.6 rojo
// Podio por NIVEL ALCANZADO
const YOYO=[
  {n:"Alfaro Javiera",  nivel:14.8,vamKmh:14.5,vam:4.0,fecha:"21-04"},
  {n:"Arau María Paz",  nivel:13.1,vamKmh:14.0,vam:3.9,fecha:"21-04"},
  {n:"Gacitua Emilia",  nivel:16.3,vamKmh:15.5,vam:4.3,fecha:"24-04"},
  {n:"Gomez Camila",    nivel:15.5,vamKmh:15.0,vam:4.2,fecha:"24-04"},
  {n:"Gutierrez Renata",nivel:16.4,vamKmh:15.5,vam:4.3,fecha:"21-04"},
];
// Distancia estándar Yo-Yo IRT1 por nivel
const yoyoDist={13.1:120,14.8:560,15.5:920,16.3:1400,16.4:1480};
const yoyoColor=v=>v>16.5?"#3ecf7a":v>=14.6?"#e09020":"#e05555";
const yoyoLabel=v=>v>16.5?"Verde (>16.5)":v>=14.6?"Amarillo (14.6–16.4)":"Rojo (<14.6)";
const yoyoGrupo=vam=>vam>=4.3?"Grupo 1 ≥4.3 m/s":vam>=4.0?"Grupo 2 — 4.0–4.2 m/s":"Grupo 3 <4.0 m/s";

// ─── PUESTOS — tabla resumen del Drive ────────────────────────────────────────
const PUESTOS=[
  {p:"DC",n:"Def. Central", dist:5590,hsr:385,acc:10,dsc:16,sprN:0,vmax:22.7},
  {p:"LT",n:"Lateral",      dist:6781,hsr:592,acc:9, dsc:16,sprN:0,vmax:20.7},
  {p:"MC",n:"Med. Central", dist:7040,hsr:1006,acc:27,dsc:43,sprN:0,vmax:23.7},
  {p:"VL",n:"Volante",      dist:7043,hsr:1138,acc:34,dsc:43,sprN:5,vmax:24.2},
  {p:"DL",n:"Del. Central", dist:6353,hsr:606,acc:18,dsc:15,sprN:0,vmax:21.5},
  {p:"WG",n:"Wing",         dist:5913,hsr:528,acc:23,dsc:19,sprN:0,vmax:21.3},
  {p:"PROM",n:"Promedio",   dist:6111,hsr:690,acc:16,dsc:22,sprN:1,vmax:22.2},
];

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
const ZONAS_DOLOR=["Gemelo/Sóleo","Cuádriceps","Isquiotibial","Rodilla","Aductor","Flexor cadera","Glúteo","Lumbar","Cuello","Otro"];

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

// ─── STAFF PUESTOS ────────────────────────────────────────────────────────────
function StaffPuestos(){
  return(
    <>
      <MR>
        <MetCard label="Dist. prom." value={`${PUESTOS.find(p=>p.p==="PROM").dist.toLocaleString()}m`} sub="Partidos oficiales"/>
        <MetCard label="HSR prom." value={`${PUESTOS.find(p=>p.p==="PROM").hsr}m`}/>
        <MetCard label="Vel. máx prom." value={`${PUESTOS.find(p=>p.p==="PROM").vmax} km/h`} sc={T.amber}/>
      </MR>
      <Card>
        <CT text="Por puesto — partidos oficiales"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["Puesto","Nombre","Dist.","HSR","ACC","DSC","Nº Spr","V.máx"]}/>
            <tbody>{PUESTOS.map(p=>(
              <tr key={p.p} style={{background:p.p==="PROM"?"#0d1020":"transparent"}}>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:p.p==="PROM"?T.muted:T.blue,fontWeight:600}}>{p.p}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{p.n}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:p.p==="PROM"?700:400}}>{p.dist.toLocaleString()}m</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.green}}>{p.hsr.toLocaleString()}m</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{p.acc}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{p.dsc}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{p.sprN}</td>
                <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{p.vmax}</td>
              </tr>
            ))}</tbody>
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
  return(
    <>
      <MR>
        <MetCard label="Nivel prom." value={avg(YOYO.map(p=>p.nivel)).toFixed(1)} sub="Yo-Yo IRT1 — 1era"/>
        <MetCard label="Nivel más alto" value={sorted[0].nivel} sub={sorted[0].n.split(" ")[0]} sc={T.amber}/>
        <MetCard label="VAM prom." value={`${avg(YOYO.map(p=>p.vam)).toFixed(1)} m/s`}/>
        <MetCard label="Evaluadas 1era" value={YOYO.length} sub="Resto sin datos en 1era"/>
      </MR>
      <Card style={{marginBottom:10}}>
        <CT text="Clasificación por Nivel"/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{label:">16.5 — Verde",c:"#3ecf7a"},{label:"14.6–16.4 — Amarillo",c:"#e09020"},{label:"<14.6 — Rojo",c:"#e05555"}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"#0d1020",padding:"7px 12px",borderRadius:8,border:`1px solid ${r.c}44`}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:r.c}}/>
              <span style={{fontSize:11,color:r.c,fontWeight:500}}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <div style={{marginBottom:6,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".5px"}}>Podio — Nivel Alcanzado</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {sorted.slice(0,3).map((p,i)=>{
          const col=yoyoColor(p.nivel);
          return(
            <div key={p.n} style={{background:T.surf,border:`1px solid ${col}`,borderRadius:8,padding:12,textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{medals[i]}</div>
              <div style={{fontSize:12,fontWeight:500,color:T.text}}>{p.n.split(" ")[0]}</div>
              <div style={{fontSize:20,fontWeight:700,color:col,margin:"4px 0"}}>Niv. {p.nivel}</div>
              <div style={{fontSize:11,color:T.muted2}}>{p.vam} m/s · {p.vamKmh} km/h</div>
              <div style={{marginTop:6,background:col+"22",borderRadius:6,padding:"3px 0",color:col,fontSize:10,fontWeight:500}}>{yoyoLabel(p.nivel)}</div>
            </div>
          );
        })}
      </div>
      <Card>
        <CT text="Yo-Yo IRT1 — Hoja YOYO RIN1 · Bloque 1era (ordenado por Nivel)"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["#","Jugadora","Nivel","VAM km/h","VAM m/s","Dist. (m)","Grupo","Fecha","Clasificación"]}/>
            <tbody>{sorted.map((p,i)=>{
              const col=yoyoColor(p.nivel);
              const dist=yoyoDist[p.nivel]||"—";
              return(
                <tr key={p.n}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{i+1}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,fontWeight:500,whiteSpace:"nowrap"}}>{p.n}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:700,fontFamily:"monospace",fontSize:14}}>{p.nivel}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{p.vamKmh}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:col,fontWeight:600}}>{p.vam}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{dist}m</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824"}}>
                    <span style={{background:col+"22",color:col,padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:500}}>{yoyoGrupo(p.vam)}</span>
                  </td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted,fontSize:11}}>{p.fecha}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824"}}>
                    <span style={{background:col+"22",color:col,padding:"2px 7px",borderRadius:4,fontSize:10}}>{yoyoLabel(p.nivel)}</span>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
        <div style={{marginTop:10,padding:"8px 12px",background:"#1e2535",borderRadius:6,fontSize:11,color:T.muted2}}>
          ⚠ Solo 5 jugadoras registradas en bloque 1era de la hoja YOYO RIN1. El resto de jugadoras no tiene registro en ese bloque.
        </div>
      </Card>
    </>
  );
}

// ─── STAFF MINUTOS DE JUEGO ────────────────────────────────────────────────────
function StaffMinutos(){
  const partidos=["COGS","PWCC","MANQ A","UC B"];
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
            <TH cols={["Jugadora","Div","COGS","PWCC","MANQ A","UC B","Total","Prom."]}/>
            <tbody>{[...MINUTOS].sort((a,b)=>b.tot-a.tot).map(m=>{
              const col=m.tot>=200?T.green:m.tot>=100?T.amber:T.muted;
              return(
                <tr key={m.n}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{m.n}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824"}}><Chip text={m.div} color={m.div==="S16"?T.purple:T.blue}/></td>
                  {[m.cogs,m.pwcc,m.manq,m.ucb].map((v,i)=>(
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

// ─── RADAR CHART ──────────────────────────────────────────────────────────────
function RadarChart({player,sesion}){
  if(!sesion||sesion.jugadoras.length<2)return null;
  const jd=sesion.jugadoras.find(j=>j.n===player);
  if(!jd)return null;
  const labs=["Dist","m/min","HSR","ACC","Vmáx"];
  const jV=[jd.dist,jd.mxm,jd.hsr||jd.ai15||0,jd.acc||0,jd.vmax];
  const gA=k=>sesion.jugadoras.reduce((s,j)=>s+(j[k]||0),0)/sesion.jugadoras.length;
  const tV=[gA("dist"),gA("mxm"),gA("hsr")||gA("ai15")||0,gA("acc"),gA("vmax")];
  const mx=jV.map((v,i)=>Math.max(v,tV[i],0.1));
  const nr=arr=>arr.map((v,i)=>Math.min(v/mx[i],1.4));
  const jN=nr(jV);const tN=nr(tV);
  const cx=110,cy=110,r=85,n=5;
  const ag=i=>(Math.PI*2*i/n)-Math.PI/2;
  const pt=(v,i)=>`${cx+v*r*Math.cos(ag(i))},${cy+v*r*Math.sin(ag(i))}`;
  const poly=(nm,col)=>`<polygon points="${nm.map((v,i)=>pt(v,i)).join(" ")}" fill="${col}33" stroke="${col}" stroke-width="2"/>`;
  const spokes=Array.from({length:n},(_,i)=>`<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(ag(i))}" y2="${cy+r*Math.sin(ag(i))}" stroke="#2a3550" stroke-width="1"/>`).join("");
  const rings=[.33,.67,1].map(v=>`<polygon points="${Array.from({length:n},(_,i)=>pt(v,i)).join(" ")}" fill="none" stroke="#1e2535" stroke-width="1"/>`).join("");
  const lbl=labs.map((l,i)=>{const x=cx+(r+16)*Math.cos(ag(i));const y=cy+(r+16)*Math.sin(ag(i));return`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="10" fill="${jN[i]>=tN[i]?"#3ecf7a":"#6a7490"}">${l}</text>`;}).join("");
  const dots=jN.map((v,i)=>`<circle cx="${cx+v*r*Math.cos(ag(i))}" cy="${cy+v*r*Math.sin(ag(i))}" r="4" fill="#3ecf7a"/>`).join("");
  const svg=`<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">${rings}${spokes}${poly(tN,"#4a90e8")}${poly(jN,"#3ecf7a")}${dots}${lbl}</svg>`;
  return(
    <Card style={{marginBottom:12}}>
      <CT text={`Radar — ${player.split(" ")[0]} vs promedio equipo`}/>
      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{width:200,flexShrink:0}} dangerouslySetInnerHTML={{__html:svg}}/>
        <div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><div style={{width:14,height:3,background:"#3ecf7a",borderRadius:2}}/><span style={{color:T.muted2,fontSize:12}}>{player.split(" ")[0]}</span></div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}><div style={{width:14,height:3,background:T.blue,borderRadius:2}}/><span style={{color:T.muted2,fontSize:12}}>Promedio equipo</span></div>
          {labs.map((l,i)=>{const d=Math.round((jN[i]-tN[i])*100);return(<div key={l} style={{display:"flex",justifyContent:"space-between",gap:12,marginBottom:4}}><span style={{color:T.muted,fontSize:11}}>{l}</span><span style={{color:d>0?T.green:d<0?T.red:T.muted,fontSize:11,fontWeight:600}}>{d>0?"+":""}{d}%</span></div>);})}
        </div>
      </div>
    </Card>
  );
}

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
      {(tipo==="partidos"||tipo==="amistosos")&&sess.length>0&&(
        <RadarChart player={player} sesion={sess[0]}/>
      )}
      <Card style={{marginBottom:10}}>
        <CT text="Detalle por sesión"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <TH cols={["Sesión","Fecha","Min","Dist.","m/min","HSR","ACC","V.máx"]}/>
            <tbody>{sess.map(s=>(
              <tr key={s.id}>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{sIcon(s.tipo)} {s.label}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{s.fecha}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{s.data.min}'</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{s.data.dist.toLocaleString()}m</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{s.data.mxm}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text}}>{(s.data.hsr||s.data.ai15||0)}m</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{s.data.acc||0}</td>
                <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{s.data.vmax}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </Card>
      {/* Sprint >21 por sesión */}
      {hsrLegend}
      <Card>
        <CT text="Sprint >21 km/h por sesión"/>
        {sess.map(s=>{
          const zd=s.zonas?s.zonas.find(z=>z.n===player):null;
          const sp=zd?zd.spr:s.data.spr!=null?s.data.spr:0;
          return(
            <div key={s.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:10,color:T.muted2,width:80,flexShrink:0}}>{sIcon(s.tipo)} {s.label}</span>
              <div style={{flex:1,background:"#1e2535",borderRadius:3,height:6}}>
                {sp>0&&<div style={{width:`${Math.min(sp/200*100,100)}%`,height:6,borderRadius:3,background:T.red}}/>}
              </div>
              <span style={{fontSize:10,color:sp>0?T.red:T.muted,width:36,textAlign:"right",fontWeight:sp>0?600:400}}>{sp}m</span>
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
      <div style={{color:T.muted,fontSize:14}}>Sin registro Yo-Yo en hoja 1era</div>
    </div>
  );
  const col=yoyoColor(d.nivel);
  const dist=yoyoDist[d.nivel]||"—";
  return(
    <>
      <div style={{background:T.surf,border:`1px solid ${col}`,borderRadius:8,padding:"14px 16px",marginBottom:14,textAlign:"center"}}>
        <div style={{fontSize:11,color:T.muted,marginBottom:4}}>Yo-Yo IRT1 — {d.fecha}</div>
        <div style={{fontSize:30,fontWeight:700,color:col,marginBottom:2}}>Nivel {d.nivel}</div>
        <div style={{fontSize:18,color:T.muted2,marginBottom:6}}>{d.vam} m/s · {d.vamKmh} km/h</div>
        <div style={{fontSize:13,color:T.muted,marginBottom:8}}>{dist}m alcanzados</div>
        <span style={{background:col+"22",color:col,padding:"4px 16px",borderRadius:6,fontSize:12,fontWeight:500}}>{yoyoLabel(d.nivel)}</span>
      </div>
      <MR>
        <MetCard label="Mi nivel" value={d.nivel} sc={col}/>
        <MetCard label="VAM" value={`${d.vam} m/s`} sc={col}/>
        <MetCard label="Ranking" value={`#${myRank}`} sub={`de ${sorted.length}`}/>
        <MetCard label="Grupo" value={yoyoGrupo(d.vam).split(" ")[1]||"1"} sc={col}/>
      </MR>
      <Card>
        <CT text="Mi posición en el ranking (por Nivel)"/>
        {sorted.map((p,i)=>{const isMe=p.n===player;const gc=yoyoColor(p.nivel);return(
          <div key={p.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,background:isMe?T.amber+"11":"transparent",borderRadius:4,padding:isMe?"2px 4px":0}}>
            {isMe&&<span style={{color:T.amber,fontSize:9}}>▶</span>}
            <span style={{fontSize:11,color:isMe?T.amber:T.text,width:130,flexShrink:0,fontWeight:isMe?500:400}}>{i+1}. {p.n.split(" ")[0]}</span>
            <div style={{flex:1,background:"#1e2535",borderRadius:3,height:7}}><div style={{width:`${Math.round((p.nivel-12)/(17-12)*100)}%`,height:7,borderRadius:3,background:isMe?T.amber:gc}}/></div>
            <span style={{fontSize:11,color:isMe?T.amber:gc,width:55,textAlign:"right"}}>{p.nivel} ({p.vam})</span>
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
        <button onClick={()=>setSaved(true)} style={{width:"100%",padding:10,background:T.maroon,border:"none",borderRadius:6,color:"#fff",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>Guardar Wellness</button>
        {saved&&<div style={{textAlign:"center",marginTop:8,fontSize:12,color:T.green}}>✓ Wellness guardado</div>}
      </Card>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const STAFF_TABS=["GPS","Puestos","Yo-Yo","Minutos","Asistencia","RPE","Wellness"];
const PLAYER_TABS=["Mi GPS","Yo-Yo","Asistencia","Mi RPE","Mi Wellness"];


// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  const [tipo,setTipo]=useState(null);
  const [pass,setPass]=useState("");
  const [player,setPlayer]=useState("");
  const [error,setError]=useState("");
  const handleLogin=()=>{
    if(tipo==="staff"){
      if(pass==="Staffoldgabs"){onLogin("staff",null)}
      else{setError("Contraseña incorrecta");setPass("");}
    }else{
      if(pass==="1eraoldgabs"){
        if(!player){setError("Seleccioná tu nombre");return;}
        onLogin("jugadora",player)
      }else{setError("Contraseña incorrecta");setPass("");}
    }
  };
  return(
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"system-ui,sans-serif",padding:20}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:T.maroon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 12px"}}>🏑</div>
        <div style={{fontSize:20,fontWeight:700,color:T.text,letterSpacing:1}}>OLD GABS 1ERA</div>
        <div style={{fontSize:12,color:T.muted,marginTop:4}}>Dashboard GPS · Temporada 2026</div>
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
                  {allNames().map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Contraseña</div>
              <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" style={{width:"100%",background:"#0d1020",border:`1px solid ${error?T.red:T.border2}`,borderRadius:8,color:T.text,fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
              {error&&<div style={{fontSize:11,color:T.red,marginTop:6}}>{error}</div>}
            </div>
            <button onClick={handleLogin} style={{width:"100%",padding:12,background:tipo==="staff"?T.blue:T.green,border:"none",borderRadius:8,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Ingresar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App(){
  const [session,setSession]=useState(null);
  const [tab,setTab]=useState(0);
  const [player,setPlayer]=useState(allNames()[0]);
  const handleLogin=(tipo,playerName)=>{setSession({tipo,player:playerName});setTab(0);if(playerName)setPlayer(playerName);};
  const handleLogout=()=>{setSession(null);setTab(0);};
  if(!session)return<LoginScreen onLogin={handleLogin}/>;
  const mode=session.tipo==="staff"?"staff":"player";
  const STAFF_TABS=["GPS","Evolución GPS","Perfil Puestos","Yo-Yo","Minutos","Asistencia","RPE","Wellness"];
  const PLAYER_TABS=["Mi GPS","Yo-Yo","Minutos","Asistencia","Mi RPE","Mi Wellness"];
  const tabs=mode==="staff"?STAFF_TABS:PLAYER_TABS;
  return(
    <div style={{background:T.bg,color:T.text,minHeight:"100vh",fontFamily:"system-ui,sans-serif"}}>
      {/* Header */}
      <div style={{background:"#080a0f",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px",height:46,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:T.maroon,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🏑</div>
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
          <>{tab===0&&<StaffGPS/>}{tab===1&&<StaffEvoGPS/>}{tab===2&&<StaffPuestos/>}{tab===3&&<StaffYoyo/>}{tab===4&&<StaffMinutos/>}{tab===5&&<StaffAsistencia/>}{tab===6&&<StaffRPE/>}{tab===7&&<StaffWellness/>}</>
        ):(
          <>{tab===0&&<PlayerGPS player={session.player||player}/>}{tab===1&&<PlayerYoyo player={session.player||player}/>}{tab===2&&<PlayerMinutos player={session.player||player}/>}{tab===3&&<PlayerAsistencia player={session.player||player}/>}{tab===4&&<PlayerRPE player={session.player||player}/>}{tab===5&&<PlayerWellness player={session.player||player}/>}</>
        )}
      </div>
    </div>
  );
}