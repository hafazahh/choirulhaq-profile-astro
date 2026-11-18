---
judul: "Variabel dan Tipe Data di Python: Panduan Lengkap dengan Latihan"
tema: "Dasar Python"
ringkasan: "Cara kerja variabel, tujuh tipe data bawaan, perbedaan mutable dan immutable, serta jebakan konversi tipe yang paling sering menjatuhkan pemula."
tanggal: 2026-11-18
diverifikasi: "Python 3.11.16"
durasiBaca: 7
---
# Pendahuluan
Di era perkembangan artificial intelligence saat ini, hampir semua kode bisa dihasilkan oleh AI hanya dengan perintah sederhana, tanpa harus benar-benar memahami dasar pemrograman. Namun, justru karena kemudahan itu, kemampuan dasar seperti memahami bagaimana cara membuat kode program yang benar di Python menjadi semakin penting. Bukan semata-mata untuk menulis kode dari nol, melainkan untuk membangun intuisi tentang apa yang sebenarnya ingin kamu buat, sekaligus memiliki ketelitian untuk memeriksa dan memperbaiki hasil yang dihasilkan AI. Tanpa pemahaman dasar yang cukup, kamu bisa saja menerima kode yang tampak benar, padahal mengandung kesalahan kecil yang berpotensi merusak keseluruhan program.
# Variabel dan Tipe Data di Python: Panduan Lengkap dengan Latihan

Hampir semua error yang dialami pemula di Python bukan karena kesalahan logika, melainkan karena kurangnya pemahaman tentang tipe data. Contohnya, ketika kamu menulis `"5" + 3`, Python langsung memunculkan error. Begitu pula saat menulis `int("3.5")`. Kedua kode tersebut sebenarnya valid secara sintaks, tetapi gagal dijalankan karena asumsi yang salah tentang tipe data.

Artikel ini membahas variabel beserta tujuh tipe data bawaan Python yang paling sering digunakan sehari-hari, dilengkapi dengan contoh kode dan output asli. Semua contoh di bawah dijalankan menggunakan Python 3.11, sehingga hasil yang kamu lihat adalah keluaran sesungguhnya, bukan hasil yang dibuat-buat.

## Variabel itu label, bukan kotak

Di Python, variabel adalah **nama yang menunjuk ke sebuah objek**. Tidak ada deklarasi tipe di depan, tidak ada `int x;` seperti di Java atau C. Kamu cukup menulis nama, tanda `=`, lalu nilainya.

```python
nama = "Salsa"
umur = 21
ipk = 3.62
aktif = True
```

Kode di atas menyimpan empat nilai dengan empat tipe berbeda. Untuk memastikannya, gunakan `type()`:

```python
print(nama, type(nama))
print(umur, type(umur))
print(ipk, type(ipk))
print(aktif, type(aktif))
```

Output:

```
Salsa <class 'str'>
21 <class 'int'>
3.62 <class 'float'>
True <class 'bool'>
```

### Aturan penamaan yang wajib diikuti

Python menolak nama variabel yang melanggar aturan ini:

- Hanya boleh huruf, angka, dan garis bawah (`_`). Tidak boleh spasi, tanda hubung, atau simbol lain.
- Tidak boleh diawali angka. `2nama` salah, `nama2` benar.
- Tidak boleh memakai kata kunci Python: `if`, `for`, `class`, `def`, `return`, `import`, `None`, `True`, `False`, dan seterusnya.
- Huruf besar dan kecil berbeda. `Nama` dan `nama` adalah dua variabel terpisah.

Yang **tidak** dilarang tapi sebaiknya dihindari: menamai variabel `list`, `dict`, `sum`, atau `str`. Nama itu menimpa fungsi bawaan Python, dan error yang muncul nanti akan sangat membingungkan.

Gaya penulisan yang dipakai komunitas Python (dan dicek otomatis oleh linter) adalah `snake_case` untuk variabel dan fungsi:

```python
nama_lengkap = "Salsa Bila"      # benar
namaLengkap = "Salsa Bila"       # jalan, tapi tidak lazim di Python
```

### Menukar nilai tanpa variabel bantu

Di bahasa lain kamu butuh `temp` untuk menukar dua nilai. Di Python tidak:

```python
a, b = 10, 20
a, b = b, a
print(a, b)
```

```
20 10
```

Baris `a, b = 10, 20` disebut *unpacking*: nilai di kanan dibongkar berurutan ke nama di kiri. Fitur ini yang membuat penukaran bisa terjadi dalam satu baris.

## Tujuh tipe data yang benar-benar dipakai

| Tipe | Contoh | Untuk apa | Bisa diubah? |
|---|---|---|---|
| `int` | `21`, `-5`, `1000000` | bilangan bulat, hitungan, indeks | tidak |
| `float` | `3.62`, `-0.5`, `1e-9` | bilangan desimal, hasil pembagian | tidak |
| `str` | `"halo"`, `'a'` | teks, nama, isi file | tidak |
| `bool` | `True`, `False` | kondisi, hasil perbandingan | tidak |
| `list` | `[1, 2, 3]` | kumpulan data berurutan | **ya** |
| `tuple` | `(1, 2, 3)` | kumpulan data tetap (koordinat, record) | tidak |
| `dict` | `{"nama": "Budi"}` | data berpasangan kunci–nilai | **ya** |
| `set` | `{"TI", "SI"}` | kumpulan unik, operasi himpunan | **ya** |

Kata "bisa diubah" di kolom terakhir bukan detail sepele — itu sumber bug yang paling sering menimpa pemula, dan kita bahas di bawah.

Perhatikan juga bahwa Python tidak punya tipe `double` atau `long` terpisah. Bilangan bulat punya presisi tak terbatas selama memori cukup, jadi `2 ** 100` tidak overflow.

## Konversi tipe: `int()`, `float()`, `str()`, `bool()`

Data yang datang dari luar program — input keyboard, file CSV, parameter URL — selalu berupa teks. Karena itu konversi tipe adalah pekerjaan harian.

```python
print(int("42"))
print(float("3.14"))
print(str(100) + "0")
print(int(3.99))
```

```
42
3.14
1000
3
```

Baris terakhir penting: `int(3.99)` **memotong** bagian desimal, bukan membulatkan. Kalau kamu butuh pembulatan, pakai `round()`.

Sekarang bagian yang sering bikin bingung — konversi ke `bool`:

```python
print(bool(0), bool(""), bool([]), bool("0"))
```

```
False False False True
```

Tiga nilai pertama `False` karena kosong atau nol. Yang terakhir `True` karena `"0"` adalah teks berisi satu karakter — string apa pun yang tidak kosong dianggap benar, termasuk teks `"False"`. Ini jebakan klasik: `bool("False")` bernilai `True`.

### Konversi yang gagal, dan pesan errornya

```python
int("12.5")
```

```
ValueError: invalid literal for int() with base 10: '12.5'
```

`int()` tidak mau menebak. Untuk teks desimal, konversi dulu ke `float`:

```python
print(int(float("12.5")))
```

```
12
```

Pesan error yang sama muncul untuk teks yang bukan angka sama sekali, misalnya `int("dua belas")`. Pola aman untuk data dari luar:

```python
teks = "3.7"
try:
    nilai = int(float(teks))
except ValueError:
    nilai = 0
```

## Mutable vs immutable: kenapa ini penting

Nilai `int`, `float`, `str`, `bool`, dan `tuple` **tidak bisa diubah di tempat**. Operasi pada mereka selalu menghasilkan objek baru:

```python
s = "Python"
print(s.upper())
print(s)
```

```
PYTHON
Python
```

`s.upper()` mengembalikan string baru. `s` sendiri tetap `"Python"`. Ini penyebab paling umum dari "kenapa perubahanku hilang?" — kodenya benar, tapi hasilnya tidak disimpan ke variabel:

```python
s = "Python"
s.upper()          # hasilnya dibuang
print(s)           # tetap Python

s = s.upper()      # ini yang benar
print(s)           # PYTHON
```

`list`, `dict`, dan `set` sebaliknya **bisa diubah di tempat**:

```python
daftar = [1, 2, 3]
daftar.append(4)
print(daftar)
```

```
[1, 2, 3, 4]
```

`append()` mengubah `daftar` langsung dan mengembalikan `None`. Karena itu `daftar = daftar.append(4)` adalah kesalahan fatal — variabelmu jadi `None`, bukan list.

Konsekuensi lain yang lebih halus: dua nama bisa menunjuk ke list yang **sama**.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
```

```
[1, 2, 3, 4]
```

Kalau kamu ingin salinan terpisah, tulis `b = a.copy()` atau `b = list(a)`.

Tuple menolak perubahan dengan tegas:

```python
angka = (1, 2, 3)
angka[0] = 99
```

```
TypeError: 'tuple' object does not support item assignment
```

## Float bukan angka desimal eksak

Ini bukan bug Python, tapi cara komputer menyimpan bilangan pecahan dalam biner:

```python
print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)
```

```
0.30000000000000004
False
```

Untuk perbandingan, jangan pakai `==`. Pakai toleransi:

```python
print(round(0.1 + 0.2, 2) == 0.3)
```

```
True
```

Kalau kamu menghitung uang dan butuh presisi mutlak, jangan pakai `float`. Pakai `decimal.Decimal`, atau simpan dalam satuan terkecil (rupiah, bukan juta rupiah).

## `None` bukan nol, bukan string kosong

`None` adalah penanda "belum ada nilai". Tipenya `NoneType`, dan satu-satunya cara memeriksanya adalah `is`, bukan `==`:

```python
nilai = None
print(nilai is None)
```

```
True
```

Bedanya penting: `nilai == None` bisa memberi hasil mengecoh kalau ada objek yang mendefinisikan perbandingan khusus. `is` memeriksa identitas objek, dan `None` hanya ada satu di seluruh program.

## Python tidak mengunci tipe variabel

Variabel yang sama boleh berganti tipe:

```python
x = 5
print(type(x))
x = "lima"
print(type(x))
```

```
<class 'int'>
<class 'str'>
```

Fleksibel, tapi juga berbahaya. Untuk kode yang lebih panjang, pakai *type hint* supaya niatmu terbaca:

```python
def hitung_total(harga: float, jumlah: int) -> float:
    return harga * jumlah
```

Type hint tidak dipaksakan saat runtime, tapi editor dan alat seperti `mypy` akan menandai kesalahan sebelum program dijalankan.

## Dict dan set dalam satu menit

```python
mhs = {"nama": "Budi", "nim": "2024001"}
print(mhs["nama"])
print(mhs.get("jurusan", "tidak diisi"))

jurusan = {"TI", "SI", "TI"}
print(sorted(jurusan))
```

```
Budi
tidak diisi
['SI', 'TI']
```

Dua hal yang perlu diingat: `mhs["jurusan"]` akan melempar `KeyError` kalau kuncinya tidak ada, sedangkan `.get()` mengembalikan nilai default. Dan `set` membuang duplikat otomatis — `"TI"` dimasukkan dua kali, hasilnya tetap satu.

## Kesalahan umum dan cara mengenalinya

| Gejala | Penyebab | Perbaikan |
|---|---|---|
| `TypeError: can only concatenate str` | mencampur teks dan angka | `str(angka)` atau f-string |
| `ValueError: invalid literal for int()` | `int()` pada teks desimal | `int(float(teks))` |
| `TypeError: 'NoneType' object is not subscriptable` | hasil method disimpan ke variabel (mis. `x = list.append(...)`) | simpan hasil ke variabel lain |
| perubahan hilang setelah `upper()` | string immutable, hasil tidak disimpan | `s = s.upper()` |
| `0.1 + 0.2 != 0.3` | representasi biner float | bandingkan dengan toleransi |
| `KeyError` | kunci dict tidak ada | pakai `.get()` atau cek `in` |
| variabel berubah saat mengubah variabel lain | dua nama menunjuk list yang sama | `.copy()` |

## Latihan

1. Buat variabel `nama_produk`, `harga`, `stok`, lalu cetak satu baris: `"Keyboard Mechanical — Rp450000, sisa 12"` tanpa `+` (gunakan f-string).
2. Minta input angka dari pengguna memakai `input()`, lalu jumlahkan dengan 10. Jalankan sekali dengan input `5`, sekali dengan `lima`. Jelaskan kenapa hasilnya berbeda, dan perbaiki dengan `try/except`.
3. Tulis dua baris kode yang membuktikan bahwa `str` immutable dan `list` mutable.
4. Simpan `0.1 + 0.2` ke variabel. Bandingkan dengan `0.3` memakai `==` dan memakai `round()`. Tulis kesimpulan satu kalimat.
5. Buat dict berisi data satu buku (judul, penulis, tahun), lalu cetak tahunnya memakai `.get()` dengan default `"tidak diketahui"`.

## Ringkasan

- Variabel Python adalah nama yang menunjuk objek; tipenya mengikuti nilai, bukan deklarasi.
- `int`, `float`, `str`, `bool`, `tuple` immutable; `list`, `dict`, `set` mutable.
- Method pada tipe immutable mengembalikan objek baru — hasilnya harus disimpan.
- `int()` memotong desimal dan menolak teks desimal; konversi lewat `float()` dulu.
- `float` tidak eksak; bandingkan dengan toleransi, dan jangan pakai untuk uang.
- Cek `None` dengan `is`, bukan `==`.
- `bool("False")` bernilai `True` — string tidak kosong selalu benar.
