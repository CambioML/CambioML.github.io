---
title: 'AnyParser On-prem Enterprise Security Whitepaper'
date: '2024-02-03'
keywords: 'AnyParser,paikallinen,yritysturvallisuus,tietosuoja,dokumenttien käsittely,infrastruktuurin turvallisuus,salaus,pääsynhallinta,vaatimustenmukaisuus,valkoinen kirja'
image: '/images/solutions/anyparser-performance-graph.png'
---

## Yhteenveto

AnyParser On-prem on huipputeknologian dokumenttien käsittelyratkaisu, joka on suunniteltu vastaamaan nykyaikaisten yritysten tiukkoja turvallisuusvaatimuksia. Tämä valkoinen kirja kuvaa AnyParser On-prem:ssä toteutettuja vahvoja turvallisuustoimia, jotka varmistavat tietosuojan, sääntelyvaatimusten noudattamisen ja toimintatehokkuuden.

## 1. Johdanto

Nykyisessä tietopohjaisessa liiketoimintaympäristössä tehokas dokumenttien käsittely on ratkaisevan tärkeää toimintojen ja päätöksentekoprosessien sujuvoittamiseksi. Kuitenkin pilvipohjaisten kielimallien käyttö herkkiä asiakirjoja käsiteltäessä tuo mukanaan merkittäviä tietosuojariskejä. AnyParser On-prem ratkaisee nämä haasteet tarjoamalla turvallisen, paikallisen ratkaisun, joka hyödyntää edistyneiden kielimallien voimaa samalla kun säilyttää täydellisen hallinnan herkistä tiedoista.

### Miksi CambioML AnyParser erottuu: Nopeus ja tarkkuus

CambioML-malli erottuu sekä nopeudessaan että tarkkuudessaan, mikä luo ihanteellisen tasapainon monille liiketoimintatarpeille. Se on nopeampi kuin useimmat suuret omistusoikeudelliset mallit ja tarjoaa samalla korkeampaa tarkkuutta verrattuna perinteisiin optiseen merkintunnistukseen (OCR) perustuviin järjestelmiin. Tämä tarkoittaa, että yrityksesi voi saavuttaa molempien maailmojen parhaat puolet—nopean, luotettavan dokumenttien käsittelyn ilman suorituskyvyn uhraamista.

![AnyParser Performance Graph](/images/solutions/anyparser-performance-graph.png)

Yllä oleva kaavio vertaa eri dokumenttien käsittelymallien läpimenoa ja tarkkuutta.

- X-akseli (Vaakasuora): Edustaa "Keskimääräinen läpimeno (tokens/s)". Tämä mittaa, kuinka nopeasti kukin malli voi käsitellä tekstiä, ja korkeammat arvot osoittavat nopeampia käsittelynopeuksia.

- Y-akseli (Pystysuora): Edustaa "Tarkkuus". Tämä mittaa, kuinka oikein kukin malli tulkitsee ja poimii tietoa asiakirjoista, ja korkeammat arvot osoittavat parempaa suorituskykyä.

Anyparser ylittää muut mallit sekä tarkkuudessa (noin 0.82) että läpimenossa (noin 160 tokens/s), tarjoten optimaalisen tasapainon yritysten dokumenttien käsittelytarpeille.

## 2. Turvallisuusarkkitehtuurin yleiskatsaus

AnyParser On-prem on suunniteltu turvallisuus edellä mielessä, tarjoten koko pinon mallista itse palvelininfrastruktuuriin. Tämä kattava ratkaisu voidaan saumattomasti ottaa käyttöön yksityisissä pilviympäristöissä, kuten AWS, GCP ja Azure.

### 2.1 Käyttömalli

Paikallinen käyttömalli varmistaa, että kaikki tietojenkäsittely tapahtuu organisaation yksityisessä ympäristössä. Tämä lähestymistapa poistaa tarpeen siirtää herkkiä asiakirjoja yrityksen hallinnan ulkopuolelle, mikä käsittelee tietosuojaan ja sääntelyvaatimuksiin liittyviä huolia.

### 2.2 Infrastruktuurin turvallisuus

AnyParser On-prem hyödyntää alan standardeja työkaluja ja parhaita käytäntöjä turvallisen infrastruktuurin käyttöönottoon:

- Terraformia käytetään pilvi-infrastruktuurin perustamiseen ja hallintaan, mikä varmistaa johdonmukaisuuden ja vähentää väärinkonfiguroinnin riskiä.

- Docker-kontteja käytetään sovelluksen ja sen riippuvuuksien eristämiseen, mikä parantaa turvallisuutta ja siirrettävyyttä.

- Käyttö EC2:lle tai EKS:lle hallitaan Terraformin kautta, mikä ylläpitää infrastruktuuri koodina -periaatteita ja mahdollistaa käyttöönottoprosessin versionhallinnan.

### 2.3 Verkon turvallisuus

Turvallisen pääsyn ja viestinnän varmistamiseksi:

- Kong tai Nginx asetetaan sisäänkäynnin ohjaimeksi, tarjoten vahvat liikenteen hallinta- ja turvallisuusominaisuudet.

- DNS-konfigurointi toteutetaan saumattoman sisäisen pääsyn varmistamiseksi, vähentäen altistumista ulkoisille uhille.

![Cambio On-prem Design](/images/solutions/cambio-onprem-design.png)

## 3. Tietosuoja ja suojaus

AnyParser On-prem vastaa dokumenttien käsittelyn kriittiseen tietosuojatarpeeseen:

- Kaikki tiedot pysyvät organisaation yksityisessä ympäristössä, mikä eliminoi pilvipohjaisten omistusoikeudellisten mallien mukanaan tuomat riskit.

- Ratkaisu noudattaa sääntelyvaatimuksia ja sisäisiä tietosuojakäytäntöjä varmistamalla, että herkkiä asiakirjoja ei lähetetä ulos yksityisestä ympäristöstä.

## 4. Pääsynhallinta ja todennus

AnyParser On-prem toteuttaa vahvoja pääsynhallinta- ja todennusmekanismeja, mukaan lukien:

- Roolipohjainen pääsynhallinta (RBAC) varmistaakseen, että vain valtuutetut henkilöt voivat käyttää järjestelmää ja käsiteltyjä tietoja.

- Monivaiheinen todennus (MFA) parannetun käyttäjävarmennuksen vuoksi.

- Säännölliset pääsyn tarkastukset ja lokitus järjestelmän käytön seuraamiseksi ja tarkistamiseksi.

## 5. Salaus

Herkän tiedon suojaamiseksi edelleen AnyParser On-prem tarjoaa asiakkaille mahdollisuuden toteuttaa:

- Tietojen salausta levossa käyttäen alan standardeja salausalgoritmeja.

- Salausta siirrossa käyttäen TLS/SSL-protokollia kaikessa verkkoviestinnässä.

- Turvallisia avainten hallintakäytäntöjä salausavainten suojaamiseksi.

## 6. Jatkuva valvonta ja häiriötilanteisiin reagoiminen

Vahvan turvallisuusaseman ylläpitämiseksi AnyParser On-prem tarjoaa asiakkaille mahdollisuuden toteuttaa:

- Reaaliaikainen infrastruktuurin ja sovelluksen valvonta mahdollisten turvallisuusuhkien varalta.

- Säännölliset haavoittuvuusarvioinnit ja penetraatiotestaukset.

- Hyvin määritelty häiriötilanteisiin reagoimissuunnitelma turvallisuustapahtumien käsittelemiseksi ja lieventämiseksi nopeasti.

## 7. Tulevat turvallisuuspäivitykset

CambioML on sitoutunut jatkuvaan innovaatioon turvallisuudessa. Tuleva bare-metal Kubernetes-pohjainen käyttöönotto tarjoaa yrityksille vielä suuremman hallinnan ja joustavuuden infrastruktuurivalinnoissaan. Tämä parannus mahdollistaa organisaatioiden ottaa AnyParser On-prem käyttöön omalla laitteistollaan, mikä vahvistaa tietojen hallintaa, vähentää viivettä ja optimoi toimintaympäristöjä.

## 8. Suorituskyky ja skaalaus

Vaikka tiukat turvallisuustoimet säilytetään, AnyParser On-prem ei tingi suorituskyvystä:

- Ratkaisu tarjoaa optimaalisen tasapainon nopeuden ja tarkkuuden välillä, ylittäen muut mallit molemmissa mittareissa.

- Tarkkuuden ollessa noin 0.82 ja läpimenon ollessa noin 160 tokens/s, AnyParser On-prem täyttää yritysten dokumenttien käsittelytarpeet tehokkaasti.

## Johtopäätös

AnyParser On-prem tarjoaa turvallisen, korkean suorituskyvyn ja tarkan dokumenttien käsittelyratkaisun, joka vastaa nykyaikaisten yritysten kriittisiin turvallisuus- ja tietosuojaongelmiin. Tarjoamalla paikallisen käyttöönotto-mallin, vahvan infrastruktuurin turvallisuuden ja sitoutumisen jatkuvaan parantamiseen, AnyParser On-prem mahdollistaa organisaatioiden hyödyntää edistyneen dokumenttien käsittelyn voimaa samalla kun ne säilyttävät täydellisen hallinnan herkistä tiedoistaan.

## Toimintakehotus

Organisaatioille, jotka haluavat muuttaa dokumenttityönkulkujaan tinkimättä turvallisuudesta, AnyParser On-prem tarjoaa voimakkaan ja turvallisen ratkaisun. Ota yhteyttä CambioML:ään tänään [varataksesi esittelyn](https://www.cambioml.com/book-demo) tai [aloittaaksesi kokeilun](https://www.cambioml.com/sandbox) ja koe turvallisen, tehokkaan dokumenttien käsittelyn hyödyt.
