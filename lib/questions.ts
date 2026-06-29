export type Question = {
  id: number;
  /** Teks pertanyaan (Bahasa Inggris, sesuai sumber bank soal). */
  prompt: string;
  /** Snippet kode opsional (mis. pseudocode) yang ditampilkan di bawah pertanyaan. */
  code?: string;
  /** 4 pilihan jawaban (urutan kanonik; akan diacak saat tes). */
  options: [string, string, string, string];
  /** Index jawaban benar pada array `options`. */
  correctIndex: number;
  /** Penjelasan yang ditampilkan di halaman hasil. */
  explanation: string;
};

/** Satu section tes: punya bank soal sendiri & jumlah yang diambil per attempt. */
export type Section = {
  id: string;
  /** Nama section yang ditampilkan ke peserta. */
  name: string;
  /** Berapa soal yang diambil acak dari `questions` tiap attempt. */
  drawCount: number;
  questions: Question[];
};

export const DURATION_SECONDS = 2 * 60 * 60; // 2 jam

/**
 * Format authoring bank soal: jawaban ditulis sebagai string (`answer`), persis
 * meniru kontrak sumber. `buildBank` mengubahnya jadi `correctIndex` dan melempar
 * error saat build kalau `answer` tidak cocok dengan salah satu opsi (jaring
 * pengaman terhadap typo saat porting).
 */
type RawQuestion = {
  prompt: string;
  code?: string;
  options: [string, string, string, string];
  answer: string;
  explanation: string;
};

function buildBank(raws: RawQuestion[], startId: number): Question[] {
  return raws.map((r, i) => {
    const correctIndex = r.options.indexOf(r.answer);
    if (correctIndex === -1) {
      throw new Error(`Jawaban tidak cocok dengan opsi mana pun: ${r.prompt}`);
    }
    return {
      id: startId + i,
      prompt: r.prompt,
      code: r.code,
      options: r.options,
      correctIndex,
      explanation: r.explanation,
    };
  });
}

const logicRaw: RawQuestion[] = [
  {
    prompt: "Number series: 2, 5, 11, 23, 47, ?",
    options: ["70", "94", "95", "96"],
    answer: "95",
    explanation: "Each term is the previous one times 2, plus 1 (47 x 2 + 1 = 95).",
  },
  {
    prompt: "Number series: 4, 6, 10, 16, 26, ?",
    options: ["36", "40", "42", "44"],
    answer: "42",
    explanation: "Each term is the sum of the two preceding terms (16 + 26 = 42).",
  },
  {
    prompt: "Number series: 3, 6, 5, 10, 9, 18, 17, ?",
    options: ["33", "34", "35", "36"],
    answer: "34",
    explanation: "The rule alternates: multiply by 2, then subtract 1. After 17 comes 17 x 2 = 34.",
  },
  {
    prompt: "Letter series: B, D, G, K, P, ?",
    options: ["U", "V", "W", "X"],
    answer: "V",
    explanation: "The gaps grow +2, +3, +4, +5, +6. P (16th letter) + 6 = V (22nd letter).",
  },
  {
    prompt: "Letter series: A, C, F, J, O, ?",
    options: ["T", "U", "V", "W"],
    answer: "U",
    explanation: "The gaps grow +2, +3, +4, +5, +6. O (15th letter) + 6 = U (21st letter).",
  },
  {
    prompt: "All engineers are logical. Some logical people are creative. Therefore:",
    options: [
      "All engineers are creative",
      "Some engineers are creative",
      "No valid conclusion can be drawn",
      "All creative people are engineers",
    ],
    answer: "No valid conclusion can be drawn",
    explanation:
      "The creative people might fall entirely outside the engineers, so nothing certain links engineers and creativity.",
  },
  {
    prompt: "No reptiles have fur. All snakes are reptiles. Therefore:",
    options: [
      "Some snakes have fur",
      "No snakes have fur",
      "All snakes have fur",
      "Snakes are mammals",
    ],
    answer: "No snakes have fur",
    explanation: "Snakes are reptiles, and no reptile has fur, so no snake has fur.",
  },
  {
    prompt:
      "In a queue: P is ahead of Q but behind R. S stands behind Q. T is ahead of R. Who is at the front of the queue?",
    options: ["P", "R", "S", "T"],
    answer: "T",
    explanation: "Order from front: T, R, P, Q, S. T is ahead of everyone.",
  },
  {
    prompt:
      "Pointing at a man, a woman says: 'His mother is the only daughter of my mother.' How is the woman related to the man?",
    options: ["Sister", "Mother", "Aunt", "Grandmother"],
    answer: "Mother",
    explanation:
      "'The only daughter of my mother' is the woman herself, so she is the man's mother.",
  },
  {
    prompt: "If CAT is coded as DBU, how is DOG coded?",
    options: ["EPH", "CPF", "EQH", "DPH"],
    answer: "EPH",
    explanation: "Each letter is shifted forward by one: D->E, O->P, G->H.",
  },
  {
    prompt: "If MONDAY is written as NPOEBZ, then FRIDAY is written as?",
    options: ["GSJEBZ", "GSJFBZ", "ESJEBZ", "GTJEBZ"],
    answer: "GSJEBZ",
    explanation:
      "Every letter shifts forward by one: F->G, R->S, I->J, D->E, A->B, Y->Z.",
  },
  {
    prompt: "6 workers build a wall in 8 days. At the same rate, how many days do 4 workers need?",
    options: ["10 days", "12 days", "16 days", "6 days"],
    answer: "12 days",
    explanation: "Total work = 6 x 8 = 48 worker-days; 48 / 4 = 12 days.",
  },
  {
    prompt: "If 5 machines make 5 parts in 5 minutes, how long do 100 machines need to make 100 parts?",
    options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"],
    answer: "5 minutes",
    explanation:
      "Each machine makes 1 part in 5 minutes, so 100 machines make 100 parts in the same 5 minutes.",
  },
  {
    prompt: "A train travels 240 km in 3 hours. At the same speed, how far does it go in 5 hours?",
    options: ["360 km", "400 km", "420 km", "480 km"],
    answer: "400 km",
    explanation: "Speed = 240 / 3 = 80 km/h; 80 x 5 = 400 km.",
  },
  {
    prompt:
      "Two stations are 300 km apart. Two trains move toward each other at 40 km/h and 60 km/h. After how many hours do they meet?",
    options: ["2 hours", "3 hours", "4 hours", "5 hours"],
    answer: "3 hours",
    explanation: "Closing speed = 40 + 60 = 100 km/h; 300 / 100 = 3 hours.",
  },
  {
    prompt: "A price rises by 20%, then falls by 20%. The net result is:",
    options: ["No change", "A 4% decrease", "A 4% increase", "A 2% decrease"],
    answer: "A 4% decrease",
    explanation: "1.20 x 0.80 = 0.96, which is a 4% decrease from the original.",
  },
  {
    prompt: "After a 25% discount, a jacket costs $90. What was its original price?",
    options: ["$110", "$112.50", "$115", "$120"],
    answer: "$120",
    explanation: "$90 is 75% of the original, so original = 90 / 0.75 = $120.",
  },
  {
    prompt: "Two numbers are in the ratio 3:5 and their sum is 64. What is the larger number?",
    options: ["24", "40", "45", "48"],
    answer: "40",
    explanation: "The 8 parts total 64, so 1 part = 8; the larger number is 5 x 8 = 40.",
  },
  {
    prompt:
      "The average of 5 numbers is 20. If the number 16 is removed, what is the average of the remaining four?",
    options: ["19", "20", "21", "22"],
    answer: "21",
    explanation: "Total = 100; remove 16 -> 84; 84 / 4 = 21.",
  },
  {
    prompt: "Today is Wednesday. What day will it be 75 days from now?",
    options: ["Sunday", "Monday", "Tuesday", "Friday"],
    answer: "Monday",
    explanation: "75 / 7 leaves a remainder of 5; Wednesday + 5 days = Monday.",
  },
  {
    prompt: "What is the angle between the hour and minute hands at 3:30?",
    options: ["75 degrees", "85 degrees", "90 degrees", "105 degrees"],
    answer: "75 degrees",
    explanation:
      "At 3:30 the minute hand is at 180 degrees and the hour hand at 105 degrees; the gap is 75 degrees.",
  },
  {
    prompt: "Cup is to Coffee as Bowl is to ?",
    options: ["Spoon", "Soup", "Plate", "Kitchen"],
    answer: "Soup",
    explanation: "A cup holds coffee, just as a bowl holds soup (container to contents).",
  },
  {
    prompt: "Author is to Novel as Composer is to ?",
    options: ["Orchestra", "Symphony", "Note", "Stage"],
    answer: "Symphony",
    explanation: "An author creates a novel, just as a composer creates a symphony.",
  },
  {
    prompt: "Which number does not belong: 8, 27, 64, 100, 125?",
    options: ["27", "64", "100", "125"],
    answer: "100",
    explanation: "8, 27, 64, and 125 are perfect cubes; 100 is not.",
  },
  {
    prompt: "Which shape does not belong: Square, Triangle, Circle, Rectangle?",
    options: ["Square", "Triangle", "Circle", "Rectangle"],
    answer: "Circle",
    explanation: "A circle has no straight sides or corners; the others are polygons.",
  },
  {
    prompt: "If x = 2^3 and y = 3^2, which statement is true?",
    options: ["x > y", "x < y", "x = y", "Cannot be determined"],
    answer: "x < y",
    explanation: "x = 8 and y = 9, so x < y.",
  },
  {
    prompt: "How many times does the digit 7 appear when writing the numbers 1 to 100?",
    options: ["10", "11", "19", "20"],
    answer: "20",
    explanation:
      "10 in the units place (7, 17, ... 97) plus 10 in the tens place (70-79) = 20.",
  },
  {
    prompt: "Six people each shake hands once with every other person. How many handshakes occur?",
    options: ["12", "15", "18", "30"],
    answer: "15",
    explanation: "Handshakes = 6 x 5 / 2 = 15.",
  },
  {
    prompt:
      "A bag holds 3 red and 2 blue balls. If one ball is drawn at random, what is the probability it is red?",
    options: ["2/5", "1/2", "3/5", "2/3"],
    answer: "3/5",
    explanation: "There are 3 red balls out of 5 total, so the probability is 3/5.",
  },
  {
    prompt: "If all Bloops are Razzies and all Razzies are Lazzies, which statement must be true?",
    options: [
      "All Lazzies are Bloops",
      "All Bloops are Lazzies",
      "Some Lazzies are not Razzies",
      "No Bloop is a Lazzie",
    ],
    answer: "All Bloops are Lazzies",
    explanation:
      "The relations chain: Bloops -> Razzies -> Lazzies, so all Bloops must be Lazzies.",
  },
  {
    prompt: "Number series: 1, 2, 6, 24, 120, ?",
    options: ["240", "600", "720", "840"],
    answer: "720",
    explanation:
      "Each term is the previous one multiplied by the next integer (factorials): 120 x 6 = 720.",
  },
  {
    prompt:
      "A father is 4 times as old as his son. In 5 years he will be 3 times as old. How old is the son now?",
    options: ["8", "10", "12", "15"],
    answer: "10",
    explanation: "Let the son be x: 4x + 5 = 3(x + 5) gives x = 10.",
  },
  {
    prompt:
      "Five books are stacked. A is at the top. D is just below A. C is above E, and B is below E. Which book is at the bottom?",
    options: ["B", "C", "D", "E"],
    answer: "B",
    explanation: "From top to bottom the order is A, D, C, E, B, so B is at the bottom.",
  },
  {
    prompt: "A shopkeeper buys an item for $80 and sells it for $100. What is the profit percentage?",
    options: ["20%", "25%", "33%", "40%"],
    answer: "25%",
    explanation: "The profit is $20 on a cost of $80, and 20 / 80 = 25%.",
  },
  {
    prompt: "Some artists are painters. All painters are creative. Which conclusion is valid?",
    options: [
      "All artists are creative",
      "Some artists are creative",
      "All creative people are artists",
      "No artist is creative",
    ],
    answer: "Some artists are creative",
    explanation:
      "The artists who are painters must be creative, so at least some artists are creative.",
  },
];

const pseudocodeRaw: RawQuestion[] = [
  {
    prompt: "What is the output of this pseudocode?",
    code: `x = 5
y = 3
x = x + y
y = x - y
x = x - y
print(x, y)`,
    options: ["5 3", "3 5", "8 5", "3 3"],
    answer: "3 5",
    explanation:
      "This swaps two values without a temporary variable: x becomes 3 and y becomes 5.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `sum = 0
for i = 1 to 5
    sum = sum + i
print(sum)`,
    options: ["10", "15", "20", "25"],
    answer: "15",
    explanation: "It adds 1 + 2 + 3 + 4 + 5 = 15.",
  },
  {
    prompt: "What is the output?",
    code: `function mystery(n)
    if n <= 1
        return 1
    return n * mystery(n - 1)
print(mystery(4))`,
    options: ["10", "16", "24", "256"],
    answer: "24",
    explanation: "mystery computes a factorial: 4 x 3 x 2 x 1 = 24.",
  },
  {
    prompt: "What is the final value printed?",
    code: `count = 0
for i = 1 to 10
    if i mod 2 == 0
        count = count + 1
print(count)`,
    options: ["4", "5", "6", "10"],
    answer: "5",
    explanation: "It counts even numbers from 1 to 10 (2, 4, 6, 8, 10), which is 5.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `a = 2
b = 1
for i = 1 to 4
    temp = a + b
    a = b
    b = temp
print(b)`,
    options: ["8", "11", "13", "18"],
    answer: "11",
    explanation:
      "Each pass sets b = a + b (a Fibonacci-style step): b becomes 3, 4, 7, then 11.",
  },
  {
    prompt: "How many steps are printed?",
    code: `n = 16
steps = 0
while n > 1
    n = n / 2
    steps = steps + 1
print(steps)`,
    options: ["3", "4", "5", "8"],
    answer: "4",
    explanation: "Halving 16 -> 8 -> 4 -> 2 -> 1 takes 4 steps (log base 2 of 16 = 4).",
  },
  {
    prompt: "What is the output?",
    code: `result = 0
for i = 1 to 3
    for j = 1 to 3
        result = result + 1
print(result)`,
    options: ["6", "9", "12", "27"],
    answer: "9",
    explanation: "The inner loop runs 3 times for each of the 3 outer iterations: 3 x 3 = 9.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `arr = [4, 2, 7, 1, 9]
max = arr[0]
for i = 1 to 4
    if arr[i] > max
        max = arr[i]
print(max)`,
    options: ["4", "7", "9", "1"],
    answer: "9",
    explanation: "The loop tracks the largest value seen, which is 9.",
  },
  {
    prompt: "What is printed when this runs?",
    code: `x = 7
if x > 10
    print("A")
else if x > 5
    print("B")
else
    print("C")`,
    options: ["A", "B", "C", "Nothing"],
    answer: "B",
    explanation:
      "x is not greater than 10 but it is greater than 5, so the second branch prints B.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `a = true
b = false
if a AND NOT b
    print("X")
else
    print("Y")`,
    options: ["X", "Y", "true", "Nothing"],
    answer: "X",
    explanation: "NOT b is true and a is true, so 'a AND NOT b' is true and it prints X.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `total = 0
for i = 1 to 5
    total = total + i * i
print(total)`,
    options: ["25", "45", "55", "65"],
    answer: "55",
    explanation: "It sums the squares 1 + 4 + 9 + 16 + 25 = 55.",
  },
  {
    prompt: "What is the output?",
    code: `s = "ABCD"
result = ""
for i = length(s) down to 1
    result = result + s[i]
print(result)`,
    options: ["ABCD", "DCBA", "DBCA", "ABDC"],
    answer: "DCBA",
    explanation: "It appends characters from last to first, reversing the string to DCBA.",
  },
  {
    prompt: "What is the final value of y?",
    code: `x = 20
y = 0
while x > 0
    if x mod 3 == 0
        y = y + 1
    x = x - 1
print(y)`,
    options: ["5", "6", "7", "18"],
    answer: "6",
    explanation:
      "It counts the multiples of 3 from 1 to 20 (3, 6, 9, 12, 15, 18), which is 6.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `function f(a, b)
    if a > b
        return a
    else
        return b
print(f(3, 9) + f(7, 2))`,
    options: ["12", "14", "16", "18"],
    answer: "16",
    explanation: "f returns the larger argument: f(3, 9) = 9 and f(7, 2) = 7, so 9 + 7 = 16.",
  },
  {
    prompt: "What is the output?",
    code: `count = 0
for i = 1 to 4
    for j = 1 to 4
        if i == j
            count = count + 1
print(count)`,
    options: ["4", "8", "12", "16"],
    answer: "4",
    explanation: "i equals j only on the diagonal (1-1, 2-2, 3-3, 4-4), so count is 4.",
  },
];

const oopRaw: RawQuestion[] = [
  {
    prompt:
      "Which OOP principle bundles data with the methods that operate on it and restricts direct outside access?",
    options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
    answer: "Encapsulation",
    explanation: "Encapsulation hides an object's internal state and exposes it only through methods.",
  },
  {
    prompt:
      "A 'Dog' class that derives properties and behaviour from an 'Animal' class is an example of:",
    options: ["Composition", "Inheritance", "Polymorphism", "Encapsulation"],
    answer: "Inheritance",
    explanation: "Inheritance lets a subclass reuse and extend a parent class.",
  },
  {
    prompt: "In OOP, an object is best described as:",
    options: [
      "A blueprint for data",
      "An instance of a class",
      "A type of loop",
      "A function parameter",
    ],
    answer: "An instance of a class",
    explanation: "An object is a concrete instance created from a class blueprint.",
  },
  {
    prompt: "Polymorphism allows you to:",
    options: [
      "Hide an object's internal data",
      "Use a single interface for objects of different types",
      "Create objects from a class",
      "Store values in an array",
    ],
    answer: "Use a single interface for objects of different types",
    explanation: "Polymorphism lets one interface work with many underlying types.",
  },
  {
    prompt:
      "Which OOP concept exposes only the essential features while hiding the implementation complexity?",
    options: ["Abstraction", "Inheritance", "Encapsulation", "Recursion"],
    answer: "Abstraction",
    explanation: "Abstraction shows what an object does while hiding how it does it.",
  },
  {
    prompt: "A class is best described as:",
    options: [
      "A running instance in memory",
      "A blueprint or template for creating objects",
      "A built-in data type",
      "A single variable",
    ],
    answer: "A blueprint or template for creating objects",
    explanation: "A class defines the data and behaviour that its objects will have.",
  },
  {
    prompt: "Method overriding means:",
    options: [
      "Calling a method twice",
      "Providing a new implementation of a method inherited from a parent class",
      "Defining two methods with the same name but different parameters",
      "Removing a method from a class",
    ],
    answer: "Providing a new implementation of a method inherited from a parent class",
    explanation: "Overriding replaces an inherited method's behaviour in the subclass.",
  },
  {
    prompt: "Method overloading refers to:",
    options: [
      "Methods with the same name but different parameter lists",
      "A method that calls itself",
      "A method that returns nothing",
      "Inheriting from two classes",
    ],
    answer: "Methods with the same name but different parameter lists",
    explanation: "Overloading defines several same-named methods distinguished by their parameters.",
  },
  {
    prompt: "The special method that initialises a new object is called a:",
    options: ["Destructor", "Constructor", "Iterator", "Accessor"],
    answer: "Constructor",
    explanation: "A constructor sets up an object's initial state when it is created.",
  },
  {
    prompt: "What are the four main pillars of OOP?",
    options: [
      "Encapsulation, Inheritance, Polymorphism, Abstraction",
      "Class, Object, Method, Variable",
      "Array, List, Set, Map",
      "Create, Read, Update, Delete",
    ],
    answer: "Encapsulation, Inheritance, Polymorphism, Abstraction",
    explanation:
      "The four pillars are Encapsulation, Inheritance, Polymorphism, and Abstraction.",
  },
  {
    prompt: "Which access level makes a member accessible only within its own class?",
    options: ["Public", "Private", "Protected", "Global"],
    answer: "Private",
    explanation: "A private member can be used only inside the class that declares it.",
  },
  {
    prompt: "An 'is-a' relationship between two classes is best modelled by:",
    options: ["Inheritance", "Composition", "Encapsulation", "Aggregation"],
    answer: "Inheritance",
    explanation: "An 'is-a' link (a Dog is an Animal) is expressed through inheritance.",
  },
  {
    prompt: "A 'has-a' relationship, where one object is built from other objects, is called:",
    options: ["Inheritance", "Composition", "Polymorphism", "Overriding"],
    answer: "Composition",
    explanation: "A 'has-a' link (a Car has an Engine) is expressed through composition.",
  },
  {
    prompt: "An abstract class is one that:",
    options: [
      "Has no methods at all",
      "Cannot be instantiated directly and is meant to be subclassed",
      "Can only contain constants",
      "Always runs faster than a normal class",
    ],
    answer: "Cannot be instantiated directly and is meant to be subclassed",
    explanation: "An abstract class defines a common base and must be extended before it can be used.",
  },
  {
    prompt: "An interface (or protocol) primarily defines:",
    options: [
      "The exact memory layout of an object",
      "A set of methods a class must implement, without providing the implementation",
      "A way to store data permanently",
      "The execution speed of a class",
    ],
    answer: "A set of methods a class must implement, without providing the implementation",
    explanation: "An interface is a contract of methods that conforming classes must implement.",
  },
];

const swiftRaw: RawQuestion[] = [
  {
    prompt: "Which keyword declares a constant (immutable) value in Swift?",
    options: ["var", "let", "const", "final"],
    answer: "let",
    explanation: "'let' declares a constant; use 'var' for values that can change.",
  },
  {
    prompt: "What is the output of: print([1, 2, 3].map { $0 * 2 })",
    options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "Error"],
    answer: "[2, 4, 6]",
    explanation: "map doubles each element, producing [2, 4, 6].",
  },
  {
    prompt: "Which type represents a value that may be present or absent (nil)?",
    options: ["Double", "Optional", "Bool", "Tuple"],
    answer: "Optional",
    explanation: "An Optional holds either a value or nil (no value).",
  },
  {
    prompt: "What does the nil-coalescing operator '??' do?",
    options: [
      "Multiplies two numbers",
      "Provides a default value when an optional is nil",
      "Compares two strings",
      "Force-unwraps an optional",
    ],
    answer: "Provides a default value when an optional is nil",
    explanation: "'a ?? b' returns a if it has a value, otherwise the default b.",
  },
  {
    prompt: "If a and b are both Int, what does print(7 / 2) output?",
    options: ["3.5", "3", "4", "Error"],
    answer: "3",
    explanation: "Integer division discards the remainder, so 7 / 2 is 3.",
  },
  {
    prompt: "Which Swift collection stores unique, unordered values?",
    options: ["Array", "Dictionary", "Set", "Tuple"],
    answer: "Set",
    explanation: "A Set keeps only unique elements and has no defined order.",
  },
  {
    prompt: "How do you add an element x to the end of an array named list?",
    options: ["list.add(x)", "list.push(x)", "list.append(x)", "list.insert(x)"],
    answer: "list.append(x)",
    explanation: "append(_:) adds an element to the end of an array.",
  },
  {
    prompt: "Which is the correct string interpolation syntax in Swift?",
    options: ["${value}", "\\(value)", "#{value}", "{{value}}"],
    answer: "\\(value)",
    explanation: "Swift inserts a value into a string literal with \\(expression).",
  },
  {
    prompt: "Which loop always executes its body at least once?",
    options: ["for-in", "while", "repeat-while", "guard"],
    answer: "repeat-while",
    explanation: "repeat-while checks its condition after running the body, so it runs at least once.",
  },
  {
    prompt: "What is the purpose of a 'guard' statement in Swift?",
    options: [
      "Repeats a block of code",
      "Exits the current scope early if a condition is not met",
      "Declares a constant",
      "Defines a new class",
    ],
    answer: "Exits the current scope early if a condition is not met",
    explanation: "guard leaves the scope early when a requirement fails, keeping the main path clean.",
  },
  {
    prompt: 'What is the output of: print("Hello".count)',
    options: ["4", "5", "6", "Error"],
    answer: "5",
    explanation: "count returns the number of characters in the string, which is 5.",
  },
  {
    prompt: "Which keyword defines a value type that is copied when assigned?",
    options: ["class", "struct", "protocol", "enum"],
    answer: "struct",
    explanation: "A struct is a value type, so assigning it makes an independent copy.",
  },
  {
    prompt: "What is the safe way to unwrap an optional named 'name'?",
    options: ["if let unwrapped = name { ... }", "name!", "unwrap(name)", "name.value"],
    answer: "if let unwrapped = name { ... }",
    explanation:
      "Optional binding with 'if let' unwraps the value only when it is not nil; 'name!' force-unwraps and crashes on nil.",
  },
  {
    prompt: 'What does "Hi" + "There" produce in Swift?',
    options: [
      "Adds their lengths",
      'Concatenates them into "HiThere"',
      "Causes a runtime error",
      "Compares the two strings",
    ],
    answer: 'Concatenates them into "HiThere"',
    explanation: "The + operator joins two strings end to end.",
  },
  {
    prompt: "Which Swift collection stores key-value pairs?",
    options: ["Array", "Set", "Dictionary", "Tuple"],
    answer: "Dictionary",
    explanation: "A Dictionary maps unique keys to their associated values.",
  },
];

// ===========================================================================
// SOAL TAMBAHAN (upgrade) — bank lama tetap dipakai, ini menambah variasi.
// ===========================================================================

/** Logic — seating / arrangement (semua hard, jawaban unik). */
const logicSeatingRaw: RawQuestion[] = [
  {
    prompt:
      "Five students — P, Q, R, S, T — sit in a row, all facing north. P sits exactly in the middle. R sits at one of the two ends. T sits immediately to the right of R. Q sits immediately to the left of S. Who sits at the far-right end?",
    options: ["S", "Q", "T", "R"],
    answer: "S",
    explanation:
      "Since T is to R's right, R must be the left end (1) and T is 2. P is the middle (3). Q is immediately left of S, so Q is 4 and S is 5. The far-right seat is S.",
  },
  {
    prompt:
      "Six people — A, B, C, D, E, F — sit in a row facing north. C sits at the left end and A sits immediately to the right of C. D sits at the right end. There are exactly two people between A and B. E sits immediately to the left of B. Who is seated third from the left end?",
    options: ["F", "E", "A", "B"],
    answer: "F",
    explanation:
      "C is at position 1 and A at 2. With two people between A and B, B is at 5, and E (just left of B) is at 4. D is at the right end (6), leaving F at position 3 — third from the left.",
  },
  {
    prompt:
      "Six people — A, B, C, D, E, F — sit around a circular table facing the centre. A sits directly opposite D. B is in the seat immediately clockwise from A. C sits directly opposite B. E is in the seat immediately anticlockwise from D. Who sits directly opposite E?",
    options: ["F", "C", "B", "A"],
    answer: "F",
    explanation:
      "Seat A; B is the next seat clockwise. D is opposite A and C is opposite B. E is just anticlockwise of D, which leaves F in the only remaining seat — directly opposite E.",
  },
  {
    prompt:
      "Seven books — P, Q, R, S, T, U, V — are placed in a single vertical stack. S is at the top. T is immediately below S. Exactly two books lie between S and R. U is between T and R. R is immediately above P. Exactly one book lies between P and Q. Which book is at the bottom of the stack?",
    options: ["Q", "V", "P", "T"],
    answer: "Q",
    explanation:
      "From the top: S(1), T(2). Two books lie between S and R, so R is 4 with U at 3. R is just above P, so P is 5. One book separates P and Q, forcing Q to the bottom (7) with V at 6.",
  },
  {
    prompt:
      "Four friends — Aanya, Bima, Citra, Dito — each ordered a different drink: tea, coffee, juice, or soda. Aanya ordered neither tea nor coffee. Bima ordered juice. Citra did not order soda. Dito did not order coffee. Who ordered coffee?",
    options: ["Citra", "Dito", "Aanya", "Bima"],
    answer: "Citra",
    explanation:
      "Bima had juice and Aanya (no tea/coffee/juice) had soda. Dito did not have coffee, so of the remaining tea and coffee, Dito took tea and Citra took coffee.",
  },
  {
    prompt:
      "Five people — K, L, M, N, O — stand in a row, all facing south (so each person's right hand points west and left points east). K is at the west end. L is immediately to K's left. M is at the east end. N is immediately to M's right. Who stands exactly in the middle?",
    options: ["O", "N", "L", "K"],
    answer: "O",
    explanation:
      "Facing south, right points west and left points east. K is at the west end (1); L, to K's left (east), is 2. M is at the east end (5); N, to M's right (west), is 4. That leaves O in the middle (3).",
  },
];

/** Logic — hard miscellaneous (series, blood relation, direction, clock, syllogism, coding). */
const logicHardRaw: RawQuestion[] = [
  {
    prompt: "Number series: 3, 7, 16, 35, 74, ?",
    options: ["153", "148", "150", "155"],
    answer: "153",
    explanation:
      "Each term is double the previous plus a counter that grows by one (×2+1, ×2+2, ×2+3, ×2+4, ×2+5): 74 × 2 + 5 = 153.",
  },
  {
    prompt:
      "A woman pointing to a man says: 'His father is the only son of my father.' How is the man related to the woman?",
    options: ["Nephew", "Son", "Brother", "Cousin"],
    answer: "Nephew",
    explanation:
      "The only son of the woman's father is her brother. The man's father is that brother, so the man is the woman's nephew.",
  },
  {
    prompt:
      "A man walks 5 km north, turns right and walks 4 km, turns right and walks 5 km, then turns left and walks 3 km. How far is he from the start, and which way is he facing?",
    options: ["7 km, facing east", "7 km, facing west", "9 km, facing east", "√74 km, facing east"],
    answer: "7 km, facing east",
    explanation:
      "Tracking position: north 5 to (0,5); east 4 to (4,5); south 5 to (4,0); east 3 to (7,0). He ends 7 km due east of the start, facing east.",
  },
  {
    prompt:
      "Between 12:00 and 12:00 of the next 12 hours, how many times do the hour and minute hands of a clock overlap?",
    options: ["11", "12", "10", "22"],
    answer: "11",
    explanation:
      "The hands coincide every 12/11 hours, so in 12 hours they overlap 11 times (one overlap is 'skipped' near 12 o'clock).",
  },
  {
    prompt:
      "Statements: All pens are books. Some books are red. No red thing is a chair. Conclusions: I. Some pens are red. II. Some books are not chairs. Which conclusion follows?",
    options: ["Only II", "Only I", "Both I and II", "Neither I nor II"],
    answer: "Only II",
    explanation:
      "The red books are not chairs, so II follows. I does not: the red books need not be among the pens.",
  },
  {
    prompt: "In a certain code 'CAT' is written as 'DZU'. How is 'DOG' written in the same code?",
    options: ["ENH", "EPH", "CNH", "ENG"],
    answer: "ENH",
    explanation:
      "The letters shift +1, −1, +1 in turn: C→D, A→Z, T→U. Applying the same to DOG: D→E, O→N, G→H = ENH.",
  },
];

/**
 * Pseudocode tambahan — gaya Swift-flavored (`value`, `end while`, `+=`, `%`,
 * `length()`, array 0-indexed), campur mudah/sedang/susah.
 */
const pseudocodeNewRaw: RawQuestion[] = [
  {
    prompt: "What is the output of this pseudocode?",
    code: `value a = 4
value b = 7
print(a + b * 2)`,
    options: ["18", "22", "15", "11"],
    answer: "18",
    explanation: "Multiplication happens before addition: 7 × 2 = 14, then + 4 = 18.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `print(length("Code") + 1)`,
    options: ["5", "4", "6", "Error"],
    answer: "5",
    explanation: "The string \"Code\" has 4 characters; 4 + 1 = 5.",
  },
  {
    prompt: "What is the output?",
    code: `value x = 17
print(x / 5)`,
    options: ["3", "3.4", "4", "2"],
    answer: "3",
    explanation: "Integer division drops the remainder: 17 / 5 = 3.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `print(29 % 6)`,
    options: ["5", "4", "6", "3"],
    answer: "5",
    explanation: "The remainder of 29 divided by 6 is 5 (6 × 4 = 24, 29 − 24 = 5).",
  },
  {
    prompt: "What is printed?",
    code: `value arr = [10, 20, 30, 40]
print(arr[2])`,
    options: ["30", "20", "40", "10"],
    answer: "30",
    explanation: "Arrays are zero-indexed, so arr[2] is the third element, 30.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `value first = "Swi"
value second = "ft"
print(first + second + "!")`,
    options: ["Swift!", "Swi ft!", "ftSwi!", "Error"],
    answer: "Swift!",
    explanation: "The + operator joins strings end to end: \"Swi\" + \"ft\" + \"!\" = \"Swift!\".",
  },
  {
    prompt: "What is the output?",
    code: `value total = 0
for i = 1 to 6
    total += i
end for
print(total)`,
    options: ["21", "15", "28", "20"],
    answer: "21",
    explanation: "It adds 1 + 2 + 3 + 4 + 5 + 6 = 21.",
  },
  {
    prompt: "What is the final value printed?",
    code: `value count = 0
for i = 1 to 20
    if i % 3 == 0
        count += 1
    end if
end for
print(count)`,
    options: ["6", "7", "5", "3"],
    answer: "6",
    explanation: "It counts the multiples of 3 from 1 to 20 (3, 6, 9, 12, 15, 18) = 6.",
  },
  {
    prompt: "What is the output?",
    code: `value result = 0
for i = 1 to 3
    for j = i to 3
        result += 1
    end for
end for
print(result)`,
    options: ["6", "9", "3", "7"],
    answer: "6",
    explanation: "The inner loop runs 3 + 2 + 1 = 6 times in total because j starts at i.",
  },
  {
    prompt: "How many steps are printed?",
    code: `value n = 50
value steps = 0
while n > 1
    if n % 2 == 0
        n = n / 2
    else
        n = n - 1
    end if
    steps += 1
end while
print(steps)`,
    options: ["7", "6", "8", "5"],
    answer: "7",
    explanation:
      "Sequence of n: 50→25→24→12→6→3→2→1, which is 7 steps.",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `value a = 8
value b = 3
a = a - b
b = a + b
a = b - a
print(a, b)`,
    options: ["3 8", "8 3", "5 8", "3 3"],
    answer: "3 8",
    explanation: "This swaps two values without a temporary variable: a becomes 3 and b becomes 8.",
  },
  {
    prompt: "What is printed?",
    code: `value sunny = true
value warm = false
if sunny AND NOT warm
    print("Go out")
else
    print("Stay in")
end if`,
    options: ["Go out", "Stay in", "true", "Error"],
    answer: "Go out",
    explanation: "NOT warm is true and sunny is true, so 'sunny AND NOT warm' is true and it prints \"Go out\".",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `value raining = false
value cold = true
if raining OR cold
    print("Bring a jacket")
else
    print("No jacket")
end if`,
    options: ["Bring a jacket", "No jacket", "true", "Error"],
    answer: "Bring a jacket",
    explanation: "OR is true when at least one side is true; cold is true, so it prints \"Bring a jacket\".",
  },
  {
    prompt: "What is the output?",
    code: `function f(n)
    if n <= 1
        return 1
    end if
    return n * f(n - 2)
end function
print(f(6))`,
    options: ["48", "720", "46", "24"],
    answer: "48",
    explanation: "f multiplies n by f(n − 2): 6 × 4 × 2 × 1 = 48 (f(0) returns 1).",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `function fib(n)
    if n < 2
        return n
    end if
    return fib(n - 1) + fib(n - 2)
end function
print(fib(7))`,
    options: ["13", "21", "8", "11"],
    answer: "13",
    explanation: "fib produces 0, 1, 1, 2, 3, 5, 8, 13; fib(7) = 13.",
  },
  {
    prompt: "What is printed?",
    code: `value arr = [5, 1, 4, 2, 8]
value m = arr[0]
for i = 1 to 4
    if arr[i] < m
        m = arr[i]
    end if
end for
print(m)`,
    options: ["1", "8", "5", "2"],
    answer: "1",
    explanation: "It tracks the smallest value seen in the array, which is 1.",
  },
  {
    prompt: "What is the output?",
    code: `value s = "LOOP"
value out = ""
for i = length(s) - 1 down to 0
    out = out + s[i]
end for
print(out)`,
    options: ["POOL", "LOOP", "OOLP", "PLOO"],
    answer: "POOL",
    explanation: "It appends characters from the last index (3) down to 0, reversing \"LOOP\" into \"POOL\".",
  },
  {
    prompt: "What does this pseudocode print?",
    code: `value a = 3
value b = 5
for i = 1 to 4
    value t = a + b
    a = b
    b = t
end for
print(b)`,
    options: ["34", "21", "55", "29"],
    answer: "34",
    explanation: "Each pass sets b = a + b (a Fibonacci-style step): b becomes 8, 13, 21, then 34.",
  },
  {
    prompt: "What is the output?",
    code: `value sum = 0
for i = 1 to 5
    for j = 1 to 5
        if j > i
            sum += j
        end if
    end for
end for
print(sum)`,
    options: ["40", "35", "45", "30"],
    answer: "40",
    explanation:
      "For each i it adds the j values greater than i: 14 + 12 + 9 + 5 + 0 = 40.",
  },
  {
    prompt: "What is printed?",
    code: `value n = 4825
value sum = 0
while n > 0
    sum += n % 10
    n = n / 10
end while
print(sum)`,
    options: ["19", "18", "20", "17"],
    answer: "19",
    explanation:
      "Using % 10 and integer / 10 it adds the digits: 5 + 2 + 8 + 4 = 19.",
  },
];

/** OOP tambahan — konsep murni, sebagian dengan snippet kelas (Swift-flavored). */
const oopNewRaw: RawQuestion[] = [
  {
    prompt: "What is printed when this runs?",
    code: `class Animal
    function speak()
        print("...")
    end function
end class

class Dog: Animal
    override function speak()
        print("Woof")
    end function
end class

value a: Animal = Dog()
a.speak()`,
    options: ["Woof", "...", "Error", "Nothing"],
    answer: "Woof",
    explanation:
      "Although 'a' is typed as Animal, it holds a Dog, so the overridden speak() runs and prints \"Woof\" (runtime polymorphism).",
  },
  {
    prompt: "What does this code print?",
    code: `class Shape
    function area()
        return 0
    end function
end class

class Square: Shape
    value side: Int
    constructor(side: Int)
        self.side = side
    end constructor
    override function area()
        return side * side
    end function
end class

value s = Square(side: 4)
print(s.area())`,
    options: ["16", "8", "0", "Error"],
    answer: "16",
    explanation: "Square overrides area() to return side × side = 4 × 4 = 16.",
  },
  {
    prompt:
      "Why is it good practice to keep a class's stored properties private and change them only through its methods?",
    options: [
      "To protect the object's internal state and control how it can change",
      "To make the program run faster",
      "To allow a class to inherit from many classes",
      "To avoid having to write a constructor",
    ],
    answer: "To protect the object's internal state and control how it can change",
    explanation:
      "Hiding state behind methods (encapsulation) lets the class enforce its own rules and keep its data valid.",
  },
  {
    prompt:
      "Circle, Square, and Triangle all conform to a 'Drawable' protocol with a draw() method, and a function calls draw() on any of them without knowing the concrete type. This is an example of:",
    options: ["Polymorphism", "Encapsulation", "Inheritance", "Recursion"],
    answer: "Polymorphism",
    explanation: "Using a single interface (Drawable) for many different types is polymorphism.",
  },
  {
    prompt: "Which statement about a protocol (interface) is correct?",
    options: [
      "It cannot be instantiated on its own; a type must conform to and implement it",
      "It always provides full implementations of its methods",
      "It can store instance data just like a class",
      "It always runs faster than a class",
    ],
    answer: "It cannot be instantiated on its own; a type must conform to and implement it",
    explanation:
      "A protocol is a contract of required methods; you cannot create an object from it directly — a conforming type must implement it.",
  },
  {
    prompt:
      "Favouring 'has-a' relationships (building objects out of smaller objects) instead of deep inheritance hierarchies is often called:",
    options: ["Composition over inheritance", "Method overloading", "Encapsulation", "Abstraction"],
    answer: "Composition over inheritance",
    explanation:
      "Composition over inheritance builds behaviour by combining objects rather than extending long chains of classes.",
  },
  {
    prompt: "Inside an instance method, the keyword 'self' (or 'this') refers to:",
    options: [
      "The current instance the method was called on",
      "The parent class of the object",
      "A class-level (static) variable",
      "A brand-new copy of the object",
    ],
    answer: "The current instance the method was called on",
    explanation: "'self' is a reference to the specific object the method is currently running on.",
  },
  {
    prompt: "A property declared 'static' (class-level) is:",
    options: [
      "Shared by all instances and accessed on the class itself",
      "Unique to each instance",
      "Automatically private",
      "Created fresh on every method call",
    ],
    answer: "Shared by all instances and accessed on the class itself",
    explanation: "A static member belongs to the class, not to any single instance, so all instances share it.",
  },
  {
    prompt:
      "A class has two methods: area(radius:) and area(width:height:). Defining several same-named methods that differ by their parameters is called:",
    options: ["Overloading", "Overriding", "Runtime polymorphism", "Inheritance"],
    answer: "Overloading",
    explanation: "Same name, different parameter lists within one type is method overloading (resolved at compile time).",
  },
  {
    prompt: "Marking a class as 'final' means that:",
    options: [
      "It cannot be subclassed (no class may inherit from it)",
      "It cannot contain any methods",
      "It must be abstract",
      "No objects of it can be created",
    ],
    answer: "It cannot be subclassed (no class may inherit from it)",
    explanation: "A final class is closed to inheritance; you can still create objects of it, but you cannot subclass it.",
  },
  {
    prompt: "What happens when this code runs?",
    code: `class Vehicle
    function move()
        print("Moving")
    end function
end class

class Bike: Vehicle
    function ringBell()
        print("Ring")
    end function
end class

value v: Vehicle = Bike()
v.ringBell()`,
    options: [
      "A type error: Vehicle has no method ringBell()",
      "It prints \"Ring\"",
      "It prints \"Moving\"",
      "It prints nothing",
    ],
    answer: "A type error: Vehicle has no method ringBell()",
    explanation:
      "'v' is typed as Vehicle, which has no ringBell(). Even though the object is a Bike, calling a subclass-only method through the parent type is a type error.",
  },
  {
    prompt: "In the constructor below, what is the role of super.init(balance: balance)?",
    code: `class Account
    value balance: Int
    constructor(balance: Int)
        self.balance = balance
    end constructor
end class

class Savings: Account
    value rate: Int
    constructor(balance: Int, rate: Int)
        super.init(balance: balance)
        self.rate = rate
    end constructor
end class`,
    options: [
      "It runs the parent class's initializer to set up the inherited properties",
      "It creates a second, separate Account object",
      "It overrides the parent's constructor",
      "It deletes the balance property",
    ],
    answer: "It runs the parent class's initializer to set up the inherited properties",
    explanation:
      "super.init calls the parent's initializer so the inherited 'balance' is set up before the subclass adds its own properties.",
  },
  {
    prompt:
      "A Manager is a kind of Employee. A Department contains many Employees. These two relationships are, respectively:",
    options: [
      "is-a (inheritance) and has-a (composition)",
      "has-a and is-a",
      "both is-a",
      "both has-a",
    ],
    answer: "is-a (inheritance) and has-a (composition)",
    explanation:
      "'Manager is an Employee' is an is-a link (inheritance); 'Department has Employees' is a has-a link (composition/aggregation).",
  },
  {
    prompt:
      "Given 'class Cat' defines the template and you write 'value c = Cat()', what is 'c'?",
    options: [
      "An object (instance) of the Cat class",
      "Another class",
      "A protocol",
      "A static method",
    ],
    answer: "An object (instance) of the Cat class",
    explanation: "A class is the blueprint; calling Cat() creates a concrete object (instance) named c.",
  },
  {
    prompt: "What is printed?",
    code: `class Shape
    function name()
        return "shape"
    end function
end class
class Circle: Shape
    override function name()
        return "circle"
    end function
end class
class Square: Shape
    override function name()
        return "square"
    end function
end class

value shapes: [Shape] = [Circle(), Square()]
for s in shapes
    print(s.name())
end for`,
    options: ["circle then square", "shape then shape", "circle then circle", "Error"],
    answer: "circle then square",
    explanation:
      "Each element runs its own overridden name() (runtime polymorphism), printing \"circle\" then \"square\".",
  },
];

export const sections: Section[] = [
  {
    id: "logic",
    name: "Logic Test",
    drawCount: 30,
    // Bank: original (35) + seating (6) + hard-misc (6) = 47 soal.
    questions: buildBank([...logicRaw, ...logicSeatingRaw, ...logicHardRaw], 1),
  },
  {
    id: "programming",
    name: "Dasar Pemrograman",
    drawCount: 20,
    // Bank: Pseudocode (15+20) + OOP (15+15) + Swift (15) = 80 soal.
    questions: buildBank(
      [...pseudocodeRaw, ...pseudocodeNewRaw, ...oopRaw, ...oopNewRaw, ...swiftRaw],
      101,
    ),
  },
];

/** Total soal yang dikerjakan peserta per attempt (jumlah drawCount semua section). */
export const TOTAL_DRAW = sections.reduce((n, s) => n + s.drawCount, 0); // 50
