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
// Zonas EXACTAS del Drive: h15=AI(15-18) | h18=AI(18-21) | spr=Sprint(>21)
// TODOS son datos directos de la sub-tabla de zonas del Drive

const ENTRENOS=[
  // ── 6-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive (exacta):
  // Pareja:1088/22/0 Alfaro:1015/144/0 Carrasco:735/571/0 Pollmann:1087/341/0
  // Gomez:553/38/0 Errazu:739/707/0 Gutierrez:1345/206/0 Mateluna:1222/318/0 Gacitua:849/722/32
  // Sierra (de tabla gral): 372/142/0
  {id:"e01",label:"6/04",fecha:"6/04",tipo:"entreno",
   prom_hsr:1631,prom_h18:434,prom_spr:11,
   zonas:[
    {n:"Pareja Camila",    h15:1088,h18:22,  spr:0},
    {n:"Alfaro Javiera",   h15:1015,h18:144, spr:0},
    {n:"Carrasco Sofia",   h15:735, h18:571, spr:0},
    {n:"Pollmann Marianne",h15:1087,h18:341, spr:0},
    {n:"Gomez Camila",     h15:553, h18:38,  spr:0},
    {n:"Errazu Sofia",     h15:739, h18:707, spr:0},
    {n:"Gutierrez Renata", h15:1345,h18:206, spr:0},
    {n:"Mateluna Florencia",h15:1222,h18:318,spr:0},
    {n:"Gacitua Emilia",   h15:849, h18:722, spr:32},
    {n:"Sierra Julieta",   h15:372, h18:142, spr:0},
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

  // ── 8-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive:
  // Pareja:440/195/0 Carrasco:244/614/0 Gomez:563/120/2 Alfaro:472/300/0
  // Pollmann:481/213/0 Gutierrez:401/421/0 Mateluna:450/364/3 Gacitua:285/503/67
  {id:"e02",label:"8/04",fecha:"8/04",tipo:"entreno",
   prom_hsr:731,prom_h18:317,prom_spr:9,
   zonas:[
    {n:"Pareja Camila",    h15:440, h18:195,spr:0},
    {n:"Carrasco Sofia",   h15:244, h18:614,spr:0},
    {n:"Gomez Camila",     h15:563, h18:120,spr:2},
    {n:"Alfaro Javiera",   h15:472, h18:300,spr:0},
    {n:"Pollmann Marianne",h15:481, h18:213,spr:0},
    {n:"Gutierrez Renata", h15:401, h18:421,spr:0},
    {n:"Mateluna Florencia",h15:450,h18:364,spr:3},
    {n:"Gacitua Emilia",   h15:285, h18:503,spr:67},
   ],
   jugadoras:[
    {n:"Pareja Camila",    min:21,dist:1365,mxm:64, hsr:635, acc:44,dsc:23,vmax:20.6},
    {n:"Carrasco Sofia",   min:21,dist:1428,mxm:67, hsr:858, acc:47,dsc:40,vmax:23.5},
    {n:"Gomez Camila",     min:21,dist:1433,mxm:67, hsr:685, acc:35,dsc:25,vmax:21.0},
    {n:"Alfaro Javiera",   min:21,dist:1464,mxm:69, hsr:772, acc:42,dsc:28,vmax:21.1},
    {n:"Pollmann Marianne",min:21,dist:1487,mxm:70, hsr:694, acc:38,dsc:21,vmax:20.6},
    {n:"Gutierrez Renata", min:21,dist:1545,mxm:72, hsr:823, acc:44,dsc:30,vmax:21.6},
    {n:"Mateluna Florencia",min:21,dist:1582,mxm:74,hsr:816, acc:50,dsc:25,vmax:21.1},
    {n:"Gacitua Emilia",   min:21,dist:1594,mxm:75, hsr:856, acc:46,dsc:27,vmax:22.9},
   ]},

  // ── 10-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive: Muñoz:859/913/0
  {id:"e03",label:"10/04",fecha:"10/04",tipo:"entreno",
   prom_hsr:1772,prom_h18:913,prom_spr:0,
   zonas:[
    {n:"Muñoz Constanza",h15:859,h18:913,spr:0},
   ],
   jugadoras:[
    {n:"Muñoz Constanza",min:33,dist:2667,mxm:82,hsr:1772,acc:8,dsc:1,vmax:20.9},
   ]},

  // ── 13-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive:
  // Arau:19/4/0 Gomez:281/10/0 Gacitua:565/725/124 Pareja:674/265/15
  // Alfaro:661/506/42 Retamal:807/474/82 Gutierrez:668/331/9 Carrasco:631/841/119
  // Mateluna:691/434/71 Sepulveda:606/768/35
  {id:"e04",label:"13/04",fecha:"13/04",tipo:"entreno",
   prom_hsr:1029,prom_h18:538,prom_spr:50,
   zonas:[
    {n:"Arau Maria",        h15:19, h18:4,   spr:0},
    {n:"Gomez Camila",      h15:281,h18:10,  spr:0},
    {n:"Gacitua Emilia",    h15:565,h18:725, spr:124},
    {n:"Pareja Camila",     h15:674,h18:265, spr:15},
    {n:"Alfaro Javiera",    h15:661,h18:506, spr:42},
    {n:"Retamal Antonia",   h15:807,h18:474, spr:82},
    {n:"Gutierrez Renata",  h15:668,h18:331, spr:9},
    {n:"Carrasco Sofia",    h15:631,h18:841, spr:119},
    {n:"Mateluna Florencia",h15:691,h18:434, spr:71},
    {n:"Sepulveda Eileen",  h15:606,h18:768, spr:35},
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
  // Sub-tabla zonas del Drive:
  // Errazu:192/66/0 Sierra:296/112/0 Gomez:256/65/0 Pollmann:351/92/0
  // Alfaro:197/35/5 Muñoz:305/46/0 Silva:606/207/0 Carrasco:637/382/0
  // Pareja:284/112/0 Gutierrez:450/146/0 Gacitua:618/434/13
  {id:"e05",label:"15/04",fecha:"15/04",tipo:"entreno",
   prom_hsr:553,prom_h18:145,prom_spr:2,
   zonas:[
    {n:"Errazu Sofia",     h15:192,h18:66,  spr:0},
    {n:"Sierra Julieta",   h15:296,h18:112, spr:0},
    {n:"Gomez Camila",     h15:256,h18:65,  spr:0},
    {n:"Pollmann Marianne",h15:351,h18:92,  spr:0},
    {n:"Alfaro Javiera",   h15:197,h18:35,  spr:5},
    {n:"Muñoz Constanza",  h15:305,h18:46,  spr:0},
    {n:"Silva Victoria",   h15:606,h18:207, spr:0},
    {n:"Carrasco Sofia",   h15:637,h18:382, spr:0},
    {n:"Pareja Camila",    h15:284,h18:112, spr:0},
    {n:"Gutierrez Renata", h15:450,h18:146, spr:0},
    {n:"Gacitua Emilia",   h15:618,h18:434, spr:13},
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
  // Sub-tabla zonas del Drive. Promedio: h15=76, h18=66, spr=0
  // Arau:0/0/0 Gomez:99/14/0 Alfaro:77/68/0 Gutierrez:80/59/0
  // Pareja:76/40/0 Carrasco:91/98/0 Gacitua:81/120/0 Errazu:83/105/0 Mateluna:96/89/0
  {id:"e06",label:"17/04",fecha:"17/04",tipo:"entreno",
   prom_hsr:139,prom_h18:66,prom_spr:0,
   zonas:[
    {n:"Arau Maria",        h15:0,  h18:0,  spr:0},
    {n:"Gomez Camila",      h15:99, h18:14, spr:0},
    {n:"Alfaro Javiera",    h15:77, h18:68, spr:0},
    {n:"Gutierrez Renata",  h15:80, h18:59, spr:0},
    {n:"Pareja Camila",     h15:76, h18:40, spr:0},
    {n:"Carrasco Sofia",    h15:91, h18:98, spr:0},
    {n:"Gacitua Emilia",    h15:81, h18:120,spr:0},
    {n:"Errazu Sofia",      h15:83, h18:105,spr:0},
    {n:"Mateluna Florencia",h15:96, h18:89, spr:0},
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
  // Sub-tabla zonas del Drive:
  // Pollmann:237/32/0 Pareja:328/5/0 Alfaro:298/2/0 Retamal:446/7/0
  // Gomez:268/0/0 Gacitua:637/20/0 Sepulveda:621/69/0 Carrasco:747/118/0
  {id:"e07",label:"20/04",fecha:"20/04",tipo:"entreno",
   prom_hsr:462,prom_h18:32,prom_spr:0,
   zonas:[
    {n:"Pollmann Marianne", h15:237,h18:32, spr:0},
    {n:"Pareja Camila",     h15:328,h18:5,  spr:0},
    {n:"Alfaro Javiera",    h15:298,h18:2,  spr:0},
    {n:"Retamal Antonia",   h15:446,h18:7,  spr:0},
    {n:"Gomez Camila",      h15:268,h18:0,  spr:0},
    {n:"Gacitua Emilia",    h15:637,h18:20, spr:0},
    {n:"Sepulveda Eileen",  h15:621,h18:69, spr:0},
    {n:"Carrasco Sofia",    h15:747,h18:118,spr:0},
   ],
   jugadoras:[
    {n:"Pollmann Marianne", min:7, dist:863, mxm:120,hsr:268,acc:26,dsc:2, vmax:19.9},
    {n:"Pareja Camila",     min:7, dist:993, mxm:131,hsr:333,acc:28,dsc:15,vmax:18.6},
    {n:"Alfaro Javiera",    min:7, dist:994, mxm:132,hsr:301,acc:12,dsc:14,vmax:18.4},
    {n:"Retamal Antonia",   min:7, dist:1012,mxm:134,hsr:453,acc:35,dsc:12,vmax:18.2},
    {n:"Gomez Camila",      min:7, dist:1033,mxm:136,hsr:268,acc:15,dsc:18,vmax:17.3},
    {n:"Gacitua Emilia",    min:13,dist:1727,mxm:133,hsr:657,acc:46,dsc:28,vmax:18.7},
    {n:"Sepulveda Eileen",  min:13,dist:1737,mxm:133,hsr:690,acc:44,dsc:28,vmax:19.2},
    {n:"Carrasco Sofia",    min:13,dist:1844,mxm:142,hsr:866,acc:52,dsc:37,vmax:21.1},
   ]},

  // ── 22-abr ─────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive:
  // Sepulveda:29/47/5 Alfaro:100/244/22 Retamal:207/603/29 Pareja:566/348/1
  // Gutierrez:637/400/38 Carrasco:337/818/59 Mateluna:496/638/26 Gacitua:307/763/138
  {id:"e08",label:"22/04",fecha:"22/04",tipo:"entreno",
   prom_hsr:983,prom_h18:477,prom_spr:40,
   zonas:[
    {n:"Sepulveda Eileen",  h15:29, h18:47,  spr:5},
    {n:"Alfaro Javiera",    h15:100,h18:244, spr:22},
    {n:"Retamal Antonia",   h15:207,h18:603, spr:29},
    {n:"Pareja Camila",     h15:566,h18:348, spr:1},
    {n:"Gutierrez Renata",  h15:637,h18:400, spr:38},
    {n:"Carrasco Sofia",    h15:337,h18:818, spr:59},
    {n:"Mateluna Florencia",h15:496,h18:638, spr:26},
    {n:"Gacitua Emilia",    h15:307,h18:763, spr:138},
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
  // Sub-tabla zonas del Drive (todos spr=0):
  // Arau:39/0/0 Pollmann:389/52/0 Gomez:317/8/0 Pareja:430/22/0
  // Alfaro:393/24/0 Retamal:579/43/0 Gacitua:792/112/0 Carrasco:983/238/0 Sepulveda:747/86/0
  {id:"e09",label:"29/04",fecha:"29/04",tipo:"entreno",
   prom_hsr:589,prom_h18:62,prom_spr:0,
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
  // Sub-tabla zonas del Drive:
  // Errazu:307/332/3 Pollmann:414/232/0 Gutierrez:655/54/0 Gomez:459/52/0
  // Pastenes:317/101/0 Carrasco:437/525/0 Mateluna:705/297/0 Gacitua:394/501/0 Sepulveda:383/564/0
  {id:"e10",label:"4/05",fecha:"4/05",tipo:"entreno",
   prom_hsr:757,prom_h18:295,prom_spr:0,
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

  // ── 11/05 ──────────────────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive:
  // Arau:26/0/0 Pollmann:288/210/8 Pareja:280/411/4 Gutierrez:296/530/14
  // Gacitua:300/632/125 Retamal:399/416/86 Mateluna:352/508/120 Silva:382/585/117
  // Carrasco:390/689/13 Sierra:287/538/168
  {id:"e12",label:"11/05",fecha:"11/05",tipo:"entreno",
   prom_hsr:826,prom_h18:452,prom_spr:66,
   zonas:[
    {n:"Arau Maria",        h15:26,  h18:0,   spr:0},
    {n:"Pollmann Marianne", h15:288, h18:210, spr:8},
    {n:"Pareja Camila",     h15:280, h18:411, spr:4},
    {n:"Gutierrez Renata",  h15:296, h18:530, spr:14},
    {n:"Gacitua Emilia",    h15:300, h18:632, spr:125},
    {n:"Retamal Antonia",   h15:399, h18:416, spr:86},
    {n:"Mateluna Florencia",h15:352, h18:508, spr:120},
    {n:"Silva Victoria",    h15:382, h18:585, spr:117},
    {n:"Carrasco Sofia",    h15:390, h18:689, spr:13},
    {n:"Sierra Julieta",    h15:287, h18:538, spr:168},
   ],
   jugadoras:[
    {n:"Arau Maria",        min:54,dist:1514,mxm:28, hsr:26,  acc:16,dsc:2, vmax:17.0},
    {n:"Pollmann Marianne", min:51,dist:3107,mxm:60, hsr:506, acc:15,dsc:8, vmax:24.9},
    {n:"Pareja Camila",     min:50,dist:3666,mxm:73, hsr:695, acc:35,dsc:16,vmax:24.5},
    {n:"Gutierrez Renata",  min:50,dist:3736,mxm:74, hsr:841, acc:27,dsc:21,vmax:25.8},
    {n:"Gacitua Emilia",    min:51,dist:4106,mxm:79, hsr:1058,acc:48,dsc:33,vmax:28.0},
    {n:"Retamal Antonia",   min:50,dist:4194,mxm:83, hsr:901, acc:28,dsc:23,vmax:25.4},
    {n:"Mateluna Florencia",min:50,dist:4293,mxm:85, hsr:980, acc:51,dsc:37,vmax:25.9},
    {n:"Silva Victoria",    min:51,dist:4311,mxm:83, hsr:1084,acc:49,dsc:46,vmax:26.4},
    {n:"Carrasco Sofia",    min:51,dist:4341,mxm:84, hsr:1092,acc:45,dsc:53,vmax:26.1},
    {n:"Sierra Julieta",    min:50,dist:4359,mxm:86, hsr:993, acc:47,dsc:49,vmax:26.7},
   ]},

  // ── post 11/05 (Hevia) ─────────────────────────────────────────────────────
  // Sub-tabla zonas del Drive:
  // Arau:32/0/0 Gomez:127/17/0 Gutierrez:180/51/0 Carrasco:327/84/0
  // Mateluna:175/34/0 Pareja:260/26/0 Alfaro:161/46/0 Hevia:190/26/0
  // Gacitua:206/184/0 Errazu:284/68/0 Retamal:243/62/0
  {id:"e11",label:"post 11/05",fecha:"post 11/05",tipo:"entreno",
   prom_hsr:252,prom_h18:47,prom_spr:0,
   zonas:[
    {n:"Arau Maria",        h15:32,  h18:0,   spr:0},
    {n:"Gomez Camila",      h15:127, h18:17,  spr:0},
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
// Fechas de asistencia del Drive (hoja Asistencias) — desde Febrero
const ATT_MESES=[
  {label:"FEB", color:"#4a90e8", fechas:["13/2","18/2","20/2","23/2","25/2","27/2"]},
  {label:"MAR", color:"#3ecf7a", fechas:["2/3","4/3","6/3","9/3","11/3","13/3","16/3","18/3","20/3","23/3","25/3","27/3","30/3"]},
  {label:"ABR", color:"#e09020", fechas:["6/4","8/4","10/4","13/4","15/4","17/4","20/4","22/4","24/4","27/4","29/4"]},
  {label:"MAY", color:"#8b6fe8", fechas:["4/5","6/5","8/5","11/5","13/5","15/5"]},
];
const ATT_FECHAS=ATT_MESES.flatMap(m=>m.fechas);
// Datos de asistencia del Drive — hoja Asistencias
// dias[] = 1 presente, 0 ausente — en orden Feb→Mar→Abr→May
const ASISTENCIA={
  "Alfaro Javiera":    {feb:"67%",mar:"88%",abr:"75%",may:"60%",tot:"76%",
    dias:[1,1,0,0,1,0, 1,0,0,1,1,1,1,1,1,0,0,0,0, 1,1,1,0,1,1,1,0,1,1,0, 1,0,1,1,0,0]},
  "Arau María Paz":    {feb:"83%",mar:"88%",abr:"88%",may:"100%",tot:"89%",
    dias:[1,1,1,1,0,1, 1,1,0,1,1,1,0,1,1,0,0,0,0, 1,1,0,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Carrasco Sofia":    {feb:"67%",mar:"100%",abr:"100%",may:"100%",tot:"93%",
    dias:[0,0,1,1,1,1, 1,1,0,1,1,1,1,1,1,0,0,0,0, 1,1,1,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Errazu Sofia":      {feb:"83%",mar:"50%",abr:"50%",may:"80%",tot:"63%",
    dias:[1,1,1,1,1,0, 1,0,0,1,0,0,0,1,1,0,0,0,0, 1,0,0,1,0,0,1,0,0,1,0, 1,1,0,1,1,0]},
  "Gacitua Emilia":    {feb:"33%",mar:"63%",abr:"100%",may:"100%",tot:"73%",
    dias:[0,0,0,1,1,0, 1,1,0,0,1,0,0,1,1,0,0,0,0, 1,1,1,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Gomez Camila":      {feb:"100%",mar:"100%",abr:"100%",may:"100%",tot:"100%",
    dias:[1,1,1,1,1,1, 1,1,0,1,1,1,1,1,1,0,0,0,0, 1,1,1,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Gutierrez Renata":  {feb:"100%",mar:"75%",abr:"100%",may:"100%",tot:"93%",
    dias:[1,1,1,1,1,1, 1,0,0,1,1,0,1,1,1,0,0,0,0, 1,1,1,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Hevia Valentina":   {feb:"50%",mar:"88%",abr:"38%",may:"100%",tot:"69%",
    dias:[1,0,0,1,1,1, 1,1,0,1,1,1,0,1,1,0,0,0,0, 0,1,1,0,0,0,0,1,0,0,0, 1,1,1,1,1,0]},
  "Liu Macarena":      {feb:"0%",mar:"13%",abr:"0%",may:"20%",tot:"8%",
    dias:[0,0,0,0,0,0, 0,0,0,0,0,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,1,0]},
  "Mateluna Florencia":{feb:"0%",mar:"0%",abr:"100%",may:"100%",tot:"50%",
    dias:[0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0, 1,1,1,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Muñoz Constanza":   {feb:"0%",mar:"50%",abr:"38%",may:"40%",tot:"32%",
    dias:[0,0,0,0,0,0, 0,0,0,0,1,0,1,1,1,0,0,0,0, 0,0,0,0,0,0,1,1,1,0,0, 0,1,1,0,0,0]},
  "Pareja Camila":     {feb:"83%",mar:"75%",abr:"88%",may:"100%",tot:"86%",
    dias:[0,1,1,1,1,1, 1,1,0,1,1,0,0,1,1,0,0,0,0, 1,1,0,1,0,0,1,1,1,1,0, 1,1,1,1,1,0]},
  "Pollmann Marianne": {feb:"100%",mar:"63%",abr:"88%",may:"60%",tot:"77%",
    dias:[1,1,1,1,1,1, 1,1,0,0,0,0,1,1,1,0,0,0,0, 1,1,1,1,0,0,1,0,1,1,0, 1,1,0,0,1,0]},
  "Retamal Antonia":   {feb:"50%",mar:"75%",abr:"50%",may:"80%",tot:"63%",
    dias:[0,0,0,1,1,1, 1,1,0,1,1,1,1,0,0,0,0,0,0, 0,1,0,0,0,0,0,1,1,1,0, 1,0,1,1,1,0]},
  "Sepulveda Eileen":  {feb:"83%",mar:"88%",abr:"63%",may:"0%",tot:"58%",
    dias:[1,1,0,1,1,1, 1,1,0,1,1,1,1,0,1,0,0,0,0, 0,1,1,1,0,0,0,1,0,1,0, 0,0,0,0,0,0]},
  "Sierra Julieta":    {feb:"0%",mar:"38%",abr:"0%",may:"40%",tot:"19%",
    dias:[0,0,0,0,0,0, 0,1,0,0,1,1,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0, 0,1,0,0,1,0]},
  "Silva Victoria":    {feb:"50%",mar:"0%",abr:"0%",may:"40%",tot:"22%",
    dias:[1,0,0,1,1,0, 0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0, 0,1,0,0,1,0]},
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
const ZONAS_DOLOR=["Gemelo/Sóleo","Cuádriceps","Isquiotibial","Rodilla","Aductor","Flexor cadera","Glúteo","Lumbar","Cuello"];

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
  const [puestoSel,setPuestoSel]=useState(null);
  const [jugSel,setJugSel]=useState(null);
  const sel=puestoSel?PUESTOS.find(p=>p.p===puestoSel):null;
  const colors={DC:T.blue,LT:T.green,MC:T.amber,VL:T.red,WG:T.cyan,DL:T.purple};

  // Radar: comparar jugadora vs promedio del puesto
  function RadarPuesto({jug,puesto}){
    const labs=["Dist","HSR","18-21","ACC","Vmáx"];
    const jVals=[jug.dist,jug.hsr,jug.ai18,jug.acc,jug.vmax];
    const pVals=[puesto.dist,puesto.hsr,puesto.ai18,puesto.acc,puesto.vmax];
    const maxV=jVals.map((v,i)=>Math.max(v,pVals[i],0.1));
    const norm=(arr)=>arr.map((v,i)=>Math.min(v/maxV[i],1.5));
    const jN=norm(jVals);const pN=norm(pVals);
    const cx=90,cy=90,r=65,n=5;
    const angle=(i)=>(Math.PI*2*i/n)-Math.PI/2;
    const pt=(nv,i)=>`${cx+nv*r*Math.cos(angle(i))},${cy+nv*r*Math.sin(angle(i))}`;
    const poly=(norms,col)=>`<polygon points="${norms.map((v,i)=>pt(v,i)).join(" ")}" fill="${col}33" stroke="${col}" stroke-width="1.5"/>`;
    const spokes=Array.from({length:n},(_,i)=>`<line x1="${cx}" y1="${cy}" x2="${cx+r*Math.cos(angle(i))}" y2="${cy+r*Math.sin(angle(i))}" stroke="#2a3550" stroke-width="1"/>`).join("");
    const rings=[0.33,0.67,1].map(v=>`<polygon points="${Array.from({length:n},(_,i)=>pt(v,i)).join(" ")}" fill="none" stroke="#1e2535" stroke-width="1"/>`).join("");
    const lbl=labs.map((l,i)=>{const x=cx+(r+14)*Math.cos(angle(i));const y=cy+(r+14)*Math.sin(angle(i));return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="8" fill="#6a7490">${l}</text>`;}).join("");
    const svg=`<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">${rings}${spokes}${poly(pN,T.blue)}${poly(jN,T.green)}${lbl}</svg>`;
    return(
      <div style={{display:"flex",alignItems:"center",gap:12,marginTop:10}}>
        <div style={{width:140,flexShrink:0}} dangerouslySetInnerHTML={{__html:svg}}/>
        <div style={{fontSize:11}}>
          <div style={{fontSize:10,color:T.muted,marginBottom:6,fontWeight:600}}>Radar vs promedio puesto</div>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}><div style={{width:10,height:3,background:T.green,borderRadius:2}}/><span style={{color:T.muted2}}>{jug.n.split(" ")[0]}</span></div>
          <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}><div style={{width:10,height:3,background:T.blue,borderRadius:2}}/><span style={{color:T.muted2}}>Prom. {puesto.p}</span></div>
          {labs.map((l,i)=>{const diff=Math.round((jN[i]-pN[i])*100);return(<div key={l} style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:2}}><span style={{color:T.muted,fontSize:10}}>{l}</span><span style={{color:diff>0?T.green:diff<0?T.red:T.muted,fontSize:10,fontWeight:500}}>{diff>0?"+":""}{diff}%</span></div>);})}
        </div>
      </div>
    );
  }

  return(
    <>
      <MR>
        <MetCard label="Dist. prom." value={`${PROM_PUESTO.dist.toLocaleString()}m`} sub="Partidos ≥45 min"/>
        <MetCard label="HSR prom." value={`${PROM_PUESTO.hsr}m`}/>
        <MetCard label="ACC prom." value={PROM_PUESTO.acc} sc={T.purple}/>
        <MetCard label="Vel. máx prom." value={`${PROM_PUESTO.vmax} km/h`} sc={T.cyan}/>
      </MR>
      <div style={{fontSize:10,color:T.muted2,marginBottom:8}}>Solo jugadoras con ≥45 min. Tocá un puesto para ver detalle.</div>
      <Card style={{marginBottom:10}}>
        <CT text="Perfil por puesto — partidos oficiales (prom. jugadoras ≥45 min)"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["Puesto","Nombre","Dist.","HSR >15","18-21","Spr >21","ACC","DSC","V.máx"]}/>
            <tbody>
              {PUESTOS.map(p=>(
                <tr key={p.p} onClick={()=>{setPuestoSel(puestoSel===p.p?null:p.p);setJugSel(null);}}
                  style={{cursor:"pointer",background:puestoSel===p.p?T.blue+"11":"transparent"}}>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:colors[p.p]||T.blue,fontWeight:700}}>{p.p}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.text}}>{p.n}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{p.dist.toLocaleString()}m</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.text}}>{p.hsr.toLocaleString()}m</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.amber}}>{p.ai18}m</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.red}}>{p.spr}m</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.purple,fontWeight:500}}>{p.acc}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.cyan}}>{p.dsc}</td>
                  <td style={{padding:"6px 8px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{p.vmax}</td>
                </tr>
              ))}
              <tr style={{background:"#0d1020"}}>
                <td colSpan={2} style={{padding:"6px 8px",color:T.muted,fontWeight:600,fontSize:10}}>PROM GENERAL</td>
                <td style={{padding:"6px 8px",color:T.blue,fontWeight:700}}>{PROM_PUESTO.dist.toLocaleString()}m</td>
                <td style={{padding:"6px 8px",color:T.text}}>{PROM_PUESTO.hsr}m</td>
                <td style={{padding:"6px 8px",color:T.amber}}>{PROM_PUESTO.ai18}m</td>
                <td style={{padding:"6px 8px",color:T.red}}>—</td>
                <td style={{padding:"6px 8px",color:T.purple,fontWeight:500}}>{PROM_PUESTO.acc}</td>
                <td style={{padding:"6px 8px",color:T.cyan}}>{PROM_PUESTO.dsc}</td>
                <td style={{padding:"6px 8px",color:T.amber}}>{PROM_PUESTO.vmax}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
      {sel&&(
        <Card style={{border:`1px solid ${colors[sel.p]||T.blue}44`}}>
          <CT text={`${sel.p} — ${sel.n}: detalle jugadoras`}/>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["Jugadora","Partidos","Dist.","HSR","18-21","Spr","ACC","DSC","V.máx"]}/>
            <tbody>{sel.jugadoras.map(j=>(
              <tr key={j.n} onClick={()=>setJugSel(jugSel===j.n?null:j.n)}
                style={{cursor:"pointer",background:jugSel===j.n?T.amber+"11":"transparent"}}>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:jugSel===j.n?T.amber:T.text,fontWeight:500,whiteSpace:"nowrap"}}>{j.n}</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",textAlign:"center"}}><Chip text={`${j.partidos}P`}/></td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.blue}}>{j.dist.toLocaleString()}m</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.text}}>{j.hsr.toLocaleString()}m</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.amber}}>{j.ai18}m</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.red}}>{j.spr}m</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.purple,fontWeight:500}}>{j.acc}</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.cyan}}>{j.dsc}</td>
                <td style={{padding:"5px 8px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{j.vmax}</td>
              </tr>
            ))}</tbody>
          </table>
          {jugSel&&sel.jugadoras.find(j=>j.n===jugSel)&&(
            <RadarPuesto jug={sel.jugadoras.find(j=>j.n===jugSel)} puesto={sel}/>
          )}
        </Card>
      )}
    </>
  );
}


