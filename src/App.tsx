import './App.css'
import FlaggedCsvComponent from './components/FlaggedCsvComponent'
import { useState } from 'react'
import { parseHighlightInput } from './utils/cellRangeParser'

// Real Estate Portfolio CSV from adw-specs/flagged.csv
const flaggedCsvData = `A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB,AC,AD
Real Estate Portfolio Report (Synthetic Data){#BDD7EE}{MG:143777}{l:A1},{MG:143777}{l:B1},{MG:143777}{l:C1},{MG:143777}{l:D1},{MG:143777}{l:E1},{MG:143777}{l:F1},{MG:143777}{l:G1},{MG:143777}{l:H1},{MG:143777}{l:I1},{MG:143777}{l:J1},{MG:143777}{l:K1},{MG:143777}{l:L1},{MG:143777}{l:M1},{MG:143777}{l:N1},{MG:143777}{l:O1},{MG:143777}{l:P1},{MG:143777}{l:Q1},{MG:143777}{l:R1},{MG:143777}{l:S1},{MG:143777}{l:T1},{MG:143777}{l:U1},{MG:143777}{l:V1},{MG:143777}{l:W1},{MG:143777}{l:X1},{MG:143777}{l:Y1},{MG:143777}{l:Z1},{MG:143777}{l:AA1},{MG:143777}{l:AB1},{MG:143777}{l:AC1},{MG:143777}{l:AD1}
Generated on 2025-08-16 10:15 — All figures in AUD{MG:358879}{l:A2},{MG:358879}{l:B2},{MG:358879}{l:C2},{MG:358879}{l:D2},{MG:358879}{l:E2},{MG:358879}{l:F2},{MG:358879}{l:G2},{MG:358879}{l:H2},{MG:358879}{l:I2},{MG:358879}{l:J2},{MG:358879}{l:K2},{MG:358879}{l:L2},{MG:358879}{l:M2},{MG:358879}{l:N2},{MG:358879}{l:O2},{MG:358879}{l:P2},{MG:358879}{l:Q2},{MG:358879}{l:R2},{MG:358879}{l:S2},{MG:358879}{l:T2},{MG:358879}{l:U2},{MG:358879}{l:V2},{MG:358879}{l:W2},{MG:358879}{l:X2},{MG:358879}{l:Y2},{MG:358879}{l:Z2},{MG:358879}{l:AA2},{MG:358879}{l:AB2},{MG:358879}{l:AC2},{MG:358879}{l:AD2}
Overview{#D9E1F2}{MG:222137}{l:A4},{MG:222137}{l:B4},{MG:222137}{l:C4},{MG:222137}{l:D4},{MG:222137}{l:E4},{MG:222137}{l:F4},{MG:222137}{l:G4},{MG:222137}{l:H4},{MG:222137}{l:I4},{MG:222137}{l:J4},{MG:222137}{l:K4},{MG:222137}{l:L4},{MG:222137}{l:M4},{MG:222137}{l:N4},{MG:222137}{l:O4},{MG:222137}{l:P4},{MG:222137}{l:Q4},{MG:222137}{l:R4},{MG:222137}{l:S4},{MG:222137}{l:T4},{MG:222137}{l:U4},{MG:222137}{l:V4},{MG:222137}{l:W4},{MG:222137}{l:X4},{MG:222137}{l:Y4},{MG:222137}{l:Z4},{MG:222137}{l:AA4},{MG:222137}{l:AB4},{MG:222137}{l:AC4},{MG:222137}{l:AD4}
Total Listings{#FFF2CC}{MG:718209}{l:A5},{MG:718209}{l:B5},{MG:718209}{l:C5},{MG:718209}{l:D5},60{#FCE4D6}{MG:685911}{l:E5},{MG:685911}{l:F5},{MG:685911}{l:G5},Active{#FFF2CC}{MG:237090}{l:H5},{MG:237090}{l:I5},{MG:237090}{l:J5},{MG:237090}{l:K5},11{#FCE4D6}{MG:907000}{l:L5},{MG:907000}{l:M5},{MG:907000}{l:N5},Under Offer{#FFF2CC}{MG:214715}{l:O5},{MG:214715}{l:P5},{MG:214715}{l:Q5},{MG:214715}{l:R5},15{#FCE4D6}{MG:978415}{l:S5},{MG:978415}{l:T5},{MG:978415}{l:U5},Sold (YTD){#FFF2CC}{MG:589632}{l:V5},{MG:589632}{l:W5},{MG:589632}{l:X5},{MG:589632}{l:Y5},14{#FCE4D6}{MG:321369}{l:Z5},{MG:321369}{l:AA5},{MG:321369}{l:AB5},,
Avg List Price{#FFF2CC}{MG:994175}{l:A6},{MG:994175}{l:B6},{MG:994175}{l:C6},{MG:994175}{l:D6},1411278{#FCE4D6}{MG:904759}{l:E6},{MG:904759}{l:F6},{MG:904759}{l:G6},Median Rent (wk){#FFF2CC}{MG:470349}{l:H6},{MG:470349}{l:I6},{MG:470349}{l:J6},{MG:470349}{l:K6},873{#FCE4D6}{MG:974312}{l:L6},{MG:974312}{l:M6},{MG:974312}{l:N6},Avg Gross Yield{#FFF2CC}{MG:314937}{l:O6},{MG:314937}{l:P6},{MG:314937}{l:Q6},{MG:314937}{l:R6},4.48{#FCE4D6}{MG:249805}{l:S6},{MG:249805}{l:T6},{MG:249805}{l:U6},,,,,,,,,
Property Inventory (Detailed){#D9E1F2}{MG:463132}{l:A8},{MG:463132}{l:B8},{MG:463132}{l:C8},{MG:463132}{l:D8},{MG:463132}{l:E8},{MG:463132}{l:F8},{MG:463132}{l:G8},{MG:463132}{l:H8},{MG:463132}{l:I8},{MG:463132}{l:J8},{MG:463132}{l:K8},{MG:463132}{l:L8},{MG:463132}{l:M8},{MG:463132}{l:N8},{MG:463132}{l:O8},{MG:463132}{l:P8},{MG:463132}{l:Q8},{MG:463132}{l:R8},{MG:463132}{l:S8},{MG:463132}{l:T8},{MG:463132}{l:U8},{MG:463132}{l:V8},{MG:463132}{l:W8},{MG:463132}{l:X8},{MG:463132}{l:Y8},{MG:463132}{l:Z8},{MG:463132}{l:AA8},{MG:463132}{l:AB8},{MG:463132}{l:AC8},{MG:463132}{l:AD8}
Property ID{#C6E0B4}{l:A9},Street Address{#C6E0B4}{l:B9},Suburb{#C6E0B4}{l:C9},State{#C6E0B4}{l:D9},Postcode{#C6E0B4}{l:E9},Property Type{#C6E0B4}{l:F9},Bedrooms{#C6E0B4}{l:G9},Bathrooms{#C6E0B4}{l:H9},Car Spaces{#C6E0B4}{l:I9},Land Size (sqm){#C6E0B4}{l:J9},Floor Area (sqm){#C6E0B4}{l:K9},Year Built{#C6E0B4}{l:L9},Listing Date{#C6E0B4}{l:M9},Status{#C6E0B4}{l:N9},Agent{#C6E0B4}{l:O9},Days on Market{#C6E0B4}{l:P9},List Price (AUD){#C6E0B4}{l:Q9},Price Low (AUD){#C6E0B4}{l:R9},Price High (AUD){#C6E0B4}{l:S9},Sold Price (AUD){#C6E0B4}{l:T9},Sale Date{#C6E0B4}{l:U9},Rental Appraisal (AUD/wk){#C6E0B4}{l:V9},Current Rent (AUD/wk){#C6E0B4}{l:W9},Gross Yield (%){#C6E0B4}{l:X9},Council Rates (AUD/yr){#C6E0B4}{l:Y9},Strata (AUD/yr){#C6E0B4}{l:Z9},Last Renovation{#C6E0B4}{l:AA9},School Zone{#C6E0B4}{l:AB9},Walk Score{#C6E0B4}{l:AC9},Notes{#C6E0B4}{l:AD9}
PID-10000{#F2F2F2}{l:A10},385 Oxford St{#F2F2F2}{l:B10},Wollongong{#F2F2F2}{l:C10},NSW{#F2F2F2}{l:D10},2243{#F2F2F2}{l:E10},Duplex{#F2F2F2}{l:F10},5{#F2F2F2}{l:G10},3{#F2F2F2}{l:H10},3{#F2F2F2}{l:I10},898{#F2F2F2}{l:J10},890{#F2F2F2}{l:K10},2008{#F2F2F2}{l:L10},2025-00-%-d{#F2F2F2}{l:M10},Off Market{#F2F2F2}{l:N10},Sarah Johnson{#F2F2F2}{l:O10},104{#F2F2F2}{l:P10},2440307{#F2F2F2}{l:Q10},2327705{#F2F2F2}{l:R10},2525535{#F2F2F2}{l:S10},{#F2F2F2}{l:T10},{#F2F2F2}{l:U10},867{#F2F2F2}{l:V10},{#F2F2F2}{l:W10},1.85{#F2F2F2}{l:X10},1295{#F2F2F2}{l:Y10},0{#F2F2F2}{l:Z10},2005{#F2F2F2}{l:AA10},Great Western High{#F2F2F2}{l:AB10},87{#F2F2F2}{l:AC10},City views{#F2F2F2}{l:AD10}
PID-10001{l:A11},159 Railway Pde{l:B11},Strathfield{l:C11},NSW{l:D11},2604{l:E11},Townhouse{l:F11},2{l:G11},4{l:H11},2{l:I11},496{l:J11},479{l:K11},1980{l:L11},2025-00-%-d{l:M11},Active{l:N11},Liam Wilson{l:O11},155{l:P11},2054448{l:Q11},2010397{l:R11},2075594{l:S11},,,1027{l:V11},,2.6{l:X11},2698{l:Y11},2604{l:Z11},2021{l:AA11},Riverbank Public{l:AB11},78{l:AC11},City views{l:AD11}
PID-10002{#F2F2F2}{l:A12},117 Oxford St{#F2F2F2}{l:B12},Bankstown{#F2F2F2}{l:C12},NSW{#F2F2F2}{l:D12},2786{#F2F2F2}{l:E12},Villa{#F2F2F2}{l:F12},1{#F2F2F2}{l:G12},3{#F2F2F2}{l:H12},1{#F2F2F2}{l:I12},333{#F2F2F2}{l:J12},308{#F2F2F2}{l:K12},1970{#F2F2F2}{l:L12},2025-00-%-d{#F2F2F2}{l:M12},Under Offer{#F2F2F2}{l:N12},Liam Wilson{#F2F2F2}{l:O12},185{#F2F2F2}{l:P12},1372682{#F2F2F2}{l:Q12},1304627{#F2F2F2}{l:R12},1450681{#F2F2F2}{l:S12},{#F2F2F2}{l:T12},{#F2F2F2}{l:U12},1139{#F2F2F2}{l:V12},{#F2F2F2}{l:W12},4.31{#F2F2F2}{l:X12},2967{#F2F2F2}{l:Y12},0{#F2F2F2}{l:Z12},2007{#F2F2F2}{l:AA12},Kingsfield College{#F2F2F2}{l:AB12},68{#F2F2F2}{l:AC12},New kitchen{#F2F2F2}{l:AD12}
PID-10003{l:A13},438 Pacific Hwy{l:B13},Newcastle{l:C13},NSW{l:D13},2409{l:E13},Duplex{l:F13},2{l:G13},1{l:H13},2{l:I13},1129{l:J13},1117{l:K13},2007{l:L13},2025-00-%-d{l:M13},Under Offer{l:N13},Liam Wilson{l:O13},15{l:P13},2364203{l:Q13},2256323{l:R13},2413348{l:S13},,,489{l:V13},,1.08{l:X13},3122{l:Y13},0{l:Z13},2015{l:AA13},Kingsfield College{l:AB13},42{l:AC13},North-facing{l:AD13}
PID-10004{#F2F2F2}{l:A14},626 Elizabeth St{#F2F2F2}{l:B14},Ryde{#F2F2F2}{l:C14},NSW{#F2F2F2}{l:D14},2837{#F2F2F2}{l:E14},Duplex{#F2F2F2}{l:F14},1{#F2F2F2}{l:G14},2{#F2F2F2}{l:H14},1{#F2F2F2}{l:I14},622{#F2F2F2}{l:J14},613{#F2F2F2}{l:K14},1985{#F2F2F2}{l:L14},2025-00-%-d{#F2F2F2}{l:M14},Under Offer{#F2F2F2}{l:N14},Grace Taylor{#F2F2F2}{l:O14},48{#F2F2F2}{l:P14},2103776{#F2F2F2}{l:Q14},2075851{#F2F2F2}{l:R14},2237366{#F2F2F2}{l:S14},{#F2F2F2}{l:T14},{#F2F2F2}{l:U14},1467{#F2F2F2}{l:V14},{#F2F2F2}{l:W14},3.63{#F2F2F2}{l:X14},2831{#F2F2F2}{l:Y14},0{#F2F2F2}{l:Z14},2005{#F2F2F2}{l:AA14},Kingsfield College{#F2F2F2}{l:AB14},82{#F2F2F2}{l:AC14},Near train station{#F2F2F2}{l:AD14}
PID-10005{l:A15},670 George St{l:B15},Burwood{l:C15},NSW{l:D15},2713{l:E15},Apartment{l:F15},2{l:G15},1{l:H15},0{l:I15},100{l:J15},137{l:K15},1960{l:L15},2025-00-%-d{l:M15},Sold{l:N15},Olivia Martin{l:O15},24{l:P15},1504923{l:Q15},1478539{l:R15},1588210{l:S15},1366352{l:T15},2025-00-%-d{l:U15},1481{l:V15},,5.12{l:X15},2062{l:Y15},884{l:Z15},2024{l:AA15},Riverbank Public{l:AB15},75{l:AC15},Dual living potential{l:AD15}
PID-10006{#F2F2F2}{l:A16},710 George St{#F2F2F2}{l:B16},Parramatta{#F2F2F2}{l:C16},NSW{#F2F2F2}{l:D16},2989{#F2F2F2}{l:E16},Unit{#F2F2F2}{l:F16},3{#F2F2F2}{l:G16},3{#F2F2F2}{l:H16},2{#F2F2F2}{l:I16},163{#F2F2F2}{l:J16},142{#F2F2F2}{l:K16},1964{#F2F2F2}{l:L16},2025-00-%-d{#F2F2F2}{l:M16},Under Offer{#F2F2F2}{l:N16},Alex Wong{#F2F2F2}{l:O16},107{#F2F2F2}{l:P16},1462677{#F2F2F2}{l:Q16},1390376{#F2F2F2}{l:R16},1510007{#F2F2F2}{l:S16},{#F2F2F2}{l:T16},{#F2F2F2}{l:U16},859{#F2F2F2}{l:V16},{#F2F2F2}{l:W16},3.05{#F2F2F2}{l:X16},1928{#F2F2F2}{l:Y16},3235{#F2F2F2}{l:Z16},2024{#F2F2F2}{l:AA16},Great Western High{#F2F2F2}{l:AB16},75{#F2F2F2}{l:AC16},City views{#F2F2F2}{l:AD16}
PID-10007{l:A17},337 Pitt St{l:B17},Newcastle{l:C17},NSW{l:D17},2955{l:E17},Villa{l:F17},4{l:G17},1{l:H17},2{l:I17},576{l:J17},565{l:K17},2022{l:L17},2025-00-%-d{l:M17},Sold{l:N17},Olivia Martin{l:O17},88{l:P17},1681496{l:Q17},1653961{l:R17},1701802{l:S17},1561974{l:T17},2025-00-%-d{l:U17},1158{l:V17},,3.58{l:X17},2672{l:Y17},0{l:Z17},2010{l:AA17},Northshore Grammar{l:AB17},56{l:AC17},
PID-10008{#F2F2F2}{l:A18},263 Harris St{#F2F2F2}{l:B18},Epping{#F2F2F2}{l:C18},NSW{#F2F2F2}{l:D18},2059{#F2F2F2}{l:E18},Townhouse{#F2F2F2}{l:F18},1{#F2F2F2}{l:G18},3{#F2F2F2}{l:H18},3{#F2F2F2}{l:I18},394{#F2F2F2}{l:J18},376{#F2F2F2}{l:K18},1979{#F2F2F2}{l:L18},2025-00-%-d{#F2F2F2}{l:M18},Sold{#F2F2F2}{l:N18},Liam Wilson{#F2F2F2}{l:O18},93{#F2F2F2}{l:P18},567927{#F2F2F2}{l:Q18},543268{#F2F2F2}{l:R18},573640{#F2F2F2}{l:S18},616157{#F2F2F2}{l:T18},2024-00-%-d{#F2F2F2}{l:U18},1035{#F2F2F2}{l:V18},{#F2F2F2}{l:W18},9.48{#F2F2F2}{l:X18},2233{#F2F2F2}{l:Y18},616{#F2F2F2}{l:Z18},2013{#F2F2F2}{l:AA18},Kingsfield College{#F2F2F2}{l:AB18},38{#F2F2F2}{l:AC18},{#F2F2F2}{l:AD18}
PID-10009{l:A19},282 Victoria Rd{l:B19},Parramatta{l:C19},NSW{l:D19},2624{l:E19},Villa{l:F19},3{l:G19},4{l:H19},2{l:I19},956{l:J19},936{l:K19},2000{l:L19},2025-00-%-d{l:M19},Under Offer{l:N19},Grace Taylor{l:O19},188{l:P19},1478310{l:Q19},1416580{l:R19},1496107{l:S19},,,379{l:V19},379{l:W19},1.33{l:X19},1838{l:Y19},0{l:Z19},2010{l:AA19},Kingsfield College{l:AB19},64{l:AC19},Development site STCA{l:AD19}
PID-10010{#F2F2F2}{l:A20},384 Queen St{#F2F2F2}{l:B20},Parramatta{#F2F2F2}{l:C20},NSW{#F2F2F2}{l:D20},2760{#F2F2F2}{l:E20},Duplex{#F2F2F2}{l:F20},3{#F2F2F2}{l:G20},4{#F2F2F2}{l:H20},2{#F2F2F2}{l:I20},881{#F2F2F2}{l:J20},871{#F2F2F2}{l:K20},1981{#F2F2F2}{l:L20},2025-00-%-d{#F2F2F2}{l:M20},Sold{#F2F2F2}{l:N20},Alex Wong{#F2F2F2}{l:O20},141{#F2F2F2}{l:P20},978184{#F2F2F2}{l:Q20},936026{#F2F2F2}{l:R20},1049130{#F2F2F2}{l:S20},904801{#F2F2F2}{l:T20},2025-00-%-d{#F2F2F2}{l:U20},1216{#F2F2F2}{l:V20},{#F2F2F2}{l:W20},6.46{#F2F2F2}{l:X20},1793{#F2F2F2}{l:Y20},0{#F2F2F2}{l:Z20},2014{#F2F2F2}{l:AA20},Central Primary{#F2F2F2}{l:AB20},55{#F2F2F2}{l:AC20},Needs TLC{#F2F2F2}{l:AD20}
PID-10011{l:A21},918 King St{l:B21},Bankstown{l:C21},NSW{l:D21},2826{l:E21},Apartment{l:F21},4{l:G21},2{l:H21},3{l:I21},158{l:J21},160{l:K21},2016{l:L21},2025-00-%-d{l:M21},Sold{l:N21},Michael Lee{l:O21},12{l:P21},2404587{l:Q21},2381395{l:R21},2550304{l:S21},2504620{l:T21},2025-00-%-d{l:U21},1483{l:V21},,3.21{l:X21},1953{l:Y21},1313{l:Z21},2016{l:AA21},Riverbank Public{l:AB21},56{l:AC21},North-facing{l:AD21}
PID-10012{#F2F2F2}{l:A22},621 Church St{#F2F2F2}{l:B22},Blacktown{#F2F2F2}{l:C22},NSW{#F2F2F2}{l:D22},2076{#F2F2F2}{l:E22},House{#F2F2F2}{l:F22},4{#F2F2F2}{l:G22},3{#F2F2F2}{l:H22},2{#F2F2F2}{l:I22},496{#F2F2F2}{l:J22},481{#F2F2F2}{l:K22},2015{#F2F2F2}{l:L22},2025-00-%-d{#F2F2F2}{l:M22},Under Offer{#F2F2F2}{l:N22},Emily Chen{#F2F2F2}{l:O22},35{#F2F2F2}{l:P22},998234{#F2F2F2}{l:Q22},982341{#F2F2F2}{l:R22},1021831{#F2F2F2}{l:S22},{#F2F2F2}{l:T22},{#F2F2F2}{l:U22},591{#F2F2F2}{l:V22},{#F2F2F2}{l:W22},3.08{#F2F2F2}{l:X22},2240{#F2F2F2}{l:Y22},0{#F2F2F2}{l:Z22},2005{#F2F2F2}{l:AA22},Kingsfield College{#F2F2F2}{l:AB22},42{#F2F2F2}{l:AC22},North-facing{#F2F2F2}{l:AD22}
PID-10013{l:A23},298 Railway Pde{l:B23},Epping{l:C23},NSW{l:D23},2311{l:E23},Villa{l:F23},4{l:G23},1{l:H23},3{l:I23},992{l:J23},986{l:K23},1970{l:L23},2024-00-%-d{l:M23},Active{l:N23},Sarah Johnson{l:O23},238{l:P23},729187{l:Q23},700201{l:R23},742376{l:S23},,,538{l:V23},,3.84{l:X23},2306{l:Y23},0{l:Z23},2001{l:AA23},Central Primary{l:AB23},59{l:AC23},
PID-10014{#F2F2F2}{l:A24},152 George St{#F2F2F2}{l:B24},Bankstown{#F2F2F2}{l:C24},NSW{#F2F2F2}{l:D24},2851{#F2F2F2}{l:E24},House{#F2F2F2}{l:F24},6{#F2F2F2}{l:G24},4{#F2F2F2}{l:H24},2{#F2F2F2}{l:I24},979{#F2F2F2}{l:J24},970{#F2F2F2}{l:K24},2013{#F2F2F2}{l:L24},2025-00-%-d{#F2F2F2}{l:M24},Off Market{#F2F2F2}{l:N24},Alex Wong{#F2F2F2}{l:O24},84{#F2F2F2}{l:P24},1732249{#F2F2F2}{l:Q24},1698318{#F2F2F2}{l:R24},1820366{#F2F2F2}{l:S24},{#F2F2F2}{l:T24},{#F2F2F2}{l:U24},567{#F2F2F2}{l:V24},{#F2F2F2}{l:W24},1.7{#F2F2F2}{l:X24},3132{#F2F2F2}{l:Y24},0{#F2F2F2}{l:Z24},{#F2F2F2}{l:AA24},Riverbank Public{#F2F2F2}{l:AB24},61{#F2F2F2}{l:AC24},Quiet street{#F2F2F2}{l:AD24}
PID-10015{l:A25},580 George St{l:B25},Hurstville{l:C25},NSW{l:D25},2803{l:E25},Villa{l:F25},1{l:G25},3{l:H25},2{l:I25},495{l:J25},469{l:K25},2001{l:L25},2025-00-%-d{l:M25},Off Market{l:N25},Emily Chen{l:O25},177{l:P25},782708{l:Q25},751306{l:R25},826893{l:S25},,,1277{l:V25},,8.48{l:X25},1331{l:Y25},0{l:Z25},2013{l:AA25},Northshore Grammar{l:AB25},76{l:AC25},Needs TLC{l:AD25}
PID-10016{#F2F2F2}{l:A26},402 Queen St{#F2F2F2}{l:B26},Bankstown{#F2F2F2}{l:C26},NSW{#F2F2F2}{l:D26},2873{#F2F2F2}{l:E26},House{#F2F2F2}{l:F26},3{#F2F2F2}{l:G26},1{#F2F2F2}{l:H26},1{#F2F2F2}{l:I26},916{#F2F2F2}{l:J26},893{#F2F2F2}{l:K26},1972{#F2F2F2}{l:L26},2025-00-%-d{#F2F2F2}{l:M26},Under Offer{#F2F2F2}{l:N26},Liam Wilson{#F2F2F2}{l:O26},103{#F2F2F2}{l:P26},1068368{#F2F2F2}{l:Q26},1055533{#F2F2F2}{l:R26},1094784{#F2F2F2}{l:S26},{#F2F2F2}{l:T26},{#F2F2F2}{l:U26},410{#F2F2F2}{l:V26},410{#F2F2F2}{l:W26},2{#F2F2F2}{l:X26},1873{#F2F2F2}{l:Y26},0{#F2F2F2}{l:Z26},2006{#F2F2F2}{l:AA26},Great Western High{#F2F2F2}{l:AB26},37{#F2F2F2}{l:AC26},Quiet street{#F2F2F2}{l:AD26}
PID-10017{l:A27},548 King St{l:B27},Bankstown{l:C27},NSW{l:D27},2259{l:E27},Apartment{l:F27},2{l:G27},2{l:H27},0{l:I27},90{l:J27},88{l:K27},2005{l:L27},2024-00-%-d{l:M27},Sold{l:N27},Sarah Johnson{l:O27},132{l:P27},613670{l:Q27},601857{l:R27},630905{l:S27},655285{l:T27},2025-00-%-d{l:U27},1400{l:V27},,11.86{l:X27},1998{l:Y27},3345{l:Z27},2012{l:AA27},Northshore Grammar{l:AB27},37{l:AC27},Near train station{l:AD27}
PID-10018{#F2F2F2}{l:A28},133 Victoria Rd{#F2F2F2}{l:B28},Newcastle{#F2F2F2}{l:C28},NSW{#F2F2F2}{l:D28},2498{#F2F2F2}{l:E28},Apartment{#F2F2F2}{l:F28},2{#F2F2F2}{l:G28},4{#F2F2F2}{l:H28},1{#F2F2F2}{l:I28},161{#F2F2F2}{l:J28},105{#F2F2F2}{l:K28},1960{#F2F2F2}{l:L28},2025-00-%-d{#F2F2F2}{l:M28},Off Market{#F2F2F2}{l:N28},Michael Lee{#F2F2F2}{l:O28},76{#F2F2F2}{l:P28},492719{#F2F2F2}{l:Q28},482874{#F2F2F2}{l:R28},495994{#F2F2F2}{l:S28},{#F2F2F2}{l:T28},{#F2F2F2}{l:U28},860{#F2F2F2}{l:V28},{#F2F2F2}{l:W28},9.08{#F2F2F2}{l:X28},2348{#F2F2F2}{l:Y28},790{#F2F2F2}{l:Z28},2008{#F2F2F2}{l:AA28},Kingsfield College{#F2F2F2}{l:AB28},43{#F2F2F2}{l:AC28},Development site STCA{#F2F2F2}{l:AD28}
PID-10019{l:A29},276 George St{l:B29},Strathfield{l:C29},NSW{l:D29},2509{l:E29},House{l:F29},3{l:G29},2{l:H29},3{l:I29},717{l:J29},687{l:K29},1977{l:L29},2025-00-%-d{l:M29},Under Offer{l:N29},Michael Lee{l:O29},105{l:P29},525062{l:Q29},509225{l:R29},540440{l:S29},,,557{l:V29},557{l:W29},5.52{l:X29},2813{l:Y29},0{l:Z29},2019{l:AA29},Central Primary{l:AB29},51{l:AC29},North-facing{l:AD29}
PID-10020{#F2F2F2}{l:A30},269 Oxford St{#F2F2F2}{l:B30},Wollongong{#F2F2F2}{l:C30},NSW{#F2F2F2}{l:D30},2233{#F2F2F2}{l:E30},House{#F2F2F2}{l:F30},5{#F2F2F2}{l:G30},4{#F2F2F2}{l:H30},0{#F2F2F2}{l:I30},1084{#F2F2F2}{l:J30},1072{#F2F2F2}{l:K30},1984{#F2F2F2}{l:L30},2025-00-%-d{#F2F2F2}{l:M30},Off Market{#F2F2F2}{l:N30},Alex Wong{#F2F2F2}{l:O30},35{#F2F2F2}{l:P30},848017{#F2F2F2}{l:Q30},834933{#F2F2F2}{l:R30},878897{#F2F2F2}{l:S30},{#F2F2F2}{l:T30},{#F2F2F2}{l:U30},1393{#F2F2F2}{l:V30},1393{#F2F2F2}{l:W30},8.54{#F2F2F2}{l:X30},2649{#F2F2F2}{l:Y30},0{#F2F2F2}{l:Z30},2024{#F2F2F2}{l:AA30},Central Primary{#F2F2F2}{l:AB30},62{#F2F2F2}{l:AC30},Development site STCA{#F2F2F2}{l:AD30}
PID-10021{l:A31},221 Bridge St{l:B31},Hurstville{l:C31},NSW{l:D31},2523{l:E31},House{l:F31},3{l:G31},1{l:H31},2{l:I31},375{l:J31},353{l:K31},2002{l:L31},2025-00-%-d{l:M31},Off Market{l:N31},Olivia Martin{l:O31},36{l:P31},1361699{l:Q31},1345169{l:R31},1423618{l:S31},,,1148{l:V31},1148{l:W31},4.38{l:X31},3100{l:Y31},0{l:Z31},2007{l:AA31},Northshore Grammar{l:AB31},67{l:AC31},Development site STCA{l:AD31}
PID-10022{#F2F2F2}{l:A32},475 Church St{#F2F2F2}{l:B32},Parramatta{#F2F2F2}{l:C32},NSW{#F2F2F2}{l:D32},2524{#F2F2F2}{l:E32},Villa{#F2F2F2}{l:F32},6{#F2F2F2}{l:G32},3{#F2F2F2}{l:H32},1{#F2F2F2}{l:I32},871{#F2F2F2}{l:J32},849{#F2F2F2}{l:K32},1999{#F2F2F2}{l:L32},2025-00-%-d{#F2F2F2}{l:M32},Off Market{#F2F2F2}{l:N32},Liam Wilson{#F2F2F2}{l:O32},4{#F2F2F2}{l:P32},1920120{#F2F2F2}{l:Q32},1890982{#F2F2F2}{l:R32},2022097{#F2F2F2}{l:S32},{#F2F2F2}{l:T32},{#F2F2F2}{l:U32},871{#F2F2F2}{l:V32},{#F2F2F2}{l:W32},2.36{#F2F2F2}{l:X32},2927{#F2F2F2}{l:Y32},0{#F2F2F2}{l:Z32},2021{#F2F2F2}{l:AA32},Central Primary{#F2F2F2}{l:AB32},42{#F2F2F2}{l:AC32},{#F2F2F2}{l:AD32}
PID-10023{l:A33},529 Elizabeth St{l:B33},Auburn{l:C33},NSW{l:D33},2862{l:E33},Unit{l:F33},6{l:G33},2{l:H33},3{l:I33},182{l:J33},166{l:K33},1967{l:L33},2025-00-%-d{l:M33},Off Market{l:N33},Alex Wong{l:O33},11{l:P33},2684947{l:Q33},2648390{l:R33},2691948{l:S33},,,605{l:V33},605{l:W33},1.17{l:X33},2301{l:Y33},948{l:Z33},2004{l:AA33},Riverbank Public{l:AB33},74{l:AC33},Development site STCA{l:AD33}
PID-10024{#F2F2F2}{l:A34},803 Railway Pde{#F2F2F2}{l:B34},Burwood{#F2F2F2}{l:C34},NSW{#F2F2F2}{l:D34},2375{#F2F2F2}{l:E34},Villa{#F2F2F2}{l:F34},4{#F2F2F2}{l:G34},4{#F2F2F2}{l:H34},3{#F2F2F2}{l:I34},538{#F2F2F2}{l:J34},514{#F2F2F2}{l:K34},1988{#F2F2F2}{l:L34},2025-00-%-d{#F2F2F2}{l:M34},Sold{#F2F2F2}{l:N34},Liam Wilson{#F2F2F2}{l:O34},84{#F2F2F2}{l:P34},1881904{#F2F2F2}{l:Q34},1854819{#F2F2F2}{l:R34},1978981{#F2F2F2}{l:S34},1838882{#F2F2F2}{l:T34},2025-00-%-d{#F2F2F2}{l:U34},667{#F2F2F2}{l:V34},{#F2F2F2}{l:W34},1.84{#F2F2F2}{l:X34},2229{#F2F2F2}{l:Y34},0{#F2F2F2}{l:Z34},2004{#F2F2F2}{l:AA34},Northshore Grammar{#F2F2F2}{l:AB34},34{#F2F2F2}{l:AC34},{#F2F2F2}{l:AD34}
PID-10025{l:A35},787 Pacific Hwy{l:B35},Newcastle{l:C35},NSW{l:D35},2247{l:E35},Apartment{l:F35},6{l:G35},2{l:H35},0{l:I35},41{l:J35},70{l:K35},1968{l:L35},2025-00-%-d{l:M35},Off Market{l:N35},Grace Taylor{l:O35},118{l:P35},1715562{l:Q35},1672078{l:R35},1787698{l:S35},,,799{l:V35},,2.42{l:X35},1720{l:Y35},3135{l:Z35},2007{l:AA35},Central Primary{l:AB35},41{l:AC35},Quiet street{l:AD35}
PID-10026{#F2F2F2}{l:A36},827 Pacific Hwy{#F2F2F2}{l:B36},Burwood{#F2F2F2}{l:C36},NSW{#F2F2F2}{l:D36},2599{#F2F2F2}{l:E36},Apartment{#F2F2F2}{l:F36},5{#F2F2F2}{l:G36},1{#F2F2F2}{l:H36},3{#F2F2F2}{l:I36},191{#F2F2F2}{l:J36},118{#F2F2F2}{l:K36},1976{#F2F2F2}{l:L36},2025-00-%-d{#F2F2F2}{l:M36},Off Market{#F2F2F2}{l:N36},Grace Taylor{#F2F2F2}{l:O36},142{#F2F2F2}{l:P36},435978{#F2F2F2}{l:Q36},429917{#F2F2F2}{l:R36},445583{#F2F2F2}{l:S36},{#F2F2F2}{l:T36},{#F2F2F2}{l:U36},1290{#F2F2F2}{l:V36},1290{#F2F2F2}{l:W36},15.39{#F2F2F2}{l:X36},2666{#F2F2F2}{l:Y36},1190{#F2F2F2}{l:Z36},{#F2F2F2}{l:AA36},Riverbank Public{#F2F2F2}{l:AB36},52{#F2F2F2}{l:AC36},Quiet street{#F2F2F2}{l:AD36}
PID-10027{l:A37},668 Elizabeth St{l:B37},Parramatta{l:C37},NSW{l:D37},2454{l:E37},Duplex{l:F37},4{l:G37},4{l:H37},1{l:I37},226{l:J37},218{l:K37},2019{l:L37},2025-00-%-d{l:M37},Active{l:N37},Emily Chen{l:O37},150{l:P37},713260{l:Q37},681663{l:R37},721474{l:S37},,,1012{l:V37},,7.38{l:X37},2873{l:Y37},0{l:Z37},2012{l:AA37},Riverbank Public{l:AB37},76{l:AC37},New kitchen{l:AD37}
PID-10028{#F2F2F2}{l:A38},89 Church St{#F2F2F2}{l:B38},Blacktown{#F2F2F2}{l:C38},NSW{#F2F2F2}{l:D38},2361{#F2F2F2}{l:E38},Townhouse{#F2F2F2}{l:F38},6{#F2F2F2}{l:G38},1{#F2F2F2}{l:H38},3{#F2F2F2}{l:I38},1010{#F2F2F2}{l:J38},996{#F2F2F2}{l:K38},2013{#F2F2F2}{l:L38},2025-00-%-d{#F2F2F2}{l:M38},Active{#F2F2F2}{l:N38},Sarah Johnson{#F2F2F2}{l:O38},78{#F2F2F2}{l:P38},1452721{#F2F2F2}{l:Q38},1384269{#F2F2F2}{l:R38},1525688{#F2F2F2}{l:S38},{#F2F2F2}{l:T38},{#F2F2F2}{l:U38},1286{#F2F2F2}{l:V38},1286{#F2F2F2}{l:W38},4.6{#F2F2F2}{l:X38},1999{#F2F2F2}{l:Y38},3470{#F2F2F2}{l:Z38},2004{#F2F2F2}{l:AA38},Great Western High{#F2F2F2}{l:AB38},88{#F2F2F2}{l:AC38},{#F2F2F2}{l:AD38}
PID-10029{l:A39},455 Oxford St{l:B39},Epping{l:C39},NSW{l:D39},2542{l:E39},House{l:F39},5{l:G39},1{l:H39},2{l:I39},170{l:J39},164{l:K39},2024{l:L39},2025-00-%-d{l:M39},Under Offer{l:N39},Olivia Martin{l:O39},108{l:P39},766497{l:Q39},760569{l:R39},826969{l:S39},,,684{l:V39},684{l:W39},4.64{l:X39},2875{l:Y39},0{l:Z39},2001{l:AA39},Kingsfield College{l:AB39},43{l:AC39},
PID-10030{#F2F2F2}{l:A40},133 Pitt St{#F2F2F2}{l:B40},Blacktown{#F2F2F2}{l:C40},NSW{#F2F2F2}{l:D40},2861{#F2F2F2}{l:E40},House{#F2F2F2}{l:F40},5{#F2F2F2}{l:G40},2{#F2F2F2}{l:H40},3{#F2F2F2}{l:I40},725{#F2F2F2}{l:J40},720{#F2F2F2}{l:K40},1976{#F2F2F2}{l:L40},2025-00-%-d{#F2F2F2}{l:M40},Off Market{#F2F2F2}{l:N40},Sarah Johnson{#F2F2F2}{l:O40},50{#F2F2F2}{l:P40},2199737{#F2F2F2}{l:Q40},2102592{#F2F2F2}{l:R40},2363632{#F2F2F2}{l:S40},{#F2F2F2}{l:T40},{#F2F2F2}{l:U40},783{#F2F2F2}{l:V40},{#F2F2F2}{l:W40},1.85{#F2F2F2}{l:X40},1276{#F2F2F2}{l:Y40},0{#F2F2F2}{l:Z40},2021{#F2F2F2}{l:AA40},Central Primary{#F2F2F2}{l:AB40},62{#F2F2F2}{l:AC40},{#F2F2F2}{l:AD40}
PID-10031{l:A41},712 Church St{l:B41},Strathfield{l:C41},NSW{l:D41},2811{l:E41},Duplex{l:F41},1{l:G41},2{l:H41},3{l:I41},205{l:J41},176{l:K41},1969{l:L41},2025-00-%-d{l:M41},Off Market{l:N41},Michael Lee{l:O41},13{l:P41},1285848{l:Q41},1262739{l:R41},1376581{l:S41},,,621{l:V41},,2.51{l:X41},1274{l:Y41},0{l:Z41},2021{l:AA41},Kingsfield College{l:AB41},82{l:AC41},Near train station{l:AD41}
PID-10032{#F2F2F2}{l:A42},754 Church St{#F2F2F2}{l:B42},Chatswood{#F2F2F2}{l:C42},NSW{#F2F2F2}{l:D42},2018{#F2F2F2}{l:E42},Townhouse{#F2F2F2}{l:F42},3{#F2F2F2}{l:G42},1{#F2F2F2}{l:H42},3{#F2F2F2}{l:I42},704{#F2F2F2}{l:J42},682{#F2F2F2}{l:K42},1998{#F2F2F2}{l:L42},2025-00-%-d{#F2F2F2}{l:M42},Sold{#F2F2F2}{l:N42},Emily Chen{#F2F2F2}{l:O42},157{#F2F2F2}{l:P42},2275268{#F2F2F2}{l:Q42},2238359{#F2F2F2}{l:R42},2444060{#F2F2F2}{l:S42},2134521{#F2F2F2}{l:T42},2025-00-%-d{#F2F2F2}{l:U42},375{#F2F2F2}{l:V42},{#F2F2F2}{l:W42},0.86{#F2F2F2}{l:X42},2411{#F2F2F2}{l:Y42},2538{#F2F2F2}{l:Z42},2005{#F2F2F2}{l:AA42},Great Western High{#F2F2F2}{l:AB42},47{#F2F2F2}{l:AC42},{#F2F2F2}{l:AD42}
PID-10033{l:A43},632 Victoria Rd{l:B43},Wollongong{l:C43},NSW{l:D43},2367{l:E43},Duplex{l:F43},4{l:G43},4{l:H43},0{l:I43},1125{l:J43},1105{l:K43},2018{l:L43},2025-00-%-d{l:M43},Off Market{l:N43},Sarah Johnson{l:O43},59{l:P43},667349{l:Q43},655363{l:R43},691098{l:S43},,,1235{l:V43},,9.62{l:X43},1700{l:Y43},0{l:Z43},,Riverbank Public{l:AB43},37{l:AC43},Dual living potential{l:AD43}
PID-10034{#F2F2F2}{l:A44},339 Queen St{#F2F2F2}{l:B44},Chatswood{#F2F2F2}{l:C44},NSW{#F2F2F2}{l:D44},2836{#F2F2F2}{l:E44},Duplex{#F2F2F2}{l:F44},4{#F2F2F2}{l:G44},2{#F2F2F2}{l:H44},1{#F2F2F2}{l:I44},249{#F2F2F2}{l:J44},235{#F2F2F2}{l:K44},2015{#F2F2F2}{l:L44},2025-00-%-d{#F2F2F2}{l:M44},Active{#F2F2F2}{l:N44},Grace Taylor{#F2F2F2}{l:O44},158{#F2F2F2}{l:P44},2227190{#F2F2F2}{l:Q44},2117417{#F2F2F2}{l:R44},2268732{#F2F2F2}{l:S44},{#F2F2F2}{l:T44},{#F2F2F2}{l:U44},1038{#F2F2F2}{l:V44},1038{#F2F2F2}{l:W44},2.42{#F2F2F2}{l:X44},2676{#F2F2F2}{l:Y44},0{#F2F2F2}{l:Z44},2007{#F2F2F2}{l:AA44},Riverbank Public{#F2F2F2}{l:AB44},64{#F2F2F2}{l:AC44},Needs TLC{#F2F2F2}{l:AD44}
PID-10035{l:A45},806 Church St{l:B45},Newcastle{l:C45},NSW{l:D45},2439{l:E45},Villa{l:F45},6{l:G45},2{l:H45},2{l:I45},985{l:J45},959{l:K45},1995{l:L45},2024-00-%-d{l:M45},Under Offer{l:N45},Michael Lee{l:O45},228{l:P45},1110266{l:Q45},1065933{l:R45},1165564{l:S45},,,615{l:V45},615{l:W45},2.88{l:X45},2875{l:Y45},0{l:Z45},2017{l:AA45},Kingsfield College{l:AB45},89{l:AC45},
PID-10036{#F2F2F2}{l:A46},27 Queen St{#F2F2F2}{l:B46},Chatswood{#F2F2F2}{l:C46},NSW{#F2F2F2}{l:D46},2137{#F2F2F2}{l:E46},Villa{#F2F2F2}{l:F46},2{#F2F2F2}{l:G46},4{#F2F2F2}{l:H46},3{#F2F2F2}{l:I46},252{#F2F2F2}{l:J46},228{#F2F2F2}{l:K46},2011{#F2F2F2}{l:L46},2025-00-%-d{#F2F2F2}{l:M46},Off Market{#F2F2F2}{l:N46},Emily Chen{#F2F2F2}{l:O46},12{#F2F2F2}{l:P46},705859{#F2F2F2}{l:Q46},678060{#F2F2F2}{l:R46},743586{#F2F2F2}{l:S46},{#F2F2F2}{l:T46},{#F2F2F2}{l:U46},542{#F2F2F2}{l:V46},{#F2F2F2}{l:W46},3.99{#F2F2F2}{l:X46},3019{#F2F2F2}{l:Y46},0{#F2F2F2}{l:Z46},2014{#F2F2F2}{l:AA46},Northshore Grammar{#F2F2F2}{l:AB46},61{#F2F2F2}{l:AC46},Development site STCA{#F2F2F2}{l:AD46}
PID-10037{l:A47},166 George St{l:B47},Strathfield{l:C47},NSW{l:D47},2112{l:E47},House{l:F47},3{l:G47},3{l:H47},1{l:I47},868{l:J47},861{l:K47},1998{l:L47},2025-00-%-d{l:M47},Active{l:N47},Emily Chen{l:O47},203{l:P47},1272357{l:Q47},1268553{l:R47},1296761{l:S47},,,643{l:V47},643{l:W47},2.63{l:X47},2192{l:Y47},0{l:Z47},2016{l:AA47},Central Primary{l:AB47},72{l:AC47},Needs TLC{l:AD47}
PID-10038{#F2F2F2}{l:A48},232 Queen St{#F2F2F2}{l:B48},Auburn{#F2F2F2}{l:C48},NSW{#F2F2F2}{l:D48},2079{#F2F2F2}{l:E48},Villa{#F2F2F2}{l:F48},4{#F2F2F2}{l:G48},3{#F2F2F2}{l:H48},0{#F2F2F2}{l:I48},1030{#F2F2F2}{l:J48},1021{#F2F2F2}{l:K48},2021{#F2F2F2}{l:L48},2025-00-%-d{#F2F2F2}{l:M48},Sold{#F2F2F2}{l:N48},Liam Wilson{#F2F2F2}{l:O48},95{#F2F2F2}{l:P48},632913{#F2F2F2}{l:Q48},622230{#F2F2F2}{l:R48},683171{#F2F2F2}{l:S48},689970{#F2F2F2}{l:T48},2025-00-%-d{#F2F2F2}{l:U48},953{#F2F2F2}{l:V48},{#F2F2F2}{l:W48},7.83{#F2F2F2}{l:X48},2744{#F2F2F2}{l:Y48},0{#F2F2F2}{l:Z48},2022{#F2F2F2}{l:AA48},Northshore Grammar{#F2F2F2}{l:AB48},74{#F2F2F2}{l:AC48},North-facing{#F2F2F2}{l:AD48}
PID-10039{l:A49},263 Harris St{l:B49},Epping{l:C49},NSW{l:D49},2413{l:E49},Villa{l:F49},3{l:G49},1{l:H49},3{l:I49},1074{l:J49},1065{l:K49},2001{l:L49},2025-00-%-d{l:M49},Active{l:N49},Grace Taylor{l:O49},99{l:P49},2131019{l:Q49},2127478{l:R49},2218518{l:S49},,,1439{l:V49},,3.51{l:X49},1279{l:Y49},0{l:Z49},2010{l:AA49},Central Primary{l:AB49},60{l:AC49},
PID-10040{#F2F2F2}{l:A50},239 George St{#F2F2F2}{l:B50},Burwood{#F2F2F2}{l:C50},NSW{#F2F2F2}{l:D50},2167{#F2F2F2}{l:E50},Duplex{#F2F2F2}{l:F50},5{#F2F2F2}{l:G50},2{#F2F2F2}{l:H50},3{#F2F2F2}{l:I50},642{#F2F2F2}{l:J50},613{#F2F2F2}{l:K50},1990{#F2F2F2}{l:L50},2025-00-%-d{#F2F2F2}{l:M50},Active{#F2F2F2}{l:N50},Michael Lee{#F2F2F2}{l:O50},20{#F2F2F2}{l:P50},1139396{#F2F2F2}{l:Q50},1120781{#F2F2F2}{l:R50},1157798{#F2F2F2}{l:S50},{#F2F2F2}{l:T50},{#F2F2F2}{l:U50},649{#F2F2F2}{l:V50},649{#F2F2F2}{l:W50},2.96{#F2F2F2}{l:X50},3090{#F2F2F2}{l:Y50},0{#F2F2F2}{l:Z50},{#F2F2F2}{l:AA50},Kingsfield College{#F2F2F2}{l:AB50},78{#F2F2F2}{l:AC50},City views{#F2F2F2}{l:AD50}
PID-10041{l:A51},975 Railway Pde{l:B51},Ryde{l:C51},NSW{l:D51},2645{l:E51},Unit{l:F51},1{l:G51},4{l:H51},3{l:I51},60{l:J51},39{l:K51},1983{l:L51},2025-00-%-d{l:M51},Active{l:N51},Michael Lee{l:O51},86{l:P51},671617{l:Q51},656732{l:R51},681949{l:S51},,,620{l:V51},620{l:W51},4.8{l:X51},2935{l:Y51},2106{l:Z51},2016{l:AA51},Northshore Grammar{l:AB51},71{l:AC51},Needs TLC{l:AD51}
PID-10042{#F2F2F2}{l:A52},784 King St{#F2F2F2}{l:B52},Hurstville{#F2F2F2}{l:C52},NSW{#F2F2F2}{l:D52},2913{#F2F2F2}{l:E52},House{#F2F2F2}{l:F52},4{#F2F2F2}{l:G52},1{#F2F2F2}{l:H52},3{#F2F2F2}{l:I52},593{#F2F2F2}{l:J52},570{#F2F2F2}{l:K52},2023{#F2F2F2}{l:L52},2025-00-%-d{#F2F2F2}{l:M52},Sold{#F2F2F2}{l:N52},Emily Chen{#F2F2F2}{l:O52},26{#F2F2F2}{l:P52},808969{#F2F2F2}{l:Q52},774578{#F2F2F2}{l:R52},815206{#F2F2F2}{l:S52},775017{#F2F2F2}{l:T52},2025-00-%-d{#F2F2F2}{l:U52},1443{#F2F2F2}{l:V52},{#F2F2F2}{l:W52},9.28{#F2F2F2}{l:X52},2304{#F2F2F2}{l:Y52},0{#F2F2F2}{l:Z52},2020{#F2F2F2}{l:AA52},Great Western High{#F2F2F2}{l:AB52},71{#F2F2F2}{l:AC52},North-facing{#F2F2F2}{l:AD52}
PID-10043{l:A53},207 Pitt St{l:B53},Wollongong{l:C53},NSW{l:D53},2790{l:E53},Townhouse{l:F53},6{l:G53},4{l:H53},0{l:I53},719{l:J53},700{l:K53},1986{l:L53},2025-00-%-d{l:M53},Off Market{l:N53},Sarah Johnson{l:O53},79{l:P53},1593220{l:Q53},1542809{l:R53},1612502{l:S53},,,785{l:V53},785{l:W53},2.56{l:X53},1362{l:Y53},3150{l:Z53},2004{l:AA53},Riverbank Public{l:AB53},76{l:AC53},Development site STCA{l:AD53}
PID-10044{#F2F2F2}{l:A54},142 George St{#F2F2F2}{l:B54},Wollongong{#F2F2F2}{l:C54},NSW{#F2F2F2}{l:D54},2280{#F2F2F2}{l:E54},House{#F2F2F2}{l:F54},4{#F2F2F2}{l:G54},1{#F2F2F2}{l:H54},2{#F2F2F2}{l:I54},814{#F2F2F2}{l:J54},796{#F2F2F2}{l:K54},1974{#F2F2F2}{l:L54},2025-00-%-d{#F2F2F2}{l:M54},Under Offer{#F2F2F2}{l:N54},Olivia Martin{#F2F2F2}{l:O54},201{#F2F2F2}{l:P54},1149114{#F2F2F2}{l:Q54},1140108{#F2F2F2}{l:R54},1191088{#F2F2F2}{l:S54},{#F2F2F2}{l:T54},{#F2F2F2}{l:U54},780{#F2F2F2}{l:V54},{#F2F2F2}{l:W54},3.53{#F2F2F2}{l:X54},2190{#F2F2F2}{l:Y54},0{#F2F2F2}{l:Z54},2006{#F2F2F2}{l:AA54},Riverbank Public{#F2F2F2}{l:AB54},75{#F2F2F2}{l:AC54},Near train station{#F2F2F2}{l:AD54}
PID-10045{l:A55},565 Oxford St{l:B55},Auburn{l:C55},NSW{l:D55},2119{l:E55},Duplex{l:F55},1{l:G55},1{l:H55},0{l:I55},379{l:J55},351{l:K55},1984{l:L55},2025-00-%-d{l:M55},Off Market{l:N55},Olivia Martin{l:O55},166{l:P55},2243511{l:Q55},2187065{l:R55},2376588{l:S55},,,866{l:V55},866{l:W55},2.01{l:X55},1739{l:Y55},0{l:Z55},2016{l:AA55},Riverbank Public{l:AB55},67{l:AC55},North-facing{l:AD55}
PID-10046{#F2F2F2}{l:A56},679 Bridge St{#F2F2F2}{l:B56},Chatswood{#F2F2F2}{l:C56},NSW{#F2F2F2}{l:D56},2387{#F2F2F2}{l:E56},Duplex{#F2F2F2}{l:F56},4{#F2F2F2}{l:G56},2{#F2F2F2}{l:H56},1{#F2F2F2}{l:I56},269{#F2F2F2}{l:J56},252{#F2F2F2}{l:K56},1985{#F2F2F2}{l:L56},2025-00-%-d{#F2F2F2}{l:M56},Active{#F2F2F2}{l:N56},Alex Wong{#F2F2F2}{l:O56},215{#F2F2F2}{l:P56},1370292{#F2F2F2}{l:Q56},1330689{#F2F2F2}{l:R56},1415409{#F2F2F2}{l:S56},{#F2F2F2}{l:T56},{#F2F2F2}{l:U56},451{#F2F2F2}{l:V56},{#F2F2F2}{l:W56},1.71{#F2F2F2}{l:X56},2387{#F2F2F2}{l:Y56},0{#F2F2F2}{l:Z56},2014{#F2F2F2}{l:AA56},Riverbank Public{#F2F2F2}{l:AB56},38{#F2F2F2}{l:AC56},Needs TLC{#F2F2F2}{l:AD56}
PID-10047{l:A57},798 George St{l:B57},Newcastle{l:C57},NSW{l:D57},2660{l:E57},House{l:F57},2{l:G57},4{l:H57},2{l:I57},704{l:J57},685{l:K57},2006{l:L57},2025-00-%-d{l:M57},Sold{l:N57},Emily Chen{l:O57},121{l:P57},692389{l:Q57},662121{l:R57},727549{l:S57},753612{l:T57},2025-00-%-d{l:U57},1413{l:V57},,10.61{l:X57},2987{l:Y57},0{l:Z57},2018{l:AA57},Riverbank Public{l:AB57},63{l:AC57},
PID-10048{#F2F2F2}{l:A58},512 Elizabeth St{#F2F2F2}{l:B58},Ryde{#F2F2F2}{l:C58},NSW{#F2F2F2}{l:D58},2910{#F2F2F2}{l:E58},House{#F2F2F2}{l:F58},5{#F2F2F2}{l:G58},2{#F2F2F2}{l:H58},1{#F2F2F2}{l:I58},333{#F2F2F2}{l:J58},328{#F2F2F2}{l:K58},2007{#F2F2F2}{l:L58},2025-00-%-d{#F2F2F2}{l:M58},Sold{#F2F2F2}{l:N58},Emily Chen{#F2F2F2}{l:O58},134{#F2F2F2}{l:P58},1861711{#F2F2F2}{l:Q58},1830481{#F2F2F2}{l:R58},1974406{#F2F2F2}{l:S58},1959461{#F2F2F2}{l:T58},2024-00-%-d{#F2F2F2}{l:U58},1097{#F2F2F2}{l:V58},{#F2F2F2}{l:W58},3.06{#F2F2F2}{l:X58},3094{#F2F2F2}{l:Y58},0{#F2F2F2}{l:Z58},2022{#F2F2F2}{l:AA58},Northshore Grammar{#F2F2F2}{l:AB58},86{#F2F2F2}{l:AC58},Near train station{#F2F2F2}{l:AD58}
PID-10049{l:A59},951 Victoria Rd{l:B59},Bankstown{l:C59},NSW{l:D59},2296{l:E59},Villa{l:F59},4{l:G59},1{l:H59},3{l:I59},466{l:J59},449{l:K59},1968{l:L59},2024-00-%-d{l:M59},Off Market{l:N59},Sarah Johnson{l:O59},92{l:P59},681080{l:Q59},666492{l:R59},732243{l:S59},,,1112{l:V59},1112{l:W59},8.49{l:X59},2079{l:Y59},0{l:Z59},2007{l:AA59},Central Primary{l:AB59},38{l:AC59},Near train station{l:AD59}
PID-10050{#F2F2F2}{l:A60},92 Queen St{#F2F2F2}{l:B60},Blacktown{#F2F2F2}{l:C60},NSW{#F2F2F2}{l:D60},2463{#F2F2F2}{l:E60},Apartment{#F2F2F2}{l:F60},6{#F2F2F2}{l:G60},1{#F2F2F2}{l:H60},2{#F2F2F2}{l:I60},48{#F2F2F2}{l:J60},93{#F2F2F2}{l:K60},2009{#F2F2F2}{l:L60},2025-00-%-d{#F2F2F2}{l:M60},Under Offer{#F2F2F2}{l:N60},Sarah Johnson{#F2F2F2}{l:O60},221{#F2F2F2}{l:P60},1893570{#F2F2F2}{l:Q60},1855669{#F2F2F2}{l:R60},2003239{#F2F2F2}{l:S60},{#F2F2F2}{l:T60},{#F2F2F2}{l:U60},849{#F2F2F2}{l:V60},849{#F2F2F2}{l:W60},2.33{#F2F2F2}{l:X60},3133{#F2F2F2}{l:Y60},1456{#F2F2F2}{l:Z60},2004{#F2F2F2}{l:AA60},Northshore Grammar{#F2F2F2}{l:AB60},71{#F2F2F2}{l:AC60},{#F2F2F2}{l:AD60}
PID-10051{l:A61},435 Victoria Rd{l:B61},Blacktown{l:C61},NSW{l:D61},2157{l:E61},Villa{l:F61},5{l:G61},1{l:H61},2{l:I61},308{l:J61},294{l:K61},1975{l:L61},2025-00-%-d{l:M61},Active{l:N61},David Brown{l:O61},136{l:P61},1890965{l:Q61},1798329{l:R61},1999306{l:S61},,,1331{l:V61},,3.66{l:X61},2341{l:Y61},0{l:Z61},,Riverbank Public{l:AB61},49{l:AC61},Near train station{l:AD61}
PID-10052{#F2F2F2}{l:A62},706 George St{#F2F2F2}{l:B62},Auburn{#F2F2F2}{l:C62},NSW{#F2F2F2}{l:D62},2092{#F2F2F2}{l:E62},Villa{#F2F2F2}{l:F62},6{#F2F2F2}{l:G62},1{#F2F2F2}{l:H62},3{#F2F2F2}{l:I62},733{#F2F2F2}{l:J62},725{#F2F2F2}{l:K62},1961{#F2F2F2}{l:L62},2025-00-%-d{#F2F2F2}{l:M62},Under Offer{#F2F2F2}{l:N62},Liam Wilson{#F2F2F2}{l:O62},171{#F2F2F2}{l:P62},1696097{#F2F2F2}{l:Q62},1691316{#F2F2F2}{l:R62},1753992{#F2F2F2}{l:S62},{#F2F2F2}{l:T62},{#F2F2F2}{l:U62},440{#F2F2F2}{l:V62},{#F2F2F2}{l:W62},1.35{#F2F2F2}{l:X62},2406{#F2F2F2}{l:Y62},0{#F2F2F2}{l:Z62},2007{#F2F2F2}{l:AA62},Kingsfield College{#F2F2F2}{l:AB62},48{#F2F2F2}{l:AC62},Needs TLC{#F2F2F2}{l:AD62}
PID-10053{l:A63},859 Church St{l:B63},Epping{l:C63},NSW{l:D63},2936{l:E63},House{l:F63},4{l:G63},3{l:H63},1{l:I63},927{l:J63},907{l:K63},2011{l:L63},2025-00-%-d{l:M63},Off Market{l:N63},David Brown{l:O63},26{l:P63},1240416{l:Q63},1190945{l:R63},1242589{l:S63},,,1465{l:V63},1465{l:W63},6.14{l:X63},2355{l:Y63},0{l:Z63},2008{l:AA63},Central Primary{l:AB63},67{l:AC63},Needs TLC{l:AD63}
PID-10054{#F2F2F2}{l:A64},655 George St{#F2F2F2}{l:B64},Blacktown{#F2F2F2}{l:C64},NSW{#F2F2F2}{l:D64},2584{#F2F2F2}{l:E64},Villa{#F2F2F2}{l:F64},2{#F2F2F2}{l:G64},3{#F2F2F2}{l:H64},3{#F2F2F2}{l:I64},419{#F2F2F2}{l:J64},398{#F2F2F2}{l:K64},1975{#F2F2F2}{l:L64},2025-00-%-d{#F2F2F2}{l:M64},Sold{#F2F2F2}{l:N64},Grace Taylor{#F2F2F2}{l:O64},77{#F2F2F2}{l:P64},2411674{#F2F2F2}{l:Q64},2375461{#F2F2F2}{l:R64},2429713{#F2F2F2}{l:S64},2177318{#F2F2F2}{l:T64},2025-00-%-d{#F2F2F2}{l:U64},1310{#F2F2F2}{l:V64},{#F2F2F2}{l:W64},2.82{#F2F2F2}{l:X64},1661{#F2F2F2}{l:Y64},0{#F2F2F2}{l:Z64},2021{#F2F2F2}{l:AA64},Central Primary{#F2F2F2}{l:AB64},95{#F2F2F2}{l:AC64},Dual living potential{#F2F2F2}{l:AD64}
PID-10055{l:A65},710 Victoria Rd{l:B65},Bankstown{l:C65},NSW{l:D65},2977{l:E65},Townhouse{l:F65},5{l:G65},4{l:H65},1{l:I65},149{l:J65},144{l:K65},2014{l:L65},2025-00-%-d{l:M65},Under Offer{l:N65},Grace Taylor{l:O65},82{l:P65},958364{l:Q65},955377{l:R65},1032129{l:S65},,,876{l:V65},876{l:W65},4.75{l:X65},2869{l:Y65},2883{l:Z65},2019{l:AA65},Riverbank Public{l:AB65},60{l:AC65},Near train station{l:AD65}
PID-10056{#F2F2F2}{l:A66},373 Elizabeth St{#F2F2F2}{l:B66},Epping{#F2F2F2}{l:C66},NSW{#F2F2F2}{l:D66},2756{#F2F2F2}{l:E66},Duplex{#F2F2F2}{l:F66},1{#F2F2F2}{l:G66},3{#F2F2F2}{l:H66},2{#F2F2F2}{l:I66},542{#F2F2F2}{l:J66},518{#F2F2F2}{l:K66},1979{#F2F2F2}{l:L66},2025-00-%-d{#F2F2F2}{l:M66},Off Market{#F2F2F2}{l:N66},Michael Lee{#F2F2F2}{l:O66},80{#F2F2F2}{l:P66},1046223{#F2F2F2}{l:Q66},998483{#F2F2F2}{l:R66},1114457{#F2F2F2}{l:S66},{#F2F2F2}{l:T66},{#F2F2F2}{l:U66},1398{#F2F2F2}{l:V66},1398{#F2F2F2}{l:W66},6.95{#F2F2F2}{l:X66},2259{#F2F2F2}{l:Y66},0{#F2F2F2}{l:Z66},2004{#F2F2F2}{l:AA66},Kingsfield College{#F2F2F2}{l:AB66},49{#F2F2F2}{l:AC66},Near train station{#F2F2F2}{l:AD66}
PID-10057{l:A67},919 Queen St{l:B67},Bankstown{l:C67},NSW{l:D67},2193{l:E67},Unit{l:F67},6{l:G67},2{l:H67},0{l:I67},158{l:J67},130{l:K67},2004{l:L67},2025-00-%-d{l:M67},Sold{l:N67},Grace Taylor{l:O67},108{l:P67},2178722{l:Q67},2113596{l:R67},2313732{l:S67},2225469{l:T67},2025-00-%-d{l:U67},1380{l:V67},,3.29{l:X67},2829{l:Y67},2573{l:Z67},2020{l:AA67},Northshore Grammar{l:AB67},59{l:AC67},
PID-10058{#F2F2F2}{l:A68},514 Queen St{#F2F2F2}{l:B68},Auburn{#F2F2F2}{l:C68},NSW{#F2F2F2}{l:D68},2103{#F2F2F2}{l:E68},Unit{#F2F2F2}{l:F68},4{#F2F2F2}{l:G68},3{#F2F2F2}{l:H68},1{#F2F2F2}{l:I68},109{#F2F2F2}{l:J68},93{#F2F2F2}{l:K68},1984{#F2F2F2}{l:L68},2025-00-%-d{#F2F2F2}{l:M68},Off Market{#F2F2F2}{l:N68},Liam Wilson{#F2F2F2}{l:O68},132{#F2F2F2}{l:P68},2475486{#F2F2F2}{l:Q68},2361182{#F2F2F2}{l:R68},2632574{#F2F2F2}{l:S68},{#F2F2F2}{l:T68},{#F2F2F2}{l:U68},546{#F2F2F2}{l:V68},{#F2F2F2}{l:W68},1.15{#F2F2F2}{l:X68},2332{#F2F2F2}{l:Y68},1772{#F2F2F2}{l:Z68},2004{#F2F2F2}{l:AA68},Kingsfield College{#F2F2F2}{l:AB68},30{#F2F2F2}{l:AC68},Development site STCA{#F2F2F2}{l:AD68}
PID-10059{l:A69},273 Railway Pde{l:B69},Wollongong{l:C69},NSW{l:D69},2993{l:E69},Duplex{l:F69},2{l:G69},3{l:H69},2{l:I69},584{l:J69},574{l:K69},2001{l:L69},2025-00-%-d{l:M69},Under Offer{l:N69},Emily Chen{l:O69},58{l:P69},1029687{l:Q69},979904{l:R69},1079653{l:S69},,,1040{l:V69},,5.25{l:X69},2733{l:Y69},0{l:Z69},,Riverbank Public{l:AB69},84{l:AC69},Needs TLC{l:AD69}
Summary & Notes{#E2EFDA}{MG:595420}{l:A71},{MG:595420}{l:B71},{MG:595420}{l:C71},{MG:595420}{l:D71},{MG:595420}{l:E71},{MG:595420}{l:F71},{MG:595420}{l:G71},{MG:595420}{l:H71},{MG:595420}{l:I71},{MG:595420}{l:J71},{MG:595420}{l:K71},{MG:595420}{l:L71},{MG:595420}{l:M71},{MG:595420}{l:N71},{MG:595420}{l:O71},{MG:595420}{l:P71},{MG:595420}{l:Q71},{MG:595420}{l:R71},{MG:595420}{l:S71},{MG:595420}{l:T71},{MG:595420}{l:U71},{MG:595420}{l:V71},{MG:595420}{l:W71},{MG:595420}{l:X71},{MG:595420}{l:Y71},{MG:595420}{l:Z71},{MG:595420}{l:AA71},{MG:595420}{l:AB71},{MG:595420}{l:AC71},{MG:595420}{l:AD71}
"Notes:
• This is synthetic data for demo/testing.
• Values are randomly generated.
• Review formatting, merges, and colors as required.{MG:516022}{l:A72}",{MG:516022}{l:B72},{MG:516022}{l:C72},{MG:516022}{l:D72},{MG:516022}{l:E72},{MG:516022}{l:F72},{MG:516022}{l:G72},{MG:516022}{l:H72},{MG:516022}{l:I72},{MG:516022}{l:J72},,Portfolio Totals{#DEEAF6}{MG:480763}{l:L72},{MG:480763}{l:M72},{MG:480763}{l:N72},{MG:480763}{l:O72},,,,,,,,,,,,,,,
{MG:516022}{l:A73},{MG:516022}{l:B73},{MG:516022}{l:C73},{MG:516022}{l:D73},{MG:516022}{l:E73},{MG:516022}{l:F73},{MG:516022}{l:G73},{MG:516022}{l:H73},{MG:516022}{l:I73},{MG:516022}{l:J73},,Count{#EDEDED}{MG:520067}{l:L73},{MG:520067}{l:M73},60{MG:309242}{l:N73},{MG:309242}{l:O73},,,,,,,,,,,,,,,
{MG:516022}{l:A74},{MG:516022}{l:B74},{MG:516022}{l:C74},{MG:516022}{l:D74},{MG:516022}{l:E74},{MG:516022}{l:F74},{MG:516022}{l:G74},{MG:516022}{l:H74},{MG:516022}{l:I74},{MG:516022}{l:J74},,Avg List Price{#EDEDED}{MG:764921}{l:L74},{MG:764921}{l:M74},1411278{MG:157122}{l:N74},{MG:157122}{l:O74},,,,,,,,,,,,,,,
{MG:516022}{l:A75},{MG:516022}{l:B75},{MG:516022}{l:C75},{MG:516022}{l:D75},{MG:516022}{l:E75},{MG:516022}{l:F75},{MG:516022}{l:G75},{MG:516022}{l:H75},{MG:516022}{l:I75},{MG:516022}{l:J75},,Median Rent (wk){#EDEDED}{MG:917052}{l:L75},{MG:917052}{l:M75},873{MG:896925}{l:N75},{MG:896925}{l:O75},,,,,,,,,,,,,,,
,,,,,,,,,,,Avg Yield{#EDEDED}{MG:783625}{l:L76},{MG:783625}{l:M76},4.48{MG:450658}{l:N76},{MG:450658}{l:O76},,,,,,,,,,,,,,,`;

function App() {
  const [csvInput, setCsvInput] = useState(flaggedCsvData);
  const [showLocations, setShowLocations] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');
  const [highlightCells, setHighlightCells] = useState<string[]>(parseHighlightInput(''));
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleHighlightChange = (value: string) => {
    setHighlightInput(value);
    const cells = parseHighlightInput(value);
    setHighlightCells(cells);
  };

  const handleFileUpload = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCsvInput(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a CSV file');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          FlaggedCsvComponent Demo
        </h1>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Rendered Table</h2>
            <div>
                <label className="block text-sm font-medium mb-1">
                  Highlight cells (supports ranges, e.g., A1-D1, F2):
                </label>
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => handleHighlightChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Enter cells or ranges (A1-D1, F2, B3-B5)..."
                />
                {highlightCells.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    Highlighting: {highlightCells.join(', ')}
                  </p>
                )}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <FlaggedCsvComponent 
                csvData={csvInput} 
                className="w-full"
                showCellLocations={showLocations}
                highlightCells={highlightCells}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Input CSV (with flags)</h2>
              <div className="flex items-center gap-4">
                {/* File Upload Button */}
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </label>
                
                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg px-4 py-2 text-sm transition-colors ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-300 bg-gray-50 text-gray-600'
                  }`}
                >
                  {isDragOver ? 'Drop CSV file here' : 'Or drag & drop CSV file'}
                </div>
              </div>
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-white"
              placeholder="Paste your flagged CSV data here..."
            />
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLocations}
                  onChange={(e) => setShowLocations(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Show cell locations</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Supported Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">CSV Flags:</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-white px-2 py-1 rounded">{'{#RRGGBB}'}</code> - Background color
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">{'{MG:XXXXXX}'}</code> - Merge cells with same ID
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">{'{l:CellRef}'}</code> - Original Excel cell location
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Highlight Ranges:</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="bg-white px-2 py-1 rounded">A1-D1</code> - Row range (same row)
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">A1-A10</code> - Column range (same column)
                </li>
                <li>
                  <code className="bg-white px-2 py-1 rounded">A1-D1, F2</code> - Mixed ranges and cells
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
