---
title: 'Zdvojnásobení přesnosti v získávání znalostí z grafů a tabulek'
date: '2024-12-28'
keywords: 'AnyParser,Epsilla,získávání znalostí,parsing dokumentů,RAG,finanční dokumenty,tvorba tabulek,tvorba grafů,modely jazykového vidění,přesnost'
image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png'
---

![AnyParser a Epsilla hodnotící metriky z Ragas](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Hodnotící metriky z Ragas_

V dnešním datově orientovaném prostředí se průmyslová odvětví jako finanční služby silně spoléhají na přesné a efektivní extrakce informací z dokumentů, zejména těch, které obsahují jak nestrukturovaný text, tak strukturovaná data, jako jsou tabulky a grafy. Tradiční modely optického rozpoznávání znaků (OCR), přestože jsou široce používány, často nedokážou efektivně zpracovávat složité formáty dokumentů, což vede k suboptimálnímu výkonu v pokročilých aplikacích AI. Uvědomujíc si tuto mezeru, CambioML a Epsilla představily špičkový systém pro získávání znalostí, který slibuje výrazné zlepšení přesnosti a recall v úlohách extrakce dat.

## Úvod: Překonání omezení OCR

Modely založené na OCR, ačkoli účinné při detekci textu, mají potíže s extrakcí informací o rozložení a přesným získáváním dat z tabulek a grafů. Tato omezení se stávají obzvlášť patrnými v odvětvích, kde je přesnost zásadní, jako je finance a zdravotnictví. Aby se těmto výzvám čelilo, CambioML a Epsilla vyvinuly novou metodu, která integruje špičkové modely pro extrakci tabulek s technikami Retrieval-Augmented Generation (RAG). Tento nový systém dosahuje až 2x přesnosti a 2,5x recall ve srovnání s konvenčními RAG systémy, čímž nastavuje nový standard pro odpovídání na otázky v dokumentech.

## AnyParser: Revoluce v extrakci tabulek

V srdci tohoto průlomu se nachází AnyParser, model poháněný pokročilými modely jazykového vidění (VLM), který exceluje v extrakci informací z různých datových zdrojů. Na rozdíl od tradičních modelů, které se silně spoléhají na OCR, AnyParser používá kombinaci vizuálních a textových enkodérů k zachycení i těch nejmenších detailů z dokumentů, což zajišťuje, že žádná kritická data nejsou přehlédnuta. Tento přístup je obzvlášť prospěšný při extrakci dat s vysokým rozlišením z finančních a lékařských dokumentů, kde je přesnost klíčová.

## Epsilla: Flexibilní RAG platforma

Doplňující AnyParser je Epsilla, platforma RAG-as-a-Service bez kódu, navržená k optimalizaci různých RAG pipeline. Epsilla zlepšuje proces získávání znalostí prostřednictvím pokročilých technik chunkingu, indexování a vylepšení dotazů. Integrací metod vyhledávání založených na klíčových slovech a sémantickém vyhledávání Epsilla poskytuje vysoce přesné a kontextově relevantní výsledky, což z ní činí ideální řešení pro aplikace velkých jazykových modelů (LLM).

## Experiment & Hodnocení: Dopad v reálném světě

![AnyParser a Epsilla hodnotící metriky z Ragas](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Hodnotící metriky z Ragas_

Aby se ověřila účinnost AnyParser a Epsilla, byl systém testován na 10-K finančních dokumentech od společností jako Apple a Meta. Výsledky byly působivé, systém vykazoval výrazně vyšší výkon ve všech klíčových hodnotících metrikách, včetně kontextové přesnosti, recall, věrnosti a správnosti odpovědí. V některých případech systém překonal tradiční RAG systémy až o 2,7x, což zdůrazňuje jeho nadřazenost při zpracování složitých úloh extrakce dat.

## Běžné případy použití a klíčové výhody

- **Přesnost**: Vysoká přesnost při převodu jak strukturovaných, tak nestrukturovaných dat do použitelných formátů.

- **Soukromí**: Možnost nasadit systém v datovém centru zákazníka zajišťuje plnou bezpečnost dat.

- **Škálovatelnost**: Rychlé zpracování velkého objemu dokumentů, což umožňuje rychlejší rozhodování.

## Závěr: Nová éra v získávání znalostí

Zavedení AnyParser a Epsilla představuje významný pokrok v technologii získávání znalostí. Kombinací pokročilých modelů pro extrakci s robustní infrastrukturou RAG, toto integrované řešení nejen zlepšuje přesnost a efektivitu, ale také nabízí flexibilitu a soukromí, které moderní podniky vyžadují. Jak technologie pokračuje ve vývoji, aplikace a výhody tohoto systému jsou rozsáhlé a slibné, což z něj činí revoluční prvek pro odvětví, která se spoléhají na přesnou extrakci dat.

Pro podrobný whitepaper prosím navštivte [tento odkaz](https://www.cambioml.com/research/AnyParser_Epsilla_Whitepaper.pdf).
