---
title: 'Podwajanie dokładności w pozyskiwaniu wiedzy z wykresów i tabel'
date: '2024-12-28'
keywords: 'AnyParser,Epsilla,pozyskiwanie wiedzy,analiza dokumentów,RAG,dokumenty finansowe,ekstrakcja tabel,ekstrakcja wykresów,modele językowe wizji,dokładność'
image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png'
---

![AnyParser i metryki oceny Epsilli z Ragas](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Metryki oceny z Ragas_

W dzisiejszym świecie opartym na danych, branże takie jak usługi finansowe polegają w dużej mierze na precyzyjnej i efektywnej ekstrakcji informacji z dokumentów, szczególnie tych zawierających zarówno niestrukturalny tekst, jak i dane strukturalne, takie jak tabele i wykresy. Tradycyjne modele optycznego rozpoznawania znaków (OCR), mimo ich powszechnego zastosowania, często nie radzą sobie z obsługą skomplikowanych formatów dokumentów, co prowadzi do suboptymalnej wydajności w zaawansowanych aplikacjach AI. Zauważając tę lukę, CambioML i Epsilla wprowadziły nowoczesny system pozyskiwania wiedzy, który obiecuje znacznie zwiększyć dokładność i przypomnienie w zadaniach ekstrakcji danych.

## Wprowadzenie: Pokonywanie ograniczeń OCR

Modele oparte na OCR, choć skuteczne w wykrywaniu tekstu, mają trudności z ekstrakcją informacji o układzie i dokładnym wydobywaniem danych z tabel i wykresów. Ograniczenia te stają się szczególnie widoczne w branżach, gdzie precyzja jest kluczowa, takich jak finanse i opieka zdrowotna. Aby sprostać tym wyzwaniom, CambioML i Epsilla opracowały nowatorskie podejście, które integruje najnowocześniejsze modele ekstrakcji tabel z technikami generacji wspomaganej wyszukiwaniem (RAG). Nowy system osiąga do 2x większą precyzję i 2,5x większe przypomnienie w porównaniu do konwencjonalnych systemów RAG, ustanawiając nowy standard w odpowiadaniu na pytania dotyczące dokumentów.

## AnyParser: Rewolucja w ekstrakcji tabel

W sercu tego przełomu znajduje się AnyParser, model oparty na zaawansowanych modelach językowych wizji (VLM), który doskonale radzi sobie z wydobywaniem informacji z różnych źródeł danych. W przeciwieństwie do tradycyjnych modeli, które w dużej mierze polegają na OCR, AnyParser wykorzystuje połączenie wizualnych i tekstowych enkoderów, aby uchwycić nawet najmniejsze szczegóły z dokumentów, zapewniając, że żadne kluczowe dane nie zostaną pominięte. To podejście jest szczególnie korzystne w ekstrakcji danych o wysokiej rozdzielczości z dokumentów finansowych i medycznych, gdzie dokładność jest kluczowa.

## Epsilla: Elastyczna platforma RAG

Uzupełnieniem AnyParser jest Epsilla, platforma RAG-as-a-Service bez kodu, zaprojektowana w celu optymalizacji różnych procesów RAG. Epsilla poprawia proces pozyskiwania wiedzy dzięki zaawansowanym technikom dzielenia, indeksowania i udoskonalania zapytań. Integrując metody wyszukiwania oparte na słowach kluczowych i semantycznych, Epsilla dostarcza wysoce dokładne i kontekstowo istotne wyniki, co czyni ją idealnym rozwiązaniem dla aplikacji dużych modeli językowych (LLM).

## Eksperyment i ocena: Wpływ w rzeczywistości

![AnyParser i metryki oceny Epsilli z Ragas](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Metryki oceny z Ragas_

Aby zweryfikować skuteczność AnyParser i Epsilla, system został przetestowany na dokumentach finansowych 10-K firm takich jak Apple i Meta. Wyniki były imponujące, system wykazał znacznie wyższą wydajność we wszystkich kluczowych metrykach oceny, w tym precyzji kontekstowej, przypomnieniu, wierności i poprawności odpowiedzi. W niektórych przypadkach system przewyższył tradycyjne systemy RAG o nawet 2,7x, co podkreśla jego przewagę w obsłudze skomplikowanych zadań ekstrakcji danych.

## Typowe przypadki użycia i kluczowe korzyści

- **Dokładność**: Wysoka precyzja w przekształcaniu zarówno danych strukturalnych, jak i niestrukturalnych w użyteczne formaty.

- **Prywatność**: Możliwość wdrożenia systemu w centrum danych klienta zapewnia pełne bezpieczeństwo danych.

- **Skalowalność**: Szybkie przetwarzanie dużych wolumenów dokumentów, co umożliwia szybsze podejmowanie decyzji.

## Podsumowanie: Nowa era w pozyskiwaniu wiedzy

Wprowadzenie AnyParser i Epsilli oznacza znaczący postęp w technologii pozyskiwania wiedzy. Łącząc zaawansowane modele ekstrakcji z solidną infrastrukturą RAG, to zintegrowane rozwiązanie nie tylko poprawia dokładność i efektywność, ale także oferuje elastyczność i prywatność, których nowoczesne przedsiębiorstwa wymagają. W miarę jak technologia nadal się rozwija, zastosowania i korzyści tego systemu są ogromne i obiecujące, czyniąc go przełomowym rozwiązaniem dla branż, które polegają na precyzyjnej ekstrakcji danych.

Aby zapoznać się z pełnym szczegółowym dokumentem, sprawdź [ten link](https://www.cambioml.com/research/AnyParser_Epsilla_Whitepaper.pdf).
