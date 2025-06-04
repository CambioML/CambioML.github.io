---
title: 'Grafik ve Tablolardan Bilgi Elde Etmede Doğruluğu İkiye Katlamak'
date: '2024-12-28'
keywords: 'AnyParser,Epsilla,bilgi elde etme,doküman ayrıştırma,RAG,finansal belgeler,tablo çıkarımı,grafik çıkarımı,görsel dil modelleri,doğruluk'
image: '/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png'
---

![AnyParser ve Epsilla değerlendirme metrikleri Ragas'tan](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Ragas'tan Değerlendirme Metrikleri_

Günümüz veri odaklı ortamında, finansal hizmetler gibi endüstriler, özellikle hem yapılandırılmamış metin hem de tablolar ve grafikler gibi yapılandırılmış veriler içeren belgelerden doğru ve verimli bilgi çıkarımına büyük ölçüde bağımlıdır. Geleneksel Optik Karakter Tanıma (OCR) modelleri, yaygın kullanımına rağmen, karmaşık belge formatlarını işleme konusunda genellikle yetersiz kalmakta ve gelişmiş AI uygulamalarında alt düzey performansa yol açmaktadır. Bu boşluğu fark eden CambioML ve Epsilla, veri çıkarım görevlerinde doğruluğu ve geri çağırmayı önemli ölçüde artırmayı vaat eden yenilikçi bir bilgi elde etme sistemi tanıttı.

## Giriş: OCR Sınırlamalarını Aşmak

OCR tabanlı modeller, metni tespit etmede etkili olsalar da, düzen bilgilerini çıkarmada ve tablolar ile grafiklerden verileri doğru bir şekilde çekmede zorluk yaşamaktadır. Bu sınırlamalar, finans ve sağlık gibi hassasiyetin çok önemli olduğu endüstrilerde özellikle belirgin hale gelmektedir. Bu zorlukları aşmak için, CambioML ve Epsilla, en son teknoloji tablo çıkarım modellerini Geri Alma Artırılmış Üretim (RAG) teknikleri ile birleştiren yenilikçi bir yaklaşım geliştirmiştir. Bu yeni sistem, geleneksel RAG sistemlerine kıyasla %200'e kadar doğruluk ve %250'ye kadar geri çağırma oranı elde ederek belge soru yanıtlama için yeni bir standart belirlemektedir.

## AnyParser: Tablo Çıkarımında Devrim

Bu atılımın merkezinde, çeşitli veri kaynaklarından bilgi çıkarmada mükemmel olan gelişmiş görsel dil modelleri (VLM'ler) ile güçlendirilmiş AnyParser yer almaktadır. Geleneksel modellerin ağır bir şekilde OCR'ye bağımlı olmasının aksine, AnyParser, belgelerden en küçük ayrıntıları yakalamak için görsel ve metin tabanlı kodlayıcıların bir kombinasyonunu kullanarak kritik verilerin kaçırılmamasını sağlamaktadır. Bu yaklaşım, doğruluğun kritik olduğu finansal ve tıbbi belgelerden yüksek çözünürlüklü verilerin çıkarımında özellikle faydalıdır.

## Epsilla: Esnek Bir RAG Platformu

AnyParser'ı tamamlayan Epsilla, çeşitli RAG hatlarını optimize etmek için tasarlanmış, kodsuz bir RAG-as-a-Service platformudur. Epsilla, gelişmiş parça alma, indeksleme ve sorgu iyileştirme teknikleri aracılığıyla bilgi elde etme sürecini geliştirir. Anahtar kelime tabanlı ve anlamsal arama yöntemlerini entegre ederek, Epsilla son derece doğru ve bağlamsal olarak ilgili sonuçlar sunar, bu da onu büyük dil modeli (LLM) uygulamaları için ideal bir çözüm haline getirir.

## Deney ve Değerlendirme: Gerçek Dünya Etkisi

![AnyParser ve Epsilla değerlendirme metrikleri Ragas'tan](/images/solutions/anyparser-epsilla-whitepaper-eval-metrics.png)
_Ragas'tan Değerlendirme Metrikleri_

AnyParser ve Epsilla'nın etkinliğini doğrulamak için, sistem Apple ve Meta gibi şirketlerin 10-K finansal belgeleri üzerinde test edilmiştir. Sonuçlar etkileyiciydi; sistem, bağlam doğruluğu, geri çağırma, sadakat ve cevap doğruluğu gibi tüm ana değerlendirme metriklerinde önemli ölçüde daha yüksek performans göstermiştir. Bazı durumlarda, sistem geleneksel RAG sistemlerini %270 oranında aşarak karmaşık veri çıkarım görevlerini ele almadaki üstünlüğünü vurgulamıştır.

## Yaygın Kullanım Senaryoları ve Ana Faydalar

- **Doğruluk**: Hem yapılandırılmış hem de yapılandırılmamış verilerin kullanılabilir formatlara dönüştürülmesinde yüksek doğruluk.

- **Gizlilik**: Sistemin bir müşterinin veri merkezinde dağıtılabilmesi, tam veri güvenliğini sağlar.

- **Ölçeklenebilirlik**: Büyük belge hacimlerinin hızlı işlenmesi, daha hızlı karar verme yeteneği sağlar.

## Sonuç: Bilgi Elde Etmede Yeni Bir Dönem

AnyParser ve Epsilla'nın tanıtımı, bilgi elde etme teknolojisinde önemli bir ilerlemeyi işaret etmektedir. Gelişmiş çıkarım modellerini sağlam bir RAG altyapısı ile birleştirerek, bu entegre çözüm yalnızca doğruluğu ve verimliliği artırmakla kalmaz, aynı zamanda modern işletmelerin talep ettiği esneklik ve gizliliği de sunar. Teknoloji geliştikçe, bu sistemin uygulamaları ve faydaları geniş ve umut verici olup, hassas veri çıkarımına bağımlı endüstriler için bir oyun değiştirici olmaktadır.

Tam detaylı beyaz kitabı için lütfen [bu bağlantıya](https://www.cambioml.com/research/AnyParser_Epsilla_Whitepaper.pdf) göz atın.
