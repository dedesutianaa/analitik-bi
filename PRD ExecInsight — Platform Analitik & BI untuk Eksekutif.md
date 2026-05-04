# PRD: ExecInsight — Platform Analitik & BI untuk Eksekutif

**Versi** 1.0 (Draft untuk review) · **Tanggal** 22 November 2026 · **Penulis** Product Management · **Status** Menunggu validasi stakeholder

> Catatan: nama produk “ExecInsight” bersifat sementara. Seluruh angka target, baseline, dan estimasi waktu adalah hipotesis awal yang harus divalidasi lewat riset pengguna, audit data, dan diskusi dengan engineering sebelum dikunci.

## 1. Ringkasan Eksekutif

Eksekutif mengambil keputusan bernilai besar dengan data yang terlambat, tersebar di banyak sistem, dan disajikan dalam format yang dirancang untuk analis, bukan untuk pengambil keputusan. ExecInsight adalah platform analitik dan business intelligence yang dirancang khusus untuk C-level, direksi/komisaris, dan tim pendukungnya. Platform ini memberi satu pintu masuk untuk melihat kondisi bisnis dalam hitungan detik, memahami penyebab perubahan, dan menindaklanjutinya bersama tim.

| Aspek | Ringkasan |
| --- | --- |
| Masalah | Laporan manual, definisi metrik tidak seragam, dashboard terlalu teknis, wawasan datang terlambat, dan ketergantungan tinggi pada analis. |
| Solusi | Command center eksekutif dengan KPI terkurasi, drill-down cepat, insight dan peringatan proaktif berbasis AI, pembuat board pack otomatis, serta kolaborasi dan pelacakan tindak lanjut. |
| Pengguna utama | CEO, CFO, COO, CRO/CMO, CHRO, direksi & komisaris, serta Chief of Staff/asisten eksekutif. |
| Pengguna pendukung | Analis BI, data steward, admin TI & keamanan. |
| Hasil yang diharapkan | Time-to-insight < 60 detik, waktu penyusunan board pack turun ≥ 60%, adopsi eksekutif mingguan ≥ 70%, satu sumber kebenaran untuk KPI perusahaan. |
| Prinsip produk | Jawaban dulu (answer-first), tepercaya, proaktif, mobile-first, aman sejak desain, dan kolaboratif. |

## 2. Latar Belakang dan Problem Statement

### 2.1 Kondisi saat ini (hipotesis yang perlu divalidasi lewat wawancara eksekutif)

- **Pelaporan manual dan lambat.** Tim finance, strategi, dan BI menghabiskan berhari-hari menyusun deck bulanan dari spreadsheet dan ekspor sistem. Saat sampai ke eksekutif, data sudah usang.
- **Banyak versi kebenaran.** Angka pendapatan, margin, atau jumlah pelanggan berbeda antar departemen karena definisi dan sumber yang berbeda. Rapat habis untuk memperdebatkan angka, bukan keputusan.
- **Dashboard untuk analis, bukan untuk eksekutif.** Terlalu padat, terlalu banyak filter, dan tidak menjawab “lalu apa artinya bagi saya?”.
- **Reaktif, bukan proaktif.** Masalah baru diketahui pada rapat bulanan, bukan saat mulai terjadi.
- **Pertanyaan lanjutan menunggu berhari-hari.** Pertanyaan seperti “mengapa margin turun di Jawa Barat?” harus lewat tiket ke tim data.
- **Pengalaman mobile buruk.** Eksekutif banyak bergerak, tetapi dashboard hanya nyaman di desktop.
- **Distribusi data tidak aman.** Angka sensitif beredar lewat email, WhatsApp, dan PDF tanpa kontrol akses atau jejak audit.

### 2.2 Problem statement

Eksekutif tidak memiliki cara yang cepat, tepercaya, dan aman untuk memahami kinerja perusahaan hampir secara real-time lalu bertindak berdasarkan data. Akibatnya keputusan tertunda, waktu analis terbuang untuk pekerjaan berulang, dan perusahaan terlambat merespons risiko atau melewatkan peluang.

### 2.3 Mengapa sekarang

- AI generatif memungkinkan tanya-jawab data dengan bahasa natural dan ringkasan naratif otomatis, dengan syarat ada semantic layer yang tepercaya.
- Data warehouse/lakehouse cloud dan konektor siap pakai menurunkan biaya integrasi.
- Ekspektasi eksekutif terhadap pengalaman aplikasi sudah setara aplikasi konsumen: cepat, mobile, dan personal.
- Regulasi pelindungan data (UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi) menuntut kontrol akses dan audit yang lebih ketat.

### 2.4 Lanskap kompetitif (gambaran umum, perlu diverifikasi sebelum dipakai untuk keputusan)

| Kategori | Contoh | Kekuatan | Celah yang diisi ExecInsight |
| --- | --- | --- | --- |
| BI self-service umum | Power BI, Tableau, Qlik, Looker | Fitur luas, ekosistem besar | Kompleks untuk eksekutif; perubahan butuh analis |
| Search/AI analytics | ThoughtSpot, asisten AI di platform BI | Tanya data dengan bahasa natural | Akurasi bergantung semantic layer; belum berfokus pada alur kerja eksekutif |
| Pelaporan keuangan & board pack | Workiva, Datarails, Pigment | Kepatuhan, konsolidasi keuangan | Terbatas di domain keuangan; kurang lintas fungsi |
| Dashboard KPI ringan | Klipfolio, Geckoboard, Metabase | Cepat dipasang | Kurang tata kelola, keamanan, dan kolaborasi level enterprise |
| Spreadsheet + slide manual | Excel, PowerPoint | Fleksibel dan familier | Lambat, rawan salah, tanpa audit, tidak real-time |

## 3. Tujuan, Non-Tujuan, dan Metrik Keberhasilan

### 3.1 Tujuan produk

- **G1 — Kecepatan:** eksekutif memahami kondisi bisnis dalam < 60 detik sejak membuka aplikasi.
- **G2 — Kepercayaan:** satu definisi untuk setiap KPI utama, bersertifikat, dan dapat ditelusuri sampai sumber data.
- **G3 — Proaktif:** anomali dan risiko sampai ke eksekutif sebelum rapat, bukan sesudahnya.
- **G4 — Kemandirian:** eksekutif menjawab pertanyaan lanjutan sendiri tanpa tiket ke tim data.
- **G5 — Efisiensi:** menghapus pekerjaan manual pembuatan laporan dan board pack berulang.
- **G6 — Tindakan:** menghubungkan insight dengan keputusan, penugasan, dan tindak lanjut.
- **G7 — Aman:** data sensitif hanya tersaji kepada yang berhak, dengan jejak audit penuh.

### 3.2 Non-tujuan (versi 1.0)

- Bukan pengganti alat BI self-service penuh untuk analis. Analis tetap memakai alat mereka, sementara ExecInsight mengonsumsi semantic layer yang sama.
- Bukan sistem perencanaan/anggaran penuh (FP&A/EPM); hanya impor target dan simulasi what-if ringan.
- Bukan alat ETL/data engineering; platform memakai pipeline dan warehouse yang sudah ada atau disediakan tim data.
- Bukan sistem transaksi atau alur persetujuan formal (approval) ala ERP.
- Tidak membuat keputusan otomatis; AI hanya merekomendasikan, manusia yang memutuskan.

### 3.3 Metrik keberhasilan

| Metrik | Definisi | Baseline (diukur saat discovery) | Target 6 bulan setelah GA |
| --- | --- | --- | --- |
| **North Star: Executive Weekly Active Rate (EWAR)** | % eksekutif target yang aktif ≥ 3 hari per minggu | 0% (produk baru) | ≥ 70% |
| Time-to-insight | Median waktu dari membuka aplikasi sampai menemukan jawaban atas sebuah pertanyaan | Diukur lewat observasi (perkiraan 10–30 menit) | < 60 detik |
| Pengurangan laporan manual | Jumlah laporan/deck berkala yang tergantikan | Inventaris laporan saat discovery | ≥ 50% |
| Waktu penyusunan board pack | Jam kerja tim per siklus | Diukur saat discovery | Turun ≥ 60% |
| Kepercayaan data | Skor survei “Saya percaya angka di ExecInsight” (1–5) | n/a | ≥ 4,2 |
| Akurasi Tanya Data | % jawaban benar pada benchmark 200 pertanyaan eksekutif | n/a | ≥ 90% |
| Tindak lanjut anomali | % anomali kritis yang direspons dalam 24 jam | n/a | ≥ 80% |
| Kinerja dashboard | Waktu muat p95 beranda | n/a | < 3 detik |
| Kesegaran data | % KPI yang memenuhi SLA freshness | n/a | ≥ 95% |
| Kepuasan | NPS eksekutif | n/a | ≥ 40 |
| Keamanan | Insiden kebocoran data akibat produk | n/a | 0 |

**Metrik pengaman (guardrail):** tingkat opt-out notifikasi < 15% (mencegah alert fatigue), biaya komputasi per pengguna aktif sesuai anggaran, dan rasio jawaban AI yang ditandai salah < 5%.

## 4. Target Pengguna dan Persona

| Persona | Kebutuhan utama | Pertanyaan khas | Frekuensi | Perangkat utama |
| --- | --- | --- | --- | --- |
| CEO / Direktur Utama | Gambaran menyeluruh, risiko utama, progres strategi | “Apakah kita on track terhadap target tahun ini? Apa yang perlu saya perhatikan hari ini?” | Harian | Ponsel, tablet |
| CFO | Kas, profitabilitas, varians anggaran, forecast | “Mengapa EBITDA di bawah target dan berapa proyeksinya di akhir kuartal?” | Harian | Laptop, ponsel |
| COO | Kinerja operasi, produktivitas, SLA, rantai pasok | “Cabang mana yang di bawah standar layanan minggu ini?” | Harian | Laptop, tablet |
| CRO / CMO | Pipeline, konversi, CAC, retensi, kinerja kanal | “Kanal mana yang menurunkan konversi bulan ini?” | Harian–mingguan | Laptop, ponsel |
| CHRO | Headcount, attrition, produktivitas, biaya SDM | “Unit mana yang attrition-nya tertinggi?” | Mingguan | Laptop |
| Direksi & Komisaris | Ringkasan kinerja, risiko, kepatuhan, board pack | “Apa isu utama sebelum rapat direksi?” | Bulanan–kuartalan | Tablet, laptop |
| Chief of Staff / Asisten Eksekutif (delegate) | Menyiapkan briefing dan board pack, memantau tindak lanjut | “Bisakah materi rapat besok siap otomatis dan konsisten?” | Harian | Laptop |
| Analis BI / Data Steward (pendukung) | Mengelola KPI, kualitas data, hak akses | “Bagaimana menjaga definisi KPI tetap konsisten?” | Harian | Laptop |
| Admin TI & Keamanan (pendukung) | Provisioning, SSO, audit, kepatuhan | “Siapa mengakses data apa dan kapan?” | Berkala | Laptop |

**Jobs to be done utama**

1. Ketika memulai hari, saya ingin melihat apa yang berubah dan apa yang butuh perhatian, agar fokus pada hal yang penting.
2. Ketika sebuah angka menyimpang, saya ingin tahu penyebabnya tanpa menunggu analis, agar bisa bertindak cepat.
3. Ketika menyiapkan rapat direksi, saya ingin materi yang akurat dan konsisten tersusun otomatis, agar tidak menghabiskan waktu merapikan slide.
4. Ketika memberi arahan, saya ingin tindak lanjutnya tercatat dan terpantau, agar keputusan benar-benar dieksekusi.
5. Ketika bepergian, saya ingin akses yang aman dan cepat dari ponsel, bahkan dengan koneksi lemah.

## 5. Skenario Penggunaan Utama

**S1 — Briefing pagi 3 menit (CEO, ponsel).** Notifikasi ringkasan harian tiba pukul 07:00, eksekutif membuka beranda, membaca ringkasan naratif dan 3 item “Perlu Perhatian Anda”, mengetuk satu anomali untuk melihat penyebabnya, lalu menandainya untuk dibahas dengan COO. *Hasil:* paham kondisi bisnis dan prioritas hari itu dalam < 3 menit.

**S2 — Anomali, penyebab, tindakan (CFO).** Sistem mendeteksi penurunan margin kotor 2,3 poin dan mengirim peringatan beserta perkiraan penyebab. CFO membuka analisis kontribusi (produk, wilayah, pemasok), menemukan kenaikan biaya bahan baku di satu pemasok, menambahkan komentar, dan menugaskan tindak lanjut ke Kepala Pengadaan dengan tenggat. *Hasil:* masalah terdeteksi di hari yang sama dan punya pemilik tindak lanjut.

**S3 — Persiapan rapat direksi (Chief of Staff).** Memilih templat board pack, periode, dan bagian laporan. Sistem mengisi grafik, tabel, dan narasi dari data terkini. Chief of Staff meninjau, mengedit, menambahkan komentar manajemen; CFO menyetujui; hasilnya diekspor ke PPTX/PDF atau dibagikan lewat ruang aman (secure portal) untuk direksi. *Hasil:* persiapan dari beberapa hari menjadi beberapa jam.

**S4 — Business review bulanan lintas fungsi (COO).** Membuka mode presentasi, menelusuri scorecard perusahaan sampai divisi, membandingkan realisasi vs target vs tahun lalu, dan mencatat keputusan serta action item langsung selama rapat. *Hasil:* rapat fokus pada keputusan dan semua tindak lanjut tercatat.

**S5 — Tanya data saat rapat (CRO).** Mengetik atau mengucapkan “Berapa pertumbuhan pendapatan segmen enterprise kuartal ini dibanding kuartal lalu, per wilayah?”, mendapat angka, grafik, dan definisi metrik dalam hitungan detik, lalu bertanya lanjutan “Apa penyebab terbesarnya di Kalimantan?”. *Hasil:* keputusan di tempat tanpa menunda rapat.

**S6 — Simulasi what-if (CEO dan CFO).** Mengubah asumsi harga +3% dan volume −2%, melihat dampaknya pada pendapatan dan margin di skenario baseline/optimis/pesimis, lalu menyimpan skenario dan membagikannya ke tim strategi. *Hasil:* diskusi strategi berbasis angka dengan asumsi yang transparan.

## 6. Ruang Lingkup dan Prioritas Rilis

**Definisi prioritas:** **P0** wajib untuk MVP (tanpa ini produk tidak bernilai); **P1** wajib untuk rilis GA/V1.0; **P2** peningkatan untuk V1.x–V2.0.

| Rilis | Fokus | Cakupan utama |
| --- | --- | --- |
| MVP (pilot 15–30 eksekutif) | Nilai inti: lihat, percaya, telusuri | Beranda eksekutif, katalog KPI terkurasi (30–50 KPI), 3 dashboard domain (Keuangan, Penjualan, Operasi), drill-down dasar, peringatan ambang batas, ringkasan harian, mobile web responsif, SSO + RBAC + RLS, 4–6 konektor prioritas, Tanya Data terbatas pada KPI terkurasi |
| V1.0 (GA) | Proaktif dan kolaboratif | Deteksi anomali, analisis penyebab, narasi AI, forecasting, board pack builder, komentar dan action tracker, aplikasi mobile native, dashboard builder no-code, 8 domain dashboard, bilingual ID/EN, audit log lengkap, konektor tambahan |
| V2.0 | Cerdas dan terbuka | What-if, rekomendasi tindakan, OKR, benchmark, voice, embedded analytics dan API publik, personalisasi lanjut, otomasi lintas sistem |

**Dalam cakupan:** konsumsi data dari sumber yang ada, semantic layer dan katalog KPI, aplikasi web dan mobile, AI insight, alert, pelaporan, kolaborasi, keamanan, dan administrasi.

**Di luar cakupan:** membangun data warehouse dari nol (diasumsikan sudah ada atau dikerjakan proyek paralel), perencanaan anggaran penuh, alur persetujuan formal, dan analitik data tidak terstruktur skala besar (mis. analisis dokumen kontrak).

## 7. Kebutuhan Fungsional

Setiap kebutuhan memiliki ID unik (FR-modul-nomor), prioritas, dan kriteria penerimaan ringkas yang dapat diuji. Kriteria rinci dan desain akan dilengkapi pada spesifikasi fitur masing-masing.

### 7.1 Executive Home (Command Center)

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-HOME-01 | Beranda personal berisi 6–12 kartu Headline KPI: nilai, sparkline tren, delta vs pembanding, dan status RAG (merah/kuning/hijau) | P0 | Kondisi bisnis terlihat tanpa scroll di laptop dan ponsel; setiap kartu menampilkan waktu pembaruan data terakhir |
| FR-HOME-02 | Bagian “Perlu Perhatian Anda”: anomali, KPI di luar target, dan tindak lanjut jatuh tempo | P0 | Maksimal 5 item, diurutkan berdasarkan dampak; satu ketukan membuka drill-down |
| FR-HOME-03 | Selektor periode global (hari ini, WTD, MTD, QTD, YTD, kustom, kalender fiskal) dan pembanding (vs target, periode lalu, tahun lalu) | P0 | Seluruh kartu dan grafik mengikuti periode terpilih; pilihan tersimpan per pengguna |
| FR-HOME-04 | Ringkasan naratif AI “Apa yang berubah sejak terakhir Anda buka?” | P1 | ≤ 150 kata; setiap angka berlink ke sumber dan definisinya |
| FR-HOME-05 | Personalisasi: pilih, susun ulang kartu, dan simpan beberapa Tampilan (Harian, Mingguan, Board) | P1 | Pengguna dapat membuat ≥ 3 tampilan dan berpindah dalam 1 ketukan |
| FR-HOME-06 | Mode Presentasi layar penuh untuk rapat (tata letak bersih, font besar, navigasi dengan keyboard/remote) | P1 | Dapat diakses dari beranda dan dashboard mana pun; tanpa elemen navigasi yang mengganggu |
| FR-HOME-07 | Favorit, riwayat terakhir dilihat, dan pencarian global (KPI, dashboard, laporan, komentar) | P1 | Hasil pencarian muncul < 1 detik dan hanya menampilkan item yang berhak diakses |

### 7.2 Katalog KPI, Scorecard, dan Target

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-KPI-01 | Katalog KPI terpusat: definisi, rumus, pemilik, sumber, frekuensi pembaruan, status sertifikasi, dan riwayat versi | P0 | Setiap KPI di beranda memiliki halaman definisi yang dapat dibuka dari ikon info |
| FR-KPI-02 | Target dan anggaran: impor target (tahunan/bulanan), forecast, dan stretch target, dengan versi | P0 | Impor CSV/Excel dan API; realisasi vs target tampil otomatis |
| FR-KPI-03 | Aturan status RAG yang dapat dikonfigurasi per KPI (ambang, arah baik/buruk, toleransi) | P0 | Perubahan aturan tercatat di audit log dan berlaku tanpa deploy |
| FR-KPI-04 | Scorecard berjenjang (perusahaan, divisi, unit) dengan pohon driver (driver tree) | P1 | Eksekutif dapat menelusuri dari KPI puncak ke driver penyusunnya dalam ≤ 3 klik |
| FR-KPI-05 | Kepemilikan KPI: setiap KPI punya pemilik bisnis dan data steward; pemilik menerima notifikasi bila KPI-nya merah | P1 | Pemilik dapat memberi komentar penjelasan yang tampil pada kartu KPI |
| FR-KPI-06 | Dukungan OKR: tautkan KPI ke Objective dan Key Result dengan progres otomatis | P2 | Progres OKR terhitung dari data KPI tanpa input manual |
| FR-KPI-07 | Benchmark internal (antar cabang/unit bisnis) dan opsional benchmark eksternal | P2 | Peringkat dan persentil tampil dengan dasar pembanding yang jelas |

### 7.3 Dashboard Eksekutif dan Visualisasi

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-DASH-01 | Dashboard siap pakai per domain: Keuangan, Penjualan & Pendapatan, Operasi & Rantai Pasok (P0); Pemasaran, Pelanggan, SDM, Risiko & Kepatuhan, Portofolio Strategis/Proyek (P1) | P0/P1 | Setiap dashboard menjawab ≤ 5 pertanyaan kunci domain dan memuat dalam < 3 detik (p95) |
| FR-DASH-02 | Pustaka visualisasi: kartu KPI, garis, batang, area, waterfall/bridge, funnel, peta Indonesia (provinsi hingga kota/kabupaten), heatmap, treemap, bullet chart, tabel pivot, sankey | P0/P1 | Visual dasar di MVP; visual lanjutan di GA; semua mendukung tooltip, legenda, dan ekspor gambar |
| FR-DASH-03 | Filter global, cross-filter antar widget, dan filter tersimpan | P0 | Memilih satu elemen pada grafik memfilter widget lain; filter dapat disimpan dan dibagikan |
| FR-DASH-04 | Format angka lokal: Rp, ribu/juta/miliar/triliun, pemisah ribuan titik dan desimal koma, multi-mata uang dengan kurs terkelola | P0 | Satuan dan pembulatan konsisten di seluruh produk; konversi kurs menampilkan tanggal kurs |
| FR-DASH-05 | Dashboard builder drag-and-drop tanpa kode dengan templat dan komponen terstandar | P1 | Chief of Staff dapat membuat dashboard baru dari templat dalam < 15 menit tanpa bantuan analis |
| FR-DASH-06 | Anotasi otomatis pada grafik untuk peristiwa penting (promo, gangguan sistem, regulasi, libur nasional) | P1 | Peristiwa dapat diimpor dan ditambahkan manual; tampil sebagai penanda pada sumbu waktu |
| FR-DASH-07 | Tema dan branding perusahaan, mode terang/gelap, palet ramah buta warna | P1 | Status tidak hanya dibedakan lewat warna (ikon/label ikut tampil) |

### 7.4 Drill-down dan Eksplorasi

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-EXP-01 | Drill-down hierarkis (Total, Wilayah, Cabang, Produk, Transaksi) | P0 | Mencapai level terdalam yang diizinkan dalam ≤ 3 klik; breadcrumb selalu terlihat |
| FR-EXP-02 | Perbandingan waktu: MoM, QoQ, YoY, YTD vs PYTD, rolling 7/30/90 hari | P0 | Pembanding dapat diganti dalam 1 klik dan selaras dengan kalender fiskal |
| FR-EXP-03 | Analisis penyebab (variance/contribution analysis) “Mengapa metrik ini berubah?” | P1 | Menampilkan dimensi dengan kontribusi terbesar terhadap perubahan beserta ukuran dampaknya |
| FR-EXP-04 | Waterfall/bridge otomatis (mis. laba bulan lalu ke laba bulan ini berdasarkan driver) | P1 | Total bridge sama dengan selisih KPI; driver dapat didrill |
| FR-EXP-05 | Eksplorasi ad hoc (slice & dice, pivot) hanya dengan dimensi dan metrik yang disetujui semantic layer | P1 | Pengguna membangun pivot sendiri tanpa menulis SQL; hasil konsisten dengan dashboard resmi |
| FR-EXP-06 | Drill-through ke data transaksi sesuai hak akses, dengan ekspor terbatas | P1 | Ekspor melewati kebijakan DLP dan tercatat pada audit log |
| FR-EXP-07 | Analisis kohort, segmentasi, dan retensi | P2 | Kohort dapat didefinisikan dari atribut pelanggan/produk dan dibandingkan lintas waktu |

### 7.5 Insight AI, Tanya Data, dan Prediksi

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-AI-01 | Tanya Data (natural language query) dalam Bahasa Indonesia dan Inggris; pertanyaan menghasilkan angka, grafik, dan penjelasan | P0 | MVP terbatas pada KPI terkurasi; akurasi ≥ 90% pada benchmark 200 pertanyaan; jawaban menyebut metrik, filter, dan periode yang dipakai |
| FR-AI-02 | Keterlacakan (explainability): setiap jawaban atau insight AI menampilkan definisi metrik, filter/query, sumber, dan waktu data | P0 | Tombol “Lihat dasar jawaban” tersedia di semua output AI |
| FR-AI-03 | Jawaban hanya bersumber dari semantic layer; bila pertanyaan ambigu atau di luar cakupan, sistem meminta klarifikasi atau menjawab tidak tahu | P0 | Pada uji adversarial, 0 jawaban berisi angka yang tidak ada di sumber |
| FR-AI-04 | Deteksi anomali otomatis (sadar musiman dan hari libur) dengan skor keparahan dan perkiraan penyebab | P1 | Presisi ≥ 70% dan recall ≥ 80% pada set anomali berlabel; false positive dapat ditandai dan dipelajari |
| FR-AI-05 | Narasi otomatis (executive summary) untuk dashboard dan laporan, dengan pilihan bahasa dan gaya (ringkas, formal, detail) | P1 | Narasi konsisten dengan angka di layar; pemeriksaan otomatis mencocokkan setiap angka dengan sumbernya |
| FR-AI-06 | Pertanyaan lanjutan kontekstual (percakapan multi-giliran) dan pertanyaan favorit | P1 | Konteks periode, filter, dan metrik terbawa pada pertanyaan berikutnya |
| FR-AI-07 | Forecasting deret waktu dengan interval kepercayaan, skenario baseline/optimis/pesimis, dan metrik akurasi (mis. MAPE) | P1 | Model dibandingkan dengan baseline naif; akurasi backtest ditampilkan kepada pengguna |
| FR-AI-08 | Simulasi what-if: ubah asumsi (harga, volume, biaya, headcount) dan lihat dampaknya pada KPI | P2 | Asumsi, rumus, dan hasil dapat disimpan, dibagikan, dan ditelusuri |
| FR-AI-09 | Rekomendasi tindakan berikutnya berdasarkan pola historis dan playbook perusahaan | P2 | Setiap rekomendasi menyertakan alasan dan bukti data; eksekutif dapat menolak atau menerima |
| FR-AI-10 | Guardrail AI: patuh pada hak akses pengguna, data tidak dipakai melatih model pihak ketiga, log prompt dan respons untuk audit, umpan balik jempol atas/bawah | P0 | Uji penetrasi prompt injection dan kebocoran lintas hak akses lulus sebelum rilis |
| FR-AI-11 | Tanya dengan suara dan briefing audio di mobile | P2 | Dukungan Bahasa Indonesia dengan tingkat kesalahan pengenalan sesuai ambang yang disepakati |

### 7.6 Peringatan dan Notifikasi

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-ALR-01 | Peringatan berbasis ambang batas, perubahan persentase, dan penyimpangan dari target, dikonfigurasi tanpa kode | P0 | Aturan dibuat dalam < 2 menit; peringatan terkirim dalam ≤ 5 menit setelah data memenuhi kondisi |
| FR-ALR-02 | Peringatan anomali cerdas dengan penekanan duplikasi dan pengelompokan agar tidak membanjiri | P1 | Maksimal 1 notifikasi gabungan per kejadian terkait; batas harian per pengguna dapat diatur |
| FR-ALR-03 | Kanal: push mobile dan email (P0); Slack, Microsoft Teams, dan WhatsApp Business sesuai kebijakan perusahaan (P1); SMS untuk kejadian kritis (P1) | P0/P1 | Kanal dan tingkat keparahan dapat dipilih per pengguna |
| FR-ALR-04 | Ringkasan berkala (digest) harian/mingguan dengan jadwal dan jam tenang (quiet hours) | P0 | Digest terkirim tepat waktu sesuai zona waktu pengguna |
| FR-ALR-05 | Setiap peringatan berisi konteks: nilai, ambang, tren, perkiraan penyebab, tautan drill-down, dan aksi Acknowledge/Tugaskan | P1 | Eksekutif dapat bertindak langsung dari notifikasi |
| FR-ALR-06 | Eskalasi otomatis ke atasan atau pemilik cadangan bila peringatan kritis tidak diakui dalam waktu tertentu | P1 | Aturan eskalasi dapat diatur per KPI dan tercatat di audit log |
| FR-ALR-07 | Langganan: eksekutif memilih KPI dan tingkat keparahan; pemilik KPI mengelola aturan standar | P0 | Pengguna dapat berhenti berlangganan dalam 1 ketukan |
| FR-ALR-08 | Riwayat dan status peringatan (baru, diakui, ditugaskan, selesai, false positive) untuk menyetel akurasi | P1 | Laporan false positive rate per aturan tersedia bagi admin |

### 7.7 Briefing, Pelaporan, dan Board Pack

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-RPT-01 | Ringkasan harian/mingguan otomatis (briefing) via email dan push, berisi KPI utama, perubahan penting, dan item perhatian | P0 | Dapat dikonfigurasi per peran; tautan membuka tampilan terkait |
| FR-RPT-02 | Jadwal pengiriman laporan (harian, mingguan, bulanan, berbasis kejadian) ke penerima internal sesuai hak akses masing-masing | P0 | Setiap penerima hanya menerima data yang berhak ia lihat |
| FR-RPT-03 | Pembuat board pack: templat (bulanan, kuartalan, RUPS, komite), bagian yang dapat disusun ulang, terisi otomatis dari data terkini | P1 | Board pack lengkap dihasilkan dalam < 10 menit dari templat |
| FR-RPT-04 | Komentar manajemen per bagian dengan alur draf, review, dan persetujuan, serta penguncian versi | P1 | Riwayat revisi dan penyetuju tercatat; versi final tidak berubah |
| FR-RPT-05 | Ekspor PDF (P0), PPTX dan XLSX (P1) dengan branding perusahaan; grafik tetap dapat diedit di PPTX bila memungkinkan | P0/P1 | Ekspor mempertahankan format angka, satuan, dan catatan kaki |
| FR-RPT-06 | Ruang aman (secure portal) untuk direksi/komisaris: akses terbatas waktu, watermark dinamis, opsi larangan unduh, tautan kedaluwarsa | P1 | Seluruh akses ke portal tercatat dan dapat dicabut seketika |
| FR-RPT-07 | Snapshot dan arsip: angka dibekukan pada tanggal tutup buku agar laporan tidak berubah secara retroaktif | P1 | Laporan lama selalu menampilkan angka saat dibuat, dengan penanda jika data sumber direvisi |
| FR-RPT-08 | Perbandingan antar periode laporan (apa yang berubah sejak board pack sebelumnya) | P2 | Perubahan signifikan disorot otomatis |

### 7.8 Kolaborasi dan Tindak Lanjut

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-COL-01 | Komentar pada KPI, grafik, dan titik data dengan @mention dan notifikasi | P0 | Penerima mention hanya dapat membuka konteks yang berhak ia akses |
| FR-COL-02 | Anotasi privat atau bersama pada grafik | P1 | Anotasi ikut tampil pada ekspor jika dipilih |
| FR-COL-03 | Action tracker: ubah komentar atau insight menjadi tugas dengan pemilik, tenggat, dan status; integrasi Jira, Asana, atau Microsoft Planner | P1 | Tugas tersinkron dua arah; tugas jatuh tempo muncul di “Perlu Perhatian Anda” |
| FR-COL-04 | Decision log: catat keputusan, alasan, snapshot data pendukung, dan hasil di kemudian hari | P1 | Keputusan dapat dicari dan ditautkan ke KPI terkait |
| FR-COL-05 | Berbagi aman: bagikan tampilan beserta filter ke pengguna atau grup internal | P0 | Penerima hanya melihat data sesuai hak aksesnya, bukan hak pengirim |
| FR-COL-06 | Delegasi: eksekutif memberi asisten akses delegasi untuk menyiapkan tampilan dan briefing atas namanya | P1 | Aksi delegasi tercatat terpisah di audit log dan dapat dicabut kapan saja |
| FR-COL-07 | Mode rapat: tampilan bersama, catatan rapat, dan action item otomatis | P2 | Catatan rapat tertaut ke tampilan yang dibahas |
| FR-COL-08 | Integrasi Slack/Teams: pratinjau tautan dan tanya data langsung dari obrolan | P2 | Hak akses tetap ditegakkan di dalam obrolan |

### 7.9 Mobile dan Offline

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-MOB-01 | Mobile web responsif sejak MVP; aplikasi native iOS dan Android pada GA | P0/P1 | Seluruh fitur eksekutif inti tersedia di ponsel dan tablet |
| FR-MOB-02 | Desain mobile-first: kartu KPI ringkas, gestur, mode lanskap untuk grafik | P0 | Tugas utama selesai dengan satu tangan; uji usabilitas dengan eksekutif lulus |
| FR-MOB-03 | Cache dan mode offline: data terakhir yang tersinkron dapat dibaca tanpa koneksi | P1 | Penanda waktu sinkron selalu terlihat; data offline terenkripsi |
| FR-MOB-04 | Autentikasi biometrik (Face ID/sidik jari) dan MFA | P1 | Biometrik dapat dinonaktifkan oleh kebijakan admin |
| FR-MOB-05 | Keamanan perangkat: hapus data jarak jauh, deteksi jailbreak/root, dukungan MDM/MAM, blokir screenshot opsional | P1 | Perangkat tidak patuh otomatis diblokir sesuai kebijakan |
| FR-MOB-06 | Performa: aplikasi siap dipakai ≤ 2 detik pada koneksi 4G, hemat data | P1 | Diukur pada perangkat referensi kelas menengah |
| FR-MOB-07 | Widget layar kunci/beranda untuk KPI pilihan | P2 | Widget memperbarui data sesuai jadwal dan tidak menampilkan data bila perangkat terkunci (opsional) |

### 7.10 Integrasi Data dan Konektor

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-INT-01 | Konektor data warehouse/lakehouse dan database: BigQuery, Snowflake, Redshift, Databricks, Azure Synapse/Fabric, PostgreSQL, MySQL, SQL Server, Oracle | P0 | Minimal 2 konektor di MVP sesuai stack klien; koneksi aman lewat jaringan privat |
| FR-INT-02 | Konektor aplikasi bisnis: ERP (SAP, Oracle, Microsoft Dynamics, Odoo, Accurate), CRM (Salesforce, HubSpot, Zoho), HRIS (Workday, SuccessFactors, Mekari Talenta), akuntansi (mis. Mekari Jurnal), POS/e-commerce | P0/P1 | 4–6 konektor prioritas di MVP berdasarkan hasil audit sistem; sisanya bertahap |
| FR-INT-03 | Konektor spreadsheet dan file: Excel, Google Sheets, CSV, dengan validasi skema | P0 | Kegagalan validasi tidak merusak KPI; pemilik data mendapat notifikasi |
| FR-INT-04 | Konektor pemasaran dan layanan: Google Analytics, Meta/Google Ads, Zendesk, ServiceNow, sistem logistik | P1 | Kuota API dikelola dan tidak mengganggu sistem sumber |
| FR-INT-05 | Mode query per dataset: live query atau extract/cache terjadwal | P0 | Pilihan memengaruhi biaya dan kesegaran dengan indikator jelas |
| FR-INT-06 | SLA kesegaran (freshness) per dataset (real-time, per jam, harian) dengan indikator status | P0 | Keterlambatan memunculkan banner pada KPI terdampak |
| FR-INT-07 | Multi-entitas: konsolidasi anak perusahaan, eliminasi antar-entitas, multi-mata uang, kalender fiskal berbeda | P1 | Konsolidasi cocok dengan laporan keuangan resmi dalam toleransi yang disepakati |
| FR-INT-08 | Konektor generik: REST/GraphQL API, webhook, SFTP, dan SDK konektor kustom | P1 | Dokumentasi dan contoh kode tersedia |
| FR-INT-09 | Pemantauan pipeline: status, kegagalan, dan daftar KPI yang terdampak | P1 | Admin dan pemilik KPI mendapat peringatan otomatis |

### 7.11 Semantic Layer dan Tata Kelola Data

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-GOV-01 | Semantic layer terpusat: metrik dan dimensi didefinisikan sekali lalu dipakai oleh dashboard, Tanya Data, dan alat BI lain (via API/SQL) | P0 | Angka KPI identik di semua kanal untuk query yang sama |
| FR-GOV-02 | Sertifikasi KPI (draf, review, bersertifikat, usang) dengan lencana kepercayaan pada kartu | P0 | Hanya KPI bersertifikat yang boleh masuk beranda eksekutif dan board pack |
| FR-GOV-03 | Garis keturunan data (lineage) dari kartu KPI sampai tabel dan sistem sumber | P1 | Analisis dampak menunjukkan KPI dan dashboard yang terpengaruh perubahan hulu |
| FR-GOV-04 | Aturan kualitas data (kelengkapan, keunikan, rentang nilai, rekonsiliasi) dan skor kualitas per dataset | P1 | Dataset yang gagal uji kritis menandai KPI terkait sebagai “perlu verifikasi” |
| FR-GOV-05 | Banner peringatan otomatis pada KPI bila data terlambat atau gagal uji kualitas | P0 | Banner tampil di web, mobile, ekspor, dan jawaban AI |
| FR-GOV-06 | Alur perubahan definisi KPI: usulan, persetujuan, versi, dan notifikasi dampak | P1 | Riwayat definisi dapat ditinjau; perubahan tidak mengubah laporan terarsip |
| FR-GOV-07 | Glosarium bisnis dan sinonim (mis. “omzet” = “pendapatan”) untuk meningkatkan akurasi Tanya Data | P0 | Glosarium dikelola data steward dan dipakai oleh mesin pencarian dan AI |
| FR-GOV-08 | Rekonsiliasi angka dengan sumber resmi (mis. laporan keuangan) dengan indikator selisih | P1 | Selisih di atas toleransi memicu peringatan ke pemilik KPI |
| FR-GOV-09 | Klasifikasi data (publik, internal, rahasia, sangat rahasia) yang mengatur aturan berbagi dan ekspor | P1 | Kebijakan berbagi dan ekspor otomatis mengikuti klasifikasi |

### 7.12 Keamanan, Akses, dan Kepatuhan

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-SEC-01 | SSO (SAML 2.0/OIDC) dengan IdP perusahaan (Microsoft Entra ID, Okta, Google) dan provisioning SCIM | P0 | Pengguna baru/keluar otomatis diberi/dicabut akses |
| FR-SEC-02 | MFA wajib untuk akses dari luar jaringan korporat dan perangkat baru | P0 | Kebijakan dapat diatur admin |
| FR-SEC-03 | RBAC berbasis peran dan grup (CEO, CFO, direksi, komisaris, delegate, dan sebagainya) | P0 | Matriks peran terdokumentasi dan teruji |
| FR-SEC-04 | Row-level security (mis. COO wilayah hanya melihat wilayahnya) dan column-level security/masking (mis. gaji, data pribadi) | P0 | Uji otomatis memastikan tidak ada kebocoran lintas hak akses di dashboard, AI, ekspor, dan notifikasi |
| FR-SEC-05 | Enkripsi in transit (TLS 1.2+) dan at rest (AES-256), manajemen kunci dengan opsi BYOK | P0/P2 | BYOK tersedia pada V2.0 untuk pelanggan yang memerlukan |
| FR-SEC-06 | Audit log yang tidak dapat diubah: siapa melihat, mengekspor, membagikan, atau mengubah apa dan kapan; dapat diekspor ke SIEM | P0 | Retensi log sesuai kebijakan; pencarian log < 5 detik |
| FR-SEC-07 | Kebijakan DLP: watermark dinamis, pembatasan unduh/cetak/ekspor menurut klasifikasi, tautan kedaluwarsa | P1 | Pelanggaran kebijakan diblokir dan tercatat |
| FR-SEC-08 | Kepatuhan: mendukung pemenuhan UU PDP (UU No. 27 Tahun 2022), opsi residensi data di Indonesia, target sertifikasi ISO/IEC 27001 dan SOC 2 Type II, kontrol tambahan untuk sektor teregulasi (mis. ketentuan OJK untuk jasa keuangan, bila relevan) | P0/P1 | Pemetaan kontrol ditinjau tim legal dan keamanan sebelum GA |
| FR-SEC-09 | Manajemen sesi: batas waktu sesi, pembatasan IP/geografi, pencabutan sesi jarak jauh | P1 | Admin dapat mengakhiri sesi pengguna seketika |
| FR-SEC-10 | Penanganan data pribadi: minimisasi data, retensi dan penghapusan sesuai kebijakan, dukungan permintaan hak subjek data | P1 | Proses terdokumentasi dan dapat diaudit |
| FR-SEC-11 | Akses darurat (break-glass) dengan persetujuan dan audit khusus | P2 | Setiap penggunaan memicu notifikasi ke tim keamanan |
| FR-SEC-12 | Pengujian keamanan: penetration test sebelum GA dan tahunan, pemindaian dependensi, kebijakan responsible disclosure | P1 | Temuan kritis/tinggi ditutup sebelum rilis |

### 7.13 Administrasi dan Observabilitas

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-ADM-01 | Konsol admin: pengguna, grup, peran, dan kebijakan | P0 | Semua pengaturan utama dapat diubah tanpa bantuan engineering |
| FR-ADM-02 | Dashboard penggunaan dan adopsi: siapa aktif, fitur populer, KPI yang paling sering dibuka | P1 | Data adopsi per persona dan per unit tersedia untuk tim produk dan sponsor |
| FR-ADM-03 | Siklus hidup konten: draf, publikasi, arsip, kepemilikan, dan pembersihan dashboard tak terpakai | P1 | Konten tanpa pemilik atau tidak dibuka 90 hari ditandai untuk ditinjau |
| FR-ADM-04 | Lingkungan dev/staging/produksi dan promosi konfigurasi (analytics-as-code dengan kontrol versi) | P1 | Perubahan dapat di-rollback |
| FR-ADM-05 | Kontrol biaya dan kuota komputasi (batas query, cache) serta laporan biaya per unit bisnis | P1 | Peringatan saat konsumsi mendekati anggaran |
| FR-ADM-06 | Observabilitas: kesehatan layanan, latensi query, error rate, dan halaman status | P0 | Peringatan on-call otomatis saat SLO terlampaui |
| FR-ADM-07 | Multi-tenant/multi-unit bisnis dengan isolasi data (untuk holding atau grup usaha) | P2 | Isolasi teruji dan tidak ada kebocoran antar tenant |

### 7.14 Personalisasi, Lokalisasi, dan Aksesibilitas

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-UX-01 | Antarmuka Bahasa Indonesia (P0) dan Inggris (P1), termasuk Tanya Data dan narasi AI | P0/P1 | Pengguna dapat berpindah bahasa tanpa kehilangan konteks |
| FR-UX-02 | Zona waktu (WIB/WITA/WIT), kalender fiskal kustom, dan hari libur nasional Indonesia | P0 | Perbandingan periode memperhitungkan jumlah hari kerja bila diminta |
| FR-UX-03 | Aksesibilitas WCAG 2.1 AA: kontras, navigasi keyboard, pembaca layar, teks alternatif | P1 | Audit aksesibilitas independen lulus sebelum GA |
| FR-UX-04 | Onboarding eksekutif: tur singkat ≤ 5 menit, tampilan awal berdasarkan peran, contoh pertanyaan | P0 | Eksekutif baru mencapai nilai pertama (melihat KPI sendiri) dalam ≤ 10 menit |
| FR-UX-05 | Bantuan kontekstual dan umpan balik dalam aplikasi (mis. “Angka ini salah?”) yang diteruskan ke pemilik KPI | P1 | Pemilik KPI menerima laporan dan wajib merespons dalam SLA yang ditetapkan |
| FR-UX-06 | Preferensi notifikasi, jam tenang, dan kepadatan tampilan/ukuran font | P1 | Preferensi tersinkron antar perangkat |

### 7.15 Ekstensibilitas dan API

| ID | Kebutuhan | Prio | Kriteria penerimaan |
| --- | --- | --- | --- |
| FR-EXT-01 | API REST/GraphQL untuk KPI, dashboard, dan hasil query dengan OAuth 2.0 | P2 | Dokumentasi, rate limit, dan versi API tersedia |
| FR-EXT-02 | Embedded analytics: sematkan kartu KPI atau dashboard di intranet, portal, atau aplikasi lain | P2 | Hak akses pengguna akhir tetap ditegakkan |
| FR-EXT-03 | Webhook dan event untuk memicu otomasi (mis. KPI merah membuka tiket) | P2 | Pengiriman andal dengan retry dan log |
| FR-EXT-04 | Integrasi kalender: kirim brief KPI relevan sebelum rapat terjadwal | P2 | Brief terkirim 30 menit sebelum rapat dan hanya berisi data yang berhak diakses |
| FR-EXT-05 | Pustaka templat dashboard dan KPI per industri (ritel, perbankan, manufaktur, logistik, kesehatan) | P2 | Templat dapat diimpor dan disesuaikan dalam < 1 hari |

## 8. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan | Target |
| --- | --- | --- |
| Kinerja | Beranda eksekutif, dashboard kompleks, drill-down, Tanya Data, dan pembuatan board pack | Beranda p95 < 3 dtk; dashboard kompleks p95 < 5 dtk; drill-down p95 < 2 dtk; Tanya Data p95 < 8 dtk; board pack < 10 menit |
| Skalabilitas | Pengguna terdaftar dan konkurensi saat puncak (mis. rapat bulanan) | 5.000 pengguna terdaftar, 500 konkuren; tumbuh 10x tanpa perubahan arsitektur besar; dataset hingga miliaran baris |
| Ketersediaan | Uptime layanan utama | SLA 99,9% per bulan; jendela pemeliharaan di luar jam kerja eksekutif (WIB/WITA/WIT) |
| Ketahanan dan pemulihan | Backup dan disaster recovery | RPO ≤ 15 menit, RTO ≤ 4 jam; uji DR minimal tiap semester |
| Kesegaran data | Sesuai SLA per dataset (FR-INT-06) | KPI keuangan H+1 sebelum 07:00 WIB; KPI operasional 15–60 menit; ditampilkan jelas di UI |
| Akurasi data | Kesesuaian dengan sumber resmi | Selisih ≤ 0,1% pada KPI keuangan bersertifikat; selisih lebih besar memicu peringatan |
| Keamanan | Zero trust, least privilege, enkripsi, audit, pentest | Sesuai FR-SEC; tanpa temuan kritis/tinggi terbuka saat rilis |
| Privasi | Pelindungan data pribadi | Mendukung UU PDP; minimisasi data pribadi pada dashboard dan prompt AI |
| Kompatibilitas | Peramban dan perangkat | Dua versi mayor terakhir Chrome, Edge, Safari, Firefox; dua versi mayor terakhir iOS dan Android |
| Aksesibilitas | Standar aksesibilitas | WCAG 2.1 AA |
| Lokalisasi | Bahasa, format, zona waktu | Indonesia dan Inggris; format angka, tanggal, dan mata uang lokal; WIB/WITA/WIT |
| Observabilitas | Log, metrik, trace, dan SLO | Peringatan on-call otomatis; dashboard kesehatan layanan |
| Pemeliharaan | Rilis dan perubahan | Rilis tanpa downtime, feature flag, rollback < 15 menit |
| Efisiensi biaya | Biaya komputasi dan AI | Biaya per pengguna aktif sesuai anggaran; cache dan pre-aggregation untuk KPI eksekutif |
| Retensi dan arsip | Data, log, dan laporan | Sesuai kebijakan perusahaan dan regulasi; audit log ≥ 1 tahun (dapat dikonfigurasi) |

## 9. Arsitektur dan Pertimbangan Teknis (tingkat tinggi)

Bagian ini memberi arah untuk tim engineering. Keputusan teknis final dibuat lewat dokumen desain dan spike teknis pada fase discovery.

### 9.1 Prinsip arsitektur

- **Semantic-layer-first:** semua konsumsi data (dashboard, AI, laporan, API) melewati satu lapisan definisi metrik.
- **Integrasikan yang komoditas, bangun yang membedakan:** pakai komponen matang untuk konektor, penyimpanan, dan visualisasi dasar; bangun pengalaman eksekutif, briefing, board pack, dan alur tindak lanjut.
- **API-first dan modular:** setiap kemampuan tersedia lewat API internal sehingga web, mobile, dan integrasi memakai sumber yang sama.
- **Zero trust dan keamanan sejak desain:** otorisasi ditegakkan di lapisan data, bukan hanya di antarmuka.
- **Observabilitas bawaan:** setiap query, notifikasi, dan jawaban AI dapat ditelusuri.

### 9.2 Lapisan platform

| Lapisan | Tanggung jawab | Catatan |
| --- | --- | --- |
| 1. Sumber data | ERP, CRM, HRIS, akuntansi, POS, aplikasi marketing, spreadsheet, API | Prioritas ditentukan audit sistem pada discovery |
| 2. Ingestion dan transformasi | ELT/CDC, pemodelan data, uji kualitas, jadwal | Idealnya memakai pipeline perusahaan yang sudah ada |
| 3. Penyimpanan analitik | Data warehouse/lakehouse | Opsi cloud-agnostic; residensi data sesuai kebutuhan klien |
| 4. Semantic layer dan metrics store | Definisi metrik, dimensi, hierarki, kalender fiskal, hak akses baris/kolom | Sumber kebenaran tunggal untuk KPI |
| 5. Serving dan caching | Query engine, cache, pre-aggregation, antrean | Menjaga p95 beranda < 3 detik |
| 6. Lapisan AI | NL-to-metric, deteksi anomali, forecasting, narasi, penjelasan | Terpisah dari aplikasi agar model dapat diganti |
| 7. Aplikasi | Web, mobile, notifikasi, board pack builder, kolaborasi | API-first; desain sistem terpadu |
| 8. Keamanan dan tata kelola (lintas lapisan) | Identitas, otorisasi, enkripsi, audit, DLP, lineage | Ditegakkan di semua lapisan |
| 9. Observabilitas | Log, metrik, trace, biaya, adopsi | Terhubung ke on-call dan dashboard produk |

Alur data ringkas: **Sumber data → Ingestion & transformasi → Warehouse/lakehouse → Semantic layer → Serving & cache → Aplikasi web/mobile dan Lapisan AI → Eksekutif**, dengan keamanan, tata kelola, dan observabilitas menyilang di semua langkah.

### 9.3 Opsi build vs buy (hipotesis untuk divalidasi lewat spike)

| Opsi | Deskripsi | Kelebihan | Kekurangan |
| --- | --- | --- | --- |
| A. Beli penuh | Memakai produk BI/dashboard eksekutif yang ada dan menyesuaikannya | Cepat dimulai, biaya awal rendah | Keterbatasan kustomisasi UX, board pack, dan alur tindak lanjut; ketergantungan vendor |
| B. Bangun penuh | Membangun seluruh platform sendiri | Kendali penuh | Mahal, lambat, dan berisiko pada komponen komoditas |
| **C. Hibrida (hipotesis rekomendasi)** | Memakai komponen matang (konektor, warehouse, mesin visualisasi) dan membangun lapisan pengalaman eksekutif, AI terintegrasi semantic layer, board pack, dan kolaborasi | Keseimbangan kecepatan dan diferensiasi | Perlu disiplin arsitektur dan integrasi yang baik |

### 9.4 Pendekatan AI yang aman dan akurat

- **NL-to-metric, bukan NL-to-SQL bebas.** Model bahasa memetakan pertanyaan ke metrik, dimensi, filter, dan periode di semantic layer; angka dihitung oleh mesin deterministik, bukan oleh model.
- **Narasi dari hasil terhitung.** Teks AI dibuat dari hasil query yang sudah ada, lalu diverifikasi otomatis: setiap angka di narasi harus cocok dengan sumbernya.
- **Evaluasi berkelanjutan.** Benchmark 200+ pertanyaan eksekutif (Bahasa Indonesia dan Inggris), uji regresi tiap perubahan model/prompt, dan review manusia atas sampel jawaban.
- **Privasi dan kepatuhan.** Data pelanggan tidak dipakai melatih model, data pribadi dimasking sebelum dikirim ke model bila memungkinkan, dan opsi penyedia model/region sesuai kebijakan.
- **Perilaku saat tidak yakin.** Sistem menyatakan ketidakpastian, meminta klarifikasi, atau mengarahkan ke analis, tidak menebak.
- **Biaya dan latensi.** Cache untuk pertanyaan umum, batasan token, dan pemantauan biaya per pengguna.

### 9.5 Pertimbangan pemodelan data

- Grain dan hierarki yang konsisten (entitas hukum, wilayah, produk, pelanggan, kanal).
- Kalender fiskal, perbandingan periode, dan hari kerja.
- Konversi mata uang dan kurs historis, serta konsolidasi multi-entitas.
- Data terlambat (late-arriving) dan restatement; kebijakan snapshot saat tutup buku.
- Perubahan dimensi dari waktu ke waktu (mis. reorganisasi wilayah) agar tren tetap dapat dibandingkan.

## 10. Prinsip UX dan Layar Utama

### 10.1 Prinsip desain

1. **Jawaban dulu, detail kemudian.** Setiap layar lulus uji 5 detik: pengguna tahu apa yang terjadi dan apakah perlu bertindak.
2. **Judul berupa kesimpulan.** Judul grafik menyampaikan insight (mis. “Margin turun 2,3 poin dipicu biaya bahan baku”), bukan sekadar nama metrik.
3. **Pengungkapan bertahap (progressive disclosure).** Ringkasan di atas, penyebab di tengah, detail transaksi di bawah.
4. **Kepercayaan terlihat.** Waktu pembaruan, lencana sertifikasi, dan banner kualitas data selalu tampil.
5. **Bahasa visual konsisten.** Warna dan ikon status (RAG), satuan, dan format angka sama di seluruh produk.
6. **Mobile-first dan siap presentasi.** Layar dirancang untuk ponsel dan tampil rapi pada proyektor.
7. **Beban kognitif rendah.** Maksimal sekitar 7 elemen utama per layar, ruang putih memadai, tanpa dekorasi yang tidak membawa informasi.
8. **Tindakan satu langkah.** Dari insight langsung ke komentar, tugas, atau berbagi tanpa berpindah konteks.

### 10.2 Layar utama

| Layar | Tujuan | Elemen utama |
| --- | --- | --- |
| Beranda eksekutif | Memahami kondisi bisnis dalam hitungan detik | Kartu KPI, ringkasan AI, Perlu Perhatian Anda, selektor periode |
| Detail KPI | Memahami satu KPI secara mendalam | Tren, target, pembanding, analisis penyebab, definisi, pemilik, komentar |
| Dashboard domain | Menjawab pertanyaan kunci satu fungsi | Visual terkurasi, filter global, anotasi, drill-down |
| Tanya Data | Menjawab pertanyaan ad hoc | Kolom pertanyaan, saran pertanyaan, jawaban + grafik + dasar jawaban, tanya lanjutan |
| Pusat Peringatan | Mengelola peringatan dan prioritas | Daftar prioritas, konteks, aksi Acknowledge/Tugaskan, riwayat |
| Board pack builder | Menyusun materi rapat | Templat, bagian, narasi manajemen, alur persetujuan, ekspor |
| Action tracker dan decision log | Memantau tindak lanjut dan keputusan | Daftar tugas, pemilik, tenggat, tautan ke data pendukung |
| Katalog KPI | Memahami dan mengelola definisi metrik | Pencarian, definisi, lineage, status sertifikasi |
| Mode presentasi | Memimpin rapat | Layar penuh, navigasi cepat, catatan keputusan |
| Konsol admin | Mengelola pengguna, kebijakan, dan konten | Peran, SSO, audit log, penggunaan, biaya |

**Kriteria keberhasilan UX:** uji usabilitas dengan ≥ 8 eksekutif per putaran, tingkat keberhasilan tugas utama ≥ 90%, skor SUS ≥ 80, dan tidak ada masalah usabilitas kritis terbuka saat pilot.

## 11. Katalog KPI Awal (usulan untuk divalidasi)

Berikut KPI awal per domain. Daftar final ditetapkan bersama pemilik KPI pada fase discovery; MVP dibatasi pada 30–50 KPI yang paling kritis.

| Domain | Contoh KPI |
| --- | --- |
| Keuangan | Pendapatan, pertumbuhan YoY/MoM, laba kotor dan margin, EBITDA, laba bersih, arus kas operasional, posisi kas dan runway, DSO/DPO, realisasi vs anggaran (OPEX/CAPEX), ROE/ROIC |
| Penjualan dan Pendapatan | Pendapatan per segmen/wilayah/produk, pipeline coverage, win rate, siklus penjualan, nilai transaksi rata-rata, ARR/MRR, ARPU, forecast vs target |
| Pemasaran | CAC, ROAS, biaya per lead, konversi funnel, kontribusi kanal, pangsa suara (share of voice) |
| Pelanggan | Jumlah pelanggan aktif, churn dan retensi, CLV, NPS/CSAT, waktu penyelesaian tiket |
| Operasi dan Rantai Pasok | OEE, on-time delivery, tingkat cacat, lead time, level dan perputaran stok, utilisasi kapasitas, kepatuhan SLA layanan |
| SDM | Headcount, attrition, time-to-hire, produktivitas per FTE, biaya SDM terhadap pendapatan, engagement |
| Risiko dan Kepatuhan | Insiden material, temuan audit terbuka, kepatuhan regulasi, risk heat map, insiden keamanan informasi |
| Strategi dan Portofolio | Status inisiatif strategis (RAG), progres proyek, realisasi manfaat, progres OKR |

**Contoh definisi KPI (templat wajib untuk setiap KPI)**

| Atribut | Contoh: Margin Kotor (%) |
| --- | --- |
| Rumus | (Pendapatan − Harga Pokok Penjualan) ÷ Pendapatan |
| Pemilik bisnis / data steward | CFO / Kepala Akuntansi Manajemen |
| Sumber | Buku besar ERP, setelah jurnal penyesuaian |
| Frekuensi dan kesegaran | Harian, tersedia H+1 sebelum 07:00 WIB |
| Arah baik | Lebih tinggi lebih baik |
| Aturan RAG | Hijau ≥ target; kuning dalam 1 poin di bawah target; merah > 1 poin di bawah target |
| Dimensi yang diizinkan | Waktu, entitas hukum, wilayah, lini produk |
| Status sertifikasi | Bersertifikat (versi 1.2, ditinjau terakhir oleh pemilik) |

## 12. Instrumentasi dan Analitik Produk

Tim produk memantau adopsi dan nilai ExecInsight melalui event terstruktur. Instrumentasi hanya merekam metadata penggunaan, bukan nilai data bisnis sensitif.

| Area | Event utama | Metrik turunan |
| --- | --- | --- |
| Sesi | app\_open, session\_start (persona, perangkat) | EWAR, frekuensi sesi |
| Beranda | home\_view, kpi\_card\_click | Time-to-insight, kartu paling sering dibuka |
| Drill-down | drill\_down (level, dimensi), rca\_opened | Kedalaman eksplorasi, kemandirian dari analis |
| Tanya Data | nl\_query\_submitted, nl\_answer\_rated, nl\_unresolved | Akurasi, cakupan pertanyaan, tingkat tidak terjawab |
| Peringatan | alert\_sent, alert\_opened, alert\_acknowledged, alert\_muted | Open rate, waktu respons, alert fatigue |
| Laporan | report\_generated, board\_pack\_exported | Waktu penyusunan, laporan manual yang tergantikan |
| Kolaborasi | comment\_created, action\_created, action\_completed | Closure rate tindak lanjut |
| Kepercayaan | data\_issue\_reported, freshness\_banner\_shown | Skor kepercayaan data, insiden kualitas |
| Kinerja | page\_load\_ms, query\_ms, error\_rate | Kepatuhan terhadap SLO |
| Keamanan | access\_denied, export\_blocked | Efektivitas kontrol akses dan DLP |

Karena jumlah pengguna eksekutif terbatas, evaluasi mengandalkan kombinasi metrik longitudinal, wawancara berkala, dan uji usabilitas, bukan eksperimen A/B skala besar. Dashboard produk ditinjau mingguan oleh tim produk dan bulanan oleh sponsor eksekutif.

## 13. Rencana Rilis dan Roadmap

| Fase | Durasi (perkiraan) | Hasil utama | Kriteria lanjut (go/no-go) |
| --- | --- | --- | --- |
| 0. Discovery dan validasi | Minggu 1–6 | Wawancara 15–20 eksekutif dan 10 delegate; inventaris laporan dan KPI; audit sistem data; benchmark pertanyaan; spike build vs buy; prototipe dan uji usabilitas | KPI prioritas disepakati, sponsor eksekutif terkonfirmasi, keputusan build vs buy, anggaran dan tim disetujui |
| 1. Fondasi dan MVP | Bulan 2–5 | Semantic layer, konektor prioritas, SSO/RBAC/RLS, beranda, 3 dashboard domain, peringatan ambang batas, briefing harian, mobile web, Tanya Data terbatas | KPI P0 bersertifikat, kualitas data lulus uji rekonsiliasi, tinjauan keamanan lulus |
| 2. Pilot | Bulan 5–7 (8 minggu) | 15–30 eksekutif dan delegate memakai produk nyata; umpan balik mingguan | EWAR ≥ 50%, skor kepercayaan ≥ 4,0, tanpa insiden keamanan, daftar perbaikan P0 selesai |
| 3. GA / V1.0 | Bulan 7–10 | Deteksi anomali, analisis penyebab, narasi AI, forecasting, board pack, kolaborasi dan action tracker, aplikasi native, 8 domain, bilingual, DLP dan audit lengkap | SLO terpenuhi, pentest lulus, kesiapan dukungan dan pelatihan, persetujuan sponsor |
| 4. V1.x–V2.0 | Bulan 10–18 | What-if, rekomendasi tindakan, OKR, benchmark, voice, API dan embedded analytics, templat industri | Target adopsi dan nilai bisnis tercapai; prioritas berdasarkan data penggunaan |

**Estimasi komposisi tim inti:** 1 product manager, 1 design lead dan 1 product designer, 1 engineering manager, 6–8 software engineer (front-end, back-end, mobile), 2 data engineer, 1–2 ML/AI engineer, 1 QA/SDET, 1 security engineer (paruh waktu), 1 analis BI/data steward, dan 1 adoption/change lead. Estimasi ini perlu disesuaikan setelah spike teknis.

## 14. Adopsi, Pelatihan, dan Change Management

Produk analitik eksekutif gagal bukan karena fitur kurang, tetapi karena kebiasaan lama (deck dan spreadsheet) tidak tergantikan. Rencana adopsi adalah bagian dari produk, bukan tambahan.

| Tahap | Aktivitas | Pemilik |
| --- | --- | --- |
| Sponsor dan champion | Sponsor eksekutif (CEO/CFO) memakai ExecInsight dalam rapat rutin; champion per fungsi (biasanya Chief of Staff) ditunjuk sejak discovery | Sponsor, Product |
| Onboarding personal (white-glove) | Sesi 1:1 30 menit, tampilan awal disetel sesuai peran, daftar pertanyaan contoh | Product, adoption lead |
| Pelatihan | Video singkat 3 menit, panduan satu halaman, sesi untuk delegate dan analis, office hours mingguan | Adoption lead, Data/BI |
| Pensiun laporan lama (sunset) | Inventaris laporan berkala, jadwal penghentian bertahap setelah angka terbukti konsisten; satu sumber kebenaran diumumkan resmi | Sponsor, Finance, Data/BI |
| Komunikasi | Pengumuman peluncuran, catatan rilis ringkas tiap 2 minggu, kisah sukses dari pilot | Product, Komunikasi internal |
| Umpan balik | Tombol umpan balik dalam aplikasi, survei bulanan singkat, wawancara kuartalan, review roadmap dengan sponsor | Product |
| Dukungan | Tier 1: BI desk/Chief of Staff; Tier 2: produk dan engineering; respons masalah kritis ≤ 1 jam kerja | Data/BI, Engineering |
| Pengukuran | EWAR, kepercayaan data, laporan manual yang tergantikan, dilaporkan bulanan ke sponsor | Product |

## 15. Risiko, Asumsi, dan Dependensi

### 15.1 Risiko utama

| Risiko | Dampak | Kemungkinan | Mitigasi |
| --- | --- | --- | --- |
| Kualitas data buruk dan definisi KPI tidak disepakati | Tinggi | Tinggi | Workshop definisi KPI sejak discovery, sertifikasi KPI, data steward, rekonsiliasi dengan sumber resmi, banner kualitas data |
| Adopsi rendah karena eksekutif tetap memakai deck/spreadsheet | Tinggi | Sedang | Sponsor aktif, onboarding personal, pilot bersama delegate, pensiun laporan lama, uji usabilitas berulang |
| AI memberi jawaban salah atau mengarang | Tinggi | Sedang | NL-to-metric, verifikasi angka, explainability, benchmark dan uji regresi, perilaku “tidak tahu”, jalur eskalasi ke analis |
| Kebocoran data atau pelanggaran hak akses | Sangat tinggi | Rendah–sedang | RLS/CLS, DLP, audit log, threat modeling, pentest, uji otomatis lintas kanal (dashboard, AI, ekspor, notifikasi) |
| Alert fatigue | Sedang | Tinggi | Batas harian, pengelompokan, penyetelan ambang, pemantauan opt-out, pembelajaran dari false positive |
| Performa buruk pada dataset besar | Sedang | Sedang | Pre-aggregation, cache, uji beban sejak awal, SLO yang diukur |
| Integrasi sumber lambat atau bergantung pada tim lain | Tinggi | Sedang | Audit sistem pada discovery, konektor prioritas, kesepakatan dengan pemilik sistem, jadwal bersama |
| Scope creep (menjadi alat BI umum) | Sedang | Tinggi | Non-tujuan yang tegas, tata kelola backlog, persetujuan sponsor untuk perubahan cakupan |
| Biaya komputasi dan AI membengkak | Sedang | Sedang | Kuota, cache, pemantauan biaya per pengguna, pilihan model sesuai kebutuhan |
| Perubahan regulasi (aturan turunan UU PDP, regulasi sektor) | Sedang | Sedang | Tinjauan legal berkala, desain fleksibel untuk residensi dan retensi data |
| Sensitivitas organisasi atas transparansi angka antar-departemen | Sedang | Sedang | Tata kelola KPI dengan sponsor, kepemilikan KPI yang jelas, ruang bagi pemilik KPI memberi konteks pada angka |
| Ketergantungan pada vendor | Sedang | Sedang | Arsitektur modular, standar terbuka, strategi keluar (exit plan) |

### 15.2 Asumsi

- Ada sponsor eksekutif senior yang aktif mendukung dan menggunakan produk.
- Data untuk KPI prioritas tersedia atau dapat disediakan dalam waktu 3 bulan pertama.
- Perusahaan memiliki identity provider terpusat yang mendukung SAML/OIDC.
- Kelompok pengguna awal adalah 100–500 eksekutif, direksi, dan delegasinya; target skala 5.000 pengguna untuk tahap lanjut.
- Tim data/BI bersedia menjadi data steward dan pemilik tata kelola KPI.
- Kebijakan perusahaan mengizinkan penggunaan layanan AI dengan kontrol privasi yang dijelaskan pada bagian 9.4.

### 15.3 Dependensi

- **Tim data dan TI:** pipeline, akses ke sistem sumber, jaringan privat, SSO, MDM.
- **Keuangan:** definisi KPI keuangan, kalender fiskal, rekonsiliasi dengan buku besar.
- **SDM:** akses ke data SDM yang sensitif dan kebijakan privasinya.
- **Legal dan kepatuhan:** pemetaan UU PDP, kebijakan AI, retensi data, ketentuan sektor.
- **Keamanan informasi:** threat modeling, pentest, persetujuan arsitektur.
- **Penyedia cloud dan model AI:** SLA, region, dan ketentuan pemrosesan data.
- **Komunikasi dan HR/Learning:** pelaksanaan rencana adopsi.

## 16. Pertanyaan Terbuka

1. Siapa sponsor utama dan pemilik KPI untuk tiap domain?
2. Apakah ExecInsight produk internal satu perusahaan atau produk SaaS multi-pelanggan? Jawabannya menentukan kebutuhan multi-tenant, model harga, kemasan paket, dan strategi go-to-market (dokumen ini mengasumsikan produk enterprise yang dapat berkembang ke multi-tenant).
3. Seberapa jauh definisi “eksekutif”: hanya C-level dan direksi, atau hingga level direktur/VP/kepala divisi?
4. Stack data apa yang sudah ada (warehouse, alat BI seperti Power BI atau Tableau)? Apakah ExecInsight harus berdampingan dengan alat tersebut atau menggantikannya?
5. Adakah kewajiban residensi data di Indonesia atau ketentuan regulator sektor yang berlaku?
6. Model AI dan penyedia mana yang diizinkan, dan data apa yang boleh dikirim ke penyedia eksternal?
7. Apakah kanal WhatsApp diizinkan untuk distribusi KPI, dan data apa yang boleh dikirim lewat kanal tersebut?
8. Apakah board pack memerlukan tanda tangan elektronik atau integrasi dengan sistem manajemen rapat/board portal yang sudah ada?
9. Berapa anggaran, target tanggal GA, dan batas biaya komputasi yang dapat diterima?
10. Siapa yang berwenang menyetujui perubahan definisi KPI dan angka final untuk board pack?

## 17. Lampiran

### A. Contoh user story dan kriteria penerimaan

**US-01 — Briefing di ponsel (terkait FR-HOME-01, FR-HOME-02).** Sebagai CEO, saya ingin melihat ringkasan kondisi bisnis di ponsel agar paham prioritas hari ini dalam kurang dari 3 menit.

- **Diberikan** CEO sudah masuk dengan SSO dan MFA, **ketika** membuka beranda di ponsel, **maka** 6–12 kartu KPI tampil dengan nilai, tren, status RAG, dan waktu pembaruan.
- **Dan** bagian “Perlu Perhatian Anda” menampilkan maksimal 5 item yang diurutkan berdasarkan dampak.
- **Dan** halaman termuat dalam < 3 detik (p95).

**US-02 — Analisis penyebab (terkait FR-EXP-03, FR-COL-03).** Sebagai CFO, saya ingin tahu mengapa margin kotor turun agar dapat menugaskan tindakan korektif.

- **Diberikan** margin kotor bulan ini di bawah target, **ketika** CFO memilih “Mengapa berubah?”, **maka** sistem menampilkan dimensi dengan kontribusi terbesar (mis. produk, wilayah, pemasok) dan total kontribusi sama dengan selisih KPI.
- **Dan** CFO dapat membuat tugas dengan pemilik dan tenggat dari hasil tersebut dalam ≤ 2 klik.

**US-03 — Hak akses (terkait FR-SEC-04).** Sebagai admin keamanan, saya ingin memastikan COO Wilayah Timur hanya melihat data wilayahnya di semua kanal.

- **Diberikan** COO Wilayah Timur hanya berhak atas data wilayah tersebut, **ketika** ia membuka dashboard, bertanya lewat Tanya Data, menerima notifikasi, atau mengekspor laporan, **maka** semua hasil hanya berisi data Wilayah Timur.
- **Dan** setiap percobaan mengakses data di luar haknya ditolak serta tercatat di audit log.

**US-04 — Perilaku AI saat tidak yakin (terkait FR-AI-03).** Sebagai eksekutif, saya ingin AI jujur ketika tidak dapat menjawab agar saya tidak mengambil keputusan dari angka tebakan.

- **Diberikan** pertanyaan di luar cakupan semantic layer, **ketika** eksekutif mengajukannya di Tanya Data, **maka** sistem tidak menampilkan angka dan menawarkan klarifikasi, pertanyaan alternatif, atau meneruskan permintaan ke analis.

### B. Definition of Done untuk setiap fitur

- Kode melewati code review dan tes otomatis (unit, integrasi, end-to-end) pada jalur kritis.
- Uji hak akses (RLS/CLS) lulus pada semua kanal terkait: web, mobile, AI, ekspor, notifikasi.
- Uji performa memenuhi SLO yang berlaku.
- Pemeriksaan aksesibilitas dasar lulus dan teks sudah dilokalisasi.
- Instrumentasi event dan dashboard produk diperbarui.
- Dokumentasi, katalog KPI, dan catatan rilis diperbarui.
- Ditinjau keamanan untuk fitur berisiko tinggi (AI, ekspor, berbagi, integrasi).
- Diuji pengguna (UAT) oleh eksekutif atau delegate, dirilis di balik feature flag.

### C. RACI ringkas

R = Responsible (mengerjakan), A = Accountable (penanggung jawab akhir), C = Consulted (dimintai masukan), I = Informed (diberi informasi).

| Aktivitas | Product | Engineering | Data/BI | Keamanan dan Legal | Sponsor eksekutif |
| --- | --- | --- | --- | --- | --- |
| Penetapan KPI dan definisi | R | I | R | C | A |
| Semantic layer dan pipeline data | C | R | A | C | I |
| Desain UX dan pengembangan aplikasi | A | R | C | C | I |
| Keamanan, akses, dan kepatuhan | C | R | C | A | I |
| Evaluasi dan guardrail AI | A | R | C | C | I |
| Pilot dan adopsi | R | C | C | I | A |
| Keputusan go/no-go rilis | R | C | C | C | A |

### D. Glosarium

| Istilah | Arti |
| --- | --- |
| BI | Business Intelligence: pengumpulan, analisis, dan penyajian data untuk keputusan bisnis |
| KPI / OKR | Indikator kinerja utama / Objectives and Key Results |
| RAG | Status merah-kuning-hijau yang menunjukkan kondisi KPI terhadap target |
| Semantic layer | Lapisan yang mendefinisikan metrik, dimensi, dan aturan bisnis sekali untuk dipakai semua alat dan AI |
| NL-to-metric | Pendekatan AI yang memetakan pertanyaan bahasa natural ke metrik terdefinisi, bukan membuat SQL bebas |
| RBAC / RLS / CLS | Kontrol akses berbasis peran / keamanan tingkat baris / keamanan tingkat kolom |
| SSO / SCIM / MFA | Masuk sekali / provisioning pengguna otomatis / autentikasi multi-faktor |
| DLP | Data Loss Prevention: kontrol untuk mencegah kebocoran data lewat ekspor, unduh, atau berbagi |
| ELT / CDC | Extract-Load-Transform / Change Data Capture untuk replikasi perubahan data |
| Lineage | Jejak asal-usul dan transformasi data dari sumber sampai KPI |
| Freshness | Kesegaran data: selisih waktu antara kejadian bisnis dan ketersediaannya di produk |
| Board pack | Paket materi rapat direksi/komisaris yang berisi kinerja, risiko, dan keputusan |
| EWAR | Executive Weekly Active Rate, metrik North Star adopsi |
| p95 | Persentil ke-95: 95% permintaan lebih cepat dari nilai tersebut |
| SLA / SLO | Perjanjian tingkat layanan / sasaran tingkat layanan internal |
| RPO / RTO | Batas kehilangan data / waktu pemulihan maksimum saat bencana |
| MAPE | Mean Absolute Percentage Error, ukuran akurasi forecast |
| SUS | System Usability Scale, skor usabilitas standar |
| CAC / CLV / ROAS | Biaya akuisisi pelanggan / nilai seumur hidup pelanggan / pengembalian belanja iklan |
| DSO / DPO | Days Sales Outstanding / Days Payable Outstanding |
| OEE | Overall Equipment Effectiveness, efektivitas peralatan secara keseluruhan |

### E. Riwayat revisi dan persetujuan

| Versi | Tanggal | Perubahan | Penulis |
| --- | --- | --- | --- |
| 1.0 | 22 November 2026 | Draf awal lengkap untuk review stakeholder | Product Management |

| Peran | Nama | Status persetujuan |
| --- | --- | --- |
| Sponsor eksekutif | (diisi) | Menunggu |
| Product | (diisi) | Menunggu |
| Engineering | (diisi) | Menunggu |
| Data/BI | (diisi) | Menunggu |
| Keamanan dan Legal | (diisi) | Menunggu |
