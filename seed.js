const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
require('dotenv').config();

const courses = [
  {
    title: 'Complete React Developer in 2026',
    description: 'Learn React from scratch with hooks, context, Redux Toolkit, Next.js, and more. Build real-world projects and become job-ready.',
    instructor: 'Sarah Mitchell',
    category: 'Web Development',
    level: 'Intermediate',
    price: 89.99,
    duration: '42 hours',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks', 'Redux'],
    rating: 4.8,
    lessons: [
      { title: 'Introduction to React', content: 'Overview of React ecosystem', duration: '15min', order: 1 },
      { title: 'JSX Deep Dive', content: 'Understanding JSX syntax and rules', duration: '25min', order: 2 },
      { title: 'State & Props', content: 'Managing component state and props', duration: '35min', order: 3 },
      { title: 'React Hooks', content: 'useState, useEffect, useContext, custom hooks', duration: '60min', order: 4 },
      { title: 'Context API & Redux', content: 'Global state management solutions', duration: '75min', order: 5 },
    ],
  },
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Master Python for data analysis, visualization, and machine learning. Work with NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow.',
    instructor: 'Dr. James Rivera',
    category: 'Data Science',
    level: 'Intermediate',
    price: 94.99,
    duration: '55 hours',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    tags: ['Python', 'ML', 'Data Analysis', 'NumPy', 'TensorFlow'],
    rating: 4.9,
    lessons: [
      { title: 'Python Fundamentals', content: 'Review of Python basics', duration: '30min', order: 1 },
      { title: 'NumPy & Pandas', content: 'Data manipulation with NumPy and Pandas', duration: '90min', order: 2 },
      { title: 'Data Visualization', content: 'Matplotlib and Seaborn charts', duration: '60min', order: 3 },
      { title: 'Machine Learning Basics', content: 'Supervised and unsupervised learning', duration: '120min', order: 4 },
    ],
  },
  {
    title: 'UI/UX Design Masterclass: Figma & Design Systems',
    description: 'Learn professional UI/UX design using Figma. Create design systems, prototypes, user flows, and deliver stunning digital experiences.',
    instructor: 'Leila Chang',
    category: 'UI/UX Design',
    level: 'Beginner',
    price: 69.99,
    duration: '28 hours',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    tags: ['UI', 'UX', 'Figma', 'Design', 'Prototyping'],
    rating: 4.7,
    lessons: [
      { title: 'Design Principles', content: 'Color theory, typography, layout', duration: '45min', order: 1 },
      { title: 'Figma Basics', content: 'Navigating and using Figma tools', duration: '60min', order: 2 },
      { title: 'Design Systems', content: 'Creating reusable component libraries', duration: '90min', order: 3 },
      { title: 'Prototyping', content: 'Interactive prototype creation', duration: '75min', order: 4 },
    ],
  },
  {
    title: 'Node.js & Express: Build REST APIs',
    description: 'Build scalable REST APIs with Node.js and Express. Learn authentication, MongoDB, file uploads, real-time features with Socket.io.',
    instructor: 'Marcus Webb',
    category: 'Web Development',
    level: 'Intermediate',
    price: 84.99,
    duration: '38 hours',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    tags: ['Node.js', 'Express', 'API', 'MongoDB', 'JWT'],
    rating: 4.8,
    lessons: [
      { title: 'Node.js Fundamentals', content: 'Event loop, modules, npm', duration: '45min', order: 1 },
      { title: 'Express Framework', content: 'Routing and middleware', duration: '60min', order: 2 },
      { title: 'MongoDB Integration', content: 'Mongoose ODM and schemas', duration: '90min', order: 3 },
      { title: 'Authentication', content: 'JWT, bcrypt, session management', duration: '75min', order: 4 },
    ],
  },
  {
    title: 'AWS Cloud Practitioner & Solutions Architect',
    description: 'Prepare for AWS certifications. Learn EC2, S3, RDS, Lambda, CloudFormation, and build production-grade cloud architectures.',
    instructor: 'Priya Nair',
    category: 'Cloud Computing',
    level: 'Beginner',
    price: 79.99,
    duration: '32 hours',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    tags: ['AWS', 'Cloud', 'EC2', 'S3', 'Lambda', 'DevOps'],
    rating: 4.6,
    lessons: [
      { title: 'Cloud Fundamentals', content: 'What is cloud computing', duration: '30min', order: 1 },
      { title: 'AWS Core Services', content: 'EC2, S3, VPC, IAM', duration: '90min', order: 2 },
      { title: 'Serverless & Lambda', content: 'Function-as-a-service architecture', duration: '75min', order: 3 },
      { title: 'Architecture Patterns', content: 'Well-architected framework', duration: '60min', order: 4 },
    ],
  },
  {
    title: 'Ethical Hacking & Cybersecurity Bootcamp',
    description: 'Master penetration testing, network security, and ethical hacking. Learn Kali Linux, Metasploit, Wireshark, and security best practices.',
    instructor: 'Tobias Kraus',
    category: 'Cybersecurity',
    level: 'Advanced',
    price: 99.99,
    duration: '48 hours',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop',
    tags: ['Security', 'Hacking', 'Kali', 'Pentesting', 'Network'],
    rating: 4.9,
    lessons: [
      { title: 'Security Fundamentals', content: 'CIA triad, attack vectors', duration: '45min', order: 1 },
      { title: 'Network Scanning', content: 'Nmap, port scanning, enumeration', duration: '90min', order: 2 },
      { title: 'Exploitation', content: 'Metasploit framework basics', duration: '120min', order: 3 },
      { title: 'Web App Security', content: 'OWASP Top 10 vulnerabilities', duration: '90min', order: 4 },
    ],
  },
  {
    title: 'Flutter & Dart: Complete Mobile Development',
    description: 'Build beautiful cross-platform iOS and Android apps with Flutter and Dart. State management, Firebase integration, and app deployment.',
    instructor: 'Amara Osei',
    category: 'Mobile Development',
    level: 'Beginner',
    price: 74.99,
    duration: '36 hours',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    tags: ['Flutter', 'Dart', 'iOS', 'Android', 'Mobile'],
    rating: 4.7,
    lessons: [
      { title: 'Dart Language', content: 'Dart syntax and OOP', duration: '60min', order: 1 },
      { title: 'Flutter Widgets', content: 'Stateless and stateful widgets', duration: '90min', order: 2 },
      { title: 'State Management', content: 'Provider, Riverpod, BLoC', duration: '120min', order: 3 },
      { title: 'Firebase Integration', content: 'Auth, Firestore, storage', duration: '90min', order: 4 },
    ],
  },
  {
    title: 'Blockchain Development with Solidity & Web3',
    description: 'Learn smart contract development with Solidity on Ethereum. Build DeFi apps, NFT platforms, and deploy on multiple blockchains.',
    instructor: 'Viktor Petrov',
    category: 'Blockchain',
    level: 'Advanced',
    price: 109.99,
    duration: '44 hours',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop',
    tags: ['Blockchain', 'Solidity', 'Ethereum', 'NFT', 'DeFi', 'Web3'],
    rating: 4.8,
    lessons: [
      { title: 'Blockchain Basics', content: 'How blockchains work', duration: '45min', order: 1 },
      { title: 'Solidity Programming', content: 'Smart contract language', duration: '120min', order: 2 },
      { title: 'Smart Contracts', content: 'Writing and testing contracts', duration: '150min', order: 3 },
      { title: 'Web3.js & ethers.js', content: 'Frontend blockchain interaction', duration: '90min', order: 4 },
    ],
  },
  {
    title: 'DevOps with Docker, Kubernetes & CI/CD',
    description: 'Master modern DevOps practices. Containerize apps with Docker, orchestrate with Kubernetes, and automate with Jenkins and GitHub Actions.',
    instructor: 'Nadia Volkov',
    category: 'DevOps',
    level: 'Intermediate',
    price: 89.99,
    duration: '40 hours',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=225&fit=crop',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'DevOps', 'Jenkins'],
    rating: 4.7,
    lessons: [
      { title: 'Containerization', content: 'Docker basics and Dockerfiles', duration: '75min', order: 1 },
      { title: 'Kubernetes', content: 'Pods, deployments, services', duration: '120min', order: 2 },
      { title: 'CI/CD Pipelines', content: 'GitHub Actions and Jenkins', duration: '90min', order: 3 },
      { title: 'Monitoring & Logging', content: 'Prometheus, Grafana, ELK', duration: '75min', order: 4 },
    ],
  },
];

const seedData = async () => {
  try {
    console.log('🌱 Starting seed process...');

    await Student.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await Student.create({
      name: 'Admin User',
      email: 'admin@learnhub.com',
      password: adminPassword,
      role: 'admin',
      bio: 'Platform administrator',
    });

    // Create demo students
    const studentPassword = await bcrypt.hash('student123', 10);
    const studentData = [
      { name: 'Alex Johnson', email: 'alex@example.com', bio: 'Aspiring full-stack developer from New York.' },
      { name: 'Maria Garcia', email: 'maria@example.com', bio: 'Data scientist passionate about ML and AI.' },
      { name: 'Chen Wei', email: 'chen@example.com', bio: 'Mobile app developer and UX enthusiast.' },
      { name: 'Sophie Brown', email: 'sophie@example.com', bio: 'Cybersecurity professional and ethical hacker.' },
      { name: 'James Wilson', email: 'james@example.com', bio: 'Cloud architect building scalable systems.' },
    ];

    const createdStudents = await Student.insertMany(
      studentData.map((s) => ({ ...s, password: studentPassword }))
    );
    console.log(`✅ Created ${createdStudents.length} students + 1 admin`);

    // Enroll students in multiple courses each
    const enrollmentPairs = [
      { studentIdx: 0, courseIdx: [0, 3, 8] }, // Alex: React, Node.js, DevOps
      { studentIdx: 1, courseIdx: [1, 4, 6] }, // Maria: Python/ML, AWS, Flutter
      { studentIdx: 2, courseIdx: [2, 6, 0] }, // Chen: UI/UX, Flutter, React
      { studentIdx: 3, courseIdx: [5, 3, 7] }, // Sophie: Cybersecurity, Node.js, Blockchain
      { studentIdx: 4, courseIdx: [4, 8, 1] }, // James: AWS, DevOps, Python
    ];

    const enrollmentDocs = [];
    for (const pair of enrollmentPairs) {
      const student = createdStudents[pair.studentIdx];
      for (const courseIdx of pair.courseIdx) {
        const course = createdCourses[courseIdx];
        enrollmentDocs.push({
          student: student._id,
          course: course._id,
          progress: Math.floor(Math.random() * 80) + 10,
          status: 'active',
        });
        // Update student's enrolledCourses
        await Student.findByIdAndUpdate(student._id, { $addToSet: { enrolledCourses: course._id } });
        // Update course's enrolledStudents
        await Course.findByIdAndUpdate(course._id, { $addToSet: { enrolledStudents: student._id } });
      }
    }

    await Enrollment.insertMany(enrollmentDocs);
    console.log(`✅ Created ${enrollmentDocs.length} enrollment records`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin: admin@learnhub.com | 🔑 Password: admin123');
    console.log('📧 Student: alex@example.com | 🔑 Password: student123');
    return true;
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    return false;
  }
};

// Export for server.js to use with in-memory DB
module.exports = seedData;
