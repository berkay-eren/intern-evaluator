# Demo aday form girdileri

Kurgusal üç aday. Production form URL'ine bu değerler girilip yanına aynı adlı PDF yüklenir.
Rubric'in üç eşiğini de göstermek için seçildiler.

| Aday | CV | Beklenen |
|---|---|---|
| Elif Demir | `elif-demir.pdf` | Evet (~80) |
| Mert Aydın | `mert-aydin.pdf` | Belki (~55) |
| Zeynep Kara | `zeynep-kara.pdf` | Hayır (~20) |

Form alanları CV'lerle **tutarlı** yazıldı — model ikisini birlikte okuyor, çelişki olursa
`risks` listesine madde düşer.

---

## 1 — Elif Demir

**Ad Soyad**

```
Elif Demir
```

**Teknolojiler**

```
Python, JavaScript, Node.js, React, PostgreSQL, REST API, Git, Docker, n8n, OpenAI API
```

**Kendini Anlat**

```
Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Geçen yaz OpenAI API'siyle bir Discord botu yazdım; sunucudaki uzun tartışmaları özetleyip günlük bir digest atıyor. İlk versiyonda her mesaj için ayrı istek atıyordum ve hem yavaştı hem pahalıydı, sonra mesajları batch'leyip tek istekte göndermeyi öğrendim, maliyet yaklaşık beşte birine düştü.

Kişisel işlerim için n8n kullanıyorum. Şu an çalışan bir akışım var: takip ettiğim GitHub repolarının release'lerini izleyip bana haftalık özet gönderiyor. n8n'i seçmemin sebebi cron + script yazmak yerine hataları ve retry'ları görsel olarak takip edebilmem.

Son birkaç aydır MCP'yi okuyorum. Modeli her araca ayrı ayrı bağlamak yerine ortak bir protokol tanımlaması mantıklı geldi, kendi makinemde bir filesystem MCP sunucusunu Claude Desktop'a bağlayıp denedim. Henüz kendi sunucumu yazmadım ama sıradaki hedefim bu.

Takıldığımda önce hata mesajını tam olarak okumaya çalışıyorum; anlamsız görünüyorsa isteği curl'e indirgeyip katman katman ayırıyorum. Bu alışkanlığı, bir OAuth akışında iki gün kaybettikten sonra edindim.
```

---

## 2 — Mert Aydın

**Ad Soyad**

```
Mert Aydın
```

**Teknolojiler**

```
Java, Spring Boot, REST API, MySQL, Git, Postman, HTML/CSS
```

**Kendini Anlat**

```
Yazılım Mühendisliği son sınıf öğrencisiyim. Geçen yaz bir fintech şirketinde backend stajı yaptım. Orada Spring Boot ile bir ödeme mutabakat servisinin REST endpoint'lerini yazdım; pagination, hata kodları ve idempotency key konularını iş üstünde öğrendim. Postman koleksiyonlarıyla test etmeye alıştım.

Günlük olarak ChatGPT kullanıyorum, çoğunlukla kod okurken ve hata ayıklarken. Ama API'siyle bir şey geliştirmedim, sadece arayüzünden kullandım. Bu tarafa geçmek istiyorum çünkü staj sırasında ekipteki senior bir arkadaş log'ları otomatik sınıflandıran küçük bir araç yazmıştı ve bana çok pratik gelmişti.

Bitirme projemde bir kütüphane rezervasyon sistemi yapıyorum. Öğrenmeyi genelde dokümantasyon ve resmi tutorial üzerinden yürütüyorum, takıldığım yerde Stack Overflow'a bakıyorum.
```

---

## 3 — Zeynep Kara

**Ad Soyad**

```
Zeynep Kara
```

**Teknolojiler**

```
Excel, Power BI, SQL (temel seviye), MS Office
```

**Kendini Anlat**

```
Endüstri Mühendisliği 2. sınıf öğrencisiyim. Geçen dönem bir lojistik firmasında part-time çalıştım, orada sipariş verilerini Excel'e girip haftalık raporlar hazırlıyordum. Power BI ile basit birkaç görselleştirme yaptım.

Yazılım tarafına ilgim var ama henüz ciddi bir proje yapmadım. Okulda bir dönem Python dersi aldım, temel seviyede döngü ve fonksiyon yazabiliyorum. Staj yaparak sektörü tanımak ve kendimi geliştirmek istiyorum.

Takım çalışmasına yatkınım ve öğrenmeye açığım.
```
