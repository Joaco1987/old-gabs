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

// ─── PARTIDOS OFICIALES ───────────────────────────────────────────────────────
// Las filas de promedio vienen del CSV del Drive (fila 14/30/47)
const PARTIDOS=[
  {id:"cogs",label:"vs COGS",fecha:"COGS",tipo:"partido",
   prom:{dist:5900,mxm:104,hsr:436,h18:149,spr:24,acc:14,dsc:0,vmax:25.2},
   jugadoras:[
    {n:"Gomez Camila",min:48,dist:4630,mxm:96,hsr:301,ai18:16,spr:0,acc:5,dsc:10,ns:0,vmax:20.2},
    {n:"Alfaro Javiera",min:45,dist:4961,mxm:109,hsr:309,ai18:42,spr:0,acc:6,dsc:15,ns:0,vmax:20.8},
    {n:"Gacitua Emilia",min:52,dist:5578,mxm:107,hsr:468,ai18:235,spr:137,acc:32,dsc:40,ns:10,vmax:25.2},
    {n:"Pareja Camila",min:64,dist:5617,mxm:87,hsr:198,ai18:57,spr:0,acc:5,dsc:10,ns:0,vmax:23.0},
    {n:"Muñoz Constanza",min:61,dist:5702,mxm:93,hsr:377,ai18:198,spr:0,acc:7,dsc:20,ns:0,vmax:23.9},
    {n:"Pollmann Marianne",min:60,dist:6162,mxm:103,hsr:498,ai18:179,spr:0,acc:12,dsc:17,ns:0,vmax:22.4},
    {n:"Errazu Sofia",min:56,dist:6298,mxm:111,hsr:365,ai18:69,spr:0,acc:24,dsc:21,ns:0,vmax:20.7},
    {n:"Sierra Julieta",min:58,dist:6558,mxm:112,hsr:596,ai18:275,spr:0,acc:13,dsc:30,ns:0,vmax:23.9},
    {n:"Silva Victoria",min:57,dist:6681,mxm:117,hsr:773,ai18:310,spr:108,acc:25,dsc:45,ns:6,vmax:23.4},
    {n:"Gutierrez Renata",min:63,dist:6808,mxm:107,hsr:476,ai18:106,spr:0,acc:9,dsc:17,ns:0,vmax:20.1},
   ]},
  {id:"pwcc",label:"vs PWCC",fecha:"PWCC",tipo:"partido",
   prom:{dist:5796,mxm:102,hsr:520,h18:217,spr:37,acc:18,dsc:0,vmax:24.8},
   jugadoras:[
    {n:"Gomez Camila",min:41,dist:3996,mxm:95,hsr:437,ai18:130,spr:2,acc:9,dsc:13,ns:0,vmax:21.0},
    {n:"Pareja Camila",min:66,dist:5308,mxm:80,hsr:266,ai18:73,spr:0,acc:6,dsc:9,ns:0,vmax:22.7},
    {n:"Muñoz Constanza",min:66,dist:5406,mxm:82,hsr:238,ai18:224,spr:0,acc:19,dsc:18,ns:0,vmax:22.5},
    {n:"Errazu Sofia",min:50,dist:5528,mxm:109,hsr:463,ai18:159,spr:0,acc:22,dsc:17,ns:0,vmax:21.8},
    {n:"Carrasco Sofia",min:46,dist:5631,mxm:122,hsr:743,ai18:378,spr:0,acc:17,dsc:22,ns:0,vmax:22.9},
    {n:"Silva Victoria",min:49,dist:5805,mxm:117,hsr:822,ai18:381,spr:215,acc:31,dsc:36,ns:12,vmax:24.8},
    {n:"Pollmann Marianne",min:57,dist:5945,mxm:103,hsr:397,ai18:90,spr:0,acc:15,dsc:14,ns:0,vmax:20.3},
    {n:"Sierra Julieta",min:61,dist:6632,mxm:107,hsr:704,ai18:357,spr:0,acc:28,dsc:39,ns:0,vmax:22.6},
    {n:"Gutierrez Renata",min:66,dist:6754,mxm:102,hsr:490,ai18:113,spr:0,acc:8,dsc:15,ns:0,vmax:21.3},
    {n:"Gacitua Emilia",min:66,dist:6960,mxm:105,hsr:635,ai18:263,spr:157,acc:28,dsc:31,ns:8,vmax:24.1},
   ]},
  {id:"manq",label:"vs MANQ",fecha:"MANQ",tipo:"partido",
   prom:{dist:6058,mxm:105,hsr:539,h18:230,spr:2,acc:23,dsc:0,vmax:24.7},
   jugadoras:[
    {n:"Alfaro Javiera",min:28,dist:3190,mxm:112,hsr:290,ai18:159,spr:0,acc:9,dsc:16,ns:0,vmax:22.8},
    {n:"Carrasco Sofia",min:32,dist:3964,mxm:124,hsr:640,ai18:289,spr:0,acc:26,dsc:42,ns:0,vmax:22.9},
    {n:"Gomez Camila",min:49,dist:4744,mxm:96,hsr:421,ai18:63,spr:0,acc:5,dsc:18,ns:0,vmax:20.3},
    {n:"Muñoz Constanza",min:63,dist:5384,mxm:85,hsr:315,ai18:82,spr:0,acc:12,dsc:17,ns:0,vmax:21.6},
    {n:"Liu Macarena",min:47,dist:5532,mxm:116,hsr:617,ai18:266,spr:0,acc:22,dsc:26,ns:0,vmax:22.5},
    {n:"Pareja Camila",min:71,dist:6123,mxm:86,hsr:219,ai18:62,spr:0,acc:11,dsc:20,ns:0,vmax:21.2},
    {n:"Gutierrez Renata",min:71,dist:6822,mxm:96,hsr:435,ai18:280,spr:0,acc:14,dsc:24,ns:0,vmax:22.9},
    {n:"Pollmann Marianne",min:71,dist:6952,mxm:98,hsr:530,ai18:123,spr:0,acc:27,dsc:14,ns:0,vmax:21.9},
    {n:"Gacitua Emilia",min:71,dist:7854,mxm:111,hsr:818,ai18:319,spr:0,acc:38,dsc:48,ns:0,vmax:23.4},
    {n:"Sierra Julieta",min:71,dist:7929,mxm:112,hsr:757,ai18:318,spr:11,acc:39,dsc:61,ns:1,vmax:24.6},
    {n:"Silva Victoria",min:71,dist:8142,mxm:115,hsr:883,ai18:570,spr:16,acc:45,dsc:52,ns:1,vmax:24.7},
   ]},

  // ── vs CAT B (Católica B) ────────────────────────────────────────────────────
  {id:"catb",label:"vs CAT B",fecha:"CAT B",tipo:"partido",
   prom:{dist:5603,mxm:105,hsr:407,h18:202,spr:2,acc:18,dsc:0,vmax:25.1},
   jugadoras:[
    {n:"Alfaro Javiera",min:26,dist:2917,mxm:108,hsr:223,ai18:73,spr:0,acc:4,dsc:15,ns:0,vmax:21.6},
    {n:"Carrasco Sofia",min:26,dist:3006,mxm:116,hsr:390,ai18:220,spr:0,acc:20,dsc:40,ns:0,vmax:22.7},
    {n:"Gomez Camila",min:39,dist:3879,mxm:98,hsr:290,ai18:82,spr:0,acc:6,dsc:13,ns:0,vmax:20.8},
    {n:"Errazu Sofia",min:44,dist:5031,mxm:114,hsr:585,ai18:345,spr:5,acc:23,dsc:18,ns:0,vmax:24.3},
    {n:"Pollmann Marianne",min:63,dist:5874,mxm:92,hsr:398,ai18:169,spr:0,acc:17,dsc:19,ns:0,vmax:22.9},
    {n:"Pareja Camila",min:65,dist:6121,mxm:94,hsr:268,ai18:87,spr:0,acc:15,dsc:16,ns:0,vmax:22.4},
    {n:"Muñoz Constanza",min:65,dist:6258,mxm:96,hsr:265,ai18:125,spr:0,acc:6,dsc:12,ns:0,vmax:22.6},
    {n:"Sierra Julieta",min:65,dist:6676,mxm:102,hsr:369,ai18:225,spr:0,acc:27,dsc:40,ns:0,vmax:23.1},
    {n:"Gutierrez Renata",min:65,dist:6806,mxm:104,hsr:439,ai18:112,spr:0,acc:19,dsc:18,ns:0,vmax:21.1},
    {n:"Gacitua Emilia",min:65,dist:7339,mxm:112,hsr:585,ai18:364,spr:9,acc:29,dsc:35,ns:0,vmax:25.1},
    {n:"Silva Victoria",min:65,dist:7723,mxm:118,hsr:670,ai18:419,spr:7,acc:31,dsc:44,ns:1,vmax:24.8},
   ]},
  // ── vs OLD REDS ──────────────────────────────────────────────────────────────
  {id:"oldreds",label:"vs OLD REDS",fecha:"OLD REDS",tipo:"partido",
   prom:{dist:6161,mxm:104,hsr:564,h18:230,spr:74,acc:19,dsc:0,vmax:25.8},
   jugadoras:[
    {n:"Alfaro Javiera",min:19,dist:2277,mxm:119,hsr:291,ai18:76,spr:0,acc:8,dsc:10,ns:0,vmax:20.3},
    {n:"Carrasco Sofia",min:61,dist:6656,mxm:108,hsr:754,ai18:404,spr:83,acc:36,dsc:52,ns:6,vmax:22.8},
    {n:"Gomez Camila",min:35,dist:3292,mxm:91,hsr:162,ai18:46,spr:43,acc:7,dsc:13,ns:2,vmax:23.4},
    {n:"Liu Macarena",min:64,dist:6993,mxm:109,hsr:900,ai18:352,spr:89,acc:26,dsc:26,ns:4,vmax:24.1},
    {n:"Pollmann Marianne",min:61,dist:6078,mxm:98,hsr:504,ai18:129,spr:22,acc:16,dsc:23,ns:2,vmax:22.5},
    {n:"Pareja Camila",min:68,dist:6376,mxm:93,hsr:413,ai18:113,spr:6,acc:13,dsc:22,ns:1,vmax:22.0},
    {n:"Muñoz Constanza",min:68,dist:6420,mxm:94,hsr:386,ai18:161,spr:41,acc:7,dsc:16,ns:4,vmax:25.7},
    {n:"Sierra Julieta",min:68,dist:7271,mxm:107,hsr:682,ai18:265,spr:45,acc:25,dsc:49,ns:4,vmax:22.9},
    {n:"Gutierrez Renata",min:68,dist:7141,mxm:105,hsr:667,ai18:155,spr:74,acc:16,dsc:26,ns:4,vmax:24.1},
    {n:"Gacitua Emilia",min:68,dist:7463,mxm:109,hsr:660,ai18:365,spr:191,acc:28,dsc:43,ns:12,vmax:24.3},
    {n:"Silva Victoria",min:68,dist:7802,mxm:114,hsr:787,ai18:469,spr:222,acc:31,dsc:58,ns:15,vmax:25.8},
   ]},
];

// ─── AMISTOSOS ────────────────────────────────────────────────────────────────
// Promedios de las filas del CSV (mismas filas 14/30/47 pero columnas de la derecha)
const AMISTOSOS=[
  {id:"pwccb1",label:"vs PWCC B",fecha:"22/03",tipo:"amistoso",
   prom:{dist:4678,mxm:101.4,hsr:468,h18:127,spr:8,acc:10,dsc:17,ns:0,vmax:22.02},
   jugadoras:[
    {n:"Gomez Camila",     min:32,dist:2898,mxm:90, ai15:190, ai18:32,  spr:0,  acc:2, dsc:6, vmax:20.1},
    {n:"Carrasco Sofia",   min:37,dist:4031,mxm:109,ai15:604, ai18:268, spr:0,  acc:14,dsc:22,ns:0,vmax:22.5},
    {n:"Alfaro Javiera",   min:37,dist:4085,mxm:110,ai15:433, ai18:71,  spr:0,  acc:2, dsc:15,ns:0,vmax:20.4},
    {n:"Mateluna Florencia",min:41,dist:4454,mxm:106,ai15:423,ai18:68,  spr:18, acc:8, dsc:17,ns:0,vmax:21.9},
    {n:"Pareja Camila",    min:52,dist:4886,mxm:93, ai15:271, ai18:39,  spr:0,  acc:5, dsc:8, vmax:21.5},
    {n:"Gutierrez Renata", min:52,dist:5048,mxm:96, ai15:376, ai18:96,  spr:0,  acc:7, dsc:6, vmax:21.1},
    {n:"Pollmann Marianne",min:50,dist:5133,mxm:102,ai15:511, ai18:113, spr:0,  acc:9, dsc:28,ns:0,vmax:23.0},
    {n:"Errazu Sofia",     min:52,dist:5337,mxm:101,ai15:705, ai18:245, spr:0,  acc:10,dsc:8, vmax:22.5},
    {n:"Gacitua Emilia",   min:52,dist:5344,mxm:101,ai15:650, ai18:200, spr:63, acc:22,dsc:29,ns:0,vmax:24.5},
    {n:"Sierra Julieta",   min:52,dist:5566,mxm:106,ai15:514, ai18:142, spr:0,  acc:24,dsc:31,ns:0,vmax:22.7},
  ]},
  {id:"uca",label:"vs UC A-B",fecha:"05/04",tipo:"amistoso",
   prom:{dist:4984,mxm:93.4,hsr:500,h18:135,spr:21,acc:12,dsc:22,ns:0,vmax:21.94},
   jugadoras:[
    {n:"Gomez Camila",     min:35,dist:2999,mxm:85, ai15:223, ai18:21,  spr:0,  acc:6, dsc:11,ns:0,vmax:19.2},
    {n:"Alfaro Javiera",   min:41,dist:3607,mxm:87, ai15:288, ai18:50,  spr:0,  acc:3, dsc:19,ns:0,vmax:21.6},
    {n:"Carrasco Sofia",   min:41,dist:4011,mxm:96, ai15:765, ai18:356, spr:0,  acc:16,dsc:28,ns:0,vmax:23.6},
    {n:"Errazu Sofia",     min:41,dist:4368,mxm:105,ai15:704, ai18:280, spr:0,  acc:11,dsc:12,ns:0,vmax:21.6},
    {n:"Pareja Camila",    min:63,dist:5219,mxm:82, ai15:143, ai18:27,  spr:0,  acc:6, dsc:5, vmax:19.2},
    {n:"Gutierrez Renata", min:63,dist:5667,mxm:90, ai15:364, ai18:78,  spr:0,  acc:8, dsc:13,ns:0,vmax:21.9},
    {n:"Sierra Julieta",   min:63,dist:5815,mxm:92, ai15:432, ai18:111, spr:0,  acc:18,dsc:26,ns:0,vmax:21.5},
    {n:"Silva Victoria",   min:56,dist:5830,mxm:102,ai15:672, ai18:144, spr:83, acc:19,dsc:34,ns:0,vmax:25.3},
    {n:"Pollmann Marianne",min:63,dist:6143,mxm:97, ai15:683, ai18:95,  spr:0,  acc:7, dsc:34,ns:0,vmax:20.7},
    {n:"Gacitua Emilia",   min:63,dist:6185,mxm:98, ai15:729, ai18:191, spr:127,acc:25,dsc:33,ns:0,vmax:24.8},
  ]},
  {id:"pwccb2",label:"vs PWCC B",fecha:"25/04",tipo:"amistoso",
   prom:{dist:4858,mxm:106,hsr:494,h18:140,spr:2,acc:10,dsc:18,ns:0,vmax:22.0},
   jugadoras:[
    {n:"Errazu Sofia",     min:10,dist:1245,mxm:124,ai15:210, ai18:52,  spr:0,  acc:2, dsc:3, vmax:20.9},
    {n:"Gomez Camila",     min:34,dist:3566,mxm:103,ai15:260, ai18:45,  spr:0,  acc:3, dsc:15,ns:0,vmax:21.4},
    {n:"Sierra Julieta",   min:32,dist:3793,mxm:117,ai15:408, ai18:112, spr:0,  acc:8, dsc:14,ns:0,vmax:21.9},
    {n:"Pollmann Marianne",min:48,dist:4954,mxm:102,ai15:443, ai18:92,  spr:0,  acc:5, dsc:14,ns:0,vmax:21.3},
    {n:"Alfaro Javiera",   min:52,dist:5272,mxm:100,ai15:205, ai18:29,  spr:5,  acc:3, dsc:14,ns:0,vmax:25.4},
    {n:"Muñoz Constanza",  min:58,dist:5391,mxm:91, ai15:309, ai18:44,  spr:0,  acc:4, dsc:9, vmax:21.0},
    {n:"Carrasco Sofia",   min:48,dist:5464,mxm:113,ai15:940, ai18:338, spr:0,  acc:18,dsc:43,ns:0,vmax:23.3},
    {n:"Pareja Camila",    min:61,dist:5600,mxm:91, ai15:346, ai18:104, spr:0,  acc:9, dsc:15,ns:0,vmax:21.1},
    {n:"Silva Victoria",   min:51,dist:5860,mxm:114,ai15:813, ai18:207, spr:0,  acc:25,dsc:30,ns:0,vmax:22.8},
    {n:"Gutierrez Renata", min:61,dist:6082,mxm:99, ai15:527, ai18:123, spr:0,  acc:8, dsc:11,ns:0,vmax:21.9},
    {n:"Gacitua Emilia",   min:56,dist:6210,mxm:109,ai15:976, ai18:391, spr:13, acc:22,dsc:30,ns:0,vmax:26.0},
  ]},
];

// ─── ENTRENAMIENTOS — hoja Entrenamientos del Drive ───────────────────────────
// Orden del sheet: 6-abr (tabla GRAL + sub-tabla zonas al lado), luego 8-abr...
// La sub-tabla de zonas da: 15-18 / 18-21 / >21
// h15 = zona 15-18 (de sub-tabla), h18 = zona 18-21, spr = >21
// 10-abr: NO hay sub-tabla zonas (la única sin ella)
// Promedio >21: de fila Promedio si existe, sino calculado

const ENTRENOS=[
  {id:"e01",label:"6/04",fecha:"6/04",tipo:"entreno",
   prom_hsr:1186,prom_h18:434,prom_spr:11,
   zonas:[
    {n:"Gomez Camila",h15:712,h18:70,spr:0},
    {n:"Sierra Julieta",h15:372,h18:142,spr:0},
    {n:"Alfaro Javiera",h15:1377,h18:215,spr:0},
    {n:"Carrasco Sofia",h15:1071,h18:839,spr:0},
    {n:"Mateluna Florencia",h15:1459,h18:386,spr:18},
    {n:"Pareja Camila",h15:1320,h18:61,spr:0},
    {n:"Pollmann Marianne",h15:1484,h18:454,spr:0},
    {n:"Gutierrez Renata",h15:1625,h18:302,spr:0},
    {n:"Errazu Sofia",h15:1199,h18:952,spr:0},
    {n:"Gacitua Emilia",h15:1236,h18:922,spr:95},
   ],
   jugadoras:[
    {n:"Gomez Camila",min:51,dist:5161,mxm:100,hsr:712,ai18:70,spr:0,acc:2,dsc:9,ns:0,vmax:20.1},
    {n:"Sierra Julieta",min:52,dist:5566,mxm:106,hsr:372,ai18:142,spr:0,acc:24,dsc:31,ns:0,vmax:22.7},
    {n:"Alfaro Javiera",min:54,dist:6144,mxm:113,hsr:1377,ai18:215,spr:0,acc:6,dsc:16,ns:0,vmax:20.6},
    {n:"Carrasco Sofia",min:55,dist:6204,mxm:111,hsr:1071,ai18:839,spr:0,acc:22,dsc:22,ns:0,vmax:22.6},
    {n:"Mateluna Florencia",min:61,dist:6831,mxm:112,hsr:1459,ai18:386,spr:18,acc:27,dsc:18,ns:1,vmax:21.9},
    {n:"Pareja Camila",min:66,dist:6945,mxm:105,hsr:1320,ai18:61,spr:0,acc:7,dsc:8,ns:0,vmax:21.5},
    {n:"Pollmann Marianne",min:65,dist:7322,mxm:111,hsr:1484,ai18:454,spr:0,acc:11,dsc:29,ns:0,vmax:23.0},
    {n:"Gutierrez Renata",min:69,dist:7359,mxm:105,hsr:1625,ai18:302,spr:0,acc:17,dsc:6,ns:0,vmax:21.1},
    {n:"Errazu Sofia",min:71,dist:7608,mxm:106,hsr:1199,ai18:952,spr:0,acc:37,dsc:9,ns:0,vmax:22.5},
    {n:"Gacitua Emilia",min:71,dist:7916,mxm:110,hsr:1236,ai18:922,spr:95,acc:29,dsc:33,ns:6,vmax:24.5},
   ]},
  {id:"e02",label:"8/04",fecha:"8/04",tipo:"entreno",
   prom_hsr:417,prom_h18:341,prom_spr:9,
   zonas:[
    {n:"Pareja Camila",h15:440,h18:195,spr:0},
    {n:"Carrasco Sofia",h15:244,h18:614,spr:0},
    {n:"Gomez Camila",h15:563,h18:120,spr:2},
    {n:"Alfaro Javiera",h15:472,h18:300,spr:0},
    {n:"Pollmann Marianne",h15:481,h18:213,spr:0},
    {n:"Gutierrez Renata",h15:401,h18:421,spr:0},
    {n:"Mateluna Florencia",h15:450,h18:364,spr:3},
    {n:"Gacitua Emilia",h15:285,h18:503,spr:67},
   ],
   jugadoras:[
    {n:"Pareja Camila",min:21,dist:1365,mxm:64,hsr:440,ai18:195,spr:0,acc:44,dsc:23,ns:0,vmax:20.6},
    {n:"Carrasco Sofia",min:21,dist:1428,mxm:67,hsr:244,ai18:614,spr:0,acc:47,dsc:40,ns:0,vmax:23.5},
    {n:"Gomez Camila",min:21,dist:1433,mxm:67,hsr:563,ai18:120,spr:2,acc:35,dsc:25,ns:0,vmax:21.0},
    {n:"Alfaro Javiera",min:21,dist:1464,mxm:69,hsr:472,ai18:300,spr:0,acc:42,dsc:28,ns:0,vmax:21.1},
    {n:"Pollmann Marianne",min:21,dist:1487,mxm:70,hsr:481,ai18:213,spr:0,acc:38,dsc:21,ns:0,vmax:20.6},
    {n:"Gutierrez Renata",min:21,dist:1545,mxm:72,hsr:402,ai18:421,spr:0,acc:44,dsc:30,ns:0,vmax:21.6},
    {n:"Mateluna Florencia",min:21,dist:1582,mxm:74,hsr:449,ai18:364,spr:3,acc:50,dsc:25,ns:0,vmax:21.1},
    {n:"Gacitua Emilia",min:21,dist:1594,mxm:75,hsr:286,ai18:503,spr:67,acc:46,dsc:27,ns:4,vmax:22.9},
   ]},
  {id:"e03",label:"10/04",fecha:"10/04",tipo:"entreno",
   prom_hsr:124,prom_h18:188,prom_spr:59,
   zonas:[
    {n:"Gomez Camila",h15:151,h18:109,spr:52},
    {n:"Gutierrez Renata",h15:126,h18:187,spr:37},
    {n:"Pollmann Marianne",h15:133,h18:213,spr:0},
    {n:"Carrasco Sofia",h15:100,h18:304,spr:30},
    {n:"Alfaro Javiera",h15:141,h18:211,spr:4},
    {n:"Gacitua Emilia",h15:85,h18:138,spr:187},
    {n:"Mateluna Florencia",h15:134,h18:157,spr:101},
   ],
   jugadoras:[
    {n:"Gomez Camila",min:19,dist:1161,mxm:58,hsr:151,ai18:109,spr:52,acc:30,dsc:7,ns:3,vmax:23.2},
    {n:"Gutierrez Renata",min:19,dist:1221,mxm:61,hsr:127,ai18:187,spr:37,acc:30,dsc:7,ns:3,vmax:26.9},
    {n:"Pollmann Marianne",min:19,dist:1275,mxm:64,hsr:133,ai18:213,spr:0,acc:30,dsc:2,ns:0,vmax:24.7},
    {n:"Carrasco Sofia",min:19,dist:1310,mxm:66,hsr:100,ai18:304,spr:30,acc:30,dsc:17,ns:2,vmax:26.5},
    {n:"Alfaro Javiera",min:19,dist:1322,mxm:66,hsr:142,ai18:211,spr:4,acc:30,dsc:0,ns:0,vmax:25.3},
    {n:"Gacitua Emilia",min:19,dist:1408,mxm:71,hsr:85,ai18:138,spr:187,acc:31,dsc:17,ns:13,vmax:28.5},
    {n:"Mateluna Florencia",min:19,dist:1412,mxm:71,hsr:134,ai18:157,spr:101,acc:30,dsc:1,ns:4,vmax:26.2},
   ]},
  {id:"e04",label:"13/04",fecha:"13/04",tipo:"entreno",
   prom_hsr:469,prom_h18:320,prom_spr:0,
   zonas:[
    {n:"Errazu Sofia",h15:307,h18:332,spr:3},
    {n:"Pollmann Marianne",h15:414,h18:232,spr:0},
    {n:"Gutierrez Renata",h15:655,h18:54,spr:0},
    {n:"Gomez Camila",h15:459,h18:52,spr:0},
        {n:"Carrasco Sofia",h15:437,h18:525,spr:0},
    {n:"Mateluna Florencia",h15:705,h18:297,spr:0},
    {n:"Gacitua Emilia",h15:394,h18:501,spr:0},
    {n:"Sepulveda Eileen",h15:383,h18:564,spr:0},
   ],
   jugadoras:[
    {n:"Errazu Sofia",min:12,dist:1123,mxm:88,hsr:304,ai18:332,spr:3,acc:12,dsc:8,ns:0,vmax:24.5},
    {n:"Pollmann Marianne",min:15,dist:1349,mxm:110,hsr:414,ai18:232,spr:0,acc:9,dsc:4,ns:0,vmax:23.1},
    {n:"Gutierrez Renata",min:15,dist:1477,mxm:95,hsr:655,ai18:54,spr:0,acc:4,dsc:0,ns:0,vmax:19.6},
    {n:"Gomez Camila",min:15,dist:1536,mxm:97,hsr:459,ai18:52,spr:0,acc:5,dsc:3,ns:0,vmax:20.9},
        {n:"Carrasco Sofia",min:15,dist:1638,mxm:106,hsr:436,ai18:525,spr:0,acc:20,dsc:11,ns:0,vmax:23.8},
    {n:"Mateluna Florencia",min:15,dist:1666,mxm:108,hsr:705,ai18:297,spr:0,acc:27,dsc:8,ns:0,vmax:21.0},
    {n:"Gacitua Emilia",min:15,dist:1693,mxm:109,hsr:394,ai18:501,spr:0,acc:16,dsc:9,ns:0,vmax:23.7},
    {n:"Sepulveda Eileen",min:15,dist:1714,mxm:115,hsr:383,ai18:564,spr:0,acc:23,dsc:11,ns:0,vmax:23.6},
   ]},
  {id:"e05",label:"15/04",fecha:"15/04",tipo:"entreno",
   prom_hsr:519,prom_h18:65,prom_spr:0,
   zonas:[
    {n:"Arau María Paz",h15:39,h18:0,spr:0},
    {n:"Pollmann Marianne",h15:389,h18:52,spr:0},
    {n:"Gomez Camila",h15:317,h18:8,spr:0},
    {n:"Pareja Camila",h15:430,h18:22,spr:0},
    {n:"Alfaro Javiera",h15:393,h18:24,spr:0},
    {n:"Retamal Antonia",h15:579,h18:43,spr:0},
    {n:"Gacitua Emilia",h15:792,h18:112,spr:0},
    {n:"Carrasco Sofia",h15:983,h18:238,spr:0},
    {n:"Sepulveda Eileen",h15:747,h18:86,spr:0},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:57,dist:1413,mxm:24,hsr:39,ai18:0,spr:0,acc:7,dsc:1,ns:0,vmax:17.0},
    {n:"Pollmann Marianne",min:47,dist:3472,mxm:74,hsr:389,ai18:52,spr:0,acc:35,dsc:20,ns:0,vmax:19.9},
    {n:"Gomez Camila",min:47,dist:3557,mxm:75,hsr:317,ai18:8,spr:0,acc:20,dsc:32,ns:0,vmax:18.9},
    {n:"Pareja Camila",min:47,dist:3807,mxm:80,hsr:430,ai18:22,spr:0,acc:44,dsc:32,ns:0,vmax:21.4},
    {n:"Alfaro Javiera",min:47,dist:396,mxm:84,hsr:393,ai18:24,spr:0,acc:20,dsc:22,ns:0,vmax:21.0},
    {n:"Retamal Antonia",min:47,dist:4183,mxm:88,hsr:579,ai18:43,spr:0,acc:45,dsc:26,ns:0,vmax:20.8},
    {n:"Gacitua Emilia",min:52,dist:4407,mxm:83,hsr:792,ai18:112,spr:0,acc:66,dsc:57,ns:0,vmax:22.3},
    {n:"Carrasco Sofia",min:52,dist:4906,mxm:93,hsr:983,ai18:238,spr:0,acc:64,dsc:71,ns:0,vmax:22.7},
    {n:"Sepulveda Eileen",min:52,dist:5087,mxm:96,hsr:747,ai18:86,spr:0,acc:47,dsc:46,ns:0,vmax:20.2},
   ]},
  {id:"e06",label:"17/04",fecha:"17/04",tipo:"entreno",
   prom_hsr:335,prom_h18:483,prom_spr:40,
   zonas:[
    {n:"Sepulveda Eileen",h15:29,h18:47,spr:5},
    {n:"Alfaro Javiera",h15:100,h18:244,spr:22},
    {n:"Retamal Antonia",h15:207,h18:603,spr:29},
    {n:"Pareja Camila",h15:566,h18:348,spr:1},
    {n:"Gutierrez Renata",h15:637,h18:400,spr:38},
    {n:"Carrasco Sofia",h15:337,h18:818,spr:59},
    {n:"Mateluna Florencia",h15:496,h18:638,spr:26},
    {n:"Gacitua Emilia",h15:307,h18:763,spr:138},
   ],
   jugadoras:[
    {n:"Sepulveda Eileen",min:5,dist:396,mxm:71,hsr:30,ai18:47,spr:5,acc:5,dsc:0,ns:0,vmax:24.5},
    {n:"Alfaro Javiera",min:7,dist:720,mxm:98,hsr:100,ai18:244,spr:22,acc:15,dsc:3,ns:0,vmax:25.5},
    {n:"Retamal Antonia",min:11,dist:1288,mxm:111,hsr:207,ai18:603,spr:29,acc:29,dsc:28,ns:0,vmax:25.4},
    {n:"Pareja Camila",min:16,dist:1828,mxm:111,hsr:566,ai18:348,spr:1,acc:35,dsc:5,ns:0,vmax:24.1},
    {n:"Gutierrez Renata",min:16,dist:1883,mxm:114,hsr:638,ai18:400,spr:38,acc:31,dsc:19,ns:0,vmax:25.4},
    {n:"Carrasco Sofia",min:16,dist:1902,mxm:116,hsr:338,ai18:818,spr:59,acc:44,dsc:15,ns:0,vmax:25.5},
    {n:"Mateluna Florencia",min:16,dist:1956,mxm:119,hsr:496,ai18:638,spr:26,acc:47,dsc:11,ns:4,vmax:25.1},
    {n:"Gacitua Emilia",min:16,dist:1976,mxm:120,hsr:306,ai18:763,spr:138,acc:40,dsc:14,ns:7,vmax:27.1},
   ]},
  {id:"e07",label:"20/04",fecha:"20/04",tipo:"entreno",
   prom_hsr:381,prom_h18:154,prom_spr:2,
   zonas:[
    {n:"Errazu Sofia",h15:192,h18:66,spr:0},
    {n:"Sierra Julieta",h15:296,h18:112,spr:0},
    {n:"Gomez Camila",h15:256,h18:65,spr:0},
    {n:"Pollmann Marianne",h15:351,h18:92,spr:0},
    {n:"Alfaro Javiera",h15:197,h18:35,spr:5},
    {n:"Muñoz Constanza",h15:305,h18:46,spr:0},
    {n:"Silva Victoria",h15:606,h18:207,spr:0},
    {n:"Carrasco Sofia",h15:637,h18:382,spr:0},
    {n:"Pareja Camila",h15:284,h18:112,spr:0},
    {n:"Gutierrez Renata",h15:450,h18:146,spr:0},
    {n:"Gacitua Emilia",h15:618,h18:434,spr:13},
   ],
   jugadoras:[
    {n:"Errazu Sofia",min:16,dist:1558,mxm:95,hsr:192,ai18:66,spr:0,acc:9,dsc:7,ns:0,vmax:20.9},
    {n:"Sierra Julieta",min:32,dist:3793,mxm:117,hsr:296,ai18:112,spr:0,acc:8,dsc:14,ns:0,vmax:21.9},
    {n:"Gomez Camila",min:41,dist:3979,mxm:97,hsr:255,ai18:65,spr:0,acc:14,dsc:16,ns:0,vmax:21.4},
    {n:"Pollmann Marianne",min:55,dist:4954,mxm:102,hsr:351,ai18:92,spr:0,acc:5,dsc:14,ns:0,vmax:21.3},
    {n:"Alfaro Javiera",min:59,dist:5627,mxm:95,hsr:196,ai18:35,spr:5,acc:10,dsc:16,ns:0,vmax:25.4},
    {n:"Muñoz Constanza",min:65,dist:5780,mxm:88,hsr:305,ai18:46,spr:0,acc:13,dsc:9,ns:0,vmax:21.0},
    {n:"Silva Victoria",min:51,dist:586,mxm:114,hsr:606,ai18:207,spr:0,acc:25,dsc:30,ns:0,vmax:22.8},
    {n:"Carrasco Sofia",min:54,dist:5897,mxm:108,hsr:637,ai18:382,spr:0,acc:31,dsc:50,ns:0,vmax:23.3},
    {n:"Pareja Camila",min:67,dist:6049,mxm:89,hsr:284,ai18:112,spr:0,acc:19,dsc:15,ns:0,vmax:21.1},
    {n:"Gutierrez Renata",min:67,dist:6505,mxm:96,hsr:450,ai18:146,spr:0,acc:21,dsc:18,ns:0,vmax:21.9},
    {n:"Gacitua Emilia",min:63,dist:6694,mxm:106,hsr:617,ai18:434,spr:13,acc:36,dsc:33,ns:0,vmax:26.0},
   ]},
  {id:"e08",label:"22/04",fecha:"22/04",tipo:"entreno",
   prom_hsr:859,prom_h18:913,prom_spr:0,
   zonas:[
    {n:"Muñoz Constanza",h15:859,h18:913,spr:0},
   ],
   jugadoras:[
    {n:"Muñoz Constanza",min:33,dist:2667,mxm:82,hsr:859,ai18:913,spr:0,acc:8,dsc:1,ns:0,vmax:20.9},
   ]},
  {id:"e09",label:"29/04",fecha:"29/04",tipo:"entreno",
   prom_hsr:560,prom_h18:436,prom_spr:50,
   zonas:[
    {n:"Arau María Paz",h15:19,h18:4,spr:0},
    {n:"Gomez Camila",h15:281,h18:10,spr:0},
    {n:"Gacitua Emilia",h15:565,h18:725,spr:124},
    {n:"Pareja Camila",h15:674,h18:265,spr:15},
    {n:"Alfaro Javiera",h15:661,h18:506,spr:42},
    {n:"Retamal Antonia",h15:807,h18:474,spr:82},
    {n:"Gutierrez Renata",h15:668,h18:331,spr:9},
    {n:"Carrasco Sofia",h15:631,h18:841,spr:119},
    {n:"Mateluna Florencia",h15:691,h18:434,spr:71},
    {n:"Sepulveda Eileen",h15:606,h18:768,spr:35},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:68,dist:1710,mxm:25,hsr:19,ai18:4,spr:0,acc:9,dsc:0,ns:0,vmax:18.6},
    {n:"Gomez Camila",min:72,dist:3574,mxm:50,hsr:280,ai18:10,spr:0,acc:3,dsc:17,ns:0,vmax:18.5},
    {n:"Gacitua Emilia",min:72,dist:5052,mxm:70,hsr:525,ai18:725,spr:124,acc:45,dsc:27,ns:7,vmax:27.7},
    {n:"Pareja Camila",min:72,dist:5118,mxm:71,hsr:674,ai18:265,spr:15,acc:29,dsc:16,ns:2,vmax:24.6},
    {n:"Alfaro Javiera",min:72,dist:5318,mxm:74,hsr:620,ai18:506,spr:42,acc:29,dsc:28,ns:0,vmax:25.3},
    {n:"Retamal Antonia",min:72,dist:5507,mxm:76,hsr:808,ai18:474,spr:82,acc:42,dsc:35,ns:7,vmax:25.4},
    {n:"Gutierrez Renata",min:72,dist:5525,mxm:77,hsr:658,ai18:331,spr:9,acc:27,dsc:23,ns:0,vmax:24.5},
    {n:"Carrasco Sofia",min:72,dist:5552,mxm:77,hsr:542,ai18:841,spr:119,acc:51,dsc:58,ns:2,vmax:26.4},
    {n:"Mateluna Florencia",min:72,dist:5944,mxm:82,hsr:691,ai18:434,spr:71,acc:48,dsc:37,ns:6,vmax:25.9},
    {n:"Sepulveda Eileen",min:72,dist:6197,mxm:86,hsr:606,ai18:768,spr:35,acc:47,dsc:44,ns:4,vmax:25.1},
   ]},
  {id:"e10",label:"4/05",fecha:"4/05",tipo:"entreno",
   prom_hsr:76,prom_h18:66,prom_spr:0,
   zonas:[
    {n:"Arau María Paz",h15:0,h18:0,spr:0},
    {n:"Gomez Camila",h15:99,h18:14,spr:0},
    {n:"Alfaro Javiera",h15:77,h18:68,spr:0},
    {n:"Gutierrez Renata",h15:80,h18:59,spr:0},
    {n:"Pareja Camila",h15:76,h18:40,spr:0},
    {n:"Carrasco Sofia",h15:91,h18:98,spr:0},
    {n:"Gacitua Emilia",h15:81,h18:120,spr:0},
    {n:"Errazu Sofia",h15:83,h18:105,spr:0},
    {n:"Mateluna Florencia",h15:96,h18:89,spr:0},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:9,dist:384,mxm:42,hsr:3,ai18:0,spr:0,acc:7,dsc:2,ns:0,vmax:15.6},
    {n:"Gomez Camila",min:25,dist:987,mxm:39,hsr:99,ai18:14,spr:0,acc:27,dsc:8,ns:0,vmax:18.5},
    {n:"Alfaro Javiera",min:25,dist:993,mxm:39,hsr:77,ai18:68,spr:0,acc:28,dsc:10,ns:0,vmax:21.1},
    {n:"Gutierrez Renata",min:25,dist:994,mxm:40,hsr:80,ai18:59,spr:0,acc:30,dsc:9,ns:0,vmax:20.4},
    {n:"Pareja Camila",min:25,dist:1028,mxm:41,hsr:76,ai18:40,spr:0,acc:26,dsc:7,ns:0,vmax:19.4},
    {n:"Carrasco Sofia",min:25,dist:1035,mxm:41,hsr:91,ai18:98,spr:0,acc:33,dsc:13,ns:0,vmax:21.0},
    {n:"Gacitua Emilia",min:25,dist:1095,mxm:44,hsr:81,ai18:120,spr:0,acc:29,dsc:8,ns:0,vmax:22.0},
    {n:"Errazu Sofia",min:25,dist:1133,mxm:45,hsr:83,ai18:105,spr:0,acc:30,dsc:10,ns:0,vmax:20.7},
    {n:"Mateluna Florencia",min:25,dist:1146,mxm:46,hsr:96,ai18:89,spr:0,acc:37,dsc:6,ns:0,vmax:20.8},
   ]},
  {id:"e11",label:"11/05",fecha:"11/05",tipo:"entreno",
   prom_hsr:199,prom_h18:54,prom_spr:0,
   zonas:[
    {n:"Arau María Paz",h15:32,h18:0,spr:0},
    {n:"Gomez Camila",h15:127,h18:17,spr:0},
    {n:"Gutierrez Renata",h15:180,h18:51,spr:0},
    {n:"Carrasco Sofia",h15:327,h18:84,spr:0},
    {n:"Mateluna Florencia",h15:175,h18:34,spr:0},
    {n:"Pareja Camila",h15:260,h18:26,spr:0},
    {n:"Alfaro Javiera",h15:161,h18:46,spr:0},
    {n:"Hevia Valentina",h15:190,h18:26,spr:0},
    {n:"Gacitua Emilia",h15:206,h18:184,spr:0},
    {n:"Errazu Sofia",h15:284,h18:68,spr:0},
    {n:"Retamal Antonia",h15:243,h18:62,spr:0},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:65,dist:1935,mxm:30,hsr:32,ai18:0,spr:0,acc:8,dsc:6,ns:0,vmax:17.4},
    {n:"Gomez Camila",min:65,dist:3262,mxm:50,hsr:122,ai18:17,spr:0,acc:16,dsc:22,ns:0,vmax:19.3},
    {n:"Gutierrez Renata",min:65,dist:3604,mxm:55,hsr:180,ai18:51,spr:0,acc:33,dsc:24,ns:0,vmax:21.1},
    {n:"Carrasco Sofia",min:65,dist:3628,mxm:56,hsr:327,ai18:84,spr:0,acc:46,dsc:66,ns:0,vmax:20.4},
    {n:"Mateluna Florencia",min:65,dist:3660,mxm:56,hsr:175,ai18:34,spr:0,acc:39,dsc:31,ns:0,vmax:21.0},
    {n:"Pareja Camila",min:65,dist:3773,mxm:58,hsr:260,ai18:26,spr:0,acc:29,dsc:22,ns:0,vmax:21.8},
    {n:"Alfaro Javiera",min:65,dist:3820,mxm:59,hsr:161,ai18:46,spr:0,acc:26,dsc:33,ns:0,vmax:20.6},
    {n:"Hevia Valentina",min:65,dist:3892,mxm:60,hsr:190,ai18:26,spr:0,acc:30,dsc:28,ns:0,vmax:19.4},
    {n:"Gacitua Emilia",min:65,dist:4008,mxm:62,hsr:206,ai18:184,spr:0,acc:41,dsc:45,ns:0,vmax:23.3},
    {n:"Errazu Sofia",min:65,dist:4020,mxm:62,hsr:284,ai18:68,spr:0,acc:39,dsc:38,ns:0,vmax:21.7},
    {n:"Retamal Antonia",min:65,dist:4083,mxm:63,hsr:243,ai18:62,spr:0,acc:36,dsc:50,ns:0,vmax:20.7},
   ]},
  {id:"e12",label:"13/05",fecha:"13/05",tipo:"entreno",
   prom_hsr:300,prom_h18:452,prom_spr:66,
   zonas:[
    {n:"Arau María Paz",h15:26,h18:0,spr:0},
    {n:"Pollmann Marianne",h15:288,h18:210,spr:8},
    {n:"Pareja Camila",h15:280,h18:411,spr:4},
    {n:"Gutierrez Renata",h15:296,h18:530,spr:14},
    {n:"Gacitua Emilia",h15:300,h18:632,spr:125},
    {n:"Retamal Antonia",h15:399,h18:416,spr:86},
    {n:"Mateluna Florencia",h15:352,h18:508,spr:120},
    {n:"Silva Victoria",h15:382,h18:585,spr:117},
    {n:"Carrasco Sofia",h15:390,h18:689,spr:13},
    {n:"Sierra Julieta",h15:287,h18:538,spr:168},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:54,dist:1514,mxm:28,hsr:26,ai18:0,spr:0,acc:16,dsc:2,ns:0,vmax:17.0},
    {n:"Pollmann Marianne",min:51,dist:3107,mxm:60,hsr:288,ai18:210,spr:8,acc:15,dsc:8,ns:1,vmax:24.9},
    {n:"Pareja Camila",min:50,dist:3666,mxm:73,hsr:280,ai18:411,spr:4,acc:35,dsc:16,ns:0,vmax:24.5},
    {n:"Gutierrez Renata",min:50,dist:3736,mxm:74,hsr:297,ai18:530,spr:14,acc:27,dsc:21,ns:1,vmax:25.8},
    {n:"Gacitua Emilia",min:51,dist:4106,mxm:79,hsr:301,ai18:632,spr:125,acc:48,dsc:33,ns:9,vmax:28.0},
    {n:"Retamal Antonia",min:50,dist:4194,mxm:83,hsr:399,ai18:416,spr:86,acc:28,dsc:23,ns:7,vmax:25.4},
    {n:"Mateluna Florencia",min:50,dist:4293,mxm:85,hsr:352,ai18:508,spr:120,acc:51,dsc:37,ns:9,vmax:25.9},
    {n:"Silva Victoria",min:51,dist:4311,mxm:83,hsr:382,ai18:585,spr:117,acc:49,dsc:46,ns:10,vmax:26.4},
    {n:"Carrasco Sofia",min:51,dist:4341,mxm:84,hsr:390,ai18:689,spr:13,acc:45,dsc:53,ns:1,vmax:26.1},
    {n:"Sierra Julieta",min:50,dist:4359,mxm:86,hsr:287,ai18:538,spr:168,acc:47,dsc:49,ns:10,vmax:26.7},
   ]},
  {id:"e13",label:"18/05",fecha:"18/05",tipo:"entreno",
   prom_hsr:150,prom_h18:49,prom_spr:7,
   zonas:[
    {n:"Arau María Paz",h15:0,h18:0,spr:0},
    {n:"Gutierrez Renata",h15:112,h18:22,spr:0},
    {n:"Alfaro Javiera",h15:99,h18:19,spr:0},
    {n:"Mateluna Florencia",h15:217,h18:77,spr:4},
    {n:"Gacitua Emilia",h15:218,h18:150,spr:46},
    {n:"Carrasco Sofia",h15:233,h18:67,spr:4},
    {n:"Gomez Camila",h15:102,h18:13,spr:0},
    {n:"Pollmann Marianne",h15:164,h18:30,spr:2},
    {n:"Hevia Valentina",h15:175,h18:42,spr:0},
    {n:"Pareja Camila",h15:144,h18:25,spr:9},
    {n:"Retamal Antonia",h15:184,h18:90,spr:7},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:74,dist:1521,mxm:20,hsr:0,ai18:0,spr:0,acc:4,dsc:0,ns:0,vmax:14.4},
    {n:"Gutierrez Renata",min:74,dist:3281,mxm:44,hsr:112,ai18:22,spr:0,acc:23,dsc:24,ns:0,vmax:20.1},
    {n:"Alfaro Javiera",min:74,dist:3314,mxm:44,hsr:99,ai18:19,spr:0,acc:31,dsc:22,ns:0,vmax:20.6},
    {n:"Mateluna Florencia",min:74,dist:3356,mxm:45,hsr:217,ai18:77,spr:4,acc:43,dsc:34,ns:0,vmax:21.4},
    {n:"Gacitua Emilia",min:74,dist:3367,mxm:45,hsr:218,ai18:150,spr:46,acc:56,dsc:40,ns:5,vmax:23.1},
    {n:"Carrasco Sofia",min:74,dist:3425,mxm:46,hsr:233,ai18:67,spr:4,acc:42,dsc:47,ns:0,vmax:21.6},
    {n:"Gomez Camila",min:74,dist:3614,mxm:48,hsr:102,ai18:13,spr:0,acc:24,dsc:22,ns:0,vmax:18.9},
    {n:"Pollmann Marianne",min:74,dist:3707,mxm:50,hsr:163,ai18:30,spr:2,acc:39,dsc:39,ns:0,vmax:21.3},
    {n:"Hevia Valentina",min:74,dist:3726,mxm:50,hsr:175,ai18:42,spr:0,acc:31,dsc:25,ns:0,vmax:20.0},
    {n:"Pareja Camila",min:74,dist:3951,mxm:53,hsr:144,ai18:25,spr:9,acc:33,dsc:30,ns:1,vmax:21.7},
    {n:"Retamal Antonia",min:74,dist:4082,mxm:55,hsr:184,ai18:90,spr:7,acc:52,dsc:54,ns:0,vmax:21.4},
   ]},
  {id:"e14",label:"20/05",fecha:"20/05",tipo:"entreno",
   prom_hsr:347,prom_h18:277,prom_spr:224,
   zonas:[
    {n:"Arau María Paz",h15:31,h18:7,spr:0},
    {n:"Pollmann Marianne",h15:141,h18:32,spr:40},
    {n:"Gacitua Emilia",h15:153,h18:152,spr:413},
    {n:"Silva Victoria",h15:299,h18:188,spr:21},
    {n:"Gomez Camila",h15:477,h18:324,spr:171},
    {n:"Gutierrez Renata",h15:402,h18:254,spr:275},
    {n:"Alfaro Javiera",h15:568,h18:312,spr:262},
    {n:"Pareja Camila",h15:468,h18:282,spr:249},
    {n:"Sierra Julieta",h15:444,h18:574,spr:151},
    {n:"Carrasco Sofia",h15:423,h18:491,spr:439},
    {n:"Mateluna Florencia",h15:415,h18:427,spr:443},
   ],
   jugadoras:[
    {n:"Arau María Paz",min:67,dist:1919,mxm:29,hsr:32,ai18:7,spr:0,acc:13,dsc:5,ns:0,vmax:19.2},
    {n:"Pollmann Marianne",min:33,dist:1958,mxm:58,hsr:141,ai18:32,spr:40,acc:4,dsc:3,ns:3,vmax:23.4},
    {n:"Gacitua Emilia",min:30,dist:2548,mxm:84,hsr:153,ai18:152,spr:413,acc:31,dsc:23,ns:17,vmax:28.0},
    {n:"Silva Victoria",min:41,dist:3787,mxm:91,hsr:298,ai18:188,spr:21,acc:23,dsc:51,ns:2,vmax:22.3},
    {n:"Gomez Camila",min:54,dist:4291,mxm:78,hsr:477,ai18:324,spr:171,acc:26,dsc:19,ns:12,vmax:23.2},
    {n:"Gutierrez Renata",min:51,dist:4475,mxm:86,hsr:401,ai18:254,spr:275,acc:31,dsc:33,ns:15,vmax:24.7},
    {n:"Alfaro Javiera",min:57,dist:4647,mxm:81,hsr:568,ai18:312,spr:262,acc:31,dsc:34,ns:12,vmax:26.0},
    {n:"Pareja Camila",min:55,dist:4893,mxm:89,hsr:469,ai18:282,spr:249,acc:45,dsc:23,ns:12,vmax:25.0},
    {n:"Sierra Julieta",min:53,dist:5040,mxm:94,hsr:443,ai18:574,spr:151,acc:67,dsc:77,ns:9,vmax:23.4},
    {n:"Carrasco Sofia",min:60,dist:5114,mxm:85,hsr:423,ai18:491,spr:439,acc:49,dsc:62,ns:20,vmax:25.6},
    {n:"Mateluna Florencia",min:56,dist:5308,mxm:94,hsr:415,ai18:427,spr:443,acc:55,dsc:53,ns:19,vmax:26.6},
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
// Actualizado: VS COGS, VS PWCC, VS MANQUEHUE, VS CATÓLICA B, VS OLD REDS
const PUESTOS=[
  {p:"DC",n:"Def. Central", jugadoras:["Muñoz Constanza","Pareja Camila"],
   dist:5872,mxm:91.6,hsr:417,ai18:118,spr:4,ns:0,acc:10,dsc:16,vmax:20.7},
  {p:"LT",n:"Lateral",      jugadoras:["Gomez Camila","Gutierrez Renata","Hevia Valentina","Mateluna Florencia","Retamal Antonia"],
   dist:6243,mxm:100.7,hsr:592,ai18:121,spr:11,ns:2,acc:11,dsc:18,vmax:21.4},
  {p:"MC",n:"Med. Central", jugadoras:["Sierra Julieta"],
   dist:6622,mxm:101.6,hsr:842,ai18:286,spr:0,ns:1,acc:23,dsc:36,vmax:23.2},
  {p:"VL",n:"Volante",      jugadoras:["Carrasco Sofia","Gacitua Emilia","Silva Victoria"],
   dist:6982,mxm:108.1,hsr:1129,ai18:338,spr:102,ns:9,acc:31,dsc:44,vmax:24.3},
  {p:"WG",n:"Wing",         jugadoras:["Alfaro Javiera","Errazu Sofia","Liu Macarena"],
   dist:5913,mxm:109.9,hsr:528,ai18:114,spr:0,ns:0,acc:23,dsc:19,vmax:21.2},
  {p:"DL",n:"Del. Central", jugadoras:["Pollmann Marianne","Sepulveda Eileen"],
   dist:6266,mxm:103.7,hsr:638,ai18:150,spr:6,ns:1,acc:18,dsc:18,vmax:22.4},
  {p:"PROM",n:"Promedio",   jugadoras:[],
   dist:6304,mxm:100.5,hsr:677,ai18:184,spr:26,ns:3,acc:18,dsc:25,vmax:22.1},
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
const allSess=[...PARTIDOS,...AMISTOSOS,...ENTRENOS];
const allNames=()=>{const s=new Set();allSess.forEach(ss=>ss.jugadoras.forEach(j=>s.add(j.n)));return Array.from(s).sort();};
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
      const n=s.jugadoras.length;
      const avg=k=>Math.round(s.jugadoras.reduce((a,j)=>a+(j[k]||0),0)/n);
      const h18=avg("ai18")||0;
      const spr=avg("spr")||0;
      const h15=Math.max(0,Math.round(s.jugadoras.reduce((a,j)=>a+Math.max(0,(j.hsr||j.ai15||0)-(j.ai18||0)-(j.spr||0)),0)/n));
      return h15+h18+spr;
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
          const n=s.jugadoras.length;
          const avg=k=>Math.round(s.jugadoras.reduce((a,j)=>a+(j[k]||0),0)/n);
          h18=avg("ai18")||0;
          spr=avg("spr")||0;
          h15=Math.max(0,Math.round(s.jugadoras.reduce((a,j)=>a+Math.max(0,(j.hsr||j.ai15||0)-(j.ai18||0)-(j.spr||0)),0)/n));
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

// ─── STAFF GPS ────────────────────────────────────────────────────────────────
function StaffGPS(){
  const [tipo,setTipo]=useState("partidos");
  const [sesion,setSesion]=useState(null);
  const [jugSel,setJugSel]=useState(null);
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess;
  const sess=sesion?pool.find(s=>s.id===sesion):null;

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
                <TH cols={["Jugadora","Min","Dist.","m/min","15-18km/h","18-21km/h",">21km/h","ACC","DSC","Nº Spr","V.máx"]}/>
                <tbody>{[...sess.jugadoras].sort((a,b)=>b.dist-a.dist).map(j=>{
                  const h15=sess.zonas?sess.zonas.find(z=>z.n===j.n)?.h15:(j.hsr!=null||j.ai15!=null)?Math.max(0,(j.hsr??j.ai15)-(j.ai18??0)-(j.spr??0)):null;
                  const h18=sess.zonas?sess.zonas.find(z=>z.n===j.n)?.h18:j.ai18!=null?j.ai18:null;
                  const sp=sess.zonas?sess.zonas.find(z=>z.n===j.n)?.spr:j.spr!=null?j.spr:null;
                  const hsr=j.hsr!=null?j.hsr:j.ai15!=null?j.ai15:null;
                  return(
                    <tr key={j.n}>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{j.n}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{j.min}'</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{j.dist.toLocaleString()}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{j.mxm}</td>
                      
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green}}>{h15!=null?`${Math.max(0,h15)}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{h18!=null?`${Math.max(0,h18)}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400}}>{sp!=null?`${sp}m`:"—"}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{j.acc}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{j.dsc}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:(j.ns||0)>0?T.text:T.muted,fontWeight:(j.ns||0)>0?600:400,textAlign:"center"}}>{j.ns||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{j.vmax}</td>
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
            const h18=avg("ai18")||0;
            const spr=avg("spr")||0;
            const ns=avg("ns");
            // h15 = zona 15-18 = hsr_total(>15) - ai18 - spr, para partidos y amistosos
            const h15=Math.max(0,Math.round(jugs.reduce((a,j)=>a+Math.max(0,(j.hsr||j.ai15||0)-(j.ai18||0)-(j.spr||0)),0)/n));
            const acc=avg("acc");
            const dsc=avg("dsc");
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
  const [tipo,setTipo]=useState("partidos"); // partidos|amistosos|entrenos|todo
  const [metric,setMetric]=useState("dist");
  const [vista,setVista]=useState("equipo"); // equipo|jugadora
  const [jugSel,setJugSel]=useState(allNames()[0]);

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
          {allNames().map(n=><option key={n}>{n}</option>)}
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
// Grupos YOYO por VAM: Grupo 1=3.8 | Grupo 2=3.6 | Grupo 3=3.4
const yoyoColor=nivel=>nivel>=16.5?"#3ecf7a":nivel>=14.6?"#e09020":"#e05555";
const yoyoLabel=nivel=>nivel>=16.5?"Grupo 1":nivel>=14.6?"Grupo 2":"Grupo 3";
const yoyoGrupo=vam=>vam>=3.8?1:vam>=3.6?2:3;

function StaffYoyo(){
  const sorted=[...YOYO].sort((a,b)=>b.nivel-a.nivel);
  const medals=["🥇","🥈","🥉"];
  return(
    <>
      <MR>
        <MetCard label="Nivel prom." value={avg(YOYO.map(p=>p.nivel)).toFixed(1)} sub="Yo-Yo IRT1 — 15/4/26"/>
        <MetCard label="Nivel más alto" value={sorted[0].nivel} sub={sorted[0].n.split(" ")[0]} sc={T.amber}/>
        <MetCard label="VAM prom." value={`${avg(YOYO.map(p=>p.vam)).toFixed(1)} m/s`}/>
        <MetCard label="Evaluadas" value={YOYO.length}/>
      </MR>
      <Card style={{marginBottom:10}}>
        <CT text="Clasificación por Nivel"/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{label:">16.5 — Verde",c:"#3ecf7a"},{label:"14.6–16.4 — Amarillo",c:"#f5c518"},{label:"<14.6 — Rojo",c:"#e05555"}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"#0d1020",padding:"7px 12px",borderRadius:8,border:`1px solid ${r.c}44`}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:r.c}}/><span style={{fontSize:11,color:r.c,fontWeight:500}}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <div style={{marginBottom:6,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:".5px"}}>Podio — Nivel Alcanzado</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {sorted.slice(0,3).map((p,i)=>{
          const col=yoyoGrupoColor(yoyoGrupo(p.vam));
          return(
            <div key={p.n} style={{background:T.surf,border:`1px solid ${col}`,borderRadius:8,padding:12,textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{medals[i]}</div>
              <div style={{fontSize:12,fontWeight:500,color:T.text}}>{p.n.split(" ")[0]}</div>
              <div style={{fontSize:20,fontWeight:700,color:col,margin:"4px 0"}}>Niv. {p.nivel}</div>
              <div style={{marginTop:6,background:col+"22",borderRadius:6,padding:"3px 0",color:col,fontSize:10,fontWeight:500}}>{yoyoGrupoLabel(yoyoGrupo(p.vam))}</div>
            </div>
          );
        })}
      </div>
      <Card>
        <CT text="Yo-Yo IRT1 — 15/4/26 (ordenado por Nivel)"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["#","Jugadora","Nivel","Distancia","VAM (m/s)","Clasificación"]}/>
            <tbody>{sorted.map((p,i)=>{
              const col=yoyoGrupoColor(yoyoGrupo(p.vam));
              const nivelCol=yoyoNivelColor(p.nivel);
              return(
                <tr key={p.n}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{i+1}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,fontWeight:500,whiteSpace:"nowrap"}}>{p.n}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:nivelCol,fontWeight:700,fontSize:14}}>{p.nivel}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{p.dist}m</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:nivelCol,fontWeight:600}}>{p.vam}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824"}}>
                    <span style={{background:col+"22",color:col,padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:500}}>{yoyoGrupoLabel(yoyoGrupo(p.vam))}</span>
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

function StaffMinutos(){
  const partidos=["COGS","PWCC","MANQ A","UC B"];
  const maxTot=Math.max(...MINUTOS.map(m=>m.tot),1);
  return(
    <>
      <MR>
        <MetCard label="Jugadoras" value={MINUTOS.length}/>
        <MetCard label="Máx. minutos" value={`${Math.max(...MINUTOS.map(m=>m.tot))} min`} sub="Arau/Gutierrez/Pareja" sc={T.green}/>
        <MetCard label="Prom. equipo" value={`${Math.round(avg(MINUTOS.map(m=>m.tot)))} min`} sub="Total temporada"/>
        <MetCard label="Partidos" value={4} sub="COGS · PWCC · MANQ · UC B · OLD REDS"/>
      </MR>
      <Card>
        <CT text="Minutos de juego por jugadora — hoja Minutos de Juego"/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <TH cols={["Jugadora","Div","COGS","PWCC","MANQ","UC B","OLD REDS","Total","Prom."]}/>
            <tbody>{[...MINUTOS].sort((a,b)=>b.tot-a.tot).map(m=>{
              const col=m.tot>=200?T.green:m.tot>=100?T.amber:T.muted;
              return(
                <tr key={m.n}>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{m.n}</td>
                  <td style={{padding:"5px 6px",borderBottom:"1px solid #141824"}}><Chip text={m.div} color={m.div==="S16"?T.purple:T.blue}/></td>
                  {[m.cogs,m.pwcc,m.manq,m.catb,m.reds].map((v,i)=>(
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
  const [vista,setVista]=useState("reporte");
  if(vista==="tomar")return <StaffTomarAsistencia onVolver={()=>setVista("reporte")}/>;
  return <StaffAsistenciaReporte onTomar={()=>setVista("tomar")}/>;
}
function StaffAsistenciaReporte({onTomar}){
  const [rows,setRows]=useState(null);
  const [loading,setLoading]=useState(true);
  const [rawData,setRawData]=useState({});// {jugadora:{mes:{dias:[{fecha,est}]}}}
  const [modal,setModal]=useState(null);// {jugadora, mes, label, color}

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
        const result=Object.entries(data).map(([n,mdata])=>{
          const pctMes=m=>{const d=mdata[m];return d&&d.total>0?Math.round(d.pres/d.total*100):null;};
          const mar=pctMes("2026-03");
          const abr=pctMes("2026-04");
          const may=pctMes("2026-05");
          const vals=[mar,abr,may].filter(v=>v!==null);
          const tot=vals.length?Math.round(vals.reduce((a,v)=>a+v,0)/vals.length):0;
          return {n,mar:mar!==null?mar+"%":"—",abr:abr!==null?abr+"%":"—",may:may!==null?may+"%":"—",tot:tot+"%",pct:tot};
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
  const hoy=(()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");})();
  const [fecha,setFecha]=useState(hoy);
  const [pres,setPres]=useState({});
  const [saving,setSaving]=useState(false);
  const [saved,setSaved]=useState(false);
  const toggle=j=>setPres(p=>{const n={...p};n[j]=n[j]===1?0:n[j]===0?null:1;return n;});
  const marcarTodas=v=>{const n={};JUGADORAS.forEach(j=>n[j]=v);setPres(n);};
  const col=j=>pres[j]===1?"#3ecf7a":pres[j]===0?"#e05555":T.muted;
  const lbl=j=>pres[j]===1?"P":pres[j]===0?"A":"—";
  const guardar=async()=>{
    setSaving(true);
    const datos=JSON.stringify(JUGADORAS.map(j=>({jugadora:j,estado:pres[j]===1?"P":pres[j]===0?"A":""})));
    const params=new URLSearchParams({accion:"asistencia",fecha,datos});
    await fetch("https://script.google.com/macros/s/AKfycbzmEC2pOI2o58IVlFIEoCqYgaCTdJbMvUIivgoerLjR0fxkGhPDqIK5RWiKW1xzh3cM/exec?"+params.toString(),{method:"GET",mode:"no-cors"}).catch(()=>{});
    setSaving(false);setSaved(true);setTimeout(()=>setSaved(false),3000);
  };
  return(
    <>
      <button onClick={onVolver} style={{padding:"6px 14px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:10}}>← Volver al Reporte</button>
      <Card style={{marginBottom:10}}>
        <CT text="TOMAR ASISTENCIA"/>
        <div style={{display:"flex",gap:8,alignItems:"flex-end",marginBottom:12,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:10,color:T.muted,marginBottom:3}}>Fecha</div>
            <input type="date" value={fecha} onChange={e=>{setFecha(e.target.value);setSaved(false);}}
              style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:6,color:T.text,padding:"6px 10px",fontSize:13,fontFamily:"inherit"}}/>
          </div>
          <button onClick={()=>marcarTodas(1)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid #3ecf7a",background:"#0f2d1f",color:"#3ecf7a",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✓ Todas P</button>
          <button onClick={()=>marcarTodas(0)} style={{padding:"6px 10px",borderRadius:6,border:"1px solid #e05555",background:"#2d0f0f",color:"#e05555",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✗ Todas A</button>
          <button onClick={()=>setPres({})} style={{padding:"6px 10px",borderRadius:6,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reset</button>
        </div>
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
      </Card>
      <button onClick={guardar} disabled={saving}
        style={{width:"100%",padding:"13px",background:saved?"#0f2d1f":T.blue,border:"none",borderRadius:8,
          color:saved?"#3ecf7a":"#fff",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
        {saving?"Guardando...":saved?"✓ Guardado en Drive":"Guardar Asistencia"}
      </button>
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

  const alertsHoy=todayRows.filter(r=>+r["Calidad Sueño"]<=2||+r.Fatiga<=2||+r["Estrés"]<=2||+r["Ánimo"]<=2);

  const AlertRow=({r})=>{
    const al=[];
    if(+r["Calidad Sueño"]<=2)al.push("Sueño↓");
    if(+r.Fatiga<=2)al.push("Fatiga↓");
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

  const WellnessTable=({recs})=>(
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <TH cols={["Jugadora","Sueño","Horas","Fatiga","Dolor","Zona","Estrés","Ánimo"]}/>
      <tbody>{recs.map((r,i)=>(
        <tr key={i}>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.text}}>{r.Jugadora}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Calidad Sueño"]),fontWeight:600,textAlign:"center"}}>{r["Calidad Sueño"]}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted,textAlign:"center"}}>{r["Horas Sueño"]}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r.Fatiga),fontWeight:600,textAlign:"center"}}>{r.Fatiga}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Dolor Muscular"]),fontWeight:600,textAlign:"center"}}>{r["Dolor Muscular"]}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:T.muted,fontSize:11}}>{r["Zonas Dolor"]||"—"}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Estrés"]),fontWeight:600,textAlign:"center"}}>{r["Estrés"]}</td>
          <td style={{padding:"5px 6px",borderBottom:"1px solid #141824",color:wColor(r["Ánimo"]),fontWeight:600,textAlign:"center"}}>{r["Ánimo"]}</td>
        </tr>
      ))}</tbody>
    </table>
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
  const initTipo=(()=>{
    if(PARTIDOS.some(s=>s.jugadoras.find(j=>j.n===player)))return"partidos";
    if(AMISTOSOS.some(s=>s.jugadoras.find(j=>j.n===player)))return"amistosos";
    if(ENTRENOS.some(s=>s.jugadoras.find(j=>j.n===player)))return"entrenos";
    return"partidos";
  })();
  const [tipo,setTipo]=useState(initTipo);
  const [selId,setSelId]=useState(null);
  const pool=tipo==="partidos"?PARTIDOS:tipo==="amistosos"?AMISTOSOS:tipo==="entrenos"?ENTRENOS:allSess;
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
          const h15=jd.hsr||0;
          const h18=jd.ai18||0;
          const spr=jd.spr||0;
          return{h15,h18,spr};
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
            <TH cols={selId?["Jugadora","Min","Dist.","m/min","15-18","18-21",">21","ACC","DSC","N Spr","V.máx"]:["Sesión","Min","Dist.","m/min","15-18","18-21",">21","ACC","DSC","N Spr","V.máx"]}/>
            <tbody>{selId?(
              (()=>{
                const selSess=sess.find(s=>s.id===selId);
                if(!selSess)return null;
                return [...selSess.jugadoras].sort((a,b)=>b.dist-a.dist).map(j=>{
                  const isMe=j.n===player;
                  const h15=Math.max(0,(j.hsr||j.ai15||0)-(j.ai18||0)-(j.spr||0));
                  const h18=j.ai18||0;
                  const sp=j.spr||0;
                  return(
                    <tr key={j.n} style={{background:isMe?"#0d1f35":"transparent"}}>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:isMe?T.blue:T.text,fontWeight:isMe?700:400,whiteSpace:"nowrap"}}>{isMe?"▶ ":""}{j.n.split(" ")[0]}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{j.min}'</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:isMe?T.blue:T.text,fontWeight:isMe?600:400}}>{j.dist.toLocaleString()}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{j.mxm}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green}}>{h15}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{h18}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400}}>{sp}m</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{j.acc||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{j.dsc||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:(j.ns||0)>0?T.text:T.muted,fontWeight:(j.ns||0)>0?600:400,textAlign:"center"}}>{j.ns||0}</td>
                      <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{j.vmax}</td>
                    </tr>
                  );
                });
              })()
            ):(
              sess.map(s=>{
                const jd=s.jugadoras?.find(j=>j.n===player);
                const h15=jd?Math.max(0,(jd.hsr||jd.ai15||0)-(jd.ai18||0)-(jd.spr||0)):0;
                const h18=jd?.ai18||0;
                const sp=jd?.spr||0;
                return(
                  <tr key={s.id}>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.text,whiteSpace:"nowrap"}}>{sIcon(s.tipo)} {s.label}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted}}>{s.data.min}'</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.blue,fontWeight:500}}>{s.data.dist.toLocaleString()}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.muted2}}>{s.data.mxm}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.green}}>{h15}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber}}>{h18}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:sp>0?T.red:T.muted,fontWeight:sp>0?700:400}}>{sp}m</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.purple}}>{s.data.acc||0}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.cyan}}>{s.data.dsc||0}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:(s.data.ns||0)>0?T.text:T.muted,fontWeight:(s.data.ns||0)>0?600:400,textAlign:"center"}}>{s.data.ns||0}</td>
                    <td style={{padding:"4px 6px",borderBottom:"1px solid #141824",color:T.amber,fontWeight:500}}>{s.data.vmax}</td>
                  </tr>
                );
              })
            )}</tbody>
          </table>
        </div>
      </Card>
      {/* Promedio equipo de la sesión seleccionada */}
      {selId&&(()=>{
        const selSess=sess.find(s=>s.id===selId);
        if(!selSess||!selSess.jugadoras||!selSess.jugadoras.length)return null;
        const jugs=selSess.jugadoras;
        const n=jugs.length;
        const avg=k=>Math.round(jugs.reduce((a,j)=>a+(j[k]||0),0)/n);
        const avgf=k=>Math.round(jugs.reduce((a,j)=>a+(j[k]||0),0)/n*10)/10;
        const dist=avg("dist");
        const mxm=dist&&avgf("min")>0?Math.round(dist/avgf("min")*10)/10:avgf("mxm");
        const h18=avg("ai18")||0;
        const spr=avg("spr")||0;
        const h15=Math.max(0,Math.round(jugs.reduce((a,j)=>a+Math.max(0,(j.hsr||j.ai15||0)-(j.ai18||0)-(j.spr||0)),0)/n));
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
function PlayerYoyo({player}){
  const d=YOYO.find(p=>p.n===player);
  const sorted=[...YOYO].sort((a,b)=>b.nivel-a.nivel);
  const myRank=d?sorted.findIndex(p=>p.n===player)+1:null;
  if(!d)return(
    <div style={{color:T.muted,padding:20,textAlign:"center",fontSize:12}}>
      Sin datos Yo-Yo para {player}
    </div>
  );
  const col=yoyoColor(d.nivel);
  const nivelColD=yoyoNivelColor(d.nivel);
  return(
    <>
      <MR>
        <MetCard label="Nivel alcanzado" value={d.nivel} sc={col}/>
        <MetCard label="Distancia" value={`${d.dist}m`}/>
        <MetCard label="VAM" value={`${d.vam} m/s`} sc={T.cyan}/>
        <MetCard label="Ranking" value={`${myRank}° / ${YOYO.length}`}/>
      </MR>
      <Card style={{marginBottom:10}}>
        <CT text="Mi resultado Yo-Yo IRT1 — 15/4/26"/>
        <div style={{textAlign:"center",padding:"20px 0"}}>
          <div style={{fontSize:48,fontWeight:700,color:nivelColD,marginBottom:8}}>{d.nivel}</div>
          <div style={{fontSize:14,color:T.muted2,marginBottom:4}}>Nivel alcanzado</div>
          <span style={{background:col+"22",color:col,padding:"4px 16px",borderRadius:6,fontSize:12,fontWeight:500}}>{yoyoLabel(d.nivel)}</span>
        </div>
        <div style={{display:"flex",justifyContent:"space-around",marginTop:16}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:T.blue}}>{d.dist}m</div><div style={{fontSize:11,color:T.muted}}>Distancia</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:T.cyan}}>{d.vam} m/s</div><div style={{fontSize:11,color:T.muted}}>VAM</div></div>
          <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:700,color:T.amber}}>{myRank}°</div><div style={{fontSize:11,color:T.muted}}>Ranking</div></div>
        </div>
      </Card>
      <Card style={{marginBottom:10}}>
        <CT text="Clasificación por Nivel"/>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {[{label:">16.5 — Verde",c:"#3ecf7a"},{label:"14.6–16.4 — Amarillo",c:"#f5c518"},{label:"<14.6 — Rojo",c:"#e05555"}].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,background:"#0d1020",padding:"7px 12px",borderRadius:8,border:`1px solid ${r.c}44`}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:r.c}}/><span style={{fontSize:11,color:r.c,fontWeight:500}}>{r.label}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CT text="Comparación con el equipo"/>
        {sorted.map((p,i)=>{
          const isMe=p.n===player;const gc=yoyoGrupoColor(yoyoGrupo(p.vam));
              const nivelColP=yoyoNivelColor(p.nivel);
          return(
            <div key={p.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,background:isMe?"#1e3a5f":"transparent",borderRadius:6,padding:"4px 8px"}}>
              <span style={{fontSize:11,color:T.muted,width:20}}>{i+1}</span>
              <span style={{fontSize:12,color:isMe?T.blue:T.text,fontWeight:isMe?700:400,flex:1}}>{p.n.split(" ")[0]}</span>
              <span style={{fontSize:12,color:nivelColP,fontWeight:600}}>{p.nivel}</span>
              <span style={{fontSize:11,color:T.muted}}>{p.dist}m</span>
              <span style={{fontSize:11,color:T.cyan}}>{p.vam}m/s</span>
            </div>
          );
        })}
      </Card>
    </>
  );
}

function PlayerMinutos({player}){
  const m=MINUTOS.find(x=>x.n===player);
  if(!m)return(
    <div style={{color:T.muted,padding:20,textAlign:"center",fontSize:12}}>
      Sin datos de minutos para {player}
    </div>
  );
  const partidos=[
    {l:"COGS",   v:m.cogs, c:T.blue},
    {l:"PWCC",   v:m.pwcc, c:T.green},
    {l:"MANQ",   v:m.manq, c:T.amber},
    {l:"CAT B",  v:m.catb, c:T.red},
    {l:"OLD REDS",v:m.reds,c:T.purple},
  ];
  const jugados=partidos.filter(p=>p.v);
  return(
    <>
      <MR>
        <MetCard label="Total minutos" value={`${m.tot} min`} sc={T.blue}/>
        <MetCard label="Prom. x partido" value={`${m.prom} min`}/>
        <MetCard label="Partidos jugados" value={jugados.length}/>
      </MR>
      <Card>
        <CT text="Mis minutos por partido"/>
        {jugados.map(p=>(
          <div key={p.l} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:12,color:T.text,fontWeight:500}}>{p.l}</span>
              <span style={{fontSize:12,color:p.c,fontWeight:600}}>{p.v} min</span>
            </div>
            <div style={{background:"#1a1e2a",borderRadius:4,height:10}}>
              <div style={{width:`${Math.min((p.v/70)*100,100)}%`,height:10,borderRadius:4,background:p.c}}/>
            </div>
          </div>
        ))}
        {jugados.length===0&&<div style={{color:T.muted,textAlign:"center",padding:12}}>Sin minutos registrados</div>}
      </Card>
      <Card>
        <CT text="RANKING MINUTOS — EQUIPO"/>
        {(()=>{
          const tots=MINUTOS.map(r=>({
            n:r.n,
            tot:(r.cogs||0)+(r.pwcc||0)+(r.manq||0)+(r.catb||0)+(r.reds||0)
          })).filter(r=>r.tot>0).sort((a,b)=>b.tot-a.tot);
          const mx=tots[0]?.tot||1;
          return tots.map((r,i)=>(
            <div key={r.n} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:10,color:T.muted,width:16,textAlign:"right"}}>{i+1}</span>
              <span style={{fontSize:11,color:r.n===player?T.blue:T.text,fontWeight:r.n===player?700:400,width:130}}>{r.n.split(" ")[0]}</span>
              <div style={{flex:1,height:8,borderRadius:3,background:"#1e2535"}}>
                <div style={{width:`${(r.tot/mx)*100}%`,height:"100%",borderRadius:3,background:r.n===player?T.blue:T.muted2}}/>
              </div>
              <span style={{fontSize:10,color:r.n===player?T.blue:T.muted,width:32,textAlign:"right"}}>{r.tot}'</span>
            </div>
          ));
        })()}
      </Card>
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
  const vals=[feb,mar,abr,may].filter(v=>v!==null);
  const tot=vals.length?Math.round(vals.reduce((a,v)=>a+v,0)/vals.length):pct;

  // Construir filas del calendario: todas las fechas únicas en orden
  const MESES_CAL=[
    {key:"2026-02",label:"FEBRERO",color:T.purple||"#a78bfa"},
    {key:"2026-03",label:"MARZO",color:T.green},
    {key:"2026-04",label:"ABRIL",color:T.blue},
    {key:"2026-05",label:"MAYO",color:T.amber},
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
  const todayKey=(p)=>{const d=new Date();return p+"_rpe_"+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();};
  const [yaDone,setYaDone]=useState(()=>!!localStorage.getItem(todayKey(player)));
  const [rpe,setRpe]=useState(RPE_DATA[player]||5);
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
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
  const todayKeyW=(p)=>{const d=new Date();return p+"_well_"+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();};
  const [yaDone,setYaDone]=useState(()=>!!localStorage.getItem(todayKeyW(player)));
  const [form,setForm]=useState({horas:base.horas,calidad:base.calidad,fatiga:base.fatiga,dolor:base.dolor,estres:base.estres,animo:base.animo,zonasDolor:[],otroZona:""});
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
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
                  {allNames().map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            )}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:6}}>Contraseña</div>
              <div style={{position:"relative"}}>
                <input {...{type:showPass?"text":"password"}} value={pass} onChange={e=>{setPass(e.target.value);setError("");}} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="••••••••" style={{width:"100%",background:"#0d1020",border:`1px solid ${error?T.red:T.border2}`,borderRadius:8,boxSizing:"border-box",paddingRight:38,color:T.text,fontSize:14,padding:"10px 12px",outline:"none",boxSizing:"border-box",fontFamily:"inherit"}}/>
                <button onClick={()=>setShowPass(v=>!v)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:16,padding:0,lineHeight:1}}>
                  {showPass?"👁":"👁‍🗨"}
                </button>
              </div>
              {error&&<div style={{fontSize:11,color:T.red,marginTop:6}}>{error}</div>}
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
  const [session,setSession]=useState(null);
  const [tab,setTab]=useState(0);
  const [player,setPlayer]=useState(allNames()[0]);
  const handleLogin=(tipo,playerName)=>{setSession({tipo,player:playerName});setTab(0);if(playerName)setPlayer(playerName);};
  const handleLogout=()=>{setSession(null);setTab(0);};
  if(!session)return<LoginScreen onLogin={handleLogin}/>;
  const mode=session.tipo==="staff"?"staff":"player";
  const STAFF_TABS=["GPS","Evolución GPS","Perfil Puestos","Yo-Yo","Minutos","Asistencia","RPE","Wellness"];
  const PLAYER_TABS=["Mi GPS","Evolución GPS","Yo-Yo","Minutos","Asistencia","Mi RPE","Mi Wellness"];
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
          <>{tab===0&&<StaffGPS/>}{tab===1&&<StaffEvoGPS/>}{tab===2&&<StaffPuestos/>}{tab===3&&<StaffYoyo/>}{tab===4&&<StaffMinutos/>}{tab===5&&<StaffAsistencia/>}{tab===6&&<StaffRPE/>}{tab===7&&<StaffWellness/>}</>
        ):(
          <ErrorBoundary><>{tab===0&&<PlayerGPS player={session.player||player}/>}{tab===1&&<PlayerEvoGPS player={session.player||player}/>}{tab===2&&<PlayerYoyo player={session.player||player}/>}{tab===3&&<PlayerMinutos player={session.player||player}/>}{tab===4&&<PlayerAsistencia player={session.player||player}/>}{tab===5&&<PlayerRPE player={session.player||player}/>}{tab===6&&<PlayerWellness player={session.player||player}/>}</></ErrorBoundary>
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
