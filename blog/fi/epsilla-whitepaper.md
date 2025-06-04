---
title: 'Kaksinkertainen tarkkuus tietojen hakemisessa kaavioista ja taulukoista'
date: '2024-12-28'
keywords: 'AnyParser,Epsilla,tietojen haku,dokumenttien käsittely,RAG,rahoitusasiakirjat,taulukon poiminta,kaavion poiminta,näkökielimallit,tarkkuus'
image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png'
---

![AnyParser ja Epsilla arviointimittarit Ragasista](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Arviointimittarit Ragasista_

Nykyisessä datavetoisessa ympäristössä teollisuudenalat, kuten rahoituspalvelut, luottavat voimakkaasti tarkkaan ja tehokkaaseen tiedon poimintaan asiakirjoista, erityisesti niistä, jotka sisältävät sekä jäsentämätöntä tekstiä että jäsenneltyä dataa, kuten taulukoita ja kaavioita. Perinteiset optisen merkkien tunnistus (OCR) mallit, huolimatta niiden laajasta käytöstä, jäävät usein jälkeen monimutkaisten asiakirjamuotojen käsittelyssä, mikä johtaa heikompaan suorituskykyyn edistyneissä tekoälysovelluksissa. Tämän aukon tunnistaen CambioML ja Epsilla ovat esitellyt huipputeknisen tietojen hakujärjestelmän, joka lupaa merkittävästi parantaa tarkkuutta ja muistia tietojen poimintatehtävissä.

## Johdanto: OCR-rajoitusten voittaminen

OCR-pohjaiset mallit, vaikka ne ovatkin tehokkaita tekstin havaitsemisessa, kamppailevat asettelutietojen poimimisen ja taulukoista sekä kaavioista tietojen tarkan hakemisen kanssa. Nämä rajoitukset tulevat erityisen selvästi esiin teollisuudenaloilla, joissa tarkkuus on ensiarvoisen tärkeää, kuten rahoituksessa ja terveydenhuollossa. Näiden haasteiden ratkaisemiseksi CambioML ja Epsilla ovat kehittäneet uudenlaisen lähestymistavan, joka yhdistää huipputekniset taulukon poimintamallit ja hakua parantavat generointitekniikat (RAG). Tämä uusi järjestelmä saavuttaa jopa 2x tarkkuuden ja 2.5x muistin verrattuna perinteisiin RAG-järjestelmiin, asettaen uuden standardin asiakirjakysymyksiin vastaamiselle.

## AnyParser: Taulukon poiminnan vallankumous

Tämän läpimurron ytimessä on AnyParser, malli, jota ohjaavat edistyneet näkökielimallit (VLM), ja joka erottuu tiedon poiminnassa erilaisista datalähteistä. Toisin kuin perinteiset mallit, jotka nojaavat voimakkaasti OCR:ään, AnyParser käyttää yhdistelmää visuaalisia ja tekstipohjaisia koodereita, jotta se voi tallentaa jopa pienimmätkin yksityiskohdat asiakirjoista, varmistaen, että mitään kriittistä tietoa ei jää huomaamatta. Tämä lähestymistapa on erityisen hyödyllinen korkearesoluutioisen datan poiminnassa rahoitus- ja lääketieteellisistä asiakirjoista, joissa tarkkuus on kriittistä.

## Epsilla: Joustava RAG-alusta

AnyParseria täydentää Epsilla, koodittomaksi RAG-as-a-Service -alustaksi suunniteltu järjestelmä, joka optimoi erilaisia RAG-putkia. Epsilla parantaa tietojen hakuprosessia edistyneiden osioimisen, indeksoinnin ja kysymyksen tarkentamisen tekniikoiden avulla. Yhdistämällä avainsanoihin perustuvat ja semanttiset hakumenetelmät Epsilla tarjoaa erittäin tarkkoja ja kontekstuaalisesti relevantteja tuloksia, mikä tekee siitä ihanteellisen ratkaisun suurten kielimallien (LLM) sovelluksille.

## Kokeilu ja arviointi: Todellinen vaikutus

![AnyParser ja Epsilla arviointimittarit Ragasista](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Arviointimittarit Ragasista_

Vahvistaakseen AnyParserin ja Epsillan tehokkuuden järjestelmää testattiin 10-K rahoitusasiakirjoilla yrityksiltä kuten Apple ja Meta. Tulokset olivat vaikuttavia, sillä järjestelmä osoitti merkittävästi korkeampaa suorituskykyä kaikilla keskeisillä arviointimittareilla, mukaan lukien kontekstin tarkkuus, muistaminen, uskollisuus ja vastausten oikeellisuus. Joissakin tapauksissa järjestelmä ylitti perinteiset RAG-järjestelmät jopa 2.7x, mikä korostaa sen ylivoimaa monimutkaisissa tietojen poimintatehtävissä.

## Yleiset käyttötapaukset ja keskeiset hyödyt

- **Tarkkuus**: Korkea tarkkuus sekä jäsennellyn että jäsentämättömän datan muuntamisessa käyttökelpoisiin muotoihin.

- **Yksityisyys**: Järjestelmän käyttöönotto asiakkaan datakeskuksessa varmistaa täydellisen tietoturvan.

- **Skaalautuvuus**: Suurten asiakirjamäärien nopea käsittely, mikä mahdollistaa nopeamman päätöksenteon.

## Johtopäätös: Uusi aikakausi tietojen hakemisessa

AnyParserin ja Epsillan esittely merkitsee merkittävää edistystä tietojen hakuteknologiassa. Yhdistämällä edistyneet poimintamallit vankkaan RAG-infrastruktuuriin tämä integroitu ratkaisu ei ainoastaan paranna tarkkuutta ja tehokkuutta, vaan tarjoaa myös joustavuutta ja yksityisyyttä, joita nykyaikaiset yritykset vaativat. Teknologian kehittyessä tämän järjestelmän sovellukset ja hyödyt ovat laajat ja lupaavat, tehden siitä pelinvaihtajan teollisuuksille, jotka riippuvat tarkasta tietojen poiminnasta.

Koko yksityiskohtaisen valkoisen paperin voit tarkistaa [tästä linkistä](https://www.cambioml.com/research/AnyParser_Epsilla_Whitepaper.pdf).
