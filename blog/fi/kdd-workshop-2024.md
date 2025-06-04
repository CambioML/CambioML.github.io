---
title: 'KDD 2024: Keskustelu Amazonin kanssa'
date: '2025-01-29'
keywords: 'KDD 2024,Suurten kielimallien optimointi,LLM,Hakupohjainen generointi,RAG,LLM hienosäätö,Amazon,aluekohtainen tekoäly,koneoppiminen,konferenssi'
image: '/images/solutions/kdd-2024-cover.jpeg'
---

![KDD 2024 Conference](/images/solutions/kdd-2024-cover.jpeg)
_Rachel Hu esittelee KDD 2024 -konferenssissa_

KDD 2024 -konferenssissa [Rachel Hu](https://www.linkedin.com/in/rachelsonghu/), CambioML:n perustaja ja toimitusjohtaja, esitteli kattavan oppitunnin suurten kielimallien (LLM) optimoinnista aluekohtaisiin sovelluksiin yhdessä co-esittäjien [José Cassio dos Santos Junior](https://www.linkedin.com/in/jcassiojr/) (Amazon), [Richard Song](https://www.linkedin.com/in/renchu-richard-song-a4099247/) (Epsilla) ja [Yunfei Bai](https://www.linkedin.com/in/yunfei-felix-bai-909b861/) (Amazon) kanssa. Istunnossa käsiteltiin kahta keskeistä tekniikkaa: Hakupohjaista generointia (RAG) ja LLM:n hienosäätöä. Nämä menetelmät ovat olennaisia LLM:ien suorituskyvyn parantamiseksi erikoistuneilla aloilla, mikä mahdollistaa kehittäjille tehokkaampien ja tarkempien mallien luomisen tiettyihin tehtäviin.

## Ymmärtäminen RAG: Laajentaminen LLM:n kykyjä

Hakupohjainen generointi (RAG) on tehokas lähestymistapa, joka laajentaa LLM:ien kykyjä integroimalla ulkoisia tietokantoja. Tämä tekniikka mahdollistaa LLM:ien tuottaa vastauksia perustuen tiettyyn aluekohtaiseen tietoon ilman laajaa uudelleenkoulutusta. RAG on erityisen hyödyllinen organisaatioille, jotka tarvitsevat hyödyntää sisäisiä tietokantoja tai muita erikoistuneita resursseja, tarjoten tavan parantaa LLM:n suorituskykyä kustannustehokkaasti ja ajankäytön kannalta tehokkaasti.

## Hienosäätö: Mallien räätälöinti tarkkuudelle

LLM:n hienosäätö tarkoittaa mallin painojen säätämistä aluekohtaisilla tiedoilla, mikä mahdollistaa mallin systemaattisen oppimisen uudesta, kattavasta tiedosta, jota ei ollut mukana esikoulutusvaiheessa. Tämä lähestymistapa on olennaista tehtävissä, jotka vaativat korkeaa tarkkuutta, ja se on erityisen tehokas aloilla, joilla yleiskäyttöiset mallit eivät riitä. Hienosäätö voi muuttaa LLM:n erittäin erikoistuneeksi työkaluksi, joka pystyy suorittamaan monimutkaisia, aluekohtaisia tehtäviä tarkasti.

![Rachel Hu esittelee KDD:ssä](/images/solutions/kdd-2024-rachel.jpeg)

## RAG:n ja hienosäädön yhdistäminen optimaalisten tulosten saavuttamiseksi

Oppitunti tutki, kuinka RAG:n ja hienosäädön yhdistäminen voi luoda vankan arkkitehtuurin LLM-sovelluksille. Yhdistämällä nämä kaksi lähestymistapaa kehittäjät voivat rakentaa malleja, jotka eivät vain pääse käsiksi kaikkein relevanttiin ulkoiseen tietoon, vaan myös oppivat aluekohtaisista tiedoista. Tämä hybridi-lähestymistapa mahdollistaa mallien luomisen, jotka ovat sekä monipuolisia että erittäin tarkkoja, kykeneviä käsittelemään laajan valikoiman aluekohtaisia tehtäviä, tekstin generoinnista monimutkaisiin kysymys-vastaus-skenaarioihin.

## Käytännön laboratoriot: RAG:n ja hienosäädön käytännön sovellukset

Merkittävä osa Rachel'in oppitunnista oli omistettu käytännön laboratorioille, joissa osallistujat tutkivat edistyneitä tekniikoita RAG:n ja hienosäädettyjen LLM-arkkitehtuurien optimointiin. Laboratoriot kattoivat monia aiheita, mukaan lukien:

- **Edistyneet RAG-tekniikat**: Monivaiheisia optimointistrategioita esiteltiin RAG:n tulosten tarkkuuden ja relevanssin parantamiseksi. Tämä sisälsi ennakkohaku-, haku- ja jälkihakuoptimoinnin sekä innovatiivisen tietografiikan ja monidokumenttianalyysin käytön hienovaraisemman päättelyn saavuttamiseksi.

- **LLM:n hienosäätö**: Osallistujat osallistuivat pienen LLM:n hienosäätöön aluekohtaisilla tietosarjoilla. Laboratorio korosti jatkuvaa hienosäätöprosessia, joka yhdistää sekä ihmisen että tekoälyn palautteen saavuttaakseen erinomaisen suorituskyvyn erikoistuneissa tehtävissä.

- **Vertailu ja arviointi**: Viimeinen laboratorio keskittyi RAG:n, hienosäädön ja niiden yhdistetyn lähestymistavan suorituskyvyn vertailuun eri tehtävissä. Tämä sisälsi yksityiskohtaisen ROI-analyysin auttaakseen kehittäjiä valitsemaan kustannustehokkaimman ja tehokkaimman menetelmän heidän erityisiin tarpeisiinsa.

![KDD 2024 Labs](/images/solutions/kdd-2024-labs.jpg)

## Parhaat käytännöt aluekohtaisen LLM-kehityksen tueksi

Oppitunti päättyi joukkoon parhaita käytäntöjä RAG:n ja hienosäädön toteuttamiseksi todellisissa sovelluksissa. Korostaen RAG:n joustavuuden ja hienosäädön tarkkuuden välisten kauppojen ymmärtämisen tärkeyttä, osallistujia kannustettiin jatkuvaan kokeiluun ja vertailuun. Tämä lähestymistapa varmistaa, että suorituskyky- ja kustannustehokkuuskriteerit täyttyvät, mikä mahdollistaa kehittäjille LLM-arkkitehtuurin optimoinnin aluekohtaisille tehtäville tehokkaasti.

Lisätietoja oppitunnin sisällöstä ja käytännön laboratorioista löytyy [tästä paperista](https://dl.acm.org/doi/pdf/10.1145/3637528.3671445) ja [tästä esityksestä](https://docs.google.com/presentation/d/18PJctnI-KbABE1El_AifjN_7eoHatuaoN8-2q57xpSw/edit#slide=id.g2f5cc21ff85_5_1096).
