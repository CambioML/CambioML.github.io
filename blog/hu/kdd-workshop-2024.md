---
title: 'KDD 2024: Beszélgetés az Amazonnal'
date: '2025-01-29'
keywords: 'KDD 2024,Nagy Nyelvi Modellek,LLM,Keresési Kiegészített Generálás,RAG,LLM finomhangolás,Amazon,domain-specifikus AI,gépi tanulás,konferencia'
image: '/images/solutions/kdd-2024-cover.jpeg'
---

![KDD 2024 Konferencia](/images/solutions/kdd-2024-cover.jpeg)
_Rachel Hu előadása a KDD 2024 konferencián_

A KDD 2024 konferencián [Rachel Hu](https://www.linkedin.com/in/rachelsonghu/), a CambioML társalapítója és vezérigazgatója, átfogó bemutatót tartott a Nagy Nyelvi Modellek (LLM) domain-specifikus alkalmazásokra való optimalizálásáról, társelőadóival [José Cassio dos Santos Junior](https://www.linkedin.com/in/jcassiojr/) (Amazon), [Richard Song](https://www.linkedin.com/in/renchu-richard-song-a4099247/) (Epsilla) és [Yunfei Bai](https://www.linkedin.com/in/yunfei-felix-bai-909b861/) (Amazon). Az előadás mélyreható betekintést nyújtott két kritikus technikába: a Keresési Kiegészített Generálásba (RAG) és az LLM Finomhangolásába. Ezek a módszerek elengedhetetlenek az LLM-ek teljesítményének javításához a specializált területeken, lehetővé téve a fejlesztők számára, hogy hatékonyabb és pontosabb modelleket hozzanak létre, amelyek a konkrét feladatokhoz vannak igazítva.

## A RAG megértése: Az LLM képességeinek bővítése

A Keresési Kiegészített Generálás (RAG) egy erőteljes megközelítés, amely kiterjeszti az LLM-ek képességeit külső tudásbázisok integrálásával. Ez a technika lehetővé teszi az LLM-ek számára, hogy válaszokat generáljanak konkrét domain tudás alapján anélkül, hogy széleskörű újraképzésre lenne szükség. A RAG különösen előnyös azok számára a szervezetek számára, amelyeknek szükségük van belső tudásbázisok vagy más specializált források kihasználására, biztosítva ezzel a LLM teljesítményének költséghatékony és időhatékony javítását.

## Finomhangolás: Modellek testreszabása a pontosság érdekében

Az LLM Finomhangolás a modell súlyainak beállítását jelenti domain-specifikus adatok felhasználásával, lehetővé téve a modell számára, hogy rendszerszinten tanuljon új, átfogó tudást, amely nem szerepelt az előképzési fázisban. Ez a megközelítés elengedhetetlen a magas fokú pontosságot igénylő feladatokhoz, és különösen hatékony azokban a területeken, ahol az általános célú modellek nem elegendőek. A Finomhangolás átalakíthat egy LLM-et egy rendkívül specializált eszközzé, amely képes komplex, domain-specifikus feladatokat precízen végrehajtani.

![Rachel Hu előadása a KDD-n](/images/solutions/kdd-2024-rachel.jpeg)

## A RAG és a Finomhangolás kombinálása az optimális eredmények érdekében

A bemutató felfedezte, hogyan lehet a RAG és a Finomhangolás kombinálásával egy robusztus architektúrát létrehozni az LLM alkalmazások számára. E két megközelítés integrálásával a fejlesztők olyan modelleket építhetnek, amelyek nemcsak a legrelevánsabb külső információkhoz férnek hozzá, hanem tanulnak a domain-specifikus adatokból is. Ez a hibrid megközelítés lehetővé teszi olyan modellek létrehozását, amelyek egyaránt sokoldalúak és rendkívül pontosak, képesek kezelni a domain-specifikus feladatok széles skáláját, a szöveggenerálástól a komplex kérdés-válasz helyzetekig.

## Gyakorlati laboratóriumok: A RAG és a Finomhangolás gyakorlati alkalmazásai

Rachel bemutatójának jelentős része gyakorlati laboratóriumoknak volt szentelve, ahol a résztvevők fejlett technikákat fedeztek fel a RAG és a Finomhangolt LLM architektúrák optimalizálására. A laboratóriumok különböző témákat öleltek fel, beleértve:

- **Fejlett RAG Technikai**: Többfázisú optimalizálási stratégiákat mutattak be a RAG kimenetek pontosságának és relevanciájának javítására. Ez magában foglalta az előzetes keresést, a keresést és a poszt-keresési optimalizálást, valamint a tudásgrafikonok és a több dokumentum elemzésének innovatív felhasználását a finomabb érvelés érdekében.

- **LLM Finomhangolása**: A résztvevők domain-specifikus adathalmazon alapuló kis LLM finomhangolásában vettek részt. A laboratórium hangsúlyozta a folyamatos finomhangolási folyamatot, integrálva mind az emberi, mind az AI visszajelzést a specializált feladatokban való kiemelkedő teljesítmény elérése érdekében.

- **Benchmarking és Értékelés**: Az utolsó laboratórium a RAG, a Finomhangolás és a kombinált megközelítés teljesítményének összehasonlítására összpontosított különböző feladatok során. Ez magában foglalta a részletes ROI elemzést, hogy segítsen a fejlesztőknek a legköltséghatékonyabb és leghatékonyabb módszer kiválasztásában specifikus igényeikhez.

![KDD 2024 Laboratóriumok](/images/solutions/kdd-2024-labs.jpg)

## Legjobb gyakorlatok a domain-specifikus LLM fejlesztésében

A bemutató egy sor legjobb gyakorlat bemutatásával zárult a RAG és a Finomhangolás valós alkalmazásokban történő megvalósítására. Hangsúlyozva a RAG rugalmassága és a Finomhangolás pontossága közötti kompromisszumok megértésének fontosságát, a résztvevőket folyamatos kísérletezésre és benchmarkingra ösztönözték. Ez a megközelítés biztosítja, hogy a teljesítmény és a költséghatékonysági kritériumok teljesüljenek, lehetővé téve a fejlesztők számára, hogy hatékonyan optimalizálják LLM architektúrájukat domain-specifikus feladatokhoz.

A bemutató tartalmának és a gyakorlati laboratóriumok részletesebb áttekintéséhez kérjük, tekintse meg [ezt a cikket](https://dl.acm.org/doi/pdf/10.1145/3637528.3671445) és [ezt a bemutatót](https://docs.google.com/presentation/d/18PJctnI-KbABE1El_AifjN_7eoHatuaoN8-2q57xpSw/edit#slide=id.g2f5cc21ff85_5_1096).
