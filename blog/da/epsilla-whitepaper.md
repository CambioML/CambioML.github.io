---
title: 'Fordobling nøjagtigheden i videnretrieval fra diagrammer og tabeller'
date: '2024-12-28'
keywords: 'AnyParser,Epsilla,videnretrieval,dokument parsing,RAG,finansielle dokumenter, tabeludtræk, diagramudtræk, vision sprogmodeller,nøjagtighed'
image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png'
---

![AnyParser og Epsilla evalueringsmetrikker fra Ragas](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Evalueringsmetrikker fra Ragas_

I dagens datadrevne landskab er industrier som finansielle tjenester stærkt afhængige af præcis og effektiv informationsekstraktion fra dokumenter, især dem der indeholder både ustruktureret tekst og strukturerede data som tabeller og diagrammer. Traditionelle Optical Character Recognition (OCR) modeller, på trods af deres udbredte anvendelse, klarer ofte ikke at håndtere komplekse dokumentformater, hvilket fører til suboptimal ydeevne i avancerede AI-applikationer. For at imødekomme dette hul har CambioML og Epsilla introduceret et banebrydende videnretrieval-system, der lover at forbedre nøjagtigheden og recall i dataudtrækningsopgaver betydeligt.

## Introduktion: Overvindelse af OCR-begrænsninger

OCR-baserede modeller, mens de er effektive til at opdage tekst, har svært ved at udtrække layoutinformation og præcist trække data fra tabeller og diagrammer. Disse begrænsninger bliver særligt tydelige i industrier, hvor præcision er altafgørende, såsom finans og sundhedspleje. For at tackle disse udfordringer har CambioML og Epsilla udviklet en ny tilgang, der integrerer state-of-the-art tabeludtræksmodeller med Retrieval-Augmented Generation (RAG) teknikker. Dette nye system opnår op til 2x præcision og 2,5x recall sammenlignet med konventionelle RAG-systemer, hvilket sætter en ny standard for dokumentspørgsmålssvar.

## AnyParser: Revolutionering af tabeludtræk

I hjertet af denne gennembrud er AnyParser, en model drevet af avancerede vision sprogmodeller (VLM'er), der excellerer i at udtrække information fra forskellige datakilder. I modsætning til traditionelle modeller, der i høj grad er afhængige af OCR, bruger AnyParser en kombination af visuelle og tekstbaserede kodere til at fange selv de mindste detaljer fra dokumenter, hvilket sikrer, at ingen kritiske data går tabt. Denne tilgang er særligt gavnlig ved udtrækning af højopløsningsdata fra finansielle og medicinske dokumenter, hvor nøjagtighed er kritisk.

## Epsilla: En fleksibel RAG-platform

Komplementerende til AnyParser er Epsilla, en no-code RAG-as-a-Service platform designet til at optimere forskellige RAG-pipelines. Epsilla forbedrer videnretrieval-processen gennem avancerede chunking-, indekserings- og forespørgselsforbedringsteknikker. Ved at integrere nøgleordsbaserede og semantiske søgemetoder leverer Epsilla yderst præcise og kontekstuelt relevante resultater, hvilket gør det til en ideel løsning for store sprogmodel (LLM) applikationer.

## Eksperiment & Evaluering: Virkelige konsekvenser

![AnyParser og Epsilla evalueringsmetrikker fra Ragas](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Evalueringsmetrikker fra Ragas_

For at validere effektiviteten af AnyParser og Epsilla blev systemet testet på 10-K finansielle dokumenter fra virksomheder som Apple og Meta. Resultaterne var imponerende, idet systemet viste betydeligt højere ydeevne på alle nøgle evalueringsmetrikker, herunder kontekstuel præcision, recall, troværdighed og svar korrekthed. I nogle tilfælde overgik systemet traditionelle RAG-systemer med op til 2,7x, hvilket fremhæver dets overlegenhed i håndtering af komplekse dataudtrækningsopgaver.

## Almindelige anvendelsestilfælde og nøglefordele

- **Nøjagtighed**: Høj præcision i konvertering af både strukturerede og ustrukturerede data til anvendelige formater.

- **Privatliv**: Muligheden for at implementere systemet inden for en kundes datacenter sikrer fuld datasikkerhed.

- **Skalerbarhed**: Hurtig behandling af store mængder dokumenter, hvilket muliggør hurtigere beslutningstagning.

## Konklusion: En ny æra inden for videnretrieval

Introduktionen af AnyParser og Epsilla markerer en betydelig fremgang inden for videnretrieval-teknologi. Ved at kombinere avancerede udtræksmodeller med en robust RAG-infrastruktur forbedrer denne integrerede løsning ikke kun nøjagtigheden og effektiviteten, men tilbyder også den fleksibilitet og privatliv, som moderne virksomheder kræver. Efterhånden som teknologien fortsætter med at udvikle sig, er anvendelserne og fordelene ved dette system omfattende og lovende, hvilket gør det til en game-changer for industrier, der er afhængige af præcis dataudtrækning.

For den fulde detaljerede whitepaper, tjek venligst [dette link](https://www.cambioml.com/research/AnyParser_Epsilla_Whitepaper.pdf).
