---
title: 'A pontosság megduplázása a diagramokból és táblázatokból történő tudáskinyerésben'
date: '2024-12-28'
keywords: 'AnyParser,Epsilla,tudáskinyerés,dokumentumfeldolgozás,RAG,pénzügyi dokumentumok,táblázatkinyerés,diagramkinyerés,vision language modellek,pontosság'
image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png'
---

![AnyParser és Epsilla értékelési mutatói a Ragas-tól](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Ertekelesi mutatok a Ragas-tol_

A mai adatvezérelt környezetben az iparágak, mint például a pénzügyi szolgáltatások, nagymértékben támaszkodnak a dokumentumokból történő pontos és hatékony információkinyerésre, különösen azokra, amelyek strukturálatlan szöveget és strukturált adatokat, például táblázatokat és diagramokat tartalmaznak. A hagyományos optikai karakterfelismerő (OCR) modellek, bár széles körben használják őket, gyakran nem képesek kezelni a bonyolult dokumentumformátumokat, ami alacsony teljesítményhez vezet a fejlett AI alkalmazásokban. E hiányosságok felismerésével a CambioML és az Epsilla egy korszerű tudáskinyerő rendszert mutattak be, amely jelentősen javítja az adatok kinyerésének pontosságát és visszahívását.

## Bevezetés: Az OCR korlátainak leküzdése

Az OCR-alapú modellek, bár hatékonyak a szöveg észlelésében, küzdenek a elrendezési információk kinyerésével és a táblázatokból és diagramokból való adatok pontos kiemelésével. Ezek a korlátok különösen nyilvánvalóvá válnak azokban az iparágakban, ahol a pontosság alapvető fontosságú, mint például a pénzügy és az egészségügy. E kihívások kezelésére a CambioML és az Epsilla egy új megközelítést dolgozott ki, amely integrálja a legmodernebb táblázatkinyerő modelleket a Retrieval-Augmented Generation (RAG) technikákkal. Ez az új rendszer akár 2x-es pontosságot és 2,5x-es visszahívást ér el a hagyományos RAG rendszerekhez képest, új standardot állítva fel a dokumentumokkal kapcsolatos kérdések megválaszolásában.

## AnyParser: A táblázatkinyerés forradalmasítása

Ezeknek a áttöréseknek a középpontjában az AnyParser áll, egy olyan modell, amelyet fejlett vision language modellek (VLM) hajtanak, és amely kiválóan teljesít az információk kinyerésében különböző adatforrásokból. A hagyományos modellekkel ellentétben, amelyek nagymértékben támaszkodnak az OCR-ra, az AnyParser vizuális és szövegalapú kódolókat kombinál, hogy még a legkisebb részleteket is rögzítse a dokumentumokból, biztosítva, hogy egyetlen kritikus adat se vesszen el. Ez a megközelítés különösen előnyös a pénzügyi és orvosi dokumentumokból származó nagy felbontású adatok kinyerésében, ahol a pontosság kulcsfontosságú.

## Epsilla: Egy rugalmas RAG platform

Az AnyParser-t az Epsilla egészíti ki, egy no-code RAG-as-a-Service platform, amelyet különböző RAG folyamatok optimalizálására terveztek. Az Epsilla fejlett darabolási, indexelési és lekérdezés finomítási technikák révén javítja a tudáskinyerési folyamatot. Kulcsszó-alapú és szemantikus keresési módszerek integrálásával az Epsilla rendkívül pontos és kontextuálisan releváns eredményeket nyújt, így ideális megoldás a nagy nyelvi modellek (LLM) alkalmazásaihoz.

## Kísérlet és Értékelés: Valós Hatás

![AnyParser és Epsilla értékelési mutatói a Ragas-tól](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Ertekelesi mutatok a Ragas-tol_

Az AnyParser és az Epsilla hatékonyságának érvényesítése érdekében a rendszert 10-K pénzügyi dokumentumokon tesztelték, például az Apple és a Meta cégektől. Az eredmények lenyűgözőek voltak, a rendszer jelentősen magasabb teljesítményt mutatott az összes kulcsfontosságú értékelési mutatóban, beleértve a kontextuális pontosságot, a visszahívást, a hűséget és a válasz helyességét. Egyes esetekben a rendszer akár 2,7x-es túlteljesítést mutatott a hagyományos RAG rendszerekhez képest, kiemelve a bonyolult adatok kinyerésére való képességét.

## Gyakori Használati Esetek és Kulcsfontosságú Előnyök

- **Pontosság**: Magas pontosság a strukturált és strukturálatlan adatok használható formátumba történő átkonvertálásában.

- **Adatvédelem**: A rendszer ügyféladatközpontban történő telepítésének lehetősége teljes adatbiztonságot garantál.

- **Skálázhatóság**: Nagy mennyiségű dokumentum gyors feldolgozása, lehetővé téve a gyorsabb döntéshozatalt.

## Következtetés: Egy új korszak a tudáskinyerésben

Az AnyParser és az Epsilla bevezetése jelentős előrelépést jelent a tudáskinyerési technológiában. A fejlett kinyerési modellek és egy robusztus RAG infrastruktúra kombinálásával ez az integrált megoldás nemcsak a pontosságot és a hatékonyságot javítja, hanem a modern vállalatok által megkövetelt rugalmasságot és adatvédelmet is kínál. Ahogy a technológia folyamatosan fejlődik, ennek a rendszernek az alkalmazásai és előnyei széleskörűek és ígéretesek, így igazi áttörést jelent az iparágak számára, amelyek pontos adatkinyerésre támaszkodnak.

A részletes fehér könyvért kérjük, nézze meg [ezt a linket](https://www.cambioml.com/research/AnyParser_Epsilla_Whitepaper.pdf).
