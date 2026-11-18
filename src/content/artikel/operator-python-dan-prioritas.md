---
judul: "Operator Python dan Urutan Prioritasnya: Kenapa 2+3*4 Bukan 20"
tema: "Dasar Python"
ringkasan: "Tujuh operator aritmetika, urutan prioritas operator beserta tingkatannya, short-circuit and/or, serta perbedaan and dan ampersand untuk pandas."
tanggal: 2026-11-18
diverifikasi: "Python 3.11.16"
durasiBaca: 7
---

# Operator Python dan Urutan Prioritasnya: Kenapa 2+3*4 Bukan 20

Coba tebak hasil `2 + 3 * 4`. Kalau jawabanmu 20, kamu membaca dari kiri ke kanan seperti kalkulator sederhana. Python menjawab 14, karena perkalian dikerjakan lebih dulu.

Ini bukan tebak-tebakan, tapi aturan urutan prioritas operator selalu mengikuti aturan dari Matemetika Aljabar. Salah memahami prioritas operator menghasilkan bug yang lolos dari mata — kodenya jalan, angkanya masuk akal, tapi salah, oleh karena itu perlu bagi kamu untuk membuka kembali buku dasar aljabar jika ingin mendalami atau mempelajari pemrograman bahasa apapun yang tidak terkhusus pada Python saja. Artikel ini membahas operator Python, urutan eksekusinya, dan lima jebakan yang paling sering menimpa orang yang baru pindah dari bahasa lain.

Semua contoh dijalankan di Python 3.11 dan output yang ditampilkan adalah keluaran asli.

## Operator aritmetika: ada tujuh, bukan empat

```python
print(7 + 3, 7 - 3, 7 * 3, 7 / 3)
```

```
10 4 21 2.3333333333333335
```

Tiga operator yang jarang dibahas pemula:

```python
print(7 // 3)   # floor division
print(7 % 3)    # modulo (sisa bagi)
print(7 ** 3)   # pangkat
```

```
2
1
343
```

`//` membuang bagian desimal dan menyisakan bilangan bulat. `%` memberi sisanya. `**` memangkatkan.

### Perilaku `//` dan `%` pada bilangan negatif

Ini yang mengejutkan banyak orang:

```python
print(-7 // 3)
print(-7 % 3)
```

```
-3
2
```

`-7 // 3` bernilai `-3`, bukan `-2`, karena `//` membulatkan **ke bawah** (menuju negatif tak hingga), bukan ke arah nol. Dan `%` selalu mengikuti aturan itu: `-7 = 3 * (-3) + 2`. Kalau kamu butuh pembulatan ke arah nol seperti di C atau Java, gunakan `int(-7 / 3)`.

### `/` selalu menghasilkan float

```python
print(10 / 2, type(10 / 2))
print(10 // 2, type(10 // 2))
```

```
5.0 <class 'float'>
5 <class 'int'>
```

Di Python 3, `10 / 2` menghasilkan `5.0`. Ini perubahan besar dari Python 2 dan sumber bug saat memformat angka: `f"Total: {10 / 2}"` mencetak `5.0`, bukan `5`.

## Prioritas operator: urutan eksekusi

Python mengeksekusi operator dalam urutan berikut, dari paling kuat ke paling lemah:

| Tingkat | Operator | Keterangan |
|---|---|---|
| 1 | `()` | tanda kurung, selalu menang |
| 2 | `**` | pangkat, **asosiatif kanan** |
| 3 | `+x`, `-x`, `~x` | unary plus/minus, bitwise NOT |
| 4 | `*`, `/`, `//`, `%` | perkalian dan keluarganya |
| 5 | `+`, `-` | penjumlahan, pengurangan |
| 6 | `<<`, `>>` | shift bit |
| 7 | `&` | bitwise AND |
| 8 | `^` | bitwise XOR |
| 9 | `|` | bitwise OR |
| 10 | `==`, `!=`, `<`, `<=`, `>`, `>=`, `in`, `is` | perbandingan |
| 11 | `not` | negasi logika |
| 12 | `and` | logika DAN |
| 13 | `or` | logika ATAU |
| 14 | `:=` | walrus (penugasan dalam ekspresi) |

### Bukti dari eksekusi

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```
14
20
```

Tanpa kurung, perkalian menang. Dengan kurung, penjumlahan dikerjakan lebih dulu.

Pangkat punya satu sifat khusus — ia dikelompokkan dari **kanan**, bukan kiri:

```python
print(2 ** 3 ** 2)
print((2 ** 3) ** 2)
```

```
512
64
```

`2 ** 3 ** 2` dihitung sebagai `2 ** (3 ** 2)` = `2 ** 9` = 512. Ini kebalikan dari operator lain yang berjalan kiri ke kanan, dan satu-satunya cara menghindari kebingungan adalah menulis tanda kurung secara eksplisit walaupun secara teknis tidak wajib.

Contoh campuran:

```python
print(10 - 2 * 3 + 1)
```

```
5
```

`2 * 3` dulu (6), lalu `10 - 6 + 1` dari kiri ke kanan = 5.

Perbandingan lebih lemah dari aritmetika, jadi `2 + 3 == 5` bernilai `True` karena penjumlahan selesai lebih dulu. Tapi `not` lebih lemah dari `==`:

```python
print(not True == False)
```

```
True
```

Baris itu dibaca `not (True == False)` = `not False` = `True`. Kalau maksudmu `(not True) == False`, tulis kurungnya. Inilah alasan aturan praktisnya: **kalau ragu, pakai kurung**. Kurung tidak mengurangi performa dan menghapus seluruh beban membaca ulang.

## Perbandingan berantai

Python mengizinkan penulisan perbandingan seperti notasi matematika:

```python
nilai = 78
print(70 < nilai <= 80)
```

```
True
```

Yang dieksekusi adalah `70 < nilai and nilai <= 80`, tapi `nilai` hanya dievaluasi sekali. Nyaman, dan tidak ada padanannya di Java atau C.

## `and` dan `or`: berhenti lebih awal

`and` berhenti mengevaluasi begitu menemukan nilai salah. `or` berhenti begitu menemukan nilai benar.

```python
def cek(label, hasil):
    print("  evaluasi", label)
    return hasil

print(cek("kiri", False) and cek("kanan", True))
print(cek("kiri2", True) or cek("kanan2", False))
```

```
  evaluasi kiri
False
  evaluasi kiri2
True
```

Perhatikan: `cek("kanan", ...)` dan `cek("kanan2", ...)` **tidak pernah dipanggil**. Ini disebut *short-circuit evaluation*, dan inilah dasar pola penjagaan yang sangat umum:

```python
if pengguna and pengguna.aktif:
    ...
```

Kalau `pengguna` bernilai `None`, ekspresi berhenti dan atribut `.aktif` tidak pernah diakses, sehingga tidak ada `AttributeError`.

### `and`/`or` mengembalikan nilai, bukan hanya True/False

```python
print(0 or "default")
print("isi" and "lanjut")
```

```
default
lanjut
```

`0 or "default"` mengembalikan `"default"` karena `0` dianggap salah. `"isi" and "lanjut"` mengembalikan `"lanjut"` karena semua benar dan nilai terakhir yang dikembalikan.

Pola ini sering dipakai untuk nilai cadangan:

```python
nama = input_nama or "Tanpa Nama"
```

Tapi hati-hati: kalau `input_nama` adalah `0` atau `""`, nilai itu dianggap kosong dan diganti. Untuk data yang sah berupa nol, tulis eksplisit `if x is None`.

## Jebakan: `and` bukan `&`

```python
print(5 and 3)
print(5 & 3)
```

```
3
1
```

`and` adalah logika (mengembalikan `3` karena keduanya benar). `&` adalah bitwise AND: `5` = `101`, `3` = `011`, hasilnya `001` = `1`.

Kesalahan ini sangat berbahaya di pandas dan numpy. Pada DataFrame, `and` melempar `ValueError` karena ambigu, sedangkan `&` bekerja per elemen:

```python
# benar untuk pandas
df[(df["umur"] > 20) & (df["kota"] == "Malang")]

# salah, akan error
df[(df["umur"] > 20) and (df["kota"] == "Malang")]
```

Aturannya: **operator logika Python (`and`, `or`, `not`) untuk nilai tunggal; operator bitwise (`&`, `|`, `~`) untuk array dan kondisi pandas.** Dan setiap kondisi di pandas wajib dibungkus tanda kurung, karena `&` punya prioritas lebih tinggi daripada `>`.

## Operator penugasan gabungan

```python
total = 100
total += 25
print(total)
total *= 2
print(total)
```

```
125
250
```

`total += 25` sama dengan `total = total + 25`. Semua operator aritmetika punya bentuk gabungan: `-=`, `*=`, `/=`, `//=`, `%=`, `**=`.

Untuk list, `+=` dan `extend()` mengubah list di tempat, sedangkan `+` membuat list baru:

```python
a = [1, 2]
b = a
a += [3]
print(a, b)      # keduanya berubah
```

```
[1, 2, 3] [1, 2, 3]
```

## Operator walrus `:=`

Walrus menugaskan nilai di tengah ekspresi, berguna saat kamu perlu memakai nilai sekaligus menguji syaratnya:

```python
data = [1, 2, 3, 4, 5]
if (n := len(data)) > 3:
    print("jumlah data:", n)
```

```
jumlah data: 5
```

Tanpa walrus, kamu harus memanggil `len(data)` dua kali atau menulis satu baris tambahan. Jangan berlebihan memakainya — kalau ekspresinya panjang, variabel biasa lebih mudah dibaca.

## Keanggotaan dan identitas

```python
print("py" in "python")
print(3 in [1, 2, 3])

x = [1, 2]
y = [1, 2]
print(x == y, x is y)
```

```
True
True
True False
```

`in` memeriksa keanggotaan. `==` membandingkan **nilai**, `is` membandingkan **identitas objek** (apakah keduanya objek yang sama di memori). `x` dan `y` berisi nilai sama tapi objek berbeda. Gunakan `is` hanya untuk `None`, `True`, dan `False`.

## Membandingkan float

```python
hasil = 0.1 + 0.2
print(hasil == 0.3)
print(abs(hasil - 0.3) < 1e-9)
```

```
False
True
```

Kesalahan pembulatan biner membuat `0.1 + 0.2` tidak persis `0.3`. Untuk perbandingan, gunakan selisih dengan toleransi seperti di atas, atau `math.isclose()`.

## Kesalahan umum

| Kode | Masalah | Perbaikan |
|---|---|---|
| `int(-7 / 3)` dikira `-7 // 3` | `//` membulatkan ke bawah, bukan ke nol | gunakan `int(a / b)` bila ingin ke nol |
| `f"{10 / 2}"` menghasilkan `5.0` | `/` selalu float | `f"{10 // 2}"` atau `int()` |
| `not a == b` | `not` lebih lemah dari `==` | `not (a == b)` atau `a != b` |
| `2 ** 3 ** 2` dikira 64 | pangkat asosiatif kanan | tulis `(2 ** 3) ** 2` |
| `df[a > 1 and b < 2]` | `and` pada array | `df[(a > 1) & (b < 2)]` |
| `0.1 + 0.2 == 0.3` | presisi float | `abs(a - b) < 1e-9` |
| `x is 5` | `is` untuk nilai, bukan identitas | `x == 5` |

## Latihan

1. Hitung `17 // 5`, `17 % 5`, dan `17 / 5`. Jelaskan kenapa hasilnya berbeda tiga-tiganya.
2. Tanpa menjalankan kode, tentukan hasil `3 + 4 * 2 ** 2 - 6 / 3`. Lalu jalankan dan bandingkan.
3. Tulis ekspresi yang bernilai `True` hanya jika `n` berada di antara 10 dan 20 (inklusif) menggunakan perbandingan berantai.
4. Buat fungsi `ambil_nama(data)` yang mengembalikan `data.get("nama") or "Anonim"`. Uji dengan dict kosong, dict berisi nama, dan dict berisi nama string kosong. Jelaskan hasil terakhir.
5. Buat list berisi lima angka, lalu filter hanya angka genap memakai `%` di dalam satu baris (*list comprehension*).

## Ringkasan

- `2 + 3 * 4` = 14 karena `*` lebih kuat dari `+`; kurung selalu menang.
- `**` asosiatif kanan: `2 ** 3 ** 2` = 512.
- `//` membulatkan ke bawah untuk bilangan negatif; `%` mengikuti hasil itu.
- `/` selalu menghasilkan `float`, bahkan untuk pembagian habis.
- `and`/`or` short-circuit dan mengembalikan nilai, bukan sekadar boolean.
- `and` untuk nilai tunggal, `&` untuk array dan kondisi pandas.
- `==` membandingkan nilai, `is` membandingkan identitas — pakai `is` hanya untuk `None`.
- Jangan bandingkan `float` dengan `==`; gunakan toleransi atau `math.isclose()`.
