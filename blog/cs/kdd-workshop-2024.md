---
title: 'KDD 2024: Rozhovor s Amazonem'
date: '2025-01-29'
keywords: 'KDD 2024,Velké jazykové modely,LLM,Retrieval Augmented Generation,RAG,jemné ladění LLM,Amazon,doma-specifická AI,strojové učení,konference'
image: '/images/solutions/kdd-2024-cover.jpeg'
---

![KDD 2024 Konference](/images/solutions/kdd-2024-cover.jpeg)
_Rachel Hu prezentuje na konferenci KDD 2024_

Na konferenci KDD 2024, [Rachel Hu](https://www.linkedin.com/in/rachelsonghu/), spoluzakladatelka a generální ředitelka CambioML, představila komplexní tutoriál o optimalizaci Velkých jazykových modelů (LLMs) pro doma-specifické aplikace, spolu s kolegy [José Cassio dos Santos Junior](https://www.linkedin.com/in/jcassiojr/) (Amazon), [Richard Song](https://www.linkedin.com/in/renchu-richard-song-a4099247/) (Epsilla) a [Yunfei Bai](https://www.linkedin.com/in/yunfei-felix-bai-909b861/) (Amazon). Tato prezentace poskytla hluboké poznatky o dvou klíčových technikách: Retrieval Augmented Generation (RAG) a jemném ladění LLM. Tyto metody jsou nezbytné pro zlepšení výkonu LLM v specializovaných oblastech, což umožňuje vývojářům vytvářet efektivnější a přesnější modely přizpůsobené konkrétním úkolům.

## Pochopení RAG: Rozšíření schopností LLM

Retrieval Augmented Generation (RAG) je mocný přístup, který rozšiřuje schopnosti LLM integrací externích znalostních bází. Tato technika umožňuje LLM generovat odpovědi na základě specifických znalostí z oboru, aniž by bylo nutné rozsáhlé přeškolení. RAG je obzvlášť přínosný pro organizace, které potřebují využívat interní znalostní báze nebo jiné specializované zdroje, a poskytuje způsob, jak zlepšit výkon LLM efektivně a časově úsporně.

## Jemné ladění: Přizpůsobení modelů pro přesnost

Jemné ladění LLM zahrnuje úpravu vah modelu pomocí doma-specifických dat, což umožňuje modelu systematicky se učit nové, komplexní znalosti, které nebyly zahrnuty během fáze předškolení. Tento přístup je nezbytný pro úkoly vyžadující vysokou míru přesnosti a je obzvlášť účinný v oblastech, kde obecné modely selhávají. Jemné ladění může transformovat LLM na vysoce specializovaný nástroj, schopný vykonávat složité, doma-specifické úkoly s přesností.

![Rachel Hu prezentuje na KDD](/images/solutions/kdd-2024-rachel.jpeg)

## Kombinace RAG a jemného ladění pro optimální výsledky

Tutoriál zkoumal, jak kombinace RAG a jemného ladění může vytvořit robustní architekturu pro aplikace LLM. Integrací těchto dvou přístupů mohou vývojáři vytvářet modely, které nejen přistupují k nejrelevantnějším externím informacím, ale také se učí z doma-specifických dat. Tento hybridní přístup umožňuje vytváření modelů, které jsou jak všestranné, tak vysoce přesné, schopné zvládat širokou škálu doma-specifických úkolů, od generování textu po složité scénáře otázka-odpověď.

## Praktické laboratoře: Praktické aplikace RAG a jemného ladění

Významná část Rachelina tutoriálu byla věnována praktickým laboratořím, kde účastníci zkoumali pokročilé techniky pro optimalizaci architektur RAG a jemně laděných LLM. Laboratoře pokrývaly různé témata, včetně:

- **Pokročilé techniky RAG**: Byly demonstrovány vícefázové optimalizační strategie pro zlepšení přesnosti a relevance výstupů RAG. To zahrnovalo optimalizaci před vyhledáváním, vyhledáváním a po vyhledávání, stejně jako inovativní využití znalostních grafů a analýzu více dokumentů pro nuancované uvažování.

- **Jemné ladění LLM**: Účastníci se zapojili do jemného ladění malého LLM pomocí doma-specifických datasetů. Laboratoř zdůraznila kontinuální proces jemného ladění, integrující jak lidskou, tak AI zpětnou vazbu pro dosažení vynikajícího výkonu v specializovaných úkolech.

- **Benchmarking a hodnocení**: Poslední laboratoř se zaměřila na porovnání výkonu RAG, jemného ladění a jejich kombinovaného přístupu napříč různými úkoly. To zahrnovalo podrobnou analýzu ROI, která pomohla vývojářům vybrat nejefektivnější a nákladově efektivní metodu pro jejich specifické potřeby.

![KDD 2024 Laboratoře](/images/solutions/kdd-2024-labs.jpg)

## Nejlepší praktiky pro vývoj doma-specifických LLM

Tutoriál byl zakončen souborem osvědčených postupů pro implementaci RAG a jemného ladění v reálných aplikacích. Důraz byl kladen na důležitost porozumění kompromisům mezi flexibilitou RAG a přesností jemného ladění, účastníci byli vyzváni k neustálému experimentování a benchmarkingu. Tento přístup zajišťuje, že jsou splněny kritéria výkonu a nákladové efektivnosti, což umožňuje vývojářům efektivně optimalizovat svou architekturu LLM pro doma-specifické úkoly.

Pro podrobnější přehled obsahu tutoriálu a praktických laboratoří se prosím podívejte na [tento dokument](https://dl.acm.org/doi/pdf/10.1145/3637528.3671445) a [tuto prezentaci](https://docs.google.com/presentation/d/18PJctnI-KbABE1El_AifjN_7eoHatuaoN8-2q57xpSw/edit#slide=id.g2f5cc21ff85_5_1096).
