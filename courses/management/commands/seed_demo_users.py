"""
Management command to seed Moroccan demo accounts with CS courses.
Run: python manage.py seed_demo_users
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

# ─── ACCOUNTS ────────────────────────────────────────────────────────────────

OLD_USERNAMES = [
    # previous English names to remove
    "prof_martin", "dr_johnson", "prof_garcia", "dr_chen", "prof_williams",
    "alex_brown", "sofia_patel", "lucas_silva", "amara_diallo", "noah_kim",
    "isla_thompson", "omar_hassan", "chloe_martin", "ethan_miller", "sara_nguyen",
]

TEACHERS = [
    {
        "username": "prof_benali",
        "email": "youssef.benali@learnup.ma",
        "password": "Teacher@123",
        "first_name": "Youssef",
        "last_name": "Benali",
        "course": {
            "titre": "Python Programming & Data Science",
            "description": "Master Python from the ground up — syntax, OOP, data structures, NumPy, Pandas, and data visualisation. Build real-world data analysis projects.",
            "modules": [
                {
                    "titre": "Introduction to Python",
                    "description": "Variables, types, control flow, and functions.",
                    "contenus": [
                        {"titre": "Python Basics — Variables & Data Types", "video_url": "https://www.youtube.com/watch?v=rfscVS0vtbw"},
                        {"titre": "Control Flow: if / for / while", "video_url": "https://www.youtube.com/watch?v=DZwmZ8Usvnk"},
                        {"titre": "Functions & Scope", "video_url": "https://www.youtube.com/watch?v=9Os0o3wzS_I"},
                    ],
                    "quiz": {
                        "titre": "Python Basics Quiz",
                        "questions": [
                            {"texte": "Which keyword defines a function in Python?", "type_question": "choix",
                             "reponses": [("def", True), ("function", False), ("func", False), ("lambda", False)]},
                            {"texte": "What is the output of print(type(3.14))?", "type_question": "choix",
                             "reponses": [("<class 'float'>", True), ("<class 'int'>", False), ("<class 'str'>", False), ("None", False)]},
                            {"texte": "How do you start a for loop in Python?", "type_question": "choix",
                             "reponses": [("for x in range:", False), ("for x in range(10):", True), ("foreach x in 10:", False), ("loop x in range(10):", False)]},
                        ],
                    },
                },
                {
                    "titre": "Object-Oriented Programming",
                    "description": "Classes, inheritance, encapsulation, and polymorphism.",
                    "contenus": [
                        {"titre": "Classes and Objects", "video_url": "https://www.youtube.com/watch?v=apACNr7DC_s"},
                        {"titre": "Inheritance & Polymorphism", "video_url": "https://www.youtube.com/watch?v=3ohzBxoFHAY"},
                    ],
                    "quiz": {
                        "titre": "OOP Quiz",
                        "questions": [
                            {"texte": "What is the constructor method called in Python?", "type_question": "choix",
                             "reponses": [("__init__", True), ("__constructor__", False), ("init()", False), ("build()", False)]},
                            {"texte": "Which OOP concept hides internal implementation?", "type_question": "choix",
                             "reponses": [("Encapsulation", True), ("Inheritance", False), ("Polymorphism", False), ("Abstraction", False)]},
                        ],
                    },
                },
                {
                    "titre": "Data Science with Pandas & NumPy",
                    "description": "Data wrangling, analysis, and visualisation.",
                    "contenus": [
                        {"titre": "NumPy Arrays & Operations", "video_url": "https://www.youtube.com/watch?v=QUT1VHiLmmI"},
                        {"titre": "Pandas DataFrames", "video_url": "https://www.youtube.com/watch?v=vmEHCJofslg"},
                        {"titre": "Data Visualisation with Matplotlib", "video_url": "https://www.youtube.com/watch?v=3Xc3CA655Y4"},
                    ],
                    "quiz": None,
                },
            ],
        },
    },
    {
        "username": "dr_tazi",
        "email": "fatima.tazi@learnup.ma",
        "password": "Teacher@123",
        "first_name": "Fatima",
        "last_name": "Tazi",
        "course": {
            "titre": "Web Development: HTML, CSS & JavaScript",
            "description": "Build modern, responsive websites from scratch. Learn semantic HTML5, CSS3 Flexbox/Grid, and interactive JavaScript ES6+.",
            "modules": [
                {
                    "titre": "HTML5 Foundations",
                    "description": "Structure your web pages with semantic HTML.",
                    "contenus": [
                        {"titre": "HTML Document Structure", "video_url": "https://www.youtube.com/watch?v=UB1O30fR-EE"},
                        {"titre": "Forms and Input Elements", "video_url": "https://www.youtube.com/watch?v=fNcJuPIZ2WE"},
                    ],
                    "quiz": {
                        "titre": "HTML Basics Quiz",
                        "questions": [
                            {"texte": "Which tag creates a hyperlink?", "type_question": "choix",
                             "reponses": [("<a>", True), ("<link>", False), ("<href>", False), ("<nav>", False)]},
                            {"texte": "Which attribute specifies the URL of a link?", "type_question": "choix",
                             "reponses": [("href", True), ("src", False), ("url", False), ("ref", False)]},
                        ],
                    },
                },
                {
                    "titre": "CSS3 & Responsive Design",
                    "description": "Style and layout with Flexbox, Grid, and media queries.",
                    "contenus": [
                        {"titre": "Flexbox Layout", "video_url": "https://www.youtube.com/watch?v=fYq5PXgSsbE"},
                        {"titre": "CSS Grid", "video_url": "https://www.youtube.com/watch?v=jV8B24rSN5o"},
                        {"titre": "Responsive Media Queries", "video_url": "https://www.youtube.com/watch?v=2KL-z9A56SQ"},
                    ],
                    "quiz": {
                        "titre": "CSS Layout Quiz",
                        "questions": [
                            {"texte": "Which property makes a flex container?", "type_question": "choix",
                             "reponses": [("display: flex", True), ("flex: true", False), ("flexbox: on", False), ("display: block", False)]},
                            {"texte": "What does 'justify-content: center' do?", "type_question": "choix",
                             "reponses": [("Centers items along the main axis", True), ("Centers items vertically", False), ("Adds padding", False), ("Sets text-align", False)]},
                        ],
                    },
                },
                {
                    "titre": "JavaScript ES6+",
                    "description": "Interactivity, DOM manipulation, fetch API.",
                    "contenus": [
                        {"titre": "JavaScript Variables & Functions", "video_url": "https://www.youtube.com/watch?v=W6NZfCO5SIk"},
                        {"titre": "DOM Manipulation", "video_url": "https://www.youtube.com/watch?v=y17RuWkWdn8"},
                        {"titre": "Fetch API & Promises", "video_url": "https://www.youtube.com/watch?v=cuEtnrL9-H0"},
                    ],
                    "quiz": {
                        "titre": "JavaScript Quiz",
                        "questions": [
                            {"texte": "Which method adds an element to the end of an array?", "type_question": "choix",
                             "reponses": [("push()", True), ("append()", False), ("add()", False), ("insert()", False)]},
                            {"texte": "What does 'const' do in JavaScript?", "type_question": "choix",
                             "reponses": [("Declares a block-scoped constant", True), ("Declares a variable", False), ("Creates a function", False), ("Defines a class", False)]},
                        ],
                    },
                },
            ],
        },
    },
    {
        "username": "prof_cherkaoui",
        "email": "amine.cherkaoui@learnup.ma",
        "password": "Teacher@123",
        "first_name": "Amine",
        "last_name": "Cherkaoui",
        "course": {
            "titre": "Algorithms & Data Structures",
            "description": "Master the core computer science foundations: arrays, linked lists, trees, graphs, sorting, and Big-O complexity analysis.",
            "modules": [
                {
                    "titre": "Complexity Analysis",
                    "description": "Big-O notation and algorithm efficiency.",
                    "contenus": [
                        {"titre": "Introduction to Big-O Notation", "video_url": "https://www.youtube.com/watch?v=Mo4vesaut8g"},
                        {"titre": "Time vs Space Complexity", "video_url": "https://www.youtube.com/watch?v=8syQKTdgdzc"},
                    ],
                    "quiz": {
                        "titre": "Complexity Quiz",
                        "questions": [
                            {"texte": "What is the time complexity of binary search?", "type_question": "choix",
                             "reponses": [("O(log n)", True), ("O(n)", False), ("O(n²)", False), ("O(1)", False)]},
                            {"texte": "Which sorting algorithm has O(n log n) average complexity?", "type_question": "choix",
                             "reponses": [("Merge Sort", True), ("Bubble Sort", False), ("Selection Sort", False), ("Insertion Sort", False)]},
                        ],
                    },
                },
                {
                    "titre": "Linear Data Structures",
                    "description": "Arrays, stacks, queues, and linked lists.",
                    "contenus": [
                        {"titre": "Arrays and Dynamic Arrays", "video_url": "https://www.youtube.com/watch?v=QJNwK2uJyGs"},
                        {"titre": "Stacks & Queues", "video_url": "https://www.youtube.com/watch?v=wjI1WNcIntg"},
                        {"titre": "Linked Lists", "video_url": "https://www.youtube.com/watch?v=WwfhLC16bis"},
                    ],
                    "quiz": {
                        "titre": "Linear Structures Quiz",
                        "questions": [
                            {"texte": "Which data structure uses LIFO order?", "type_question": "choix",
                             "reponses": [("Stack", True), ("Queue", False), ("Array", False), ("Tree", False)]},
                            {"texte": "In a singly linked list, each node has:", "type_question": "choix",
                             "reponses": [("Data and a next pointer", True), ("Only data", False), ("Two pointers", False), ("A key and value", False)]},
                        ],
                    },
                },
                {
                    "titre": "Trees & Graphs",
                    "description": "Binary trees, BST, BFS, DFS, and graph algorithms.",
                    "contenus": [
                        {"titre": "Binary Search Trees", "video_url": "https://www.youtube.com/watch?v=pYT9F8_LFTM"},
                        {"titre": "BFS & DFS Traversal", "video_url": "https://www.youtube.com/watch?v=TIbUeeksXcI"},
                    ],
                    "quiz": None,
                },
            ],
        },
    },
    {
        "username": "dr_ouali",
        "email": "nadia.ouali@learnup.ma",
        "password": "Teacher@123",
        "first_name": "Nadia",
        "last_name": "Ouali",
        "course": {
            "titre": "Database Design & SQL",
            "description": "Design relational databases, write complex SQL queries, understand indexing, normalisation, and work with PostgreSQL and MySQL.",
            "modules": [
                {
                    "titre": "Relational Database Fundamentals",
                    "description": "Tables, keys, relationships, and ER diagrams.",
                    "contenus": [
                        {"titre": "Introduction to Relational Databases", "video_url": "https://www.youtube.com/watch?v=wR0jg0eQsZA"},
                        {"titre": "Entity-Relationship Diagrams", "video_url": "https://www.youtube.com/watch?v=-CuY5ADwn24"},
                    ],
                    "quiz": {
                        "titre": "DB Fundamentals Quiz",
                        "questions": [
                            {"texte": "What does SQL stand for?", "type_question": "choix",
                             "reponses": [("Structured Query Language", True), ("Simple Query Logic", False), ("Standard Query List", False), ("System Query Language", False)]},
                            {"texte": "Which key uniquely identifies each row?", "type_question": "choix",
                             "reponses": [("Primary Key", True), ("Foreign Key", False), ("Candidate Key", False), ("Index", False)]},
                        ],
                    },
                },
                {
                    "titre": "SQL Queries",
                    "description": "SELECT, JOIN, GROUP BY, subqueries, and window functions.",
                    "contenus": [
                        {"titre": "Basic SELECT Queries", "video_url": "https://www.youtube.com/watch?v=HXV3zeQKqGY"},
                        {"titre": "JOIN Operations", "video_url": "https://www.youtube.com/watch?v=9yeOJ0ZMUYw"},
                        {"titre": "Aggregations & GROUP BY", "video_url": "https://www.youtube.com/watch?v=7S_tz1z_5bA"},
                    ],
                    "quiz": {
                        "titre": "SQL Query Quiz",
                        "questions": [
                            {"texte": "Which JOIN returns rows with matches in both tables?", "type_question": "choix",
                             "reponses": [("INNER JOIN", True), ("LEFT JOIN", False), ("FULL JOIN", False), ("CROSS JOIN", False)]},
                            {"texte": "Which clause filters aggregated results?", "type_question": "choix",
                             "reponses": [("HAVING", True), ("WHERE", False), ("GROUP BY", False), ("FILTER", False)]},
                        ],
                    },
                },
                {
                    "titre": "Database Optimisation",
                    "description": "Indexing, normalisation, and query performance.",
                    "contenus": [
                        {"titre": "Indexing & Performance", "video_url": "https://www.youtube.com/watch?v=fsG1XaZEa78"},
                        {"titre": "Database Normalisation (1NF-3NF)", "video_url": "https://www.youtube.com/watch?v=GFQaEYEc8_8"},
                    ],
                    "quiz": None,
                },
            ],
        },
    },
    {
        "username": "prof_elhassani",
        "email": "hamza.elhassani@learnup.ma",
        "password": "Teacher@123",
        "first_name": "Hamza",
        "last_name": "El Hassani",
        "course": {
            "titre": "Cybersecurity Fundamentals",
            "description": "Understand threats, vulnerabilities, encryption, network security, ethical hacking basics, and security best practices for modern systems.",
            "modules": [
                {
                    "titre": "Security Concepts & Threats",
                    "description": "CIA triad, attack types, and risk management.",
                    "contenus": [
                        {"titre": "Introduction to Cybersecurity", "video_url": "https://www.youtube.com/watch?v=inWWhr5tnEA"},
                        {"titre": "Common Attack Types", "video_url": "https://www.youtube.com/watch?v=Dk-ZqQ-bfy4"},
                    ],
                    "quiz": {
                        "titre": "Security Concepts Quiz",
                        "questions": [
                            {"texte": "What does CIA stand for in security?", "type_question": "choix",
                             "reponses": [("Confidentiality, Integrity, Availability", True), ("Control, Integrity, Access", False), ("Cyber Intelligence Agency", False), ("Cipher, Identity, Access", False)]},
                            {"texte": "A phishing attack targets:", "type_question": "choix",
                             "reponses": [("Human behaviour / social engineering", True), ("Network packets", False), ("Hardware devices", False), ("Database schemas", False)]},
                        ],
                    },
                },
                {
                    "titre": "Cryptography & Encryption",
                    "description": "Symmetric, asymmetric encryption, hashing, and TLS.",
                    "contenus": [
                        {"titre": "Symmetric vs Asymmetric Encryption", "video_url": "https://www.youtube.com/watch?v=AQDCe585Lnc"},
                        {"titre": "Hashing Algorithms (SHA, MD5)", "video_url": "https://www.youtube.com/watch?v=b4b8ktEV4Bg"},
                        {"titre": "TLS/SSL and HTTPS", "video_url": "https://www.youtube.com/watch?v=j9QmMEWmcfo"},
                    ],
                    "quiz": {
                        "titre": "Cryptography Quiz",
                        "questions": [
                            {"texte": "Which algorithm uses a public/private key pair?", "type_question": "choix",
                             "reponses": [("RSA", True), ("AES", False), ("MD5", False), ("SHA-256", False)]},
                            {"texte": "Hashing is:", "type_question": "choix",
                             "reponses": [("One-way / irreversible", True), ("Reversible with a key", False), ("Only used for passwords", False), ("The same as encryption", False)]},
                        ],
                    },
                },
                {
                    "titre": "Network Security",
                    "description": "Firewalls, VPNs, IDS/IPS, and secure protocols.",
                    "contenus": [
                        {"titre": "Firewalls & Network Segmentation", "video_url": "https://www.youtube.com/watch?v=kDEX1HXybrU"},
                        {"titre": "VPNs and Tunneling Protocols", "video_url": "https://www.youtube.com/watch?v=R-JUOpCgTZc"},
                    ],
                    "quiz": None,
                },
            ],
        },
    },
]

STUDENTS = [
    {"username": "karim_mrani",    "email": "karim.mrani@etudiant.learnup.ma",    "password": "Student@123", "first_name": "Karim",    "last_name": "Mrani"},
    {"username": "salma_idrissi",  "email": "salma.idrissi@etudiant.learnup.ma",  "password": "Student@123", "first_name": "Salma",    "last_name": "Idrissi"},
    {"username": "yassine_hajji",  "email": "yassine.hajji@etudiant.learnup.ma",  "password": "Student@123", "first_name": "Yassine",  "last_name": "Hajji"},
    {"username": "zineb_bouchta",  "email": "zineb.bouchta@etudiant.learnup.ma",  "password": "Student@123", "first_name": "Zineb",    "last_name": "Bouchta"},
    {"username": "mehdi_amrani",   "email": "mehdi.amrani@etudiant.learnup.ma",   "password": "Student@123", "first_name": "Mehdi",    "last_name": "Amrani"},
    {"username": "hajar_sekkouri", "email": "hajar.sekkouri@etudiant.learnup.ma", "password": "Student@123", "first_name": "Hajar",    "last_name": "Sekkouri"},
    {"username": "adam_lahlou",    "email": "adam.lahlou@etudiant.learnup.ma",    "password": "Student@123", "first_name": "Adam",     "last_name": "Lahlou"},
    {"username": "lina_berrada",   "email": "lina.berrada@etudiant.learnup.ma",   "password": "Student@123", "first_name": "Lina",     "last_name": "Berrada"},
    {"username": "omar_naciri",    "email": "omar.naciri@etudiant.learnup.ma",    "password": "Student@123", "first_name": "Omar",     "last_name": "Naciri"},
    {"username": "rania_mansouri", "email": "rania.mansouri@etudiant.learnup.ma", "password": "Student@123", "first_name": "Rania",    "last_name": "Mansouri"},
]


class Command(BaseCommand):
    help = "Seed Moroccan demo accounts with CS courses (removes old English-named accounts first)"

    def handle(self, *args, **options):
        from courses.models import Cours, Module, Contenu
        from quiz.models import Quiz, Question, Reponse

        # ── 1. Remove old English-named accounts ──────────────────────────────
        removed = 0
        for uname in OLD_USERNAMES:
            deleted, _ = User.objects.filter(username=uname).delete()
            if deleted:
                removed += 1
                self.stdout.write(f"  [REMOVED] Old account: {uname}")
        if removed:
            self.stdout.write(self.style.WARNING(f"  Removed {removed} old accounts.\n"))

        # ── 2. Create teachers + courses ──────────────────────────────────────
        self.stdout.write(self.style.NOTICE("Creating Moroccan teacher accounts & CS courses..."))
        for data in TEACHERS:
            # Get or create teacher
            teacher, t_created = User.objects.get_or_create(
                username=data["username"],
                defaults={
                    "email": data["email"],
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                    "role": "teacher",
                },
            )
            if t_created:
                teacher.set_password(data["password"])
                teacher.save()
                self.stdout.write(self.style.SUCCESS(f"  [CREATED] Teacher: {teacher.username}"))
            else:
                self.stdout.write(f"  [EXISTS]  Teacher: {teacher.username}")

            # Create course (skip if teacher already has one with this titre)
            course_data = data["course"]
            cours, c_created = Cours.objects.get_or_create(
                enseignant=teacher,
                titre=course_data["titre"],
                defaults={"description": course_data["description"]},
            )
            if c_created:
                self.stdout.write(self.style.SUCCESS(f"    [COURSE] {cours.titre}"))
            else:
                self.stdout.write(f"    [COURSE EXISTS] {cours.titre}")
                continue  # skip re-creating modules to avoid duplicates

            # Create modules, contenus, quizzes
            for m_order, m_data in enumerate(course_data["modules"]):
                module = Module.objects.create(
                    titre=m_data["titre"],
                    description=m_data.get("description", ""),
                    cours=cours,
                    order=m_order,
                )

                for c_order, ct_data in enumerate(m_data["contenus"]):
                    Contenu.objects.create(
                        titre=ct_data["titre"],
                        video_url=ct_data.get("video_url"),
                        module=module,
                        order=c_order,
                    )

                if m_data.get("quiz"):
                    q_data = m_data["quiz"]
                    quiz = Quiz.objects.create(
                        titre=q_data["titre"],
                        module=module,
                        order=0,
                    )
                    for q_order, q in enumerate(q_data["questions"]):
                        question = Question.objects.create(
                            quiz=quiz,
                            texte=q["texte"],
                            type_question=q["type_question"],
                        )
                        for r_text, r_correct in q.get("reponses", []):
                            Reponse.objects.create(
                                question=question,
                                texte=r_text,
                                est_correcte=r_correct,
                            )

        # ── 3. Create students ────────────────────────────────────────────────
        self.stdout.write(self.style.NOTICE("\nCreating Moroccan student accounts..."))
        for data in STUDENTS:
            student, s_created = User.objects.get_or_create(
                username=data["username"],
                defaults={
                    "email": data["email"],
                    "first_name": data["first_name"],
                    "last_name": data["last_name"],
                    "role": "student",
                },
            )
            if s_created:
                student.set_password(data["password"])
                student.save()
                self.stdout.write(self.style.SUCCESS(f"  [CREATED] Student: {student.username}"))
            else:
                self.stdout.write(f"  [EXISTS]  Student: {student.username}")

        # ── 4. Summary ────────────────────────────────────────────────────────
        self.stdout.write(self.style.SUCCESS("\n✅ Seeding complete!\n"))
        self.stdout.write("─── TEACHER CREDENTIALS (password: Teacher@123) ───")
        for t in TEACHERS:
            self.stdout.write(f"  {t['username']:22s}  {t['email']}")
        self.stdout.write("\n─── STUDENT CREDENTIALS (password: Student@123) ───")
        for s in STUDENTS:
            self.stdout.write(f"  {s['username']:22s}  {s['email']}")
