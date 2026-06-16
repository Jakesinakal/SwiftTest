export type Question = {
  id: number;
  /** Pertanyaan dalam bahasa Indonesia. */
  prompt: string;
  /** Snippet kode Swift opsional yang ditampilkan di bawah pertanyaan. */
  code?: string;
  /** 4 pilihan jawaban (urutan kanonik; akan diacak saat tes). */
  options: [string, string, string, string];
  /** Index jawaban benar pada array `options`. */
  correctIndex: number;
  /** Penjelasan yang ditampilkan di halaman hasil. */
  explanation: string;
};

export const QUESTION_COUNT = 25;
export const DURATION_SECONDS = 20 * 60;

export const questions: Question[] = [
  {
    id: 1,
    prompt: "Apa yang terjadi pada kode berikut?",
    code: `let name = "Swift"
name = "SwiftUI"`,
    options: [
      'Berhasil diubah menjadi "SwiftUI"',
      "Error saat kompilasi",
      "Error hanya saat runtime",
      "Nilai menjadi nil",
    ],
    correctIndex: 1,
    explanation:
      "`let` mendeklarasikan konstanta. Nilainya tidak bisa diubah setelah ditetapkan, sehingga kompiler langsung menolaknya (compile error). Untuk nilai yang bisa berubah, gunakan `var`.",
  },
  {
    id: 2,
    prompt: "Apa tipe data yang disimpulkan (inferred) Swift untuk konstanta ini?",
    code: `let x = 42`,
    options: ["Double", "Int", "String", "Float"],
    correctIndex: 1,
    explanation:
      "Tanpa anotasi tipe, Swift menyimpulkan literal bilangan bulat sebagai `Int`. Literal desimal seperti `42.0` akan disimpulkan sebagai `Double`.",
  },
  {
    id: 3,
    prompt: "Manakah deklarasi variabel optional bertipe Int yang benar?",
    options: [
      "var age: Int?",
      "var age: ?Int",
      "var age: Int = nil",
      "var age: nil Int",
    ],
    correctIndex: 0,
    explanation:
      "Tanda tanya diletakkan setelah tipe: `Int?`. Ini berarti variabel bisa berisi sebuah `Int` atau `nil`. `Int = nil` tidak valid karena `Int` biasa tidak boleh `nil`.",
  },
  {
    id: 4,
    prompt: "Apa output dari kode berikut?",
    code: `let value: Int? = 10
if let v = value {
    print(v * 2)
} else {
    print("nil")
}`,
    options: ["10", "20", "nil", "Optional(20)"],
    correctIndex: 1,
    explanation:
      "`if let` melakukan optional binding: jika `value` berisi nilai, nilai itu di-unwrap ke `v`. Karena `value` berisi 10, hasilnya `10 * 2 = 20`.",
  },
  {
    id: 5,
    prompt: "Apa yang terjadi pada kode berikut?",
    code: `let str: String? = nil
print(str!)`,
    options: [
      "Mencetak nil",
      "Mencetak string kosong",
      "Crash saat runtime (fatal error)",
      "Error saat kompilasi",
    ],
    correctIndex: 2,
    explanation:
      "Tanda `!` adalah force unwrap. Memaksa membuka optional yang berisi `nil` menyebabkan fatal error saat runtime. Lebih aman gunakan `if let`, `guard let`, atau `??`.",
  },
  {
    id: 6,
    prompt: "Apa output dari kode berikut?",
    code: `let n = 5
print("Saya punya \\(n) apel")`,
    options: [
      "Saya punya 5 apel",
      "Saya punya \\(n) apel",
      "Saya punya n apel",
      "Error: tidak bisa menyisipkan Int",
    ],
    correctIndex: 0,
    explanation:
      "`\\(n)` adalah string interpolation. Swift mengganti `\\(n)` dengan nilai `n`, yaitu 5, sehingga tercetak \"Saya punya 5 apel\".",
  },
  {
    id: 7,
    prompt: "Apa output dari kode berikut?",
    code: `var nums = [1, 2, 3]
nums.append(4)
print(nums.count)`,
    options: ["3", "4", "5", "Error"],
    correctIndex: 1,
    explanation:
      "`append(4)` menambahkan satu elemen ke array, sehingga isinya menjadi `[1, 2, 3, 4]`. Properti `.count` mengembalikan jumlah elemen, yaitu 4.",
  },
  {
    id: 8,
    prompt: "Apa tipe dan nilai dari konstanta x?",
    code: `let dict = ["a": 1, "b": 2]
let x = dict["c"]`,
    options: [
      "Int dengan nilai 0",
      "Int? dengan nilai nil",
      "Int dengan nilai nil",
      "Terjadi error runtime",
    ],
    correctIndex: 1,
    explanation:
      "Mengakses dictionary lewat subscript selalu mengembalikan optional (`Int?`), karena key bisa saja tidak ada. Key `\"c\"` tidak ada, jadi hasilnya `nil`.",
  },
  {
    id: 9,
    prompt: "Apa output dari kode berikut?",
    code: `var sum = 0
for i in 1...3 {
    sum += i
}
print(sum)`,
    options: ["3", "6", "4", "1"],
    correctIndex: 1,
    explanation:
      "`1...3` adalah closed range yang mencakup 1, 2, dan 3. Penjumlahannya 1 + 2 + 3 = 6.",
  },
  {
    id: 10,
    prompt: "Berapa kali blok loop berikut dijalankan?",
    code: `for i in 0..<5 {
    // ...
}`,
    options: ["4 kali", "5 kali", "6 kali", "Tak hingga"],
    correctIndex: 1,
    explanation:
      "`0..<5` adalah half-open range yang mencakup 0, 1, 2, 3, 4 (tanpa 5). Jadi loop berjalan 5 kali.",
  },
  {
    id: 11,
    prompt: "Apa output dari kode berikut?",
    code: `func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}
print(add(3, 4))`,
    options: ["7", "34", "Error: argumen tanpa label", "add(3, 4)"],
    correctIndex: 0,
    explanation:
      "Tanda `_` di depan parameter menghilangkan argument label, sehingga fungsi dipanggil tanpa nama argumen: `add(3, 4)`. Fungsi mengembalikan 3 + 4 = 7.",
  },
  {
    id: 12,
    prompt: "Apa output dari kode berikut?",
    code: `let n = 2
switch n {
case 1:
    print("satu")
case 2:
    print("dua")
default:
    print("lain")
}`,
    options: ["satu", "dua", "lain", "satu dan dua"],
    correctIndex: 1,
    explanation:
      "`switch` mencocokkan `n` (= 2) dengan `case 2`, sehingga mencetak \"dua\". Di Swift `switch` tidak fallthrough otomatis, jadi case lain tidak ikut dijalankan.",
  },
  {
    id: 13,
    prompt: "Apa output dari kode berikut?",
    code: `let age = 20
let status = age >= 18 ? "dewasa" : "anak"
print(status)`,
    options: ["dewasa", "anak", "true", "Error"],
    correctIndex: 0,
    explanation:
      "Ini operator ternary `kondisi ? nilaiJikaBenar : nilaiJikaSalah`. Karena `20 >= 18` bernilai true, `status` berisi \"dewasa\".",
  },
  {
    id: 14,
    prompt: "Apa output dari kode berikut?",
    code: `func greet(_ name: String?) {
    guard let n = name else {
        print("Tidak ada nama")
        return
    }
    print("Halo \\(n)")
}
greet(nil)`,
    options: ["Halo", "Tidak ada nama", "Halo nil", "Error saat kompilasi"],
    correctIndex: 1,
    explanation:
      "`guard let` gagal karena `name` adalah `nil`, sehingga blok `else` dijalankan: mencetak \"Tidak ada nama\" lalu `return`. Baris setelahnya tidak pernah tercapai.",
  },
  {
    id: 15,
    prompt: "Apa output dari kode berikut?",
    code: `let input: String? = nil
let name = input ?? "Tamu"
print(name)`,
    options: ["nil", "Tamu", "String kosong", 'Optional("Tamu")'],
    correctIndex: 1,
    explanation:
      "Operator `??` (nil-coalescing) memberi nilai default jika optional bernilai `nil`. Karena `input` adalah `nil`, `name` menjadi \"Tamu\".",
  },
  {
    id: 16,
    prompt: "Apa output dari kode berikut?",
    code: `struct Point {
    var x = 0
}
var a = Point()
var b = a
b.x = 5
print(a.x)`,
    options: ["0", "5", "nil", "Error"],
    correctIndex: 0,
    explanation:
      "`struct` adalah value type. Saat `b = a`, `b` menjadi salinan independen. Mengubah `b.x` tidak memengaruhi `a`, sehingga `a.x` tetap 0.",
  },
  {
    id: 17,
    prompt: "Apa output dari kode berikut?",
    code: `class Box {
    var v = 0
}
let a = Box()
let b = a
b.v = 9
print(a.v)`,
    options: ["0", "9", "Error karena a adalah let", "nil"],
    correctIndex: 1,
    explanation:
      "`class` adalah reference type. `a` dan `b` menunjuk objek yang sama, jadi mengubah `b.v` juga mengubah `a.v` menjadi 9. `let` hanya mencegah penggantian referensi, bukan perubahan properti `var`.",
  },
  {
    id: 18,
    prompt: "Apa output dari kode berikut?",
    code: `let i = 3
let d = 2.5
let r = Double(i) + d
print(r)`,
    options: ["5.5", "5", "Error: tipe tidak cocok", "3.5"],
    correctIndex: 0,
    explanation:
      "Swift tidak mengonversi tipe numerik secara otomatis. `Double(i)` mengubah Int 3 menjadi 3.0, lalu 3.0 + 2.5 = 5.5.",
  },
  {
    id: 19,
    prompt: "Apa output dari kode berikut?",
    code: `enum Direction {
    case north, south, east, west
}
let d = Direction.north
switch d {
case .north:
    print("Utara")
default:
    print("Lain")
}`,
    options: ["Utara", "Lain", "north", "Error"],
    correctIndex: 0,
    explanation:
      "`d` berisi `.north`, sehingga `case .north` cocok dan mencetak \"Utara\". Sintaks titik (`.north`) adalah singkatan dari `Direction.north`.",
  },
  {
    id: 20,
    prompt: "Apa output dari kode berikut?",
    code: `let nums = [1, 2, 3]
let doubled = nums.map { $0 * 2 }
print(doubled)`,
    options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "Error"],
    correctIndex: 1,
    explanation:
      "`map` menerapkan closure ke setiap elemen. `$0` adalah elemen saat ini, dan `$0 * 2` menggandakannya, menghasilkan `[2, 4, 6]`.",
  },
  {
    id: 21,
    prompt: "Apa output dari kode berikut?",
    code: `class Animal {
    func sound() -> String {
        return "..."
    }
}

class Cat: Animal {
    override func sound() -> String {
        return "Meong"
    }
}

let a: Animal = Cat()
print(a.sound())`,
    options: ["...", "Meong", "Error: tipe tidak cocok", "Error: override tidak diizinkan"],
    correctIndex: 1,
    explanation:
      "`Cat` adalah subclass dari `Animal` dan meng-override `sound()`. Meski `a` dideklarasikan bertipe `Animal`, instance sebenarnya adalah `Cat`. Swift memanggil implementasi versi `Cat` (dynamic dispatch), sehingga hasilnya \"Meong\". Inilah dasar polymorphism.",
  },
  {
    id: 22,
    prompt: "Apa output dari kode berikut?",
    code: `class Person {
    var name: String

    init(name: String) {
        self.name = name
    }
}

let p = Person(name: "Budi")
print(p.name)`,
    options: ["Budi", "name", "nil", "Error: class harus punya init default"],
    correctIndex: 0,
    explanation:
      "`init` adalah initializer yang dijalankan saat instance dibuat. Parameter `name` diterima lalu disimpan ke property instance lewat `self.name = name`, di mana `self` membedakan property instance dari parameter. Maka `p.name` berisi \"Budi\".",
  },
  {
    id: 23,
    prompt: "Apa output dari kode berikut?",
    code: `protocol Greetable {
    func greet() -> String
}

struct Robot: Greetable {
    func greet() -> String {
        return "Beep boop"
    }
}

let r = Robot()
print(r.greet())`,
    options: [
      "Beep boop",
      "Error: struct tidak boleh conform ke protocol",
      "Error: greet() belum diimplementasikan",
      "nil",
    ],
    correctIndex: 0,
    explanation:
      "`protocol` mendefinisikan kontrak berupa method/property yang wajib diimplementasikan oleh type yang conform. `Robot` conform ke `Greetable` dengan menyediakan `greet()`, sehingga `r.greet()` mencetak \"Beep boop\". Baik `struct` maupun `class` bisa conform ke protocol.",
  },
  {
    id: 24,
    prompt: "Apa yang terjadi pada kode berikut?",
    code: `class BankAccount {
    private var balance = 100
}

let acc = BankAccount()
print(acc.balance)`,
    options: ["Mencetak 100", "Mencetak 0", "Error saat kompilasi", "Crash saat runtime"],
    correctIndex: 2,
    explanation:
      "`private` membatasi akses property hanya dari dalam definisi type itu sendiri (encapsulation). Karena `balance` bersifat `private`, mengaksesnya lewat `acc.balance` dari luar `class BankAccount` menyebabkan error saat kompilasi.",
  },
  {
    id: 25,
    prompt: "Apa output dari kode berikut?",
    code: `class Counter {
    static var total = 0

    init() {
        Counter.total += 1
    }
}

_ = Counter()
_ = Counter()
_ = Counter()
print(Counter.total)`,
    options: ["0", "1", "3", "Error: static var harus konstan"],
    correctIndex: 2,
    explanation:
      "`static var` adalah type property: nilainya dimiliki bersama oleh seluruh instance, bukan per-objek. Setiap kali `Counter()` dipanggil, `init()` menambah `Counter.total` sebanyak 1. Karena dipanggil 3 kali, hasil akhirnya 3.",
  },
];
